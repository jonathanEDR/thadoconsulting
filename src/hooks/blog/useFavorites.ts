/**
 * 🎣 Hook para Favoritos del Blog
 * Maneja la funcionalidad de guardar posts como favoritos
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { blogPostApi } from '../../services/blog/blogPostApi';

interface UseFavoritesReturn {
  favorites: string[];
  loading: boolean;
  error: string | null;
  isFavorite: (postId: string) => boolean;
  toggleFavorite: (postId: string) => Promise<void>;
  addFavorite: (postId: string) => Promise<void>;
  removeFavorite: (postId: string) => Promise<void>;
}

/**
 * Hook para gestionar favoritos de posts
 */
export function useFavorites(): UseFavoritesReturn {
  const { userId, getToken, isSignedIn } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clave para localStorage
  const getStorageKey = () => `blog-favorites-${userId || 'guest'}`;

  // Cargar favoritos desde localStorage
  const loadFavorites = useCallback(() => {
    try {
      setLoading(true);
      const storageKey = getStorageKey();
      const storedFavorites = localStorage.getItem(storageKey);
      
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } else {
        setFavorites([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error cargando favoritos:', err);
      setError('Error al cargar favoritos');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Guardar favoritos en localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (err) {
      console.error('Error guardando favoritos:', err);
      setError('Error al guardar favoritos');
    }
  }, [userId]);

  // Cargar favoritos al inicializar o cambiar usuario
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Verificar si un post es favorito
  const isFavorite = useCallback((postId: string): boolean => {
    return favorites.includes(postId);
  }, [favorites]);

  // Agregar post a favoritos
  const addFavorite = useCallback(async (postId: string) => {
    if (!postId) return;
    
    // Si el usuario está autenticado, guardar en el backend
    if (isSignedIn && userId) {
      try {
        console.log('🔍 [FRONTEND] Agregando bookmark, postId:', postId);
        
        // Obtener token fresco
        const token = await getToken();
        console.log('🔑 [FRONTEND] Token obtenido:', token ? 'SI' : 'NO');
        
        // Asegurar que window.Clerk.session esté disponible antes de llamar al API
        if (!token) {
          console.error('❌ [FRONTEND] No se pudo obtener token de Clerk');
          setError('Debes iniciar sesión para guardar favoritos');
          return;
        }
        
        await blogPostApi.toggleBookmark(postId);
        console.log('✅ [FRONTEND] Bookmark agregado exitosamente');
      } catch (err) {
        console.error('❌ [FRONTEND] Error al agregar bookmark:', err);
        setError('Error al guardar favorito');
        return;
      }
    }
    
    const newFavorites = [...favorites];
    if (!newFavorites.includes(postId)) {
      newFavorites.push(postId);
      saveFavorites(newFavorites);
      
      // Mostrar notificación
      console.log('Post agregado a favoritos');
    }
  }, [favorites, saveFavorites, userId, isSignedIn, getToken]);

  // Remover post de favoritos
  const removeFavorite = useCallback(async (postId: string) => {
    if (!postId) return;
    
    // Si el usuario está autenticado, remover del backend
    if (isSignedIn && userId) {
      try {
        console.log('🔍 [FRONTEND] Removiendo bookmark, postId:', postId);
        
        // Obtener token fresco
        const token = await getToken();
        console.log('🔑 [FRONTEND] Token obtenido:', token ? 'SI' : 'NO');
        
        if (!token) {
          console.error('❌ [FRONTEND] No se pudo obtener token de Clerk');
          setError('Debes iniciar sesión para modificar favoritos');
          return;
        }
        
        await blogPostApi.toggleBookmark(postId);
        console.log('✅ [FRONTEND] Bookmark removido exitosamente');
      } catch (err) {
        console.error('❌ [FRONTEND] Error al remover bookmark:', err);
        setError('Error al remover favorito');
        return;
      }
    }
    
    const newFavorites = favorites.filter(id => id !== postId);
    saveFavorites(newFavorites);
    
    // Mostrar notificación
    console.log('Post removido de favoritos');
  }, [favorites, saveFavorites, userId, isSignedIn, getToken]);

  // Toggle favorito
  const toggleFavorite = useCallback(async (postId: string) => {
    if (isFavorite(postId)) {
      await removeFavorite(postId);
    } else {
      await addFavorite(postId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite
  };
}