/**
 * 🌐 CONFIGURACIÓN GLOBAL DEL SITIO
 * 
 * Este archivo centraliza TODOS los valores que antes estaban hardcodeados
 * en diferentes partes del código. Usar este archivo como fuente única de verdad.
 * 
 * ⚠️ IMPORTANTE: Estos valores pueden ser sobrescritos por el CMS.
 * Esta configuración actúa como FALLBACK cuando el CMS no está disponible.
 * 
 * @created 2026-01-25
 */

// ============================================
// TIPOS
// ============================================

export interface SiteConfig {
  // Información del sitio
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  
  // Localización
  locale: string;
  language: string;
  country: string;
  countryCode: string;
  region: string;
  timezone: string;
  
  // Moneda
  defaultCurrency: string;
  currencySymbols: Record<string, string>;
  
  // Imágenes por defecto
  images: {
    logo: string;
    logoWhite: string;
    logoDark: string;
    favicon: string;
    ogDefault: string;
    ogServices: string;
    ogBlog: string;
    placeholder: string;
  };
  
  // Redes sociales
  social: {
    facebook?: string;
    whatsapp?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  
  // Contacto
  contact: {
    email: string;
    phone?: string;
    phoneClean?: string;
    address?: string;
    openingHours?: string;
  };
  
  // SEO por defecto
  seo: {
    titleSuffix: string;
    defaultKeywords: string[];
  };
  
  // Organización (para Schema.org)
  organization: {
    name: string;
    legalName?: string;
    url: string;
    logo: string;
    foundingDate?: string;
    founders?: string[];
  };
}

// ============================================
// CONFIGURACIÓN POR DEFECTO (FALLBACK)
// ============================================

export const SITE_CONFIG: SiteConfig = {
  // ─────────────────────────────────────────
  // INFORMACIÓN DEL SITIO
  // ─────────────────────────────────────────
  siteName: 'THADO Consulting',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://www.thadoconsulting.com',
  siteDescription: 'Servicios contables y asesoría tributaria para MYPES en todo Perú. Evita multas SUNAT, ordena tu contabilidad y crece con confianza.',

  // ─────────────────────────────────────────
  // LOCALIZACIÓN
  // ─────────────────────────────────────────
  locale: 'es_PE',
  language: 'es',
  country: 'Peru',
  countryCode: 'PE',
  region: 'Huánuco',
  timezone: 'America/Lima',
  
  // ─────────────────────────────────────────
  // MONEDA
  // ─────────────────────────────────────────
  defaultCurrency: 'PEN',
  currencySymbols: {
    PEN: 'S/.',
    USD: '$',
    EUR: '€',
  },
  
  // ─────────────────────────────────────────
  // IMÁGENES POR DEFECTO
  // ─────────────────────────────────────────
  images: {
    logo: '/logotemaclaro.png',
    logoWhite: '/logotemaoscuro.png',  // Logo para fondos oscuros
    logoDark: '/logotemaclaro.png',    // Logo para fondos claros
    favicon: '/FAVICON.png',
    ogDefault: '/logohorizontalconfondo.jpg',
    ogServices: '/logohorizontalconfondo.jpg',
    ogBlog: '/logohorizontalconfondo.jpg',
    placeholder: '/logohorizontalconfondo.jpg',
  },
  
  // ─────────────────────────────────────────
  // REDES SOCIALES
  // ─────────────────────────────────────────
  social: {
    facebook: '#',
    whatsapp: 'https://wa.me/51973397306',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  },

  // ─────────────────────────────────────────
  // CONTACTO
  // ─────────────────────────────────────────
  contact: {
    email: 'thadoconsulting@gmail.com',
    phone: '+51 973 397 306',
    phoneClean: '+51973397306',
    address: 'Huánuco, Perú',
    openingHours: 'Mo-Fr 09:00-18:00',
  },

  // ─────────────────────────────────────────
  // SEO
  // ─────────────────────────────────────────
  seo: {
    titleSuffix: ' - THADO Consulting',
    defaultKeywords: [
      'contador Perú',
      'estudio contable Lima',
      'contador para MYPE',
      'servicios contables Perú',
      'asesoría tributaria SUNAT',
      'outsourcing contable',
      'constitución de empresas Perú',
      'declaración jurada anual',
      'régimen MYPE tributario',
    ],
  },

  // ─────────────────────────────────────────
  // ORGANIZACIÓN (SCHEMA.ORG)
  // ─────────────────────────────────────────
  organization: {
    name: 'THADO Consulting',
    legalName: 'THADO Consulting',
    url: 'https://www.thadoconsulting.com',
    logo: 'https://www.thadoconsulting.com/FAVICON.png',
    foundingDate: '2024',
  },
};

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene la URL completa del sitio
 */
export const getFullUrl = (path: string): string => {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Obtiene la URL completa de una imagen
 */
export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) return imagePath;
  return getFullUrl(imagePath);
};

/**
 * Obtiene el símbolo de moneda
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  return SITE_CONFIG.currencySymbols[currencyCode] || currencyCode;
};

/**
 * Formatea un precio con el símbolo de moneda
 */
export const formatPrice = (
  amount: number,
  currencyCode: string = SITE_CONFIG.defaultCurrency
): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
};

/**
 * Genera el título SEO completo
 */
export const getSeoTitle = (title: string, includeSuffix: boolean = true): string => {
  if (!includeSuffix) return title;
  if (title.includes(SITE_CONFIG.siteName)) return title;
  return `${title}${SITE_CONFIG.seo.titleSuffix}`;
};

/**
 * Genera datos estructurados de organización (Schema.org)
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_CONFIG.organization.name,
  legalName: SITE_CONFIG.organization.legalName,
  url: SITE_CONFIG.organization.url,
  logo: SITE_CONFIG.organization.logo,
  foundingDate: SITE_CONFIG.organization.foundingDate,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE_CONFIG.region,
    addressCountry: SITE_CONFIG.countryCode,
  },
  sameAs: Object.values(SITE_CONFIG.social).filter(Boolean).map(handle => {
    if (handle?.startsWith('@')) return `https://twitter.com/${handle.slice(1)}`;
    if (handle?.includes('facebook')) return `https://facebook.com/${handle}`;
    if (handle?.includes('instagram')) return `https://instagram.com/${handle}`;
    if (handle?.includes('linkedin')) return `https://linkedin.com/company/${handle}`;
    return handle;
  }),
});

/**
 * Genera datos estructurados de servicio (Schema.org)
 */
export const getServiceSchema = (service: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: number;
  currency?: string;
  category?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  url: service.url,
  image: service.image || getImageUrl(SITE_CONFIG.images.ogServices),
  provider: {
    '@type': 'Organization',
    name: SITE_CONFIG.organization.name,
    url: SITE_CONFIG.organization.url,
    logo: SITE_CONFIG.organization.logo,
  },
  ...(service.price ? {
    offers: {
      '@type': 'Offer',
      priceCurrency: service.currency || SITE_CONFIG.defaultCurrency,
      price: service.price,
      availability: 'https://schema.org/InStock',
    },
  } : {}),
  areaServed: {
    '@type': 'Country',
    name: SITE_CONFIG.country,
  },
  serviceType: service.category,
});

/**
 * Genera datos estructurados de breadcrumb (Schema.org)
 */
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : getFullUrl(item.url),
  })),
});

// Export default para conveniencia
export default SITE_CONFIG;
