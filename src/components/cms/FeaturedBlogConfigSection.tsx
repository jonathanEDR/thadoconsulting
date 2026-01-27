import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import ManagedImageSelector from '../ManagedImageSelector';
import DynamicIcon, { AVAILABLE_SIDEBAR_ICONS } from '../ui/DynamicIcon';

interface FeaturedBlogConfigSectionProps {
  pageData: any;
  updateContent: (path: string, value: any) => void;
  updateTextStyle: (section: 'featuredBlog', field: string, mode: 'light' | 'dark', color: string) => void;
}

const FeaturedBlogConfigSection: React.FC<FeaturedBlogConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {
  const config = pageData.content?.featuredBlog || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sección de Webinars y Blogs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configura los posts destacados que aparecen en el home
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-6">
        {/* Configuración del Encabezado */}
        <HeaderIconSelector
          config={config}
          updateContent={updateContent}
        />

        {/* Configuración de Tipografía */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            🅰️ Configuración de Tipografía
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fuente Tipográfica
            </label>
            <select
              value={config.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('featuredBlog.fontFamily', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Montserrat">Montserrat (Por defecto)</option>
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Raleway">Raleway</option>
              <option value="Nunito">Nunito</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Georgia">Georgia</option>
              <option value="Arial">Arial</option>
              <option value="system-ui">System UI</option>
            </select>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Esta fuente se aplicará al título y contenido de la sección de blog en el home.
            </p>
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Vista previa:
              </p>
              <p 
                className="text-2xl font-bold text-gray-800 dark:text-white"
                style={{ fontFamily: config.fontFamily || 'Montserrat' }}
              >
                {config.title || 'Webinars y blogs'}
              </p>
            </div>
          </div>
        </div>

        {/* Textos Principales */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título de la Sección
            </label>
            <input
              type="text"
              value={config.title || 'Webinars y blogs'}
              onChange={(e) => updateContent('featuredBlog.title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Webinars y blogs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtítulo
            </label>
            <textarea
              value={config.subtitle || ''}
              onChange={(e) => updateContent('featuredBlog.subtitle', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Accede a nuestros webinars y blogs..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={config.description || ''}
              onChange={(e) => updateContent('featuredBlog.description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Descripción adicional..."
            />
          </div>
        </div>

        {/* Configuración del Botón */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Texto del Botón
            </label>
            <input
              type="text"
              value={config.buttonText || 'Ver todos los artículos'}
              onChange={(e) => updateContent('featuredBlog.buttonText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ver todos los artículos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enlace del Botón
            </label>
            <input
              type="text"
              value={config.buttonLink || '/blog'}
              onChange={(e) => updateContent('featuredBlog.buttonLink', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="/blog"
            />
          </div>
        </div>

        {/* Cantidad de Posts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cantidad de Posts a Mostrar
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={config.limit || 3}
            onChange={(e) => updateContent('featuredBlog.limit', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Número de posts destacados a mostrar (1-12)
          </p>
        </div>

        {/* Imágenes de Fondo */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Imágenes de Fondo
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imagen Tema Claro */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Imagen - Tema Claro
              </label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                {config.backgroundImage?.light ? (
                  <div className="relative group">
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
                      <img 
                        src={config.backgroundImage.light} 
                        alt="Fondo tema claro"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <ManagedImageSelector
                          currentImage={config.backgroundImage.light}
                          onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.light', imageUrl)}
                          label=""
                          hideButtonArea={true}
                        />
                        <div className="text-white text-sm font-medium mt-2 pointer-events-none">
                          Cambiar Imagen
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => updateContent('featuredBlog.backgroundImage.light', '')}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-gray-400">🖼️</span>
                    </div>
                    <ManagedImageSelector
                      currentImage=""
                      onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.light', imageUrl)}
                      label="📷 Seleccionar Imagen"
                      hideButtonArea={false}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Imagen para tema claro
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Imagen Tema Oscuro */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Imagen - Tema Oscuro
              </label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                {config.backgroundImage?.dark ? (
                  <div className="relative group">
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
                      <img 
                        src={config.backgroundImage.dark} 
                        alt="Fondo tema oscuro"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <ManagedImageSelector
                          currentImage={config.backgroundImage.dark}
                          onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.dark', imageUrl)}
                          label=""
                          hideButtonArea={true}
                        />
                        <div className="text-white text-sm font-medium mt-2 pointer-events-none">
                          Cambiar Imagen
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => updateContent('featuredBlog.backgroundImage.dark', '')}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-gray-400">🌙</span>
                    </div>
                    <ManagedImageSelector
                      currentImage=""
                      onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.dark', imageUrl)}
                      label="📷 Seleccionar Imagen"
                      hideButtonArea={false}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Imagen para tema oscuro
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Recomendado: 1920x1080px para mejor calidad
          </p>
        </div>

        {/* Colores de Texto por Tema */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Colores de Texto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tema Claro */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🌞 Tema Claro
              </h4>
              
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Título
                </label>
                <input
                  type="color"
                  value={config.styles?.light?.titleColor || '#1f2937'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'titleColor', 'light', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Subtítulo
                </label>
                <input
                  type="color"
                  value={config.styles?.light?.subtitleColor || '#4b5563'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'subtitleColor', 'light', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color de la Descripción
                </label>
                <input
                  type="color"
                  value={config.styles?.light?.descriptionColor || '#6b7280'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'descriptionColor', 'light', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Tema Oscuro */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🌙 Tema Oscuro
              </h4>
              
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Título
                </label>
                <input
                  type="color"
                  value={config.styles?.dark?.titleColor || '#ffffff'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'titleColor', 'dark', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Subtítulo
                </label>
                <input
                  type="color"
                  value={config.styles?.dark?.subtitleColor || '#d1d5db'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'subtitleColor', 'dark', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color de la Descripción
                </label>
                <input
                  type="color"
                  value={config.styles?.dark?.descriptionColor || '#9ca3af'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'descriptionColor', 'dark', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Nota:</strong> Esta sección muestra automáticamente los posts marcados como "destacados" en el blog. 
            Para cambiar los colores de las tarjetas, ve a la pestaña <strong>"Diseño de Tarjetas"</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente para seleccionar icono del encabezado
interface HeaderIconSelectorProps {
  config: any;
  updateContent: (path: string, value: any) => void;
}

const HeaderIconSelector: React.FC<HeaderIconSelectorProps> = ({ config, updateContent }) => {
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  // Iconos recomendados para blog
  const recommendedIcons = [
    'Newspaper', 'BookOpen', 'FileText', 'Sparkles', 'Rocket',
    'Target', 'Zap', 'Brain', 'Award', 'Star'
  ];

  const currentIcon = config.headerIcon || 'Newspaper';
  const currentIconColor = config.headerIconColor || '#8B5CF6';

  return (
    <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        ✨ Configuración del Encabezado
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Icono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icono del Encabezado
          </label>
          
          {/* Preview y botón para abrir selector */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl border-2 border-purple-500 bg-white dark:bg-gray-800 shadow-sm">
              <DynamicIcon 
                name={currentIcon} 
                size={32} 
                color={currentIconColor}
              />
            </div>
            <div className="flex-1">
              <button
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between shadow-sm"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {AVAILABLE_SIDEBAR_ICONS.find(i => i.name === currentIcon)?.label || currentIcon}
                </span>
                {showIconPicker ? 
                  <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" /> : 
                  <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                }
              </button>
            </div>
          </div>

          {/* Iconos recomendados (siempre visibles) */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Iconos recomendados:
            </label>
            <div className="flex flex-wrap gap-2">
              {recommendedIcons.map(iconName => (
                <button
                  key={iconName}
                  onClick={() => updateContent('featuredBlog.headerIcon', iconName)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 bg-white dark:bg-gray-800 shadow-sm ${
                    currentIcon === iconName
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                  }`}
                  title={AVAILABLE_SIDEBAR_ICONS.find(i => i.name === iconName)?.label}
                >
                  <DynamicIcon name={iconName} size={20} color={currentIconColor} />
                </button>
              ))}
            </div>
          </div>

          {/* Lista completa de iconos (colapsable) */}
          {showIconPicker && (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 max-h-64 overflow-y-auto shadow-inner">
              <div className="grid grid-cols-6 gap-2">
                {AVAILABLE_SIDEBAR_ICONS.map(({ name, label }) => (
                  <button
                    key={name}
                    onClick={() => {
                      updateContent('featuredBlog.headerIcon', name);
                      setShowIconPicker(false);
                    }}
                    className={`p-2 rounded-lg border transition-all hover:scale-110 ${
                      currentIcon === name
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-900'
                    }`}
                    title={label}
                  >
                    <DynamicIcon name={name} size={18} color={currentIconColor} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configuración de Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color del Icono
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="color"
                value={currentIconColor}
                onChange={(e) => updateContent('featuredBlog.headerIconColor', e.target.value)}
                className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={currentIconColor}
                onChange={(e) => updateContent('featuredBlog.headerIconColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                placeholder="#8B5CF6"
              />
            </div>
            
            {/* Colores predefinidos */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Colores predefinidos:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { color: '#8B5CF6', label: 'Púrpura' },
                  { color: '#06B6D4', label: 'Cyan' },
                  { color: '#10B981', label: 'Verde' },
                  { color: '#F59E0B', label: 'Naranja' },
                  { color: '#EF4444', label: 'Rojo' },
                  { color: '#3B82F6', label: 'Azul' },
                  { color: '#6366F1', label: 'Índigo' },
                  { color: '#EC4899', label: 'Rosa' },
                ].map(({ color, label }) => (
                  <button
                    key={color}
                    onClick={() => updateContent('featuredBlog.headerIconColor', color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      currentIconColor === color
                        ? 'border-gray-800 dark:border-white scale-110'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    title={label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogConfigSection;
