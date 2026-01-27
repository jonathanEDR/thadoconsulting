import { useState, useEffect, useCallback } from 'react';
import * as imageService from '../../services/imageService';
import { media } from '../../utils/contentManagementCache';
import type { ImageData, ListImagesOptions, PaginationInfo } from '../../services/imageService';

interface UseImageLibraryReturn {
  images: ImageData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  selectedImages: Set<string>;
  filters: ListImagesOptions;
  viewMode: 'grid' | 'list';
  
  // Actions
  fetchImages: () => Promise<void>;
  refreshImages: () => Promise<void>;
  setFilters: (filters: Partial<ListImagesOptions>) => void;
  setPage: (page: number) => void;
  toggleImageSelection: (imageId: string) => void;
  selectAllImages: () => void;
  clearSelection: () => void;
  toggleViewMode: () => void;
  deleteSelectedImages: (force?: boolean) => Promise<void>;
}

const DEFAULT_FILTERS: ListImagesOptions = {
  page: 1,
  limit: 20,
  sortBy: '-uploadedAt'
};

export const useImageLibrary = (initialFilters: Partial<ListImagesOptions> = {}): UseImageLibraryReturn => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [filters, setFiltersState] = useState<ListImagesOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /**
   * Fetch images from API or Cache
   */
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generar clave de cache basada en filtros
      const category = filters.category || 'root';
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const cacheKey = `${category}_p${page}_l${limit}`;
      
      console.log(`📦 [ImageLibrary Cache] Buscando en cache: ${cacheKey}`);
      
      // 1. Intentar obtener del cache
      const cached = media.getFolderList<{
        images: ImageData[];
        pagination: PaginationInfo;
      }>(cacheKey);

      if (cached) {
        console.log(`✅ [ImageLibrary Cache] Datos desde cache: ${cacheKey}`);
        setImages(cached.images);
        setPagination(cached.pagination);
        setLoading(false);
        return;
      }

      // 2. Si no hay cache, obtener de la API
      console.log(`🌐 [ImageLibrary Cache] Obteniendo de API: ${cacheKey}`);
      const response = await imageService.listImages(filters);
      
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar imágenes';
      setError(errorMessage);
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Refresh images - invalidate cache and refetch
   */
  const refreshImages = useCallback(async () => {
    const category = filters.category || 'root';
    console.log(`🔄 [ImageLibrary Cache] Refrescando cache: ${category}`);
    
    // Invalidar el cache de esta carpeta
    media.invalidateFolder(category);
    
    // Refetch images
    await fetchImages();
  }, [fetchImages, filters.category]);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: Partial<ListImagesOptions>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1 // Reset to page 1 when filters change
    }));
    setSelectedImages(new Set()); // Clear selection when filters change
  }, []);

  /**
   * Set page
   */
  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  /**
   * Toggle image selection
   */
  const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  }, []);

  /**
   * Select all images on current page
   */
  const selectAllImages = useCallback(() => {
    setSelectedImages(new Set(images.map(img => img._id)));
  }, [images]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  /**
   * Toggle view mode
   */
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);

  /**
   * Delete selected images
   */
  const deleteSelectedImages = useCallback(async (force: boolean = false) => {
    if (selectedImages.size === 0) return;

    try {
      setLoading(true);
      setError(null);

      // Delete images in parallel
      const deletePromises = Array.from(selectedImages).map(id =>
        imageService.deleteImage(id, force)
      );

      await Promise.all(deletePromises);

      // Invalidate cache for this category after deletion
      const category = filters.category || 'root';
      console.log(`🗑️ [ImageLibrary Cache] Invalidando categoría después de eliminar: ${category}`);
      media.invalidateFolder(category);

      // Clear selection and refresh
      setSelectedImages(new Set());
      await fetchImages();

      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar imágenes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedImages, fetchImages, filters.category]);

  /**
   * Fetch images when filters change
   */
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    pagination,
    selectedImages,
    filters,
    viewMode,
    
    fetchImages,
    refreshImages,
    setFilters,
    setPage,
    toggleImageSelection,
    selectAllImages,
    clearSelection,
    toggleViewMode,
    deleteSelectedImages
  };
};

export default useImageLibrary;
