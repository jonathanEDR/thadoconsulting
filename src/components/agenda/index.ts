/**
 * Exportaciones centralizadas del módulo de Agenda
 */

export { default as EventFormModal } from './EventFormModal';
export { default as EventDetailModal } from './EventDetailModal';
export { default as EventStats } from './EventStats';
export { default as CalendarView } from './CalendarView';
export { default as DayView } from './DayView';

// Re-exportar badges individuales
export { 
  StatusBadge, 
  PriorityBadge, 
  TypeBadge, 
  CategoryBadge, 
  LocationBadge, 
  ColorBadge,
  TimeBadge 
} from './EventBadges';
