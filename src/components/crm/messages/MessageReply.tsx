/**
 * ↩️ MESSAGE REPLY - Responder Mensaje
 * Componente compacto para responder a un mensaje específico
 */

import React, { useState, useRef, useEffect } from 'react';
import type { LeadMessage } from '../../../types/message.types';
import { MESSAGE_CONSTANTS } from '../../../types/message.types';
import { validateMessageContent, formatRelativeTime } from '../../../services/messageService';

interface MessageReplyProps {
  originalMessage: LeadMessage;
  onReply: (content: string, isPrivate?: boolean) => Promise<void>;
  onCancel: () => void;
  canMakePrivate?: boolean;
  autoFocus?: boolean;
}

/**
 * 🎨 Componente MessageReply
 */
export const MessageReply: React.FC<MessageReplyProps> = ({
  originalMessage,
  onReply,
  onCancel,
  canMakePrivate = false,
  autoFocus = true,
}) => {
  const [contenido, setContenido] = useState('');
  const [esPrivado, setEsPrivado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ========================================
  // 🔄 EFECTOS
  // ========================================

  // Auto-focus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [contenido]);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar contenido
    const validation = validateMessageContent(
      contenido,
      MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH
    );
    if (!validation.valid) {
      setError(validation.error || 'Error de validación');
      return;
    }

    setIsSubmitting(true);

    try {
      await onReply(contenido.trim(), esPrivado);
      // Reset después de envío exitoso
      setContenido('');
      setEsPrivado(false);
      setError(null);
    } catch (err: any) {
      console.error('Error respondiendo mensaje:', err);
      setError(err.message || 'Error al enviar la respuesta');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContenido('');
    setError(null);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter o Cmd+Enter para enviar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Escape para cancelar
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // ========================================
  // 📊 HELPERS
  // ========================================

  const caracteresRestantes = MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH - contenido.length;
  const porcentajeUsado = (contenido.length / MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH) * 100;

  // Truncar mensaje original para preview
  const originalPreview =
    originalMessage.contenido.length > 150
      ? originalMessage.contenido.substring(0, 150) + '...'
      : originalMessage.contenido;

  // ========================================
  // 🎨 RENDER
  // ========================================

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-blue-300 dark:border-blue-700 p-4 space-y-3 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>↩️</span>
            Responder a {originalMessage.autor.nombre}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {formatRelativeTime(originalMessage.createdAt)}
          </p>
        </div>
        
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Cancelar"
        >
          <span className="text-xl">✖</span>
        </button>
      </div>

      {/* Quote del mensaje original */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-l-4 border-blue-500 rounded">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
          <span>💬</span>
          Mensaje original:
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
          "{originalPreview}"
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Textarea */}
        <div>
          <textarea
            ref={textareaRef}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu respuesta... (Ctrl+Enter para enviar)"
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none disabled:opacity-50 text-sm"
            style={{ minHeight: '80px', maxHeight: '200px' }}
          />

          {/* Contador */}
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {contenido.length} / {MESSAGE_CONSTANTS.MAX_CONTENT_LENGTH}
            </div>
            {porcentajeUsado > 80 && (
              <div
                className={`text-xs font-medium ${
                  porcentajeUsado > 95 ? 'text-red-600' : 'text-orange-600'
                }`}
              >
                {caracteresRestantes} restantes
              </div>
            )}
          </div>
        </div>

        {/* Opciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Toggle privado */}
            {canMakePrivate && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esPrivado}
                  onChange={(e) => setEsPrivado(e.target.checked)}
                  disabled={isSubmitting}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {esPrivado ? '🔒 Respuesta privada' : '📢 Respuesta pública'}
                </span>
              </label>
            )}

            {/* Hint de shortcut */}
            <span className="text-xs text-gray-400 dark:text-gray-500">
              💡 Ctrl+Enter para enviar
            </span>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !contenido.trim()}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Enviando...
                </>
              ) : (
                <>
                  <span>↩️</span>
                  Responder
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageReply;
