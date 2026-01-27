/**
 * ChatInput Component
 * Input area para escribir y enviar mensajes
 * 
 * Features:
 * - Textarea con auto-resize
 * - Shortcuts de teclado (Enter para enviar, Shift+Enter para nueva línea)
 * - Botón de envío con loading state
 * - Diseño compacto optimizado para maximizar espacio de contenido
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  selectedCategory?: any; // Mantenido por compatibilidad pero no usado
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  loading = false,
  placeholder = 'Escribe tu mensaje a THADO AI...',
  selectedCategory = null // eslint-disable-line
}) => {
  // Evitar warning de variable no usada
  void selectedCategory;
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Focus en el textarea al montar
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || loading) return;

    onSend(message.trim());
    setMessage('');

    // Reset altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sin Shift = enviar
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Input Form - COMPACTO responsivo para móvil */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-3">
        <div className="flex gap-2 items-end">
          {/* Textarea compacto responsivo */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || loading}
              rows={1}
              className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
              style={{ 
                minHeight: '40px', 
                maxHeight: '120px', // Reducido para móvil 
                fontSize: window.innerWidth < 640 ? '16px' : '14px' // Evitar zoom en iOS
              }}
            />
          </div>

          {/* Send Button compacto responsivo */}
          <button
            type="submit"
            disabled={!message.trim() || disabled || loading}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 touch-manipulation"
            title="Enviar (Enter)"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
