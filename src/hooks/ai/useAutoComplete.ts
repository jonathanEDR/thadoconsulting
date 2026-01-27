/**
 * 🔮 useAutoComplete Hook
 * Gestiona el autocompletado inteligente mientras el usuario escribe
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useContentGeneration } from './useContentGeneration';

export interface AutoCompleteOptions {
  enabled: boolean;
  debounceMs?: number; // Tiempo de espera después de dejar de escribir
  minLength?: number; // Longitud mínima del contenido para activar
  maxLength?: number; // Longitud máxima de sugerencia
}

export interface AutoCompleteSuggestion {
  text: string;
  confidence: number;
  position: number; // Posición en el contenido donde se insertaría
}

export const useAutoComplete = (options: AutoCompleteOptions) => {
  const {
    enabled = true,
    debounceMs = 2000,
    minLength = 100
  } = options;

  const { suggestAutoComplete, isGenerating } = useContentGeneration();
  
  const [suggestion, setSuggestion] = useState<AutoCompleteSuggestion | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lastContent, setLastContent] = useState('');
  
  const debounceTimerRef = useRef<number | null>(null);
  const isGeneratingRef = useRef(false);

  /**
   * Generar sugerencia de autocompletado
   */
  const generateSuggestion = useCallback(async (
    content: string,
    context: { title: string; category?: string }
  ) => {
    // Validaciones
    if (!enabled || content.length < minLength || isGeneratingRef.current) {
      return;
    }

    // Evitar generar si el contenido no ha cambiado
    if (content === lastContent) {
      return;
    }

    try {
      isGeneratingRef.current = true;
      setLastContent(content);

      const result = await suggestAutoComplete(content, context);

      if (result && result.content) {
        const newSuggestion: AutoCompleteSuggestion = {
          text: result.content,
          confidence: result.metadata?.confidence || 0.8,
          position: content.length
        };

        setSuggestion(newSuggestion);
        setIsVisible(true);
      }

    } catch (error) {
      console.error('Error generating autocomplete suggestion:', error);
      setSuggestion(null);
      setIsVisible(false);
    } finally {
      isGeneratingRef.current = false;
    }
  }, [enabled, minLength, lastContent, suggestAutoComplete]);

  /**
   * Manejar cambios en el contenido (con debounce)
   */
  const handleContentChange = useCallback((
    content: string,
    context: { title: string; category?: string }
  ) => {
    if (!enabled) return;

    // Limpiar sugerencia anterior si el contenido cambió
    if (content !== lastContent) {
      setIsVisible(false);
      setSuggestion(null);
    }

    // Limpiar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Configurar nuevo timer
    debounceTimerRef.current = setTimeout(() => {
      generateSuggestion(content, context);
    }, debounceMs);

  }, [enabled, lastContent, debounceMs, generateSuggestion]);

  /**
   * Aceptar sugerencia
   */
  const acceptSuggestion = useCallback((): string | null => {
    if (suggestion && isVisible) {
      setIsVisible(false);
      const acceptedText = suggestion.text;
      setSuggestion(null);
      return acceptedText;
    }
    return null;
  }, [suggestion, isVisible]);

  /**
   * Rechazar sugerencia
   */
  const rejectSuggestion = useCallback(() => {
    setIsVisible(false);
    setSuggestion(null);
  }, []);

  /**
   * Alternar visibilidad
   */
  const toggleVisibility = useCallback(() => {
    if (suggestion) {
      setIsVisible(prev => !prev);
    }
  }, [suggestion]);

  /**
   * Limpiar todo
   */
  const clear = useCallback(() => {
    setSuggestion(null);
    setIsVisible(false);
    setLastContent('');
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  /**
   * Limpiar timer al desmontar
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Manejador de teclas (para atajos)
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isVisible || !suggestion) return;

    // Tab: Aceptar sugerencia
    if (event.key === 'Tab') {
      event.preventDefault();
      acceptSuggestion();
      return;
    }

    // Escape: Rechazar sugerencia
    if (event.key === 'Escape') {
      event.preventDefault();
      rejectSuggestion();
      return;
    }

    // Flecha derecha: Aceptar sugerencia
    if (event.key === 'ArrowRight' && event.ctrlKey) {
      event.preventDefault();
      acceptSuggestion();
      return;
    }

  }, [isVisible, suggestion, acceptSuggestion, rejectSuggestion]);

  /**
   * Configurar listener de teclas
   */
  useEffect(() => {
    if (enabled && isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, isVisible, handleKeyDown]);

  return {
    suggestion,
    isVisible,
    isGenerating: isGenerating || isGeneratingRef.current,
    handleContentChange,
    acceptSuggestion,
    rejectSuggestion,
    toggleVisibility,
    clear
  };
};
