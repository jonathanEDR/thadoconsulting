/**
 * 🎣 useAIGeneration Hook
 * Hook reutilizable para generar contenido con IA para campos específicos
 */

import { useState, useCallback } from 'react';
import { servicesAgentService } from '../../../services/servicesAgentService';

interface UseAIGenerationOptions {
  fieldName: string;
  fieldType: 'title' | 'short_text' | 'long_text' | 'list' | 'faq' | 'promotional';
  serviceContext?: {
    serviceId?: string;
    titulo?: string;
    descripcionCorta?: string;
    categoria?: string;
  };
}

interface GenerationResult {
  content: string;
  success: boolean;
  error?: string;
}

export const useAIGeneration = ({ fieldName, fieldType, serviceContext }: UseAIGenerationOptions) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mapear fieldType a contentType del backend
   */
  const mapFieldTypeToContentType = (
    type: string
  ): 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq' => {
    const mapping: Record<string, any> = {
      long_text: 'full_description',
      short_text: 'short_description',
      list: 'features',
      faq: 'faq',
      promotional: 'short_description'
    };
    return mapping[type] || 'short_description';
  };

  /**
   * Generar contenido para el campo
   */
  const generate = useCallback(
    async (style: 'formal' | 'casual' | 'technical' = 'formal'): Promise<GenerationResult> => {
      if (!serviceContext?.serviceId) {
        return {
          content: '',
          success: false,
          error: 'Se requiere un servicio guardado (con ID) para generar contenido'
        };
      }

      setIsGenerating(true);
      setError(null);

      try {
        const contentType = mapFieldTypeToContentType(fieldType);

        const response = await servicesAgentService.generateContent(
          serviceContext.serviceId,
          contentType,
          style
        );

        if (!response.success) {
          throw new Error(response.error || 'Error al generar contenido');
        }

        return {
          content: response.data?.content || '',
          success: true
        };
      } catch (err: any) {
        const errorMsg = err.message || 'Error al generar contenido';
        console.error(`❌ [AI_GENERATION] Error:`, err);
        setError(errorMsg);
        return {
          content: '',
          success: false,
          error: errorMsg
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [fieldName, fieldType, serviceContext]
  );

  return {
    generate,
    isGenerating,
    error
  };
};
