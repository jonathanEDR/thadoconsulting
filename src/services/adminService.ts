/**
 * 🛡️ Servicio de API Administrativa
 * Conecta con los endpoints de administración del backend
 * Solo accesible para ADMIN, MODERATOR y SUPER_ADMIN
 */

import axios, { type AxiosError } from 'axios';
import type {
  UserWithRole,
  UserRole,
  UserFilters,
  UsersListResponse,
  StatsResponse,
  AdminOperationResponse,
  RoleInfoResponse,
  AssignRoleRequest,
  ToggleStatusRequest
} from '../types/roles';
import { getBackendUrl } from '../utils/apiConfig';

// ============================================
// CONFIGURACIÓN DE API
// ============================================

const API_BASE_URL = getBackendUrl();

// ============================================
// CACHE CONFIGURATION
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class AdminCache {
  private cache = new Map<string, CacheEntry<any>>();
  // Dashboard admin: Cache largo (datos estadísticos raramente cambian)
  private readonly CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 horas

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }
}

const adminCache = new AdminCache();

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

/**
 * Limpia el cache de datos administrativos
 * @param pattern - Patrón opcional para limpiar entradas específicas
 */
export const clearAdminCache = (pattern?: string) => {
  adminCache.clear(pattern);
  
  // También limpiar localStorage de admin
  if (pattern) {
    // Limpiar entradas específicas
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.includes('adminDashboard') && key.includes(pattern)) {
        localStorage.removeItem(key);
      }
    }
  } else {
    // Limpiar todas las entradas de admin
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('adminDashboard_')) {
        localStorage.removeItem(key);
      }
    }
  }
};

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

/**
 * Instancia de axios configurada para el servicio administrativo
 */
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging en desarrollo
if (import.meta.env.DEV) {
  adminApiClient.interceptors.request.use(
    (config: any) => {
      console.log(`[AdminService] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: any) => {
      console.error('[AdminService] Request Error:', error);
      return Promise.reject(error);
    }
  );

  adminApiClient.interceptors.response.use(
    (response: any) => {
      console.log(`[AdminService] Response:`, response.data);
      return response;
    },
    (error: any) => {
      console.error('[AdminService] Response Error:', error.response?.data || error.message);
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
// SERVICIO ADMINISTRATIVO
// ============================================

export const adminService = {
  /**
   * Obtiene estadísticas generales de usuarios y roles
   * 
   * @param token - Token JWT de Clerk
   * @returns Estadísticas del sistema
   * @throws Error si no tiene permisos o falla la petición
   * 
   * @example
   * ```typescript
   * const stats = await adminService.getStats(token);
   * console.log(`Total usuarios: ${stats.totalUsers}`);
   * ```
   */
  async getStats(token: string): Promise<StatsResponse['data']> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      // ⚡ Verificar cache localStorage primero (persiste entre recargas)
      const localStorageKey = 'adminDashboard_stats';
      const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 horas

      try {
        const localData = localStorage.getItem(localStorageKey);
        if (localData) {
          const { data, timestamp } = JSON.parse(localData);
          const age = Date.now() - timestamp;
          
          if (age < CACHE_DURATION) {
            // También guardar en memoria para acceso rápido
            adminCache.set('stats', data);
            return data;
          }
        }
      } catch (e) {
        console.error('Error parseando localStorage de stats:', e);
      }

      // ⚡ Verificar cache en memoria
      const cached = adminCache.get<StatsResponse['data']>('stats');
      if (cached) return cached;

      const response = await adminApiClient.get<StatsResponse>(
        '/api/admin/stats',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'No se pudieron obtener las estadísticas');
      }

      const statsData = response.data.data;

      // Guardar en cache memoria
      adminCache.set('stats', statsData);

      // Guardar en localStorage (persiste entre recargas)
      try {
        localStorage.setItem(localStorageKey, JSON.stringify({
          data: statsData,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Error guardando stats en localStorage:', e);
      }

      return statsData;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[adminService.getStats] Error:', apiError);
      throw new Error(apiError.message);
    }
  },

  /**
   * Obtiene información de roles disponibles y sus permisos
   * 
   * @param token - Token JWT de Clerk
   * @returns Información de todos los roles
   * @throws Error si falla la petición
   * 
   * @example
   * ```typescript
   * const rolesInfo = await adminService.getRolesInfo(token);
   * rolesInfo.roles.forEach(role => {
   *   console.log(`${role.label}: ${role.permissions.length} permisos`);
   * });
   * ```
   */
  async getRolesInfo(token: string): Promise<RoleInfoResponse['data']> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      const response = await adminApiClient.get<RoleInfoResponse>(
        '/api/admin/roles',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'No se pudo obtener información de roles');
      }

      return response.data.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[adminService.getRolesInfo] Error:', apiError);
      throw new Error(apiError.message);
    }
  },

  /**
   * Obtiene lista de usuarios con filtros y paginación
   * 
   * @param token - Token JWT de Clerk
   * @param filters - Filtros opcionales para la búsqueda
   * @returns Lista paginada de usuarios
   * @throws Error si no tiene permisos o falla la petición
   * 
   * @example
   * ```typescript
   * const result = await adminService.getUsers(token, {
   *   role: UserRole.ADMIN,
   *   page: 1,
   *   limit: 10
   * });
   * console.log(`Encontrados: ${result.pagination.total} usuarios`);
   * ```
   */
  async getUsers(token: string, filters?: UserFilters): Promise<UsersListResponse['data']> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      const response = await adminApiClient.get<UsersListResponse>(
        '/api/admin/users',
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: filters
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'No se pudieron obtener los usuarios');
      }

      return response.data.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[adminService.getUsers] Error:', apiError);
      throw new Error(apiError.message);
    }
  },

  /**
   * Obtiene información detallada de un usuario específico
   * 
   * @param token - Token JWT de Clerk
   * @param userId - ID del usuario a consultar
   * @returns Usuario completo con toda su información
   * @throws Error si no existe o no tiene permisos
   * 
   * @example
   * ```typescript
   * const user = await adminService.getUserById(token, '507f1f77bcf86cd799439011');
   * console.log(`Usuario: ${user.email} - Rol: ${user.role}`);
   * ```
   */
  async getUserById(token: string, userId: string): Promise<UserWithRole> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      const response = await adminApiClient.get<AdminOperationResponse>(
        `/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'No se pudo obtener el usuario');
      }

      return response.data.data.user;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[adminService.getUserById] Error:', apiError);
      throw new Error(apiError.message);
    }
  },

  /**
   * Asigna un rol a un usuario específico
   * 
   * @param token - Token JWT de Clerk
   * @param userId - ID del usuario
   * @param role - Nuevo rol a asignar
   * @returns Confirmación de la operación
   * @throws Error si no tiene permisos o falla la asignación
   * 
   * @example
   * ```typescript
   * await adminService.assignRole(token, userId, UserRole.MODERATOR);
   * console.log('Rol asignado exitosamente');
   * ```
   */
  async assignRole(token: string, userId: string, role: UserRole): Promise<AdminOperationResponse> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      if (!role) {
        throw new Error('Rol requerido');
      }

      const payload: AssignRoleRequest = { role };

      const response = await adminApiClient.put<AdminOperationResponse>(
        `/api/admin/users/${userId}/role`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'No se pudo asignar el rol');
      }

      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[adminService.assignRole] Error:', apiError);
      throw new Error(apiError.message);
    }
  },

  /**
   * Activa o desactiva un usuario
   * 
   * @param token - Token JWT de Clerk
   * @param userId - ID del usuario
   * @param isActive - true para activar, false para desactivar
   * @returns Confirmación de la operación
   * @throws Error si no tiene permisos o falla la operación
   * 
   * @example
   * ```typescript
   * await adminService.toggleUserStatus(token, userId, false);
   * console.log('Usuario desactivado');
   * ```
   */
  async toggleUserStatus(
    token: string, 
    userId: string, 
    isActive: boolean
  ): Promise<AdminOperationResponse> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      const payload: ToggleStatusRequest = { isActive };

      const response = await adminApiClient.put<AdminOperationResponse>(
        `/api/admin/users/${userId}/status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'No se pudo cambiar el estado del usuario');
      }

      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[adminService.toggleUserStatus] Error:', apiError);
      throw new Error(apiError.message);
    }
  },

  /**
   * Exporta datos de usuarios (si tiene permisos)
   * 
   * @param token - Token JWT de Clerk
   * @param format - Formato de exportación ('csv' | 'json')
   * @returns Blob con los datos exportados
   * @throws Error si no tiene permisos
   * 
   * @example
   * ```typescript
   * const blob = await adminService.exportUsers(token, 'csv');
   * // Descargar el archivo
   * const url = window.URL.createObjectURL(blob);
   * const a = document.createElement('a');
   * a.href = url;
   * a.download = 'usuarios.csv';
   * a.click();
   * ```
   */
  async exportUsers(token: string, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      if (!token) {
        throw new Error('Token de autenticación requerido');
      }

      const response = await adminApiClient.get(
        '/api/admin/export/users',
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { format },
          responseType: 'blob'
        }
      );

      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('[adminService.exportUsers] Error:', apiError);
      throw new Error(apiError.message);
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

export default adminService;
