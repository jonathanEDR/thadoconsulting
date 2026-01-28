import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import ValueAddedSection from '../../components/public/ValueAddedSection';
import ClientLogosSection from '../../components/public/ClientLogosSection';
import FeaturedBlogSection from '../../components/public/FeaturedBlogSection';
import ContactSection from '../../components/public/ContactSection';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { HomePageSchema } from '../../components/seo/SchemaOrg';
import { getPageBySlug, forceReload } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { useCategoriasList, type Categoria } from '../../hooks/useCategoriasCache';
import type { ThemeConfig } from '../../contexts/ThemeContext';
import type { ClientLogosContent } from '../../types/cms';
import type { DefaultFeaturedBlogConfig } from '../../utils/defaultConfig';

// SEO fallback mínimo (el contenido real viene del CMS)
const SEO_FALLBACK = {
  metaTitle: 'THADO Consulting | Contador para MYPES y Emprendedores en Perú',
  metaDescription: 'Servicios contables y asesoría tributaria para MYPES en todo Perú. Evita multas SUNAT, ordena tu contabilidad y crece con confianza.',
  keywords: ['contador Perú', 'estudio contable Lima', 'servicios contables Perú', 'asesoría tributaria SUNAT'],
  ogTitle: 'THADO Consulting | Contador para MYPES y Emprendedores en Perú',
  ogDescription: 'Servicios contables y asesoría tributaria para MYPES en todo Perú.',
  ogImage: '',
};


interface ButtonTheme {
  background: string;
  textColor: string;
  borderColor: string;
}

interface ExtendedThemeConfig extends ThemeConfig {
  lightMode: ThemeConfig['lightMode'] & {
    buttons?: {
      ctaPrimary?: ButtonTheme;
      contact?: ButtonTheme;
      dashboard?: ButtonTheme;
    };
  };
  darkMode: ThemeConfig['darkMode'] & {
    buttons?: {
      ctaPrimary?: ButtonTheme;
      contact?: ButtonTheme;
      dashboard?: ButtonTheme;
    };
  };
}

interface PageData {
  content: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      ctaText: string;
      ctaLink: string;
      backgroundImage?: {
        light?: string;
        dark?: string;
      };
      backgroundImageAlt?: string;
    };
    solutions: {
      title: string;
      subtitle: string;
      backgroundImage: {
        light: string;
        dark: string;
      };
      backgroundImageAlt: string;
      cards: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
        iconLight?: string;
        iconDark?: string;
      }>;
    };
    valueAdded: {
      title: string;
      subtitle?: string;
      backgroundImage: {
        light: string;
        dark: string;
      };
      backgroundImageAlt: string;
      cards: Array<{
        id: string;
        title: string;
        description: string;
        icon?: string; // Opcional, ahora usamos iconLight/iconDark
        iconLight?: string;
        iconDark?: string;
        gradient?: string;
      }>;
      logos?: Array<{
        _id: string;
        name: string;
        imageUrl: string;
        alt: string;
        link?: string;
        order: number;
      }>;
      logosBarDesign?: {
        light?: {
          animationsEnabled?: boolean;
          rotationMode?: 'none' | 'individual';
          animationSpeed?: 'slow' | 'normal' | 'fast';
          hoverEffects?: boolean;
          hoverIntensity?: 'light' | 'normal' | 'strong';
          glowEffects?: boolean;
          autoDetectTech?: boolean;
          logoSize?: 'small' | 'medium' | 'large';
          logoSpacing?: 'compact' | 'normal' | 'wide';
          logoFormat?: 'square' | 'rectangle' | 'original';
          maxLogoWidth?: 'small' | 'medium' | 'large';
          uniformSize?: boolean;
        };
        dark?: {
          animationsEnabled?: boolean;
          rotationMode?: 'none' | 'individual';
          animationSpeed?: 'slow' | 'normal' | 'fast';
          hoverEffects?: boolean;
          hoverIntensity?: 'light' | 'normal' | 'strong';
          glowEffects?: boolean;
          autoDetectTech?: boolean;
          logoSize?: 'small' | 'medium' | 'large';
          logoSpacing?: 'compact' | 'normal' | 'wide';
          logoFormat?: 'square' | 'rectangle' | 'original';
          maxLogoWidth?: 'small' | 'medium' | 'large';
          uniformSize?: boolean;
        };
      };
    };
    clientLogos?: ClientLogosContent;
    featuredBlog?: DefaultFeaturedBlogConfig;
    contactForm?: any;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
  theme?: ExtendedThemeConfig;
}

// Función para agregar categorías a la configuración del CMS
const addCategoriasToConfig = (cmsConfig: any, categorias: Categoria[] = []) => {
  const configWithCategories = {
    ...cmsConfig,
    fields: {
      ...cmsConfig.fields,
      ...(categorias.length > 0 && {
        categoriaLabel: 'Servicio de Interés',
        categoriaPlaceholder: 'Selecciona el tipo de servicio que necesitas',
        categoriaRequired: false,
        categoriaEnabled: true,
      })
    }
  };
  
  return configWithCategories;
};

/**
 * Página Home Optimizada
 * - Muestra skeletons mientras carga datos del CMS
 * - Carga datos del CMS en background sin bloquear
 * - Sin dependencias de autenticación
 */
const HomeOptimized = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoadingCMS, setIsLoadingCMS] = useState(false);
  const { setThemeConfig } = useTheme();
  
  // 🚀 Usar hook con cache para categorías
  const { data: categorias } = useCategoriasList({ activas: true });
  
  // ✅ SOLUCIÓN: Usar SEO de pageData en lugar de hook separado (evita consulta duplicada)
  
  // ✅ Efecto inicial con cleanup - SIN limpiar caché automáticamente
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const init = async () => {
      if (isMounted) {
        await loadPageData();
      }
    };

    init();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // 📍 Manejo de navegación a sección de contacto con cleanup
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const hash = window.location.hash;
    if (hash === '#contacto') {
      // Pequeño delay para asegurar que el contenido se haya renderizado
      timeoutId = setTimeout(() => {
        const contactoElement = document.getElementById('contacto');
        if (contactoElement) {
          contactoElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);
    }

    // ✅ Cleanup del timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // ⏰ Sistema de eventos CMS - SOLO recargar cuando haya actualización real
  useEffect(() => {
    // ✅ ELIMINADO: setInterval que recargaba cada 5 minutos innecesariamente
    
    // Escuchar eventos de actualización del CMS
    const handleCMSUpdate = () => {
      loadPageData(true); // Forzar recarga cuando el CMS se actualiza
    };

    const handleClearCache = () => {
      loadPageData(true);
    };

    window.addEventListener('cmsUpdate', handleCMSUpdate);
    window.addEventListener('clearCache', handleClearCache);

    // ✅ Cleanup completo
    return () => {
      window.removeEventListener('cmsUpdate', handleCMSUpdate);
      window.removeEventListener('clearCache', handleClearCache);
    };
  }, []);

  const loadPageData = async (forceRefresh = false) => {
    try {
      if (!forceRefresh) setIsLoadingCMS(true);
      
      // ✅ OPTIMIZACIÓN: Usar cache normalmente, forceReload solo cuando se pide explícitamente
      const data = forceRefresh 
        ? await forceReload('home')
        : await getPageBySlug('home');

      // Actualizar solo si obtuvimos datos válidos
      if (data && data.content) {
        setPageData(data);
        
        if (data.theme) {
          setThemeConfig(data.theme);
        }

        if (data.seo?.metaTitle) {
          document.title = data.seo.metaTitle;
        }
        
        window.dispatchEvent(new CustomEvent('pageDataUpdated', { 
          detail: { valueAdded: data.content.valueAdded } 
        }));
      }
    } catch (error) {
      console.error('Error cargando datos de página:', error);
    } finally {
      if (!forceRefresh) setIsLoadingCMS(false);
    }
  };

  // ✅ Validar que la imagen OG sea una URL directa de imagen (no URLs de Facebook/redes sociales)
  const isValidOgImage = (url: string | undefined): boolean => {
    if (!url) return false;
    const invalidPatterns = [
      'facebook.com/photo',
      'facebook.com/profile',
      'instagram.com/p/',
      'twitter.com/',
      'x.com/'
    ];
    return !invalidPatterns.some(pattern => url.includes(pattern));
  };

  const getValidOgImage = (): string => {
    const cmsImage = pageData?.seo?.ogImage;
    if (cmsImage && isValidOgImage(cmsImage)) {
      if (cmsImage.startsWith('/')) {
        return `https://www.thadoconsulting.com${cmsImage}`;
      }
      return cmsImage;
    }
    return SEO_FALLBACK.ogImage;
  };

  const ogImage = getValidOgImage();
  const seo = pageData?.seo;

  return (
    <>
      {/* ✅ SEO Manual desde pageData (sin hook duplicado) */}
      <Helmet>
        <title>{seo?.metaTitle || SEO_FALLBACK.metaTitle}</title>
        <meta name="description" content={seo?.metaDescription || SEO_FALLBACK.metaDescription} />
        <meta name="keywords" content={(seo?.keywords || SEO_FALLBACK.keywords).join(', ')} />

        {/* Open Graph */}
        <meta property="og:title" content={seo?.ogTitle || seo?.metaTitle || SEO_FALLBACK.ogTitle} />
        <meta property="og:description" content={seo?.ogDescription || seo?.metaDescription || SEO_FALLBACK.ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="THADO Consulting - Desarrollo de Software e IA para PYMES" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thadoconsulting.com/" />
        <meta property="og:site_name" content="THADO Consulting" />
        <meta property="og:locale" content="es_PE" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.ogTitle || seo?.metaTitle || SEO_FALLBACK.ogTitle} />
        <meta name="twitter:description" content={seo?.ogDescription || seo?.metaDescription || SEO_FALLBACK.ogDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Canonical */}
        <link rel="canonical" href="https://www.thadoconsulting.com/" />
      </Helmet>
      
      {/* ✅ Schema.org - Datos estructurados para Google Rich Results */}
      <HomePageSchema />

      <div className="min-h-screen w-full overflow-x-hidden bg-transparent">
        <PublicHeader />
        <main className="w-full bg-transparent">
          <HeroSection data={pageData?.content.hero} />
          <SolutionsSection
            data={pageData?.content.solutions}
            themeConfig={pageData?.theme}
          />
          <ValueAddedSection
            data={pageData?.content.valueAdded}
            themeConfig={pageData?.theme}
          />
          <ClientLogosSection
            data={pageData?.content.clientLogos}
          />

          <ContactSection
            data={pageData?.content.contactForm ? addCategoriasToConfig(pageData.content.contactForm, categorias) : undefined}
            categorias={categorias}
          />

          <FeaturedBlogSection
            data={pageData?.content.featuredBlog}
            themeConfig={pageData?.theme}
          />
        </main>
        <PublicFooter />
        
        {/* 💬 Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
        
        {/* Indicador de carga del CMS con logo - ¡Escapa del cursor! */}
        {isLoadingCMS && (
          <div 
            className="fixed z-50 pointer-events-auto select-none"
            style={{ bottom: '16px', right: '16px' }}
            onMouseEnter={(e) => {
              const element = e.currentTarget;
              
              // Calcular nueva posición aleatoria para escapar
              const positions = [
                { bottom: '16px', right: '80px' },
                { bottom: '80px', right: '16px' },
                { bottom: '80px', right: '80px' },
                { bottom: '16px', right: '150px' },
                { bottom: '150px', right: '16px' },
                { bottom: '120px', right: '120px' },
                { bottom: '50px', right: '200px' },
                { bottom: '200px', right: '50px' },
              ];
              
              const randomPos = positions[Math.floor(Math.random() * positions.length)];
              element.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
              element.style.bottom = randomPos.bottom;
              element.style.right = randomPos.right;
            }}
          >
            <div className="relative flex items-center justify-center cursor-not-allowed w-16 h-16">
              {/* Efecto de brillo pulsante de fondo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-30 animate-ping"></div>
              
              {/* Círculo de carga giratorio principal - MÁS RÁPIDO */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  border: '3px solid transparent',
                  borderTopColor: '#8B5CF6',
                  borderRightColor: '#06B6D4',
                  animation: 'spin 0.6s linear infinite'
                }}
              ></div>
              
              {/* Segundo anillo más sutil girando en dirección opuesta - MÁS RÁPIDO */}
              <div 
                className="absolute rounded-full"
                style={{
                  inset: '4px',
                  border: '2px solid transparent',
                  borderBottomColor: '#A78BFA',
                  borderLeftColor: '#22D3EE',
                  animation: 'spin 0.8s linear infinite reverse'
                }}
              ></div>
              
              {/* Logo favicon en el centro */}
              <div className="absolute inset-2 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
                <img
                  src="/FAVICON.png"
                  alt="Cargando..."
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeOptimized;
