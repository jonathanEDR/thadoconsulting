/**
 * 🎯 AllNewsConfigSection
 * Configuración CMS para la sección "Todas las Noticias" del Blog
 */

import React, { useState, useRef } from 'react';
import { 
  Newspaper, 
  Layout, 
  Type,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Sun,
  Moon,
  List,
  Grid,
  Rows,
  ChevronDown
} from 'lucide-react';
import type { AllNewsConfig } from '../../hooks/blog/useBlogCmsConfig';
import { uploadImage } from '../../services/imageService';

interface AllNewsConfigSectionProps {
  config: AllNewsConfig;
  onChange: (config: AllNewsConfig) => void;
}

export const AllNewsConfigSection: React.FC<AllNewsConfigSectionProps> = ({
  config,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'imageCard' | 'textCard' | 'sidebar'>('general');
  const [isUploadingLight, setIsUploadingLight] = useState(false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const fileInputLightRef = useRef<HTMLInputElement>(null);
  const fileInputDarkRef = useRef<HTMLInputElement>(null);

  const handleChange = (path: string, value: string | number | boolean) => {
    const keys = path.split('.');
    const newConfig = { ...config };
    
    let current: Record<string, unknown> = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    
    onChange(newConfig);
  };

  // Manejar subida de imagen de fondo para tema claro
  const handleImageUploadLight = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setIsUploadingLight(true);

    try {
      const imageData = await uploadImage({
        file,
        category: 'banner',
        title: 'All News Section Background Light',
        alt: 'Fondo de sección todas las noticias - Tema claro'
      });

      if (imageData?.url) {
        handleChange('sectionBgImageLight', imageData.url);
      } else {
        throw new Error('No se recibió la URL de la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setIsUploadingLight(false);
      if (fileInputLightRef.current) {
        fileInputLightRef.current.value = '';
      }
    }
  };

  // Manejar subida de imagen de fondo para tema oscuro
  const handleImageUploadDark = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setIsUploadingDark(true);

    try {
      const imageData = await uploadImage({
        file,
        category: 'banner',
        title: 'All News Section Background Dark',
        alt: 'Fondo de sección todas las noticias - Tema oscuro'
      });

      if (imageData?.url) {
        handleChange('sectionBgImageDark', imageData.url);
      } else {
        throw new Error('No se recibió la URL de la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setIsUploadingDark(false);
      if (fileInputDarkRef.current) {
        fileInputDarkRef.current.value = '';
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Layout },
    { id: 'imageCard', label: 'Tarjeta Imagen', icon: ImageIcon },
    { id: 'textCard', label: 'Tarjeta Texto', icon: Type },
    { id: 'sidebar', label: 'Sidebar', icon: List },
  ];

  return (
    <div className="space-y-6">
      {/* Header - Clickeable para colapsar */}
      <div 
        className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Newspaper className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sección Todas las Noticias
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura el layout y estilos de la sección de noticias
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
        />
      </div>

      {/* Contenido colapsable */}
      {!isCollapsed && (
        <>
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Título y configuración básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título de la Sección
                </label>
                <input
                  type="text"
                  value={config.sectionTitle || 'Todas las Noticias'}
                  onChange={(e) => handleChange('sectionTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Posts por Página
                </label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={config.postsPerPage || 6}
                  onChange={(e) => handleChange('postsPerPage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Mostrar icono */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showIcon"
                checked={config.showIcon !== false}
                onChange={(e) => handleChange('showIcon', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <label htmlFor="showIcon" className="text-sm text-gray-700 dark:text-gray-300">
                Mostrar icono junto al título
              </label>
            </div>

            {/* Tipografía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipografía de las Tarjetas
              </label>
              <select
                value={config.fontFamily || 'Montserrat'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="Montserrat">Montserrat</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Raleway">Raleway</option>
                <option value="Nunito">Nunito</option>
                <option value="Source Sans 3">Source Sans</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Oswald">Oswald</option>
                <option value="Quicksand">Quicksand</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Se aplicará a todas las tarjetas de noticias
              </p>
            </div>

            {/* Layout Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tipo de Layout
              </label>
              <div className="flex gap-3">
                {[
                  { id: 'masonry', label: 'Masonry', icon: Grid },
                  { id: 'grid', label: 'Grid Uniforme', icon: Rows },
                  { id: 'list', label: 'Lista', icon: List }
                ].map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => handleChange('layoutType', layout.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                      (config.layoutType || 'masonry') === layout.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <layout.icon className="w-4 h-4" />
                    {layout.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores por tema */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🎨 Colores por Tema
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tema Claro */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Tema Claro
                  </h5>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Fondo:</label>
                      <input
                        type="color"
                        value={config.sectionBgColorLight || '#ffffff'}
                        onChange={(e) => handleChange('sectionBgColorLight', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.sectionBgColorLight || '#ffffff'}
                        onChange={(e) => handleChange('sectionBgColorLight', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="#ffffff"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Título:</label>
                      <input
                        type="color"
                        value={config.sectionTitleColorLight || '#fafcff'}
                        onChange={(e) => handleChange('sectionTitleColorLight', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.sectionTitleColorLight || '#fafcff'}
                        onChange={(e) => handleChange('sectionTitleColorLight', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="#fafcff"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Icono:</label>
                      <input
                        type="color"
                        value={config.sectionIconColorLight || '#dd24eb'}
                        onChange={(e) => handleChange('sectionIconColorLight', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.sectionIconColorLight || '#dd24eb'}
                        onChange={(e) => handleChange('sectionIconColorLight', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="#dd24eb"
                      />
                    </div>
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Tema Oscuro
                  </h5>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Fondo:</label>
                      <input
                        type="color"
                        value={config.sectionBgColorDark || '#0f172a'}
                        onChange={(e) => handleChange('sectionBgColorDark', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.sectionBgColorDark || '#0f172a'}
                        onChange={(e) => handleChange('sectionBgColorDark', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="#0f172a"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Título:</label>
                      <input
                        type="color"
                        value={config.sectionTitleColorDark || '#ffffff'}
                        onChange={(e) => handleChange('sectionTitleColorDark', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.sectionTitleColorDark || '#ffffff'}
                        onChange={(e) => handleChange('sectionTitleColorDark', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="#ffffff"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Icono:</label>
                      <input
                        type="color"
                        value={config.sectionIconColorDark || '#d960fb'}
                        onChange={(e) => handleChange('sectionIconColorDark', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.sectionIconColorDark || '#d960fb'}
                        onChange={(e) => handleChange('sectionIconColorDark', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="#d960fb"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen de fondo por tema */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🖼️ Imagen de Fondo por Tema
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagen tema claro */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Tema Claro
                  </h5>

                  {config.sectionBgImageLight ? (
                    <div className="relative">
                      <img
                        src={config.sectionBgImageLight}
                        alt="Fondo tema claro"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleChange('sectionBgImageLight', '')}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputLightRef.current?.click()}
                      disabled={isUploadingLight}
                      className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-400 transition-colors"
                    >
                      {isUploadingLight ? (
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500">Subir imagen</span>
                        </>
                      )}
                    </button>
                  )}

                  <input
                    ref={fileInputLightRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUploadLight}
                    className="hidden"
                  />

                  {/* Overlay para tema claro */}
                  <div className="mt-3">
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      Opacidad overlay: {config.sectionBgOverlayLight ?? 0}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.sectionBgOverlayLight ?? 0}
                      onChange={(e) => handleChange('sectionBgOverlayLight', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Imagen tema oscuro */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Tema Oscuro
                  </h5>

                  {config.sectionBgImageDark ? (
                    <div className="relative">
                      <img
                        src={config.sectionBgImageDark}
                        alt="Fondo tema oscuro"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleChange('sectionBgImageDark', '')}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputDarkRef.current?.click()}
                      disabled={isUploadingDark}
                      className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-400 transition-colors"
                    >
                      {isUploadingDark ? (
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500">Subir imagen</span>
                        </>
                      )}
                    </button>
                  )}

                  <input
                    ref={fileInputDarkRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUploadDark}
                    className="hidden"
                  />

                  {/* Overlay para tema oscuro */}
                  <div className="mt-3">
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      Opacidad overlay: {config.sectionBgOverlayDark ?? 0}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.sectionBgOverlayDark ?? 0}
                      onChange={(e) => handleChange('sectionBgOverlayDark', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración de Paginación */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                📄 Configuración de Paginación
              </h4>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Posts por página */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Posts por Página
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="12"
                      step="3"
                      value={config.postsPerPage || 6}
                      onChange={(e) => handleChange('postsPerPage', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Múltiplos de 3 para el grid</p>
                  </div>

                  {/* Estilo de paginación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estilo de Paginación
                    </label>
                    <select
                      value={config.paginationStyle || 'numbered'}
                      onChange={(e) => handleChange('paginationStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="numbered">Numerada (1, 2, 3...)</option>
                      <option value="simple">Simple (Anterior / Siguiente)</option>
                      <option value="loadMore">Cargar Más</option>
                    </select>
                  </div>
                </div>

                {/* ========== TEMA CLARO ========== */}
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    ☀️ Tema Claro
                  </h5>

                  {/* Toggle para gradiente - Tema Claro */}
                  <div className="flex items-center gap-3 mb-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.paginationLight?.activeUseGradient || false}
                        onChange={(e) => handleChange('paginationLight.activeUseGradient', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      🌈 Usar gradiente en botón activo
                    </span>
                  </div>

                  {/* Configuración de gradiente - Tema Claro */}
                  {config.paginationLight?.activeUseGradient ? (
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color inicial</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={config.paginationLight?.activeGradientFrom || '#8b5cf6'}
                              onChange={(e) => handleChange('paginationLight.activeGradientFrom', e.target.value)}
                              className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={config.paginationLight?.activeGradientFrom || '#8b5cf6'}
                              onChange={(e) => handleChange('paginationLight.activeGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color final</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={config.paginationLight?.activeGradientTo || '#06b6d4'}
                              onChange={(e) => handleChange('paginationLight.activeGradientTo', e.target.value)}
                              className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={config.paginationLight?.activeGradientTo || '#06b6d4'}
                              onChange={(e) => handleChange('paginationLight.activeGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                        <select
                          value={config.paginationLight?.activeGradientDirection || 'to-r'}
                          onChange={(e) => handleChange('paginationLight.activeGradientDirection', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="to-r">→ Izquierda a Derecha</option>
                          <option value="to-l">← Derecha a Izquierda</option>
                          <option value="to-t">↑ Abajo a Arriba</option>
                          <option value="to-b">↓ Arriba a Abajo</option>
                          <option value="to-tr">↗ Diagonal Superior Derecha</option>
                          <option value="to-br">↘ Diagonal Inferior Derecha</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Fondo Activo</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.paginationLight?.activeBg || '#8b5cf6'}
                          onChange={(e) => handleChange('paginationLight.activeBg', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={config.paginationLight?.activeBg || '#8b5cf6'}
                          onChange={(e) => handleChange('paginationLight.activeBg', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Colores restantes - Tema Claro */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Texto Activo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationLight?.activeText || '#ffffff'}
                          onChange={(e) => handleChange('paginationLight.activeText', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationLight?.activeText || '#ffffff'}
                          onChange={(e) => handleChange('paginationLight.activeText', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Fondo Inactivo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationLight?.inactiveBg || '#f3f4f6'}
                          onChange={(e) => handleChange('paginationLight.inactiveBg', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationLight?.inactiveBg || '#f3f4f6'}
                          onChange={(e) => handleChange('paginationLight.inactiveBg', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Texto Inactivo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationLight?.inactiveText || '#374151'}
                          onChange={(e) => handleChange('paginationLight.inactiveText', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationLight?.inactiveText || '#374151'}
                          onChange={(e) => handleChange('paginationLight.inactiveText', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color Borde</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationLight?.borderColor || '#d1d5db'}
                          onChange={(e) => handleChange('paginationLight.borderColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationLight?.borderColor || '#d1d5db'}
                          onChange={(e) => handleChange('paginationLight.borderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Radio del borde - Tema Claro */}
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Radio del Borde</label>
                    <input
                      type="text"
                      value={config.paginationLight?.borderRadius || '8px'}
                      onChange={(e) => handleChange('paginationLight.borderRadius', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      placeholder="8px"
                    />
                  </div>

                  {/* Preview - Tema Claro */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="px-3 py-1.5 text-sm rounded transition-colors"
                        style={{
                          backgroundColor: config.paginationLight?.inactiveBg || '#f3f4f6',
                          color: config.paginationLight?.inactiveText || '#374151',
                          borderRadius: config.paginationLight?.borderRadius || '8px',
                          border: `1px solid ${config.paginationLight?.borderColor || '#d1d5db'}`
                        }}
                      >
                        ‹ Anterior
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm font-medium rounded"
                        style={{
                          background: config.paginationLight?.activeUseGradient 
                            ? `linear-gradient(${
                                config.paginationLight?.activeGradientDirection === 'to-r' ? 'to right' :
                                config.paginationLight?.activeGradientDirection === 'to-l' ? 'to left' :
                                config.paginationLight?.activeGradientDirection === 'to-t' ? 'to top' :
                                config.paginationLight?.activeGradientDirection === 'to-b' ? 'to bottom' :
                                config.paginationLight?.activeGradientDirection === 'to-tr' ? 'to top right' :
                                'to bottom right'
                              }, ${config.paginationLight?.activeGradientFrom || '#8b5cf6'}, ${config.paginationLight?.activeGradientTo || '#06b6d4'})`
                            : config.paginationLight?.activeBg || '#8b5cf6',
                          color: config.paginationLight?.activeText || '#ffffff',
                          borderRadius: config.paginationLight?.borderRadius || '8px'
                        }}
                      >
                        1
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm rounded"
                        style={{
                          backgroundColor: config.paginationLight?.inactiveBg || '#f3f4f6',
                          color: config.paginationLight?.inactiveText || '#374151',
                          borderRadius: config.paginationLight?.borderRadius || '8px',
                          border: `1px solid ${config.paginationLight?.borderColor || '#d1d5db'}`
                        }}
                      >
                        2
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm rounded transition-colors"
                        style={{
                          backgroundColor: config.paginationLight?.inactiveBg || '#f3f4f6',
                          color: config.paginationLight?.inactiveText || '#374151',
                          borderRadius: config.paginationLight?.borderRadius || '8px',
                          border: `1px solid ${config.paginationLight?.borderColor || '#d1d5db'}`
                        }}
                      >
                        Siguiente ›
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========== TEMA OSCURO ========== */}
                <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h5 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    🌙 Tema Oscuro
                  </h5>

                  {/* Toggle para gradiente - Tema Oscuro */}
                  <div className="flex items-center gap-3 mb-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.paginationDark?.activeUseGradient || false}
                        onChange={(e) => handleChange('paginationDark.activeUseGradient', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-300">
                      🌈 Usar gradiente en botón activo
                    </span>
                  </div>

                  {/* Configuración de gradiente - Tema Oscuro */}
                  {config.paginationDark?.activeUseGradient ? (
                    <div className="p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-700 mb-4">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">Color inicial</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={config.paginationDark?.activeGradientFrom || '#8b5cf6'}
                              onChange={(e) => handleChange('paginationDark.activeGradientFrom', e.target.value)}
                              className="w-10 h-8 cursor-pointer rounded border-2 border-gray-600"
                            />
                            <input
                              type="text"
                              value={config.paginationDark?.activeGradientFrom || '#8b5cf6'}
                              onChange={(e) => handleChange('paginationDark.activeGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">Color final</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={config.paginationDark?.activeGradientTo || '#06b6d4'}
                              onChange={(e) => handleChange('paginationDark.activeGradientTo', e.target.value)}
                              className="w-10 h-8 cursor-pointer rounded border-2 border-gray-600"
                            />
                            <input
                              type="text"
                              value={config.paginationDark?.activeGradientTo || '#06b6d4'}
                              onChange={(e) => handleChange('paginationDark.activeGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Dirección</label>
                        <select
                          value={config.paginationDark?.activeGradientDirection || 'to-r'}
                          onChange={(e) => handleChange('paginationDark.activeGradientDirection', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                        >
                          <option value="to-r">→ Izquierda a Derecha</option>
                          <option value="to-l">← Derecha a Izquierda</option>
                          <option value="to-t">↑ Abajo a Arriba</option>
                          <option value="to-b">↓ Arriba a Abajo</option>
                          <option value="to-tr">↗ Diagonal Superior Derecha</option>
                          <option value="to-br">↘ Diagonal Inferior Derecha</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-300 mb-1">Fondo Activo</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.paginationDark?.activeBg || '#8b5cf6'}
                          onChange={(e) => handleChange('paginationDark.activeBg', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border-2 border-gray-600"
                        />
                        <input
                          type="text"
                          value={config.paginationDark?.activeBg || '#8b5cf6'}
                          onChange={(e) => handleChange('paginationDark.activeBg', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Colores restantes - Tema Oscuro */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Texto Activo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationDark?.activeText || '#ffffff'}
                          onChange={(e) => handleChange('paginationDark.activeText', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationDark?.activeText || '#ffffff'}
                          onChange={(e) => handleChange('paginationDark.activeText', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Fondo Inactivo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationDark?.inactiveBg || '#1f2937'}
                          onChange={(e) => handleChange('paginationDark.inactiveBg', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationDark?.inactiveBg || '#1f2937'}
                          onChange={(e) => handleChange('paginationDark.inactiveBg', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Texto Inactivo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationDark?.inactiveText || '#9ca3af'}
                          onChange={(e) => handleChange('paginationDark.inactiveText', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationDark?.inactiveText || '#9ca3af'}
                          onChange={(e) => handleChange('paginationDark.inactiveText', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Borde</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.paginationDark?.borderColor || '#374151'}
                          onChange={(e) => handleChange('paginationDark.borderColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.paginationDark?.borderColor || '#374151'}
                          onChange={(e) => handleChange('paginationDark.borderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Radio del borde - Tema Oscuro */}
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Radio del Borde</label>
                    <input
                      type="text"
                      value={config.paginationDark?.borderRadius || '8px'}
                      onChange={(e) => handleChange('paginationDark.borderRadius', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                      placeholder="8px"
                    />
                  </div>

                  {/* Preview - Tema Oscuro */}
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="px-3 py-1.5 text-sm rounded transition-colors"
                        style={{
                          backgroundColor: config.paginationDark?.inactiveBg || '#1f2937',
                          color: config.paginationDark?.inactiveText || '#9ca3af',
                          borderRadius: config.paginationDark?.borderRadius || '8px',
                          border: `1px solid ${config.paginationDark?.borderColor || '#374151'}`
                        }}
                      >
                        ‹ Anterior
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm font-medium rounded"
                        style={{
                          background: config.paginationDark?.activeUseGradient 
                            ? `linear-gradient(${
                                config.paginationDark?.activeGradientDirection === 'to-r' ? 'to right' :
                                config.paginationDark?.activeGradientDirection === 'to-l' ? 'to left' :
                                config.paginationDark?.activeGradientDirection === 'to-t' ? 'to top' :
                                config.paginationDark?.activeGradientDirection === 'to-b' ? 'to bottom' :
                                config.paginationDark?.activeGradientDirection === 'to-tr' ? 'to top right' :
                                'to bottom right'
                              }, ${config.paginationDark?.activeGradientFrom || '#8b5cf6'}, ${config.paginationDark?.activeGradientTo || '#06b6d4'})`
                            : config.paginationDark?.activeBg || '#8b5cf6',
                          color: config.paginationDark?.activeText || '#ffffff',
                          borderRadius: config.paginationDark?.borderRadius || '8px'
                        }}
                      >
                        1
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm rounded"
                        style={{
                          backgroundColor: config.paginationDark?.inactiveBg || '#1f2937',
                          color: config.paginationDark?.inactiveText || '#9ca3af',
                          borderRadius: config.paginationDark?.borderRadius || '8px',
                          border: `1px solid ${config.paginationDark?.borderColor || '#374151'}`
                        }}
                      >
                        2
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm rounded transition-colors"
                        style={{
                          backgroundColor: config.paginationDark?.inactiveBg || '#1f2937',
                          color: config.paginationDark?.inactiveText || '#9ca3af',
                          borderRadius: config.paginationDark?.borderRadius || '8px',
                          border: `1px solid ${config.paginationDark?.borderColor || '#374151'}`
                        }}
                      >
                        Siguiente ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Card Tab */}
        {activeTab === 'imageCard' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura los estilos de las tarjetas con imagen de fondo (laterales del grid)
            </p>

            {/* Preview */}
            <div 
              className="relative h-48 rounded-xl overflow-hidden bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600)',
                borderRadius: config.imageCard?.borderRadius || '16px',
                height: config.imageCard?.cardHeight || '200px'
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${config.imageCard?.overlayColor || 'rgba(0,0,0,0.9)'} 0%, ${config.imageCard?.overlayColor || 'rgba(0,0,0,0.5)'} 50%, transparent 100%)`
                }}
              />
              <div 
                className={`absolute top-4 ${
                  config.imageCard?.categoryPosition === 'left' 
                    ? 'left-4' 
                    : config.imageCard?.categoryPosition === 'right' 
                      ? 'right-4' 
                      : 'left-1/2 -translate-x-1/2'
                }`}
              >
                <span 
                  className="px-4 py-1 text-sm font-semibold rounded-full"
                  style={{
                    backgroundColor: config.imageCard?.categoryBgColor || '#8b5cf6',
                    color: config.imageCard?.categoryTextColor || '#ffffff'
                  }}
                >
                  Tecnología
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 
                  className="text-lg font-bold mb-2"
                  style={{ color: config.imageCard?.titleColor || '#ffffff' }}
                >
                  Título del artículo de ejemplo
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <div>
                    <p 
                      className="text-xs font-medium"
                      style={{ color: config.imageCard?.authorNameColor || '#ffffff' }}
                    >
                      Nombre del Autor
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: config.imageCard?.authorDateColor || '#9ca3af' }}
                    >
                      15 Ene 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color del Overlay
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.imageCard?.overlayColor?.replace('rgba(0,0,0,', '').replace(')', '') || '#000000'}
                    onChange={(e) => handleChange('imageCard.overlayColor', `${e.target.value}`)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.imageCard?.overlayColor || 'rgba(0,0,0,0.7)'}
                    onChange={(e) => handleChange('imageCard.overlayColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color del Título
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.imageCard?.titleColor || '#ffffff'}
                    onChange={(e) => handleChange('imageCard.titleColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.imageCard?.titleColor || '#ffffff'}
                    onChange={(e) => handleChange('imageCard.titleColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Fondo Categoría
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.imageCard?.categoryBgColor || '#8b5cf6'}
                    onChange={(e) => handleChange('imageCard.categoryBgColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.imageCard?.categoryBgColor || '#8b5cf6'}
                    onChange={(e) => handleChange('imageCard.categoryBgColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Texto Categoría
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.imageCard?.categoryTextColor || '#ffffff'}
                    onChange={(e) => handleChange('imageCard.categoryTextColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.imageCard?.categoryTextColor || '#ffffff'}
                    onChange={(e) => handleChange('imageCard.categoryTextColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Posición Categoría
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('imageCard.categoryPosition', 'left')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      config.imageCard?.categoryPosition === 'left'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Izquierda
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('imageCard.categoryPosition', 'center')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      (!config.imageCard?.categoryPosition || config.imageCard?.categoryPosition === 'center')
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Centro
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('imageCard.categoryPosition', 'right')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      config.imageCard?.categoryPosition === 'right'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Derecha
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Nombre Autor
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.imageCard?.authorNameColor || '#ffffff'}
                    onChange={(e) => handleChange('imageCard.authorNameColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.imageCard?.authorNameColor || '#ffffff'}
                    onChange={(e) => handleChange('imageCard.authorNameColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Fecha
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.imageCard?.authorDateColor || '#9ca3af'}
                    onChange={(e) => handleChange('imageCard.authorDateColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.imageCard?.authorDateColor || '#9ca3af'}
                    onChange={(e) => handleChange('imageCard.authorDateColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Border Radius
                </label>
                <input
                  type="text"
                  value={config.imageCard?.borderRadius || '16px'}
                  onChange={(e) => handleChange('imageCard.borderRadius', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="16px"
                />
              </div>
            </div>

            {/* Sección de Tamaño de Tarjeta */}
            <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                📐 Tamaño de Tarjeta
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alto de Tarjeta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alto de Tarjeta
                  </label>
                  <div className="space-y-2">
                    {/* Opciones predefinidas */}
                    <div className="flex flex-wrap gap-2">
                      {['280px', '320px', '360px', '400px', '450px', '500px'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleChange('imageCard.cardHeight', size)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                            config.imageCard?.cardHeight === size
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {/* Input personalizado */}
                    <input
                      type="text"
                      value={config.imageCard?.cardHeight || '400px'}
                      onChange={(e) => handleChange('imageCard.cardHeight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      placeholder="400px o auto"
                    />
                    {/* Slider para ajuste fino */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">200px</span>
                      <input
                        type="range"
                        min="200"
                        max="600"
                        value={parseInt(config.imageCard?.cardHeight || '400') || 400}
                        onChange={(e) => handleChange('imageCard.cardHeight', `${e.target.value}px`)}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">600px</span>
                    </div>
                  </div>
                </div>

                {/* Ancho de Tarjeta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ancho de Tarjeta
                  </label>
                  <div className="space-y-2">
                    {/* Opciones predefinidas */}
                    <div className="flex flex-wrap gap-2">
                      {['100%', '280px', '320px', '360px', '400px', 'auto'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleChange('imageCard.cardWidth', size)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                            (config.imageCard?.cardWidth || '100%') === size
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {/* Input personalizado */}
                    <input
                      type="text"
                      value={config.imageCard?.cardWidth || '100%'}
                      onChange={(e) => handleChange('imageCard.cardWidth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      placeholder="100% o 320px"
                    />
                  </div>
                </div>
              </div>

              {/* Aspect Ratio (nuevo) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aspecto de Tarjeta (Proporción)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Cuadrada (1:1)', value: 'square' },
                    { label: 'Horizontal (4:3)', value: 'landscape' },
                    { label: 'Vertical (3:4)', value: 'portrait' },
                    { label: 'Ancha (16:9)', value: 'wide' },
                    { label: 'Personalizado', value: 'custom' }
                  ].map((aspect) => (
                    <button
                      key={aspect.value}
                      type="button"
                      onClick={() => {
                        if (aspect.value === 'square') {
                          handleChange('imageCard.cardHeight', '320px');
                          handleChange('imageCard.cardWidth', '320px');
                        } else if (aspect.value === 'landscape') {
                          handleChange('imageCard.cardHeight', '280px');
                          handleChange('imageCard.cardWidth', '100%');
                        } else if (aspect.value === 'portrait') {
                          handleChange('imageCard.cardHeight', '450px');
                          handleChange('imageCard.cardWidth', '100%');
                        } else if (aspect.value === 'wide') {
                          handleChange('imageCard.cardHeight', '240px');
                          handleChange('imageCard.cardWidth', '100%');
                        }
                        handleChange('imageCard.aspectRatio', aspect.value);
                      }}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                        config.imageCard?.aspectRatio === aspect.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {aspect.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Text Card Tab */}
        {activeTab === 'textCard' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura los estilos de las tarjetas de solo texto (centro del grid)
            </p>

            {/* Preview */}
            <div 
              className="p-6 rounded-xl"
              style={{ 
                backgroundColor: config.textCard?.bgTransparent ? 'transparent' : (config.textCard?.bgColor || '#1e1b4b'),
                borderRadius: config.textCard?.borderRadius || '16px',
                border: config.textCard?.bgTransparent ? '2px dashed #6b7280' : 'none'
              }}
            >
              <h4 
                className="text-xl font-bold mb-3"
                style={config.textCard?.titleUseGradient ? {
                  background: `linear-gradient(${
                    config.textCard?.titleGradientDirection === 'to-r' ? 'to right' :
                    config.textCard?.titleGradientDirection === 'to-l' ? 'to left' :
                    config.textCard?.titleGradientDirection === 'to-t' ? 'to top' :
                    config.textCard?.titleGradientDirection === 'to-b' ? 'to bottom' :
                    config.textCard?.titleGradientDirection === 'to-tr' ? 'to top right' :
                    config.textCard?.titleGradientDirection === 'to-tl' ? 'to top left' :
                    config.textCard?.titleGradientDirection === 'to-br' ? 'to bottom right' :
                    'to bottom left'
                  }, ${config.textCard?.titleGradientFrom || '#00ffff'}, ${config.textCard?.titleGradientTo || '#ff00ff'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                } : { color: config.textCard?.titleColor || '#ffffff' }}
              >
                Título del artículo destacado
              </h4>
              <p 
                className="text-sm mb-4 line-clamp-3"
                style={{ color: config.textCard?.excerptColor || '#d1d5db' }}
              >
                Este es un extracto de ejemplo que muestra cómo se verá el contenido del artículo en la tarjeta de solo texto...
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span 
                  className="px-3 py-1 text-xs rounded"
                  style={{
                    backgroundColor: config.textCard?.tagBgColor || 'rgba(139, 92, 246, 0.3)',
                    color: config.textCard?.tagTextColor || '#c4b5fd'
                  }}
                >
                  Tag 1
                </span>
                <span 
                  className="px-3 py-1 text-xs rounded"
                  style={{
                    backgroundColor: config.textCard?.tagBgColor || 'rgba(139, 92, 246, 0.3)',
                    color: config.textCard?.tagTextColor || '#c4b5fd'
                  }}
                >
                  Tag 2
                </span>
              </div>
              {/* Preview del botón con gradientes */}
              <div className="flex justify-start">
                {config.textCard?.buttonBorderUseGradient && config.textCard?.buttonBgTransparent ? (
                  <div 
                    className="inline-block rounded-full"
                    style={{
                      background: `linear-gradient(${
                        config.textCard?.buttonBorderGradientDirection === 'to-r' ? 'to right' :
                        config.textCard?.buttonBorderGradientDirection === 'to-l' ? 'to left' :
                        config.textCard?.buttonBorderGradientDirection === 'to-t' ? 'to top' :
                        config.textCard?.buttonBorderGradientDirection === 'to-b' ? 'to bottom' :
                        config.textCard?.buttonBorderGradientDirection === 'to-tr' ? 'to top right' :
                        config.textCard?.buttonBorderGradientDirection === 'to-tl' ? 'to top left' :
                        config.textCard?.buttonBorderGradientDirection === 'to-br' ? 'to bottom right' :
                        'to bottom left'
                      }, ${config.textCard?.buttonBorderGradientFrom || '#00ffff'}, ${config.textCard?.buttonBorderGradientTo || '#ff00ff'})`,
                      padding: `${config.textCard?.buttonBorderWidth || 2}px`
                    }}
                  >
                    <button
                      className="px-6 py-2 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: config.textCard?.bgTransparent ? 'rgba(0,0,0,0.8)' : (config.textCard?.bgColor || '#1e1b4b') }}
                    >
                      <span
                        style={config.textCard?.buttonTextUseGradient ? {
                          background: `linear-gradient(${
                            config.textCard?.buttonTextGradientDirection === 'to-r' ? 'to right' :
                            config.textCard?.buttonTextGradientDirection === 'to-l' ? 'to left' :
                            config.textCard?.buttonTextGradientDirection === 'to-t' ? 'to top' :
                            config.textCard?.buttonTextGradientDirection === 'to-b' ? 'to bottom' :
                            config.textCard?.buttonTextGradientDirection === 'to-tr' ? 'to top right' :
                            config.textCard?.buttonTextGradientDirection === 'to-tl' ? 'to top left' :
                            config.textCard?.buttonTextGradientDirection === 'to-br' ? 'to bottom right' :
                            'to bottom left'
                          }, ${config.textCard?.buttonTextGradientFrom || '#00ffff'}, ${config.textCard?.buttonTextGradientTo || '#ff00ff'})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        } : { color: config.textCard?.buttonTextColor || '#ffffff' }}
                      >
                        {config.textCard?.buttonText || 'Ver más'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    className="px-6 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: (() => {
                        if (config.textCard?.buttonBorderUseGradient && !config.textCard?.buttonBgTransparent) {
                          const bgColor = config.textCard?.buttonBgColor || '#1e1b4b';
                          const gradientDirection = config.textCard?.buttonBorderGradientDirection === 'to-r' ? 'to right' :
                            config.textCard?.buttonBorderGradientDirection === 'to-l' ? 'to left' :
                            config.textCard?.buttonBorderGradientDirection === 'to-t' ? 'to top' :
                            config.textCard?.buttonBorderGradientDirection === 'to-b' ? 'to bottom' :
                            config.textCard?.buttonBorderGradientDirection === 'to-tr' ? 'to top right' :
                            config.textCard?.buttonBorderGradientDirection === 'to-tl' ? 'to top left' :
                            config.textCard?.buttonBorderGradientDirection === 'to-br' ? 'to bottom right' :
                            'to bottom left';
                          return `linear-gradient(${bgColor}, ${bgColor}) padding-box, linear-gradient(${gradientDirection}, ${config.textCard?.buttonBorderGradientFrom || '#00ffff'}, ${config.textCard?.buttonBorderGradientTo || '#ff00ff'}) border-box`;
                        }
                        if (config.textCard?.buttonUseGradient && !config.textCard?.buttonBgTransparent) {
                          const gradientDirection = config.textCard?.buttonGradientDirection === 'to-r' ? 'to right' :
                            config.textCard?.buttonGradientDirection === 'to-l' ? 'to left' :
                            config.textCard?.buttonGradientDirection === 'to-t' ? 'to top' :
                            config.textCard?.buttonGradientDirection === 'to-b' ? 'to bottom' :
                            config.textCard?.buttonGradientDirection === 'to-tr' ? 'to top right' :
                            config.textCard?.buttonGradientDirection === 'to-tl' ? 'to top left' :
                            config.textCard?.buttonGradientDirection === 'to-br' ? 'to bottom right' :
                            'to bottom left';
                          return `linear-gradient(${gradientDirection}, ${config.textCard?.buttonGradientFrom || '#3b82f6'}, ${config.textCard?.buttonGradientTo || '#8b5cf6'})`;
                        }
                        if (config.textCard?.buttonBgTransparent) {
                          return 'transparent';
                        }
                        return config.textCard?.buttonBgColor || 'transparent';
                      })(),
                      border: config.textCard?.buttonBorderUseGradient 
                        ? `${config.textCard?.buttonBorderWidth || 2}px solid transparent`
                        : `${config.textCard?.buttonBorderWidth || 2}px solid ${config.textCard?.buttonBorderColor || '#ffffff'}`,
                    }}
                  >
                    <span
                      style={config.textCard?.buttonTextUseGradient ? {
                        background: `linear-gradient(${
                          config.textCard?.buttonTextGradientDirection === 'to-r' ? 'to right' :
                          config.textCard?.buttonTextGradientDirection === 'to-l' ? 'to left' :
                          config.textCard?.buttonTextGradientDirection === 'to-t' ? 'to top' :
                          config.textCard?.buttonTextGradientDirection === 'to-b' ? 'to bottom' :
                          config.textCard?.buttonTextGradientDirection === 'to-tr' ? 'to top right' :
                          config.textCard?.buttonTextGradientDirection === 'to-tl' ? 'to top left' :
                          config.textCard?.buttonTextGradientDirection === 'to-br' ? 'to bottom right' :
                          'to bottom left'
                        }, ${config.textCard?.buttonTextGradientFrom || '#00ffff'}, ${config.textCard?.buttonTextGradientTo || '#ff00ff'})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      } : { color: config.textCard?.buttonTextColor || '#ffffff' }}
                    >
                      {config.textCard?.buttonText || 'Ver más'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Sección: Fondo de la Tarjeta */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                🎨 Fondo de la Tarjeta
              </h4>
              
              {/* Toggle Fondo Transparente */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.textCard?.bgTransparent || false}
                    onChange={(e) => handleChange('textCard.bgTransparent', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
                <span className="text-sm text-gray-700 dark:text-gray-300">Fondo Transparente</span>
              </div>

              {/* Color de Fondo (solo si no es transparente) */}
              {!config.textCard?.bgTransparent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color de Fondo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textCard?.bgColor || '#1e1b4b'}
                      onChange={(e) => handleChange('textCard.bgColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.textCard?.bgColor || '#1e1b4b'}
                      onChange={(e) => handleChange('textCard.bgColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sección: Título con Gradiente */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                📝 Color del Título
              </h4>
              
              {/* Toggle Gradiente */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.textCard?.titleUseGradient || false}
                    onChange={(e) => handleChange('textCard.titleUseGradient', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
                <span className="text-sm text-gray-700 dark:text-gray-300">Usar Gradiente</span>
              </div>

              {config.textCard?.titleUseGradient ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color Inicio</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.textCard?.titleGradientFrom || '#00ffff'}
                        onChange={(e) => handleChange('textCard.titleGradientFrom', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.textCard?.titleGradientFrom || '#00ffff'}
                        onChange={(e) => handleChange('textCard.titleGradientFrom', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color Fin</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.textCard?.titleGradientTo || '#ff00ff'}
                        onChange={(e) => handleChange('textCard.titleGradientTo', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.textCard?.titleGradientTo || '#ff00ff'}
                        onChange={(e) => handleChange('textCard.titleGradientTo', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Dirección</label>
                    <select
                      value={config.textCard?.titleGradientDirection || 'to-r'}
                      onChange={(e) => handleChange('textCard.titleGradientDirection', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-tr">↗ Diagonal Superior</option>
                      <option value="to-br">↘ Diagonal Inferior</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del Título
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textCard?.titleColor || '#ffffff'}
                      onChange={(e) => handleChange('textCard.titleColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.textCard?.titleColor || '#ffffff'}
                      onChange={(e) => handleChange('textCard.titleColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sección: Extracto y Tags */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                📄 Extracto y Tags
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del Extracto
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textCard?.excerptColor || '#d1d5db'}
                      onChange={(e) => handleChange('textCard.excerptColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.textCard?.excerptColor || '#d1d5db'}
                      onChange={(e) => handleChange('textCard.excerptColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Fondo Tags
                  </label>
                  <input
                    type="text"
                    value={config.textCard?.tagBgColor || 'rgba(139, 92, 246, 0.3)'}
                    onChange={(e) => handleChange('textCard.tagBgColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Texto Tags
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textCard?.tagTextColor || '#c4b5fd'}
                      onChange={(e) => handleChange('textCard.tagTextColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.textCard?.tagTextColor || '#c4b5fd'}
                      onChange={(e) => handleChange('textCard.tagTextColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Configuración del Botón */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
              <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                🔘 Configuración del Botón
              </h4>
              
              {/* Texto del botón */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={config.textCard?.buttonText || 'Ver más'}
                  onChange={(e) => handleChange('textCard.buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Sub-sección: Fondo del Botón */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg space-y-3">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Fondo del Botón</h5>
                
                {/* Toggle Transparente */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.textCard?.buttonBgTransparent || false}
                      onChange={(e) => handleChange('textCard.buttonBgTransparent', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Transparente</span>
                </div>

                {!config.textCard?.buttonBgTransparent && (
                  <>
                    {/* Toggle Gradiente */}
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.textCard?.buttonUseGradient || false}
                          onChange={(e) => handleChange('textCard.buttonUseGradient', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Usar Gradiente</span>
                    </div>

                    {config.textCard?.buttonUseGradient ? (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Inicio</label>
                          <div className="flex items-center gap-1">
                            <input type="color" value={config.textCard?.buttonGradientFrom || '#3b82f6'} onChange={(e) => handleChange('textCard.buttonGradientFrom', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                            <input type="text" value={config.textCard?.buttonGradientFrom || '#3b82f6'} onChange={(e) => handleChange('textCard.buttonGradientFrom', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Fin</label>
                          <div className="flex items-center gap-1">
                            <input type="color" value={config.textCard?.buttonGradientTo || '#8b5cf6'} onChange={(e) => handleChange('textCard.buttonGradientTo', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                            <input type="text" value={config.textCard?.buttonGradientTo || '#8b5cf6'} onChange={(e) => handleChange('textCard.buttonGradientTo', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                          <select value={config.textCard?.buttonGradientDirection || 'to-r'} onChange={(e) => handleChange('textCard.buttonGradientDirection', e.target.value)} className="w-full px-1 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="to-r">→</option>
                            <option value="to-l">←</option>
                            <option value="to-t">↑</option>
                            <option value="to-b">↓</option>
                            <option value="to-tr">↗</option>
                            <option value="to-br">↘</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Color de Fondo</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={config.textCard?.buttonBgColor || '#1e1b4b'} onChange={(e) => handleChange('textCard.buttonBgColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                          <input type="text" value={config.textCard?.buttonBgColor || '#1e1b4b'} onChange={(e) => handleChange('textCard.buttonBgColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Sub-sección: Texto del Botón */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg space-y-3">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Texto del Botón</h5>
                
                {/* Toggle Gradiente */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.textCard?.buttonTextUseGradient || false}
                      onChange={(e) => handleChange('textCard.buttonTextUseGradient', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Usar Gradiente</span>
                </div>

                {config.textCard?.buttonTextUseGradient ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Inicio</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.textCard?.buttonTextGradientFrom || '#00ffff'} onChange={(e) => handleChange('textCard.buttonTextGradientFrom', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.textCard?.buttonTextGradientFrom || '#00ffff'} onChange={(e) => handleChange('textCard.buttonTextGradientFrom', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fin</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.textCard?.buttonTextGradientTo || '#ff00ff'} onChange={(e) => handleChange('textCard.buttonTextGradientTo', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.textCard?.buttonTextGradientTo || '#ff00ff'} onChange={(e) => handleChange('textCard.buttonTextGradientTo', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                      <select value={config.textCard?.buttonTextGradientDirection || 'to-r'} onChange={(e) => handleChange('textCard.buttonTextGradientDirection', e.target.value)} className="w-full px-1 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="to-r">→</option>
                        <option value="to-l">←</option>
                        <option value="to-t">↑</option>
                        <option value="to-b">↓</option>
                        <option value="to-tr">↗</option>
                        <option value="to-br">↘</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Color del Texto</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.textCard?.buttonTextColor || '#ffffff'} onChange={(e) => handleChange('textCard.buttonTextColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <input type="text" value={config.textCard?.buttonTextColor || '#ffffff'} onChange={(e) => handleChange('textCard.buttonTextColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-sección: Borde del Botón */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg space-y-3">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Borde del Botón</h5>
                
                {/* Toggle Gradiente */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.textCard?.buttonBorderUseGradient || false}
                      onChange={(e) => handleChange('textCard.buttonBorderUseGradient', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Usar Gradiente</span>
                </div>

                {/* Ancho del borde */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ancho del Borde (px)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={config.textCard?.buttonBorderWidth || 2}
                    onChange={(e) => handleChange('textCard.buttonBorderWidth', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {config.textCard?.buttonBorderUseGradient ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Inicio</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.textCard?.buttonBorderGradientFrom || '#00ffff'} onChange={(e) => handleChange('textCard.buttonBorderGradientFrom', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.textCard?.buttonBorderGradientFrom || '#00ffff'} onChange={(e) => handleChange('textCard.buttonBorderGradientFrom', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fin</label>
                      <div className="flex items-center gap-1">
                        <input type="color" value={config.textCard?.buttonBorderGradientTo || '#ff00ff'} onChange={(e) => handleChange('textCard.buttonBorderGradientTo', e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={config.textCard?.buttonBorderGradientTo || '#ff00ff'} onChange={(e) => handleChange('textCard.buttonBorderGradientTo', e.target.value)} className="flex-1 px-1 py-0.5 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                      <select value={config.textCard?.buttonBorderGradientDirection || 'to-r'} onChange={(e) => handleChange('textCard.buttonBorderGradientDirection', e.target.value)} className="w-full px-1 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="to-r">→</option>
                        <option value="to-l">←</option>
                        <option value="to-t">↑</option>
                        <option value="to-b">↓</option>
                        <option value="to-tr">↗</option>
                        <option value="to-br">↘</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Color del Borde</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.textCard?.buttonBorderColor || '#ffffff'} onChange={(e) => handleChange('textCard.buttonBorderColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <input type="text" value={config.textCard?.buttonBorderColor || '#ffffff'} onChange={(e) => handleChange('textCard.buttonBorderColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sección: Border Radius */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Border Radius de la Tarjeta
                </label>
                <input
                  type="text"
                  value={config.textCard?.borderRadius || '16px'}
                  onChange={(e) => handleChange('textCard.borderRadius', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="16px"
                />
              </div>
            </div>

            {/* Sección de Tamaño de Tarjeta Texto */}
            <div className="p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
              <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-4 flex items-center gap-2">
                📐 Tamaño de Tarjeta de Texto
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alto de Tarjeta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alto de Tarjeta
                  </label>
                  <div className="space-y-2">
                    {/* Opciones predefinidas */}
                    <div className="flex flex-wrap gap-2">
                      {['auto', '280px', '320px', '360px', '400px', '450px'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleChange('textCard.cardHeight', size)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                            (config.textCard?.cardHeight || 'auto') === size
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {/* Input personalizado */}
                    <input
                      type="text"
                      value={config.textCard?.cardHeight || 'auto'}
                      onChange={(e) => handleChange('textCard.cardHeight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      placeholder="auto o 320px"
                    />
                  </div>
                </div>

                {/* Ancho de Tarjeta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ancho de Tarjeta
                  </label>
                  <div className="space-y-2">
                    {/* Opciones predefinidas */}
                    <div className="flex flex-wrap gap-2">
                      {['100%', '280px', '320px', '360px', '400px', 'auto'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleChange('textCard.cardWidth', size)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                            (config.textCard?.cardWidth || '100%') === size
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {/* Input personalizado */}
                    <input
                      type="text"
                      value={config.textCard?.cardWidth || '100%'}
                      onChange={(e) => handleChange('textCard.cardWidth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      placeholder="100% o 320px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Tab */}
        {activeTab === 'sidebar' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura los estilos del sidebar (categorías y tags)
            </p>

            {/* Configuración de Tipografía y Contenedor */}
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ✏️ Tipografía y Contenedor
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipografía */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Tipografía
                  </label>
                  <select
                    value={config.sidebar?.fontFamily || 'Montserrat'}
                    onChange={(e) => handleChange('sidebar.fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="Montserrat">Montserrat</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Raleway">Raleway</option>
                    <option value="Nunito">Nunito</option>
                  </select>
                </div>

                {/* Border Width */}
                <div className={config.sidebar?.showBorder === false ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Ancho Borde (px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={config.sidebar?.borderWidth ?? 1}
                    onChange={(e) => handleChange('sidebar.borderWidth', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                {/* Border Color Light */}
                <div className={config.sidebar?.showBorder === false ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Borde (Claro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.borderColorLight || '#e5e7eb'}
                      onChange={(e) => handleChange('sidebar.borderColorLight', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.borderColorLight || '#e5e7eb'}
                      onChange={(e) => handleChange('sidebar.borderColorLight', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Border Color Dark */}
                <div className={config.sidebar?.showBorder === false ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Borde (Oscuro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.borderColorDark || '#374151'}
                      onChange={(e) => handleChange('sidebar.borderColorDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.borderColorDark || '#374151'}
                      onChange={(e) => handleChange('sidebar.borderColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Border Radius */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Border Radius
                  </label>
                  <input
                    type="text"
                    value={config.sidebar?.borderRadius || '12px'}
                    onChange={(e) => handleChange('sidebar.borderRadius', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="12px"
                  />
                </div>

                {/* Padding */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Padding Interior
                  </label>
                  <input
                    type="text"
                    value={config.sidebar?.padding || '16px'}
                    onChange={(e) => handleChange('sidebar.padding', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="16px"
                  />
                </div>

                {/* Fondo Transparente Toggle */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Fondo Transparente
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.sidebar?.transparentBg || false}
                      onChange={(e) => handleChange('sidebar.transparentBg', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-xs text-gray-600 dark:text-gray-400">
                      {config.sidebar?.transparentBg ? 'Activado' : 'Desactivado'}
                    </span>
                  </label>
                </div>

                {/* Mostrar Borde Toggle */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Mostrar Borde
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.sidebar?.showBorder !== false}
                      onChange={(e) => handleChange('sidebar.showBorder', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-xs text-gray-600 dark:text-gray-400">
                      {config.sidebar?.showBorder !== false ? 'Activado' : 'Desactivado'}
                    </span>
                  </label>
                </div>

                {/* Fondo del Sidebar */}
                <div className={config.sidebar?.transparentBg ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Fondo (Claro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.bgColorLight || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.bgColorLight', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.bgColorLight || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.bgColorLight', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={config.sidebar?.transparentBg ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Fondo (Oscuro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.bgColorDark || '#1f2937'}
                      onChange={(e) => handleChange('sidebar.bgColorDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.bgColorDark || '#1f2937'}
                      onChange={(e) => handleChange('sidebar.bgColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview del sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview Categorías */}
              <div 
                className="p-4"
                style={{
                  fontFamily: `'${config.sidebar?.fontFamily || 'Montserrat'}', sans-serif`,
                  border: `${config.sidebar?.borderWidth ?? 1}px solid ${config.sidebar?.borderColorLight || '#e5e7eb'}`,
                  borderRadius: config.sidebar?.borderRadius || '12px',
                  padding: config.sidebar?.padding || '16px',
                  backgroundColor: config.sidebar?.bgColorLight || '#ffffff'
                }}
              >
                <h4 
                  className="text-sm font-bold mb-3 uppercase tracking-wider"
                  style={{ color: config.sidebar?.categoriesTitleColor || '#111827' }}
                >
                  Categorías
                </h4>
                <div className="space-y-1">
                  <div 
                    className="flex items-center gap-2 py-1 px-2 rounded text-sm font-semibold"
                    style={{ 
                      color: config.sidebar?.categoryHoverColor || '#2563eb',
                      backgroundColor: `${config.sidebar?.categoryHoverColor || '#2563eb'}15`
                    }}
                  >
                    → Todas
                  </div>
                  <div 
                    className="flex items-center gap-2 py-1 px-2 rounded text-sm"
                    style={{ color: config.sidebar?.categoryItemColor || '#4b5563' }}
                  >
                    → Tecnología
                  </div>
                  <div 
                    className="flex items-center gap-2 py-1 px-2 rounded text-sm"
                    style={{ color: config.sidebar?.categoryItemColor || '#4b5563' }}
                  >
                    → Desarrollo
                  </div>
                </div>
              </div>

              {/* Preview Tags */}
              <div 
                className="p-4"
                style={{
                  fontFamily: `'${config.sidebar?.fontFamily || 'Montserrat'}', sans-serif`,
                  border: `${config.sidebar?.borderWidth ?? 1}px solid ${config.sidebar?.borderColorLight || '#e5e7eb'}`,
                  borderRadius: config.sidebar?.borderRadius || '12px',
                  padding: config.sidebar?.padding || '16px',
                  backgroundColor: config.sidebar?.bgColorLight || '#ffffff'
                }}
              >
                <h4 
                  className="text-sm font-bold mb-3 uppercase tracking-wider"
                  style={{ color: config.sidebar?.tagsTitleColor || '#111827' }}
                >
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span 
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: config.sidebar?.tagActiveBgColor || '#2563eb',
                      color: config.sidebar?.tagActiveTextColor || '#ffffff'
                    }}
                  >
                    All
                  </span>
                  <span 
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: config.sidebar?.tagBgColor || '#e5e7eb',
                      color: config.sidebar?.tagTextColor || '#4b5563'
                    }}
                  >
                    React
                  </span>
                  <span 
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: config.sidebar?.tagBgColor || '#e5e7eb',
                      color: config.sidebar?.tagTextColor || '#4b5563'
                    }}
                  >
                    Node.js
                  </span>
                </div>
              </div>
            </div>

            {/* Configuración Categorías */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Categorías
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Título (Claro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.categoriesTitleColor || '#111827'}
                      onChange={(e) => handleChange('sidebar.categoriesTitleColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.categoriesTitleColor || '#111827'}
                      onChange={(e) => handleChange('sidebar.categoriesTitleColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Título (Oscuro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.categoriesTitleColorDark || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.categoriesTitleColorDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.categoriesTitleColorDark || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.categoriesTitleColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Item (Claro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.categoryItemColor || '#4b5563'}
                      onChange={(e) => handleChange('sidebar.categoryItemColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.categoryItemColor || '#4b5563'}
                      onChange={(e) => handleChange('sidebar.categoryItemColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Item (Oscuro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.categoryItemColorDark || '#d1d5db'}
                      onChange={(e) => handleChange('sidebar.categoryItemColorDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.categoryItemColorDark || '#d1d5db'}
                      onChange={(e) => handleChange('sidebar.categoryItemColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Hover/Activo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.categoryHoverColor || '#2563eb'}
                      onChange={(e) => handleChange('sidebar.categoryHoverColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.categoryHoverColor || '#2563eb'}
                      onChange={(e) => handleChange('sidebar.categoryHoverColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración Tags */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tags
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Título (Claro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagsTitleColor || '#111827'}
                      onChange={(e) => handleChange('sidebar.tagsTitleColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagsTitleColor || '#111827'}
                      onChange={(e) => handleChange('sidebar.tagsTitleColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Color Título (Oscuro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagsTitleColorDark || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.tagsTitleColorDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagsTitleColorDark || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.tagsTitleColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Fondo Tag (Claro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagBgColor || '#e5e7eb'}
                      onChange={(e) => handleChange('sidebar.tagBgColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagBgColor || '#e5e7eb'}
                      onChange={(e) => handleChange('sidebar.tagBgColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Fondo Tag (Oscuro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagBgColorDark || '#374151'}
                      onChange={(e) => handleChange('sidebar.tagBgColorDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagBgColorDark || '#374151'}
                      onChange={(e) => handleChange('sidebar.tagBgColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Texto Tag (Claro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagTextColor || '#4b5563'}
                      onChange={(e) => handleChange('sidebar.tagTextColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagTextColor || '#4b5563'}
                      onChange={(e) => handleChange('sidebar.tagTextColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Texto Tag (Oscuro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagTextColorDark || '#d1d5db'}
                      onChange={(e) => handleChange('sidebar.tagTextColorDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagTextColorDark || '#d1d5db'}
                      onChange={(e) => handleChange('sidebar.tagTextColorDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Fondo Tag Activo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagActiveBgColor || '#2563eb'}
                      onChange={(e) => handleChange('sidebar.tagActiveBgColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagActiveBgColor || '#2563eb'}
                      onChange={(e) => handleChange('sidebar.tagActiveBgColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Texto Tag Activo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.sidebar?.tagActiveTextColor || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.tagActiveTextColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.sidebar?.tagActiveTextColor || '#ffffff'}
                      onChange={(e) => handleChange('sidebar.tagActiveTextColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Máximo de tags visibles */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Máx. Tags Visibles
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={config.sidebar?.maxVisibleTags || 8}
                      onChange={(e) => handleChange('sidebar.maxVisibleTags', parseInt(e.target.value) || 8)}
                      className="w-20 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                    <span className="text-xs text-gray-500">tags</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default AllNewsConfigSection;
