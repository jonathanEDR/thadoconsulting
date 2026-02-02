/**
 * 🎨 Editores de Estilo Compactos
 * Componentes reutilizables para configuración de colores y estilos
 * Optimizados para ocupar menos espacio vertical
 */

import React, { useState } from 'react';

// ============================================
// TIPOS
// ============================================

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  showTransparent?: boolean; // Nuevo: Mostrar botón de transparente
}

interface ThemeTabsProps {
  activeTheme: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onChange?: (theme: 'light' | 'dark') => void; // Alias para compatibilidad
}

interface DualThemeColorPickerProps {
  label: string;
  lightValue: string;
  darkValue: string;
  onLightChange: (value: string) => void;
  onDarkChange: (value: string) => void;
}

interface StyleTypeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  size?: 'sm' | 'md';
}

interface GradientPickerProps {
  fromColor: string;
  toColor: string;
  direction: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
  showPreview?: boolean;
}

interface CompactSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  headerRight?: React.ReactNode;
}

// ============================================
// COMPONENTES
// ============================================

/**
 * Selector de color compacto con input de color y texto
 */
export const CompactColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  size = 'sm',
  showTransparent = false
}) => {
  const heightClass = size === 'sm' ? 'h-7' : 'h-9';
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';
  const isTransparent = value === 'transparent' || value === 'none' || value === '';
  
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span className={`${textClass} text-gray-500 dark:text-gray-400 min-w-fit`}>
          {label}
        </span>
      )}
      <input
        type="color"
        value={isTransparent ? '#ffffff' : value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-7 ${heightClass} rounded cursor-pointer border border-gray-300 dark:border-gray-600 ${isTransparent ? 'opacity-50' : ''}`}
        disabled={isTransparent}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-2 py-1 ${textClass} border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono min-w-0`}
        style={{ maxWidth: '90px' }}
        placeholder="#000000"
      />
      {showTransparent && (
        <button
          type="button"
          onClick={() => onChange(isTransparent ? '#ffffff' : 'transparent')}
          className={`px-2 py-1 ${textClass} rounded border transition-all ${
            isTransparent
              ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={isTransparent ? 'Click para usar color' : 'Click para transparente'}
        >
          {isTransparent ? '🔲' : '◻️'}
        </button>
      )}
    </div>
  );
};

/**
 * Tabs para alternar entre Modo Claro y Modo Oscuro
 */
export const ThemeTabs: React.FC<ThemeTabsProps> = ({ activeTheme, onThemeChange, onChange }) => {
  const handleChange = onThemeChange || onChange || (() => {});
  
  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <button
        onClick={() => handleChange('light')}
        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
          activeTheme === 'light'
            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        ☀️ Claro
      </button>
      <button
        onClick={() => handleChange('dark')}
        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
          activeTheme === 'dark'
            ? 'bg-gray-800 text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        🌙 Oscuro
      </button>
    </div>
  );
};

/**
 * Editor de color dual (claro/oscuro) en una sola fila
 */
export const DualThemeColorPicker: React.FC<DualThemeColorPickerProps> = ({
  label,
  lightValue,
  darkValue,
  onLightChange,
  onDarkChange
}) => (
  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 py-1.5">
    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{label}</span>
    <span className="text-[10px] text-gray-400">☀️</span>
    <input
      type="color"
      value={lightValue}
      onChange={(e) => onLightChange(e.target.value)}
      className="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
    />
    <span className="text-[10px] text-gray-400">🌙</span>
    <input
      type="color"
      value={darkValue}
      onChange={(e) => onDarkChange(e.target.value)}
      className="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
    />
  </div>
);

/**
 * Select de tipo de estilo compacto
 */
export const StyleTypeSelect: React.FC<StyleTypeSelectProps> = ({
  label,
  value,
  onChange,
  options,
  size = 'sm'
}) => {
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className="flex items-center gap-2">
      <span className={`${textClass} text-gray-500 dark:text-gray-400 min-w-fit`}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-2 py-1 ${textClass} border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

/**
 * Editor de gradiente compacto
 */
export const CompactGradientPicker: React.FC<GradientPickerProps> = ({
  fromColor,
  toColor,
  direction,
  onFromChange,
  onToChange,
  onDirectionChange,
  showPreview = true
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-400">De</span>
        <input
          type="color"
          value={fromColor}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-400">A</span>
        <input
          type="color"
          value={toColor}
          onChange={(e) => onToChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
        />
      </div>
      <select
        value={direction}
        onChange={(e) => onDirectionChange(e.target.value)}
        className="flex-1 px-1.5 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="90deg">→</option>
        <option value="135deg">↘</option>
        <option value="180deg">↓</option>
        <option value="45deg">↗</option>
        <option value="0deg">←</option>
        <option value="270deg">↑</option>
      </select>
    </div>
    {showPreview && (
      <div 
        className="h-2 rounded-full"
        style={{ background: `linear-gradient(${direction}, ${fromColor}, ${toColor})` }}
      />
    )}
  </div>
);

/**
 * Sección colapsable compacta
 */
export const CompactSection: React.FC<CompactSectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
  headerRight
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          {icon && <span>{icon}</span>}
          {title}
          <span className={`text-gray-400 transition-transform text-xs ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {headerRight && (
          <div onClick={(e) => e.stopPropagation()}>
            {headerRight}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="p-3 bg-white dark:bg-gray-800">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Fila de configuración con etiqueta y control inline
 */
export const ConfigRow: React.FC<{
  label: string;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, children, hint }) => (
  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="flex-shrink-0">
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
    </div>
    <div className="flex-1 max-w-[200px]">
      {children}
    </div>
  </div>
);

/**
 * Grid de colores para múltiples propiedades
 * Soporta botón de transparencia inline con showTransparent
 */
export const ColorGrid: React.FC<{
  items: Array<{
    label: string;
    lightKey: string;
    darkKey: string;
    lightValue: string;
    darkValue: string;
    onLightChange: (value: string) => void;
    onDarkChange: (value: string) => void;
    showTransparent?: boolean;
  }>;
}> = ({ items }) => {
  // Helper para detectar si un valor es transparente
  const isTransparentValue = (v: string) => 
    v === 'transparent' || v === 'none' || v === '';

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_80px_80px] gap-2 text-[10px] text-gray-400 px-1">
        <span>Propiedad</span>
        <span className="text-center">☀️ Claro</span>
        <span className="text-center">🌙 Oscuro</span>
      </div>
      {items.map((item, idx) => {
        const lightIsTransparent = isTransparentValue(item.lightValue);
        const darkIsTransparent = isTransparentValue(item.darkValue);
        
        return (
          <div key={idx} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.label}</span>
            
            {/* Light theme color */}
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={lightIsTransparent ? '#ffffff' : item.lightValue}
                onChange={(e) => item.onLightChange(e.target.value)}
                disabled={lightIsTransparent}
                className={`w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600 ${lightIsTransparent ? 'opacity-40' : ''}`}
              />
              {item.showTransparent && (
                <button
                  type="button"
                  onClick={() => item.onLightChange(lightIsTransparent ? '#ffffff' : 'transparent')}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-all ${
                    lightIsTransparent 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'
                  }`}
                  title={lightIsTransparent ? 'Restaurar color' : 'Hacer transparente'}
                >
                  {lightIsTransparent ? '🔲' : '◻️'}
                </button>
              )}
            </div>
            
            {/* Dark theme color */}
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={darkIsTransparent ? '#1f2937' : item.darkValue}
                onChange={(e) => item.onDarkChange(e.target.value)}
                disabled={darkIsTransparent}
                className={`w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600 ${darkIsTransparent ? 'opacity-40' : ''}`}
              />
              {item.showTransparent && (
                <button
                  type="button"
                  onClick={() => item.onDarkChange(darkIsTransparent ? '#1f2937' : 'transparent')}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-all ${
                    darkIsTransparent 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'
                  }`}
                  title={darkIsTransparent ? 'Restaurar color' : 'Hacer transparente'}
                >
                  {darkIsTransparent ? '🔲' : '◻️'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Toggle compacto con etiqueta y descripción opcional
 */
export const CompactToggle: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
    />
    <div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</span>
      {description && <p className="text-[10px] text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  </label>
);

/**
 * ColorGrid simplificado para un solo par de colores
 */
export const ColorGridSimple: React.FC<{
  label: string;
  lightValue: string;
  darkValue: string;
  onLightChange: (value: string) => void;
  onDarkChange: (value: string) => void;
}> = ({ label, lightValue, darkValue, onLightChange, onDarkChange }) => (
  <div className="grid grid-cols-[1fr_60px_60px] gap-2 items-center py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{label}</span>
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-400">☀️</span>
      <input
        type="color"
        value={lightValue}
        onChange={(e) => onLightChange(e.target.value)}
        className="w-8 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
      />
    </div>
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-400">🌙</span>
      <input
        type="color"
        value={darkValue}
        onChange={(e) => onDarkChange(e.target.value)}
        className="w-8 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
      />
    </div>
  </div>
);

export default {
  CompactColorPicker,
  ThemeTabs,
  DualThemeColorPicker,
  StyleTypeSelect,
  CompactGradientPicker,
  CompactSection,
  ConfigRow,
  ColorGrid,
  ColorGridSimple,
  CompactToggle
};
