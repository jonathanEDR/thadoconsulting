/**
 * 📦 Content Management Cache Utilities
 * Gestión centralizada de cache para módulos de contenido
 * (CMS, Media, Blog, Services)
 */

// ============================================
// CONFIGURACIÓN DE DURACIONES DE CACHE
// ============================================

export const CONTENT_CACHE_DURATIONS = {
  // CMS
  CMS_PAGES: 1 * 60 * 60 * 1000,        // 1 hora - páginas editoriales
  CMS_CATEGORIES: 2 * 60 * 60 * 1000,  // 2 horas - categorías (cambian menos)
  CMS_THEMES: 2 * 60 * 60 * 1000,      // 2 horas - temas

  // Media Library
  MEDIA_METADATA: 2 * 60 * 60 * 1000,   // 2 horas - metadatos de imágenes
  MEDIA_THUMBS: 4 * 60 * 60 * 1000,    // 4 horas - miniaturas (casi nunca cambian)
  MEDIA_FOLDER_LIST: 2 * 60 * 60 * 1000, // 2 horas - listado por carpeta

  // Blog
  BLOG_POSTS: 1 * 60 * 60 * 1000,      // 1 hora - posts (drafts/published)
  BLOG_SEARCH: 30 * 60 * 1000,         // 30 minutos - búsquedas (dinámicas)
  BLOG_CATEGORIES: 1 * 60 * 60 * 1000, // 1 hora - categorías del blog
  BLOG_TAGS: 1 * 60 * 60 * 1000,       // 1 hora - tags del blog

  // Services - ⚠️ SIN CACHE para respetar CacheConfig del backend
  SERVICES_LIST: 0,                    // ⚠️ SIN CACHE - Respeta backend
  SERVICES_BY_CATEGORY: 0,             // ⚠️ SIN CACHE - Respeta backend
  SERVICES_PORTFOLIO: 0,               // ⚠️ SIN CACHE - Respeta backend
} as const;

// ============================================
// TIPOS DE INTERFAZ
// ============================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export interface CacheOptions {
  duration?: number;
  namespace?: string;
}

// ============================================
// NAMESPACE PARA CACHE (para aislar por módulo)
// ============================================

export const CACHE_NAMESPACES = {
  CMS: 'cms_',
  MEDIA: 'media_',
  BLOG: 'blog_',
  SERVICES: 'services_',
} as const;

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Genera una clave de cache con namespace
 */
export const generateCacheKey = (
  baseKey: string,
  namespace: string = '',
  ...params: (string | number | boolean)[]
): string => {
  const cleanParams = params.filter((p) => p !== undefined && p !== null).join('_');
  const suffix = cleanParams ? `_${cleanParams}` : '';
  return `${namespace}${baseKey}${suffix}`;
};

/**
 * Obtiene un item del cache
 */
export const getCacheItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const cacheEntry: CacheEntry<T> = JSON.parse(item);

    // Verificar si ha expirado
    if (Date.now() > cacheEntry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    console.error(`❌ [Cache] Error al obtener ${key}:`, error);
    return null;
  }
};

/**
 * Guarda un item en el cache
 */
export const setCacheItem = <T>(
  key: string,
  data: T,
  duration?: number
): void => {
  try {
    const expiresAt = Date.now() + (duration || 60 * 60 * 1000); // 1 hora por defecto

    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt,
      key,
    };

    localStorage.setItem(key, JSON.stringify(cacheEntry));
    // console.log(`✅ [Cache] Guardado: ${key} (expira en ${Math.round(duration! / 60000)}min)`);
  } catch (error) {
    console.error(`❌ [Cache] Error al guardar ${key}:`, error);
  }
};

/**
 * Invalida un cache específico
 */
export const invalidateCacheKey = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ [Cache] Invalidado: ${key}`);
  } catch (error) {
    console.error(`❌ [Cache] Error al invalidar ${key}:`, error);
  }
};

/**
 * Invalida todos los caches que coincidan con un patrón
 */
export const invalidateCachePattern = (pattern: string): void => {
  try {
    const keys = Object.keys(localStorage);
    const regex = new RegExp(pattern);
    let count = 0;

    keys.forEach((key) => {
      if (regex.test(key)) {
        localStorage.removeItem(key);
        count++;
      }
    });

    console.log(`🗑️ [Cache] Invalidados ${count} items con patrón: ${pattern}`);
  } catch (error) {
    console.error(`❌ [Cache] Error al invalidar patrón ${pattern}:`, error);
  }
};

/**
 * Limpia todos los caches de un namespace
 */
export const clearCacheNamespace = (namespace: string): void => {
  invalidateCachePattern(`^${namespace}`);
};

/**
 * Obtiene estadísticas del cache
 */
export const getCacheStats = (): {
  totalItems: number;
  byNamespace: Record<string, number>;
  oldestExpiry: number;
  newestExpiry: number;
} => {
  try {
    const keys = Object.keys(localStorage);
    const stats = {
      totalItems: 0,
      byNamespace: {} as Record<string, number>,
      oldestExpiry: Infinity,
      newestExpiry: 0,
    };

    keys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (!item) return;

      try {
        const parsed = JSON.parse(item);
        if (parsed.expiresAt) {
          stats.totalItems++;
          stats.oldestExpiry = Math.min(stats.oldestExpiry, parsed.expiresAt);
          stats.newestExpiry = Math.max(stats.newestExpiry, parsed.expiresAt);

          // Contar por namespace
          const namespace = Object.values(CACHE_NAMESPACES).find((ns) => key.startsWith(ns)) || 'other';
          stats.byNamespace[namespace] = (stats.byNamespace[namespace] || 0) + 1;
        }
      } catch {
        // Ignorar items que no son cache válido
      }
    });

    return stats;
  } catch (error) {
    console.error('❌ [Cache] Error al obtener estadísticas:', error);
    return { totalItems: 0, byNamespace: {}, oldestExpiry: Infinity, newestExpiry: 0 };
  }
};

// ============================================
// FUNCIONES ESPECÍFICAS POR MÓDULO
// ============================================

/**
 * Cache para CMS - Páginas
 */
export const cms = {
  getPages: <T>(pageSlug: string = 'home'): T | null =>
    getCacheItem<T>(generateCacheKey(`pages_${pageSlug}`, CACHE_NAMESPACES.CMS)),

  setPages: <T>(data: T, pageSlug: string = 'home'): void =>
    setCacheItem<T>(
      generateCacheKey(`pages_${pageSlug}`, CACHE_NAMESPACES.CMS),
      data,
      CONTENT_CACHE_DURATIONS.CMS_PAGES
    ),

  invalidatePages: (pageSlug?: string): void => {
    if (pageSlug) {
      invalidateCacheKey(generateCacheKey(`pages_${pageSlug}`, CACHE_NAMESPACES.CMS));
    } else {
      invalidateCachePattern(`^${CACHE_NAMESPACES.CMS}pages_`);
    }
  },
};

/**
 * Cache para Media Library
 */
export const media = {
  getFolderList: <T>(folder: string = 'root', page: number = 1, limit: number = 20): T | null =>
    getCacheItem<T>(generateCacheKey(`folder_list`, CACHE_NAMESPACES.MEDIA, folder, page, limit)),

  setFolderList: <T>(data: T, folder: string = 'root', page: number = 1, limit: number = 20): void =>
    setCacheItem<T>(
      generateCacheKey(`folder_list`, CACHE_NAMESPACES.MEDIA, folder, page, limit),
      data,
      CONTENT_CACHE_DURATIONS.MEDIA_FOLDER_LIST
    ),

  invalidateFolder: (folder?: string): void => {
    if (folder) {
      invalidateCachePattern(`^${CACHE_NAMESPACES.MEDIA}folder_list_${folder}`);
    } else {
      invalidateCachePattern(`^${CACHE_NAMESPACES.MEDIA}folder_list_`);
    }
  },

  getMetadata: <T>(imageId: string): T | null =>
    getCacheItem<T>(generateCacheKey(`metadata`, CACHE_NAMESPACES.MEDIA, imageId)),

  setMetadata: <T>(data: T, imageId: string): void =>
    setCacheItem<T>(
      generateCacheKey(`metadata`, CACHE_NAMESPACES.MEDIA, imageId),
      data,
      CONTENT_CACHE_DURATIONS.MEDIA_METADATA
    ),

  invalidateMetadata: (imageId?: string): void => {
    if (imageId) {
      invalidateCacheKey(generateCacheKey(`metadata`, CACHE_NAMESPACES.MEDIA, imageId));
    } else {
      invalidateCachePattern(`^${CACHE_NAMESPACES.MEDIA}metadata_`);
    }
  },
};

/**
 * Cache para Blog Dashboard
 */
export const blog = {
  getPosts: <T>(status: string = 'all', page: number = 1): T | null =>
    getCacheItem<T>(generateCacheKey(`posts`, CACHE_NAMESPACES.BLOG, status, page)),

  setPosts: <T>(data: T, status: string = 'all', page: number = 1): void =>
    setCacheItem<T>(
      generateCacheKey(`posts`, CACHE_NAMESPACES.BLOG, status, page),
      data,
      CONTENT_CACHE_DURATIONS.BLOG_POSTS
    ),

  getSearch: <T>(query: string, page: number = 1): T | null =>
    getCacheItem<T>(generateCacheKey(`search`, CACHE_NAMESPACES.BLOG, query, page)),

  setSearch: <T>(data: T, query: string, page: number = 1): void =>
    setCacheItem<T>(
      generateCacheKey(`search`, CACHE_NAMESPACES.BLOG, query, page),
      data,
      CONTENT_CACHE_DURATIONS.BLOG_SEARCH
    ),

  invalidatePosts: (): void => {
    invalidateCachePattern(`^${CACHE_NAMESPACES.BLOG}posts_`);
  },

  invalidateSearch: (query?: string): void => {
    if (query) {
      invalidateCachePattern(`^${CACHE_NAMESPACES.BLOG}search_${query}`);
    } else {
      invalidateCachePattern(`^${CACHE_NAMESPACES.BLOG}search_`);
    }
  },

  invalidateAll: (): void => {
    invalidateCachePattern(`^${CACHE_NAMESPACES.BLOG}`);
  },
};

/**
 * Cache para Services Management
 */
export const services = {
  getList: <T>(filters: string = 'all', page: number = 1): T | null =>
    getCacheItem<T>(generateCacheKey(`list`, CACHE_NAMESPACES.SERVICES, filters, page)),

  setList: <T>(data: T, filters: string = 'all', page: number = 1): void =>
    setCacheItem<T>(
      generateCacheKey(`list`, CACHE_NAMESPACES.SERVICES, filters, page),
      data,
      CONTENT_CACHE_DURATIONS.SERVICES_LIST
    ),

  invalidateList: (): void => {
    invalidateCachePattern(`^${CACHE_NAMESPACES.SERVICES}list_`);
  },

  getByCategory: <T>(category: string, page: number = 1): T | null =>
    getCacheItem<T>(generateCacheKey(`category`, CACHE_NAMESPACES.SERVICES, category, page)),

  setByCategory: <T>(data: T, category: string, page: number = 1): void =>
    setCacheItem<T>(
      generateCacheKey(`category`, CACHE_NAMESPACES.SERVICES, category, page),
      data,
      CONTENT_CACHE_DURATIONS.SERVICES_BY_CATEGORY
    ),

  invalidateByCategory: (category?: string): void => {
    if (category) {
      invalidateCachePattern(`^${CACHE_NAMESPACES.SERVICES}category_${category}`);
    } else {
      invalidateCachePattern(`^${CACHE_NAMESPACES.SERVICES}category_`);
    }
  },

  invalidateAll: (): void => {
    invalidateCachePattern(`^${CACHE_NAMESPACES.SERVICES}`);
  },
};
