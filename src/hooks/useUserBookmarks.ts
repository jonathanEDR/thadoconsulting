/**
 * 🔖 useUserBookmarks Hook
 * Hook para gestionar los posts guardados del usuario
 */

import { useState, useEffect, useCallback } from 'react';
import { getMyBookmarks, toggleBookmark } from '../services/userBlogService';
import type { BookmarkedPost, PaginatedResponse } from '../services/userBlogService';
import { useAuth } from '../contexts/AuthContext';

interface UseUserBookmarksOptions {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
}

export function useUserBookmarks(options: UseUserBookmarksOptions = {}) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<BookmarkedPost>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadBookmarks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getMyBookmarks(options);
      setBookmarks(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar posts guardados');
      console.error('Error loading bookmarks:', err);
    } finally {
      setLoading(false);
    }
  }, [user, options.page, options.limit, options.category, options.sortBy]);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [loadBookmarks, user]);

  const handleToggleBookmark = async (postId: string) => {
    try {
      setToggling(postId);
      const result = await toggleBookmark(postId);
      
      if (!result.bookmarked) {
        // Si se removió el bookmark, quitarlo de la lista
        setBookmarks(prev => prev.filter(b => b._id !== postId));
        if (pagination) {
          setPagination({
            ...pagination,
            total: pagination.total - 1
          });
        }
      }
      
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Error al procesar bookmark');
    } finally {
      setToggling(null);
    }
  };

  return {
    bookmarks,
    pagination,
    loading,
    error,
    toggling,
    refetch: loadBookmarks,
    toggleBookmark: handleToggleBookmark
  };
}
