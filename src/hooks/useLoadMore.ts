/**
 * 📄 USE LOAD MORE HOOK
 * Hook para implementar paginación tipo "Ver más" / "Load More"
 * Muestra datos incrementalmente al hacer clic en un botón
 */

import { useState, useMemo, useCallback } from 'react';

interface UseLoadMoreOptions<T> {
  data: T[];
  initialItems?: number;  // Cantidad inicial de items a mostrar
  increment?: number;     // Cantidad de items a agregar en cada "Ver más"
}

interface UseLoadMoreReturn<T> {
  visibleData: T[];           // Datos visibles actualmente
  hasMore: boolean;           // Si hay más datos por mostrar
  loadMore: () => void;       // Función para cargar más
  reset: () => void;          // Resetear a estado inicial
  visibleCount: number;       // Cantidad de items visibles
  totalItems: number;         // Total de items
  remainingItems: number;     // Items restantes por mostrar
  loadAll: () => void;        // Cargar todos los items
}

export const useLoadMore = <T,>({
  data,
  initialItems = 10,
  increment = 10
}: UseLoadMoreOptions<T>): UseLoadMoreReturn<T> => {
  const [visibleCount, setVisibleCount] = useState(initialItems);

  // Datos visibles actualmente
  const visibleData = useMemo(() => {
    return data.slice(0, visibleCount);
  }, [data, visibleCount]);

  // Verificar si hay más datos
  const hasMore = visibleCount < data.length;

  // Items restantes
  const remainingItems = Math.max(0, data.length - visibleCount);

  // Cargar más items
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + increment, data.length));
  }, [increment, data.length]);

  // Cargar todos los items
  const loadAll = useCallback(() => {
    setVisibleCount(data.length);
  }, [data.length]);

  // Resetear a estado inicial
  const reset = useCallback(() => {
    setVisibleCount(initialItems);
  }, [initialItems]);

  return {
    visibleData,
    hasMore,
    loadMore,
    reset,
    visibleCount,
    totalItems: data.length,
    remainingItems,
    loadAll
  };
};

export default useLoadMore;
