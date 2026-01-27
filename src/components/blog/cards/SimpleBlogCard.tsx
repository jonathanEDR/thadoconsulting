/**
 * 🎯 Simple Blog Card
 * Tarjeta limpia y directa para noticias tech
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye } from 'lucide-react';
import { LazyImage } from '../common';
import type { BlogPost } from '../../../types/blog';

interface SimpleBlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured';
}

export const SimpleBlogCard: React.FC<SimpleBlogCardProps> = ({
  post,
  variant = 'default'
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${
      variant === 'featured' ? 'md:col-span-2 lg:col-span-2' : ''
    }`}>
      {/* Imagen */}
      {post.featuredImage && (
        <div className="relative">
          <LazyImage
            src={post.featuredImage}
            alt={post.title}
            className={`w-full object-cover rounded-t-lg ${
              variant === 'featured' ? 'h-48 md:h-64' : 'h-40'
            }`}
            width={variant === 'featured' ? 600 : 400}
            height={variant === 'featured' ? 256 : 160}
          />
          
          {/* Categoría badge */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                {typeof post.category === 'string' ? post.category : post.category.name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="p-4">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
          
          {post.stats?.views && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.stats.views} views</span>
            </div>
          )}
        </div>

        {/* Título */}
        <h3 className={`font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
          variant === 'featured' ? 'text-xl' : 'text-lg'
        }`}>
          <Link to={`/blog/${post.slug}`} className="block">
            {post.title}
          </Link>
        </h3>

        {/* Extracto */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags simples */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 py-1">
                +{post.tags.length - 2} más
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default SimpleBlogCard;