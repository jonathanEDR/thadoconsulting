/**
 * 📊 COMPONENTE DE ORDENAMIENTO
 * Selector avanzado de ordenamiento con múltiples opciones
 */

import { useState, useRef, useEffect } from 'react';
import type { SortOption } from '../../types/filters';
import { SORT_OPTIONS } from '../../types/filters';

// ============================================
// TIPOS
// ============================================

interface SortSelectorProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

// ============================================
// ICONOS
// ============================================

const SortIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ============================================
// COMPONENTE
// ============================================

export const SortSelector = ({ currentSort, onSortChange }: SortSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  const isSelected = (option: SortOption) => {
    return option.field === currentSort.field && option.order === currentSort.order;
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Botón trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <SortIcon />
        <span className="hidden sm:inline">{currentSort.label}</span>
        <span className="sm:hidden">Ordenar</span>
        <ChevronDownIcon />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {SORT_OPTIONS.map((option, index) => (
              <button
                key={`${option.field}-${option.order}`}
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center justify-between
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors
                  ${isSelected(option) ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === SORT_OPTIONS.length - 1 ? 'rounded-b-lg' : ''}
                `}
              >
                <span>{option.label}</span>
                {isSelected(option) && (
                  <CheckIcon />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortSelector;
