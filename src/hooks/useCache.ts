/**
 * 💾 USE CACHE HOOK
 * Hook personalizado para caché en memoria con TTL (Time To Live)
 * Mejora el rendimiento evitando peticiones redundantes
 */

import { useState, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseCacheOptions {
  ttl?: number; // Time to live en milisegundos (default: 5 minutos)
  maxSize?: number; // Máximo número de entradas en caché
}

interface UseCacheReturn<T> {
  get: (key: string) => T | null;
  set: (key: string, data: T) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  size: () => number;
  getOrFetch: (key: string, fetcher: () => Promise<T>) => Promise<T>;
}

export const useCache = <T = any>(
  options: UseCacheOptions = {}
): UseCacheReturn<T> => {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // Default: 5 minutos, 100 entradas
  
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const [, forceUpdate] = useState({});

  // Verificar si una entrada está expirada
  const isExpired = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > ttl;
  }, [ttl]);

  // Obtener una entrada del caché
  const get = useCallback((key: string): T | null => {
    const entry = cacheRef.current.get(key);
    
    if (!entry) {
      return null;
    }

    if (isExpired(entry)) {
      cacheRef.current.delete(key);
      return null;
    }

    return entry.data;
  }, [isExpired]);

  // Guardar una entrada en el caché
  const set = useCallback((key: string, data: T): void => {
    // Si el caché está lleno, eliminar la entrada más antigua
    if (cacheRef.current.size >= maxSize) {
      const firstKey = cacheRef.current.keys().next().value;
      if (firstKey) {
        cacheRef.current.delete(firstKey);
      }
    }

    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });

    forceUpdate({});
  }, [maxSize]);

  // Eliminar una entrada del caché
  const remove = useCallback((key: string): void => {
    cacheRef.current.delete(key);
    forceUpdate({});
  }, []);

  // Limpiar todo el caché
  const clear = useCallback((): void => {
    cacheRef.current.clear();
    forceUpdate({});
  }, []);

  // Verificar si existe una entrada
  const has = useCallback((key: string): boolean => {
    const entry = cacheRef.current.get(key);
    if (!entry) return false;
    if (isExpired(entry)) {
      cacheRef.current.delete(key);
      return false;
    }
    return true;
  }, [isExpired]);

  // Obtener el tamaño del caché
  const size = useCallback((): number => {
    return cacheRef.current.size;
  }, []);

  // Obtener del caché o hacer fetch si no existe
  const getOrFetch = useCallback(async (
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> => {
    // Intentar obtener del caché
    const cached = get(key);
    if (cached !== null) {
      return cached;
    }

    // Si no está en caché, hacer fetch
    const data = await fetcher();
    set(key, data);
    return data;
  }, [get, set]);

  return {
    get,
    set,
    remove,
    clear,
    has,
    size,
    getOrFetch
  };
};

export default useCache;
