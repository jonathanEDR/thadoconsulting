import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useTheme } from '../../contexts/ThemeContext';
import { getPageBySlug } from '../../services/cmsApi';

/**
 * 🏢 Página Nosotros/About
 * Carga contenido dinámico desde el CMS incluyendo imágenes de fondo
 */

/**
 * Función para limpiar HTML y extraer solo el texto
 * Elimina etiquetas HTML pero preserva el contenido
 */
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  // Crear un elemento temporal para extraer el texto
  const tmp = document.createElement('div');
  tmp.innerHTML = DOMPurify.sanitize(html);
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Función para sanitizar HTML preservando estilos de gradiente
 * Permite renderizar texto con gradientes del RichTextEditor
 */
const sanitizeHtmlWithStyles = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'strong', 'em', 'b', 'i', 'u', 's', 'br', 'p', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['style', 'class', 'data-gradient'],
    ALLOW_DATA_ATTR: true
  });
};

// Tipos de alineación soportados
type TextAlignment = 'left' | 'center' | 'right';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundImageAlt?: string;
  backgroundOpacity?: number;
  textAlign?: TextAlignment; // Alineación del texto: left, center, right
  styles?: {
    light: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
    dark: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
  };
}

interface SectionContent {
  title: string;
  description: string;
  textAlign?: TextAlignment;
  fontFamily?: string;
  image?: {
    light?: string;
    dark?: string;
  };
  imageAlt?: string;
}

// Configuración de fondo compartido para Misión y Visión
interface MissionVisionBackground {
  backgroundImage?: string | {
    light?: string;
    dark?: string;
  };
  backgroundOpacity?: number;
  backgroundOverlay?: boolean;
}

interface ValueItem {
  title: string;
  description: string;
  image?: {
    light?: string;
    dark?: string;
  };
  imageAlt?: string;
  imageOpacity?: number; // Opacidad de la imagen (0-100)
  icon?: string;
}

interface ValuesContent {
  title: string;
  subtitle?: string;
  items: ValueItem[];
  textAlign?: TextAlignment;
  fontFamily?: string;
  carouselConfig?: {
    itemsPerView?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
  // Configuración de imagen de fondo
  backgroundImage?: string | {
    light?: string;
    dark?: string;
  };
  backgroundOpacity?: number;
  backgroundOverlay?: boolean;
  // Configuración de tamaño de tarjetas
  cardWidth?: string; // Ej: '100%', '350px', 'auto'
  cardHeight?: string; // Ej: '340px', '400px', 'auto'
  // Configuración de colores de tarjetas
  cardBgColor?: string;
  cardBgColorDark?: string;
  cardBorderColor?: string;
  cardBorderColorDark?: string;
  cardTitleColor?: string;
  cardTitleColorDark?: string;
  cardTextColor?: string;
  cardTextColorDark?: string;
  cardImageOpacity?: number; // Opacidad global para imágenes (0-100)
  // Configuración de fondo transparente
  cardBgTransparent?: boolean;
  cardBgTransparentDark?: boolean;
  // Configuración de gradiente para fondo de tarjetas
  cardBgUseGradient?: boolean;
  cardBgGradientFrom?: string;
  cardBgGradientTo?: string;
  cardBgGradientDirection?: string;
  cardBgUseGradientDark?: boolean;
  cardBgGradientFromDark?: string;
  cardBgGradientToDark?: string;
  cardBgGradientDirectionDark?: string;
  // Toggle para overlay oscuro en tarjetas con imagen
  cardImageOverlay?: boolean;
  // Configuración de gradiente para BORDE de tarjetas
  cardBorderUseGradient?: boolean;
  cardBorderGradientFrom?: string;
  cardBorderGradientTo?: string;
  cardBorderGradientDirection?: string;
  cardBorderUseGradientDark?: boolean;
  cardBorderGradientFromDark?: string;
  cardBorderGradientToDark?: string;
  cardBorderGradientDirectionDark?: string;
  // Configuración de gradiente para TÍTULO de tarjetas
  cardTitleUseGradient?: boolean;
  cardTitleGradientFrom?: string;
  cardTitleGradientTo?: string;
  cardTitleGradientDirection?: string;
  cardTitleUseGradientDark?: boolean;
  cardTitleGradientFromDark?: string;
  cardTitleGradientToDark?: string;
  cardTitleGradientDirectionDark?: string;
  // Configuración de colores para TÍTULO DE LA SECCIÓN
  sectionTitleColor?: string;
  sectionTitleColorDark?: string;
  sectionTitleUseGradient?: boolean;
  sectionTitleGradientFrom?: string;
  sectionTitleGradientTo?: string;
  sectionTitleGradientDirection?: string;
  sectionTitleUseGradientDark?: boolean;
  sectionTitleGradientFromDark?: string;
  sectionTitleGradientToDark?: string;
  sectionTitleGradientDirectionDark?: string;
  // Configuración de colores para SUBTÍTULO DE LA SECCIÓN
  sectionSubtitleColor?: string;
  sectionSubtitleColorDark?: string;
}

// 🆕 Interface para la sección de Historia
interface HistoryContent {
  title: string;
  description: string;
  image?: {
    light?: string;
    dark?: string;
  };
  fontFamily?: string;
}

// 🆕 Interface para items de "¿Por qué elegirnos?"
interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

// 🆕 Interface para la sección "¿Por qué elegirnos?"
interface WhyChooseUsContent {
  title: string;
  subtitle?: string;
  items: WhyChooseUsItem[];
}

interface PageContent {
  hero: HeroContent;
  mission: SectionContent;
  vision: SectionContent;
  missionVisionBackground?: MissionVisionBackground;
  values?: ValuesContent;
  history?: HistoryContent; // 🆕
  whyChooseUs?: WhyChooseUsContent; // 🆕
}

const About = () => {
  const [pageData, setPageData] = useState<{ content: PageContent } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

  // Cargar datos de la página About desde CMS
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const data = await getPageBySlug('about');
        
        setPageData(data);
      } catch (error) {
        console.error('Error cargando página About:', error);
        // Usar datos de fallback
        setPageData({
          content: {
            hero: {
              title: 'Sobre Nosotros',
              subtitle: 'Conoce nuestra historia y misión',
              description: 'SCUTI Company es una empresa líder en desarrollo de software y soluciones tecnológicas innovadoras en Perú.',
              backgroundImage: {
                light: '',
                dark: ''
              }
            },
            mission: {
              title: 'Nuestra Misión',
              description: 'Transformar empresas a través de la tecnología inteligente, creando soluciones digitales personalizadas que impulsen el crecimiento y la eficiencia.'
            },
            vision: {
              title: 'Nuestra Visión',
              description: 'Ser la empresa de referencia en desarrollo de software en Latinoamérica, reconocida por la calidad, innovación y impacto de nuestras soluciones.'
            },
            values: {
              title: 'Nuestros Valores',
              items: [
                { title: 'Innovación', description: 'Buscamos constantemente nuevas formas de resolver problemas' },
                { title: 'Calidad', description: 'Entregamos soluciones robustas y bien construidas' },
                { title: 'Compromiso', description: 'Nos dedicamos al éxito de nuestros clientes' },
                { title: 'Transparencia', description: 'Mantenemos comunicación clara y honesta' }
              ]
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  // 🎠 Autoplay del carrusel de valores
  useEffect(() => {
    const values = pageData?.content?.values;
    if (!values?.carouselConfig?.autoplay || !values.items?.length) return;

    const itemsPerView = values.carouselConfig.itemsPerView || 3;
    const totalSlides = Math.ceil(values.items.length / itemsPerView);
    if (totalSlides <= 1) return;

    const autoplaySpeed = (values.carouselConfig.autoplaySpeed || 5) * 1000;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [pageData?.content?.values]);

  // Obtener imagen de fondo según el tema
  const getBackgroundImage = () => {
    const bgImage = pageData?.content?.hero?.backgroundImage;
    if (!bgImage) return null;
    
    if (typeof bgImage === 'string') return bgImage;
    
    return theme === 'light' 
      ? (bgImage.light || bgImage.dark) 
      : (bgImage.dark || bgImage.light);
  };

  const backgroundImage = getBackgroundImage();
  // Usar el valor del CMS directamente, solo usar fallback si es undefined/null
  const backgroundOpacity = pageData?.content?.hero?.backgroundOpacity !== undefined 
    ? pageData.content.hero.backgroundOpacity 
    : 1;

  if (loading) {
    return (
      <div className={`min-h-screen w-full overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <PublicHeader />
        <main className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className={`h-12 rounded w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-6 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const { hero, mission, vision, values, history, whyChooseUs } = pageData?.content || {};

  // Obtener colores personalizados del CMS o usar defaults
  const getHeroStyles = () => {
    const styles = hero?.styles;
    const currentStyles = theme === 'light' ? styles?.light : styles?.dark;
    
    return {
      titleColor: currentStyles?.titleColor || (theme === 'dark' ? '#FFFFFF' : '#1F2937'),
      subtitleColor: currentStyles?.subtitleColor || (theme === 'dark' ? '#A78BFA' : '#8B5CF6'),
      descriptionColor: currentStyles?.descriptionColor || (theme === 'dark' ? '#D1D5DB' : '#4B5563')
    };
  };

  const heroStyles = getHeroStyles();

  return (
    <>
      {/* ✅ SEO Hardcoded directo (para indexación inmediata de Google) */}
      <Helmet>
        <title>Sobre Nosotros - SCUTI Company | Empresa de Software en Perú</title>
        <meta name="description" content="Conoce SCUTI Company: empresa líder en desarrollo de software e IA para PYMES en Perú. Nuestra misión es transformar negocios con tecnología inteligente." />
        <meta name="keywords" content="sobre nosotros, equipo SCUTI, empresa de software Perú, desarrollo tecnológico, misión, visión, transformación digital PYMES" />

        {/* Open Graph */}
        <meta property="og:title" content="Sobre Nosotros - SCUTI Company | Empresa de Software en Perú" />
        <meta property="og:description" content="Conoce SCUTI Company: empresa líder en desarrollo de software e IA para PYMES en Perú. Transformamos negocios con tecnología inteligente." />
        <meta property="og:image" content="https://scuticompany.com/logofondonegro.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SCUTI Company - Empresa de Desarrollo de Software en Perú" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://scuticompany.com/nosotros" />
        <meta property="og:site_name" content="SCUTI Company" />
        <meta property="og:locale" content="es_PE" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sobre Nosotros - SCUTI Company | Empresa de Software en Perú" />
        <meta name="twitter:description" content="Empresa líder en desarrollo de software e IA para PYMES en Perú" />
        <meta name="twitter:image" content="https://scuticompany.com/logofondonegro.jpeg" />

        {/* Canonical */}
        <link rel="canonical" href="https://scuticompany.com/nosotros" />

        {/* Schema.org - AboutPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "Sobre Nosotros - SCUTI Company",
            "description": "Conoce SCUTI Company: empresa líder en desarrollo de software e IA para PYMES en Perú",
            "url": "https://scuticompany.com/nosotros",
            "mainEntity": {
              "@type": "Organization",
              "name": "SCUTI Company",
              "description": "Empresa de desarrollo de software a medida, inteligencia artificial y automatización para PYMES en Perú",
              "foundingDate": "2023",
              "foundingLocation": {
                "@type": "Place",
                "name": "Huánuco, Perú"
              },
              "slogan": "Impulsa tu PYME con Software a Medida e Inteligencia Artificial",
              "knowsAbout": [
                "Desarrollo de Software a Medida",
                "Inteligencia Artificial",
                "Automatización de Procesos",
                "Transformación Digital"
              ]
            }
          })}
        </script>
      </Helmet>

      <div className={`min-h-screen w-full overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <PublicHeader />
        
        {/* 🎨 Hero Section con imagen de fondo del CMS */}
        <section 
          className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB'
          }}
        >
          {/* Imagen de fondo */}
          {backgroundImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                opacity: backgroundOpacity
              }}
              aria-label={hero?.backgroundImageAlt || 'About background'}
            />
          )}
          
          {/* Overlay gradient para legibilidad - SOLO si la opacidad es menor a 1 */}
          {backgroundOpacity < 1 && (
            <div 
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: theme === 'dark'
                  ? `linear-gradient(180deg, rgba(17, 24, 39, ${0.7 - backgroundOpacity * 0.5}) 0%, rgba(17, 24, 39, ${0.9 - backgroundOpacity * 0.5}) 100%)`
                  : `linear-gradient(180deg, rgba(249, 250, 251, ${0.7 - backgroundOpacity * 0.5}) 0%, rgba(249, 250, 251, ${0.9 - backgroundOpacity * 0.5}) 100%)`
              }}
            />
          )}
          
          {/* Contenido del Hero - Alineación configurable */}
          <div 
            className={`relative z-10 container mx-auto px-4 py-32 ${
              (hero?.textAlign || 'left') === 'left' ? 'text-left' : 
              (hero?.textAlign || 'left') === 'right' ? 'text-right' : 
              'text-center'
            }`} 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-colors duration-300 ${
                (hero?.textAlign || 'left') === 'center' ? 'mx-auto' : ''
              }`}
              style={{ 
                color: heroStyles.titleColor, 
                fontFamily: "'Montserrat', sans-serif",
                maxWidth: (hero?.textAlign || 'left') !== 'center' ? '800px' : undefined
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtmlWithStyles(hero?.title || 'Sobre Nosotros') }}
            />
            
            {hero?.subtitle && (
              <h2 
                className={`text-xl md:text-2xl font-medium mb-6 transition-colors duration-300 ${
                  (hero?.textAlign || 'left') === 'center' ? 'mx-auto' : ''
                }`}
                style={{ 
                  color: heroStyles.subtitleColor, 
                  fontFamily: "'Montserrat', sans-serif",
                  maxWidth: (hero?.textAlign || 'left') !== 'center' ? '700px' : undefined
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtmlWithStyles(hero.subtitle) }}
              />
            )}
            
            {hero?.description && (
              <p 
                className={`text-lg md:text-xl leading-relaxed transition-colors duration-300 ${
                  (hero?.textAlign || 'left') === 'center' ? 'max-w-3xl mx-auto' : 'max-w-2xl'
                }`}
                style={{ 
                  color: heroStyles.descriptionColor, 
                  fontFamily: "'Montserrat', sans-serif" 
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtmlWithStyles(hero.description) }}
              />
            )}
          </div>
        </section>
        
        {/* 📋 Historia, Misión y Visión - Bloque unificado con fondo compartido */}
        {(history?.title || mission?.title || vision?.title) && (
          <section 
            className="relative py-16 md:py-24 overflow-hidden"
            style={{
              backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB'
            }}
          >
            {/* Imagen de fondo compartida para Misión y Visión */}
            {(() => {
              const mvBg = pageData?.content?.missionVisionBackground;
              // Soportar tanto string simple como objeto {light, dark}
              const bgImage = mvBg?.backgroundImage 
                ? (typeof mvBg.backgroundImage === 'string'
                    ? mvBg.backgroundImage
                    : (theme === 'dark' 
                        ? mvBg.backgroundImage.dark || mvBg.backgroundImage.light 
                        : mvBg.backgroundImage.light || mvBg.backgroundImage.dark))
                : null;
              const bgOpacity = mvBg?.backgroundOpacity ?? 1;
              
              return bgImage ? (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      opacity: bgOpacity
                    }}
                  />
                  {/* Overlay para legibilidad - Solo si está activado explícitamente */}
                  {mvBg?.backgroundOverlay === true && (
                    <div 
                      className="absolute inset-0 transition-all duration-500"
                      style={{
                        background: theme === 'dark'
                          ? `linear-gradient(180deg, rgba(17, 24, 39, 0.6) 0%, rgba(17, 24, 39, 0.75) 100%)`
                          : `linear-gradient(180deg, rgba(249, 250, 251, 0.6) 0%, rgba(249, 250, 251, 0.75) 100%)`
                      }}
                    />
                  )}
                </>
              ) : null;
            })()}
            
            <div className="relative z-10 container mx-auto px-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <div className="max-w-6xl mx-auto space-y-20 md:space-y-32">
                
                {/* 📖 Historia - Solo texto, sin imagen */}
                {history?.title && history?.description && (
                  <div 
                    className="max-w-4xl mx-auto text-center space-y-6"
                    style={{ fontFamily: `'${history.fontFamily || 'Montserrat'}', sans-serif` }}
                  >
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                      theme === 'dark' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      Nuestra Historia
                    </div>
                    <h2 className={`text-3xl md:text-4xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stripHtmlTags(history.title)}
                    </h2>
                    <div className={`space-y-4 text-lg md:text-xl leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {history.description.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 🎯 Misión */}
                {mission?.title && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    {/* Contenido de texto */}
                    <div 
                      className="order-2 lg:order-1 space-y-6"
                      style={{ fontFamily: `'${mission.fontFamily || 'Montserrat'}', sans-serif` }}
                    >
                      <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        {stripHtmlTags(mission.title) || 'Nuestra Misión'}
                      </div>
                      <p className={`text-lg md:text-xl leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {stripHtmlTags(mission.description)}
                      </p>
                    </div>
                    
                    {/* Imagen */}
                    <div className="order-1 lg:order-2">
                      {(() => {
                        // Soportar tanto string simple como objeto {light, dark}
                        const missionImage = typeof mission.image === 'string'
                          ? mission.image
                          : (mission.image 
                              ? (mission.image.dark || mission.image.light)
                              : null);
                        
                        return missionImage ? (
                          // Imagen sin marco - se muestra limpia
                          <div className="relative flex items-center justify-center transition-all duration-500 group">
                            <img 
                              src={missionImage}
                              alt={mission.imageAlt || 'Nuestra Misión'}
                              className="w-full h-auto max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          // Placeholder visual cuando no hay imagen
                          <div 
                            className={`relative overflow-hidden rounded-3xl aspect-[4/3] transition-all duration-500 group shadow-2xl ${
                              theme === 'dark' 
                                ? 'shadow-purple-500/10' 
                                : 'shadow-purple-500/20'
                            }`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                                theme === 'dark' 
                                  ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20' 
                                  : 'bg-gradient-to-br from-purple-200 to-cyan-200'
                              }`}>
                                <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              {/* Decoraciones */}
                              <div className={`absolute top-4 right-4 w-16 h-16 rounded-full opacity-30 ${
                                theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'
                              }`}></div>
                              <div className={`absolute bottom-8 left-8 w-12 h-12 rounded-full opacity-20 ${
                                theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'
                              }`}></div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
                
                {/* 👁️ Visión */}
                {vision?.title && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    {/* Imagen */}
                    <div className="order-1">
                      {(() => {
                        // Soportar tanto string simple como objeto {light, dark}
                        const visionImage = typeof vision.image === 'string'
                          ? vision.image
                          : (vision.image 
                              ? (vision.image.dark || vision.image.light)
                              : null);
                        
                        return visionImage ? (
                          // Imagen sin marco - se muestra limpia
                          <div className="relative flex items-center justify-center transition-all duration-500 group">
                            <img 
                              src={visionImage}
                              alt={vision.imageAlt || 'Nuestra Visión'}
                              className="w-full h-auto max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          // Placeholder visual cuando no hay imagen
                          <div 
                            className={`relative overflow-hidden rounded-3xl aspect-[4/3] transition-all duration-500 group shadow-2xl ${
                              theme === 'dark' 
                                ? 'shadow-cyan-500/10' 
                                : 'shadow-cyan-500/20'
                            }`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                                theme === 'dark' 
                                  ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
                                  : 'bg-gradient-to-br from-cyan-200 to-purple-200'
                              }`}>
                                <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                              {/* Decoraciones */}
                              <div className={`absolute top-8 left-4 w-16 h-16 rounded-full opacity-30 ${
                                theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'
                              }`}></div>
                              <div className={`absolute bottom-4 right-8 w-12 h-12 rounded-full opacity-20 ${
                                theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'
                              }`}></div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Contenido de texto */}
                    <div 
                      className="order-2 space-y-6"
                      style={{ fontFamily: `'${vision.fontFamily || 'Montserrat'}', sans-serif` }}
                    >
                      <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                          : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                      }`}>
                        {stripHtmlTags(vision.title) || 'Nuestra Visión'}
                      </div>
                      <p className={`text-lg md:text-xl leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {stripHtmlTags(vision.description)}
                      </p>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </section>
        )}
        
        {/* ⭐ Valores - Sección con imagen de fondo */}
        {(() => {
          // Obtener imagen de fondo de valores según el tema
          const valuesBackgroundImage = values?.backgroundImage
            ? typeof values.backgroundImage === 'string'
              ? values.backgroundImage
              : (theme === 'dark' ? values.backgroundImage.dark : values.backgroundImage.light) || 
                values.backgroundImage.light || values.backgroundImage.dark
            : null;

          return (
            <section 
              className="relative py-16 md:py-24 overflow-hidden"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {/* Imagen de fondo */}
              {valuesBackgroundImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${valuesBackgroundImage})`,
                    opacity: values?.backgroundOpacity ?? 1
                  }}
                />
              )}
              
              {/* Overlay oscuro opcional */}
              {valuesBackgroundImage && values?.backgroundOverlay === true && (
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)'
                  }}
                />
              )}

              {/* Contenido */}
              <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  {values?.title && values?.items && values.items.length > 0 && (() => {
                    const itemsPerView = values.carouselConfig?.itemsPerView || 3;
                    const totalSlides = Math.ceil(values.items.length / itemsPerView);
                    const valuesFontFamily = values.fontFamily || 'Montserrat';
                    const cardHeight = values.cardHeight || '340px';
                    const cardWidth = values.cardWidth || '100%';
                    
                    // Configuración de colores de tarjetas con soporte de gradiente
                    const useGradient = theme === 'dark' 
                      ? (values.cardBgUseGradientDark || false)
                      : (values.cardBgUseGradient || false);
                    
                    const gradientFrom = theme === 'dark'
                      ? (values.cardBgGradientFromDark || '#1e3a5f')
                      : (values.cardBgGradientFrom || '#667eea');
                    
                    const gradientTo = theme === 'dark'
                      ? (values.cardBgGradientToDark || '#0d9488')
                      : (values.cardBgGradientTo || '#764ba2');
                    
                    const gradientDirection = theme === 'dark'
                      ? (values.cardBgGradientDirectionDark || 'to-br')
                      : (values.cardBgGradientDirection || 'to-br');
                    
                    const getGradientCss = () => {
                      const directionMap: Record<string, string> = {
                        'to-r': 'to right',
                        'to-l': 'to left', 
                        'to-t': 'to top',
                        'to-b': 'to bottom',
                        'to-tr': 'to top right',
                        'to-tl': 'to top left',
                        'to-br': 'to bottom right',
                        'to-bl': 'to bottom left'
                      };
                      return `linear-gradient(${directionMap[gradientDirection] || 'to bottom right'}, ${gradientFrom}, ${gradientTo})`;
                    };
                    
                    // Soporte para fondo transparente
                    const useTransparentBg = theme === 'dark'
                      ? (values.cardBgTransparentDark || false)
                      : (values.cardBgTransparent || false);
                    
                    // Configuración de gradiente para BORDE de tarjetas (movido aquí para usar en getCardBgStyle)
                    const useBorderGradient = theme === 'dark'
                      ? (values.cardBorderUseGradientDark || false)
                      : (values.cardBorderUseGradient || false);
                    
                    // 🔧 CORRECCIÓN: Cuando fondo es transparente Y hay borde gradiente,
                    // el div interno necesita un fondo que coincida con la sección
                    // 🔧 Función para obtener el estilo de fondo de la tarjeta
                    const getCardBgStyle = () => {
                      if (useTransparentBg) {
                        // Fondo completamente transparente
                        return { backgroundColor: 'transparent' };
                      }
                      if (useGradient) {
                        return { background: getGradientCss() };
                      }
                      return { 
                        backgroundColor: theme === 'dark' 
                          ? (values.cardBgColorDark || 'rgba(31, 41, 55, 0.5)') 
                          : (values.cardBgColor || 'rgba(255, 255, 255, 0.8)') 
                      };
                    };
                    
                    const cardBgStyle = getCardBgStyle();
                    
                    // Cuando es transparente, NO usar wrapper de borde gradiente
                    // porque el wrapper tiene fondo que se ve a través de la transparencia.
                    // En su lugar, usar borde sólido con el primer color del gradiente.
                    const effectiveUseBorderGradient = useBorderGradient && !useTransparentBg;
                    
                    const cardBorderColor = theme === 'dark'
                      ? (values.cardBorderColorDark || 'rgba(75, 85, 99, 0.5)')
                      : (values.cardBorderColor || 'rgba(243, 244, 246, 1)');
                    const cardTitleColor = theme === 'dark'
                      ? (values.cardTitleColorDark || '#ffffff')
                      : (values.cardTitleColor || '#111827');
                    const cardTextColor = theme === 'dark'
                      ? (values.cardTextColorDark || '#9ca3af')
                      : (values.cardTextColor || '#4b5563');
                    
                    // Toggle para overlay oscuro en tarjetas con imagen (default: true para mantener legibilidad)
                    const showImageOverlay = values.cardImageOverlay !== false;
                    
                    // Configuración de colores del gradiente para BORDE de tarjetas
                    const borderGradientFrom = theme === 'dark'
                      ? (values.cardBorderGradientFromDark || '#8b5cf6')
                      : (values.cardBorderGradientFrom || '#667eea');
                    const borderGradientTo = theme === 'dark'
                      ? (values.cardBorderGradientToDark || '#06b6d4')
                      : (values.cardBorderGradientTo || '#764ba2');
                    const borderGradientDirection = theme === 'dark'
                      ? (values.cardBorderGradientDirectionDark || 'to-r')
                      : (values.cardBorderGradientDirection || 'to-r');
                    
                    const getBorderGradientCss = () => {
                      const directionMap: Record<string, string> = {
                        'to-r': 'to right', 'to-l': 'to left', 'to-t': 'to top', 'to-b': 'to bottom',
                        'to-tr': 'to top right', 'to-tl': 'to top left', 'to-br': 'to bottom right', 'to-bl': 'to bottom left'
                      };
                      return `linear-gradient(${directionMap[borderGradientDirection] || 'to right'}, ${borderGradientFrom}, ${borderGradientTo})`;
                    };
                    
                    // Configuración de gradiente para TÍTULO de tarjetas
                    const useTitleGradient = theme === 'dark'
                      ? (values.cardTitleUseGradientDark || false)
                      : (values.cardTitleUseGradient || false);
                    const titleGradientFrom = theme === 'dark'
                      ? (values.cardTitleGradientFromDark || '#8b5cf6')
                      : (values.cardTitleGradientFrom || '#667eea');
                    const titleGradientTo = theme === 'dark'
                      ? (values.cardTitleGradientToDark || '#06b6d4')
                      : (values.cardTitleGradientTo || '#764ba2');
                    const titleGradientDirection = theme === 'dark'
                      ? (values.cardTitleGradientDirectionDark || 'to-r')
                      : (values.cardTitleGradientDirection || 'to-r');
                    
                    // Configuración de colores para TÍTULO DE LA SECCIÓN
                    const useSectionTitleGradient = theme === 'dark'
                      ? (values.sectionTitleUseGradientDark || false)
                      : (values.sectionTitleUseGradient || false);
                    const sectionTitleGradientFrom = theme === 'dark'
                      ? (values.sectionTitleGradientFromDark || '#8b5cf6')
                      : (values.sectionTitleGradientFrom || '#667eea');
                    const sectionTitleGradientTo = theme === 'dark'
                      ? (values.sectionTitleGradientToDark || '#06b6d4')
                      : (values.sectionTitleGradientTo || '#764ba2');
                    const sectionTitleGradientDirection = theme === 'dark'
                      ? (values.sectionTitleGradientDirectionDark || 'to-r')
                      : (values.sectionTitleGradientDirection || 'to-r');
                    const sectionTitleColor = theme === 'dark'
                      ? (values.sectionTitleColorDark || '#ffffff')
                      : (values.sectionTitleColor || '#111827');
                    const sectionSubtitleColor = theme === 'dark'
                      ? (values.sectionSubtitleColorDark || '#9ca3af')
                      : (values.sectionSubtitleColor || '#6b7280');
                    
                    const visibleItems = values.items.slice(
                      currentSlide * itemsPerView,
                      currentSlide * itemsPerView + itemsPerView
                    );

                    return (
                      <div className="py-12">
                  {/* Estilos dinámicos para gradientes */}
                  <style>
                    {`
                      .section-title-gradient-${theme} {
                        background: linear-gradient(${
                          sectionTitleGradientDirection === 'to-r' ? 'to right' :
                          sectionTitleGradientDirection === 'to-l' ? 'to left' :
                          sectionTitleGradientDirection === 'to-t' ? 'to top' :
                          sectionTitleGradientDirection === 'to-b' ? 'to bottom' :
                          sectionTitleGradientDirection === 'to-tr' ? 'to top right' :
                          sectionTitleGradientDirection === 'to-tl' ? 'to top left' :
                          sectionTitleGradientDirection === 'to-br' ? 'to bottom right' :
                          'to bottom left'
                        }, ${sectionTitleGradientFrom}, ${sectionTitleGradientTo});
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        display: inline-block;
                      }
                      .card-title-gradient-${theme} {
                        background: linear-gradient(${
                          titleGradientDirection === 'to-r' ? 'to right' :
                          titleGradientDirection === 'to-l' ? 'to left' :
                          titleGradientDirection === 'to-t' ? 'to top' :
                          titleGradientDirection === 'to-b' ? 'to bottom' :
                          titleGradientDirection === 'to-tr' ? 'to top right' :
                          titleGradientDirection === 'to-tl' ? 'to top left' :
                          titleGradientDirection === 'to-br' ? 'to bottom right' :
                          'to bottom left'
                        }, ${titleGradientFrom}, ${titleGradientTo});
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                      }
                    `}
                  </style>

                  {/* Título y subtítulo */}
                  <div className="text-center mb-16">
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
                      theme === 'dark' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      Lo que nos define
                    </div>
                    <h2 
                      className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${useSectionTitleGradient ? `section-title-gradient-${theme}` : ''}`}
                      style={{ 
                        fontFamily: `'${valuesFontFamily}', sans-serif`,
                        ...(!useSectionTitleGradient ? { color: sectionTitleColor } : {})
                      }}
                    >
                      {stripHtmlTags(values.title)}
                    </h2>
                    {values.subtitle && (
                      <p 
                        className="text-lg max-w-2xl mx-auto"
                        style={{ 
                          fontFamily: `'${valuesFontFamily}', sans-serif`,
                          color: sectionSubtitleColor
                        }}
                      >
                        {stripHtmlTags(values.subtitle)}
                      </p>
                    )}
                  </div>

                  {/* Carrusel Container */}
                  <div className="relative">
                    {/* Cards del Carrusel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-8">
                      {visibleItems.map((value, index) => {
                        // Soportar tanto string simple como objeto {light, dark}
                        const valueImage = typeof value.image === 'string' 
                          ? value.image 
                          : (value.image 
                              ? (theme === 'dark' ? value.image.dark || value.image.light : value.image.light || value.image.dark)
                              : null);
                        
                        // Opacidad individual o global
                        const imageOpacity = (value.imageOpacity ?? values.cardImageOpacity ?? 100) / 100;

                        return effectiveUseBorderGradient ? (
                          // Tarjeta con borde gradiente (usando wrapper)
                          <div
                            key={currentSlide * itemsPerView + index}
                            className="group relative rounded-3xl transition-all duration-500 transform hover:scale-[1.02]"
                            style={{
                              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                              background: getBorderGradientCss(),
                              padding: '2px',
                              minHeight: cardHeight,
                              width: cardWidth,
                              maxWidth: cardWidth === '100%' ? undefined : cardWidth
                            }}
                          >
                            <div
                              className="relative overflow-hidden rounded-3xl h-full backdrop-blur-sm shadow-xl group-hover:shadow-2xl"
                              style={{
                                ...cardBgStyle,
                                minHeight: `calc(${cardHeight} - 4px)`
                              }}
                            >
                              {/* Imagen de fondo (solo si hay imagen configurada) */}
                              {valueImage && (
                                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                                  <img
                                    src={valueImage}
                                    alt={value.imageAlt || value.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{ opacity: imageOpacity }}
                                  />
                                </div>
                              )}

                              {/* Contenido de la tarjeta */}
                              <div className={`relative z-10 p-8 h-full flex flex-col justify-end ${
                                valueImage && showImageOverlay ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' : ''
                              }`}>
                                {/* Título con gradiente opcional */}
                                <h3 
                                  className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                                    !valueImage && useTitleGradient ? `card-title-gradient-${theme}` : ''
                                  }`}
                                  style={{ 
                                    fontFamily: `'${valuesFontFamily}', sans-serif`,
                                    ...(valueImage 
                                      ? { color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }
                                      : (!useTitleGradient ? { color: cardTitleColor } : {})
                                    )
                                  }}
                                >
                                  {stripHtmlTags(value.title)}
                                </h3>

                                {/* Descripción */}
                                <p 
                                  className="text-base leading-relaxed"
                                  style={{ 
                                    fontFamily: `'${valuesFontFamily}', sans-serif`,
                                    color: valueImage ? 'rgba(255,255,255,0.9)' : cardTextColor,
                                    textShadow: valueImage ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                  }}
                                >
                                  {stripHtmlTags(value.description)}
                                </p>

                                {/* Línea decorativa */}
                                <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 
                                  opacity-0 group-hover:opacity-100 transition-all duration-300 transform 
                                  translate-y-2 group-hover:translate-y-0" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Tarjeta con borde sólido normal (o transparente con borde del primer color del gradiente)
                          <div
                            key={currentSlide * itemsPerView + index}
                            className="group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm shadow-xl hover:shadow-2xl"
                            style={{ 
                              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                              minHeight: cardHeight,
                              width: cardWidth,
                              maxWidth: cardWidth === '100%' ? undefined : cardWidth,
                              ...cardBgStyle,
                              borderWidth: useTransparentBg && useBorderGradient ? '2px' : '1px',
                              borderStyle: 'solid',
                              // Si es transparente + borde gradiente, usar el primer color del gradiente como borde
                              borderColor: useTransparentBg && useBorderGradient 
                                ? borderGradientFrom 
                                : cardBorderColor
                            }}
                          >
                            {/* Imagen de fondo (solo si hay imagen configurada) */}
                            {valueImage && (
                              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                                <img
                                  src={valueImage}
                                  alt={value.imageAlt || value.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  style={{ opacity: imageOpacity }}
                                />
                              </div>
                            )}

                            {/* Contenido de la tarjeta */}
                            <div className={`relative z-10 p-8 h-full flex flex-col justify-end ${
                              valueImage && showImageOverlay ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' : ''
                            }`}>
                              {/* Título con gradiente opcional */}
                              <h3 
                                className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                                  !valueImage && useTitleGradient ? `card-title-gradient-${theme}` : ''
                                }`}
                                style={{ 
                                  fontFamily: `'${valuesFontFamily}', sans-serif`,
                                  ...(valueImage 
                                    ? { color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }
                                    : (!useTitleGradient ? { color: cardTitleColor } : {})
                                  )
                                }}
                              >
                                {stripHtmlTags(value.title)}
                              </h3>

                              {/* Descripción */}
                              <p 
                                className="text-base leading-relaxed"
                                style={{ 
                                  fontFamily: `'${valuesFontFamily}', sans-serif`,
                                  color: valueImage ? 'rgba(255,255,255,0.9)' : cardTextColor,
                                  textShadow: valueImage ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}
                              >
                                {stripHtmlTags(value.description)}
                              </p>

                              {/* Línea decorativa */}
                              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 
                                opacity-0 group-hover:opacity-100 transition-all duration-300 transform 
                                translate-y-2 group-hover:translate-y-0" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Indicadores de página */}
                  {totalSlides > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            idx === currentSlide
                              ? `w-8 h-3 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'}`
                              : `w-3 h-3 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`
                          }`}
                          aria-label={`Ir a página ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 🏆 ¿POR QUÉ ELEGIRNOS? - Integrado dentro de Valores */}
            {whyChooseUs?.items && whyChooseUs.items.length > 0 && (
              <div className="mt-16 pt-16 border-t border-gray-700/30">
                <div className="max-w-4xl mx-auto">
                  {/* Encabezado de la sección */}
                  <div className="text-center mb-12">
                    {/* Badge decorativo */}
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
                      theme === 'dark' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      ¿Por qué elegirnos?
                    </div>
                    
                    {/* Título */}
                    {whyChooseUs.title && (
                      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {whyChooseUs.title}
                      </h2>
                    )}
                    
                    {/* Subtítulo */}
                    {whyChooseUs.subtitle && (
                      <p className={`text-lg max-w-2xl mx-auto ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {whyChooseUs.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Lista de beneficios */}
                  <div className="space-y-4">
                    {whyChooseUs.items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-4 p-5 rounded-xl transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50'
                            : 'bg-white/80 hover:bg-white border border-gray-200'
                        }`}
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.5s ease-out forwards'
                        }}
                      >
                        {/* Icono */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
                            : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                        }`}>
                          {item.icon || '✅'}
                        </div>
                        
                        {/* Contenido */}
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.title}
                          </h3>
                          <p className={`leading-relaxed ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estilos para animación */}
                <style>{`
                  @keyframes fadeInUp {
                    from {
                      opacity: 0;
                      transform: translateY(20px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
              </div>
            )}
            
                </div>
              </div>
            </section>
          );
        })()}
        
        <PublicFooter />
        
        {/* 💬 Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
      </div>
    </>
  );
};

export default About;