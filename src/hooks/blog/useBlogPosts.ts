/**
 * 🎣 Hook para gestión de Posts del Blog
 * Maneja la obtención y estado de posts
 * ✅ Optimizado con cache para evitar recargas innecesarias
 */

import { useState, useEffect, useCallback } from 'react';
import { blogPostApi } from '../../services/blog';
import blogCache from '../../utils/blogCache';
import type { BlogPost, BlogFilters, PaginationInfo } from '../../types/blog';

interface UseBlogPostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

/**
 * Hook para obtener lista de posts con filtros
 * ✅ Optimizado: loading inteligente basado en caché existente
 */
export function useBlogPosts(filters?: BlogFilters): UseBlogPostsReturn {
  // ✅ Inicialización inteligente: verificar caché inmediatamente
  const initialCacheKey = filters || {};
  const initialCached = blogCache.get<{ data: BlogPost[]; pagination: PaginationInfo }>('POST_LIST', initialCacheKey);
  
  const [posts, setPosts] = useState<BlogPost[]>(initialCached?.data || []);
  const [loading, setLoading] = useState(!initialCached); // ✅ No loading si hay caché
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(initialCached?.pagination || null);

  const fetchPosts = useCallback(async () => {
    // ✅ No hacer petición si limit es 0 o si tags está vacío cuando se requiere
    if (filters?.limit === 0) {
      setPosts([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // ✅ Intentar obtener del cache primero
      const cacheKey = filters || {};
      const cached = blogCache.get<{ data: BlogPost[]; pagination: PaginationInfo }>('POST_LIST', cacheKey);
      
      if (cached) {
        setPosts(cached.data);
        setPagination(cached.pagination);
        setLoading(false);
        return;
      }
      
      // Si no está en cache, hacer petición al servidor
      const response = await blogPostApi.getAllPosts(filters);
      
      if (response.success && response.data) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
        
        // ✅ Guardar en cache
        blogCache.set('POST_LIST', cacheKey, {
          data: response.data.data,
          pagination: response.data.pagination,
        });
      } else {
        throw new Error('Error al cargar posts');
      }
    } catch (err: any) {
      console.error('❌ [useBlogPosts] Error:', err);
      setError(err.message || 'Error al cargar los posts');
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    refetch: fetchPosts,
    refresh,
  };
}

/**
 * Hook para obtener posts destacados
 * ✅ Optimizado: loading inteligente basado en caché existente
 */
export function useFeaturedPosts() {
  // ✅ Inicialización inteligente: verificar caché inmediatamente
  const initialCached = blogCache.get<BlogPost[]>('FEATURED', 'featured-posts');
  
  const [posts, setPosts] = useState<BlogPost[]>(initialCached || []);
  const [loading, setLoading] = useState(!initialCached); // ✅ No loading si hay caché
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Intentar obtener del cache primero
        const cached = blogCache.get<BlogPost[]>('FEATURED', 'featured-posts');
        
        if (cached) {
          setPosts(cached);
          setLoading(false);
          return;
        }
        
        // Si no está en cache, hacer petición al servidor
        const response = await blogPostApi.getFeaturedPosts();
        
        if (response.success && response.data) {
          setPosts(response.data);
          
          // ✅ Guardar en cache
          blogCache.set('FEATURED', 'featured-posts', response.data);
        }
      } catch (err: any) {
        console.error('[useFeaturedPosts] Error:', err);
        setError(err.message || 'Error al cargar posts destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { posts, loading, error };
}

/**
 * Hook para obtener posts populares
 * ✅ Optimizado: loading inteligente basado en caché existente
 */
export function usePopularPosts(limit: number = 5) {
  // ✅ Inicialización inteligente: verificar caché inmediatamente
  const cacheKey = `popular-${limit}`;
  const initialCached = blogCache.get<BlogPost[]>('POPULAR', cacheKey);
  
  const [posts, setPosts] = useState<BlogPost[]>(initialCached || []);
  const [loading, setLoading] = useState(!initialCached); // ✅ No loading si hay caché
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Intentar obtener del cache primero
        const cacheKey = `popular-${limit}`;
        const cached = blogCache.get<BlogPost[]>('POPULAR', cacheKey);
        
        if (cached) {
          setPosts(cached);
          setLoading(false);
          return;
        }
        
        // Si no está en cache, hacer petición al servidor
        const response = await blogPostApi.getPopularPosts(limit);
        
        if (response.success && response.data) {
          setPosts(response.data);
          
          // ✅ Guardar en cache
          blogCache.set('POPULAR', cacheKey, response.data);
        }
      } catch (err: any) {
        console.error('[usePopularPosts] Error:', err);
        setError(err.message || 'Error al cargar posts populares');
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * Hook para búsqueda de posts
 */
export function useSearchPosts(query: string, filters?: Partial<BlogFilters>) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const search = useCallback(async () => {
    if (!query || query.trim().length < 2) {
      setPosts([]);
      setPagination(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await blogPostApi.searchPosts(query, filters);
      
      if (response.success && response.data) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('[useSearchPosts] Error:', err);
      setError(err.message || 'Error en la búsqueda');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [query, JSON.stringify(filters)]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(debounceTimer);
  }, [search]);

  return { posts, loading, error, pagination, search };
}

export default useBlogPosts;
