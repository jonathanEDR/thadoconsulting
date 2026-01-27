/**
 * 📊 Hook para Recomendaciones Inteligentes
 * Maneja sugerencias de contenido relacionado basado en IA
 */

import { useState, useEffect, useCallback } from 'react';
import { blogAiApi } from '../../services/blog/blogAiApi';

interface Recommendation {
  title: string;
  slug: string;
  relevanceScore: number;
  reason: string;
  type: 'INTERNAL' | 'EXTERNAL';
  url?: string;
}

interface UseAIRecommendationsOptions {
  autoFetch?: boolean;
  limit?: number;
  includeExternal?: boolean;
}

interface UseAIRecommendationsReturn {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  fetchRecommendations: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAIRecommendations = (
  slug: string,
  options: UseAIRecommendationsOptions = {}
): UseAIRecommendationsReturn => {
  const { autoFetch = true, limit = 5, includeExternal = false } = options;

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await blogAiApi.getAIRecommendations(slug, { 
        limit, 
        includeExternal 
      });
      
      setRecommendations(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener recomendaciones');
      console.error('Error fetching AI recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [slug, limit, includeExternal]);

  const refetch = useCallback(async () => {
    await fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    if (autoFetch && slug) {
      fetchRecommendations();
    }
  }, [slug, autoFetch, fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    refetch,
  };
};

/**
 * 🎯 Hook para Investigación de Keywords
 * Maneja investigación de palabras clave y análisis de competencia
 */
export const useKeywordResearch = () => {
  const [research, setResearch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const researchKeywords = useCallback(async (
    topic: string,
    options?: {
      language?: string;
      country?: string;
      includeQuestions?: boolean;
    }
  ) => {
    if (!topic) return;

    try {
      setLoading(true);
      setError(null);
      
      const { blogSeoApi } = await import('../../services/blog/blogSeoApi');
      const data = await blogSeoApi.researchKeywords(topic, options);
      
      setResearch(data);
    } catch (err: any) {
      setError(err.message || 'Error al investigar keywords');
      console.error('Error researching keywords:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    research,
    loading,
    error,
    researchKeywords,
  };
};