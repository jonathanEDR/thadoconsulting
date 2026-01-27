import React from 'react';
import { ColorInput } from './ColorInput';

interface ThemeStylesConfig {
  panelBackground: string;
  panelBorder: string;
  headerBackground: string;
  headerText: string;
  headerIcon: string;
  contentBackground: string;
  contentText: string;
  accentGradientFrom: string;
  accentGradientTo: string;
}

interface ThemeStylePanelProps {
  theme: 'light' | 'dark';
  themeLabel: string;
  themeIcon: string;
  styles: ThemeStylesConfig;
  onStyleChange: (field: keyof ThemeStylesConfig, value: string) => void;
}

/**
 * Componente reutilizable para configurar estilos de un tema (claro u oscuro)
 * Reduce duplicación de código entre tema claro y oscuro
 */
export const ThemeStylePanel: React.FC<ThemeStylePanelProps> = ({
  theme,
  themeLabel,
  themeIcon,
  styles,
  onStyleChange,
}) => {
  const isDark = theme === 'dark';
  
  const defaults = {
    light: {
      panelBackground: 'rgba(255, 255, 255, 0.6)',
      headerBackground: '#ffffff',
      contentBackground: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
      panelBackground: 'rgba(31, 41, 55, 0.4)',
      headerBackground: '#1f2937',
      contentBackground: 'rgba(17, 24, 39, 0.3)',
    },
  };

  return (
    <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {themeIcon} {themeLabel}
      </p>

      <div className="space-y-3">
        {/* Fondo del Panel */}
        <ColorInput
          label="Fondo del Panel"
          value={styles.panelBackground}
          onChange={(value) => onStyleChange('panelBackground', value)}
          allowTransparent
          defaultNonTransparentValue={defaults[theme].panelBackground}
          placeholder={defaults[theme].panelBackground}
        />

        {/* Color de Borde */}
        <ColorInput
          label="Color de Borde"
          value={styles.panelBorder}
          onChange={(value) => onStyleChange('panelBorder', value)}
          placeholder={isDark ? '#374151' : '#e5e7eb'}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Fondo del Header */}
        <ColorInput
          label="Fondo del Header"
          value={styles.headerBackground}
          onChange={(value) => onStyleChange('headerBackground', value)}
          allowTransparent
          defaultNonTransparentValue={defaults[theme].headerBackground}
          placeholder="transparent"
        />

        {/* Texto del Header */}
        <ColorInput
          label="Texto del Header"
          value={styles.headerText}
          onChange={(value) => onStyleChange('headerText', value)}
          placeholder={isDark ? '#ffffff' : '#111827'}
        />

        {/* Color del Icono */}
        <ColorInput
          label="Color del Icono"
          value={styles.headerIcon}
          onChange={(value) => onStyleChange('headerIcon', value)}
          placeholder={isDark ? '#a78bfa' : '#8b5cf6'}
        />

        {/* Fondo del Contenido */}
        <ColorInput
          label="Fondo del Contenido"
          value={styles.contentBackground}
          onChange={(value) => onStyleChange('contentBackground', value)}
          allowTransparent
          defaultNonTransparentValue={defaults[theme].contentBackground}
          placeholder={defaults[theme].contentBackground}
        />

        {/* Texto del Contenido */}
        <ColorInput
          label="Texto del Contenido"
          value={styles.contentText}
          onChange={(value) => onStyleChange('contentText', value)}
          placeholder={isDark ? '#d1d5db' : '#374151'}
        />

        {/* Gradiente Acento (Inicio) */}
        <ColorInput
          label="Gradiente Acento (Inicio)"
          value={styles.accentGradientFrom}
          onChange={(value) => onStyleChange('accentGradientFrom', value)}
          placeholder={isDark ? '#a78bfa' : '#8b5cf6'}
        />

        {/* Gradiente Acento (Final) */}
        <ColorInput
          label="Gradiente Acento (Final)"
          value={styles.accentGradientTo}
          onChange={(value) => onStyleChange('accentGradientTo', value)}
          placeholder={isDark ? '#22d3ee' : '#06b6d4'}
        />
      </div>

      {/* Vista previa */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
        <div className={isDark ? 'bg-gray-900 p-3 rounded' : 'bg-white p-3 rounded'}>
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              background: styles.panelBackground,
              borderColor: styles.panelBorder,
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{
                background: `linear-gradient(to right, ${styles.accentGradientFrom}20, ${styles.accentGradientTo}20)`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{
                  background: `linear-gradient(to br, ${styles.accentGradientFrom}, ${styles.accentGradientTo})`,
                  color: '#ffffff',
                }}
              >
                📋
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: styles.headerText }}>
                  Título del Panel
                </p>
                <p className="text-xs opacity-60">Descripción del panel</p>
              </div>
            </div>
            <div
              className="px-4 py-3"
              style={{
                background: styles.contentBackground,
                color: styles.contentText,
              }}
            >
              <p className="text-sm">Contenido del panel de ejemplo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
