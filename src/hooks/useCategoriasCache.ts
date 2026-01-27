/**
 * 🎯 useCategoriasCache Hook
 * Hook personalizado para cache optimizado de categorías
 * Previene race conditions y re-renders innecesarios
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import categoriasCache from '../utils/categoriasCache';
import { categoriasApi, type Categoria, type CategoriesListResponse } from '../services/categoriasApi';

interface UseCategoriasOptions {
  enabled?: boolean;
  activas?: boolean;
  conServicios?: boolean;
  onSuccess?: (data: Categoria[], fromCache?: boolean) => void;
  onError?: (error: Error) => void;
}

interface UseCategoriasReturn {
  data: Categoria[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
  isFromCache: boolean;
}

/**
 * Hook para obtener lista de categorías con cache
 */
export function useCategoriasList(options: UseCategoriasOptions = {}): UseCategoriasReturn {
  const { 
    enabled = true, 
    activas = true, 
    conServicios,
    onSuccess, 
    onError 
  } = options;

  const [data, setData] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Referencias para evitar race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const isLoadingRef = useRef(false);

  // Generar identificador único para el cache basado en los parámetros
  const cacheIdentifier = useCallback(() => {
    return JSON.stringify({ activas, conServicios });
  }, [activas, conServicios]);

  // Función para cargar datos
  const loadData = useCallback(async (force = false) => {
    if (!enabled) return;
    
    // Si ya hay una carga pendiente y no es forzada, saltarse
    if (isLoadingRef.current && !force) {
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

    // Incrementar ID de fetch
    const currentFetchId = ++fetchIdRef.current;

    try {
      setLoading(true);
      isLoadingRef.current = true;
      setError(null);

      // 1. Intentar obtener del cache si no es forzado
      if (!force) {
        const cacheType = activas ? 'CATEGORIAS_ACTIVAS' : 'CATEGORIAS_LIST';
        const cachedData = categoriasCache.get<CategoriesListResponse>(
          cacheType, 
          cacheIdentifier()
        );
        
        if (cachedData && cachedData.data) {
          if (isMountedRef.current) {
            setData(cachedData.data);
            setIsFromCache(true);
            setLoading(false);
            isLoadingRef.current = false;
            onSuccess?.(cachedData.data, true);
          }
          return;
        }
      }

      // 2. Crear nuevo AbortController
      abortControllerRef.current = new AbortController();

      // 3. Hacer fetch si no hay cache válido
      const response = await categoriasApi.getAll({ activas, conServicios });

      // 4. Verificar si este request sigue siendo el más reciente
      if (currentFetchId !== fetchIdRef.current) {
        return;
      }

      // 5. Verificar si el componente sigue montado
      if (!isMountedRef.current) {
        return;
      }

      // 6. Guardar en cache
      const cacheType = activas ? 'CATEGORIAS_ACTIVAS' : 'CATEGORIAS_LIST';
      categoriasCache.set(cacheType, cacheIdentifier(), response);

      // 7. Actualizar estado
      setData(response.data);
      setIsFromCache(false);
      onSuccess?.(response.data, false);

    } catch (err: any) {
      // Ignorar errores de requests cancelados
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        return;
      }

      // Verificar si este request sigue siendo el más reciente
      if (currentFetchId !== fetchIdRef.current) {
        return;
      }

      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (isMountedRef.current && currentFetchId === fetchIdRef.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
    }
  }, [enabled, activas, conServicios, cacheIdentifier, onSuccess, onError]);

  // Función para forzar recarga
  const refetch = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    categoriasCache.invalidateAll();
  }, []);

  // Efecto inicial para cargar datos
  useEffect(() => {
    isMountedRef.current = true;
    loadData();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          // Silenciar
        }
      }
    };
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    isFromCache
  };
}

/**
 * Hook para obtener una categoría por ID con cache
 */
export function useCategoriaById(
  id: string | null,
  options: { enabled?: boolean; onSuccess?: (data: Categoria) => void; onError?: (error: Error) => void } = {}
) {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  const loadData = useCallback(async (force = false) => {
    if (!enabled || !id) return;

    const currentFetchId = ++fetchIdRef.current;

    try {
      setLoading(true);
      setError(null);

      // 1. Intentar obtener del cache
      if (!force) {
        const cachedData = categoriasCache.get<Categoria>('CATEGORIA_DETAIL', id);
        if (cachedData) {
          if (isMountedRef.current) {
            setData(cachedData);
            setIsFromCache(true);
            setLoading(false);
            onSuccess?.(cachedData);
          }
          return;
        }
      }

      // 2. Hacer fetch
      const response = await categoriasApi.getById(id);

      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }

      // 3. Guardar en cache
      categoriasCache.set('CATEGORIA_DETAIL', id, response.data);

      // 4. Actualizar estado
      setData(response.data);
      setIsFromCache(false);
      onSuccess?.(response.data);

    } catch (err: any) {
      if (currentFetchId !== fetchIdRef.current) return;

      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (isMountedRef.current && currentFetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, id, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  useEffect(() => {
    isMountedRef.current = true;
    loadData();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch,
    isFromCache
  };
}

// Re-exportar tipo Categoria para facilitar uso
export type { Categoria } from '../services/categoriasApi';

export default useCategoriasList;
