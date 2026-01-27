/**
 * Badges para eventos
 * Componentes visuales para tipo, estado, prioridad, etc.
 */

import React from 'react';
import type { EventType, EventStatus, EventPriority, EventCategory, LocationType } from '../../types/event';

// ============================================================================
// BADGE DE TIPO DE EVENTO
// ============================================================================

interface TypeBadgeProps {
  type: EventType;
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '' }) => {
  const styles: Record<EventType, { bg: string; text: string; label: string; icon: string }> = {
    meeting: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Reunión', icon: '👥' },
    appointment: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Cita', icon: '📅' },
    reminder: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', label: 'Recordatorio', icon: '⏰' },
    event: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Evento', icon: '🎉' }
  };

  const style = styles[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
};

// ============================================================================
// BADGE DE ESTADO
// ============================================================================

interface StatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const styles: Record<EventStatus, { bg: string; text: string; label: string; icon: string }> = {
    scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Programado', icon: '📌' },
    in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', label: 'En Progreso', icon: '🔄' },
    completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Completado', icon: '✅' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Cancelado', icon: '❌' }
  };

  const style = styles[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
};

// ============================================================================
// BADGE DE PRIORIDAD
// ============================================================================

interface PriorityBadgeProps {
  priority: EventPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const styles: Record<EventPriority, { bg: string; text: string; label: string; icon: string }> = {
    low: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', label: 'Baja', icon: '⬇️' },
    medium: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Media', icon: '➡️' },
    high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', label: 'Alta', icon: '⬆️' },
    urgent: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Urgente', icon: '🔥' }
  };

  const style = styles[priority];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
};

// ============================================================================
// BADGE DE CATEGORÍA
// ============================================================================

interface CategoryBadgeProps {
  category: EventCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  const styles: Record<EventCategory, { bg: string; text: string; label: string }> = {
    cliente: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', label: 'Cliente' },
    interno: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Interno' },
    personal: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', label: 'Personal' },
    otro: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', label: 'Otro' }
  };

  const style = styles[category];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      {style.label}
    </span>
  );
};

// ============================================================================
// BADGE DE UBICACIÓN
// ============================================================================

interface LocationBadgeProps {
  locationType: LocationType;
  className?: string;
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({ locationType, className = '' }) => {
  const styles: Record<LocationType, { bg: string; text: string; label: string; icon: string }> = {
    none: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', label: 'Sin ubicación', icon: '📍' },
    physical: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Presencial', icon: '🏢' },
    virtual: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Virtual', icon: '💻' },
    phone: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Telefónica', icon: '📞' }
  };

  const style = styles[locationType];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
};

// ============================================================================
// BADGE SIMPLE CON COLOR PERSONALIZADO
// ============================================================================

interface ColorBadgeProps {
  color: string;
  label: string;
  className?: string;
}

export const ColorBadge: React.FC<ColorBadgeProps> = ({ color, label, className = '' }) => {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: `${color}20`, color: color }}
    >
      {label}
    </span>
  );
};

// ============================================================================
// BADGE DE TIEMPO
// ============================================================================

interface TimeBadgeProps {
  date: Date | string;
  className?: string;
}

export const TimeBadge: React.FC<TimeBadgeProps> = ({ date, className = '' }) => {
  const eventDate = new Date(date);
  const now = new Date();
  const isToday = eventDate.toDateString() === now.toDateString();
  const isPast = eventDate < now;
  const isTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString() === eventDate.toDateString();

  let style = {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    label: eventDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  };

  if (isToday) {
    style = {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      label: 'Hoy'
    };
  } else if (isTomorrow) {
    style = {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      label: 'Mañana'
    };
  } else if (isPast) {
    style = {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      label: eventDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    };
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      🕐 {style.label}
    </span>
  );
};
