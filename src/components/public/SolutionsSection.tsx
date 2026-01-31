import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import { SolutionsSkeleton } from '../common/SectionSkeletons';
import type { CardDesignStyles, ButtonStyle } from '../../types/cms';
import DynamicIcon from '../ui/DynamicIcon';

interface SolutionItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  // Nuevo sistema de iconos dinámicos
  iconName?: string;
  iconColorLight?: string;
  iconColorDark?: string;
  // Sistema antiguo (deprecated)
  iconLight?: string;
  iconDark?: string;
  gradient?: string;
  _id?: any; // Para compatibilidad con MongoDB
  styles?: {
    light?: {
      titleColor?: string;
      descriptionColor?: string;
    };
    dark?: {
      titleColor?: string;
      descriptionColor?: string;
    };
  };
  // Configuración del botón "Conocer más"
  showButton?: boolean;    // Mostrar/ocultar el botón (default: true)
  buttonText?: string;     // Texto del botón (default: "Conocer más")
  buttonLink?: string;     // Enlace del botón (default: "/servicios")
}

interface SolutionsData {
  title: string;
  subtitle?: string; // Opcional para compatibilidad con defaultConfig
  description?: string; // Del CMS
  backgroundImage: {
    light: string;
    dark: string;
  };
  backgroundImageAlt: string;
  cards?: SolutionItem[]; // Del defaultConfig
  items?: SolutionItem[]; // Del CMS
  cardsDesign?: {
    light: CardDesignStyles;
    dark: CardDesignStyles;
  };
  styles?: {
    light?: {
      titleColor?: string;
      descriptionColor?: string;
    };
    dark?: {
      titleColor?: string;
      descriptionColor?: string;
    };
  };
}

interface SolutionsSectionProps {
  data?: SolutionsData;
  themeConfig?: any; // Simplificado para evitar conflictos de tipos
}

const SolutionsSection = ({ data, themeConfig }: SolutionsSectionProps) => {
  const { theme } = useTheme();

  // 🔧 SOLUCIÓN: Función para limpiar HTML del RichTextEditor y extraer solo texto
  const cleanHtmlToText = (htmlString: string): string => {
    if (!htmlString) return '';
    // Crear un div temporal para extraer solo el texto
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(htmlString);
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Si no hay datos, mostrar skeleton de carga
  if (!data) return <SolutionsSkeleton />;

  const solutionsData: SolutionsData = data;

  // Mapear datos del CMS a estructura esperada
  const getMappedSolutionsData = () => {
    // Si tenemos datos del CMS (con 'items'), mapear a estructura esperada
    if (solutionsData.items) {
      return {
        ...solutionsData,
        // Mapear 'description' del CMS a 'subtitle' para compatibilidad
        subtitle: solutionsData.description || solutionsData.subtitle || '',
        // Usar 'items' del CMS como 'cards'
        cards: solutionsData.items.map((item, index) => ({
          id: item.id || item._id?.toString() || index.toString(),
          title: item.title,
          description: item.description,
          icon: item.icon || '📄',
          // Nuevo sistema de iconos dinámicos
          iconName: item.iconName,
          iconColorLight: item.iconColorLight,
          iconColorDark: item.iconColorDark,
          // Sistema antiguo para compatibilidad
          iconLight: item.iconLight,
          iconDark: item.iconDark,
          gradient: item.gradient,
          styles: item.styles, // ✅ Preservar estilos individuales
          _id: item._id, // Preservar _id para compatibilidad
          // ✅ Nuevos campos del botón
          showButton: item.showButton,
          buttonText: item.buttonText,
          buttonLink: item.buttonLink
        }))
      };
    }
    
    // Fallback a estructura de defaultConfig
    return {
      ...solutionsData,
      subtitle: solutionsData.subtitle || '',
      cards: solutionsData.cards || []
    };
  };

  const mappedData = getMappedSolutionsData();

  // ⚡ Usar estilos del CMS si están disponibles, sino usar defaults
  const getCMSCardStyles = (): CardDesignStyles => {
    const cmsStyles = solutionsData.cardsDesign;
    if (cmsStyles && cmsStyles[theme]) {
      const styles = cmsStyles[theme];
      // ⚡ CORRECCIÓN: Asegurar que 'transparent' se convierte correctamente
      if (styles.background === 'transparent') {
        styles.background = 'transparent';
      }
      return styles;
    }
    
    // Fallback a estilos por defecto
    return theme === 'light' ? defaultLightStyles : defaultDarkStyles;
  };

  // Valores por defecto para el diseño de tarjetas - Colores según maqueta
  const defaultLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '1px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.15)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#7528ee', // Color violeta para iconos según maqueta
    titleColor: '#333333', // Color específico de la maqueta para títulos
    descriptionColor: '#6B7280', // Gris medio más legible
    linkColor: '#7528ee', // Violeta para enlaces
    cardMinWidth: '340px',
    cardMaxWidth: '380px',
    cardMinHeight: '260px',
    cardPadding: '1.5rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  const defaultDarkStyles: CardDesignStyles = {
    background: 'rgba(0, 0, 0, 0.3)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(0, 0, 0, 0.4)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#ffffff',
    titleColor: '#ffffff',
    descriptionColor: '#d1d5db',
    linkColor: '#a78bfa',
    cardMinWidth: '340px',
    cardMaxWidth: '380px',
    cardMinHeight: '260px',
    cardPadding: '1.5rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  // Obtener estilos actuales según el tema (CMS o defaults)
  const cardStyles = getCMSCardStyles();


  // ⚡ Obtener estilos del botón "Ver más..." desde la configuración de tema
  const getViewMoreButtonStyles = (): ButtonStyle => {
    const themeButtons = themeConfig?.[theme === 'light' ? 'lightMode' : 'darkMode']?.buttons;
    
    if (themeButtons?.viewMore) {
      return themeButtons.viewMore;
    }
    
    // Fallback a estilos por defecto
    return {
      text: 'Ver más...',
      background: theme === 'light' 
        ? 'linear-gradient(135deg, #01c2cc 0%, #7528ee 100%)'
        : 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
      textColor: theme === 'light' ? '#FFFFFF' : '#111827',
      borderColor: 'transparent'
    };
  };

  const viewMoreButtonStyles = getViewMoreButtonStyles();

  // Obtener la imagen correcta según el tema activo
  const getCurrentBackgroundImage = () => {
    if (!mappedData.backgroundImage) return null;
    
    // Usar imagen del tema activo
    return theme === 'light' 
      ? mappedData.backgroundImage.light 
      : mappedData.backgroundImage.dark;
  };

  // 🛡️ FUNCIÓN HELPER para CSS robusto - Evita valores undefined/null
  const getSafeStyle = (value: string | undefined, fallback: string): string => {
    return value && value !== 'undefined' && value !== 'null' ? value : fallback;
  };

  // Función helper para detectar si un string es una URL de imagen
  const isImageUrl = (str: string): boolean => {
    return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/');
  };

  // Obtener el icono correcto según el tema activo
  const getCurrentIcon = (solution: SolutionItem): { type: 'dynamic' | 'image' | 'emoji' | 'component' | 'none', value: string | React.ReactNode | null, color?: string } => {
    // Prioridad 1: Nuevo sistema de iconos dinámicos (iconName)
    if (solution.iconName) {
      const iconColor = theme === 'dark' 
        ? (solution.iconColorDark || '#818cf8')
        : (solution.iconColorLight || '#6366f1');
      return { 
        type: 'dynamic', 
        value: solution.iconName, 
        color: iconColor 
      };
    }
    
    // Prioridad 2: Sistema antiguo - iconLight/iconDark según tema activo
    if (theme === 'light' && solution.iconLight) {
      const iconType = isImageUrl(solution.iconLight) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconLight };
    }
    if (theme === 'dark' && solution.iconDark) {
      const iconType = isImageUrl(solution.iconDark) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconDark };
    }
    
    // Prioridad 3: Fallback al icono del otro tema si el actual no existe
    if (theme === 'light' && solution.iconDark) {
      const iconType = isImageUrl(solution.iconDark) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconDark };
    }
    if (theme === 'dark' && solution.iconLight) {
      const iconType = isImageUrl(solution.iconLight) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconLight };
    }
    
    // Prioridad 4: Usar icon como fallback (siempre será string en defaultConfig)
    if (solution.icon) {
      const iconType = isImageUrl(solution.icon) ? 'image' : 'emoji';
      return { type: iconType, value: solution.icon };
    }
    
    // Fallback: No icon
    return { type: 'none', value: null };
  };

  const currentBackgroundImage = getCurrentBackgroundImage();

  // Usar items mapeados correctamente
  const solutions = mappedData.cards || [];

  // Función para obtener clases de alineación de tarjetas
  const getCardsAlignmentClasses = () => {
    const alignment = cardStyles.cardsAlignment || 'left';
    

    
    // Para que la alineación sea visible, necesitamos cambiar el comportamiento del grid
    switch (alignment) {
      case 'center':
        return 'justify-center'; // Centra todo el contenido del grid
      case 'right':
        return 'justify-end'; // Alinea todo a la derecha
      case 'left':
      default:
        return 'justify-start'; // Alinea todo a la izquierda (por defecto)
    }
  };



  return (
    <section className="relative py-20 theme-transition overflow-hidden w-full"
             style={{
               background: `linear-gradient(to bottom, color-mix(in srgb, var(--color-card-bg) 95%, var(--color-primary)), var(--color-card-bg))`
             }}>
      
      {/* Background Image (si existe) - CALIDAD HD SIN FILTROS */}
      {currentBackgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
            style={{
              backgroundImage: `url(${currentBackgroundImage})`,
              opacity: 1  // 100% opacidad - calidad HD total
            }}
            role="img"
            aria-label={mappedData.backgroundImageAlt || 'Solutions background'}
          />
          {/* SIN OVERLAY - imagen pura HD */}
        </>
      )}

      {/* Section Header - Conectado con estilos del CMS */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div
          className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 theme-transition"
          style={{
            lineHeight: '1.2',
            color: getSafeStyle(
              solutionsData.styles?.[theme]?.titleColor,
              theme === 'light' ? '#333333' : '#FFFFFF'
            ),
            fontWeight: '700'
          }}
        >
          {cleanHtmlToText(mappedData.title)}
        </div>
        <div className="max-w-3xl mx-auto">
          <div
            className="theme-transition"
            style={{
              color: getSafeStyle(
                solutionsData.styles?.[theme]?.descriptionColor,
                theme === 'light' ? '#7528ee' : '#D1D5DB'
              ),
              fontWeight: '400',
              lineHeight: '1.6',
              // 🎯 Permitir que los tamaños de letra del RichTextEditor se apliquen
              fontSize: 'inherit' // Hereda el tamaño del contenido HTML
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mappedData.subtitle || '') }}
          />
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-wrap gap-8 w-full ${getCardsAlignmentClasses()}`}>
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group relative rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden solutions-card flex-shrink-0"
              style={{
                animationDelay: `${index * 100}ms`,
                '--solutions-card-bg': cardStyles.background,
                background: cardStyles.background,
                // SIN backdrop-filter para máxima nitidez
                boxShadow: cardStyles.shadow,
                width: `min(${getSafeStyle(cardStyles.cardMinWidth, '320px')}, 100%)`, // 🛡️ CSS robusto
                maxWidth: getSafeStyle(cardStyles.cardMaxWidth, '100%'), // 🛡️ CSS robusto
                minHeight: getSafeStyle(cardStyles.cardMinHeight, 'auto'), // 🛡️ CSS robusto
                padding: getSafeStyle(cardStyles.cardPadding, '2rem'), // 🛡️ CSS robusto
                transition: 'all 0.3s ease'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.background = cardStyles.hoverBackground ?? 'rgba(255, 255, 255, 0.95)';
                card.style.boxShadow = cardStyles.hoverShadow ?? '0 20px 60px rgba(0, 0, 0, 0.12)';
                const borderEl = card.querySelector('.card-border') as HTMLElement;
                if (borderEl) {
                  borderEl.style.background = cardStyles.hoverBorder ?? cardStyles.border ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.background = cardStyles.background ?? 'rgba(255, 255, 255, 0.8)';
                card.style.boxShadow = cardStyles.shadow ?? '0 8px 32px rgba(0, 0, 0, 0.1)';
                const borderEl = card.querySelector('.card-border') as HTMLElement;
                if (borderEl) {
                  borderEl.style.background = cardStyles.border ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
              }}
            >
              {/* Borde con soporte para degradados */}
              <div 
                className="card-border absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
                style={{
                  background: cardStyles.border,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: cardStyles.borderWidth
                }}
              />
              
              {/* Icon - Condicional con/sin borde y por tema */}
              {(() => {
                const currentIcon = getCurrentIcon(solution);
                
                // Renderizar contenido del icono basado en el tipo
                const renderIconContent = () => {
                  switch (currentIcon.type) {
                    case 'dynamic':
                      return (
                        <DynamicIcon 
                          name={currentIcon.value as string} 
                          size={32} 
                          color={currentIcon.color || cardStyles.iconColor || '#8B5CF6'}
                          strokeWidth={2}
                        />
                      );
                    case 'image':
                      return (
                        <img 
                          src={currentIcon.value as string} 
                          alt={solution.title} 
                          className="w-12 h-12 object-contain"
                        />
                      );
                    case 'emoji':
                      return (
                        <span 
                          className="text-3xl leading-none flex items-center justify-center"
                          style={{ 
                            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                            textRendering: 'optimizeLegibility'
                          }}
                        >
                          {currentIcon.value as string}
                        </span>
                      );
                    case 'component':
                      return currentIcon.value as React.ReactNode;
                    default:
                      return <span className="text-3xl">📄</span>; // Fallback icon
                  }
                };

                // Obtener clases de alineación
                const getAlignmentClasses = () => {
                  const alignment = cardStyles.iconAlignment || 'left';
                  switch (alignment) {
                    case 'center':
                      return 'mx-auto';
                    case 'right':
                      return 'ml-auto';
                    case 'left':
                    default:
                      return 'mr-auto';
                  }
                };

                // Renderizar con o sin borde
                return cardStyles.iconBorderEnabled === true ? (
                  // Con borde gradiente
                  <div className={`relative mb-6 w-16 h-16 rounded-xl p-0.5 ${getAlignmentClasses()}`}
                       style={{
                         background: cardStyles.iconGradient
                       }}>
                    <div
                      className="w-full h-full rounded-xl flex items-center justify-center"
                      style={{
                        background: cardStyles.iconBackground,
                        // Solo aplicar color si no es emoji
                        color: currentIcon.type === 'emoji' ? 'inherit' : cardStyles.iconColor
                      }}
                    >
                      {renderIconContent()}
                    </div>
                  </div>
                ) : (
                  // Sin borde - icono directo
                  <div className={`relative mb-6 w-16 h-16 flex items-center justify-center ${getAlignmentClasses()}`}
                       style={{
                         // Solo aplicar color si no es emoji
                         color: currentIcon.type === 'emoji' ? 'inherit' : cardStyles.iconColor
                       }}>
                    {renderIconContent()}
                  </div>
                );
              })()}

              {/* Content */}
              <div className="relative">
                <div
                  className="text-2xl font-bold mb-4 transition-colors text-center"
                  style={{
                    color: getSafeStyle(
                      solution.styles?.[theme]?.titleColor,
                      cardStyles.titleColor ?? '#1f2937'
                    ),
                    fontSize: 'inherit' // Permitir tamaños del RichTextEditor
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solution.title) }}
                />
                <div
                  className="leading-relaxed transition-colors text-center"
                  style={{
                    color: getSafeStyle(
                      solution.styles?.[theme]?.descriptionColor,
                      cardStyles.descriptionColor ?? '#6b7280'
                    ),
                    fontSize: 'inherit' // Permitir tamaños del RichTextEditor
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solution.description) }}
                />
              </div>

              {/* Arrow Indicator - Configurable desde CMS */}
              {solution.showButton !== false && (
                <Link
                  to={solution.buttonLink || '/servicios'}
                  className="relative mt-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  style={{ color: cardStyles.linkColor }}
                >
                  <span className="text-sm font-medium mr-2">{solution.buttonText || 'Conocer más'}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Botón "Ver más..." según maqueta */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
          <Link
            to="/servicios"
            role="button"
            aria-label="Ver más servicios - Ir a la página de servicios"
            className="group relative inline-block px-8 py-3 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
            style={{
              background: viewMoreButtonStyles.background,
              color: viewMoreButtonStyles.textColor,
              border: viewMoreButtonStyles.borderColor !== 'transparent' 
                ? `1px solid ${viewMoreButtonStyles.borderColor}` 
                : 'none',
              fontWeight: '600',
              fontSize: '0.875rem',
              boxShadow: '0 4px 15px rgba(117, 40, 238, 0.3)'
            }}
          >
            <span className="relative flex items-center space-x-2">
              <span>{viewMoreButtonStyles.text || 'Ver más...'}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
      

    </section>
  );
};

export default SolutionsSection;
