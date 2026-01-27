/**
 * 🎣 Hook para Categorías del Blog
 * Maneja la obtención y gestión de categorías
 * ✅ Optimizado con cache para evitar recargas innecesarias
 */

import { useState, useEffect, useCallback } from 'react';
import { blogCategoryApi } from '../../services/blog';
import blogCache from '../../utils/blogCache';
import type { BlogCategory, BlogPost, PaginationInfo } from '../../types/blog';

interface UseCategoriesReturn {
  categories: BlogCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener todas las categorías
 * ✅ Con sistema de cache (TTL: 7 días)
 * ✅ Optimizado: loading inteligente basado en caché existente
 */
export function useCategories(): UseCategoriesReturn {
  // ✅ Inicialización inteligente: verificar caché inmediatamente
  const cacheKey = 'all-categories';
  const initialCached = blogCache.get<BlogCategory[]>('CATEGORIES', cacheKey);
  
  const [categories, setCategories] = useState<BlogCategory[]>(initialCached || []);
  const [loading, setLoading] = useState(!initialCached); // ✅ No loading si hay caché
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Intentar obtener del cache primero
      const cacheKey = 'all-categories';
      const cached = blogCache.get<BlogCategory[]>('CATEGORIES', cacheKey);
      
      if (cached) {
        setCategories(cached);
        setLoading(false);
        return;
      }
      
      // Si no está en cache, hacer petición al servidor
      const response = await blogCategoryApi.getAllCategories();
      
      if (response.success && response.data) {
        // Ordenar por orden y luego por nombre
        const sorted = response.data.sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return a.name.localeCompare(b.name);
        });
        setCategories(sorted);
        
        // ✅ Guardar en cache
        blogCache.set('CATEGORIES', cacheKey, sorted);
      }
    } catch (err: any) {
      console.error('[useCategories] Error:', err);
      setError(err.message || 'Error al cargar categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * Hook para obtener una categoría específica
 */
export function useCategory(slug: string | undefined) {
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setCategory(null);
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogCategoryApi.getCategoryBySlug(slug);
        
        if (response.success && response.data) {
          setCategory(response.data);
        }
      } catch (err: any) {
        console.error('[useCategory] Error:', err);
        setError(err.message || 'Error al cargar categoría');
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
}

/**
 * Hook para obtener posts de una categoría
 */
export function useCategoryPosts(
  slug: string | undefined,
  page: number = 1,
  limit: number = 10
) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!slug) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await blogCategoryApi.getCategoryPosts(slug, page, limit);
      
      if (response.success && response.data) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('[useCategoryPosts] Error:', err);
      setError(err.message || 'Error al cargar posts de la categoría');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    refetch: fetchPosts,
  };
}

/**
 * Hook para categorías activas con conteo de posts
 */
export function useActiveCategoriesWithCount() {
  const { categories, loading, error, refetch } = useCategories();

  const activeCategories = categories.filter(cat => cat.isActive);
  const categoriesWithPosts = activeCategories.filter(cat => 
    cat.postCount && cat.postCount > 0
  );

  return {
    categories: categoriesWithPosts,
    allCategories: categories,
    loading,
    error,
    refetch,
  };
}

export default useCategories;
