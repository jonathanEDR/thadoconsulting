/**
 * 🎛️ ServicioDetailConfigSectionCompact - Versión Compacta
 * Configuración optimizada de la página de detalle de servicio
 * 
 * MEJORAS:
 * - Sistema de tabs para organizar secciones (Hero, Acordeón, Sidebar, Diseño, CTA)
 * - Reutiliza AccordionConfigSectionCompact
 * - ~40% menos código que la versión original
 * - Mejor navegación y UX
 */

import React, { useState } from 'react';
import CtaStylePanel from './shared/CtaStylePanel';
import CtaBackgroundEditor from './shared/CtaBackgroundEditor';
import { HeroConfigSectionCompact } from './sections/HeroConfigSectionCompact';
import { AccordionConfigSectionCompact } from './sections/AccordionConfigSectionCompact';
import {
  CompactSection,
  CompactToggle,
  CompactColorPicker,
} from './shared/CompactStyleEditors';
import type {
  BackgroundConfig,
  HeroContentConfig,
  ButtonConfig,
  ServicioDetailConfig,
} from './types/servicioDetailConfig';
import {
  DEFAULT_PANELS,
  DEFAULT_CONFIG,
  DEFAULT_ACCORDION_HEADER,
} from './types/servicioDetailConfig';
import type { AccordionHeaderConfig } from './types/servicioDetailConfig';

interface Props {
  config: ServicioDetailConfig;
  onChange: (config: ServicioDetailConfig) => void;
}

type MainTabType = 'hero' | 'accordion' | 'sidebar' | 'design' | 'cta';

const ServicioDetailConfigSectionCompact: React.FC<Props> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<MainTabType>('hero');

  // Merge config con defaults
  const mergedConfig: ServicioDetailConfig = {
    hero: { 
      showBreadcrumb: config.hero?.showBreadcrumb ?? DEFAULT_CONFIG.hero!.showBreadcrumb,
      showBackButton: config.hero?.showBackButton ?? DEFAULT_CONFIG.hero!.showBackButton,
      overlayOpacity: config.hero?.overlayOpacity ?? DEFAULT_CONFIG.hero!.overlayOpacity,
      gradientColor: config.hero?.gradientColor ?? DEFAULT_CONFIG.hero!.gradientColor,
      background: config.hero?.background || DEFAULT_CONFIG.hero!.background,
      content: {
        titleGradient: config.hero?.content?.titleGradient || DEFAULT_CONFIG.hero!.content!.titleGradient,
        showCategoryTag: config.hero?.content?.showCategoryTag ?? DEFAULT_CONFIG.hero!.content!.showCategoryTag,
        showPrice: config.hero?.content?.showPrice ?? DEFAULT_CONFIG.hero!.content!.showPrice,
        title: {
          ...DEFAULT_CONFIG.hero!.content!.title,
          ...config.hero?.content?.title,
        },
        subtitle: {
          ...DEFAULT_CONFIG.hero!.content!.subtitle,
          ...config.hero?.content?.subtitle,
        },
      },
      cards: config.hero?.cards || DEFAULT_CONFIG.hero!.cards,
      buttons: {
        primary: config.hero?.buttons?.primary || DEFAULT_CONFIG.hero!.buttons!.primary,
        secondary: config.hero?.buttons?.secondary || DEFAULT_CONFIG.hero!.buttons!.secondary,
      },
    },
    accordion: { 
      defaultOpenPanel: config.accordion?.defaultOpenPanel ?? DEFAULT_CONFIG.accordion!.defaultOpenPanel,
      expandMultiple: config.accordion?.expandMultiple ?? DEFAULT_CONFIG.accordion!.expandMultiple,
      animationDuration: config.accordion?.animationDuration ?? DEFAULT_CONFIG.accordion!.animationDuration,
      showPanelDescription: config.accordion?.showPanelDescription ?? DEFAULT_CONFIG.accordion!.showPanelDescription,
      panels: config.accordion?.panels || DEFAULT_PANELS,
      background: config.accordion?.background || DEFAULT_CONFIG.accordion!.background,
      styles: {
        light: config.accordion?.styles?.light || DEFAULT_CONFIG.accordion!.styles!.light,
        dark: config.accordion?.styles?.dark || DEFAULT_CONFIG.accordion!.styles!.dark,
        typography: config.accordion?.styles?.typography || DEFAULT_CONFIG.accordion!.styles!.typography,
        contentCards: {
          light: {
            ...DEFAULT_CONFIG.accordion!.styles!.contentCards!.light,
            ...config.accordion?.styles?.contentCards?.light,
          },
          dark: {
            ...DEFAULT_CONFIG.accordion!.styles!.contentCards!.dark,
            ...config.accordion?.styles?.contentCards?.dark,
          },
        },
        iconConfig: {
          light: {
            ...DEFAULT_CONFIG.accordion!.styles!.iconConfig!.light,
            ...config.accordion?.styles?.iconConfig?.light,
          },
          dark: {
            ...DEFAULT_CONFIG.accordion!.styles!.iconConfig!.dark,
            ...config.accordion?.styles?.iconConfig?.dark,
          },
        },
        sectionIcons: {
          caracteristicas: {
            ...DEFAULT_CONFIG.accordion!.styles!.sectionIcons!.caracteristicas,
            ...config.accordion?.styles?.sectionIcons?.caracteristicas,
          },
          beneficios: {
            ...DEFAULT_CONFIG.accordion!.styles!.sectionIcons!.beneficios,
            ...config.accordion?.styles?.sectionIcons?.beneficios,
          },
          incluye: {
            ...DEFAULT_CONFIG.accordion!.styles!.sectionIcons!.incluye,
            ...config.accordion?.styles?.sectionIcons?.incluye,
          },
          noIncluye: {
            ...DEFAULT_CONFIG.accordion!.styles!.sectionIcons!.noIncluye,
            ...config.accordion?.styles?.sectionIcons?.noIncluye,
          },
        },
      },
      header: {
        title: {
          ...DEFAULT_ACCORDION_HEADER.title,
          ...config.accordion?.header?.title,
        },
        subtitle: {
          ...DEFAULT_ACCORDION_HEADER.subtitle,
          ...config.accordion?.header?.subtitle,
        },
        alignment: config.accordion?.header?.alignment ?? DEFAULT_ACCORDION_HEADER.alignment,
        showTitle: config.accordion?.header?.showTitle ?? DEFAULT_ACCORDION_HEADER.showTitle,
        showSubtitle: config.accordion?.header?.showSubtitle ?? DEFAULT_ACCORDION_HEADER.showSubtitle,
        iconType: config.accordion?.header?.iconType ?? DEFAULT_ACCORDION_HEADER.iconType,
        iconName: config.accordion?.header?.iconName ?? DEFAULT_ACCORDION_HEADER.iconName,
        iconColor: config.accordion?.header?.iconColor ?? DEFAULT_ACCORDION_HEADER.iconColor,
        iconColorDark: config.accordion?.header?.iconColorDark ?? DEFAULT_ACCORDION_HEADER.iconColorDark,
      },
    },
    sidebar: { 
      showRelatedServices: config.sidebar?.showRelatedServices ?? DEFAULT_CONFIG.sidebar!.showRelatedServices,
      showCategoryTag: config.sidebar?.showCategoryTag ?? DEFAULT_CONFIG.sidebar!.showCategoryTag,
      showPriceRange: config.sidebar?.showPriceRange ?? DEFAULT_CONFIG.sidebar!.showPriceRange,
      showContactButton: config.sidebar?.showContactButton ?? DEFAULT_CONFIG.sidebar!.showContactButton,
    },
    design: { 
      panelBorderRadius: config.design?.panelBorderRadius ?? DEFAULT_CONFIG.design!.panelBorderRadius,
      panelShadow: config.design?.panelShadow ?? DEFAULT_CONFIG.design!.panelShadow,
      headerStyle: config.design?.headerStyle ?? DEFAULT_CONFIG.design!.headerStyle,
      accentColor: config.design?.accentColor ?? DEFAULT_CONFIG.design!.accentColor,
      contentPadding: config.design?.contentPadding ?? DEFAULT_CONFIG.design!.contentPadding,
    },
    cta: {
      background: config.cta?.background || DEFAULT_CONFIG.cta!.background,
      title: config.cta?.title || DEFAULT_CONFIG.cta!.title,
      subtitle: config.cta?.subtitle || DEFAULT_CONFIG.cta!.subtitle,
      buttons: {
        primary: config.cta?.buttons?.primary || DEFAULT_CONFIG.cta!.buttons!.primary,
        secondary: config.cta?.buttons?.secondary || DEFAULT_CONFIG.cta!.buttons!.secondary,
      },
    },
  };

  // =========================================================================
  // Update Functions
  // =========================================================================

  const updateHero = (field: keyof NonNullable<ServicioDetailConfig['hero']>, value: any) => {
    onChange({
      ...mergedConfig,
      hero: { ...mergedConfig.hero!, [field]: value },
    });
  };

  const updateHeroContent = (field: keyof HeroContentConfig, value: any) => {
    const currentContent = mergedConfig.hero?.content || {};
    const updatedValue = typeof value === 'object' && value !== null && !Array.isArray(value)
      ? { ...(currentContent[field] as any), ...value }
      : value;

    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        content: { ...currentContent, [field]: updatedValue },
      },
    });
  };

  const updateHeroButton = (buttonType: 'primary' | 'secondary', field: keyof ButtonConfig, value: any) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        buttons: {
          ...mergedConfig.hero!.buttons!,
          [buttonType]: { ...mergedConfig.hero!.buttons![buttonType]!, [field]: value },
        },
      },
    });
  };

  const updateHeroButtonTheme = (
    buttonType: 'primary' | 'secondary',
    theme: 'light' | 'dark',
    field: string,
    value: any
  ) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        buttons: {
          ...mergedConfig.hero!.buttons!,
          [buttonType]: {
            ...mergedConfig.hero!.buttons![buttonType]!,
            [theme]: {
              ...mergedConfig.hero!.buttons![buttonType]![theme]!,
              [field]: value,
            },
          },
        },
      },
    });
  };

  const updateHeroCards = (theme: 'light' | 'dark', field: string, value: any) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        cards: {
          ...mergedConfig.hero!.cards!,
          [theme]: { ...mergedConfig.hero!.cards![theme], [field]: value },
        },
      },
    });
  };

  const updateHeroBackground = (field: keyof BackgroundConfig, value: any) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        background: { ...mergedConfig.hero!.background!, [field]: value },
      },
    });
  };

  const batchUpdateHeroBackground = (updates: Partial<BackgroundConfig>) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        background: { ...mergedConfig.hero!.background!, ...updates },
      },
    });
  };

  // Accordion updates
  const updateAccordion = (field: keyof NonNullable<ServicioDetailConfig['accordion']>, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: { ...mergedConfig.accordion!, [field]: value },
    });
  };

  const updateAccordionStyle = (theme: 'light' | 'dark', field: string, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          [theme]: {
            ...mergedConfig.accordion!.styles![theme]!,
            [field]: value,
          },
        },
      },
    });
  };

  const updateAccordionTypography = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          typography: {
            ...mergedConfig.accordion!.styles!.typography!,
            [field]: value,
          },
        },
      },
    });
  };

  const updateAccordionContentCards = (theme: 'light' | 'dark', field: string, value: any) => {
    const defaultContentCards = {
      light: { 
        background: 'rgba(0, 0, 0, 0.05)', 
        borderColor: 'transparent', 
        textColor: '#374151',
        borderRadius: '0.5rem',
        iconBackground: '#f3f4f6',
        iconColor: '#8b5cf6',
      },
      dark: { 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderColor: 'transparent', 
        textColor: '#d1d5db',
        borderRadius: '0.5rem',
        iconBackground: '#374151',
        iconColor: '#a78bfa',
      },
    };

    const currentContentCards = mergedConfig.accordion?.styles?.contentCards || defaultContentCards;
    
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          contentCards: {
            ...currentContentCards,
            [theme]: { ...currentContentCards[theme], [field]: value },
          },
        },
      },
    });
  };

  const updateAccordionIconConfig = (theme: 'light' | 'dark', field: string, value: any) => {
    const defaultIconConfig = DEFAULT_CONFIG.accordion!.styles!.iconConfig!;
    const currentIconConfig = mergedConfig.accordion?.styles?.iconConfig || defaultIconConfig;
    
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          iconConfig: {
            ...currentIconConfig,
            [theme]: { ...currentIconConfig[theme], [field]: value },
          },
        },
      },
    });
  };

  const updatePanelIcon = (panelId: string, icon: string) => {
    const updatedPanels = mergedConfig.accordion!.panels.map(panel =>
      panel.id === panelId ? { ...panel, icon } : panel
    );
    updateAccordion('panels', updatedPanels);
  };

  const updateSectionIcons = (section: 'caracteristicas' | 'beneficios' | 'incluye' | 'noIncluye', field: string, value: any) => {
    const defaultSectionIcons = DEFAULT_CONFIG.accordion!.styles!.sectionIcons!;
    const currentSectionIcons = mergedConfig.accordion?.styles?.sectionIcons || defaultSectionIcons;
    
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          sectionIcons: {
            ...currentSectionIcons,
            [section]: { ...currentSectionIcons[section], [field]: value },
          },
        },
      },
    });
  };

  const updateAccordionBackground = (field: keyof BackgroundConfig, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        background: { ...mergedConfig.accordion!.background!, [field]: value },
      },
    });
  };

  const batchUpdateAccordionBackground = (updates: Partial<BackgroundConfig>) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        background: { ...mergedConfig.accordion!.background!, ...updates },
      },
    });
  };

  const updateAccordionHeader = (field: keyof AccordionHeaderConfig, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        header: { ...mergedConfig.accordion!.header!, [field]: value },
      },
    });
  };

  const updateAccordionHeaderTitle = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        header: {
          ...mergedConfig.accordion!.header!,
          title: { ...mergedConfig.accordion!.header!.title, [field]: value },
        },
      },
    });
  };

  const updateAccordionHeaderSubtitle = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        header: {
          ...mergedConfig.accordion!.header!,
          subtitle: { ...mergedConfig.accordion!.header!.subtitle, [field]: value },
        },
      },
    });
  };

  const togglePanelEnabled = (panelId: string) => {
    const updatedPanels = mergedConfig.accordion!.panels.map(panel =>
      panel.id === panelId ? { ...panel, enabled: !panel.enabled } : panel
    );
    updateAccordion('panels', updatedPanels);
  };

  const movePanelUp = (index: number) => {
    if (index <= 0) return;
    const panels = [...mergedConfig.accordion!.panels];
    [panels[index - 1], panels[index]] = [panels[index], panels[index - 1]];
    updateAccordion('panels', panels);
  };

  const movePanelDown = (index: number) => {
    const panels = [...mergedConfig.accordion!.panels];
    if (index >= panels.length - 1) return;
    [panels[index], panels[index + 1]] = [panels[index + 1], panels[index]];
    updateAccordion('panels', panels);
  };

  // Sidebar updates
  const updateSidebar = (field: keyof NonNullable<ServicioDetailConfig['sidebar']>, value: any) => {
    onChange({
      ...mergedConfig,
      sidebar: { ...mergedConfig.sidebar!, [field]: value },
    });
  };

  // Design updates
  const updateDesign = (field: keyof NonNullable<ServicioDetailConfig['design']>, value: any) => {
    onChange({
      ...mergedConfig,
      design: { ...mergedConfig.design!, [field]: value },
    });
  };

  // CTA updates
  const updateCtaTitle = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        title: { ...mergedConfig.cta!.title!, [field]: value },
      },
    });
  };

  const updateCtaSubtitle = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        subtitle: { ...mergedConfig.cta!.subtitle!, [field]: value },
      },
    });
  };

  const updateCtaPrimaryButton = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        buttons: {
          ...mergedConfig.cta!.buttons!,
          primary: { ...mergedConfig.cta!.buttons!.primary!, [field]: value },
        },
      },
    });
  };

  const updateCtaSecondaryButton = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        buttons: {
          ...mergedConfig.cta!.buttons!,
          secondary: { ...mergedConfig.cta!.buttons!.secondary!, [field]: value },
        },
      },
    });
  };

  const updateCtaBackgroundImage = (imageUrl: string) => {
    onChange({
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        background: { ...mergedConfig.cta!.background!, imageUrl },
      },
    });
  };

  const updateCtaBackgroundOverlay = (overlay: number) => {
    onChange({
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        background: { ...mergedConfig.cta!.background!, overlay },
      },
    });
  };

  // =========================================================================
  // Tabs Configuration
  // =========================================================================

  const tabs: { id: MainTabType; label: string; icon: string }[] = [
    { id: 'hero', label: 'Hero', icon: '🖼️' },
    { id: 'accordion', label: 'Acordeón', icon: '🎛️' },
    { id: 'sidebar', label: 'Sidebar', icon: '📊' },
    { id: 'design', label: 'Diseño', icon: '🎨' },
    { id: 'cta', label: 'CTA', icon: '🎯' },
  ];

  return (
    <div className="space-y-4">
      {/* Main Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* TAB: Hero */}
          {activeTab === 'hero' && (
            <HeroConfigSectionCompact
              mergedConfig={mergedConfig}
              isExpanded={true}
              onToggle={() => {}}
              updateHero={updateHero}
              updateHeroContent={updateHeroContent}
              updateHeroButton={updateHeroButton}
              updateHeroButtonTheme={updateHeroButtonTheme}
              updateHeroCards={updateHeroCards}
              updateHeroBackground={updateHeroBackground}
              batchUpdateHeroBackground={batchUpdateHeroBackground}
            />
          )}

          {/* TAB: Acordeón */}
          {activeTab === 'accordion' && (
            <AccordionConfigSectionCompact
              mergedConfig={mergedConfig}
              isExpanded={true}
              onToggle={() => {}}
              updateAccordion={updateAccordion}
              updateAccordionStyle={updateAccordionStyle}
              updateAccordionTypography={updateAccordionTypography}
              updateAccordionContentCards={updateAccordionContentCards}
              updateAccordionIconConfig={updateAccordionIconConfig}
              updateSectionIcons={updateSectionIcons}
              updatePanelIcon={updatePanelIcon}
              updateAccordionBackground={updateAccordionBackground}
              batchUpdateAccordionBackground={batchUpdateAccordionBackground}
              togglePanelEnabled={togglePanelEnabled}
              movePanelUp={movePanelUp}
              movePanelDown={movePanelDown}
              updateAccordionHeader={updateAccordionHeader}
              updateAccordionHeaderTitle={updateAccordionHeaderTitle}
              updateAccordionHeaderSubtitle={updateAccordionHeaderSubtitle}
            />
          )}

          {/* TAB: Sidebar */}
          {activeTab === 'sidebar' && (
            <SidebarTab
              mergedConfig={mergedConfig}
              updateSidebar={updateSidebar}
            />
          )}

          {/* TAB: Diseño */}
          {activeTab === 'design' && (
            <DesignTab
              mergedConfig={mergedConfig}
              updateDesign={updateDesign}
            />
          )}

          {/* TAB: CTA */}
          {activeTab === 'cta' && (
            <CtaTab
              mergedConfig={mergedConfig}
              updateCtaBackgroundImage={updateCtaBackgroundImage}
              updateCtaBackgroundOverlay={updateCtaBackgroundOverlay}
              updateCtaTitle={updateCtaTitle}
              updateCtaSubtitle={updateCtaSubtitle}
              updateCtaPrimaryButton={updateCtaPrimaryButton}
              updateCtaSecondaryButton={updateCtaSecondaryButton}
            />
          )}
        </div>
      </div>

      {/* Resumen de Configuración */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
        <h3 className="text-lg font-bold text-violet-800 dark:text-violet-200 mb-2 flex items-center gap-2">
          📄 Resumen
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Hero</p>
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {mergedConfig.hero?.showBreadcrumb ? '✓ Breadcrumb' : '○ Sin Breadcrumb'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Paneles</p>
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {mergedConfig.accordion?.panels.filter(p => p.enabled).length}/{mergedConfig.accordion?.panels.length} activos
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Sidebar</p>
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {[
                mergedConfig.sidebar?.showRelatedServices,
                mergedConfig.sidebar?.showCategoryTag,
                mergedConfig.sidebar?.showPriceRange,
                mergedConfig.sidebar?.showContactButton,
              ].filter(Boolean).length} elementos
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Diseño</p>
            <p className="font-medium text-gray-700 dark:text-gray-200 capitalize">
              {mergedConfig.design?.headerStyle || 'minimal'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TAB: Sidebar
// =============================================================================
interface SidebarTabProps {
  mergedConfig: ServicioDetailConfig;
  updateSidebar: (field: keyof NonNullable<ServicioDetailConfig['sidebar']>, value: any) => void;
}

const SidebarTab: React.FC<SidebarTabProps> = ({ mergedConfig, updateSidebar }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CompactToggle
          label="Servicios Relacionados"
          description="Mostrar otros servicios sugeridos"
          checked={mergedConfig.sidebar?.showRelatedServices ?? true}
          onChange={(checked) => updateSidebar('showRelatedServices', checked)}
        />

        <CompactToggle
          label="Etiqueta de Categoría"
          description="Badge con la categoría del servicio"
          checked={mergedConfig.sidebar?.showCategoryTag ?? true}
          onChange={(checked) => updateSidebar('showCategoryTag', checked)}
        />

        <CompactToggle
          label="Rango de Precios"
          description="Mostrar indicador de precios"
          checked={mergedConfig.sidebar?.showPriceRange ?? true}
          onChange={(checked) => updateSidebar('showPriceRange', checked)}
        />

        <CompactToggle
          label="Botón de Contacto"
          description="CTA para solicitar información"
          checked={mergedConfig.sidebar?.showContactButton ?? true}
          onChange={(checked) => updateSidebar('showContactButton', checked)}
        />
      </div>

      {/* Vista previa de Sidebar */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 mb-3">Vista Previa Sidebar</p>
        <div className="space-y-2">
          {mergedConfig.sidebar?.showCategoryTag && (
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs inline-block">
              Categoría
            </div>
          )}
          {mergedConfig.sidebar?.showPriceRange && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              💰 Desde $XXX
            </div>
          )}
          {mergedConfig.sidebar?.showContactButton && (
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium">
              Solicitar Información
            </button>
          )}
          {mergedConfig.sidebar?.showRelatedServices && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 mb-2">Servicios Relacionados</p>
              <div className="space-y-1">
                {[1, 2].map(i => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TAB: Diseño
// =============================================================================
interface DesignTabProps {
  mergedConfig: ServicioDetailConfig;
  updateDesign: (field: keyof NonNullable<ServicioDetailConfig['design']>, value: any) => void;
}

const DesignTab: React.FC<DesignTabProps> = ({ mergedConfig, updateDesign }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Estilo del Header
          </label>
          <select
            value={mergedConfig.design?.headerStyle ?? 'minimal'}
            onChange={(e) => updateDesign('headerStyle', e.target.value as any)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="minimal">Minimalista</option>
            <option value="card">Tarjeta con sombra</option>
            <option value="gradient">Con gradiente</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Radio de borde
          </label>
          <select
            value={mergedConfig.design?.panelBorderRadius ?? 'rounded-xl'}
            onChange={(e) => updateDesign('panelBorderRadius', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="rounded-none">Sin bordes</option>
            <option value="rounded-md">Redondeado suave</option>
            <option value="rounded-lg">Redondeado medio</option>
            <option value="rounded-xl">Redondeado grande</option>
            <option value="rounded-2xl">Muy redondeado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Padding de contenido
          </label>
          <select
            value={mergedConfig.design?.contentPadding ?? 'normal'}
            onChange={(e) => updateDesign('contentPadding', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="compact">Compacto</option>
            <option value="normal">Normal</option>
            <option value="spacious">Espacioso</option>
          </select>
        </div>

        <CompactColorPicker
          label="Color de acento"
          value={mergedConfig.design?.accentColor ?? '#7c3aed'}
          onChange={(value) => updateDesign('accentColor', value)}
        />
      </div>

      <CompactToggle
        label="Sombras en paneles"
        description="Añadir sombra a los paneles"
        checked={mergedConfig.design?.panelShadow ?? true}
        onChange={(checked) => updateDesign('panelShadow', checked)}
      />

      {/* Vista previa de diseño */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 mb-3">Vista Previa Panel</p>
        <div 
          className={`bg-white dark:bg-gray-800 p-4 ${mergedConfig.design?.panelBorderRadius} ${mergedConfig.design?.panelShadow ? 'shadow-lg' : ''} border border-gray-200 dark:border-gray-700`}
        >
          <div 
            className="h-1 w-16 rounded mb-3"
            style={{ backgroundColor: mergedConfig.design?.accentColor ?? '#7c3aed' }}
          />
          <p className="font-medium text-gray-700 dark:text-gray-200 text-sm">Ejemplo de Panel</p>
          <p className="text-xs text-gray-500 mt-1">Contenido del panel con el diseño configurado</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TAB: CTA
// =============================================================================
interface CtaTabProps {
  mergedConfig: ServicioDetailConfig;
  updateCtaBackgroundImage: (imageUrl: string) => void;
  updateCtaBackgroundOverlay: (overlay: number) => void;
  updateCtaTitle: (field: string, value: any) => void;
  updateCtaSubtitle: (field: string, value: any) => void;
  updateCtaPrimaryButton: (field: string, value: any) => void;
  updateCtaSecondaryButton: (field: string, value: any) => void;
}

const CtaTab: React.FC<CtaTabProps> = ({
  mergedConfig,
  updateCtaBackgroundImage,
  updateCtaBackgroundOverlay,
  updateCtaTitle,
  updateCtaSubtitle,
  updateCtaPrimaryButton,
  updateCtaSecondaryButton,
}) => {
  return (
    <div className="space-y-4">
      <CompactSection title="Fondo de la Sección CTA" icon="🖼️" defaultOpen>
        <CtaBackgroundEditor
          imageUrl={mergedConfig.cta?.background?.imageUrl || ''}
          overlay={mergedConfig.cta?.background?.overlay ?? 0.5}
          onUpdateImage={updateCtaBackgroundImage}
          onUpdateOverlay={updateCtaBackgroundOverlay}
        />
      </CompactSection>

      <CompactSection title="Contenido y Botones" icon="✏️" defaultOpen>
        <CtaStylePanel
          title={mergedConfig.cta!.title!}
          subtitle={mergedConfig.cta!.subtitle!}
          buttons={mergedConfig.cta!.buttons!}
          onUpdateTitle={updateCtaTitle}
          onUpdateSubtitle={updateCtaSubtitle}
          onUpdatePrimaryButton={updateCtaPrimaryButton}
          onUpdateSecondaryButton={updateCtaSecondaryButton}
        />
      </CompactSection>
    </div>
  );
};

export default ServicioDetailConfigSectionCompact;
