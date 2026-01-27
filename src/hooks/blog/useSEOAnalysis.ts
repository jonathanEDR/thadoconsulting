/**
 * 🎯 Hook para Análisis SEO
 * Maneja análisis SEO en tiempo real y optimización automática
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { blogSeoApi, type SEOAnalysis, type SEOPreview } from '../../services/blog/blogSeoApi';

interface UseSEOAnalysisOptions {
  autoAnalyze?: boolean;
  liveAnalysis?: boolean;
  debounceMs?: number;
}

interface UseSEOAnalysisReturn {
  analysis: SEOAnalysis | null;
  preview: SEOPreview | null;
  loading: boolean;
  error: string | null;
  analyzeSEO: () => Promise<void>;
  analyzeContent: (content: string, title: string, description?: string) => Promise<void>;
  getPreview: (title?: string, description?: string) => Promise<void>;
  refetch: () => Promise<void>;
  seoScore: number;
  recommendations: SEOAnalysis['recommendations'];
}

export const useSEOAnalysis = (
  slug: string,
  options: UseSEOAnalysisOptions = {}
): UseSEOAnalysisReturn => {
  const { autoAnalyze = false, debounceMs = 1000 } = options;

  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [preview, setPreview] = useState<SEOPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  // Análisis SEO completo de un post publicado
  const analyzeSEO = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await blogSeoApi.analyzeSEO(slug);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Error al analizar SEO');
      console.error('Error analyzing SEO:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Análisis SEO en vivo para contenido en edición
  const analyzeContent = useCallback(async (
    content: string,
    title: string,
    description?: string,
    keywords?: string[]
  ) => {
    if (!content || !title) return;

    // Limpiar timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Crear nuevo timer para debounce
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await blogSeoApi.analyzeLiveContent(content, title, description, keywords);
        setAnalysis(prevAnalysis => ({
          ...prevAnalysis,
          ...data,
        } as SEOAnalysis));
      } catch (err: any) {
        setError(err.message || 'Error al analizar contenido');
        console.error('Error analyzing live content:', err);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    setDebounceTimer(timer);
  }, [debounceMs, debounceTimer]);

  // Obtener vista previa SEO
  const getPreview = useCallback(async (customTitle?: string, customDescription?: string) => {
    if (!slug && !customTitle) return;

    try {
      setError(null);
      
      const data = await blogSeoApi.getSEOPreview(slug, customTitle, customDescription);
      setPreview(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener vista previa');
      console.error('Error getting SEO preview:', err);
    }
  }, [slug]);

  const refetch = useCallback(async () => {
    await analyzeSEO();
    await getPreview();
  }, [analyzeSEO, getPreview]);

  // Auto-análisis al cargar el componente
  useEffect(() => {
    if (autoAnalyze && slug) {
      analyzeSEO();
      getPreview();
    }
  }, [slug, autoAnalyze, analyzeSEO, getPreview]);

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Computar valores derivados
  const seoScore = useMemo(() => analysis?.overallScore || 0, [analysis]);
  const recommendations = useMemo(() => analysis?.recommendations || [], [analysis]);

  return {
    analysis,
    preview,
    loading,
    error,
    analyzeSEO,
    analyzeContent,
    getPreview,
    refetch,
    seoScore,
    recommendations,
  };
};