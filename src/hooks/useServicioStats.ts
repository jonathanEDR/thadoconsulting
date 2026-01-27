/**
 * 🎣 HOOK DE ESTADÍSTICAS - useServicioStats
 * Hook para obtener y gestionar estadísticas del dashboard de servicios
 */

import { useState, useEffect, useCallback } from 'react';
import { serviciosApi } from '../services/serviciosApi';
import type { ServicioDashboardStats } from '../types/servicios';

// ============================================
// TIPOS
// ============================================

interface UseServicioStatsOptions {
  autoFetch?: boolean; // Si debe cargar automáticamente al montar
  refreshInterval?: number; // Intervalo de actualización automática en ms (0 = deshabilitado)
}

interface UseServicioStatsReturn {
  stats: ServicioDashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook para obtener estadísticas del dashboard de servicios
 * 
 * @example
 * ```tsx
 * const { stats, loading, refresh } = useServicioStats({
 *   autoFetch: true,
 *   refreshInterval: 60000 // Actualizar cada minuto
 * });
 * ```
 */
export const useServicioStats = (
  options: UseServicioStatsOptions = {}
): UseServicioStatsReturn => {
  const { autoFetch = true, refreshInterval = 0 } = options;

  // ============================================
  // ESTADO
  // ============================================

  const [stats, setStats] = useState<ServicioDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FUNCIONES
  // ============================================

  /**
   * Cargar estadísticas desde la API
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.getDashboard();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error('No se pudieron obtener las estadísticas');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar estadísticas';
      setError(errorMessage);
      console.error('[useServicioStats] Error fetching:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refrescar estadísticas manualmente
   */
  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // EFECTOS
  // ============================================

  /**
   * Cargar estadísticas al montar si autoFetch está habilitado
   */
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  /**
   * Configurar actualización automática si refreshInterval está configurado
   */
  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchStats();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchStats]);

  // ============================================
  // RETORNO
  // ============================================

  return {
    stats,
    loading,
    error,
    refresh,
    clearError
  };
};

export default useServicioStats;
