/**
 * 📚 User Blog Service
 * Servicio para gestionar la actividad del usuario en el blog
 * Comentarios, bookmarks, likes e historial de lectura
 */

import axios from 'axios';
import { getBackendUrl } from '../utils/apiConfig';

// ============================================
// CONFIGURACIÓN DE API
// ============================================

const API_BASE_URL = getBackendUrl();

/**
 * Instancia de axios configurada para user blog
 */
const userBlogApiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/user-blog`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor para agregar token de autenticación
userBlogApiClient.interceptors.request.use(
  async (config) => {
    try {
      // Obtener token de Clerk si está disponible
      if (typeof window !== 'undefined' && (window as any).Clerk) {
        const session = await (window as any).Clerk.session;
        if (session) {
          const token = await session.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// TIPOS DE DATOS
// ============================================

export interface UserBlogStats {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  totalBookmarks: number;
  totalLikes: number;
  postsRead: number;
  readingHistory: number; // Total de artículos en historial
  currentStreak?: number; // Días consecutivos de actividad
  engagement: {
    commentsPerWeek: number;
    favoriteCategories: string[];
  };
}

export interface UserComment {
  _id: string;
  content: string;
  post: {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    category: {
      name: string;
      slug: string;
      color: string;
    };
  };
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  votes: {
    up: number;
    down: number;
  };
  replies?: Array<{
    _id: string;
    content: string;
    author: {
      name: string;
      profileImage?: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export interface BookmarkedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    color: string;
  };
  tags: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  author?: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profileImage?: string;
    name?: string; // computed
  };
  publishedAt: string;
  readingTime: number;
  stats: {
    views: number;
    likesCount: number;
    commentsCount: number;
  };
}

export interface LikedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    color: string;
  };
  tags: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  author?: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profileImage?: string;
    name?: string; // computed
  };
  publishedAt: string;
  readingTime: number;
  views?: number;
  stats?: {
    views: number;
    likesCount: number;
    commentsCount: number;
  };
}

export interface ReadingHistoryItem {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    category: {
      name: string;
      slug: string;
      color: string;
    };
    author?: {
      name: string;
      profileImage?: string;
    };
    readingTime: number;
  };
  lastReadAt: string;
  progress: number; // 0-100
  readCount: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================
// ESTADÍSTICAS
// ============================================

/**
 * Obtener estadísticas de actividad del usuario
 */
export const getUserBlogStats = async (): Promise<UserBlogStats> => {
  try {
    const response = await userBlogApiClient.get<{
      success: boolean;
      data: UserBlogStats;
    }>('/stats');
    
    if (!response.data.success) {
      throw new Error('Error al obtener estadísticas');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting user blog stats:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
  }
};

// ============================================
// COMENTARIOS
// ============================================

/**
 * Obtener comentarios del usuario
 */
export const getMyComments = async (params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'spam';
  postSlug?: string;
  sortBy?: string;
}): Promise<PaginatedResponse<UserComment>> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.postSlug) searchParams.set('postSlug', params.postSlug);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    
    const queryString = searchParams.toString();
    const url = `/my-comments${queryString ? `?${queryString}` : ''}`;
    
    const response = await userBlogApiClient.get<PaginatedResponse<UserComment>>(url);
    
    if (!response.data.success) {
      throw new Error('Error al obtener comentarios');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error getting my comments:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener comentarios');
  }
};

/**
 * Eliminar un comentario propio
 */
export const deleteMyComment = async (commentId: string): Promise<void> => {
  try {
    const response = await userBlogApiClient.delete<{ success: boolean; message: string }>(
      `/my-comments/${commentId}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar comentario');
    }
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    throw new Error(error.response?.data?.message || 'Error al eliminar comentario');
  }
};

// ============================================
// BOOKMARKS
// ============================================

/**
 * Obtener posts guardados
 */
export const getMyBookmarks = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
}): Promise<PaginatedResponse<BookmarkedPost>> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    
    const queryString = searchParams.toString();
    const url = `/bookmarks${queryString ? `?${queryString}` : ''}`;
    
    console.log('[DEBUG] getMyBookmarks - Calling URL:', url);
    console.log('[DEBUG] getMyBookmarks - Full URL:', `${userBlogApiClient.defaults.baseURL}${url}`);
    
    const response = await userBlogApiClient.get<PaginatedResponse<BookmarkedPost>>(url);
    
    console.log('[DEBUG] getMyBookmarks - Response received:', response.data);
    
    if (!response.data.success) {
      throw new Error('Error al obtener posts guardados');
    }
    
    console.log('[DEBUG] getMyBookmarks - Returning data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[DEBUG] getMyBookmarks - Error:', error);
    console.error('[DEBUG] getMyBookmarks - Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al obtener posts guardados');
  }
};

/**
 * Toggle bookmark en un post
 */
export const toggleBookmark = async (postId: string): Promise<{
  bookmarked: boolean;
  totalBookmarks: number;
}> => {
  try {
    const response = await userBlogApiClient.post<{
      success: boolean;
      message: string;
      data: { bookmarked: boolean; totalBookmarks: number };
    }>(`/bookmarks/${postId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al procesar bookmark');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error toggling bookmark:', error);
    throw new Error(error.response?.data?.message || 'Error al procesar bookmark');
  }
};

// ============================================
// LIKES
// ============================================

/**
 * Obtener posts con like
 */
export const getMyLikes = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
}): Promise<PaginatedResponse<LikedPost>> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    
    const queryString = searchParams.toString();
    const url = `/likes${queryString ? `?${queryString}` : ''}`;
    
    const response = await userBlogApiClient.get<PaginatedResponse<LikedPost>>(url);
    
    if (!response.data.success) {
      throw new Error('Error al obtener posts con me gusta');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error getting likes:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener posts con me gusta');
  }
};

/**
 * Toggle like en un post
 */
export const toggleLike = async (postId: string): Promise<{
  liked: boolean;
  totalLikes: number;
}> => {
  try {
    const response = await userBlogApiClient.post<{
      success: boolean;
      message: string;
      data: { liked: boolean; totalLikes: number };
    }>(`/likes/${postId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al procesar like');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error toggling like:', error);
    throw new Error(error.response?.data?.message || 'Error al procesar like');
  }
};

// ============================================
// HISTORIAL DE LECTURA
// ============================================

/**
 * Obtener historial de lectura
 */
export const getReadingHistory = async (params?: {
  page?: number;
  limit?: number;
  period?: 'today' | 'week' | 'month' | 'all';
}): Promise<PaginatedResponse<ReadingHistoryItem>> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.period) searchParams.set('period', params.period);
    
    const queryString = searchParams.toString();
    const url = `/reading-history${queryString ? `?${queryString}` : ''}`;
    
    const response = await userBlogApiClient.get<PaginatedResponse<ReadingHistoryItem>>(url);
    
    if (!response.data.success) {
      throw new Error('Error al obtener historial de lectura');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error getting reading history:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener historial');
  }
};

/**
 * Registrar lectura de un post
 */
export const addToReadingHistory = async (
  postId: string,
  progress: number = 0
): Promise<void> => {
  try {
    const response = await userBlogApiClient.post<{
      success: boolean;
      message: string;
    }>(`/reading-history/${postId}`, { progress });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al registrar lectura');
    }
  } catch (error: any) {
    console.error('Error adding to reading history:', error);
    throw new Error(error.response?.data?.message || 'Error al registrar lectura');
  }
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  getUserBlogStats,
  getMyComments,
  deleteMyComment,
  getMyBookmarks,
  toggleBookmark,
  getMyLikes,
  toggleLike,
  getReadingHistory,
  addToReadingHistory
};
