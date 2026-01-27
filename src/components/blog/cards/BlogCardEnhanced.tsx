/**
 * 🎨 Enhanced Blog Card
 * Card modernizada con hover effects y tema dark/light
 * 🏢 Siempre muestra marca Thado Consulting como autor
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../../../types/blog';
import { BRAND_AUTHOR } from '../../../config/brandConstants';
import { useTheme } from '../../../contexts/ThemeContext';

interface BlogCardEnhancedProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
  showAuthor?: boolean;
  showStats?: boolean;
}

export const BlogCardEnhanced: React.FC<BlogCardEnhancedProps> = ({
  post,
  variant = 'default',
  showAuthor = true,
  showStats = true
}) => {
  const { theme } = useTheme();
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const baseClasses = "group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600";
  
  const featuredClasses = variant === 'featured' 
    ? "lg:col-span-2 lg:row-span-2" 
    : "";

  return (
    <article className={`${baseClasses} ${featuredClasses} hover:-translate-y-2`}>
      {/* Imagen */}
      {post.featuredImage && (
        <div className="relative overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              variant === 'featured' ? 'h-64 lg:h-80' : 'h-48'
            }`}
            loading="lazy"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge de categoría */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 border border-white/20 dark:border-gray-600/20">
                {typeof post.category === 'string' ? post.category : post.category.name}
              </span>
            </div>
          )}
          
          {/* Reading time badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
              <Clock className="w-3 h-3" />
              <span>{post.readingTime || 5} min</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        {/* Meta info superior */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
          
          {showStats && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.stats?.views || 0} views</span>
            </div>
          )}
        </div>

        {/* Título */}
        <h3 className={`font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
          variant === 'featured' ? 'text-xl lg:text-2xl' : 'text-lg'
        }`}>
          <Link to={`/blog/${post.slug}`} className="stretched-link">
            {post.title}
          </Link>
        </h3>

        {/* Extracto */}
        <p className={`text-gray-600 dark:text-gray-300 mb-4 ${
          variant === 'featured' ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'
        }`}>
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                +{post.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Footer con autor y CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Autor - Siempre marca Thado Consulting */}
          {showAuthor && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <img
                  src={theme === 'dark' ? BRAND_AUTHOR.logoDark : BRAND_AUTHOR.logoLight}
                  alt={BRAND_AUTHOR.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {BRAND_AUTHOR.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {BRAND_AUTHOR.role}
                </p>
              </div>
            </div>
          )}

          {/* CTA Arrow */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ArrowRight className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-blue-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-blue-400/5 transition-all duration-500 pointer-events-none" />
    </article>
  );
};

export default BlogCardEnhanced;