/**
 * 📢 BlogCtaConfigSectionCompact - Versión Compacta
 * Configuración optimizada del CTA del Blog
 * 
 * MEJORAS vs versión original (1,607 líneas):
 * - Usa componentes compartidos de CompactStyleEditors
 * - Sistema de sub-tabs organizado
 * - ~250 líneas (85% menos código)
 * - Vista previa unificada
 */

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  CompactSection,
  CompactToggle,
  CompactGradientPicker,
  CompactColorPicker,
} from '../shared/CompactStyleEditors';
import type { BlogCtaConfig } from '../../../hooks/blog/useBlogCmsConfig';
import { DEFAULT_BLOG_CTA_CONFIG } from '../../../hooks/blog/useBlogCmsConfig';
import ImageSelectorModal from '../../ImageSelectorModal';

interface Props {
  config: BlogCtaConfig;
  onChange: (config: BlogCtaConfig) => void;
}

type TabType = 'content' | 'background' | 'buttons' | 'card';

export const BlogCtaConfigSectionCompact: React.FC<Props> = ({ config, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  // Merge con defaults
  const ctaConfig: BlogCtaConfig = { ...DEFAULT_BLOG_CTA_CONFIG, ...config };

  // Handler genérico
  const handleChange = (key: string, value: any) => {
    onChange({ ...ctaConfig, [key]: value });
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'content', label: 'Contenido', icon: '📝' },
    { id: 'background', label: 'Fondo', icon: '🖼️' },
    { id: 'buttons', label: 'Botones', icon: '🔘' },
    { id: 'card', label: 'Tarjeta', icon: '🃏' },
  ];

  return (
    <>
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelect={(url) => { handleChange('bgImage', url); setIsImageSelectorOpen(false); }}
        currentImage={ctaConfig.bgImage}
        title="Seleccionar imagen de fondo"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📢</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Sección CTA (Último Llamado)</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Call to action al final del blog</p>
            </div>
          </div>
          <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            {/* Toggle Visibilidad */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <CompactToggle
                label="Mostrar Sección CTA"
                description="Activa/desactiva la sección completa"
                checked={ctaConfig.showSection !== false}
                onChange={(v) => handleChange('showSection', v)}
              />
            </div>

            {/* Sub-Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-800'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              {/* TAB: Contenido */}
              {activeTab === 'content' && (
                <ContentTab ctaConfig={ctaConfig} handleChange={handleChange} />
              )}

              {/* TAB: Fondo */}
              {activeTab === 'background' && (
                <BackgroundTab 
                  ctaConfig={ctaConfig} 
                  handleChange={handleChange}
                  onOpenImageSelector={() => setIsImageSelectorOpen(true)}
                />
              )}

              {/* TAB: Botones */}
              {activeTab === 'buttons' && (
                <ButtonsTab ctaConfig={ctaConfig} handleChange={handleChange} />
              )}

              {/* TAB: Tarjeta */}
              {activeTab === 'card' && (
                <CardTab ctaConfig={ctaConfig} handleChange={handleChange} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ============================================
// SUB-COMPONENTES (TABS)
// ============================================

interface TabProps {
  ctaConfig: BlogCtaConfig;
  handleChange: (key: string, value: any) => void;
}

// TAB: Contenido
const ContentTab: React.FC<TabProps> = ({ ctaConfig, handleChange }) => (
  <div className="space-y-4">
    {/* Vista Previa */}
    <div 
      className="rounded-lg p-6 text-center"
      style={{ 
        background: ctaConfig.bgType === 'gradient' 
          ? `linear-gradient(to bottom right, ${ctaConfig.bgGradientFrom}, ${ctaConfig.bgGradientTo})`
          : ctaConfig.bgColorLight
      }}
    >
      <h3 className="text-xl font-bold mb-2" style={{ color: ctaConfig.titleColor }}>
        {ctaConfig.title?.replace(ctaConfig.titleHighlight || '', '')}
        <span style={{ 
          background: ctaConfig.titleHighlightUseGradient 
            ? `linear-gradient(to right, ${ctaConfig.titleHighlightGradientFrom}, ${ctaConfig.titleHighlightGradientTo})`
            : 'none',
          color: ctaConfig.titleHighlightUseGradient ? 'transparent' : ctaConfig.titleHighlightColor,
          WebkitBackgroundClip: ctaConfig.titleHighlightUseGradient ? 'text' : 'unset',
          backgroundClip: ctaConfig.titleHighlightUseGradient ? 'text' : 'unset',
        }}>
          {ctaConfig.titleHighlight}
        </span>
      </h3>
      <p className="text-sm" style={{ color: ctaConfig.subtitleColor }}>{ctaConfig.subtitle}</p>
    </div>

    {/* Textos */}
    <CompactSection title="Textos Principales" icon="📝" defaultOpen>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Título Principal</label>
          <input type="text" value={ctaConfig.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Palabra Destacada</label>
            <input type="text" value={ctaConfig.titleHighlight || ''} onChange={(e) => handleChange('titleHighlight', e.target.value)} className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Texto Botón</label>
            <input type="text" value={ctaConfig.buttonText || ''} onChange={(e) => handleChange('buttonText', e.target.value)} className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Subtítulo</label>
          <textarea value={ctaConfig.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} rows={2} className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg resize-none" />
        </div>
      </div>
    </CompactSection>

    {/* Colores de Texto */}
    <CompactSection title="Colores de Texto" icon="🎨" defaultOpen>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CompactColorPicker label="Título" value={ctaConfig.titleColor || '#ffffff'} onChange={(v) => handleChange('titleColor', v)} />
        </div>
        <div className="flex items-center gap-2">
          <CompactColorPicker label="Subtítulo" value={ctaConfig.subtitleColor || '#c4b5fd'} onChange={(v) => handleChange('subtitleColor', v)} />
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <CompactToggle
            label="Usar Gradiente en Destacado"
            checked={ctaConfig.titleHighlightUseGradient || false}
            onChange={(v) => handleChange('titleHighlightUseGradient', v)}
          />
          {ctaConfig.titleHighlightUseGradient ? (
            <div className="mt-2">
              <CompactGradientPicker
                fromColor={ctaConfig.titleHighlightGradientFrom || '#a78bfa'}
                toColor={ctaConfig.titleHighlightGradientTo || '#06b6d4'}
                direction="90deg"
                onFromChange={(v) => handleChange('titleHighlightGradientFrom', v)}
                onToChange={(v) => handleChange('titleHighlightGradientTo', v)}
                onDirectionChange={() => {}}
                showPreview
              />
            </div>
          ) : (
            <div className="mt-2">
              <CompactColorPicker label="Color Destacado" value={ctaConfig.titleHighlightColor || '#a78bfa'} onChange={(v) => handleChange('titleHighlightColor', v)} />
            </div>
          )}
        </div>
      </div>
    </CompactSection>
  </div>
);

// TAB: Fondo
const BackgroundTab: React.FC<TabProps & { onOpenImageSelector: () => void }> = ({ ctaConfig, handleChange, onOpenImageSelector }) => (
  <div className="space-y-4">
    {/* Vista Previa */}
    <div 
      className="h-24 rounded-lg flex items-center justify-center text-white relative overflow-hidden"
      style={
        ctaConfig.bgType === 'image' && ctaConfig.bgImage
          ? { backgroundImage: `linear-gradient(rgba(0,0,0,${ctaConfig.bgOverlay}), rgba(0,0,0,${ctaConfig.bgOverlay})), url(${ctaConfig.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : ctaConfig.bgType === 'gradient'
            ? { background: `linear-gradient(to bottom right, ${ctaConfig.bgGradientFrom}, ${ctaConfig.bgGradientTo})` }
            : { backgroundColor: ctaConfig.bgColorLight }
      }
    >
      <span className="text-sm font-bold">Vista Previa del Fondo</span>
    </div>

    {/* Tipo de Fondo */}
    <CompactSection title="Tipo de Fondo" icon="🎨" defaultOpen>
      <div className="space-y-3">
        <div className="flex gap-2">
          {(['solid', 'gradient', 'image'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleChange('bgType', type)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                ctaConfig.bgType === type
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {type === 'solid' ? '🎨 Sólido' : type === 'gradient' ? '🌈 Gradiente' : '🖼️ Imagen'}
            </button>
          ))}
        </div>

        {ctaConfig.bgType === 'solid' && (
          <CompactColorPicker label="Color de Fondo" value={ctaConfig.bgColorLight || '#1e1b4b'} onChange={(v) => handleChange('bgColorLight', v)} />
        )}

        {ctaConfig.bgType === 'gradient' && (
          <CompactGradientPicker
            fromColor={ctaConfig.bgGradientFrom || '#1e1b4b'}
            toColor={ctaConfig.bgGradientTo || '#312e81'}
            direction="135deg"
            onFromChange={(v) => handleChange('bgGradientFrom', v)}
            onToChange={(v) => handleChange('bgGradientTo', v)}
            onDirectionChange={() => {}}
            showPreview
          />
        )}

        {ctaConfig.bgType === 'image' && (
          <div className="space-y-2">
            {ctaConfig.bgImage ? (
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <img src={ctaConfig.bgImage} alt="Fondo" className="w-16 h-10 object-cover rounded" />
                <div className="flex-1 truncate text-xs text-gray-500">{ctaConfig.bgImage}</div>
                <button onClick={() => handleChange('bgImage', '')} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={onOpenImageSelector} className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center hover:border-purple-500 transition-colors text-sm text-gray-500">
                📷 Seleccionar imagen
              </button>
            )}
            {ctaConfig.bgImage && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Opacidad Overlay ({Math.round((ctaConfig.bgOverlay || 0.5) * 100)}%)</label>
                <input type="range" min="0" max="1" step="0.1" value={ctaConfig.bgOverlay || 0.5} onChange={(e) => handleChange('bgOverlay', parseFloat(e.target.value))} className="w-full" />
              </div>
            )}
          </div>
        )}
      </div>
    </CompactSection>

    {/* Patrón Decorativo */}
    <CompactSection title="Patrón Decorativo" icon="✨" defaultOpen={false}>
      <div className="space-y-2">
        <CompactToggle label="Mostrar Patrón" checked={ctaConfig.showPattern || false} onChange={(v) => handleChange('showPattern', v)} />
        {ctaConfig.showPattern && (
          <>
            <div className="flex gap-2">
              {(['dots', 'grid', 'waves', 'none'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleChange('patternType', type)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded transition-colors ${
                    ctaConfig.patternType === type ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Opacidad ({Math.round((ctaConfig.patternOpacity || 0.1) * 100)}%)</label>
              <input type="range" min="0" max="0.5" step="0.05" value={ctaConfig.patternOpacity || 0.1} onChange={(e) => handleChange('patternOpacity', parseFloat(e.target.value))} className="w-full" />
            </div>
          </>
        )}
      </div>
    </CompactSection>
  </div>
);

// TAB: Botones
const ButtonsTab: React.FC<TabProps> = ({ ctaConfig, handleChange }) => (
  <div className="space-y-4">
    {/* Vista Previa */}
    <div className="flex justify-center gap-3 p-4 bg-gray-900 rounded-lg">
      <button
        className="px-6 py-2 font-medium transition-all"
        style={{
          background: ctaConfig.buttonUseGradient
            ? `linear-gradient(to right, ${ctaConfig.buttonGradientFrom}, ${ctaConfig.buttonGradientTo})`
            : ctaConfig.buttonBgColor,
          color: ctaConfig.buttonTextColor,
          borderRadius: ctaConfig.buttonBorderRadius,
        }}
      >
        {ctaConfig.buttonText}
      </button>
      {ctaConfig.showSecondaryButton && (
        <button
          className="px-6 py-2 font-medium"
          style={{
            backgroundColor: ctaConfig.secondaryButtonBgTransparent ? 'transparent' : ctaConfig.secondaryButtonBgColor,
            color: ctaConfig.secondaryButtonTextColor,
            borderRadius: ctaConfig.secondaryButtonBorderRadius,
            border: `${ctaConfig.secondaryButtonBorderWidth}px solid ${ctaConfig.secondaryButtonBorderColor}`,
          }}
        >
          {ctaConfig.secondaryButtonText}
        </button>
      )}
    </div>

    {/* Botón Principal */}
    <CompactSection title="Botón Principal" icon="🔘" defaultOpen>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Texto</label>
            <input type="text" value={ctaConfig.buttonText || ''} onChange={(e) => handleChange('buttonText', e.target.value)} className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Enlace</label>
            <input type="text" value={ctaConfig.buttonLink || ''} onChange={(e) => handleChange('buttonLink', e.target.value)} className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700" />
          </div>
        </div>
        <CompactToggle label="Usar Gradiente" checked={ctaConfig.buttonUseGradient || false} onChange={(v) => handleChange('buttonUseGradient', v)} />
        {ctaConfig.buttonUseGradient ? (
          <CompactGradientPicker
            fromColor={ctaConfig.buttonGradientFrom || '#8b5cf6'}
            toColor={ctaConfig.buttonGradientTo || '#06b6d4'}
            direction="90deg"
            onFromChange={(v) => handleChange('buttonGradientFrom', v)}
            onToChange={(v) => handleChange('buttonGradientTo', v)}
            onDirectionChange={() => {}}
            showPreview
          />
        ) : (
          <CompactColorPicker label="Color Fondo" value={ctaConfig.buttonBgColor || '#8b5cf6'} onChange={(v) => handleChange('buttonBgColor', v)} />
        )}
        <CompactColorPicker label="Color Texto" value={ctaConfig.buttonTextColor || '#ffffff'} onChange={(v) => handleChange('buttonTextColor', v)} />
      </div>
    </CompactSection>

    {/* Botón Secundario */}
    <CompactSection title="Botón Secundario" icon="🔲" defaultOpen={false}>
      <div className="space-y-2">
        <CompactToggle label="Mostrar Botón Secundario" checked={ctaConfig.showSecondaryButton || false} onChange={(v) => handleChange('showSecondaryButton', v)} />
        {ctaConfig.showSecondaryButton && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Texto</label>
                <input type="text" value={ctaConfig.secondaryButtonText || ''} onChange={(e) => handleChange('secondaryButtonText', e.target.value)} className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Enlace</label>
                <input type="text" value={ctaConfig.secondaryButtonLink || ''} onChange={(e) => handleChange('secondaryButtonLink', e.target.value)} className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700" />
              </div>
            </div>
            <CompactColorPicker label="Color Texto" value={ctaConfig.secondaryButtonTextColor || '#ffffff'} onChange={(v) => handleChange('secondaryButtonTextColor', v)} />
            <CompactColorPicker label="Color Borde" value={ctaConfig.secondaryButtonBorderColor || '#ffffff'} onChange={(v) => handleChange('secondaryButtonBorderColor', v)} />
          </>
        )}
      </div>
    </CompactSection>
  </div>
);

// TAB: Tarjeta
const CardTab: React.FC<TabProps> = ({ ctaConfig, handleChange }) => (
  <div className="space-y-4">
    <CompactToggle label="Mostrar Tarjeta Contenedora" description="Envuelve el contenido en una tarjeta" checked={ctaConfig.showCard || false} onChange={(v) => handleChange('showCard', v)} />

    {ctaConfig.showCard && (
      <>
        {/* Vista Previa */}
        <div 
          className="rounded-lg p-4 flex items-center justify-center h-20"
          style={{
            background: ctaConfig.cardBgUseGradient
              ? `linear-gradient(to right, ${ctaConfig.cardBgGradientFrom}, ${ctaConfig.cardBgGradientTo})`
              : ctaConfig.cardBgColor,
            borderRadius: ctaConfig.cardBorderRadius,
            border: `${ctaConfig.cardBorderWidth}px solid ${ctaConfig.cardBorderColor}`,
          }}
        >
          <span className="text-sm text-white">Vista Previa Tarjeta</span>
        </div>

        <CompactSection title="Estilos de Tarjeta" icon="🃏" defaultOpen>
          <div className="space-y-2">
            <CompactToggle label="Fondo Gradiente" checked={ctaConfig.cardBgUseGradient || false} onChange={(v) => handleChange('cardBgUseGradient', v)} />
            {ctaConfig.cardBgUseGradient ? (
              <CompactGradientPicker
                fromColor={ctaConfig.cardBgGradientFrom || '#0d9488'}
                toColor={ctaConfig.cardBgGradientTo || '#1e3a5f'}
                direction="90deg"
                onFromChange={(v) => handleChange('cardBgGradientFrom', v)}
                onToChange={(v) => handleChange('cardBgGradientTo', v)}
                onDirectionChange={() => {}}
                showPreview
              />
            ) : (
              <CompactColorPicker label="Color Fondo" value={ctaConfig.cardBgColor || '#1e3a5f'} onChange={(v) => handleChange('cardBgColor', v)} />
            )}
            <CompactColorPicker label="Color Borde" value={ctaConfig.cardBorderColor || 'rgba(255, 255, 255, 0.2)'} onChange={(v) => handleChange('cardBorderColor', v)} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Radius</label>
                <input type="text" value={ctaConfig.cardBorderRadius || '24px'} onChange={(e) => handleChange('cardBorderRadius', e.target.value)} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Padding</label>
                <input type="text" value={ctaConfig.cardPadding || '48px'} onChange={(e) => handleChange('cardPadding', e.target.value)} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </CompactSection>
      </>
    )}
  </div>
);

export default BlogCtaConfigSectionCompact;
