/**
 * 🔄 PageLoader - Componente de carga profesional
 * 
 * Muestra el logo de la empresa durante la carga de páginas
 * Se adapta automáticamente al tema global (claro/oscuro)
 * 
 * @author THADO Consulting
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface PageLoaderProps {
  /** Mensaje opcional a mostrar debajo del logo */
  message?: string;
  /** Tamaño del logo: 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar en pantalla completa (true) o dentro del contenedor padre (false) */
  fullScreen?: boolean;
  /** Mostrar el spinner animado alrededor del logo */
  showSpinner?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Cargando...',
  size = 'md',
  fullScreen = false,
  showSpinner = true
}) => {
  const { theme } = useTheme();
  
  // Detectar tema del sistema si no hay tema configurado
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemPrefersDark(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);
  
  // Siempre usar fondo oscuro para el loader fullScreen para mejor apariencia
  // y que el logo blanco sea siempre visible
  const isDark = fullScreen ? true : (theme === 'dark' || (!theme && systemPrefersDark));
  
  // Estado para manejar error de carga del logo
  const [logoError, setLogoError] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Configuración de tamaños
  const sizes = {
    sm: {
      logo: 'w-20 h-20',
      spinner: 'w-24 h-24',
      text: 'text-sm',
      container: 'py-8'
    },
    md: {
      logo: 'w-28 h-28',
      spinner: 'w-36 h-36',
      text: 'text-base',
      container: 'py-12'
    },
    lg: {
      logo: 'w-36 h-36',
      spinner: 'w-44 h-44',
      text: 'text-lg',
      container: 'py-16'
    }
  };

  const currentSize = sizes[size];

  // Logo según el tema - detectamos basándonos en el fondo del tema
  const logoSrc = isDark
    ? '/LOGO_PARA_FONDO_OSCURO.svg'
    : '/LOGO_PARA_FONDO_BLANCO.svg';

  const content = (
    <div className={`flex flex-col items-center justify-center ${currentSize.container}`}>
      {/* Contenedor del logo con spinner */}
      <div className="relative flex items-center justify-center">
        {/* Spinner animado - usa color primario del tema CMS */}
        {showSpinner && (
          <div 
            className={`absolute ${currentSize.spinner} animate-spin`}
            style={{
              border: '3px solid transparent',
              borderTopColor: 'var(--color-primary, #8B5CF6)',
              borderRightColor: 'color-mix(in srgb, var(--color-primary, #8B5CF6) 50%, transparent)',
              borderRadius: '50%'
            }}
          />
        )}
        
        {/* Logo con efecto pulse */}
        {!logoError ? (
          <img
            src={logoSrc}
            alt="THADO Consulting"
            className={`${currentSize.logo} object-contain z-10 ${logoLoaded ? 'animate-pulse' : 'opacity-0'}`}
            style={{ animationDuration: '2s' }}
            onLoad={() => setLogoLoaded(true)}
            onError={() => {
              console.error('Error cargando logo:', logoSrc);
              setLogoError(true);
            }}
          />
        ) : (
          // Fallback si el logo no carga: mostrar texto
          <div 
            className={`${currentSize.logo} flex items-center justify-center animate-pulse z-10`}
            style={{ 
              color: isDark ? '#ffffff' : '#1e293b',
              fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1.25rem' : '1rem',
              fontWeight: 'bold'
            }}
          >
            THADO
          </div>
        )}
      </div>

      {/* Mensaje de carga - usa color de texto secundario del tema */}
      {message && (
        <p 
          className={`mt-6 ${currentSize.text} font-medium animate-pulse`}
          style={{ 
            color: 'var(--color-text-secondary, #94a3b8)',
            animationDuration: '1.5s'
          }}
        >
          {message}
        </p>
      )}

      {/* Barra de progreso animada - usa color primario del tema */}
      <div 
        className="mt-4 h-1 w-32 rounded-full overflow-hidden"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary, #8B5CF6) 20%, transparent)' }}
      >
        <div 
          className="h-full rounded-full"
          style={{ 
            backgroundColor: 'var(--color-primary, #8B5CF6)',
            animation: 'loadingBar 1.5s ease-in-out infinite'
          }}
        />
      </div>

      {/* Estilos para la animación de la barra */}
      <style>{`
        @keyframes loadingBar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 15%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );

  // Si es fullScreen, renderizar con fondo del tema
  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-background, #0f172a)' }}
      >
        {content}
      </div>
    );
  }

  // Modo normal: renderizar dentro del contenedor padre
  return (
    <div 
      className="flex items-center justify-center min-h-[300px]"
      style={{ backgroundColor: 'transparent' }}
    >
      {content}
    </div>
  );
};

export default PageLoader;

/**
 * 🔄 SectionLoader - Versión más simple para secciones internas
 * Útil para cargar secciones dentro de una página ya cargada
 */
export const SectionLoader: React.FC<{
  message?: string;
  showLogo?: boolean;
}> = ({ message = 'Cargando...', showLogo = true }) => {
  const { theme } = useTheme();
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (!theme && systemPrefersDark);
  const logoSrc = isDark ? '/LOGO_PARA_FONDO_OSCURO.svg' : '/LOGO_PARA_FONDO_BLANCO.svg';

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative flex items-center justify-center">
        {/* Spinner */}
        <div 
          className="w-16 h-16 animate-spin"
          style={{
            border: '3px solid transparent',
            borderTopColor: 'var(--color-primary, #8B5CF6)',
            borderRightColor: 'color-mix(in srgb, var(--color-primary, #8B5CF6) 50%, transparent)',
            borderRadius: '50%'
          }}
        />
        
        {/* Logo en el centro */}
        {showLogo && (
          <img
            src={logoSrc}
            alt="THADO"
            className="absolute w-10 h-10 object-contain animate-pulse"
            style={{ animationDuration: '2s' }}
          />
        )}
      </div>
      
      {message && (
        <p 
          className="mt-4 text-sm animate-pulse"
          style={{ color: isDark ? '#94a3b8' : '#64748b' }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

/**
 * 🔄 SkeletonCard - Skeleton para cards durante la carga
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      className={`rounded-2xl p-6 shadow-lg animate-pulse ${className}`}
      style={{ backgroundColor: 'var(--color-cardBg)' }}
    >
      <div 
        className="h-48 rounded-xl mb-4"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)' }}
      />
      <div 
        className="h-6 rounded mb-3"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)' }}
      />
      <div 
        className="h-4 rounded mb-2"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)' }}
      />
      <div 
        className="h-4 rounded w-2/3"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)' }}
      />
    </div>
  );
};
