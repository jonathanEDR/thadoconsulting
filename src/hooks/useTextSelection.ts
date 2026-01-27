/**
 * 🎯 useTextSelection Hook
 * Detecta selección de texto y analiza contexto del bloque seleccionado
 * para generar sugerencias específicas de IA
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface TextSelection {
  text: string;
  start: number;
  end: number;
  rect: DOMRect | null;
  context: {
    before: string;
    after: string;
    paragraph: string;
    element: HTMLElement | null;
  };
}

export interface SelectionAnalysis {
  type: 'paragraph' | 'sentence' | 'phrase' | 'word' | 'title' | 'list-item' | 'unknown';
  intent: 'expand' | 'rewrite' | 'summarize' | 'continue' | 'example' | 'optimize' | 'unclear';
  suggestions: string[];
  confidence: number;
}

interface UseTextSelectionOptions {
  enabled?: boolean;
  minLength?: number;
  maxLength?: number;
  debounceMs?: number;
  contextLength?: number;
}

export const useTextSelection = (options: UseTextSelectionOptions = {}) => {
  const {
    enabled = true,
    minLength = 3,
    maxLength = 1000,
    debounceMs = 300,
    contextLength = 150
  } = options;

  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [analysis, setAnalysis] = useState<SelectionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Registrar contenedor para detectar selecciones
  const registerContainer = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
  }, []);

  // Analizar tipo de contenido seleccionado
  const analyzeSelection = useCallback((text: string, context: TextSelection['context']): SelectionAnalysis => {
    const trimmedText = text.trim();
    const wordCount = trimmedText.split(/\s+/).length;
    const sentences = trimmedText.split(/[.!?]+/).filter(s => s.trim());
    
    // Detectar tipo de contenido
    let type: SelectionAnalysis['type'] = 'unknown';
    let intent: SelectionAnalysis['intent'] = 'unclear';
    let confidence = 0.5;

    // Análisis por contexto HTML
    if (context.element) {
      const tagName = context.element.tagName.toLowerCase();
      const className = context.element.className;
      
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName) || className.includes('heading')) {
        type = 'title';
        intent = 'expand';
        confidence = 0.9;
      } else if (tagName === 'li' || className.includes('list')) {
        type = 'list-item';
        intent = 'example';
        confidence = 0.8;
      }
    }

    // Análisis por contenido
    if (type === 'unknown') {
      if (wordCount === 1) {
        type = 'word';
        intent = 'expand';
        confidence = 0.6;
      } else if (sentences.length === 1 && wordCount < 20) {
        type = 'sentence';
        intent = 'expand';
        confidence = 0.7;
      } else if (sentences.length === 1) {
        type = 'sentence';
        intent = 'rewrite';
        confidence = 0.8;
      } else if (wordCount > 50) {
        type = 'paragraph';
        intent = 'summarize';
        confidence = 0.8;
      } else {
        type = 'phrase';
        intent = 'expand';
        confidence = 0.7;
      }
    }

    // Análisis por patrones específicos
    if (trimmedText.includes('?')) {
      intent = 'expand'; // Preguntas necesitan expansión
      confidence += 0.1;
    } else if (trimmedText.match(/^\d+\./)) {
      type = 'list-item';
      intent = 'example';
      confidence += 0.1;
    } else if (trimmedText.includes(':')) {
      intent = 'expand'; // Definiciones necesitan expansión
      confidence += 0.1;
    }

    // Generar sugerencias basadas en análisis
    const suggestions = generateSuggestions(type, intent);

    return {
      type,
      intent,
      suggestions,
      confidence: Math.min(confidence, 1.0)
    };
  }, []);

  // Generar sugerencias contextuales
  const generateSuggestions = (
    type: SelectionAnalysis['type'], 
    intent: SelectionAnalysis['intent']
  ): string[] => {
    const suggestions: string[] = [];

    switch (intent) {
      case 'expand':
        suggestions.push('📝 Expandir contenido');
        suggestions.push('💡 Agregar ejemplos');
        suggestions.push('🔍 Explicar en detalle');
        break;
      
      case 'rewrite':
        suggestions.push('✏️ Reescribir mejor');
        suggestions.push('🎯 Optimizar claridad');
        suggestions.push('⚡ Hacer más conciso');
        break;
      
      case 'summarize':
        suggestions.push('📋 Resumir contenido');
        suggestions.push('🎯 Puntos principales');
        suggestions.push('📝 Crear bullet points');
        break;
      
      case 'continue':
        suggestions.push('➡️ Continuar escribiendo');
        suggestions.push('🔄 Desarrollar idea');
        suggestions.push('📈 Profundizar tema');
        break;
      
      case 'example':
        suggestions.push('💡 Agregar ejemplos');
        suggestions.push('🎯 Casos prácticos');
        suggestions.push('📊 Datos concretos');
        break;
      
      case 'optimize':
        suggestions.push('🚀 Optimizar SEO');
        suggestions.push('🎯 Mejorar keywords');
        suggestions.push('📈 Aumentar engagement');
        break;
      
      default:
        suggestions.push('✨ Mejorar contenido');
        suggestions.push('🎯 Sugerencias IA');
        break;
    }

    // Agregar sugerencias específicas por tipo
    if (type === 'title') {
      suggestions.unshift('🎯 Optimizar título');
    } else if (type === 'list-item') {
      suggestions.unshift('📋 Completar lista');
    }

    return suggestions.slice(0, 4); // Máximo 4 sugerencias
  };

  // Obtener información de selección actual
  const getSelectionInfo = useCallback((): TextSelection | null => {
    if (!enabled || !containerRef.current) return null;

    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.rangeCount === 0) return null;

    const range = windowSelection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText.length < minLength || selectedText.length > maxLength) {
      return null;
    }

    // Obtener contexto
    const container = containerRef.current;
    const fullText = container.textContent || '';

    // Encontrar posición en el texto completo
    let absoluteStart = 0;
    let absoluteEnd = 0;
    
    try {
      const beforeRange = document.createRange();
      beforeRange.setStart(container, 0);
      beforeRange.setEnd(range.startContainer, range.startOffset);
      absoluteStart = beforeRange.toString().length;
      absoluteEnd = absoluteStart + selectedText.length;
    } catch (error) {
      console.warn('Error calculating absolute position:', error);
      absoluteStart = 0;
      absoluteEnd = selectedText.length;
    }

    // Contexto antes y después
    const contextBefore = fullText.slice(
      Math.max(0, absoluteStart - contextLength), 
      absoluteStart
    );
    const contextAfter = fullText.slice(
      absoluteEnd, 
      Math.min(fullText.length, absoluteEnd + contextLength)
    );

    // Encontrar párrafo completo
    const paragraphStart = Math.max(0, fullText.lastIndexOf('\n', absoluteStart - 1) + 1);
    const paragraphEnd = fullText.indexOf('\n', absoluteEnd);
    const paragraph = fullText.slice(
      paragraphStart, 
      paragraphEnd === -1 ? fullText.length : paragraphEnd
    );

    // Obtener rectángulo para posicionamiento
    let rect: DOMRect | null = null;
    try {
      rect = range.getBoundingClientRect();
    } catch (error) {
      console.warn('Error getting selection rect:', error);
    }

    // Encontrar elemento contenedor más específico
    let element: HTMLElement | null = null;
    if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
      element = range.commonAncestorContainer as HTMLElement;
    } else if (range.commonAncestorContainer.parentElement) {
      element = range.commonAncestorContainer.parentElement;
    }

    return {
      text: selectedText,
      start: absoluteStart,
      end: absoluteEnd,
      rect,
      context: {
        before: contextBefore,
        after: contextAfter,
        paragraph,
        element
      }
    };
  }, [enabled, minLength, maxLength, contextLength]);

  // Manejar cambios en la selección
  const handleSelectionChange = useCallback(() => {
    if (!enabled) return;

    // Limpiar debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce para evitar análisis excesivo
    debounceRef.current = window.setTimeout(() => {
      const newSelection = getSelectionInfo();
      
      if (newSelection) {
        setSelection(newSelection);
        setIsAnalyzing(true);
        
        // Analizar selección
        const newAnalysis = analyzeSelection(newSelection.text, newSelection.context);
        setAnalysis(newAnalysis);
        setIsAnalyzing(false);
        
        if (import.meta.env.DEV) {
          console.log('🎯 [useTextSelection] New selection:', {
            text: newSelection.text.slice(0, 50) + '...',
            type: newAnalysis.type,
            intent: newAnalysis.intent,
            confidence: newAnalysis.confidence
          });
        }
      } else {
        setSelection(null);
        setAnalysis(null);
        setIsAnalyzing(false);
      }
    }, debounceMs);
  }, [enabled, debounceMs, getSelectionInfo, analyzeSelection]);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelection(null);
    setAnalysis(null);
    setIsAnalyzing(false);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [enabled, handleSelectionChange]);

  return {
    // Estado
    selection,
    analysis,
    isAnalyzing,
    hasSelection: selection !== null,
    
    // Acciones
    clearSelection,
    registerContainer,
    
    // Utilidades
    isValidSelection: selection !== null && analysis !== null,
    confidence: analysis?.confidence || 0
  };
};

export default useTextSelection;