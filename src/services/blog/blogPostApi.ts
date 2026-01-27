/**
 * 📡 Servicio de API para Posts del Blog
 * Maneja todas las peticiones relacionadas con posts
 * ✅ Incluye invalidación automática de caché en operaciones admin
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import { setupAuthInterceptor } from './blogApiClientSetup';
import blogCache, { invalidateOnMutation } from '../../utils/blogCache';
import type {
  BlogPost,
  CreatePostDto,
  UpdatePostDto,
  BlogFilters,
  ApiResponse,
  PaginatedResponse
} from '../../types/blog';

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

// Cliente para peticiones autenticadas
const blogApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: parseInt(import.meta.env.VITE_BLOG_API_TIMEOUT || '15000'),
});

// Cliente para peticiones públicas (sin autenticación)
const publicBlogApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: parseInt(import.meta.env.VITE_BLOG_API_TIMEOUT || '15000'),
});

// ============================================
// INTERCEPTORES
// ============================================

// Configurar interceptor de autenticación solo para cliente autenticado
setupAuthInterceptor(blogApiClient);

// Interceptor para manejo de respuestas y errores (MEJORADO)
[blogApiClient, publicBlogApiClient].forEach(client => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const config = error.config;
      const url = config?.url || 'unknown';
      
      if (error.response) {
        // Error del servidor con respuesta
        const status = error.response.status;
        const data = error.response.data as any;

        // Log específico según el tipo de error
        if (status === 401) {
          console.error(`[BlogAPI] 401 No autorizado en ${url} - Token inválido o expirado`);
        } else if (status === 403) {
          console.error(`[BlogAPI] 403 Acceso denegado en ${url} - Permisos insuficientes`);
        } else if (status === 404) {
          console.error(`[BlogAPI] 404 Recurso no encontrado: ${url}`);
        } else if (status === 429) {
          console.error(`[BlogAPI] 429 Rate limit excedido en ${url} - Demasiadas peticiones`);
        } else if (status >= 500) {
          console.error(`[BlogAPI] ${status} Error del servidor en ${url}:`, data?.message || 'Error interno');
        }

        // Mensaje de error más específico
        const errorMessage = data?.message || 
                           (status === 429 ? 'Demasiadas peticiones, intenta más tarde' :
                            status === 404 ? 'Recurso no encontrado' :
                            status === 403 ? 'Acceso denegado' :
                            status === 401 ? 'No autorizado' :
                            'Error en la petición');

        return Promise.reject(new Error(errorMessage));
      } else if (error.request) {
        // Petición enviada pero sin respuesta
        console.error(`[BlogAPI] Sin respuesta del servidor para ${url}:`, {
          timeout: error.code === 'ECONNABORTED',
          network: error.message.includes('Network Error'),
          code: error.code
        });
        
        const errorMessage = error.code === 'ECONNABORTED' 
          ? 'Tiempo de espera agotado - El servidor tardó demasiado en responder'
          : 'No se pudo conectar con el servidor - Verifica tu conexión';
          
        return Promise.reject(new Error(errorMessage));
      } else {
        // Error al configurar la petición
        console.error('[BlogAPI] Error de configuración:', error.message);
        return Promise.reject(error);
      }
    }
  );
});

// ============================================
// API DE POSTS PÚBLICOS
// ============================================

/**
 * Obtiene lista paginada de posts públicos
 */
const getAllPosts = async (
  filters?: BlogFilters
): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
  // Limpiar filtros vacíos para evitar errores en la API
  const cleanFilters: Record<string, any> = {};
  
  // Regex para detectar strings que son solo caracteres hexadecimales (posibles IDs)
  const hexOnlyRegex = /^[a-f0-9]+$/i;
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      // Ignorar valores undefined, null, arrays vacíos o strings vacíos
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        // Filtrar valores undefined/null del array y solo incluir si tiene elementos
        const cleanArray = value.filter(v => {
          if (v === undefined || v === null || v === '') return false;
          // Para tags, filtrar valores que parecen IDs (solo hex)
          if (key === 'tags' && typeof v === 'string' && hexOnlyRegex.test(v)) {
            return false;
          }
          return true;
        });
        if (cleanArray.length > 0) {
          // Convertir array a string separado por comas para evitar tags[]=
          cleanFilters[key] = cleanArray.join(',');
        }
      } else if (value !== '') {
        // Para tags individuales, también filtrar IDs hex
        if (key === 'tags' && typeof value === 'string' && hexOnlyRegex.test(value)) {
          return;
        }
        cleanFilters[key] = value;
      }
    });
  }
  
  const response = await publicBlogApiClient.get('/posts', { params: cleanFilters });
  return response.data;
};

/**
 * Obtiene un post por su slug
 */
const getPostBySlug = async (slug: string): Promise<ApiResponse<BlogPost>> => {
  const response = await publicBlogApiClient.get(`/posts/${slug}`);
  return response.data;
};

/**
 * Obtiene posts destacados
 */
const getFeaturedPosts = async (): Promise<ApiResponse<BlogPost[]>> => {
  const response = await publicBlogApiClient.get('/posts/featured');
  return response.data;
};

/**
 * Obtiene posts populares
 */
const getPopularPosts = async (limit: number = 5): Promise<ApiResponse<BlogPost[]>> => {
  const response = await publicBlogApiClient.get('/posts/popular', {
    params: { limit }
  });
  return response.data;
};

/**
 * Obtiene posts configurados para mostrar en header menu
 */
const getHeaderMenuPosts = async (): Promise<ApiResponse<BlogPost[]>> => {
  const response = await publicBlogApiClient.get('/posts/header-menu');
  return response.data;
};

/**
 * Busca posts por término
 */
const searchPosts = async (
  query: string,
  filters?: Partial<BlogFilters>
): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
  const response = await publicBlogApiClient.get('/posts/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// ============================================
// API DE POSTS ADMINISTRATIVOS
// ============================================

/**
 * Obtiene todos los posts (incluye borradores) - Admin
 */
const getAllAdminPosts = async (
  filters?: BlogFilters
): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
  const response = await blogApiClient.get('/admin/posts', { params: filters });
  return response.data;
};

/**
 * Obtiene un post por ID (incluye borradores) - Admin
 */
const getPostById = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.get(`/admin/posts/${id}`);
  return response.data;
};

/**
 * Crea un nuevo post - Admin
 * ✅ Invalida caché automáticamente
 */
const createPost = async (
  data: CreatePostDto
): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.post('/posts', data);
  
  // ✅ Invalidar caché de listas de posts
  invalidateOnMutation('post');
  console.log('🗑️ [Admin] Caché invalidado tras crear post');
  
  return response.data;
};

/**
 * Actualiza un post existente - Admin
 * ✅ Invalida caché automáticamente (incluyendo el post específico)
 */
const updatePost = async (
  id: string,
  data: UpdatePostDto,
  slug?: string
): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.put(`/posts/${id}`, data);
  
  // ✅ Invalidar caché del post específico y listas
  if (slug) {
    blogCache.invalidate('POST_DETAIL', slug);
  }
  invalidateOnMutation('post');
  console.log('🗑️ [Admin] Caché invalidado tras actualizar post');
  
  return response.data;
};

/**
 * Elimina un post - Admin
 * ✅ Invalida caché automáticamente
 */
const deletePost = async (id: string): Promise<ApiResponse<void>> => {
  const response = await blogApiClient.delete(`/posts/${id}`);
  
  // ✅ Invalidar todo el caché de posts
  invalidateOnMutation('post');
  console.log('🗑️ [Admin] Caché invalidado tras eliminar post');
  
  return response.data;
};

/**
 * Publica un post - Admin
 * ✅ Invalida caché automáticamente
 */
const publishPost = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.patch(`/posts/${id}/publish`);
  
  // ✅ Invalidar caché (el post ahora aparece en listas públicas)
  invalidateOnMutation('post');
  console.log('🗑️ [Admin] Caché invalidado tras publicar post');
  
  return response.data;
};

/**
 * Despublica un post - Admin
 * ✅ Invalida caché automáticamente
 */
const unpublishPost = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.patch(`/posts/${id}/unpublish`);
  
  // ✅ Invalidar caché (el post ya no aparece en listas públicas)
  invalidateOnMutation('post');
  console.log('🗑️ [Admin] Caché invalidado tras despublicar post');
  
  return response.data;
};

/**
 * Duplica un post - Admin
 * ✅ Invalida caché automáticamente
 */
const duplicatePost = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.post(`/posts/${id}/duplicate`);
  
  // ✅ Invalidar caché de listas
  invalidateOnMutation('post');
  console.log('🗑️ [Admin] Caché invalidado tras duplicar post');
  
  return response.data;
};

// ============================================
// INTERACCIONES DE USUARIO
// ============================================

/**
 * Marca/desmarca like en un post
 */
const toggleLike = async (postId: string): Promise<ApiResponse<void>> => {
  const response = await blogApiClient.post(`/posts/${postId}/like`);
  return response.data;
};

/**
 * Marca/desmarca bookmark en un post
 */
const toggleBookmark = async (postId: string): Promise<ApiResponse<void>> => {
  const response = await blogApiClient.post(`/posts/${postId}/bookmark`);
  return response.data;
};

// ============================================
// EXPORTACIÓN
// ============================================

export const blogPostApi = {
  // Públicos
  getAllPosts,
  getPostBySlug,
  getFeaturedPosts,
  getHeaderMenuPosts,
  getPopularPosts,
  searchPosts,
  
  // Admin
  admin: {
    getAllPosts: getAllAdminPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    duplicatePost,
  },
  
  // Interacciones
  toggleLike,
  toggleBookmark,
};

export default blogPostApi;
