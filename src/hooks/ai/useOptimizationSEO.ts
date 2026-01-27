import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { aiService, type AIAnalysisResponse } from '../../services/aiService';
import type {
  SEOOptimizationTarget,
  SEOOptimizationResult,
  SEORecommendation,
  LoadingState,
  ErrorState
} from './types';

// ===================================================
// HOOK PARA OPTIMIZACIÓN SEO AUTOMÁTICA CON IA
// ===================================================

interface UseOptimizationSEOReturn {
  // Estados principales
  seoScore: number | null;
  optimizationResult: SEOOptimizationResult | null;
  seoRecommendations: SEORecommendation[];
  loading: LoadingState;
  error: ErrorState;
  
  // Funciones de acción
  optimizeSEO: (target: SEOOptimizationTarget) => Promise<SEOOptimizationResult | null>;
  analyzeSEO: (postId: string) => Promise<number | null>;
  applySEORecommendation: (recommendationId: string, postId: string) => Promise<boolean>;
  clearOptimization: () => void;
  retryOptimization: () => Promise<void>;
  
  // Funciones de análisis específicas
  analyzeKeywords: (content: string, title: string) => Promise<Record<string, number>>;
  checkMetaTags: (postId: string) => Promise<any>;
  
  // Estados adicionales
  lastOptimization: {
    target: SEOOptimizationTarget | null;
    timestamp: string | null;
    duration: number | null;
  };
  
  // Métricas
  analytics: {
    totalOptimizations: number;
    averageScoreImprovement: number;
    successRate: number;
    appliedRecommendations: number;
  };
}

interface SEOCache {
  [key: string]: {
    data: SEOOptimizationResult;
    timestamp: number;
    expires: number;
  };
}

const CACHE_TIMEOUT = 15 * 60 * 1000; // 15 minutos (SEO cambia poco)
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000;

export const useOptimizationSEO = (): UseOptimizationSEOReturn => {
  const { getToken } = useAuth();
  
  // Estados principales
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<SEOOptimizationResult | null>(null);
  const [seoRecommendations, setSeoRecommendations] = useState<SEORecommendation[]>([]);
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
  const [lastOptimization, setLastOptimization] = useState<{
    target: SEOOptimizationTarget | null;
    timestamp: string | null;
    duration: number | null;
  }>({
    target: null,
    timestamp: null,
    duration: null
  });
  
  const [analytics, setAnalytics] = useState({
    totalOptimizations: 0,
    averageScoreImprovement: 0,
    successRate: 0,
    appliedRecommendations: 0
  });
  
  // Referencias para cache y control
  const cacheRef = useRef<SEOCache>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);
  const analyticsRef = useRef({
    optimizations: [] as number[],
    scoreImprovements: [] as number[],
    errors: 0,
    recommendations: 0
  });
  
  // Función para limpiar estados
  const clearError = useCallback(() => {
    setError({ hasError: false, error: null });
  }, []);
  
  const clearOptimization = useCallback(() => {
    setSeoScore(null);
    setOptimizationResult(null);
    setSeoRecommendations([]);
    setLastOptimization({
      target: null,
      timestamp: null,
      duration: null
    });
    clearError();
  }, [clearError]);
  
  // Función para generar clave de cache
  const generateCacheKey = useCallback((target: SEOOptimizationTarget): string => {
    const key = JSON.stringify({
      postId: target.postId,
      focusKeywords: target.focusKeywords?.join(',') || '',
      targetAudience: target.targetAudience || ''
    });
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '');
  }, []);
  
  // Función para verificar cache
  const getCachedResult = useCallback((cacheKey: string): SEOOptimizationResult | null => {
    const cached = cacheRef.current[cacheKey];
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }, []);
  
  // Función para guardar en cache
  const setCachedResult = useCallback((cacheKey: string, data: SEOOptimizationResult) => {
    cacheRef.current[cacheKey] = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + CACHE_TIMEOUT
    };
  }, []);
  
  // Función para actualizar métricas
  const updateAnalytics = useCallback((scoreImprovement: number, success: boolean) => {
    analyticsRef.current.optimizations.push(Date.now());
    if (success) {
      analyticsRef.current.scoreImprovements.push(scoreImprovement);
    } else {
      analyticsRef.current.errors++;
    }
    
    const totalOptimizations = analyticsRef.current.optimizations.length;
    const errors = analyticsRef.current.errors;
    const improvements = analyticsRef.current.scoreImprovements;
    
    setAnalytics(prev => ({
      totalOptimizations,
      averageScoreImprovement: improvements.length > 0 ? 
        improvements.reduce((a, b) => a + b, 0) / improvements.length : 0,
      successRate: totalOptimizations > 0 ? ((totalOptimizations - errors) / totalOptimizations) * 100 : 0,
      appliedRecommendations: prev.appliedRecommendations
    }));
  }, []);
  
  // Función para transformar respuesta a SEORecommendation
  const transformToSEORecommendations = useCallback((recommendations: any[]): SEORecommendation[] => {
    return recommendations.map((rec) => ({
      ...rec,
      seoCategory: rec.category === 'seo' ? 'keywords' : 'content',
      currentValue: '',
      suggestedValue: rec.implementation || rec.description,
      expectedImpact: rec.impact === 'high' ? 15 : rec.impact === 'medium' ? 10 : 5
    }));
  }, []);
  
  // Función principal de optimización
  const performOptimization = useCallback(async (
    target: SEOOptimizationTarget,
    isRetry: boolean = false
  ): Promise<SEOOptimizationResult | null> => {
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
        const cacheKey = generateCacheKey(target);
        const cachedResult = getCachedResult(cacheKey);
        if (cachedResult) {
          setOptimizationResult(cachedResult);
          setSeoScore(cachedResult.afterScore || cachedResult.beforeScore);
          setSeoRecommendations(cachedResult.recommendations);
          return cachedResult;
        }
      }
      
      // Limpiar errores previos
      clearError();
      
      // Configurar estados de carga
      setLoading(prev => ({
        ...prev,
        isLoading: true,
        isOptimizing: true,
        progress: 10
      }));
      
      // Simular progreso específico para SEO
      const progressSteps = [20, 35, 50, 65, 80, 95];
      let stepIndex = 0;
      
      const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          setLoading(prev => ({
            ...prev,
            progress: progressSteps[stepIndex]
          }));
          stepIndex++;
        }
      }, 800);
      
      // Realizar optimización SEO
      const response: AIAnalysisResponse = await aiService.optimizeSEO(target.postId);
      
      clearInterval(progressInterval);
      
      if (!response.success || !response.data) {
        throw new Error('Error en la optimización SEO');
      }
      
      const duration = Date.now() - startTime;
      const beforeScore = target.currentSEOScore || response.data.scores.seo;
      const afterScore = response.data.scores.seo;
      const scoreImprovement = afterScore - beforeScore;
      
      // Transformar respuesta al formato esperado
      const seoRecommendations = transformToSEORecommendations(
        response.data.recommendations.filter(r => r.category === 'seo')
      );
      
      const result: SEOOptimizationResult = {
        beforeScore,
        afterScore,
        recommendations: seoRecommendations,
        optimizations: {
          applied: [],
          pending: seoRecommendations.map(r => r.id),
          failed: []
        },
        keywordAnalysis: {
          primary: target.focusKeywords || [],
          secondary: [],
          density: {}
        }
      };
      
      // Actualizar estados
      setOptimizationResult(result);
      setSeoScore(afterScore);
      setSeoRecommendations(seoRecommendations);
      setLastOptimization({
        target,
        timestamp: new Date().toISOString(),
        duration
      });
      
      // Guardar en cache
      const cacheKey = generateCacheKey(target);
      setCachedResult(cacheKey, result);
      
      // Actualizar métricas
      updateAnalytics(scoreImprovement, true);
      retryCountRef.current = 0;
      
      return result;
      
    } catch (error: any) {
      console.error('Error en optimización SEO:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido en la optimización';
      const errorCode = error.response?.status || 500;
      
      setError({
        hasError: true,
        error: errorMessage,
        errorCode,
        timestamp: new Date().toISOString()
      });
      
      updateAnalytics(0, false);
      
      // Reintentar automáticamente si es posible
      if (!isRetry && retryCountRef.current < MAX_RETRY_ATTEMPTS && errorCode >= 500) {
        retryCountRef.current++;
        setTimeout(() => {
          performOptimization(target, true);
        }, RETRY_DELAY * retryCountRef.current);
      }
      
      return null;
    } finally {
      setLoading(prev => ({
        ...prev,
        isLoading: false,
        isOptimizing: false,
        progress: 100
      }));
    }
  }, [getToken, generateCacheKey, getCachedResult, setCachedResult, clearError, updateAnalytics, transformToSEORecommendations]);
  
  // Función de optimización SEO
  const optimizeSEO = useCallback(async (target: SEOOptimizationTarget): Promise<SEOOptimizationResult | null> => {
    return await performOptimization(target);
  }, [performOptimization]);
  
  // Función de análisis SEO simple
  const analyzeSEO = useCallback(async (postId: string): Promise<number | null> => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      aiService.setAuthToken(token);
      
      setLoading(prev => ({ ...prev, isAnalyzing: true }));
      
      const response = await aiService.optimizeSEO(postId);
      
      if (response.success && response.data) {
        const score = response.data.scores.seo;
        setSeoScore(score);
        return score;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error en análisis SEO:', error);
      setError({
        hasError: true,
        error: error.message || 'Error en análisis SEO',
        timestamp: new Date().toISOString()
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, isAnalyzing: false }));
    }
  }, [getToken]);
  
  // Función de reintento
  const retryOptimization = useCallback(async (): Promise<void> => {
    if (lastOptimization.target) {
      await performOptimization(lastOptimization.target, true);
    }
  }, [lastOptimization.target, performOptimization]);
  
  // Función para aplicar recomendación específica
  const applySEORecommendation = useCallback(async (
    recommendationId: string,
    _postId: string
  ): Promise<boolean> => {
    try {
      // Aquí iría la lógica para aplicar una recomendación específica
      // Por ahora, simular aplicación exitosa
      
      setSeoRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, currentValue: rec.suggestedValue || rec.description }
            : rec
        )
      );
      
      setOptimizationResult(prev => 
        prev ? {
          ...prev,
          optimizations: {
            ...prev.optimizations,
            applied: [...prev.optimizations.applied, recommendationId],
            pending: prev.optimizations.pending.filter(id => id !== recommendationId)
          }
        } : null
      );
      
      // Actualizar métricas
      setAnalytics(prev => ({
        ...prev,
        appliedRecommendations: prev.appliedRecommendations + 1
      }));
      
      return true;
    } catch (error) {
      console.error('Error aplicando recomendación SEO:', error);
      return false;
    }
  }, []);
  
  // Función para análisis de keywords
  const analyzeKeywords = useCallback(async (
    content: string,
    title: string
  ): Promise<Record<string, number>> => {
    try {
      // Simulación de análisis de densidad de palabras clave
      const words = (content + ' ' + title).toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3);
      
      const density: Record<string, number> = {};
      const totalWords = words.length;
      
      words.forEach(word => {
        density[word] = (density[word] || 0) + 1;
      });
      
      // Convertir a porcentajes
      Object.keys(density).forEach(key => {
        density[key] = (density[key] / totalWords) * 100;
      });
      
      return density;
    } catch (error) {
      console.error('Error analizando keywords:', error);
      return {};
    }
  }, []);
  
  // Función para verificar meta tags
  const checkMetaTags = useCallback(async (_postId: string): Promise<any> => {
    try {
      // Aquí iría la lógica para verificar meta tags
      // Por ahora, simular verificación
      return {
        title: { exists: true, length: 65, optimized: true },
        description: { exists: true, length: 155, optimized: true },
        keywords: { exists: false, optimized: false }
      };
    } catch (error) {
      console.error('Error verificando meta tags:', error);
      return {};
    }
  }, []);
  
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
    seoScore,
    optimizationResult,
    seoRecommendations,
    loading,
    error,
    optimizeSEO,
    analyzeSEO,
    applySEORecommendation,
    clearOptimization,
    retryOptimization,
    analyzeKeywords,
    checkMetaTags,
    lastOptimization,
    analytics
  };
};