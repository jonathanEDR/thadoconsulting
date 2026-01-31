import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect, memo } from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
  animated?: boolean;
  compact?: boolean;
  variant?: 'auto' | 'white' | 'dark';
}

const Logo = ({ 
  size = 'md', 
  withText = false, 
  className = '', 
  animated = true,
  compact = false,
  variant = 'auto'
}: LogoProps) => {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoKey, setLogoKey] = useState(0); // Force re-render when theme changes

  // Detectar scroll para efectos
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (animated) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [animated]);

  // Force re-render cuando cambie el tema
  useEffect(() => {
    setLogoKey(prev => prev + 1);
  }, [theme]);

  // Tamaños del logo según el prop size
  const sizeClasses = {
    xs: 'h-6 sm:h-8',
    sm: 'h-8 sm:h-10',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-16',
    xl: 'h-16 sm:h-20'
  };


  // Seleccionar logo según el tema o variant
  const logoSrc = (() => {
    switch (variant) {
      case 'white':
        return '/LOGO_PARA_FONDO_OSCURO.svg';  // Logo para fondos oscuros (texto claro)
      case 'dark':
        return '/LOGO_PARA_FONDO_BLANCO.svg';  // Logo para fondos claros (texto oscuro)
      case 'auto':
      default:
        // Tema claro (light) → Logo con texto oscuro para contraste
        // Tema oscuro (dark) → Logo con texto claro para contraste
        return theme === 'light' 
          ? '/LOGO_PARA_FONDO_BLANCO.svg'  // Logo para tema claro
          : '/LOGO_PARA_FONDO_OSCURO.svg';  // Logo para tema oscuro
    }
  })();

  // Agregar cache-busting para asegurar que se cargue el logo correcto
  const logoSrcWithCache = `${logoSrc}?t=${logoKey}`;

  return (
    <div className={`flex items-center ${withText ? 'space-x-3' : ''} ${className}`}>
      {/* Logo SVG */}
      <div className="relative group">
        <img 
          key={logoKey} // Force re-render on theme change
          src={logoSrcWithCache}
          alt="THADO Consulting - Servicios Contables y Tributarios"
          className={`
            w-auto 
            ${compact && isScrolled ? sizeClasses.sm : sizeClasses[size]}
            transition-all 
            duration-300 
            ease-in-out
            ${animated ? 'logo-animated' : ''}
          `}
          loading="eager"
          style={{
            filter: animated ? 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        
        {/* Efecto de brillo al hacer hover */}
        {animated && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               style={{
                 background: `radial-gradient(circle, ${
                   theme === 'dark' 
                     ? 'rgba(167, 139, 250, 0.2)' 
                     : 'rgba(139, 92, 246, 0.2)'
                 } 0%, transparent 70%)`,
                 filter: 'blur(10px)'
               }}>
          </div>
        )}
      </div>

    </div>
  );
};

export default memo(Logo);
