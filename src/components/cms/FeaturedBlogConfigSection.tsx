import React, { useState } from 'react';
import { Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="featured-blog-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center">
          ✨ Sección de Webinars y Blogs
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="featured-blog-section-content" className="space-y-4">
          {/* Layout principal 2 columnas */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Columna izquierda: Textos + Tipografía + Botón (2/3) */}
            <div className="xl:col-span-2 space-y-3">

              {/* Título de la Sección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título de la Sección
                </label>
                <input
                  type="text"
                  value={config.title || 'Webinars y blogs'}
                  onChange={(e) => updateContent('featuredBlog.title', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Webinars y blogs"
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subtítulo
                </label>
                <textarea
                  value={config.subtitle || ''}
                  onChange={(e) => updateContent('featuredBlog.subtitle', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Accede a nuestros webinars y blogs..."
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={config.description || ''}
                  onChange={(e) => updateContent('featuredBlog.description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Descripción adicional..."
                />
              </div>

              {/* Botón + Cantidad de Posts en una fila */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    value={config.buttonText || 'Ver todos los artículos'}
                    onChange={(e) => updateContent('featuredBlog.buttonText', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ver todos los artículos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enlace del Botón
                  </label>
                  <input
                    type="text"
                    value={config.buttonLink || '/blog'}
                    onChange={(e) => updateContent('featuredBlog.buttonLink', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="/blog"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Posts a Mostrar
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={config.limit || 3}
                    onChange={(e) => updateContent('featuredBlog.limit', parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">1-12 posts</p>
                </div>
              </div>

              {/* Tipografía compacta */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    🅰️ Fuente Tipográfica
                  </label>
                  <select
                    value={config.fontFamily || 'Montserrat'}
                    onChange={(e) => updateContent('featuredBlog.fontFamily', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
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
                </div>
                <div className="flex-shrink-0 pt-5">
                  <span
                    className="text-base font-bold text-gray-800 dark:text-white"
                    style={{ fontFamily: config.fontFamily || 'Montserrat' }}
                  >
                    {config.title || 'Preview'}
                  </span>
                </div>
              </div>
            </div>

            {/* Columna derecha: Icono + Colores (1/3) */}
            <div className="xl:col-span-1 space-y-3">
              {/* Configuración del Encabezado (Icono) */}
              <HeaderIconSelector
                config={config}
                updateContent={updateContent}
              />

              {/* Colores de Texto por Tema */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  🎨 Colores de Texto
                </h4>

                {/* Tema Claro */}
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">🌞 Claro</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Título</label>
                      <input
                        type="color"
                        value={config.styles?.light?.titleColor || '#1f2937'}
                        onChange={(e) => updateTextStyle('featuredBlog', 'titleColor', 'light', e.target.value)}
                        className="w-full h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Subtítulo</label>
                      <input
                        type="color"
                        value={config.styles?.light?.subtitleColor || '#4b5563'}
                        onChange={(e) => updateTextStyle('featuredBlog', 'subtitleColor', 'light', e.target.value)}
                        className="w-full h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Descripción</label>
                      <input
                        type="color"
                        value={config.styles?.light?.descriptionColor || '#6b7280'}
                        onChange={(e) => updateTextStyle('featuredBlog', 'descriptionColor', 'light', e.target.value)}
                        className="w-full h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">🌙 Oscuro</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Título</label>
                      <input
                        type="color"
                        value={config.styles?.dark?.titleColor || '#ffffff'}
                        onChange={(e) => updateTextStyle('featuredBlog', 'titleColor', 'dark', e.target.value)}
                        className="w-full h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Subtítulo</label>
                      <input
                        type="color"
                        value={config.styles?.dark?.subtitleColor || '#d1d5db'}
                        onChange={(e) => updateTextStyle('featuredBlog', 'subtitleColor', 'dark', e.target.value)}
                        className="w-full h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Descripción</label>
                      <input
                        type="color"
                        value={config.styles?.dark?.descriptionColor || '#9ca3af'}
                        onChange={(e) => updateTextStyle('featuredBlog', 'descriptionColor', 'dark', e.target.value)}
                        className="w-full h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Imágenes de Fondo */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                Imágenes de Fondo
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (1920x1080px recomendado)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Imagen Tema Claro */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
                  🌞 Tema Claro
                </label>
                {config.backgroundImage?.light ? (
                  <div className="relative group">
                    <div className="w-full h-28 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
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
                        <div className="text-white text-xs font-medium mt-1 pointer-events-none">
                          Cambiar
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateContent('featuredBlog.backgroundImage.light', '')}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg text-gray-400">🖼️</span>
                    </div>
                    <ManagedImageSelector
                      currentImage=""
                      onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.light', imageUrl)}
                      label="Seleccionar Imagen"
                      hideButtonArea={false}
                    />
                  </div>
                )}
              </div>

              {/* Imagen Tema Oscuro */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
                  🌙 Tema Oscuro
                </label>
                {config.backgroundImage?.dark ? (
                  <div className="relative group">
                    <div className="w-full h-28 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
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
                        <div className="text-white text-xs font-medium mt-1 pointer-events-none">
                          Cambiar
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateContent('featuredBlog.backgroundImage.dark', '')}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg text-gray-400">🌙</span>
                    </div>
                    <ManagedImageSelector
                      currentImage=""
                      onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.dark', imageUrl)}
                      label="Seleccionar Imagen"
                      hideButtonArea={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>💡 Nota:</strong> Esta sección muestra los posts marcados como "destacados".
              Para colores de tarjetas, ve a <strong>"Diseño de Tarjetas"</strong>.
            </p>
          </div>
        </div>
      )}
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

  const recommendedIcons = [
    'Newspaper', 'BookOpen', 'FileText', 'Sparkles', 'Rocket',
    'Target', 'Zap', 'Brain', 'Award', 'Star'
  ];

  const currentIcon = config.headerIcon || 'Newspaper';
  const currentIconColor = config.headerIconColor || '#8B5CF6';

  return (
    <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-1">
        ✨ Icono del Encabezado
      </h4>

      {/* Preview + Selector en línea */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
          <DynamicIcon
            name={currentIcon}
            size={22}
            color={currentIconColor}
          />
        </div>
        <button
          onClick={() => setShowIconPicker(!showIconPicker)}
          className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between shadow-sm"
        >
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {AVAILABLE_SIDEBAR_ICONS.find(i => i.name === currentIcon)?.label || currentIcon}
          </span>
          {showIconPicker ?
            <ChevronUp size={14} className="text-gray-500 dark:text-gray-400 flex-shrink-0" /> :
            <ChevronDown size={14} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
          }
        </button>
      </div>

      {/* Iconos recomendados */}
      <div className="mb-2">
        <div className="flex flex-wrap gap-1.5">
          {recommendedIcons.map(iconName => (
            <button
              key={iconName}
              onClick={() => updateContent('featuredBlog.headerIcon', iconName)}
              className={`p-1.5 rounded-lg border transition-all hover:scale-105 bg-white dark:bg-gray-800 ${
                currentIcon === iconName
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
              }`}
              title={AVAILABLE_SIDEBAR_ICONS.find(i => i.name === iconName)?.label}
            >
              <DynamicIcon name={iconName} size={16} color={currentIconColor} />
            </button>
          ))}
        </div>
      </div>

      {/* Lista completa (colapsable) */}
      {showIconPicker && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 max-h-48 overflow-y-auto shadow-inner mb-2">
          <div className="grid grid-cols-6 gap-1.5">
            {AVAILABLE_SIDEBAR_ICONS.map(({ name, label }) => (
              <button
                key={name}
                onClick={() => {
                  updateContent('featuredBlog.headerIcon', name);
                  setShowIconPicker(false);
                }}
                className={`p-1.5 rounded-lg border transition-all hover:scale-110 ${
                  currentIcon === name
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-900'
                }`}
                title={label}
              >
                <DynamicIcon name={name} size={16} color={currentIconColor} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color del icono */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Color del Icono
        </label>
        <div className="flex gap-2 items-center mb-1.5">
          <input
            type="color"
            value={currentIconColor}
            onChange={(e) => updateContent('featuredBlog.headerIconColor', e.target.value)}
            className="w-8 h-7 rounded border border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0"
          />
          <input
            type="text"
            value={currentIconColor}
            onChange={(e) => updateContent('featuredBlog.headerIconColor', e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono"
            placeholder="#8B5CF6"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
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
              className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
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
  );
};

export default FeaturedBlogConfigSection;
