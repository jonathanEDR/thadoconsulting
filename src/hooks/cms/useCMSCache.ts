/**
 * 🎨 useCMSCache Hook
 * Gestión de cache para el módulo CMS Manager
 * - Cache de página completa (1 hora)
 * - Categorías (2 horas)
 * - Temas (2 horas)
 */

import { useState, useCallback, useEffect } from 'react';
import { getPageBySlug, updatePage } from '../../services/cmsApi';
import { cms } from '../../utils/contentManagementCache';
import type { PageData } from '../../types/cms';

export interface UseCMSCacheReturn {
  // Data
  pageData: PageData | null;
  
  // Loading & Error states
  loading: boolean;
  error: Error | null;
  
  // Saving
  saving: boolean;
  
  // Operations
  loadPage: (slug?: string) => Promise<void>;
  savePage: (data: PageData) => Promise<void>;
  refreshCache: () => Promise<void>;
  invalidateCache: () => void;
}

/**
 * Hook para gestionar cache de CMS
 */
export const useCMSCache = (pageSlug: string = 'home'): UseCMSCacheReturn => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // OPERACIONES DE CACHE
  // ============================================

  /**
   * Carga la página desde cache o API
   */
  const loadPage = useCallback(async (slug: string = pageSlug) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Intentar obtener del cache
      console.log(`📦 [CMS Cache] Buscando en cache: ${slug}`);
      const cached = cms.getPages<PageData>(slug);

      if (cached) {
        console.log(`✅ [CMS Cache] Datos desde cache: ${slug}`);
        setPageData(cached);
        setLoading(false);
        return;
      }

      // 2. Si no hay cache, obtener de la API
      console.log(`🌐 [CMS Cache] Obteniendo de API: ${slug}`);
      const data = await getPageBySlug(slug);

      // 3. Guardar en cache
      cms.setPages<PageData>(data, slug);
      setPageData(data);
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load CMS page');
      console.error(`❌ [CMS Cache] Error al cargar: ${error.message}`);
      setError(error);
      setLoading(false);
    }
  }, [pageSlug]);

  /**
   * Guarda la página en API e invalida cache
   */
  const savePage = useCallback(async (data: PageData) => {
    try {
      setSaving(true);
      setError(null);

      console.log(`💾 [CMS Cache] Guardando en API: ${pageSlug}`);
      
      // Guardar en API
      const savedData = await updatePage(pageSlug, data);

      // Actualizar estado local
      setPageData(savedData);

      // Invalidar cache para forzar actualización en próxima carga
      cms.invalidatePages(pageSlug);
      console.log(`✅ [CMS Cache] Cache invalidado: ${pageSlug}`);

      setSaving(false);
      return savedData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save CMS page');
      console.error(`❌ [CMS Cache] Error al guardar: ${error.message}`);
      setError(error);
      setSaving(false);
      throw error;
    }
  }, [pageSlug]);

  /**
   * Recarga la página desde la API y actualiza el cache
   */
  const refreshCache = useCallback(async () => {
    try {
      console.log(`🔄 [CMS Cache] Refrescando cache: ${pageSlug}`);
      
      // Invalidar cache existente
      cms.invalidatePages(pageSlug);
      
      // Recargar desde API
      await loadPage(pageSlug);
      console.log(`✅ [CMS Cache] Cache refrescado: ${pageSlug}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh cache');
      console.error(`❌ [CMS Cache] Error al refrescar: ${error.message}`);
      setError(error);
    }
  }, [pageSlug, loadPage]);

  /**
   * Invalida el cache manualmente
   */
  const invalidateCache = useCallback(() => {
    console.log(`🗑️ [CMS Cache] Invalidando cache: ${pageSlug}`);
    cms.invalidatePages(pageSlug);
  }, [pageSlug]);

  // ============================================
  // EFECTO: Cargar página al montar
  // ============================================

  useEffect(() => {
    loadPage(pageSlug);
  }, [pageSlug, loadPage]);

  return {
    pageData,
    loading,
    error,
    saving,
    loadPage,
    savePage,
    refreshCache,
    invalidateCache,
  };
};

/**
 * Hook especializado para obtener datos de CMS sin interfaz de edición
 * (para lectura/presentación de datos)
 */
export const useCMSData = (pageSlug: string = 'home') => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Intentar cache primero
        const cached = cms.getPages<PageData>(pageSlug);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }

        // Obtener de API
        const pageData = await getPageBySlug(pageSlug);
        cms.setPages<PageData>(pageData, pageSlug);
        setData(pageData);
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load CMS data');
        setError(error);
        setLoading(false);
      }
    };

    loadData();
  }, [pageSlug]);

  return { data, loading, error };
};
