/**
 * 🪝 Hook para acceder a la configuración global del sitio
 * 
 * Proporciona acceso unificado a SITE_CONFIG con helpers útiles.
 * Puede ser extendido para cargar configuración desde el CMS.
 * 
 * @example
 * const { config, getFullUrl, formatPrice, getSeoTitle } = useSiteConfig();
 * 
 * // Usar URL del sitio
 * const url = getFullUrl('/servicios/mi-servicio');
 * 
 * // Formatear precio
 * const precio = formatPrice(150, 'PEN'); // "S/. 150.00"
 * 
 * // Obtener título SEO
 * const title = getSeoTitle('Desarrollo Web'); // "Desarrollo Web - THADO Consulting"
 */

import { useMemo } from 'react';
import SITE_CONFIG, {
  getFullUrl as _getFullUrl,
  getImageUrl as _getImageUrl,
  getCurrencySymbol as _getCurrencySymbol,
  formatPrice as _formatPrice,
  getSeoTitle as _getSeoTitle,
  getOrganizationSchema as _getOrganizationSchema,
  getServiceSchema as _getServiceSchema,
  getBreadcrumbSchema as _getBreadcrumbSchema,
  type SiteConfig,
} from '../config/siteConfig';

export interface UseSiteConfigReturn {
  // Configuración completa
  config: SiteConfig;
  
  // Helpers de URL
  getFullUrl: typeof _getFullUrl;
  getImageUrl: typeof _getImageUrl;
  
  // Helpers de moneda
  getCurrencySymbol: typeof _getCurrencySymbol;
  formatPrice: typeof _formatPrice;
  
  // Helpers de SEO
  getSeoTitle: typeof _getSeoTitle;
  
  // Helpers de Schema.org
  getOrganizationSchema: typeof _getOrganizationSchema;
  getServiceSchema: typeof _getServiceSchema;
  getBreadcrumbSchema: typeof _getBreadcrumbSchema;
  
  // Accesos directos comunes
  siteName: string;
  siteUrl: string;
  locale: string;
  defaultCurrency: string;
}

/**
 * Hook principal para acceder a la configuración del sitio
 */
export const useSiteConfig = (): UseSiteConfigReturn => {
  // Memoizar para evitar re-renders innecesarios
  return useMemo(() => ({
    config: SITE_CONFIG,
    
    // Helpers
    getFullUrl: _getFullUrl,
    getImageUrl: _getImageUrl,
    getCurrencySymbol: _getCurrencySymbol,
    formatPrice: _formatPrice,
    getSeoTitle: _getSeoTitle,
    getOrganizationSchema: _getOrganizationSchema,
    getServiceSchema: _getServiceSchema,
    getBreadcrumbSchema: _getBreadcrumbSchema,
    
    // Accesos directos
    siteName: SITE_CONFIG.siteName,
    siteUrl: SITE_CONFIG.siteUrl,
    locale: SITE_CONFIG.locale,
    defaultCurrency: SITE_CONFIG.defaultCurrency,
  }), []);
};

export default useSiteConfig;

// Re-exportar tipos y helpers para uso directo sin hook
export { SITE_CONFIG };
export type { SiteConfig };
