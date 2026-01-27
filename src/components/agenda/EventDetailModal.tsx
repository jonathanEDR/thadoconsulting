/**
 * Modal de Detalle de Evento
 * Muestra toda la información del evento con opciones de edición y eliminación
 */

import React from 'react';
import { Button } from '../UI';
import { StatusBadge, PriorityBadge, TypeBadge, CategoryBadge } from './EventBadges';
import type { Event } from '../../types/event';

interface EventDetailModalProps {
  show: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onStatusChange?: (eventId: string, status: Event['status']) => void;
  isLoading?: boolean;
}

/**
 * 👁️ Modal de detalle de evento
 */
const EventDetailModal: React.FC<EventDetailModalProps> = ({
  show,
  onClose,
  event,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading = false
}) => {
  if (!show || !event) return null;

  // ========================================
  // FORMATEO
  // ========================================
  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = () => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (duration < 60) {
      return `${duration} minutos`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours} hora${hours > 1 ? 's' : ''} y ${minutes} minutos` : `${hours} hora${hours > 1 ? 's' : ''}`;
  };

  const getTimeUntil = () => {
    const now = new Date();
    const start = new Date(event.startDate);
    const diff = start.getTime() - now.getTime();
    
    if (diff < 0) {
      return 'Ya comenzó';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `En ${days} día${days > 1 ? 's' : ''} ${hours > 0 ? `y ${hours}h` : ''}`;
    }
    if (hours > 0) {
      return `En ${hours} hora${hours > 1 ? 's' : ''}`;
    }
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `En ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  };

  // ========================================
  // HANDLERS
  // ========================================
  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`¿Estás seguro de eliminar "${event.title}"?\n\nEsta acción no se puede deshacer.`)) {
      onDelete(event);
      onClose();
    }
  };

  const handleStatusChange = (newStatus: Event['status']) => {
    if (onStatusChange) {
      onStatusChange(event._id, newStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header con color del evento */}
          <div 
            className="h-2 rounded-t-lg"
            style={{ backgroundColor: event.color }}
          />

          <div className="p-6">
            {/* Título y acciones */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <TypeBadge type={event.type} />
                  <StatusBadge status={event.status} />
                  <PriorityBadge priority={event.priority} />
                  <CategoryBadge category={event.category} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 ml-4"
              >
                ✕
              </button>
            </div>

            {/* Descripción */}
            {event.description && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Información principal */}
            <div className="space-y-4 mb-6">
              {/* Fecha y hora */}
              <div className="flex items-start gap-3">
                <div className="text-2xl">📅</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Fecha y hora
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDateTime(event.startDate)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Hasta: {formatDateTime(event.endDate)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {formatDuration()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      • {getTimeUntil()}
                    </span>
                  </div>
                </div>
              </div>

              {event.location && event.location.address && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📍</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Ubicación
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {event.location.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Duración */}
              <div className="flex items-start gap-3">
                <div className="text-2xl">⏱️</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Duración
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDuration()}
                  </p>
                </div>
              </div>

              {/* Todo el día */}
              {event.allDay && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔄</div>
                  <div className="flex-1">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 
                                 text-sm rounded-full">
                      Todo el día
                    </span>
                  </div>
                </div>
              )}

              {/* Asistentes */}
              {event.attendees && event.attendees.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👥</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Asistentes ({event.attendees.length})
                    </p>
                    <div className="space-y-2">
                      {event.attendees.map((attendee, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                      {attendee.user && attendee.user.email && attendee.user.firstName ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 
                                        flex items-center justify-center text-purple-600 dark:text-purple-300">
                            {attendee.user.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {attendee.user.firstName} {attendee.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {attendee.user.email}
                            </p>
                          </div>
                        </>
                      ) : attendee.email ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 
                                        flex items-center justify-center text-gray-600 dark:text-gray-300">
                            ?
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {attendee.email}
                            </p>
                          </div>
                        </>
                      ) : null}
                          <span className={`ml-auto text-xs px-2 py-1 rounded ${
                            attendee.status === 'accepted' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : attendee.status === 'declined'
                              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {attendee.status === 'accepted' ? '✓ Aceptó' : 
                             attendee.status === 'declined' ? '✗ Rechazó' : 
                             '? Pendiente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notas */}
              {event.notes && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📝</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Notas
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                      {event.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Creado:</span>{' '}
                    {new Date(event.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  {event.updatedAt && (
                    <div>
                      <span className="font-medium">Actualizado:</span>{' '}
                      {new Date(event.updatedAt).toLocaleDateString('es-ES')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cambio rápido de estado */}
            {onStatusChange && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Cambiar estado:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange('scheduled')}
                    disabled={event.status === 'scheduled'}
                    className="px-3 py-1.5 text-sm rounded-lg transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300
                             hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    📅 Programado
                  </button>
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={event.status === 'in_progress'}
                    className="px-3 py-1.5 text-sm rounded-lg transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300
                             hover:bg-yellow-200 dark:hover:bg-yellow-800"
                  >
                    ⏳ En Progreso
                  </button>
                  <button
                    onClick={() => handleStatusChange('completed')}
                    disabled={event.status === 'completed'}
                    className="px-3 py-1.5 text-sm rounded-lg transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300
                             hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    ✅ Completado
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={event.status === 'cancelled'}
                    className="px-3 py-1.5 text-sm rounded-lg transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300
                             hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    ❌ Cancelado
                  </button>
                </div>
              </div>
            )}

            {/* Footer con acciones */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                {onDelete && (
                  <Button
                    onClick={handleDelete}
                    variant="danger"
                    disabled={isLoading}
                  >
                    🗑️ Eliminar
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Cerrar
                </Button>
                {onEdit && (
                  <Button
                    onClick={handleEdit}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    ✏️ Editar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
