import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { aiService, type TagGenerationResponse } from '../../services/aiService';
import type {
  TagGenerationRequest,
  TagGenerationResult,
  TagSuggestion,
  LoadingState,
  ErrorState
} from './types';

// ===================================================
// HOOK PARA GENERACIÓN INTELIGENTE DE TAGS CON IA
// ===================================================

interface UseTagGenerationReturn {
  // Estados principales
  generatedTags: string[];
  tagSuggestions: TagSuggestion[];
  tagResult: TagGenerationResult | null;
  loading: LoadingState;
  error: ErrorState;
  
  // Funciones de acción
  generateTags: (request: TagGenerationRequest) => Promise<TagGenerationResult | null>;
  quickGenerateTags: (content: string, title: string, maxTags?: number) => Promise<string[]>;
  clearTags: () => void;
  retryGeneration: () => Promise<void>;
  
  // Configuración y utilidades
  addCustomTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  selectSuggestion: (tag: string) => void;
  
  // Estados adicionales
  lastGeneration: {
    request: TagGenerationRequest | null;
    timestamp: string | null;
    duration: number | null;
  };
  
  // Métricas
  analytics: {
    totalGenerations: number;
    averageTags: number;
    successRate: number;
  };
}

interface TagCache {
  [key: string]: {
    data: TagGenerationResult;
    timestamp: number;
    expires: number;
  };
}

const CACHE_TIMEOUT = 10 * 60 * 1000; // 10 minutos (los tags cambian menos)
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1500;

export const useTagGeneration = (): UseTagGenerationReturn => {
  const { getToken } = useAuth();
  
  // Estados principales
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
  const [tagResult, setTagResult] = useState<TagGenerationResult | null>(null);
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
  const [lastGeneration, setLastGeneration] = useState<{
    request: TagGenerationRequest | null;
    timestamp: string | null;
    duration: number | null;
  }>({
    request: null,
    timestamp: null,
    duration: null
  });
  
  const [analytics, setAnalytics] = useState({
    totalGenerations: 0,
    averageTags: 0,
    successRate: 0
  });
  
  // Referencias para cache y control
  const cacheRef = useRef<TagCache>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);
  const analyticsRef = useRef({
    generations: [] as number[],
    tagCounts: [] as number[],
    errors: 0
  });
  
  // Función para limpiar estados
  const clearError = useCallback(() => {
    setError({ hasError: false, error: null });
  }, []);
  
  const clearTags = useCallback(() => {
    setGeneratedTags([]);
    setTagSuggestions([]);
    setTagResult(null);
    setLastGeneration({
      request: null,
      timestamp: null,
      duration: null
    });
    clearError();
  }, [clearError]);
  
  // Función para generar clave de cache
  const generateCacheKey = useCallback((request: TagGenerationRequest): string => {
    const key = JSON.stringify({
      content: request.content?.substring(0, 200),
      title: request.title,
      category: request.category,
      maxTags: request.maxTags
    });
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '');
  }, []);
  
  // Función para verificar cache
  const getCachedResult = useCallback((cacheKey: string): TagGenerationResult | null => {
    const cached = cacheRef.current[cacheKey];
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }, []);
  
  // Función para guardar en cache
  const setCachedResult = useCallback((cacheKey: string, data: TagGenerationResult) => {
    cacheRef.current[cacheKey] = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + CACHE_TIMEOUT
    };
  }, []);
  
  // Función para actualizar métricas
  const updateAnalytics = useCallback((tagCount: number, success: boolean) => {
    analyticsRef.current.generations.push(Date.now());
    if (success) {
      analyticsRef.current.tagCounts.push(tagCount);
    } else {
      analyticsRef.current.errors++;
    }
    
    const totalGenerations = analyticsRef.current.generations.length;
    const errors = analyticsRef.current.errors;
    const tagCounts = analyticsRef.current.tagCounts;
    
    setAnalytics({
      totalGenerations,
      averageTags: tagCounts.length > 0 ? tagCounts.reduce((a, b) => a + b, 0) / tagCounts.length : 0,
      successRate: totalGenerations > 0 ? ((totalGenerations - errors) / totalGenerations) * 100 : 0
    });
  }, []);
  
  // Función para transformar respuesta a TagSuggestion
  const transformToSuggestions = useCallback((tags: string[], confidence: number): TagSuggestion[] => {
    return tags.map((tag, index) => ({
      tag,
      relevance: Math.max(0.95 - (index * 0.1), 0.5), // Relevancia decrece por posición
      category: index < 3 ? 'primary' : index < 6 ? 'secondary' : 'contextual',
      confidence: confidence,
      reason: index < 3 ? 'Alta relevancia con el contenido' : 'Relevante para el contexto'
    }));
  }, []);
  
  // Función principal de generación
  const performGeneration = useCallback(async (
    request: TagGenerationRequest,
    isRetry: boolean = false
  ): Promise<TagGenerationResult | null> => {
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
          setTagResult(cachedResult);
          setGeneratedTags(cachedResult.recommended);
          setTagSuggestions(cachedResult.suggestions);
          return cachedResult;
        }
      }
      
      // Limpiar errores previos
      clearError();
      
      // Configurar estados de carga
      setLoading(prev => ({
        ...prev,
        isLoading: true,
        isGenerating: true,
        progress: 10
      }));
      
      // Simular progreso
      const progressInterval = setInterval(() => {
        setLoading(prev => ({
          ...prev,
          progress: Math.min(prev.progress || 0 + 20, 90)
        }));
      }, 300);
      
      // Preparar datos de solicitud
      const tagRequest = {
        content: request.content,
        title: request.title || 'Sin título',
        category: request.category,
        maxTags: request.maxTags || 10,
        language: 'es'
      };
      
      // Realizar generación de tags
      const response: TagGenerationResponse = await aiService.generateTags(tagRequest);
      
      clearInterval(progressInterval);
      
      if (!response.success || !response.data) {
        throw new Error('Error en la generación de tags');
      }
      
      const duration = Date.now() - startTime;
      
      // Transformar respuesta al formato esperado
      const suggestions = transformToSuggestions(response.data.tags, response.data.confidence);
      const recommended = response.data.tags.slice(0, Math.min(request.maxTags || 5, response.data.tags.length));
      
      const result: TagGenerationResult = {
        suggestions,
        recommended,
        metadata: {
          processingTime: duration,
          totalCandidates: response.data.tags.length,
          selectedCount: recommended.length
        }
      };
      
      // Actualizar estados
      setTagResult(result);
      setGeneratedTags(recommended);
      setTagSuggestions(suggestions);
      setLastGeneration({
        request,
        timestamp: new Date().toISOString(),
        duration
      });
      
      // Guardar en cache
      const cacheKey = generateCacheKey(request);
      setCachedResult(cacheKey, result);
      
      // Actualizar métricas
      updateAnalytics(recommended.length, true);
      retryCountRef.current = 0;
      
      return result;
      
    } catch (error: any) {
      console.error('Error en generación de tags:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido en la generación';
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
          performGeneration(request, true);
        }, RETRY_DELAY * retryCountRef.current);
      }
      
      return null;
    } finally {
      setLoading(prev => ({
        ...prev,
        isLoading: false,
        isGenerating: false,
        progress: 100
      }));
    }
  }, [getToken, generateCacheKey, getCachedResult, setCachedResult, clearError, updateAnalytics, transformToSuggestions]);
  
  // Función de generación completa
  const generateTags = useCallback(async (request: TagGenerationRequest): Promise<TagGenerationResult | null> => {
    return await performGeneration(request);
  }, [performGeneration]);
  
  // Función de generación rápida
  const quickGenerateTags = useCallback(async (
    content: string,
    title: string,
    maxTags: number = 5
  ): Promise<string[]> => {
    const request: TagGenerationRequest = {
      content,
      title,
      maxTags
    };
    
    const result = await performGeneration(request);
    return result?.recommended || [];
  }, [performGeneration]);
  
  // Función de reintento
  const retryGeneration = useCallback(async (): Promise<void> => {
    if (lastGeneration.request) {
      await performGeneration(lastGeneration.request, true);
    }
  }, [lastGeneration.request, performGeneration]);
  
  // Funciones de manipulación de tags
  const addCustomTag = useCallback((tag: string) => {
    if (!generatedTags.includes(tag.toLowerCase())) {
      setGeneratedTags(prev => [...prev, tag.toLowerCase()]);
      
      // Agregar como sugerencia también
      const newSuggestion: TagSuggestion = {
        tag: tag.toLowerCase(),
        relevance: 1.0,
        category: 'primary',
        confidence: 1.0,
        reason: 'Agregado manualmente'
      };
      
      setTagSuggestions(prev => [newSuggestion, ...prev]);
    }
  }, [generatedTags]);
  
  const removeTag = useCallback((tag: string) => {
    setGeneratedTags(prev => prev.filter(t => t !== tag));
  }, []);
  
  const selectSuggestion = useCallback((tag: string) => {
    if (!generatedTags.includes(tag)) {
      setGeneratedTags(prev => [...prev, tag]);
    }
  }, [generatedTags]);
  
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
    generatedTags,
    tagSuggestions,
    tagResult,
    loading,
    error,
    generateTags,
    quickGenerateTags,
    clearTags,
    retryGeneration,
    addCustomTag,
    removeTag,
    selectSuggestion,
    lastGeneration,
    analytics
  };
};