/**
 * Servicio de Eventos/Agenda
 * Manejo de API para eventos con autenticación Clerk
 */

import axios from 'axios';
import type {
  CreateEventData,
  UpdateEventData,
  EventFilters,
  EventResponse,
  EventListResponse,
  EventStatsResponse,
  AddAttendeeData,
  RespondInvitationData,
  AddReminderData,
  UpdateStatusData
} from '../types/event';

// Configuración de API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Instancia de axios configurada para eventos
 */
const api = axios.create({
  baseURL: `${API_URL}/events`,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor para agregar token de autenticación de Clerk
 */
api.interceptors.request.use(
  async (config) => {
    try {
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
 * Interceptor para manejo de errores
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error de API:', error.response.data);
      throw new Error(error.response.data.error || 'Error en la solicitud');
    } else if (error.request) {
      console.error('Error de red:', error.request);
      throw new Error('Error de conexión con el servidor');
    } else {
      console.error('Error:', error.message);
      throw error;
    }
  }
);

// ============================================================================
// FUNCIONES DE CONSULTA
// ============================================================================

/**
 * Obtener todos los eventos con filtros
 */
export const getAllEvents = async (filters?: EventFilters): Promise<EventListResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 'all' && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get<EventListResponse>(`/?${params.toString()}`);
  return response.data;
};

/**
 * Obtener eventos de hoy
 */
export const getTodayEvents = async (): Promise<EventListResponse> => {
  const response = await api.get<EventListResponse>('/today');
  return response.data;
};

/**
 * Obtener próximos eventos
 */
export const getUpcomingEvents = async (days: number = 7): Promise<EventListResponse> => {
  const response = await api.get<EventListResponse>(`/upcoming?days=${days}`);
  return response.data;
};

/**
 * Obtener eventos de la semana
 */
export const getWeekEvents = async (): Promise<EventListResponse> => {
  const response = await api.get<EventListResponse>('/week');
  return response.data;
};

/**
 * Obtener eventos del mes
 */
export const getMonthEvents = async (year: number, month: number): Promise<EventListResponse> => {
  const response = await api.get<EventListResponse>(`/month/${year}/${month}`);
  return response.data;
};

/**
 * Buscar eventos
 */
export const searchEvents = async (filters: EventFilters): Promise<EventListResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.append(key, value.toString());
    }
  });
  
  const response = await api.get<EventListResponse>(`/search?${params.toString()}`);
  return response.data;
};

/**
 * Obtener eventos por tipo
 */
export const getEventsByType = async (type: string): Promise<EventListResponse> => {
  const response = await api.get<EventListResponse>(`/by-type/${type}`);
  return response.data;
};

/**
 * Obtener eventos por estado
 */
export const getEventsByStatus = async (status: string): Promise<EventListResponse> => {
  const response = await api.get<EventListResponse>(`/by-status/${status}`);
  return response.data;
};

/**
 * Obtener evento por ID
 */
export const getEventById = async (id: string): Promise<EventResponse> => {
  const response = await api.get<EventResponse>(`/${id}`);
  return response.data;
};

// ============================================================================
// FUNCIONES DE CREACIÓN Y EDICIÓN
// ============================================================================

/**
 * Crear un nuevo evento
 */
export const createEvent = async (data: CreateEventData): Promise<EventResponse> => {
  const response = await api.post<EventResponse>('/', data);
  return response.data;
};

/**
 * Actualizar un evento
 */
export const updateEvent = async (id: string, data: UpdateEventData): Promise<EventResponse> => {
  const response = await api.put<EventResponse>(`/${id}`, data);
  return response.data;
};

/**
 * Actualizar estado de un evento
 */
export const updateEventStatus = async (id: string, data: UpdateStatusData): Promise<EventResponse> => {
  const response = await api.patch<EventResponse>(`/${id}/status`, data);
  return response.data;
};

/**
 * Eliminar un evento
 */
export const deleteEvent = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/${id}`);
  return response.data;
};

// ============================================================================
// FUNCIONES DE PARTICIPANTES
// ============================================================================

/**
 * Agregar participante a un evento
 */
export const addAttendee = async (eventId: string, data: AddAttendeeData): Promise<EventResponse> => {
  const response = await api.post<EventResponse>(`/${eventId}/attendees`, data);
  return response.data;
};

/**
 * Eliminar participante de un evento
 */
export const removeAttendee = async (eventId: string, userId: string): Promise<EventResponse> => {
  const response = await api.delete<EventResponse>(`/${eventId}/attendees/${userId}`);
  return response.data;
};

/**
 * Responder a una invitación
 */
export const respondToInvitation = async (eventId: string, data: RespondInvitationData): Promise<EventResponse> => {
  const response = await api.patch<EventResponse>(`/${eventId}/attendees/response`, data);
  return response.data;
};

// ============================================================================
// FUNCIONES DE RECORDATORIOS
// ============================================================================

/**
 * Agregar recordatorio a un evento
 */
export const addReminder = async (eventId: string, data: AddReminderData): Promise<EventResponse> => {
  const response = await api.post<EventResponse>(`/${eventId}/reminders`, data);
  return response.data;
};

/**
 * Eliminar recordatorio de un evento
 */
export const removeReminder = async (eventId: string, reminderId: string): Promise<EventResponse> => {
  const response = await api.delete<EventResponse>(`/${eventId}/reminders/${reminderId}`);
  return response.data;
};

/**
 * Enviar recordatorio manual
 */
export const sendManualReminder = async (eventId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(`/${eventId}/reminders/send`);
  return response.data;
};

// ============================================================================
// FUNCIONES DE ADMINISTRACIÓN
// ============================================================================

/**
 * Obtener todos los eventos (admin)
 */
export const getAllEventsAdmin = async (filters?: EventFilters): Promise<EventListResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 'all' && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get<EventListResponse>(`/admin/all?${params.toString()}`);
  return response.data;
};

/**
 * Obtener estadísticas de eventos (admin)
 */
export const getEventStats = async (): Promise<EventStatsResponse> => {
  const response = await api.get<EventStatsResponse>('/admin/stats');
  return response.data;
};

// ============================================================================
// SERVICIO POR DEFECTO
// ============================================================================

const eventService = {
  // Consultas
  getAllEvents,
  getTodayEvents,
  getUpcomingEvents,
  getWeekEvents,
  getMonthEvents,
  searchEvents,
  getEventsByType,
  getEventsByStatus,
  getEventById,
  
  // CRUD
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent,
  
  // Participantes
  addAttendee,
  removeAttendee,
  respondToInvitation,
  
  // Recordatorios
  addReminder,
  removeReminder,
  sendManualReminder,
  
  // Admin
  getAllEventsAdmin,
  getEventStats
};

export default eventService;
