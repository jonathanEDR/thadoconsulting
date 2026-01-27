/**
 * 📄 USE VIRTUAL PAGINATION HOOK
 * Hook personalizado para paginación virtual eficiente
 * Ideal para listas grandes de datos
 */

import { useState, useMemo } from 'react';

interface UseVirtualPaginationOptions<T> {
  data: T[];
  itemsPerPage?: number;
  initialPage?: number;
}

interface UseVirtualPaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  pageData: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export const useVirtualPagination = <T,>({
  data,
  itemsPerPage: initialItemsPerPage = 10,
  initialPage = 1
}: UseVirtualPaginationOptions<T>): UseVirtualPaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // Calcular índices
  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, data.length);
  }, [startIndex, itemsPerPage, data.length]);

  // Obtener datos de la página actual
  const pageData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // Verificar si hay páginas siguiente/anterior
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Funciones de navegación
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleSetItemsPerPage = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset a la primera página cuando cambia el tamaño
  };

  return {
    currentPage,
    totalPages,
    pageData,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    itemsPerPage,
    setItemsPerPage: handleSetItemsPerPage,
    startIndex,
    endIndex,
    totalItems: data.length
  };
};

export default useVirtualPagination;
