const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========== CACHE CONFIGURATION ==========
// Diferentes duraciones según el tipo de contenido
// ✅ Optimizado para páginas públicas que cambian raramente
const CACHE_DURATIONS = {
  // 🌐 Páginas públicas - SEO puede cambiar desde CMS, cache moderado
  PUBLIC_PAGES: 1 * 60 * 60 * 1000,      // 1 hora (permite ver cambios SEO del CMS rápidamente)
  PUBLIC_FOOTER: 1 * 60 * 60 * 1000,     // 1 hora
  
  // 📝 Contenido semi-estático
  BLOG_POSTS: 24 * 60 * 60 * 1000,       // 24 horas
  SERVICES: 24 * 60 * 60 * 1000,         // 24 horas
  
  // 🔐 Datos administrativos - Contenido dinámico (cambia frecuentemente)
  ADMIN_DATA: 2 * 60 * 1000,             // 2 minutos
  
  // 🔄 Datos en tiempo real
  REALTIME: 0,                            // Sin cache
};

// ========== CACHE IMPLEMENTATION ==========
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class RequestCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_DURATION = CACHE_DURATIONS.PUBLIC_PAGES;

  get<T>(key: string, customDuration?: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const duration = customDuration ?? this.DEFAULT_DURATION;
    const age = Date.now() - entry.timestamp;
    
    if (age > duration) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  // ⚡ Nuevo: Obtener datos aunque estén expirados (para fallback)
  getStale<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry) {
      console.log('⚠️ [RequestCache.getStale] Retornando datos EXPIRADOS:', {
        key,
        age: Math.floor((Date.now() - entry.timestamp) / 1000) + 's'
      });
    }
    return entry ? entry.data : null;
  }
}

const cache = new RequestCache();

// ========== RETRY LOGIC ==========
interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const { maxRetries = 3, delay = 1000, backoff = true } = retryOptions;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Si la respuesta es exitosa o es un error del cliente (4xx), no reintentar
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Si es un error del servidor (5xx), reintentar
      throw new Error(`Server error: ${response.status}`);
    } catch (error) {
      lastError = error as Error;

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calcular delay con backoff exponencial
      const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;

      console.warn(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// ========== AUTH HELPER ==========
let getTokenFunction: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  getTokenFunction = getter;
};

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (getTokenFunction) {
    try {
      const token = await getTokenFunction();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
  }

  return headers;
}

// ========== API FUNCTIONS ==========

// Obtener todas las páginas (con caché)
export const getAllPages = async (useCache = true) => {
  const cacheKey = 'all-pages';

  // Intentar obtener del caché
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await fetchWithRetry(`${API_URL}/cms/pages`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al obtener páginas');
    }

    // Guardar en caché
    cache.set(cacheKey, data.data);

    return data.data;
  } catch (error) {
    console.error('Error en getAllPages:', error);
    throw error;
  }
};

// Obtener una página por slug (con caché y retry)
export const getPageBySlug = async (slug: string, useCache = true) => {
  const cacheKey = `page-${slug}`;
  const localStorageKey = `cmsCache_${cacheKey}`;
  
  // ⚡ Duración de caché según tipo de página
  // Páginas públicas: 8 horas (contenido estático)
  const CACHE_DURATION = CACHE_DURATIONS.PUBLIC_PAGES;

  // ⚡ PRIMERO: Verificar localStorage (persiste entre recargas)
  if (useCache) {
    try {
      const localData = localStorage.getItem(localStorageKey);
      if (localData) {
        const { data, timestamp } = JSON.parse(localData);
        const age = Date.now() - timestamp;
        
        if (age < CACHE_DURATION) {
          cache.set(cacheKey, data);
          return data;
        }
      }
    } catch (e) {
      console.error('Error parseando localStorage:', e);
    }
  }

  // ⚡ SEGUNDO: Intentar obtener del caché en memoria
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/cms/pages/${slug}`,
      {},
      { maxRetries: 2, delay: 500 }
    );
    const data = await response.json();

    if (!data.success) {
      // 🔥 NUEVO: Distinguir entre 404 (página no existe) y otros errores
      // Si es 404, NO usar cache - propagar el error para que useCmsData use el fallback específico
      const error = new Error(data.message || 'Error al obtener página');
      (error as any).isNotFound = data.message?.includes('no encontrada') || response.status === 404;
      throw error;
    }

    // Guardar en RequestCache (memoria)
    cache.set(cacheKey, data.data);

    // ✅ También guardar en localStorage (persiste entre recargas)
    try {
      localStorage.setItem(localStorageKey, JSON.stringify({
        data: data.data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }

    return data.data;
  } catch (error: any) {
    // Solo loguear errores en desarrollo
    if (import.meta.env.DEV) {
      console.error('Error obteniendo página:', error);
    }
    
    // 🔥 NUEVO: Si es un error 404 (página no existe), NO usar cache
    // Propagar el error para que useCmsData use el fallback específico de la página
    if (error?.isNotFound) {
      console.log(`🚫 [CMS API] Página "${slug}" no existe en la base de datos, propagando error para usar fallback`);
      // Limpiar cualquier cache corrupto para esta página
      try {
        localStorage.removeItem(localStorageKey);
        cache.clear(cacheKey);
      } catch (e) {
        // Ignorar errores de limpieza
      }
      throw error;
    }
    
    // ⚡ Solo para errores de RED (no 404): Intentar usar datos en caché aunque estén expirados
    const staleData = cache.getStale(cacheKey);
    if (staleData) {
      if (import.meta.env.DEV) {
        console.warn('Usando datos expirados del RequestCache como fallback (error de red)');
      }
      return staleData;
    }

    // ⚡ Último recurso para errores de RED: localStorage aunque esté expirado
    try {
      const localData = localStorage.getItem(localStorageKey);
      if (localData) {
        const { data } = JSON.parse(localData);
        if (import.meta.env.DEV) {
          console.warn('Usando datos expirados del localStorage como fallback (error de red)');
        }
        return data;
      }
    } catch (e) {
      // Ignore
    }
    
    throw error;
  }
};

// Limpiar datos antes de enviar al backend
const cleanDataForBackend = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(cleanDataForBackend);
  }
  
  if (data && typeof data === 'object') {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Omitir _id problemáticos que contengan buffer
      if (key === '_id' && 
          value && 
          typeof value === 'object' && 
          'buffer' in value) {
        continue; // Omitir este _id problemático
      }
      
      cleaned[key] = cleanDataForBackend(value);
    }
    
    return cleaned;
  }
  
  return data;
};

// Actualizar contenido de una página (con auth)
export const updatePage = async (slug: string, pageData: any) => {
  try {
    const headers = await getAuthHeaders();
    
    // Limpiar datos antes de enviar
    const cleanedData = cleanDataForBackend(pageData);

    const response = await fetchWithRetry(
      `${API_URL}/cms/pages/${slug}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(cleanedData),
      },
      { maxRetries: 2 } // Menos reintentos para operaciones de escritura
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar página');
    }

    // Invalidar caché de esta página (memoria)
    cache.clear(`page-${slug}`);
    cache.clear('all-pages');

    // 🔥 CRÍTICO: También limpiar localStorage para forzar recarga fresca
    try {
      localStorage.removeItem(`cmsCache_page-${slug}`);
      console.log(`✅ [CMS] Cache de localStorage limpiado para "${slug}"`);
    } catch (e) {
      console.error('Error limpiando localStorage:', e);
    }

    return data.data;
  } catch (error) {
    console.error(`Error en updatePage (${slug}):`, error);
    throw error;
  }
};

// Inicializar página Home con datos por defecto (con auth)
export const initHomePage = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/cms/pages/init-home`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!data.success) {
      // Si ya existe, obtenerla
      if (data.message?.includes('ya está inicializada')) {
        return await getPageBySlug('home');
      }
      throw new Error(data.message || 'Error al inicializar página Home');
    }

    return data.data;
  } catch (error) {
    console.error('Error en initHomePage:', error);
    throw error;
  }
};

// Actualizar contenido parcial de una página por slug (merge de contenido)
export const updatePageBySlug = async (slug: string, partialData: { content?: Record<string, any> }) => {
  try {
    const headers = await getAuthHeaders();
    
    console.log('🔵 [updatePageBySlug] ========== INICIO ==========');
    console.log('🔵 [updatePageBySlug] Slug:', slug);
    console.log('🔵 [updatePageBySlug] partialData recibido:', JSON.stringify(partialData, null, 2));
    
    // Primero obtener la página actual para hacer merge
    console.log('🔵 [updatePageBySlug] Obteniendo página actual...');
    const currentPage = await getPageBySlug(slug, false);
    console.log('🔵 [updatePageBySlug] Página actual content:', currentPage?.content ? Object.keys(currentPage.content) : 'null');
    
    if (!currentPage) {
      throw new Error(`Página "${slug}" no encontrada`);
    }
    
    // Hacer merge del contenido existente con el nuevo
    const mergedContent = {
      ...currentPage.content,
      ...partialData.content
    };
    
    console.log('🔵 [updatePageBySlug] mergedContent keys:', Object.keys(mergedContent));
    console.log('🔵 [updatePageBySlug] dashboardSidebar en merged:', mergedContent.dashboardSidebar ? 'SÍ' : 'NO');
    if (mergedContent.dashboardSidebar) {
      console.log('🔵 [updatePageBySlug] Admin headerGradientFrom:', mergedContent.dashboardSidebar.admin?.headerGradientFrom);
    }
    
    console.log('🔵 [updatePageBySlug] Enviando PUT a:', `${API_URL}/cms/pages/${slug}`);
    const response = await fetchWithRetry(
      `${API_URL}/cms/pages/${slug}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ content: mergedContent }),
      },
      { maxRetries: 2 }
    );

    const data = await response.json();
    console.log('🔵 [updatePageBySlug] Respuesta del servidor:', data.success ? 'SUCCESS' : 'FAILED', data.message || '');

    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar página');
    }

    // Invalidar caché
    cache.clear(`page-${slug}`);
    cache.clear('all-pages');
    
    try {
      localStorage.removeItem(`cmsCache_page-${slug}`);
      console.log(`✅ [updatePageBySlug] Cache limpiado para "${slug}"`);
    } catch (e) {
      console.error('Error limpiando localStorage:', e);
    }

    console.log('🔵 [updatePageBySlug] ========== FIN ==========');
    return data.data;
  } catch (error) {
    console.error(`❌ [updatePageBySlug] Error (${slug}):`, error);
    throw error;
  }
};

// ⚡ Exportar función para limpiar caché manualmente
export const clearCache = (pattern?: string) => {
  console.log('🗑️ [clearCache] Limpiando caché:', { pattern: pattern || 'TODO' });
  
  // Limpiar RequestCache en memoria
  cache.clear(pattern);

  // ✅ NUEVO: También limpiar localStorage
  if (!pattern) {
    // Limpiar todo el localStorage que empiece con 'cmsCache_'
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cmsCache_')) {
        localStorage.removeItem(key);
        console.log('🗑️ [clearCache] Eliminado de localStorage:', key);
      }
    });
  } else {
    // Limpiar solo las keys que coincidan con el patrón
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cmsCache_') && key.includes(pattern)) {
        localStorage.removeItem(key);
        console.log('🗑️ [clearCache] Eliminado de localStorage:', key);
      }
    });
  }
};

// ⚡ Exportar función para forzar recarga sin caché
export const forceReload = async (slug: string) => {
  // Limpiar cache de memoria
  cache.clear(`page-${slug}`);
  // Limpiar localStorage también
  try {
    localStorage.removeItem(`cmsCache_page-${slug}`);
  } catch (e) {
    // Ignorar errores de localStorage
  }
  return await getPageBySlug(slug, false);
};

// Función auxiliar para debugging del cache (usar desde consola: cmsDebug.debugCmsCache())
export const debugCmsCache = () => {
  const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith('cmsCache_'));
  
  const cacheInfo = cacheKeys.map(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      const age = Date.now() - (data.timestamp || 0);
      return {
        key,
        ageMinutes: Math.floor(age / 60000),
        hasData: !!data.data
      };
    } catch {
      return { key, error: true };
    }
  });
  
  return cacheInfo;
};

// Exponer funciones de utilidad en window para mantenimiento
if (typeof window !== 'undefined') {
  (window as any).cmsDebug = {
    clearCache,
    forceReload,
    debugCmsCache,
    clearAll: () => {
      clearCache();
    }
  };
}

// ⚡ Inicializar todas las páginas públicas (about, services, contact)
export const initAllPages = async () => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_URL}/cms/pages/init-all`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al inicializar páginas');
    }

    // Limpiar cache después de inicializar
    clearCache();

    return data;
  } catch (error) {
    console.error('Error en initAllPages:', error);
    throw error;
  }
};

// ⚡ NUEVA FUNCIÓN: Obtener página del cache de forma SÍNCRONA
// Útil para evitar flash de contenido default -> CMS
export const getCachedPageSync = (slug: string): any | null => {
  const cacheKey = `page-${slug}`;
  const localStorageKey = `cmsCache_${cacheKey}`;
  const CACHE_DURATION = CACHE_DURATIONS.PUBLIC_PAGES;

  // 1. Intentar localStorage
  try {
    const localData = localStorage.getItem(localStorageKey);
    if (localData) {
      const { data, timestamp } = JSON.parse(localData);
      const age = Date.now() - timestamp;
      
      if (age < CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    // Silenciar errores
  }

  // 2. Intentar memoria
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  return null;
};

export default {
  getAllPages,
  getPageBySlug,
  getCachedPageSync,
  updatePage,
  initHomePage,
  initAllPages,
  clearCache,
  forceReload
};
