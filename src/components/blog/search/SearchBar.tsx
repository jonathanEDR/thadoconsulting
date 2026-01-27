/**
 * 🔍 SearchBar Component
 * Barra de búsqueda con autocompletado y sugerencias
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';

interface SearchSuggestion {
  type: 'post' | 'category' | 'tag';
  value: string;
  label: string;
  count?: number;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  showSuggestions?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar artículos, categorías, tags...',
  suggestions = [],
  recentSearches = [],
  showSuggestions = true,
  autoFocus = false,
  className = ''
}: SearchBarProps) {
  
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manejar clic fuera para cerrar dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar búsqueda
  const handleSearch = (query: string) => {
    onSearch(query);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  // Manejar Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      handleSearch(value);
    }
  };

  // Limpiar búsqueda
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  // Seleccionar sugerencia
  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    handleSearch(suggestion);
  };

  // Filtrar sugerencias basadas en el valor actual
  const filteredSuggestions = suggestions.filter(s =>
    s.label.toLowerCase().includes(value.toLowerCase())
  );

  // Mostrar dropdown si hay foco y contenido
  const shouldShowDropdown = showSuggestions && 
    isFocused && 
    showDropdown && 
    (value.length > 0 || recentSearches.length > 0);

  return (
    <div className={`search-bar relative ${className}`}>
      {/* Input Container */}
      <div className={`
        relative flex items-center
        bg-white border-2 rounded-lg
        transition-all duration-200
        ${isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-300 shadow-sm'}
      `}>
        {/* Icono de búsqueda */}
        <div className="absolute left-3 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-11 pr-20 py-3 text-gray-900 placeholder-gray-400 focus:outline-none rounded-lg"
        />

        {/* Botones de acción */}
        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <button
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Limpiar"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleSearch(value)}
            disabled={!value.trim()}
            className={`
              px-4 py-1.5 rounded-lg font-medium transition-colors
              ${value.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Dropdown de sugerencias */}
      {shouldShowDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {/* Búsquedas recientes */}
          {value.length === 0 && recentSearches.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>Búsquedas recientes</span>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => handleSelectSuggestion(search)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Sugerencias filtradas */}
          {value.length > 0 && filteredSuggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Sugerencias</span>
              </div>

              {/* Agrupar por tipo */}
              {['post', 'category', 'tag'].map(type => {
                const typeSuggestions = filteredSuggestions.filter(s => s.type === type);
                if (typeSuggestions.length === 0) return null;

                return (
                  <div key={type} className="mb-2">
                    <div className="px-3 py-1 text-xs font-medium text-gray-400">
                      {type === 'post' && 'Artículos'}
                      {type === 'category' && 'Categorías'}
                      {type === 'tag' && 'Tags'}
                    </div>
                    {typeSuggestions.map((suggestion, index) => (
                      <button
                        key={`${type}-${index}`}
                        onClick={() => handleSelectSuggestion(suggestion.value)}
                        className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="truncate">{suggestion.label}</span>
                        {suggestion.count !== undefined && (
                          <span className="ml-2 text-xs text-gray-400">
                            {suggestion.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sin resultados */}
          {value.length > 0 && filteredSuggestions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="font-medium">No se encontraron sugerencias</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
