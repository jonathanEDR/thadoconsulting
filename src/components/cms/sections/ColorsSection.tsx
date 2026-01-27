import React, { useState } from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface ColorsSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración de colores por tema del formulario
 */
const ColorsSection: React.FC<ColorsSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  // Estado para el selector de tema para colores
  const [activeColorTheme, setActiveColorTheme] = useState<'light' | 'dark'>('light');

  return (
    <CollapsibleSection
      title="Colores por Tema"
      icon="🎨"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Estilo"
    >
      <div className="space-y-4">
        {/* Selector de Tema para Colores - más compacto */}
        <div className="flex items-center justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              onClick={() => setActiveColorTheme('light')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-sm ${
                activeColorTheme === 'light'
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              🌞 Claro
            </button>
            <button
              onClick={() => setActiveColorTheme('dark')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-sm ${
                activeColorTheme === 'dark'
                  ? 'bg-gray-800 text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              🌙 Oscuro
            </button>
          </div>
        </div>
        
        {/* Configuración de Colores según el tema activo */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3 text-sm">
            {activeColorTheme === 'light' ? '🌞 Colores para Tema Claro' : '🌙 Colores para Tema Oscuro'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Color del Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del Título
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.titleColor || (activeColorTheme === 'light' ? '#1f2937' : '#ffffff')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.titleColor`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.titleColor || (activeColorTheme === 'light' ? '#1f2937' : '#ffffff')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.titleColor`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={activeColorTheme === 'light' ? '#1f2937' : '#ffffff'}
                />
              </div>
            </div>

            {/* Color del Subtítulo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del Subtítulo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.subtitleColor || (activeColorTheme === 'light' ? '#6b7280' : '#d1d5db')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.subtitleColor`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.subtitleColor || (activeColorTheme === 'light' ? '#6b7280' : '#d1d5db')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.subtitleColor`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={activeColorTheme === 'light' ? '#6b7280' : '#d1d5db'}
                />
              </div>
            </div>

            {/* Color de la Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color de la Descripción
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.descriptionColor || (activeColorTheme === 'light' ? '#4b5563' : '#9ca3af')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.descriptionColor`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.descriptionColor || (activeColorTheme === 'light' ? '#4b5563' : '#9ca3af')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.descriptionColor`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={activeColorTheme === 'light' ? '#4b5563' : '#9ca3af'}
                />
              </div>
            </div>

            {/* Color de Fondo del Botón */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fondo del Botón
              </label>
              
              {/* Selector de tipo: Color sólido o Gradiente */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, '#8B5CF6')}
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🎨 Color Sólido
                </button>
                <button
                  type="button"
                  onClick={() => updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, 'linear-gradient(90deg, #8B5CF6, #06B6D4)')}
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🌈 Gradiente
                </button>
              </div>

              {/* Gradientes Predefinidos */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">✨ Gradientes Predefinidos:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {[
                    { name: 'Scuti Original', gradient: 'linear-gradient(90deg, #8B5CF6, #06B6D4)', category: 'brand' },
                    { name: 'Scuti Diagonal', gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', category: 'brand' },
                    { name: 'Scuti Reverse', gradient: 'linear-gradient(90deg, #06B6D4, #8B5CF6)', category: 'brand' },
                    { name: 'Rosa-Naranja', gradient: 'linear-gradient(90deg, #F472B6, #FB923C)', category: 'warm' },
                    { name: 'Azul-Verde', gradient: 'linear-gradient(90deg, #3B82F6, #10B981)', category: 'cool' },
                    { name: 'Rojo-Rosa', gradient: 'linear-gradient(90deg, #EF4444, #EC4899)', category: 'warm' },
                    { name: 'Verde-Cyan', gradient: 'linear-gradient(90deg, #22C55E, #06B6D4)', category: 'cool' },
                    { name: 'Oro-Naranja', gradient: 'linear-gradient(90deg, #F59E0B, #EA580C)', category: 'warm' },
                    { name: 'Violeta-Rosa', gradient: 'linear-gradient(135deg, #A855F7, #EC4899)', category: 'brand' },
                    { name: 'Ocean Deep', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', category: 'cool' },
                    { name: 'Sunset Glow', gradient: 'linear-gradient(135deg, #FF6B6B, #FFE66D)', category: 'warm' },
                    { name: 'Aurora', gradient: 'linear-gradient(90deg, #F472B6, #A855F7, #3B82F6)', category: 'cool' },
                  ].map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, preset.gradient)}
                      className={`
                        h-8 rounded border-2 transition-all duration-200 relative group overflow-hidden
                        ${contactForm.styles?.[activeColorTheme]?.buttonBackground === preset.gradient 
                          ? 'border-white dark:border-gray-300 scale-105 shadow-lg' 
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105 hover:shadow-md'
                        }
                      `}
                      style={{ background: preset.gradient }}
                      title={preset.name}
                    >
                      {/* Indicador de selección */}
                      {contactForm.styles?.[activeColorTheme]?.buttonBackground === preset.gradient && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full shadow-md flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Tooltip en hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generador de Gradientes Personalizados */}
              <div className="mb-3">
                <details className="group">
                  <summary className="text-xs text-gray-600 dark:text-gray-400 mb-2 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                    🎨 Crear Gradiente Personalizado <span className="group-open:rotate-90 inline-block transition-transform">▶</span>
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color 1:</label>
                        <input
                          type="color"
                          defaultValue="#8B5CF6"
                          onChange={(e) => {
                            const color2 = (e.target.parentElement?.parentElement?.querySelector('input[type="color"]:last-of-type') as HTMLInputElement)?.value || '#06B6D4';
                            const direction = (e.target.parentElement?.parentElement?.parentElement?.querySelector('select') as HTMLSelectElement)?.value || '90deg';
                            updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, `linear-gradient(${direction}, ${e.target.value}, ${color2})`);
                          }}
                          className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color 2:</label>
                        <input
                          type="color"
                          defaultValue="#06B6D4"
                          onChange={(e) => {
                            const color1 = (e.target.parentElement?.parentElement?.querySelector('input[type="color"]:first-of-type') as HTMLInputElement)?.value || '#8B5CF6';
                            const direction = (e.target.parentElement?.parentElement?.parentElement?.querySelector('select') as HTMLSelectElement)?.value || '90deg';
                            updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, `linear-gradient(${direction}, ${color1}, ${e.target.value})`);
                          }}
                          className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Dirección:</label>
                      <select
                        defaultValue="90deg"
                        onChange={(e) => {
                          const color1 = (e.target.parentElement?.parentElement?.querySelector('input[type="color"]:first-of-type') as HTMLInputElement)?.value || '#8B5CF6';
                          const color2 = (e.target.parentElement?.parentElement?.querySelector('input[type="color"]:last-of-type') as HTMLInputElement)?.value || '#06B6D4';
                          updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, `linear-gradient(${e.target.value}, ${color1}, ${color2})`);
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="90deg">➡️ Horizontal (izq. a der.)</option>
                        <option value="270deg">⬅️ Horizontal (der. a izq.)</option>
                        <option value="0deg">⬆️ Vertical (abajo a arriba)</option>
                        <option value="180deg">⬇️ Vertical (arriba a abajo)</option>
                        <option value="45deg">↗️ Diagonal (izq. inf. a der. sup.)</option>
                        <option value="135deg">↘️ Diagonal (izq. sup. a der. inf.)</option>
                        <option value="225deg">↙️ Diagonal (der. sup. a izq. inf.)</option>
                        <option value="315deg">↖️ Diagonal (der. inf. a izq. sup.)</option>
                      </select>
                    </div>
                  </div>
                </details>
              </div>

              {/* Input personalizado manual */}
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.buttonBackground?.startsWith('#') ? contactForm.styles[activeColorTheme].buttonBackground : '#8B5CF6'}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  title="Color sólido"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.buttonBackground || 'linear-gradient(90deg, #8B5CF6, #06B6D4)'}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="linear-gradient(90deg, #8B5CF6, #06B6D4)"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                🎨 Usa colores sólidos (#8B5CF6) o 🌈 gradientes CSS (linear-gradient()). Puedes editarlo manualmente o usar los generadores de arriba.
              </p>
            </div>

            {/* Color del Texto del Botón */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Texto del Botón
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.buttonText || '#ffffff'}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.buttonText`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.buttonText || '#ffffff'}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.buttonText`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Aplicar gradiente temático basado en el tema
                  const themeGradient = activeColorTheme === 'light' 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' // Ocean para tema claro
                    : 'linear-gradient(135deg, #FF6B6B, #FFE66D, #FF6B35)'; // Sunset para tema oscuro
                  
                  updateContent(`contactForm.styles.${activeColorTheme}.buttonBackground`, themeGradient);
                }}
                className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                ✨ Gradiente Temático
              </button>
            </div>
            
            <button
              onClick={() => {
                // Restablecer colores por defecto para el tema activo
                const defaultColors = activeColorTheme === 'light' 
                  ? { 
                      titleColor: '#1f2937', 
                      subtitleColor: '#6b7280', 
                      descriptionColor: '#4b5563',
                      buttonBackground: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                      buttonText: '#ffffff'
                    }
                  : { 
                      titleColor: '#ffffff', 
                      subtitleColor: '#d1d5db', 
                      descriptionColor: '#9ca3af',
                      buttonBackground: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                      buttonText: '#ffffff'
                    };
                
                Object.entries(defaultColors).forEach(([key, value]) => {
                  updateContent(`contactForm.styles.${activeColorTheme}.${key}`, value);
                });
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              🔄 Restablecer por Defecto
            </button>
          </div>

          {/* Vista previa de colores */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              👁️ Vista Previa - {activeColorTheme === 'light' ? 'Tema Claro' : 'Tema Oscuro'}
            </h5>
            <div className="space-y-3">
              <div 
                className="text-sm font-medium"
                style={{ 
                  color: contactForm.styles?.[activeColorTheme]?.subtitleColor || (activeColorTheme === 'light' ? '#6b7280' : '#d1d5db')
                }}
              >
                Subtítulo de ejemplo
              </div>
              <div 
                className="text-xl font-bold"
                style={{ 
                  color: contactForm.styles?.[activeColorTheme]?.titleColor || (activeColorTheme === 'light' ? '#1f2937' : '#ffffff')
                }}
              >
                Título Principal de Ejemplo
              </div>
              <div 
                className="text-base"
                style={{ 
                  color: contactForm.styles?.[activeColorTheme]?.descriptionColor || (activeColorTheme === 'light' ? '#4b5563' : '#9ca3af')
                }}
              >
                Esta es una descripción de ejemplo para mostrar cómo se verán los colores en la página pública.
              </div>
              
              {/* Vista previa del botón */}
              <div className="mt-4">
                <button
                  className="px-6 py-3 rounded-md font-semibold text-sm transition-all duration-300 cursor-default"
                  style={{
                    background: contactForm.styles?.[activeColorTheme]?.buttonBackground || 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                    color: contactForm.styles?.[activeColorTheme]?.buttonText || '#ffffff',
                  }}
                >
                  {contactForm.button?.text || 'Enviar mensaje'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default ColorsSection;