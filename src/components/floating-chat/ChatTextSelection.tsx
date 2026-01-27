/**
 * ChatTextSelection Component
 * Permite seleccionar texto en las burbujas del chat y enviarlo como mensaje
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';

interface ChatTextSelectionProps {
  onSendMessage: (message: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatTextSelection: React.FC<ChatTextSelectionProps> = ({
  onSendMessage,
  containerRef
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Detectar selección de texto
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!containerRef.current) return;

      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      
      // Solo mostrar si hay texto seleccionado (mínimo 3 caracteres)
      if (text.length >= 3) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          // Verificar que la selección esté dentro del contenedor del chat
          const containerRect = containerRef.current.getBoundingClientRect();
          if (
            rect.top >= containerRect.top &&
            rect.bottom <= containerRect.bottom &&
            rect.left >= containerRect.left &&
            rect.right <= containerRect.right
          ) {
            setSelectedText(text);
            setMenuPosition({
              x: rect.left + rect.width / 2,
              y: rect.top - 10 // Posicionar arriba del texto
            });
            setIsVisible(true);
            
            // Cancelar cualquier timeout de ocultación pendiente
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
          }
        }
      } else {
        // Ocultar con delay para permitir hacer clic en el menú
        hideTimeoutRef.current = window.setTimeout(() => {
          setIsVisible(false);
          setSelectedText('');
        }, 200);
      }
    };

    // Escuchar cambios de selección
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [containerRef]);

  // Manejar clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        setSelectedText('');
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const handleSend = () => {
    if (selectedText) {
      onSendMessage(selectedText);
      setIsVisible(false);
      setSelectedText('');
      
      // Limpiar selección
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
  };

  // Prevenir que el menú se oculte al interactuar con él
  const handleMenuMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  if (!isVisible || !selectedText) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-2"
      style={{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        transform: 'translate(-50%, -100%)'
      }}
      onMouseEnter={handleMenuMouseEnter}
    >
      <div className="flex items-center gap-2">
        {/* Texto seleccionado (preview corto) */}
        <div className="flex-1 min-w-0 px-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Enviar texto seleccionado:
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-[200px]">
            "{selectedText.length > 40 
              ? selectedText.substring(0, 40) + '...' 
              : selectedText}"
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-1">
          {/* Botón enviar */}
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
            title="Enviar texto seleccionado"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Enviar</span>
          </button>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Cancelar"
          >
            <X size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTextSelection;
