/**
 * 🗄️ Sistema de Cache para Categorías
 * 
 * Evita recargas innecesarias de categorías al navegar entre páginas
 * Implementa estrategia de cache con TTL (Time To Live) + localStorage
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  entries: number;
}

/**
 * Configuración de TTL por tipo de contenido
 * Las categorías cambian poco, por lo que podemos cachear más tiempo
 */
export const CATEGORIAS_CACHE_TTL = {
  CATEGORIAS_LIST: 30 * 60 * 1000,          // 30 minutos - Lista completa
  CATEGORIAS_ACTIVAS: 30 * 60 * 1000,       // 30 minutos - Solo activas
  CATEGORIA_DETAIL: 60 * 60 * 1000,         // 1 hora - Detalle individual
} as const;

/**
 * Cache Manager para Categorías con soporte para TTL, localStorage y estadísticas
 */
class CategoriasCacheManager {
  private memoryCache: Map<string, CacheEntry<any>>;
  private stats: { hits: number; misses: number };
  private maxSize: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private readonly STORAGE_PREFIX = 'categoriasCache_';
  private readonly STATS_KEY = 'categoriasCache_stats';

  constructor(maxSize = 20) {
    this.memoryCache = new Map();
    this.stats = this.loadStats();
    this.maxSize = maxSize;
    
    // Limpiar cada 5 minutos
    this.cleanupTimer = setInterval(() => this.cleanExpired(), 5 * 60 * 1000);
    
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
   * Cargar entradas de localStorage a memoria
   */
  private loadFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this.STORAGE_PREFIX));
      
      for (const key of keys) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<any> = JSON.parse(stored);
            const cacheKey = key.replace(this.STORAGE_PREFIX, '');
            
            // Solo cargar si no está expirado
            const ttl = this.getTTLForKey(cacheKey);
            if (Date.now() - entry.timestamp < ttl) {
              this.memoryCache.set(cacheKey, entry);
            } else {
              // Limpiar entrada expirada
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          // Entrada corrupta, eliminar
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      // Silenciar errores
    }
  }

  /**
   * Obtener TTL basado en el tipo de clave
   */
  private getTTLForKey(cacheKey: string): number {
    if (cacheKey.includes('CATEGORIAS_ACTIVAS')) {
      return CATEGORIAS_CACHE_TTL.CATEGORIAS_ACTIVAS;
    }
    if (cacheKey.includes('CATEGORIA_DETAIL')) {
      return CATEGORIAS_CACHE_TTL.CATEGORIA_DETAIL;
    }
    return CATEGORIAS_CACHE_TTL.CATEGORIAS_LIST;
  }

  /**
   * Generar clave de cache
   */
  private generateKey(
    type: keyof typeof CATEGORIAS_CACHE_TTL,
    identifier: string | Record<string, any>
  ): string {
    const id = typeof identifier === 'string' 
      ? identifier 
      : JSON.stringify(identifier);
    return `${type}_${id}`;
  }

  /**
   * Obtener datos del cache
   */
  get<T>(
    type: keyof typeof CATEGORIAS_CACHE_TTL,
    identifier: string | Record<string, any>
  ): T | null {
    const key = this.generateKey(type, identifier);
    const ttl = CATEGORIAS_CACHE_TTL[type];

    // 1. Buscar en memoria primero
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      const age = Date.now() - memoryEntry.timestamp;
      if (age < ttl) {
        memoryEntry.hits++;
        this.stats.hits++;
        return memoryEntry.data;
      } else {
        // Expirado, eliminar
        this.memoryCache.delete(key);
        this.removeFromLocalStorage(key);
      }
    }

    // 2. Buscar en localStorage
    try {
      const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        const age = Date.now() - entry.timestamp;
        
        if (age < ttl) {
          // Restaurar a memoria
          entry.hits++;
          this.memoryCache.set(key, entry);
          this.stats.hits++;
          return entry.data;
        } else {
          // Expirado, eliminar
          localStorage.removeItem(this.STORAGE_PREFIX + key);
        }
      }
    } catch (e) {
      // Error de localStorage, continuar sin cache
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Guardar datos en cache
   */
  set<T>(
    type: keyof typeof CATEGORIAS_CACHE_TTL,
    identifier: string | Record<string, any>,
    data: T
  ): void {
    const key = this.generateKey(type, identifier);

    // Evitar exceder el tamaño máximo
    if (this.memoryCache.size >= this.maxSize) {
      this.evictOldest();
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
      // Si localStorage está lleno, limpiar y reintentar
      this.cleanLocalStorage();
      try {
        localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(entry));
      } catch (e2) {
        // No se pudo guardar, continuar solo con memoria
      }
    }

    this.saveStats();
  }

  /**
   * Eliminar del localStorage
   */
  private removeFromLocalStorage(key: string): void {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch (e) {
      // Silenciar
    }
  }

  /**
   * Eliminar la entrada más antigua
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
      this.removeFromLocalStorage(oldestKey);
    }
  }

  /**
   * Limpiar entradas expiradas
   */
  cleanExpired(): void {
    const now = Date.now();

    for (const [key, entry] of this.memoryCache.entries()) {
      const ttl = this.getTTLForKey(key);
      if (now - entry.timestamp > ttl) {
        this.memoryCache.delete(key);
        this.removeFromLocalStorage(key);
      }
    }

    this.saveStats();
  }

  /**
   * Limpiar localStorage de categorías
   */
  private cleanLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this.STORAGE_PREFIX));
      const now = Date.now();
      
      for (const key of keys) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<any> = JSON.parse(stored);
            const cacheKey = key.replace(this.STORAGE_PREFIX, '');
            const ttl = this.getTTLForKey(cacheKey);
            
            if (now - entry.timestamp > ttl) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      // Silenciar
    }
  }

  /**
   * Invalidar todo el cache de categorías
   */
  invalidateAll(): void {
    // Limpiar memoria
    this.memoryCache.clear();
    
    // Limpiar localStorage
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this.STORAGE_PREFIX));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      // Silenciar
    }
  }

  /**
   * Invalidar por tipo
   */
  invalidateByType(type: keyof typeof CATEGORIAS_CACHE_TTL): void {
    const prefix = type;
    
    // Limpiar memoria
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
        this.removeFromLocalStorage(key);
      }
    }
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats(): CacheStats {
    return {
      ...this.stats,
      entries: this.memoryCache.size
    };
  }
}

// Instancia singleton del cache
const categoriasCache = new CategoriasCacheManager();

// Función helper para invalidar cache
export const invalidateCategoriasCache = () => {
  categoriasCache.invalidateAll();
};

// Exportar para uso en hooks
export default categoriasCache;
