/**
 * 🚀 AutoCompleteBasicInfoButton - Botón inteligente para autocompletar información básica
 * 
 * Características:
 * ✅ Diseño pequeño y sutil
 * ✅ Detecta si hay contenido existente y cambia el texto
 * ✅ Mejora contenido existente o genera nuevo
 * ✅ Loading state minimalista
 */

import React from 'react';
import { Sparkles, Zap, RefreshCw } from 'lucide-react';

interface AutoCompleteBasicInfoButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  hasServiceId?: boolean;
  // ✅ NUEVAS PROPS para detectar contenido existente
  currentTitle?: string;
  currentShortDescription?: string;
  currentDescription?: string;
}

const AutoCompleteBasicInfoButton: React.FC<AutoCompleteBasicInfoButtonProps> = ({
  onClick,
  isLoading,
  disabled = false,
  hasServiceId = false,
  currentTitle = '',
  currentShortDescription = '',
  currentDescription = ''
}) => {
  // 🔍 Detectar si hay contenido existente
  const hasExistingContent = Boolean(
    currentTitle?.trim() || 
    currentShortDescription?.trim() || 
    currentDescription?.trim()
  );

  // 🎯 Determinar icono según acción
  const ActionIcon = hasExistingContent ? RefreshCw : Zap;

  // Determinar si el botón debe estar deshabilitado
  const isDisabled = disabled || !hasServiceId || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 text-sm
        bg-gradient-to-r ${hasExistingContent 
          ? 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
          : 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
        }
        text-white font-medium rounded-lg
        shadow-sm hover:shadow-md
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 ${hasExistingContent ? 'focus:ring-blue-500' : 'focus:ring-purple-500'}
        transform hover:scale-105 active:scale-95
        border ${hasExistingContent ? 'border-blue-400/30' : 'border-purple-400/30'}
        ${isLoading ? 'animate-pulse' : ''}
      `}
      title={
        !hasServiceId 
          ? 'Guarda el servicio primero' 
          : hasExistingContent
            ? 'Mejorar información existente con IA'
            : 'Generar información básica con IA'
      }
    >
      {isLoading ? (
        <>
          <div className="animate-spin">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>{hasExistingContent ? 'Mejorando...' : 'Generando...'}</span>
        </>
      ) : (
        <>
          <ActionIcon className="h-4 w-4" />
          <span>
            {hasExistingContent ? '✨ Mejorar' : '🚀 Generar'}
          </span>
        </>
      )}
    </button>
  );
};

export default AutoCompleteBasicInfoButton;