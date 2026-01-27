/**
 * Hook personalizado para gestión de Eventos/Agenda
 * Maneja estado, filtros, CRUD operations y carga de datos
 */

import { useState, useEffect, useCallback } from 'react';
import eventService from '../services/eventService';
import type {
  Event,
  EventFilters,
  CreateEventData,
  UpdateEventData,
  EventPagination,
  UpdateStatusData,
  AddAttendeeData,
  AddReminderData,
  RespondInvitationData
} from '../types/event';

/**
 * Hook personalizado para gestionar eventos
 */
export const useEvents = () => {
  // ========================================
  // ESTADO
  // ========================================
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [pagination, setPagination] = useState<EventPagination>({
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0
  });
  
  // Filtros
  const [filters, setFilters] = useState<EventFilters>({
    type: 'all',
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    page: 1,
    limit: 50
  });

  // ========================================
  // CARGAR EVENTOS
  // ========================================
  const loadEvents = useCallback(async (customFilters?: EventFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = customFilters || filters;
      
      // Remover filtros 'all'
      const cleanFilters = Object.entries(filtersToUse).reduce((acc, [key, value]) => {
        if (value !== 'all' && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await eventService.getAllEvents(cleanFilters);
      
      if (response.success) {
        setEvents(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error('Error al cargar eventos');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar eventos');
      console.error('Error cargando eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar eventos al montar el componente o cambiar filtros
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ========================================
  // OPERACIONES DE FILTROS
  // ========================================
  const updateFilters = useCallback((newFilters: Partial<EventFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      type: 'all',
      status: 'all',
      priority: 'all',
      category: 'all',
      search: '',
      page: 1,
      limit: 50
    });
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // ========================================
  // CARGAR VISTAS ESPECÍFICAS
  // ========================================
  const loadTodayEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getTodayEvents();
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error cargando eventos de hoy:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUpcomingEvents = useCallback(async (days: number = 7) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getUpcomingEvents(days);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error cargando eventos próximos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeekEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getWeekEvents();
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error cargando eventos de la semana:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMonthEvents = useCallback(async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getMonthEvents(year, month);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error cargando eventos del mes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // OPERACIONES CRUD
  // ========================================
  const createEvent = useCallback(async (data: CreateEventData) => {
    try {
      const response = await eventService.createEvent(data);
      
      if (response.success) {
        // Agregar el nuevo evento a la lista
        setEvents(prev => [response.data, ...prev]);
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al crear evento');
    } catch (err: any) {
      console.error('Error creando evento:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const updateEvent = useCallback(async (id: string, data: UpdateEventData) => {
    try {
      const response = await eventService.updateEvent(id, data);
      
      if (response.success) {
        // Actualizar evento en la lista
        setEvents(prev => prev.map(event => 
          event._id === id ? response.data : event
        ));
        
        // Actualizar evento seleccionado si es el mismo
        if (selectedEvent?._id === id) {
          setSelectedEvent(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al actualizar evento');
    } catch (err: any) {
      console.error('Error actualizando evento:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const response = await eventService.deleteEvent(id);
      
      if (response.success) {
        // Remover evento de la lista
        setEvents(prev => prev.filter(event => event._id !== id));
        
        // Limpiar selección si es el mismo evento
        if (selectedEvent?._id === id) {
          setSelectedEvent(null);
        }
        
        return { success: true };
      }
      
      throw new Error('Error al eliminar evento');
    } catch (err: any) {
      console.error('Error eliminando evento:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  const changeEventStatus = useCallback(async (id: string, statusData: UpdateStatusData) => {
    try {
      const response = await eventService.updateEventStatus(id, statusData);
      
      if (response.success) {
        // Actualizar evento en la lista
        setEvents(prev => prev.map(event => 
          event._id === id ? response.data : event
        ));
        
        // Actualizar evento seleccionado si es el mismo
        if (selectedEvent?._id === id) {
          setSelectedEvent(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al cambiar estado');
    } catch (err: any) {
      console.error('Error cambiando estado:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  // ========================================
  // OPERACIONES DE PARTICIPANTES
  // ========================================
  const addAttendee = useCallback(async (eventId: string, attendeeData: AddAttendeeData) => {
    try {
      const response = await eventService.addAttendee(eventId, attendeeData);
      
      if (response.success) {
        // Actualizar evento en la lista
        setEvents(prev => prev.map(event => 
          event._id === eventId ? response.data : event
        ));
        
        // Actualizar evento seleccionado si es el mismo
        if (selectedEvent?._id === eventId) {
          setSelectedEvent(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al agregar participante');
    } catch (err: any) {
      console.error('Error agregando participante:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  const removeAttendee = useCallback(async (eventId: string, userId: string) => {
    try {
      const response = await eventService.removeAttendee(eventId, userId);
      
      if (response.success) {
        // Actualizar evento en la lista
        setEvents(prev => prev.map(event => 
          event._id === eventId ? response.data : event
        ));
        
        // Actualizar evento seleccionado si es el mismo
        if (selectedEvent?._id === eventId) {
          setSelectedEvent(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al eliminar participante');
    } catch (err: any) {
      console.error('Error eliminando participante:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  const respondToInvitation = useCallback(async (eventId: string, responseData: RespondInvitationData) => {
    try {
      const response = await eventService.respondToInvitation(eventId, responseData);
      
      if (response.success) {
        // Actualizar evento en la lista
        setEvents(prev => prev.map(event => 
          event._id === eventId ? response.data : event
        ));
        
        // Actualizar evento seleccionado si es el mismo
        if (selectedEvent?._id === eventId) {
          setSelectedEvent(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al responder invitación');
    } catch (err: any) {
      console.error('Error respondiendo invitación:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  // ========================================
  // OPERACIONES DE RECORDATORIOS
  // ========================================
  const addReminder = useCallback(async (eventId: string, reminderData: AddReminderData) => {
    try {
      const response = await eventService.addReminder(eventId, reminderData);
      
      if (response.success) {
        // Actualizar evento en la lista
        setEvents(prev => prev.map(event => 
          event._id === eventId ? response.data : event
        ));
        
        // Actualizar evento seleccionado si es el mismo
        if (selectedEvent?._id === eventId) {
          setSelectedEvent(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al agregar recordatorio');
    } catch (err: any) {
      console.error('Error agregando recordatorio:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  const removeReminder = useCallback(async (eventId: string, reminderId: string) => {
    try {
      const response = await eventService.removeReminder(eventId, reminderId);
      
      if (response.success) {
        // Actualizar evento en la lista
        setEvents(prev => prev.map(event => 
          event._id === eventId ? response.data : event
        ));
        
        // Actualizar evento seleccionado si es el mismo
        if (selectedEvent?._id === eventId) {
          setSelectedEvent(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      throw new Error('Error al eliminar recordatorio');
    } catch (err: any) {
      console.error('Error eliminando recordatorio:', err);
      return { success: false, error: err.message };
    }
  }, [selectedEvent]);

  // ========================================
  // UTILIDADES
  // ========================================
  const refresh = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ========================================
  // RETORNO DEL HOOK
  // ========================================
  return {
    // Estado
    events,
    selectedEvent,
    setSelectedEvent,
    loading,
    error,
    pagination,
    filters,
    
    // Filtros
    updateFilters,
    resetFilters,
    changePage,
    
    // Vistas específicas
    loadTodayEvents,
    loadUpcomingEvents,
    loadWeekEvents,
    loadMonthEvents,
    
    // CRUD
    createEvent,
    updateEvent,
    deleteEvent,
    changeEventStatus,
    
    // Participantes
    addAttendee,
    removeAttendee,
    respondToInvitation,
    
    // Recordatorios
    addReminder,
    removeReminder,
    
    // Utilidades
    refresh,
    clearError
  };
};

export default useEvents;
