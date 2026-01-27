/**
 * 💬 Servicio de API para Comentarios del Blog
 * Maneja comentarios, votaciones y reportes
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import type {
  BlogComment,
  CommentFormData,
  CommentFilters,
  VoteCommentDto,
  ReportCommentDto,
  CommentStatsResponse,
  ApiResponse,
  PaginatedResponse
} from '../../types/blog';

// ============================================
// CONFIGURACIÓN
// ============================================

const commentApiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================
// INTERCEPTORES
// ============================================

commentApiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[CommentAPI] Error obteniendo token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

commentApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data as any;
      return Promise.reject(new Error(data?.message || 'Error en la petición'));
    }
    return Promise.reject(new Error('No se pudo conectar con el servidor'));
  }
);

// ============================================
// API DE COMENTARIOS
// ============================================

/**
 * Obtiene comentarios de un post
 */
const getCommentsByPost = async (
  postSlug: string,
  filters?: CommentFilters
): Promise<ApiResponse<PaginatedResponse<BlogComment>>> => {
  const response = await commentApiClient.get(`/blog/${postSlug}/comments`, {
    params: filters
  });
  return response.data;
};

/**
 * Obtiene un comentario específico
 */
const getCommentById = async (
  commentId: string
): Promise<ApiResponse<BlogComment>> => {
  const response = await commentApiClient.get(`/comments/${commentId}`);
  return response.data;
};

/**
 * Crea un nuevo comentario
 */
const createComment = async (
  postSlug: string,
  data: CommentFormData
): Promise<ApiResponse<BlogComment>> => {
  const response = await commentApiClient.post(
    `/blog/${postSlug}/comments`,
    data
  );
  return response.data;
};

/**
 * Vota un comentario (like/dislike)
 */
const voteComment = async (
  commentId: string,
  voteData: VoteCommentDto
): Promise<ApiResponse<any>> => {
  const response = await commentApiClient.post(
    `/comments/${commentId}/vote`,
    voteData
  );
  return response.data;
};

/**
 * Reporta un comentario
 */
const reportComment = async (
  commentId: string,
  reportData: ReportCommentDto
): Promise<ApiResponse<void>> => {
  const response = await commentApiClient.post(
    `/comments/${commentId}/report`,
    reportData
  );
  return response.data;
};

/**
 * Obtiene estadísticas de comentarios de un post
 */
const getCommentStats = async (
  postSlug: string
): Promise<ApiResponse<CommentStatsResponse>> => {
  const response = await commentApiClient.get(
    `/blog/${postSlug}/comments/stats`
  );
  return response.data;
};

// ============================================
// HELPERS PARA VOTACIÓN
// ============================================

/**
 * Da like a un comentario
 */
const likeComment = async (commentId: string, guestId?: string) => {
  return voteComment(commentId, { type: 'like', guestId });
};

/**
 * Da dislike a un comentario
 */
const dislikeComment = async (commentId: string, guestId?: string) => {
  return voteComment(commentId, { type: 'dislike', guestId });
};

/**
 * Remueve voto de un comentario
 */
const removeVote = async (commentId: string, guestId?: string) => {
  return voteComment(commentId, { type: 'remove', guestId });
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera un ID único para usuarios invitados
 */
export const generateGuestId = (): string => {
  const stored = localStorage.getItem('blog_guest_id');
  if (stored) return stored;

  const newId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('blog_guest_id', newId);
  return newId;
};

/**
 * Obtiene el ID de invitado almacenado
 */
export const getGuestId = (): string | null => {
  return localStorage.getItem('blog_guest_id');
};

// ============================================
// EXPORTACIÓN
// ============================================

export const blogCommentApi = {
  getCommentsByPost,
  getCommentById,
  createComment,
  voteComment,
  reportComment,
  getCommentStats,
  
  // Helpers de votación
  likeComment,
  dislikeComment,
  removeVote,
  
  // Utilidades
  generateGuestId,
  getGuestId,
};

export default blogCommentApi;
