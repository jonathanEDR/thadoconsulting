/**
 * 📍 PostNavigation Component
 * Navegación entre posts anterior y siguiente
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import type { BlogPost } from '../../../types/blog';

interface NavigationStyles {
  sectionBackground?: string;
  sectionBorder?: string;
  titleColor?: string;
  indicatorColor?: string;
  cardBackground?: string;
  cardBorder?: string;
  cardHoverBorder?: string;
  cardHoverBackground?: string;
  labelColor?: string;
  postTitleColor?: string;
  excerptColor?: string;
  metaColor?: string;
  iconColor?: string;
  imageBorder?: string;
}

interface PostNavigationProps {
  currentPost: BlogPost;
  className?: string;
  showEmptyCard?: boolean;
  styles?: NavigationStyles;
}

interface NavigationPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  readingTime: number;
  featuredImage?: string;
}

export default function PostNavigation({
  currentPost,
  className = '',
  showEmptyCard = false,
  styles = {}
}: PostNavigationProps) {
  
  const [previousPost, setPreviousPost] = useState<NavigationPost | null>(null);
  const [nextPost, setNextPost] = useState<NavigationPost | null>(null);
  const [hoveredCard, setHoveredCard] = useState<'prev' | 'next' | null>(null);
  
  // Obtener posts de la misma categoría para navegación
  const { posts } = useBlogPosts({
    categoria: currentPost.category._id,
    isPublished: true,
    limit: 50, // Suficientes para encontrar anterior/siguiente
    sort: 'publishedAt'
  });

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const currentIndex = posts.findIndex(post => post._id === currentPost._id);
    
    if (currentIndex === -1) return;

    // Post anterior (más reciente)
    if (currentIndex > 0) {
      setNextPost({
        _id: posts[currentIndex - 1]._id,
        title: posts[currentIndex - 1].title,
        slug: posts[currentIndex - 1].slug,
        excerpt: posts[currentIndex - 1].excerpt,
        publishedAt: posts[currentIndex - 1].publishedAt,
        readingTime: posts[currentIndex - 1].readingTime,
        featuredImage: posts[currentIndex - 1].featuredImage
      });
    } else {
      setNextPost(null);
    }

    // Post siguiente (más antiguo)
    if (currentIndex < posts.length - 1) {
      setPreviousPost({
        _id: posts[currentIndex + 1]._id,
        title: posts[currentIndex + 1].title,
        slug: posts[currentIndex + 1].slug,
        excerpt: posts[currentIndex + 1].excerpt,
        publishedAt: posts[currentIndex + 1].publishedAt,
        readingTime: posts[currentIndex + 1].readingTime,
        featuredImage: posts[currentIndex + 1].featuredImage
      });
    } else {
      setPreviousPost(null);
    }
  }, [posts, currentPost._id]);

  // Si no hay posts anterior ni siguiente, no mostrar el componente
  if (!previousPost && !nextPost) {
    return null;
  }

  // Función para obtener estilos de la tarjeta según hover
  const getCardStyles = (isHovered: boolean): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: styles.cardBackground || undefined,
      borderColor: isHovered 
        ? (styles.cardHoverBorder || styles.cardBorder || undefined)
        : (styles.cardBorder || undefined),
      borderWidth: styles.cardBorder ? '2px' : undefined,
      borderStyle: styles.cardBorder ? 'solid' : undefined,
    };

    if (isHovered && styles.cardHoverBackground) {
      baseStyles.backgroundColor = styles.cardHoverBackground;
    }

    return baseStyles;
  };

  return (
    <nav className={`post-navigation ${className}`}>
      <div 
        className={`rounded-xl shadow-sm p-6 sm:p-8 ${!styles.sectionBackground ? 'bg-white dark:bg-gray-800' : ''} ${!styles.sectionBorder ? 'border border-gray-200 dark:border-gray-700' : ''}`}
        style={{
          backgroundColor: styles.sectionBackground || undefined,
          borderColor: styles.sectionBorder || undefined,
          borderWidth: styles.sectionBorder ? '1px' : undefined,
          borderStyle: styles.sectionBorder ? 'solid' : undefined,
        }}
      >
        <h3 
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${!styles.titleColor ? 'text-gray-900 dark:text-white' : ''}`}
          style={{ color: styles.titleColor || undefined }}
        >
          <span 
            className={`w-1 h-6 rounded-full ${!styles.indicatorColor ? 'bg-blue-600 dark:bg-blue-500' : ''}`}
            style={{ backgroundColor: styles.indicatorColor || undefined }}
          />
          Navegación en {currentPost.category.name}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Post Anterior */}
          {previousPost ? (
            <Link
              to={`/blog/${previousPost.slug}`}
              className={`group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg transition-all ${!styles.cardBorder ? 'border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600' : ''} ${!styles.cardHoverBackground ? 'hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''}`}
              style={getCardStyles(hoveredCard === 'prev')}
              onMouseEnter={() => setHoveredCard('prev')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex-shrink-0 mt-1">
                <ChevronLeft 
                  className={`transition-colors ${!styles.iconColor ? 'text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''}`}
                  style={{ color: styles.iconColor || undefined }}
                  size={20} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className={`text-xs font-medium mb-2 ${!styles.labelColor ? 'text-blue-600 dark:text-blue-400' : ''}`}
                  style={{ color: styles.labelColor || undefined }}
                >
                  ← Anterior
                </p>
                <h4 
                  className={`text-sm sm:text-base font-semibold line-clamp-2 transition-colors mb-2 ${!styles.postTitleColor ? 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''}`}
                  style={{ color: styles.postTitleColor || undefined }}
                >
                  {previousPost.title}
                </h4>
                {previousPost.excerpt && (
                  <p 
                    className={`text-xs line-clamp-2 mb-2 ${!styles.excerptColor ? 'text-gray-600 dark:text-gray-400' : ''}`}
                    style={{ color: styles.excerptColor || undefined }}
                  >
                    {previousPost.excerpt}
                  </p>
                )}
                <div 
                  className={`flex items-center gap-3 text-xs ${!styles.metaColor ? 'text-gray-500 dark:text-gray-400' : ''}`}
                  style={{ color: styles.metaColor || undefined }}
                >
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span className="hidden sm:inline">{new Date(previousPost.publishedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{previousPost.readingTime} min</span>
                  </div>
                </div>
              </div>
              {previousPost.featuredImage && (
                <div className="hidden sm:block flex-shrink-0">
                  <img
                    src={previousPost.featuredImage}
                    alt={previousPost.title}
                    className={`w-20 h-20 object-cover rounded-lg ${!styles.imageBorder ? 'border border-gray-200 dark:border-gray-600' : ''}`}
                    style={{
                      borderColor: styles.imageBorder || undefined,
                      borderWidth: styles.imageBorder ? '1px' : undefined,
                      borderStyle: styles.imageBorder ? 'solid' : undefined,
                    }}
                  />
                </div>
              )}
            </Link>
          ) : showEmptyCard ? (
            <div 
              className={`flex items-center justify-center p-5 rounded-lg border-2 border-dashed ${!styles.cardBorder ? 'border-gray-200 dark:border-gray-600' : ''} ${!styles.cardBackground ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
              style={{
                borderColor: styles.cardBorder || undefined,
                backgroundColor: styles.cardBackground || undefined,
              }}
            >
              <p 
                className={`text-sm ${!styles.excerptColor ? 'text-gray-500 dark:text-gray-400' : ''}`}
                style={{ color: styles.excerptColor || undefined }}
              >
                No hay artículo anterior
              </p>
            </div>
          ) : null}

          {/* Post Siguiente */}
          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className={`group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg transition-all ${!styles.cardBorder ? 'border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600' : ''} ${!styles.cardHoverBackground ? 'hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''}`}
              style={getCardStyles(hoveredCard === 'next')}
              onMouseEnter={() => setHoveredCard('next')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {nextPost.featuredImage && (
                <div className="hidden sm:block flex-shrink-0">
                  <img
                    src={nextPost.featuredImage}
                    alt={nextPost.title}
                    className={`w-20 h-20 object-cover rounded-lg ${!styles.imageBorder ? 'border border-gray-200 dark:border-gray-600' : ''}`}
                    style={{
                      borderColor: styles.imageBorder || undefined,
                      borderWidth: styles.imageBorder ? '1px' : undefined,
                      borderStyle: styles.imageBorder ? 'solid' : undefined,
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p 
                  className={`text-xs font-medium mb-2 text-right ${!styles.labelColor ? 'text-blue-600 dark:text-blue-400' : ''}`}
                  style={{ color: styles.labelColor || undefined }}
                >
                  Siguiente →
                </p>
                <h4 
                  className={`text-sm sm:text-base font-semibold line-clamp-2 transition-colors mb-2 text-right ${!styles.postTitleColor ? 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''}`}
                  style={{ color: styles.postTitleColor || undefined }}
                >
                  {nextPost.title}
                </h4>
                {nextPost.excerpt && (
                  <p 
                    className={`text-xs line-clamp-2 mb-2 text-right ${!styles.excerptColor ? 'text-gray-600 dark:text-gray-400' : ''}`}
                    style={{ color: styles.excerptColor || undefined }}
                  >
                    {nextPost.excerpt}
                  </p>
                )}
                <div 
                  className={`flex items-center justify-end gap-3 text-xs ${!styles.metaColor ? 'text-gray-500 dark:text-gray-400' : ''}`}
                  style={{ color: styles.metaColor || undefined }}
                >
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span className="hidden sm:inline">{new Date(nextPost.publishedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{nextPost.readingTime} min</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 mt-1">
                <ChevronRight 
                  className={`transition-colors ${!styles.iconColor ? 'text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''}`}
                  style={{ color: styles.iconColor || undefined }}
                  size={20} 
                />
              </div>
            </Link>
          ) : showEmptyCard ? (
            <div 
              className={`flex items-center justify-center p-5 rounded-lg border-2 border-dashed ${!styles.cardBorder ? 'border-gray-200 dark:border-gray-600' : ''} ${!styles.cardBackground ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
              style={{
                borderColor: styles.cardBorder || undefined,
                backgroundColor: styles.cardBackground || undefined,
              }}
            >
              <p 
                className={`text-sm ${!styles.excerptColor ? 'text-gray-500 dark:text-gray-400' : ''}`}
                style={{ color: styles.excerptColor || undefined }}
              >
                No hay artículo siguiente
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}