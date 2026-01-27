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
    metaTitle: 'Blog SCUTI Company - Noticias y Tendencias Tecnológicas | Contenido Curado',
    metaDescription: 'Mantente informado con las últimas noticias y tendencias del sector tecnológico. Contenido curado y validado por expertos en desarrollo y tecnología.',
    keywords: [
      'blog tecnologia',
      'noticias tech',
      'desarrollo web',
      'inteligencia artificial',
      'cloud computing',
      'tendencias tecnologicas',
      'programacion',
      'innovacion digital'
    ],
    ogTitle: 'Blog SCUTI - Innovación y Tecnología',
    ogDescription: 'Lee las últimas noticias del mundo tecnológico y mantente actualizado',
    ogImage: 'https://scuticompany.com/logofondonegro.jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'SCUTI Company - Blog de Tecnología e Innovación',
    twitterCard: 'summary_large_image',
    canonical: 'https://scuticompany.com/blog'
  },

  // 💼 PÁGINA SERVICIOS
  services: {
    metaTitle: 'Servicios de Desarrollo Software en Perú - SCUTI Company',
    metaDescription: 'Desarrollo de aplicaciones web y móviles, soluciones de IA, cloud computing, consultoría tecnológica. Servicios profesionales para empresas PYMES en Perú.',
    keywords: [
      'servicios desarrollo software',
      'aplicaciones web peru',
      'desarrollo movil',
      'consultoria tecnologica',
      'soluciones ia',
      'cloud computing',
      'desarrollo backend',
      'desarrollo frontend',
      'empresa software huanuco'
    ],
    ogTitle: 'Servicios de Desarrollo Software - SCUTI Company',
    ogDescription: 'Servicios tecnológicos profesionales diseñados para impulsar tu empresa en Perú',
    ogImage: 'https://scuticompany.com/logofondonegro.jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'SCUTI Company - Servicios de Desarrollo de Software',
    twitterCard: 'summary_large_image',
    canonical: 'https://scuticompany.com/servicios'
  },

  // Alias para servicios
  servicios: {
    metaTitle: 'Servicios de Desarrollo Software en Perú - SCUTI Company',
    metaDescription: 'Desarrollo de aplicaciones web y móviles, soluciones de IA, cloud computing, consultoría tecnológica. Servicios profesionales para empresas PYMES en Perú.',
    keywords: [
      'servicios desarrollo software',
      'aplicaciones web peru',
      'desarrollo movil',
      'consultoria tecnologica',
      'soluciones ia',
      'cloud computing',
      'desarrollo backend',
      'desarrollo frontend',
      'empresa software huanuco'
    ],
    ogTitle: 'Servicios de Desarrollo Software - SCUTI Company',
    ogDescription: 'Servicios tecnológicos profesionales diseñados para impulsar tu empresa en Perú',
    ogImage: 'https://scuticompany.com/logofondonegro.jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'SCUTI Company - Servicios de Desarrollo de Software',
    twitterCard: 'summary_large_image',
    canonical: 'https://scuticompany.com/servicios'
  },

  // 👥 PÁGINA NOSOTROS/ABOUT
  about: {
    metaTitle: 'Sobre Nosotros - SCUTI Company | Empresa de Software en Perú',
    metaDescription: 'Conoce a SCUTI Company: equipo de expertos en tecnología en Huánuco, Perú. Transformamos negocios PYMES con soluciones tecnológicas innovadoras.',
    keywords: [
      'scuti company',
      'empresa tecnologia peru',
      'equipo desarrollo huanuco',
      'nosotros scuti',
      'vision mision',
      'valores empresa',
      'historia scuti',
      'equipo tech peru',
      'transformacion digital pymes'
    ],
    ogTitle: 'Sobre Nosotros - SCUTI Company | Empresa de Software en Perú',
    ogDescription: 'Conoce quiénes somos, nuestra visión y cómo transformamos negocios en Perú',
    ogImage: 'https://scuticompany.com/logofondonegro.jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'SCUTI Company - Empresa de Desarrollo de Software en Perú',
    twitterCard: 'summary_large_image',
    canonical: 'https://scuticompany.com/nosotros'
  },

  // Alias para nosotros
  nosotros: {
    metaTitle: 'Sobre Nosotros - SCUTI Company | Empresa de Software en Perú',
    metaDescription: 'Conoce a SCUTI Company: equipo de expertos en tecnología en Huánuco, Perú. Transformamos negocios PYMES con soluciones tecnológicas innovadoras.',
    keywords: [
      'scuti company',
      'empresa tecnologia peru',
      'equipo desarrollo huanuco',
      'nosotros scuti',
      'vision mision',
      'valores empresa',
      'historia scuti',
      'equipo tech peru',
      'transformacion digital pymes'
    ],
    ogTitle: 'Sobre Nosotros - SCUTI Company | Empresa de Software en Perú',
    ogDescription: 'Conoce quiénes somos, nuestra visión y cómo transformamos negocios en Perú',
    ogImage: 'https://scuticompany.com/logofondonegro.jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'SCUTI Company - Empresa de Desarrollo de Software en Perú',
    twitterCard: 'summary_large_image',
    canonical: 'https://scuticompany.com/nosotros'
  },

  // 📞 PÁGINA CONTACTO
  contact: {
    metaTitle: 'Contacto - SCUTI Company | Agenda tu Consulta Gratuita',
    metaDescription: 'Contáctanos para tu proyecto tecnológico. Desarrollo web, apps móviles y soluciones digitales en Huánuco, Perú. Agenda una consulta gratuita.',
    keywords: [
      'contacto scuti',
      'consultoria tecnologica peru',
      'agenda reunion',
      'contacto empresa tech huanuco',
      'solicitar servicio',
      'presupuesto desarrollo',
      'desarrollo web peru',
      'apps moviles peru'
    ],
    ogTitle: 'Contacto - SCUTI Company | Hablemos de tu Proyecto',
    ogDescription: 'Agenda una consulta gratuita y llevemos tu proyecto tecnológico al siguiente nivel',
    ogImage: 'https://scuticompany.com/logofondonegro.jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'SCUTI Company - Contáctanos para tu Proyecto',
    twitterCard: 'summary_large_image',
    canonical: 'https://scuticompany.com/contacto'
  },

  // Alias para contacto
  contacto: {
    metaTitle: 'Contacto - SCUTI Company | Agenda tu Consulta Gratuita',
    metaDescription: 'Contáctanos para tu proyecto tecnológico. Desarrollo web, apps móviles y soluciones digitales en Huánuco, Perú. Agenda una consulta gratuita.',
    keywords: [
      'contacto scuti',
      'consultoria tecnologica peru',
      'agenda reunion',
      'contacto empresa tech huanuco',
      'solicitar servicio',
      'presupuesto desarrollo',
      'desarrollo web peru',
      'apps moviles peru'
    ],
    ogTitle: 'Contacto - SCUTI Company | Hablemos de tu Proyecto',
    ogDescription: 'Agenda una consulta gratuita y llevemos tu proyecto tecnológico al siguiente nivel',
    ogImage: 'https://scuticompany.com/logofondonegro.jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'SCUTI Company - Contáctanos para tu Proyecto',
    twitterCard: 'summary_large_image',
    canonical: 'https://scuticompany.com/contacto'
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
