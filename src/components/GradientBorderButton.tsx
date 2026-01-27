import React from 'react';

interface GradientBorderButtonProps {
  background: string;
  textColor: string;
  borderColor: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

/**
 * Componente para renderizar botones con bordes gradiente correctamente
 * Usa la técnica de background dual para lograr bordes gradiente
 */
export const GradientBorderButton: React.FC<GradientBorderButtonProps> = ({
  background,
  textColor,
  borderColor,
  children,
  className = '',
  onClick,
  href
}) => {
  const hasGradientBorder = borderColor?.includes('gradient');
  
  const baseStyles: React.CSSProperties = hasGradientBorder
    ? {
        // Técnica de borde gradiente: dual background
        background: background === 'transparent' || !background
          ? `linear-gradient(var(--color-card-bg, #1F2937), var(--color-card-bg, #1F2937)) padding-box, ${borderColor} border-box`
          : `${background} padding-box, ${borderColor} border-box`,
        color: textColor,
        border: '2px solid transparent'
      }
    : {
        // Borde normal
        background: background || 'transparent',
        color: textColor,
        borderColor: borderColor || 'transparent',
        borderWidth: '2px',
        borderStyle: 'solid'
      };

  const combinedClassName = `px-6 py-2 rounded-full font-medium transition-all duration-300 ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        style={baseStyles}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedClassName}
      style={baseStyles}
    >
      {children}
    </button>
  );
};

export default GradientBorderButton;
