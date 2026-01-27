/**
 * 🗄️ Sistema de Cache para Blog Frontend
 * 
 * Evita recargas innecesarias al navegar entre páginas
 * Implementa estrategia de cache con TTL (Time To Live)
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

// Modo debug solo en desarrollo
const DEBUG = import.meta.env.DEV && false; // Cambiar a true para debug

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
 * Blog público: Contenido casi estático (actualiza muy raramente)
 * ✅ Optimizado para mejor UX: TTL largos porque el contenido público cambia poco
 */
const CACHE_TTL = {
  POST_DETAIL: 7 * 24 * 60 * 60 * 1000,   // 7 días - Posts individuales (contenido estable)
  POST_LIST: 24 * 60 * 60 * 1000,         // 24 horas - Listados de posts
  FEATURED: 3 * 24 * 60 * 60 * 1000,      // 3 días - Posts destacados
  POPULAR: 24 * 60 * 60 * 1000,           // 24 horas - Posts populares
  CATEGORIES: 7 * 24 * 60 * 60 * 1000,    // 7 días - Categorías (muy estables)
  TAGS: 7 * 24 * 60 * 60 * 1000,          // 7 días - Tags (muy estables)
  SEARCH: 4 * 60 * 60 * 1000,             // 4 horas - Búsqueda
  COMMENTS: 15 * 60 * 1000,               // 15 minutos - Comentarios (más dinámicos)
} as const;

/**
 * Cache Manager con soporte para TTL y estadísticas
 */
class BlogCacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private stats: { hits: number; misses: number };
  private maxSize: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null; // ✅ Timer reference

  constructor(maxSize = 100) {
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
    this.maxSize = maxSize;
    
    // ✅ Guardar referencia del timer para cleanup
    this.cleanupTimer = setInterval(() => this.cleanExpired(), 60 * 1000);
  }

  /**
   * ✅ Método para limpiar recursos y evitar memory leaks
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
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
   * Obtener datos del cache
   */
  get<T>(type: keyof typeof CACHE_TTL, identifier: string | Record<string, any>): T | null {
    const key = this.generateKey(type, identifier);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const ttl = CACHE_TTL[type];
    const age = Date.now() - entry.timestamp;

    // Si expiró, eliminar y retornar null
    if (age > ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Cache hit
    this.stats.hits++;
    entry.hits++;
    
    if (import.meta.env.DEV) {
      if (DEBUG) console.log(`✅ Cache HIT: ${key} (age: ${Math.round(age / 1000)}s, hits: ${entry.hits})`);
    }

    return entry.data as T;
  }

  /**
   * Guardar datos en cache
   */
  set<T>(type: keyof typeof CACHE_TTL, identifier: string | Record<string, any>, data: T): void {
    const key = this.generateKey(type, identifier);

    // Si llegamos al límite, eliminar el más antiguo
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0]?.[0];
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
        if (import.meta.env.DEV) {
          if (DEBUG) console.log(`🗑️ Cache eviction: ${oldestKey}`);
        }
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
    });

    if (import.meta.env.DEV) {
      if (DEBUG) console.log(`💾 Cache SET: ${key}`);
    }
  }

  /**
   * Invalidar entrada específica
   */
  invalidate(type: keyof typeof CACHE_TTL, identifier: string | Record<string, any>): void {
    const key = this.generateKey(type, identifier);
    const deleted = this.cache.delete(key);
    
    if (deleted && import.meta.env.DEV) {
      if (DEBUG) console.log(`🗑️ Cache invalidated: ${key}`);
    }
  }

  /**
   * Invalidar todas las entradas de un tipo
   */
  invalidateType(type: keyof typeof CACHE_TTL): void {
    const prefix = `${type}:`;
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    if (import.meta.env.DEV && deleted > 0) {
      if (DEBUG) console.log(`🗑️ Cache invalidated ${deleted} entries of type: ${type}`);
    }
  }

  /**
   * Invalidar múltiples tipos relacionados
   */
  invalidateRelated(types: (keyof typeof CACHE_TTL)[]): void {
    types.forEach(type => this.invalidateType(type));
  }

  /**
   * Limpiar cache expirado
   */
  private cleanExpired(): void {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const type = key.split(':')[0] as keyof typeof CACHE_TTL;
      const ttl = CACHE_TTL[type];
      const age = now - entry.timestamp;

      if (age > ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (import.meta.env.DEV && cleaned > 0) {
      if (DEBUG) console.log(`🧹 Cache cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Limpiar todo el cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    
    if (import.meta.env.DEV) {
      if (DEBUG) console.log(`🗑️ Cache cleared (${size} entries removed)`);
    }
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats(): CacheStats {
    const totalSize = JSON.stringify(Array.from(this.cache.entries())).length;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      entries: this.cache.size,
      size: `${(totalSize / 1024).toFixed(2)} KB`,
    };
  }

  /**
   * Obtener tasa de hits del cache
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : (this.stats.hits / total) * 100;
  }

  /**
   * Precargar datos en cache
   */
  preload<T>(type: keyof typeof CACHE_TTL, identifier: string | Record<string, any>, data: T): void {
    this.set(type, identifier, data);
  }
}

// Instancia singleton del cache
const blogCache = new BlogCacheManager(100);

/**
 * Invalidar cache cuando se crea/actualiza/elimina contenido
 * ✅ Usado automáticamente por operaciones admin
 */
export const invalidateOnMutation = (mutationType: 'post' | 'comment' | 'category' | 'tag'): void => {
  console.log(`🗑️ [BlogCache] Invalidando caché por mutación: ${mutationType}`);
  
  switch (mutationType) {
    case 'post':
      // Invalidar todo lo relacionado con posts
      blogCache.invalidateRelated(['POST_LIST', 'POST_DETAIL', 'FEATURED', 'POPULAR', 'SEARCH']);
      break;
    case 'comment':
      blogCache.invalidateType('COMMENTS');
      break;
    case 'category':
      blogCache.invalidateType('CATEGORIES');
      blogCache.invalidateType('POST_LIST'); // Posts usan categorías
      break;
    case 'tag':
      blogCache.invalidateType('TAGS');
      blogCache.invalidateType('POST_LIST'); // Posts usan tags
      break;
  }
};

/**
 * Invalidar TODO el caché del blog
 * Útil para forzar actualización completa desde admin
 */
export const invalidateAllBlogCache = (): void => {
  console.log('🗑️ [BlogCache] Invalidando TODO el caché del blog');
  blogCache.clear();
};

/**
 * Hook personalizado para usar cache en componentes
 */
export const useBlogCache = () => {
  return {
    get: blogCache.get.bind(blogCache),
    set: blogCache.set.bind(blogCache),
    invalidate: blogCache.invalidate.bind(blogCache),
    invalidateType: blogCache.invalidateType.bind(blogCache),
    clear: blogCache.clear.bind(blogCache),
    getStats: blogCache.getStats.bind(blogCache),
    getHitRate: blogCache.getHitRate.bind(blogCache),
  };
};

// Exponer en window para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  (window as any).__blogCache = {
    stats: () => {
      const stats = blogCache.getStats();
      const hitRate = blogCache.getHitRate();
      console.table({
        ...stats,
        hitRate: `${hitRate.toFixed(2)}%`,
      });
    },
    clear: () => blogCache.clear(),
  };
  
  // console.log('💡 Blog Cache Debug: Usa __blogCache.stats() o __blogCache.clear()');
}

export default blogCache;
