/**
 * 🔲✨ PESTAÑAS DE CONFIGURACIÓN DE BORDE Y HOVER
 * Componentes para configurar el borde y efectos hover de las tarjetas de servicios
 */

import React from 'react';
import { CompactColorPicker, CompactSection } from './shared/CompactStyleEditors';

interface BorderHoverTabsProps {
  activeTab: string;
  gridConfig: any;
  handleUpdate: (field: string, value: any) => void;
}

export const BorderHoverTabs: React.FC<BorderHoverTabsProps> = ({
  activeTab,
  gridConfig,
  handleUpdate
}) => {
  return (
    <>
      {/* ===== TAB: BORDE ===== */}
      {activeTab === 'borde' && (
        <div className="space-y-4">
          <CompactSection title="Configuración del Borde" icon="🔲" defaultOpen={true}>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ancho</label>
                  <select
                    value={gridConfig.cardDesign?.borderWidth || '1px'}
                    onChange={(e) => handleUpdate('cardDesign.borderWidth', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="0">Sin borde</option>
                    <option value="1px">1px</option>
                    <option value="2px">2px</option>
                    <option value="3px">3px</option>
                    <option value="4px">4px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Estilo</label>
                  <select
                    value={gridConfig.cardDesign?.borderStyle || 'solid'}
                    onChange={(e) => handleUpdate('cardDesign.borderStyle', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="solid">Sólido</option>
                    <option value="dashed">Punteado</option>
                    <option value="dotted">Puntos</option>
                    <option value="double">Doble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Radio</label>
                  <select
                    value={gridConfig.cardDesign?.borderRadius || '1rem'}
                    onChange={(e) => handleUpdate('cardDesign.borderRadius', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="0">Sin redondeo</option>
                    <option value="0.25rem">Pequeño</option>
                    <option value="0.5rem">Mediano</option>
                    <option value="0.75rem">Normal</option>
                    <option value="1rem">Grande</option>
                    <option value="1.5rem">Muy grande</option>
                    <option value="9999px">Completo</option>
                  </select>
                </div>
              </div>

              {/* Colores del borde */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Color del Borde</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Claro</label>
                    <CompactColorPicker
                      value={gridConfig.cardDesign?.borderColor || '#e5e7eb'}
                      onChange={(v) => handleUpdate('cardDesign.borderColor', v)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Oscuro</label>
                    <CompactColorPicker
                      value={gridConfig.cardDesign?.borderColorDark || '#374151'}
                      onChange={(v) => handleUpdate('cardDesign.borderColorDark', v)}
                    />
                  </div>
                </div>
              </div>

              {/* Vista previa del borde */}
              <div className="mt-3 p-4 rounded-lg" style={{
                borderWidth: gridConfig.cardDesign?.borderWidth || '1px',
                borderStyle: gridConfig.cardDesign?.borderStyle || 'solid',
                borderColor: gridConfig.cardDesign?.borderColor || '#e5e7eb',
                borderRadius: gridConfig.cardDesign?.borderRadius || '1rem'
              }}>
                <p className="text-xs text-gray-500 text-center">Vista previa del borde</p>
              </div>
            </div>
          </CompactSection>

          <CompactSection title="Sombra Normal" icon="💫">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Sombra Modo Claro</label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
                  onChange={(e) => handleUpdate('cardDesign.shadow', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="box-shadow CSS"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Sombra Modo Oscuro</label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.shadowDark || '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'}
                  onChange={(e) => handleUpdate('cardDesign.shadowDark', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="box-shadow CSS"
                />
              </div>

              {/* Presets de sombra */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Ninguna', value: 'none' },
                    { name: 'Pequeña', value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
                    { name: 'Mediana', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
                    { name: 'Grande', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleUpdate('cardDesign.shadow', preset.value)}
                      className="px-2 py-1.5 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CompactSection>
        </div>
      )}

      {/* ===== TAB: HOVER ===== */}
      {activeTab === 'hover' && (
        <div className="space-y-4">
          <CompactSection title="Efectos al Pasar el Mouse" icon="✨" defaultOpen={true}>
            <div className="space-y-3">
              {/* Escala en hover */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Escala (zoom)</label>
                <select
                  value={gridConfig.cardDesign?.hoverScale || '1.02'}
                  onChange={(e) => handleUpdate('cardDesign.hoverScale', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="1">Sin zoom (1)</option>
                  <option value="1.01">Muy pequeño (1.01)</option>
                  <option value="1.02">Pequeño (1.02)</option>
                  <option value="1.03">Mediano (1.03)</option>
                  <option value="1.05">Grande (1.05)</option>
                  <option value="1.07">Muy grande (1.07)</option>
                </select>
              </div>

              {/* Color del borde en hover */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Color del Borde (hover)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Claro</label>
                    <CompactColorPicker
                      value={gridConfig.cardDesign?.hoverBorderColor || '#8B5CF6'}
                      onChange={(v) => handleUpdate('cardDesign.hoverBorderColor', v)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Oscuro</label>
                    <CompactColorPicker
                      value={gridConfig.cardDesign?.hoverBorderColorDark || '#A78BFA'}
                      onChange={(v) => handleUpdate('cardDesign.hoverBorderColorDark', v)}
                    />
                  </div>
                </div>
              </div>

              {/* Sombra en hover */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Sombra Hover (Claro)</label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.hoverShadow || '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)'}
                  onChange={(e) => handleUpdate('cardDesign.hoverShadow', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="box-shadow CSS"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Sombra Hover (Oscuro)</label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.hoverShadowDark || '0 20px 25px -5px rgba(167, 139, 250, 0.2), 0 10px 10px -5px rgba(167, 139, 250, 0.08)'}
                  onChange={(e) => handleUpdate('cardDesign.hoverShadowDark', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="box-shadow CSS"
                />
              </div>

              {/* Presets de sombra hover */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Presets de Sombra Hover</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Sutil', value: '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)' },
                    { name: 'Normal', value: '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)' },
                    { name: 'Fuerte', value: '0 25px 50px -12px rgba(139, 92, 246, 0.25)' },
                    { name: 'Glow', value: '0 0 30px rgba(139, 92, 246, 0.3), 0 20px 40px rgba(139, 92, 246, 0.1)' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleUpdate('cardDesign.hoverShadow', preset.value)}
                      className="px-2 py-1.5 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista previa del efecto hover */}
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-2">Vista Previa (pasa el mouse)</label>
                <div 
                  className="p-4 rounded-lg transition-all duration-300 cursor-pointer"
                  style={{
                    borderWidth: gridConfig.cardDesign?.borderWidth || '1px',
                    borderStyle: gridConfig.cardDesign?.borderStyle || 'solid',
                    borderColor: gridConfig.cardDesign?.borderColor || '#e5e7eb',
                    borderRadius: gridConfig.cardDesign?.borderRadius || '1rem',
                    boxShadow: gridConfig.cardDesign?.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `scale(${gridConfig.cardDesign?.hoverScale || '1.02'})`;
                    e.currentTarget.style.borderColor = gridConfig.cardDesign?.hoverBorderColor || '#8B5CF6';
                    e.currentTarget.style.boxShadow = gridConfig.cardDesign?.hoverShadow || '0 20px 25px -5px rgba(139, 92, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = gridConfig.cardDesign?.borderColor || '#e5e7eb';
                    e.currentTarget.style.boxShadow = gridConfig.cardDesign?.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <p className="text-xs text-gray-500 text-center">Pasa el mouse aquí para ver el efecto</p>
                </div>
              </div>
            </div>
          </CompactSection>
        </div>
      )}
    </>
  );
};
