/**
 * 🚀 Dashboard Cache Utilities
 * Sistema de cache centralizado para módulos del dashboard
 */

// ============================================
// CACHE DURATIONS CONFIGURATION
// ============================================

export const DASHBOARD_CACHE_DURATIONS = {
  // BLOQUE 1 - Core Admin Features
  PROFILE: 4 * 60 * 60 * 1000,        // 4 horas (datos personales)
  USER_MANAGEMENT: 30 * 60 * 1000,    // 30 minutos (datos dinámicos)
  AI_AGENTS: 2 * 60 * 60 * 1000,      // 2 horas (configuración)
  
  // BLOQUE 2 - Content Management  
  CMS_CONTENT: 1 * 60 * 60 * 1000,    // 1 hora (contenido web)
  MEDIA_LIBRARY: 2 * 60 * 60 * 1000,  // 2 horas (archivos estáticos)
  BLOG_STATS: 1 * 60 * 60 * 1000,     // 1 hora (estadísticas blog)
  SERVICES: 0,                        // ⚠️ SIN CACHE - Respeta CacheConfig del backend
  
  // BLOQUE 3 - Business Operations
  CRM_DATA: 5 * 60 * 1000,            // 5 minutos (datos negocio)
  LEADS: 10 * 60 * 1000,              // 10 minutos (leads dinámicos)
  SETTINGS: 6 * 60 * 60 * 1000,       // 6 horas (preferencias usuario)
  
  // Sin cache (tiempo real)
  MESSAGES: 0,                         // Mensajería en tiempo real
};

// ============================================
// CACHE INTERFACE
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class DashboardCache {
  private memoryCache = new Map<string, CacheEntry<any>>();
  
  /**
   * Obtiene datos del cache con verificación de localStorage + memoria
   */
  get<T>(key: string, duration: number): T | null {
    // 1. Verificar localStorage primero (persiste entre recargas)
    try {
      const localStorageKey = `dashboardCache_${key}`;
      const localData = localStorage.getItem(localStorageKey);
      
      if (localData) {
        const { data, timestamp } = JSON.parse(localData);
        const age = Date.now() - timestamp;
        
        if (age < duration) {
          // También guardar en memoria para acceso rápido
          this.memoryCache.set(key, { data, timestamp });
          return data;
        }
      }
    } catch (e) {
      console.error(`Error parseando localStorage para ${key}:`, e);
    }

    // 2. Verificar cache en memoria
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      const age = Date.now() - memoryEntry.timestamp;
      if (age < duration) {
        return memoryEntry.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    return null;
  }

  /**
   * Guarda datos en ambos cache (localStorage + memoria)
   */
  set<T>(key: string, data: T): void {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };

    // Guardar en memoria
    this.memoryCache.set(key, cacheEntry);

    // Guardar en localStorage
    try {
      const localStorageKey = `dashboardCache_${key}`;
      localStorage.setItem(localStorageKey, JSON.stringify(cacheEntry));
    } catch (e) {
      console.error(`Error guardando en localStorage para ${key}:`, e);
    }
  }

  /**
   * Limpia cache por patrón
   */
  clear(pattern?: string): void {
    if (!pattern) {
      this.memoryCache.clear();
      // Limpiar todo localStorage de dashboard
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dashboardCache_')) {
          localStorage.removeItem(key);
        }
      }
      return;
    }

    // Limpiar por patrón específico
    const keys = Array.from(this.memoryCache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    });

    // Limpiar localStorage por patrón
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.includes('dashboardCache') && key.includes(pattern)) {
        localStorage.removeItem(key);
      }
    }
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats() {
    const memorySize = this.memoryCache.size;
    const localStorageEntries = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('dashboardCache_')) {
        localStorageEntries.push(key);
      }
    }

    return {
      memoryEntries: memorySize,
      localStorageEntries: localStorageEntries.length,
      keys: {
        memory: Array.from(this.memoryCache.keys()),
        localStorage: localStorageEntries
      }
    };
  }
}

// ============================================
// INSTANCIA GLOBAL
// ============================================

export const dashboardCache = new DashboardCache();

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Limpia todo el cache del dashboard
 */
export const clearDashboardCache = (pattern?: string) => {
  dashboardCache.clear(pattern);
  console.log(`🗑️ Dashboard cache cleared${pattern ? ` (pattern: ${pattern})` : ''}`);
};

/**
 * Obtiene información del cache para debugging
 */
export const getDashboardCacheInfo = () => {
  const stats = dashboardCache.getStats();
  console.log('📊 Dashboard Cache Stats:', stats);
  return stats;
};