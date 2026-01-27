/**
 * 🔔 NotificationService
 * Servicio para gestionar las notificaciones del usuario
 */

import axios from 'axios';
import type { AxiosInstance } from 'axios';

// ========================================
// 🔧 CONFIGURACIÓN
// ========================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Instancia de axios configurada para Notificaciones
 */
const createApiInstance = (): AxiosInstance => {
  const api = axios.create({
    baseURL: `${API_URL}/notifications`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 🔒 Interceptor para agregar token de Clerk
  api.interceptors.request.use(
    async (config) => {
      try {
        // Obtener token de Clerk
        const token = await window.Clerk?.session?.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('[NotificationService] Error getting token:', error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};

// Singleton de la instancia
let apiInstance: AxiosInstance | null = null;

const getApi = (): AxiosInstance => {
  if (!apiInstance) {
    apiInstance = createApiInstance();
  }
  return apiInstance;
};

// Tipos de notificación disponibles
export type NotificationType =
  | 'usuario_creado'
  | 'usuario_actualizado'
  | 'usuario_eliminado'
  | 'sesion_creada'
  | 'sesion_revocada'
  | 'invitacion_creada'
  | 'invitacion_aceptada'
  | 'mensaje_interno'
  | 'mensaje_cliente'
  | 'respuesta_cliente'
  | 'respuesta_equipo'
  | 'lead_asignado'
  | 'lead_estado_cambio'
  | 'usuario_vinculado'
  | 'comentario_nuevo'
  | 'comentario_aprobado'
  | 'comentario_rechazado'
  | 'comentario_respuesta'
  | 'sistema'
  | 'alerta'
  | 'recordatorio'
  | 'tarea';

export type NotificationPriority = 'baja' | 'normal' | 'alta' | 'urgente';

export interface NotificationAction {
  tipo: 'link' | 'modal' | 'action';
  url?: string;
  label?: string;
  actionId?: string;
}

export interface Notification {
  _id: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  prioridad: NotificationPriority;
  accion?: NotificationAction;
  origen?: {
    tipo: string;
    id?: string;
    nombre?: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  expiresAt?: string;
  // Estado del usuario
  leido: boolean;
  leidoEn?: string;
  archivado: boolean;
  archivadoEn?: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
    porPrioridad: {
      urgente: number;
      alta: number;
      normal: number;
      baja: number;
    };
  };
}

export interface NotificationFilters {
  tipo?: NotificationType;
  prioridad?: NotificationPriority;
  leido?: boolean;
  archivado?: boolean;
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
}

class NotificationService {
  /**
   * Obtener notificaciones del usuario
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<NotificationsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.prioridad) params.append('prioridad', filters.prioridad);
      if (filters.leido !== undefined) params.append('leido', String(filters.leido));
      if (filters.archivado !== undefined) params.append('archivado', String(filters.archivado));
      if (filters.desde) params.append('desde', filters.desde);
      if (filters.hasta) params.append('hasta', filters.hasta);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));

      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : '';
      
      const response = await getApi().get(url);
      return response.data;
    } catch (error) {
      console.error('[NotificationService] Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Obtener conteo de notificaciones no leídas
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    try {
      const response = await getApi().get('/unread-count');
      return response.data;
    } catch (error) {
      console.error('[NotificationService] Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await getApi().put(`/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('[NotificationService] Error marking as read:', error);
      throw error;
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<{ success: boolean; data: { modified: number } }> {
    try {
      const response = await getApi().put('/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('[NotificationService] Error marking all as read:', error);
      throw error;
    }
  }

  /**
   * Archivar notificación
   */
  async archiveNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await getApi().put(`/${notificationId}/archive`);
      return response.data;
    } catch (error) {
      console.error('[NotificationService] Error archiving notification:', error);
      throw error;
    }
  }

  /**
   * Eliminar notificación
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await getApi().delete(`/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('[NotificationService] Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Obtener icono según el tipo de notificación
   */
  getNotificationIcon(tipo: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      usuario_creado: '👤',
      usuario_actualizado: '✏️',
      usuario_eliminado: '🗑️',
      sesion_creada: '🔓',
      sesion_revocada: '🔒',
      invitacion_creada: '📧',
      invitacion_aceptada: '✅',
      mensaje_interno: '💬',
      mensaje_cliente: '📨',
      respuesta_cliente: '↩️',
      respuesta_equipo: '👥',
      lead_asignado: '🎯',
      lead_estado_cambio: '📊',
      usuario_vinculado: '🔗',
      comentario_nuevo: '💭',
      comentario_aprobado: '✅',
      comentario_rechazado: '❌',
      comentario_respuesta: '↪️',
      sistema: '⚙️',
      alerta: '⚠️',
      recordatorio: '🔔',
      tarea: '📋'
    };
    return icons[tipo] || '🔔';
  }

  /**
   * Obtener color según la prioridad
   */
  getPriorityColor(prioridad: NotificationPriority): string {
    const colors: Record<NotificationPriority, string> = {
      baja: 'text-gray-500',
      normal: 'text-blue-500',
      alta: 'text-orange-500',
      urgente: 'text-red-500'
    };
    return colors[prioridad] || 'text-gray-500';
  }

  /**
   * Obtener color de fondo según la prioridad
   */
  getPriorityBgColor(prioridad: NotificationPriority): string {
    const colors: Record<NotificationPriority, string> = {
      baja: 'bg-gray-100 dark:bg-gray-800',
      normal: 'bg-blue-50 dark:bg-blue-900/30',
      alta: 'bg-orange-50 dark:bg-orange-900/30',
      urgente: 'bg-red-50 dark:bg-red-900/30'
    };
    return colors[prioridad] || 'bg-gray-100 dark:bg-gray-800';
  }

  /**
   * Formatear fecha relativa
   */
  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHour < 24) return `Hace ${diffHour}h`;
    if (diffDay < 7) return `Hace ${diffDay}d`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
