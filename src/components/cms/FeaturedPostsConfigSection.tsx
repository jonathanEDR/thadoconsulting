/**
 * 🎯 FeaturedPostsConfigSection
 * Configuración CMS para la sección de Noticias Destacadas del Blog
 */

import React, { useState, useRef } from 'react';
import { 
  Newspaper, 
  Layout, 
  Type,
  Eye,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import type { FeaturedPostsConfig } from '../../hooks/blog/useBlogCmsConfig';
import { uploadImage } from '../../services/imageService';

interface FeaturedPostsConfigSectionProps {
  config: FeaturedPostsConfig;
  onChange: (config: FeaturedPostsConfig) => void;
}

export const FeaturedPostsConfigSection: React.FC<FeaturedPostsConfigSectionProps> = ({
  config,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'heroCard' | 'smallCard'>('general');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isUploadingLight, setIsUploadingLight] = useState(false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);
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
        title: 'Featured Posts Section Background Light',
        alt: 'Fondo de sección noticias destacadas - Tema claro'
      });

      if (imageData?.url) {
        handleChange('sectionBgImageLight', imageData.url);
        console.log('✅ Imagen (tema claro) subida:', imageData.url);
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
        title: 'Featured Posts Section Background Dark',
        alt: 'Fondo de sección noticias destacadas - Tema oscuro'
      });

      if (imageData?.url) {
        handleChange('sectionBgImageDark', imageData.url);
        console.log('✅ Imagen (tema oscuro) subida:', imageData.url);
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
    { id: 'heroCard', label: 'Tarjeta Principal', icon: Eye },
    { id: 'smallCard', label: 'Tarjetas Pequeñas', icon: Type },
  ];

  return (
    <div className="space-y-6">
      {/* Header Colapsable */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Noticias Destacadas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura la apariencia de las tarjetas destacadas
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
        />
      </button>

      {/* Contenido colapsable */}
      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'general' | 'heroCard' | 'smallCard')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            {/* Título de la sección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título de la Sección
              </label>
              <input
                type="text"
                value={config.sectionTitle || 'Noticias Destacadas'}
                onChange={(e) => handleChange('sectionTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Noticias Destacadas"
              />
            </div>

            {/* Mostrar icono */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showIcon"
                checked={config.showIcon !== false}
                onChange={(e) => handleChange('showIcon', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="showIcon" className="text-sm text-gray-700 dark:text-gray-300">
                Mostrar icono junto al título
              </label>
            </div>

            {/* Layout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Disposición
              </label>
              <select
                value={config.layout || 'hero-left'}
                onChange={(e) => handleChange('layout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="hero-left">Tarjeta grande a la izquierda</option>
                <option value="hero-right">Tarjeta grande a la derecha</option>
                <option value="grid">Cuadrícula uniforme (3 columnas)</option>
                <option value="stacked">Apiladas (una por fila)</option>
              </select>
            </div>

            {/* Cantidad máxima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Máximo de noticias destacadas
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={config.maxFeaturedPosts || 3}
                onChange={(e) => handleChange('maxFeaturedPosts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Tipografía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipografía
              </label>
              <select
                value={config.fontFamily || 'Montserrat'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Montserrat">Montserrat (Predeterminado)</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Inter">Inter</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Raleway">Raleway</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Fuente para títulos y textos de las tarjetas
              </p>
            </div>

            {/* Configuración de fondo por tema */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Fondo de la Sección por Tema
              </h4>
              
              {/* Colores de fondo */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Color fondo (Claro)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.sectionBgColorLight || '#f3f4f6'}
                      onChange={(e) => handleChange('sectionBgColorLight', e.target.value)}
                      className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={config.sectionBgColorLight || '#f3f4f6'}
                      onChange={(e) => handleChange('sectionBgColorLight', e.target.value)}
                      placeholder="#f3f4f6"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    Color fondo (Oscuro)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.sectionBgColorDark || '#111827'}
                      onChange={(e) => handleChange('sectionBgColorDark', e.target.value)}
                      className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={config.sectionBgColorDark || '#111827'}
                      onChange={(e) => handleChange('sectionBgColorDark', e.target.value)}
                      placeholder="#111827"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Imagen de fondo - Tema Claro */}
              <div className="mb-6 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  Imagen de Fondo - Tema Claro
                </h5>
                
                {config.sectionBgImageLight ? (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={config.sectionBgImageLight}
                        alt="Fondo tema claro"
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => handleChange('sectionBgImageLight', '')}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Eliminar imagen"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Oscurecer ({Math.round((config.sectionBgOverlayLight ?? 0) * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.sectionBgOverlayLight ?? 0}
                        onChange={(e) => handleChange('sectionBgOverlayLight', parseFloat(e.target.value))}
                        className="w-full h-2"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                        <span>Sin overlay</span>
                        <span>Muy oscuro</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                    <div className="flex flex-col items-center justify-center py-2">
                      {isUploadingLight ? (
                        <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">Subir imagen</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputLightRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadLight}
                      className="hidden"
                      disabled={isUploadingLight}
                    />
                  </label>
                )}
              </div>

              {/* Imagen de fondo - Tema Oscuro */}
              <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <h5 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Imagen de Fondo - Tema Oscuro
                </h5>
                
                {config.sectionBgImageDark ? (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={config.sectionBgImageDark}
                        alt="Fondo tema oscuro"
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => handleChange('sectionBgImageDark', '')}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Eliminar imagen"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Oscurecer ({Math.round((config.sectionBgOverlayDark ?? 0) * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.sectionBgOverlayDark ?? 0}
                        onChange={(e) => handleChange('sectionBgOverlayDark', parseFloat(e.target.value))}
                        className="w-full h-2"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                        <span>Sin overlay</span>
                        <span>Muy oscuro</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                    <div className="flex flex-col items-center justify-center py-2">
                      {isUploadingDark ? (
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-500 mb-1" />
                          <p className="text-xs text-gray-400">Subir imagen</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputDarkRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadDark}
                      className="hidden"
                      disabled={isUploadingDark}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Colores del Título e Icono por Tema */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                🎨 Colores del Título e Icono por Tema
              </h4>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Tema Claro */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Tema Claro
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Color del título</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.sectionTitleColorLight || '#111827'}
                          onChange={(e) => handleChange('sectionTitleColorLight', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.sectionTitleColorLight || '#111827'}
                          onChange={(e) => handleChange('sectionTitleColorLight', e.target.value)}
                          placeholder="#111827"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Color del icono</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.sectionIconColorLight || '#2563eb'}
                          onChange={(e) => handleChange('sectionIconColorLight', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.sectionIconColorLight || '#2563eb'}
                          onChange={(e) => handleChange('sectionIconColorLight', e.target.value)}
                          placeholder="#2563eb"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Fondo del icono</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.sectionIconBgLight || '#dbeafe'}
                          onChange={(e) => handleChange('sectionIconBgLight', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.sectionIconBgLight || '#dbeafe'}
                          onChange={(e) => handleChange('sectionIconBgLight', e.target.value)}
                          placeholder="#dbeafe"
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <h5 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    Tema Oscuro
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color del título</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.sectionTitleColorDark || '#ffffff'}
                          onChange={(e) => handleChange('sectionTitleColorDark', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border border-gray-600"
                        />
                        <input
                          type="text"
                          value={config.sectionTitleColorDark || '#ffffff'}
                          onChange={(e) => handleChange('sectionTitleColorDark', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color del icono</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.sectionIconColorDark || '#60a5fa'}
                          onChange={(e) => handleChange('sectionIconColorDark', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border border-gray-600"
                        />
                        <input
                          type="text"
                          value={config.sectionIconColorDark || '#60a5fa'}
                          onChange={(e) => handleChange('sectionIconColorDark', e.target.value)}
                          placeholder="#60a5fa"
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Fondo del icono</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.sectionIconBgDark || '#1e3a5f'}
                          onChange={(e) => handleChange('sectionIconBgDark', e.target.value)}
                          className="w-10 h-8 cursor-pointer rounded border border-gray-600"
                        />
                        <input
                          type="text"
                          value={config.sectionIconBgDark || '#1e3a5f'}
                          onChange={(e) => handleChange('sectionIconBgDark', e.target.value)}
                          placeholder="#1e3a5f"
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-800 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista previa */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                <div className="flex gap-4">
                  {/* Preview Claro */}
                  <div className="flex-1 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: config.sectionBgColorLight || '#f3f4f6' }}>
                    <div className="p-1.5 rounded" style={{ backgroundColor: config.sectionIconBgLight || '#dbeafe' }}>
                      <Newspaper className="w-4 h-4" style={{ color: config.sectionIconColorLight || '#2563eb' }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: config.sectionTitleColorLight || '#111827' }}>
                      {config.sectionTitle || 'Noticias'}
                    </span>
                  </div>
                  {/* Preview Oscuro */}
                  <div className="flex-1 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: config.sectionBgColorDark || '#111827' }}>
                    <div className="p-1.5 rounded" style={{ backgroundColor: config.sectionIconBgDark || '#1e3a5f' }}>
                      <Newspaper className="w-4 h-4" style={{ color: config.sectionIconColorDark || '#60a5fa' }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: config.sectionTitleColorDark || '#ffffff' }}>
                      {config.sectionTitle || 'Noticias'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heroCard' && (
          <div className="space-y-6">
            {/* Sección: Borde de la Tarjeta */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                📦 Borde de la Tarjeta
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del borde
                  </label>
                  <input
                    type="color"
                    value={config.heroCard?.cardBorderColor || '#3b82f6'}
                    onChange={(e) => handleChange('heroCard.cardBorderColor', e.target.value)}
                    className="w-full h-10 cursor-pointer rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grosor del borde ({config.heroCard?.cardBorderWidth || 2}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="1"
                    value={config.heroCard?.cardBorderWidth || 2}
                    onChange={(e) => handleChange('heroCard.cardBorderWidth', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Sin borde</span>
                    <span>Grueso</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Franja de Contenido */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                🎨 Franja de Contenido
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color de fondo de la franja
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={config.heroCard?.contentBgColor?.replace(/rgba?\([^)]+\)/, '#000000') || '#000000'}
                    onChange={(e) => handleChange('heroCard.contentBgColor', e.target.value + 'f0')}
                    className="w-12 h-10 cursor-pointer rounded"
                  />
                  <select
                    value={
                      config.heroCard?.contentBgColor?.includes('0.95') || config.heroCard?.contentBgColor?.includes('f0') 
                        ? '95' 
                        : config.heroCard?.contentBgColor?.includes('0.85') || config.heroCard?.contentBgColor?.includes('d9')
                          ? '85'
                          : config.heroCard?.contentBgColor?.includes('0.75') || config.heroCard?.contentBgColor?.includes('bf')
                            ? '75'
                            : '95'
                    }
                    onChange={(e) => {
                      const baseColor = config.heroCard?.contentBgColor?.slice(0, 7) || '#000000';
                      const opacity = e.target.value === '95' ? 'f0' : e.target.value === '85' ? 'd9' : 'bf';
                      handleChange('heroCard.contentBgColor', baseColor + opacity);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="95">95% opacidad</option>
                    <option value="85">85% opacidad</option>
                    <option value="75">75% opacidad</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Botón "Ver más" */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                🔘 Botón "Ver más"
              </h4>
              
              {/* ===== FONDO DEL BOTÓN ===== */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  🎨 Fondo del Botón
                </h5>
                
                {/* Toggle para fondo transparente */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.heroCard?.buttonBgTransparent || false}
                      onChange={(e) => {
                        handleChange('heroCard.buttonBgTransparent', e.target.checked);
                        if (e.target.checked) {
                          handleChange('heroCard.buttonUseGradient', false);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-500"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🚫 Fondo transparente
                  </span>
                </div>

                {/* Solo mostrar opciones de color si NO es transparente */}
                {!config.heroCard?.buttonBgTransparent && (
                  <>
                    {/* Toggle para usar gradiente en fondo */}
                    <div className="flex items-center gap-3 mb-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.heroCard?.buttonUseGradient || false}
                          onChange={(e) => handleChange('heroCard.buttonUseGradient', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Usar gradiente en el fondo
                      </span>
                    </div>

                    {/* Configuración de gradiente de fondo */}
                    {config.heroCard?.buttonUseGradient ? (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Color inicial
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={config.heroCard?.buttonGradientFrom || '#3b82f6'}
                                onChange={(e) => handleChange('heroCard.buttonGradientFrom', e.target.value)}
                                className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                value={config.heroCard?.buttonGradientFrom || '#3b82f6'}
                                onChange={(e) => handleChange('heroCard.buttonGradientFrom', e.target.value)}
                                placeholder="#3b82f6"
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
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
                                value={config.heroCard?.buttonGradientTo || '#8b5cf6'}
                                onChange={(e) => handleChange('heroCard.buttonGradientTo', e.target.value)}
                                className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                value={config.heroCard?.buttonGradientTo || '#8b5cf6'}
                                onChange={(e) => handleChange('heroCard.buttonGradientTo', e.target.value)}
                                placeholder="#8b5cf6"
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Dirección del gradiente
                          </label>
                          <select
                            value={config.heroCard?.buttonGradientDirection || 'to-r'}
                            onChange={(e) => handleChange('heroCard.buttonGradientDirection', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="to-r">→ Izquierda a Derecha</option>
                            <option value="to-l">← Derecha a Izquierda</option>
                            <option value="to-t">↑ Abajo a Arriba</option>
                            <option value="to-b">↓ Arriba a Abajo</option>
                            <option value="to-tr">↗ Diagonal Superior Derecha</option>
                            <option value="to-tl">↖ Diagonal Superior Izquierda</option>
                            <option value="to-br">↘ Diagonal Inferior Derecha</option>
                            <option value="to-bl">↙ Diagonal Inferior Izquierda</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color de fondo sólido
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.heroCard?.buttonBgColor || '#000000'}
                            onChange={(e) => handleChange('heroCard.buttonBgColor', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.heroCard?.buttonBgColor || '#000000'}
                            onChange={(e) => handleChange('heroCard.buttonBgColor', e.target.value)}
                            placeholder="#000000"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ===== TEXTO DEL BOTÓN ===== */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  ✏️ Texto del Botón
                </h5>
                
                {/* Toggle para usar gradiente en texto */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.heroCard?.buttonTextUseGradient || false}
                      onChange={(e) => handleChange('heroCard.buttonTextUseGradient', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usar gradiente en el texto
                  </span>
                </div>

                {/* Configuración de gradiente de texto */}
                {config.heroCard?.buttonTextUseGradient ? (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color inicial
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.heroCard?.buttonTextGradientFrom || '#00ffff'}
                            onChange={(e) => handleChange('heroCard.buttonTextGradientFrom', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.heroCard?.buttonTextGradientFrom || '#00ffff'}
                            onChange={(e) => handleChange('heroCard.buttonTextGradientFrom', e.target.value)}
                            placeholder="#00ffff"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
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
                            value={config.heroCard?.buttonTextGradientTo || '#ff00ff'}
                            onChange={(e) => handleChange('heroCard.buttonTextGradientTo', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.heroCard?.buttonTextGradientTo || '#ff00ff'}
                            onChange={(e) => handleChange('heroCard.buttonTextGradientTo', e.target.value)}
                            placeholder="#ff00ff"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Dirección del gradiente
                      </label>
                      <select
                        value={config.heroCard?.buttonTextGradientDirection || 'to-r'}
                        onChange={(e) => handleChange('heroCard.buttonTextGradientDirection', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="to-r">→ Izquierda a Derecha</option>
                        <option value="to-l">← Derecha a Izquierda</option>
                        <option value="to-t">↑ Abajo a Arriba</option>
                        <option value="to-b">↓ Arriba a Abajo</option>
                        <option value="to-tr">↗ Diagonal Superior Derecha</option>
                        <option value="to-tl">↖ Diagonal Superior Izquierda</option>
                        <option value="to-br">↘ Diagonal Inferior Derecha</option>
                        <option value="to-bl">↙ Diagonal Inferior Izquierda</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color del texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.heroCard?.buttonTextColor || '#00ffff'}
                        onChange={(e) => handleChange('heroCard.buttonTextColor', e.target.value)}
                        className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={config.heroCard?.buttonTextColor || '#00ffff'}
                        onChange={(e) => handleChange('heroCard.buttonTextColor', e.target.value)}
                        placeholder="#00ffff"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ===== BORDE DEL BOTÓN ===== */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  🔲 Borde del Botón
                </h5>
                
                {/* Toggle para usar gradiente en borde */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.heroCard?.buttonBorderUseGradient || false}
                      onChange={(e) => handleChange('heroCard.buttonBorderUseGradient', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usar gradiente en el borde
                  </span>
                </div>

                {/* Configuración de gradiente de borde */}
                {config.heroCard?.buttonBorderUseGradient ? (
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color inicial
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.heroCard?.buttonBorderGradientFrom || '#00ffff'}
                            onChange={(e) => handleChange('heroCard.buttonBorderGradientFrom', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.heroCard?.buttonBorderGradientFrom || '#00ffff'}
                            onChange={(e) => handleChange('heroCard.buttonBorderGradientFrom', e.target.value)}
                            placeholder="#00ffff"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
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
                            value={config.heroCard?.buttonBorderGradientTo || '#ff00ff'}
                            onChange={(e) => handleChange('heroCard.buttonBorderGradientTo', e.target.value)}
                            className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.heroCard?.buttonBorderGradientTo || '#ff00ff'}
                            onChange={(e) => handleChange('heroCard.buttonBorderGradientTo', e.target.value)}
                            placeholder="#ff00ff"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Dirección del gradiente
                      </label>
                      <select
                        value={config.heroCard?.buttonBorderGradientDirection || 'to-r'}
                        onChange={(e) => handleChange('heroCard.buttonBorderGradientDirection', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="to-r">→ Izquierda a Derecha</option>
                        <option value="to-l">← Derecha a Izquierda</option>
                        <option value="to-t">↑ Abajo a Arriba</option>
                        <option value="to-b">↓ Arriba a Abajo</option>
                        <option value="to-tr">↗ Diagonal Superior Derecha</option>
                        <option value="to-tl">↖ Diagonal Superior Izquierda</option>
                        <option value="to-br">↘ Diagonal Inferior Derecha</option>
                        <option value="to-bl">↙ Diagonal Inferior Izquierda</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color del borde
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.heroCard?.buttonBorderColor || '#00ffff'}
                        onChange={(e) => handleChange('heroCard.buttonBorderColor', e.target.value)}
                        className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={config.heroCard?.buttonBorderColor || '#00ffff'}
                        onChange={(e) => handleChange('heroCard.buttonBorderColor', e.target.value)}
                        placeholder="#00ffff"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Grosor del borde */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grosor del borde ({config.heroCard?.buttonBorderWidth || 2}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={config.heroCard?.buttonBorderWidth || 2}
                    onChange={(e) => handleChange('heroCard.buttonBorderWidth', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Sin borde</span>
                    <span>Grueso</span>
                  </div>
                </div>
              </div>

              {/* Preview del botón */}
              <div className="p-4 bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-400 mb-3">Vista previa:</p>
                <div className="flex justify-center">
                  {/* Versión con borde gradiente + fondo transparente (con wrapper) */}
                  {config.heroCard?.buttonBorderUseGradient && config.heroCard?.buttonBgTransparent ? (
                    <div 
                      className="inline-block rounded-full transition-all"
                      style={{
                        background: `linear-gradient(${
                          config.heroCard?.buttonBorderGradientDirection === 'to-r' ? 'to right' :
                          config.heroCard?.buttonBorderGradientDirection === 'to-l' ? 'to left' :
                          config.heroCard?.buttonBorderGradientDirection === 'to-t' ? 'to top' :
                          config.heroCard?.buttonBorderGradientDirection === 'to-b' ? 'to bottom' :
                          config.heroCard?.buttonBorderGradientDirection === 'to-tr' ? 'to top right' :
                          config.heroCard?.buttonBorderGradientDirection === 'to-tl' ? 'to top left' :
                          config.heroCard?.buttonBorderGradientDirection === 'to-br' ? 'to bottom right' :
                          'to bottom left'
                        }, ${config.heroCard?.buttonBorderGradientFrom || '#00ffff'}, ${config.heroCard?.buttonBorderGradientTo || '#ff00ff'})`,
                        padding: `${config.heroCard?.buttonBorderWidth || 2}px`
                      }}
                    >
                      <button
                        className="px-5 py-2 text-sm font-semibold rounded-full"
                        style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
                      >
                        <span
                          style={config.heroCard?.buttonTextUseGradient ? {
                            background: `linear-gradient(${
                              config.heroCard?.buttonTextGradientDirection === 'to-r' ? 'to right' :
                              config.heroCard?.buttonTextGradientDirection === 'to-l' ? 'to left' :
                              config.heroCard?.buttonTextGradientDirection === 'to-t' ? 'to top' :
                              config.heroCard?.buttonTextGradientDirection === 'to-b' ? 'to bottom' :
                              config.heroCard?.buttonTextGradientDirection === 'to-tr' ? 'to top right' :
                              config.heroCard?.buttonTextGradientDirection === 'to-tl' ? 'to top left' :
                              config.heroCard?.buttonTextGradientDirection === 'to-br' ? 'to bottom right' :
                              'to bottom left'
                            }, ${config.heroCard?.buttonTextGradientFrom || '#00ffff'}, ${config.heroCard?.buttonTextGradientTo || '#ff00ff'})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          } : {
                            color: config.heroCard?.buttonTextColor || '#00ffff'
                          }}
                        >
                          Ver más
                        </span>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="px-5 py-2 text-sm font-semibold rounded-full transition-all"
                      style={{
                        background: (() => {
                          // Si usa gradiente de borde CON fondo sólido
                          if (config.heroCard?.buttonBorderUseGradient && !config.heroCard?.buttonBgTransparent) {
                            const bgColor = config.heroCard?.buttonBgColor || '#000000';
                            const gradientDirection = config.heroCard?.buttonBorderGradientDirection === 'to-r' ? 'to right' :
                              config.heroCard?.buttonBorderGradientDirection === 'to-l' ? 'to left' :
                              config.heroCard?.buttonBorderGradientDirection === 'to-t' ? 'to top' :
                              config.heroCard?.buttonBorderGradientDirection === 'to-b' ? 'to bottom' :
                              config.heroCard?.buttonBorderGradientDirection === 'to-tr' ? 'to top right' :
                              config.heroCard?.buttonBorderGradientDirection === 'to-tl' ? 'to top left' :
                              config.heroCard?.buttonBorderGradientDirection === 'to-br' ? 'to bottom right' :
                              'to bottom left';
                            return `linear-gradient(${bgColor}, ${bgColor}) padding-box, linear-gradient(${gradientDirection}, ${config.heroCard?.buttonBorderGradientFrom || '#00ffff'}, ${config.heroCard?.buttonBorderGradientTo || '#ff00ff'}) border-box`;
                          }
                          // Si usa gradiente de fondo
                          if (config.heroCard?.buttonUseGradient && !config.heroCard?.buttonBgTransparent) {
                            const gradientDirection = config.heroCard?.buttonGradientDirection === 'to-r' ? 'to right' :
                              config.heroCard?.buttonGradientDirection === 'to-l' ? 'to left' :
                              config.heroCard?.buttonGradientDirection === 'to-t' ? 'to top' :
                              config.heroCard?.buttonGradientDirection === 'to-b' ? 'to bottom' :
                              config.heroCard?.buttonGradientDirection === 'to-tr' ? 'to top right' :
                              config.heroCard?.buttonGradientDirection === 'to-tl' ? 'to top left' :
                              config.heroCard?.buttonGradientDirection === 'to-br' ? 'to bottom right' :
                              'to bottom left';
                            return `linear-gradient(${gradientDirection}, ${config.heroCard?.buttonGradientFrom || '#3b82f6'}, ${config.heroCard?.buttonGradientTo || '#8b5cf6'})`;
                          }
                          // Si es transparente
                          if (config.heroCard?.buttonBgTransparent) {
                            return 'transparent';
                          }
                          // Color sólido
                          return config.heroCard?.buttonBgColor || 'transparent';
                        })(),
                        border: config.heroCard?.buttonBorderUseGradient 
                          ? `${config.heroCard?.buttonBorderWidth || 2}px solid transparent`
                          : `${config.heroCard?.buttonBorderWidth || 2}px solid ${config.heroCard?.buttonBorderColor || '#00ffff'}`,
                      }}
                    >
                      <span
                        style={config.heroCard?.buttonTextUseGradient ? {
                          background: `linear-gradient(${
                            config.heroCard?.buttonTextGradientDirection === 'to-r' ? 'to right' :
                            config.heroCard?.buttonTextGradientDirection === 'to-l' ? 'to left' :
                            config.heroCard?.buttonTextGradientDirection === 'to-t' ? 'to top' :
                            config.heroCard?.buttonTextGradientDirection === 'to-b' ? 'to bottom' :
                            config.heroCard?.buttonTextGradientDirection === 'to-tr' ? 'to top right' :
                            config.heroCard?.buttonTextGradientDirection === 'to-tl' ? 'to top left' :
                            config.heroCard?.buttonTextGradientDirection === 'to-br' ? 'to bottom right' :
                            'to bottom left'
                          }, ${config.heroCard?.buttonTextGradientFrom || '#00ffff'}, ${config.heroCard?.buttonTextGradientTo || '#ff00ff'})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        } : {
                          color: config.heroCard?.buttonTextColor || '#00ffff'
                        }}
                      >
                        Ver más
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Colores de Texto */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                📝 Colores de Texto
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="color"
                    value={config.heroCard?.titleColor || '#ffffff'}
                    onChange={(e) => handleChange('heroCard.titleColor', e.target.value)}
                    className="w-full h-10 cursor-pointer rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Extracto
                  </label>
                  <input
                    type="color"
                    value={config.heroCard?.excerptColor || '#d1d5db'}
                    onChange={(e) => handleChange('heroCard.excerptColor', e.target.value)}
                    className="w-full h-10 cursor-pointer rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha
                  </label>
                  <input
                    type="color"
                    value={config.heroCard?.dateColor || '#9ca3af'}
                    onChange={(e) => handleChange('heroCard.dateColor', e.target.value)}
                    className="w-full h-10 cursor-pointer rounded"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Estilos de Tags */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                🏷️ Estilos de Tags
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Personaliza la apariencia de las etiquetas que se muestran en la tarjeta principal
              </p>

              {/* ===== FONDO DEL TAG ===== */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  🎨 Fondo del Tag
                </h5>
                
                {/* Toggle para fondo transparente */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.heroCard?.tagBgTransparent || false}
                      onChange={(e) => handleChange('heroCard.tagBgTransparent', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🚫 Fondo transparente
                  </span>
                </div>

                {/* Color de fondo (solo si no es transparente) */}
                {!config.heroCard?.tagBgTransparent && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color de fondo</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.heroCard?.tagBgColor?.startsWith('#') ? config.heroCard.tagBgColor.slice(0, 7) : '#8b5cf6'}
                        onChange={(e) => handleChange('heroCard.tagBgColor', e.target.value)}
                        className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={config.heroCard?.tagBgColor || '#8b5cf6'}
                        onChange={(e) => handleChange('heroCard.tagBgColor', e.target.value)}
                        placeholder="#8b5cf6"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ===== TEXTO DEL TAG ===== */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  ✏️ Texto del Tag
                </h5>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.heroCard?.tagTextColor || '#ffffff'}
                    onChange={(e) => handleChange('heroCard.tagTextColor', e.target.value)}
                    className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={config.heroCard?.tagTextColor || '#ffffff'}
                    onChange={(e) => handleChange('heroCard.tagTextColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* ===== BORDE DEL TAG ===== */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  🔲 Borde del Tag
                </h5>
                
                {/* Toggle para usar gradiente en borde */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.heroCard?.tagBorderUseGradient || false}
                      onChange={(e) => handleChange('heroCard.tagBorderUseGradient', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🌈 Usar gradiente en el borde
                  </span>
                </div>

                {/* Configuración de gradiente de borde */}
                {config.heroCard?.tagBorderUseGradient ? (
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Color inicial
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.heroCard?.tagBorderGradientFrom || '#8b5cf6'}
                            onChange={(e) => handleChange('heroCard.tagBorderGradientFrom', e.target.value)}
                            className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.heroCard?.tagBorderGradientFrom || '#8b5cf6'}
                            onChange={(e) => handleChange('heroCard.tagBorderGradientFrom', e.target.value)}
                            placeholder="#8b5cf6"
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
                            value={config.heroCard?.tagBorderGradientTo || '#06b6d4'}
                            onChange={(e) => handleChange('heroCard.tagBorderGradientTo', e.target.value)}
                            className="w-10 h-8 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.heroCard?.tagBorderGradientTo || '#06b6d4'}
                            onChange={(e) => handleChange('heroCard.tagBorderGradientTo', e.target.value)}
                            placeholder="#06b6d4"
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
                        value={config.heroCard?.tagBorderGradientDirection || 'to-r'}
                        onChange={(e) => handleChange('heroCard.tagBorderGradientDirection', e.target.value)}
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
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color del borde
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.heroCard?.tagBorderColor?.startsWith('#') ? config.heroCard.tagBorderColor : '#8b5cf6'}
                        onChange={(e) => handleChange('heroCard.tagBorderColor', e.target.value)}
                        className="w-12 h-10 cursor-pointer rounded border-2 border-gray-200 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={config.heroCard?.tagBorderColor || '#8b5cf6'}
                        onChange={(e) => handleChange('heroCard.tagBorderColor', e.target.value)}
                        placeholder="#8b5cf6"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Preview de los tags */}
              <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-400 mb-3">Vista previa:</p>
                <div className="flex flex-wrap gap-2">
                  {['tecnología', 'desarrollo', 'web'].map((tagName) => (
                    config.heroCard?.tagBorderUseGradient ? (
                      // Tag con borde gradiente (usando wrapper)
                      <div 
                        key={tagName}
                        className="inline-block rounded-full p-[1px]"
                        style={{
                          background: `linear-gradient(${
                            config.heroCard?.tagBorderGradientDirection === 'to-r' ? 'to right' :
                            config.heroCard?.tagBorderGradientDirection === 'to-l' ? 'to left' :
                            config.heroCard?.tagBorderGradientDirection === 'to-t' ? 'to top' :
                            config.heroCard?.tagBorderGradientDirection === 'to-b' ? 'to bottom' :
                            config.heroCard?.tagBorderGradientDirection === 'to-tr' ? 'to top right' :
                            'to bottom right'
                          }, ${config.heroCard?.tagBorderGradientFrom || '#8b5cf6'}, ${config.heroCard?.tagBorderGradientTo || '#06b6d4'})`
                        }}
                      >
                        <span
                          className="block px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: config.heroCard?.tagBgTransparent 
                              ? '#000000'  // Fondo negro sólido para ver el borde gradiente
                              : (config.heroCard?.tagBgColor || '#8b5cf6'),
                            color: config.heroCard?.tagTextColor || '#ffffff'
                          }}
                        >
                          {tagName}
                        </span>
                      </div>
                    ) : (
                      // Tag con borde sólido
                      <span
                        key={tagName}
                        className="px-3 py-1 text-xs rounded-full border"
                        style={{
                          backgroundColor: config.heroCard?.tagBgTransparent 
                            ? 'transparent' 
                            : (config.heroCard?.tagBgColor || '#8b5cf6'),
                          color: config.heroCard?.tagTextColor || '#ffffff',
                          borderColor: config.heroCard?.tagBorderColor || '#8b5cf6'
                        }}
                      >
                        {tagName}
                      </span>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'smallCard' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Estilos para las tarjetas pequeñas sin imagen
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Fondo y borde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color de fondo
                </label>
                <input
                  type="color"
                  value={config.smallCard?.bgColor || '#ffffff'}
                  onChange={(e) => handleChange('smallCard.bgColor', e.target.value)}
                  className="w-full h-10 cursor-pointer rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color del borde
                </label>
                <input
                  type="color"
                  value={config.smallCard?.borderColor || '#e5e7eb'}
                  onChange={(e) => handleChange('smallCard.borderColor', e.target.value)}
                  className="w-full h-10 cursor-pointer rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color borde hover
                </label>
                <input
                  type="color"
                  value={config.smallCard?.hoverBorderColor || '#93c5fd'}
                  onChange={(e) => handleChange('smallCard.hoverBorderColor', e.target.value)}
                  className="w-full h-10 cursor-pointer rounded"
                />
              </div>

              {/* Textos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color del título
                </label>
                <input
                  type="color"
                  value={config.smallCard?.titleColor || '#111827'}
                  onChange={(e) => handleChange('smallCard.titleColor', e.target.value)}
                  className="w-full h-10 cursor-pointer rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color del extracto
                </label>
                <input
                  type="color"
                  value={config.smallCard?.excerptColor || '#4b5563'}
                  onChange={(e) => handleChange('smallCard.excerptColor', e.target.value)}
                  className="w-full h-10 cursor-pointer rounded"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color fondo categoría
                </label>
                <input
                  type="color"
                  value={config.smallCard?.categoryBgColor || '#2563eb'}
                  onChange={(e) => handleChange('smallCard.categoryBgColor', e.target.value)}
                  className="w-full h-10 cursor-pointer rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color texto categoría
                </label>
                <input
                  type="color"
                  value={config.smallCard?.categoryTextColor || '#ffffff'}
                  onChange={(e) => handleChange('smallCard.categoryTextColor', e.target.value)}
                  className="w-full h-10 cursor-pointer rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Vista previa (simplificada)
        </p>
        <div className="flex gap-3">
          {/* Mini preview de tarjeta hero */}
          <div 
            className="flex-1 h-24 rounded-lg relative overflow-hidden"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,${config.heroCard?.overlayOpacity || 0.6}), transparent), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
            }}
          >
            <div className="absolute bottom-2 left-2">
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: config.heroCard?.categoryBgColor || '#2563eb',
                  color: config.heroCard?.categoryTextColor || '#ffffff'
                }}
              >
                Categoría
              </span>
              <p 
                className="text-xs font-bold mt-1"
                style={{ color: config.heroCard?.titleColor || '#ffffff' }}
              >
                Título del artículo
              </p>
            </div>
          </div>
          
          {/* Mini preview de tarjeta small */}
          <div 
            className="w-24 h-24 rounded-lg p-2 border"
            style={{
              backgroundColor: config.smallCard?.bgColor || '#ffffff',
              borderColor: config.smallCard?.borderColor || '#e5e7eb'
            }}
          >
            <span 
              className="text-[8px] px-1 rounded"
              style={{
                backgroundColor: config.smallCard?.categoryBgColor || '#2563eb',
                color: config.smallCard?.categoryTextColor || '#ffffff'
              }}
            >
              Cat
            </span>
            <p 
              className="text-[8px] font-bold mt-1"
              style={{ color: config.smallCard?.titleColor || '#111827' }}
            >
              Título
            </p>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default FeaturedPostsConfigSection;
