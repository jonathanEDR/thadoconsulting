/**
 * 🏷️ TagList Component
 * Lista de tags con estilo y límite configurable
 */

import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import type { BlogTag } from '../../../types/blog';

// Estilos configurables desde CMS
export interface TagListStyles {
  background?: { light?: string; dark?: string };
  textColor?: { light?: string; dark?: string };
  hoverBackground?: { light?: string; dark?: string };
}

interface TagListProps {
  tags: (string | BlogTag)[];
  limit?: number;
  size?: 'sm' | 'md';
  clickable?: boolean;
  className?: string;
  styles?: TagListStyles;
  theme?: 'light' | 'dark';
}

export default function TagList({
  tags,
  limit,
  size = 'md',
  clickable = true,
  className = '',
  styles,
  theme = 'light'
}: TagListProps) {
  
  // Calcular estilos dinámicos desde CMS
  const currentStyles = {
    background: theme === 'dark' 
      ? styles?.background?.dark 
      : styles?.background?.light,
    textColor: theme === 'dark' 
      ? styles?.textColor?.dark 
      : styles?.textColor?.light,
    hoverBackground: theme === 'dark' 
      ? styles?.hoverBackground?.dark 
      : styles?.hoverBackground?.light,
  };

  // Aplicar límite si existe
  const displayTags = limit ? tags.slice(0, limit) : tags;
  const remainingCount = limit && tags.length > limit ? tags.length - limit : 0;

  // Estilos por tamaño
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5'
  };

  if (tags.length === 0) return null;

  // Estilos base y dinámicos para cada tag
  const getTagStyle = (isHovered: boolean = false) => ({
    backgroundColor: isHovered && currentStyles.hoverBackground 
      ? currentStyles.hoverBackground 
      : currentStyles.background || undefined,
    color: currentStyles.textColor || undefined,
  });

  const baseTagClass = `
    inline-flex items-center gap-1
    ${sizeClasses[size]}
    rounded-md font-medium
    transition-all duration-200
  `;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {displayTags.map((tag, index) => {
        // Extraer nombre y slug del tag (puede ser string u objeto)
        const tagName = typeof tag === 'string' ? tag : tag.name;
        const tagSlug = typeof tag === 'string' ? tag : tag.slug;
        
        const tagClass = `
          ${baseTagClass}
          ${!currentStyles.background ? 'bg-gray-100' : ''}
          ${!currentStyles.textColor ? 'text-gray-700' : ''}
          ${clickable && !currentStyles.hoverBackground ? 'hover:bg-blue-100 hover:text-blue-700' : ''}
          ${clickable ? 'cursor-pointer' : ''}
        `;

        const content = (
          <>
            <Tag className={iconSizes[size]} />
            <span>{tagName}</span>
          </>
        );

        if (clickable) {
          // Usar query param en lugar de ruta separada para SEO
          // /blog?tag=slug en lugar de /blog/tag/slug
          return (
            <Link
              key={`${tagSlug}-${index}`}
              to={`/blog?tag=${encodeURIComponent(tagSlug)}`}
              className={tagClass}
              style={getTagStyle()}
              onMouseEnter={(e) => {
                if (currentStyles.hoverBackground) {
                  e.currentTarget.style.backgroundColor = currentStyles.hoverBackground;
                }
              }}
              onMouseLeave={(e) => {
                if (currentStyles.background) {
                  e.currentTarget.style.backgroundColor = currentStyles.background;
                }
              }}
            >
              {content}
            </Link>
          );
        }

        return (
          <span key={`${tagSlug}-${index}`} className={tagClass} style={getTagStyle()}>
            {content}
          </span>
        );
      })}
      
      {remainingCount > 0 && (
        <span className={`${sizeClasses[size]} text-gray-500 font-medium`}>
          +{remainingCount} más
        </span>
      )}
    </div>
  );
}
