/**
 * 🎣 Hook para Moderación de Comentarios (Admin)
 * Maneja la cola de moderación y acciones de moderación
 */

import { useState, useEffect, useCallback } from 'react';
import { blogModerationApi } from '../../services/blog';
import type {
  BlogComment,
  ModerationFilters,
  ModerationAction,
  PaginationInfo
} from '../../types/blog';

interface UseModerationQueueReturn {
  comments: BlogComment[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  stats: any | null;
  moderateComment: (commentId: string, action: ModerationAction, reason?: string) => Promise<void>;
  moderateBatch: (commentIds: string[], action: 'approve' | 'reject') => Promise<void>;
  moderateMultiple: (commentIds: string[], action: 'approve' | 'reject' | 'spam') => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook para la cola de moderación
 */
export function useModerationQueue(
  filters?: ModerationFilters
): UseModerationQueueReturn {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<any | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogModerationApi.getModerationQueue(filters);
      
      if (response.success && response.data) {
        setComments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('[useModerationQueue] Error:', err);
      setError(err.message || 'Error al cargar cola de moderación');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await blogModerationApi.getModerationStats();
      if (response.success && response.data) {
        // El backend devuelve { comments: { pending, approved, spam, ... }, reports, ... }
        // Solo necesitamos la parte de comments
        setStats(response.data.comments || response.data);
      }
    } catch (err: any) {
      console.error('[useModerationQueue] Error stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    fetchStats();
  }, [fetchQueue, fetchStats]);

  const moderateComment = async (
    commentId: string,
    action: ModerationAction,
    reason?: string
  ) => {
    try {
      await blogModerationApi.moderateComment(commentId, {
        action,
        reason,
        notifyUser: true
      });
      
      // Recargar cola y stats
      await fetchQueue();
      await fetchStats();
    } catch (err: any) {
      console.error('[useModerationQueue] Error moderateComment:', err);
      setError(err.message || 'Error al moderar comentario');
      throw err;
    }
  };

  const moderateBatch = async (
    commentIds: string[],
    action: 'approve' | 'reject'
  ) => {
    try {
      if (action === 'approve') {
        await blogModerationApi.approveBatch(commentIds);
      } else {
        await blogModerationApi.rejectBatch(commentIds);
      }
      
      // Recargar cola y stats
      await fetchQueue();
      await fetchStats();
    } catch (err: any) {
      console.error('[useModerationQueue] Error moderateBatch:', err);
      setError(err.message || 'Error al moderar en lote');
      throw err;
    }
  };

  const moderateMultiple = async (
    commentIds: string[],
    action: 'approve' | 'reject' | 'spam'
  ) => {
    try {
      // Moderar cada comentario individualmente
      const promises = commentIds.map(id => 
        blogModerationApi.moderateComment(id, {
          action: action as ModerationAction,
          notifyUser: action !== 'spam'
        })
      );
      
      await Promise.all(promises);
      
      // Recargar cola y stats
      await fetchQueue();
      await fetchStats();
    } catch (err: any) {
      console.error('[useModerationQueue] Error moderateMultiple:', err);
      setError(err.message || 'Error al moderar múltiples comentarios');
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    pagination,
    stats,
    moderateComment,
    moderateBatch,
    moderateMultiple,
    refetch: fetchQueue,
  };
}

/**
 * Hook para comentarios pendientes
 */
export function usePendingComments(page: number = 1, limit: number = 50) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogModerationApi.getPendingComments(page, limit);
      
      if (response.success && response.data) {
        setComments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('[usePendingComments] Error:', err);
      setError(err.message || 'Error al cargar comentarios pendientes');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return {
    comments,
    loading,
    error,
    pagination,
    refetch: fetchPending,
  };
}

/**
 * Hook para comentarios reportados
 */
export function useReportedComments(page: number = 1, limit: number = 20) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchReported = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogModerationApi.getReportedComments(page, limit);
      
      if (response.success && response.data) {
        setComments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('[useReportedComments] Error:', err);
      setError(err.message || 'Error al cargar comentarios reportados');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchReported();
  }, [fetchReported]);

  return {
    comments,
    loading,
    error,
    pagination,
    refetch: fetchReported,
  };
}

/**
 * Hook para estadísticas de moderación
 */
export function useModerationStats() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogModerationApi.getModerationStats();
      
      if (response.success && response.data) {
        // El backend devuelve { comments: { pending, approved, spam, ... }, reports, ... }
        // Solo necesitamos la parte de comments
        setStats(response.data.comments || response.data);
      }
    } catch (err: any) {
      console.error('[useModerationStats] Error:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export default useModerationQueue;
