/**
 * 🗄️ Sistema de Cache para Servicios Públicos
 * 
 * Evita recargas innecesarias al navegar entre páginas de servicios
 * Implementa estrategia de cache con TTL (Time To Live) + localStorage
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

import type { Servicio } from '../types/servicios';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  entries: number;
  size: string;
}

/**
 * Configuración de TTL por tipo de contenido
 * ⚠️ REDUCIDO DRÁSTICAMENTE - Respeta CacheConfig del backend
 * El backend controla el cache real, el frontend solo cachea brevemente
 */
export const SERVICIOS_CACHE_TTL = {
  SERVICIOS_LIST: 5 * 60 * 1000,            // 5 minutos - Respeta backend
  SERVICIO_DETAIL: 10 * 60 * 1000,          // 10 minutos - Respeta backend
  SERVICIOS_FEATURED: 15 * 60 * 1000,       // 15 minutos - Respeta backend
  SERVICIOS_BY_CATEGORY: 5 * 60 * 1000,     // 5 minutos - Respeta backend
  SEARCH_RESULTS: 2 * 60 * 1000,            // 2 minutos - Resultados de búsqueda
} as const;

/**
 * Cache Manager con soporte para TTL, localStorage y estadísticas
 */
class ServiciosCacheManager {
  private memoryCache: Map<string, CacheEntry<any>>;
  private stats: { hits: number; misses: number };
  private maxSize: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private readonly STORAGE_PREFIX = 'serviciosCache_';
  private readonly STATS_KEY = 'serviciosCache_stats';

  constructor(maxSize = 30) {
    this.memoryCache = new Map();
    this.stats = this.loadStats();
    this.maxSize = maxSize;
    
    // ⚡ Limpiar más agresivamente: cada 1 minuto en lugar de 5
    this.cleanupTimer = setInterval(() => this.cleanExpired(), 1 * 60 * 1000);
    
    // Cargar datos de localStorage a memoria al iniciar
    this.loadFromLocalStorage();
  }

  /**
   * Limpiar recursos y evitar memory leaks
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.memoryCache.clear();
    this.saveStats();
  }

  /**
   * Cargar estadísticas desde localStorage
   */
  private loadStats(): { hits: number; misses: number } {
    try {
      const stored = localStorage.getItem(this.STATS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Silenciar errores de localStorage
    }
    return { hits: 0, misses: 0 };
  }

  /**
   * Guardar estadísticas en localStorage
   */
  private saveStats(): void {
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats));
    } catch (e) {
      // Silenciar errores de localStorage
    }
  }

  /**
   * Cargar cache desde localStorage a memoria
   */
  private loadFromLocalStorage(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX) && key !== this.STATS_KEY) {
          const cacheKey = key.replace(this.STORAGE_PREFIX, '');
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<any> = JSON.parse(stored);
            this.memoryCache.set(cacheKey, entry);
          }
        }
      }
      // Log removido para producción
    } catch (e) {
      console.warn('[ServiciosCache] Error loading from localStorage:', e);
    }
  }

  /**
   * Generar key única para cache
   */
  private generateKey(type: string, identifier: string | Record<string, any>): string {
    if (typeof identifier === 'string') {
      return `${type}:${identifier}`;
    }
    // Si es un objeto (filtros), ordenar keys para consistencia
    const sorted = Object.keys(identifier)
      .sort()
      .reduce((acc, key) => {
        acc[key] = identifier[key];
        return acc;
      }, {} as Record<string, any>);
    
    return `${type}:${JSON.stringify(sorted)}`;
  }

  /**
   * Obtener datos del cache (memoria + localStorage)
   * ⚠️ NUEVO: Verifica headers del backend para respetar CacheConfig
   */
  get<T>(
    type: keyof typeof SERVICIOS_CACHE_TTL, 
    identifier: string | Record<string, any>,
    backendCacheStatus?: { invalidated?: boolean; disabled?: boolean }
  ): T | null {
    const key = this.generateKey(type, identifier);

    // ⚠️ NUEVO: Si el backend indica que el cache fue invalidado, NO usar cache local
    if (backendCacheStatus?.invalidated) {
      this.memoryCache.delete(key);
      try {
        localStorage.removeItem(this.STORAGE_PREFIX + key);
      } catch (e) {
        console.error('❌ Error limpiando localStorage:', e);
      }
      return null;
    }

    // ⚠️ NUEVO: Si el backend indica que el cache está deshabilitado, NO usar cache local
    if (backendCacheStatus?.disabled) {
      return null;
    }

    let entry = this.memoryCache.get(key);

    // Si no está en memoria, intentar cargar desde localStorage
    if (!entry) {
      try {
        const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
        if (stored) {
          entry = JSON.parse(stored);
          if (entry) {
            this.memoryCache.set(key, entry);
          }
        }
      } catch (e) {
        console.error('❌ Error leyendo localStorage:', e);
      }
    }

    if (!entry) {
      this.stats.misses++;
      this.saveStats();
      return null;
    }

    const ttl = SERVICIOS_CACHE_TTL[type];
    const age = Date.now() - entry.timestamp;

    // Si está expirado, eliminar y retornar null
    if (age > ttl) {
      this.memoryCache.delete(key);
      try {
        localStorage.removeItem(this.STORAGE_PREFIX + key);
      } catch (e) {
        console.error('❌ Error limpiando localStorage:', e);
      }
      this.stats.misses++;
      this.saveStats();
      return null;
    }

    // Cache HIT - incrementar contador de hits
    entry.hits++;
    this.stats.hits++;
    this.saveStats();
    
    return entry.data;
  }

  /**
   * Guardar datos en cache (memoria + localStorage)
   */
  set<T>(type: keyof typeof SERVICIOS_CACHE_TTL, identifier: string | Record<string, any>, data: T): void {
    const key = this.generateKey(type, identifier);
    
    // Si el cache está lleno, eliminar las entradas más antiguas
    // Cuando llega al límite, eliminar 20% de las más antiguas
    if (this.memoryCache.size >= this.maxSize * 0.9) {
      const entriesToRemove = Math.ceil(this.maxSize * 0.2);
      const entries = Array.from(this.memoryCache.entries())
        .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0))
        .slice(0, entriesToRemove);
      
      entries.forEach(([key]) => {
        this.memoryCache.delete(key);
        try {
          localStorage.removeItem(this.STORAGE_PREFIX + key);
        } catch (e) {
          // Silenciar errores
        }
      });
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      hits: 0
    };

    // Guardar en memoria
    this.memoryCache.set(key, entry);

    // Guardar en localStorage
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      // Si localStorage está lleno, limpiar cache antiguo
      this.cleanOldEntries();
      
      // Reintentar
      try {
        localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(entry));
      } catch (e2) {
        // Silenciar errores de localStorage lleno
      }
    }
  }

  /**
   * Eliminar entrada específica del cache
   */
  remove(type: keyof typeof SERVICIOS_CACHE_TTL, identifier: string | Record<string, any>): void {
    const key = this.generateKey(type, identifier);
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch (e) {
      // Silenciar errores de localStorage
    }
  }

  /**
   * Limpiar entradas expiradas - Ejecutarse más frecuentemente
   */
  private cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // Primera pasada: eliminar expirados
    this.memoryCache.forEach((entry, key) => {
      const type = key.split(':')[0] as keyof typeof SERVICIOS_CACHE_TTL;
      const ttl = SERVICIOS_CACHE_TTL[type] || SERVICIOS_CACHE_TTL.SERVICIOS_LIST;
      const age = now - entry.timestamp;

      if (age > ttl) {
        keysToDelete.push(key);
      }
    });

    // Eliminar keys expiradas
    keysToDelete.forEach(key => {
      this.memoryCache.delete(key);
      try {
        localStorage.removeItem(this.STORAGE_PREFIX + key);
      } catch (e) {
        // Silenciar errores
      }
    });

    // Segunda pasada: si aún está muy lleno, eliminar los menos usados
    if (this.memoryCache.size > this.maxSize * 0.85) {
      const entries = Array.from(this.memoryCache.entries())
        .sort((a, b) => (a[1].hits || 0) - (b[1].hits || 0))
        .slice(0, Math.ceil(this.maxSize * 0.15));
      
      entries.forEach(([key]) => {
        this.memoryCache.delete(key);
        try {
          localStorage.removeItem(this.STORAGE_PREFIX + key);
        } catch (e) {
          // Silenciar errores
        }
      });
    }
  }

  /**
   * Limpiar entradas antiguas cuando localStorage está lleno
   */
  private cleanOldEntries(): void {
    const entries = Array.from(this.memoryCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Eliminar el 30% más antiguo
    const toRemove = Math.ceil(entries.length * 0.3);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [key] = entries[i];
      this.memoryCache.delete(key);
      try {
        localStorage.removeItem(this.STORAGE_PREFIX + key);
      } catch (e) {
        console.warn('[ServiciosCache] Error removing old entry:', e);
      }
    }
  }

  /**
   * Limpiar todo el cache (memoria + localStorage)
   */
  clear(pattern?: string): void {
    if (!pattern) {
      // Limpiar todo
      this.memoryCache.clear();
      try {
        // Limpiar localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.warn('[ServiciosCache] Error clearing localStorage:', e);
      }
      return;
    }

    // Limpiar por patrón
    const keys = Array.from(this.memoryCache.keys());
    
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
        try {
          localStorage.removeItem(this.STORAGE_PREFIX + key);
        } catch (e) {
          // Silenciar errores de localStorage
        }
      }
    });
  }

  /**
   * Verificar si existe entrada en cache válida
   */
  has(type: keyof typeof SERVICIOS_CACHE_TTL, identifier: string | Record<string, any>): boolean {
    return this.get(type, identifier) !== null;
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats(): CacheStats {
    const entries = this.memoryCache.size;
    let totalSize = 0;

    // Calcular tamaño aproximado
    this.memoryCache.forEach((entry) => {
      try {
        totalSize += JSON.stringify(entry).length;
      } catch (e) {
        // Ignorar errores de serialización
      }
    });

    const sizeKB = (totalSize / 1024).toFixed(2);
    const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
    const size = totalSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      entries,
      size
    };
  }

  /**
   * Obtener hit rate del cache
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    if (total === 0) return 0;
    return (this.stats.hits / total) * 100;
  }

  /**
   * Resetear estadísticas
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0 };
    this.saveStats();
  }

  /**
   * Obtener todas las entradas del cache (para debug)
   */
  getAllEntries(): Array<{ key: string; age: number; hits: number }> {
    const entries: Array<{ key: string; age: number; hits: number }> = [];
    const now = Date.now();

    this.memoryCache.forEach((entry, key) => {
      entries.push({
        key,
        age: Math.round((now - entry.timestamp) / 1000),
        hits: entry.hits
      });
    });

    return entries.sort((a, b) => b.hits - a.hits);
  }
}

// ============================================
// INSTANCIA GLOBAL DEL CACHE
// ============================================

const serviciosCache = new ServiciosCacheManager(50);

// Limpiar recursos al cerrar la página
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    serviciosCache.destroy();
  });
}

export default serviciosCache;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtener servicio del cache o hacer fetch
 */
export async function getCachedServicio(
  slug: string,
  fetcher: () => Promise<Servicio>
): Promise<Servicio> {
  const cached = serviciosCache.get<Servicio>('SERVICIO_DETAIL', slug);
  if (cached) return cached;

  const data = await fetcher();
  serviciosCache.set('SERVICIO_DETAIL', slug, data);
  return data;
}

/**
 * Obtener lista de servicios del cache o hacer fetch
 */
export async function getCachedServicios(
  filters: Record<string, any>,
  fetcher: () => Promise<Servicio[]>
): Promise<Servicio[]> {
  const cached = serviciosCache.get<Servicio[]>('SERVICIOS_LIST', filters);
  if (cached) return cached;

  const data = await fetcher();
  serviciosCache.set('SERVICIOS_LIST', filters, data);
  return data;
}

/**
 * Invalidar cache de servicios (útil después de actualizaciones)
 */
export function invalidateServiciosCache(pattern?: string): void {
  serviciosCache.clear(pattern);
}

/**
 * Obtener estadísticas del cache
 */
export function getServiciosCacheStats() {
  return {
    ...serviciosCache.getStats(),
    hitRate: serviciosCache.getHitRate().toFixed(1) + '%',
    entries: serviciosCache.getAllEntries()
  };
}