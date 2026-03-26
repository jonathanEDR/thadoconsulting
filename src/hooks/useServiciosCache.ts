/**
 * 🎯 useServiciosCache Hook
 * Hook personalizado para cache optimizado de servicios públicos
 * Previene race conditions y re-renders innecesarios
 * ✅ Compatible con pre-renderizado SEO
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import serviciosCache, { SERVICIOS_CACHE_TTL } from '../utils/serviciosCache';
import type { Servicio, ServicioFilters } from '../types/servicios';

/**
 * 🔍 Detecta si estamos en modo pre-renderizado (react-snap, Vercel build, etc.)
 * Esto evita mostrar errores durante el build cuando la API no responde
 */
const isPrerendering = (): boolean => {
  if (typeof window === 'undefined') return true;
  if (typeof navigator === 'undefined') return true;
  
  // Detectar react-snap
  if (navigator.userAgent?.includes('ReactSnap')) return true;
  
  // Detectar Puppeteer/Headless Chrome (usado por react-snap y Vercel)
  if (navigator.userAgent?.includes('HeadlessChrome')) return true;
  
  // Detectar crawlers de build
  if (navigator.userAgent?.includes('Prerender')) return true;
  if (navigator.userAgent?.includes('Vercel-Build')) return true;
  
  // Variable de entorno para modo de build
  if ((window as any).__PRERENDER_INJECTED !== undefined) return true;
  
  return false;
};

interface UseServiciosCacheOptions {
  enabled?: boolean;
  initialData?: any; // Datos pre-cargados (ej: desde prerender-services.js)
  onSuccess?: (data: any, fromCache?: boolean) => void;
  onError?: (error: Error) => void;
}

interface UseServiciosCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isPrerendering: boolean; // ✅ Nuevo: indica si estamos en modo pre-renderizado
  refetch: () => Promise<void>;
  clearCache: () => void;
  isFromCache: boolean;
}

/**
 * Hook para cache de servicios con control de race conditions
 * ✅ Maneja correctamente el pre-renderizado SEO
 */
export function useServiciosCache<T>(
  cacheKey: keyof typeof SERVICIOS_CACHE_TTL,
  identifier: string | Record<string, any>,
  fetchFn: () => Promise<T>,
  options: UseServiciosCacheOptions = {}
): UseServiciosCacheReturn<T> {
  const { enabled = true, initialData, onSuccess, onError } = options;
  const prerenderMode = isPrerendering();

  // ✅ Inicializar con datos pre-cargados o cache existente para evitar flash de loading
  const [data, setData] = useState<T | null>(() => {
    if (initialData) return initialData as T;
    if (!enabled || prerenderMode) return null;
    return serviciosCache.get<T>(cacheKey, identifier) ?? null;
  });
  const [loading, setLoading] = useState(() => {
    if (initialData) return false;
    if (!enabled || prerenderMode) return false;
    return !serviciosCache.get<T>(cacheKey, identifier);
  });
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(!!initialData);

  // Referencia para evitar race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const isLoadingRef = useRef(false); // ⚡ Prevenir múltiples requests simultáneos
  const retryCountRef = useRef(0); // ⚡ Contador de reintentos
  const maxRetriesRef = useRef(2); // ⚡ Máximo de 2 reintentos
  const lastErrorTimeRef = useRef(0); // ⚡ Timestamp del último error

  // Función para cargar datos (con cache o fetch)
  const loadData = useCallback(async (force = false) => {
    if (!enabled) return;
    
    // 🔍 En modo pre-renderizado, solo marcar como no-loading sin fetch
    // El contenido estático ya fue generado por prerender-services.js
    if (prerenderMode) {
      console.log('[useServiciosCache] Modo pre-renderizado detectado, omitiendo fetch API');
      setLoading(false);
      return;
    }
    
    // ⚡ Si ya hay una carga pendiente y no es forzada, saltarse
    if (isLoadingRef.current && !force) {
      return;
    }

    // ⚡ NUEVO: Evitar reintentos infinitos
    const now = Date.now();
    if (retryCountRef.current > maxRetriesRef.current && (now - lastErrorTimeRef.current) < 5000) {
      // Máximo de reintentos alcanzado
      return;
    }

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) {
        // Silenciar errores
      }
    }

    // Incrementar ID de fetch para detectar requests obsoletos
    const currentFetchId = ++fetchIdRef.current;

    try {
      setLoading(true);
      isLoadingRef.current = true;
      setError(null);

      // 1. Intentar obtener del cache si no es forzado
      if (!force) {
        const cachedData = serviciosCache.get<T>(cacheKey, identifier);
        if (cachedData) {
          if (isMountedRef.current) {
            setData(cachedData);
            setIsFromCache(true);
            setLoading(false);
            isLoadingRef.current = false;
            retryCountRef.current = 0; // ⚡ Resetear contador
            onSuccess?.(cachedData, true); // Pasar true para indicar que es del cache
          }
          return;
        }
      }

      // 2. Crear nuevo AbortController para este request
      abortControllerRef.current = new AbortController();

      // 3. Hacer fetch si no hay cache válido
      const fetchedData = await fetchFn();

      // 4. Verificar si este request sigue siendo el más reciente
      if (currentFetchId !== fetchIdRef.current) {
        // Request obsoleto, ignorar resultado
        return;
      }

      // 5. Verificar si el componente sigue montado
      if (!isMountedRef.current) {
        return;
      }

      // 6. Guardar en cache
      serviciosCache.set(cacheKey, identifier, fetchedData);

      // 7. Actualizar estado
      setData(fetchedData);
      setIsFromCache(false);
      retryCountRef.current = 0; // ⚡ Resetear contador en éxito
      onSuccess?.(fetchedData, false); // Pasar false para indicar que es de API

    } catch (err: any) {
      // Ignorar errores de requests cancelados
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        return;
      }

      // Verificar si este request sigue siendo el más reciente
      if (currentFetchId !== fetchIdRef.current) {
        return;
      }

      // ⚡ NUEVO: Incrementar contador de reintentos en error
      retryCountRef.current++;
      lastErrorTimeRef.current = Date.now();

      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (isMountedRef.current && currentFetchId === fetchIdRef.current) {
        setLoading(false);
        isLoadingRef.current = false; // ⚡ Resetear flag de carga
      }
    }
  }, [cacheKey, identifier, fetchFn, enabled, onSuccess, onError]);

  // Función para refetch (fuerza nueva carga)
  const refetch = useCallback(async () => {
    // Limpiar cache específico
    serviciosCache.remove(cacheKey, identifier);
    await loadData(true);
  }, [cacheKey, identifier, loadData]);

  // Función para limpiar cache manualmente
  const clearCache = useCallback(() => {
    serviciosCache.remove(cacheKey, identifier);
    setData(null);
    setIsFromCache(false);
  }, [cacheKey, identifier]);

  // Efecto para cargar datos iniciales
  // Si ya tenemos initialData, guardarlo en cache y no hacer fetch
  useEffect(() => {
    if (initialData) {
      serviciosCache.set(cacheKey, identifier, initialData);
      return;
    }
    loadData();
  }, [loadData]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      // ⚡ Cancelar cualquier request en vuelo
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          // Silenciar errores de abort
        }
        abortControllerRef.current = null;
      }
      
      // ⚡ Limpiar referencias
      fetchIdRef.current = 0;
    };
  }, []);

  return {
    data,
    loading,
    error,
    isPrerendering: prerenderMode, // ✅ Indica si estamos en modo pre-renderizado
    refetch,
    clearCache,
    isFromCache
  };
}

/**
 * Hook especializado para lista de servicios
 */
export function useServiciosList(
  filters: ServicioFilters = {},
  options: UseServiciosCacheOptions = {}
) {
  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    
    try {
      const response = await serviciosApi.getAll(filters);
      
      // 🔍 Guardar timestamp de la última actualización para detectar cambios
      const lastUpdateKey = 'lastServiciosUpdate';
      const currentTime = Date.now();
      
      if (response.data && Array.isArray(response.data)) {
        // Verificar si hay servicios recién creados (últimos 2 minutos)
        const recentServices = response.data.filter((servicio: any) => {
          const createdAt = new Date(servicio.createdAt).getTime();
          const updatedAt = new Date(servicio.updatedAt).getTime();
          const recentThreshold = currentTime - (2 * 60 * 1000); // 2 minutos
          
          return createdAt > recentThreshold || updatedAt > recentThreshold;
        });
        
        if (recentServices.length > 0) {
          const { invalidateServiciosCache } = await import('../utils/serviciosCache');
          invalidateServiciosCache('SERVICIOS_');
        }
        
        // Actualizar timestamp
        localStorage.setItem(lastUpdateKey, currentTime.toString());
      }
      
      // Retornar respuesta completa para acceder a datos de paginación
      return response;
    } catch (error) {
      throw error;
    }
  }, [filters]);

  return useServiciosCache<any>(
    'SERVICIOS_LIST',
    filters,
    fetchFn,
    options
  );
}

/**
 * Hook especializado para detalle de servicio
 * 🔥 OPTIMIZADO: Usa endpoint directo por slug/ID en lugar de cargar todos
 * ✅ SEO FIX: Lee datos pre-cargados de prerender-services.js para evitar Soft 404
 */
export function useServicioDetail(
  slug: string,
  options: UseServiciosCacheOptions = {}
) {
  // ✅ Leer datos pre-cargados inyectados por prerender-services.js
  // Esto evita que React muestre un loading spinner en el primer render,
  // lo cual Google WRS interpretaría como Soft 404.
  const [preloadedData] = useState<Servicio | null>(() => {
    if (typeof document === 'undefined') return null;
    try {
      const el = document.getElementById('__PRELOADED_SERVICE__');
      if (el?.textContent) {
        const data = JSON.parse(el.textContent);
        if (data?.slug === slug) {
          el.remove(); // Limpiar del DOM
          return data as Servicio;
        }
      }
    } catch (e) {
      // Silenciar errores de parsing
    }
    return null;
  });

  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    
    try {
      // 🔥 SOLUCIÓN ÓPTIMA: Usar endpoint directo GET /api/servicios/:slug
      // El backend acepta tanto ID como slug en el mismo endpoint
      const response = await serviciosApi.getById(slug, true, false);
      
      if (!response.success || !response.data) {
        throw new Error('Servicio no encontrado');
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Servicio no encontrado');
    }
  }, [slug]);

  return useServiciosCache<Servicio>(
    'SERVICIO_DETAIL',
    slug,
    fetchFn,
    {
      ...options,
      ...(preloadedData ? { initialData: preloadedData } : {})
    }
  );
}

/**
 * Hook para servicios destacados
 */
export function useServiciosDestacados(options: UseServiciosCacheOptions = {}) {
  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    const response = await serviciosApi.getAll({ destacado: true, visibleEnWeb: true, activo: true });
    return response.data || [];
  }, []);

  return useServiciosCache<Servicio[]>(
    'SERVICIOS_FEATURED',
    'destacados',
    fetchFn,
    options
  );
}

/**
 * Hook para servicios por categoría
 */
export function useServiciosByCategoria(
  categoria: string,
  options: UseServiciosCacheOptions = {}
) {
  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    const response = await serviciosApi.getAll({ 
      categoria,
      visibleEnWeb: true, 
      activo: true 
    });
    return response.data || [];
  }, [categoria]);

  return useServiciosCache<Servicio[]>(
    'SERVICIOS_BY_CATEGORY',
    { categoria },
    fetchFn,
    options
  );
}

export default useServiciosCache;
