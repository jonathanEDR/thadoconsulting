import React from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowTransparent?: boolean;
  defaultNonTransparentValue?: string;
  placeholder?: string;
}

/**
 * Componente reutilizable para inputs de color con:
 * - Input de texto para códigos (hex, rgba, etc.)
 * - Color picker visual
 * - Checkbox opcional para transparencia
 */
export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  value,
  onChange,
  allowTransparent = false,
  defaultNonTransparentValue = '#ffffff',
  placeholder = '#ffffff',
}) => {
  const isTransparent = value === 'transparent';
  const colorValue = value?.startsWith('#') ? value : defaultNonTransparentValue;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isTransparent && allowTransparent}
            className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="color"
            value={colorValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={isTransparent && allowTransparent}
            className="w-12 h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        {allowTransparent && (
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isTransparent}
              onChange={(e) => onChange(e.target.checked ? 'transparent' : defaultNonTransparentValue)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span>Fondo transparente</span>
          </label>
        )}
      </div>
    </div>
  );
};
