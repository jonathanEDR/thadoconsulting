import { useState, useEffect } from 'react';
import { getPageBySlug, updatePage, clearCache } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { SITE_CONFIG } from '../../config/siteConfig';
import { cms } from '../../utils/contentManagementCache';
import type { PageData, MessageState } from '../../types/cms';

export const useCmsData = (pageSlug: string = 'home') => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [message, setMessage] = useState<MessageState | null>(null);
  const { setThemeConfig } = useTheme();

  // Cargar datos de la página especificada
  useEffect(() => {
    loadPageData();
  }, [pageSlug]);

  // Sincronizar el tema con el contexto cuando cambian los datos
  useEffect(() => {
    if (pageData?.theme) {
      setThemeConfig(pageData.theme as any);
    }
  }, [pageData?.theme, setThemeConfig]);

  const loadPageData = async () => {
    try {
      setLoading(true);

      let data: PageData;

      // 1. Intentar cargar del cache primero
      const cachedData = cms.getPages<PageData>(pageSlug);
      if (cachedData) {
        data = cachedData;
        setPageData(data);
        setLoading(false);
        return;
      }

      // 2. Si no hay cache, obtener de la API
      try {
        data = await getPageBySlug(pageSlug);

        // 3. Guardar en cache
        cms.setPages<PageData>(data, pageSlug);
      } catch (apiError) {
        console.warn(`No se pudo conectar con la base de datos para "${pageSlug}", usando fallback mínimo`);

        const { siteName, siteDescription, images, seo } = SITE_CONFIG;

        // SEO mínimo por página
        const getSeoForPage = (slug: string) => {
          const base = {
            metaDescription: siteDescription,
            keywords: seo.defaultKeywords,
            ogImage: images.ogDefault,
            twitterCard: 'summary_large_image' as const,
          };
          switch (slug) {
            case 'home':
              return { ...base, metaTitle: siteName, ogTitle: siteName, ogDescription: siteDescription };
            case 'services':
              return { ...base, metaTitle: `Servicios${seo.titleSuffix}`, ogTitle: `Servicios${seo.titleSuffix}`, ogDescription: 'Soluciones tecnológicas para tu empresa' };
            case 'about':
              return { ...base, metaTitle: `Sobre Nosotros${seo.titleSuffix}`, ogTitle: `Sobre Nosotros${seo.titleSuffix}`, ogDescription: `Conoce más sobre ${siteName}` };
            case 'contact':
              return { ...base, metaTitle: `Contacto${seo.titleSuffix}`, ogTitle: `Contacto${seo.titleSuffix}`, ogDescription: 'Ponte en contacto con nuestro equipo' };
            case 'blog':
              return { ...base, metaTitle: `Blog${seo.titleSuffix}`, ogTitle: `Blog${seo.titleSuffix}`, ogDescription: 'Noticias y tendencias tecnológicas', ogImage: images.ogBlog };
            default:
              return { ...base, metaTitle: siteName, ogTitle: siteName, ogDescription: siteDescription };
          }
        };

        // Hero mínimo (los componentes muestran skeleton si no hay datos completos)
        const getHeroForPage = (slug: string) => {
          const emptyStyles = { light: {}, dark: {} };
          const emptyBg = { light: '', dark: '' };
          switch (slug) {
            case 'home':
              return { title: siteName, subtitle: '', description: '', ctaText: '', ctaLink: '/', backgroundImage: emptyBg, backgroundImageAlt: '', styles: emptyStyles };
            case 'services':
              return { title: 'Servicios', subtitle: '', description: '', ctaText: 'Ver Servicios', ctaLink: '/servicios', backgroundImage: emptyBg, backgroundImageAlt: '', styles: emptyStyles };
            case 'about':
              return { title: 'Sobre Nosotros', subtitle: '', description: '', ctaText: '', ctaLink: '/nosotros', backgroundImage: emptyBg, backgroundImageAlt: '', styles: emptyStyles };
            case 'contact':
              return { title: 'Contacto', subtitle: '', description: '', ctaText: '', ctaLink: '/contacto', backgroundImage: emptyBg, backgroundImageAlt: '', styles: emptyStyles };
            case 'blog':
              return { title: 'Blog', subtitle: '', description: '', ctaText: 'Ver Blog', ctaLink: '/blog', backgroundImage: emptyBg, backgroundImageAlt: '', styles: emptyStyles };
            default:
              return { title: siteName, subtitle: '', description: '', ctaText: '', ctaLink: '/', backgroundImage: emptyBg, backgroundImageAlt: '', styles: emptyStyles };
          }
        };

        const getPageName = (slug: string): string => {
          switch (slug) {
            case 'home': return 'Página de Inicio';
            case 'about': return 'Sobre Nosotros';
            case 'services': return 'Servicios';
            case 'contact': return 'Contacto';
            case 'blog': return 'Blog - Noticias';
            case 'blog-post-detail': return 'Detalle de Post del Blog';
            case 'servicio-detail': return 'Detalle de Servicio';
            default: return 'Página';
          }
        };

        // Contenido mínimo por página
        const getContentForPage = (slug: string) => {
          const baseContent = { hero: getHeroForPage(slug) };

          if (slug === 'about') {
            return { ...baseContent, mission: '', vision: '' };
          }

          if (slug === 'blog') {
            return {
              ...baseContent,
              blogHero: {
                title: 'Blog', titleHighlight: 'Tech',
                subtitle: '', backgroundImage: '', backgroundOverlay: 0.5,
                gradientFrom: '#3b82f6', gradientTo: '#9333ea', showStats: false,
                stats: { articlesLabel: 'Artículos', readersCount: '', readersLabel: 'Lectores' },
                search: { placeholder: 'Buscar...', buttonText: 'Buscar' },
                styles: { light: {}, dark: {} }
              }
            };
          }

          return baseContent;
        };

        data = {
          pageSlug,
          pageName: getPageName(pageSlug),
          content: getContentForPage(pageSlug),
          seo: getSeoForPage(pageSlug),
          theme: {
            default: 'dark' as const,
            lightMode: {
              primary: '#8b5cf6', secondary: '#06b6d4',
              background: '#ffffff', text: '#1e293b', textSecondary: '#64748b',
              cardBg: '#f8fafc', border: '#e2e8f0',
              buttons: {
                ctaPrimary: { text: '', background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)', textColor: '#FFFFFF', borderColor: 'transparent' },
                contact: { text: '', background: 'transparent', textColor: '#8B5CF6', borderColor: '#8B5CF6' },
                dashboard: { text: '', background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)', textColor: '#FFFFFF', borderColor: 'transparent' },
              },
            },
            darkMode: {
              primary: '#a78bfa', secondary: '#22d3ee',
              background: '#0f172a', text: '#f8fafc', textSecondary: '#cbd5e1',
              cardBg: '#1e293b', border: '#334155',
              buttons: {
                ctaPrimary: { text: '', background: 'linear-gradient(90deg, #A78BFA, #22D3EE)', textColor: '#111827', borderColor: 'transparent' },
                contact: { text: '', background: 'transparent', textColor: '#A78BFA', borderColor: '#A78BFA' },
                dashboard: { text: '', background: 'linear-gradient(90deg, #A78BFA, #22D3EE)', textColor: '#111827', borderColor: 'transparent' },
              },
            }
          },
          isPublished: true,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'sistema'
        };
      }

      // Migrar backgroundImage de string a objeto si es necesario
      if (data.content.hero && typeof data.content.hero.backgroundImage === 'string') {
        const oldValue = data.content.hero.backgroundImage;
        data.content.hero.backgroundImage = { light: oldValue || '', dark: oldValue || '' };
      }

      if (data.content.solutions && typeof data.content.solutions.backgroundImage === 'string') {
        const oldValue = data.content.solutions.backgroundImage;
        data.content.solutions.backgroundImage = { light: oldValue || '', dark: oldValue || '' };
      }

      // Asegurar que los estilos existen
      if (data.content.hero && !data.content.hero.styles) {
        data.content.hero.styles = { light: {}, dark: {} };
      }

      if (data.content.solutions && !data.content.solutions.styles) {
        data.content.solutions.styles = { light: { titleColor: '', descriptionColor: '' }, dark: { titleColor: '', descriptionColor: '' } };
      }

      setPageData(data);
    } catch (error) {
      console.error('Error al cargar página:', error);
      setMessage({ type: 'error', text: 'Error al cargar la página' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pageData) return;

    try {
      setSaving(true);

      await updatePage(pageSlug, {
        content: pageData.content,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });

      cms.invalidatePages(pageSlug);
      cms.setPages<PageData>(pageData, pageSlug);
      clearCache(`page-${pageSlug}`);

      setMessage({ type: 'success', text: 'Cambios guardados correctamente' });

      window.dispatchEvent(new CustomEvent('cmsUpdate', {
        detail: { timestamp: Date.now(), section: 'all', action: 'save' }
      }));

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('[useCmsData] Error al guardar:', error);
      setMessage({ type: 'error', text: 'Error al guardar cambios' });
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    pageData,
    message,
    setPageData,
    setMessage,
    setThemeConfig,
    loadPageData,
    handleSave
  };
};
