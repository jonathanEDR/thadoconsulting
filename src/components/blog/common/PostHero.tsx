/**
 * 📸 PostHero Component - Hero compacto para posts
 * Combina imagen destacada con título y metadata de forma elegante
 * Soporta tema claro y oscuro con estilos configurables desde CMS
 */

import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Eye, ArrowLeft } from 'lucide-react';
import { CategoryBadge, ReadingTimeIndicator, LikeButton, FavoriteButton } from './';
import { getImageUrl } from '../../../utils/imageUtils';
import LazyImage from './LazyImage';
import type { BlogPost } from '../../../types/blog';
import { useTheme } from '../../../contexts/ThemeContext';
import { BRAND_AUTHOR } from '../../../config/brandConstants';

// Tipos para estilos del Hero
interface HeroStyleTheme {
  titleColor?: string;
  subtitleColor?: string;
  metaColor?: string;
  titleFont?: string;
  // Botón Volver (solo texto e icono)
  backButtonTextColor?: string;
  backButtonIconColor?: string;
  // Badge Categoría
  categoryUseCategoryColors?: string;
  categoryBgColor?: string;
  categoryTextColor?: string;
  categoryBorderColor?: string;
  // Iconos, Tiempo de lectura y Avatar
  iconsColor?: string;
  readingTimeColor?: string;
  avatarBorderColor?: string;
}

interface HeroStyles {
  light?: HeroStyleTheme;
  dark?: HeroStyleTheme;
}

interface HeroBackground {
  type?: 'image' | 'gradient' | 'solid';
  gradientFrom?: string;
  gradientTo?: string;
  overlayColor?: string;
}

interface PostHeroProps {
  post: BlogPost;
  variant?: 'overlay' | 'split' | 'compact';
  className?: string;
  // CMS Configuration Props
  showBreadcrumb?: boolean;
  showBackButton?: boolean;
  showCategory?: boolean;
  showReadingTime?: boolean;
  showPublishDate?: boolean;
  showAuthor?: boolean;
  overlayOpacity?: number;
  // Nuevas props de estilos desde CMS
  styles?: HeroStyles;
  background?: HeroBackground;
  height?: string;
}

export default function PostHero({ 
  post, 
  variant = 'overlay',
  className = '',
  // CMS defaults
  showBreadcrumb = true,
  showBackButton = true,
  showCategory = true,
  showReadingTime = true,
  showPublishDate = true,
  showAuthor = true,
  overlayOpacity = 60,
  // Nuevos props de estilos
  styles,
  background,
  height = 'default'
}: PostHeroProps) {
  
  // Obtener tema actual
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Obtener estilos según el tema actual
  const currentStyles = isDarkMode ? styles?.dark : styles?.light;
  const titleColor = currentStyles?.titleColor || '#ffffff';
  const metaColor = currentStyles?.metaColor || 'rgba(255,255,255,0.8)';
  const titleFont = currentStyles?.titleFont || 'inherit';
  
  // Estilos del botón volver (solo texto e icono)
  const backButtonTextColor = currentStyles?.backButtonTextColor || metaColor;
  const backButtonIconColor = currentStyles?.backButtonIconColor || metaColor;
  
  // Estilos del badge de categoría
  const useCategoryColors = currentStyles?.categoryUseCategoryColors !== 'false';
  const categoryBgColor = currentStyles?.categoryBgColor || '#8b5cf6';
  const categoryTextColor = currentStyles?.categoryTextColor || '#ffffff';
  const categoryBorderColor = currentStyles?.categoryBorderColor || 'transparent';
  
  // Estilos de iconos y avatar
  const iconsColor = currentStyles?.iconsColor || metaColor;
  const avatarBorderColor = currentStyles?.avatarBorderColor || 'rgba(255,255,255,0.3)';
  
  // Estilos del tiempo de lectura
  const readingTimeColor = currentStyles?.readingTimeColor || metaColor;
  
  // Calcular opacidad del overlay
  const overlayOpacityValue = overlayOpacity / 100;
  
  // Calcular altura del hero según configuración
  const getHeroHeight = () => {
    switch (height) {
      case 'compact': return 'h-[220px] sm:h-[260px] lg:h-[300px]';
      case 'large': return 'h-[350px] sm:h-[400px] lg:h-[480px]';
      default: return 'h-[280px] sm:h-[320px] lg:h-[380px]';
    }
  };
  
  // Generar estilo de fondo según configuración
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!background || background.type === 'image') {
      return {}; // La imagen se maneja con el componente LazyImage
    }
    if (background.type === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${background.gradientFrom || '#0f0f0f'}, ${background.gradientTo || '#1a1a1a'})`
      };
    }
    if (background.type === 'solid') {
      return {
        backgroundColor: background.overlayColor || '#1f2937'
      };
    }
    return {};
  };
  
  // Variante Overlay: Imagen con título superpuesto
  if (variant === 'overlay' && (post.featuredImage || background?.type !== 'image')) {
    const showImage = background?.type === 'image' || !background?.type;
    
    return (
      <header className={`post-hero relative z-10 ${getHeroHeight()} overflow-hidden ${className}`}>
        {/* Fondo (imagen o color/gradiente) */}
        <div 
          className="absolute inset-0 bg-gray-900"
          style={!showImage ? getBackgroundStyle() : undefined}
        >
          {/* Imagen de fondo (solo si el tipo es 'image' o no está configurado) */}
          {showImage && post.featuredImage && (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <LazyImage
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {/* Overlay oscuro gradiente - Opacidad configurable */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" 
            style={{ opacity: overlayOpacityValue }}
          />
          
          {/* Contenido superpuesto */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-8">
              {/* Breadcrumb - Con estilos configurables */}
              {(showBreadcrumb || showBackButton) && (
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium mb-4 transition-colors hover:opacity-80"
                  style={{ 
                    color: backButtonTextColor
                  }}
                >
                  <ArrowLeft size={16} style={{ color: backButtonIconColor }} />
                  Volver al blog
                </Link>
              )}

              {/* Category - Con estilos configurables */}
              {showCategory && post.category && (
                <div className="mb-3">
                  <CategoryBadge 
                    category={post.category}
                    customStyles={{
                      useCategoryColors: useCategoryColors,
                      bgColor: categoryBgColor,
                      textColor: categoryTextColor,
                      borderColor: categoryBorderColor
                    }}
                  />
                </div>
              )}

              {/* Title - Con colores dinámicos del CMS */}
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight max-w-4xl"
                style={{ 
                  color: titleColor,
                  fontFamily: titleFont !== 'inherit' ? `'${titleFont}', sans-serif` : undefined
                }}
              >
                {post.title}
              </h1>

              {/* Meta compacto - Con colores dinámicos del CMS */}
              <div 
                className="flex flex-wrap items-center gap-3 text-sm"
                style={{ color: metaColor }}
              >
                {/* Author - Siempre mostrar marca Thado Consulting */}
                {showAuthor && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5"
                      style={{ border: `2px solid ${avatarBorderColor}` }}
                    >
                      <img
                        src={BRAND_AUTHOR.logo}
                        alt={BRAND_AUTHOR.name}
                        className="w-full h-full object-contain"
                        width={28}
                        height={28}
                      />
                    </div>
                    <span className="font-medium" style={{ color: titleColor }}>
                      {BRAND_AUTHOR.name}
                    </span>
                  </div>
                )}
                
                {showAuthor && showPublishDate && <span style={{ opacity: 0.4 }}>•</span>}
                
                {/* Date - Con color de icono configurable */}
                {showPublishDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} style={{ color: iconsColor }} />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                )}
                
                {showPublishDate && showReadingTime && <span style={{ opacity: 0.4 }}>•</span>}
                
                {/* Reading Time - Con colores configurables */}
                {showReadingTime && (
                  <ReadingTimeIndicator 
                    minutes={post.readingTime} 
                    variant="minimal" 
                    showIcon={false}
                    textColor={readingTimeColor}
                    iconColor={iconsColor}
                  />
                )}

                {/* Views - Con color de icono configurable */}
                {post.stats?.views && (
                  <>
                    <span className="hidden sm:inline" style={{ opacity: 0.4 }}>•</span>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <Eye size={14} style={{ color: iconsColor }} />
                      <span>{post.stats.views.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Variante Compact: Sin imagen o imagen pequeña
  return (
    <header className={`post-hero bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-6 lg:py-8">
          {/* Breadcrumb */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al blog
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
            {/* Imagen pequeña lateral (si existe) */}
            {post.featuredImage && (
              <div className="lg:order-2 mb-4 lg:mb-0 lg:flex-shrink-0">
                <div className="w-full lg:w-48 h-32 lg:h-32 rounded-xl overflow-hidden shadow-md">
                  <LazyImage
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Contenido principal */}
            <div className="flex-1 lg:order-1">
              {/* Category */}
              {post.category && (
                <div className="mb-3">
                  <CategoryBadge 
                    category={post.category}
                    customStyles={{
                      useCategoryColors: useCategoryColors,
                      bgColor: categoryBgColor,
                      textColor: categoryTextColor,
                      borderColor: categoryBorderColor
                    }}
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Bar */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                {/* Author - Siempre mostrar marca Thado Consulting */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 border border-gray-200 dark:border-gray-700">
                    <img
                      src={BRAND_AUTHOR.logo}
                      alt={BRAND_AUTHOR.name}
                      className="w-full h-full object-contain"
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {BRAND_AUTHOR.name}
                  </span>
                </div>
                
                <span className="text-gray-300 dark:text-gray-600">•</span>
                
                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                
                <span className="text-gray-300 dark:text-gray-600">•</span>
                
                {/* Reading Time */}
                <div className="flex items-center gap-1.5">
                  <Clock size={14} style={{ color: iconsColor }} />
                  <ReadingTimeIndicator 
                    minutes={post.readingTime} 
                    variant="minimal" 
                    textColor={readingTimeColor}
                    iconColor={iconsColor}
                  />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Botones */}
                <div className="flex items-center gap-2">
                  <LikeButton postId={post._id} size="sm" />
                  <FavoriteButton postId={post._id} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
