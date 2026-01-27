/**
 * 📂 Servicio de API para Categorías del Blog
 * Maneja operaciones CRUD de categorías
 * ✅ Incluye invalidación automática de caché en operaciones admin
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import blogCache, { invalidateOnMutation } from '../../utils/blogCache';
import type {
  BlogCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  BlogPost,
  ApiResponse,
  PaginatedResponse
} from '../../types/blog';

// ============================================
// CONFIGURACIÓN
// ============================================

const categoryApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================
// INTERCEPTORES
// ============================================

categoryApiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[CategoryAPI] Error obteniendo token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

categoryApiClient.interceptors.response.use(
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
// API DE CATEGORÍAS PÚBLICAS
// ============================================

/**
 * Obtiene todas las categorías activas
 */
const getAllCategories = async (): Promise<ApiResponse<BlogCategory[]>> => {
  const response = await categoryApiClient.get('/categories');
  return response.data;
};

/**
 * Obtiene una categoría por slug
 */
const getCategoryBySlug = async (
  slug: string
): Promise<ApiResponse<BlogCategory>> => {
  const response = await categoryApiClient.get(`/categories/${slug}`);
  return response.data;
};

/**
 * Obtiene posts de una categoría
 */
const getCategoryPosts = async (
  slug: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
  const response = await categoryApiClient.get(`/categories/${slug}/posts`, {
    params: { page, limit }
  });
  return response.data;
};

// ============================================
// API DE CATEGORÍAS ADMINISTRATIVAS
// ============================================

/**
 * Crea una nueva categoría - Admin
 * ✅ Invalida caché automáticamente
 */
const createCategory = async (
  data: CreateCategoryDto
): Promise<ApiResponse<BlogCategory>> => {
  const response = await categoryApiClient.post('/categories', data);
  
  // ✅ Invalidar caché de categorías y posts relacionados
  invalidateOnMutation('category');
  console.log('🗑️ [Admin] Caché invalidado tras crear categoría');
  
  return response.data;
};

/**
 * Actualiza una categoría - Admin
 * ✅ Invalida caché automáticamente
 */
const updateCategory = async (
  id: string,
  data: UpdateCategoryDto
): Promise<ApiResponse<BlogCategory>> => {
  const response = await categoryApiClient.put(`/categories/${id}`, data);
  
  // ✅ Invalidar caché de categorías y posts relacionados
  invalidateOnMutation('category');
  console.log('🗑️ [Admin] Caché invalidado tras actualizar categoría');
  
  return response.data;
};

/**
 * Elimina una categoría - Admin
 * ✅ Invalida caché automáticamente
 */
const deleteCategory = async (id: string): Promise<ApiResponse<void>> => {
  const response = await categoryApiClient.delete(`/categories/${id}`);
  
  // ✅ Invalidar caché de categorías y posts relacionados
  invalidateOnMutation('category');
  console.log('🗑️ [Admin] Caché invalidado tras eliminar categoría');
  
  return response.data;
};

/**
 * Reordena categorías - Admin
 * ✅ Invalida caché automáticamente
 */
const reorderCategories = async (
  categoryIds: string[]
): Promise<ApiResponse<BlogCategory[]>> => {
  const response = await categoryApiClient.put('/categories/reorder', {
    order: categoryIds
  });
  
  // ✅ Invalidar caché de categorías
  blogCache.invalidateType('CATEGORIES');
  console.log('🗑️ [Admin] Caché invalidado tras reordenar categorías');
  
  return response.data;
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtiene categorías con conteo de posts
 */
const getCategoriesWithCount = async (): Promise<ApiResponse<BlogCategory[]>> => {
  const response = await getAllCategories();
  return response;
};

/**
 * Valida el color hexadecimal
 */
export const isValidColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

/**
 * Genera un slug a partir del nombre
 */
export const generateSlug = (nombre: string): string => {
  return nombre
    .toLowerCase()
    .trim()
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================
// EXPORTACIÓN
// ============================================

export const blogCategoryApi = {
  // Públicas
  getAllCategories,
  getCategoryBySlug,
  getCategoryPosts,
  getCategoriesWithCount,
  
  // Admin
  admin: {
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  },
  
  // Utilidades
  isValidColor,
  generateSlug,
};

export default blogCategoryApi;
