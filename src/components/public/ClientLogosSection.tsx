import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import type { 
  ClientLogosContent, 
  ClientLogo, 
  ClientLogosDesignStyles
} from '../../types/cms';

interface ClientLogosSectionProps {
  data?: ClientLogosContent;
}

const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({ data }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Obtener configuración de logos desde CMS
  const getLogosStyles = (): ClientLogosDesignStyles => {
    const defaultStyles: ClientLogosDesignStyles = {
      logoMaxWidth: '120px',
      logoMaxHeight: '80px',
      logoOpacity: theme === 'light' ? '0.7' : '0.8',
      logoHoverOpacity: '1',
      logoFilter: theme === 'light' ? 'grayscale(0%)' : 'brightness(0) invert(1)',
      logoHoverFilter: theme === 'light' ? 'grayscale(0%)' : 'brightness(0) invert(1)',
      logoBackground: 'transparent',
      logoPadding: '1rem',
      logosBorderRadius: '0.5rem',
      logosGap: '2rem',
      logosPerRow: 4,
      logosAlignment: 'center',
      floatAnimation: true,
      floatIntensity: 'normal',
      mouseTracking: true,
      mouseIntensity: 'normal',
      hoverScale: 1.15,
      hoverRotation: true,
      carouselEnabled: true,
      carouselSpeed: 3000,
      logosToShowDesktop: 6,
      logosToShowTablet: 4,
      logosToShowMobile: 3
    };

    if (data?.logosDesign && data.logosDesign[theme]) {
      return { ...defaultStyles, ...data.logosDesign[theme] };
    }
    return defaultStyles;
  };

  const logosStyles = getLogosStyles();

  // ✨ Animación de fade-in al cargar
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Si no hay datos o la sección está marcada como no visible, no renderizar
  if (!data || data.visible === false) {
    return null;
  }

  // Si no hay logos, no renderizar
  if (!data.logos || data.logos.length === 0) {
    return null;
  }

  // Obtener estilos de texto con validación de valores vacíos
  const getTextStyles = () => {
    const defaultStyles = {
      titleColor: theme === 'light' ? '#1F2937' : '#FFFFFF',
      descriptionColor: theme === 'light' ? '#4B5563' : '#D1D5DB'
    };

    // Si no hay estilos del CMS, usar defaults
    if (!data.styles || !data.styles[theme]) {
      return defaultStyles;
    }

    const cmsStyles = data.styles[theme];

    // Validar que los colores no estén vacíos, si lo están usar defaults
    return {
      titleColor: cmsStyles.titleColor && cmsStyles.titleColor.trim() !== ''
        ? cmsStyles.titleColor
        : defaultStyles.titleColor,
      descriptionColor: cmsStyles.descriptionColor && cmsStyles.descriptionColor.trim() !== ''
        ? cmsStyles.descriptionColor
        : defaultStyles.descriptionColor
    };
  };

  // Obtener imagen de fondo (ahora es una sola imagen)
  const getBackgroundImage = () => {
    return data.backgroundImage || null;
  };

  const textStyles = getTextStyles();
  const backgroundImage = getBackgroundImage();

  // ✨ Configuración de hover sutil y profesional
  const hoverScale = logosStyles?.hoverScale ?? 1.1; // Reducido de 1.15 a 1.1 para ser más sutil

  // Estilos para cada logo - SIN contenedor de tarjeta
  const logoContainerStyles = {
    maxWidth: logosStyles.logoMaxWidth,
    height: data.logosHeight || '60px',
    opacity: logosStyles.logoOpacity,
    filter: logosStyles.logoFilter,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Transición suave
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Estilos para hover - Solo crecer, sin levantarse
  const logoHoverStyles = {
    opacity: logosStyles.logoHoverOpacity,
    filter: logosStyles.logoHoverFilter,
    transform: `scale(${hoverScale})` // Solo escala, sin translateY
  };

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden w-full"
      style={{ 
        background: 'transparent', // Sin fondo
        border: 'none', // Sin borde
        boxShadow: 'none', // Sin sombra
        padding: '0', // Sin padding en la sección
        margin: '0',
        paddingTop: data.sectionPaddingY || '4rem',
        paddingBottom: data.sectionPaddingY || '4rem',
        minHeight: data.sectionHeight || 'auto'
      }}
    >
      {/* Imagen de fondo si existe - aplicada directamente a la sección */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt={data.backgroundImageAlt || 'Client logos background'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Título y descripción - Solo se muestran si showText es true */}
          {(data.showText === undefined || data.showText === true) && (
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                style={{ color: textStyles.titleColor }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.title || 'Nuestros clientes')
                }}
              />
              {data.description && (
                <p
                  className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                  style={{ color: textStyles.descriptionColor }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.description)
                  }}
                />
              )}
            </div>
          )}

          {/* ✨ Grid de logos responsive - Adaptable por pantalla */}
          <div
            className={`
              grid gap-6 sm:gap-8 lg:gap-10
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              transition-all duration-700
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {data.logos
              .sort((a: ClientLogo, b: ClientLogo) => (a.order || 0) - (b.order || 0))
              .map((logo: ClientLogo, index: number) => {
                const LogoComponent = ({ children }: { children: React.ReactNode }) => {
                  if (logo.link) {
                    return (
                      <a
                        href={logo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group cursor-pointer"
                        title={logo.name}
                      >
                        {children}
                      </a>
                    );
                  }
                  return <div className="block group">{children}</div>;
                };

                return (
                  <div
                    key={`client-logo-${index}-${logo.name || 'logo'}`}
                    className={`transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transitionDelay: `${index * 0.05}s` // Más rápido para grid
                    }}
                  >
                    <LogoComponent>
                      <img
                        src={logo.imageUrl}
                        alt={logo.alt || logo.name}
                        className="transition-all duration-300 ease-out w-full h-auto"
                        style={{
                          maxWidth: logosStyles.logoMaxWidth || '120px',
                          height: data.logosHeight || 'auto',
                          opacity: logoContainerStyles.opacity,
                          filter: logoContainerStyles.filter,
                          objectFit: 'contain'
                        }}
                        onMouseEnter={(e) => {
                          // ✨ Hover sutil y profesional
                          e.currentTarget.style.opacity = logoHoverStyles.opacity;
                          e.currentTarget.style.filter = logoHoverStyles.filter;
                          e.currentTarget.style.transform = `scale(${hoverScale})`;
                          e.currentTarget.style.transition = 'all 0.3s ease-out';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = logoContainerStyles.opacity as string;
                          e.currentTarget.style.filter = logoContainerStyles.filter as string;
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.transition = 'all 0.3s ease-out';
                        }}
                        loading="lazy"
                      />
                    </LogoComponent>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ✅ Animaciones CSS removidas - Ahora usa solo transiciones CSS inline para mejor rendimiento

export default ClientLogosSection;