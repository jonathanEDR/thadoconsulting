/**
 * 🔍 BARRA DE BÚSQUEDA SIMPLE
 * Componente ligero de búsqueda con debouncing (sin autocompletado)
 */

import { useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';

// ============================================
// ICONOS
// ============================================

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// ============================================
// TIPOS
// ============================================

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
  showLoadingIndicator?: boolean;
}

// ============================================
// COMPONENTE
// ============================================

export const SearchBar = ({
  value: externalValue,
  onChange,
  placeholder = 'Buscar...',
  delay = 300,
  className = '',
  showLoadingIndicator = true
}: SearchBarProps) => {
  const {
    searchTerm,
    debouncedValue,
    setSearchTerm,
    isSearching,
    clearSearch
  } = useSearch(externalValue || '', { delay });

  // Llamar onChange cuando cambia el valor debounced
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleClear = () => {
    clearSearch();
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {showLoadingIndicator && isSearching ? (
          <LoadingIcon />
        ) : (
          <SearchIcon />
        )}
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
      />

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
