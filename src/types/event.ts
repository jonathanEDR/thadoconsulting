/**
 * Tipos TypeScript para el sistema de Eventos/Agenda
 */

// ============================================================================
// ENUMS Y TIPOS BASE
// ============================================================================

export type EventType = 'meeting' | 'appointment' | 'reminder' | 'event';
export type EventCategory = 'cliente' | 'interno' | 'personal' | 'otro';
export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EventVisibility = 'private' | 'public' | 'shared';
export type LocationType = 'physical' | 'virtual' | 'phone' | 'none';
export type ReminderType = 'email' | 'system' | 'push';
export type AttendeeStatus = 'pending' | 'accepted' | 'declined' | 'maybe';
export type RelatedToType = 'lead' | 'service' | 'blog' | 'user' | 'none';

// ============================================================================
// INTERFACES DE SUBDOCUMENTOS
// ============================================================================

export interface EventAttendee {
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  email?: string;
  status: AttendeeStatus;
  notified: boolean;
  notifiedAt?: Date | string;
  _id?: string;
}

export interface EventLocation {
  type: LocationType;
  address?: string;
  virtualLink?: string;
  phone?: string;
}

export interface EventReminder {
  type: ReminderType;
  minutesBefore: number;
  sent: boolean;
  sentAt?: Date | string;
  _id?: string;
}

export interface EventAttachment {
  name: string;
  url: string;
  type?: string;
  size?: number;
  uploadedAt: Date | string;
  _id?: string;
}

export interface EventRelatedTo {
  type: RelatedToType;
  id?: string;
}

// ============================================================================
// INTERFACE PRINCIPAL DE EVENTO
// ============================================================================

export interface Event {
  _id: string;
  
  // Información básica
  title: string;
  description?: string;
  
  // Categorización
  type: EventType;
  category: EventCategory;
  
  // Temporalidad
  startDate: Date | string;
  endDate: Date | string;
  allDay: boolean;
  timezone: string;
  
  // Participantes
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  attendees: EventAttendee[];
  
  // Ubicación
  location: EventLocation;
  
  // Recordatorios
  reminders: EventReminder[];
  
  // Estado y visibilidad
  status: EventStatus;
  priority: EventPriority;
  visibility: EventVisibility;
  
  // Metadatos
  color: string;
  tags: string[];
  attachments: EventAttachment[];
  
  // Notas y resultados
  notes?: string;
  outcome?: string;
  
  // Integración
  relatedTo: EventRelatedTo;
  
  // Auditoría
  createdBy: string | { _id: string; firstName: string; lastName: string; email: string };
  updatedBy?: string | { _id: string; firstName: string; lastName: string; email: string };
  cancelledBy?: string | { _id: string; firstName: string; lastName: string; email: string };
  cancelledAt?: Date | string;
  cancelReason?: string;
  
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Virtuals
  durationMinutes?: number;
  isPast?: boolean;
  isToday?: boolean;
  isInProgress?: boolean;
  attendeesCount?: number;
}

// ============================================================================
// INTERFACES PARA OPERACIONES CRUD
// ============================================================================

export interface CreateEventData {
  title: string;
  description?: string;
  type: EventType;
  category?: EventCategory;
  startDate: Date | string;
  endDate: Date | string;
  allDay?: boolean;
  timezone?: string;
  attendees?: Array<{
    user?: string;
    email?: string;
  }>;
  location?: EventLocation;
  reminders?: Array<{
    type?: ReminderType;
    minutesBefore: number;
  }>;
  priority?: EventPriority;
  visibility?: EventVisibility;
  color?: string;
  tags?: string[];
  notes?: string;
  relatedTo?: EventRelatedTo;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  type?: EventType;
  category?: EventCategory;
  startDate?: Date | string;
  endDate?: Date | string;
  allDay?: boolean;
  timezone?: string;
  attendees?: Array<{
    user?: string;
    email?: string;
  }>;
  location?: EventLocation;
  reminders?: Array<{
    type?: ReminderType;
    minutesBefore: number;
  }>;
  status?: EventStatus;
  priority?: EventPriority;
  visibility?: EventVisibility;
  color?: string;
  tags?: string[];
  notes?: string;
  outcome?: string;
  relatedTo?: EventRelatedTo;
}

// ============================================================================
// FILTROS Y PAGINACIÓN
// ============================================================================

export interface EventFilters {
  type?: EventType | 'all';
  status?: EventStatus | 'all';
  priority?: EventPriority | 'all';
  category?: EventCategory | 'all';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EventPagination {
  current: number;
  total: number;
  count: number;
  totalRecords: number;
}

// ============================================================================
// RESPUESTAS DE API
// ============================================================================

export interface EventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

export interface EventListResponse {
  success: boolean;
  data: Event[];
  pagination?: EventPagination;
  count?: number;
  message?: string;
}

export interface EventStatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: {
      scheduled: number;
      in_progress: number;
      completed: number;
      cancelled: number;
    };
    byType: {
      meeting: number;
      appointment: number;
      reminder: number;
      event: number;
    };
    byPriority: {
      low: number;
      medium: number;
      high: number;
      urgent: number;
    };
    thisMonth: number;
    today: number;
  };
}

// ============================================================================
// INTERFACES PARA ACCIONES ESPECÍFICAS
// ============================================================================

export interface AddAttendeeData {
  userId?: string;
  email?: string;
}

export interface RespondInvitationData {
  status: AttendeeStatus;
}

export interface AddReminderData {
  type?: ReminderType;
  minutesBefore: number;
}

export interface UpdateStatusData {
  status: EventStatus;
  outcome?: string;
  cancelReason?: string;
}

// ============================================================================
// TIPOS PARA COMPONENTES UI
// ============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type: EventType;
  status: EventStatus;
  priority: EventPriority;
  allDay: boolean;
}

export interface EventFormValues {
  title: string;
  description: string;
  type: EventType;
  category: EventCategory;
  startDate: Date | null;
  endDate: Date | null;
  allDay: boolean;
  timezone: string;
  location: EventLocation;
  priority: EventPriority;
  visibility: EventVisibility;
  color: string;
  tags: string[];
  notes: string;
  attendees: Array<{ user?: string; email?: string }>;
  reminders: Array<{ type: ReminderType; minutesBefore: number }>;
}

// ============================================================================
// CONSTANTES Y OPCIONES
// ============================================================================

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'meeting', label: 'Reunión' },
  { value: 'appointment', label: 'Cita' },
  { value: 'reminder', label: 'Recordatorio' },
  { value: 'event', label: 'Evento' }
];

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'interno', label: 'Interno' },
  { value: 'personal', label: 'Personal' },
  { value: 'otro', label: 'Otro' }
];

export const EVENT_STATUSES: { value: EventStatus; label: string; color: string }[] = [
  { value: 'scheduled', label: 'Programado', color: 'blue' },
  { value: 'in_progress', label: 'En Progreso', color: 'yellow' },
  { value: 'completed', label: 'Completado', color: 'green' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' }
];

export const EVENT_PRIORITIES: { value: EventPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baja', color: 'gray' },
  { value: 'medium', label: 'Media', color: 'blue' },
  { value: 'high', label: 'Alta', color: 'orange' },
  { value: 'urgent', label: 'Urgente', color: 'red' }
];

export const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: 'none', label: 'Sin ubicación' },
  { value: 'physical', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'phone', label: 'Telefónica' }
];

export const REMINDER_TYPES: { value: ReminderType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'system', label: 'Sistema' },
  { value: 'push', label: 'Push' }
];

export const REMINDER_PRESETS: { value: number; label: string }[] = [
  { value: 5, label: '5 minutos antes' },
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 120, label: '2 horas antes' },
  { value: 1440, label: '1 día antes' },
  { value: 2880, label: '2 días antes' }
];
