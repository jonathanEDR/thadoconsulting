/**
 * Hook para cargar datos de páginas públicas desde el CMS
 * Incluye fallback a configuración predeterminada
 */

import { useState, useEffect } from 'react';
import type { PageData } from '../types/cms';
import { useDefaultPageData } from './useDefaultPageData';

export interface UsePageDataReturn {
  pageData: PageData | null;
  loading: boolean;
  error: string | null;
  // Fallbacks desde useDefaultPageData
  heroData: any;
  solutionsData: any;
  contactFormData: any;
}

export const usePageData = (pageSlug?: string): UsePageDataReturn => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener datos predeterminados como fallback
  const defaultData = useDefaultPageData();

  useEffect(() => {
    if (!pageSlug) {
      // Si no hay slug, usar solo datos predeterminados
      setPageData(null);
      setLoading(false);
      return;
    }

    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/pages/${pageSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Página no encontrada, usar datos predeterminados
            setPageData(null);
            setError(null);
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setPageData(data);
        }
      } catch (err) {
        console.warn('⚠️ [usePageData] Error loading page data, using defaults:', err);
        setError('Error al cargar datos de la página');
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [pageSlug]);

  return {
    pageData,
    loading: loading || defaultData.loading,
    error,
    // Fallbacks desde useDefaultPageData
    heroData: defaultData.heroData,
    solutionsData: defaultData.solutionsData,
    contactFormData: defaultData.contactFormData,
  };
};

export default usePageData;