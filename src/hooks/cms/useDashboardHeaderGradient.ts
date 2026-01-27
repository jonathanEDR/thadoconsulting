/**
 * 🎨 useDashboardHeaderGradient Hook
 * Hook para obtener el gradiente del header del sidebar y usarlo en páginas del dashboard
 * Mantiene consistencia visual en todo el dashboard
 * Soporta tanto panel de Admin como de Cliente
 */

import { useDashboardSidebarConfig } from './useDashboardSidebarConfig';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface UseDashboardHeaderGradientOptions {
  /** Forzar usar configuración de admin o cliente. Si no se especifica, se detecta automáticamente */
  forcePanel?: 'admin' | 'client';
}

/**
 * Hook que retorna el gradiente del header según el tema activo y el panel actual
 * Usa la misma configuración que el Sidebar para mantener consistencia
 */
export const useDashboardHeaderGradient = (options?: UseDashboardHeaderGradientOptions) => {
  const { adminConfig, clientConfig } = useDashboardSidebarConfig();
  const { theme } = useTheme();
  const { canAccessAdmin } = useAuth();
  const location = useLocation();
  const isDarkMode = theme === 'dark';

  // Detectar automáticamente si estamos en el panel de cliente o admin
  const isClientPanel = useMemo(() => {
    if (options?.forcePanel) {
      return options.forcePanel === 'client';
    }
    
    // Detectar por la URL
    const path = location.pathname;
    if (path.includes('/dashboard/client/') || path.startsWith('/dashboard/client')) {
      return true;
    }
    
    // Si el usuario no es admin, asumir panel de cliente
    if (!canAccessAdmin) {
      return true;
    }
    
    return false;
  }, [options?.forcePanel, location.pathname, canAccessAdmin]);

  // Seleccionar la configuración correcta
  const config = isClientPanel ? clientConfig : adminConfig;

  // Generar el CSS gradient basado en la configuración del sidebar
  const headerGradient = useMemo(() => {
    if (isDarkMode) {
      return `linear-gradient(to right, ${config.headerGradientFromDark}, ${config.headerGradientViaDark}, ${config.headerGradientToDark})`;
    }
    return `linear-gradient(to right, ${config.headerGradientFrom}, ${config.headerGradientVia}, ${config.headerGradientTo})`;
  }, [config, isDarkMode]);

  // Colores individuales por si se necesitan
  const colors = useMemo(() => ({
    from: isDarkMode ? config.headerGradientFromDark : config.headerGradientFrom,
    via: isDarkMode ? config.headerGradientViaDark : config.headerGradientVia,
    to: isDarkMode ? config.headerGradientToDark : config.headerGradientTo,
  }), [config, isDarkMode]);

  // Clase Tailwind aproximada (por si se necesita)
  const tailwindClass = isClientPanel
    ? (isDarkMode
        ? 'from-blue-600 via-purple-600 to-indigo-600'
        : 'from-green-500 via-blue-500 to-purple-500')
    : (isDarkMode
        ? 'from-purple-600 via-blue-600 to-indigo-600'
        : 'from-blue-500 via-purple-500 to-pink-500');

  return {
    /** Gradiente CSS completo listo para usar en style={{background: headerGradient}} */
    headerGradient,
    /** Colores individuales del gradiente */
    colors,
    /** Clase Tailwind aproximada (menos precisa que el gradient CSS) */
    tailwindClass,
    /** Indica si está en modo oscuro */
    isDarkMode,
    /** Indica si está usando la configuración del panel de cliente */
    isClientPanel,
  };
};

export default useDashboardHeaderGradient;
