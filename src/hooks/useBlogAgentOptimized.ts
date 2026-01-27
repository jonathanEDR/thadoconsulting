/**
 * 🎯 useBlogAgentOptimized Hook
 * 
 * Hook optimizado para interacción con BlogAgent (AI generación de contenido)
 * 
 * Optimizaciones aplicadas:
 * ✅ Debouncing automático (500ms) - Evita requests excesivos mientras usuario escribe
 * ✅ Caché en memoria - Reutiliza resultados de generaciones previas
 * ✅ Limitación de concurrencia - Máximo 2 requests simultáneos
 * ✅ Cancelación automática - Cancela requests pendientes obsoletos
 * ✅ Memoización de contenido - Evita regeneraciones innecesarias
 * ✅ Request deduplication - Detecta requests duplicados
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { getApiUrl } from '../utils/apiConfig';

// ========================================
// TIPOS
// ========================================

export type GenerationType = 
  | 'full'          // Post completo
  | 'section'       // Sección específica
  | 'extend'        // Extender contenido existente
  | 'improve'       // Mejorar contenido
  | 'autocomplete'  // Autocompletar
  | 'title'         // Generar títulos
  | 'tags'          // Generar tags
  | 'seo';          // Optimizar SEO

export interface GenerationRequest {
  type: GenerationType;
  title?: string;
  category?: string;
  currentContent?: string;
  style?: 'technical' | 'casual' | 'professional';
  wordCount?: number;
  focusKeywords?: string[];
  instruction?: string;
  context?: Record<string, any>;
}

export interface GeneratedContent {
  content: string;
  metadata?: {
    wordCount?: number;
    seoScore?: number;
    suggestedTags?: string[];
    readingTime?: number;
    [key: string]: any;
  };
  suggestions?: string[];
}

export interface UseBlogAgentOptions {
  debounceMs?: number;          // Tiempo de debounce (default: 500ms)
  maxConcurrent?: number;       // Requests concurrentes máximos (default: 2)
  cacheResults?: boolean;       // Habilitar caché (default: true)
  cacheTTL?: number;           // Time-to-live del caché en ms (default: 5 min)
  enableDeduplication?: boolean; // Evitar requests duplicados (default: true)
}

interface CacheEntry {
  data: GeneratedContent;
  timestamp: number;
}

// ========================================
// HOOK PRINCIPAL
// ========================================

export const useBlogAgentOptimized = (
  options: UseBlogAgentOptions = {}
) => {
  const {
    debounceMs = 500,
    maxConcurrent = 2,
    cacheResults = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutos
    enableDeduplication = true
  } = options;

  // Auth
  const { getToken } = useAuth();

  // Estado
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Refs para control interno
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestsRef = useRef<number>(0);
  const resultsCache = useRef<Map<string, CacheEntry>>(new Map());
  const activeRequestsRef = useRef<Set<string>>(new Set());

  /**
   * Generar clave única para caché
   */
  const generateCacheKey = useCallback((request: GenerationRequest): string => {
    return `${request.type}-${request.title || ''}-${request.currentContent?.substring(0, 50) || ''}-${request.style || ''}`;
  }, []);

  /**
   * Verificar si el caché es válido
   */
  const isCacheValid = useCallback((entry: CacheEntry): boolean => {
    if (!cacheResults) return false;
    const age = Date.now() - entry.timestamp;
    return age < cacheTTL;
  }, [cacheResults, cacheTTL]);

  /**
   * Limpiar caché expirado
   */
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, entry] of resultsCache.current.entries()) {
      if (now - entry.timestamp > cacheTTL) {
        resultsCache.current.delete(key);
      }
    }
  }, [cacheTTL]);

  /**
   * 🚀 Generar contenido con optimizaciones
   */
  const generateContent = useCallback(
    async (request: GenerationRequest): Promise<GeneratedContent | null> => {
      return new Promise((resolve, reject) => {
        // Cancelar debounce anterior
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          console.log(`⏭️ [BlogAgent] Cancelado request anterior (debounce)`);
        }

        // Generar clave de caché
        const cacheKey = generateCacheKey(request);

        // Verificar caché
        if (cacheResults && resultsCache.current.has(cacheKey)) {
          const cached = resultsCache.current.get(cacheKey)!;
          if (isCacheValid(cached)) {
            console.log(`💾 [BlogAgent] ✅ Cache HIT: ${request.type}`);
            resolve(cached.data);
            return;
          } else {
            resultsCache.current.delete(cacheKey);
            console.log(`🗑️ [BlogAgent] Cache expirado: ${cacheKey}`);
          }
        }

        // Verificar deduplicación
        if (enableDeduplication && activeRequestsRef.current.has(cacheKey)) {
          console.log(`⚠️ [BlogAgent] Request duplicado detectado: ${request.type}`);
          reject(new Error('Request duplicado en progreso'));
          return;
        }

        // Debounce la ejecución
        debounceTimerRef.current = setTimeout(async () => {
          // Verificar límite de concurrencia
          if (pendingRequestsRef.current >= maxConcurrent) {
            console.log(`⏸️ [BlogAgent] Límite alcanzado (${pendingRequestsRef.current}/${maxConcurrent})`);
            
            // Esperar a que se libere un slot
            const checkInterval = setInterval(async () => {
              if (pendingRequestsRef.current < maxConcurrent) {
                clearInterval(checkInterval);
                try {
                  const result = await generateContent(request);
                  resolve(result);
                } catch (err) {
                  reject(err);
                }
              }
            }, 100);
            return;
          }

          // Ejecutar request
          pendingRequestsRef.current++;
          activeRequestsRef.current.add(cacheKey);
          setIsGenerating(true);
          setError(null);
          setProgress(0);

          // Crear AbortController para cancelación
          const abortController = new AbortController();
          abortControllerRef.current = abortController;

          try {
            console.log(`🚀 [BlogAgent] Generando ${request.type}...`);
            
            // Simular progreso
            const progressInterval = setInterval(() => {
              setProgress(prev => Math.min(prev + 10, 90));
            }, 500);

            // Obtener token
            const token = await getToken();

            // Hacer request al backend
            const response = await axios.post<{ success: boolean; data: GeneratedContent }>(
              `${getApiUrl()}/agents/blog/generate-content`,
              request,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                signal: abortController.signal
              }
            );

            clearInterval(progressInterval);
            setProgress(100);

            if (response.data.success) {
              const result = response.data.data;

              // Guardar en caché
              if (cacheResults) {
                resultsCache.current.set(cacheKey, {
                  data: result,
                  timestamp: Date.now()
                });
                console.log(`💾 [BlogAgent] Resultado cacheado`);
              }

              console.log(`✅ [BlogAgent] Éxito - ${request.type}`);
              resolve(result);
            } else {
              throw new Error('No se pudo generar el contenido');
            }

          } catch (err: any) {
            if (err.name === 'CanceledError' || err.name === 'AbortError') {
              console.log(`⏹️ [BlogAgent] Request cancelado`);
              reject(new Error('Request cancelado'));
            } else {
              const errorMsg = err.response?.data?.error || err.message || 'Error generando contenido';
              console.error(`❌ [BlogAgent] Error:`, errorMsg);
              setError(errorMsg);
              reject(new Error(errorMsg));
            }
          } finally {
            pendingRequestsRef.current--;
            activeRequestsRef.current.delete(cacheKey);
            setIsGenerating(pendingRequestsRef.current > 0);
            if (pendingRequestsRef.current === 0) {
              setProgress(0);
            }
            debounceTimerRef.current = null;
          }
        }, debounceMs);
      });
    },
    [debounceMs, maxConcurrent, cacheResults, cacheTTL, enableDeduplication, generateCacheKey, isCacheValid, getToken]
  );

  /**
   * 📝 Generar post completo
   */
  const generateFullPost = useCallback(
    async (
      title: string,
      category: string,
      options?: {
        style?: 'technical' | 'casual' | 'professional';
        wordCount?: number;
        focusKeywords?: string[];
      }
    ) => {
      return await generateContent({
        type: 'full',
        title,
        category,
        ...options
      });
    },
    [generateContent]
  );

  /**
   * ✨ Mejorar contenido existente
   */
  const improveContent = useCallback(
    async (
      currentContent: string,
      instruction?: string
    ) => {
      return await generateContent({
        type: 'improve',
        currentContent,
        instruction
      });
    },
    [generateContent]
  );

  /**
   * 🔖 Generar tags
   */
  const generateTags = useCallback(
    async (title: string, content: string) => {
      return await generateContent({
        type: 'tags',
        title,
        currentContent: content
      });
    },
    [generateContent]
  );

  /**
   * 🎯 Optimizar SEO
   */
  const optimizeSEO = useCallback(
    async (title: string, content: string, focusKeywords?: string[]) => {
      return await generateContent({
        type: 'seo',
        title,
        currentContent: content,
        focusKeywords
      });
    },
    [generateContent]
  );

  /**
   * 🧹 Limpiar caché completo
   */
  const clearCache = useCallback(() => {
    resultsCache.current.clear();
    console.log(`🧹 [BlogAgent] Cache limpiado completamente`);
  }, []);

  /**
   * 🧹 Limpiar solo caché expirado
   */
  const clearExpiredCache = useCallback(() => {
    cleanExpiredCache();
    console.log(`🧹 [BlogAgent] Cache expirado limpiado`);
  }, [cleanExpiredCache]);

  /**
   * ⏹️ Cancelar operación en progreso
   */
  const cancel = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setProgress(0);
    console.log(`⏹️ [BlogAgent] Todas las operaciones canceladas`);
  }, []);

  /**
   * 🐛 Debug info
   */
  const debug = useCallback(() => {
    console.group('🎯 [BlogAgent] Debug Info');
    console.log('Generando:', isGenerating);
    console.log('Progreso:', `${progress}%`);
    console.log('Error:', error);
    console.log('Requests activos:', pendingRequestsRef.current);
    console.log('Cache entries:', resultsCache.current.size);
    console.log('Active requests:', activeRequestsRef.current.size);
    console.log('Configuración:', { 
      debounceMs, 
      maxConcurrent, 
      cacheResults,
      cacheTTL: `${cacheTTL / 1000}s`,
      enableDeduplication 
    });
    console.groupEnd();
  }, [isGenerating, progress, error, debounceMs, maxConcurrent, cacheResults, cacheTTL, enableDeduplication]);

  /**
   * Limpiar caché expirado automáticamente cada minuto
   */
  useEffect(() => {
    const interval = setInterval(() => {
      cleanExpiredCache();
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, [cleanExpiredCache]);

  /**
   * Cleanup al desmontar
   */
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  // ========================================
  // RETURN
  // ========================================

  return {
    // Métodos principales
    generateContent,
    generateFullPost,
    improveContent,
    generateTags,
    optimizeSEO,
    
    // Control de caché
    clearCache,
    clearExpiredCache,
    
    // Control de ejecución
    cancel,
    debug,
    
    // Estado
    isGenerating,
    error,
    progress,
    
    // Estadísticas
    cacheSize: resultsCache.current.size,
    activeRequests: activeRequestsRef.current.size,
    pendingRequests: pendingRequestsRef.current
  };
};

export default useBlogAgentOptimized;
