/**
 * 📄 PostHeader Component
 * Header profesional para posts del blog con meta información
 */

import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Eye, ArrowLeft } from 'lucide-react';
import { CategoryBadge, ReadingTimeIndicator, LikeButton, FavoriteButton } from './';
import { getImageUrl } from '../../../utils/imageUtils';
import LazyImage from './LazyImage';
import type { BlogPost } from '../../../types/blog';

interface PostHeaderProps {
  post: BlogPost;
  className?: string;
}

export default function PostHeader({ post, className = '' }: PostHeaderProps) {
  return (
    <header className={`post-header bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-6 lg:py-10">
          {/* Breadcrumb / Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al blog
          </Link>

          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <CategoryBadge category={post.category} />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-4xl">
              {post.excerpt}
            </p>
          )}

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Author and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {/* Author - Clickeable si el perfil es público */}
              {post.author && (() => {
                const hasUsername = post.author.username || post.author.publicUsername;
                const isPublicProfile = hasUsername && post.author.blogProfile?.isPublicProfile !== false;
                const profileUrl = isPublicProfile && hasUsername ? `/perfil/${hasUsername}` : null;
                
                const authorContent = (
                  <div className="flex items-center gap-2">
                    {post.author.avatar ? (
                      <LazyImage
                        src={getImageUrl(post.author.avatar)}
                        alt={`${post.author.firstName || ''} ${post.author.lastName || ''}`}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <User className="text-blue-600 dark:text-blue-400" size={16} />
                      </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {post.author.firstName || ''} {post.author.lastName || ''}
                    </span>
                  </div>
                );

                return profileUrl ? (
                  <Link to={profileUrl} className="hover:opacity-80 transition-opacity">
                    {authorContent}
                  </Link>
                ) : authorContent;
              })()}

              {/* Separator */}
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>

              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>

              {/* Separator */}
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>

              {/* Reading Time */}
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400 dark:text-gray-500" />
                <ReadingTimeIndicator minutes={post.readingTime} variant="minimal" />
              </div>

              {/* Views */}
              {post.stats?.views && (
                <>
                  <span className="hidden md:inline text-gray-300 dark:text-gray-600">•</span>
                  <div className="hidden md:flex items-center gap-2">
                    <Eye size={16} className="text-gray-400 dark:text-gray-500" />
                    <span>{post.stats.views.toLocaleString()} vistas</span>
                  </div>
                </>
              )}
            </div>

            {/* Me Gusta & Guardar Buttons */}
            <div className="flex items-center gap-3">
              <LikeButton postId={post._id} size="md" showText />
              <FavoriteButton postId={post._id} size="md" showText />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}