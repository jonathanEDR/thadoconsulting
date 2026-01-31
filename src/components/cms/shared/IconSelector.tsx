/**
 * 🎨 IconSelector Component
 * Selector de iconos de Lucide React para el CMS
 * Permite seleccionar un icono y definir colores para tema claro y oscuro
 */

import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import DynamicIcon, { AVAILABLE_SIDEBAR_ICONS } from '../../ui/DynamicIcon';

export interface IconSelectorProps {
  /** Nombre del icono actual (ej: 'ShoppingCart') */
  iconName?: string;
  /** Color del icono para tema claro */
  iconColorLight?: string;
  /** Color del icono para tema oscuro */
  iconColorDark?: string;
  /** Callback cuando cambia el icono seleccionado */
  onIconChange: (iconName: string) => void;
  /** Callback cuando cambia el color del tema claro */
  onColorLightChange: (color: string) => void;
  /** Callback cuando cambia el color del tema oscuro */
  onColorDarkChange: (color: string) => void;
  /** Título de la sección */
  title?: string;
  /** Descripción de la sección */
  description?: string;
  /** Clase CSS personalizada */
  className?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  iconName = 'Circle',
  iconColorLight = '#6366f1',
  iconColorDark = '#818cf8',
  onIconChange,
  onColorLightChange,
  onColorDarkChange,
  title = '🎨 Seleccionar Icono',
  description = 'Elige un icono de la biblioteca Lucide React',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {/* Icono actual y controles de color */}
      <div className="flex items-center gap-4 mb-3">
        {/* Preview del icono actual */}
        <div className="flex items-center gap-3">
          {/* Tema claro */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-lg bg-white border-2 border-gray-300 flex items-center justify-center">
              <DynamicIcon 
                name={iconName} 
                size={24} 
                color={iconColorLight}
                strokeWidth={2}
              />
            </div>
            <span className="text-xs text-gray-500">🌞 Claro</span>
          </div>

          {/* Tema oscuro */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-lg bg-gray-900 border-2 border-gray-600 flex items-center justify-center">
              <DynamicIcon 
                name={iconName} 
                size={24} 
                color={iconColorDark}
                strokeWidth={2}
              />
            </div>
            <span className="text-xs text-gray-400">🌙 Oscuro</span>
          </div>
        </div>

        {/* Selectores de color */}
        <div className="flex-1 space-y-2">
          {/* Color tema claro */}
          <div className="flex items-center gap-2">
            <Sun size={14} className="text-yellow-500" />
            <label className="text-xs text-gray-600 dark:text-gray-400 w-20">
              Tema Claro
            </label>
            <input
              type="color"
              value={iconColorLight}
              onChange={(e) => onColorLightChange(e.target.value)}
              className="w-10 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
              title="Color para tema claro"
            />
            <input
              type="text"
              value={iconColorLight}
              onChange={(e) => onColorLightChange(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="#6366f1"
            />
          </div>

          {/* Color tema oscuro */}
          <div className="flex items-center gap-2">
            <Moon size={14} className="text-indigo-400" />
            <label className="text-xs text-gray-600 dark:text-gray-400 w-20">
              Tema Oscuro
            </label>
            <input
              type="color"
              value={iconColorDark}
              onChange={(e) => onColorDarkChange(e.target.value)}
              className="w-10 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
              title="Color para tema oscuro"
            />
            <input
              type="text"
              value={iconColorDark}
              onChange={(e) => onColorDarkChange(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="#818cf8"
            />
          </div>
        </div>
      </div>

      {/* Botón para expandir selector */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 
                   text-purple-700 dark:text-purple-300 rounded-lg hover:from-purple-200 hover:to-indigo-200 
                   dark:hover:from-purple-900/50 dark:hover:to-indigo-900/50 transition-colors text-sm font-medium"
      >
        {isExpanded ? '▲ Ocultar galería de iconos' : '▼ Cambiar icono'}
      </button>

      {/* Grid de iconos expandido */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Selecciona un icono de la biblioteca Lucide React:
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-h-64 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            {AVAILABLE_SIDEBAR_ICONS.map((icon) => (
              <button
                key={icon.name}
                onClick={() => {
                  onIconChange(icon.name);
                  setIsExpanded(false);
                }}
                className={`p-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 transform hover:scale-110
                  ${iconName === icon.name 
                    ? 'bg-purple-200 dark:bg-purple-800 ring-2 ring-purple-500 shadow-lg' 
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                  }`}
                title={icon.label}
              >
                <DynamicIcon 
                  name={icon.name} 
                  size={20} 
                  color={iconName === icon.name ? '#8B5CF6' : iconColorLight}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
            Icono seleccionado: <span className="font-semibold text-purple-600 dark:text-purple-400">{iconName}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default IconSelector;
