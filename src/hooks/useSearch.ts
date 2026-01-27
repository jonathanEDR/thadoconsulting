/**
 * 🔍 HOOK DE BÚSQUEDA CON DEBOUNCING
 * Hook personalizado para búsqueda con delay y cancelación
 */

import { useState, useEffect, useCallback } from 'react';

interface UseSearchOptions {
  delay?: number;
  minLength?: number;
}

/**
 * Hook para búsqueda con debouncing
 * 
 * @param initialValue - Valor inicial de búsqueda
 * @param options - Configuración (delay, minLength)
 * @returns [searchTerm, debouncedValue, setSearchTerm, isSearching]
 * 
 * @example
 * ```tsx
 * const [search, debouncedSearch, setSearch, isSearching] = useSearch('', { delay: 300 });
 * ```
 */
export const useSearch = (
  initialValue: string = '',
  options: UseSearchOptions = {}
) => {
  const { delay = 300, minLength = 0 } = options;

  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Si el término es menor que minLength, limpiar debounced
    if (searchTerm.length < minLength) {
      setDebouncedValue('');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Timer para debouncing
    const timer = setTimeout(() => {
      setDebouncedValue(searchTerm);
      setIsSearching(false);
    }, delay);

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay, minLength]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedValue('');
    setIsSearching(false);
  }, []);

  return {
    searchTerm,
    debouncedValue,
    setSearchTerm,
    isSearching,
    clearSearch
  };
};

export default useSearch;
