/**
 * 📜 MESSAGE TIMELINE - Timeline de Mensajes
 * Componente para mostrar el historial completo de mensajes de un lead
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageCard } from './MessageCard';
import type { LeadMessage, MessageFilters } from '../../../types/message.types';
import { groupMessagesByDate } from '../../../services/messageService';

interface MessageTimelineProps {
  leadId: string;
  messages: LeadMessage[];
  loading?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onReply?: (messageId: string) => void;
  onMarkAsRead?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  filters?: MessageFilters;
  emptyMessage?: string;
  canReply?: boolean;
  canDelete?: boolean;
  canViewPrivate?: boolean;
  hasMore?: boolean;
}

/**
 * 🎨 Componente MessageTimeline
 */
export const MessageTimeline: React.FC<MessageTimelineProps> = ({
  messages,
  loading = false,
  onLoadMore,
  onRefresh,
  onReply,
  onMarkAsRead,
  onDelete,
  filters,
  emptyMessage = 'No hay mensajes aún',
  canReply = true,
  canDelete = false,
  canViewPrivate = false,
  hasMore = false,
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ========================================
  // 🔄 INFINITE SCROLL
  // ========================================

  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loading, isLoadingMore, hasMore]);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleLoadMore = async () => {
    if (isLoadingMore || loading || !onLoadMore) return;
    
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Error cargando más mensajes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      try {
        await onRefresh();
        // Scroll to top después de refrescar
        if (timelineRef.current) {
          timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Error refrescando mensajes:', error);
      }
    }
  };

  // ========================================
  // 📊 PROCESAMIENTO DE DATOS
  // ========================================

  // Filtrar mensajes privados si el usuario no puede verlos
  const visibleMessages = canViewPrivate
    ? messages
    : messages.filter((m) => !m.esPrivado);

  // Agrupar mensajes por fecha
  const groupedMessages = groupMessagesByDate(visibleMessages);
  const dates = Object.keys(groupedMessages).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Contar mensajes no leídos
  const unreadCount = visibleMessages.filter((m) => !m.leido).length;

  // Separar mensajes privados y públicos
  const privateCount = messages.filter((m) => m.esPrivado).length;
  const publicCount = messages.length - privateCount;

  // ========================================
  // 🎨 RENDER - EMPTY STATE
  // ========================================

  if (!loading && visibleMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
          {filters?.search
            ? 'No se encontraron mensajes con los criterios de búsqueda'
            : 'Comienza una conversación enviando el primer mensaje'}
        </p>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Actualizar
          </button>
        )}
      </div>
    );
  }

  // ========================================
  // 🎨 RENDER - TIMELINE
  // ========================================

  return (
    <div className="flex flex-col h-full">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-4">
          {/* Total mensajes */}
          <div className="text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              {visibleMessages.length}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              {visibleMessages.length === 1 ? 'mensaje' : 'mensajes'}
            </span>
          </div>

          {/* No leídos */}
          {unreadCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                🔔 {unreadCount} sin leer
              </span>
            </div>
          )}

          {/* Públicos/Privados */}
          {canViewPrivate && privateCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>📢 {publicCount} públicos</span>
              <span>•</span>
              <span>🔒 {privateCount} privados</span>
            </div>
          )}
        </div>

        {/* Botón refresh */}
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Actualizar mensajes"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span>
          </button>
        )}
      </div>

      {/* Timeline scrollable */}
      <div
        ref={timelineRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {/* Loading inicial */}
        {loading && visibleMessages.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-4xl mb-2 animate-bounce">💬</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cargando mensajes...
              </p>
            </div>
          </div>
        )}

        {/* Mensajes agrupados por fecha */}
        {dates.map((date) => (
          <div key={date} className="space-y-4">
            {/* Separador de fecha */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  📅 {date}
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Mensajes del día */}
            <div className="space-y-3">
              {groupedMessages[date].map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onReply={onReply}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  canReply={canReply}
                  canDelete={canDelete}
                  canViewPrivate={canViewPrivate}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Indicador de carga para load more */}
        {hasMore && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center py-4"
          >
            {isLoadingMore && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="animate-pulse">Cargando más mensajes...</span>
              </div>
            )}
          </div>
        )}

        {/* Fin del timeline */}
        {!hasMore && visibleMessages.length > 0 && (
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Inicio de la conversación
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer con filtros activos */}
      {filters && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-wrap gap-2 text-xs">
            {filters.tipo && filters.tipo !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                Tipo: {filters.tipo}
              </span>
            )}
            {filters.leido !== undefined && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                {filters.leido ? 'Leídos' : 'No leídos'}
              </span>
            )}
            {filters.search && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                Búsqueda: "{filters.search}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageTimeline;
