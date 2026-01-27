/**
 * SessionList Component
 * Lista de conversaciones/sesiones en el sidebar
 * 
 * Features:
 * - Lista scrolleable de sesiones
 * - Búsqueda y filtros
 * - Indicador de sesión activa
 * - Acciones rápidas (pin, delete)
 */

import React, { useState } from 'react';
import { 
  Search, 
  MessageSquarePlus, 
  Pin, 
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { ChatSession } from '../../types/scutiAI.types';

interface SessionListProps {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  onNewSession: () => void;
  onDeleteSession?: (sessionId: string) => void;
  loading?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  activeSession,
  onSelectSession,
  onNewSession,
  loading,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffInHours = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return sessionDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else if (diffInHours < 168) {
      return sessionDate.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      return sessionDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getLastMessagePreview = (session: ChatSession) => {
    if (session.messages.length === 0) return 'Nueva conversación';
    const lastMsg = session.messages[session.messages.length - 1];
    return lastMsg.content.substring(0, 60) + (lastMsg.content.length > 60 ? '...' : '');
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-full'}`}>
      {isCollapsed ? (
        // Vista colapsada - Solo iconos
        <div className="flex flex-col items-center h-full py-3 gap-3">
          {/* Botón nueva conversación */}
          <button
            onClick={onNewSession}
            className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Nueva Conversación"
          >
            <MessageSquarePlus size={16} />
          </button>

          {/* Indicadores de conversaciones */}
          <div className="flex-1 w-full overflow-y-auto flex flex-col items-center gap-2 px-1">
            {sessions.slice(0, 10).map((session) => (
              <button
                key={session.sessionId}
                onClick={() => onSelectSession(session)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  activeSession?.sessionId === session.sessionId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={session.title || 'Nueva conversación'}
              >
                {session.messages.length}
              </button>
            ))}
          </div>

          {/* Botón expandir */}
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Expandir panel"
          >
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      ) : (
        // Vista expandida - Lista completa
        <>
      {/* Header - Acciones */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        {/* Botón nueva conversación con botón colapsar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewSession}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <MessageSquarePlus size={16} />
            Nueva Conversación
          </button>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0 border border-gray-200 dark:border-gray-700"
              title="Colapsar panel"
            >
              <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Búsqueda - Solo si hay más de 5 conversaciones */}
        {sessions.length > 5 && (
          <div className="mt-2 relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-md text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Lista de sesiones */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Cargando...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 dark:text-gray-600 mb-2">
              <MessageSquarePlus size={32} className="mx-auto" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Sin resultados' : 'Sin conversaciones'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredSessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => onSelectSession(session)}
                className={`p-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  activeSession?.sessionId === session.sessionId
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-1 flex-1">
                    {session.title || 'Nueva conversación'}
                  </h3>
                  {session.pinned && (
                    <Pin size={12} className="text-blue-600 flex-shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-1.5">
                  {getLastMessagePreview(session)}
                </p>

                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock size={10} />
                    <span>{formatDate(session.updatedAt || session.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-[10px]">
                      {session.messages.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer compacto */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          {filteredSessions.length} conversación{filteredSessions.length !== 1 ? 'es' : ''}
        </p>
      </div>
        </>
      )}
    </div>
  );
};

export default SessionList;
