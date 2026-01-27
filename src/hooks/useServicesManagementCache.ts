/**
 * ⚙️ useServicesManagementCache Hook
 * Gestión de cache para Services Management
 * - Cache de lista completa: 2 horas
 * - Cache por categoría: 2 horas
 * - Filter-aware keys
 */

import { useState, useCallback } from 'react';
import { services } from '../utils/contentManagementCache';

export interface Servicio {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  price?: number;
  priceRange?: string;
  duration?: string;
  isActive: boolean;
  featured?: boolean;
  image?: string;
  icon?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  portfolio?: any[];
  stats?: {
    views: number;
    leads: number;
  };
}

export interface UseServicesManagementCacheReturn {
  // Data
  services: Servicio[];
  
  // State
  loading: boolean;
  error: string | null;
  
  // Operations
  loadServices: (filters?: Record<string, any>) => Promise<void>;
  refreshServices: (filters?: Record<string, any>) => Promise<void>;
  invalidateListCache: () => void;
  invalidateCategoryCache: (category?: string) => void;
  invalidateAllCache: () => void;
  generateFilterKey: (filters: Record<string, any>) => string;
}

/**
 * Hook para gestionar cache de Services Management con filtros
 */
export const useServicesManagementCache = (): UseServicesManagementCacheReturn => {
  const [servicesList, setServicesList] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // GENERADOR DE CLAVES DE CACHE
  // ============================================

  /**
   * Genera una clave única para el cache basada en filtros
   */
  const generateFilterKey = useCallback((filters: Record<string, any> = {}): string => {
    const parts: string[] = [];
    
    // Ordenar filtros para consistencia
    const sortedKeys = Object.keys(filters).sort();
    
    sortedKeys.forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          parts.push(`${key}_${value.join('_')}`);
        } else {
          parts.push(`${key}_${String(value)}`);
        }
      }
    });

    return parts.length > 0 ? parts.join('_') : 'all';
  }, []);

  // ============================================
  // OPERACIONES DE CACHE
  // ============================================

  /**
   * Carga servicios desde cache o función fetch personalizada
   */
  const loadServices = useCallback(
    async (
      filters: Record<string, any> = {},
      fetchFn?: (filters: Record<string, any>) => Promise<Servicio[]>
    ) => {
      try {
        setLoading(true);
        setError(null);

        const filterKey = generateFilterKey(filters);
        console.log(`📦 [Services Cache] Buscando en cache: ${filterKey}`);

        // 1. Intentar obtener del cache
        const cached = services.getList<Servicio[]>(filterKey);

        if (cached) {
          console.log(`✅ [Services Cache] Datos desde cache: ${filterKey}`);
          setServicesList(cached);
          setLoading(false);
          return;
        }

        // 2. Si no hay cache y hay función fetch, obtener de API
        if (fetchFn) {
          console.log(`🌐 [Services Cache] Obteniendo de API: ${filterKey}`);
          const data = await fetchFn(filters);

          // 3. Guardar en cache (2 horas)
          services.setList<Servicio[]>(data, filterKey);
          setServicesList(data);
        }

        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar servicios';
        console.error(`❌ [Services Cache] Error:`, err);
        setError(errorMessage);
        setLoading(false);
      }
    },
    [generateFilterKey]
  );

  /**
   * Recarga servicios desde la API y actualiza el cache
   */
  const refreshServices = useCallback(
    async (
      filters: Record<string, any> = {},
      fetchFn?: (filters: Record<string, any>) => Promise<Servicio[]>
    ) => {
      try {
        console.log(`🔄 [Services Cache] Refrescando cache`);

        const filterKey = generateFilterKey(filters);

        // Invalidar cache existente
        services.invalidateList();

        // Recargar desde API
        if (fetchFn) {
          const data = await fetchFn(filters);
          services.setList<Servicio[]>(data, filterKey);
          setServicesList(data);
        }

        console.log(`✅ [Services Cache] Cache refrescado: ${filterKey}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al refrescar';
        console.error(`❌ [Services Cache] Error al refrescar:`, err);
        setError(errorMessage);
      }
    },
    [generateFilterKey]
  );

  /**
   * Invalida el cache de lista de servicios
   */
  const invalidateListCache = useCallback(() => {
    console.log(`🗑️ [Services Cache] Invalidando lista de servicios`);
    services.invalidateList();
  }, []);

  /**
   * Invalida el cache de servicios por categoría
   */
  const invalidateCategoryCache = useCallback((category?: string) => {
    console.log(
      `🗑️ [Services Cache] Invalidando categoría${category ? `: ${category}` : ' (todas)'}`
    );
    services.invalidateByCategory(category);
  }, []);

  /**
   * Invalida todo el cache de servicios
   */
  const invalidateAllCache = useCallback(() => {
    console.log(`🗑️ [Services Cache] Invalidando TODO el cache de servicios`);
    services.invalidateAll();
  }, []);

  return {
    services: servicesList,
    loading,
    error,
    loadServices,
    refreshServices,
    invalidateListCache,
    invalidateCategoryCache,
    invalidateAllCache,
    generateFilterKey,
  };
};

/**
 * Hook especializado para cache de servicios por categoría
 */
export const useServicesCategoryCache = (category: string) => {
  const [servicesInCategory, setServicesInCategory] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadByCategory = useCallback(
    async (fetchFn?: () => Promise<Servicio[]>) => {
      try {
        setLoading(true);
        setError(null);

        console.log(`📦 [Services Category Cache] Buscando categoría: ${category}`);

        // Intentar cache primero
        const cached = services.getByCategory<Servicio[]>(category);
        if (cached) {
          console.log(`✅ [Services Category Cache] Datos desde cache: ${category}`);
          setServicesInCategory(cached);
          setLoading(false);
          return;
        }

        // Obtener de API
        if (fetchFn) {
          console.log(`🌐 [Services Category Cache] Obteniendo de API: ${category}`);
          const data = await fetchFn();
          services.setByCategory<Servicio[]>(data, category);
          setServicesInCategory(data);
        }

        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar servicios';
        console.error(`❌ [Services Category Cache] Error:`, err);
        setError(errorMessage);
        setLoading(false);
      }
    },
    [category]
  );

  const invalidateCategory = useCallback(() => {
    console.log(`🗑️ [Services Category Cache] Invalidando: ${category}`);
    services.invalidateByCategory(category);
    setServicesInCategory([]);
  }, [category]);

  return { servicesInCategory, loading, error, loadByCategory, invalidateCategory };
};
