/**
 * 📢 BlogCtaSection Component
 * Sección de Call to Action (Último Llamado) para la página del blog
 * Configurable desde el CMS
 * 
 * ✨ Features:
 * - Animaciones de entrada con Intersection Observer
 * - Diseño responsive optimizado
 * - Efectos hover suaves
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BlogCtaConfig } from '../../../hooks/blog/useBlogCmsConfig';
import { DEFAULT_BLOG_CTA_CONFIG } from '../../../hooks/blog/useBlogCmsConfig';

interface BlogCtaSectionProps {
  config?: BlogCtaConfig;
}

// Custom hook para detectar cuando el elemento entra en el viewport
const useInView = (options = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Dejar de observar una vez que está visible
        observer.unobserve(element);
      }
    }, { threshold: 0.1, ...options });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};

export const BlogCtaSection: React.FC<BlogCtaSectionProps> = ({ config }) => {
  // Merge with defaults
  const ctaConfig = {
    ...DEFAULT_BLOG_CTA_CONFIG,
    ...config
  };

  // Si la sección está oculta, no renderizar
  if (ctaConfig.showSection === false) {
    return null;
  }

  // Construir el fondo según el tipo
  const getBackgroundStyle = () => {
    if (ctaConfig.bgType === 'image' && ctaConfig.bgImage) {
      return {
        backgroundImage: `url(${ctaConfig.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (ctaConfig.bgType === 'gradient') {
      const direction = 
        ctaConfig.bgGradientDirection === 'to-r' ? 'to right' :
        ctaConfig.bgGradientDirection === 'to-l' ? 'to left' :
        ctaConfig.bgGradientDirection === 'to-t' ? 'to top' :
        ctaConfig.bgGradientDirection === 'to-b' ? 'to bottom' :
        ctaConfig.bgGradientDirection === 'to-tr' ? 'to top right' :
        ctaConfig.bgGradientDirection === 'to-tl' ? 'to top left' :
        ctaConfig.bgGradientDirection === 'to-br' ? 'to bottom right' :
        'to bottom left';
      
      return {
        background: `linear-gradient(${direction}, ${ctaConfig.bgGradientFrom}, ${ctaConfig.bgGradientTo})`
      };
    }
    
    return {
      backgroundColor: ctaConfig.bgColorDark
    };
  };

  // Construir el fondo de la tarjeta
  const getCardBackgroundStyle = (): React.CSSProperties => {
    // Si es transparente
    if (ctaConfig.cardBgTransparent) {
      return {
        backgroundColor: 'transparent'
      };
    }
    
    // Si usa gradiente
    if (ctaConfig.cardBgUseGradient) {
      const direction = 
        ctaConfig.cardBgGradientDirection === 'to-r' ? 'to right' :
        ctaConfig.cardBgGradientDirection === 'to-l' ? 'to left' :
        ctaConfig.cardBgGradientDirection === 'to-t' ? 'to top' :
        ctaConfig.cardBgGradientDirection === 'to-b' ? 'to bottom' :
        ctaConfig.cardBgGradientDirection === 'to-tr' ? 'to top right' :
        ctaConfig.cardBgGradientDirection === 'to-tl' ? 'to top left' :
        ctaConfig.cardBgGradientDirection === 'to-br' ? 'to bottom right' :
        'to bottom left';
      
      return {
        background: `linear-gradient(${direction}, ${ctaConfig.cardBgGradientFrom || '#0d9488'}, ${ctaConfig.cardBgGradientTo || '#1e3a5f'})`
      };
    }
    
    // Color sólido
    return {
      backgroundColor: ctaConfig.cardBgColor || '#1e3a5f'
    };
  };

  // Renderizar el patrón decorativo
  const renderPattern = () => {
    if (!ctaConfig.showPattern || ctaConfig.patternType === 'none') return null;

    const patternStyle = {
      opacity: ctaConfig.patternOpacity || 0.1
    };

    if (ctaConfig.patternType === 'dots') {
      return (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            ...patternStyle,
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
      );
    }

    if (ctaConfig.patternType === 'grid') {
      return (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            ...patternStyle,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      );
    }

    if (ctaConfig.patternType === 'waves') {
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={patternStyle}
          preserveAspectRatio="none"
        >
          <pattern id="wave-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M0 10 Q 25 0, 50 10 T 100 10" 
              fill="none" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      );
    }

    return null;
  };

  // Renderizar el título con resaltado
  const renderTitle = () => {
    const { title, titleHighlight, titleColor, titleHighlightUseGradient, titleHighlightGradientFrom, titleHighlightGradientTo, titleHighlightGradientDirection, titleHighlightColor } = ctaConfig;
    
    if (!titleHighlight || !title?.includes(titleHighlight)) {
      return (
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
          style={{ 
            color: titleColor,
            fontFamily: `'${ctaConfig.fontFamily}', sans-serif`
          }}
        >
          {title}
        </h2>
      );
    }

    const parts = title.split(titleHighlight);
    const direction = 
      titleHighlightGradientDirection === 'to-r' ? 'to right' :
      titleHighlightGradientDirection === 'to-l' ? 'to left' :
      titleHighlightGradientDirection === 'to-t' ? 'to top' :
      titleHighlightGradientDirection === 'to-b' ? 'to bottom' :
      titleHighlightGradientDirection === 'to-tr' ? 'to top right' :
      'to bottom right';

    return (
      <h2 
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
        style={{ 
          color: titleColor,
          fontFamily: `'${ctaConfig.fontFamily}', sans-serif`
        }}
      >
        {parts[0]}
        {titleHighlightUseGradient ? (
          <span
            style={{
              background: `linear-gradient(${direction}, ${titleHighlightGradientFrom}, ${titleHighlightGradientTo})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {titleHighlight}
          </span>
        ) : (
          <span style={{ color: titleHighlightColor }}>
            {titleHighlight}
          </span>
        )}
        {parts[1]}
      </h2>
    );
  };

  // Estilo del botón principal
  const getPrimaryButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      color: ctaConfig.buttonTextColor,
      borderRadius: ctaConfig.buttonBorderRadius
    };

    // Fondo
    if (ctaConfig.buttonBgTransparent) {
      baseStyle.backgroundColor = 'transparent';
    } else if (ctaConfig.buttonUseGradient) {
      const direction = 
        ctaConfig.buttonGradientDirection === 'to-r' ? 'to right' :
        ctaConfig.buttonGradientDirection === 'to-l' ? 'to left' :
        ctaConfig.buttonGradientDirection === 'to-t' ? 'to top' :
        ctaConfig.buttonGradientDirection === 'to-b' ? 'to bottom' :
        ctaConfig.buttonGradientDirection === 'to-tr' ? 'to top right' :
        'to bottom right';
      baseStyle.background = `linear-gradient(${direction}, ${ctaConfig.buttonGradientFrom}, ${ctaConfig.buttonGradientTo})`;
    } else {
      baseStyle.backgroundColor = ctaConfig.buttonBgColor;
    }

    // Borde (si no usa gradiente en borde)
    if (!ctaConfig.buttonBorderUseGradient && ctaConfig.buttonBorderColor) {
      baseStyle.border = `${ctaConfig.buttonBorderWidth || 2}px solid ${ctaConfig.buttonBorderColor}`;
    }

    return baseStyle;
  };

  // Renderizar botón principal (con o sin borde gradiente)
  const renderPrimaryButton = () => {
    const buttonContent = (
      <>
        {ctaConfig.buttonText}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </>
    );

    // Si usa borde con gradiente, necesitamos el wrapper
    if (ctaConfig.buttonBorderUseGradient && (ctaConfig.buttonBgTransparent || !ctaConfig.buttonUseGradient)) {
      const direction = 
        ctaConfig.buttonBorderGradientDirection === 'to-r' ? 'to right' :
        ctaConfig.buttonBorderGradientDirection === 'to-l' ? 'to left' :
        ctaConfig.buttonBorderGradientDirection === 'to-t' ? 'to top' :
        ctaConfig.buttonBorderGradientDirection === 'to-b' ? 'to bottom' :
        ctaConfig.buttonBorderGradientDirection === 'to-tr' ? 'to top right' :
        'to bottom right';

      return (
        <div 
          className="inline-block w-full sm:w-auto rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          style={{
            background: `linear-gradient(${direction}, ${ctaConfig.buttonBorderGradientFrom || '#8b5cf6'}, ${ctaConfig.buttonBorderGradientTo || '#06b6d4'})`,
            padding: `${ctaConfig.buttonBorderWidth || 2}px`,
            borderRadius: ctaConfig.buttonBorderRadius
          }}
        >
          <Link
            to={ctaConfig.buttonLink || '/contacto'}
            className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg w-full sm:w-auto"
            style={{
              // Para borde gradiente con fondo transparente, usar el color de fondo de la sección
              // para que el efecto de borde gradiente sea visible
              backgroundColor: ctaConfig.buttonBgTransparent 
                ? (ctaConfig.bgType === 'gradient' 
                    ? ctaConfig.bgGradientFrom // Usar el color inicial del gradiente
                    : (ctaConfig.bgColorDark || '#1e1b4b')) // O el color de fondo oscuro
                : (ctaConfig.buttonBgColor || '#8b5cf6'),
              color: ctaConfig.buttonTextColor,
              borderRadius: ctaConfig.buttonBorderRadius,
              display: 'flex'
            }}
          >
            {buttonContent}
          </Link>
        </div>
      );
    }

    // Botón normal sin borde gradiente
    return (
      <Link
        to={ctaConfig.buttonLink || '/contacto'}
        className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg w-full sm:w-auto transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        style={getPrimaryButtonStyle()}
      >
        {buttonContent}
      </Link>
    );
  };

  // Renderizar botón secundario (con o sin borde gradiente)
  const renderSecondaryButton = () => {
    if (!ctaConfig.showSecondaryButton) return null;

    const buttonContent = ctaConfig.secondaryButtonText;

    // Si usa borde con gradiente
    if (ctaConfig.secondaryButtonBorderUseGradient) {
      const direction = 
        ctaConfig.secondaryButtonBorderGradientDirection === 'to-r' ? 'to right' :
        ctaConfig.secondaryButtonBorderGradientDirection === 'to-l' ? 'to left' :
        ctaConfig.secondaryButtonBorderGradientDirection === 'to-t' ? 'to top' :
        ctaConfig.secondaryButtonBorderGradientDirection === 'to-b' ? 'to bottom' :
        ctaConfig.secondaryButtonBorderGradientDirection === 'to-tr' ? 'to top right' :
        'to bottom right';

      return (
        <div 
          className="inline-block w-full sm:w-auto rounded-full transition-all duration-300 hover:bg-white/10"
          style={{
            background: `linear-gradient(${direction}, ${ctaConfig.secondaryButtonBorderGradientFrom || '#8b5cf6'}, ${ctaConfig.secondaryButtonBorderGradientTo || '#06b6d4'})`,
            padding: `${ctaConfig.secondaryButtonBorderWidth || 2}px`,
            borderRadius: ctaConfig.secondaryButtonBorderRadius
          }}
        >
          <Link
            to={ctaConfig.secondaryButtonLink || '/servicios'}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg w-full sm:w-auto"
            style={{
              // Para borde gradiente, usar el color de fondo de la sección
              backgroundColor: ctaConfig.bgType === 'gradient' 
                ? ctaConfig.bgGradientFrom 
                : (ctaConfig.bgColorDark || '#1e1b4b'),
              color: ctaConfig.secondaryButtonTextColor,
              borderRadius: ctaConfig.secondaryButtonBorderRadius,
              display: 'flex'
            }}
          >
            {buttonContent}
          </Link>
        </div>
      );
    }

    // Botón secundario normal
    return (
      <Link
        to={ctaConfig.secondaryButtonLink || '/servicios'}
        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg w-full sm:w-auto transition-all duration-300 hover:bg-white/10"
        style={{
          backgroundColor: ctaConfig.secondaryButtonBgColor || 'transparent',
          color: ctaConfig.secondaryButtonTextColor,
          border: `${ctaConfig.secondaryButtonBorderWidth || 2}px solid ${ctaConfig.secondaryButtonBorderColor}`,
          borderRadius: ctaConfig.secondaryButtonBorderRadius
        }}
      >
        {buttonContent}
      </Link>
    );
  };

  // Hook para animaciones de entrada
  const { ref: sectionRef, isInView } = useInView();

  // Estilos de animación CSS
  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes floatBubble {
      0%, 100% {
        transform: translateY(0) scale(1);
      }
      50% {
        transform: translateY(-10px) scale(1.05);
      }
    }

    .cta-animate-fadeInUp {
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .cta-animate-fadeInScale {
      animation: fadeInScale 0.6s ease-out forwards;
    }

    .cta-animate-slideInLeft {
      animation: slideInLeft 0.7s ease-out forwards;
    }

    .cta-animate-slideInRight {
      animation: slideInRight 0.7s ease-out forwards;
    }

    .cta-animate-delay-1 {
      animation-delay: 0.1s;
    }

    .cta-animate-delay-2 {
      animation-delay: 0.2s;
    }

    .cta-animate-delay-3 {
      animation-delay: 0.3s;
    }

    .cta-animate-delay-4 {
      animation-delay: 0.4s;
    }

    .cta-animate-float {
      animation: floatBubble 3s ease-in-out infinite;
    }

    .cta-animate-float-delayed {
      animation: floatBubble 4s ease-in-out infinite 1s;
    }

    .cta-hidden {
      opacity: 0;
    }

    /* Hover effects mejorados */
    .cta-button-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cta-button-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 40px -10px rgba(139, 92, 246, 0.5);
    }

    .cta-card-hover {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cta-card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.3);
    }
  `;

  // Contenido del CTA (título, subtítulo, botones) - reutilizable
  const renderCtaContent = (withAnimation = true) => (
    <>
      {/* Título con animación */}
      <div className={withAnimation && isInView ? 'cta-animate-fadeInUp cta-animate-delay-1' : withAnimation ? 'cta-hidden' : ''}>
        {renderTitle()}
      </div>

      {/* Subtítulo con animación */}
      <p 
        className={`text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-xl md:max-w-2xl mx-auto px-2 leading-relaxed ${
          withAnimation && isInView ? 'cta-animate-fadeInUp cta-animate-delay-2' : withAnimation ? 'cta-hidden' : ''
        }`}
        style={{ 
          color: ctaConfig.subtitleColor,
          fontFamily: `'${ctaConfig.fontFamily}', sans-serif`
        }}
      >
        {ctaConfig.subtitle}
      </p>

      {/* Botones con animación y diseño responsive mejorado */}
      <div 
        className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0 ${
          withAnimation && isInView ? 'cta-animate-fadeInUp cta-animate-delay-3' : withAnimation ? 'cta-hidden' : ''
        }`}
      >
        <div className="w-full sm:w-auto cta-button-hover">
          {renderPrimaryButton()}
        </div>
        {ctaConfig.showSecondaryButton && (
          <div className="w-full sm:w-auto cta-button-hover">
            {renderSecondaryButton()}
          </div>
        )}
      </div>
    </>
  );

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Estilos de animación inyectados */}
      <style>{animationStyles}</style>
      {/* Overlay para imagen de fondo */}
      {ctaConfig.bgType === 'image' && ctaConfig.bgImage && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: ctaConfig.bgOverlay }}
        />
      )}

      {/* Patrón decorativo */}
      {renderPattern()}

      {/* Decoraciones geométricas con animaciones */}
      {ctaConfig.showDecorations && (
        <>
          {/* Círculo grande difuminado - izquierda (solo visible en pantallas medianas+) */}
          <div 
            className={`absolute -left-20 md:-left-10 lg:-left-20 top-1/2 -translate-y-1/2 w-40 md:w-60 lg:w-80 h-40 md:h-60 lg:h-80 rounded-full blur-3xl ${
              isInView ? 'cta-animate-slideInLeft' : 'cta-hidden'
            }`}
            style={{ backgroundColor: ctaConfig.decorationColor }}
          />
          {/* Círculo grande difuminado - derecha (solo visible en pantallas medianas+) */}
          <div 
            className={`absolute -right-20 md:-right-10 lg:-right-20 top-1/2 -translate-y-1/2 w-40 md:w-60 lg:w-80 h-40 md:h-60 lg:h-80 rounded-full blur-3xl ${
              isInView ? 'cta-animate-slideInRight' : 'cta-hidden'
            }`}
            style={{ backgroundColor: ctaConfig.decorationColor }}
          />
          {/* Pequeños círculos decorativos con animación flotante - ocultos en móvil */}
          <div 
            className={`hidden sm:block absolute top-10 left-1/4 w-3 md:w-4 h-3 md:h-4 rounded-full cta-animate-float ${
              isInView ? 'cta-animate-fadeInScale cta-animate-delay-2' : 'cta-hidden'
            }`}
            style={{ backgroundColor: ctaConfig.decorationColor }}
          />
          <div 
            className={`hidden sm:block absolute bottom-10 right-1/4 w-4 md:w-6 h-4 md:h-6 rounded-full cta-animate-float-delayed ${
              isInView ? 'cta-animate-fadeInScale cta-animate-delay-3' : 'cta-hidden'
            }`}
            style={{ backgroundColor: ctaConfig.decorationColor }}
          />
          <div 
            className={`hidden md:block absolute top-1/3 right-10 w-2 md:w-3 h-2 md:h-3 rounded-full cta-animate-float ${
              isInView ? 'cta-animate-fadeInScale cta-animate-delay-4' : 'cta-hidden'
            }`}
            style={{ backgroundColor: ctaConfig.decorationColor }}
          />
        </>
      )}

      {/* Contenido con animación de entrada */}
      <div 
        className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center ${
          isInView ? 'cta-animate-fadeInScale' : 'cta-hidden'
        }`}
      >
        {/* Tarjeta contenedora (opcional) */}
        {ctaConfig.showCard ? (
          ctaConfig.cardBorderUseGradient ? (
            // Tarjeta con borde gradiente
            <div
              className="inline-block w-full cta-card-hover"
              style={{
                background: `linear-gradient(${
                  ctaConfig.cardBorderGradientDirection === 'to-r' ? 'to right' :
                  ctaConfig.cardBorderGradientDirection === 'to-l' ? 'to left' :
                  ctaConfig.cardBorderGradientDirection === 'to-t' ? 'to top' :
                  ctaConfig.cardBorderGradientDirection === 'to-b' ? 'to bottom' :
                  ctaConfig.cardBorderGradientDirection === 'to-tr' ? 'to top right' :
                  'to bottom right'
                }, ${ctaConfig.cardBorderGradientFrom || '#8b5cf6'}, ${ctaConfig.cardBorderGradientTo || '#06b6d4'})`,
                padding: `${ctaConfig.cardBorderWidth || 1}px`,
                borderRadius: ctaConfig.cardBorderRadius || '24px',
                maxWidth: ctaConfig.cardMaxWidth || '800px'
              }}
            >
              <div
                className="text-center p-6 sm:p-8 md:p-10 lg:p-12"
                style={{
                  ...getCardBackgroundStyle(),
                  backdropFilter: ctaConfig.cardBgBlur ? 'blur(16px)' : 'none',
                  WebkitBackdropFilter: ctaConfig.cardBgBlur ? 'blur(16px)' : 'none',
                  borderRadius: `calc(${ctaConfig.cardBorderRadius || '24px'} - ${ctaConfig.cardBorderWidth || 1}px)`
                }}
              >
                {renderCtaContent()}
              </div>
            </div>
          ) : (
            // Tarjeta con borde sólido
            <div
              className="text-center w-full p-6 sm:p-8 md:p-10 lg:p-12 cta-card-hover"
              style={{
                ...getCardBackgroundStyle(),
                backdropFilter: ctaConfig.cardBgBlur ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: ctaConfig.cardBgBlur ? 'blur(16px)' : 'none',
                borderRadius: ctaConfig.cardBorderRadius || '24px',
                border: `${ctaConfig.cardBorderWidth || 1}px solid ${ctaConfig.cardBorderColor || 'rgba(255, 255, 255, 0.1)'}`,
                maxWidth: ctaConfig.cardMaxWidth || '800px'
              }}
            >
              {renderCtaContent()}
            </div>
          )
        ) : (
          // Sin tarjeta - contenido directo
          <div className="text-center w-full max-w-3xl mx-auto">
            {renderCtaContent()}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogCtaSection;
