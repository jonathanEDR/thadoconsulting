/**
 * 📚 useBlogDashboardCache Hook
 * Gestión de cache para Blog Dashboard
 * - Cache de posts: 1 hora (separado por status)
 * - Cache de búsqueda: 30 minutos (dinámico)
 * - Cache de categorías: 1 hora
 */

import { useState, useCallback } from 'react';
import { blog } from '../../utils/contentManagementCache';
import type { BlogPost } from '../../types/blog';

export interface BlogDashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  totalAuthors: number;
  postsThisMonth: number;
  avgReadingTime: number;
}

export interface UseBlogDashboardCacheReturn {
  // Data
  stats: BlogDashboardStats;
  posts: BlogPost[];
  
  // State
  error: string | null;
  
  // Operations
  loadStats: (posts: BlogPost[]) => void;
  invalidatePostsCache: () => void;
  invalidateSearchCache: (query?: string) => void;
  invalidateAllCache: () => void;
}

/**
 * Hook para gestionar cache de Blog Dashboard
 */
export const useBlogDashboardCache = (): UseBlogDashboardCacheReturn => {
  const [stats, setStats] = useState<BlogDashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalAuthors: 0,
    postsThisMonth: 0,
    avgReadingTime: 0,
  });
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcula estadísticas desde los posts
   */
  const loadStats = useCallback((postsData: BlogPost[]) => {
    try {
      if (!postsData || postsData.length === 0) {
        setStats({
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          totalViews: 0,
          totalComments: 0,
          totalAuthors: 0,
          postsThisMonth: 0,
          avgReadingTime: 0,
        });
        setPosts([]);
        return;
      }

      const published = postsData.filter((p) => p.isPublished).length;
      const draft = postsData.filter((p) => !p.isPublished).length;
      const totalViews = postsData.reduce((sum, p) => sum + (p.stats?.views || 0), 0);
      const totalComments = postsData.reduce((sum, p) => sum + (p.stats?.commentsCount || 0), 0);
      const avgReading =
        postsData.reduce((sum, p) => sum + (p.readingTime || 5), 0) / postsData.length;

      // Posts este mes
      const now = new Date();
      const thisMonth = postsData.filter((p) => {
        const postDate = new Date(p.createdAt);
        return (
          postDate.getMonth() === now.getMonth() &&
          postDate.getFullYear() === now.getFullYear()
        );
      }).length;

      // Autores únicos
      const uniqueAuthors = new Set(
        postsData
          .filter((p) => p.author && p.author._id)
          .map((p) => (p.author as any)._id)
      ).size;

      const newStats: BlogDashboardStats = {
        totalPosts: postsData.length,
        publishedPosts: published,
        draftPosts: draft,
        totalViews,
        totalComments,
        totalAuthors: uniqueAuthors,
        postsThisMonth: thisMonth,
        avgReadingTime: Math.round(avgReading),
      };

      // console.log('📊 [Blog Cache] Estadísticas calculadas:', newStats);
      setStats(newStats);
      setPosts(postsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error calculando estadísticas';
      console.error('❌ [Blog Cache] Error:', errorMessage);
      setError(errorMessage);
    }
  }, []);

  /**
   * Invalida el cache de posts
   */
  const invalidatePostsCache = useCallback(() => {
    console.log('🗑️ [Blog Cache] Invalidando cache de posts');
    blog.invalidatePosts();
  }, []);

  /**
   * Invalida el cache de búsqueda
   */
  const invalidateSearchCache = useCallback((query?: string) => {
    console.log(`🗑️ [Blog Cache] Invalidando cache de búsqueda${query ? `: ${query}` : ''}`);
    blog.invalidateSearch(query);
  }, []);

  /**
   * Invalida todo el cache de blog
   */
  const invalidateAllCache = useCallback(() => {
    console.log('🗑️ [Blog Cache] Invalidando TODO el cache de blog');
    blog.invalidateAll();
  }, []);

  return {
    stats,
    posts,
    error,
    loadStats,
    invalidatePostsCache,
    invalidateSearchCache,
    invalidateAllCache,
  };
};

/**
 * Hook especializado para búsqueda de posts con cache dinámico
 */
export const useBlogSearch = () => {
  const [results, setResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Realiza búsqueda con cache de 30 minutos
   */
  const search = useCallback(async (query: string, page: number = 1, fetchFn?: () => Promise<BlogPost[]>) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`📦 [Blog Search] Buscando en cache: "${query}" página ${page}`);

      // 1. Intentar obtener del cache (búsquedas caducan en 30 min)
      const cached = blog.getSearch<BlogPost[]>(query, page);
      if (cached) {
        console.log(`✅ [Blog Search] Resultados desde cache: "${query}"`);
        setResults(cached);
        setLoading(false);
        return;
      }

      // 2. Si no hay cache, ejecutar búsqueda
      if (fetchFn) {
        console.log(`🌐 [Blog Search] Buscando en API: "${query}"`);
        const data = await fetchFn();

        // 3. Guardar en cache (30 minutos)
        blog.setSearch<BlogPost[]>(data, query, page);
        setResults(data);
      }

      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en búsqueda';
      console.error(`❌ [Blog Search] Error:`, err);
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearSearch };
};
