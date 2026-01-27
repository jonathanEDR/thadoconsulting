/**
 * 🎯 useDashboardCache Hook
 * Hook personalizado para cache optimizado en módulos del dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { dashboardCache, DASHBOARD_CACHE_DURATIONS } from '../utils/dashboardCache';

interface UseDashboardCacheOptions<T> {
  key: string;
  duration?: number;
  fetchFn: () => Promise<T>;
  dependencies?: any[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface UseDashboardCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

/**
 * Hook para cache de dashboard con localStorage + memoria
 */
export function useDashboardCache<T>({
  key,
  duration = DASHBOARD_CACHE_DURATIONS.PROFILE,
  fetchFn,
  dependencies = [],
  onSuccess,
  onError,
  enabled = true
}: UseDashboardCacheOptions<T>): UseDashboardCacheReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar datos (con cache o fetch)
  const loadData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Intentar obtener del cache
      const cachedData = dashboardCache.get<T>(key, duration);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        onSuccess?.(cachedData);
        return;
      }

      // 2. Hacer fetch si no hay cache válido
      const fetchedData = await fetchFn();
      
      // 3. Guardar en cache
      dashboardCache.set(key, fetchedData);
      
      // 4. Actualizar estado
      setData(fetchedData);
      onSuccess?.(fetchedData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      console.error(`[useDashboardCache] Error loading ${key}:`, err);
    } finally {
      setLoading(false);
    }
  }, [key, duration, fetchFn, enabled, onSuccess, onError]);

  // Función para refetch (fuerza nueva carga)
  const refetch = useCallback(async () => {
    // Limpiar cache específico
    dashboardCache.clear(key);
    await loadData();
  }, [key, loadData]);

  // Función para limpiar cache manualmente
  const clearCache = useCallback(() => {
    dashboardCache.clear(key);
    setData(null);
  }, [key]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [loadData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
}

/**
 * Hook específico para perfil de usuario
 */
export function useProfileCache(
  getProfileFn: () => Promise<any>,
  enabled: boolean = true
) {
  return useDashboardCache({
    key: 'user-profile',
    duration: DASHBOARD_CACHE_DURATIONS.PROFILE, // 4 horas
    fetchFn: getProfileFn,
    enabled,
    onSuccess: () => {
      // console.log('✅ [Profile Cache] Datos cargados:', data);
    },
    onError: (error) => {
      console.error('❌ [Profile Cache] Error:', error);
    }
  });
}

/**
 * Hook específico para gestión de usuarios
 */
export function useUsersCache(
  getUsersFn: () => Promise<any>,
  filters: any = {},
  enabled: boolean = true
) {
  const cacheKey = `users-list-${JSON.stringify(filters)}`;
  
  return useDashboardCache({
    key: cacheKey,
    duration: DASHBOARD_CACHE_DURATIONS.USER_MANAGEMENT, // 30 minutos
    fetchFn: getUsersFn,
    dependencies: [filters],
    enabled,
    onSuccess: () => {
      // console.log('✅ [Users Cache] Lista cargada:', data);
    }
  });
}

/**
 * Hook específico para agentes IA
 */
export function useAIAgentsCache(
  getAgentsFn: () => Promise<any>,
  enabled: boolean = true
) {
  return useDashboardCache({
    key: 'ai-agents-config',
    duration: DASHBOARD_CACHE_DURATIONS.AI_AGENTS, // 2 horas
    fetchFn: getAgentsFn,
    enabled,
    onSuccess: () => {
      // console.log('✅ [AI Agents Cache] Configuración cargada:', data);
    }
  });
}