/**
 * 📄 PÁGINA DE DETALLES DEL SERVICIO
 * Página pública para mostrar información completa de un servicio
 * Sistema de paneles acordeón unificado
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as LucideIcons from 'lucide-react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import ContactModal from '../../components/public/ContactModal';
import PageLoader from '../../components/common/PageLoader';
import { useServicioDetail } from '../../hooks/useServiciosCache';
import { useCmsData } from '../../hooks/cms/useCmsData';
import { useTheme } from '../../contexts/ThemeContext';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import type { Servicio } from '../../types/servicios';

// Helper para renderizar iconos de Lucide dinámicamente
const LucideIcon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({ 
  name, 
  size = 24, 
  className = '',
  style = {}
}) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    // Fallback: si no se encuentra el icono, mostrar un placeholder o emoji si es un emoji
    if (name && name.length <= 2) {
      return <span className={className} style={style}>{name}</span>;
    }
    return <LucideIcons.HelpCircle size={size} className={className} style={style} />;
  }
  return <IconComponent size={size} className={className} style={style} />;
};

// Tipos para el sistema de paneles acordeón
type PanelType = 'descripcion' | 'caracteristicas' | 'beneficios' | 'incluye' | 'info' | 'faq' | 'multimedia';

interface PanelConfig {
  id: PanelType;
  label: string;
  icon: string;
  description: string;
}

const PANELS_CONFIG: PanelConfig[] = [
  { id: 'descripcion', label: 'Descripción', icon: '📋', description: 'Información general del servicio' },
  { id: 'caracteristicas', label: 'Características', icon: '✨', description: 'Qué ofrece este servicio' },
  { id: 'beneficios', label: 'Beneficios', icon: '🎯', description: 'Ventajas para tu negocio' },
  { id: 'incluye', label: 'Qué Incluye', icon: '✅', description: 'Detalle de inclusiones' },
  { id: 'info', label: 'Información Adicional', icon: '💡', description: 'Detalles extras' },
  { id: 'faq', label: 'Preguntas Frecuentes', icon: '❓', description: 'Dudas comunes' },
  { id: 'multimedia', label: 'Multimedia', icon: '🎥', description: 'Videos y galería' },
];

// ============================================
// HELPERS PARA DETECTAR CONTENIDO EN PANELES
// ============================================

const hasPanelContent = (servicio: Servicio, panelId: PanelType): boolean => {
  switch (panelId) {
    case 'descripcion':
      return !!(servicio.descripcion?.trim() || servicio.descripcionRica?.trim());
    case 'caracteristicas':
      return !!(servicio.caracteristicas && servicio.caracteristicas.length > 0);
    case 'beneficios':
      return !!(servicio.beneficios && servicio.beneficios.length > 0);
    case 'incluye':
      return !!(
        (servicio.incluye && servicio.incluye.length > 0) ||
        (servicio.noIncluye && servicio.noIncluye.length > 0) ||
        (servicio.tecnologias && servicio.tecnologias.length > 0)
      );
    case 'info':
      return !!(
        (sanitizeContenidoAdicional(servicio.contenidoAdicional) && sanitizeContenidoAdicional(servicio.contenidoAdicional).length > 0) ||
        (servicio.etiquetas && servicio.etiquetas.length > 0)
      );
    case 'faq':
      return !!(servicio.faq && servicio.faq.length > 0);
    case 'multimedia':
      return !!(
        servicio.videoUrl?.trim() ||
        (servicio.galeriaImagenes && servicio.galeriaImagenes.length > 0) ||
        (servicio.imagenes && servicio.imagenes.length > 0)
      );
    default:
      return false;
  }
};

/**
 * Obtiene los paneles disponibles basados en el contenido del servicio
 */
const getAvailablePanels = (servicio: Servicio): PanelConfig[] => {
  return PANELS_CONFIG.filter(panel => hasPanelContent(servicio, panel.id));
};

/**
 * Sanitiza el contenido adicional para evitar mostrar JSON técnico o datos de SEO
 */
const sanitizeContenidoAdicional = (contenido: string | undefined): string => {
  if (!contenido || !contenido.trim()) return '';
  
  // Detectar si el contenido parece ser JSON
  const jsonPatterns = [
    /^\s*\{\s*"title":/i,
    /^\s*\{\s*"description":/i,
    /^\s*SEO:\s*\{/i,
    /"metaTitle":/i,
    /"metaDescription":/i,
    /seo\s*[:=]\s*\{/i
  ];
  
  const isJSON = jsonPatterns.some(pattern => pattern.test(contenido));
  
  // Si parece JSON, no mostrar nada
  if (isJSON) {
    console.warn('⚠️ Contenido adicional contiene JSON técnico - no se mostrará');
    return '';
  }
  
  return contenido.trim();
};

export const ServicioDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Hook para obtener el tema actual (light/dark)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  // Estado para el panel acordeón activo (null = todos cerrados)
  const [activePanel, setActivePanel] = useState<PanelType | null>('descripcion');

  // 🆕 Configuración centralizada del sitio
  const { config, getFullUrl, getImageUrl, getServiceSchema, getBreadcrumbSchema } = useSiteConfig();

  // Obtener configuración del CMS para servicio-detail
  const { pageData: cmsConfig } = useCmsData('servicio-detail');
  
  // Extraer configuración de ServicioDetail
  const servicioDetailConfig = cmsConfig?.content?.servicioDetailConfig || {};
  const heroConfig = servicioDetailConfig.hero || {};
  const accordionConfig = servicioDetailConfig.accordion || {};
  const ctaConfig = servicioDetailConfig.cta || {};

  // Función para toggle del panel acordeón
  const togglePanel = (panelId: PanelType) => {
    setActivePanel(prev => prev === panelId ? null : panelId);
  };

  // Función helper para obtener estilos del acordeón basados en el tema
  const getAccordionStyles = () => {
    const styles = accordionConfig.styles;
    if (!styles) {
      // Valores por defecto si no hay configuración
      return theme === 'dark' ? {
        panelBackground: 'rgba(31, 41, 55, 0.4)',
        panelBorder: '#374151',
        headerBackground: 'transparent',
        headerText: '#ffffff',
        headerIcon: '#a78bfa',
        contentBackground: 'rgba(17, 24, 39, 0.3)',
        contentText: '#d1d5db',
        accentGradientFrom: '#a78bfa',
        accentGradientTo: '#22d3ee',
      } : {
        panelBackground: 'rgba(255, 255, 255, 0.6)',
        panelBorder: '#e5e7eb',
        headerBackground: 'transparent',
        headerText: '#111827',
        headerIcon: '#8b5cf6',
        contentBackground: 'rgba(255, 255, 255, 0.5)',
        contentText: '#374151',
        accentGradientFrom: '#8b5cf6',
        accentGradientTo: '#06b6d4',
      };
    }
    return theme === 'dark' ? styles.dark : styles.light;
  };

  // Función helper para obtener estilos de tipografía del acordeón
  const getAccordionTypography = () => {
    const typography = accordionConfig.styles?.typography;
    if (!typography) {
      return {
        fontFamily: 'Montserrat, sans-serif',
        headerFontSize: '1.125rem',
        headerFontWeight: '600',
        contentFontSize: '1rem',
        contentLineHeight: '1.75'
      };
    }
    return typography;
  };

  // Función helper para obtener estilos de las tarjetas de contenido (beneficios, características, etc.)
  const getCardStyles = () => {
    const contentCards = accordionConfig.styles?.contentCards;
    
    // Valores por defecto
    const defaultLight = {
      background: 'rgba(0, 0, 0, 0.05)',
      borderColor: 'transparent',
      borderWidth: '0',
      textColor: '#374151',
      borderRadius: '0.5rem',
      iconBackground: 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)',
      iconColor: '#ffffff',
      iconGradientFrom: '#8b5cf6',
    };
    
    const defaultDark = {
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'transparent',
      borderWidth: '0',
      textColor: '#d1d5db',
      borderRadius: '0.5rem',
      iconBackground: 'linear-gradient(to bottom right, #a78bfa, #22d3ee)',
      iconColor: '#ffffff',
      iconGradientFrom: '#a78bfa',
    };

    if (!contentCards) {
      return theme === 'dark' ? defaultDark : defaultLight;
    }

    const themeStyles = theme === 'dark' ? contentCards.dark : contentCards.light;
    const defaults = theme === 'dark' ? defaultDark : defaultLight;
    
    // Reconstruir iconBackground si usa gradiente
    let iconBackground = themeStyles?.iconBackground || defaults.iconBackground;
    
    // Si tiene configuración de gradiente separada, reconstruir el valor
    if (themeStyles?.iconBackgroundType === 'gradient' && themeStyles?.iconGradientFrom && themeStyles?.iconGradientTo) {
      const direction = themeStyles.iconGradientDirection || 'to bottom right';
      iconBackground = `linear-gradient(${direction}, ${themeStyles.iconGradientFrom}, ${themeStyles.iconGradientTo})`;
    } else if (themeStyles?.iconBackgroundType === 'solid' && themeStyles?.iconBackground) {
      // Si es color sólido, usar directamente
      iconBackground = themeStyles.iconBackground;
    }
    
    return {
      background: themeStyles?.background || defaults.background,
      borderColor: themeStyles?.borderColor || defaults.borderColor,
      borderWidth: themeStyles?.borderWidth || defaults.borderWidth,
      textColor: themeStyles?.textColor || defaults.textColor,
      borderRadius: themeStyles?.borderRadius || defaults.borderRadius,
      iconBackground,
      iconColor: themeStyles?.iconColor || defaults.iconColor,
      iconGradientFrom: themeStyles?.iconGradientFrom || (theme === 'dark' ? '#a78bfa' : '#8b5cf6'),
    };
  };

  // Función helper para obtener configuración de iconos del header del acordeón
  const getIconConfig = () => {
    const iconConfig = accordionConfig.styles?.iconConfig;
    
    // Valores por defecto - SIN fondo para un look más limpio
    const defaultLight = {
      showBackground: false,
      iconColor: '#8b5cf6',
      iconActiveColor: '#7c3aed',
      backgroundColor: '#f3f4f6',
      backgroundActiveColor: '#8b5cf6',
    };
    
    const defaultDark = {
      showBackground: false,
      iconColor: '#a78bfa',
      iconActiveColor: '#c4b5fd',
      backgroundColor: '#374151',
      backgroundActiveColor: '#a78bfa',
    };

    if (!iconConfig) {
      return theme === 'dark' ? defaultDark : defaultLight;
    }

    const themeConfig = theme === 'dark' ? iconConfig.dark : iconConfig.light;
    const defaults = theme === 'dark' ? defaultDark : defaultLight;

    return {
      showBackground: themeConfig?.showBackground ?? defaults.showBackground,
      iconColor: themeConfig?.iconColor || defaults.iconColor,
      iconActiveColor: themeConfig?.iconActiveColor || defaults.iconActiveColor,
      backgroundColor: themeConfig?.backgroundColor || defaults.backgroundColor,
      backgroundActiveColor: themeConfig?.backgroundActiveColor || defaults.backgroundActiveColor,
    };
  };

  // Helper para obtener el icono de un panel desde la configuración del CMS
  const getPanelIcon = (panelId: string): string => {
    const cmsPanel = accordionConfig.panels?.find((p: any) => p.id === panelId);
    if (cmsPanel?.icon) {
      return cmsPanel.icon;
    }
    // Fallback a iconos por defecto
    const defaultIcons: Record<string, string> = {
      descripcion: 'FileText',
      caracteristicas: 'Sparkles',
      beneficios: 'Target',
      incluye: 'CheckCircle',
      info: 'Lightbulb',
      faq: 'HelpCircle',
      multimedia: 'Video',
    };
    return defaultIcons[panelId] || 'HelpCircle';
  };

  // Helper para obtener configuración de iconos de secciones de tarjetas (características, beneficios, incluye, noIncluye)
  const getSectionIconConfig = (sectionId: 'caracteristicas' | 'beneficios' | 'incluye' | 'noIncluye') => {
    const sectionIcons = accordionConfig.styles?.sectionIcons;
    
    // Valores por defecto para cada sección - SIN FONDO
    const defaults: Record<string, { type: 'number' | 'icon' | 'none'; icon: string; showBackground: boolean }> = {
      caracteristicas: { type: 'number', icon: 'Hash', showBackground: false },
      beneficios: { type: 'icon', icon: 'Star', showBackground: false },
      incluye: { type: 'icon', icon: 'Check', showBackground: false },
      noIncluye: { type: 'icon', icon: 'X', showBackground: false },
    };

    if (!sectionIcons || !sectionIcons[sectionId]) {
      return defaults[sectionId];
    }

    const config = sectionIcons[sectionId];
    return {
      type: config.type || defaults[sectionId].type,
      icon: config.icon || defaults[sectionId].icon,
      showBackground: config.showBackground ?? defaults[sectionId].showBackground,
    };
  };

  // ============================================
  // HOOK DE CACHE - REEMPLAZA USEEFFECT + API CALL
  // ============================================

  const {
    data: servicio,
    loading,
    error: errorServicio,
    isPrerendering
  } = useServicioDetail(slug || '', {
    enabled: !!slug,
    onSuccess: () => {
      // Silenciar logs en producción
    },
    onError: () => {
      // Silenciar logs en producción
    }
  });

  const error = errorServicio;

  // Calcular paneles disponibles basados en el contenido del servicio
  const availablePanels = servicio ? getAvailablePanels(servicio) : PANELS_CONFIG;

  // DEBUG: Mostrar datos del servicio en consola (remover en producción)
  useEffect(() => {
    if (servicio) {
      // console.log('📦 Servicio cargado:', {
      //   titulo: servicio.titulo,
      //   caracteristicas: servicio.caracteristicas,
      //   beneficios: servicio.beneficios,
      //   incluye: servicio.incluye,
      //   noIncluye: servicio.noIncluye,
      //   tecnologias: servicio.tecnologias,
      //   faq: servicio.faq,
      //   etiquetas: servicio.etiquetas,
      //   videoUrl: servicio.videoUrl,
      //   galeriaImagenes: servicio.galeriaImagenes,
      //   imagenes: servicio.imagenes,
      // });
      // console.log('📑 Paneles disponibles:', availablePanels.map(p => p.label));
    }
  }, [servicio, availablePanels]);

  // Abrir el primer panel disponible al cargar
  useEffect(() => {
    if (servicio && availablePanels.length > 0 && activePanel === null) {
      setActivePanel(availablePanels[0].id);
    }
  }, [servicio, availablePanels]);

  // ============================================
  // SEO: Ahora usa los datos del servicio directamente
  // ============================================

  // Ensure scroll to top when component mounts or slug changes
  useEffect(() => {
    // Scroll to top with a small delay to ensure proper rendering
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 150);

    return () => clearTimeout(scrollTimeout);
  }, [slug]);

  const formatPrice = (servicio: Servicio) => {
    // Determinar el símbolo de moneda correcto
    const getCurrencySymbol = (moneda?: string): string => {
      switch (moneda?.toUpperCase()) {
        case 'PEN': return 'S/.';
        case 'USD': return '$';
        case 'EUR': return '€';
        default: return 'S/.';
      }
    };
    
    const symbol = getCurrencySymbol(servicio.moneda);
    
    if (servicio.tipoPrecio === 'consultar') {
      return 'Consultar precio';
    }
    if (servicio.tipoPrecio === 'personalizado') {
      return 'Precio personalizado';
    }
    if (servicio.tipoPrecio === 'desde' && servicio.precio) {
      return `Desde ${symbol} ${servicio.precio.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'rango' && servicio.precioMin && servicio.precioMax) {
      return `${symbol} ${servicio.precioMin.toLocaleString()} - ${symbol} ${servicio.precioMax.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'paquetes') {
      return 'Ver paquetes disponibles';
    }
    if (servicio.tipoPrecio === 'suscripcion' && servicio.precio) {
      return `${symbol} ${servicio.precio.toLocaleString()}/mes`;
    }
    if (servicio.tipoPrecio === 'fijo' && servicio.precio) {
      return `${symbol} ${servicio.precio.toLocaleString()}`;
    }
    return 'Consultar precio';
  };

  const getDurationText = (servicio: Servicio) => {
    if (!servicio.duracion) return null;
    const { valor, unidad } = servicio.duracion;
    return `⏱️ Duración: ${valor} ${unidad}`;
  };

  if (loading) {
    return <PageLoader fullScreen message="Cargando servicio..." size="lg" />;
  }

  // ✅ IMPORTANTE: Mostrar error SOLO si hay un error explícito, no solo porque servicio sea null
  // Esto evita el flash de "no encontrado" antes de que cargue
  if (error) {
    // ✅ SEO FIX: Durante pre-renderizado, NO mostrar "Servicio no encontrado"
    // El contenido estático ya fue generado por prerender-services.js
    if (isPrerendering) {
      return null; // Permite que el HTML estático permanezca visible
    }
    
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <PublicHeader />
        <div className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20 animate-scale-in">
              <div className="text-8xl mb-6 animate-bounce">🚫</div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                {error || 'Servicio no encontrado'}
              </h1>
              <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                El servicio que buscas no está disponible o no existe.
              </p>
              <Link
                to="/servicios"
                className="inline-flex items-center px-6 py-3 text-white rounded-lg transition-colors font-semibold"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}
              >
                ← Volver a servicios
              </Link>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // ✅ Si no hay error pero tampoco hay servicio, mostrar loading (no error)
  if (!servicio) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <PublicHeader />
        <div className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-96 animate-fade-in">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
                <p className="text-lg animate-pulse" style={{ color: 'var(--color-text-secondary)' }}>Cargando servicio...</p>
              </div>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // ✅ Detectar si ya hay meta tags pre-renderizados (para evitar duplicación)
  const isPrerendered = typeof window !== 'undefined' && 
    document.querySelector('meta[name="description"][data-rh="true"]') !== null;

  return (
    <div className="min-h-screen animate-fade-in" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ✅ SEO directo del servicio - Prioriza campos SEO configurados */}
      {/* ⚠️ Solo actualiza meta tags si NO están pre-renderizados (evita duplicación) */}
      {!isPrerendered && (
        <Helmet>
          <title>{servicio.seo?.titulo || servicio.metaTitle || `${servicio.titulo}${config.seo.titleSuffix}`}</title>
          <meta name="description" content={servicio.seo?.descripcion || servicio.metaDescription || servicio.descripcionCorta || servicio.descripcion || `Servicio de ${servicio.titulo}${config.seo.titleSuffix}`} />
          <meta name="keywords" content={servicio.seo?.palabrasClave || servicio.etiquetas?.join(', ') || `${servicio.titulo}, servicio, desarrollo, tecnología`} />

          {/* Open Graph - ✅ Usando configuración centralizada */}
          <meta property="og:title" content={servicio.seo?.titulo || servicio.metaTitle || `${servicio.titulo}${config.seo.titleSuffix}`} />
          <meta property="og:description" content={servicio.seo?.descripcion || servicio.metaDescription || servicio.descripcionCorta || servicio.descripcion || `Servicio de ${servicio.titulo}`} />
          <meta property="og:image" content={servicio.imagenPrincipal || servicio.imagen || getImageUrl(config.images.ogServices)} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={`${servicio.titulo} - Servicio de ${config.siteName}`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={getFullUrl(`/servicios/${servicio.slug}`)} />
          <meta property="og:site_name" content={config.siteName} />
          <meta property="og:locale" content={config.locale} />

          {/* Twitter Card - ✅ Usando configuración centralizada */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={servicio.seo?.titulo || servicio.metaTitle || `${servicio.titulo}${config.seo.titleSuffix}`} />
          <meta name="twitter:description" content={servicio.seo?.descripcion || servicio.metaDescription || servicio.descripcionCorta || servicio.descripcion || `Servicio de ${servicio.titulo}`} />
          <meta name="twitter:image" content={servicio.imagenPrincipal || servicio.imagen || getImageUrl(config.images.ogServices)} />
          <meta name="twitter:image:alt" content={`${servicio.titulo} - Servicio de ${config.siteName}`} />

          {/* Canonical */}
          <link rel="canonical" href={getFullUrl(`/servicios/${servicio.slug}`)} />
          
          {/* ✅ Schema.org JSON-LD - Usando helpers centralizados */}
          <script type="application/ld+json">
            {JSON.stringify(getServiceSchema({
              name: servicio.titulo,
              description: servicio.seo?.descripcion || servicio.descripcion || '',
              url: getFullUrl(`/servicios/${servicio.slug}`),
              image: servicio.imagenPrincipal || servicio.imagen,
              price: servicio.tipoPrecio !== 'personalizado' ? servicio.precio : undefined,
              currency: servicio.moneda,
              category: typeof servicio.categoria === 'object' ? servicio.categoria?.nombre : servicio.categoria,
            }))}
          </script>
          
          {/* ✅ Schema.org BreadcrumbList - Usando helper centralizado */}
          <script type="application/ld+json">
            {JSON.stringify(getBreadcrumbSchema([
              { name: 'Inicio', url: '/' },
              { name: 'Servicios', url: '/servicios' },
              { name: servicio.titulo, url: `/servicios/${servicio.slug}` },
            ]))}
          </script>
        </Helmet>
      )}

      <PublicHeader />
      
      {/* ============================================ */}
      {/* SECCIÓN 1: HERO - USA FONDO DEL TEMA */}
      {/* ============================================ */}
      <section 
        className="pt-20 pb-12 relative"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb con animación */}
          <nav className="mb-8 animate-fade-in-down">
            <ol className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li><Link to="/" className="transition-colors duration-300" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>Inicio</Link></li>
              <li>{'>'}</li>
              <li><Link to="/servicios" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>Servicios</Link></li>
              <li>{'>'}</li>
              <li style={{ color: 'var(--color-text)' }}>{servicio.titulo}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Información principal con animación */}
            <div className="animate-slide-in-right">
              {/* Categoría con animación */}
              {heroConfig.content?.showCategoryTag !== false && (
                <div className="mb-4 animate-fade-in delay-100">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                    {typeof servicio.categoria === 'string' ? servicio.categoria : servicio.categoria?.nombre || 'Sin categoría'}
                  </span>
                  {servicio.destacado && (
                    <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105" style={{ backgroundColor: 'color-mix(in srgb, #FCD34D 20%, transparent)', color: '#D97706' }}>
                      ★ Destacado
                    </span>
                  )}
                </div>
              )}

              {/* Título con animación y gradiente opcional */}
              <h1 
                className={`mb-6 animate-fade-in delay-200 ${
                  heroConfig.content?.title?.fontSize || 'text-4xl lg:text-5xl'
                } ${
                  heroConfig.content?.title?.fontWeight || 'font-bold'
                } ${
                  heroConfig.content?.title?.lineHeight || 'leading-tight'
                }`}
                style={{
                  fontFamily: heroConfig.content?.title?.fontFamily || 'Montserrat',
                  ...(heroConfig.content?.titleGradient?.enabled
                    ? {
                        backgroundImage: `linear-gradient(to right, ${heroConfig.content.titleGradient.from}, ${heroConfig.content.titleGradient.to})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }
                    : {})
                }}
              >
                {servicio.titulo}
              </h1>

              {/* Descripción corta con animación */}
              {servicio.descripcionCorta && (
                <p 
                  className={`mb-8 animate-fade-in delay-300 ${
                    heroConfig.content?.subtitle?.fontSize || 'text-xl'
                  } ${
                    heroConfig.content?.subtitle?.fontWeight || 'font-normal'
                  } ${
                    heroConfig.content?.subtitle?.lineHeight || 'leading-relaxed'
                  }`}
                  style={{
                    fontFamily: heroConfig.content?.subtitle?.fontFamily || 'Montserrat',
                    color: heroConfig.content?.subtitle?.color || (theme === 'dark' ? '#d1d5db' : '#374151')
                  }}
                >
                  {servicio.descripcionCorta}
                </p>
              )}

              {/* Precio y duración con animación */}
              {heroConfig.content?.showPrice !== false && (
                <div className="flex flex-wrap gap-4 mb-8 animate-fade-in delay-400">
                  <div
                    className="backdrop-blur-sm rounded-lg px-6 py-4 border hover-lift transition-all duration-300"
                    style={{
                      background: theme === 'dark'
                        ? heroConfig.cards?.dark.background || 'rgba(31, 41, 55, 0.5)'
                        : heroConfig.cards?.light.background || 'rgba(255, 255, 255, 0.8)',
                      borderColor: theme === 'dark'
                        ? heroConfig.cards?.dark.borderColor || '#374151'
                        : heroConfig.cards?.light.borderColor || '#d1d5db',
                    }}
                  >
                    <div
                      className="text-sm mb-1"
                      style={{
                        color: theme === 'dark'
                          ? heroConfig.cards?.dark.labelColor || '#9ca3af'
                          : heroConfig.cards?.light.labelColor || '#6b7280',
                      }}
                    >
                      Precio
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{
                        color: theme === 'dark'
                          ? heroConfig.cards?.dark.textColor || '#ffffff'
                          : heroConfig.cards?.light.textColor || '#111827',
                      }}
                    >
                      {formatPrice(servicio)}
                    </div>
                  </div>
                  
                  {getDurationText(servicio) && (
                    <div
                      className="backdrop-blur-sm rounded-lg px-6 py-4 border hover-lift transition-all duration-300"
                      style={{
                        background: theme === 'dark'
                          ? heroConfig.cards?.dark.background || 'rgba(31, 41, 55, 0.5)'
                          : heroConfig.cards?.light.background || 'rgba(255, 255, 255, 0.8)',
                        borderColor: theme === 'dark'
                          ? heroConfig.cards?.dark.borderColor || '#374151'
                          : heroConfig.cards?.light.borderColor || '#d1d5db',
                      }}
                    >
                      <div
                        className="text-sm mb-1"
                        style={{
                          color: theme === 'dark'
                            ? heroConfig.cards?.dark.labelColor || '#9ca3af'
                            : heroConfig.cards?.light.labelColor || '#6b7280',
                        }}
                      >
                        Duración
                      </div>
                      <div
                        className="text-lg font-semibold"
                        style={{
                          color: theme === 'dark'
                            ? heroConfig.cards?.dark.textColor || '#ffffff'
                            : heroConfig.cards?.light.textColor || '#111827',
                        }}
                      >
                        {servicio.duracion?.valor} {servicio.duracion?.unidad}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Badges informativos adicionales */}
              {(servicio.tiempoEntrega || servicio.garantia || servicio.soporte) && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {servicio.tiempoEntrega && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ backgroundColor: 'color-mix(in srgb, #3B82F6 10%, transparent)', borderColor: 'color-mix(in srgb, #3B82F6 30%, transparent)' }}>
                      <span className="text-lg">⏱️</span>
                      <div>
                        <span className="text-xs font-medium" style={{ color: '#2563EB' }}>Entrega:</span>
                        <span className="ml-1 text-sm font-semibold" style={{ color: '#1E40AF' }}>
                          {servicio.tiempoEntrega}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {servicio.garantia && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ backgroundColor: 'color-mix(in srgb, #10B981 10%, transparent)', borderColor: 'color-mix(in srgb, #10B981 30%, transparent)' }}>
                      <span className="text-lg">🛡️</span>
                      <div>
                        <span className="text-xs font-medium" style={{ color: '#059669' }}>Garantía:</span>
                        <span className="ml-1 text-sm font-semibold" style={{ color: '#047857' }}>
                          {servicio.garantia}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {servicio.soporte && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-secondary) 30%, transparent)' }}>
                      <span className="text-lg">💬</span>
                      <div>
                        <span className="text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>Soporte:</span>
                        <span className="ml-1 text-sm font-semibold capitalize" style={{ color: 'color-mix(in srgb, var(--color-secondary) 80%, #000000)' }}>
                          {servicio.soporte}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Botón Primario */}
                {heroConfig.buttons?.primary?.enabled !== false && (
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg transition-all shadow-lg transform hover:scale-105"
                    style={{
                      background: heroConfig.buttons?.primary?.style === 'gradient'
                        ? theme === 'dark'
                          ? `linear-gradient(to right, ${heroConfig.buttons.primary.dark?.gradient?.from || '#a78bfa'}, ${heroConfig.buttons.primary.dark?.gradient?.to || '#22d3ee'})`
                          : `linear-gradient(to right, ${heroConfig.buttons.primary.light?.gradient?.from || '#8b5cf6'}, ${heroConfig.buttons.primary.light?.gradient?.to || '#06b6d4'})`
                        : heroConfig.buttons?.primary?.style === 'solid'
                        ? theme === 'dark'
                          ? heroConfig.buttons.primary.dark?.solidColor || '#a78bfa'
                          : heroConfig.buttons.primary.light?.solidColor || '#8b5cf6'
                        : 'transparent',
                      color: theme === 'dark'
                        ? heroConfig.buttons?.primary?.dark?.textColor || '#ffffff'
                        : heroConfig.buttons?.primary?.light?.textColor || '#ffffff',
                      border: heroConfig.buttons?.primary?.style === 'outline'
                        ? theme === 'dark'
                          ? `2px solid ${heroConfig.buttons.primary.dark?.borderColor || '#a78bfa'}`
                          : `2px solid ${heroConfig.buttons.primary.light?.borderColor || '#8b5cf6'}`
                        : 'none',
                    }}
                  >
                    💬 {heroConfig.buttons?.primary?.text || 'Solicitar Cotización'}
                  </button>
                )}
                
                {/* Botón Secundario */}
                {heroConfig.buttons?.secondary?.enabled !== false && (
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg transition-all transform hover:scale-105"
                    style={{
                      background: heroConfig.buttons?.secondary?.style === 'gradient'
                        ? theme === 'dark'
                          ? `linear-gradient(to right, ${heroConfig.buttons.secondary.dark?.gradient?.from || '#f472b6'}, ${heroConfig.buttons.secondary.dark?.gradient?.to || '#fbbf24'})`
                          : `linear-gradient(to right, ${heroConfig.buttons.secondary.light?.gradient?.from || '#ec4899'}, ${heroConfig.buttons.secondary.light?.gradient?.to || '#f59e0b'})`
                        : heroConfig.buttons?.secondary?.style === 'solid'
                        ? theme === 'dark'
                          ? heroConfig.buttons.secondary.dark?.solidColor || 'transparent'
                          : heroConfig.buttons.secondary.light?.solidColor || 'transparent'
                        : 'transparent',
                      color: theme === 'dark'
                        ? heroConfig.buttons?.secondary?.dark?.textColor || '#a78bfa'
                        : heroConfig.buttons?.secondary?.light?.textColor || '#8b5cf6',
                      border: heroConfig.buttons?.secondary?.style === 'outline'
                        ? theme === 'dark'
                          ? `2px solid ${heroConfig.buttons.secondary.dark?.borderColor || '#a78bfa'}`
                          : `2px solid ${heroConfig.buttons.secondary.light?.borderColor || '#8b5cf6'}`
                        : 'none',
                    }}
                  >
                    ← {heroConfig.buttons?.secondary?.text || 'Volver'}
                  </button>
                )}
              </div>
            </div>

            {/* Imagen principal */}
            <div>
              {servicio.imagen ? (
                <img
                  src={servicio.imagen}
                  alt={servicio.titulo}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <div 
                  className="w-full h-96 rounded-2xl flex items-center justify-center border"
                  style={{
                    background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--color-primary) 15%, transparent), color-mix(in srgb, var(--color-secondary) 15%, transparent))',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {servicio.icono || '🚀'}
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Imagen del servicio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECCIÓN 2: ACORDEÓN - USA FONDO DEL TEMA */}
      {/* ============================================ */}
      <section 
        className="py-12 relative"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Título de la sección - Configurable desde CMS */}
          {(accordionConfig.header?.showTitle !== false || accordionConfig.header?.showSubtitle !== false) && (
            <div className={`mb-10 ${
              accordionConfig.header?.alignment === 'left' ? 'text-left' :
              accordionConfig.header?.alignment === 'right' ? 'text-right' : 'text-center'
            }`}>
              {accordionConfig.header?.showTitle !== false && (
                <h2 
                  className={`${accordionConfig.header?.title?.fontSize || 'text-3xl md:text-4xl'} ${accordionConfig.header?.title?.fontWeight || 'font-bold'} ${accordionConfig.header?.title?.lineHeight || 'leading-tight'} mb-3 flex items-center gap-3 ${
                    accordionConfig.header?.alignment === 'left' ? 'justify-start' :
                    accordionConfig.header?.alignment === 'right' ? 'justify-end' : 'justify-center'
                  }`}
                  style={{ 
                    color: theme === 'dark' 
                      ? (accordionConfig.header?.title?.colorDark || '#FFFFFF')
                      : (accordionConfig.header?.title?.color || '#111827'),
                    fontFamily: accordionConfig.header?.title?.fontFamily || 'Montserrat',
                  }}
                >
                  {/* Renderizar Emoji o Icono Lucide según configuración */}
                  {accordionConfig.header?.iconType === 'lucide' ? (
                    <LucideIcon 
                      name={accordionConfig.header?.iconName || 'BookOpen'} 
                      size={36} 
                      style={{ 
                        color: theme === 'dark' 
                          ? (accordionConfig.header?.iconColorDark || '#a78bfa')
                          : (accordionConfig.header?.iconColor || '#7c3aed')
                      }} 
                    />
                  ) : (
                    <span className="text-4xl">{accordionConfig.header?.title?.icon || '📚'}</span>
                  )}
                  {accordionConfig.header?.title?.text || 'Información Completa'}
                </h2>
              )}
              {accordionConfig.header?.showSubtitle !== false && (
                <p 
                  className={`${accordionConfig.header?.subtitle?.fontSize || 'text-lg'} ${accordionConfig.header?.subtitle?.fontWeight || 'font-normal'} ${accordionConfig.header?.subtitle?.lineHeight || 'leading-relaxed'}`}
                  style={{ 
                    color: theme === 'dark' 
                      ? (accordionConfig.header?.subtitle?.colorDark || '#9CA3AF')
                      : (accordionConfig.header?.subtitle?.color || '#4B5563'),
                    fontFamily: accordionConfig.header?.subtitle?.fontFamily || 'Montserrat',
                  }}
                >
                  {accordionConfig.header?.subtitle?.text || 'Haz clic en cada sección para ver más detalles'}
                </p>
              )}
            </div>
          )}

          {/* Paneles Acordeón - Sin tarjeta contenedora */}
          <div className="space-y-3">
            
            {/* ========== PANEL: DESCRIPCIÓN ========== */}
            {hasPanelContent(servicio, 'descripcion') && (
              <div 
                className="accordion-panel rounded-xl overflow-hidden backdrop-blur-sm hover:opacity-90 transition-all duration-300 border"
                style={{
                  background: getAccordionStyles().panelBackground,
                  borderColor: getAccordionStyles().panelBorder,
                }}
              >
                <button
                  onClick={() => togglePanel('descripcion')}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300"
                  style={{
                    background: activePanel === 'descripcion'
                      ? `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}15, ${getAccordionStyles().accentGradientTo}15)`
                      : getAccordionStyles().headerBackground,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center justify-center transition-all duration-300 ${getIconConfig().showBackground ? 'w-12 h-12 rounded-xl shadow-lg' : 'w-8 h-8'}`}
                      style={{
                        background: getIconConfig().showBackground 
                          ? (activePanel === 'descripcion' ? getIconConfig().backgroundActiveColor : getIconConfig().backgroundColor)
                          : 'transparent',
                        color: getIconConfig().showBackground && activePanel === 'descripcion'
                          ? '#ffffff'
                          : (activePanel === 'descripcion' ? getIconConfig().iconActiveColor : getIconConfig().iconColor),
                      }}
                    >
                      <LucideIcon name={getPanelIcon('descripcion')} size={getIconConfig().showBackground ? 24 : 26} />
                    </div>
                    <div className="text-left">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ 
                          color: getAccordionStyles().headerText,
                          fontFamily: getAccordionTypography().fontFamily,
                          fontSize: getAccordionTypography().headerFontSize,
                          fontWeight: getAccordionTypography().headerFontWeight,
                        }}
                      >
                        Descripción
                      </h3>
                      <p className="text-sm opacity-70">Información general del servicio</p>
                    </div>
                  </div>
                  <span 
                    className="transition-transform duration-300 text-xl"
                    style={{ 
                      color: getAccordionStyles().headerIcon,
                      transform: activePanel === 'descripcion' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                {activePanel === 'descripcion' && (
                  <div 
                    className="px-6 pb-6 animate-fade-in"
                    style={{
                      background: getAccordionStyles().contentBackground,
                      color: getAccordionStyles().contentText,
                      fontFamily: getAccordionTypography().fontFamily,
                      fontSize: getAccordionTypography().contentFontSize,
                      lineHeight: getAccordionTypography().contentLineHeight,
                    }}
                  >
                    {/* Descripción básica */}
                    {servicio.descripcion && (
                      <div 
                        className="rounded-xl p-6 mb-4"
                        style={{
                          background: getCardStyles().background,
                          borderColor: getCardStyles().borderColor,
                          borderWidth: getCardStyles().borderWidth || '0',
                          borderStyle: 'solid',
                          borderRadius: getCardStyles().borderRadius,
                        }}
                      >
                        <div 
                          className="leading-relaxed whitespace-pre-line"
                          style={{ color: getAccordionStyles().contentText }}
                          dangerouslySetInnerHTML={{ __html: servicio.descripcion.replace(/\n/g, '<br>') }}
                        />
                      </div>
                    )}
                    
                    {/* Descripción Rica */}
                    {servicio.descripcionRica?.trim() && (
                      <div 
                        className="rounded-xl p-6"
                        style={{
                          background: getCardStyles().background,
                          borderColor: getCardStyles().borderColor,
                          borderWidth: getCardStyles().borderWidth || '0',
                          borderStyle: 'solid',
                          borderRadius: getCardStyles().borderRadius,
                        }}
                      >
                        <h4 
                          className="font-semibold mb-4 flex items-center gap-2"
                          style={{ color: getAccordionStyles().contentText }}
                        >
                          📝 Información Detallada
                        </h4>
                        <div 
                          className="text-gray-700 dark:text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: servicio.descripcionRica
                              .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">$1</h3>')
                              .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">$1</h2>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                              .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2">• $1</li>')
                              .replace(/\n/g, '<br>')
                          }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            {/* ========== PANEL: CARACTERÍSTICAS ========== */}
            {hasPanelContent(servicio, 'caracteristicas') && (
              <div 
                className="accordion-panel rounded-xl overflow-hidden backdrop-blur-sm hover:opacity-90 transition-all duration-300 border"
                style={{
                  background: getAccordionStyles().panelBackground,
                  borderColor: getAccordionStyles().panelBorder,
                }}
              >
                <button
                  onClick={() => togglePanel('caracteristicas')}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300"
                  style={{
                    background: activePanel === 'caracteristicas'
                      ? `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}15, ${getAccordionStyles().accentGradientTo}15)`
                      : getAccordionStyles().headerBackground,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center justify-center transition-all duration-300 ${getIconConfig().showBackground ? 'w-12 h-12 rounded-xl shadow-lg' : 'w-8 h-8'}`}
                      style={{
                        background: getIconConfig().showBackground 
                          ? (activePanel === 'caracteristicas' ? getIconConfig().backgroundActiveColor : getIconConfig().backgroundColor)
                          : 'transparent',
                        color: getIconConfig().showBackground && activePanel === 'caracteristicas'
                          ? '#ffffff'
                          : (activePanel === 'caracteristicas' ? getIconConfig().iconActiveColor : getIconConfig().iconColor),
                      }}
                    >
                      <LucideIcon name={getPanelIcon('caracteristicas')} size={getIconConfig().showBackground ? 24 : 26} />
                    </div>
                    <div className="text-left">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ 
                          color: getAccordionStyles().headerText,
                          fontFamily: getAccordionTypography().fontFamily,
                          fontSize: getAccordionTypography().headerFontSize,
                          fontWeight: getAccordionTypography().headerFontWeight,
                        }}
                      >
                        Características
                      </h3>
                      <p className="text-sm opacity-70">{servicio.caracteristicas?.length || 0} características principales</p>
                    </div>
                  </div>
                  <span 
                    className="transition-transform duration-300 text-xl"
                    style={{ 
                      color: getAccordionStyles().headerIcon,
                      transform: activePanel === 'caracteristicas' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                {activePanel === 'caracteristicas' && (
                  <div 
                    className="px-6 pb-6 animate-fade-in"
                    style={{
                      background: getAccordionStyles().contentBackground,
                      color: getAccordionStyles().contentText,
                      fontFamily: getAccordionTypography().fontFamily,
                      fontSize: getAccordionTypography().contentFontSize,
                      lineHeight: getAccordionTypography().contentLineHeight,
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {servicio.caracteristicas?.map((caracteristica, index) => {
                        const iconConfig = getSectionIconConfig('caracteristicas');
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 hover:opacity-90 transition-colors"
                            style={{
                              background: getCardStyles().background,
                              borderColor: getCardStyles().borderColor,
                              borderWidth: getCardStyles().borderWidth || '0',
                              borderStyle: 'solid',
                              borderRadius: getCardStyles().borderRadius,
                            }}
                          >
                            {iconConfig.type !== 'none' && (
                              <div 
                                className={`flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                                  iconConfig.showBackground ? 'w-7 h-7 rounded-full' : 'w-5 h-5'
                                }`}
                                style={{
                                  background: iconConfig.showBackground ? getCardStyles().iconBackground : 'transparent',
                                  color: iconConfig.showBackground ? getCardStyles().iconColor : getCardStyles().iconGradientFrom || '#8b5cf6',
                                }}
                              >
                                {iconConfig.type === 'number' ? (
                                  index + 1
                                ) : (
                                  <LucideIcon name={iconConfig.icon} size={iconConfig.showBackground ? 14 : 18} />
                                )}
                              </div>
                            )}
                            <p className="font-medium" style={{ color: getCardStyles().textColor }}>{caracteristica}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========== PANEL: BENEFICIOS ========== */}
            {hasPanelContent(servicio, 'beneficios') && (
              <div 
                className="accordion-panel rounded-xl overflow-hidden backdrop-blur-sm hover:opacity-90 transition-all duration-300 border"
                style={{
                  background: getAccordionStyles().panelBackground,
                  borderColor: getAccordionStyles().panelBorder,
                }}
              >
                <button
                  onClick={() => togglePanel('beneficios')}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300"
                  style={{
                    background: activePanel === 'beneficios'
                      ? `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}15, ${getAccordionStyles().accentGradientTo}15)`
                      : getAccordionStyles().headerBackground,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center justify-center transition-all duration-300 ${getIconConfig().showBackground ? 'w-12 h-12 rounded-xl shadow-lg' : 'w-8 h-8'}`}
                      style={{
                        background: getIconConfig().showBackground 
                          ? (activePanel === 'beneficios' ? getIconConfig().backgroundActiveColor : getIconConfig().backgroundColor)
                          : 'transparent',
                        color: getIconConfig().showBackground && activePanel === 'beneficios'
                          ? '#ffffff'
                          : (activePanel === 'beneficios' ? getIconConfig().iconActiveColor : getIconConfig().iconColor),
                      }}
                    >
                      <LucideIcon name={getPanelIcon('beneficios')} size={getIconConfig().showBackground ? 24 : 26} />
                    </div>
                    <div className="text-left">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ 
                          color: getAccordionStyles().headerText,
                          fontFamily: getAccordionTypography().fontFamily,
                          fontSize: getAccordionTypography().headerFontSize,
                          fontWeight: getAccordionTypography().headerFontWeight,
                        }}
                      >
                        Beneficios
                      </h3>
                      <p className="text-sm opacity-70">{servicio.beneficios?.length || 0} beneficios clave</p>
                    </div>
                  </div>
                  <span 
                    className="transition-transform duration-300 text-xl"
                    style={{ 
                      color: getAccordionStyles().headerIcon,
                      transform: activePanel === 'beneficios' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                {activePanel === 'beneficios' && (
                  <div 
                    className="px-6 pb-6 animate-fade-in"
                    style={{
                      background: getAccordionStyles().contentBackground,
                      color: getAccordionStyles().contentText,
                      fontFamily: getAccordionTypography().fontFamily,
                      fontSize: getAccordionTypography().contentFontSize,
                      lineHeight: getAccordionTypography().contentLineHeight,
                    }}
                  >
                    <div className="space-y-3">
                      {servicio.beneficios?.map((beneficio, index) => {
                        const iconConfig = getSectionIconConfig('beneficios');
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4"
                            style={{
                              background: getCardStyles().background,
                              borderColor: getCardStyles().borderColor,
                              borderWidth: getCardStyles().borderWidth || '0',
                              borderStyle: 'solid',
                              borderRadius: getCardStyles().borderRadius,
                            }}
                          >
                            {iconConfig.type !== 'none' && (
                              <div 
                                className={`flex-shrink-0 flex items-center justify-center ${
                                  iconConfig.showBackground ? 'w-10 h-10 rounded-lg' : 'w-6 h-6'
                                }`}
                                style={{
                                  background: iconConfig.showBackground ? getCardStyles().iconBackground : 'transparent',
                                  color: iconConfig.showBackground ? getCardStyles().iconColor : getCardStyles().iconGradientFrom || '#8b5cf6',
                                }}
                              >
                                <LucideIcon name={iconConfig.icon} size={iconConfig.showBackground ? 20 : 22} />
                              </div>
                            )}
                            <p className="font-medium flex-1" style={{ color: getCardStyles().textColor }}>{beneficio}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========== PANEL: QUÉ INCLUYE ========== */}
            {hasPanelContent(servicio, 'incluye') && (
              <div 
                className="accordion-panel rounded-xl overflow-hidden backdrop-blur-sm hover:opacity-90 transition-all duration-300 border"
                style={{
                  background: getAccordionStyles().panelBackground,
                  borderColor: getAccordionStyles().panelBorder,
                }}
              >
                <button
                  onClick={() => togglePanel('incluye')}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300"
                  style={{
                    background: activePanel === 'incluye'
                      ? `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}15, ${getAccordionStyles().accentGradientTo}15)`
                      : getAccordionStyles().headerBackground,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center justify-center transition-all duration-300 ${getIconConfig().showBackground ? 'w-12 h-12 rounded-xl shadow-lg' : 'w-8 h-8'}`}
                      style={{
                        background: getIconConfig().showBackground 
                          ? (activePanel === 'incluye' ? getIconConfig().backgroundActiveColor : getIconConfig().backgroundColor)
                          : 'transparent',
                        color: getIconConfig().showBackground && activePanel === 'incluye'
                          ? '#ffffff'
                          : (activePanel === 'incluye' ? getIconConfig().iconActiveColor : getIconConfig().iconColor),
                      }}
                    >
                      <LucideIcon name={getPanelIcon('incluye')} size={getIconConfig().showBackground ? 24 : 26} />
                    </div>
                    <div className="text-left">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ 
                          color: getAccordionStyles().headerText,
                          fontFamily: getAccordionTypography().fontFamily,
                          fontSize: getAccordionTypography().headerFontSize,
                          fontWeight: getAccordionTypography().headerFontWeight,
                        }}
                      >
                        Qué Incluye
                      </h3>
                      <p className="text-sm opacity-70">Detalle de inclusiones y tecnologías</p>
                    </div>
                  </div>
                  <span 
                    className="transition-transform duration-300 text-xl"
                    style={{ 
                      color: getAccordionStyles().headerIcon,
                      transform: activePanel === 'incluye' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                {activePanel === 'incluye' && (
                  <div 
                    className="px-6 pb-6 animate-fade-in space-y-6"
                    style={{
                      background: getAccordionStyles().contentBackground,
                      color: getAccordionStyles().contentText,
                      fontFamily: getAccordionTypography().fontFamily,
                      fontSize: getAccordionTypography().contentFontSize,
                      lineHeight: getAccordionTypography().contentLineHeight,
                    }}
                  >
                    {/* Grid de Incluye / No Incluye */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Lo que INCLUYE */}
                      {servicio.incluye && servicio.incluye.length > 0 && (
                        <div 
                          className="rounded-xl p-6"
                          style={{
                            background: getCardStyles().background,
                            borderColor: getCardStyles().borderColor,
                            borderWidth: getCardStyles().borderWidth || '0',
                            borderStyle: 'solid',
                            borderRadius: getCardStyles().borderRadius,
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            {(() => {
                              const iconConfig = getSectionIconConfig('incluye');
                              return iconConfig.type !== 'none' ? (
                                <div 
                                  className={`flex items-center justify-center text-white ${
                                    iconConfig.showBackground ? 'w-8 h-8 rounded-lg' : 'w-5 h-5'
                                  }`}
                                  style={{
                                    background: iconConfig.showBackground 
                                      ? `linear-gradient(to br, ${getAccordionStyles().accentGradientFrom}, ${getAccordionStyles().accentGradientTo})`
                                      : 'transparent',
                                    color: iconConfig.showBackground ? '#ffffff' : getAccordionStyles().accentGradientFrom,
                                  }}
                                >
                                  <LucideIcon name={iconConfig.icon} size={iconConfig.showBackground ? 16 : 20} />
                                </div>
                              ) : null;
                            })()}
                            <h4 className="text-lg font-bold" style={{ color: getAccordionStyles().contentText }}>Incluye</h4>
                          </div>
                          <ul className="space-y-2">
                            {servicio.incluye.map((item, index) => {
                              const iconConfig = getSectionIconConfig('incluye');
                              return (
                                <li key={index} className="flex items-start gap-2">
                                  {iconConfig.type !== 'none' && (
                                    <span style={{ color: getAccordionStyles().headerIcon }} className="mt-0.5">
                                      <LucideIcon name={iconConfig.icon} size={16} />
                                    </span>
                                  )}
                                  <span style={{ color: getAccordionStyles().contentText }}>{item}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Lo que NO INCLUYE */}
                      {servicio.noIncluye && servicio.noIncluye.length > 0 && (
                        <div 
                          className="rounded-xl p-6"
                          style={{
                            background: getCardStyles().background,
                            borderColor: getCardStyles().borderColor,
                            borderWidth: getCardStyles().borderWidth || '0',
                            borderStyle: 'solid',
                            borderRadius: getCardStyles().borderRadius,
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            {(() => {
                              const iconConfig = getSectionIconConfig('noIncluye');
                              return iconConfig.type !== 'none' ? (
                                <div 
                                  className={`flex items-center justify-center ${
                                    iconConfig.showBackground ? 'w-8 h-8 bg-red-500 rounded-lg' : 'w-5 h-5'
                                  }`}
                                  style={{
                                    color: iconConfig.showBackground ? '#ffffff' : '#ef4444',
                                  }}
                                >
                                  <LucideIcon name={iconConfig.icon} size={iconConfig.showBackground ? 16 : 20} />
                                </div>
                              ) : null;
                            })()}
                            <h4 className="text-lg font-bold" style={{ color: getAccordionStyles().contentText }}>No Incluye</h4>
                          </div>
                          <ul className="space-y-2">
                            {servicio.noIncluye.map((item, index) => {
                              const iconConfig = getSectionIconConfig('noIncluye');
                              return (
                                <li key={index} className="flex items-start gap-2">
                                  {iconConfig.type !== 'none' && (
                                    <span className="text-red-600 dark:text-red-400 mt-0.5">
                                      <LucideIcon name={iconConfig.icon} size={16} />
                                    </span>
                                  )}
                                  <span style={{ color: getAccordionStyles().contentText }}>{item}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Tecnologías */}
                    {servicio.tecnologias && servicio.tecnologias.length > 0 && (
                      <div 
                        className="rounded-xl p-6"
                        style={{
                          background: getCardStyles().background,
                          borderColor: getCardStyles().borderColor,
                          borderWidth: getCardStyles().borderWidth || '0',
                          borderStyle: 'solid',
                          borderRadius: getCardStyles().borderRadius,
                        }}
                      >
                        <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: getAccordionStyles().contentText }}>
                          🛠️ Tecnologías que utilizamos
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {servicio.tecnologias.map((tecnologia, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                              style={{
                                background: `linear-gradient(to br, ${getAccordionStyles().accentGradientFrom}, ${getAccordionStyles().accentGradientTo})`,
                                color: '#ffffff',
                              }}
                            >
                              {tecnologia}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========== PANEL: INFORMACIÓN ADICIONAL ========== */}
            {hasPanelContent(servicio, 'info') && (
              <div 
                className="accordion-panel rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300"
                style={{
                  background: getAccordionStyles().panelBackground,
                  borderColor: getAccordionStyles().panelBorder,
                  borderWidth: '1px',
                }}
              >
                <button
                  onClick={() => togglePanel('info')}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300"
                  style={{
                    background: activePanel === 'info'
                      ? `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}15, ${getAccordionStyles().accentGradientTo}15)`
                      : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center justify-center transition-all duration-300 ${getIconConfig().showBackground ? 'w-12 h-12 rounded-xl shadow-lg' : 'w-8 h-8'}`}
                      style={{
                        background: getIconConfig().showBackground 
                          ? (activePanel === 'info' ? getIconConfig().backgroundActiveColor : getIconConfig().backgroundColor)
                          : 'transparent',
                        color: getIconConfig().showBackground && activePanel === 'info'
                          ? '#ffffff'
                          : (activePanel === 'info' ? getIconConfig().iconActiveColor : getIconConfig().iconColor),
                      }}
                    >
                      <LucideIcon name={getPanelIcon('info')} size={getIconConfig().showBackground ? 24 : 26} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg" style={{ 
                        color: getAccordionStyles().headerText,
                        fontFamily: getAccordionTypography().fontFamily,
                        fontSize: getAccordionTypography().headerFontSize,
                        fontWeight: getAccordionTypography().headerFontWeight,
                      }}>Información Adicional</h3>
                      <p className="text-sm opacity-70" style={{ color: getAccordionStyles().headerText }}>Detalles extras del servicio</p>
                    </div>
                  </div>
                  <span 
                    className="transition-transform duration-300 text-xl"
                    style={{
                      color: getAccordionStyles().headerIcon,
                      transform: activePanel === 'info' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                {activePanel === 'info' && (
                  <div 
                    className="px-6 pb-6 animate-fade-in space-y-4"
                    style={{
                      background: getAccordionStyles().contentBackground,
                      color: getAccordionStyles().contentText,
                      fontFamily: getAccordionTypography().fontFamily,
                      fontSize: getAccordionTypography().contentFontSize,
                      lineHeight: getAccordionTypography().contentLineHeight,
                    }}
                  >
                    {/* Contenido Adicional */}
                    {sanitizeContenidoAdicional(servicio.contenidoAdicional) && (
                      <div 
                        className="rounded-xl p-6"
                        style={{
                          background: getCardStyles().background,
                          borderColor: getCardStyles().borderColor,
                          borderWidth: getCardStyles().borderWidth || '0',
                          borderStyle: 'solid',
                          borderRadius: getCardStyles().borderRadius,
                        }}
                      >
                        <div 
                          className="leading-relaxed whitespace-pre-line"
                          style={{ color: getAccordionStyles().contentText }}
                          dangerouslySetInnerHTML={{ __html: sanitizeContenidoAdicional(servicio.contenidoAdicional).replace(/\n/g, '<br>') }}
                        />
                      </div>
                    )}

                    {/* Etiquetas */}
                    {servicio.etiquetas && servicio.etiquetas.length > 0 && (
                      <div 
                        className="rounded-xl p-6"
                        style={{
                          background: getCardStyles().background,
                          borderColor: getCardStyles().borderColor,
                          borderWidth: getCardStyles().borderWidth || '0',
                          borderStyle: 'solid',
                          borderRadius: getCardStyles().borderRadius,
                        }}
                      >
                        <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: getAccordionStyles().contentText }}>
                          🏷️ Etiquetas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {servicio.etiquetas.map((etiqueta, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                background: `linear-gradient(to br, ${getAccordionStyles().accentGradientFrom}, ${getAccordionStyles().accentGradientTo})`,
                                color: '#ffffff',
                              }}
                            >
                              #{etiqueta}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========== PANEL: FAQ ========== */}
            {hasPanelContent(servicio, 'faq') && (
              <div 
                className="accordion-panel rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300"
                style={{
                  background: getAccordionStyles().panelBackground,
                  borderColor: getAccordionStyles().panelBorder,
                  borderWidth: '1px',
                }}
              >
                <button
                  onClick={() => togglePanel('faq')}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300"
                  style={{
                    background: activePanel === 'faq'
                      ? `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}15, ${getAccordionStyles().accentGradientTo}15)`
                      : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center justify-center transition-all duration-300 ${getIconConfig().showBackground ? 'w-12 h-12 rounded-xl shadow-lg' : 'w-8 h-8'}`}
                      style={{
                        background: getIconConfig().showBackground 
                          ? (activePanel === 'faq' ? getIconConfig().backgroundActiveColor : getIconConfig().backgroundColor)
                          : 'transparent',
                        color: getIconConfig().showBackground && activePanel === 'faq'
                          ? '#ffffff'
                          : (activePanel === 'faq' ? getIconConfig().iconActiveColor : getIconConfig().iconColor),
                      }}
                    >
                      <LucideIcon name={getPanelIcon('faq')} size={getIconConfig().showBackground ? 24 : 26} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg" style={{ 
                        color: getAccordionStyles().headerText,
                        fontFamily: getAccordionTypography().fontFamily,
                        fontSize: getAccordionTypography().headerFontSize,
                        fontWeight: getAccordionTypography().headerFontWeight,
                      }}>Preguntas Frecuentes</h3>
                      <p className="text-sm opacity-70" style={{ color: getAccordionStyles().headerText }}>{servicio.faq?.length || 0} preguntas respondidas</p>
                    </div>
                  </div>
                  <span 
                    className="transition-transform duration-300 text-xl"
                    style={{
                      color: getAccordionStyles().headerIcon,
                      transform: activePanel === 'faq' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                {activePanel === 'faq' && (
                  <div 
                    className="px-6 pb-6 animate-fade-in"
                    style={{
                      background: getAccordionStyles().contentBackground,
                      color: getAccordionStyles().contentText,
                      fontFamily: getAccordionTypography().fontFamily,
                      fontSize: getAccordionTypography().contentFontSize,
                      lineHeight: getAccordionTypography().contentLineHeight,
                    }}
                  >
                    <div className="space-y-3">
                      {servicio.faq?.map((item, index) => (
                        <details
                          key={index}
                          className="group overflow-hidden"
                          style={{
                            background: getCardStyles().background,
                            borderColor: getCardStyles().borderColor,
                            borderWidth: getCardStyles().borderWidth || '0',
                            borderStyle: 'solid',
                            borderRadius: getCardStyles().borderRadius,
                          }}
                        >
                          <summary 
                            className="cursor-pointer px-5 py-4 font-medium flex items-center justify-between transition-colors"
                            style={{
                              color: getAccordionStyles().contentText,
                              background: 'transparent',
                            }}
                          >
                            <span className="flex items-center gap-3">
                              <span 
                                className="font-bold"
                                style={{ color: getAccordionStyles().headerIcon }}
                              >
                                Q{index + 1}:
                              </span>
                              {item.pregunta}
                            </span>
                            <span 
                              className="group-open:rotate-180 transition-transform text-sm"
                              style={{ color: getAccordionStyles().headerIcon }}
                            >
                              ▼
                            </span>
                          </summary>
                          <div 
                            className="px-5 py-4"
                            style={{
                              background: `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}10, ${getAccordionStyles().accentGradientTo}10)`,
                            }}
                          >
                            <p className="leading-relaxed" style={{ color: getAccordionStyles().contentText }}>
                              <span 
                                className="font-semibold mr-2"
                                style={{ color: getAccordionStyles().headerIcon }}
                              >
                                A:
                              </span>
                              {item.respuesta}
                            </p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========== PANEL: MULTIMEDIA ========== */}
            {hasPanelContent(servicio, 'multimedia') && (
              <div 
                className="accordion-panel rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300"
                style={{
                  background: getAccordionStyles().panelBackground,
                  borderColor: getAccordionStyles().panelBorder,
                  borderWidth: '1px',
                }}
              >
                <button
                  onClick={() => togglePanel('multimedia')}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300"
                  style={{
                    background: activePanel === 'multimedia'
                      ? `linear-gradient(to right, ${getAccordionStyles().accentGradientFrom}15, ${getAccordionStyles().accentGradientTo}15)`
                      : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center justify-center transition-all duration-300 ${getIconConfig().showBackground ? 'w-12 h-12 rounded-xl shadow-lg' : 'w-8 h-8'}`}
                      style={{
                        background: getIconConfig().showBackground 
                          ? (activePanel === 'multimedia' ? getIconConfig().backgroundActiveColor : getIconConfig().backgroundColor)
                          : 'transparent',
                        color: getIconConfig().showBackground && activePanel === 'multimedia'
                          ? '#ffffff'
                          : (activePanel === 'multimedia' ? getIconConfig().iconActiveColor : getIconConfig().iconColor),
                      }}
                    >
                      <LucideIcon name={getPanelIcon('multimedia')} size={getIconConfig().showBackground ? 24 : 26} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg" style={{ 
                        color: getAccordionStyles().headerText,
                        fontFamily: getAccordionTypography().fontFamily,
                        fontSize: getAccordionTypography().headerFontSize,
                        fontWeight: getAccordionTypography().headerFontWeight,
                      }}>Multimedia</h3>
                      <p className="text-sm opacity-70" style={{ color: getAccordionStyles().headerText }}>Videos y galería de imágenes</p>
                    </div>
                  </div>
                  <span 
                    className="transition-transform duration-300 text-xl"
                    style={{
                      color: getAccordionStyles().headerIcon,
                      transform: activePanel === 'multimedia' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                {activePanel === 'multimedia' && (
                  <div 
                    className="px-6 pb-6 animate-fade-in space-y-6"
                    style={{
                      background: getAccordionStyles().contentBackground,
                      color: getAccordionStyles().contentText,
                      fontFamily: getAccordionTypography().fontFamily,
                      fontSize: getAccordionTypography().contentFontSize,
                      lineHeight: getAccordionTypography().contentLineHeight,
                    }}
                  >
                    {/* Video */}
                    {servicio.videoUrl?.trim() && (
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: getAccordionStyles().contentText }}>
                          🎬 Video del Servicio
                        </h4>
                        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={servicio.videoUrl.replace('watch?v=', 'embed/')}
                            title="Video del servicio"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full border-0"
                          />
                        </div>
                      </div>
                    )}

                    {/* Galería */}
                    {((servicio.galeriaImagenes && servicio.galeriaImagenes.length > 0) || (servicio.imagenes && servicio.imagenes.length > 0)) && (
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: getAccordionStyles().contentText }}>
                          🖼️ Galería de Imágenes
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {servicio.galeriaImagenes?.map((imagen, index) => (
                            <div 
                              key={`galeria-${index}`} 
                              className="group overflow-hidden rounded-lg shadow-md"
                              style={{
                                borderColor: getAccordionStyles().panelBorder,
                                borderWidth: '1px',
                              }}
                            >
                              <img
                                src={imagen}
                                alt={`${servicio.titulo} - Imagen ${index + 1}`}
                                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                          {servicio.imagenes?.map((imagen, index) => (
                            <div 
                              key={`imagen-${index}`} 
                              className="group overflow-hidden rounded-lg shadow-md"
                              style={{
                                borderColor: getAccordionStyles().panelBorder,
                                borderWidth: '1px',
                              }}
                            >
                              <img
                                src={imagen}
                                alt={`${servicio.titulo} - Imagen ${index + 1}`}
                                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECCIÓN 3: CTA - USA GRADIENTE DEL TEMA */}
      {/* ============================================ */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 
            className={`${ctaConfig.title?.fontSize || 'text-4xl'} ${ctaConfig.title?.fontWeight || 'font-bold'} mb-6`}
            style={{ 
              ...(ctaConfig.title?.useGradient ? {
                background: `linear-gradient(${ctaConfig.title.gradientDirection || 'to right'}, ${ctaConfig.title.gradientFrom || '#FFFFFF'}, ${ctaConfig.title.gradientTo || '#E9D5FF'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : {
                color: ctaConfig.title?.color || '#FFFFFF',
              }),
              fontFamily: ctaConfig.title?.fontFamily || 'Montserrat'
            }}
          >
            {ctaConfig.title?.text || '¿Listo para comenzar tu proyecto?'}
          </h2>
          <p 
            className={`${ctaConfig.subtitle?.fontSize || 'text-xl'} ${ctaConfig.subtitle?.fontWeight || 'font-normal'} mb-8 max-w-2xl mx-auto`}
            style={{ 
              color: ctaConfig.subtitle?.color || '#E9D5FF',
              fontFamily: ctaConfig.subtitle?.fontFamily || 'Montserrat'
            }}
          >
            {ctaConfig.subtitle?.text || 'Nuestro equipo de expertos está listo para ayudarte a llevar tu idea al siguiente nivel.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className={`inline-flex items-center justify-center px-8 py-4 font-semibold ${ctaConfig.buttons?.primary?.borderRadius || 'rounded-lg'} transition-all transform hover:scale-105 shadow-lg`}
              style={{
                ...(ctaConfig.buttons?.primary?.useBorderGradient ? {
                  background: ctaConfig.buttons?.primary?.useTransparentBg ? 'transparent' : ctaConfig.buttons?.primary?.bgColor || '#FFFFFF',
                  color: ctaConfig.buttons?.primary?.textColor || '#7C3AED',
                  border: `${ctaConfig.buttons?.primary?.borderWidth || '2px'} solid transparent`,
                  backgroundImage: ctaConfig.buttons?.primary?.useTransparentBg 
                    ? 'none'
                    : `linear-gradient(${ctaConfig.buttons?.primary?.bgColor || '#FFFFFF'}, ${ctaConfig.buttons?.primary?.bgColor || '#FFFFFF'}), linear-gradient(${ctaConfig.buttons?.primary?.borderGradientDirection || 'to right'}, ${ctaConfig.buttons?.primary?.borderGradientFrom || '#9333ea'}, ${ctaConfig.buttons?.primary?.borderGradientTo || '#2563eb'})`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                } : {
                  backgroundColor: ctaConfig.buttons?.primary?.useTransparentBg ? 'transparent' : (ctaConfig.buttons?.primary?.bgColor || '#FFFFFF'),
                  color: ctaConfig.buttons?.primary?.textColor || '#7C3AED',
                  border: ctaConfig.buttons?.primary?.useTransparentBg ? `2px solid ${ctaConfig.buttons?.primary?.borderColor || ctaConfig.buttons?.primary?.textColor}` : 'none',
                }),
              }}
              onMouseEnter={(e) => {
                if (!ctaConfig.buttons?.primary?.useBorderGradient) {
                  e.currentTarget.style.backgroundColor = ctaConfig.buttons?.primary?.useTransparentBg ? 'transparent' : (ctaConfig.buttons?.primary?.hoverBgColor || '#F3F4F6');
                }
              }}
              onMouseLeave={(e) => {
                if (!ctaConfig.buttons?.primary?.useBorderGradient) {
                  e.currentTarget.style.backgroundColor = ctaConfig.buttons?.primary?.useTransparentBg ? 'transparent' : (ctaConfig.buttons?.primary?.bgColor || '#FFFFFF');
                }
              }}
            >
              {ctaConfig.buttons?.primary?.text || '💬 Solicitar Cotización Gratuita'}
            </button>
            <Link
              to="/servicios"
              className={`inline-flex items-center justify-center px-8 py-4 font-semibold ${ctaConfig.buttons?.secondary?.borderRadius || 'rounded-lg'} transition-colors`}
              style={{
                ...(ctaConfig.buttons?.secondary?.useBorderGradient ? {
                  background: ctaConfig.buttons?.secondary?.useTransparentBg ? 'transparent' : (ctaConfig.buttons?.secondary?.bgColor || 'transparent'),
                  color: ctaConfig.buttons?.secondary?.textColor || '#FFFFFF',
                  border: `${ctaConfig.buttons?.secondary?.borderWidth || '2px'} solid transparent`,
                  backgroundImage: ctaConfig.buttons?.secondary?.useTransparentBg 
                    ? 'none'
                    : `linear-gradient(${ctaConfig.buttons?.secondary?.bgColor || 'transparent'}, ${ctaConfig.buttons?.secondary?.bgColor || 'transparent'}), linear-gradient(${ctaConfig.buttons?.secondary?.borderGradientDirection || 'to right'}, ${ctaConfig.buttons?.secondary?.borderGradientFrom || '#FFFFFF'}, ${ctaConfig.buttons?.secondary?.borderGradientTo || '#E9D5FF'})`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                } : {
                  backgroundColor: ctaConfig.buttons?.secondary?.useTransparentBg ? 'transparent' : (ctaConfig.buttons?.secondary?.bgColor || 'transparent'),
                  color: ctaConfig.buttons?.secondary?.textColor || '#FFFFFF',
                  border: `2px solid ${ctaConfig.buttons?.secondary?.borderColor || '#FFFFFF'}`,
                }),
              }}
              onMouseEnter={(e) => {
                if (!ctaConfig.buttons?.secondary?.useBorderGradient) {
                  e.currentTarget.style.backgroundColor = ctaConfig.buttons?.secondary?.hoverBgColor || '#FFFFFF';
                  e.currentTarget.style.color = ctaConfig.buttons?.secondary?.hoverTextColor || '#7C3AED';
                }
              }}
              onMouseLeave={(e) => {
                if (!ctaConfig.buttons?.secondary?.useBorderGradient) {
                  e.currentTarget.style.backgroundColor = ctaConfig.buttons?.secondary?.useTransparentBg ? 'transparent' : (ctaConfig.buttons?.secondary?.bgColor || 'transparent');
                  e.currentTarget.style.color = ctaConfig.buttons?.secondary?.textColor || '#FFFFFF';
                }
              }}
            >
              {ctaConfig.buttons?.secondary?.text || 'Ver todos los servicios'}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />

      {/* 💬 Chatbot de Ventas Flotante */}
      <FloatingChatWidget />

      {/* Modal de contacto */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        servicioInfo={servicio ? {
          titulo: servicio.titulo,
          descripcionCorta: servicio.descripcionCorta,
          precio: servicio.precio ? `${servicio.moneda === 'PEN' ? 'S/.' : servicio.moneda === 'USD' ? '$' : '€'} ${servicio.precio.toLocaleString()}` : undefined,
          duracion: servicio.duracion ? `${servicio.duracion.valor} ${servicio.duracion.unidad}` : undefined,
          categoria: typeof servicio.categoria === 'string' ? servicio.categoria : servicio.categoria?.nombre || 'Sin categoría'
        } : undefined}
        data={{
          title: servicio ? `Solicitar Cotización - ${servicio.titulo}` : 'Solicitar Cotización',
          subtitle: 'OBTÉN TU COTIZACIÓN',
          description: 'Déjanos tus datos y nos pondremos en contacto contigo para brindarte la mejor asesoría.',
          fields: {
            mensajePlaceholder: servicio 
              ? `Hola, estoy interesado en el servicio "${servicio.titulo}". Me gustaría recibir más información y una cotización personalizada.`
              : 'Describe tu proyecto, necesidades o consulta...'
          },
          messages: {
            success: '¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.',
            error: 'Error al enviar la solicitud. Por favor, intenta nuevamente.'
          }
        }}
      />
    </div>
  );
};

export default ServicioDetail;