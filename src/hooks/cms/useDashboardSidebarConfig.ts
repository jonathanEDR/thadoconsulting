/**
 * 🎨 useDashboardSidebarConfig Hook
 * Hook para obtener la configuración de estilos del sidebar del dashboard
 * Soporta tanto el sidebar de Admin como el de Cliente
 */

import { useState, useEffect, useMemo } from 'react';
import { getPageBySlug } from '../../services/cmsApi';
import { cms } from '../../utils/contentManagementCache';
import type { DashboardSidebarConfig, PageData } from '../../types/cms';

// ============================================
// VALORES POR DEFECTO (Colores actuales hardcodeados)
// ============================================

const DEFAULT_ADMIN_CONFIG: DashboardSidebarConfig['admin'] = {
  // Header gradiente - Actual: from-blue-500 via-purple-500 to-pink-500
  headerGradientFrom: '#3b82f6',     // blue-500
  headerGradientVia: '#a855f7',      // purple-500
  headerGradientTo: '#ec4899',       // pink-500
  headerGradientFromDark: '#7c3aed', // purple-600
  headerGradientViaDark: '#2563eb',  // blue-600
  headerGradientToDark: '#4f46e5',   // indigo-600
  
  // Items activos - Actual: from-blue-500 to-purple-500
  activeItemGradientFrom: '#3b82f6', // blue-500
  activeItemGradientTo: '#a855f7',   // purple-500
  activeItemGradientFromDark: '#7c3aed', // purple-600
  activeItemGradientToDark: '#ec4899',   // pink-600
  
  // Fondo del sidebar
  sidebarBgLight: 'rgba(255, 255, 255, 0.8)',
  sidebarBgDark: 'rgba(17, 24, 39, 0.9)',
  
  // Navegación
  navBgLight: 'rgba(248, 250, 252, 0.8)',
  navBgDark: 'rgba(17, 24, 39, 0.8)',
  navBgTransparent: false,
  navTextColor: '#334155',
  navTextColorDark: '#e5e7eb',
  navHoverBgLight: 'rgba(241, 245, 249, 0.8)',
  navHoverBgDark: 'rgba(31, 41, 55, 0.8)',
  navHoverBgTransparent: false,
  hoverBorderGradientEnabled: false,
  hoverBorderGradientFrom: '#3b82f6', // blue-500
  hoverBorderGradientTo: '#a855f7',   // purple-500
  
  // Footer
  footerBgLight: 'rgba(241, 245, 249, 0.8)',
  footerBgDark: 'rgba(3, 7, 18, 0.8)',
  logoutButtonGradientFrom: '#ef4444', // red-500
  logoutButtonGradientTo: '#dc2626',   // red-600
};

const DEFAULT_CLIENT_CONFIG: DashboardSidebarConfig['client'] = {
  // Header gradiente - Actual: from-green-500 via-blue-500 to-purple-500
  headerGradientFrom: '#22c55e',     // green-500
  headerGradientVia: '#3b82f6',      // blue-500
  headerGradientTo: '#a855f7',       // purple-500
  headerGradientFromDark: '#2563eb', // blue-600
  headerGradientViaDark: '#7c3aed',  // purple-600
  headerGradientToDark: '#4f46e5',   // indigo-600
  
  // Items activos - Actual: from-green-500 to-blue-500
  activeItemGradientFrom: '#22c55e', // green-500
  activeItemGradientTo: '#3b82f6',   // blue-500
  activeItemGradientFromDark: '#2563eb', // blue-600
  activeItemGradientToDark: '#7c3aed',   // purple-600
  
  // Fondo del sidebar
  sidebarBgLight: 'rgba(255, 255, 255, 0.8)',
  sidebarBgDark: 'rgba(17, 24, 39, 0.9)',
  
  // Navegación
  navBgLight: 'rgba(248, 250, 252, 0.8)',
  navBgDark: 'rgba(17, 24, 39, 0.8)',
  navBgTransparent: false,
  navTextColor: '#334155',
  navTextColorDark: '#e5e7eb',
  navHoverBgLight: 'rgba(241, 245, 249, 0.8)',
  navHoverBgDark: 'rgba(31, 41, 55, 0.8)',
  navHoverBgTransparent: false,
  hoverBorderGradientEnabled: false,
  hoverBorderGradientFrom: '#22c55e', // green-500
  hoverBorderGradientTo: '#3b82f6',   // blue-500
  
  // Footer
  footerBgLight: 'rgba(241, 245, 249, 0.8)',
  footerBgDark: 'rgba(3, 7, 18, 0.8)',
  
  // Logout button
  logoutButtonGradientFrom: '#ef4444', // red-500
  logoutButtonGradientTo: '#dc2626',   // red-600
};

const DEFAULT_GLOBAL_CONFIG: DashboardSidebarConfig['global'] = {
  logoUrl: '/logos/logo-white.svg',
  logoAlt: 'THADO Consulting',
  borderColorLight: 'rgba(226, 232, 240, 0.6)',
  borderColorDark: 'rgba(55, 65, 81, 0.6)',
  expandedWidth: '18rem', // w-72
  collapsedWidth: '4rem', // w-16
  // Icono de cambio de tema
  themeToggleIconLight: 'Moon',       // Luna para indicar cambio a oscuro
  themeToggleIconDark: 'Sun',         // Sol para indicar cambio a claro
  themeToggleColorLight: '#f59e0b',   // amber-500
  themeToggleColorDark: '#fbbf24',    // amber-400
  // Tipografía
  fontFamily: 'Montserrat',
  fontSizeBase: '0.875rem',          // 14px
  fontSizeMenu: '0.9375rem',         // 15px
  fontSizeHeader: '1rem',            // 16px
  fontWeightNormal: '500',
  fontWeightBold: '600',
};

// Iconos por defecto para el menú (Lucide icons con colores)
const DEFAULT_MENU_ICONS: DashboardSidebarConfig['menuIcons'] = {
  dashboard: { iconName: 'LayoutDashboard', iconColorLight: '#6366f1', iconColorDark: '#818cf8' },
  profile: { iconName: 'User', iconColorLight: '#8b5cf6', iconColorDark: '#a78bfa' },
  servicios: { iconName: 'Rocket', iconColorLight: '#ec4899', iconColorDark: '#f472b6' },
  cms: { iconName: 'FileEdit', iconColorLight: '#14b8a6', iconColorDark: '#2dd4bf' },
  solicitudes: { iconName: 'ClipboardList', iconColorLight: '#f59e0b', iconColorDark: '#fbbf24' },
  mensajes: { iconName: 'MessageSquare', iconColorLight: '#3b82f6', iconColorDark: '#60a5fa' },
  agenda: { iconName: 'Calendar', iconColorLight: '#10b981', iconColorDark: '#34d399' },
  media: { iconName: 'Image', iconColorLight: '#f97316', iconColorDark: '#fb923c' },
  blog: { iconName: 'PenTool', iconColorLight: '#06b6d4', iconColorDark: '#22d3ee' },
  agentesIA: { iconName: 'Bot', iconColorLight: '#8b5cf6', iconColorDark: '#a78bfa' },
  scutiAI: { iconName: 'Sparkles', iconColorLight: '#ec4899', iconColorDark: '#f472b6' },
  configuracion: { iconName: 'Settings', iconColorLight: '#6b7280', iconColorDark: '#9ca3af' },
  actividad: { iconName: 'Activity', iconColorLight: '#22c55e', iconColorDark: '#4ade80' },
  usuarios: { iconName: 'Users', iconColorLight: '#0ea5e9', iconColorDark: '#38bdf8' },
};

const DEFAULT_CONFIG: DashboardSidebarConfig = {
  admin: DEFAULT_ADMIN_CONFIG,
  client: DEFAULT_CLIENT_CONFIG,
  global: DEFAULT_GLOBAL_CONFIG,
  menuIcons: DEFAULT_MENU_ICONS,
};

// Clave para guardar la configuración en localStorage (carga inmediata)
const SIDEBAR_CONFIG_STORAGE_KEY = 'sidebar-config-data';

// Función para obtener configuración inicial desde localStorage (evita flash)
const getInitialConfig = (): DashboardSidebarConfig => {
  try {
    const stored = localStorage.getItem(SIDEBAR_CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        admin: { ...DEFAULT_ADMIN_CONFIG, ...parsed.admin },
        client: { ...DEFAULT_CLIENT_CONFIG, ...parsed.client },
        global: { ...DEFAULT_GLOBAL_CONFIG, ...parsed.global },
        menuIcons: { ...DEFAULT_MENU_ICONS, ...parsed.menuIcons },
      };
    }
  } catch (e) {
    console.warn('⚠️ [useDashboardSidebarConfig] Error leyendo localStorage:', e);
  }
  return DEFAULT_CONFIG;
};

// Función para guardar configuración en localStorage
const saveConfigToStorage = (config: DashboardSidebarConfig) => {
  try {
    localStorage.setItem(SIDEBAR_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('⚠️ [useDashboardSidebarConfig] Error guardando en localStorage:', e);
  }
};

// ============================================
// TIPOS DE RETORNO
// ============================================

interface UseDashboardSidebarConfigReturn {
  config: DashboardSidebarConfig;
  adminConfig: DashboardSidebarConfig['admin'];
  clientConfig: DashboardSidebarConfig['client'];
  globalConfig: DashboardSidebarConfig['global'];
  menuIcons: DashboardSidebarConfig['menuIcons'];
  getMenuIcon: (menuKey: string, isDarkMode: boolean) => { iconName: string; color: string };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================
// EVENTO GLOBAL PARA SINCRONIZACIÓN
// ============================================

// Nombre del evento personalizado para notificar cambios en la configuración
export const SIDEBAR_CONFIG_CHANGED_EVENT = 'sidebar-config-changed';

// Clave de localStorage para sincronizar entre pestañas
const SIDEBAR_CONFIG_VERSION_KEY = 'sidebar-config-version';

// Función para emitir el evento de cambio de configuración
export const emitSidebarConfigChanged = () => {
  // Evento local (misma pestaña)
  window.dispatchEvent(new CustomEvent(SIDEBAR_CONFIG_CHANGED_EVENT));
  
  // Sincronización entre pestañas usando localStorage
  // Al cambiar este valor, otras pestañas recibirán el evento 'storage'
  const version = Date.now().toString();
  localStorage.setItem(SIDEBAR_CONFIG_VERSION_KEY, version);
};

// ============================================
// HOOK
// ============================================

export const useDashboardSidebarConfig = (): UseDashboardSidebarConfigReturn => {
  // ⚡ Usar configuración de localStorage como estado inicial para evitar flash
  const [config, setConfig] = useState<DashboardSidebarConfig>(getInitialConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Intentar cache primero (si no se está forzando recarga)
      if (!skipCache) {
        const cachedData = cms.getPages<PageData>('dashboard-sidebar');
        
        // ⚠️ IMPORTANTE: Solo usar cache si tiene dashboardSidebar válido
        if (cachedData?.content?.dashboardSidebar?.admin) {
          const sidebarConfig = cachedData.content.dashboardSidebar;
          
          const mergedFromCache: DashboardSidebarConfig = {
            admin: { ...DEFAULT_ADMIN_CONFIG, ...sidebarConfig.admin },
            client: { ...DEFAULT_CLIENT_CONFIG, ...sidebarConfig.client },
            global: { ...DEFAULT_GLOBAL_CONFIG, ...sidebarConfig.global },
            menuIcons: { ...DEFAULT_MENU_ICONS, ...sidebarConfig.menuIcons },
          };
          
          setConfig(mergedFromCache);
          saveConfigToStorage(mergedFromCache);
          setLoading(false);
          return;
        } else {
          // Invalidar cache corrupto
          cms.invalidatePages('dashboard-sidebar');
        }
      }

      // 2️⃣ Obtener de la API (sin usar caché)
      try {
        const pageData = await getPageBySlug('dashboard-sidebar', false); // false = sin caché
        
        if (pageData?.content?.dashboardSidebar) {
          const sidebarConfig = pageData.content.dashboardSidebar;
          
          const mergedConfig: DashboardSidebarConfig = {
            admin: { ...DEFAULT_ADMIN_CONFIG, ...sidebarConfig.admin },
            client: { ...DEFAULT_CLIENT_CONFIG, ...sidebarConfig.client },
            global: { ...DEFAULT_GLOBAL_CONFIG, ...sidebarConfig.global },
            menuIcons: { ...DEFAULT_MENU_ICONS, ...sidebarConfig.menuIcons },
          };
          
          setConfig(mergedConfig);
          saveConfigToStorage(mergedConfig);
          
          // Guardar en cache
          cms.setPages<PageData>(pageData, 'dashboard-sidebar');
        } else {
          console.warn('⚠️ [useDashboardSidebarConfig] No hay dashboardSidebar en pageData');
        }
      } catch (apiError) {
        // Si no existe la página en la DB, usar valores por defecto
        console.warn('[useDashboardSidebarConfig] Usando configuración por defecto', apiError);
        setConfig(DEFAULT_CONFIG);
      }
    } catch (err) {
      console.error('[useDashboardSidebarConfig] Error:', err);
      setError('Error al cargar configuración del sidebar');
      setConfig(DEFAULT_CONFIG);
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
      if (event.key === SIDEBAR_CONFIG_VERSION_KEY) {
        // Invalidar cache local y recargar desde API
        cms.invalidatePages('dashboard-sidebar');
        loadConfig(true);
      }
    };
    
    window.addEventListener(SIDEBAR_CONFIG_CHANGED_EVENT, handleConfigChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener(SIDEBAR_CONFIG_CHANGED_EVENT, handleConfigChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Memoizar los valores de retorno
  const adminConfig = useMemo(() => config.admin, [config.admin]);
  const clientConfig = useMemo(() => config.client, [config.client]);
  const globalConfig = useMemo(() => config.global, [config.global]);
  const menuIcons = useMemo(() => config.menuIcons || DEFAULT_MENU_ICONS, [config.menuIcons]);

  // Función helper para obtener el icono correcto basado en el tema
  const getMenuIcon = useMemo(() => {
    return (menuKey: string, isDarkMode: boolean): { iconName: string; color: string } => {
      const iconConfig = menuIcons?.[menuKey];
      
      if (!iconConfig) {
        // Fallback genérico
        return { iconName: 'Circle', color: isDarkMode ? '#9ca3af' : '#6b7280' };
      }

      return {
        iconName: iconConfig.iconName || 'Circle',
        color: isDarkMode ? iconConfig.iconColorDark : iconConfig.iconColorLight,
      };
    };
  }, [menuIcons]);

  return {
    config,
    adminConfig,
    clientConfig,
    globalConfig,
    menuIcons,
    getMenuIcon,
    loading,
    error,
    refetch,
  };
};

// ============================================
// EXPORTAR DEFAULTS PARA USO EXTERNO
// ============================================

export {
  DEFAULT_CONFIG as DEFAULT_SIDEBAR_CONFIG,
  DEFAULT_ADMIN_CONFIG,
  DEFAULT_CLIENT_CONFIG,
  DEFAULT_GLOBAL_CONFIG,
  DEFAULT_MENU_ICONS,
};

export default useDashboardSidebarConfig;
