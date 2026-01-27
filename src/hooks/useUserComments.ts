/**
 * 💬 useUserComments Hook
 * Hook para gestionar los comentarios del usuario
 */

import { useState, useEffect, useCallback } from 'react';
import { getMyComments, deleteMyComment } from '../services/userBlogService';
import type { UserComment, PaginatedResponse } from '../services/userBlogService';
import { useAuth } from '../contexts/AuthContext';

interface UseUserCommentsOptions {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'spam';
  postSlug?: string;
  sortBy?: string;
}

export function useUserComments(options: UseUserCommentsOptions = {}) {
  const { user } = useAuth();
  const [comments, setComments] = useState<UserComment[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<UserComment>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getMyComments(options);
      setComments(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar comentarios');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [user, options.page, options.limit, options.status, options.postSlug, options.sortBy]);

  useEffect(() => {
    if (user) {
      loadComments();
    }
  }, [loadComments, user]);

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeleting(commentId);
      await deleteMyComment(commentId);
      // Remover del estado local
      setComments(prev => prev.filter(c => c._id !== commentId));
      // Actualizar paginación
      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total - 1
        });
      }
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar comentario');
    } finally {
      setDeleting(null);
    }
  };

  return {
    comments,
    pagination,
    loading,
    error,
    deleting,
    refetch: loadComments,
    deleteComment: handleDeleteComment
  };
}
