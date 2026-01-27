/**
 * 💳 CardStylePanel - Componente para configurar estilos de tarjetas de contenido
 * Usado para personalizar las tarjetas de beneficios, características, FAQ, etc.
 * 
 * REFACTORIZADO: Sin useEffect para evitar actualizaciones en cascada
 * Todos los cambios se propagan directamente via onStyleChange
 */

import React from 'react';
import { ColorInput } from './ColorInput';

interface CardStyles {
  background: string;
  borderColor: string;
  borderWidth?: string;
  textColor: string;
  borderRadius: string;
  iconBackground: string;
  iconColor: string;
  iconBackgroundType?: 'solid' | 'gradient';
  iconGradientFrom?: string;
  iconGradientTo?: string;
  iconGradientDirection?: string;
}

interface CardStylePanelProps {
  theme: 'light' | 'dark';
  themeLabel: string;
  themeIcon: string;
  styles: CardStyles | undefined;
  onStyleChange: (field: string, value: string) => void;
}

const BORDER_RADIUS_OPTIONS = [
  { value: '0', label: 'Sin redondeo' },
  { value: '0.25rem', label: 'Pequeño (4px)' },
  { value: '0.5rem', label: 'Medio (8px)' },
  { value: '0.75rem', label: 'Grande (12px)' },
  { value: '1rem', label: 'Extra grande (16px)' },
  { value: '1.5rem', label: 'Redondeado (24px)' },
];

const BORDER_WIDTH_OPTIONS = [
  { value: '0', label: 'Sin borde' },
  { value: '1px', label: 'Fino (1px)' },
  { value: '2px', label: 'Normal (2px)' },
  { value: '3px', label: 'Grueso (3px)' },
  { value: '4px', label: 'Extra grueso (4px)' },
];

const DEFAULT_LIGHT_STYLES: CardStyles = {
  background: 'rgba(0, 0, 0, 0.05)',
  borderColor: 'transparent',
  borderWidth: '0',
  textColor: '#374151',
  borderRadius: '0.5rem',
  iconBackground: 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)',
  iconColor: '#ffffff',
  iconBackgroundType: 'gradient',
  iconGradientFrom: '#8b5cf6',
  iconGradientTo: '#06b6d4',
  iconGradientDirection: 'to bottom right',
};

const DEFAULT_DARK_STYLES: CardStyles = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderColor: 'transparent',
  borderWidth: '0',
  textColor: '#d1d5db',
  borderRadius: '0.5rem',
  iconBackground: 'linear-gradient(to bottom right, #a78bfa, #22d3ee)',
  iconColor: '#ffffff',
  iconBackgroundType: 'gradient',
  iconGradientFrom: '#a78bfa',
  iconGradientTo: '#22d3ee',
  iconGradientDirection: 'to bottom right',
};

export const CardStylePanel: React.FC<CardStylePanelProps> = ({
  theme,
  themeLabel,
  themeIcon,
  styles,
  onStyleChange,
}) => {
  const defaults = theme === 'light' ? DEFAULT_LIGHT_STYLES : DEFAULT_DARK_STYLES;
  
  // Merge styles con defaults - valores actuales
  const currentStyles: CardStyles = {
    background: styles?.background ?? defaults.background,
    borderColor: styles?.borderColor ?? defaults.borderColor,
    borderWidth: styles?.borderWidth ?? defaults.borderWidth,
    textColor: styles?.textColor ?? defaults.textColor,
    borderRadius: styles?.borderRadius ?? defaults.borderRadius,
    iconBackground: styles?.iconBackground ?? defaults.iconBackground,
    iconColor: styles?.iconColor ?? defaults.iconColor,
    iconBackgroundType: styles?.iconBackgroundType ?? defaults.iconBackgroundType,
    iconGradientFrom: styles?.iconGradientFrom ?? defaults.iconGradientFrom,
    iconGradientTo: styles?.iconGradientTo ?? defaults.iconGradientTo,
    iconGradientDirection: styles?.iconGradientDirection ?? defaults.iconGradientDirection,
  };

  return (
    <div className={`mb-6 p-4 rounded-lg border ${
      theme === 'light' 
        ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
        : 'bg-gray-800/50 dark:bg-gray-900/50 border-gray-600 dark:border-gray-700'
    }`}>
      <h5 className={`font-medium mb-4 flex items-center gap-2 ${
        theme === 'light' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300'
      }`}>
        <span>{themeIcon}</span> {themeLabel}
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fondo de Tarjeta */}
        <ColorInput
          label="Fondo de Tarjeta"
          value={currentStyles.background}
          onChange={(value) => onStyleChange('background', value)}
          allowTransparent
          defaultNonTransparentValue={defaults.background}
        />

        {/* Color del Texto */}
        <ColorInput
          label="Color del Texto"
          value={currentStyles.textColor}
          onChange={(value) => onStyleChange('textColor', value)}
        />

        {/* Color de Borde */}
        <ColorInput
          label="Color de Borde"
          value={currentStyles.borderColor}
          onChange={(value) => onStyleChange('borderColor', value)}
          allowTransparent
          defaultNonTransparentValue={theme === 'light' ? '#e5e7eb' : '#374151'}
        />

        {/* Ancho de Borde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ancho de Borde
          </label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={currentStyles.borderWidth || '0'}
            onChange={(e) => onStyleChange('borderWidth', e.target.value)}
          >
            {BORDER_WIDTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Radio de Borde
          </label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={currentStyles.borderRadius}
            onChange={(e) => onStyleChange('borderRadius', e.target.value)}
          >
            {BORDER_RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color del Ícono (texto) */}
        <ColorInput
          label="Color del Ícono"
          value={currentStyles.iconColor}
          onChange={(value) => onStyleChange('iconColor', value)}
        />
      </div>

      {/* Vista Previa de Tarjeta Completa */}
      <div className="mt-4 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2">
          👁️ Vista Previa de Tarjeta
        </span>
        <div
          className="flex items-start gap-4 transition-all duration-300"
          style={{
            background: currentStyles.background,
            borderColor: currentStyles.borderColor,
            borderWidth: currentStyles.borderWidth || '0',
            borderStyle: 'solid',
            borderRadius: currentStyles.borderRadius,
            padding: '1rem',
          }}
        >
          <div
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg"
            style={{
              color: currentStyles.iconColor,
            }}
          >
            ★
          </div>
          <p
            className="font-medium flex-1"
            style={{ color: currentStyles.textColor }}
          >
            Ejemplo de tarjeta de beneficio con el estilo configurado
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardStylePanel;
