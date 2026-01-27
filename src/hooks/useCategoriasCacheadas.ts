/**
 * 🪝 useCategoriasCacheadas Hook
 * 
 * Obtiene categorías SIN CACHE (temporalmente desactivado)
 * Versión simplificada para evitar problemas de cache en admin
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { categoriasApi, type Categoria } from '../services/categoriasApi';

interface UseCategoriasCacheadasOptions {
  autoLoad?: boolean;
}

export const useCategoriasCacheadas = (
  options: UseCategoriasCacheadasOptions = {}
) => {
  const { autoLoad = true } = options;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false); // Prevenir carga duplicada

  // Cargar categorías SIN cache - memoizado para estabilidad
  const loadCategorias = useCallback(async () => {
    if (loadedRef.current) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      loadedRef.current = true;
      const data = await categoriasApi.getActivas();
      setCategorias(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Error cargando categorías';
      setError(errorMsg);
      loadedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-cargar si está habilitado
  useEffect(() => {
    if (autoLoad) {
      loadCategorias();
    }
  }, [autoLoad, loadCategorias]);

  // Refrescar manualmente - resetea el flag
  const refresh = useCallback(async () => {
    loadedRef.current = false;
    await loadCategorias();
  }, [loadCategorias]);

  return {
    categorias,
    loading,
    error,
    loadCategorias,
    refresh
  };
};

export default useCategoriasCacheadas;
