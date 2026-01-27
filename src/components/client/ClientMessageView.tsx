/**
 * 💬 CLIENT MESSAGE VIEW - Vista Timeline de Mensajes
 * Componente reutilizable para mostrar mensajes en formato timeline
 */

import { useState } from 'react';
import type { LeadMessage } from '../../types/message.types';
import { useFilterPrivateMessages } from '../guards/PrivateMessageGuard';

interface ClientMessageViewProps {
  messages: LeadMessage[];
  leadId?: string;
  onReply?: (messageId: string, contenido: string) => Promise<void>;
  onMarkAsRead?: (messageId: string) => Promise<void>;
  showQuickReply?: boolean;
  compact?: boolean;
}

export default function ClientMessageView({
  messages,
  leadId,
  onReply,
  onMarkAsRead,
  showQuickReply = true,
  compact = false,
}: ClientMessageViewProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar mensajes según permisos del usuario (hook con guard de seguridad)
  const filteredMessages = useFilterPrivateMessages(messages);

  // Helper para obtener badge de tipo de mensaje
  const getTipoMensajeBadge = (tipo: LeadMessage['tipo']) => {
    const badges: Record<string, { label: string; color: string }> = {
      nota_interna: { label: '🔒 Privado', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
      mensaje_cliente: { label: '� Mensaje', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      respuesta_cliente: { label: '↩️ Respuesta', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      email: { label: '📧 Email', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      sms: { label: '📱 SMS', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
      notificacion: { label: '� Notificación', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    };
    return badges[tipo] || badges.mensaje_cliente;
  };

  // Helper para formatear fecha
  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return messageDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handler para enviar respuesta
  const handleSubmitReply = async (messageId: string) => {
    if (!replyContent.trim() || !onReply || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onReply(messageId, replyContent.trim());
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      alert('Error al enviar la respuesta. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para marcar como leído
  const handleMarkAsRead = async (messageId: string) => {
    if (!onMarkAsRead) return;
    try {
      await onMarkAsRead(messageId);
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  if (filteredMessages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No hay mensajes
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {leadId
            ? 'Aún no hay mensajes en este proyecto.'
            : 'Cuando el equipo te envíe mensajes, aparecerán aquí.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredMessages.map((message) => {
        const badge = getTipoMensajeBadge(message.tipo);
        const isReplying = replyingTo === message._id;

        return (
          <div
            key={message._id}
            className={`${
              compact ? 'p-4' : 'p-6'
            } bg-white dark:bg-gray-800 rounded-lg border ${
              !message.leido
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
                : 'border-gray-200 dark:border-gray-700'
            } hover:shadow-md transition-shadow`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Avatar del autor */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {message.autor.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {message.autor.nombre}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                    {!message.leido && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Asunto (si existe) */}
            {message.asunto && (
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📎 {message.asunto}
                </span>
              </div>
            )}

            {/* Contenido */}
            <div className={`text-gray-700 dark:text-gray-300 ${compact ? 'text-sm' : ''} whitespace-pre-wrap`}>
              {message.contenido}
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!message.leido && onMarkAsRead && (
                <button
                  onClick={() => handleMarkAsRead(message._id)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ✓ Marcar como leído
                </button>
              )}
              {showQuickReply && onReply && (
                <button
                  onClick={() => setReplyingTo(isReplying ? null : message._id)}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {isReplying ? '✕ Cancelar' : '↩️ Responder'}
                </button>
              )}
            </div>

            {/* Formulario de respuesta rápida */}
            {isReplying && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  rows={3}
                  maxLength={10000}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {replyContent.length} / 10,000 caracteres
                  </span>
                  <button
                    onClick={() => handleSubmitReply(message._id)}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {isSubmitting ? '⏳ Enviando...' : '📤 Enviar Respuesta'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
