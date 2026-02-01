/**
 * 🎯 HeroConfigSection
 * Configuración del Hero Section para la página Home
 * Soporta imagen de fondo O gradiente de colores
 */

import React, { useState, useRef } from 'react';
import { Type, Image, Upload, Trash2, Palette } from 'lucide-react';
import type { PageData } from '../../types/cms';
import { uploadImage } from '../../services/imageService';

interface HeroConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const HeroConfigSection: React.FC<HeroConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'background' | 'styles'>('content');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener configuración actual del hero
  const hero = pageData?.content?.hero || {
    title: 'Potencia tu negocio',
    titleHighlight: 'con tecnología',
    subtitle: 'Soluciones tecnológicas para impulsar tu empresa',
    ctaText: 'Empezar ahora',
    ctaLink: '/contacto',
    backgroundImage: { light: '', dark: '' },
    backgroundOverlay: 0.5,
    gradientFrom: '#3b82f6',
    gradientTo: '#9333ea',
    styles: {
      light: {
        titleColor: '#1f2937',
        titleHighlightColor: '#8B5CF6',
        subtitleColor: '#4b5563',
        ctaBackgroundColor: '#8B5CF6',
        ctaTextColor: '#ffffff',
        ctaHoverColor: '#7c3aed',
      },
      dark: {
        titleColor: '#f9fafb',
        titleHighlightColor: '#A78BFA',
        subtitleColor: '#d1d5db',
        ctaBackgroundColor: '#8B5CF6',
        ctaTextColor: '#ffffff',
        ctaHoverColor: '#7c3aed',
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, theme: 'light' | 'dark') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage({
        file,
        category: 'hero',
        title: `Hero Background ${theme}`,
        alt: `Fondo del hero - tema ${theme}`
      });
      
      if (result?.url) {
        const currentBg = hero.backgroundImage || { light: '', dark: '' };
        const newBg = typeof currentBg === 'string' 
          ? { light: theme === 'light' ? result.url : '', dark: theme === 'dark' ? result.url : '' }
          : { ...currentBg, [theme]: result.url };
        updateContent('hero.backgroundImage', newBg);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearBackgroundImage = (theme: 'light' | 'dark') => {
    const currentBg = hero.backgroundImage || { light: '', dark: '' };
    const newBg = typeof currentBg === 'string' 
      ? { light: '', dark: '' }
      : { ...currentBg, [theme]: '' };
    updateContent('hero.backgroundImage', newBg);
  };

  const getBackgroundImage = (theme: 'light' | 'dark') => {
    if (typeof hero.backgroundImage === 'string') {
      return hero.backgroundImage;
    }
    return hero.backgroundImage?.[theme] || '';
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50 overflow-hidden">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
          🚀 Hero Section
        </span>
        <span className="text-sm text-gray-500">
          {isExpanded ? '▲ Ocultar' : '▼ Mostrar'}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Sub-tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {[
              { id: 'content', label: '📝 Contenido', icon: Type },
              { id: 'background', label: '🖼️ Fondo', icon: Image },
              { id: 'styles', label: '🎨 Estilos', icon: Palette },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500 bg-white dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {/* ===== TAB: CONTENIDO ===== */}
            {activeSubTab === 'content' && (
              <div className="space-y-4">
                {/* Título principal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={hero.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Potencia tu negocio"
                  />
                </div>

                {/* Palabra destacada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Texto Destacado (segunda línea)
                  </label>
                  <input
                    type="text"
                    value={hero.titleHighlight || ''}
                    onChange={(e) => updateContent('hero.titleHighlight', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="con tecnología"
                  />
                </div>

                {/* Subtítulo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    value={hero.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={2}
                    placeholder="Soluciones tecnológicas para impulsar tu empresa"
                  />
                </div>

                {/* CTA */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={hero.ctaText || ''}
                      onChange={(e) => updateContent('hero.ctaText', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Empezar ahora"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enlace del Botón
                    </label>
                    <input
                      type="text"
                      value={hero.ctaLink || ''}
                      onChange={(e) => updateContent('hero.ctaLink', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="/contacto"
                    />
                  </div>
                </div>

                {/* Vista previa */}
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {hero.title || 'Título'}
                    </h2>
                    <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {hero.titleHighlight || 'Destacado'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {hero.subtitle || 'Subtítulo'}
                    </p>
                    <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
                      {hero.ctaText || 'CTA'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== TAB: FONDO ===== */}
            {activeSubTab === 'background' && (
              <div className="space-y-4">
                {/* Imagen de fondo - Modo Claro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🌞 Imagen de Fondo (Modo Claro)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getBackgroundImage('light')}
                      onChange={(e) => {
                        const currentBg = hero.backgroundImage || { light: '', dark: '' };
                        const newBg = typeof currentBg === 'string' 
                          ? { light: e.target.value, dark: '' }
                          : { ...currentBg, light: e.target.value };
                        updateContent('hero.backgroundImage', newBg);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="URL de la imagen o sube una"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'light')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    {getBackgroundImage('light') && (
                      <button
                        type="button"
                        onClick={() => clearBackgroundImage('light')}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {getBackgroundImage('light') && (
                    <div className="mt-2 h-24 rounded-lg overflow-hidden">
                      <img 
                        src={getBackgroundImage('light')} 
                        alt="Preview light" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Imagen de fondo - Modo Oscuro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🌙 Imagen de Fondo (Modo Oscuro)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getBackgroundImage('dark')}
                      onChange={(e) => {
                        const currentBg = hero.backgroundImage || { light: '', dark: '' };
                        const newBg = typeof currentBg === 'string' 
                          ? { light: '', dark: e.target.value }
                          : { ...currentBg, dark: e.target.value };
                        updateContent('hero.backgroundImage', newBg);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="URL de la imagen o sube una"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => handleImageUpload(e as any, 'dark');
                        input.click();
                      }}
                      disabled={isUploading}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    {getBackgroundImage('dark') && (
                      <button
                        type="button"
                        onClick={() => clearBackgroundImage('dark')}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {getBackgroundImage('dark') && (
                    <div className="mt-2 h-24 rounded-lg overflow-hidden">
                      <img 
                        src={getBackgroundImage('dark')} 
                        alt="Preview dark" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Opacidad del Overlay: {Math.round((hero.backgroundOverlay || 0.5) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={hero.backgroundOverlay || 0.5}
                    onChange={(e) => updateContent('hero.backgroundOverlay', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Gradiente de respaldo */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color Gradiente 1
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={hero.gradientFrom || '#3b82f6'}
                        onChange={(e) => updateContent('hero.gradientFrom', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={hero.gradientFrom || '#3b82f6'}
                        onChange={(e) => updateContent('hero.gradientFrom', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color Gradiente 2
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={hero.gradientTo || '#9333ea'}
                        onChange={(e) => updateContent('hero.gradientTo', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={hero.gradientTo || '#9333ea'}
                        onChange={(e) => updateContent('hero.gradientTo', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Vista previa gradiente */}
                <div 
                  className="h-16 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${hero.gradientFrom || '#3b82f6'}, ${hero.gradientTo || '#9333ea'})`
                  }}
                />
              </div>
            )}

            {/* ===== TAB: ESTILOS ===== */}
            {activeSubTab === 'styles' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configura los colores del texto para cada modo de tema
                </p>

                {/* Modo Claro */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">🌞 Modo Claro</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color Título</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.light?.titleColor || '#1f2937'}
                          onChange={(e) => updateContent('hero.styles.light.titleColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.light?.titleColor || '#1f2937'}
                          onChange={(e) => updateContent('hero.styles.light.titleColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color Destacado</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.light?.titleHighlightColor || '#8B5CF6'}
                          onChange={(e) => updateContent('hero.styles.light.titleHighlightColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.light?.titleHighlightColor || '#8B5CF6'}
                          onChange={(e) => updateContent('hero.styles.light.titleHighlightColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color Subtítulo</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.light?.subtitleColor || '#4b5563'}
                          onChange={(e) => updateContent('hero.styles.light.subtitleColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.light?.subtitleColor || '#4b5563'}
                          onChange={(e) => updateContent('hero.styles.light.subtitleColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color Botón</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.light?.ctaBackgroundColor || '#8B5CF6'}
                          onChange={(e) => updateContent('hero.styles.light.ctaBackgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.light?.ctaBackgroundColor || '#8B5CF6'}
                          onChange={(e) => updateContent('hero.styles.light.ctaBackgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modo Oscuro */}
                <div className="p-3 bg-gray-800 dark:bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">🌙 Modo Oscuro</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Título</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.dark?.titleColor || '#f9fafb'}
                          onChange={(e) => updateContent('hero.styles.dark.titleColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.dark?.titleColor || '#f9fafb'}
                          onChange={(e) => updateContent('hero.styles.dark.titleColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Destacado</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.dark?.titleHighlightColor || '#A78BFA'}
                          onChange={(e) => updateContent('hero.styles.dark.titleHighlightColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.dark?.titleHighlightColor || '#A78BFA'}
                          onChange={(e) => updateContent('hero.styles.dark.titleHighlightColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Subtítulo</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.dark?.subtitleColor || '#d1d5db'}
                          onChange={(e) => updateContent('hero.styles.dark.subtitleColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.dark?.subtitleColor || '#d1d5db'}
                          onChange={(e) => updateContent('hero.styles.dark.subtitleColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color Botón</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.styles?.dark?.ctaBackgroundColor || '#8B5CF6'}
                          onChange={(e) => updateContent('hero.styles.dark.ctaBackgroundColor', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={hero.styles?.dark?.ctaBackgroundColor || '#8B5CF6'}
                          onChange={(e) => updateContent('hero.styles.dark.ctaBackgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        />
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

export default HeroConfigSection;
