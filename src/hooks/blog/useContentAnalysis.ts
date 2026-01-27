/**
 * 🧠 Hook para Análisis de Contenido con IA
 * Maneja análisis semántico, mejoras automáticas y recomendaciones
 */

import { useState, useCallback } from 'react';
import { blogAiApi, type ContentAnalysis, type QAGeneration, type ConversationalFormat } from '../../services/blog/blogAiApi';

interface UseContentAnalysisReturn {
  analysis: ContentAnalysis | null;
  qaGeneration: QAGeneration | null;
  conversationalFormat: ConversationalFormat | null;
  improvements: Array<{
    type: 'SEO' | 'READABILITY' | 'STRUCTURE' | 'ENGAGEMENT';
    suggestion: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }> | null;
  loading: {
    analysis: boolean;
    qa: boolean;
    conversational: boolean;
    improvements: boolean;
  };
  error: string | null;
  analyzeContent: () => Promise<void>;
  generateQA: () => Promise<void>;
  generateConversational: (options?: { tone?: string; targetAudience?: string }) => Promise<void>;
  getImprovements: () => Promise<void>;
  analyzeDraft: (content: string, title: string) => Promise<void>;
}

export const useContentAnalysis = (slug: string): UseContentAnalysisReturn => {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [qaGeneration, setQAGeneration] = useState<QAGeneration | null>(null);
  const [conversationalFormat, setConversationalFormat] = useState<ConversationalFormat | null>(null);
  const [improvements, setImprovements] = useState<any>(null);
  
  const [loading, setLoading] = useState({
    analysis: false,
    qa: false,
    conversational: false,
    improvements: false,
  });
  
  const [error, setError] = useState<string | null>(null);

  const updateLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // Análisis completo de contenido
  const analyzeContent = useCallback(async () => {
    if (!slug) return;

    try {
      updateLoading('analysis', true);
      setError(null);
      
      const data = await blogAiApi.analyzeContent(slug);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Error al analizar contenido');
      console.error('Error analyzing content:', err);
    } finally {
      updateLoading('analysis', false);
    }
  }, [slug]);

  // Generar preguntas y respuestas automáticas
  const generateQA = useCallback(async () => {
    if (!slug) return;

    try {
      updateLoading('qa', true);
      setError(null);
      
      const data = await blogAiApi.generateQA(slug);
      setQAGeneration(data);
    } catch (err: any) {
      setError(err.message || 'Error al generar Q&A');
      console.error('Error generating Q&A:', err);
    } finally {
      updateLoading('qa', false);
    }
  }, [slug]);

  // Generar formato conversacional
  const generateConversational = useCallback(async (options?: { 
    tone?: string; 
    targetAudience?: string 
  }) => {
    if (!slug) return;

    try {
      updateLoading('conversational', true);
      setError(null);
      
      const data = await blogAiApi.generateConversationalFormat(slug, options);
      setConversationalFormat(data);
    } catch (err: any) {
      setError(err.message || 'Error al generar formato conversacional');
      console.error('Error generating conversational format:', err);
    } finally {
      updateLoading('conversational', false);
    }
  }, [slug]);

  // Obtener sugerencias de mejoras
  const getImprovements = useCallback(async () => {
    if (!slug) return;

    try {
      updateLoading('improvements', true);
      setError(null);
      
      const data = await blogAiApi.suggestImprovements(slug);
      setImprovements(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener sugerencias');
      console.error('Error getting improvements:', err);
    } finally {
      updateLoading('improvements', false);
    }
  }, [slug]);

  // Analizar borrador (para editor en tiempo real)
  const analyzeDraft = useCallback(async (content: string, title: string) => {
    if (!content || !title) return;

    try {
      updateLoading('analysis', true);
      setError(null);
      
      const data = await blogAiApi.analyzeContentDraft(content, title);
      
      // Actualizar análisis parcial
      if (data && analysis) {
        setAnalysis(prev => ({
          ...prev,
          ...data,
        } as ContentAnalysis));
      } else if (data) {
        setAnalysis(data as ContentAnalysis);
      }
    } catch (err: any) {
      setError(err.message || 'Error al analizar borrador');
      console.error('Error analyzing draft:', err);
    } finally {
      updateLoading('analysis', false);
    }
  }, [analysis]);

  return {
    analysis,
    qaGeneration,
    conversationalFormat,
    improvements,
    loading,
    error,
    analyzeContent,
    generateQA,
    generateConversational,
    getImprovements,
    analyzeDraft,
  };
};