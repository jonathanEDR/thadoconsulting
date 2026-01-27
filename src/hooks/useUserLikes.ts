/**
 * ❤️ useUserLikes Hook
 * Hook para gestionar los posts con me gusta del usuario
 */

import { useState, useEffect, useCallback } from 'react';
import { getMyLikes, toggleLike } from '../services/userBlogService';
import type { LikedPost, PaginatedResponse } from '../services/userBlogService';
import { useAuth } from '../contexts/AuthContext';

interface UseUserLikesOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
}

export function useUserLikes(options: UseUserLikesOptions = {}) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<LikedPost[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<LikedPost>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadLikes = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getMyLikes(options);
      setLikes(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar posts con me gusta');
      console.error('Error loading likes:', err);
    } finally {
      setLoading(false);
    }
  }, [user, options.page, options.limit, options.sortBy]);

  useEffect(() => {
    if (user) {
      loadLikes();
    }
  }, [loadLikes, user]);

  const handleToggleLike = async (postId: string) => {
    try {
      setToggling(postId);
      const result = await toggleLike(postId);
      
      if (!result.liked) {
        // Si se removió el like, quitarlo de la lista
        setLikes(prev => prev.filter(l => l._id !== postId));
        if (pagination) {
          setPagination({
            ...pagination,
            total: pagination.total - 1
          });
        }
      }
      
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Error al procesar like');
    } finally {
      setToggling(null);
    }
  };

  return {
    likes,
    pagination,
    loading,
    error,
    toggling,
    refetch: loadLikes,
    toggleLike: handleToggleLike
  };
}
