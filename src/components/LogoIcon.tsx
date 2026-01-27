interface LogoIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

/**
 * LogoIcon - Versión simplificada del logo (favicon) para uso en sidebars y espacios pequeños
 * Usa el FAVICON.png que funciona bien en cualquier tema sin necesidad de cambios
 */
const LogoIcon = ({ 
  size = 'md', 
  className = '',
  animated = true 
}: LogoIconProps) => {
  
  // Tamaños del icono
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`relative group ${className}`}>
      <img 
        src="/FAVICON.png"
        alt="Scuti Company Icon"
        className={`
          ${sizeClasses[size]}
          transition-all 
          duration-300 
          ease-in-out
          ${animated ? 'logo-animated' : ''}
          object-contain
        `}
        loading="eager"
        style={{
          filter: animated ? 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
      
      {/* Efecto de brillo al hacer hover */}
      {animated && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{
               background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
               filter: 'blur(8px)'
             }}>
        </div>
      )}
    </div>
  );
};

export default LogoIcon;
