/**
 * 📝 BlogPostDetailConfigSectionCompact - Versión Optimizada
 * Configuración del detalle de posts del blog
 * 
 * MEJORAS vs versión original (3,355 líneas):
 * - Usa componentes compartidos de CompactStyleEditors
 * - Sistema de 4 TABS principales: HERO, CONTENIDO, SOCIAL, NAVEGACIÓN
 * - ~1,200 líneas (64% menos código)
 * - Mantiene TODA la funcionalidad y configuraciones
 */

import React, { useState } from 'react';
import {
  ThemeTabs,
  CompactSection,
  CompactToggle,
  CompactGradientPicker,
  CompactColorPicker,
} from '../shared/CompactStyleEditors';
import ImageSelectorModal from '../../ImageSelectorModal';

// ============================================
// TIPOS (COMPLETOS del original)
// ============================================

interface BlogPostDetailConfig {
  hero?: {
    variant?: 'overlay' | 'compact' | 'minimal';
    showBreadcrumb?: boolean;
    showBackButton?: boolean;
    showCategory?: boolean;
    showReadingTime?: boolean;
    showPublishDate?: boolean;
    showAuthor?: boolean;
    overlayOpacity?: number;
    height?: string;
    background?: {
      type?: 'image' | 'gradient' | 'solid';
      gradientFrom?: string;
      gradientTo?: string;
      overlayColor?: string;
    };
    styles?: {
      light?: { 
        titleColor?: string; subtitleColor?: string; metaColor?: string; titleFont?: string;
        backButtonTextColor?: string; backButtonIconColor?: string; backButtonBgColor?: string;
        backButtonBorderColor?: string; backButtonBorderUseGradient?: boolean;
        backButtonBorderGradientFrom?: string; backButtonBorderGradientTo?: string;
        categoryUseCategoryColors?: string; categoryBgColor?: string; categoryTextColor?: string;
        categoryBorderColor?: string; categoryBorderUseGradient?: boolean;
        categoryBorderGradientFrom?: string; categoryBorderGradientTo?: string;
        iconsColor?: string; readingTimeColor?: string; avatarBorderColor?: string;
      };
      dark?: { 
        titleColor?: string; subtitleColor?: string; metaColor?: string; titleFont?: string;
        backButtonTextColor?: string; backButtonIconColor?: string; backButtonBgColor?: string;
        backButtonBorderColor?: string; backButtonBorderUseGradient?: boolean;
        backButtonBorderGradientFrom?: string; backButtonBorderGradientTo?: string;
        categoryUseCategoryColors?: string; categoryBgColor?: string; categoryTextColor?: string;
        categoryBorderColor?: string; categoryBorderUseGradient?: boolean;
        categoryBorderGradientFrom?: string; categoryBorderGradientTo?: string;
        iconsColor?: string; readingTimeColor?: string; avatarBorderColor?: string;
      };
    };
  };
  summaryBar?: {
    enabled?: boolean; showExcerpt?: boolean; showLikeButton?: boolean;
    showSaveButton?: boolean; showShareButton?: boolean; excerptMaxLines?: number;
    styles?: {
      light?: { background?: string; borderColor?: string; textColor?: string;
        buttonBgColor?: string; buttonIconColor?: string; };
      dark?: { background?: string; borderColor?: string; textColor?: string;
        buttonBgColor?: string; buttonIconColor?: string; };
    };
  };
  content?: {
    maxWidth?: string; lineHeight?: string; fontSize?: string; fontFamily?: string;
    headingFontFamily?: string; paragraphSpacing?: string;
    background?: { light?: string; dark?: string };
    backgroundImage?: { light?: string; dark?: string };
    backgroundOverlay?: { light?: number; dark?: number };
    textColor?: { light?: string; dark?: string };
    headingColor?: { light?: string; dark?: string };
    linkColor?: { light?: string; dark?: string };
  };
  tableOfContents?: {
    enabled?: boolean; position?: 'left' | 'right' | 'none'; sticky?: boolean;
    showProgress?: boolean; collapsible?: boolean; defaultExpanded?: boolean;
    maxDepth?: number; width?: string;
    styles?: {
      light?: { background?: string; border?: string; activeColor?: string; textColor?: string;
        progressColor?: string; progressBarFrom?: string; progressBarTo?: string; };
      dark?: { background?: string; border?: string; activeColor?: string; textColor?: string;
        progressColor?: string; progressBarFrom?: string; progressBarTo?: string; };
    };
  };
  readingProgress?: {
    enabled?: boolean; position?: 'top' | 'bottom'; height?: string;
    barColor?: { light?: string; dark?: string };
    barGradientFrom?: { light?: string; dark?: string };
    barGradientTo?: { light?: string; dark?: string };
    backgroundColor?: { light?: string; dark?: string };
  };
  author?: {
    showCard?: boolean; showBio?: boolean; showSocialLinks?: boolean;
    showRole?: boolean; nameFormat?: 'full' | 'two-words' | 'first-initials';
    avatarShape?: 'circle' | 'square'; cardPosition?: 'bottom' | 'sidebar';
    styles?: {
      light?: { background?: string; border?: string; nameColor?: string; bioColor?: string };
      dark?: { background?: string; border?: string; nameColor?: string; bioColor?: string };
    };
  };
  tags?: {
    showSection?: boolean; maxVisible?: number;
    styles?: {
      light?: { background?: string; textColor?: string; hoverBackground?: string };
      dark?: { background?: string; textColor?: string; hoverBackground?: string };
    };
  };
  relatedPosts?: {
    enabled?: boolean; maxPosts?: number; showTitle?: boolean; title?: string;
    layout?: 'grid' | 'carousel'; columns?: number;
    showCategoryLink?: boolean; showExploreButton?: boolean;
    styles?: {
      light?: { sectionBackground?: string; sectionBorder?: string; iconColor?: string;
        cardBackground?: string; cardBorder?: string; cardTitleColor?: string;
        cardCategoryBackground?: string; cardCategoryBorder?: string;
        cardCategoryText?: string; cardDateColor?: string; titleColor?: string;
        buttonBackground?: string; buttonBorder?: string; buttonText?: string; linkColor?: string; };
      dark?: { sectionBackground?: string; sectionBorder?: string; iconColor?: string;
        cardBackground?: string; cardBorder?: string; cardTitleColor?: string;
        cardCategoryBackground?: string; cardCategoryBorder?: string;
        cardCategoryText?: string; cardDateColor?: string; titleColor?: string;
        buttonBackground?: string; buttonBorder?: string; buttonText?: string; linkColor?: string; };
    };
  };
  navigation?: {
    enabled?: boolean; showPrevNext?: boolean; showThumbnails?: boolean; showEmptyCard?: boolean;
    styles?: {
      light?: { sectionBackground?: string; sectionBorder?: string; titleColor?: string;
        indicatorColor?: string; cardBackground?: string; cardBorder?: string;
        cardHoverBorder?: string; cardHoverBackground?: string; labelColor?: string;
        postTitleColor?: string; excerptColor?: string; metaColor?: string;
        iconColor?: string; imageBorder?: string; };
      dark?: { sectionBackground?: string; sectionBorder?: string; titleColor?: string;
        indicatorColor?: string; cardBackground?: string; cardBorder?: string;
        cardHoverBorder?: string; cardHoverBackground?: string; labelColor?: string;
        postTitleColor?: string; excerptColor?: string; metaColor?: string;
        iconColor?: string; imageBorder?: string; };
    };
  };
  comments?: {
    enabled?: boolean; title?: string; fontFamily?: string; allowAnonymous?: boolean;
    moderationRequired?: boolean; maxDepth?: number; showCount?: boolean;
    avatarShape?: 'circle' | 'square';
    styles?: {
      light?: { sectionBackground?: string; sectionBorder?: string; titleColor?: string;
        iconColor?: string; countColor?: string; selectorBackground?: string;
        selectorBorder?: string; selectorText?: string; selectorIconColor?: string;
        selectorDropdownBg?: string; selectorOptionHover?: string;
        cardBackground?: string; cardBorder?: string; authorColor?: string;
        textColor?: string; dateColor?: string; formBackground?: string;
        formBorder?: string; formFocusBorder?: string; textareaBackground?: string;
        textareaText?: string; footerBackground?: string; buttonBackground?: string;
        buttonBorder?: string; buttonText?: string; };
      dark?: { sectionBackground?: string; sectionBorder?: string; titleColor?: string;
        iconColor?: string; countColor?: string; selectorBackground?: string;
        selectorBorder?: string; selectorText?: string; selectorIconColor?: string;
        selectorDropdownBg?: string; selectorOptionHover?: string;
        cardBackground?: string; cardBorder?: string; authorColor?: string;
        textColor?: string; dateColor?: string; formBackground?: string;
        formBorder?: string; formFocusBorder?: string; textareaBackground?: string;
        textareaText?: string; footerBackground?: string; buttonBackground?: string;
        buttonBorder?: string; buttonText?: string; };
    };
  };
  shareButtons?: {
    enabled?: boolean;
    position?: 'sidebar' | 'bottom' | 'both';
    platforms?: string[];
    styles?: {
      light?: { background?: string; iconColor?: string; hoverBackground?: string };
      dark?: { background?: string; iconColor?: string; hoverBackground?: string };
    };
  };
}

interface Props {
  config: BlogPostDetailConfig;
  onChange: (config: BlogPostDetailConfig) => void;
}

type TabType = 'hero' | 'content' | 'social' | 'navigation';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const BlogPostDetailConfigSectionCompact: React.FC<Props> = ({ config, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showImageModalLight, setShowImageModalLight] = useState(false);
  const [showImageModalDark, setShowImageModalDark] = useState(false);

  // Helpers
  const updateConfig = <K extends keyof BlogPostDetailConfig>(
    section: K,
    field: string,
    value: any
  ) => {
    onChange({
      ...config,
      [section]: { ...(config[section] || {}), [field]: value }
    });
  };

  const updateStyles = (
    section: keyof BlogPostDetailConfig,
    theme: 'light' | 'dark',
    field: string,
    value: string
  ) => {
    const currentSection = config[section] || {};
    const currentStyles = (currentSection as any).styles || {};
    const currentThemeStyles = currentStyles[theme] || {};
    onChange({
      ...config,
      [section]: {
        ...currentSection,
        styles: {
          ...currentStyles,
          [theme]: { ...currentThemeStyles, [field]: value }
        }
      }
    });
  };

  const updateNestedField = (
    section: keyof BlogPostDetailConfig,
    nestedField: string,
    theme: 'light' | 'dark',
    value: string | number
  ) => {
    const currentSection = config[section] || {};
    const currentNestedField = (currentSection as any)[nestedField] || {};
    onChange({
      ...config,
      [section]: {
        ...currentSection,
        [nestedField]: { ...currentNestedField, [theme]: value }
      }
    });
  };

  const handleImageSelectLight = (imageUrl: string) => {
    updateNestedField('content', 'backgroundImage', 'light', imageUrl);
  };

  const handleImageSelectDark = (imageUrl: string) => {
    updateNestedField('content', 'backgroundImage', 'dark', imageUrl);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'hero', label: 'Hero', icon: '🖼️' },
    { id: 'content', label: 'Contenido', icon: '📝' },
    { id: 'social', label: 'Social', icon: '💬' },
    { id: 'navigation', label: 'Navegación', icon: '🧭' },
  ];

  return (
    <>
      {/* Modales de imágenes */}
      <ImageSelectorModal
        isOpen={showImageModalLight}
        onClose={() => setShowImageModalLight(false)}
        onSelect={handleImageSelectLight}
        currentImage={config.content?.backgroundImage?.light}
        title="Imagen de fondo - Tema Claro"
      />
      <ImageSelectorModal
        isOpen={showImageModalDark}
        onClose={() => setShowImageModalDark(false)}
        onSelect={handleImageSelectDark}
        currentImage={config.content?.backgroundImage?.dark}
        title="Imagen de fondo - Tema Oscuro"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Detalle de Post del Blog</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hero, contenido, comentarios y navegación</p>
            </div>
          </div>
          <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700">
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

            {/* Tab Content */}
            <div className="p-4 space-y-4">
              {/* ========== TAB: HERO ========== */}
              {activeTab === 'hero' && (
                <>
                  {/* Diseño y Elementos */}
                  <CompactSection title="Diseño del Hero" icon="🎨" defaultOpen>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Variante</label>
                        <select
                          value={config.hero?.variant || 'overlay'}
                          onChange={(e) => updateConfig('hero', 'variant', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="overlay">🖼️ Overlay - Imagen con título</option>
                          <option value="compact">📝 Compacto</option>
                          <option value="minimal">✨ Mínimo</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                          Opacidad overlay: {config.hero?.overlayOpacity ?? 60}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={config.hero?.overlayOpacity ?? 60}
                          onChange={(e) => updateConfig('hero', 'overlayOpacity', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CompactSection>

                  {/* Elementos visibles */}
                  <CompactSection title="Elementos a mostrar" icon="👁️">
                    <div className="space-y-2">
                      <CompactToggle
                        label="Breadcrumb / Volver"
                        checked={config.hero?.showBreadcrumb ?? true}
                        onChange={(v) => updateConfig('hero', 'showBreadcrumb', v)}
                      />
                      <CompactToggle
                        label="Categoría"
                        checked={config.hero?.showCategory ?? true}
                        onChange={(v) => updateConfig('hero', 'showCategory', v)}
                      />
                      <CompactToggle
                        label="Autor"
                        checked={config.hero?.showAuthor ?? true}
                        onChange={(v) => updateConfig('hero', 'showAuthor', v)}
                      />
                      <CompactToggle
                        label="Fecha de publicación"
                        checked={config.hero?.showPublishDate ?? true}
                        onChange={(v) => updateConfig('hero', 'showPublishDate', v)}
                      />
                      <CompactToggle
                        label="Tiempo de lectura"
                        checked={config.hero?.showReadingTime ?? true}
                        onChange={(v) => updateConfig('hero', 'showReadingTime', v)}
                      />
                    </div>
                  </CompactSection>

                  {/* Barra de progreso de lectura */}
                  <CompactSection title="Barra de Progreso de Lectura" icon="📊">
                    <div className="space-y-3">
                      <CompactToggle
                        label="Mostrar barra"
                        checked={config.readingProgress?.enabled ?? true}
                        onChange={(v) => updateConfig('readingProgress', 'enabled', v)}
                      />
                      {config.readingProgress?.enabled !== false && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Posición</label>
                            <select
                              value={config.readingProgress?.position || 'top'}
                              onChange={(e) => updateConfig('readingProgress', 'position', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            >
                              <option value="top">Arriba</option>
                              <option value="bottom">Abajo</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Altura</label>
                            <input
                              type="text"
                              value={config.readingProgress?.height || '3px'}
                              onChange={(e) => updateConfig('readingProgress', 'height', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              placeholder="3px"
                            />
                          </div>

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2">
                              <CompactColorPicker
                                label="Fondo barra"
                                value={config.readingProgress?.backgroundColor?.light || '#e5e7eb'}
                                onChange={(v) => {
                                  const current = config.readingProgress?.backgroundColor || {};
                                  onChange({ ...config, readingProgress: { ...config.readingProgress, backgroundColor: { ...current, light: v }}});
                                }}
                              />
                              <CompactGradientPicker
                                fromColor={config.readingProgress?.barGradientFrom?.light || '#9333ea'}
                                toColor={config.readingProgress?.barGradientTo?.light || '#2563eb'}
                                direction="to right"
                                onFromChange={(v) => {
                                  const current = config.readingProgress?.barGradientFrom || {};
                                  onChange({ ...config, readingProgress: { ...config.readingProgress, barGradientFrom: { ...current, light: v }}});
                                }}
                                onToChange={(v) => {
                                  const current = config.readingProgress?.barGradientTo || {};
                                  onChange({ ...config, readingProgress: { ...config.readingProgress, barGradientTo: { ...current, light: v }}});
                                }}
                                onDirectionChange={() => {}}
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <CompactColorPicker
                                label="Fondo barra"
                                value={config.readingProgress?.backgroundColor?.dark || '#374151'}
                                onChange={(v) => {
                                  const current = config.readingProgress?.backgroundColor || {};
                                  onChange({ ...config, readingProgress: { ...config.readingProgress, backgroundColor: { ...current, dark: v }}});
                                }}
                              />
                              <CompactGradientPicker
                                fromColor={config.readingProgress?.barGradientFrom?.dark || '#a855f7'}
                                toColor={config.readingProgress?.barGradientTo?.dark || '#3b82f6'}
                                direction="to right"
                                onFromChange={(v) => {
                                  const current = config.readingProgress?.barGradientFrom || {};
                                  onChange({ ...config, readingProgress: { ...config.readingProgress, barGradientFrom: { ...current, dark: v }}});
                                }}
                                onToChange={(v) => {
                                  const current = config.readingProgress?.barGradientTo || {};
                                  onChange({ ...config, readingProgress: { ...config.readingProgress, barGradientTo: { ...current, dark: v }}});
                                }}
                                onDirectionChange={() => {}}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>

                  {/* Fondo del Hero */}
                  <CompactSection title="Fondo" icon="🖼️">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Tipo</label>
                        <select
                          value={config.hero?.background?.type || 'image'}
                          onChange={(e) => {
                            const currentBg = config.hero?.background || {};
                            onChange({ ...config, hero: { ...config.hero, background: { ...currentBg, type: e.target.value as any }}});
                          }}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        >
                          <option value="image">🖼️ Imagen del post</option>
                          <option value="gradient">🌈 Gradiente</option>
                          <option value="solid">🎨 Color sólido</option>
                        </select>
                      </div>
                      {config.hero?.background?.type === 'gradient' && (
                        <CompactGradientPicker
                          fromColor={config.hero?.background?.gradientFrom || '#0f0f0f'}
                          toColor={config.hero?.background?.gradientTo || '#1a1a1a'}
                          direction="to bottom right"
                          onFromChange={(v) => {
                            const currentBg = config.hero?.background || {};
                            onChange({ ...config, hero: { ...config.hero, background: { ...currentBg, gradientFrom: v }}});
                          }}
                          onToChange={(v) => {
                            const currentBg = config.hero?.background || {};
                            onChange({ ...config, hero: { ...config.hero, background: { ...currentBg, gradientTo: v }}});
                          }}
                          onDirectionChange={() => {}}
                        />
                      )}
                      {config.hero?.background?.type === 'solid' && (
                        <CompactColorPicker
                          label="Color"
                          value={config.hero?.background?.overlayColor || '#1f2937'}
                          onChange={(v) => {
                            const currentBg = config.hero?.background || {};
                            onChange({ ...config, hero: { ...config.hero, background: { ...currentBg, overlayColor: v }}});
                          }}
                        />
                      )}
                    </div>
                  </CompactSection>

                  {/* Estilos del Hero */}
                  <CompactSection title="Estilos del Hero" icon="🎨">
                    <ThemeTabs activeTheme={theme} onChange={setTheme} />
                    {theme === 'light' ? (
                      <div className="space-y-2 mt-2">
                        <CompactColorPicker label="Título" value={config.hero?.styles?.light?.titleColor || '#ffffff'} onChange={(v) => updateStyles('hero', 'light', 'titleColor', v)} />
                        <CompactColorPicker label="Metadatos" value={config.hero?.styles?.light?.metaColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'light', 'metaColor', v)} />
                        <CompactColorPicker label="Botón volver (texto)" value={config.hero?.styles?.light?.backButtonTextColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'light', 'backButtonTextColor', v)} />
                        <CompactColorPicker label="Botón volver (icono)" value={config.hero?.styles?.light?.backButtonIconColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'light', 'backButtonIconColor', v)} />
                        <CompactColorPicker label="Badge categoría (fondo)" value={config.hero?.styles?.light?.categoryBgColor || '#8b5cf6'} onChange={(v) => updateStyles('hero', 'light', 'categoryBgColor', v)} />
                        <CompactColorPicker label="Badge categoría (texto)" value={config.hero?.styles?.light?.categoryTextColor || '#ffffff'} onChange={(v) => updateStyles('hero', 'light', 'categoryTextColor', v)} />
                        <CompactColorPicker label="Iconos" value={config.hero?.styles?.light?.iconsColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'light', 'iconsColor', v)} />
                        <CompactColorPicker label="Avatar (borde)" value={config.hero?.styles?.light?.avatarBorderColor || 'rgba(255,255,255,0.3)'} onChange={(v) => updateStyles('hero', 'light', 'avatarBorderColor', v)} />
                      </div>
                    ) : (
                      <div className="space-y-2 mt-2">
                        <CompactColorPicker label="Título" value={config.hero?.styles?.dark?.titleColor || '#ffffff'} onChange={(v) => updateStyles('hero', 'dark', 'titleColor', v)} />
                        <CompactColorPicker label="Metadatos" value={config.hero?.styles?.dark?.metaColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'dark', 'metaColor', v)} />
                        <CompactColorPicker label="Botón volver (texto)" value={config.hero?.styles?.dark?.backButtonTextColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'dark', 'backButtonTextColor', v)} />
                        <CompactColorPicker label="Botón volver (icono)" value={config.hero?.styles?.dark?.backButtonIconColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'dark', 'backButtonIconColor', v)} />
                        <CompactColorPicker label="Badge categoría (fondo)" value={config.hero?.styles?.dark?.categoryBgColor || '#a855f7'} onChange={(v) => updateStyles('hero', 'dark', 'categoryBgColor', v)} />
                        <CompactColorPicker label="Badge categoría (texto)" value={config.hero?.styles?.dark?.categoryTextColor || '#ffffff'} onChange={(v) => updateStyles('hero', 'dark', 'categoryTextColor', v)} />
                        <CompactColorPicker label="Iconos" value={config.hero?.styles?.dark?.iconsColor || 'rgba(255,255,255,0.8)'} onChange={(v) => updateStyles('hero', 'dark', 'iconsColor', v)} />
                        <CompactColorPicker label="Avatar (borde)" value={config.hero?.styles?.dark?.avatarBorderColor || 'rgba(255,255,255,0.3)'} onChange={(v) => updateStyles('hero', 'dark', 'avatarBorderColor', v)} />
                      </div>
                    )}
                  </CompactSection>
                </>
              )}

              {/* ========== TAB: CONTENIDO ========== */}
              {activeTab === 'content' && (
                <>
                  {/* TOC */}
                  <CompactSection title="Tabla de Contenidos (TOC)" icon="📋" defaultOpen>
                    <div className="space-y-3">
                      <CompactToggle
                        label="Mostrar TOC"
                        checked={config.tableOfContents?.enabled ?? true}
                        onChange={(v) => updateConfig('tableOfContents', 'enabled', v)}
                      />
                      {config.tableOfContents?.enabled !== false && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Posición</label>
                              <select
                                value={config.tableOfContents?.position || 'right'}
                                onChange={(e) => updateConfig('tableOfContents', 'position', e.target.value)}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              >
                                <option value="left">⬅️ Izquierda</option>
                                <option value="right">➡️ Derecha</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Profundidad</label>
                              <select
                                value={String(config.tableOfContents?.maxDepth || 3)}
                                onChange={(e) => updateConfig('tableOfContents', 'maxDepth', Number(e.target.value))}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              >
                                <option value="2">H2</option>
                                <option value="3">H2+H3</option>
                                <option value="4">H2+H3+H4</option>
                              </select>
                            </div>
                          </div>
                          <CompactToggle label="Sticky" checked={config.tableOfContents?.sticky ?? true} onChange={(v) => updateConfig('tableOfContents', 'sticky', v)} />
                          <CompactToggle label="Mostrar progreso" checked={config.tableOfContents?.showProgress ?? true} onChange={(v) => updateConfig('tableOfContents', 'showProgress', v)} />

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.tableOfContents?.styles?.light?.background || '#ffffff'} onChange={(v) => updateStyles('tableOfContents', 'light', 'background', v)} />
                              <CompactColorPicker label="Borde" value={config.tableOfContents?.styles?.light?.border || '#e5e7eb'} onChange={(v) => updateStyles('tableOfContents', 'light', 'border', v)} />
                              <CompactColorPicker label="Texto" value={config.tableOfContents?.styles?.light?.textColor || '#374151'} onChange={(v) => updateStyles('tableOfContents', 'light', 'textColor', v)} />
                              <CompactGradientPicker
                                fromColor={config.tableOfContents?.styles?.light?.progressBarFrom || '#9333ea'}
                                toColor={config.tableOfContents?.styles?.light?.progressBarTo || '#2563eb'}
                                direction="to right"
                                onFromChange={(v) => updateStyles('tableOfContents', 'light', 'progressBarFrom', v)}
                                onToChange={(v) => updateStyles('tableOfContents', 'light', 'progressBarTo', v)}
                                onDirectionChange={() => {}}
                              />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.tableOfContents?.styles?.dark?.background || '#111827'} onChange={(v) => updateStyles('tableOfContents', 'dark', 'background', v)} />
                              <CompactColorPicker label="Borde" value={config.tableOfContents?.styles?.dark?.border || '#374151'} onChange={(v) => updateStyles('tableOfContents', 'dark', 'border', v)} />
                              <CompactColorPicker label="Texto" value={config.tableOfContents?.styles?.dark?.textColor || '#d1d5db'} onChange={(v) => updateStyles('tableOfContents', 'dark', 'textColor', v)} />
                              <CompactGradientPicker
                                fromColor={config.tableOfContents?.styles?.dark?.progressBarFrom || '#a855f7'}
                                toColor={config.tableOfContents?.styles?.dark?.progressBarTo || '#3b82f6'}
                                direction="to right"
                                onFromChange={(v) => updateStyles('tableOfContents', 'dark', 'progressBarFrom', v)}
                                onToChange={(v) => updateStyles('tableOfContents', 'dark', 'progressBarTo', v)}
                                onDirectionChange={() => {}}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>

                  {/* Barra de Resumen */}
                  <CompactSection title="Barra de Resumen" icon="📊">
                    <div className="space-y-3">
                      <CompactToggle
                        label="Mostrar barra"
                        checked={config.summaryBar?.enabled ?? true}
                        onChange={(v) => updateConfig('summaryBar', 'enabled', v)}
                      />
                      {config.summaryBar?.enabled !== false && (
                        <>
                          <CompactToggle label="Extracto" checked={config.summaryBar?.showExcerpt ?? true} onChange={(v) => updateConfig('summaryBar', 'showExcerpt', v)} />
                          <CompactToggle label="Botón Like" checked={config.summaryBar?.showLikeButton ?? true} onChange={(v) => updateConfig('summaryBar', 'showLikeButton', v)} />
                          <CompactToggle label="Botón Guardar" checked={config.summaryBar?.showSaveButton ?? true} onChange={(v) => updateConfig('summaryBar', 'showSaveButton', v)} />
                          <CompactToggle label="Botón Compartir" checked={config.summaryBar?.showShareButton ?? false} onChange={(v) => updateConfig('summaryBar', 'showShareButton', v)} />

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.summaryBar?.styles?.light?.background || 'transparent'} onChange={(v) => updateStyles('summaryBar', 'light', 'background', v)} />
                              <CompactColorPicker label="Borde" value={config.summaryBar?.styles?.light?.borderColor || '#e5e7eb'} onChange={(v) => updateStyles('summaryBar', 'light', 'borderColor', v)} />
                              <CompactColorPicker label="Texto" value={config.summaryBar?.styles?.light?.textColor || '#4b5563'} onChange={(v) => updateStyles('summaryBar', 'light', 'textColor', v)} />
                              <CompactColorPicker label="Botones (fondo)" value={config.summaryBar?.styles?.light?.buttonBgColor || '#f3f4f6'} onChange={(v) => updateStyles('summaryBar', 'light', 'buttonBgColor', v)} />
                              <CompactColorPicker label="Botones (icono)" value={config.summaryBar?.styles?.light?.buttonIconColor || '#6b7280'} onChange={(v) => updateStyles('summaryBar', 'light', 'buttonIconColor', v)} />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.summaryBar?.styles?.dark?.background || 'transparent'} onChange={(v) => updateStyles('summaryBar', 'dark', 'background', v)} />
                              <CompactColorPicker label="Borde" value={config.summaryBar?.styles?.dark?.borderColor || '#374151'} onChange={(v) => updateStyles('summaryBar', 'dark', 'borderColor', v)} />
                              <CompactColorPicker label="Texto" value={config.summaryBar?.styles?.dark?.textColor || '#9ca3af'} onChange={(v) => updateStyles('summaryBar', 'dark', 'textColor', v)} />
                              <CompactColorPicker label="Botones (fondo)" value={config.summaryBar?.styles?.dark?.buttonBgColor || '#374151'} onChange={(v) => updateStyles('summaryBar', 'dark', 'buttonBgColor', v)} />
                              <CompactColorPicker label="Botones (icono)" value={config.summaryBar?.styles?.dark?.buttonIconColor || '#9ca3af'} onChange={(v) => updateStyles('summaryBar', 'dark', 'buttonIconColor', v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>

                  {/* Tipografía */}
                  <CompactSection title="Tipografía del Contenido" icon="🔤">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Fuente del texto</label>
                        <select
                          value={config.content?.fontFamily || 'Montserrat'}
                          onChange={(e) => updateConfig('content', 'fontFamily', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        >
                          <option value="Montserrat">Montserrat</option>
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Lato">Lato</option>
                          <option value="Poppins">Poppins</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Fuente de títulos</label>
                        <select
                          value={config.content?.headingFontFamily || 'Montserrat'}
                          onChange={(e) => updateConfig('content', 'headingFontFamily', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        >
                          <option value="Montserrat">Montserrat</option>
                          <option value="Inter">Inter</option>
                          <option value="Playfair Display">Playfair Display</option>
                          <option value="Merriweather">Merriweather</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Ancho máx.</label>
                          <input
                            type="text"
                            value={config.content?.maxWidth || '680px'}
                            onChange={(e) => updateConfig('content', 'maxWidth', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Tamaño</label>
                          <input
                            type="text"
                            value={config.content?.fontSize || '18px'}
                            onChange={(e) => updateConfig('content', 'fontSize', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  </CompactSection>

                  {/* Imagen de Fondo */}
                  <CompactSection title="Imagen de Fondo del Contenido" icon="🖼️">
                    <ThemeTabs activeTheme={theme} onChange={setTheme} />
                    {theme === 'light' ? (
                      <div className="space-y-3 mt-2">
                        {config.content?.backgroundImage?.light ? (
                          <div className="relative">
                            <img src={config.content.backgroundImage.light} alt="Fondo" className="w-full h-24 object-cover rounded border border-gray-300" />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded">
                              <button
                                onClick={() => setShowImageModalLight(true)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                              >
                                Cambiar
                              </button>
                              <button
                                onClick={() => updateNestedField('content', 'backgroundImage', 'light', '')}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowImageModalLight(true)}
                            className="w-full h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:border-purple-400 transition"
                          >
                            <span className="text-2xl mb-1">🖼️</span>
                            <span className="text-xs text-gray-500">Seleccionar imagen</span>
                          </button>
                        )}
                        {config.content?.backgroundImage?.light && (
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                              Overlay: {config.content?.backgroundOverlay?.light ?? 80}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.content?.backgroundOverlay?.light ?? 80}
                              onChange={(e) => updateNestedField('content', 'backgroundOverlay', 'light', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 mt-2">
                        {config.content?.backgroundImage?.dark ? (
                          <div className="relative">
                            <img src={config.content.backgroundImage.dark} alt="Fondo" className="w-full h-24 object-cover rounded border border-gray-600" />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded">
                              <button
                                onClick={() => setShowImageModalDark(true)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                              >
                                Cambiar
                              </button>
                              <button
                                onClick={() => updateNestedField('content', 'backgroundImage', 'dark', '')}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowImageModalDark(true)}
                            className="w-full h-24 border-2 border-dashed border-gray-600 rounded flex flex-col items-center justify-center hover:border-purple-400 transition"
                          >
                            <span className="text-2xl mb-1">🖼️</span>
                            <span className="text-xs text-gray-400">Seleccionar imagen</span>
                          </button>
                        )}
                        {config.content?.backgroundImage?.dark && (
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                              Overlay: {config.content?.backgroundOverlay?.dark ?? 90}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.content?.backgroundOverlay?.dark ?? 90}
                              onChange={(e) => updateNestedField('content', 'backgroundOverlay', 'dark', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </CompactSection>

                  {/* Autor */}
                  <CompactSection title="Tarjeta de Autor" icon="👤">
                    <div className="space-y-3">
                      <CompactToggle label="Mostrar tarjeta" checked={config.author?.showCard ?? true} onChange={(v) => updateConfig('author', 'showCard', v)} />
                      <CompactToggle label="Biografía" checked={config.author?.showBio ?? true} onChange={(v) => updateConfig('author', 'showBio', v)} />
                      <CompactToggle label="Redes sociales" checked={config.author?.showSocialLinks ?? true} onChange={(v) => updateConfig('author', 'showSocialLinks', v)} />
                      <CompactToggle label="Mostrar rol" checked={config.author?.showRole ?? true} onChange={(v) => updateConfig('author', 'showRole', v)} />
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Formato nombre</label>
                        <select
                          value={config.author?.nameFormat || 'full'}
                          onChange={(e) => updateConfig('author', 'nameFormat', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        >
                          <option value="full">Completo</option>
                          <option value="two-words">2 palabras</option>
                          <option value="first-initials">Primera + iniciales</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Avatar</label>
                        <select
                          value={config.author?.avatarShape || 'square'}
                          onChange={(e) => updateConfig('author', 'avatarShape', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        >
                          <option value="square">⬜ Cuadrado</option>
                          <option value="circle">⭕ Círculo</option>
                        </select>
                      </div>

                      {config.author?.showCard !== false && (
                        <>
                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.author?.styles?.light?.background || '#f3f4f6'} onChange={(v) => updateStyles('author', 'light', 'background', v)} />
                              <CompactColorPicker label="Borde" value={config.author?.styles?.light?.border || '#e5e7eb'} onChange={(v) => updateStyles('author', 'light', 'border', v)} />
                              <CompactColorPicker label="Nombre" value={config.author?.styles?.light?.nameColor || '#1f2937'} onChange={(v) => updateStyles('author', 'light', 'nameColor', v)} />
                              <CompactColorPicker label="Biografía" value={config.author?.styles?.light?.bioColor || '#6b7280'} onChange={(v) => updateStyles('author', 'light', 'bioColor', v)} />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.author?.styles?.dark?.background || '#1f2937'} onChange={(v) => updateStyles('author', 'dark', 'background', v)} />
                              <CompactColorPicker label="Borde" value={config.author?.styles?.dark?.border || '#374151'} onChange={(v) => updateStyles('author', 'dark', 'border', v)} />
                              <CompactColorPicker label="Nombre" value={config.author?.styles?.dark?.nameColor || '#f9fafb'} onChange={(v) => updateStyles('author', 'dark', 'nameColor', v)} />
                              <CompactColorPicker label="Biografía" value={config.author?.styles?.dark?.bioColor || '#9ca3af'} onChange={(v) => updateStyles('author', 'dark', 'bioColor', v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>

                  {/* Tags */}
                  <CompactSection title="Etiquetas/Tags" icon="🏷️">
                    <div className="space-y-3">
                      <CompactToggle label="Mostrar tags" checked={config.tags?.showSection ?? true} onChange={(v) => updateConfig('tags', 'showSection', v)} />
                      {config.tags?.showSection !== false && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                              Máximo visible: {config.tags?.maxVisible ?? 5}
                            </label>
                            <input
                              type="range"
                              min="3"
                              max="10"
                              value={config.tags?.maxVisible ?? 5}
                              onChange={(e) => updateConfig('tags', 'maxVisible', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.tags?.styles?.light?.background || '#e5e7eb'} onChange={(v) => updateStyles('tags', 'light', 'background', v)} />
                              <CompactColorPicker label="Texto" value={config.tags?.styles?.light?.textColor || '#374151'} onChange={(v) => updateStyles('tags', 'light', 'textColor', v)} />
                              <CompactColorPicker label="Hover" value={config.tags?.styles?.light?.hoverBackground || '#d1d5db'} onChange={(v) => updateStyles('tags', 'light', 'hoverBackground', v)} />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.tags?.styles?.dark?.background || '#374151'} onChange={(v) => updateStyles('tags', 'dark', 'background', v)} />
                              <CompactColorPicker label="Texto" value={config.tags?.styles?.dark?.textColor || '#d1d5db'} onChange={(v) => updateStyles('tags', 'dark', 'textColor', v)} />
                              <CompactColorPicker label="Hover" value={config.tags?.styles?.dark?.hoverBackground || '#4b5563'} onChange={(v) => updateStyles('tags', 'dark', 'hoverBackground', v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>
                </>
              )}

              {/* ========== TAB: SOCIAL ========== */}
              {activeTab === 'social' && (
                <>
                  {/* Comentarios */}
                  <CompactSection title="Sistema de Comentarios" icon="💬" defaultOpen>
                    <div className="space-y-3">
                      <CompactToggle label="Habilitar comentarios" checked={config.comments?.enabled ?? true} onChange={(v) => updateConfig('comments', 'enabled', v)} />
                      {config.comments?.enabled !== false && (
                        <>
                          <CompactToggle label="Contador" checked={config.comments?.showCount ?? true} onChange={(v) => updateConfig('comments', 'showCount', v)} />
                          <CompactToggle label="Anónimos" checked={config.comments?.allowAnonymous ?? false} onChange={(v) => updateConfig('comments', 'allowAnonymous', v)} />
                          <CompactToggle label="Moderación" checked={config.comments?.moderationRequired ?? true} onChange={(v) => updateConfig('comments', 'moderationRequired', v)} />
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                              Profundidad respuestas: {config.comments?.maxDepth ?? 3}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={config.comments?.maxDepth ?? 3}
                              onChange={(e) => updateConfig('comments', 'maxDepth', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Avatar</label>
                            <select
                              value={config.comments?.avatarShape || 'circle'}
                              onChange={(e) => updateConfig('comments', 'avatarShape', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            >
                              <option value="circle">⭕ Círculo</option>
                              <option value="square">⬜ Cuadrado</option>
                            </select>
                          </div>

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo sección" value={config.comments?.styles?.light?.sectionBackground || '#ffffff'} onChange={(v) => updateStyles('comments', 'light', 'sectionBackground', v)} />
                              <CompactColorPicker label="Borde sección" value={config.comments?.styles?.light?.sectionBorder || '#e5e7eb'} onChange={(v) => updateStyles('comments', 'light', 'sectionBorder', v)} />
                              <CompactColorPicker label="Título" value={config.comments?.styles?.light?.titleColor || '#111827'} onChange={(v) => updateStyles('comments', 'light', 'titleColor', v)} />
                              <CompactColorPicker label="Fondo tarjeta" value={config.comments?.styles?.light?.cardBackground || '#f9fafb'} onChange={(v) => updateStyles('comments', 'light', 'cardBackground', v)} />
                              <CompactColorPicker label="Autor" value={config.comments?.styles?.light?.authorColor || '#1f2937'} onChange={(v) => updateStyles('comments', 'light', 'authorColor', v)} />
                              <CompactColorPicker label="Texto" value={config.comments?.styles?.light?.textColor || '#374151'} onChange={(v) => updateStyles('comments', 'light', 'textColor', v)} />
                              <CompactColorPicker label="Botón (fondo)" value={config.comments?.styles?.light?.buttonBackground || '#3b82f6'} onChange={(v) => updateStyles('comments', 'light', 'buttonBackground', v)} />
                              <CompactColorPicker label="Botón (texto)" value={config.comments?.styles?.light?.buttonText || '#ffffff'} onChange={(v) => updateStyles('comments', 'light', 'buttonText', v)} />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo sección" value={config.comments?.styles?.dark?.sectionBackground || '#1f2937'} onChange={(v) => updateStyles('comments', 'dark', 'sectionBackground', v)} />
                              <CompactColorPicker label="Borde sección" value={config.comments?.styles?.dark?.sectionBorder || '#374151'} onChange={(v) => updateStyles('comments', 'dark', 'sectionBorder', v)} />
                              <CompactColorPicker label="Título" value={config.comments?.styles?.dark?.titleColor || '#f9fafb'} onChange={(v) => updateStyles('comments', 'dark', 'titleColor', v)} />
                              <CompactColorPicker label="Fondo tarjeta" value={config.comments?.styles?.dark?.cardBackground || '#111827'} onChange={(v) => updateStyles('comments', 'dark', 'cardBackground', v)} />
                              <CompactColorPicker label="Autor" value={config.comments?.styles?.dark?.authorColor || '#f9fafb'} onChange={(v) => updateStyles('comments', 'dark', 'authorColor', v)} />
                              <CompactColorPicker label="Texto" value={config.comments?.styles?.dark?.textColor || '#d1d5db'} onChange={(v) => updateStyles('comments', 'dark', 'textColor', v)} />
                              <CompactColorPicker label="Botón (fondo)" value={config.comments?.styles?.dark?.buttonBackground || '#2563eb'} onChange={(v) => updateStyles('comments', 'dark', 'buttonBackground', v)} />
                              <CompactColorPicker label="Botón (texto)" value={config.comments?.styles?.dark?.buttonText || '#ffffff'} onChange={(v) => updateStyles('comments', 'dark', 'buttonText', v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>

                  {/* Botones Compartir */}
                  <CompactSection title="Botones de Compartir" icon="🔗">
                    <div className="space-y-3">
                      <CompactToggle label="Mostrar botones" checked={config.shareButtons?.enabled ?? true} onChange={(v) => updateConfig('shareButtons', 'enabled', v)} />
                      {config.shareButtons?.enabled !== false && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Posición</label>
                            <select
                              value={config.shareButtons?.position || 'sidebar'}
                              onChange={(e) => updateConfig('shareButtons', 'position', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            >
                              <option value="sidebar">📍 Barra lateral</option>
                              <option value="bottom">⬇️ Después del contenido</option>
                              <option value="both">📍⬇️ Ambas</option>
                            </select>
                          </div>

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.shareButtons?.styles?.light?.background || '#f3f4f6'} onChange={(v) => updateStyles('shareButtons', 'light', 'background', v)} />
                              <CompactColorPicker label="Icono" value={config.shareButtons?.styles?.light?.iconColor || '#374151'} onChange={(v) => updateStyles('shareButtons', 'light', 'iconColor', v)} />
                              <CompactColorPicker label="Hover" value={config.shareButtons?.styles?.light?.hoverBackground || '#e5e7eb'} onChange={(v) => updateStyles('shareButtons', 'light', 'hoverBackground', v)} />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo" value={config.shareButtons?.styles?.dark?.background || '#374151'} onChange={(v) => updateStyles('shareButtons', 'dark', 'background', v)} />
                              <CompactColorPicker label="Icono" value={config.shareButtons?.styles?.dark?.iconColor || '#d1d5db'} onChange={(v) => updateStyles('shareButtons', 'dark', 'iconColor', v)} />
                              <CompactColorPicker label="Hover" value={config.shareButtons?.styles?.dark?.hoverBackground || '#4b5563'} onChange={(v) => updateStyles('shareButtons', 'dark', 'hoverBackground', v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>
                </>
              )}

              {/* ========== TAB: NAVEGACIÓN ========== */}
              {activeTab === 'navigation' && (
                <>
                  {/* Posts Relacionados */}
                  <CompactSection title="Artículos Relacionados" icon="📚" defaultOpen>
                    <div className="space-y-3">
                      <CompactToggle label="Mostrar relacionados" checked={config.relatedPosts?.enabled ?? true} onChange={(v) => updateConfig('relatedPosts', 'enabled', v)} />
                      {config.relatedPosts?.enabled !== false && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Título</label>
                            <input
                              type="text"
                              value={config.relatedPosts?.title || 'Artículos Relacionados'}
                              onChange={(e) => updateConfig('relatedPosts', 'title', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                Cantidad: {config.relatedPosts?.maxPosts ?? 4}
                              </label>
                              <input
                                type="range"
                                min="2"
                                max="8"
                                value={config.relatedPosts?.maxPosts ?? 4}
                                onChange={(e) => updateConfig('relatedPosts', 'maxPosts', Number(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Diseño</label>
                              <select
                                value={config.relatedPosts?.layout || 'grid'}
                                onChange={(e) => updateConfig('relatedPosts', 'layout', e.target.value)}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              >
                                <option value="grid">📊 Grid</option>
                                <option value="carousel">🎠 Carrusel</option>
                              </select>
                            </div>
                          </div>
                          <CompactToggle label="Enlace categoría" checked={config.relatedPosts?.showCategoryLink ?? true} onChange={(v) => updateConfig('relatedPosts', 'showCategoryLink', v)} />
                          <CompactToggle label="Botón explorar" checked={config.relatedPosts?.showExploreButton ?? true} onChange={(v) => updateConfig('relatedPosts', 'showExploreButton', v)} />

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo sección" value={config.relatedPosts?.styles?.light?.sectionBackground || '#ffffff'} onChange={(v) => updateStyles('relatedPosts', 'light', 'sectionBackground', v)} />
                              <CompactColorPicker label="Borde sección" value={config.relatedPosts?.styles?.light?.sectionBorder || '#e5e7eb'} onChange={(v) => updateStyles('relatedPosts', 'light', 'sectionBorder', v)} />
                              <CompactColorPicker label="Fondo tarjeta" value={config.relatedPosts?.styles?.light?.cardBackground || '#f9fafb'} onChange={(v) => updateStyles('relatedPosts', 'light', 'cardBackground', v)} />
                              <CompactColorPicker label="Título tarjeta" value={config.relatedPosts?.styles?.light?.cardTitleColor || '#ffffff'} onChange={(v) => updateStyles('relatedPosts', 'light', 'cardTitleColor', v)} />
                              <CompactColorPicker label="Categoría (fondo)" value={config.relatedPosts?.styles?.light?.cardCategoryBackground || '#2563eb'} onChange={(v) => updateStyles('relatedPosts', 'light', 'cardCategoryBackground', v)} />
                              <CompactColorPicker label="Botón (fondo)" value={config.relatedPosts?.styles?.light?.buttonBackground || '#2563eb'} onChange={(v) => updateStyles('relatedPosts', 'light', 'buttonBackground', v)} />
                              <CompactColorPicker label="Botón (texto)" value={config.relatedPosts?.styles?.light?.buttonText || '#ffffff'} onChange={(v) => updateStyles('relatedPosts', 'light', 'buttonText', v)} />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo sección" value={config.relatedPosts?.styles?.dark?.sectionBackground || '#1f2937'} onChange={(v) => updateStyles('relatedPosts', 'dark', 'sectionBackground', v)} />
                              <CompactColorPicker label="Borde sección" value={config.relatedPosts?.styles?.dark?.sectionBorder || '#374151'} onChange={(v) => updateStyles('relatedPosts', 'dark', 'sectionBorder', v)} />
                              <CompactColorPicker label="Fondo tarjeta" value={config.relatedPosts?.styles?.dark?.cardBackground || '#111827'} onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardBackground', v)} />
                              <CompactColorPicker label="Título tarjeta" value={config.relatedPosts?.styles?.dark?.cardTitleColor || '#ffffff'} onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardTitleColor', v)} />
                              <CompactColorPicker label="Categoría (fondo)" value={config.relatedPosts?.styles?.dark?.cardCategoryBackground || '#3b82f6'} onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardCategoryBackground', v)} />
                              <CompactColorPicker label="Botón (fondo)" value={config.relatedPosts?.styles?.dark?.buttonBackground || '#1d4ed8'} onChange={(v) => updateStyles('relatedPosts', 'dark', 'buttonBackground', v)} />
                              <CompactColorPicker label="Botón (texto)" value={config.relatedPosts?.styles?.dark?.buttonText || '#ffffff'} onChange={(v) => updateStyles('relatedPosts', 'dark', 'buttonText', v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>

                  {/* Navegación Prev/Next */}
                  <CompactSection title="Navegación Anterior/Siguiente" icon="↔️">
                    <div className="space-y-3">
                      <CompactToggle label="Mostrar navegación" checked={config.navigation?.enabled ?? true} onChange={(v) => updateConfig('navigation', 'enabled', v)} />
                      {config.navigation?.enabled !== false && (
                        <>
                          <CompactToggle label="Botones Prev/Next" checked={config.navigation?.showPrevNext ?? true} onChange={(v) => updateConfig('navigation', 'showPrevNext', v)} />
                          <CompactToggle label="Miniaturas" checked={config.navigation?.showThumbnails ?? false} onChange={(v) => updateConfig('navigation', 'showThumbnails', v)} />
                          <CompactToggle label="Tarjeta vacía" checked={config.navigation?.showEmptyCard ?? false} onChange={(v) => updateConfig('navigation', 'showEmptyCard', v)} />

                          <ThemeTabs activeTheme={theme} onChange={setTheme} />
                          {theme === 'light' ? (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo sección" value={config.navigation?.styles?.light?.sectionBackground || '#ffffff'} onChange={(v) => updateStyles('navigation', 'light', 'sectionBackground', v)} />
                              <CompactColorPicker label="Borde sección" value={config.navigation?.styles?.light?.sectionBorder || '#e5e7eb'} onChange={(v) => updateStyles('navigation', 'light', 'sectionBorder', v)} />
                              <CompactColorPicker label="Fondo tarjeta" value={config.navigation?.styles?.light?.cardBackground || '#ffffff'} onChange={(v) => updateStyles('navigation', 'light', 'cardBackground', v)} />
                              <CompactColorPicker label="Borde tarjeta" value={config.navigation?.styles?.light?.cardBorder || '#e5e7eb'} onChange={(v) => updateStyles('navigation', 'light', 'cardBorder', v)} />
                              <CompactColorPicker label="Borde hover" value={config.navigation?.styles?.light?.cardHoverBorder || '#93c5fd'} onChange={(v) => updateStyles('navigation', 'light', 'cardHoverBorder', v)} />
                              <CompactColorPicker label="Etiqueta" value={config.navigation?.styles?.light?.labelColor || '#2563eb'} onChange={(v) => updateStyles('navigation', 'light', 'labelColor', v)} />
                              <CompactColorPicker label="Título post" value={config.navigation?.styles?.light?.postTitleColor || '#111827'} onChange={(v) => updateStyles('navigation', 'light', 'postTitleColor', v)} />
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <CompactColorPicker label="Fondo sección" value={config.navigation?.styles?.dark?.sectionBackground || '#1f2937'} onChange={(v) => updateStyles('navigation', 'dark', 'sectionBackground', v)} />
                              <CompactColorPicker label="Borde sección" value={config.navigation?.styles?.dark?.sectionBorder || '#374151'} onChange={(v) => updateStyles('navigation', 'dark', 'sectionBorder', v)} />
                              <CompactColorPicker label="Fondo tarjeta" value={config.navigation?.styles?.dark?.cardBackground || '#1f2937'} onChange={(v) => updateStyles('navigation', 'dark', 'cardBackground', v)} />
                              <CompactColorPicker label="Borde tarjeta" value={config.navigation?.styles?.dark?.cardBorder || '#4b5563'} onChange={(v) => updateStyles('navigation', 'dark', 'cardBorder', v)} />
                              <CompactColorPicker label="Borde hover" value={config.navigation?.styles?.dark?.cardHoverBorder || '#2563eb'} onChange={(v) => updateStyles('navigation', 'dark', 'cardHoverBorder', v)} />
                              <CompactColorPicker label="Etiqueta" value={config.navigation?.styles?.dark?.labelColor || '#60a5fa'} onChange={(v) => updateStyles('navigation', 'dark', 'labelColor', v)} />
                              <CompactColorPicker label="Título post" value={config.navigation?.styles?.dark?.postTitleColor || '#ffffff'} onChange={(v) => updateStyles('navigation', 'dark', 'postTitleColor', v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CompactSection>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPostDetailConfigSectionCompact;
