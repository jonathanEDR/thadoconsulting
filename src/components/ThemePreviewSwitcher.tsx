// Componente para alternar entre vista previa de temas
import React, { useState } from 'react';
import ButtonPreview from './ButtonPreview';

interface ThemePreviewSwitcherProps {
  lightMode: {
    buttons?: {
      ctaPrimary?: {
        bg: string;
        text: string;
        hover: string;
      };
      contact?: {
        bg: string;
        text: string;
        border?: string;
        hover: string;
        hoverText?: string;
      };
      dashboard?: {
        bg: string;
        text: string;
        hover: string;
      };
    };
  };
  darkMode: {
    buttons?: {
      ctaPrimary?: {
        bg: string;
        text: string;
        hover: string;
      };
      contact?: {
        bg: string;
        text: string;
        border?: string;
        hover: string;
        hoverText?: string;
      };
      dashboard?: {
        bg: string;
        text: string;
        hover: string;
      };
    };
  };
}

export const ThemePreviewSwitcher: React.FC<ThemePreviewSwitcherProps> = ({
  lightMode,
  darkMode
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="space-y-4">
      {/* Selector de tema */}
      <div className="flex items-center justify-between">
        <h5 className="text-md font-medium text-gray-700 dark:text-gray-200">
          Alternar Vista Previa:
        </h5>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setCurrentTheme('light')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentTheme === 'light'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            ☀️ Claro
          </button>
          <button
            onClick={() => setCurrentTheme('dark')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentTheme === 'dark'
                ? 'bg-gray-800 dark:bg-gray-600 text-white dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🌙 Oscuro
          </button>
        </div>
      </div>

      {/* Vista previa */}
      <ButtonPreview
        lightMode={lightMode}
        darkMode={darkMode}
        currentTheme={currentTheme}
      />
    </div>
  );
};

export default ThemePreviewSwitcher;