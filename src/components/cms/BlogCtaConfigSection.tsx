/**
 * 📢 BlogCtaConfigSection Component
 * Panel de configuración CMS para la sección CTA (Call to Action) del blog
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Megaphone, 
  Type, 
  Palette, 
  Sparkles,
  MousePointer,
  Eye,
  EyeOff,
  Trash2,
  Image
} from 'lucide-react';
import type { BlogCtaConfig } from '../../hooks/blog/useBlogCmsConfig';
import { DEFAULT_BLOG_CTA_CONFIG } from '../../hooks/blog/useBlogCmsConfig';
import ImageSelectorModal from '../ImageSelectorModal';

interface BlogCtaConfigSectionProps {
  config: BlogCtaConfig;
  onChange: (config: BlogCtaConfig) => void;
}

const BlogCtaConfigSection: React.FC<BlogCtaConfigSectionProps> = ({ config, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'background' | 'title' | 'buttons' | 'card'>('content');
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  // Merge config with defaults
  const ctaConfig = {
    ...DEFAULT_BLOG_CTA_CONFIG,
    ...config
  };

  // Handle change
  const handleChange = (key: string, value: string | boolean | number) => {
    onChange({
      ...ctaConfig,
      [key]: value
    });
  };

  const tabs = [
    { id: 'content', label: 'Contenido', icon: Type },
    { id: 'background', label: 'Fondo', icon: Palette },
    { id: 'title', label: 'Título', icon: Sparkles },
    { id: 'buttons', label: 'Botones', icon: MousePointer },
    { id: 'card', label: 'Tarjeta', icon: Eye }
  ];

  // Abrir el modal de selección de imágenes
  const handleOpenImageSelector = () => {
    setIsImageSelectorOpen(true);
  };

  // Manejar selección de imagen desde el modal
  const handleImageSelect = (imageUrl: string) => {
    handleChange('bgImage', imageUrl);
    setIsImageSelectorOpen(false);
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    handleChange('bgImage', '');
  };

  return (
    <>
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelect={handleImageSelect}
        currentImage={ctaConfig.bgImage}
        title="Seleccionar imagen de fondo para Blog CTA"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Megaphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sección CTA (Último Llamado)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura el call to action al final del blog
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
          {/* Toggle de visibilidad */}
          <div className="flex items-center justify-between py-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {ctaConfig.showSection ? (
                <Eye className="w-5 h-5 text-green-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar sección CTA
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ctaConfig.showSection !== false}
                onChange={(e) => handleChange('showSection', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* ===== TAB: CONTENIDO ===== */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Textos del CTA
                </h4>

                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título principal
                  </label>
                  <input
                    type="text"
                    value={ctaConfig.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="¿Listo para transformar tu negocio?"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Palabra destacada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Palabra a destacar
                  </label>
                  <input
                    type="text"
                    value={ctaConfig.titleHighlight}
                    onChange={(e) => handleChange('titleHighlight', e.target.value)}
                    placeholder="transformar"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Esta palabra se resaltará con gradiente o color especial</p>
                </div>

                {/* Subtítulo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    value={ctaConfig.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Únete a miles de empresas..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Fuente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipografía
                  </label>
                  <select
                    value={ctaConfig.fontFamily}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Montserrat">Montserrat</option>
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>

                {/* Textos de botones */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Texto botón principal
                    </label>
                    <input
                      type="text"
                      value={ctaConfig.buttonText}
                      onChange={(e) => handleChange('buttonText', e.target.value)}
                      placeholder="Contáctanos"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enlace botón principal
                    </label>
                    <input
                      type="text"
                      value={ctaConfig.buttonLink}
                      onChange={(e) => handleChange('buttonLink', e.target.value)}
                      placeholder="/contacto"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Botón secundario */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mostrar botón secundario
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ctaConfig.showSecondaryButton !== false}
                        onChange={(e) => handleChange('showSecondaryButton', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  {ctaConfig.showSecondaryButton !== false && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Texto
                        </label>
                        <input
                          type="text"
                          value={ctaConfig.secondaryButtonText}
                          onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
                          placeholder="Ver servicios"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Enlace
                        </label>
                        <input
                          type="text"
                          value={ctaConfig.secondaryButtonLink}
                          onChange={(e) => handleChange('secondaryButtonLink', e.target.value)}
                          placeholder="/servicios"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== TAB: FONDO ===== */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Configuración del Fondo
                </h4>

                {/* Tipo de fondo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de fondo
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['solid', 'gradient', 'image'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleChange('bgType', type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          ctaConfig.bgType === type
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {type === 'solid' ? '🎨 Sólido' : type === 'gradient' ? '🌈 Gradiente' : '🖼️ Imagen'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color sólido */}
                {ctaConfig.bgType === 'solid' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color (tema claro)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={ctaConfig.bgColorLight}
                          onChange={(e) => handleChange('bgColorLight', e.target.value)}
                          className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={ctaConfig.bgColorLight}
                          onChange={(e) => handleChange('bgColorLight', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color (tema oscuro)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={ctaConfig.bgColorDark}
                          onChange={(e) => handleChange('bgColorDark', e.target.value)}
                          className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={ctaConfig.bgColorDark}
                          onChange={(e) => handleChange('bgColorDark', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gradiente */}
                {ctaConfig.bgType === 'gradient' && (
                  <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color inicial
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={ctaConfig.bgGradientFrom}
                            onChange={(e) => handleChange('bgGradientFrom', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={ctaConfig.bgGradientFrom}
                            onChange={(e) => handleChange('bgGradientFrom', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color final
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={ctaConfig.bgGradientTo}
                            onChange={(e) => handleChange('bgGradientTo', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={ctaConfig.bgGradientTo}
                            onChange={(e) => handleChange('bgGradientTo', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Dirección del gradiente
                      </label>
                      <select
                        value={ctaConfig.bgGradientDirection}
                        onChange={(e) => handleChange('bgGradientDirection', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="to-r">→ Izquierda a Derecha</option>
                        <option value="to-l">← Derecha a Izquierda</option>
                        <option value="to-t">↑ Abajo a Arriba</option>
                        <option value="to-b">↓ Arriba a Abajo</option>
                        <option value="to-tr">↗ Diagonal Superior Derecha</option>
                        <option value="to-br">↘ Diagonal Inferior Derecha</option>
                      </select>
                    </div>
                    
                    {/* Preview del gradiente */}
                    <div 
                      className="h-20 rounded-lg"
                      style={{
                        background: `linear-gradient(${
                          ctaConfig.bgGradientDirection === 'to-r' ? 'to right' :
                          ctaConfig.bgGradientDirection === 'to-l' ? 'to left' :
                          ctaConfig.bgGradientDirection === 'to-t' ? 'to top' :
                          ctaConfig.bgGradientDirection === 'to-b' ? 'to bottom' :
                          ctaConfig.bgGradientDirection === 'to-tr' ? 'to top right' :
                          'to bottom right'
                        }, ${ctaConfig.bgGradientFrom}, ${ctaConfig.bgGradientTo})`
                      }}
                    />
                  </div>
                )}

                {/* Imagen de fondo */}
                {ctaConfig.bgType === 'image' && (
                  <div className="space-y-4">
                    {/* Área de carga o vista previa */}
                    {ctaConfig.bgImage ? (
                      // Vista previa de la imagen
                      <div className="relative rounded-lg overflow-hidden">
                        <div 
                          className="h-40 bg-cover bg-center"
                          style={{ backgroundImage: `url(${ctaConfig.bgImage})` }}
                        >
                          <div 
                            className="absolute inset-0 bg-black"
                            style={{ opacity: ctaConfig.bgOverlay ?? 0 }}
                          />
                        </div>
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Eliminar imagen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleOpenImageSelector}
                          className="absolute top-2 left-2 p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                          title="Cambiar imagen"
                        >
                          <Image className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          📷 Imagen cargada
                        </div>
                      </div>
                    ) : (
                      // Botón para abrir el selector de imágenes
                      <button
                        onClick={handleOpenImageSelector}
                        className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
                      >
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          <Image className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Haz clic para seleccionar una imagen
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Desde la biblioteca o subir una nueva
                          </p>
                        </div>
                      </button>
                    )}

                    {/* URL manual (alternativa) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        O ingresa una URL directamente:
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={ctaConfig.bgImage || ''}
                            onChange={(e) => handleChange('bgImage', e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        {ctaConfig.bgImage && (
                          <button
                            onClick={handleRemoveImage}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Eliminar imagen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Control de overlay */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Opacidad del overlay oscuro: {Math.round((ctaConfig.bgOverlay ?? 0) * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={ctaConfig.bgOverlay ?? 0}
                        onChange={(e) => handleChange('bgOverlay', parseFloat(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Sin overlay (0%)</span>
                        <span>Máximo (100%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== TAB: TÍTULO ===== */}
            {activeTab === 'title' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Estilos del Título
                </h4>

                {/* Color del título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del título
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={ctaConfig.titleColor}
                      onChange={(e) => handleChange('titleColor', e.target.value)}
                      className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={ctaConfig.titleColor}
                      onChange={(e) => handleChange('titleColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Palabra destacada */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      🌈 Usar gradiente en palabra destacada
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ctaConfig.titleHighlightUseGradient}
                        onChange={(e) => handleChange('titleHighlightUseGradient', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {ctaConfig.titleHighlightUseGradient ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Color inicial
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={ctaConfig.titleHighlightGradientFrom}
                              onChange={(e) => handleChange('titleHighlightGradientFrom', e.target.value)}
                              className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={ctaConfig.titleHighlightGradientFrom}
                              onChange={(e) => handleChange('titleHighlightGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Color final
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={ctaConfig.titleHighlightGradientTo}
                              onChange={(e) => handleChange('titleHighlightGradientTo', e.target.value)}
                              className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={ctaConfig.titleHighlightGradientTo}
                              onChange={(e) => handleChange('titleHighlightGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Dirección
                        </label>
                        <select
                          value={ctaConfig.titleHighlightGradientDirection}
                          onChange={(e) => handleChange('titleHighlightGradientDirection', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="to-r">→ Izquierda a Derecha</option>
                          <option value="to-l">← Derecha a Izquierda</option>
                          <option value="to-br">↘ Diagonal</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color de la palabra destacada
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={ctaConfig.titleHighlightColor}
                          onChange={(e) => handleChange('titleHighlightColor', e.target.value)}
                          className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={ctaConfig.titleHighlightColor}
                          onChange={(e) => handleChange('titleHighlightColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Color del subtítulo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del subtítulo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={ctaConfig.subtitleColor}
                      onChange={(e) => handleChange('subtitleColor', e.target.value)}
                      className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={ctaConfig.subtitleColor}
                      onChange={(e) => handleChange('subtitleColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ===== TAB: BOTONES ===== */}
            {activeTab === 'buttons' && (
              <div className="space-y-6">
                {/* ===== BOTÓN PRINCIPAL ===== */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    🔵 Botón Principal
                  </h5>

                  {/* Fondo transparente */}
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-700 dark:text-gray-300">🚫 Fondo transparente</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ctaConfig.buttonBgTransparent || false}
                        onChange={(e) => handleChange('buttonBgTransparent', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {/* Configuración de fondo (solo si no es transparente) */}
                  {!ctaConfig.buttonBgTransparent && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">🌈 Usar gradiente en fondo</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ctaConfig.buttonUseGradient || false}
                            onChange={(e) => handleChange('buttonUseGradient', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      {ctaConfig.buttonUseGradient ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color inicial</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={ctaConfig.buttonGradientFrom || '#8b5cf6'}
                                onChange={(e) => handleChange('buttonGradientFrom', e.target.value)}
                                className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                value={ctaConfig.buttonGradientFrom || '#8b5cf6'}
                                onChange={(e) => handleChange('buttonGradientFrom', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color final</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={ctaConfig.buttonGradientTo || '#06b6d4'}
                                onChange={(e) => handleChange('buttonGradientTo', e.target.value)}
                                className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                value={ctaConfig.buttonGradientTo || '#06b6d4'}
                                onChange={(e) => handleChange('buttonGradientTo', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color de fondo</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={ctaConfig.buttonBgColor || '#8b5cf6'}
                              onChange={(e) => handleChange('buttonBgColor', e.target.value)}
                              className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={ctaConfig.buttonBgColor || '#8b5cf6'}
                              onChange={(e) => handleChange('buttonBgColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Configuración de borde */}
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                    <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300">🔲 Borde del botón</h6>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">🌈 Usar gradiente en borde</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ctaConfig.buttonBorderUseGradient || false}
                          onChange={(e) => handleChange('buttonBorderUseGradient', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {ctaConfig.buttonBorderUseGradient ? (
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color inicial</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={ctaConfig.buttonBorderGradientFrom || '#8b5cf6'}
                                onChange={(e) => handleChange('buttonBorderGradientFrom', e.target.value)}
                                className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                value={ctaConfig.buttonBorderGradientFrom || '#8b5cf6'}
                                onChange={(e) => handleChange('buttonBorderGradientFrom', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color final</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={ctaConfig.buttonBorderGradientTo || '#06b6d4'}
                                onChange={(e) => handleChange('buttonBorderGradientTo', e.target.value)}
                                className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                value={ctaConfig.buttonBorderGradientTo || '#06b6d4'}
                                onChange={(e) => handleChange('buttonBorderGradientTo', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                          <select
                            value={ctaConfig.buttonBorderGradientDirection || 'to-r'}
                            onChange={(e) => handleChange('buttonBorderGradientDirection', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="to-r">→ Izquierda a Derecha</option>
                            <option value="to-l">← Derecha a Izquierda</option>
                            <option value="to-br">↘ Diagonal</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color del borde</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={ctaConfig.buttonBorderColor || '#8b5cf6'}
                            onChange={(e) => handleChange('buttonBorderColor', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={ctaConfig.buttonBorderColor || '#8b5cf6'}
                            onChange={(e) => handleChange('buttonBorderColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ancho del borde (px)</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={ctaConfig.buttonBorderWidth || 2}
                        onChange={(e) => handleChange('buttonBorderWidth', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Color del texto */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color del texto</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={ctaConfig.buttonTextColor || '#ffffff'}
                        onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                        className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={ctaConfig.buttonTextColor || '#ffffff'}
                        onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Border radius */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Border radius</label>
                    <select
                      value={ctaConfig.buttonBorderRadius || '9999px'}
                      onChange={(e) => handleChange('buttonBorderRadius', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="4px">Cuadrado (4px)</option>
                      <option value="8px">Redondeado (8px)</option>
                      <option value="12px">Más redondeado (12px)</option>
                      <option value="9999px">Completamente redondeado (pill)</option>
                    </select>
                  </div>
                </div>

                {/* ===== BOTÓN SECUNDARIO ===== */}
                {ctaConfig.showSecondaryButton !== false && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      ⚪ Botón Secundario
                    </h5>

                    {/* Fondo transparente */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-700 dark:text-gray-300">🚫 Fondo transparente</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ctaConfig.secondaryButtonBgTransparent !== false}
                          onChange={(e) => handleChange('secondaryButtonBgTransparent', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {/* Color de fondo (solo si no es transparente) */}
                    {!ctaConfig.secondaryButtonBgTransparent && ctaConfig.secondaryButtonBgTransparent !== undefined && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color de fondo</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={ctaConfig.secondaryButtonBgColor || '#ffffff'}
                            onChange={(e) => handleChange('secondaryButtonBgColor', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={ctaConfig.secondaryButtonBgColor || '#ffffff'}
                            onChange={(e) => handleChange('secondaryButtonBgColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Color del texto */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color del texto</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={ctaConfig.secondaryButtonTextColor || '#ffffff'}
                          onChange={(e) => handleChange('secondaryButtonTextColor', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={ctaConfig.secondaryButtonTextColor || '#ffffff'}
                          onChange={(e) => handleChange('secondaryButtonTextColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Configuración de borde */}
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                      <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300">🔲 Borde del botón</h6>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">🌈 Usar gradiente en borde</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ctaConfig.secondaryButtonBorderUseGradient || false}
                            onChange={(e) => handleChange('secondaryButtonBorderUseGradient', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      {ctaConfig.secondaryButtonBorderUseGradient ? (
                        <div className="p-3 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color inicial</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={ctaConfig.secondaryButtonBorderGradientFrom || '#8b5cf6'}
                                  onChange={(e) => handleChange('secondaryButtonBorderGradientFrom', e.target.value)}
                                  className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                                />
                                <input
                                  type="text"
                                  value={ctaConfig.secondaryButtonBorderGradientFrom || '#8b5cf6'}
                                  onChange={(e) => handleChange('secondaryButtonBorderGradientFrom', e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color final</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={ctaConfig.secondaryButtonBorderGradientTo || '#06b6d4'}
                                  onChange={(e) => handleChange('secondaryButtonBorderGradientTo', e.target.value)}
                                  className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                                />
                                <input
                                  type="text"
                                  value={ctaConfig.secondaryButtonBorderGradientTo || '#06b6d4'}
                                  onChange={(e) => handleChange('secondaryButtonBorderGradientTo', e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                            <select
                              value={ctaConfig.secondaryButtonBorderGradientDirection || 'to-r'}
                              onChange={(e) => handleChange('secondaryButtonBorderGradientDirection', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="to-r">→ Izquierda a Derecha</option>
                              <option value="to-l">← Derecha a Izquierda</option>
                              <option value="to-br">↘ Diagonal</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color del borde</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={ctaConfig.secondaryButtonBorderColor || '#ffffff'}
                              onChange={(e) => handleChange('secondaryButtonBorderColor', e.target.value)}
                              className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={ctaConfig.secondaryButtonBorderColor || '#ffffff'}
                              onChange={(e) => handleChange('secondaryButtonBorderColor', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ancho del borde (px)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={ctaConfig.secondaryButtonBorderWidth || 2}
                          onChange={(e) => handleChange('secondaryButtonBorderWidth', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Border radius */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Border radius</label>
                      <select
                        value={ctaConfig.secondaryButtonBorderRadius || '9999px'}
                        onChange={(e) => handleChange('secondaryButtonBorderRadius', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="4px">Cuadrado (4px)</option>
                        <option value="8px">Redondeado (8px)</option>
                        <option value="12px">Más redondeado (12px)</option>
                        <option value="9999px">Completamente redondeado (pill)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== TAB: TARJETA ===== */}
            {activeTab === 'card' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  📦 Tarjeta Contenedora
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Configura la tarjeta que contiene el título, subtítulo y botones
                </p>

                {/* Toggle mostrar tarjeta */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🎴 Mostrar tarjeta contenedora
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ctaConfig.showCard !== false}
                      onChange={(e) => handleChange('showCard', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {ctaConfig.showCard !== false && (
                  <div className="space-y-4">
                    {/* Fondo de la tarjeta */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        🎨 Fondo de la Tarjeta
                      </h5>

                      {/* Toggle fondo transparente */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          🚫 Fondo transparente
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ctaConfig.cardBgTransparent === true}
                            onChange={(e) => handleChange('cardBgTransparent', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      {/* Configuración de fondo (solo si no es transparente) */}
                      {!ctaConfig.cardBgTransparent && (
                        <>
                          {/* Toggle usar gradiente */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              🌈 Usar gradiente en fondo
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={ctaConfig.cardBgUseGradient === true}
                                onChange={(e) => handleChange('cardBgUseGradient', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                          </div>

                          {/* Configuración de gradiente */}
                          {ctaConfig.cardBgUseGradient ? (
                            <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg border border-teal-200 dark:border-teal-800 space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Color inicial
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="color"
                                      value={ctaConfig.cardBgGradientFrom || '#0d9488'}
                                      onChange={(e) => handleChange('cardBgGradientFrom', e.target.value)}
                                      className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                                    />
                                    <input
                                      type="text"
                                      value={ctaConfig.cardBgGradientFrom || '#0d9488'}
                                      onChange={(e) => handleChange('cardBgGradientFrom', e.target.value)}
                                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Color final
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="color"
                                      value={ctaConfig.cardBgGradientTo || '#1e3a5f'}
                                      onChange={(e) => handleChange('cardBgGradientTo', e.target.value)}
                                      className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                                    />
                                    <input
                                      type="text"
                                      value={ctaConfig.cardBgGradientTo || '#1e3a5f'}
                                      onChange={(e) => handleChange('cardBgGradientTo', e.target.value)}
                                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Dirección del gradiente
                                </label>
                                <select
                                  value={ctaConfig.cardBgGradientDirection || 'to-r'}
                                  onChange={(e) => handleChange('cardBgGradientDirection', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                  <option value="to-r">→ Izquierda a Derecha</option>
                                  <option value="to-l">← Derecha a Izquierda</option>
                                  <option value="to-t">↑ Abajo a Arriba</option>
                                  <option value="to-b">↓ Arriba a Abajo</option>
                                  <option value="to-tr">↗ Diagonal Superior Derecha</option>
                                  <option value="to-br">↘ Diagonal Inferior Derecha</option>
                                </select>
                              </div>
                              {/* Preview del gradiente */}
                              <div 
                                className="h-12 rounded-lg"
                                style={{
                                  background: `linear-gradient(${
                                    ctaConfig.cardBgGradientDirection === 'to-r' ? 'to right' :
                                    ctaConfig.cardBgGradientDirection === 'to-l' ? 'to left' :
                                    ctaConfig.cardBgGradientDirection === 'to-t' ? 'to top' :
                                    ctaConfig.cardBgGradientDirection === 'to-b' ? 'to bottom' :
                                    ctaConfig.cardBgGradientDirection === 'to-tr' ? 'to top right' :
                                    'to bottom right'
                                  }, ${ctaConfig.cardBgGradientFrom || '#0d9488'}, ${ctaConfig.cardBgGradientTo || '#1e3a5f'})`
                                }}
                              />
                            </div>
                          ) : (
                            /* Color sólido */
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Color de fondo
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={ctaConfig.cardBgColor?.startsWith('#') ? ctaConfig.cardBgColor : '#1e3a5f'}
                                  onChange={(e) => handleChange('cardBgColor', e.target.value)}
                                  className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                                />
                                <input
                                  type="text"
                                  value={ctaConfig.cardBgColor || '#1e3a5f'}
                                  onChange={(e) => handleChange('cardBgColor', e.target.value)}
                                  placeholder="#1e3a5f"
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Efecto blur (solo si no es transparente) */}
                      {!ctaConfig.cardBgTransparent && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            ✨ Efecto blur (glassmorphism)
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ctaConfig.cardBgBlur === true}
                              onChange={(e) => handleChange('cardBgBlur', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Dimensiones */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        📐 Dimensiones
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ancho máximo
                          </label>
                          <select
                            value={ctaConfig.cardMaxWidth || '800px'}
                            onChange={(e) => handleChange('cardMaxWidth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="600px">Pequeño (600px)</option>
                            <option value="800px">Mediano (800px)</option>
                            <option value="1000px">Grande (1000px)</option>
                            <option value="100%">Completo (100%)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Padding interno
                          </label>
                          <select
                            value={ctaConfig.cardPadding || '48px'}
                            onChange={(e) => handleChange('cardPadding', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="24px">Pequeño (24px)</option>
                            <option value="32px">Mediano (32px)</option>
                            <option value="48px">Grande (48px)</option>
                            <option value="64px">Extra grande (64px)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Border radius
                        </label>
                        <select
                          value={ctaConfig.cardBorderRadius || '24px'}
                          onChange={(e) => handleChange('cardBorderRadius', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="8px">Sutil (8px)</option>
                          <option value="16px">Redondeado (16px)</option>
                          <option value="24px">Muy redondeado (24px)</option>
                          <option value="32px">Extra redondeado (32px)</option>
                        </select>
                      </div>
                    </div>

                    {/* Borde de la tarjeta */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        🔲 Borde de la Tarjeta
                      </h5>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          🌈 Usar gradiente en borde
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ctaConfig.cardBorderUseGradient || false}
                            onChange={(e) => handleChange('cardBorderUseGradient', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      {ctaConfig.cardBorderUseGradient ? (
                        <div className="space-y-3 p-3 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color inicial</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={ctaConfig.cardBorderGradientFrom || '#8b5cf6'}
                                  onChange={(e) => handleChange('cardBorderGradientFrom', e.target.value)}
                                  className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                                />
                                <input
                                  type="text"
                                  value={ctaConfig.cardBorderGradientFrom || '#8b5cf6'}
                                  onChange={(e) => handleChange('cardBorderGradientFrom', e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color final</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={ctaConfig.cardBorderGradientTo || '#06b6d4'}
                                  onChange={(e) => handleChange('cardBorderGradientTo', e.target.value)}
                                  className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                                />
                                <input
                                  type="text"
                                  value={ctaConfig.cardBorderGradientTo || '#06b6d4'}
                                  onChange={(e) => handleChange('cardBorderGradientTo', e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                            <select
                              value={ctaConfig.cardBorderGradientDirection || 'to-r'}
                              onChange={(e) => handleChange('cardBorderGradientDirection', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="to-r">→ Izquierda a Derecha</option>
                              <option value="to-br">↘ Diagonal Inferior Derecha</option>
                              <option value="to-b">↓ Arriba a Abajo</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Color del borde
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={ctaConfig.cardBorderColor || 'rgba(255, 255, 255, 0.1)'}
                              onChange={(e) => handleChange('cardBorderColor', e.target.value)}
                              placeholder="rgba(255, 255, 255, 0.1)"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ancho del borde (px)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={ctaConfig.cardBorderWidth ?? 1}
                          onChange={(e) => handleChange('cardBorderWidth', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Preview de la tarjeta */}
                    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-400 mb-3">Vista previa de la tarjeta:</p>
                      <div className="flex justify-center">
                        {ctaConfig.cardBorderUseGradient ? (
                          <div
                            className="inline-block"
                            style={{
                              background: `linear-gradient(${
                                ctaConfig.cardBorderGradientDirection === 'to-r' ? 'to right' :
                                ctaConfig.cardBorderGradientDirection === 'to-b' ? 'to bottom' :
                                'to bottom right'
                              }, ${ctaConfig.cardBorderGradientFrom || '#8b5cf6'}, ${ctaConfig.cardBorderGradientTo || '#06b6d4'})`,
                              padding: `${ctaConfig.cardBorderWidth ?? 1}px`,
                              borderRadius: ctaConfig.cardBorderRadius || '24px'
                            }}
                          >
                            <div
                              className="px-8 py-6 text-center"
                              style={{
                                backgroundColor: ctaConfig.cardBgColor || 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: ctaConfig.cardBgBlur ? 'blur(16px)' : 'none',
                                borderRadius: `calc(${ctaConfig.cardBorderRadius || '24px'} - ${ctaConfig.cardBorderWidth ?? 1}px)`
                              }}
                            >
                              <p className="text-white font-semibold">Contenido CTA</p>
                              <p className="text-gray-400 text-sm">Título, subtítulo y botones</p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="px-8 py-6 text-center"
                            style={{
                              backgroundColor: ctaConfig.cardBgColor || 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: ctaConfig.cardBgBlur ? 'blur(16px)' : 'none',
                              borderRadius: ctaConfig.cardBorderRadius || '24px',
                              border: `${ctaConfig.cardBorderWidth ?? 1}px solid ${ctaConfig.cardBorderColor || 'rgba(255, 255, 255, 0.1)'}`
                            }}
                          >
                            <p className="text-white font-semibold">Contenido CTA</p>
                            <p className="text-gray-400 text-sm">Título, subtítulo y botones</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vista Previa */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Vista previa:</p>
            <div 
              className="relative p-8 rounded-lg overflow-hidden text-center"
              style={{
                background: ctaConfig.bgType === 'gradient' 
                  ? `linear-gradient(${
                      ctaConfig.bgGradientDirection === 'to-r' ? 'to right' :
                      ctaConfig.bgGradientDirection === 'to-l' ? 'to left' :
                      ctaConfig.bgGradientDirection === 'to-t' ? 'to top' :
                      ctaConfig.bgGradientDirection === 'to-b' ? 'to bottom' :
                      ctaConfig.bgGradientDirection === 'to-tr' ? 'to top right' :
                      'to bottom right'
                    }, ${ctaConfig.bgGradientFrom}, ${ctaConfig.bgGradientTo})`
                  : ctaConfig.bgColorDark
              }}
            >
              {/* Título preview */}
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: ctaConfig.titleColor }}
              >
                {ctaConfig.title?.split(ctaConfig.titleHighlight || '')[0]}
                {ctaConfig.titleHighlightUseGradient ? (
                  <span
                    style={{
                      background: `linear-gradient(to right, ${ctaConfig.titleHighlightGradientFrom}, ${ctaConfig.titleHighlightGradientTo})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {ctaConfig.titleHighlight}
                  </span>
                ) : (
                  <span style={{ color: ctaConfig.titleHighlightColor }}>
                    {ctaConfig.titleHighlight}
                  </span>
                )}
                {ctaConfig.title?.split(ctaConfig.titleHighlight || '')[1]}
              </h3>
              
              {/* Subtítulo preview */}
              <p 
                className="text-sm mb-4 max-w-md mx-auto"
                style={{ color: ctaConfig.subtitleColor }}
              >
                {ctaConfig.subtitle?.substring(0, 60)}...
              </p>
              
              {/* Botones preview */}
              <div className="flex gap-3 justify-center flex-wrap">
                <span
                  className="px-4 py-2 text-xs font-semibold"
                  style={{
                    background: ctaConfig.buttonUseGradient 
                      ? `linear-gradient(to right, ${ctaConfig.buttonGradientFrom}, ${ctaConfig.buttonGradientTo})`
                      : ctaConfig.buttonBgColor,
                    color: ctaConfig.buttonTextColor,
                    borderRadius: ctaConfig.buttonBorderRadius
                  }}
                >
                  {ctaConfig.buttonText}
                </span>
                {ctaConfig.showSecondaryButton && (
                  <span
                    className="px-4 py-2 text-xs font-semibold"
                    style={{
                      color: ctaConfig.secondaryButtonTextColor,
                      border: `${ctaConfig.secondaryButtonBorderWidth}px solid ${ctaConfig.secondaryButtonBorderColor}`,
                      borderRadius: ctaConfig.secondaryButtonBorderRadius
                    }}
                  >
                    {ctaConfig.secondaryButtonText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default BlogCtaConfigSection;
