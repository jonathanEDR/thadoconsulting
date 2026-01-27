/**
 * 🖼️ useMediaCache Hook
 * Gestión de cache para Media Library
 * - Cache por carpeta (2 horas)
 * - Cache de metadatos (2 horas)
 * - Pagination-aware keys
 */

import { useState, useCallback, useEffect } from 'react';
import * as imageService from '../../services/imageService';
import { media } from '../../utils/contentManagementCache';
import type { ImageData, ListImagesOptions, PaginationInfo } from '../../services/imageService';

export interface UseMediaCacheReturn {
  // Data
  images: ImageData[];
  pagination: PaginationInfo | null;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Operations
  fetchImages: (options: ListImagesOptions) => Promise<void>;
  refreshImages: (options: ListImagesOptions) => Promise<void>;
  invalidateFolderCache: (folder?: string) => void;
  invalidateMetadataCache: (imageId?: string) => void;
}

/**
 * Hook para gestionar cache de Media Library con soporte para carpetas y paginación
 */
export const useMediaCache = (): UseMediaCacheReturn => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // GENERADOR DE CLAVES DE CACHE
  // ============================================

  /**
   * Genera una clave única para el cache basada en opciones
   */
  const generateCacheKey = (options: ListImagesOptions): string => {
    const category = options.category || 'root';
    const page = options.page || 1;
    const limit = options.limit || 20;
    const sort = options.sortBy || '-uploadedAt';
    
    return `${category}_p${page}_l${limit}_s${sort}`;
  };

  // ============================================
  // OPERACIONES DE CACHE
  // ============================================

  /**
   * Obtiene imágenes desde cache o API
   */
  const fetchImages = useCallback(async (options: ListImagesOptions) => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = generateCacheKey(options);
      console.log(`📦 [Media Cache] Buscando en cache: ${cacheKey}`);

      // 1. Intentar obtener del cache
      const cached = media.getFolderList<{
        images: ImageData[];
        pagination: PaginationInfo;
      }>(cacheKey);

      if (cached) {
        console.log(`✅ [Media Cache] Datos desde cache: ${cacheKey}`);
        setImages(cached.images);
        setPagination(cached.pagination);
        setLoading(false);
        return;
      }

      // 2. Si no hay cache, obtener de la API
      console.log(`🌐 [Media Cache] Obteniendo de API: ${cacheKey}`);
      const response = await imageService.listImages(options);

      // 3. Guardar en cache
      media.setFolderList<{
        images: ImageData[];
        pagination: PaginationInfo;
      }>(
        {
          images: response.images,
          pagination: response.pagination,
        },
        cacheKey
      );

      setImages(response.images);
      setPagination(response.pagination);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar imágenes';
      console.error(`❌ [Media Cache] Error:`, err);
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  /**
   * Recarga las imágenes desde la API y actualiza el cache
   */
  const refreshImages = useCallback(async (options: ListImagesOptions) => {
    try {
      console.log(`🔄 [Media Cache] Refrescando cache`);
      
      const cacheKey = generateCacheKey(options);
      
      // Invalidar cache existente
      media.invalidateFolder(cacheKey);
      
      // Recargar desde API
      await fetchImages(options);
      console.log(`✅ [Media Cache] Cache refrescado: ${cacheKey}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al refrescar';
      console.error(`❌ [Media Cache] Error al refrescar:`, err);
      setError(errorMessage);
    }
  }, [fetchImages]);

  /**
   * Invalida el cache de una carpeta específica
   */
  const invalidateFolderCache = useCallback((folder?: string) => {
    console.log(`🗑️ [Media Cache] Invalidando carpeta: ${folder || 'todas'}`);
    media.invalidateFolder(folder);
  }, []);

  /**
   * Invalida el cache de metadatos de una imagen
   */
  const invalidateMetadataCache = useCallback((imageId?: string) => {
    console.log(`🗑️ [Media Cache] Invalidando metadatos: ${imageId || 'todos'}`);
    media.invalidateMetadata(imageId);
  }, []);

  return {
    images,
    pagination,
    loading,
    error,
    fetchImages,
    refreshImages,
    invalidateFolderCache,
    invalidateMetadataCache,
  };
};

/**
 * Hook especializado para cache de metadatos de imagen individual
 */
export const useImageMetadataCache = (imageId: string) => {
  const [metadata, setMetadata] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        
        // Intentar cache primero
        const cached = media.getMetadata(imageId);
        if (cached) {
          console.log(`✅ [Image Metadata Cache] Desde cache: ${imageId}`);
          setMetadata(cached);
          setLoading(false);
          return;
        }

        // Obtener de API (aquí puedes usar tu servicio)
        // const data = await imageService.getImageMetadata(imageId);
        // media.setMetadata(data, imageId);
        // setMetadata(data);
        
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load metadata');
        console.error(`❌ [Image Metadata Cache] Error:`, error);
        setError(error);
        setLoading(false);
      }
    };

    loadMetadata();
  }, [imageId]);

  const updateMetadata = useCallback(async (newMetadata: any) => {
    try {
      // Actualizar en API
      // await imageService.updateImageMetadata(imageId, newMetadata);
      
      // Actualizar local
      setMetadata(newMetadata);
      
      // Guardar en cache
      media.setMetadata(newMetadata, imageId);
      console.log(`✅ [Image Metadata Cache] Metadatos actualizados: ${imageId}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update metadata');
      console.error(`❌ [Image Metadata Cache] Error al actualizar:`, error);
      setError(error);
      throw error;
    }
  }, [imageId]);

  const invalidateMetadata = useCallback(() => {
    console.log(`🗑️ [Image Metadata Cache] Invalidando: ${imageId}`);
    media.invalidateMetadata(imageId);
    setMetadata(null);
  }, [imageId]);

  return { metadata, loading, error, updateMetadata, invalidateMetadata };
};
