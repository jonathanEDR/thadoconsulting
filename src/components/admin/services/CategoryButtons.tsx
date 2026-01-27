/**
 * 🔘 Category Buttons Component
 * Botones clicables para seleccionar categoría en el flujo conversacional
 */

import React from 'react';
import { Check } from 'lucide-react';

interface CategoryOption {
  nombre: string;
  slug: string;
}

interface CategoryButtonsProps {
  options: CategoryOption[];
  onSelect: (category: string) => void;
  disabled?: boolean;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ options, onSelect, disabled }) => {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleClick = (categoryName: string) => {
    if (disabled) return;
    
    setSelected(categoryName);
    
    // Simular un pequeño delay para feedback visual
    setTimeout(() => {
      onSelect(categoryName);
      setSelected(null);
    }, 300);
  };

  return (
    <div className="my-4">
      <p className="text-xs font-semibold text-gray-600 mb-3">
        👇 Selecciona una categoría:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.slug}
            onClick={() => handleClick(option.nombre)}
            disabled={disabled}
            className={`
              relative px-4 py-3 rounded-lg text-sm font-medium
              transition-all duration-200
              ${selected === option.nombre
                ? 'bg-purple-600 text-white scale-95'
                : 'bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-600'
              }
              border-2 border-purple-200 hover:border-purple-400
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-between gap-2
            `}
          >
            <span>{option.nombre}</span>
            {selected === option.nombre && (
              <Check className="h-4 w-4 animate-pulse" />
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Tip: También puedes escribir el nombre de la categoría
      </p>
    </div>
  );
};

export default CategoryButtons;
