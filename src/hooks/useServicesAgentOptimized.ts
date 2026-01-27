/**
 * 🎯 useServicesAgentOptimized Hook
 * 
 * Optimizaciones para reducir queries excesivas:
 * - Debouncing automático (500ms)
 * - Memoización de resultados
 * - Limitación de requests concurrentes
 * - Cancelación de requests pendientes
 */

import { useCallback, useRef, useState } from 'react';
import { servicesAgentService } from '../services/servicesAgentService';

interface UseServicesAgentOptions {
  debounceMs?: number;
  maxConcurrent?: number;
  cacheResults?: boolean;
}

interface ContentGenerationParams {
  serviceId: string;
  contentType: 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq' | 'incluye' | 'noIncluye';
  style?: 'formal' | 'casual' | 'technical';
}

interface CompleteContentParams {
  serviceId: string;
  style?: 'formal' | 'casual' | 'technical';
  forceRegenerate?: boolean;
}

interface ServicesAgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  [key: string]: any;
}

export const useServicesAgentOptimized = (
  options: UseServicesAgentOptions = {}
) => {
  const {
    debounceMs = 500,
    maxConcurrent = 1,
    cacheResults = true
  } = options;

  // Estado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs para control
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestsRef = useRef<number>(0);
  const resultsCache = useRef<Map<string, any>>(new Map());

  /**
   * Generar contenido con debounce
   */
  const generateContent = useCallback(
    async (params: ContentGenerationParams): Promise<ServicesAgentResponse> => {
      return new Promise((resolve, reject) => {
        // Cancelar request anterior si existe
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          console.log(`⏭️ [useServicesAgent] Cancelado request anterior`);
        }

        // Crear key para caché
        const cacheKey = `${params.serviceId}-${params.contentType}-${params.style || 'formal'}`;

        if (cacheResults && resultsCache.current.has(cacheKey)) {
          resolve(resultsCache.current.get(cacheKey));
          return;
        }

        // Debounce la ejecución
        debounceTimerRef.current = setTimeout(async () => {
          // Verificar límite de requests concurrentes
          if (pendingRequestsRef.current >= maxConcurrent) {
            console.log(`⏸️ [useServicesAgent] En espera (${pendingRequestsRef.current}/${maxConcurrent} activos)`);
            
            // Esperar a que termine uno
            const checkInterval = setInterval(async () => {
              if (pendingRequestsRef.current < maxConcurrent) {
                clearInterval(checkInterval);
                // Reintentar
                const result = await generateContent(params);
                resolve(result);
              }
            }, 100);
            return;
          }

          // Ejecutar request
          pendingRequestsRef.current++;
          setIsLoading(true);
          setError(null);

          try {
            console.log(`🚀 [useServicesAgent] Generando ${params.contentType}...`);
            
            const response = await servicesAgentService.generateContent(
              params.serviceId,
              params.contentType,
              params.style
            );

            console.log(`📦 [useServicesAgent] Respuesta completa:`, response);
            console.log(`🔍 [useServicesAgent] Response.success:`, response?.success);
            console.log(`🔍 [useServicesAgent] Response.data:`, response?.data);
            console.log(`🔍 [useServicesAgent] Response.data.content:`, response?.data?.content);

            if (cacheResults) {
              resultsCache.current.set(cacheKey, response);
            }

            console.log(`✅ [useServicesAgent] Éxito - ${params.contentType}`);
            resolve(response);
          } catch (err: any) {
            const errorMsg = err.message || 'Error generating content';
            console.error(`❌ [useServicesAgent] Error:`, errorMsg);
            setError(errorMsg);
            reject(err);
          } finally {
            pendingRequestsRef.current--;
            setIsLoading(pendingRequestsRef.current > 0);
            debounceTimerRef.current = null;
          }
        }, debounceMs);
      });
    },
    [debounceMs, maxConcurrent, cacheResults]
  );

  /**
   * Analizar servicio con debounce
   */
  const analyzeService = useCallback(
    async (serviceId: string): Promise<ServicesAgentResponse> => {
      return new Promise((resolve, reject) => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        const cacheKey = `analyze-${serviceId}`;

        if (cacheResults && resultsCache.current.has(cacheKey)) {
          resolve(resultsCache.current.get(cacheKey));
          return;
        }

        debounceTimerRef.current = setTimeout(async () => {
          pendingRequestsRef.current++;
          setIsLoading(true);
          setError(null);

          try {
            console.log(`📊 [useServicesAgent] Analizando servicio...`);
            
            const response = await servicesAgentService.analyzeService(serviceId, {});

            if (cacheResults) {
              resultsCache.current.set(cacheKey, response);
            }

            console.log(`✅ [useServicesAgent] Análisis completado`);
            resolve(response);
          } catch (err: any) {
            setError(err.message);
            reject(err);
          } finally {
            pendingRequestsRef.current--;
            setIsLoading(false);
          }
        }, debounceMs);
      });
    },
    [debounceMs, cacheResults]
  );

  /**
   * 🚀 Generar contenido COMPLETO con endpoint unificado (SIN debounce)
   * Este método NO usa debounce porque es una operación deliberada del usuario
   */
  const generateCompleteContent = useCallback(
    async (params: CompleteContentParams): Promise<ServicesAgentResponse> => {
      const cacheKey = `complete-${params.serviceId}-${params.style || 'formal'}`;

      // En este caso NO queremos caché si forceRegenerate es true
      if (cacheResults && !params.forceRegenerate && resultsCache.current.has(cacheKey)) {
        console.log(`💾 [useServicesAgent] Usando caché para contenido completo`);
        return resultsCache.current.get(cacheKey);
      }

      // Verificar límite de requests concurrentes
      if (pendingRequestsRef.current >= maxConcurrent) {
        const errorMsg = 'Ya hay una operación en curso. Por favor espera.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      pendingRequestsRef.current++;
      setIsLoading(true);
      setError(null);

      try {
        const response = await servicesAgentService.generateCompleteContent(
          params.serviceId,
          params.style || 'formal',
          params.forceRegenerate || false
        );

        if (cacheResults && response.success) {
          resultsCache.current.set(cacheKey, response);
        }

        return response;
      } catch (err: any) {
        const errorMsg = err.message || 'Error generando contenido completo';
        console.error(`❌ [useServicesAgent] Error:`, errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        pendingRequestsRef.current--;
        setIsLoading(pendingRequestsRef.current > 0);
      }
    },
    [maxConcurrent, cacheResults]
  );

  /**
   * Limpiar cache
   */
  const clearCache = useCallback(() => {
    resultsCache.current.clear();
  }, []);

  /**
   * Cancelar requests pendientes
   */
  const cancel = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    console.log(`⏹️ [useServicesAgent] Operación cancelada`);
  }, []);

  /**
   * Debug info
   */
  const debug = useCallback(() => {
    console.group('🎯 [useServicesAgent] Debug Info');
    console.log('Cargando:', isLoading);
    console.log('Error:', error);
    console.log('Requests activos:', pendingRequestsRef.current);
    console.log('Entradas en memoria:', resultsCache.current.size);
    console.log('Configuración:', { debounceMs, maxConcurrent, cacheResults });
    console.groupEnd();
  }, [isLoading, error, debounceMs, maxConcurrent, cacheResults]);

  return {
    generateContent,
    generateCompleteContent,
    analyzeService,
    clearCache,
    cancel,
    debug,
    isLoading,
    error,
    cacheSize: resultsCache.current.size,
    pendingRequests: pendingRequestsRef.current
  };
};

export default useServicesAgentOptimized;
