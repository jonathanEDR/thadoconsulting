/**
 * 🏷️ Servicio de API para Tags del Blog
 * Maneja operaciones CRUD de tags
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import type {
  BlogTag,
  BlogPost,
  ApiResponse,
  PaginatedResponse
} from '../../types/blog';

// ============================================
// CONFIGURACIÓN
// ============================================

const tagApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================
// INTERCEPTORES
// ============================================

tagApiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[TagAPI] Error obteniendo token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

tagApiClient.interceptors.response.use(
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
// API DE TAGS PÚBLICAS
// ============================================

/**
 * Obtiene todos los tags activos
 */
const getAllTags = async (): Promise<ApiResponse<BlogTag[]>> => {
  const response = await tagApiClient.get('/tags');
  return response.data;
};

/**
 * Obtiene los tags más populares
 */
const getPopularTags = async (limit: number = 10): Promise<ApiResponse<BlogTag[]>> => {
  const response = await tagApiClient.get('/tags/popular', {
    params: { limit }
  });
  return response.data;
};

/**
 * Obtiene un tag por slug
 */
const getTagBySlug = async (slug: string): Promise<ApiResponse<BlogTag>> => {
  const response = await tagApiClient.get(`/tags/${slug}`);
  return response.data;
};

/**
 * Obtiene posts de un tag específico
 */
const getTagPosts = async (
  slug: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<BlogPost>> => {
  const response = await tagApiClient.get(`/tags/${slug}/posts`, {
    params: { page, limit }
  });
  return response.data;
};

// ============================================
// EXPORTAR API
// ============================================

export const blogTagApi = {
  getAllTags,
  getPopularTags,
  getTagBySlug,
  getTagPosts,
};

export default blogTagApi;
