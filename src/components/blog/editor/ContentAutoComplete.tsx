/**
 * ✨ ContentAutoComplete Component
 * Muestra sugerencias de autocompletado mientras el usuario escribe
 */

import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { type AutoCompleteSuggestion } from '../../../hooks/ai/useAutoComplete';

interface ContentAutoCompleteProps {
  suggestion: AutoCompleteSuggestion | null;
  isVisible: boolean;
  isGenerating: boolean;
  onAccept: () => void;
  onReject: () => void;
  position?: { top: number; left: number };
}

export const ContentAutoComplete: React.FC<ContentAutoCompleteProps> = ({
  suggestion,
  isVisible,
  isGenerating,
  onAccept,
  onReject,
  position: _position // Prefijo _ indica que se ignora intencionalmente
}) => {
  if (!isVisible || !suggestion) return null;

  return (
    <>
      {/* Fondo semi-transparente */}
      <div className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in duration-200" />
      
      {/* Modal centrado */}
      <div
        className="fixed z-[9999] animate-in fade-in-50 slide-in-from-top-2 duration-300"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '800px',
          width: '95vw'
        }}
      >
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 border-4 border-purple-500 dark:border-purple-400 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              Sugerencia del Asistente IA
            </span>
          </div>
          
          {isGenerating && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-150"></div>
            </div>
          )}
        </div>

        {/* Suggestion Text - MÁS VISIBLE */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-purple-300 dark:border-purple-600 shadow-lg">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-2 uppercase tracking-wide">
            💡 Sugerencia de continuación:
          </div>
          <blockquote className="text-base text-gray-800 dark:text-gray-200 leading-relaxed font-medium italic border-l-4 border-purple-500 pl-4">
            "{suggestion.text}"
          </blockquote>
        </div>

        {/* Actions - BOTONES MÁS GRANDES */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onAccept}
            className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            title="Presiona Tab para aceptar"
          >
            <Check className="w-6 h-6" />
            ✅ ACEPTAR SUGERENCIA
            <kbd className="px-3 py-1 text-sm bg-green-700 rounded-lg">Tab</kbd>
          </button>
          
          <button
            onClick={onReject}
            className="flex items-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            title="Presiona Esc para rechazar"
          >
            <X className="w-6 h-6" />
            ❌ RECHAZAR
            <kbd className="px-3 py-1 text-sm bg-red-600 rounded-lg">Esc</kbd>
          </button>
        </div>

          {/* Confidence indicator */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Confianza:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-3 rounded-sm ${
                    i <= Math.round(suggestion.confidence * 5)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">
              {Math.round(suggestion.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentAutoComplete;
