/**
 * 🎯 BlogHeroConfigSection
 * Configuración del Hero Section para la página del Blog
 * Soporta imagen de fondo O gradiente de colores
 */

import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Type, BarChart3, Search, Image, Upload, Trash2 } from 'lucide-react';
import type { PageData } from '../../types/cms';
import { uploadImage } from '../../services/imageService';

interface BlogHeroConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const BlogHeroConfigSection: React.FC<BlogHeroConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'background' | 'stats' | 'search'>('content');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener configuración actual del hero del blog
  const blogHero = pageData?.content?.blogHero || {
    title: 'Blog',
    titleHighlight: 'Tech',
    subtitle: 'Las últimas noticias y tendencias tecnológicas',
    // Estilos de resaltado del título principal (efecto badge/highlight)
    titleStyle: {
      italic: true,
      hasBackground: true,
      backgroundColor: '#ffffff',
      padding: '4px 16px',
      borderRadius: '8px',
    },
    // Estilos de resaltado de la palabra destacada
    highlightStyle: {
      italic: false,
      hasBackground: false,
      backgroundColor: 'transparent',
      padding: '0',
      borderRadius: '0',
    },
    backgroundImage: '',
    backgroundOverlay: 0.5,
    gradientFrom: '#3b82f6',
    gradientTo: '#9333ea',
    showStats: true,
    stats: {
      articlesLabel: 'Artículos',
      readersCount: '15K+',
      readersLabel: 'Lectores'
    },
    search: {
      placeholder: 'Buscar noticias...',
      buttonText: 'Buscar',
      inputStyles: {
        light: {
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          placeholderColor: '#9ca3af',
          borderColor: '#e5e7eb',
          borderWidth: '1px',
          borderRadius: '8px',
          iconColor: '#9ca3af',
        },
        dark: {
          backgroundColor: '#1f2937',
          textColor: '#ffffff',
          placeholderColor: '#9ca3af',
          borderColor: '#374151',
          borderWidth: '1px',
          borderRadius: '8px',
          iconColor: '#9ca3af',
        }
      },
      buttonStyles: {
        light: {
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
          hoverBackgroundColor: '#1d4ed8',
          borderRadius: '6px',
        },
        dark: {
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
          hoverBackgroundColor: '#1d4ed8',
          borderRadius: '6px',
        }
      }
    },
    styles: {
      light: {
        titleColor: '#ffffff',
        titleHighlightColor: '#fde047',
        subtitleColor: '#bfdbfe',
        statsValueColor: '#ffffff',
        statsLabelColor: '#bfdbfe'
      },
      dark: {
        titleColor: '#ffffff',
        titleHighlightColor: '#fde047',
        subtitleColor: '#bfdbfe',
        statsValueColor: '#ffffff',
        statsLabelColor: '#bfdbfe'
      }
    }
  };

  const handleUpdate = (field: string, value: any) => {
    updateContent(`blogHero.${field}`, value);
  };

  const handleStyleUpdate = (mode: 'light' | 'dark', field: string, value: string | boolean) => {
    const currentStyles = blogHero.styles || {};
    const modeStyles = currentStyles[mode] || {};
    updateContent(`blogHero.styles.${mode}`, {
      ...modeStyles,
      [field]: value
    });
  };

  // Manejar subida de imagen usando el servicio centralizado
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Usar el servicio centralizado de imágenes (igual que otros módulos)
      const imageData = await uploadImage({
        file,
        category: 'banner',
        title: 'Blog Hero Background',
        alt: 'Fondo del hero del blog'
      });

      if (imageData?.url) {
        handleUpdate('backgroundImage', imageData.url);
        console.log('✅ Imagen subida correctamente:', imageData.url);
      } else {
        throw new Error('No se recibió la URL de la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    handleUpdate('backgroundImage', '');
  };

  // Generar estilo de fondo dinámico
  const getBackgroundStyle = () => {
    if (blogHero.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,${blogHero.backgroundOverlay || 0.5}), rgba(0,0,0,${blogHero.backgroundOverlay || 0.5})), url(${blogHero.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: `linear-gradient(to right, ${blogHero.gradientFrom || '#3b82f6'}, ${blogHero.gradientTo || '#9333ea'})`
    };
  };

  // Generar estilo del texto destacado (soporta gradiente)
  // Retorna estilos separados para el contenedor (badge) y el texto (gradiente)
  const getHighlightStyles = () => {
    const useGradient = blogHero.styles?.light?.titleHighlightUseGradient;
    const hasBackground = blogHero.highlightStyle?.hasBackground;
    
    // Estilos del contenedor (badge/fondo)
    const containerStyle: React.CSSProperties = {
      fontStyle: blogHero.highlightStyle?.italic ? 'italic' : 'normal',
      backgroundColor: hasBackground 
        ? (blogHero.highlightStyle?.backgroundColor || '#8b5cf6') 
        : 'transparent',
      padding: hasBackground 
        ? (blogHero.highlightStyle?.padding || '4px 16px') 
        : '0',
      borderRadius: hasBackground 
        ? (blogHero.highlightStyle?.borderRadius || '8px') 
        : '0',
      display: 'inline-block',
    };

    // Estilos del texto (color sólido o gradiente)
    const textStyle: React.CSSProperties = useGradient ? {
      background: `linear-gradient(${blogHero.styles?.light?.titleHighlightGradientDirection || 'to right'}, ${blogHero.styles?.light?.titleHighlightGradientFrom || '#8b5cf6'}, ${blogHero.styles?.light?.titleHighlightGradientTo || '#06b6d4'})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } : {
      color: blogHero.styles?.light?.titleHighlightColor || '#fde047',
    };

    return { containerStyle, textStyle, useGradient };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📰</span>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Blog Hero Section
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura la portada del blog
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isExpanded ? 'Ocultar' : 'Mostrar'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          {/* Sub-tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setActiveSubTab('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'content'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Type className="w-4 h-4" />
              Contenido
            </button>
            <button
              onClick={() => setActiveSubTab('background')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'background'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Image className="w-4 h-4" />
              Fondo
            </button>
            <button
              onClick={() => setActiveSubTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'stats'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Estadísticas
            </button>
            <button
              onClick={() => setActiveSubTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'search'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Search className="w-4 h-4" />
              Búsqueda
            </button>
          </div>

          {/* Content Tab */}
          {activeSubTab === 'content' && (
            <div className="space-y-6">
              {/* Título Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={blogHero.title || 'Blog'}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Blog"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Palabra Destacada (color diferente)
                  </label>
                  <input
                    type="text"
                    value={blogHero.titleHighlight || 'Tech'}
                    onChange={(e) => handleUpdate('titleHighlight', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tech"
                  />
                </div>
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={blogHero.subtitle || ''}
                  onChange={(e) => handleUpdate('subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Las últimas noticias y tendencias tecnológicas"
                />
              </div>

              {/* ✨ Estilos de Resaltado del Título */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  ✨ Estilos de Resaltado del Título
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Efecto badge como en la maqueta)</span>
                </h3>
                
                {/* Configuración del Título Principal */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                    📝 Título Principal "{blogHero.title || 'Blog'}"
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Itálica */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Itálica</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogHero.titleStyle?.italic ?? true}
                          onChange={(e) => handleUpdate('titleStyle.italic', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {/* Fondo */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar Fondo</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogHero.titleStyle?.hasBackground ?? true}
                          onChange={(e) => handleUpdate('titleStyle.hasBackground', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {/* Color de Fondo */}
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.titleStyle?.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdate('titleStyle.backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                          disabled={!blogHero.titleStyle?.hasBackground}
                        />
                        <input
                          type="text"
                          value={blogHero.titleStyle?.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdate('titleStyle.backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                          disabled={!blogHero.titleStyle?.hasBackground}
                        />
                      </div>
                    </div>
                    {/* Border Radius */}
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Radius</label>
                      <input
                        type="text"
                        value={blogHero.titleStyle?.borderRadius || '8px'}
                        onChange={(e) => handleUpdate('titleStyle.borderRadius', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="8px"
                        disabled={!blogHero.titleStyle?.hasBackground}
                      />
                    </div>
                  </div>
                  {/* Padding */}
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Padding (ej: 4px 16px)</label>
                    <input
                      type="text"
                      value={blogHero.titleStyle?.padding || '4px 16px'}
                      onChange={(e) => handleUpdate('titleStyle.padding', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                      placeholder="4px 16px"
                      disabled={!blogHero.titleStyle?.hasBackground}
                    />
                  </div>
                </div>

                {/* Configuración de la Palabra Destacada */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                    🌟 Palabra Destacada "{blogHero.titleHighlight || 'Tech'}"
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Itálica */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Itálica</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogHero.highlightStyle?.italic ?? false}
                          onChange={(e) => handleUpdate('highlightStyle.italic', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {/* Fondo */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar Fondo</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogHero.highlightStyle?.hasBackground ?? false}
                          onChange={(e) => handleUpdate('highlightStyle.hasBackground', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {/* Color de Fondo */}
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.highlightStyle?.backgroundColor || '#8b5cf6'}
                          onChange={(e) => handleUpdate('highlightStyle.backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                          disabled={!blogHero.highlightStyle?.hasBackground}
                        />
                        <input
                          type="text"
                          value={blogHero.highlightStyle?.backgroundColor || '#8b5cf6'}
                          onChange={(e) => handleUpdate('highlightStyle.backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                          disabled={!blogHero.highlightStyle?.hasBackground}
                        />
                      </div>
                    </div>
                    {/* Border Radius */}
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Radius</label>
                      <input
                        type="text"
                        value={blogHero.highlightStyle?.borderRadius || '8px'}
                        onChange={(e) => handleUpdate('highlightStyle.borderRadius', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="8px"
                        disabled={!blogHero.highlightStyle?.hasBackground}
                      />
                    </div>
                  </div>
                  {/* Padding */}
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Padding (ej: 4px 16px)</label>
                    <input
                      type="text"
                      value={blogHero.highlightStyle?.padding || '4px 16px'}
                      onChange={(e) => handleUpdate('highlightStyle.padding', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                      placeholder="4px 16px"
                      disabled={!blogHero.highlightStyle?.hasBackground}
                    />
                  </div>
                </div>
              </div>

              {/* Colores de texto */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Colores de Texto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Título
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.styles?.light?.titleColor || '#ffffff'}
                        onChange={(e) => handleStyleUpdate('light', 'titleColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.styles?.light?.titleColor || '#ffffff'}
                        onChange={(e) => handleStyleUpdate('light', 'titleColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                      />
                    </div>
                  </div>

                  {/* Color Destacado con opción de Gradiente */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Color Destacado
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Usar Gradiente</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={blogHero.styles?.light?.titleHighlightUseGradient ?? false}
                            onChange={(e) => handleStyleUpdate('light', 'titleHighlightUseGradient', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    {/* Color sólido o Gradiente */}
                    {!blogHero.styles?.light?.titleHighlightUseGradient ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={blogHero.styles?.light?.titleHighlightColor || '#fde047'}
                          onChange={(e) => handleStyleUpdate('light', 'titleHighlightColor', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={blogHero.styles?.light?.titleHighlightColor || '#fde047'}
                          onChange={(e) => handleStyleUpdate('light', 'titleHighlightColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Inicio</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={blogHero.styles?.light?.titleHighlightGradientFrom || '#8b5cf6'}
                                onChange={(e) => handleStyleUpdate('light', 'titleHighlightGradientFrom', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={blogHero.styles?.light?.titleHighlightGradientFrom || '#8b5cf6'}
                                onChange={(e) => handleStyleUpdate('light', 'titleHighlightGradientFrom', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Fin</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={blogHero.styles?.light?.titleHighlightGradientTo || '#06b6d4'}
                                onChange={(e) => handleStyleUpdate('light', 'titleHighlightGradientTo', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={blogHero.styles?.light?.titleHighlightGradientTo || '#06b6d4'}
                                onChange={(e) => handleStyleUpdate('light', 'titleHighlightGradientTo', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Dirección del Gradiente</label>
                          <select
                            value={blogHero.styles?.light?.titleHighlightGradientDirection || 'to right'}
                            onChange={(e) => handleStyleUpdate('light', 'titleHighlightGradientDirection', e.target.value)}
                            className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                          >
                            <option value="to right">Horizontal →</option>
                            <option value="to left">Horizontal ←</option>
                            <option value="to bottom">Vertical ↓</option>
                            <option value="to top">Vertical ↑</option>
                            <option value="to bottom right">Diagonal ↘</option>
                            <option value="to bottom left">Diagonal ↙</option>
                            <option value="to top right">Diagonal ↗</option>
                            <option value="to top left">Diagonal ↖</option>
                          </select>
                        </div>
                        {/* Preview del gradiente */}
                        <div 
                          className="h-8 rounded-lg"
                          style={{
                            background: `linear-gradient(${blogHero.styles?.light?.titleHighlightGradientDirection || 'to right'}, ${blogHero.styles?.light?.titleHighlightGradientFrom || '#8b5cf6'}, ${blogHero.styles?.light?.titleHighlightGradientTo || '#06b6d4'})`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Subtítulo - en nueva fila */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Subtítulo
                  </label>
                  <div className="flex items-center gap-3 max-w-xs">
                    <input
                      type="color"
                      value={blogHero.styles?.light?.subtitleColor || '#bfdbfe'}
                      onChange={(e) => handleStyleUpdate('light', 'subtitleColor', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={blogHero.styles?.light?.subtitleColor || '#bfdbfe'}
                      onChange={(e) => handleStyleUpdate('light', 'subtitleColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Preview del título */}
              <div 
                className="p-6 rounded-xl text-center"
                style={getBackgroundStyle()}
              >
                <h1 className="text-3xl font-bold inline-flex items-center gap-2 flex-wrap justify-center">
                  <span 
                    style={{ 
                      color: blogHero.styles?.light?.titleColor || '#ffffff',
                      fontStyle: blogHero.titleStyle?.italic ? 'italic' : 'normal',
                      backgroundColor: blogHero.titleStyle?.hasBackground 
                        ? (blogHero.titleStyle?.backgroundColor || '#ffffff') 
                        : 'transparent',
                      padding: blogHero.titleStyle?.hasBackground 
                        ? (blogHero.titleStyle?.padding || '4px 16px') 
                        : '0',
                      borderRadius: blogHero.titleStyle?.hasBackground 
                        ? (blogHero.titleStyle?.borderRadius || '8px') 
                        : '0',
                    }}
                  >
                    {blogHero.title || 'Blog'}
                  </span>
                  {/* Texto destacado con soporte para fondo + gradiente */}
                  {(() => {
                    const { containerStyle, textStyle, useGradient } = getHighlightStyles();
                    return (
                      <span style={containerStyle}>
                        {useGradient ? (
                          <span style={textStyle}>{blogHero.titleHighlight || 'Tech'}</span>
                        ) : (
                          <span style={textStyle}>{blogHero.titleHighlight || 'Tech'}</span>
                        )}
                      </span>
                    );
                  })()}
                </h1>
                <p 
                  className="mt-4"
                  style={{ color: blogHero.styles?.light?.subtitleColor || '#bfdbfe' }}
                >
                  {blogHero.subtitle || 'Las últimas noticias y tendencias tecnológicas'}
                </p>
              </div>
            </div>
          )}

          {/* Background Tab */}
          {activeSubTab === 'background' && (
            <div className="space-y-6">
              {/* Imagen de fondo */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      🖼️ Imagen de Fondo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Si subes una imagen, se usará en lugar del gradiente
                    </p>
                  </div>
                  {blogHero.backgroundImage && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
                      ✓ Imagen activa
                    </span>
                  )}
                </div>

                {/* Preview o Upload */}
                {blogHero.backgroundImage ? (
                  <div className="relative">
                    <div 
                      className="w-full h-48 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${blogHero.backgroundImage})` }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                      Imagen de fondo activa
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
                        <span className="text-gray-500 dark:text-gray-400">Subiendo imagen...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Subir imagen de fondo</span>
                        <span className="text-sm text-gray-400">JPG, PNG o WebP (máx. 5MB)</span>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Overlay control (solo si hay imagen) */}
                {blogHero.backgroundImage && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Oscurecer imagen: {Math.round((blogHero.backgroundOverlay || 0.5) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={blogHero.backgroundOverlay || 0.5}
                      onChange={(e) => handleUpdate('backgroundOverlay', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Sin oscurecer</span>
                      <span>Muy oscuro</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gradiente de fondo (siempre visible como fallback) */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      🎨 Gradiente de Fondo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {blogHero.backgroundImage 
                        ? 'Se usará si eliminas la imagen de fondo'
                        : 'Colores del gradiente actual'
                      }
                    </p>
                  </div>
                  {!blogHero.backgroundImage && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm rounded-full">
                      ✓ Gradiente activo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Inicio
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.gradientFrom || '#3b82f6'}
                        onChange={(e) => handleUpdate('gradientFrom', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.gradientFrom || '#3b82f6'}
                        onChange={(e) => handleUpdate('gradientFrom', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Fin
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.gradientTo || '#9333ea'}
                        onChange={(e) => handleUpdate('gradientTo', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.gradientTo || '#9333ea'}
                        onChange={(e) => handleUpdate('gradientTo', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview de fondo */}
              <div 
                className="p-8 rounded-xl text-center"
                style={getBackgroundStyle()}
              >
                <h1 className="text-3xl font-bold inline-flex items-center gap-2 flex-wrap justify-center">
                  <span 
                    style={{ 
                      color: blogHero.styles?.light?.titleColor || '#ffffff',
                      fontStyle: blogHero.titleStyle?.italic ? 'italic' : 'normal',
                      backgroundColor: blogHero.titleStyle?.hasBackground 
                        ? (blogHero.titleStyle?.backgroundColor || '#ffffff') 
                        : 'transparent',
                      padding: blogHero.titleStyle?.hasBackground 
                        ? (blogHero.titleStyle?.padding || '4px 16px') 
                        : '0',
                      borderRadius: blogHero.titleStyle?.hasBackground 
                        ? (blogHero.titleStyle?.borderRadius || '8px') 
                        : '0',
                    }}
                  >
                    {blogHero.title || 'Blog'}
                  </span>
                  {/* Texto destacado con soporte para fondo + gradiente */}
                  {(() => {
                    const { containerStyle, textStyle, useGradient } = getHighlightStyles();
                    return (
                      <span style={containerStyle}>
                        {useGradient ? (
                          <span style={textStyle}>{blogHero.titleHighlight || 'Tech'}</span>
                        ) : (
                          <span style={textStyle}>{blogHero.titleHighlight || 'Tech'}</span>
                        )}
                      </span>
                    );
                  })()}
                </h1>
                <p 
                  className="mt-4"
                  style={{ color: blogHero.styles?.light?.subtitleColor || '#bfdbfe' }}
                >
                  {blogHero.subtitle || 'Las últimas noticias y tendencias tecnológicas'}
                </p>
                <div className="mt-4 text-xs text-white/70">
                  {blogHero.backgroundImage ? '📷 Usando imagen de fondo' : '🎨 Usando gradiente'}
                </div>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeSubTab === 'stats' && (
            <div className="space-y-6">
              {/* Toggle de estadísticas */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    Mostrar Estadísticas
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Muestra el contador de artículos y lectores
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogHero.showStats !== false}
                    onChange={(e) => handleUpdate('showStats', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Configuración de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiqueta de Artículos
                  </label>
                  <input
                    type="text"
                    value={blogHero.stats?.articlesLabel || 'Artículos'}
                    onChange={(e) => handleUpdate('stats.articlesLabel', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Artículos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contador de Lectores
                  </label>
                  <input
                    type="text"
                    value={blogHero.stats?.readersCount || '15K+'}
                    onChange={(e) => handleUpdate('stats.readersCount', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15K+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiqueta de Lectores
                  </label>
                  <input
                    type="text"
                    value={blogHero.stats?.readersLabel || 'Lectores'}
                    onChange={(e) => handleUpdate('stats.readersLabel', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Lectores"
                  />
                </div>
              </div>

              {/* Preview de estadísticas */}
              <div 
                className="p-6 rounded-xl text-center"
                style={getBackgroundStyle()}
              >
                <div className="flex justify-center gap-8 text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">0+</div>
                    <div className="text-blue-200 text-sm">{blogHero.stats?.articlesLabel || 'Artículos'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{blogHero.stats?.readersCount || '15K+'}</div>
                    <div className="text-blue-200 text-sm">{blogHero.stats?.readersLabel || 'Lectores'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Tab */}
          {activeSubTab === 'search' && (
            <div className="space-y-6">
              {/* Textos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Placeholder del Buscador
                  </label>
                  <input
                    type="text"
                    value={blogHero.search?.placeholder || 'Buscar noticias...'}
                    onChange={(e) => handleUpdate('search.placeholder', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Buscar noticias..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    value={blogHero.search?.buttonText || 'Buscar'}
                    onChange={(e) => handleUpdate('search.buttonText', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Buscar"
                  />
                </div>
              </div>

              {/* ========== ESTILOS DEL INPUT DE BÚSQUEDA ========== */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  🔍 Estilos del Buscador
                </h3>

                {/* Tema Claro */}
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    ☀️ Tema Claro
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.light?.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.light?.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Texto</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.light?.textColor || '#1f2937'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.textColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.light?.textColor || '#1f2937'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.textColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Borde</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.light?.borderColor || '#e5e7eb'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.borderColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.light?.borderColor || '#e5e7eb'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.borderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Icono</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.light?.iconColor || '#9ca3af'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.iconColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.light?.iconColor || '#9ca3af'}
                          onChange={(e) => handleUpdate('search.inputStyles.light.iconColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ancho Borde</label>
                      <input
                        type="text"
                        value={blogHero.search?.inputStyles?.light?.borderWidth || '2px'}
                        onChange={(e) => handleUpdate('search.inputStyles.light.borderWidth', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="2px"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Radius</label>
                      <input
                        type="text"
                        value={blogHero.search?.inputStyles?.light?.borderRadius || '9999px'}
                        onChange={(e) => handleUpdate('search.inputStyles.light.borderRadius', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="9999px"
                      />
                    </div>
                  </div>

                  {/* Opción de Gradiente para el Borde - Tema Claro */}
                  <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌈 Borde con Gradiente</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogHero.search?.inputStyles?.light?.useGradientBorder ?? false}
                          onChange={(e) => handleUpdate('search.inputStyles.light.useGradientBorder', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {blogHero.search?.inputStyles?.light?.useGradientBorder && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Inicio</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={blogHero.search?.inputStyles?.light?.gradientBorderFrom || '#8b5cf6'}
                                onChange={(e) => handleUpdate('search.inputStyles.light.gradientBorderFrom', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={blogHero.search?.inputStyles?.light?.gradientBorderFrom || '#8b5cf6'}
                                onChange={(e) => handleUpdate('search.inputStyles.light.gradientBorderFrom', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Fin</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={blogHero.search?.inputStyles?.light?.gradientBorderTo || '#06b6d4'}
                                onChange={(e) => handleUpdate('search.inputStyles.light.gradientBorderTo', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={blogHero.search?.inputStyles?.light?.gradientBorderTo || '#06b6d4'}
                                onChange={(e) => handleUpdate('search.inputStyles.light.gradientBorderTo', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Dirección</label>
                          <select
                            value={blogHero.search?.inputStyles?.light?.gradientBorderDirection || 'to right'}
                            onChange={(e) => handleUpdate('search.inputStyles.light.gradientBorderDirection', e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"
                          >
                            <option value="to right">Horizontal →</option>
                            <option value="to left">Horizontal ←</option>
                            <option value="to bottom">Vertical ↓</option>
                            <option value="to top">Vertical ↑</option>
                            <option value="to bottom right">Diagonal ↘</option>
                            <option value="to bottom left">Diagonal ↙</option>
                          </select>
                        </div>
                        {/* Preview del gradiente */}
                        <div 
                          className="h-6 rounded-full"
                          style={{
                            background: `linear-gradient(${blogHero.search?.inputStyles?.light?.gradientBorderDirection || 'to right'}, ${blogHero.search?.inputStyles?.light?.gradientBorderFrom || '#8b5cf6'}, ${blogHero.search?.inputStyles?.light?.gradientBorderTo || '#06b6d4'})`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                    🌙 Tema Oscuro
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.dark?.backgroundColor || '#1f2937'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.dark?.backgroundColor || '#1f2937'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Texto</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.dark?.textColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.textColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.dark?.textColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.textColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Borde</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.dark?.borderColor || '#374151'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.borderColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.dark?.borderColor || '#374151'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.borderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Icono</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.inputStyles?.dark?.iconColor || '#9ca3af'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.iconColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.inputStyles?.dark?.iconColor || '#9ca3af'}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.iconColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Ancho Borde</label>
                      <input
                        type="text"
                        value={blogHero.search?.inputStyles?.dark?.borderWidth || '2px'}
                        onChange={(e) => handleUpdate('search.inputStyles.dark.borderWidth', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        placeholder="2px"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Border Radius</label>
                      <input
                        type="text"
                        value={blogHero.search?.inputStyles?.dark?.borderRadius || '9999px'}
                        onChange={(e) => handleUpdate('search.inputStyles.dark.borderRadius', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        placeholder="9999px"
                      />
                    </div>
                  </div>

                  {/* Opción de Gradiente para el Borde - Tema Oscuro */}
                  <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">🌈 Borde con Gradiente</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogHero.search?.inputStyles?.dark?.useGradientBorder ?? false}
                          onChange={(e) => handleUpdate('search.inputStyles.dark.useGradientBorder', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {blogHero.search?.inputStyles?.dark?.useGradientBorder && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Color Inicio</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={blogHero.search?.inputStyles?.dark?.gradientBorderFrom || '#8b5cf6'}
                                onChange={(e) => handleUpdate('search.inputStyles.dark.gradientBorderFrom', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border border-gray-500"
                              />
                              <input
                                type="text"
                                value={blogHero.search?.inputStyles?.dark?.gradientBorderFrom || '#8b5cf6'}
                                onChange={(e) => handleUpdate('search.inputStyles.dark.gradientBorderFrom', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Color Fin</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={blogHero.search?.inputStyles?.dark?.gradientBorderTo || '#06b6d4'}
                                onChange={(e) => handleUpdate('search.inputStyles.dark.gradientBorderTo', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border border-gray-500"
                              />
                              <input
                                type="text"
                                value={blogHero.search?.inputStyles?.dark?.gradientBorderTo || '#06b6d4'}
                                onChange={(e) => handleUpdate('search.inputStyles.dark.gradientBorderTo', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Dirección</label>
                          <select
                            value={blogHero.search?.inputStyles?.dark?.gradientBorderDirection || 'to right'}
                            onChange={(e) => handleUpdate('search.inputStyles.dark.gradientBorderDirection', e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200"
                          >
                            <option value="to right">Horizontal →</option>
                            <option value="to left">Horizontal ←</option>
                            <option value="to bottom">Vertical ↓</option>
                            <option value="to top">Vertical ↑</option>
                            <option value="to bottom right">Diagonal ↘</option>
                            <option value="to bottom left">Diagonal ↙</option>
                          </select>
                        </div>
                        {/* Preview del gradiente */}
                        <div 
                          className="h-6 rounded-full"
                          style={{
                            background: `linear-gradient(${blogHero.search?.inputStyles?.dark?.gradientBorderDirection || 'to right'}, ${blogHero.search?.inputStyles?.dark?.gradientBorderFrom || '#8b5cf6'}, ${blogHero.search?.inputStyles?.dark?.gradientBorderTo || '#06b6d4'})`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ========== ESTILOS DEL BOTÓN ========== */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  🔘 Estilos del Botón
                </h3>

                {/* Tema Claro - Botón */}
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    ☀️ Tema Claro
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.buttonStyles?.light?.backgroundColor || '#2563eb'}
                          onChange={(e) => handleUpdate('search.buttonStyles.light.backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.buttonStyles?.light?.backgroundColor || '#2563eb'}
                          onChange={(e) => handleUpdate('search.buttonStyles.light.backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color Texto</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.buttonStyles?.light?.textColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.buttonStyles.light.textColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.buttonStyles?.light?.textColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.buttonStyles.light.textColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fondo Hover</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.buttonStyles?.light?.hoverBackgroundColor || '#1d4ed8'}
                          onChange={(e) => handleUpdate('search.buttonStyles.light.hoverBackgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.buttonStyles?.light?.hoverBackgroundColor || '#1d4ed8'}
                          onChange={(e) => handleUpdate('search.buttonStyles.light.hoverBackgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Radius</label>
                      <input
                        type="text"
                        value={blogHero.search?.buttonStyles?.light?.borderRadius || '6px'}
                        onChange={(e) => handleUpdate('search.buttonStyles.light.borderRadius', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="6px"
                      />
                    </div>
                  </div>
                </div>

                {/* Tema Oscuro - Botón */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                    🌙 Tema Oscuro
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.buttonStyles?.dark?.backgroundColor || '#2563eb'}
                          onChange={(e) => handleUpdate('search.buttonStyles.dark.backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.buttonStyles?.dark?.backgroundColor || '#2563eb'}
                          onChange={(e) => handleUpdate('search.buttonStyles.dark.backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Texto</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.buttonStyles?.dark?.textColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.buttonStyles.dark.textColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.buttonStyles?.dark?.textColor || '#ffffff'}
                          onChange={(e) => handleUpdate('search.buttonStyles.dark.textColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Fondo Hover</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blogHero.search?.buttonStyles?.dark?.hoverBackgroundColor || '#1d4ed8'}
                          onChange={(e) => handleUpdate('search.buttonStyles.dark.hoverBackgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={blogHero.search?.buttonStyles?.dark?.hoverBackgroundColor || '#1d4ed8'}
                          onChange={(e) => handleUpdate('search.buttonStyles.dark.hoverBackgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Border Radius</label>
                      <input
                        type="text"
                        value={blogHero.search?.buttonStyles?.dark?.borderRadius || '6px'}
                        onChange={(e) => handleUpdate('search.buttonStyles.dark.borderRadius', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                        placeholder="6px"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview del buscador - Tema Claro */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  👁️ Vista Previa
                </h3>
                
                {/* Preview Tema Claro */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">☀️ Tema Claro:</p>
                  <div 
                    className="p-6 rounded-xl"
                    style={getBackgroundStyle()}
                  >
                    <div className="max-w-xl mx-auto">
                      {/* Wrapper para borde con gradiente */}
                      <div 
                        className="relative"
                        style={blogHero.search?.inputStyles?.light?.useGradientBorder ? {
                          padding: blogHero.search?.inputStyles?.light?.borderWidth || '2px',
                          background: `linear-gradient(${blogHero.search?.inputStyles?.light?.gradientBorderDirection || 'to right'}, ${blogHero.search?.inputStyles?.light?.gradientBorderFrom || '#8b5cf6'}, ${blogHero.search?.inputStyles?.light?.gradientBorderTo || '#06b6d4'})`,
                          borderRadius: blogHero.search?.inputStyles?.light?.borderRadius || '9999px',
                        } : undefined}
                      >
                        <div className="relative">
                          <div 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2"
                            style={{ color: blogHero.search?.inputStyles?.light?.iconColor || '#9ca3af' }}
                          >
                            <Search className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            placeholder={blogHero.search?.placeholder || 'Buscar noticias...'}
                            className="w-full pl-12 pr-28 py-4 shadow-lg"
                            style={{
                              backgroundColor: blogHero.search?.inputStyles?.light?.backgroundColor || '#ffffff',
                              color: blogHero.search?.inputStyles?.light?.textColor || '#1f2937',
                              border: blogHero.search?.inputStyles?.light?.useGradientBorder 
                                ? 'none' 
                                : `${blogHero.search?.inputStyles?.light?.borderWidth || '2px'} solid ${blogHero.search?.inputStyles?.light?.borderColor || '#e5e7eb'}`,
                              borderRadius: blogHero.search?.inputStyles?.light?.borderRadius || '9999px',
                            }}
                            readOnly
                          />
                          <button 
                            className="absolute right-2 top-2 px-6 py-2 font-medium transition-colors"
                            style={{
                              backgroundColor: blogHero.search?.buttonStyles?.light?.backgroundColor || '#2563eb',
                              color: blogHero.search?.buttonStyles?.light?.textColor || '#ffffff',
                              borderRadius: blogHero.search?.buttonStyles?.light?.borderRadius || '9999px',
                            }}
                          >
                            {blogHero.search?.buttonText || 'Buscar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Tema Oscuro */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">🌙 Tema Oscuro:</p>
                  <div 
                    className="p-6 rounded-xl"
                    style={getBackgroundStyle()}
                  >
                    <div className="max-w-xl mx-auto">
                      {/* Wrapper para borde con gradiente */}
                      <div 
                        className="relative"
                        style={blogHero.search?.inputStyles?.dark?.useGradientBorder ? {
                          padding: blogHero.search?.inputStyles?.dark?.borderWidth || '2px',
                          background: `linear-gradient(${blogHero.search?.inputStyles?.dark?.gradientBorderDirection || 'to right'}, ${blogHero.search?.inputStyles?.dark?.gradientBorderFrom || '#8b5cf6'}, ${blogHero.search?.inputStyles?.dark?.gradientBorderTo || '#06b6d4'})`,
                          borderRadius: blogHero.search?.inputStyles?.dark?.borderRadius || '9999px',
                        } : undefined}
                      >
                        <div className="relative">
                          <div 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2"
                            style={{ color: blogHero.search?.inputStyles?.dark?.iconColor || '#9ca3af' }}
                          >
                            <Search className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            placeholder={blogHero.search?.placeholder || 'Buscar noticias...'}
                            className="w-full pl-12 pr-28 py-4 shadow-lg"
                            style={{
                              backgroundColor: blogHero.search?.inputStyles?.dark?.backgroundColor || '#1f2937',
                              color: blogHero.search?.inputStyles?.dark?.textColor || '#ffffff',
                              border: blogHero.search?.inputStyles?.dark?.useGradientBorder 
                                ? 'none' 
                                : `${blogHero.search?.inputStyles?.dark?.borderWidth || '2px'} solid ${blogHero.search?.inputStyles?.dark?.borderColor || '#374151'}`,
                              borderRadius: blogHero.search?.inputStyles?.dark?.borderRadius || '9999px',
                            }}
                            readOnly
                          />
                          <button 
                            className="absolute right-2 top-2 px-6 py-2 font-medium transition-colors"
                            style={{
                              backgroundColor: blogHero.search?.buttonStyles?.dark?.backgroundColor || '#2563eb',
                              color: blogHero.search?.buttonStyles?.dark?.textColor || '#ffffff',
                              borderRadius: blogHero.search?.buttonStyles?.dark?.borderRadius || '9999px',
                            }}
                          >
                            {blogHero.search?.buttonText || 'Buscar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogHeroConfigSection;
