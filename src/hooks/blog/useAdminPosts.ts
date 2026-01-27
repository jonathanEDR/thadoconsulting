/**
 * 🎣 Hook para gestión de Posts del Blog (Admin)
 * Incluye borradores y posts no publicados
 */

import { useState, useEffect, useCallback } from 'react';
import { blogPostApi } from '../../services/blog';
import type { BlogPost, BlogFilters, PaginationInfo } from '../../types/blog';

interface UseAdminPostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

/**
 * Hook para obtener TODOS los posts (incluye borradores) - Solo Admin
 */
export function useAdminPosts(filters?: BlogFilters): UseAdminPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogPostApi.admin.getAllPosts(filters);
      
      if (response.success && response.data) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error('Error al cargar posts');
      }
    } catch (err: any) {
      console.error('[useAdminPosts] Error:', err);
      setError(err.message || 'Error al cargar los posts del administrador');
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    refetch: fetchPosts,
    refresh
  };
}
