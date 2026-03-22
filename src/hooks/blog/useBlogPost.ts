/**
 * 🎣 Hook para obtener un Post Individual
 * Maneja la carga de un post específico por slug
 * ✅ Optimizado con cache para evitar recargas innecesarias
 * ✅ Ahora expone relatedPosts del backend para evitar llamadas extra
 * ✅ Compatible con pre-renderizado SEO (no muestra error durante build)
 * ✅ Retry automático para errores de red (cold starts de Render.com)
 * ✅ Distingue entre "post no existe" (404) y "API no disponible" (network error)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { blogPostApi } from '../../services/blog';
import blogCache from '../../utils/blogCache';
import type { BlogPost } from '../../types/blog';

/**
 * 🔍 Detecta si estamos en modo pre-renderizado (react-snap, Vercel build, etc.)
 * Esto evita mostrar "Artículo no encontrado" durante el build cuando la API no responde
 */
const isPrerendering = (): boolean => {
  if (typeof window === 'undefined') return true;
  if (typeof navigator === 'undefined') return true;
  
  // Detectar react-snap
  if (navigator.userAgent?.includes('ReactSnap')) return true;
  
  // Detectar Puppeteer/Headless Chrome (usado por react-snap y Vercel)
  if (navigator.userAgent?.includes('HeadlessChrome')) return true;
  
  // Detectar crawlers de build
  if (navigator.userAgent?.includes('Prerender')) return true;
  if (navigator.userAgent?.includes('Vercel-Build')) return true;
  
  // Variable de entorno para modo de build
  if ((window as any).__PRERENDER_INJECTED !== undefined) return true;
  
  return false;
};

/**
 * 🤖 Detecta si el navegador es un crawler/bot de búsqueda
 * Los bots no deben ver "Artículo no encontrado" por errores de red temporales
 */
const isCrawler = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Googlebot|bingbot|Baiduspider|yandex|DuckDuckBot|Slurp|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp/i.test(ua);
};

/**
 * Determina si un error es de tipo "no encontrado" (404) vs error de red
 */
const isNotFoundError = (error: any): boolean => {
  const msg = (error?.message || '').toLowerCase();
  return msg.includes('no encontrado') || 
         msg.includes('not found') || 
         msg.includes('404');
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export type ErrorType = 'not-found' | 'network' | null;

interface UseBlogPostReturn {
  post: BlogPost | null;
  relatedPosts: BlogPost[];
  loading: boolean;
  error: string | null;
  errorType: ErrorType;
  isPrerendering: boolean;
  refetch: () => Promise<void>;
  updateLocalPost: (updatedPost: BlogPost) => void;
}

/**
 * Hook para obtener un post por su slug
 * ✅ Devuelve también relatedPosts del backend (evita llamadas API extra)
 * ✅ Maneja correctamente el pre-renderizado SEO
 * ✅ Optimizado: loading inteligente basado en caché existente
 */
export function useBlogPost(slug: string | undefined): UseBlogPostReturn {
  // ✅ Inicialización inteligente: verificar caché inmediatamente
  const initialCached = slug ? blogCache.get<{ post: BlogPost; relatedPosts: BlogPost[] }>('POST_DETAIL', slug) : null;
  
  const [post, setPost] = useState<BlogPost | null>(initialCached?.post || null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>(initialCached?.relatedPosts || []);
  const [loading, setLoading] = useState(!initialCached && !!slug);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const prerenderMode = isPrerendering();
  const retryCountRef = useRef(0);

  const fetchPost = useCallback(async () => {
    if (!slug) {
      setPost(null);
      setRelatedPosts([]);
      setLoading(false);
      return;
    }

    // 🔍 En modo pre-renderizado, solo marcar como no-loading sin error
    if (prerenderMode) {
      console.log('[useBlogPost] Modo pre-renderizado detectado, omitiendo fetch API');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setErrorType(null);
      
      // ✅ Intentar obtener del cache primero
      const cached = blogCache.get<{ post: BlogPost; relatedPosts: BlogPost[] }>('POST_DETAIL', slug);
      
      if (cached) {
        setPost(cached.post);
        setRelatedPosts(cached.relatedPosts || []);
        setLoading(false);
        retryCountRef.current = 0;
        return;
      }
      
      // ✅ Fetch con retry automático (cold starts de Render.com pueden tomar 30-60s)
      let lastError: any = null;
      
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            console.log(`[useBlogPost] Reintento ${attempt}/${MAX_RETRIES} para "${slug}"`);
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
          }
          
          const response = await blogPostApi.getPostBySlug(slug);
          
          if (response.success && response.data) {
            const responseData = response.data as any;
            setPost(responseData.post);
            setRelatedPosts(responseData.relatedPosts || []);
            blogCache.set('POST_DETAIL', slug, responseData);
            retryCountRef.current = 0;
            return;
          } else {
            lastError = new Error('Post no encontrado');
            break; // API respondió pero el post no existe - no reintentar
          }
        } catch (err: any) {
          lastError = err;
          if (isNotFoundError(err)) break; // 404 explícito, no reintentar
        }
      }
      
      // Todos los intentos fallaron
      if (lastError && !prerenderMode) {
        if (isNotFoundError(lastError)) {
          setErrorType('not-found');
          setError('Artículo no encontrado');
          setPost(null);
          setRelatedPosts([]);
        } else {
          // Error de red: si es un crawler, NO mostrar error
          // para preservar el HTML pre-renderizado
          if (isCrawler()) {
            console.log('[useBlogPost] Crawler detectado + error de red, omitiendo estado de error');
            setLoading(false);
            return;
          }
          setErrorType('network');
          setError('No se pudo conectar con el servidor');
        }
      }
    } catch (err: any) {
      if (!prerenderMode) {
        if (isNotFoundError(err)) {
          setErrorType('not-found');
          setError('Artículo no encontrado');
        } else {
          if (isCrawler()) {
            setLoading(false);
            return;
          }
          setErrorType('network');
          setError('Error al cargar el post');
        }
        setPost(null);
        setRelatedPosts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [slug, prerenderMode]);

  useEffect(() => {
    retryCountRef.current = 0;
    fetchPost();
  }, [fetchPost]);

  const updateLocalPost = useCallback((updatedPost: BlogPost) => {
    setPost(updatedPost);
  }, []);

  return {
    post,
    relatedPosts,
    loading,
    error,
    errorType,
    isPrerendering: prerenderMode,
    refetch: fetchPost,
    updateLocalPost,
  };
}

/**
 * Hook para acciones de interacción con el post
 */
export function usePostInteractions(postId: string) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
    const bookmarkedPosts = JSON.parse(localStorage.getItem('blog_bookmarked_posts') || '[]');
    
    setLiked(likedPosts.includes(postId));
    setBookmarked(bookmarkedPosts.includes(postId));
  }, [postId]);

  const toggleLike = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [FRONTEND] Intentando toggle like, postId:', postId);
      const response = await blogPostApi.toggleLike(postId);
      console.log('✅ [FRONTEND] Respuesta toggle like:', response);
      
      // Actualizar estado local
      const likedPosts = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
      
      if (liked) {
        // Remover like
        const updated = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('blog_liked_posts', JSON.stringify(updated));
        setLiked(false);
      } else {
        // Agregar like
        likedPosts.push(postId);
        localStorage.setItem('blog_liked_posts', JSON.stringify(likedPosts));
        setLiked(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al dar like');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [FRONTEND] Intentando toggle bookmark, postId:', postId);
      const response = await blogPostApi.toggleBookmark(postId);
      console.log('✅ [FRONTEND] Respuesta toggle bookmark:', response);
      
      // Actualizar estado local
      const bookmarkedPosts = JSON.parse(localStorage.getItem('blog_bookmarked_posts') || '[]');
      
      if (bookmarked) {
        // Remover bookmark
        const updated = bookmarkedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('blog_bookmarked_posts', JSON.stringify(updated));
        setBookmarked(false);
      } else {
        // Agregar bookmark
        bookmarkedPosts.push(postId);
        localStorage.setItem('blog_bookmarked_posts', JSON.stringify(bookmarkedPosts));
        setBookmarked(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    bookmarked,
    loading,
    error,
    toggleLike,
    toggleBookmark,
  };
}

export default useBlogPost;
