/**
 * 🏷️ CategoryBadge Component
 * Badge visual para mostrar categorías del blog
 * Soporta estilos personalizados desde CMS
 */

import { Link } from 'react-router-dom';
import type { BlogCategory } from '../../../types/blog';

// Estilos personalizados opcionales desde CMS
interface CustomStyles {
  useCategoryColors?: boolean;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

interface CategoryBadgeProps {
  category: BlogCategory;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  clickable?: boolean;
  className?: string;
  // Nuevos props para estilos personalizados
  customStyles?: CustomStyles;
}

export default function CategoryBadge({
  category,
  size = 'md',
  showIcon = true,
  clickable = true,
  className = '',
  customStyles
}: CategoryBadgeProps) {
  
  // Estilos por tamaño
  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Estilos base del badge
  const badgeClass = `
    inline-flex items-center gap-1.5
    ${sizeClasses[size]}
    font-medium rounded-full
    transition-all duration-200
    ${clickable ? 'hover:shadow-md hover:scale-105 cursor-pointer' : ''}
    ${className}
  `;

  // Determinar si usar colores de la categoría o personalizados
  const useCategoryColors = customStyles?.useCategoryColors !== false;

  // Estilos de color - personalizados o de la categoría
  const getColorStyle = (): React.CSSProperties => {
    if (useCategoryColors) {
      // Usar colores de la categoría (comportamiento original)
      return {
        backgroundColor: category.color + '15', // 15 = ~8% opacity
        color: category.color,
        borderColor: category.color + '40', // 40 = ~25% opacity
      };
    }
    
    // Usar estilos personalizados del CMS
    const bgColor = customStyles?.bgColor || '#8b5cf6';
    const textColor = customStyles?.textColor || '#ffffff';
    const borderColor = customStyles?.borderColor || 'transparent';
    
    // Detectar si es gradiente
    const isGradientBg = bgColor?.startsWith('linear-gradient');
    const isGradientBorder = borderColor?.startsWith('linear-gradient');
    
    const style: React.CSSProperties = {
      color: textColor,
    };
    
    if (isGradientBg) {
      style.background = bgColor;
    } else {
      style.backgroundColor = bgColor;
    }
    
    if (isGradientBorder) {
      // Para bordes con gradiente, usamos un wrapper o pseudo-elemento
      style.border = 'none';
      style.position = 'relative';
    } else if (borderColor !== 'transparent') {
      style.border = `1px solid ${borderColor}`;
    }
    
    return style;
  };

  const colorStyle = getColorStyle();

  const content = (
    <>
      {showIcon && category.image?.alt && (
        <span 
          className={`${iconSizes[size]} flex-shrink-0`}
          dangerouslySetInnerHTML={{ __html: category.image.alt }}
        />
      )}
      <span className="truncate">{category.name}</span>
    </>
  );

  if (clickable) {
    return (
      <Link
        to="/blog"
        className={badgeClass}
        style={colorStyle}
        title={category.description}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      className={`${badgeClass} border`}
      style={colorStyle}
      title={category.description}
    >
      {content}
    </span>
  );
}
