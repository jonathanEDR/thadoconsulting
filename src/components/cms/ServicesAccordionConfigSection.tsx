/**
 * 🎯 CONFIGURACIÓN DE ACORDEÓN DE SERVICIOS
 * Panel de configuración para la sección de lista de servicios en acordeón
 */

import React from 'react';
import ManagedImageSelector from '../ManagedImageSelector';

interface AccordionConfig {
  sectionTitle?: string;
  sectionSubtitle?: string;
  titleColor?: string;
  titleColorDark?: string;
  // Gradiente para título de sección
  titleUseGradient?: boolean;
  titleGradientFrom?: string;
  titleGradientTo?: string;
  titleGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  titleUseGradientDark?: boolean;
  titleGradientFromDark?: string;
  titleGradientToDark?: string;
  titleGradientDirectionDark?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  subtitleColor?: string;
  subtitleColorDark?: string;
  numberColor?: string;
  numberColorDark?: string;
  serviceTitleColor?: string;
  serviceTitleColorDark?: string;
  descriptionColor?: string;
  descriptionColorDark?: string;
  titleFontFamily?: string;
  contentFontFamily?: string;
  titleFontWeight?: string;
  borderColor?: string;
  borderColorDark?: string;
  iconColor?: string;
  iconColorDark?: string;
  buttonText?: string;
  buttonGradient?: string; // Mantener para compatibilidad
  buttonTextColor?: string;
  buttonBorderRadius?: string;
  // 🆕 Configuración mejorada del gradiente del botón
  buttonUseGradient?: boolean;
  buttonGradientFrom?: string;
  buttonGradientTo?: string;
  buttonGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  buttonBgColor?: string; // Color sólido alternativo
  featureIconColor?: string;
  featureIconColorDark?: string;
  maxFeatures?: number;
  // Colores de resaltado de características
  featureHighlightStyle?: 'highlight' | 'box';
  featureHighlightBgColor?: string;
  featureHighlightBgColorDark?: string;
  featureHighlightTextColor?: string;
  featureHighlightTextColorDark?: string;
  featureHighlightBorderColor?: string;
  featureHighlightBorderColorDark?: string;
  featureHighlightShowBorder?: boolean;
  featureHighlightShowBorderDark?: boolean;
  // Gradientes para características
  featureHighlightBgGradient?: boolean;
  featureHighlightBgGradientFrom?: string;
  featureHighlightBgGradientTo?: string;
  featureHighlightBgGradientDir?: string;
  featureHighlightBgGradientDark?: boolean;
  featureHighlightBgGradientFromDark?: string;
  featureHighlightBgGradientToDark?: string;
  featureHighlightBgGradientDirDark?: string;
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundOpacity?: number;
  enabled?: boolean;
  // 🆕 Configuración de líneas de separación
  separatorLineColor?: string;
  separatorLineColorDark?: string;
  separatorLineWidth?: number;
  expandedSeparatorColor?: string;
  expandedSeparatorColorDark?: string;
  // 🆕 Configuración de fondo expandido
  expandedBg?: string;
  expandedBgDark?: string;
  expandedBgOpacity?: number;
  expandedBgBlur?: number;
  // 🆕 Configuración de fondo del header (botón)
  headerBg?: string;
  headerBgDark?: string;
  headerBgOpacity?: number;
  headerBgHover?: string;
  headerBgHoverDark?: string;
  headerBgHoverOpacity?: number;
  // 🆕 Paginación
  itemsPerPage?: number;
  paginationBgColor?: string;
  paginationBgColorDark?: string;
  paginationActiveColor?: string;
  paginationActiveColorDark?: string;
  paginationTextColor?: string;
  paginationTextColorDark?: string;
  // 🆕 Gradientes para paginación - Modo Claro
  paginationActiveUseGradient?: boolean;
  paginationActiveGradientFrom?: string;
  paginationActiveGradientTo?: string;
  paginationActiveGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  // 🆕 Gradientes para paginación - Modo Oscuro
  paginationActiveUseGradientDark?: boolean;
  paginationActiveGradientFromDark?: string;
  paginationActiveGradientToDark?: string;
  paginationActiveGradientDirectionDark?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
}

interface ServicesAccordionConfigSectionProps {
  config: AccordionConfig;
  onChange: (config: AccordionConfig) => void;
}

// Opciones de fuentes disponibles
const FONT_OPTIONS = [
  { value: 'inherit', label: 'Por defecto (Sistema)' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  { value: "'Poppins', sans-serif", label: 'Poppins' },
  { value: "'Inter', sans-serif", label: 'Inter' },
  { value: "'Roboto', sans-serif", label: 'Roboto' },
  { value: "'Open Sans', sans-serif", label: 'Open Sans' },
  { value: "'Lato', sans-serif", label: 'Lato' },
  { value: "'Raleway', sans-serif", label: 'Raleway' },
  { value: "'Nunito', sans-serif", label: 'Nunito' },
  { value: "'Playfair Display', serif", label: 'Playfair Display' },
];

export const ServicesAccordionConfigSection: React.FC<ServicesAccordionConfigSectionProps> = ({
  config,
  onChange
}) => {
  // Estado para controlar qué secciones están abiertas (todas cerradas por defecto)
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  const handleUpdate = (field: string, value: any) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      onChange({ ...config, [field]: value });
    } else {
      const newConfig = { ...config };
      let current: any = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      onChange(newConfig);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            📋 Sección Acordeón de Servicios
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Lista expandible con todos los servicios (diseño tipo acordeón)
          </p>
        </div>
        
        {/* Toggle habilitar/deshabilitar */}
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {config.enabled !== false ? 'Habilitado' : 'Deshabilitado'}
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={config.enabled !== false}
              onChange={(e) => handleUpdate('enabled', e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              config.enabled !== false ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                config.enabled !== false ? 'translate-x-5' : ''
              }`} />
            </div>
          </div>
        </label>
      </div>

      {/* Contenido configurable */}
      {config.enabled !== false && (
        <div className="space-y-6">
          
          {/* ===== TEXTOS DE LA SECCIÓN ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('textos')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ✏️ Textos de la Sección
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['textos'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['textos'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={config.sectionTitle || ''}
                  onChange={(e) => handleUpdate('sectionTitle', e.target.value)}
                  placeholder="Todos los servicios"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={config.sectionSubtitle || ''}
                  onChange={(e) => handleUpdate('sectionSubtitle', e.target.value)}
                  placeholder="Trabajamos para llevar tus operaciones al siguiente nivel."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              </div>
              </div>
            )}
          </div>

          {/* ===== TIPOGRAFÍA ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('tipografia')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🔤 Tipografía
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['tipografia'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['tipografia'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fuente de títulos
                </label>
                <select
                  value={config.titleFontFamily || 'inherit'}
                  onChange={(e) => handleUpdate('titleFontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  style={{ fontFamily: config.titleFontFamily || 'inherit' }}
                >
                  {FONT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fuente de contenido
                </label>
                <select
                  value={config.contentFontFamily || 'inherit'}
                  onChange={(e) => handleUpdate('contentFontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  style={{ fontFamily: config.contentFontFamily || 'inherit' }}
                >
                  {FONT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Peso de títulos
                </label>
                <select
                  value={config.titleFontWeight || '700'}
                  onChange={(e) => handleUpdate('titleFontWeight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="400">Normal (400)</option>
                  <option value="500">Medio (500)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== COLORES MODO CLARO ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('coloresClaro')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ☀️ Colores Modo Claro
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['coloresClaro'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['coloresClaro'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Título sección con opción de gradiente */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Título sección
                    </label>
                    
                    {/* Toggle Gradiente */}
                    <div className="flex items-center gap-3 mb-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.titleUseGradient || false}
                      onChange={(e) => handleUpdate('titleUseGradient', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Usar Gradiente</span>
                </div>
                
                {config.titleUseGradient ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Inicio</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.titleGradientFrom || '#8B5CF6'} onChange={(e) => handleUpdate('titleGradientFrom', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.titleGradientFrom || '#8B5CF6'} onChange={(e) => handleUpdate('titleGradientFrom', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fin</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.titleGradientTo || '#EC4899'} onChange={(e) => handleUpdate('titleGradientTo', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.titleGradientTo || '#EC4899'} onChange={(e) => handleUpdate('titleGradientTo', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                      <select value={config.titleGradientDirection || 'to-r'} onChange={(e) => handleUpdate('titleGradientDirection', e.target.value)} className="w-full px-1 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="to-r">→ Derecha</option>
                        <option value="to-l">← Izquierda</option>
                        <option value="to-t">↑ Arriba</option>
                        <option value="to-b">↓ Abajo</option>
                        <option value="to-tr">↗ Diagonal</option>
                        <option value="to-br">↘ Diagonal</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.titleColor || '#8B5CF6'}
                      onChange={(e) => handleUpdate('titleColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.titleColor || '#8B5CF6'}
                      onChange={(e) => handleUpdate('titleColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Números
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.numberColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate('numberColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.numberColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate('numberColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título servicio
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.serviceTitleColor || '#1F2937'}
                    onChange={(e) => handleUpdate('serviceTitleColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.serviceTitleColor || '#1F2937'}
                    onChange={(e) => handleUpdate('serviceTitleColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  💡 Si usas fondo claro/transparente, usa texto oscuro (#1F2937 o similar)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Features ✓
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.featureIconColor || '#06B6D4'}
                    onChange={(e) => handleUpdate('featureIconColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.featureIconColor || '#06B6D4'}
                    onChange={(e) => handleUpdate('featureIconColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== COLORES MODO OSCURO ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('coloresOscuro')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🌙 Colores Modo Oscuro
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['coloresOscuro'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['coloresOscuro'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Título sección con opción de gradiente - Modo Oscuro */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Título sección
                    </label>
                    
                    {/* Toggle Gradiente */}
                    <div className="flex items-center gap-3 mb-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.titleUseGradientDark || false}
                      onChange={(e) => handleUpdate('titleUseGradientDark', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Usar Gradiente</span>
                </div>
                
                {config.titleUseGradientDark ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Inicio</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.titleGradientFromDark || '#A78BFA'} onChange={(e) => handleUpdate('titleGradientFromDark', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.titleGradientFromDark || '#A78BFA'} onChange={(e) => handleUpdate('titleGradientFromDark', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fin</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.titleGradientToDark || '#EC4899'} onChange={(e) => handleUpdate('titleGradientToDark', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.titleGradientToDark || '#EC4899'} onChange={(e) => handleUpdate('titleGradientToDark', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                      <select value={config.titleGradientDirectionDark || 'to-r'} onChange={(e) => handleUpdate('titleGradientDirectionDark', e.target.value)} className="w-full px-1 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="to-r">→ Derecha</option>
                        <option value="to-l">← Izquierda</option>
                        <option value="to-t">↑ Arriba</option>
                        <option value="to-b">↓ Abajo</option>
                        <option value="to-tr">↗ Diagonal</option>
                        <option value="to-br">↘ Diagonal</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.titleColorDark || '#A78BFA'}
                      onChange={(e) => handleUpdate('titleColorDark', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.titleColorDark || '#A78BFA'}
                      onChange={(e) => handleUpdate('titleColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Números
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.numberColorDark || '#A78BFA'}
                    onChange={(e) => handleUpdate('numberColorDark', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.numberColorDark || '#A78BFA'}
                    onChange={(e) => handleUpdate('numberColorDark', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título servicio
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.serviceTitleColorDark || '#FFFFFF'}
                    onChange={(e) => handleUpdate('serviceTitleColorDark', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.serviceTitleColorDark || '#FFFFFF'}
                    onChange={(e) => handleUpdate('serviceTitleColorDark', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  💡 Si usas fondo oscuro, usa texto claro (#FFFFFF o similar)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Features ✓
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.featureIconColorDark || '#22D3EE'}
                    onChange={(e) => handleUpdate('featureIconColorDark', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.featureIconColorDark || '#22D3EE'}
                    onChange={(e) => handleUpdate('featureIconColorDark', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== LÍNEAS DE SEPARACIÓN ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('lineas')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ➖ Líneas de Separación
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['lineas'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['lineas'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  {/* Grosor de línea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Grosor de línea: {config.separatorLineWidth || 2}px
                    </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={config.separatorLineWidth || 2}
                  onChange={(e) => handleUpdate('separatorLineWidth', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Delgada (1px)</span>
                  <span>Media (3px)</span>
                  <span>Gruesa (5px)</span>
                </div>
              </div>

              {/* Colores de líneas - Modo Claro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    ☀️ Modo Claro
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Línea normal (cerrado)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.separatorLineColor || '#ffffff'}
                          onChange={(e) => handleUpdate('separatorLineColor', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.separatorLineColor || '#ffffff'}
                          onChange={(e) => handleUpdate('separatorLineColor', e.target.value)}
                          placeholder="rgba(255, 255, 255, 0.2)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Línea expandida (abierto)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.expandedSeparatorColor || '#a78bfa'}
                          onChange={(e) => handleUpdate('expandedSeparatorColor', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.expandedSeparatorColor || '#a78bfa'}
                          onChange={(e) => handleUpdate('expandedSeparatorColor', e.target.value)}
                          placeholder="rgba(167, 139, 250, 0.3)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colores de líneas - Modo Oscuro */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    🌙 Modo Oscuro
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Línea normal (cerrado)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.separatorLineColorDark || '#ffffff'}
                          onChange={(e) => handleUpdate('separatorLineColorDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.separatorLineColorDark || '#ffffff'}
                          onChange={(e) => handleUpdate('separatorLineColorDark', e.target.value)}
                          placeholder="rgba(255, 255, 255, 0.1)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Línea expandida (abierto)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.expandedSeparatorColorDark || '#a78bfa'}
                          onChange={(e) => handleUpdate('expandedSeparatorColorDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.expandedSeparatorColorDark || '#a78bfa'}
                          onChange={(e) => handleUpdate('expandedSeparatorColorDark', e.target.value)}
                          placeholder="rgba(167, 139, 250, 0.3)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista previa de líneas */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <p className="text-xs text-white mb-2">Vista previa de líneas:</p>
                <div className="space-y-2">
                  <div 
                    className="bg-white/20 backdrop-blur-sm rounded p-2 border-b-2"
                    style={{
                      borderBottomColor: config.separatorLineColor || 'rgba(255, 255, 255, 0.2)',
                      borderBottomWidth: `${config.separatorLineWidth || 2}px`
                    }}
                  >
                    <span className="text-white text-sm">Línea normal (cerrado)</span>
                  </div>
                  <div 
                    className="bg-white/20 backdrop-blur-sm rounded p-2 border-b-2"
                    style={{
                      borderBottomColor: config.expandedSeparatorColor || 'rgba(167, 139, 250, 0.3)',
                      borderBottomWidth: `${config.separatorLineWidth || 2}px`
                    }}
                  >
                    <span className="text-white text-sm">Línea expandida (abierto)</span>
                  </div>
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== FONDO DEL CONTENIDO EXPANDIDO ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('fondoExpandido')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🎨 Fondo del Contenido Expandido
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['fondoExpandido'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['fondoExpandido'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  {/* Opacidad del fondo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Opacidad: {((config.expandedBgOpacity ?? 0.8) * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.expandedBgOpacity ?? 0.8}
                      onChange={(e) => handleUpdate('expandedBgOpacity', parseFloat(e.target.value))}
                      className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Transparente (0%)</span>
                  <span>Semi (50%)</span>
                  <span>Opaco (100%)</span>
                </div>
              </div>

              {/* Desenfoque (Blur) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Desenfoque: {config.expandedBgBlur || 8}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="2"
                  value={config.expandedBgBlur || 8}
                  onChange={(e) => handleUpdate('expandedBgBlur', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Sin blur (0px)</span>
                  <span>Medio (10px)</span>
                  <span>Alto (20px)</span>
                </div>
              </div>

              {/* Colores de fondo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    ☀️ Modo Claro
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color de fondo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.expandedBg || '#f9fafb'}
                          onChange={(e) => handleUpdate('expandedBg', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.expandedBg || '#f9fafb'}
                          onChange={(e) => handleUpdate('expandedBg', e.target.value)}
                          placeholder="#f9fafb o rgba(249, 250, 251, 0.8)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tip: Usa rgba() para incluir transparencia en el color
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    🌙 Modo Oscuro
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color de fondo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.expandedBgDark || '#1f2937'}
                          onChange={(e) => handleUpdate('expandedBgDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.expandedBgDark || '#1f2937'}
                          onChange={(e) => handleUpdate('expandedBgDark', e.target.value)}
                          placeholder="#1f2937 o rgba(31, 41, 55, 0.8)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tip: Usa rgba() para incluir transparencia en el color
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista previa del fondo */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <p className="text-xs text-white mb-2">Vista previa del fondo expandido:</p>
                <div 
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: (() => {
                      const baseColor = config.expandedBg || '#f9fafb';
                      const opacity = config.expandedBgOpacity ?? 0.8;
                      
                      // Si es formato rgba, usarlo directamente
                      if (baseColor.startsWith('rgba')) return baseColor;
                      
                      // Si es hex, convertir a rgba con opacidad
                      if (baseColor.startsWith('#')) {
                        const hex = baseColor.replace('#', '');
                        const r = parseInt(hex.substring(0, 2), 16);
                        const g = parseInt(hex.substring(2, 4), 16);
                        const b = parseInt(hex.substring(4, 6), 16);
                        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                      }
                      
                      return baseColor;
                    })(),
                    backdropFilter: `blur(${config.expandedBgBlur || 8}px)`
                  }}
                >
                  <p className="text-gray-900 dark:text-white text-sm">
                    Este es el aspecto del fondo cuando el acordeón está expandido
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs mt-2">
                    Opacidad: {((config.expandedBgOpacity ?? 0.8) * 100).toFixed(0)}% | 
                    Blur: {config.expandedBgBlur || 8}px
                  </p>
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== FONDO DEL HEADER (BOTÓN ACORDEÓN) ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('fondoHeader')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🎨 Fondo del Header (Botón)
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['fondoHeader'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['fondoHeader'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  {/* Opacidad normal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Opacidad (estado normal): {((config.headerBgOpacity ?? 0.6) * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.headerBgOpacity ?? 0.6}
                      onChange={(e) => handleUpdate('headerBgOpacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Transparente (0%)</span>
                  <span>Semi (50%)</span>
                  <span>Opaco (100%)</span>
                </div>
              </div>

              {/* Opacidad hover */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Opacidad (hover/cerrado): {((config.headerBgHoverOpacity ?? 0.2) * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.headerBgHoverOpacity ?? 0.2}
                  onChange={(e) => handleUpdate('headerBgHoverOpacity', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Transparente (0%)</span>
                  <span>Semi (50%)</span>
                  <span>Opaco (100%)</span>
                </div>
              </div>

              {/* Colores de fondo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    ☀️ Modo Claro
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color de fondo (expandido)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.headerBg || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBg', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.headerBg || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBg', e.target.value)}
                          placeholder="#1f2937"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color de fondo (hover/cerrado)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.headerBgHover || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBgHover', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.headerBgHover || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBgHover', e.target.value)}
                          placeholder="#1f2937"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    🌙 Modo Oscuro
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color de fondo (expandido)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.headerBgDark || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBgDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.headerBgDark || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBgDark', e.target.value)}
                          placeholder="#1f2937"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color de fondo (hover/cerrado)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.headerBgHoverDark || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBgHoverDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.headerBgHoverDark || '#1f2937'}
                          onChange={(e) => handleUpdate('headerBgHoverDark', e.target.value)}
                          placeholder="#1f2937"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista previa */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg space-y-2">
                <p className="text-xs text-white mb-2">Vista previa del header:</p>
                <div 
                  className="rounded-lg p-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: (() => {
                      const baseColor = config.headerBg || '#1f2937';
                      const opacity = config.headerBgOpacity ?? 0.6;
                      
                      if (baseColor.startsWith('rgba')) return baseColor;
                      if (baseColor.startsWith('rgb(')) {
                        return baseColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
                      }
                      if (baseColor.startsWith('#')) {
                        const hex = baseColor.replace('#', '');
                        const r = parseInt(hex.substring(0, 2), 16);
                        const g = parseInt(hex.substring(2, 4), 16);
                        const b = parseInt(hex.substring(4, 6), 16);
                        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                      }
                      return baseColor;
                    })()
                  }}
                >
                  <p className="text-white text-sm">Header expandido - Opacidad: {((config.headerBgOpacity ?? 0.6) * 100).toFixed(0)}%</p>
                </div>
                <div 
                  className="rounded-lg p-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: (() => {
                      const baseColor = config.headerBgHover || '#1f2937';
                      const opacity = config.headerBgHoverOpacity ?? 0.2;
                      
                      if (baseColor.startsWith('rgba')) return baseColor;
                      if (baseColor.startsWith('rgb(')) {
                        return baseColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
                      }
                      if (baseColor.startsWith('#')) {
                        const hex = baseColor.replace('#', '');
                        const r = parseInt(hex.substring(0, 2), 16);
                        const g = parseInt(hex.substring(2, 4), 16);
                        const b = parseInt(hex.substring(4, 6), 16);
                        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                      }
                      return baseColor;
                    })()
                  }}
                >
                  <p className="text-white text-sm">Header cerrado/hover - Opacidad: {((config.headerBgHoverOpacity ?? 0.2) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== PAGINACIÓN ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('paginacion')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                📄 Colores de Paginación
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['paginacion'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['paginacion'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Modo Claro */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      ☀️ Modo Claro
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Fondo botones
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.paginationBgColor || '#ffffff'}
                        onChange={(e) => handleUpdate('paginationBgColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.paginationBgColor || 'rgba(255, 255, 255, 0.2)'}
                        onChange={(e) => handleUpdate('paginationBgColor', e.target.value)}
                        placeholder="rgba(255, 255, 255, 0.2)"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Fondo página activa
                    </label>
                    
                    {/* Toggle para usar gradiente */}
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="paginationActiveUseGradient"
                        checked={config.paginationActiveUseGradient || false}
                        onChange={(e) => handleUpdate('paginationActiveUseGradient', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="paginationActiveUseGradient" className="text-xs text-gray-600 dark:text-gray-400">
                        Usar gradiente
                      </label>
                    </div>
                    
                    {config.paginationActiveUseGradient ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs text-gray-500">Color Inicio</span>
                            <div className="flex gap-1">
                              <input
                                type="color"
                                value={config.paginationActiveGradientFrom || '#3B82F6'}
                                onChange={(e) => handleUpdate('paginationActiveGradientFrom', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={config.paginationActiveGradientFrom || '#3B82F6'}
                                onChange={(e) => handleUpdate('paginationActiveGradientFrom', e.target.value)}
                                placeholder="#3B82F6"
                                className="flex-1 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Color Fin</span>
                            <div className="flex gap-1">
                              <input
                                type="color"
                                value={config.paginationActiveGradientTo || '#06B6D4'}
                                onChange={(e) => handleUpdate('paginationActiveGradientTo', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={config.paginationActiveGradientTo || '#06B6D4'}
                                onChange={(e) => handleUpdate('paginationActiveGradientTo', e.target.value)}
                                placeholder="#06B6D4"
                                className="flex-1 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Dirección</span>
                          <select
                            value={config.paginationActiveGradientDirection || 'to-r'}
                            onChange={(e) => handleUpdate('paginationActiveGradientDirection', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="to-r">Derecha →</option>
                            <option value="to-l">Izquierda ←</option>
                            <option value="to-t">Arriba ↑</option>
                            <option value="to-b">Abajo ↓</option>
                            <option value="to-tr">Diagonal ↗</option>
                            <option value="to-tl">Diagonal ↖</option>
                            <option value="to-br">Diagonal ↘</option>
                            <option value="to-bl">Diagonal ↙</option>
                          </select>
                        </div>
                        {/* Vista previa del gradiente */}
                        <div 
                          className="h-6 rounded-md"
                          style={{
                            background: `linear-gradient(${
                              config.paginationActiveGradientDirection === 'to-r' ? 'to right' :
                              config.paginationActiveGradientDirection === 'to-l' ? 'to left' :
                              config.paginationActiveGradientDirection === 'to-t' ? 'to top' :
                              config.paginationActiveGradientDirection === 'to-b' ? 'to bottom' :
                              config.paginationActiveGradientDirection === 'to-tr' ? 'to top right' :
                              config.paginationActiveGradientDirection === 'to-tl' ? 'to top left' :
                              config.paginationActiveGradientDirection === 'to-br' ? 'to bottom right' :
                              config.paginationActiveGradientDirection === 'to-bl' ? 'to bottom left' : 'to right'
                            }, ${config.paginationActiveGradientFrom || '#3B82F6'}, ${config.paginationActiveGradientTo || '#06B6D4'})`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.paginationActiveColor || '#ffffff'}
                          onChange={(e) => handleUpdate('paginationActiveColor', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationActiveColor || 'rgba(255, 255, 255, 0.9)'}
                          onChange={(e) => handleUpdate('paginationActiveColor', e.target.value)}
                          placeholder="rgba(255, 255, 255, 0.9)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.paginationTextColor || '#ffffff'}
                        onChange={(e) => handleUpdate('paginationTextColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.paginationTextColor || '#FFFFFF'}
                        onChange={(e) => handleUpdate('paginationTextColor', e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modo Oscuro */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  🌙 Modo Oscuro
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Fondo botones
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.paginationBgColorDark || '#ffffff'}
                        onChange={(e) => handleUpdate('paginationBgColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.paginationBgColorDark || 'rgba(255, 255, 255, 0.15)'}
                        onChange={(e) => handleUpdate('paginationBgColorDark', e.target.value)}
                        placeholder="rgba(255, 255, 255, 0.15)"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Fondo página activa
                    </label>
                    
                    {/* Toggle para usar gradiente */}
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="paginationActiveUseGradientDark"
                        checked={config.paginationActiveUseGradientDark || false}
                        onChange={(e) => handleUpdate('paginationActiveUseGradientDark', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="paginationActiveUseGradientDark" className="text-xs text-gray-600 dark:text-gray-400">
                        Usar gradiente
                      </label>
                    </div>
                    
                    {config.paginationActiveUseGradientDark ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs text-gray-500">Color Inicio</span>
                            <div className="flex gap-1">
                              <input
                                type="color"
                                value={config.paginationActiveGradientFromDark || '#8B5CF6'}
                                onChange={(e) => handleUpdate('paginationActiveGradientFromDark', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={config.paginationActiveGradientFromDark || '#8B5CF6'}
                                onChange={(e) => handleUpdate('paginationActiveGradientFromDark', e.target.value)}
                                placeholder="#8B5CF6"
                                className="flex-1 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Color Fin</span>
                            <div className="flex gap-1">
                              <input
                                type="color"
                                value={config.paginationActiveGradientToDark || '#EC4899'}
                                onChange={(e) => handleUpdate('paginationActiveGradientToDark', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={config.paginationActiveGradientToDark || '#EC4899'}
                                onChange={(e) => handleUpdate('paginationActiveGradientToDark', e.target.value)}
                                placeholder="#EC4899"
                                className="flex-1 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Dirección</span>
                          <select
                            value={config.paginationActiveGradientDirectionDark || 'to-r'}
                            onChange={(e) => handleUpdate('paginationActiveGradientDirectionDark', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="to-r">Derecha →</option>
                            <option value="to-l">Izquierda ←</option>
                            <option value="to-t">Arriba ↑</option>
                            <option value="to-b">Abajo ↓</option>
                            <option value="to-tr">Diagonal ↗</option>
                            <option value="to-tl">Diagonal ↖</option>
                            <option value="to-br">Diagonal ↘</option>
                            <option value="to-bl">Diagonal ↙</option>
                          </select>
                        </div>
                        {/* Vista previa del gradiente */}
                        <div 
                          className="h-6 rounded-md"
                          style={{
                            background: `linear-gradient(${
                              config.paginationActiveGradientDirectionDark === 'to-r' ? 'to right' :
                              config.paginationActiveGradientDirectionDark === 'to-l' ? 'to left' :
                              config.paginationActiveGradientDirectionDark === 'to-t' ? 'to top' :
                              config.paginationActiveGradientDirectionDark === 'to-b' ? 'to bottom' :
                              config.paginationActiveGradientDirectionDark === 'to-tr' ? 'to top right' :
                              config.paginationActiveGradientDirectionDark === 'to-tl' ? 'to top left' :
                              config.paginationActiveGradientDirectionDark === 'to-br' ? 'to bottom right' :
                              config.paginationActiveGradientDirectionDark === 'to-bl' ? 'to bottom left' : 'to right'
                            }, ${config.paginationActiveGradientFromDark || '#8B5CF6'}, ${config.paginationActiveGradientToDark || '#EC4899'})`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.paginationActiveColorDark || '#ffffff'}
                          onChange={(e) => handleUpdate('paginationActiveColorDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationActiveColorDark || 'rgba(255, 255, 255, 0.9)'}
                          onChange={(e) => handleUpdate('paginationActiveColorDark', e.target.value)}
                          placeholder="rgba(255, 255, 255, 0.9)"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.paginationTextColorDark || '#ffffff'}
                        onChange={(e) => handleUpdate('paginationTextColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.paginationTextColorDark || '#FFFFFF'}
                        onChange={(e) => handleUpdate('paginationTextColorDark', e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== BOTÓN ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('boton')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🔘 Botón "Ver más"
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['boton'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['boton'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Fila 1: Texto y configuración básica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Texto del botón
                </label>
                <input
                  type="text"
                  value={config.buttonText || ''}
                  onChange={(e) => handleUpdate('buttonText', e.target.value)}
                  placeholder="Ver más"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Color de texto
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.buttonTextColor || '#FFFFFF'}
                    onChange={(e) => handleUpdate('buttonTextColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.buttonTextColor || '#FFFFFF'}
                    onChange={(e) => handleUpdate('buttonTextColor', e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Max características
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.maxFeatures || 3}
                  onChange={(e) => handleUpdate('maxFeatures', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* Fila 2: Configuración del fondo del botón */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                🎨 Fondo del Botón
              </h4>
              
              {/* Toggle para usar gradiente */}
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="buttonUseGradient"
                  checked={config.buttonUseGradient !== false}
                  onChange={(e) => handleUpdate('buttonUseGradient', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="buttonUseGradient" className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Usar gradiente
                </label>
              </div>
              
              {config.buttonUseGradient !== false ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Color Inicio */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color Inicio
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.buttonGradientFrom || '#3B82F6'}
                          onChange={(e) => handleUpdate('buttonGradientFrom', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.buttonGradientFrom || '#3B82F6'}
                          onChange={(e) => handleUpdate('buttonGradientFrom', e.target.value)}
                          placeholder="#3B82F6"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Color Fin */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color Fin
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.buttonGradientTo || '#06B6D4'}
                          onChange={(e) => handleUpdate('buttonGradientTo', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.buttonGradientTo || '#06B6D4'}
                          onChange={(e) => handleUpdate('buttonGradientTo', e.target.value)}
                          placeholder="#06B6D4"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Dirección */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Dirección
                      </label>
                      <select
                        value={config.buttonGradientDirection || 'to-r'}
                        onChange={(e) => handleUpdate('buttonGradientDirection', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="to-r">Derecha →</option>
                        <option value="to-l">Izquierda ←</option>
                        <option value="to-t">Arriba ↑</option>
                        <option value="to-b">Abajo ↓</option>
                        <option value="to-tr">Diagonal ↗</option>
                        <option value="to-tl">Diagonal ↖</option>
                        <option value="to-br">Diagonal ↘</option>
                        <option value="to-bl">Diagonal ↙</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Vista previa del gradiente */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Vista previa
                    </label>
                    <div 
                      className="h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-sm"
                      style={{
                        background: `linear-gradient(${
                          config.buttonGradientDirection === 'to-r' ? 'to right' :
                          config.buttonGradientDirection === 'to-l' ? 'to left' :
                          config.buttonGradientDirection === 'to-t' ? 'to top' :
                          config.buttonGradientDirection === 'to-b' ? 'to bottom' :
                          config.buttonGradientDirection === 'to-tr' ? 'to top right' :
                          config.buttonGradientDirection === 'to-tl' ? 'to top left' :
                          config.buttonGradientDirection === 'to-br' ? 'to bottom right' :
                          config.buttonGradientDirection === 'to-bl' ? 'to bottom left' : 'to right'
                        }, ${config.buttonGradientFrom || '#3B82F6'}, ${config.buttonGradientTo || '#06B6D4'})`,
                        color: config.buttonTextColor || '#FFFFFF'
                      }}
                    >
                      {config.buttonText || 'Ver más'}
                    </div>
                  </div>
                  
                  {/* Input de gradiente manual (colapsado) */}
                  <details className="text-xs">
                    <summary className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                      Código CSS avanzado (opcional)
                    </summary>
                    <input
                      type="text"
                      value={config.buttonGradient || ''}
                      onChange={(e) => handleUpdate('buttonGradient', e.target.value)}
                      placeholder="linear-gradient(90deg, #3B82F6, #06B6D4)"
                      className="w-full mt-2 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="mt-1 text-gray-400">Si defines un código CSS aquí, tendrá prioridad sobre los selectores de color.</p>
                  </details>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Color de fondo sólido
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.buttonBgColor || '#3B82F6'}
                      onChange={(e) => handleUpdate('buttonBgColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.buttonBgColor || '#3B82F6'}
                      onChange={(e) => handleUpdate('buttonBgColor', e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {/* Vista previa del color sólido */}
                  <div 
                    className="mt-3 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-sm"
                    style={{
                      backgroundColor: config.buttonBgColor || '#3B82F6',
                      color: config.buttonTextColor || '#FFFFFF'
                    }}
                  >
                    {config.buttonText || 'Ver más'}
                  </div>
                </div>
              )}
            </div>
            
            {/* 🎨 Colores de resaltado de características */}
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                🎨 Colores de Resaltado de Características
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Configura los colores del fondo, texto y borde de las características resaltadas
              </p>
              
              {/* Estilo de resaltado */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Estilo de resaltado
                </label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    config.featureHighlightStyle !== 'box' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="accordionFeatureHighlightStyle"
                      value="highlight"
                      checked={config.featureHighlightStyle !== 'box'}
                      onChange={() => handleUpdate('featureHighlightStyle', 'highlight')}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">✨ Resaltado</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estilo marcador fluido</p>
                    </div>
                  </label>
                  <label className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    config.featureHighlightStyle === 'box' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="accordionFeatureHighlightStyle"
                      value="box"
                      checked={config.featureHighlightStyle === 'box'}
                      onChange={() => handleUpdate('featureHighlightStyle', 'box')}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📦 Caja</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estilo tarjeta/badge</p>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Modo claro */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  ☀️ Modo Claro
                </label>
                
                {/* Fondo con opción de gradiente */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Fondo
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={config.featureHighlightBgGradient === true}
                        onChange={(e) => handleUpdate('featureHighlightBgGradient', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-600 dark:text-gray-400">Usar gradiente</span>
                    </label>
                  </div>
                  
                  {config.featureHighlightBgGradient ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.featureHighlightBgGradientFrom || '#F3E8FF'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientFrom', e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={config.featureHighlightBgGradientFrom || '#F3E8FF'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientFrom', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="#F3E8FF"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.featureHighlightBgGradientTo || '#E9D5FF'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientTo', e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={config.featureHighlightBgGradientTo || '#E9D5FF'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientTo', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="#E9D5FF"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                        <select
                          value={config.featureHighlightBgGradientDir || 'to-r'}
                          onChange={(e) => handleUpdate('featureHighlightBgGradientDir', e.target.value)}
                          className="w-full h-10 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="to-r">→ Derecha</option>
                          <option value="to-l">← Izquierda</option>
                          <option value="to-t">↑ Arriba</option>
                          <option value="to-b">↓ Abajo</option>
                          <option value="to-tr">↗ Diagonal ↗</option>
                          <option value="to-br">↘ Diagonal ↘</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.featureHighlightBgColor || '#F3E8FF'}
                        onChange={(e) => handleUpdate('featureHighlightBgColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={config.featureHighlightBgColor || '#F3E8FF'}
                        onChange={(e) => handleUpdate('featureHighlightBgColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        placeholder="#F3E8FF"
                      />
                    </div>
                  )}
                </div>
                
                {/* Texto */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Texto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.featureHighlightTextColor || '#6B21A8'}
                      onChange={(e) => handleUpdate('featureHighlightTextColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.featureHighlightTextColor || '#6B21A8'}
                      onChange={(e) => handleUpdate('featureHighlightTextColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      placeholder="#6B21A8"
                    />
                  </div>
                </div>
                
                {/* Borde con checkbox */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Borde
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={config.featureHighlightShowBorder !== false}
                        onChange={(e) => handleUpdate('featureHighlightShowBorder', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-600 dark:text-gray-400">Mostrar borde</span>
                    </label>
                  </div>
                  {config.featureHighlightShowBorder !== false && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.featureHighlightBorderColor || '#C084FC'}
                        onChange={(e) => handleUpdate('featureHighlightBorderColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={config.featureHighlightBorderColor || '#C084FC'}
                        onChange={(e) => handleUpdate('featureHighlightBorderColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        placeholder="#C084FC"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modo oscuro */}
              <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  🌙 Modo Oscuro
                </label>
                
                {/* Fondo con opción de gradiente */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-400">
                      Fondo
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={config.featureHighlightBgGradientDark === true}
                        onChange={(e) => handleUpdate('featureHighlightBgGradientDark', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-400">Usar gradiente</span>
                    </label>
                  </div>
                  
                  {config.featureHighlightBgGradientDark ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.featureHighlightBgGradientFromDark || '#581C87'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientFromDark', e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.featureHighlightBgGradientFromDark || '#581C87'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientFromDark', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                            placeholder="#581C87"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.featureHighlightBgGradientToDark || '#7C3AED'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientToDark', e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.featureHighlightBgGradientToDark || '#7C3AED'}
                            onChange={(e) => handleUpdate('featureHighlightBgGradientToDark', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                            placeholder="#7C3AED"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                        <select
                          value={config.featureHighlightBgGradientDirDark || 'to-r'}
                          onChange={(e) => handleUpdate('featureHighlightBgGradientDirDark', e.target.value)}
                          className="w-full h-10 px-2 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                        >
                          <option value="to-r">→ Derecha</option>
                          <option value="to-l">← Izquierda</option>
                          <option value="to-t">↑ Arriba</option>
                          <option value="to-b">↓ Abajo</option>
                          <option value="to-tr">↗ Diagonal ↗</option>
                          <option value="to-br">↘ Diagonal ↘</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.featureHighlightBgColorDark || '#581C87'}
                        onChange={(e) => handleUpdate('featureHighlightBgColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={config.featureHighlightBgColorDark || '#581C87'}
                        onChange={(e) => handleUpdate('featureHighlightBgColorDark', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        placeholder="#581C87"
                      />
                    </div>
                  )}
                </div>
                
                {/* Texto */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Texto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.featureHighlightTextColorDark || '#E9D5FF'}
                      onChange={(e) => handleUpdate('featureHighlightTextColorDark', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                    />
                    <input
                      type="text"
                      value={config.featureHighlightTextColorDark || '#E9D5FF'}
                      onChange={(e) => handleUpdate('featureHighlightTextColorDark', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded bg-gray-700 text-white font-mono"
                      placeholder="#E9D5FF"
                    />
                  </div>
                </div>
                
                {/* Borde con checkbox */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-400">
                      Borde
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={config.featureHighlightShowBorderDark !== false}
                        onChange={(e) => handleUpdate('featureHighlightShowBorderDark', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-400">Mostrar borde</span>
                    </label>
                  </div>
                  {config.featureHighlightShowBorderDark !== false && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.featureHighlightBorderColorDark || '#7C3AED'}
                        onChange={(e) => handleUpdate('featureHighlightBorderColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={config.featureHighlightBorderColorDark || '#7C3AED'}
                        onChange={(e) => handleUpdate('featureHighlightBorderColorDark', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        placeholder="#7C3AED"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Vista previa */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Vista previa ({config.featureHighlightStyle === 'box' ? '📦 Caja' : '✨ Resaltado'}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Característica 1', 'Característica 2'].map((text, idx) => {
                    const isBoxStyle = config.featureHighlightStyle === 'box';
                    const bgStyle = config.featureHighlightBgGradient
                      ? `linear-gradient(${
                          config.featureHighlightBgGradientDir === 'to-r' ? 'to right' :
                          config.featureHighlightBgGradientDir === 'to-l' ? 'to left' :
                          config.featureHighlightBgGradientDir === 'to-t' ? 'to top' :
                          config.featureHighlightBgGradientDir === 'to-b' ? 'to bottom' :
                          config.featureHighlightBgGradientDir === 'to-tr' ? 'to top right' :
                          config.featureHighlightBgGradientDir === 'to-br' ? 'to bottom right' : 'to right'
                        }, ${config.featureHighlightBgGradientFrom || '#F3E8FF'}, ${config.featureHighlightBgGradientTo || '#E9D5FF'})`
                      : (config.featureHighlightBgColor || '#F3E8FF');
                    const showBorder = config.featureHighlightShowBorder !== false;
                    
                    return (
                      <span
                        key={idx}
                        className={`font-medium ${isBoxStyle ? 'text-xs px-2.5 py-1.5 rounded-md' : 'text-sm'}`}
                        style={isBoxStyle ? {
                          background: bgStyle,
                          color: config.featureHighlightTextColor || '#6B21A8',
                          borderWidth: showBorder ? '1px' : '0',
                          borderStyle: 'solid',
                          borderColor: showBorder ? (config.featureHighlightBorderColor || '#C084FC') : 'transparent'
                        } : {
                          color: config.featureHighlightTextColor || '#6B21A8',
                          background: bgStyle,
                          padding: '0.1em 0.35em',
                          borderRadius: '0.2em',
                          lineHeight: '1.5',
                          borderWidth: showBorder ? '1px' : '0',
                          borderStyle: 'solid',
                          borderColor: showBorder ? (config.featureHighlightBorderColor || '#C084FC') : 'transparent'
                        }}
                      >
                        ✓ {text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* ===== FONDO ===== */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('fondo')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🖼️ Imagen de Fondo
              </h3>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections['fondo'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSections['fondo'] && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <ManagedImageSelector
                      label="Imagen modo claro"
                      description="Imagen de fondo para tema claro"
                      currentImage={config.backgroundImage?.light}
                      onImageSelect={(url: string) => handleUpdate('backgroundImage.light', url)}
                      hideButtonArea={!!config.backgroundImage?.light}
                    />
                  </div>
                  
                  <div>
                    <ManagedImageSelector
                      label="Imagen modo oscuro"
                      description="Imagen de fondo para tema oscuro"
                      currentImage={config.backgroundImage?.dark}
                      onImageSelect={(url: string) => handleUpdate('backgroundImage.dark', url)}
                      hideButtonArea={!!config.backgroundImage?.dark}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Opacidad del fondo: {Math.round((config.backgroundOpacity ?? 0.1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((config.backgroundOpacity ?? 0.1) * 100)}
                    onChange={(e) => handleUpdate('backgroundOpacity', parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Vista previa */}
                <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Vista previa</h4>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-4">
                      <h3 
                        className="text-xl font-bold italic"
                        style={{ 
                          color: config.titleColor || '#8B5CF6',
                          fontFamily: config.titleFontFamily || 'inherit'
                        }}
                      >
                        {config.sectionTitle || 'Todos los servicios'}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: config.subtitleColor || '#4B5563' }}
                      >
                        {config.sectionSubtitle || 'Trabajamos para llevar tus operaciones al siguiente nivel.'}
                      </p>
                    </div>
                    
                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span 
                            className="text-xl font-light"
                            style={{ color: config.numberColor || '#8B5CF6' }}
                          >
                            01
                          </span>
                          <span 
                            className="font-semibold"
                            style={{ 
                              color: config.serviceTitleColor || '#1F2937',
                              fontFamily: config.titleFontFamily || 'inherit'
                            }}
                          >
                            Ejemplo de Servicio
                          </span>
                        </div>
                        <span style={{ color: config.iconColor || '#8B5CF6' }}>▼</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ServicesAccordionConfigSection;
