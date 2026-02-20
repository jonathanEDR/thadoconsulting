/**
 * 🎯 CONFIGURACIÓN SEO HARDCODEADA POR PÁGINA
 *
 * Este archivo contiene los metadatos SEO por defecto para cada página.
 *
 * SISTEMA DE PRIORIDAD:
 * 1. ✅ Datos del CMS (MongoDB) - PRIORIDAD MÁXIMA
 * 2. ✅ Configuración hardcodeada (este archivo)
 * 3. ✅ Fallbacks genéricos
 *
 * ⚠️ IMPORTANTE:
 * - Los datos del CMS SIEMPRE tienen prioridad
 * - Esta configuración se usa solo cuando NO hay datos en el CMS
 * - Facilita debugging y proporciona defaults profesionales
 *
 * 🖼️ IMÁGENES OPEN GRAPH (ogImage):
 * - Dimensiones ideales: 1200x630px
 * - Formatos: PNG, JPG (< 1MB)
 * - Ubicación: /public/logos/ o /public/
 * - Las rutas son relativas: '/logos/tu-imagen.png'
 * - Cuando configures desde CMS, usa URL completa o ruta relativa
 */

export interface PageSeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  canonical?: string;
}

export interface SeoConfigMap {
  [key: string]: PageSeoConfig;
}

/**
 * 📋 Configuración SEO por defecto para cada página
 *
 * ⚠️ NOTA: La página HOME no está aquí porque tiene su propio sistema
 * de gestión SEO que funciona perfectamente (ver: Home.tsx)
 */
export const DEFAULT_SEO_CONFIG: SeoConfigMap = {
  // 📰 PÁGINA BLOG
  blog: {
    metaTitle: 'Blog THADO Consulting - Guías Contables y Tributarias para MYPES',
    metaDescription: 'Artículos sobre contabilidad, tributación SUNAT, planillas y gestión empresarial. Guías prácticas para MYPES y emprendedores en Perú.',
    keywords: [
      'blog contabilidad',
      'guías tributarias SUNAT',
      'contabilidad MYPES',
      'declaraciones SUNAT',
      'régimen tributario Perú',
      'planillas PLAME',
      'facturación electrónica',
      'libros electrónicos SIRE'
    ],
    ogTitle: 'Blog THADO Consulting - Contabilidad y Tributación',
    ogDescription: 'Guías y artículos sobre contabilidad y tributación para MYPES en Perú',
    ogImage: 'https://www.thadoconsulting.com/FAVICON.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Blog de Contabilidad y Tributación',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/blog'
  },

  // 💼 PÁGINA SERVICIOS
  services: {
    metaTitle: 'Servicios Contables y Tributarios en Perú - THADO Consulting',
    metaDescription: 'Servicios de contabilidad, asesoría tributaria SUNAT, planillas PLAME, constitución de empresas y facturación electrónica para MYPES en todo Perú.',
    keywords: [
      'servicios contables Perú',
      'asesoría tributaria SUNAT',
      'contador para MYPE',
      'planillas PLAME',
      'constitución de empresas',
      'facturación electrónica',
      'libros electrónicos',
      'outsourcing contable Lima'
    ],
    ogTitle: 'Servicios Contables y Tributarios - THADO Consulting',
    ogDescription: 'Servicios contables profesionales para MYPES y emprendedores en Perú',
    ogImage: 'https://www.thadoconsulting.com/FAVICON.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Servicios Contables',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/servicios'
  },

  // Alias para servicios
  servicios: {
    metaTitle: 'Servicios Contables y Tributarios en Perú - THADO Consulting',
    metaDescription: 'Servicios de contabilidad, asesoría tributaria SUNAT, planillas PLAME, constitución de empresas y facturación electrónica para MYPES en todo Perú.',
    keywords: [
      'servicios contables Perú',
      'asesoría tributaria SUNAT',
      'contador para MYPE',
      'planillas PLAME',
      'constitución de empresas',
      'facturación electrónica',
      'libros electrónicos',
      'outsourcing contable Lima'
    ],
    ogTitle: 'Servicios Contables y Tributarios - THADO Consulting',
    ogDescription: 'Servicios contables profesionales para MYPES y emprendedores en Perú',
    ogImage: 'https://www.thadoconsulting.com/FAVICON.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Servicios Contables',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/servicios'
  },

  // 👥 PÁGINA NOSOTROS/ABOUT
  about: {
    metaTitle: 'Sobre Nosotros - THADO Consulting | Estudio Contable en Perú',
    metaDescription: 'Conoce a THADO Consulting: estudio contable especializado en MYPES y emprendedores. Más de 10 años de experiencia en contabilidad y tributación en Perú.',
    keywords: [
      'THADO Consulting',
      'estudio contable Perú',
      'contador Lima',
      'nosotros THADO',
      'contadores colegiados',
      'experiencia tributaria',
      'equipo contable',
      'asesoría contable MYPES'
    ],
    ogTitle: 'Sobre Nosotros - THADO Consulting | Estudio Contable en Perú',
    ogDescription: 'Conoce quiénes somos y cómo ayudamos a MYPES a cumplir con SUNAT',
    ogImage: 'https://www.thadoconsulting.com/FAVICON.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Estudio Contable en Perú',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/nosotros'
  },

  // Alias para nosotros
  nosotros: {
    metaTitle: 'Sobre Nosotros - THADO Consulting | Estudio Contable en Perú',
    metaDescription: 'Conoce a THADO Consulting: estudio contable especializado en MYPES y emprendedores. Más de 10 años de experiencia en contabilidad y tributación en Perú.',
    keywords: [
      'THADO Consulting',
      'estudio contable Perú',
      'contador Lima',
      'nosotros THADO',
      'contadores colegiados',
      'experiencia tributaria',
      'equipo contable',
      'asesoría contable MYPES'
    ],
    ogTitle: 'Sobre Nosotros - THADO Consulting | Estudio Contable en Perú',
    ogDescription: 'Conoce quiénes somos y cómo ayudamos a MYPES a cumplir con SUNAT',
    ogImage: 'https://www.thadoconsulting.com/FAVICON.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Estudio Contable en Perú',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/nosotros'
  },

  // 📞 PÁGINA CONTACTO
  contact: {
    metaTitle: 'Contacto - THADO Consulting | Consultoría Contable Gratuita',
    metaDescription: 'Contáctanos para asesoría contable y tributaria. Primera consultoría gratuita para MYPES y emprendedores en todo Perú. Respuesta en 24 horas.',
    keywords: [
      'contacto THADO',
      'consultoría contable Perú',
      'asesoría tributaria gratuita',
      'contador Lima contacto',
      'solicitar servicio contable',
      'presupuesto contabilidad',
      'consulta SUNAT',
      'agendar consultoría'
    ],
    ogTitle: 'Contacto - THADO Consulting | Hablemos de tu Negocio',
    ogDescription: 'Agenda una consultoría gratuita y ordena tu contabilidad',
    ogImage: 'https://www.thadoconsulting.com/FAVICON.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Contáctanos',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/contacto'
  },

  // Alias para contacto
  contacto: {
    metaTitle: 'Contacto - THADO Consulting | Consultoría Contable Gratuita',
    metaDescription: 'Contáctanos para asesoría contable y tributaria. Primera consultoría gratuita para MYPES y emprendedores en todo Perú. Respuesta en 24 horas.',
    keywords: [
      'contacto THADO',
      'consultoría contable Perú',
      'asesoría tributaria gratuita',
      'contador Lima contacto',
      'solicitar servicio contable',
      'presupuesto contabilidad',
      'consulta SUNAT',
      'agendar consultoría'
    ],
    ogTitle: 'Contacto - THADO Consulting | Hablemos de tu Negocio',
    ogDescription: 'Agenda una consultoría gratuita y ordena tu contabilidad',
    ogImage: 'https://www.thadoconsulting.com/FAVICON.png',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Contáctanos',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/contacto'
  },

  // 🔒 PÁGINA PRIVACIDAD
  privacidad: {
    metaTitle: 'Política de Privacidad - THADO Consulting',
    metaDescription: 'Conoce nuestra política de privacidad y cómo protegemos tus datos personales. THADO Consulting cumple con la Ley de Protección de Datos Personales del Perú.',
    keywords: [
      'política de privacidad',
      'protección de datos',
      'THADO Consulting',
      'datos personales',
      'Ley 29733',
      'privacidad Perú'
    ],
    ogTitle: 'Política de Privacidad - THADO Consulting',
    ogDescription: 'Conoce cómo protegemos tus datos personales',
    ogImage: 'https://www.thadoconsulting.com/logohorizontalconfondo.jpg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Política de Privacidad',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/privacidad'
  },

  // 📜 PÁGINA TÉRMINOS Y CONDICIONES
  terminos: {
    metaTitle: 'Términos y Condiciones - THADO Consulting',
    metaDescription: 'Lee nuestros términos y condiciones de uso de los servicios de THADO Consulting. Regulaciones aplicables a la contratación de servicios contables y tributarios.',
    keywords: [
      'términos y condiciones',
      'condiciones de servicio',
      'THADO Consulting',
      'servicios contables',
      'contrato de servicios',
      'términos de uso'
    ],
    ogTitle: 'Términos y Condiciones - THADO Consulting',
    ogDescription: 'Términos y condiciones de uso de nuestros servicios contables',
    ogImage: 'https://www.thadoconsulting.com/logohorizontalconfondo.jpg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'THADO Consulting - Términos y Condiciones',
    twitterCard: 'summary_large_image',
    canonical: 'https://www.thadoconsulting.com/terminos'
  }
};

/**
 * 🔍 Obtener configuración SEO hardcodeada para una página
 * @param pageName - Nombre de la página (home, blog, services, etc.)
 * @returns Configuración SEO o undefined si no existe
 */
export const getHardcodedSeo = (pageName: string): PageSeoConfig | undefined => {
  return DEFAULT_SEO_CONFIG[pageName];
};

/**
 * 📊 Verificar si una página tiene configuración SEO hardcodeada
 * @param pageName - Nombre de la página
 * @returns true si existe configuración
 */
export const hasHardcodedSeo = (pageName: string): boolean => {
  return pageName in DEFAULT_SEO_CONFIG;
};

/**
 * 📝 Listar todas las páginas con configuración SEO
 * @returns Array de nombres de páginas
 */
export const getConfiguredPages = (): string[] => {
  return Object.keys(DEFAULT_SEO_CONFIG);
};
