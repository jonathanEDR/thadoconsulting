import React, { useState } from 'react';
import type { ButtonStyle } from '../types/cms';

interface SimpleButtonConfigProps {
  title: string;
  icon: string;
  value: ButtonStyle;
  onChange: (style: ButtonStyle) => void;
}

export const SimpleButtonConfig: React.FC<SimpleButtonConfigProps> = ({
  title,
  icon,
  value,
  onChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Parse initial values from saved config
  const parseBackgroundColor = (bg: string): { color1: string, color2: string, isGradient: boolean, isTransparent: boolean } => {
    if (bg === 'transparent') return { color1: '#8B5CF6', color2: '#06B6D4', isGradient: false, isTransparent: true };
    if (bg?.includes('gradient')) {
      // Extract colors from gradient string
      const matches = bg.match(/#[0-9A-Fa-f]{6}/g);
      return {
        color1: matches?.[0] || '#8B5CF6',
        color2: matches?.[1] || '#06B6D4',
        isGradient: true,
        isTransparent: false
      };
    }
    return { color1: bg || '#8B5CF6', color2: '#06B6D4', isGradient: false, isTransparent: false };
  };

  const parseBorderColor = (border: string): { color1: string, color2: string, isGradient: boolean, isTransparent: boolean } => {
    if (border === 'transparent') return { color1: '#8B5CF6', color2: '#06B6D4', isGradient: false, isTransparent: true };
    if (border?.includes('gradient')) {
      const matches = border.match(/#[0-9A-Fa-f]{6}/g);
      return {
        color1: matches?.[0] || '#8B5CF6',
        color2: matches?.[1] || '#06B6D4',
        isGradient: true,
        isTransparent: false
      };
    }
    return { color1: border || '#8B5CF6', color2: '#06B6D4', isGradient: false, isTransparent: false };
  };

  const bgConfig = parseBackgroundColor(value.background || 'transparent');
  const borderConfig = parseBorderColor(value.borderColor || 'transparent');

  const [useTransparentBg, setUseTransparentBg] = useState(bgConfig.isTransparent);
  const [useGradientBg, setUseGradientBg] = useState(bgConfig.isGradient);
  const [gradientColor1, setGradientColor1] = useState(bgConfig.color1);
  const [gradientColor2, setGradientColor2] = useState(bgConfig.color2);
  
  const [useTransparentBorder, setUseTransparentBorder] = useState(borderConfig.isTransparent);
  const [useGradientBorder, setUseGradientBorder] = useState(borderConfig.isGradient);
  const [borderGradientColor1, setBorderGradientColor1] = useState(borderConfig.color1);
  const [borderGradientColor2, setBorderGradientColor2] = useState(borderConfig.color2);

  const handleCustomChange = (property: keyof ButtonStyle, newValue: string) => {
    onChange({
      ...value,
      [property]: newValue
    });
  };

  const handleTransparentBgToggle = (checked: boolean) => {
    setUseTransparentBg(checked);
    if (checked) {
      setUseGradientBg(false);
      onChange({ ...value, background: 'transparent' });
    } else {
      onChange({ ...value, background: gradientColor1 });
    }
  };

  const handleGradientBgToggle = (checked: boolean) => {
    setUseGradientBg(checked);
    if (checked) {
      setUseTransparentBg(false);
      const gradient = `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;
      onChange({ ...value, background: gradient });
    } else {
      onChange({ ...value, background: gradientColor1 });
    }
  };

  const handleGradientColor1Change = (color: string) => {
    setGradientColor1(color);
    if (useGradientBg) {
      const gradient = `linear-gradient(135deg, ${color} 0%, ${gradientColor2} 100%)`;
      onChange({ ...value, background: gradient });
    } else {
      onChange({ ...value, background: color });
    }
  };

  const handleGradientColor2Change = (color: string) => {
    setGradientColor2(color);
    if (useGradientBg) {
      const gradient = `linear-gradient(135deg, ${gradientColor1} 0%, ${color} 100%)`;
      onChange({ ...value, background: gradient });
    }
  };

  const handleTransparentBorderToggle = (checked: boolean) => {
    setUseTransparentBorder(checked);
    if (checked) {
      setUseGradientBorder(false);
      onChange({ ...value, borderColor: 'transparent' });
    } else {
      onChange({ ...value, borderColor: borderGradientColor1 });
    }
  };

  const handleGradientBorderToggle = (checked: boolean) => {
    setUseGradientBorder(checked);
    if (checked) {
      setUseTransparentBorder(false);
      const gradient = `linear-gradient(90deg, ${borderGradientColor1}, ${borderGradientColor2})`;
      onChange({ ...value, borderColor: gradient });
    } else {
      onChange({ ...value, borderColor: borderGradientColor1 });
    }
  };

  const handleBorderGradientColor1Change = (color: string) => {
    setBorderGradientColor1(color);
    if (useGradientBorder) {
      const gradient = `linear-gradient(90deg, ${color}, ${borderGradientColor2})`;
      onChange({ ...value, borderColor: gradient });
    } else {
      onChange({ ...value, borderColor: color });
    }
  };

  const handleBorderGradientColor2Change = (color: string) => {
    setBorderGradientColor2(color);
    if (useGradientBorder) {
      const gradient = `linear-gradient(90deg, ${borderGradientColor1}, ${color})`;
      onChange({ ...value, borderColor: gradient });
    }
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 rounded-lg">
      {/* Header con Preview */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-750 dark:hover:bg-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{icon}</span>
            <div>
              <h5 className="font-medium text-white dark:text-gray-100">{title}</h5>
              <p className="text-sm text-gray-400 dark:text-gray-300">Click para configurar</p>
            </div>
          </div>
          
          {/* Vista Previa del Botón */}
          <div className="flex items-center space-x-3 min-w-0">
            {value.borderColor?.includes('gradient') ? (
              // Botón con borde gradiente - técnica especial
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-medium relative min-w-0 w-full max-w-[140px] truncate overflow-hidden whitespace-nowrap"
                style={{
                  background: value.background === 'transparent' 
                    ? `linear-gradient(#1F2937, #1F2937) padding-box, ${value.borderColor} border-box`
                    : value.background,
                  color: value.textColor || '#8B5CF6',
                  border: '2px solid transparent'
                }}
              >
                {value.text || (title.includes('Contacto') ? 'CONTÁCTENOS' : 
                 title.includes('Principal') ? 'Ver Servicios' : 
                 'Dashboard')}
              </div>
            ) : (
              // Botón normal con borde sólido
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-medium border-2 transition-all min-w-0 w-full max-w-[140px] truncate overflow-hidden whitespace-nowrap"
                style={{
                  background: value.background || 'transparent',
                  color: value.textColor || '#8B5CF6',
                  borderColor: value.borderColor || 'transparent'
                }}
              >
                {value.text || (title.includes('Contacto') ? 'CONTÁCTENOS' : 
                 title.includes('Principal') ? 'Ver Servicios' : 
                 'Dashboard')}
              </div>
            )}
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''} text-gray-400 dark:text-gray-300`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Panel Expandido */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-700 dark:border-gray-600 space-y-6">
          {/* Texto del Botón */}
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-200 mb-2">📝 Texto del Botón</label>
            <input
              type="text"
              value={value.text || ''}
              onChange={(e) => handleCustomChange('text', e.target.value)}
              placeholder="Ingresa el texto del botón"
              className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Configuración de Fondo */}
          <div className="bg-gray-750 dark:bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h6 className="text-sm font-semibold text-gray-200 mb-3">🎨 Fondo del Botón</h6>
            
            {/* Checkbox: Fondo Transparente */}
            <label className="flex items-center space-x-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useTransparentBg}
                onChange={(e) => handleTransparentBgToggle(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">Fondo Transparente</span>
            </label>

            {/* Checkbox: Usar Gradiente */}
            {!useTransparentBg && (
              <label className="flex items-center space-x-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGradientBg}
                  onChange={(e) => handleGradientBgToggle(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Usar Gradiente</span>
              </label>
            )}

            {/* Selectores de Color */}
            {!useTransparentBg && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {useGradientBg ? 'Color Inicial' : 'Color de Fondo'}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => handleGradientColor1Change(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={gradientColor1}
                      onChange={(e) => handleGradientColor1Change(e.target.value)}
                      placeholder="#8B5CF6"
                      className="flex-1 px-3 py-2 bg-gray-600 dark:bg-gray-700 border border-gray-500 rounded text-white text-xs"
                    />
                  </div>
                </div>

                {useGradientBg && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Color Final</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={gradientColor2}
                        onChange={(e) => handleGradientColor2Change(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={gradientColor2}
                        onChange={(e) => handleGradientColor2Change(e.target.value)}
                        placeholder="#06B6D4"
                        className="flex-1 px-3 py-2 bg-gray-600 dark:bg-gray-700 border border-gray-500 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Color de Texto */}
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-200 mb-2">✏️ Color del Texto</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={value.textColor || '#FFFFFF'}
                onChange={(e) => handleCustomChange('textColor', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value.textColor || ''}
                onChange={(e) => handleCustomChange('textColor', e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 px-3 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 rounded text-white text-sm"
              />
            </div>
          </div>

          {/* Configuración de Borde */}
          <div className="bg-gray-750 dark:bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h6 className="text-sm font-semibold text-gray-200 mb-3">🔲 Borde del Botón</h6>
            
            {/* Checkbox: Borde Transparente */}
            <label className="flex items-center space-x-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useTransparentBorder}
                onChange={(e) => handleTransparentBorderToggle(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">Borde Transparente</span>
            </label>

            {/* Checkbox: Usar Gradiente en Borde */}
            {!useTransparentBorder && (
              <label className="flex items-center space-x-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGradientBorder}
                  onChange={(e) => handleGradientBorderToggle(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Usar Gradiente</span>
              </label>
            )}

            {/* Selectores de Color de Borde */}
            {!useTransparentBorder && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {useGradientBorder ? 'Color Inicial' : 'Color de Borde'}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={borderGradientColor1}
                      onChange={(e) => handleBorderGradientColor1Change(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={borderGradientColor1}
                      onChange={(e) => handleBorderGradientColor1Change(e.target.value)}
                      placeholder="#8B5CF6"
                      className="flex-1 px-3 py-2 bg-gray-600 dark:bg-gray-700 border border-gray-500 rounded text-white text-xs"
                    />
                  </div>
                </div>

                {useGradientBorder && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Color Final</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={borderGradientColor2}
                        onChange={(e) => handleBorderGradientColor2Change(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={borderGradientColor2}
                        onChange={(e) => handleBorderGradientColor2Change(e.target.value)}
                        placeholder="#06B6D4"
                        className="flex-1 px-3 py-2 bg-gray-600 dark:bg-gray-700 border border-gray-500 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleButtonConfig;
