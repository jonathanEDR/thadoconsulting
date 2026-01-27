/**
 * 🎯 Featured Blog Card
 * Tarjeta destacada para el blog - estilo maqueta con imagen de fondo
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { extractFirstImage } from '../../../utils/blog';
import type { BlogPost } from '../../../types/blog';
import type { FeaturedPostsConfig } from '../../../hooks/blog/useBlogCmsConfig';

interface FeaturedBlogCardProps {
  post: BlogPost;
  variant?: 'hero' | 'small';
  config?: FeaturedPostsConfig;
}

export const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({
  post,
  variant = 'hero',
  config
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Estilos desde config o defaults
  const heroStyles = config?.heroCard || {};
  const smallStyles = config?.smallCard || {};
  const fontFamily = config?.fontFamily || 'Montserrat';

  // Obtener imagen con fallback
  const getPostImage = (): string | null => {
    if (post.featuredImage) return post.featuredImage;
    const contentImage = extractFirstImage(post.content);
    if (contentImage) return contentImage;
    if (post.images && post.images.length > 0) {
      const firstImage = post.images[0];
      return typeof firstImage === 'string' ? firstImage : firstImage.url;
    }
    return null;
  };
  const postImage = getPostImage();

  // Variante Hero - Tarjeta estilo maqueta con franja superpuesta
  if (variant === 'hero') {
    return (
      <article 
        className="relative group overflow-hidden rounded-2xl shadow-lg h-[450px] md:h-[550px]"
        style={{ 
          fontFamily: `'${fontFamily}', sans-serif`,
          border: `${heroStyles.cardBorderWidth || 2}px solid ${heroStyles.cardBorderColor || 'transparent'}`
        }}
      >
        {/* Imagen de fondo - Ocupa toda la tarjeta */}
        <div className="absolute inset-0">
          {postImage ? (
            <img
              src={postImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
          )}
        </div>

        {/* Franja oscura superpuesta - Con margen inferior para ver la imagen */}
        <div 
          className="absolute bottom-6 left-0 right-0 mx-0 p-5 md:p-6"
          style={{ 
            backgroundColor: heroStyles.contentBgColor || 'rgba(0,0,0,0.92)',
          }}
        >
          {/* Fecha */}
          <div 
            className="flex items-center gap-2 text-xs md:text-sm mb-2"
            style={{ color: heroStyles.dateColor || '#9ca3af' }}
          >
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>

          {/* Título */}
          <h3 
            className="text-lg md:text-xl font-bold mb-2 leading-tight group-hover:opacity-80 transition-opacity"
            style={{ 
              color: heroStyles.titleColor || '#ffffff',
              fontFamily: `'${fontFamily}', sans-serif`
            }}
          >
            <Link to={`/blog/${post.slug}`} className="block">
              {post.title}
            </Link>
          </h3>

          {/* Extracto */}
          <p 
            className="text-xs md:text-sm mb-3 line-clamp-2"
            style={{ 
              color: heroStyles.excerptColor || '#d1d5db',
              fontFamily: `'${fontFamily}', sans-serif`
            }}
          >
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag, index) => (
                heroStyles.tagBorderUseGradient ? (
                  // Tag con borde gradiente (usando wrapper)
                  <div 
                    key={index}
                    className="inline-block rounded-full p-[1px]"
                    style={{
                      background: `linear-gradient(${
                        heroStyles.tagBorderGradientDirection === 'to-r' ? 'to right' :
                        heroStyles.tagBorderGradientDirection === 'to-l' ? 'to left' :
                        heroStyles.tagBorderGradientDirection === 'to-t' ? 'to top' :
                        heroStyles.tagBorderGradientDirection === 'to-b' ? 'to bottom' :
                        heroStyles.tagBorderGradientDirection === 'to-tr' ? 'to top right' :
                        'to bottom right'
                      }, ${heroStyles.tagBorderGradientFrom || '#8b5cf6'}, ${heroStyles.tagBorderGradientTo || '#06b6d4'})`
                    }}
                  >
                    <span
                      className="inline-block px-3 py-1 text-xs rounded-full font-medium"
                      style={{
                        backgroundColor: heroStyles.tagBgTransparent 
                          ? '#000000'  // Fondo negro sólido para que se vea el borde gradiente
                          : (heroStyles.tagBgColor || '#8b5cf6'),
                        color: heroStyles.tagTextColor || '#ffffff'
                      }}
                    >
                      {typeof tag === 'string' ? tag : tag.name}
                    </span>
                  </div>
                ) : (
                  // Tag con borde sólido
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-xs rounded-full font-medium"
                    style={{
                      backgroundColor: heroStyles.tagBgTransparent 
                        ? 'transparent' 
                        : (heroStyles.tagBgColor || '#8b5cf6'),
                      color: heroStyles.tagTextColor || '#ffffff',
                      border: `1px solid ${heroStyles.tagBorderColor || '#8b5cf6'}`
                    }}
                  >
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                )
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-400 py-1">
                  +{post.tags.length - 2} más
                </span>
              )}
            </div>
          )}

          {/* Botón Ver más - con soporte para borde gradiente redondeado */}
          {heroStyles.buttonBorderUseGradient && heroStyles.buttonBgTransparent ? (
            // Versión con borde gradiente + fondo transparente (usando wrapper)
            <div 
              className="inline-block rounded-full p-[2px] transition-all duration-300 hover:opacity-90 hover:scale-105"
              style={{
                background: `linear-gradient(${
                  heroStyles.buttonBorderGradientDirection === 'to-r' ? 'to right' :
                  heroStyles.buttonBorderGradientDirection === 'to-l' ? 'to left' :
                  heroStyles.buttonBorderGradientDirection === 'to-t' ? 'to top' :
                  heroStyles.buttonBorderGradientDirection === 'to-b' ? 'to bottom' :
                  heroStyles.buttonBorderGradientDirection === 'to-tr' ? 'to top right' :
                  heroStyles.buttonBorderGradientDirection === 'to-tl' ? 'to top left' :
                  heroStyles.buttonBorderGradientDirection === 'to-br' ? 'to bottom right' :
                  'to bottom left'
                }, ${heroStyles.buttonBorderGradientFrom || '#00ffff'}, ${heroStyles.buttonBorderGradientTo || '#ff00ff'})`,
                padding: `${heroStyles.buttonBorderWidth || 2}px`
              }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-transparent"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  fontFamily: `'${fontFamily}', sans-serif`
                }}
              >
                <span
                  style={heroStyles.buttonTextUseGradient ? {
                    background: `linear-gradient(${
                      heroStyles.buttonTextGradientDirection === 'to-r' ? 'to right' :
                      heroStyles.buttonTextGradientDirection === 'to-l' ? 'to left' :
                      heroStyles.buttonTextGradientDirection === 'to-t' ? 'to top' :
                      heroStyles.buttonTextGradientDirection === 'to-b' ? 'to bottom' :
                      heroStyles.buttonTextGradientDirection === 'to-tr' ? 'to top right' :
                      heroStyles.buttonTextGradientDirection === 'to-tl' ? 'to top left' :
                      heroStyles.buttonTextGradientDirection === 'to-br' ? 'to bottom right' :
                      'to bottom left'
                    }, ${heroStyles.buttonTextGradientFrom || '#00ffff'}, ${heroStyles.buttonTextGradientTo || '#ff00ff'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  } : {
                    color: heroStyles.buttonTextColor || '#00ffff'
                  }}
                >
                  Ver más
                </span>
              </Link>
            </div>
          ) : (
            // Versión normal (sin borde gradiente con fondo transparente)
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 relative"
              style={{
                // Fondo: determinar según configuración
                background: (() => {
                  // Si usa gradiente de borde CON fondo sólido, usamos la técnica padding-box
                  if (heroStyles.buttonBorderUseGradient && !heroStyles.buttonBgTransparent) {
                    const bgColor = heroStyles.buttonBgColor || '#000000';
                    const gradientDirection = heroStyles.buttonBorderGradientDirection === 'to-r' ? 'to right' :
                      heroStyles.buttonBorderGradientDirection === 'to-l' ? 'to left' :
                      heroStyles.buttonBorderGradientDirection === 'to-t' ? 'to top' :
                      heroStyles.buttonBorderGradientDirection === 'to-b' ? 'to bottom' :
                      heroStyles.buttonBorderGradientDirection === 'to-tr' ? 'to top right' :
                      heroStyles.buttonBorderGradientDirection === 'to-tl' ? 'to top left' :
                      heroStyles.buttonBorderGradientDirection === 'to-br' ? 'to bottom right' :
                      'to bottom left';
                    return `linear-gradient(${bgColor}, ${bgColor}) padding-box, linear-gradient(${gradientDirection}, ${heroStyles.buttonBorderGradientFrom || '#00ffff'}, ${heroStyles.buttonBorderGradientTo || '#ff00ff'}) border-box`;
                  }
                  // Si usa gradiente de fondo (y no es transparente)
                  if (heroStyles.buttonUseGradient && !heroStyles.buttonBgTransparent) {
                    const gradientDirection = heroStyles.buttonGradientDirection === 'to-r' ? 'to right' :
                      heroStyles.buttonGradientDirection === 'to-l' ? 'to left' :
                      heroStyles.buttonGradientDirection === 'to-t' ? 'to top' :
                      heroStyles.buttonGradientDirection === 'to-b' ? 'to bottom' :
                      heroStyles.buttonGradientDirection === 'to-tr' ? 'to top right' :
                      heroStyles.buttonGradientDirection === 'to-tl' ? 'to top left' :
                      heroStyles.buttonGradientDirection === 'to-br' ? 'to bottom right' :
                      'to bottom left';
                    return `linear-gradient(${gradientDirection}, ${heroStyles.buttonGradientFrom || '#3b82f6'}, ${heroStyles.buttonGradientTo || '#8b5cf6'})`;
                  }
                  // Si es transparente
                  if (heroStyles.buttonBgTransparent) {
                    return 'transparent';
                  }
                  // Color sólido
                  return heroStyles.buttonBgColor || 'transparent';
                })(),
                // Borde
                border: heroStyles.buttonBorderUseGradient 
                  ? `${heroStyles.buttonBorderWidth || 2}px solid transparent`
                  : `${heroStyles.buttonBorderWidth || 2}px solid ${heroStyles.buttonBorderColor || '#00ffff'}`,
                fontFamily: `'${fontFamily}', sans-serif`
              }}
              onMouseEnter={(e) => {
                if (!heroStyles.buttonUseGradient && !heroStyles.buttonBorderUseGradient && !heroStyles.buttonBgTransparent) {
                  e.currentTarget.style.backgroundColor = heroStyles.buttonBorderColor || '#00ffff';
                  const textSpan = e.currentTarget.querySelector('span');
                  if (textSpan && !heroStyles.buttonTextUseGradient) {
                    textSpan.style.color = '#000000';
                    textSpan.style.background = 'none';
                    textSpan.style.webkitTextFillColor = '#000000';
                  }
                } else {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!heroStyles.buttonUseGradient && !heroStyles.buttonBorderUseGradient && !heroStyles.buttonBgTransparent) {
                  e.currentTarget.style.backgroundColor = heroStyles.buttonBgColor || 'transparent';
                  const textSpan = e.currentTarget.querySelector('span');
                  if (textSpan) {
                    if (heroStyles.buttonTextUseGradient) {
                      textSpan.style.background = `linear-gradient(${
                        heroStyles.buttonTextGradientDirection === 'to-r' ? 'to right' :
                        heroStyles.buttonTextGradientDirection === 'to-l' ? 'to left' :
                        heroStyles.buttonTextGradientDirection === 'to-t' ? 'to top' :
                        heroStyles.buttonTextGradientDirection === 'to-b' ? 'to bottom' :
                        heroStyles.buttonTextGradientDirection === 'to-tr' ? 'to top right' :
                        heroStyles.buttonTextGradientDirection === 'to-tl' ? 'to top left' :
                        heroStyles.buttonTextGradientDirection === 'to-br' ? 'to bottom right' :
                        'to bottom left'
                      }, ${heroStyles.buttonTextGradientFrom || '#00ffff'}, ${heroStyles.buttonTextGradientTo || '#ff00ff'})`;
                      textSpan.style.webkitBackgroundClip = 'text';
                      textSpan.style.webkitTextFillColor = 'transparent';
                    } else {
                      textSpan.style.color = heroStyles.buttonTextColor || '#00ffff';
                      textSpan.style.background = 'none';
                      textSpan.style.webkitTextFillColor = heroStyles.buttonTextColor || '#00ffff';
                    }
                  }
                } else {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <span
                style={heroStyles.buttonTextUseGradient ? {
                  background: `linear-gradient(${
                    heroStyles.buttonTextGradientDirection === 'to-r' ? 'to right' :
                    heroStyles.buttonTextGradientDirection === 'to-l' ? 'to left' :
                    heroStyles.buttonTextGradientDirection === 'to-t' ? 'to top' :
                    heroStyles.buttonTextGradientDirection === 'to-b' ? 'to bottom' :
                    heroStyles.buttonTextGradientDirection === 'to-tr' ? 'to top right' :
                    heroStyles.buttonTextGradientDirection === 'to-tl' ? 'to top left' :
                    heroStyles.buttonTextGradientDirection === 'to-br' ? 'to bottom right' :
                    'to bottom left'
                  }, ${heroStyles.buttonTextGradientFrom || '#00ffff'}, ${heroStyles.buttonTextGradientTo || '#ff00ff'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                } : {
                  color: heroStyles.buttonTextColor || '#00ffff'
                }}
              >
                Ver más
              </span>
            </Link>
          )}
        </div>
      </article>
    );
  }

  // Variante Small - Tarjeta pequeña sin imagen
  return (
    <article 
      className="rounded-xl p-5 hover:shadow-lg transition-all duration-300 group border"
      style={{
        backgroundColor: smallStyles.bgColor || '#ffffff',
        borderColor: smallStyles.borderColor || '#e5e7eb',
        fontFamily: `'${fontFamily}', sans-serif`
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = smallStyles.hoverBorderColor || '#93c5fd';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = smallStyles.borderColor || '#e5e7eb';
      }}
    >
      {/* Categoría badge */}
      {post.category && (
        <span 
          className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
          style={{
            backgroundColor: smallStyles.categoryBgColor || '#2563eb',
            color: smallStyles.categoryTextColor || '#ffffff'
          }}
        >
          {typeof post.category === 'string' ? post.category : post.category.name}
        </span>
      )}

      {/* Fecha */}
      <div 
        className="flex items-center gap-2 text-sm mb-3"
        style={{ color: smallStyles.dateColor || '#6b7280' }}
      >
        <Calendar className="w-4 h-4" />
        <time dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
      </div>

      {/* Título */}
      <h3 
        className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors leading-tight"
        style={{ color: smallStyles.titleColor || '#111827' }}
      >
        <Link to={`/blog/${post.slug}`} className="block">
          {post.title}
        </Link>
      </h3>

      {/* Extracto */}
      <p 
        className="text-sm line-clamp-2"
        style={{ color: smallStyles.excerptColor || '#4b5563' }}
      >
        {post.excerpt}
      </p>
    </article>
  );
};

export default FeaturedBlogCard;
