import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPageBySlug, forceReload } from '../services/cmsApi';

// 🌐 URL base del sitio para construir URLs absolutas
const SITE_URL = 'https://www.thadoconsulting.com';

// 📌 Mapa de pageName → ruta pública (para canonical y og:url automáticos)
const PAGE_ROUTES: Record<string, string> = {
  home: '/',
  about: '/nosotros',
  services: '/servicios',
  contact: '/contacto',
  blog: '/blog',
  privacidad: '/privacidad',
  terminos: '/terminos',
};

/**
 * Normaliza og:image: convierte URLs relativas a absolutas
 * y valida que no sea una URL de red social (Facebook, Instagram, etc.)
 */
function normalizeOgImage(url: string | undefined): string {
  if (!url) return '';
  // Rechazar URLs de redes sociales
  const invalidPatterns = ['facebook.com/photo', 'facebook.com/profile', 'instagram.com/p/', 'twitter.com/', 'x.com/'];
  if (invalidPatterns.some(p => url.includes(p))) return '';
  // Convertir rutas relativas a absolutas
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return url;
}

/**
 * 🎯 Hook de SEO Global con Sistema de Prioridad
 * 
 * SISTEMA DE PRIORIDAD (DE MAYOR A MENOR):
 * 1. ✅ Datos del CMS (MongoDB) - PRIORIDAD MÁXIMA
 * 2. ✅ Configuración hardcodeada (seoConfig.ts)
 * 3. ✅ Fallbacks genéricos
 * 
 * Características:
 * - Páginas CMS: Carga datos dinámicos desde el servidor
 * - Páginas Dashboard: Utiliza configuración estática
 * - Logging transparente del origen de datos (DEV mode)
 * - Sistema de cache inteligente y eventos en tiempo real
 * 
 * @param pageName - Identificador de la página (ej: "home", "blog")
 * @param fallbackTitle - Título alternativo (usado solo si no hay CMS ni hardcoded)
 * @param fallbackDescription - Descripción alternativa
 * 
 * @returns Estado de carga, datos SEO y componente Helmet optimizado
 */

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  canonical?: string;
  // 🔍 Metadata para transparencia
  _source?: 'cms' | 'hardcoded' | 'fallback';
}

interface UseSeoOptions {
  pageName: string; // 'home', 'about', 'services', etc.
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface UseSeoReturn {
  seoData: SeoData;
  isLoading: boolean;
  SeoHelmet: () => React.ReactElement | null;
}

const DEFAULT_SEO: SeoData = {
  metaTitle: 'THADO Consulting',
  metaDescription: 'Servicios contables, tributarios y financieros para MYPES en Perú.',
  keywords: ['contabilidad', 'tributación', 'SUNAT', 'MYPES', 'Perú'],
  ogTitle: 'THADO Consulting',
  ogDescription: 'Servicios contables, tributarios y financieros para MYPES en Perú.',
  ogImage: ''
};

// 📋 Páginas que SÍ existen en el CMS y necesitan datos dinámicos
// ⚠️ NOTA: 'home' NO está aquí porque tiene su propio sistema de SEO (ver Home.tsx)
const CMS_PAGES = ['about', 'services', 'contact', 'blog'];

// 📋 Páginas del dashboard que solo necesitan SEO estático
const DASHBOARD_PAGES = ['dashboard', 'cms', 'profile', 'settings', 'help', 'media'];

/**
 * 🎯 Hook global para manejo de SEO
 * FUENTE ÚNICA: CMS Database → fallback mínimo si el CMS no responde
 */
export function useSeo({ pageName, fallbackTitle, fallbackDescription }: UseSeoOptions): UseSeoReturn {
  // Estado inicial mínimo mientras se carga el CMS
  const [seoData, setSeoData] = useState<SeoData>(() => ({
    ...DEFAULT_SEO,
    metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
    metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
    _source: 'fallback'
  }));
  
  const [isLoading, setIsLoading] = useState(true);
  
  // 🎯 Determinar si la página necesita datos del CMS
  const needsCmsData = CMS_PAGES.includes(pageName);
  const isDashboardPage = DASHBOARD_PAGES.includes(pageName);

  // 🔄 Efecto para cargar datos de SEO
  useEffect(() => {
    const loadSeoData = async (forceRefresh = false) => {
      try {
        setIsLoading(true);
        
        // Páginas del dashboard: no necesitan API, usar fallback con títulos descriptivos
        if (isDashboardPage) {
          const staticSeoData: SeoData = {
            metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
            metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
            keywords: DEFAULT_SEO.keywords,
            ogTitle: fallbackTitle || DEFAULT_SEO.ogTitle,
            ogDescription: fallbackDescription || DEFAULT_SEO.ogDescription,
            ogImage: DEFAULT_SEO.ogImage,
            _source: 'fallback'
          };
          setSeoData(staticSeoData);
          document.title = staticSeoData.metaTitle;
          return;
        }
        
        // Páginas públicas: cargar SEO desde el CMS
        if (needsCmsData) {
          try {
            const data = forceRefresh 
              ? await forceReload(pageName)
              : await getPageBySlug(pageName, true);
            
            // ✅ CMS tiene datos: usarlos directamente
            if (data && data.seo && (data.seo.metaTitle || data.seo.metaDescription)) {
              const cmsSeoData: SeoData = {
                metaTitle: data.seo.metaTitle || fallbackTitle || DEFAULT_SEO.metaTitle,
                metaDescription: data.seo.metaDescription || fallbackDescription || DEFAULT_SEO.metaDescription,
                keywords: (data.seo.keywords && data.seo.keywords.length > 0)
                  ? data.seo.keywords
                  : DEFAULT_SEO.keywords,
                ogTitle: data.seo.ogTitle || data.seo.metaTitle || fallbackTitle || DEFAULT_SEO.ogTitle,
                ogDescription: data.seo.ogDescription || data.seo.metaDescription || fallbackDescription || DEFAULT_SEO.ogDescription,
                ogImage: normalizeOgImage(data.seo.ogImage) || '',
                canonical: PAGE_ROUTES[pageName] ? `${SITE_URL}${PAGE_ROUTES[pageName]}` : undefined,
                _source: 'cms'
              };
              setSeoData(cmsSeoData);
              document.title = cmsSeoData.metaTitle;
              return;
            }

            // CMS sin datos SEO configurados
            throw new Error(`CMS sin SEO configurado para la página "${pageName}"`);

          } catch (cmsError) {
            if (import.meta.env.DEV) {
              console.warn(`⚠️ [useSeo] "${pageName}" — CMS no disponible o sin datos SEO. Usando fallback hasta que configures el SEO en /dashboard/cms/seo`);
            }

            // Fallback mínimo: no bloquea el render, avisa en dev
            const fallbackSeoData: SeoData = {
              metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
              metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
              keywords: DEFAULT_SEO.keywords,
              ogTitle: fallbackTitle || DEFAULT_SEO.ogTitle,
              ogDescription: fallbackDescription || DEFAULT_SEO.ogDescription,
              ogImage: '',
              canonical: PAGE_ROUTES[pageName] ? `${SITE_URL}${PAGE_ROUTES[pageName]}` : undefined,
              _source: 'fallback'
            };
            setSeoData(fallbackSeoData);
            document.title = fallbackSeoData.metaTitle;
          }
        }
        
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(`❌ [useSeo] Error crítico en "${pageName}":`, error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // 🎯 Solo escuchar eventos CMS si la página necesita datos dinámicos
    const handleCMSUpdate = () => {
      if (needsCmsData) {
        loadSeoData(true); // Force refresh
      }
    };

    const handleClearCache = () => {
      if (needsCmsData) {
        loadSeoData(true); // Force refresh
      }
    };

    // Cargar datos inicial
    loadSeoData();

    // Solo registrar listeners para páginas CMS
    if (needsCmsData) {
      window.addEventListener('cmsUpdate', handleCMSUpdate);
      window.addEventListener('clearCache', handleClearCache);
    }

    return () => {
      if (needsCmsData) {
        window.removeEventListener('cmsUpdate', handleCMSUpdate);
        window.removeEventListener('clearCache', handleClearCache);
      }
    };
  }, [pageName, fallbackTitle, fallbackDescription, needsCmsData, isDashboardPage]);

  // 🎯 Efecto para sincronizar cambios de SEO (solo si cambia el título)
  useEffect(() => {
    if (seoData.metaTitle && seoData.metaTitle !== document.title) {
      document.title = seoData.metaTitle;
    }
  }, [seoData.metaTitle, seoData.metaDescription, pageName]);

  // 🎨 Componente Helmet optimizado
  const SeoHelmet = () => {
    if (!seoData.metaTitle) return null;

    // ✅ Construir canonical y og:url (prioridad: seoData.canonical > auto-generado)
    const canonicalUrl = seoData.canonical || (PAGE_ROUTES[pageName] ? `${SITE_URL}${PAGE_ROUTES[pageName]}` : undefined);

    return (
      <Helmet key={`seo-${pageName}-${seoData.metaTitle}`} defer={false}>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.keywords.join(', ')} />
        
        {/* Canonical URL */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
        {seoData.ogImageWidth && <meta property="og:image:width" content={seoData.ogImageWidth} />}
        {seoData.ogImageHeight && <meta property="og:image:height" content={seoData.ogImageHeight} />}
        {seoData.ogImageAlt && <meta property="og:image:alt" content={seoData.ogImageAlt} />}
        <meta property="og:type" content="website" />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:site_name" content="THADO Consulting" />
        <meta property="og:locale" content="es_PE" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.ogTitle} />
        <meta name="twitter:description" content={seoData.ogDescription} />
        {seoData.ogImage && <meta name="twitter:image" content={seoData.ogImage} />}
        {seoData.ogImageAlt && <meta name="twitter:image:alt" content={seoData.ogImageAlt} />}
      </Helmet>
    );
  };

  return {
    seoData,
    isLoading,
    SeoHelmet
  };
}

export default useSeo;