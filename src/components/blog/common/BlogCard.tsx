/**
 * 📰 BlogCard Component
 * Tarjeta de post para mostrar en grids y listas
 */

import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../types/blog';
import { formatReadingTime, generateExcerpt, extractFirstImage } from '../../../utils/blog';
import { Eye, Heart, MessageCircle, Calendar, User } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import TagList from './TagList';
import LazyImage from './LazyImage';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showStats?: boolean;
  showTags?: boolean;
  className?: string;
}

export default function BlogCard({
  post,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
  showStats = true,
  showTags = true,
  className = ''
}: BlogCardProps) {
  
  // Extraer imagen destacada (ahora es string simple como Media Library)
  const featuredImage = post.featuredImage || extractFirstImage(post.content);
  
  // Generar excerpt si no existe
  const excerpt = post.excerpt || generateExcerpt(post.content, 150);
  
  // Formatear fecha
  const postDate = new Date(post.publishedAt || post.createdAt);
  const formattedDate = postDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Tiempo de lectura
  const readingTime = formatReadingTime(post.readingTime);
  
  // Nombre completo del autor (con validación de nulos)
  const authorName = post.author 
    ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim()
    : 'Autor Desconocido';

  // Variantes de diseño
  const variants = {
    default: 'flex flex-col h-full',
    featured: 'flex flex-col md:flex-row gap-6 h-full',
    compact: 'flex gap-4 items-start',
    minimal: 'flex flex-col gap-2'
  };

  const containerClass = `
    blog-card
    ${variants[variant]}
    bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg
    transition-all duration-300 ease-in-out
    overflow-hidden
    border border-gray-100 dark:border-gray-700
    ${className}
  `;

  // ============================================
  // VARIANTE FEATURED
  // ============================================
  if (variant === 'featured') {
    return (
      <article className={containerClass}>
        {/* Imagen destacada - 50% */}
        {featuredImage && (
          <Link 
            to={`/blog/${post.slug}`}
            className="relative flex-1 overflow-hidden group"
          >
            <LazyImage
              src={featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              width={600}
              height={400}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        )}
        
        {/* Contenido - 50% */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Meta superior */}
            <div className="flex items-center gap-3 mb-4">
              {post.category && <CategoryBadge category={post.category} size="sm" />}
              <span className="text-sm text-gray-500 dark:text-gray-400">{readingTime}</span>
            </div>

            {/* Título */}
            <Link to={`/blog/${post.slug}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h2>
            </Link>

            {/* Excerpt */}
            {showExcerpt && excerpt && (
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 line-clamp-3">
                {excerpt}
              </p>
            )}

            {/* Tags */}
            {showTags && post.tags && post.tags.length > 0 && (
              <TagList tags={post.tags} limit={5} />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            {showAuthor && (
              <div className="flex items-center gap-3">
                {post.author?.avatar && (
                  <LazyImage
                    src={post.author.avatar}
                    alt={authorName}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {authorName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
                </div>
              </div>
            )}

            {showStats && (
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.stats?.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post.stats?.likesCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {post.stats?.commentsCount || 0}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // ============================================
  // VARIANTE COMPACT
  // ============================================
  if (variant === 'compact') {
    return (
      <article className="flex gap-4 items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        {/* Imagen pequeña */}
        {featuredImage && (
          <Link 
            to={`/blog/${post.slug}`}
            className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg"
          >
            <LazyImage
              src={featuredImage}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              width={96}
              height={96}
            />
          </Link>
        )}
        
        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {post.category && <CategoryBadge category={post.category} size="xs" className="mb-2" />}
          
          <Link to={`/blog/${post.slug}`}>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 mb-1">
              {post.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <span>{readingTime}</span>
            {showStats && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.stats?.views || 0}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // ============================================
  // VARIANTE MINIMAL
  // ============================================
  if (variant === 'minimal') {
    return (
      <article className="py-4 border-b border-gray-100 last:border-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link to={`/blog/${post.slug}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
                {post.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              {showAuthor && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {authorName}
                </span>
              )}
              <span>{formattedDate}</span>
              <span>{readingTime}</span>
            </div>
          </div>
          
          {featuredImage && (
            <Link 
              to={`/blog/${post.slug}`}
              className="flex-shrink-0 w-16 h-16 overflow-hidden rounded"
            >
              <LazyImage
                src={featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                width={64}
                height={64}
              />
            </Link>
          )}
        </div>
      </article>
    );
  }

  // ============================================
  // VARIANTE DEFAULT
  // ============================================
  return (
    <article className={containerClass}>
      {/* Imagen destacada */}
      {featuredImage && (
        <Link 
          to={`/blog/${post.slug}`}
          className="relative h-48 md:h-56 overflow-hidden group"
        >
          <LazyImage
            src={featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={224}
          />
          
          {/* Badge de categoría sobre la imagen (NO clickeable para evitar <a> anidados) */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <CategoryBadge category={post.category} clickable={false} />
            </div>
          )}
          
          {/* Overlay en hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      )}
      
      {/* Contenido */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Meta superior (si no hay imagen) */}
        {!featuredImage && (
          <div className="flex items-center gap-3 mb-4">
            {post.category && <CategoryBadge category={post.category} size="sm" />}
            <span className="text-sm text-gray-500 dark:text-gray-400">{readingTime}</span>
          </div>
        )}

        {/* Título */}
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {showExcerpt && excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {showTags && post.tags && post.tags.length > 0 && (
          <TagList tags={post.tags} limit={3} className="mb-4" />
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          {showAuthor && (
            <div className="flex items-center gap-2">
              {post.author?.avatar && (
                <LazyImage
                  src={post.author.avatar}
                  alt={authorName}
                  className="w-8 h-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {authorName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
              </div>
            </div>
          )}

          {showStats && (
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.stats?.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.stats?.likesCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.stats?.commentsCount || 0}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
