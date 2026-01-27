import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { aiService } from '../../services/aiService';
import type {
  AIAnalysisResult,
  AnalysisConfig,
  LoadingState,
  ErrorState
} from './types';

// ===================================================
// HOOK PARA ANÁLISIS DE CONTENIDO CON IA
// ===================================================

interface AnalysisRequest {
  postId?: string;
  content?: string;
  title?: string;
  category?: string;
  config?: AnalysisConfig;
}

interface UseAgentAnalysisReturn {
  // Estados principales
  analysisData: AIAnalysisResult | null;
  loading: LoadingState;
  error: ErrorState;
  
  // Funciones de acción
  analyzeContent: (request: AnalysisRequest) => Promise<AIAnalysisResult | null>;
  quickAnalyze: (content: string, title: string, category?: string) => Promise<AIAnalysisResult | null>;
  clearAnalysis: () => void;
  retryAnalysis: () => Promise<void>;
  
  // Estados adicionales
  lastAnalysis: {
    request: AnalysisRequest | null;
    timestamp: string | null;
    duration: number | null;
  };
  
  // Métricas
  analytics: {
    totalAnalyses: number;
    successRate: number;
    averageTime: number;
  };
}

interface AnalysisCache {
  [key: string]: {
    data: AIAnalysisResult;
    timestamp: number;
    expires: number;
  };
}

const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutos
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 segundo

export const useAgentAnalysis = (): UseAgentAnalysisReturn => {
  const { getToken } = useAuth();
  
  // Estados principales
  const [analysisData, setAnalysisData] = useState<AIAnalysisResult | null>(null);
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
  
  // Estados de sesión
  const [lastAnalysis, setLastAnalysis] = useState<{
    request: AnalysisRequest | null;
    timestamp: string | null;
    duration: number | null;
  }>({
    request: null,
    timestamp: null,
    duration: null
  });
  
  const [analytics, setAnalytics] = useState({
    totalAnalyses: 0,
    successRate: 0,
    averageTime: 0
  });
  
  // Referencias para cache y control
  const cacheRef = useRef<AnalysisCache>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);
  const analyticsRef = useRef({
    analyses: [] as number[],
    errors: 0,
    times: [] as number[]
  });
  
  // Función para limpiar estados
  const clearError = useCallback(() => {
    setError({ hasError: false, error: null });
  }, []);
  
  const clearAnalysis = useCallback(() => {
    setAnalysisData(null);
    setLastAnalysis({
      request: null,
      timestamp: null,
      duration: null
    });
    clearError();
  }, [clearError]);
  
  // Función para generar clave de cache
  const generateCacheKey = useCallback((request: AnalysisRequest): string => {
    const key = JSON.stringify({
      postId: request.postId,
      content: request.content?.substring(0, 100), // Solo primeros 100 chars
      title: request.title,
      category: request.category,
      config: request.config
    });
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '');
  }, []);
  
  // Función para verificar cache
  const getCachedResult = useCallback((cacheKey: string): AIAnalysisResult | null => {
    const cached = cacheRef.current[cacheKey];
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }, []);
  
  // Función para guardar en cache
  const setCachedResult = useCallback((cacheKey: string, data: AIAnalysisResult) => {
    cacheRef.current[cacheKey] = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + CACHE_TIMEOUT
    };
  }, []);
  
  // Función para actualizar métricas
  const updateAnalytics = useCallback((duration: number, success: boolean) => {
    analyticsRef.current.analyses.push(Date.now());
    analyticsRef.current.times.push(duration);
    if (!success) {
      analyticsRef.current.errors++;
    }
    
    const totalAnalyses = analyticsRef.current.analyses.length;
    const errors = analyticsRef.current.errors;
    const times = analyticsRef.current.times;
    
    setAnalytics({
      totalAnalyses,
      successRate: totalAnalyses > 0 ? ((totalAnalyses - errors) / totalAnalyses) * 100 : 0,
      averageTime: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
    });
  }, []);
  
  // Función principal de análisis
  const performAnalysis = useCallback(async (
    request: AnalysisRequest, 
    isRetry: boolean = false
  ): Promise<AIAnalysisResult | null> => {
    const startTime = Date.now();
    
    try {
      // Cancelar solicitudes anteriores
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      // Verificar autenticación
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      // Configurar token en el servicio
      aiService.setAuthToken(token);
      
      // Verificar cache (solo si no es retry)
      if (!isRetry) {
        const cacheKey = generateCacheKey(request);
        const cachedResult = getCachedResult(cacheKey);
        if (cachedResult) {
          setAnalysisData(cachedResult);
          return cachedResult;
        }
      }
      
      // Limpiar errores previos
      clearError();
      
      // Configurar estados de carga
      setLoading(prev => ({
        ...prev,
        isLoading: true,
        isAnalyzing: true,
        progress: 10
      }));
      
      // Simular progreso
      const progressInterval = setInterval(() => {
        setLoading(prev => ({
          ...prev,
          progress: Math.min(prev.progress || 0 + 15, 90)
        }));
      }, 500);
      
      // Preparar datos de solicitud
      const analysisRequest = {
        postId: request.postId,
        content: request.content,
        title: request.title,
        category: request.category,
        analysisType: request.config?.analysisType || 'complete',
        detailLevel: request.config?.detailLevel || 'standard'
      };
      
      // Realizar análisis
      const response = await aiService.analyzeContent(analysisRequest);
      
      clearInterval(progressInterval);
      
      if (!response.success || !response.data) {
        throw new Error('Error en el análisis de contenido');
      }
      
      const duration = Date.now() - startTime;
      
      // Transformar respuesta al formato esperado
      const result: AIAnalysisResult = {
        scores: response.data.scores,
        recommendations: response.data.recommendations,
        summary: {
          strengths: ['Análisis completado exitosamente'],
          improvements: response.data.recommendations
            .filter(r => r.type === 'critical' || r.type === 'important')
            .map(r => r.title),
          nextSteps: response.data.recommendations
            .filter(r => r.type === 'suggestion')
            .map(r => r.title)
        },
        metadata: response.data.metadata ? {
          analysisType: request.config?.analysisType || 'complete',
          processingTime: response.data.metadata.processingTime,
          tokensUsed: response.data.metadata.tokensUsed,
          timestamp: new Date().toISOString()
        } : undefined
      };
      
      // Actualizar estados
      setAnalysisData(result);
      setLastAnalysis({
        request,
        timestamp: new Date().toISOString(),
        duration
      });
      
      // Guardar en cache
      const cacheKey = generateCacheKey(request);
      setCachedResult(cacheKey, result);
      
      // Actualizar métricas
      updateAnalytics(duration, true);
      retryCountRef.current = 0;
      
      return result;
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.error('Error en análisis de contenido:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido en el análisis';
      const errorCode = error.response?.status || 500;
      
      setError({
        hasError: true,
        error: errorMessage,
        errorCode,
        timestamp: new Date().toISOString()
      });
      
      updateAnalytics(duration, false);
      
      // Reintentar automáticamente si es posible
      if (!isRetry && retryCountRef.current < MAX_RETRY_ATTEMPTS && errorCode >= 500) {
        retryCountRef.current++;
        setTimeout(() => {
          performAnalysis(request, true);
        }, RETRY_DELAY * retryCountRef.current);
      }
      
      return null;
    } finally {
      setLoading(prev => ({
        ...prev,
        isLoading: false,
        isAnalyzing: false,
        progress: 100
      }));
    }
  }, [getToken, generateCacheKey, getCachedResult, setCachedResult, clearError, updateAnalytics]);
  
  // Función de análisis completo
  const analyzeContent = useCallback(async (request: AnalysisRequest): Promise<AIAnalysisResult | null> => {
    return await performAnalysis(request);
  }, [performAnalysis]);
  
  // Función de análisis rápido
  const quickAnalyze = useCallback(async (
    content: string, 
    title: string, 
    category?: string
  ): Promise<AIAnalysisResult | null> => {
    const request: AnalysisRequest = {
      content,
      title,
      category,
      config: {
        analysisType: 'quick',
        detailLevel: 'basic',
        includeRecommendations: true
      }
    };
    
    return await performAnalysis(request);
  }, [performAnalysis]);
  
  // Función de reintento
  const retryAnalysis = useCallback(async (): Promise<void> => {
    if (lastAnalysis.request) {
      await performAnalysis(lastAnalysis.request, true);
    }
  }, [lastAnalysis.request, performAnalysis]);
  
  // Limpiar cache periódicamente
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const cache = cacheRef.current;
      
      Object.keys(cache).forEach(key => {
        if (cache[key].expires < now) {
          delete cache[key];
        }
      });
    }, CACHE_TIMEOUT);
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return {
    analysisData,
    loading,
    error,
    analyzeContent,
    quickAnalyze,
    clearAnalysis,
    retryAnalysis,
    lastAnalysis,
    analytics
  };
};