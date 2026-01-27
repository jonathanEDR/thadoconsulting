import { useEffect } from 'react';
import type { PageData } from '../types/cms';

interface UseDynamicSeoProps {
  pageData: PageData | null;
  routePath?: string;
}

export const useDynamicSeo = ({ pageData, routePath = '/' }: UseDynamicSeoProps) => {
  useEffect(() => {
    if (!pageData?.seo) return;

    const seo = pageData.seo;
    
    // 🔥 Actualizar título de la pestaña
    if (seo.metaTitle) {
      document.title = seo.metaTitle;
    }

    // 🔥 Actualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && seo.metaDescription) {
      metaDescription.setAttribute('content', seo.metaDescription);
    }

    // 🔥 Actualizar keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && seo.keywords && seo.keywords.length > 0) {
      metaKeywords.setAttribute('content', seo.keywords.join(', '));
    }

    // 🔥 Actualizar Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && seo.ogTitle) {
      ogTitle.setAttribute('content', seo.ogTitle);
    }

    // 🔥 Actualizar Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && seo.ogDescription) {
      ogDescription.setAttribute('content', seo.ogDescription);
    }

    // 🔥 Actualizar Open Graph image
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (seo.ogImage) {
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', seo.ogImage);
    }

    // 🔥 Actualizar Twitter Card title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && seo.ogTitle) {
      twitterTitle.setAttribute('content', seo.ogTitle);
    }

    // 🔥 Actualizar Twitter Card description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && seo.ogDescription) {
      twitterDescription.setAttribute('content', seo.ogDescription);
    }

    // 🔥 Actualizar Twitter Card image
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (seo.ogImage) {
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute('content', seo.ogImage);
    }

    // 🔥 Log para debugging
    console.log('🔍 [SEO] Meta tags actualizados:', {
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: seo.keywords?.join(', '),
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
      route: routePath
    });

  }, [pageData, routePath]);

  // 🔥 Función para obtener el título actual
  const getCurrentTitle = (): string => {
    return document.title;
  };

  // 🔥 Función para obtener la meta description actual
  const getCurrentDescription = (): string => {
    const metaDescription = document.querySelector('meta[name="description"]');
    return metaDescription?.getAttribute('content') || '';
  };

  return {
    getCurrentTitle,
    getCurrentDescription
  };
};

// 🔥 Hook específico para preview en tiempo real (para el panel CMS)
export const useSeoPreview = (seoData: any) => {
  useEffect(() => {
    if (!seoData) return;

    // Guardar valores originales
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content') || '';

    // Aplicar preview temporalmente
    if (seoData.metaTitle) {
      document.title = `[PREVIEW] ${seoData.metaTitle}`;
    }

    if (seoData.metaDescription && metaDescription) {
      metaDescription.setAttribute('content', seoData.metaDescription);
    }

    // Cleanup al desmontar
    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, [seoData]);
};