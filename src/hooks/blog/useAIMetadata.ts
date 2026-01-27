/**
 * 🤖 Hook para Metadata de IA
 * Maneja la obtención y caché de metadata generada por IA
 */

import { useState, useEffect, useCallback } from 'react';
import { blogAiApi, type AIMetadata } from '../../services/blog/blogAiApi';

interface UseAIMetadataOptions {
  autoFetch?: boolean;
  cacheTime?: number;
}

interface UseAIMetadataReturn {
  metadata: AIMetadata | null;
  loading: boolean;
  error: string | null;
  fetchMetadata: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAIMetadata = (
  slug: string,
  options: UseAIMetadataOptions = {}
): UseAIMetadataReturn => {
  const { autoFetch = true, cacheTime = 300000 } = options; // 5 minutos de caché por defecto

  const [metadata, setMetadata] = useState<AIMetadata | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchMetadata = useCallback(async () => {
    if (!slug) return;

    // Verificar caché
    const now = Date.now();
    if (metadata && (now - lastFetch) < cacheTime) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await blogAiApi.getAIMetadata(slug);
      setMetadata(data);
      setLastFetch(now);
    } catch (err: any) {
      setError(err.message || 'Error al cargar metadata de IA');
      console.error('Error fetching AI metadata:', err);
    } finally {
      setLoading(false);
    }
  }, [slug, metadata, lastFetch, cacheTime]);

  const refetch = useCallback(async () => {
    setLastFetch(0); // Forzar nueva petición
    await fetchMetadata();
  }, [fetchMetadata]);

  useEffect(() => {
    if (autoFetch && slug) {
      fetchMetadata();
    }
  }, [slug, autoFetch, fetchMetadata]);

  return {
    metadata,
    loading,
    error,
    fetchMetadata,
    refetch,
  };
};