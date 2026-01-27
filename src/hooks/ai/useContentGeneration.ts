/**
 * ⚡ useContentGeneration Hook
 * Gestiona la generación de contenido con BlogAgent
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { getApiUrl } from '../../utils/apiConfig';

export type GenerationType = 'full' | 'section' | 'extend' | 'improve' | 'autocomplete';

export interface GenerationRequest {
  type: GenerationType;
  title: string;
  category?: string;
  currentContent?: string;
  style?: 'technical' | 'casual' | 'professional';
  wordCount?: number;
  focusKeywords?: string[];
  instruction?: string;
}

export interface GeneratedContent {
  content: string;
  metadata?: {
    wordCount?: number;
    seoScore?: number;
    suggestedTags?: string[];
    [key: string]: any;
  };
  suggestions?: string[];
}

export const useContentGeneration = () => {
  const { getToken } = useAuth();
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);

  /**
   * Generar contenido
   */
  const generateContent = useCallback(async (
    request: GenerationRequest
  ): Promise<GeneratedContent | null> => {
    try {
      setIsGenerating(true);
      setError(null);

      // Obtener token de autenticación
      const token = await getToken();

      // Enviar solicitud al backend
      const response = await axios.post<{ success: boolean; data: GeneratedContent }>(
        `${getApiUrl()}/agents/blog/generate-content`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const result = response.data.data;
        setGeneratedContent(result.content);
        setMetadata(result.metadata || null);
        return result;
      }

      throw new Error('No se pudo generar el contenido');

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Error generando contenido';
      setError(errorMessage);
      console.error('Error in generateContent:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [getToken]);

  /**
   * Generar post completo
   */
  const generateFullPost = useCallback(async (
    title: string,
    category: string,
    options?: {
      style?: 'technical' | 'casual' | 'professional';
      wordCount?: number;
      focusKeywords?: string[];
    }
  ) => {
    return await generateContent({
      type: 'full',
      title,
      category,
      ...options
    });
  }, [generateContent]);

  /**
   * Generar una sección
   */
  const generateSection = useCallback(async (
    sectionTitle: string,
    context: string,
    wordCount: number = 200
  ) => {
    return await generateContent({
      type: 'section',
      title: sectionTitle,
      currentContent: context,
      wordCount,
      instruction: sectionTitle
    });
  }, [generateContent]);

  /**
   * Extender contenido existente
   */
  const extendContent = useCallback(async (
    currentContent: string,
    instruction?: string,
    wordCount: number = 150
  ) => {
    return await generateContent({
      type: 'extend',
      title: '', // No es necesario para extender
      currentContent,
      instruction: instruction || 'Continúa el contenido de forma natural',
      wordCount
    });
  }, [generateContent]);

  /**
   * Mejorar contenido existente
   */
  const improveContent = useCallback(async (
    currentContent: string,
    instruction?: string
  ) => {
    return await generateContent({
      type: 'improve',
      title: '', // No es necesario para mejorar
      currentContent,
      instruction: instruction || 'Mejora la calidad y claridad del contenido'
    });
  }, [generateContent]);

  /**
   * Sugerir autocompletado CONTEXTUAL como GitHub Copilot
   */
  const suggestAutoComplete = useCallback(async (
    currentContent: string,
    context: { 
      title?: string; 
      category?: string;
      cursorContext?: any;
      completionType?: string;
    }
  ) => {
    // Si tenemos contexto específico del cursor, usarlo
    if (context.cursorContext && context.completionType === 'contextual') {
      const { textBeforeCursor, textAfterCursor } = context.cursorContext;
      
      // Crear prompt inteligente basado en la posición del cursor
      let intelligentInstruction = '';
      
      // Detectar qué tipo de continuación necesitamos
      const beforeText = textBeforeCursor.slice(-100); // Últimos 100 caracteres
      const afterText = textAfterCursor.slice(0, 50); // Próximos 50 caracteres
      
      if (beforeText.endsWith('.') || beforeText.endsWith('?') || beforeText.endsWith('!')) {
        intelligentInstruction = `Continúa escribiendo la siguiente oración que fluya naturalmente después de: "${beforeText.slice(-50)}"`;
      } else if (beforeText.includes('\n##') || beforeText.includes('\n#')) {
        intelligentInstruction = `Completa este título/encabezado de blog de manera atractiva: "${beforeText.slice(-30)}"`;
      } else if (beforeText.includes('- ') || beforeText.includes('• ')) {
        intelligentInstruction = `Completa este punto de lista de forma coherente: "${beforeText.slice(-40)}"`;
      } else {
        intelligentInstruction = `Continúa escribiendo naturalmente después de: "${beforeText.slice(-60)}"${afterText ? ` y antes de: "${afterText}"` : ''}`;
      }
      
      return await generateContent({
        type: 'autocomplete',
        title: context.title || 'Blog Post',
        category: context.category,
        currentContent: textBeforeCursor, // Solo el texto antes del cursor
        instruction: intelligentInstruction,
        wordCount: 50 // Sugerencias cortas y precisas
      });
    }
    
    // Fallback al método original
    return await generateContent({
      type: 'autocomplete',
      title: context.title || 'Blog Post',
      category: context.category,
      currentContent,
      instruction: 'Continúa escribiendo de manera natural y coherente'
    });
  }, [generateContent]);

  /**
   * Limpiar contenido generado
   */
  const clearGenerated = useCallback(() => {
    setGeneratedContent(null);
    setMetadata(null);
    setError(null);
  }, []);

  /**
   * Cancelar generación (futuro: implementar cancelación real)
   */
  const cancelGeneration = useCallback(() => {
    // TODO: Implementar cancelación de request si es necesario
    setIsGenerating(false);
  }, []);

  return {
    generatedContent,
    isGenerating,
    error,
    metadata,
    generateContent,
    generateFullPost,
    generateSection,
    extendContent,
    improveContent,
    suggestAutoComplete,
    clearGenerated,
    cancelGeneration
  };
};
