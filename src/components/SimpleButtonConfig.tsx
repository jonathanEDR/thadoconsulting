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

  const PRESET_STYLES_UPDATED = [
    {
      name: '🟣 Morado Sólido',
      style: {
        text: value.text || 'Botón',
        background: '#8B5CF6',
        textColor: '#FFFFFF',
        borderColor: 'transparent'
      }
    },
    {
      name: '🌊 Gradiente Morado-Cyan',
      style: {
        text: value.text || 'Botón',
        background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
        textColor: '#FFFFFF',
        borderColor: 'transparent'
      }
    },
    {
      name: '🔲 Solo Borde',
      style: {
        text: value.text || 'Botón',
        background: 'transparent',
        textColor: '#8B5CF6',
        borderColor: '#8B5CF6'
      }
    },
    {
      name: '🌈 Borde Gradiente',
      style: {
        text: value.text || 'Botón',
        background: 'transparent',
        textColor: '#8B5CF6',
        borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
      }
    }
  ];

  const applyPreset = (preset: typeof PRESET_STYLES_UPDATED[0]) => {
    onChange(preset.style);
  };

  const handleCustomChange = (property: keyof ButtonStyle, newValue: string) => {
    onChange({
      ...value,
      [property]: newValue
    });
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
        <div className="p-4 border-t border-gray-700 dark:border-gray-600">
          {/* Estilos Predefinidos */}
          <div className="mb-6">
            <h6 className="text-sm font-medium text-gray-300 dark:text-gray-200 mb-3">🎨 Estilos Rápidos</h6>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_STYLES_UPDATED.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-3 rounded-lg border border-gray-600 dark:border-gray-500 hover:border-purple-500 dark:hover:border-purple-400 transition-all text-left bg-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{
                        background: preset.style.background,
                        borderColor: preset.style.borderColor
                      }}
                    />
                    <span className="text-xs text-gray-300 dark:text-gray-200">{preset.name}</span>
                  </div>
                  {preset.style.borderColor?.includes('gradient') ? (
                    // Preview con borde gradiente
                    <div
                      className="w-full px-2 py-1 rounded text-xs text-center"
                      style={{
                        background: preset.style.background === 'transparent'
                          ? `linear-gradient(#374151, #374151) padding-box, ${preset.style.borderColor} border-box`
                          : preset.style.background,
                        color: preset.style.textColor,
                        border: '2px solid transparent'
                      }}
                    >
                      Preview
                    </div>
                  ) : (
                    // Preview normal
                    <div
                      className="w-full px-2 py-1 rounded text-xs text-center border-2"
                      style={{
                        background: preset.style.background,
                        color: preset.style.textColor,
                        borderColor: preset.style.borderColor
                      }}
                    >
                      Preview
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Personalización Simple */}
          <div className="space-y-4">
            <h6 className="text-sm font-medium text-gray-300 dark:text-gray-200">⚙️ Personalización</h6>
            
            {/* Texto del Botón */}
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-300 mb-2">📝 Texto del Botón</label>
              <input
                type="text"
                value={value.text || ''}
                onChange={(e) => handleCustomChange('text', e.target.value)}
                placeholder="Ingresa el texto del botón"
                className="w-full px-3 py-2 bg-gray-600 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Color de Fondo */}
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-300 mb-2">Fondo</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={value.background?.includes('gradient') ? '#8B5CF6' : value.background || '#8B5CF6'}
                  onChange={(e) => handleCustomChange('background', e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={value.background || ''}
                  onChange={(e) => handleCustomChange('background', e.target.value)}
                  placeholder="transparent, #8B5CF6, linear-gradient(...)"
                  className="flex-1 px-3 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 rounded text-white dark:text-gray-100 text-xs"
                />
              </div>
            </div>

            {/* Color de Texto */}
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-300 mb-2">Texto</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={value.textColor || '#FFFFFF'}
                  onChange={(e) => handleCustomChange('textColor', e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={value.textColor || ''}
                  onChange={(e) => handleCustomChange('textColor', e.target.value)}
                  placeholder="#FFFFFF"
                  className="flex-1 px-3 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 rounded text-white dark:text-gray-100 text-xs"
                />
              </div>
            </div>

            {/* Color de Borde */}
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-300 mb-2">Borde</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={value.borderColor?.includes('gradient') ? '#8B5CF6' : value.borderColor === 'transparent' ? '#8B5CF6' : value.borderColor || '#8B5CF6'}
                  onChange={(e) => handleCustomChange('borderColor', e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={value.borderColor || ''}
                  onChange={(e) => handleCustomChange('borderColor', e.target.value)}
                  placeholder="transparent, #8B5CF6, linear-gradient(...)"
                  className="flex-1 px-3 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 rounded text-white dark:text-gray-100 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Vista Previa Interactiva */}
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <label className="block text-xs text-gray-400 mb-3">Vista Previa</label>
            <div className="flex justify-center">
              {value.borderColor?.includes('gradient') ? (
                // Botón con borde gradiente
                <button
                  className="px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: value.background === 'transparent'
                      ? `linear-gradient(#111827, #111827) padding-box, ${value.borderColor} border-box`
                      : value.background,
                    color: value.textColor || '#8B5CF6',
                    border: '2px solid transparent'
                  }}
                >
                  {value.text || (title.includes('Contacto') ? 'CONTÁCTENOS' : 
                   title.includes('Principal') ? 'Ver Servicios' : 
                   'Ir al Dashboard')}
                </button>
              ) : (
                // Botón normal
                <button
                  className="px-6 py-3 rounded-full font-medium border-2 transition-all duration-200 hover:scale-105"
                  style={{
                    background: value.background || 'transparent',
                    color: value.textColor || '#8B5CF6',
                    borderColor: value.borderColor || 'transparent'
                  }}
                >
                  {value.text || (title.includes('Contacto') ? 'CONTÁCTENOS' : 
                   title.includes('Principal') ? 'Ver Servicios' : 
                   'Ir al Dashboard')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleButtonConfig;