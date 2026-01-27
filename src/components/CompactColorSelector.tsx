import React from 'react';

interface ThemeColors {
  light: string;
  dark: string;
}

interface CompactColorSelectorProps {
  themeColors?: ThemeColors;
  onThemeColorChange?: (mode: 'light' | 'dark', color: string) => void;
  label: string;
}

const CompactColorSelector: React.FC<CompactColorSelectorProps> = ({
  themeColors,
  onThemeColorChange,
  label
}) => {
  if (!themeColors || !onThemeColorChange) {
    return (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
    );
  }

  return (
    <div className="flex items-center justify-between mb-2">
      {/* Label principal */}
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      {/* Selectores de color compactos */}
      <div className="flex items-center space-x-3">
        {/* Color tema claro */}
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500">☀️</span>
          <input
            type="color"
            value={themeColors.light || '#1F2937'}
            onChange={(e) => onThemeColorChange('light', e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
            title="Color para tema claro"
          />
          {themeColors.light && (
            <button
              onClick={() => onThemeColorChange('light', '')}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Resetear color"
              type="button"
            >
              ×
            </button>
          )}
        </div>

        {/* Color tema oscuro */}
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500">🌙</span>
          <input
            type="color"
            value={themeColors.dark || '#F9FAFB'}
            onChange={(e) => onThemeColorChange('dark', e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
            title="Color para tema oscuro"
          />
          {themeColors.dark && (
            <button
              onClick={() => onThemeColorChange('dark', '')}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Resetear color"
              type="button"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactColorSelector;