/**
 * ❤️ MyLikes Component
 * Artículos que le gustan al usuario
 */

import { useState } from 'react';
import { useUserLikes } from '../../hooks/useUserLikes';
import { Heart, HeartOff, Calendar, User, Eye } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';
import LazyImage from '../blog/common/LazyImage';

export default function MyLikes() {
  const [page, setPage] = useState(1);
  
  const { likes, pagination, loading, error, toggleLike, refetch } = useUserLikes({
    page,
    limit: 12
  });

  const handleUnlike = async (postId: string) => {
    try {
      await toggleLike(postId);
      refetch();
    } catch (err) {
      alert('Error al quitar me gusta');
    }
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-800 dark:text-red-200 font-medium">Error al cargar me gusta</p>
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      {pagination && (
        <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg border border-pink-200 dark:border-pink-800/30 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400 fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {pagination.total} Artículo{pagination.total !== 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">que te gustaron</p>
            </div>
          </div>
        </div>
      )}

      {/* Likes List */}
      {likes.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">No has dado me gusta a ningún artículo</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
            Explora el blog y marca tus favoritos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {likes.map((like) => (
            <article 
              key={like._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex gap-6">
                {/* Featured Image */}
                {like.featuredImage && (
                  <Link 
                    to={`/blog/${like.slug}`}
                    className="flex-shrink-0 relative overflow-hidden rounded-lg"
                  >
                    <LazyImage
                      src={getImageUrl(like.featuredImage)}
                      alt={like.title}
                      className="w-48 h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      width={192}
                      height={128}
                    />
                  </Link>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Category */}
                  <span 
                    className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-2"
                    style={{
                      backgroundColor: `${like.category.color}20`,
                      color: like.category.color
                    }}
                  >
                    {like.category.name}
                  </span>

                  {/* Title */}
                  <Link to={`/blog/${like.slug}`}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {like.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  {like.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {like.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{like.author?.name || 'Anónimo'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Publicado el {new Date(like.publishedAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {like.stats && like.stats.views !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{like.stats.views.toLocaleString()} vistas</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleUnlike(like._id)}
                      className="p-2 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors group/btn"
                      title="Quitar me gusta"
                    >
                      <HeartOff className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Página {page} de {pagination.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
