import axios from 'axios';
import { messageService, templateService } from './messageService';

// Declaración de tipo para Clerk en window
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * 🔧 Configurar axios para CRM
 */
const api = axios.create({
  baseURL: `${API_URL}/crm`,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 🔒 Interceptor para agregar token de autenticación de Clerk
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Obtener token de Clerk desde el contexto de autenticación
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error obteniendo token de Clerk:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 📝 Interceptor para manejo de errores
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('No autenticado - redirigir al login');
      // Aquí podrías disparar un evento para redirigir al login
    } else if (error.response?.status === 403) {
      console.error('No tienes permisos para esta acción');
    }
    return Promise.reject(error);
  }
);

// ========================================
// 📊 TIPOS TYPESCRIPT
// ========================================

export interface Lead {
  _id: string;
  nombre: string;
  celular: string;
  correo: string;
  empresa?: string;
  tipoServicio: 'web' | 'app' | 'ecommerce' | 'sistemas' | 'consultoria' | 'diseño' | 'marketing' | 'otro';
  descripcionProyecto: string;
  presupuestoEstimado?: number;
  fechaDeseada?: string;
  estado: 
    // Estados nuevos (orientados al cliente)
    | 'nuevo'           // 📝 Solicitud recibida
    | 'en_revision'     // 👀 En revisión del equipo
    | 'contactando'     // 📞 Contactando al cliente
    | 'cotizacion'      // 💰 Cotización enviada
    | 'aprobado'        // ✅ Aprobado por el cliente
    | 'en_desarrollo'   // 🚀 Trabajo en progreso
    | 'completado'      // ✨ Trabajo completado
    | 'rechazado'       // ❌ Rechazado por el cliente
    | 'cancelado'       // 🚫 Cancelado
    // Estados legacy (mantener compatibilidad)
    | 'contactado'      // → Migrar a 'contactando'
    | 'calificado'      // → Migrar a 'en_revision'
    | 'propuesta'       // → Migrar a 'cotizacion'
    | 'negociacion'     // → Migrar a 'cotizacion'
    | 'ganado'          // → Migrar a 'aprobado'
    | 'perdido'         // → Migrar a 'rechazado'
    | 'pausado';        // → Migrar a 'en_revision'
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fechaProximoSeguimiento?: string;
  asignadoA?: {
    userId: string;
    nombre: string;
    email: string;
  };
  // 👤 Usuario registrado vinculado al lead
  usuarioRegistrado?: {
    userId: string;
    nombre: string;
    email: string;
    profileImage?: string | null;
    vinculadoEn?: string;
  };
  origen: 'web' | 'web-authenticated' | 'referido' | 'redes_sociales' | 'email' | 'telefono' | 'evento' | 'chat' | 'otro';
  actividades: LeadActivity[];
  creadoPor: {
    userId: string;
    nombre: string;
    email: string;
  };
  tags: string[];
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  ultimaActividad?: LeadActivity;
  diasDesdeCreacion?: number;
}

export interface LeadActivity {
  _id: string;
  fecha: string;
  tipo: 'nota' | 'llamada' | 'email' | 'reunion' | 'propuesta' | 'cambio_estado';
  descripcion: string;
  usuarioId: string;
  usuarioNombre: string;
}

export interface LeadFilters {
  estado?: string;
  search?: string;
  page?: number;
  limit?: number;
  asignado?: string;
  prioridad?: string;
  tipoServicio?: string;
  origen?: string;
}

export interface CreateLeadData {
  nombre: string;
  celular: string;
  correo: string;
  empresa?: string;
  tipoServicio: string;
  descripcionProyecto: string;
  presupuestoEstimado?: number;
  fechaDeseada?: string;
  prioridad?: string;
  origen?: string;
  tags?: string[];
}

export interface UpdateLeadData {
  nombre?: string;
  celular?: string;
  correo?: string;
  empresa?: string;
  tipoServicio?: string;
  descripcionProyecto?: string;
  presupuestoEstimado?: number;
  fechaDeseada?: string;
  prioridad?: string;
  fechaProximoSeguimiento?: string;
  tags?: string[];
}

export interface LeadEstadisticas {
  total: number;
  porEstado: Array<{ _id: string; count: number }>;
  porPrioridad: Array<{ _id: string; count: number }>;
  porOrigen: Array<{ _id: string; count: number }>;
  porTipoServicio: Array<{ _id: string; count: number }>;
  porMes: Array<{ _id: { year: number; month: number }; count: number }>;
  pendientesSeguimiento: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
  error?: string;
}

// ========================================
// 💼 SERVICIO CRM
// ========================================

export const crmService = {
  /**
   * 📋 Obtener leads con filtros
   */
  getLeads: async (filters: LeadFilters = {}): Promise<ApiResponse<Lead[]>> => {
    try {
      const response = await api.get('/leads', { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo leads:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📄 Obtener un lead específico
   */
  getLead: async (id: string): Promise<ApiResponse<Lead>> => {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo lead:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * ➕ Crear nuevo lead
   */
  createLead: async (leadData: CreateLeadData): Promise<ApiResponse<Lead>> => {
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error: any) {
      console.error('Error creando lead:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * ✏️ Actualizar lead
   */
  updateLead: async (id: string, leadData: UpdateLeadData): Promise<ApiResponse<Lead>> => {
    try {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data;
    } catch (error: any) {
      console.error('Error actualizando lead:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🗑️ Eliminar lead (soft delete)
   */
  deleteLead: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error eliminando lead:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🔄 Cambiar estado del lead
   */
  changeStatus: async (id: string, estado: string, razon?: string): Promise<ApiResponse<Lead>> => {
    try {
      const response = await api.patch(`/leads/${id}/estado`, { estado, razon });
      return response.data;
    } catch (error: any) {
      console.error('Error cambiando estado:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📝 Agregar actividad al lead
   */
  addActivity: async (id: string, tipo: string, descripcion: string): Promise<ApiResponse<Lead>> => {
    try {
      const response = await api.post(`/leads/${id}/actividades`, { tipo, descripcion });
      return response.data;
    } catch (error: any) {
      console.error('Error agregando actividad:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 👤 Asignar lead a un usuario
   */
  assignLead: async (id: string, usuarioId: string): Promise<ApiResponse<Lead>> => {
    try {
      const response = await api.patch(`/leads/${id}/asignar`, { usuarioId });
      return response.data;
    } catch (error: any) {
      console.error('Error asignando lead:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📊 Obtener estadísticas del CRM
   */
  getStatistics: async (): Promise<ApiResponse<LeadEstadisticas>> => {
    try {
      const response = await api.get('/estadisticas');
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🏠 Obtener leads del cliente autenticado
   * GET /api/crm/cliente/mis-leads
   */
  getClientLeads: async (): Promise<ApiResponse<{ leads: Lead[] }>> => {
    try {
      const response = await api.get('/cliente/mis-leads');
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo leads del cliente:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📅 Obtener leads pendientes de seguimiento
   */
  getPendingLeads: async (): Promise<ApiResponse<Lead[]>> => {
    try {
      const response = await api.get('/leads/pendientes');
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo leads pendientes:', error);
      throw error.response?.data || error;
    }
  }
};

// ========================================
// 🎨 UTILIDADES Y HELPERS
// ========================================

/**
 * Obtener color según estado del lead
 */
export const getEstadoColor = (estado: string): string => {
  const colores: Record<string, string> = {
    nuevo: 'blue',
    contactado: 'yellow',
    calificado: 'purple',
    propuesta: 'indigo',
    negociacion: 'orange',
    ganado: 'green',
    perdido: 'red',
    pausado: 'gray'
  };
  return colores[estado] || 'gray';
};

/**
 * Obtener color según prioridad del lead
 */
export const getPrioridadColor = (prioridad: string): string => {
  const colores: Record<string, string> = {
    baja: 'gray',
    media: 'blue',
    alta: 'orange',
    urgente: 'red'
  };
  return colores[prioridad] || 'gray';
};

/**
 * Obtener icono según tipo de actividad
 */
export const getActividadIcon = (tipo: string): string => {
  const iconos: Record<string, string> = {
    nota: '📝',
    llamada: '📞',
    email: '📧',
    reunion: '👥',
    propuesta: '📄',
    cambio_estado: '🔄'
  };
  return iconos[tipo] || '📌';
};

/**
 * Formatear fecha relativa (ej: "hace 2 días")
 */
export const formatearFechaRelativa = (fecha: string): string => {
  const ahora = new Date();
  const fechaLead = new Date(fecha);
  const diferencia = ahora.getTime() - fechaLead.getTime();
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;
  if (dias < 30) return `Hace ${Math.floor(dias / 7)} semanas`;
  if (dias < 365) return `Hace ${Math.floor(dias / 30)} meses`;
  return `Hace ${Math.floor(dias / 365)} años`;
};

/**
 * Validar email
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

/**
 * Validar celular (básico)
 */
export const validarCelular = (celular: string): boolean => {
  const regex = /^\+?[\d\s-]{8,}$/;
  return regex.test(celular);
};

// ========================================
// 💬 INTEGRACIÓN CON SISTEMA DE MENSAJERÍA
// ========================================

/**
 * Métodos de mensajería integrados con CRM
 */
export const crmMessaging = {
  // Mensajes
  getMessages: messageService.getLeadMessages,
  sendInternal: messageService.sendInternalMessage,
  sendClient: messageService.sendClientMessage,
  reply: messageService.replyMessage,
  markRead: messageService.markAsRead,
  deleteMessage: messageService.deleteMessage,
  getUnread: messageService.getUnreadMessages,
  search: messageService.searchMessages,

  // Plantillas
  templates: {
    getAll: templateService.getTemplates,
    getOne: templateService.getTemplate,
    create: templateService.createTemplate,
    update: templateService.updateTemplate,
    delete: templateService.deleteTemplate,
    use: templateService.useTemplate,
    toggleFavorite: templateService.toggleFavorite,
    getStats: templateService.getTemplateStats,
  },
};

export default crmService;
