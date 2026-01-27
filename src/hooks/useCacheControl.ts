/**
 * 🎛️ Hook para Control de Cache de Servicios - Versión Simplificada
 * 
 * Permite controlar el cache del módulo de servicios desde el frontend
 * - Activar/desactivar cache global
 * - Invalidar cache manualmente
 * - Obtener estadísticas de rendimiento
 * 
 * @author Web Scuti
 * @version 1.1.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getApiUrl } from '../utils/apiConfig';

// ============================================
// TIPOS
// ============================================

export interface CacheConfig {
  enabled: boolean;
  temporaryDisabled: boolean;
  reactivateAt: string | null;
  configurations: Record<string, {
    enabled: boolean;
    maxAge: number;
    staleWhileRevalidate: number;
    public: boolean;
  }>;
  autoInvalidation: {
    disableDuringMutations: boolean;
    reactivationDelay: number;
    lastInvalidation: string | null;
  };
  statistics: {
    totalHits: number;
    totalMisses: number;
    totalInvalidations: number;
    lastReset: string;
  };
  hitRate: string;
  lastModified: string;
  modifiedBy: string;
}

export interface UseCacheControlReturn {
  // Estado del cache
  config: CacheConfig | null;
  loading: boolean;
  error: string | null;
  
  // Acciones
  toggleCache: (enabled: boolean) => Promise<boolean>;
  invalidateCache: (duration?: number) => Promise<boolean>;
  reactivateCache: () => Promise<boolean>;
  updateCacheTTL: (ttlConfig: Record<string, number>) => Promise<boolean>;
  refreshConfig: () => Promise<void>;
  
  // Estados calculados
  isEnabled: boolean;
  isTemporaryDisabled: boolean;
  hitRateNumber: number;
  efficiencyLevel: 'high' | 'medium' | 'low' | 'unknown';
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export const useCacheControl = (): UseCacheControlReturn => {
  const { isSignedIn, getToken } = useAuth();
  const [config, setConfig] = useState<CacheConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FUNCIÓN DE API HELPER
  // ============================================

  const makeApiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!isSignedIn) {
      throw new Error('Usuario no autenticado');
    }

    const token = await getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    // Usar configuración de API para obtener la URL correcta
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/servicios/cache${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error en la respuesta del servidor');
    }

    return data;
  }, [isSignedIn, getToken]);

  // ============================================
  // FUNCIONES DE API
  // ============================================

  // Obtener configuración del cache
  const fetchConfig = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      console.log('🔍 Obteniendo configuración de cache...');
      
      const data = await makeApiCall('/config');
      
      if (data.data) {
        setConfig(data.data);
        console.log('✅ Configuración de cache obtenida:', data.data);
        return true;
      } else {
        throw new Error('No se recibieron datos de configuración');
      }
    } catch (error: any) {
      const message = error.message || 'Error al obtener configuración';
      console.error('🚨 Error obteniendo configuración de cache:', error);
      setError(message);
      return false;
    }
  }, [makeApiCall]);

  // Activar/desactivar cache global
  const toggleCache = useCallback(async (enabled: boolean): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 ${enabled ? 'Activando' : 'Desactivando'} cache...`);
      
      await makeApiCall('/toggle', {
        method: 'POST',
        body: JSON.stringify({ enabled })
      });

      // Refrescar configuración
      await fetchConfig();
      console.log(`✅ Cache ${enabled ? 'activado' : 'desactivado'} exitosamente`);
      return true;
    } catch (error: any) {
      const message = error.message || `Error al ${enabled ? 'activar' : 'desactivar'} cache`;
      console.error('🚨 Error en toggleCache:', error);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [makeApiCall, fetchConfig]);

  // Invalidar cache manualmente
  const invalidateCache = useCallback(async (duration: number = 30): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🗑️ Invalidando cache por ${duration} segundos...`);
      
      await makeApiCall('/invalidate', {
        method: 'POST',
        body: JSON.stringify({ duration })
      });

      // Refrescar configuración
      await fetchConfig();
      console.log(`✅ Cache invalidado por ${duration} segundos`);
      return true;
    } catch (error: any) {
      const message = error.message || 'Error al invalidar cache';
      console.error('🚨 Error en invalidateCache:', error);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [makeApiCall, fetchConfig]);

  // Reactivar cache inmediatamente
  const reactivateCache = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Reactivando cache...');
      
      await makeApiCall('/reactivate', {
        method: 'POST'
      });

      // Refrescar configuración
      await fetchConfig();
      console.log('✅ Cache reactivado exitosamente');
      return true;
    } catch (error: any) {
      const message = error.message || 'Error al reactivar cache';
      console.error('🚨 Error en reactivateCache:', error);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [makeApiCall, fetchConfig]);

  // Refrescar configuración
  const refreshConfig = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await fetchConfig();
    } finally {
      setLoading(false);
    }
  }, [fetchConfig]);

  // ============================================
  // EFECTOS
  // ============================================

  // Cargar configuración inicial
  useEffect(() => {
    if (isSignedIn) {
      console.log('👤 Usuario autenticado, cargando configuración de cache...');
      refreshConfig();
    }
  }, [isSignedIn, refreshConfig]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!isSignedIn || !config) return;

    const interval = setInterval(() => {
      if (!loading) {
        console.log('🔄 Auto-refresh de configuración de cache...');
        fetchConfig();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isSignedIn, config, loading, fetchConfig]);

  // Actualizar TTL (Time To Live) del cache
  const updateCacheTTL = useCallback(async (ttlConfig: Record<string, number>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('⏱️ Actualizando TTL del cache...', ttlConfig);
      
      await makeApiCall('/ttl', {
        method: 'PUT',
        body: JSON.stringify({ ttlConfig })
      });

      // Refrescar configuración
      await fetchConfig();
      console.log('✅ TTL del cache actualizado exitosamente');
      return true;
    } catch (error: any) {
      const message = error.message || 'Error al actualizar TTL del cache';
      console.error('🚨 Error actualizando TTL:', error);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [makeApiCall, fetchConfig]);

  // ============================================
  // VALORES CALCULADOS
  // ============================================

  const isEnabled = Boolean(config?.enabled && !config?.temporaryDisabled);
  const isTemporaryDisabled = Boolean(config?.temporaryDisabled);
  const hitRateNumber = parseFloat(config?.hitRate || '0');
  
  const efficiencyLevel: 'high' | 'medium' | 'low' | 'unknown' = 
    hitRateNumber >= 70 ? 'high' :
    hitRateNumber >= 50 ? 'medium' :
    hitRateNumber > 0 ? 'low' : 'unknown';

  // ============================================
  // RETURN
  // ============================================

  return {
    // Estado
    config,
    loading,
    error,
    
    // Acciones
    toggleCache,
    invalidateCache,
    reactivateCache,
    updateCacheTTL,
    refreshConfig,
    
    // Estados calculados
    isEnabled,
    isTemporaryDisabled,
    hitRateNumber,
    efficiencyLevel
  };
};

export default useCacheControl;