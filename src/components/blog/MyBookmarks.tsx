/**
 * 🔖 MyBookmarks Component
 * Artículos guardados por el usuario
 */

import { useState } from 'react';
import { useUserBookmarks } from '../../hooks/useUserBookmarks';
import { Bookmark, BookmarkX, Calendar, User } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';
import LazyImage from '../blog/common/LazyImage';

export default function MyBookmarks() {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  
  const { bookmarks, pagination, loading, error, toggleBookmark, refetch } = useUserBookmarks({
    page,
    limit: 12,
    category: categoryFilter
  });

  const handleRemoveBookmark = async (postId: string) => {
    try {
      await toggleBookmark(postId);
      refetch();
    } catch (err) {
      alert('Error al quitar de guardados');
    }
  };

  // Extraer categorías únicas para el filtro
  const categories = Array.from(
    new Set(bookmarks.map(b => b.category.slug))
  ).map(slug => {
    const bookmark = bookmarks.find(b => b.category.slug === slug);
    return bookmark ? bookmark.category : null;
  }).filter(Boolean);

  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-800 dark:text-red-200 font-medium">Error al cargar guardados</p>
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {categories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categorías:</span>
              <button
                onClick={() => {
                  setCategoryFilter(undefined);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !categoryFilter
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Todas
              </button>
              {categories.map((category) => category && (
                <button
                  key={category.slug}
                  onClick={() => {
                    setCategoryFilter(category.slug);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === category.slug
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={{
                    backgroundColor: categoryFilter === category.slug ? category.color : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {pagination && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {pagination.total} guardado{pagination.total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bookmarks Grid */}
      {bookmarks.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <Bookmark className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">No tienes artículos guardados</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
            Guarda artículos para leerlos más tarde
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <article 
              key={bookmark._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Featured Image */}
              {bookmark.featuredImage && (
                <Link to={`/blog/${bookmark.slug}`} className="block relative overflow-hidden">
                  <LazyImage
                    src={getImageUrl(bookmark.featuredImage)}
                    alt={bookmark.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={192}
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveBookmark(bookmark._id);
                      }}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-colors"
                      title="Quitar de guardados"
                    >
                      <BookmarkX className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                </Link>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                <span 
                  className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                  style={{
                    backgroundColor: `${bookmark.category.color}20`,
                    color: bookmark.category.color
                  }}
                >
                  {bookmark.category.name}
                </span>

                {/* Title */}
                <Link to={`/blog/${bookmark.slug}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {bookmark.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                {bookmark.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {bookmark.excerpt}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{bookmark.author?.name || 'Anónimo'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(bookmark.publishedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
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
