/**
 * 📰 useDashboardFeaturedPostsConfig Hook
 * Hook para obtener la configuración de estilos del bloque de posts destacados
 * del Dashboard del Cliente (ClientDashboard.tsx)
 */

import { useState, useEffect } from 'react';
import { getPageBySlug } from '../../services/cmsApi';
import { cms } from '../../utils/contentManagementCache';
import type { DashboardFeaturedPostsConfig, PageData } from '../../types/cms';

// ============================================
// VALORES POR DEFECTO (Colores actuales hardcodeados en ClientDashboard)
// ============================================

export const DEFAULT_FEATURED_POSTS_CONFIG: DashboardFeaturedPostsConfig = {
  // === HEADER DEL BLOQUE ===
  header: {
    title: 'Noticias y Artículos Destacados',
    // Icono configurable (Lucide)
    iconName: 'Newspaper',
    iconColorLight: '#3b82f6',           // blue-500
    iconColorDark: '#60a5fa',            // blue-400
    titleColorLight: '#111827',          // gray-900
    titleColorDark: '#ffffff',           // white
    showRefreshButton: true,
  },
  
  // === BOTÓN ACTUALIZAR ===
  refreshButton: {
    text: 'Actualizar',
    iconName: 'RefreshCw',
    iconColorLight: '#ffffff',
    iconColorDark: '#ffffff',
    // Fondo
    bgType: 'gradient',                  // 'solid' | 'gradient' | 'transparent'
    bgColorLight: '#3b82f6',
    bgColorDark: '#3b82f6',
    bgGradientFrom: '#3b82f6',           // blue-500
    bgGradientTo: '#a855f7',             // purple-500
    // Borde
    borderEnabled: false,
    borderWidth: 1,
    borderType: 'solid',                 // 'solid' | 'gradient'
    borderColorLight: '#3b82f6',
    borderColorDark: '#60a5fa',
    borderGradientFrom: '#3b82f6',
    borderGradientTo: '#a855f7',
    // Texto
    textColorLight: '#ffffff',
    textColorDark: '#ffffff',
  },
  
  // === PANEL CONTENEDOR ===
  panel: {
    bgColorLight: '#ffffff',             // white
    bgColorDark: '#1f2937',              // gray-800
    borderRadius: 'xl',
    shadowSize: 'lg',
    padding: '6',
  },
  
  // === TARJETA DEL POST ===
  card: {
    bgGradientFromLight: '#f9fafb',      // gray-50
    bgGradientToLight: '#f3f4f6',        // gray-100
    bgGradientFromDark: '#374151',       // gray-700
    bgGradientToDark: '#4b5563',         // gray-600
    borderRadius: '2xl',
    hoverScale: '1.01',
  },
  
  // === BADGE DE CATEGORÍA ===
  categoryBadge: {
    gradientFrom: '#3b82f6',             // blue-500
    gradientTo: '#a855f7',               // purple-500
    textColor: '#ffffff',
    showIcon: true,
    iconName: 'Folder',
    iconColor: '#ffffff',
  },
  
  // === TEXTOS ===
  typography: {
    titleColorLight: '#111827',          // gray-900
    titleColorDark: '#ffffff',           // white
    titleHoverColorLight: '#2563eb',     // blue-600
    titleHoverColorDark: '#60a5fa',      // blue-400
    excerptColorLight: '#4b5563',        // gray-600
    excerptColorDark: '#d1d5db',         // gray-300
    fontFamily: 'Montserrat',
  },
  
  // === TAGS ===
  tags: {
    bgColorLight: '#dbeafe',             // blue-100
    bgColorDark: 'rgba(30, 58, 138, 0.3)', // blue-900/30
    textColorLight: '#1d4ed8',           // blue-700
    textColorDark: '#93c5fd',            // blue-300
    maxTags: 4,
  },
  
  // === AUTOR Y METADATA ===
  author: {
    avatarGradientFrom: '#3b82f6',       // blue-500
    avatarGradientTo: '#a855f7',         // purple-500
    nameColorLight: '#111827',           // gray-900
    nameColorDark: '#ffffff',            // white
    dateColorLight: '#6b7280',           // gray-500
    dateColorDark: '#9ca3af',            // gray-400
  },
  
  // === CTA (CALL TO ACTION) ===
  cta: {
    text: 'Leer artículo completo',
    iconName: 'ArrowRight',
    iconColorLight: '#2563eb',           // blue-600
    iconColorDark: '#60a5fa',            // blue-400
    // Fondo
    bgType: 'transparent',               // 'solid' | 'gradient' | 'transparent'
    bgColorLight: 'transparent',
    bgColorDark: 'transparent',
    bgGradientFrom: '#3b82f6',
    bgGradientTo: '#a855f7',
    // Borde
    borderEnabled: false,
    borderWidth: 1,
    borderType: 'solid',
    borderColorLight: '#2563eb',
    borderColorDark: '#60a5fa',
    borderGradientFrom: '#3b82f6',
    borderGradientTo: '#a855f7',
    // Texto
    textColorLight: '#2563eb',           // blue-600
    textColorDark: '#60a5fa',            // blue-400
  },
  
  // === IMAGEN DESTACADA ===
  image: {
    fallbackGradientFrom: '#60a5fa',     // blue-400
    fallbackGradientVia: '#a855f7',      // purple-500
    fallbackGradientTo: '#ec4899',       // pink-500
    fallbackIconName: 'Newspaper',
    fallbackIconColor: '#ffffff',
  },
  
  // === CONTROLES DEL CARRUSEL ===
  carousel: {
    autoRotateInterval: 8000,
    controlsBgLight: 'rgba(255, 255, 255, 0.9)',
    controlsBgDark: 'rgba(31, 41, 55, 0.9)',
    controlsIconColorLight: '#1f2937',   // gray-800
    controlsIconColorDark: '#ffffff',    // white
    indicatorActiveColor: '#2563eb',     // blue-600
    indicatorInactiveColorLight: '#d1d5db', // gray-300
    indicatorInactiveColorDark: '#4b5563',  // gray-600
  },
  
  // === ESTADO VACÍO ===
  emptyState: {
    iconName: 'MailX',
    iconColorLight: '#9ca3af',           // gray-400
    iconColorDark: '#6b7280',            // gray-500
    messageLight: 'No hay posts destacados disponibles en este momento',
    messageDark: 'No hay posts destacados disponibles en este momento',
    textColorLight: '#4b5563',           // gray-600
    textColorDark: '#9ca3af',            // gray-400
  },
};

// Clave para guardar la configuración en localStorage (carga inmediata)
const FEATURED_POSTS_CONFIG_STORAGE_KEY = 'dashboard-featured-posts-config';

// Función para obtener configuración inicial desde localStorage (evita flash)
const getInitialConfig = (): DashboardFeaturedPostsConfig => {
  try {
    const stored = localStorage.getItem(FEATURED_POSTS_CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return deepMerge(DEFAULT_FEATURED_POSTS_CONFIG, parsed);
    }
  } catch (e) {
    console.warn('⚠️ [useDashboardFeaturedPostsConfig] Error leyendo localStorage:', e);
  }
  return DEFAULT_FEATURED_POSTS_CONFIG;
};

// Función helper para hacer deep merge de objetos
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const result = { ...target } as T;
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        // @ts-ignore - Safe deep merge operation
        result[key] = deepMerge(target[key as keyof T] as object || {}, source[key] as object) as T[typeof key];
      } else {
        // @ts-ignore - Safe assignment
        result[key] = source[key];
      }
    }
  }
  return result;
};

// Función para guardar configuración en localStorage
const saveConfigToStorage = (config: DashboardFeaturedPostsConfig) => {
  try {
    localStorage.setItem(FEATURED_POSTS_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('⚠️ [useDashboardFeaturedPostsConfig] Error guardando en localStorage:', e);
  }
};

// ============================================
// TIPOS DE RETORNO
// ============================================

interface UseDashboardFeaturedPostsConfigReturn {
  config: DashboardFeaturedPostsConfig;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================
// EVENTO GLOBAL PARA SINCRONIZACIÓN
// ============================================

// Nombre del evento personalizado para notificar cambios en la configuración
export const FEATURED_POSTS_CONFIG_CHANGED_EVENT = 'dashboard-featured-posts-config-changed';

// Clave de localStorage para sincronizar entre pestañas
const FEATURED_POSTS_CONFIG_VERSION_KEY = 'dashboard-featured-posts-config-version';

// Función para emitir el evento de cambio de configuración
export const emitFeaturedPostsConfigChanged = () => {
  // Evento local (misma pestaña)
  window.dispatchEvent(new CustomEvent(FEATURED_POSTS_CONFIG_CHANGED_EVENT));
  
  // Sincronización entre pestañas usando localStorage
  const version = Date.now().toString();
  localStorage.setItem(FEATURED_POSTS_CONFIG_VERSION_KEY, version);
};

// ============================================
// HOOK
// ============================================

export const useDashboardFeaturedPostsConfig = (): UseDashboardFeaturedPostsConfigReturn => {
  // ⚡ Usar configuración de localStorage como estado inicial para evitar flash
  const [config, setConfig] = useState<DashboardFeaturedPostsConfig>(getInitialConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Intentar cache primero (si no se está forzando recarga)
      if (!skipCache) {
        const cachedData = cms.getPages<PageData>('dashboard-sidebar');
        
        // ⚠️ IMPORTANTE: Solo usar cache si tiene dashboardFeaturedPosts válido
        if (cachedData?.content?.dashboardFeaturedPosts?.header) {
          const featuredPostsConfig = cachedData.content.dashboardFeaturedPosts;
          const mergedFromCache = deepMerge(DEFAULT_FEATURED_POSTS_CONFIG, featuredPostsConfig);
          
          setConfig(mergedFromCache);
          saveConfigToStorage(mergedFromCache);
          setLoading(false);
          return;
        }
      }

      // 2️⃣ Obtener de la API (sin usar caché)
      try {
        const pageData = await getPageBySlug('dashboard-sidebar', false); // false = sin caché
        
        if (pageData?.content?.dashboardFeaturedPosts) {
          const featuredPostsConfig = pageData.content.dashboardFeaturedPosts;
          const mergedConfig = deepMerge(DEFAULT_FEATURED_POSTS_CONFIG, featuredPostsConfig);
          
          setConfig(mergedConfig);
          saveConfigToStorage(mergedConfig);
          
          // Guardar en cache
          cms.setPages<PageData>(pageData, 'dashboard-sidebar');
        } else {
          // Si no existe configuración, usar defaults
          setConfig(DEFAULT_FEATURED_POSTS_CONFIG);
        }
      } catch (apiError) {
        // Si no existe la página en la DB, usar valores por defecto
        console.warn('[useDashboardFeaturedPostsConfig] Usando configuración por defecto', apiError);
        setConfig(DEFAULT_FEATURED_POSTS_CONFIG);
      }
    } catch (err) {
      console.error('[useDashboardFeaturedPostsConfig] Error:', err);
      setError('Error al cargar configuración de posts destacados');
      setConfig(DEFAULT_FEATURED_POSTS_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar la configuración (forzando bypass de caché)
  const refetch = async () => {
    await loadConfig(true);
  };

  useEffect(() => {
    loadConfig();
    
    // 🔔 Escuchar evento de cambio de configuración para sincronizar entre componentes (misma pestaña)
    const handleConfigChange = () => {
      loadConfig(true); // Forzar recarga desde API
    };
    
    // 🔔 Escuchar cambios de localStorage para sincronizar entre pestañas diferentes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === FEATURED_POSTS_CONFIG_VERSION_KEY) {
        // Invalidar cache local y recargar desde API
        cms.invalidatePages('dashboard-sidebar');
        loadConfig(true);
      }
    };
    
    window.addEventListener(FEATURED_POSTS_CONFIG_CHANGED_EVENT, handleConfigChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener(FEATURED_POSTS_CONFIG_CHANGED_EVENT, handleConfigChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    config,
    loading,
    error,
    refetch,
  };
};

export default useDashboardFeaturedPostsConfig;
