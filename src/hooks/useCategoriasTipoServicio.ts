/**
 * 🗂️ Hook para obtener categorías con mapeo a tipos de servicio
 * Usado en formularios de contacto para obtener el mapeo correcto de categorías
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCategoriasTipoServicio, type CategoriaConTipoServicio } from '../services/contactApi';

interface UseCategoriasTipoServicioState {
  categorias: CategoriaConTipoServicio[];
  mapping: Record<string, string>;
  enumValues: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mapearCategoria: (categoria: string) => string;
}

export const useCategoriasTipoServicio = (): UseCategoriasTipoServicioState => {
  const [categorias, setCategorias] = useState<CategoriaConTipoServicio[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [enumValues, setEnumValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCategoriasTipoServicio();
      
      if (response.success) {
        setCategorias(response.data.categorias);
        setMapping(response.data.mapping);
        setEnumValues(response.data.enumValues);
      } else {
        setError(response.message || 'Error al obtener categorías');
        console.error('Error obteniendo categorías:', response);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error en useCategoriasTipoServicio:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Memoizar la función de mapeo para evitar re-renders
  const mapearCategoria = useMemo(() => {
    return (categoria: string): string => {
      if (!categoria) return 'otro';
      
      const categoriaLower = categoria.toLowerCase().trim();
      
      // Buscar coincidencia exacta
      if (mapping[categoriaLower]) {
        return mapping[categoriaLower];
      }
      
      // Buscar coincidencia parcial
      for (const [key, value] of Object.entries(mapping)) {
        if (categoriaLower.includes(key) || key.includes(categoriaLower)) {
          return value;
        }
      }
      
      return 'otro';
    };
  }, [mapping]);

  return {
    categorias,
    mapping,
    enumValues,
    isLoading,
    error,
    refetch: fetchCategorias,
    mapearCategoria,
  };
};