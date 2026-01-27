/**
 * 🛡️ Servicio de API para Moderación de Comentarios
 * Funciones administrativas de moderación
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import type {
  BlogComment,
  ModerateCommentDto,
  ModerationFilters,
  ApiResponse,
  PaginatedResponse
} from '../../types/blog';

// ============================================
// CONFIGURACIÓN
// ============================================

const moderationApiClient = axios.create({
  baseURL: `${getApiUrl()}/admin/comments`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================
// INTERCEPTORES
// ============================================

moderationApiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[ModerationAPI] Error obteniendo token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

moderationApiClient.interceptors.response.use(
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
// API DE MODERACIÓN
// ============================================

/**
 * Obtiene la cola de moderación
 */
const getModerationQueue = async (
  filters?: ModerationFilters
): Promise<ApiResponse<PaginatedResponse<BlogComment>>> => {
  const response = await moderationApiClient.get('/moderation/queue', {
    params: filters
  });
  return response.data;
};

/**
 * Modera un comentario (aprobar, rechazar, spam, ocultar)
 */
const moderateComment = async (
  commentId: string,
  moderationData: ModerateCommentDto
): Promise<ApiResponse<BlogComment>> => {
  // Mapear la acción a la ruta correcta del backend
  const actionRoutes: Record<string, string> = {
    'approve': `/${commentId}/approve`,
    'reject': `/${commentId}/reject`,
    'spam': `/${commentId}/spam`,
    'hide': `/${commentId}/hide`
  };

  const route = actionRoutes[moderationData.action] || `/${commentId}/approve`;
  
  const response = await moderationApiClient.post(route, {
    reason: moderationData.reason,
    notifyUser: moderationData.notifyUser
  });
  
  return response.data;
};

/**
 * Obtiene estadísticas de moderación
 */
const getModerationStats = async (): Promise<ApiResponse<any>> => {
  const response = await moderationApiClient.get('/stats');
  return response.data;
};

/**
 * Obtiene comentarios reportados
 */
const getReportedComments = async (
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<PaginatedResponse<BlogComment>>> => {
  const response = await moderationApiClient.get('/moderation/queue', {
    params: {
      status: 'pending',
      isReported: true,
      page,
      limit
    }
  });
  return response.data;
};

/**
 * Obtiene comentarios pendientes
 */
const getPendingComments = async (
  page: number = 1,
  limit: number = 50
): Promise<ApiResponse<PaginatedResponse<BlogComment>>> => {
  const response = await moderationApiClient.get('/moderation/queue', {
    params: {
      status: 'pending',
      page,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  });
  return response.data;
};

/**
 * Obtiene comentarios marcados como spam
 */
const getSpamComments = async (
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<PaginatedResponse<BlogComment>>> => {
  const response = await moderationApiClient.get('/moderation/queue', {
    params: {
      status: 'spam',
      page,
      limit
    }
  });
  return response.data;
};

// ============================================
// ACCIONES RÁPIDAS
// ============================================

/**
 * Aprueba un comentario
 */
const approveComment = async (
  commentId: string,
  reason?: string
): Promise<ApiResponse<BlogComment>> => {
  return moderateComment(commentId, {
    action: 'approve',
    reason,
    notifyUser: true
  });
};

/**
 * Rechaza un comentario
 */
const rejectComment = async (
  commentId: string,
  reason?: string
): Promise<ApiResponse<BlogComment>> => {
  return moderateComment(commentId, {
    action: 'reject',
    reason,
    notifyUser: true
  });
};

/**
 * Marca un comentario como spam
 */
const markAsSpam = async (
  commentId: string,
  reason?: string
): Promise<ApiResponse<BlogComment>> => {
  return moderateComment(commentId, {
    action: 'spam',
    reason,
    notifyUser: false
  });
};

/**
 * Oculta un comentario
 */
const hideComment = async (
  commentId: string,
  reason?: string
): Promise<ApiResponse<BlogComment>> => {
  return moderateComment(commentId, {
    action: 'hide',
    reason,
    notifyUser: false
  });
};

/**
 * Aprueba múltiples comentarios en lote
 */
const approveBatch = async (
  commentIds: string[]
): Promise<ApiResponse<any>> => {
  const promises = commentIds.map(id => approveComment(id, 'Aprobación en lote'));
  const results = await Promise.allSettled(promises);
  
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  return {
    success: true,
    data: {
      total: commentIds.length,
      succeeded,
      failed
    }
  };
};

/**
 * Rechaza múltiples comentarios en lote
 */
const rejectBatch = async (
  commentIds: string[]
): Promise<ApiResponse<any>> => {
  const promises = commentIds.map(id => rejectComment(id, 'Rechazo en lote'));
  const results = await Promise.allSettled(promises);
  
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  return {
    success: true,
    data: {
      total: commentIds.length,
      succeeded,
      failed
    }
  };
};

// ============================================
// EXPORTACIÓN
// ============================================

export const blogModerationApi = {
  // Obtener comentarios
  getModerationQueue,
  getPendingComments,
  getReportedComments,
  getSpamComments,
  getModerationStats,
  
  // Moderar
  moderateComment,
  approveComment,
  rejectComment,
  markAsSpam,
  hideComment,
  
  // Acciones en lote
  approveBatch,
  rejectBatch,
};

export default blogModerationApi;
