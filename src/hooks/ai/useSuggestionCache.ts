/**
 * 💾 Suggestion Cache Hook
 * Cache inteligente para sugerencias de autocompletado
 */

import { useRef, useCallback } from 'react';

interface CachedSuggestion {
  content: string;
  suggestion: string;
  timestamp: number;
  contextHash: string;
}

interface SuggestionCacheOptions {
  maxCacheSize: number;
  cacheExpiration: number; // ms
}

export const useSuggestionCache = (options: SuggestionCacheOptions) => {
  const {
    maxCacheSize = 50,
    cacheExpiration = 300000 // 5 minutos
  } = options;

  const cache = useRef<Map<string, CachedSuggestion>>(new Map());

  // Generar hash del contexto para cache key
  const generateContextHash = useCallback((content: string, context: any): string => {
    const contextStr = JSON.stringify({
      lastChars: content.slice(-100), // Últimos 100 caracteres
      title: context.title,
      category: context.category
    });
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < contextStr.length; i++) {
      const char = contextStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }, []);

  // Buscar sugerencia en cache
  const getCachedSuggestion = useCallback((content: string, context: any): string | null => {
    const contextHash = generateContextHash(content, context);
    const cached = cache.current.get(contextHash);
    
    if (!cached) {
      return null;
    }

    // Verificar si el cache ha expirado
    const now = Date.now();
    if (now - cached.timestamp > cacheExpiration) {
      cache.current.delete(contextHash);
      console.log('🗑️ Cache expirado:', contextHash);
      return null;
    }

    console.log('💾 Cache hit:', contextHash);
    return cached.suggestion;
  }, [generateContextHash, cacheExpiration]);

  // Guardar sugerencia en cache
  const cacheSuggestion = useCallback((
    content: string, 
    context: any, 
    suggestion: string
  ): void => {
    const contextHash = generateContextHash(content, context);
    const now = Date.now();

    // Limpiar cache si está lleno
    if (cache.current.size >= maxCacheSize) {
      // Eliminar la entrada más antigua
      const oldestKey = Array.from(cache.current.keys())[0];
      cache.current.delete(oldestKey);
      console.log('🧹 Cache limpiado, eliminado:', oldestKey);
    }

    // Guardar nueva sugerencia
    cache.current.set(contextHash, {
      content: content.slice(-100), // Guardar solo últimos 100 chars
      suggestion,
      timestamp: now,
      contextHash
    });

    console.log('💾 Sugerencia cacheada:', {
      hash: contextHash,
      suggestion: suggestion.slice(0, 30) + '...',
      cacheSize: cache.current.size
    });
  }, [generateContextHash, maxCacheSize]);

  // Limpiar cache expirado
  const cleanExpiredCache = useCallback((): void => {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of cache.current.entries()) {
      if (now - value.timestamp > cacheExpiration) {
        cache.current.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cache limpiado: ${cleaned} entradas expiradas`);
    }
  }, [cacheExpiration]);

  // Obtener estadísticas del cache
  const getCacheStats = useCallback(() => {
    const now = Date.now();
    const entries = Array.from(cache.current.values());
    const expired = entries.filter(entry => now - entry.timestamp > cacheExpiration).length;

    return {
      total: cache.current.size,
      expired,
      active: cache.current.size - expired,
      maxSize: maxCacheSize,
      usage: (cache.current.size / maxCacheSize) * 100
    };
  }, [maxCacheSize, cacheExpiration]);

  // Limpiar todo el cache
  const clearCache = useCallback((): void => {
    cache.current.clear();
    console.log('🗑️ Cache completamente limpiado');
  }, []);

  return {
    getCachedSuggestion,
    cacheSuggestion,
    cleanExpiredCache,
    getCacheStats,
    clearCache
  };
};