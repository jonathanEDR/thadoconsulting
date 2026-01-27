/**
 * Hook para cache optimizado de GerenteGeneral
 * Extiende useDashboardCache con funcionalidad específica del coordinador
 */

import { useState, useCallback, useEffect } from 'react';
import { useDashboardCache } from './useDashboardCache';
import gerenteGeneralService, {
  type GerenteGeneralConfigData,
  type GerenteGeneralStatus,
  type RoutingConfiguration,
  type CoordinationMetrics
} from '../services/gerenteGeneralService';

interface UseGerenteGeneralCacheReturn {
  // Config
  config: GerenteGeneralConfigData | null;
  status: GerenteGeneralStatus | null;
  routingRules: RoutingConfiguration | null;
  metrics: CoordinationMetrics | null;

  // States
  loading: boolean;
  error: string | null;

  // Methods
  refetchConfig: () => Promise<void>;
  refetchStatus: () => Promise<void>;
  refetchRules: () => Promise<void>;
  refetchMetrics: () => Promise<void>;
  refetchAll: () => Promise<void>;

  // Config updates
  updateConfig: (config: Partial<GerenteGeneralConfigData>) => Promise<boolean>;
  updateRoutingRules: (rules: RoutingConfiguration) => Promise<boolean>;
  initializeConfig: () => Promise<boolean>;

  // Testing
  testRouting: (command: string) => Promise<any>;

  // Utilities
  clearAllCache: () => void;
}

export function useGerenteGeneralCache(): UseGerenteGeneralCacheReturn {
  // Estabilizar las funciones fetch con useCallback para evitar loop infinito
  const fetchConfig = useCallback(async () => {
    try {
      console.log('🔄 [useGerenteGeneral] Iniciando fetchConfig...');
      const result = await gerenteGeneralService.getConfig();
      
      console.log('📦 [useGerenteGeneral] Resultado completo:', result);
      
      if (!result.success) {
        console.warn('❌ [useGerenteGeneral] Config request failed:', result);
        return null;
      }
      
      // Log detallado de los datos recibidos
      console.log('✅ [useGerenteGeneral] Config recibida:');
      console.log('   - config:', result.data?.config);
      console.log('   - personality:', result.data?.personality);
      console.log('   - trainingConfig:', result.data?.trainingConfig);
      console.log('   - trainingConfig.examples:', result.data?.trainingConfig?.examples);
      console.log('   - trainingConfig.behaviorRules:', result.data?.trainingConfig?.behaviorRules);
      console.log('   - responseConfig:', result.data?.responseConfig);
      console.log('   - promptConfig:', result.data?.promptConfig);
      
      return result.data!;
    } catch (error) {
      console.error('💥 [useGerenteGeneral] Error en fetchConfig:', error);
      return null;
    }
  }, []);

  // fetchStatus no se usa actualmente - comentado para evitar warnings
  // const fetchStatus = useCallback(async () => {
  //   try {
  //     const result = await gerenteGeneralService.getStatus();
  //     if (!result.success) return null;
  //     return result.data!;
  //   } catch (error) {
  //     console.warn('GerenteGeneral status not available:', error);
  //     return null;
  //   }
  // }, []);

  const fetchRoutingRules = useCallback(async () => {
    try {
      const result = await gerenteGeneralService.getRoutingRules();
      if (!result.success) {
        console.warn('❌ [useGerenteGeneral] Routing rules request failed:', result);
        return null;
      }
      return result.data!;
    } catch (error) {
      console.error('💥 [useGerenteGeneral] Error fetching routing rules:', error);
      return null;
    }
  }, []);

  // Cache para configuración
  const {
    data: config,
    loading: configLoading,
    error: configError,
    refetch: refetchConfig
  } = useDashboardCache({
    key: 'gerente-config',
    duration: 2 * 60 * 60 * 1000, // 2 horas
    fetchFn: fetchConfig
  });

  // ⚠️ DESHABILITADO: Cache para estado (NO queremos ejecutar el agente en segundo plano)
  // El GerenteGeneral solo debe ejecutarse cuando el usuario lo use explícitamente,
  // NO automáticamente al cargar el dashboard
  const status = null;
  const statusLoading = false;
  const statusError = null;
  const refetchStatus = async () => {};
  
  /*
  const {
    data: status,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus
  } = useDashboardCache({
    key: 'gerente-status',
    duration: 30 * 1000, // 30 segundos (más frecuente)
    fetchFn: fetchStatus
  });
  */

  // Cache para reglas de routing
  const {
    data: routingRules,
    loading: rulesLoading,
    error: rulesError,
    refetch: refetchRules
  } = useDashboardCache({
    key: 'gerente-routing-rules',
    duration: 1 * 60 * 60 * 1000, // 1 hora
    fetchFn: fetchRoutingRules
  });
  
  /*
  const {
    data: routingRules,
    loading: rulesLoading,
    error: rulesError,
    refetch: refetchRules
  } = useDashboardCache({
    key: 'gerente-routing-rules',
    duration: 1 * 60 * 60 * 1000, // 1 hora
    fetchFn: async () => {
      try {
        const result = await gerenteGeneralService.getRoutingRules();
        if (!result.success) return null;
        return result.data!;
      } catch (error) {
        console.warn('GerenteGeneral routing rules not available:', error);
        return null;
      }
    }
  });
  */

  // Cache para métricas (DESHABILITADO - endpoint no existe en backend)
  // TODO: Implementar endpoint /gerente/coordination-metrics en backend
  const metrics = null;
  const metricsLoading = false;
  const metricsError = null;
  const refetchMetrics = async () => {};
  
  /*
  const {
    data: metrics,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics
  } = useDashboardCache({
    key: 'gerente-metrics',
    duration: 5 * 60 * 1000, // 5 minutos
    fetchFn: async () => {
      try {
        const result = await gerenteGeneralService.getCoordinationMetrics();
        if (!result.success) return null;
        return result.data!;
      } catch (error) {
        console.warn('GerenteGeneral metrics not available:', error);
        return null;
      }
    }
  });
  */

  // Estados locales
  const [updateLoading, setUpdateLoading] = useState(false);

  // Estados combinados
  const loading = configLoading || statusLoading || rulesLoading || metricsLoading || updateLoading;
  const error = configError || statusError || rulesError || metricsError;

  // Refetch de todo
  const refetchAll = useCallback(async () => {
    await Promise.all([
      refetchConfig(),
      refetchStatus(),
      refetchRules(),
      refetchMetrics()
    ]);
  }, [refetchConfig, refetchStatus, refetchRules, refetchMetrics]);

  // Actualizar configuración
  const updateConfig = useCallback(async (newConfig: Partial<GerenteGeneralConfigData>): Promise<boolean> => {
    setUpdateLoading(true);
    try {
      const result = await gerenteGeneralService.updateConfig(newConfig);
      if (result.success) {
        await refetchConfig();
        return true;
      } else {
        console.error('❌ Error updating config:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error updating config:', error);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  }, [refetchConfig]);

  // Actualizar reglas de routing
  const updateRoutingRules = useCallback(async (newRules: RoutingConfiguration): Promise<boolean> => {
    setUpdateLoading(true);
    try {
      console.log('📝 [useGerenteGeneral] Actualizando routing rules:', newRules);
      const result = await gerenteGeneralService.updateRoutingRules(newRules);
      
      if (result.success) {
        console.log('✅ [useGerenteGeneral] Routing rules actualizadas');
        await refetchRules();
        return true;
      } else {
        console.error('❌ [useGerenteGeneral] Error updating rules:', result.error);
        return false;
      }
    } catch (error) {
      console.error('💥 [useGerenteGeneral] Error updating rules:', error);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  }, [refetchRules]);
  
  /*
  const updateRoutingRules = useCallback(async (newRules: RoutingConfiguration): Promise<boolean> => {
    setUpdateLoading(true);
    try {
      const result = await gerenteGeneralService.updateRoutingRules(newRules);
      if (result.success) {
        await refetchRules();
        return true;
      } else {
        console.error('❌ Error updating rules:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error updating rules:', error);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  }, [refetchRules]);
  */

  // Testing de routing
  const testRouting = useCallback(async (command: string) => {
    try {
      const result = await gerenteGeneralService.testRouting(command);
      return result;
    } catch (error) {
      console.error('❌ Error testing routing:', error);
      return { success: false, error };
    }
  }, []);

  // Inicializar configuración con valores por defecto
  const initializeConfig = useCallback(async (): Promise<boolean> => {
    setUpdateLoading(true);
    try {
      console.log('🔄 [useGerenteGeneral] Inicializando configuración con valores por defecto...');
      const result = await gerenteGeneralService.initializeConfig();
      
      if (result.success) {
        console.log('✅ [useGerenteGeneral] Configuración inicializada exitosamente');
        // Refrescar toda la configuración
        await refetchAll();
        return true;
      } else {
        console.error('❌ [useGerenteGeneral] Error inicializando:', result.error);
        return false;
      }
    } catch (error) {
      console.error('💥 [useGerenteGeneral] Error inicializando configuración:', error);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  }, [refetchAll]);

  // Limpiar todo el cache
  const clearAllCache = useCallback(() => {
    // Implementar cuando tengas acceso a dashboardCache
    console.log('🗑️ Cache limpiado');
  }, []);

  return {
    config,
    status,
    routingRules,
    metrics,
    loading,
    error: error || null,
    refetchConfig,
    refetchStatus,
    refetchRules,
    refetchMetrics,
    refetchAll,
    updateConfig,
    updateRoutingRules,
    initializeConfig,
    testRouting,
    clearAllCache
  };
}

/**
 * Hook especializado para testing de coordinaciones
 */
export function useGerenteGeneralTesting() {
  const [testHistory, setTestHistory] = useState<Array<{
    command: string;
    result: any;
    timestamp: string;
  }>>([]);

  const { testRouting } = useGerenteGeneralCache();

  const runTest = useCallback(async (command: string) => {
    const result = await testRouting(command);
    
    const testEntry = {
      command,
      result,
      timestamp: new Date().toISOString()
    };

    setTestHistory(prev => [testEntry, ...prev].slice(0, 20)); // Mantener últimos 20
    return result;
  }, [testRouting]);

  const clearHistory = useCallback(() => {
    setTestHistory([]);
  }, []);

  return {
    testHistory,
    runTest,
    clearHistory,
    historyCount: testHistory.length
  };
}

/**
 * Hook para monitoreo en tiempo real del estado
 */
export function useGerenteGeneralMonitoring(intervalMs: number = 5000) {
  const { status, refetchStatus } = useGerenteGeneralCache();

  useEffect(() => {
    const interval = setInterval(() => {
      refetchStatus();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, refetchStatus]);

  return {
    currentStatus: status,
    isOperational: status?.status === 'operational'
  };
}
