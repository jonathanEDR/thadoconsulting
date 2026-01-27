import { useState, useEffect } from 'react';
import { getPageBySlug, updatePage, clearCache } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_PAGE_CONFIG } from '../../utils/defaultConfig';
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
  }, [pageSlug]); // 🔥 Recargar cuando cambie el slug

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
      
      // 1️⃣ Intentar cargar del cache primero
      const cachedData = cms.getPages<PageData>(pageSlug);
      if (cachedData) {
        data = cachedData;
        setPageData(data);
        setLoading(false);
        return;
      }
      
      // 2️⃣ Si no hay cache, obtener de la API
      try {
        data = await getPageBySlug(pageSlug);
        
        // 3️⃣ Guardar en cache
        cms.setPages<PageData>(data, pageSlug);
      } catch (apiError) {
        console.warn(`⚠️ No se pudo conectar con la base de datos para "${pageSlug}", usando configuración predeterminada`);
        
        // 🔥 NUEVO: Configuración de fallback ESPECÍFICA por página
        // Obtener nombre de página según el slug
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

        // 🔥 NUEVO: SEO específico por página - ✅ Usando configuración centralizada
        const getSeoForPage = (slug: string) => {
          const { siteName, siteDescription, images, seo } = SITE_CONFIG;
          
          switch (slug) {
            case 'home':
              return {
                metaTitle: `${siteName} - Transformamos tu empresa con tecnología inteligente`,
                metaDescription: siteDescription,
                keywords: seo.defaultKeywords,
                ogTitle: `${siteName} - Tecnología Inteligente`,
                ogDescription: 'Transformamos procesos con soluciones digitales y modelos de IA personalizados',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'services':
              return {
                metaTitle: `Nuestros Servicios${seo.titleSuffix}`,
                metaDescription: 'Consultoría IT, Proyectos Tecnológicos e Inteligencia Artificial para impulsar tu negocio',
                keywords: ['servicios', 'consultoría', 'tecnología', 'software', 'inteligencia artificial'],
                ogTitle: `Servicios${seo.titleSuffix}`,
                ogDescription: 'Descubre nuestras soluciones tecnológicas diseñadas para transformar tu empresa',
                ogImage: images.ogServices,
                twitterCard: 'summary_large_image'
              };
            case 'about':
              return {
                metaTitle: `Sobre Nosotros${seo.titleSuffix}`,
                metaDescription: `Conoce más sobre ${siteName}, nuestra misión, visión y el equipo de expertos en tecnología`,
                keywords: ['sobre nosotros', 'equipo', 'misión', 'visión', siteName],
                ogTitle: `Sobre Nosotros${seo.titleSuffix}`,
                ogDescription: `Conoce más sobre ${siteName} y nuestro equipo`,
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'contact':
              return {
                metaTitle: `Contacto${seo.titleSuffix}`,
                metaDescription: 'Contáctanos para conocer más sobre nuestras soluciones tecnológicas',
                keywords: ['contacto', siteName, 'consulta', 'soporte'],
                ogTitle: `Contacto${seo.titleSuffix}`,
                ogDescription: 'Ponte en contacto con nuestro equipo',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'blog':
              return {
                metaTitle: `Blog ${siteName} - Noticias y Tendencias Tecnológicas`,
                metaDescription: 'Mantente informado con las últimas noticias y tendencias del sector tecnológico. Contenido curado por expertos.',
                keywords: ['blog', 'noticias tecnológicas', 'tendencias tech', 'desarrollo web', 'programación', 'AI'],
                ogTitle: `Blog ${siteName} - Noticias Tecnológicas`,
                ogDescription: 'Las últimas noticias y tendencias del sector tecnológico',
                ogImage: images.ogBlog,
                twitterCard: 'summary_large_image'
              };
            case 'blog-post-detail':
              return {
                metaTitle: 'Artículo del Blog - THADO Consulting',
                metaDescription: 'Lee nuestros artículos sobre tecnología, desarrollo de software e inteligencia artificial.',
                keywords: ['blog', 'artículo', 'tecnología', 'software', 'inteligencia artificial'],
                ogTitle: 'Blog - THADO Consulting',
                ogDescription: 'Contenido educativo sobre tecnología y desarrollo',
                ogImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage.dark,
                twitterCard: 'summary_large_image'
              };
            default:
              return {
                metaTitle: 'THADO Consulting',
                metaDescription: 'Soluciones tecnológicas inteligentes',
                keywords: ['tecnología', 'software'],
                ogTitle: 'THADO Consulting',
                ogDescription: 'Soluciones tecnológicas',
                ogImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage.dark,
                twitterCard: 'summary_large_image'
              };
          }
        };

        // 🔥 NUEVO: Hero específico por página
        const getHeroForPage = (slug: string) => {
          switch (slug) {
            case 'home':
              return {
                title: DEFAULT_PAGE_CONFIG.hero.title,
                subtitle: DEFAULT_PAGE_CONFIG.hero.subtitle,
                description: DEFAULT_PAGE_CONFIG.hero.description,
                ctaText: DEFAULT_PAGE_CONFIG.hero.ctaText,
                ctaLink: DEFAULT_PAGE_CONFIG.hero.ctaLink,
                backgroundImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage,
                backgroundImageAlt: DEFAULT_PAGE_CONFIG.hero.backgroundImageAlt,
                styles: DEFAULT_PAGE_CONFIG.hero.styles
              };
            case 'services':
              return {
                title: 'Nuestros Servicios',
                subtitle: 'Soluciones inteligentes para tu negocio',
                description: 'Descubre nuestras soluciones tecnológicas diseñadas para transformar tu empresa y potenciar su crecimiento.',
                ctaText: 'Ver Servicios',
                ctaLink: '/servicios',
                backgroundImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage,
                backgroundImageAlt: 'Servicios profesionales de tecnología',
                styles: DEFAULT_PAGE_CONFIG.hero.styles
              };
            case 'about':
              return {
                title: 'Sobre Nosotros',
                subtitle: 'Conoce nuestra historia',
                description: 'Somos un equipo apasionado por la tecnología y la innovación.',
                ctaText: 'Conocer más',
                ctaLink: '/nosotros',
                backgroundImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage,
                backgroundImageAlt: 'Equipo THADO Consulting',
                styles: DEFAULT_PAGE_CONFIG.hero.styles
              };
            case 'contact':
              return {
                title: 'Contáctanos',
                subtitle: 'Estamos aquí para ayudarte',
                description: 'Ponte en contacto con nosotros y descubre cómo podemos impulsar tu negocio.',
                ctaText: 'Enviar mensaje',
                ctaLink: '/contacto',
                backgroundImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage,
                backgroundImageAlt: 'Contacto THADO Consulting',
                styles: DEFAULT_PAGE_CONFIG.hero.styles
              };
            case 'blog':
              return {
                title: 'Blog',
                subtitle: 'Las últimas noticias y tendencias tecnológicas',
                description: 'Mantente informado con contenido curado por expertos en tecnología.',
                ctaText: 'Ver Noticias',
                ctaLink: '/blog',
                backgroundImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage,
                backgroundImageAlt: 'Blog THADO Consulting',
                styles: DEFAULT_PAGE_CONFIG.hero.styles
              };
            default:
              return {
                title: 'THADO Consulting',
                subtitle: 'Tecnología Inteligente',
                description: 'Transformamos empresas con soluciones digitales.',
                ctaText: 'Comenzar',
                ctaLink: '/',
                backgroundImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage,
                backgroundImageAlt: 'THADO Consulting',
                styles: DEFAULT_PAGE_CONFIG.hero.styles
              };
          }
        };

        // 🔥 NUEVO: Content específico por página
        // SOLO HOME tiene solutions, valueAdded, clientLogos
        const getContentForPage = (slug: string) => {
          const baseContent = {
            hero: getHeroForPage(slug)
          };

          // ✅ SOLO para HOME: agregar solutions, valueAdded, clientLogos
          if (slug === 'home') {
            return {
              ...baseContent,
              solutions: {
                title: DEFAULT_PAGE_CONFIG.solutions.title,
                description: DEFAULT_PAGE_CONFIG.solutions.subtitle,
                backgroundImage: DEFAULT_PAGE_CONFIG.solutions.backgroundImage,
                backgroundImageAlt: DEFAULT_PAGE_CONFIG.solutions.backgroundImageAlt,
                items: DEFAULT_PAGE_CONFIG.solutions.cards.map(card => ({
                  title: card.title,
                  description: card.description,
                  icon: card.icon,
                  gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
                })),
                cardsDesign: {
                  light: {
                    background: '#ffffff',
                    border: '#e2e8f0',
                    borderWidth: '1px',
                    shadow: '0 1px 3px rgba(0,0,0,0.1)',
                    hoverBackground: '#f8fafc',
                    hoverBorder: '#8b5cf6',
                    hoverShadow: '0 4px 12px rgba(139,92,246,0.15)',
                    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                    iconBackground: '#f8fafc',
                    iconColor: '#8b5cf6',
                    titleColor: '#1e293b',
                    descriptionColor: '#64748b',
                    linkColor: '#8b5cf6'
                  },
                  dark: {
                    background: '#1e293b',
                    border: '#334155',
                    borderWidth: '1px',
                    shadow: '0 1px 3px rgba(0,0,0,0.3)',
                    hoverBackground: '#334155',
                    hoverBorder: '#a78bfa',
                    hoverShadow: '0 4px 12px rgba(167,139,250,0.25)',
                    iconGradient: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
                    iconBackground: '#334155',
                    iconColor: '#a78bfa',
                    titleColor: '#f8fafc',
                    descriptionColor: '#cbd5e1',
                    linkColor: '#a78bfa'
                  }
                }
              }
            };
          }

          // ✅ Para SERVICES: solo hero (servicios se cargan de otra tabla)
          if (slug === 'services') {
            return baseContent;
          }

          // ✅ Para ABOUT: hero + campos de misión/visión
          if (slug === 'about') {
            return {
              ...baseContent,
              mission: 'Nuestra misión es transformar empresas con tecnología inteligente.',
              vision: 'Ser líderes en soluciones tecnológicas innovadoras.'
            };
          }

          // ✅ Para BLOG: hero + configuración específica del blog
          if (slug === 'blog') {
            return {
              ...baseContent,
              blogHero: {
                title: 'Blog',
                titleHighlight: 'Tech',
                subtitle: 'Las últimas noticias y tendencias tecnológicas',
                backgroundImage: '', // Imagen de fondo (vacío = usar gradiente)
                backgroundOverlay: 0.5, // Oscurecer imagen
                gradientFrom: '#3b82f6',
                gradientTo: '#9333ea',
                showStats: true,
                stats: {
                  articlesLabel: 'Artículos',
                  readersCount: '15K+',
                  readersLabel: 'Lectores'
                },
                search: {
                  placeholder: 'Buscar noticias...',
                  buttonText: 'Buscar'
                },
                styles: {
                  light: {
                    titleColor: '#ffffff',
                    titleHighlightColor: '#fde047',
                    subtitleColor: '#bfdbfe',
                    statsValueColor: '#ffffff',
                    statsLabelColor: '#bfdbfe'
                  },
                  dark: {
                    titleColor: '#ffffff',
                    titleHighlightColor: '#fde047',
                    subtitleColor: '#bfdbfe',
                    statsValueColor: '#ffffff',
                    statsLabelColor: '#bfdbfe'
                  }
                }
              }
            };
          }

          // ✅ Para CONTACT, SERVICES y otras páginas: solo hero
          return baseContent;
        };

        // Usar configuración predeterminada ESPECÍFICA como fallback
        data = {
          pageSlug: pageSlug,
          pageName: getPageName(pageSlug),
          content: getContentForPage(pageSlug),
          seo: getSeoForPage(pageSlug),
          theme: {
            default: 'dark' as const,
            lightMode: {
              primary: '#8b5cf6',
              secondary: '#06b6d4',
              background: '#ffffff',
              text: '#1e293b',
              textSecondary: '#64748b',
              cardBg: '#f8fafc',
              border: '#e2e8f0',
              buttons: {
                ctaPrimary: {
                  text: 'Comenzar Ahora',
                  background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #8B5CF6)',
                  textColor: '#FFFFFF',
                  borderColor: 'transparent'
                },
                contact: {
                  text: 'Contactar',
                  background: 'transparent',
                  textColor: '#8B5CF6',
                  borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
                },
                dashboard: {
                  text: 'Dashboard',
                  background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                  textColor: '#FFFFFF',
                  borderColor: 'transparent'
                }
              }
            },
            darkMode: {
              primary: '#a78bfa',
              secondary: '#22d3ee',
              background: '#0f172a',
              text: '#f8fafc',
              textSecondary: '#cbd5e1',
              cardBg: '#1e293b',
              border: '#334155',
              buttons: {
                ctaPrimary: {
                  text: 'Comenzar Ahora',
                  background: 'linear-gradient(90deg, #A78BFA, #22D3EE, #A78BFA)',
                  textColor: '#111827',
                  borderColor: 'transparent'
                },
                contact: {
                  text: 'Contactar',
                  background: 'transparent',
                  textColor: '#A78BFA',
                  borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
                },
                dashboard: {
                  text: 'Dashboard',
                  background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
                  textColor: '#111827',
                  borderColor: 'transparent'
                }
              }
            }
          },
          isPublished: true,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'sistema'
        };
      }
      
      // Migrar backgroundImage de string a objeto si es necesario
      if (typeof data.content.hero.backgroundImage === 'string') {
        const oldValue = data.content.hero.backgroundImage;
        data.content.hero.backgroundImage = {
          light: DEFAULT_PAGE_CONFIG.hero.backgroundImage.light,
          dark: oldValue || DEFAULT_PAGE_CONFIG.hero.backgroundImage.dark
        };
      }
      
      // 🔥 CORREGIDO: Solo migrar solutions si existe (solo HOME tiene solutions)
      if (data.content.solutions && typeof data.content.solutions.backgroundImage === 'string') {
        const oldValue = data.content.solutions.backgroundImage;
        data.content.solutions.backgroundImage = {
          light: DEFAULT_PAGE_CONFIG.solutions.backgroundImage.light,
          dark: oldValue || DEFAULT_PAGE_CONFIG.solutions.backgroundImage.dark
        };
      }
      
      // Asegurar que los estilos existen con valores predeterminados
      if (!data.content.hero.styles) {
        data.content.hero.styles = DEFAULT_PAGE_CONFIG.hero.styles;
      }
      
      // 🔥 CORREGIDO: Solo asegurar estilos de solutions si existe
      if (data.content.solutions && !data.content.solutions.styles) {
        data.content.solutions.styles = {
          light: { titleColor: '', descriptionColor: '' },
          dark: { titleColor: '', descriptionColor: '' }
        };
      }
      
      // Asegurar que los botones tengan valores por defecto si no existen
      // Sincronizados con la configuración actual de MongoDB
      if (data.theme) {
        // Valores por defecto para modo claro
        if (!data.theme.lightMode.buttons) {
          data.theme.lightMode.buttons = {
            ctaPrimary: {
              text: 'Comenzar Ahora',
              background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #8B5CF6)',
              textColor: '#FFFFFF',
              borderColor: 'transparent'
            },
            contact: {
              text: 'Contactar',
              background: 'transparent',
              textColor: '#8B5CF6',
              borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
            },
            dashboard: {
              text: 'Dashboard',
              background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
              textColor: '#FFFFFF',
              borderColor: 'transparent'
            }
          };
        }
        if (!data.theme.lightMode.buttons.ctaPrimary) {
          data.theme.lightMode.buttons.ctaPrimary = {
            text: 'Comenzar Ahora',
            background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #8B5CF6)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.lightMode.buttons.contact) {
          data.theme.lightMode.buttons.contact = {
            text: 'Contactar',
            background: 'transparent',
            textColor: '#8B5CF6',
            borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
          };
        }
        if (!data.theme.lightMode.buttons.dashboard) {
          data.theme.lightMode.buttons.dashboard = {
            text: 'Dashboard',
            background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }

        // Valores por defecto para modo oscuro
        if (!data.theme.darkMode.buttons) {
          data.theme.darkMode.buttons = {
            ctaPrimary: {
              text: 'Comenzar Ahora',
              background: 'linear-gradient(90deg, #A78BFA, #22D3EE, #A78BFA)',
              textColor: '#111827',
              borderColor: 'transparent'
            },
            contact: {
              text: 'Contactar',
              background: 'transparent',
              textColor: '#A78BFA',
              borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
            },
            dashboard: {
              text: 'Dashboard',
              background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
              textColor: '#111827',
              borderColor: 'transparent'
            }
          };
        }
        if (!data.theme.darkMode.buttons.ctaPrimary) {
          data.theme.darkMode.buttons.ctaPrimary = {
            text: 'Comenzar Ahora',
            background: 'linear-gradient(90deg, #A78BFA, #22D3EE, #A78BFA)',
            textColor: '#111827',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.darkMode.buttons.contact) {
          data.theme.darkMode.buttons.contact = {
            text: 'Contactar',
            background: 'transparent',
            textColor: '#A78BFA',
            borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
          };
        }
        if (!data.theme.darkMode.buttons.dashboard) {
          data.theme.darkMode.buttons.dashboard = {
            text: 'Dashboard',
            background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
            textColor: '#111827',
            borderColor: 'transparent'
          };
        }
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
      
      // ✅ ACTUALIZADO: Invalidar cache viejo y guardar datos frescos
      cms.invalidatePages(pageSlug);
      // Guardar los datos actuales en cache para evitar cargar datos viejos
      cms.setPages<PageData>(pageData, pageSlug);
      
      // 🔧 MANTENER: Limpiar caché para forzar que la página pública use datos frescos
      clearCache(`page-${pageSlug}`);
      
      setMessage({ type: 'success', text: '✅ Cambios guardados correctamente' });
      
      // Notificar a la página pública sobre la actualización
      window.dispatchEvent(new CustomEvent('cmsUpdate', {
        detail: { 
          timestamp: Date.now(),
          section: 'all',
          action: 'save'
        }
      }));
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('❌ [useCmsData] Error al guardar:', error);
      setMessage({ type: 'error', text: '❌ Error al guardar cambios' });
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