/**
 * Vista de Día para Eventos
 * Muestra los eventos de un día específico en formato timeline
 */

import React, { useState, useMemo } from 'react';
import { StatusBadge, PriorityBadge, TypeBadge } from './EventBadges';
import type { Event } from '../../types/event';

interface DayViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onCreateEvent?: (date: Date) => void;
  initialDate?: Date;
}

/**
 * 📆 Vista de día con timeline de eventos
 */
const DayView: React.FC<DayViewProps> = ({
  events,
  onEventClick,
  onCreateEvent,
  initialDate = new Date()
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  // ========================================
  // UTILIDADES
  // ========================================
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getHourFromDate = (date: Date | string): number => {
    return new Date(date).getHours();
  };

  // ========================================
  // FILTRADO Y ORDENAMIENTO
  // ========================================
  const dayEvents = useMemo(() => {
    return events
      .filter(event => isSameDay(new Date(event.startDate), currentDate))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, currentDate]);

  const eventsByHour = useMemo(() => {
    const byHour: { [key: number]: Event[] } = {};
    for (let i = 0; i < 24; i++) {
      byHour[i] = [];
    }
    dayEvents.forEach(event => {
      const hour = getHourFromDate(event.startDate);
      byHour[hour].push(event);
    });
    return byHour;
  }, [dayEvents]);

  // ========================================
  // NAVEGACIÓN
  // ========================================
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = isSameDay(currentDate, new Date());

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 md:p-4">
        {/* Móvil: Layout vertical */}
        <div className="flex flex-col gap-3 md:hidden">
          {/* Navegación de fecha */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Día anterior"
            >
              ←
            </button>
            <div className="text-center flex-1">
              <h2 className="text-base font-bold text-gray-900 dark:text-white capitalize">
                {formatDate(currentDate)}
              </h2>
              {isToday && (
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Hoy
                </span>
              )}
            </div>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Día siguiente"
            >
              →
            </button>
          </div>
          {/* Botones de acción */}
          <div className="flex gap-2">
            {!isToday && (
              <button
                onClick={goToToday}
                className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 
                         dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg 
                         font-medium transition-colors text-sm"
              >
                Hoy
              </button>
            )}
            {onCreateEvent && (
              <button
                onClick={() => onCreateEvent(currentDate)}
                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                         rounded-lg font-medium transition-colors text-sm"
              >
                ➕ Nuevo
              </button>
            )}
          </div>
        </div>

        {/* Desktop: Layout horizontal */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Día anterior"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {formatDate(currentDate)}
              </h2>
              {isToday && (
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Hoy
                </span>
              )}
            </div>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Día siguiente"
            >
              →
            </button>
          </div>
          <div className="flex items-center gap-3">
            {!isToday && (
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                         text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Ir a Hoy
              </button>
            )}
            {onCreateEvent && (
              <button
                onClick={() => onCreateEvent(currentDate)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                         font-medium transition-colors"
              >
                ➕ Nuevo Evento
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resumen del día - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {dayEvents.length}
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Total
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
              {dayEvents.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Completos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {dayEvents.filter(e => e.status === 'in_progress').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              En Progreso
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {dayEvents.filter(e => e.status === 'scheduled').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Pendientes
            </div>
          </div>
        </div>
      </div>

      {/* Timeline con 2 columnas en desktop, 1 columna en móvil */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {dayEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay eventos programados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Este día está libre
            </p>
            {onCreateEvent && (
              <button
                onClick={() => onCreateEvent(currentDate)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                         font-medium transition-colors"
              >
                ➕ Crear Evento
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-gray-200 dark:divide-gray-700">
            {/* MÓVIL: Todas las 24 horas en una columna */}
            {/* DESKTOP: COLUMNA IZQUIERDA: 00:00 - 11:00 */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 12 }, (_, hour) => (
                <div key={hour} className="flex">
                  {/* Columna de hora */}
                  <div className="w-16 md:w-20 flex-shrink-0 p-2 md:p-4 text-right bg-gray-50 dark:bg-gray-900
                                border-r border-gray-200 dark:border-gray-700">
                    <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                  </div>

                  {/* Columna de eventos */}
                  <div className="flex-1 p-2 md:p-4">
                    {eventsByHour[hour].length > 0 ? (
                      <div className="space-y-2">
                        {eventsByHour[hour].map(event => (
                          <div
                            key={event._id}
                            onClick={() => onEventClick(event)}
                            className="p-3 md:p-4 border-l-4 bg-gradient-to-r from-purple-50 to-pink-50 
                                     dark:from-gray-750 dark:to-gray-900 rounded-r-lg
                                     cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.02]
                                     border border-gray-100 dark:border-gray-700"
                            style={{ borderLeftColor: event.color }}
                          >
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white mb-1 truncate">
                                  {event.title}
                                </h4>
                                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                  <span>⏰</span>
                                  <span className="truncate">{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <TypeBadge type={event.type} />
                              </div>
                            </div>

                            {event.description && (
                              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {event.description}
                              </p>
                            )}

                            {event.location && event.location.address && (
                              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <span>📍</span>
                                <span className="truncate">{event.location.address}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                              <StatusBadge status={event.status} />
                              <PriorityBadge priority={event.priority} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-8 md:h-12 flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs">
                        —
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP: COLUMNA DERECHA: 12:00 - 23:00 */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 12 }, (_, index) => {
                const hour = index + 12;
                return (
                  <div key={hour} className="flex">
                    {/* Columna de hora */}
                    <div className="w-16 md:w-20 flex-shrink-0 p-2 md:p-4 text-right bg-gray-50 dark:bg-gray-900
                                  border-r border-gray-200 dark:border-gray-700">
                      <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                    </div>

                    {/* Columna de eventos */}
                    <div className="flex-1 p-2 md:p-4">
                      {eventsByHour[hour].length > 0 ? (
                        <div className="space-y-2">
                          {eventsByHour[hour].map(event => (
                            <div
                              key={event._id}
                              onClick={() => onEventClick(event)}
                              className="p-3 md:p-4 border-l-4 bg-gradient-to-r from-purple-50 to-pink-50 
                                       dark:from-gray-750 dark:to-gray-900 rounded-r-lg
                                       cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.02]
                                       border border-gray-100 dark:border-gray-700"
                              style={{ borderLeftColor: event.color }}
                            >
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white mb-1 truncate">
                                    {event.title}
                                  </h4>
                                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                    <span>⏰</span>
                                    <span className="truncate">{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <TypeBadge type={event.type} />
                                </div>
                              </div>

                              {event.description && (
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                  {event.description}
                                </p>
                              )}

                              {event.location && event.location.address && (
                                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                  <span>📍</span>
                                  <span className="truncate">{event.location.address}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 flex-wrap">
                                <StatusBadge status={event.status} />
                                <PriorityBadge priority={event.priority} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-8 md:h-12 flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs">
                          —
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;
