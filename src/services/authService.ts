/**
 * 🔐 Servicio de Autenticación
 * Conecta con el backend para obtener información del usuario autenticado
 * y sincronizar con MongoDB
 */

import axios, { type AxiosError } from 'axios';
import type {
  UserWithRole,
  SyncUserResponse
} from '../types/roles';
import { getBackendUrl } from '../utils/apiConfig';

// ============================================
// CONFIGURACIÓN DE API
// ============================================

const API_BASE_URL = getBackendUrl();

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

/**
 * Instancia de axios configurada para el servicio de autenticación
 */
const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging optimizado - solo en desarrollo
if (import.meta.env.DEV) {
  authApiClient.interceptors.request.use(
    (config: any) => {
      console.debug(`[AuthService] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: any) => {
      console.error('[AuthService] Request Error:', error);
      return Promise.reject(error);
    }
  );

  authApiClient.interceptors.response.use(
    (response: any) => {
      console.debug(`[AuthService] Response:`, response.data);
      return response;
    },
    (error: any) => {
      console.error('[AuthService] Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

// ============================================
// MANEJO DE ERRORES
// ============================================

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Maneja errores de la API y los convierte a un formato consistente
 */
function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    // Error de respuesta del servidor
    if (axiosError.response) {
      return {
        message: axiosError.response.data?.message || 
                 axiosError.response.data?.error ||
                 'Error en la respuesta del servidor',
        code: axiosError.code,
        status: axiosError.response.status
      };
    }
    
    // Error de red o timeout
    if (axiosError.request) {
      return {
        message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        code: axiosError.code,
        status: 0
      };
    }
  }
  
  // Error desconocido
  return {
    message: 'Error desconocido. Por favor intenta de nuevo.',
    code: 'UNKNOWN_ERROR',
    status: 0
  };
}

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

export const authService = {
  /**
   * Obtiene el usuario actual con su rol desde MongoDB
   * Como el backend solo tiene /sync, este método es un alias
   * 
   * @param token - Token JWT de Clerk
   * @param userData - Datos del usuario desde Clerk
   * @returns Usuario con rol y permisos
   * @throws Error si no está autenticado o no se encuentra el usuario
   * 
   * @example
   * ```typescript
   * const token = await clerkUser.getToken();
   * const user = await authService.getCurrentUser(token, {
   *   clerkId: clerkUser.id,
   *   email: clerkUser.primaryEmailAddress.emailAddress,
   *   firstName: clerkUser.firstName,
   *   lastName: clerkUser.lastName,
   *   profileImage: clerkUser.imageUrl
   * });
   * ```
   */
  async getCurrentUser(
    token: string,
    userData: {
      clerkId: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      username?: string | null;
      profileImage?: string | null;
    }
  ): Promise<UserWithRole> {
    // El backend solo tiene /sync, así que usamos ese endpoint
    return this.getUserOnly(token, userData);
  },

  /**
   * Sincroniza el usuario de Clerk con MongoDB
   * Útil para asegurar que el usuario existe en la base de datos
   * 
   * @param token - Token JWT de Clerk
   * @param userData - Datos del usuario desde Clerk
   * @returns Usuario sincronizado con rol
   * @throws Error si falla la sincronización
   * 
   * @example
   * ```typescript
   * const token = await clerkUser.getToken();
   * const user = await authService.syncUser(token, {
   *   clerkId: clerkUser.id,
   *   email: clerkUser.primaryEmailAddress.emailAddress,
   *   firstName: clerkUser.firstName,
   *   lastName: clerkUser.lastName,
   *   profileImage: clerkUser.imageUrl
   * });
   * ```
   */
  async syncUser(
    token: string, 
    userData: {
      clerkId: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      username?: string | null;
      profileImage?: string | null;
    }
  ): Promise<SyncUserResponse> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      if (!userData.clerkId || !userData.email) {
        throw new Error('clerkId y email son requeridos');
      }

      const response = await authApiClient.post<SyncUserResponse>(
        '/api/users/sync',
        {
          clerkId: userData.clerkId,
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || userData.email.split('@')[0],
          profileImage: userData.profileImage || ''
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success || !response.data.user) {
        throw new Error(response.data.message || 'No se pudo sincronizar el usuario');
      }

      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[authService.syncUser] Error:', apiError);
      throw new Error(apiError.message);
    }
  },

  /**
   * Obtiene o sincroniza el usuario automáticamente
   * Simplemente llama a syncUser ya que es idempotente
   * 
   * @param token - Token JWT de Clerk
   * @param userData - Datos del usuario desde Clerk
   * @returns Usuario con rol
   * @throws Error si falla la sincronización
   * 
   * @example
   * ```typescript
   * const token = await clerkUser.getToken();
   * const user = await authService.getOrSyncUser(token, {
   *   clerkId: clerkUser.id,
   *   email: clerkUser.primaryEmailAddress.emailAddress,
   *   firstName: clerkUser.firstName,
   *   lastName: clerkUser.lastName,
   *   profileImage: clerkUser.imageUrl
   * });
   * ```
   */
  async getOrSyncUserWithOnboarding(
    token: string,
    userData: {
      clerkId: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      username?: string | null;
      profileImage?: string | null;
    }
  ): Promise<SyncUserResponse> {
    // syncUser es idempotente, así que podemos llamarlo directamente
    return this.syncUser(token, userData);
  },

  async getOrSyncUser(
    token: string,
    userData: {
      clerkId: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      username?: string | null;
      profileImage?: string | null;
    }
  ): Promise<UserWithRole> {
    // Para compatibilidad, devolvemos solo el usuario
    return this.getUserOnly(token, userData);
  },

  /**
   * Obtiene solo el usuario (sin información de onboarding)
   * Para compatibilidad con código existente
   */
  async getUserOnly(
    token: string,
    userData: {
      clerkId: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      username?: string | null;
      profileImage?: string | null;
    }
  ): Promise<UserWithRole> {
    const response = await this.syncUser(token, userData);
    return response.user;
  },

  /**
   * Verifica la salud de la conexión con el backend
   * 
   * @returns true si el backend está disponible
   * 
   * @example
   * ```typescript
   * const isHealthy = await authService.checkHealth();
   * if (!isHealthy) {
   *   console.error('Backend no disponible');
   * }
   * ```
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await authApiClient.get('/api/health', {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.error('[authService.checkHealth] Backend no disponible:', error);
      return false;
    }
  },

  /**
   * Obtiene la URL base de la API
   * Útil para debugging o construcción de URLs personalizadas
   * 
   * @returns URL base de la API
   */
  getApiUrl(): string {
    return API_BASE_URL;
  }
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default authService;
