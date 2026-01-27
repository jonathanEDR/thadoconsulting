/**
 * 📝 InlineAutoComplete Component
 * Sistema de autocompletado integrado en el editor
 * Muestra sugerencias DENTRO del texto con colores diferenciados
 */

import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Sparkles } from 'lucide-react';

interface InlineAutoCompleteProps {
  content: string;
  suggestion: string | null;
  isGenerating: boolean;
  onContentChange: (content: string) => void;
  onAcceptSuggestion: () => void;
  onRejectSuggestion: () => void;
  onPersonalizeContent?: (action: 'expand' | 'improve' | 'seo' | 'suggest') => void;
}

export const InlineAutoComplete: React.FC<InlineAutoCompleteProps> = ({
  content,
  suggestion,
  isGenerating,
  onContentChange,
  onAcceptSuggestion,
  onRejectSuggestion,
  onPersonalizeContent
}) => {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  // Mostrar sugerencia cuando llegue
  useEffect(() => {
    if (suggestion && suggestion.length > 0) {
      setShowSuggestion(true);
    }
  }, [suggestion]);

  // Manejar teclas de acceso rápido
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSuggestion && suggestion) {
        if (e.key === 'Tab') {
          e.preventDefault();
          acceptSuggestion();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          rejectSuggestion();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestion, suggestion]);

  const acceptSuggestion = () => {
    if (suggestion && editorRef.current) {
      const newContent = content + ' ' + suggestion;
      onContentChange(newContent);
      onAcceptSuggestion();
      setShowSuggestion(false);
      
      // Actualizar el contenido del editor
      editorRef.current.textContent = newContent;
      
      // Posicionar cursor al final
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const rejectSuggestion = () => {
    onRejectSuggestion();
    setShowSuggestion(false);
  };

  // Obtener posición del cursor para botones flotantes
  const updateCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      
      setCursorPosition({
        top: rect.bottom - editorRect.top + 10,
        left: rect.left - editorRect.left
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Editor con sugerencias inline */}
      <div
        ref={editorRef}
        contentEditable
        className="w-full min-h-[400px] max-h-[800px] p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none overflow-y-auto"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
        onInput={(e) => {
          const newContent = e.currentTarget.textContent || '';
          onContentChange(newContent);
          updateCursorPosition();
        }}
        onKeyUp={updateCursorPosition}
        onClick={updateCursorPosition}
        suppressContentEditableWarning={true}
      >
        {/* Contenido ya escrito - color normal */}
        <span className="text-gray-900 dark:text-gray-100">
          {content}
        </span>
        
        {/* Sugerencia inline - color púrpura transparente */}
        {showSuggestion && suggestion && (
          <span 
            className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1 rounded animate-pulse border-l-2 border-purple-400 ml-1"
            style={{ 
              opacity: 0.7,
              fontStyle: 'italic'
            }}
          >
            {suggestion}
          </span>
        )}

        {/* Indicador de generación */}
        {isGenerating && (
          <span className="inline-flex items-center ml-2 text-purple-500">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span className="ml-1 text-sm">generando...</span>
          </span>
        )}
      </div>

      {/* Botones flotantes sutiles - solo cuando hay sugerencia */}
      {showSuggestion && suggestion && (
        <div 
          className="absolute z-50 flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-2 duration-200"
          style={{
            top: cursorPosition.top,
            left: Math.max(cursorPosition.left, 0)
          }}
        >
          {/* Botón Aceptar - sutil */}
          <button
            onClick={acceptSuggestion}
            className="flex items-center gap-1 px-2 py-1 bg-green-500/80 hover:bg-green-600 text-white text-xs font-medium rounded-md transition-all shadow-lg backdrop-blur-sm"
            title="Aceptar sugerencia (Tab)"
          >
            <Check className="w-3 h-3" />
            <span className="hidden sm:inline">Tab</span>
          </button>

          {/* Botón Rechazar - sutil */}
          <button
            onClick={rejectSuggestion}
            className="flex items-center gap-1 px-2 py-1 bg-gray-500/80 hover:bg-gray-600 text-white text-xs font-medium rounded-md transition-all shadow-lg backdrop-blur-sm"
            title="Rechazar sugerencia (Esc)"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">Esc</span>
          </button>
        </div>
      )}

      {/* Botones de personalización de contenido */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onPersonalizeContent?.('expand')}
          className="flex items-center gap-2 px-3 py-2 bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/20 dark:hover:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm rounded-lg transition-colors"
        >
          <span>📈</span>
          Expandir contenido
        </button>
        
        <button
          onClick={() => onPersonalizeContent?.('improve')}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg transition-colors"
        >
          <span>✨</span>
          Mejorar calidad
        </button>
        
        <button
          onClick={() => onPersonalizeContent?.('seo')}
          className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg transition-colors"
        >
          <span>🔍</span>
          Optimizar SEO
        </button>
        
        <button
          onClick={() => onPersonalizeContent?.('suggest')}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm rounded-lg transition-colors"
        >
          <span>💡</span>
          Sugerir ideas
        </button>
      </div>

      {/* Ayuda contextual */}
      {showSuggestion && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
          <span>💡 Sugerencia de IA disponible</span>
          <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Tab</kbd> Aceptar</span>
          <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> Rechazar</span>
        </div>
      )}
    </div>
  );
};

export default InlineAutoComplete;