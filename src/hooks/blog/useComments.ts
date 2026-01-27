/**
 * 🎣 Hook para Comentarios del Blog
 * Maneja comentarios, votaciones y reportes
 */

import { useState, useEffect, useCallback } from 'react';
import { blogCommentApi, generateGuestId } from '../../services/blog';
import type {
  BlogComment,
  CommentFormData,
  CommentFilters,
  CommentStatsResponse,
  VoteType,
  ReportReason,
  PaginationInfo
} from '../../types/blog';

interface UseCommentsReturn {
  comments: BlogComment[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  stats: CommentStatsResponse | null;
  addComment: (data: CommentFormData) => Promise<BlogComment | null>;
  voteComment: (commentId: string, type: VoteType) => Promise<void>;
  reportComment: (commentId: string, reason: ReportReason, description?: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook para gestionar comentarios de un post
 */
export function useComments(
  postSlug: string | undefined,
  filters?: CommentFilters
): UseCommentsReturn {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<CommentStatsResponse | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postSlug) {
      setComments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await blogCommentApi.getCommentsByPost(postSlug, {
        includeReplies: true,
        ...filters
      });
      
      if (response.success && response.data) {
        // La respuesta directamente contiene el array de comentarios
        const commentsData = Array.isArray(response.data) ? response.data : [];
        setComments(commentsData);
        // La paginación está en response.data si es PaginatedResponse, o en response si no
        setPagination((response as any).pagination || null);
      } else {
        setComments([]);
      }
    } catch (err: any) {
      console.error('[useComments] Error:', err);
      setError(err.message || 'Error al cargar comentarios');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postSlug, JSON.stringify(filters)]);

  const fetchStats = useCallback(async () => {
    if (!postSlug) return;

    try {
      const response = await blogCommentApi.getCommentStats(postSlug);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('[useComments] Error stats:', err);
    }
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [fetchComments, fetchStats]);

  const addComment = async (data: CommentFormData): Promise<BlogComment | null> => {
    if (!postSlug) return null;

    try {
      const response = await blogCommentApi.createComment(postSlug, data);
      
      if (response.success && response.data) {
        // Recargar comentarios y estadísticas
        await fetchComments();
        await fetchStats();
        return response.data;
      }
      return null;
    } catch (err: any) {
      console.error('[useComments] Error addComment:', err);
      setError(err.message || 'Error al crear comentario');
      throw err;
    }
  };

  const voteComment = async (commentId: string, type: VoteType) => {
    try {
      const guestId = generateGuestId();
      
      await blogCommentApi.voteComment(commentId, { type, guestId });
      
      // Recargar comentarios para reflejar el cambio
      await fetchComments();
    } catch (err: any) {
      console.error('[useComments] Error voteComment:', err);
      setError(err.message || 'Error al votar comentario');
      throw err;
    }
  };

  const reportComment = async (
    commentId: string,
    reason: ReportReason,
    description?: string
  ) => {
    try {
      await blogCommentApi.reportComment(commentId, {
        reason,
        description,
        reporterEmail: 'anonymous@example.com' // Para usuarios no autenticados
      });
      
      // Opcional: Recargar comentarios
      await fetchComments();
    } catch (err: any) {
      console.error('[useComments] Error reportComment:', err);
      setError(err.message || 'Error al reportar comentario');
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    pagination,
    stats,
    addComment,
    voteComment,
    reportComment,
    refetch: fetchComments,
  };
}

/**
 * Hook para gestionar el estado de votación de un comentario
 */
export function useCommentVote(commentId: string) {
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar voto del usuario desde localStorage
  useEffect(() => {
    const votes = JSON.parse(localStorage.getItem('blog_comment_votes') || '{}');
    setUserVote(votes[commentId] || null);
  }, [commentId]);

  const vote = async (type: VoteType) => {
    try {
      setLoading(true);
      const guestId = generateGuestId();
      
      await blogCommentApi.voteComment(commentId, { type, guestId });
      
      // Actualizar voto local
      const votes = JSON.parse(localStorage.getItem('blog_comment_votes') || '{}');
      
      if (type === 'remove') {
        delete votes[commentId];
        setUserVote(null);
      } else {
        votes[commentId] = type;
        setUserVote(type);
      }
      
      localStorage.setItem('blog_comment_votes', JSON.stringify(votes));
    } catch (err: any) {
      console.error('[useCommentVote] Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userVote,
    loading,
    vote,
  };
}

export default useComments;
