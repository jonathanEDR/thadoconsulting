/**
 * 🔍 COMPONENTE DE BÚSQUEDA CON AUTOCOMPLETADO
 * Input de búsqueda inteligente con sugerencias en tiempo real
 */

import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import type { Servicio } from '../../types/servicios';

// ============================================
// TIPOS
// ============================================

interface SearchSuggestion {
  id: string;
  type: 'servicio' | 'categoria' | 'tag';
  label: string;
  subtitle?: string;
  servicio?: Servicio;
}

interface SearchWithAutocompleteProps {
  servicios: Servicio[];
  onSearch: (term: string) => void;
  onSelectServicio?: (servicio: Servicio) => void;
  placeholder?: string;
  className?: string;
}

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

const ServiceIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const SearchWithAutocomplete = ({
  servicios,
  onSearch,
  onSelectServicio,
  placeholder = 'Buscar servicios, categorías o tags...',
  className = ''
}: SearchWithAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { 
    searchTerm, 
    debouncedValue, 
    setSearchTerm, 
    isSearching,
    clearSearch 
  } = useSearch('', { delay: 300, minLength: 2 });

  // ============================================
  // GENERAR SUGERENCIAS
  // ============================================

  const suggestions: SearchSuggestion[] = (() => {
    if (!debouncedValue || debouncedValue.length < 2) return [];

    const search = debouncedValue.toLowerCase();
    const results: SearchSuggestion[] = [];
    const maxResults = 8;

    // 1. Servicios que coinciden
    const matchingServicios = servicios.filter(s =>
      s.titulo.toLowerCase().includes(search) ||
      s.descripcion?.toLowerCase().includes(search) ||
      s.descripcionCorta?.toLowerCase().includes(search)
    ).slice(0, 5);

    matchingServicios.forEach(servicio => {
      results.push({
        id: `servicio-${servicio._id}`,
        type: 'servicio',
        label: servicio.titulo,
        subtitle: servicio.descripcionCorta || (typeof servicio.categoria === 'string' ? servicio.categoria : servicio.categoria?.nombre || 'Sin categoría'),
        servicio
      });
    });

    // 2. Categorías únicas
    const categorias = [...new Set(
      servicios
        .map(s => s.categoria)
        .filter(c => c.toLowerCase().includes(search))
    )].slice(0, 2);

    categorias.forEach(categoria => {
      const count = servicios.filter(s => s.categoria === categoria).length;
      results.push({
        id: `categoria-${categoria}`,
        type: 'categoria',
        label: categoria,
        subtitle: `${count} servicio${count !== 1 ? 's' : ''}`
      });
    });

    // 3. Tags únicos
    const allTags = servicios.flatMap(s => s.etiquetas || []);
    const matchingTags = [...new Set(
      allTags.filter(tag => tag.toLowerCase().includes(search))
    )].slice(0, 3);

    matchingTags.forEach(tag => {
      const count = servicios.filter(s => s.etiquetas?.includes(tag)).length;
      results.push({
        id: `tag-${tag}`,
        type: 'tag',
        label: tag,
        subtitle: `${count} servicio${count !== 1 ? 's' : ''}`
      });
    });

    return results.slice(0, maxResults);
  })();

  // ============================================
  // EFECTOS
  // ============================================

  // Aplicar búsqueda cuando cambia el valor debounced
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'servicio' && suggestion.servicio && onSelectServicio) {
      onSelectServicio(suggestion.servicio);
      setSearchTerm(suggestion.label);
    } else {
      setSearchTerm(suggestion.label);
      onSearch(suggestion.label);
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    clearSearch();
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const getIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'servicio': return <ServiceIcon />;
      case 'categoria': return <CategoryIcon />;
      case 'tag': return <TagIcon />;
    }
  };

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'servicio': return 'Servicio';
      case 'categoria': return 'Categoría';
      case 'tag': return 'Tag';
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <LoadingIcon />
          ) : (
            <SearchIcon />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Limpiar búsqueda"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {/* Dropdown de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${index === selectedIndex ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    flex-shrink-0 mt-0.5
                    ${suggestion.type === 'servicio' ? 'text-purple-600 dark:text-purple-400' : ''}
                    ${suggestion.type === 'categoria' ? 'text-blue-600 dark:text-blue-400' : ''}
                    ${suggestion.type === 'tag' ? 'text-green-600 dark:text-green-400' : ''}
                  `}>
                    {getIcon(suggestion.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {suggestion.label}
                      </p>
                      <span className={`
                        px-2 py-0.5 text-xs rounded-full
                        ${suggestion.type === 'servicio' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''}
                        ${suggestion.type === 'categoria' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''}
                        ${suggestion.type === 'tag' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : ''}
                      `}>
                        {getTypeLabel(suggestion.type)}
                      </span>
                    </div>
                    {suggestion.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {suggestion.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer con info */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Usa ↑↓ para navegar, Enter para seleccionar, Esc para cerrar
            </p>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {showSuggestions && debouncedValue.length >= 2 && suggestions.length === 0 && !isSearching && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No se encontraron resultados para "{debouncedValue}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchWithAutocomplete;
