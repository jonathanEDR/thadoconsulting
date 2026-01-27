import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { aiService, type SystemMetricsResponse } from '../../services/aiService';
import type {
  SystemMetrics,
  SystemHealth,
  LoadingState,
  ErrorState,
  HookConfig
} from './types';

// ===================================================
// HOOK PARA MONITOREO DE MÉTRICAS DEL SISTEMA DE IA
// ===================================================

interface UseSystemMetricsReturn {
  // Estados principales
  metrics: SystemMetrics | null;
  systemHealth: SystemHealth | null;
  isHealthy: boolean;
  loading: LoadingState;
  error: ErrorState;
  
  // Funciones de acción
  refreshMetrics: () => Promise<SystemMetrics | null>;
  checkHealth: () => Promise<SystemHealth | null>;
  runSystemTest: () => Promise<any>;
  clearMetrics: () => void;
  
  // Funciones de configuración
  startAutoRefresh: (interval?: number) => void;
  stopAutoRefresh: () => void;
  
  // Estados adicionales
  lastUpdate: {
    metrics: string | null;
    health: string | null;
  };
  
  // Analytics del sistema
  analytics: {
    uptime: number;
    totalRequests: number;
    errorRate: number;
    averageResponseTime: number;
  };
  
  // Configuración actual
  config: {
    autoRefresh: boolean;
    refreshInterval: number;
    isMonitoring: boolean;
  };
}

interface MetricsCache {
  metrics: {
    data: SystemMetrics;
    timestamp: number;
    expires: number;
  } | null;
  health: {
    data: SystemHealth;
    timestamp: number;
    expires: number;
  } | null;
}

const DEFAULT_REFRESH_INTERVAL = 30000; // 30 segundos
const CACHE_TIMEOUT = 10000; // 10 segundos (métricas cambian rápido)

export const useSystemMetrics = (initialConfig?: Partial<HookConfig>): UseSystemMetricsReturn => {
  const { getToken } = useAuth();
  
  // Estados principales
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isAnalyzing: false,
    isGenerating: false,
    isOptimizing: false,
    progress: 0
  });
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    error: null
  });
  
  // Estados de configuración
  const [config, setConfig] = useState({
    autoRefresh: initialConfig?.autoRefresh || false,
    refreshInterval: initialConfig?.refreshInterval || DEFAULT_REFRESH_INTERVAL,
    isMonitoring: false
  });
  
  // Estados de sesión
  const [lastUpdate, setLastUpdate] = useState<{
    metrics: string | null;
    health: string | null;
  }>({
    metrics: null,
    health: null
  });
  
  const [analytics, setAnalytics] = useState({
    uptime: 0,
    totalRequests: 0,
    errorRate: 0,
    averageResponseTime: 0
  });
  
  // Referencias para cache y control
  const cacheRef = useRef<MetricsCache>({ metrics: null, health: null });
  const intervalRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);
  const analyticsRef = useRef({
    startTime: Date.now(),
    requests: [] as number[],
    errors: 0,
    responseTimes: [] as number[]
  });
  
  // Función para limpiar estados
  const clearError = useCallback(() => {
    setError({ hasError: false, error: null });
  }, []);
  
  const clearMetrics = useCallback(() => {
    setMetrics(null);
    setSystemHealth(null);
    setLastUpdate({
      metrics: null,
      health: null
    });
    clearError();
  }, [clearError]);
  
  // Función para verificar si el sistema está saludable
  const isHealthy = systemHealth?.overall === 'healthy' || false;
  
  // Función para verificar cache
  const getCachedMetrics = useCallback((): SystemMetrics | null => {
    const cached = cacheRef.current.metrics;
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }, []);
  
  const getCachedHealth = useCallback((): SystemHealth | null => {
    const cached = cacheRef.current.health;
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }, []);
  
  // Función para guardar en cache
  const setCachedMetrics = useCallback((data: SystemMetrics) => {
    cacheRef.current.metrics = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + CACHE_TIMEOUT
    };
  }, []);
  
  const setCachedHealth = useCallback((data: SystemHealth) => {
    cacheRef.current.health = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + CACHE_TIMEOUT
    };
  }, []);
  
  // Función para actualizar analytics
  const updateAnalytics = useCallback((responseTime?: number, hasError?: boolean) => {
    const now = Date.now();
    
    analyticsRef.current.requests.push(now);
    
    if (responseTime !== undefined) {
      analyticsRef.current.responseTimes.push(responseTime);
    }
    
    if (hasError) {
      analyticsRef.current.errors++;
    }
    
    const requests = analyticsRef.current.requests;
    const errors = analyticsRef.current.errors;
    const responseTimes = analyticsRef.current.responseTimes;
    const uptime = now - analyticsRef.current.startTime;
    
    setAnalytics({
      uptime: Math.floor(uptime / 1000), // en segundos
      totalRequests: requests.length,
      errorRate: requests.length > 0 ? (errors / requests.length) * 100 : 0,
      averageResponseTime: responseTimes.length > 0 ? 
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0
    });
  }, []);
  
  // Función para obtener métricas del sistema
  const fetchMetrics = useCallback(async (useCache: boolean = true): Promise<SystemMetrics | null> => {
    const startTime = Date.now();
    
    try {
      // Verificar cache si está habilitado
      if (useCache) {
        const cachedResult = getCachedMetrics();
        if (cachedResult) {
          setMetrics(cachedResult);
          return cachedResult;
        }
      }
      
      // Verificar autenticación
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      // Configurar token en el servicio
      aiService.setAuthToken(token);
      
      // Configurar estados de carga
      setLoading(prev => ({
        ...prev,
        isLoading: true,
        progress: 25
      }));
      
      // Obtener métricas
      const response: SystemMetricsResponse = await aiService.getSystemMetrics();
      
      if (!response.success || !response.data) {
        throw new Error('Error obteniendo métricas del sistema');
      }
      
      const duration = Date.now() - startTime;
      
      // Transformar respuesta al formato esperado
      const systemHealthData: SystemHealth = {
        orchestrator: response.data.systemHealth.orchestrator as any,
        openai: response.data.systemHealth.openai as any,
        memory: response.data.systemHealth.memory as any,
        database: 'healthy',
        overall: 'healthy'
      };
      
      const metricsData: SystemMetrics = {
        tokensUsed: response.data.tokensUsed,
        analysisCount: response.data.analysisCount,
        averageResponseTime: response.data.averageResponseTime,
        successRate: response.data.successRate,
        systemHealth: systemHealthData,
        performance: {
          cpuUsage: 0, // No disponible en la respuesta actual
          memoryUsage: 0, // No disponible en la respuesta actual
          activeConnections: 0, // No disponible en la respuesta actual
          queueSize: 0 // No disponible en la respuesta actual
        }
      };
      
      // Actualizar estados
      setMetrics(metricsData);
      setSystemHealth(metricsData.systemHealth);
      setLastUpdate(prev => ({
        ...prev,
        metrics: new Date().toISOString()
      }));
      
      // Guardar en cache
      setCachedMetrics(metricsData);
      setCachedHealth(metricsData.systemHealth);
      
      // Actualizar analytics
      updateAnalytics(duration, false);
      retryCountRef.current = 0;
      
      return metricsData;
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error('Error obteniendo métricas:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido obteniendo métricas';
      const errorCode = error.response?.status || 500;
      
      setError({
        hasError: true,
        error: errorMessage,
        errorCode,
        timestamp: new Date().toISOString()
      });
      
      updateAnalytics(duration, true);
      
      return null;
    } finally {
      setLoading(prev => ({
        ...prev,
        isLoading: false,
        progress: 100
      }));
    }
  }, [getToken, getCachedMetrics, setCachedMetrics, setCachedHealth, updateAnalytics]);
  
  // Función para verificar health del sistema
  const performHealthCheck = useCallback(async (useCache: boolean = true): Promise<SystemHealth | null> => {
    const startTime = Date.now();
    
    try {
      // Verificar cache si está habilitado
      if (useCache) {
        const cachedResult = getCachedHealth();
        if (cachedResult) {
          setSystemHealth(cachedResult);
          return cachedResult;
        }
      }
      
      // Verificar autenticación
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      // Configurar token en el servicio
      aiService.setAuthToken(token);
      
      setLoading(prev => ({
        ...prev,
        isLoading: true,
        progress: 50
      }));
      
      // Realizar health check
      const response = await aiService.healthCheck();
      
      if (!response.success) {
        throw new Error('Error en health check');
      }
      
      // Crear objeto SystemHealth
      const healthData: SystemHealth = {
        orchestrator: response.status === 'healthy' ? 'healthy' : 'degraded',
        openai: response.status === 'healthy' ? 'healthy' : 'degraded',
        memory: response.status === 'healthy' ? 'healthy' : 'degraded',
        database: response.status === 'healthy' ? 'healthy' : 'degraded',
        overall: response.status === 'healthy' ? 'healthy' : 'degraded'
      };
      
      // Actualizar estados
      setSystemHealth(healthData);
      setLastUpdate(prev => ({
        ...prev,
        health: new Date().toISOString()
      }));
      
      // Guardar en cache
      setCachedHealth(healthData);
      
      const duration = Date.now() - startTime;
      updateAnalytics(duration, false);
      
      return healthData;
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error('Error en health check:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error en verificación de salud';
      
      setError({
        hasError: true,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      updateAnalytics(duration, true);
      
      return null;
    } finally {
      setLoading(prev => ({
        ...prev,
        isLoading: false,
        progress: 100
      }));
    }
  }, [getToken, getCachedHealth, setCachedHealth, updateAnalytics]);
  
  // Función pública para refresh de métricas
  const refreshMetrics = useCallback(async (): Promise<SystemMetrics | null> => {
    return await fetchMetrics(false); // Forzar actualización
  }, [fetchMetrics]);
  
  // Función pública para check de health
  const checkHealth = useCallback(async (): Promise<SystemHealth | null> => {
    return await performHealthCheck(false); // Forzar actualización
  }, [performHealthCheck]);
  
  // Función para ejecutar test del sistema
  const runSystemTest = useCallback(async (): Promise<any> => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      aiService.setAuthToken(token);
      
      setLoading(prev => ({
        ...prev,
        isLoading: true,
        progress: 75
      }));
      
      const response = await aiService.runAdvancedSystemTest();
      
      updateAnalytics(undefined, false);
      
      return response;
    } catch (error: any) {
      console.error('Error ejecutando test del sistema:', error);
      
      setError({
        hasError: true,
        error: error.message || 'Error ejecutando test del sistema',
        timestamp: new Date().toISOString()
      });
      
      updateAnalytics(undefined, true);
      
      return null;
    } finally {
      setLoading(prev => ({
        ...prev,
        isLoading: false,
        progress: 100
      }));
    }
  }, [getToken, updateAnalytics]);
  
  // Función para iniciar auto-refresh
  const startAutoRefresh = useCallback((interval?: number) => {
    const refreshInterval = interval || config.refreshInterval;
    
    // Detener refresh anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Configurar nuevo intervalo
    intervalRef.current = setInterval(async () => {
      await fetchMetrics(true);
      await performHealthCheck(true);
    }, refreshInterval);
    
    setConfig(prev => ({
      ...prev,
      autoRefresh: true,
      refreshInterval,
      isMonitoring: true
    }));
    
    // Ejecutar primera actualización inmediatamente
    fetchMetrics(true);
    performHealthCheck(true);
  }, [config.refreshInterval, fetchMetrics, performHealthCheck]);
  
  // Función para detener auto-refresh
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setConfig(prev => ({
      ...prev,
      autoRefresh: false,
      isMonitoring: false
    }));
  }, []);
  
  // Auto-iniciar si está configurado
  useEffect(() => {
    if (initialConfig?.autoRefresh) {
      startAutoRefresh(initialConfig.refreshInterval);
    }
    
    // Cleanup al desmontar
    return () => {
      stopAutoRefresh();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initialConfig?.autoRefresh, initialConfig?.refreshInterval, startAutoRefresh, stopAutoRefresh]);
  
  return {
    metrics,
    systemHealth,
    isHealthy,
    loading,
    error,
    refreshMetrics,
    checkHealth,
    runSystemTest,
    clearMetrics,
    startAutoRefresh,
    stopAutoRefresh,
    lastUpdate,
    analytics,
    config
  };
};