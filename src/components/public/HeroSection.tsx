import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_HERO_CONFIG } from '../../utils/defaultConfig';
import '../../styles/gradient-borders.css';

interface HeroData {
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

interface HeroSectionProps {
  data?: HeroData;
}

const HeroSection = ({ data }: HeroSectionProps) => {
  // Estados para animaciones progresivas
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const { theme: currentTheme } = useTheme();

  // Usar datos proporcionados o configuración predeterminada como fallback
  const rawHeroData: HeroData = data || DEFAULT_HERO_CONFIG;
  
  // Validar y corregir ctaLink para asegurar navegación correcta
  const heroData: HeroData = {
    ...rawHeroData,
    ctaLink: rawHeroData.ctaLink?.startsWith('#') ? '/servicios' : (rawHeroData.ctaLink || '/servicios')
  };

  // Obtener la imagen correcta según el tema activo
  const getCurrentBackgroundImage = () => {
    const backgroundImageData = heroData.backgroundImage;
    
    if (!backgroundImageData) return null;
    
    // Si es un string (formato anterior), usarlo como fallback
    if (typeof backgroundImageData === 'string') {
      return backgroundImageData;
    }
    
    // Usar imagen del tema activo, con fallback a la otra si no existe
    if (currentTheme === 'light') {
      return backgroundImageData.light || backgroundImageData.dark || null;
    } else {
      return backgroundImageData.dark || backgroundImageData.light || null;
    }
  };

  const currentBackgroundImage = getCurrentBackgroundImage();

  // Animación progresiva al cargar el componente
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const phases = [
      setTimeout(() => setAnimationPhase(1), 300),
      setTimeout(() => setAnimationPhase(2), 600),
      setTimeout(() => setAnimationPhase(3), 900),
    ];
    return () => {
      clearTimeout(timer);
      phases.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative overflow-hidden theme-transition"
             style={{
               backgroundColor: 'var(--color-background)',
               minHeight: '100vh',
               height: '100vh'
             }}>
      
      {/* Background Image (si existe) - CALIDAD HD SIN FILTROS */}
      {currentBackgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out z-0"
            style={{
              backgroundImage: `url(${currentBackgroundImage})`,
              opacity: 1  // 100% opacidad - calidad HD total
            }}
            role="img"
            aria-label={heroData.backgroundImageAlt || 'Hero background'}
          />
          {/* SIN OVERLAY - imagen pura HD */}
        </>
      )}

      {/* Animated Background Pattern - Solo si NO hay imagen */}
      {!currentBackgroundImage && (
        <div className="absolute inset-0 opacity-30 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, color-mix(in srgb, var(--color-primary) 40%, transparent) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'backgroundScroll 20s linear infinite'
          }}></div>
        </div>
      )}

      {/* Content - Distribución más alta como en maqueta */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center" 
           style={{ 
             paddingTop: '40vh', // Más arriba, menos centrado
             paddingBottom: '7vh', // Más espacio abajo
             minHeight: '100vh'
           }}>
        <div className={`space-y-3 sm:space-y-4 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Main Title - Colores optimizados según maqueta */}
          <div className="max-w-3xl mx-auto">
            <div
              className={`text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold theme-transition transition-all duration-1000 ${
                animationPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                lineHeight: '1.2',
                color: currentTheme === 'light' 
                  ? '#1F2937' // Gris oscuro elegante para tema claro (como en maqueta)
                  : '#FFFFFF', // Blanco para tema oscuro
                fontWeight: '700',
                textShadow: currentTheme === 'light' 
                  ? '1px 1px 2px rgba(0,0,0,0.1)' // Sombra muy sutil para tema claro
                  : '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' // Sombra más fuerte para tema oscuro
              }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(heroData.title) }}
            />
          </div>

          {/* Subtitle - Colores optimizados según maqueta */}
          <div className="max-w-2xl mx-auto space-y-2">
            <div
              className={`text-sm sm:text-sm md:text-base theme-transition transition-all duration-1000 delay-300 ${
                animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                lineHeight: '1.4',
                color: currentTheme === 'light' 
                  ? '#7528ee' // Color violeta para subtítulo en tema claro (más visible)
                  : '#D1D5DB', // Gris claro para tema oscuro
                fontWeight: '500',
                textShadow: currentTheme === 'light' 
                  ? '0.5px 0.5px 1px rgba(0,0,0,0.1)' // Sombra muy ligera para tema claro
                  : '1px 1px 3px rgba(0,0,0,0.7), 0 0 6px rgba(0,0,0,0.5)' // Sombra para tema oscuro
              }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(heroData.subtitle) }}
            />
            <div
              className={`hero-description text-xs sm:text-xs md:text-sm theme-transition transition-all duration-1000 delay-500 ${
                animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                lineHeight: '1.5',
                color: currentTheme === 'light' 
                  ? '#7528ee' // Gris medio más legible para descripción en tema claro
                  : '#9CA3AF', // Gris claro para tema oscuro
                fontWeight: '400',
                textShadow: currentTheme === 'light' 
                  ? 'none' // Sin sombra para texto de descripción en tema claro
                  : '1px 1px 2px rgba(0,0,0,0.6)' // Sombra sutil para tema oscuro
              }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(heroData.description) }}
            />
          </div>

          {/* CTA Buttons - Solo dos botones principales */}
          <div className="flex flex-row gap-3 justify-center items-center pt-4 sm:pt-5">
            {/* Botón principal de servicios */}
            <Link
              to={heroData.ctaLink}
              role="button"
              aria-label={`${heroData.ctaText} - Ir a la sección de servicios`}
              className={`group relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full overflow-hidden theme-transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300 ${
                animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                background: 'var(--color-cta-bg, linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%))',
                color: 'var(--color-cta-text, #FFFFFF)',
                border: '2px solid var(--color-cta-border, transparent)',
                fontWeight: '600',
                fontSize: '0.875rem',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              <span className="relative flex items-center space-x-2">
                <span>{heroData.ctaText}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center space-x-1.5 pt-3">
            <div className="w-1 h-1 rounded-full bg-purple-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator con accesibilidad */}
      <button 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 rounded-full p-2 transition-all duration-300 ${
          animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Desplazarse hacia abajo para ver más contenido"
      >
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* CSS for enhanced animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes backgroundScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        
        /* Smooth focus transitions */
        .focus-ring {
          transition: box-shadow 0.2s ease-in-out;
        }
        
        /* Improved button interactions */
        .button-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
