/**
 * 🎛️ CONFIGURACIÓN CMS PARA PÁGINA DE DETALLE DE SERVICIO
 * Panel de configuración para personalizar la página ServicioDetail
 * 
 * Permite configurar:
 * - Apariencia del acordeón
 * - Paneles visibles por defecto
 * - Colores y estilos
 * - Comportamiento del Hero
 * 
 * REFACTORIZADO: Tipos e interfaces movidos a types/servicioDetailConfig.ts
 * Componentes reutilizables en shared/ y sections/
 */

import React, { useState } from 'react';
import CtaStylePanel from './shared/CtaStylePanel';
import CtaBackgroundEditor from './shared/CtaBackgroundEditor';
import { HeroConfigSection } from './sections/HeroConfigSection';
import { AccordionConfigSection } from './sections/AccordionConfigSection';
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

const ServicioDetailConfigSection: React.FC<Props> = ({ config, onChange }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateHero = (field: keyof NonNullable<ServicioDetailConfig['hero']>, value: any) => {
    onChange({
      ...mergedConfig,
      hero: { ...mergedConfig.hero!, [field]: value },
    });
  };

  const updateHeroContent = (field: keyof HeroContentConfig, value: any) => {
    const currentContent = mergedConfig.hero?.content || {};
    
    // Si el field es un objeto anidado (title, subtitle, titleGradient), hacer merge profundo
    const updatedValue = typeof value === 'object' && value !== null && !Array.isArray(value)
      ? { ...(currentContent[field] as any), ...value }
      : value;

    const newConfig = {
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        content: { 
          ...currentContent, 
          [field]: updatedValue 
        },
      },
    };

    onChange(newConfig);
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

  // Actualizar estilos de tarjetas de contenido (beneficios, características, FAQ, etc.)
  const updateAccordionContentCards = (theme: 'light' | 'dark', field: string, value: any) => {
    // Valores por defecto para contentCards
    const defaultContentCards = {
      light: {
        background: 'rgba(0, 0, 0, 0.05)',
        borderColor: 'transparent',
        borderWidth: '0',
        textColor: '#374151',
        borderRadius: '0.5rem',
        iconBackground: 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)',
        iconColor: '#ffffff',
        iconBackgroundType: 'gradient' as const,
        iconGradientFrom: '#8b5cf6',
        iconGradientTo: '#06b6d4',
        iconGradientDirection: 'to bottom right',
      },
      dark: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'transparent',
        borderWidth: '0',
        textColor: '#d1d5db',
        borderRadius: '0.5rem',
        iconBackground: 'linear-gradient(to bottom right, #a78bfa, #22d3ee)',
        iconColor: '#ffffff',
        iconBackgroundType: 'gradient' as const,
        iconGradientFrom: '#a78bfa',
        iconGradientTo: '#22d3ee',
        iconGradientDirection: 'to bottom right',
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
            [theme]: {
              ...currentContentCards[theme],
              [field]: value,
            },
          },
        },
      },
    });
  };

  // Actualizar configuración de iconos del acordeón
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
            [theme]: {
              ...currentIconConfig[theme],
              [field]: value,
            },
          },
        },
      },
    });
  };

  // Actualizar icono de un panel específico
  const updatePanelIcon = (panelId: string, icon: string) => {
    const updatedPanels = mergedConfig.accordion!.panels.map(panel =>
      panel.id === panelId ? { ...panel, icon } : panel
    );
    updateAccordion('panels', updatedPanels);
  };

  // Actualizar iconos de secciones de tarjetas (características, beneficios, incluye, noIncluye)
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
            [section]: {
              ...currentSectionIcons[section],
              [field]: value,
            },
          },
        },
      },
    });
  };

  const updateSidebar = (field: keyof NonNullable<ServicioDetailConfig['sidebar']>, value: any) => {
    onChange({
      ...mergedConfig,
      sidebar: { ...mergedConfig.sidebar!, [field]: value },
    });
  };

  const updateDesign = (field: keyof NonNullable<ServicioDetailConfig['design']>, value: any) => {
    onChange({
      ...mergedConfig,
      design: { ...mergedConfig.design!, [field]: value },
    });
  };

  const updateHeroBackground = (field: keyof BackgroundConfig, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        background: { ...mergedConfig.hero!.background!, [field]: value },
      },
    };
    onChange(updatedConfig);
  };

  const batchUpdateHeroBackground = (updates: Partial<BackgroundConfig>) => {
    const updatedConfig = {
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        background: { ...mergedConfig.hero!.background!, ...updates },
      },
    };
    onChange(updatedConfig);
  };

  const updateAccordionBackground = (field: keyof BackgroundConfig, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        background: { ...mergedConfig.accordion!.background!, [field]: value },
      },
    };
    onChange(updatedConfig);
  };

  const batchUpdateAccordionBackground = (updates: Partial<BackgroundConfig>) => {
    const updatedConfig = {
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        background: { ...mergedConfig.accordion!.background!, ...updates },
      },
    };
    onChange(updatedConfig);
  };

  // Funciones para actualizar el header del acordeón
  const updateAccordionHeader = (field: keyof AccordionHeaderConfig, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        header: { ...mergedConfig.accordion!.header!, [field]: value },
      },
    };
    onChange(updatedConfig);
  };

  const updateAccordionHeaderTitle = (field: string, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        header: {
          ...mergedConfig.accordion!.header!,
          title: { ...mergedConfig.accordion!.header!.title, [field]: value },
        },
      },
    };
    onChange(updatedConfig);
  };

  const updateAccordionHeaderSubtitle = (field: string, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        header: {
          ...mergedConfig.accordion!.header!,
          subtitle: { ...mergedConfig.accordion!.header!.subtitle, [field]: value },
        },
      },
    };
    onChange(updatedConfig);
  };

  const updateCtaTitle = (field: string, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        title: { ...mergedConfig.cta!.title!, [field]: value },
      },
    };
    onChange(updatedConfig);
  };

  const updateCtaSubtitle = (field: string, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        subtitle: { ...mergedConfig.cta!.subtitle!, [field]: value },
      },
    };
    onChange(updatedConfig);
  };

  const updateCtaPrimaryButton = (field: string, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        buttons: {
          ...mergedConfig.cta!.buttons!,
          primary: { ...mergedConfig.cta!.buttons!.primary!, [field]: value },
        },
      },
    };
    onChange(updatedConfig);
  };

  const updateCtaSecondaryButton = (field: string, value: any) => {
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        buttons: {
          ...mergedConfig.cta!.buttons!,
          secondary: { ...mergedConfig.cta!.buttons!.secondary!, [field]: value },
        },
      },
    };
    onChange(updatedConfig);
  };

  const updateCtaBackgroundImage = (imageUrl: string) => {
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        background: { ...mergedConfig.cta!.background!, imageUrl },
      },
    };
    onChange(updatedConfig);
  };

  const updateCtaBackgroundOverlay = (overlay: number) => {
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        background: { ...mergedConfig.cta!.background!, overlay },
      },
    };
    onChange(updatedConfig);
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

  const SectionHeader: React.FC<{ 
    id: string; 
    icon: string; 
    title: string; 
    description: string 
  }> = ({ id, icon, title, description }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-left">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <span className={`text-xl transition-transform duration-200 ${expandedSection === id ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );

  return (
    <div className="space-y-4">
      {/* 🖼️ Hero Section Config */}
      <HeroConfigSection
        mergedConfig={mergedConfig}
        isExpanded={expandedSection === 'hero'}
        onToggle={() => toggleSection('hero')}
        updateHero={updateHero}
        updateHeroContent={updateHeroContent}
        updateHeroButton={updateHeroButton}
        updateHeroButtonTheme={updateHeroButtonTheme}
        updateHeroCards={updateHeroCards}
        updateHeroBackground={updateHeroBackground}
        batchUpdateHeroBackground={batchUpdateHeroBackground}
      />

      {/*  Accordion Config */}
      <AccordionConfigSection
        mergedConfig={mergedConfig}
        isExpanded={expandedSection === 'accordion'}
        onToggle={() => toggleSection('accordion')}
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
      {/* 📊 Sidebar Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="sidebar"
          icon="📊"
          title="Barra Lateral"
          description="Elementos mostrados en el sidebar del servicio"
        />
        {expandedSection === 'sidebar' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showRelatedServices ?? true}
                  onChange={(e) => updateSidebar('showRelatedServices', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Servicios Relacionados</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar otros servicios sugeridos</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showCategoryTag ?? true}
                  onChange={(e) => updateSidebar('showCategoryTag', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Etiqueta de Categoría</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Badge con la categoría del servicio</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showPriceRange ?? true}
                  onChange={(e) => updateSidebar('showPriceRange', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Rango de Precios</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar indicador de precios</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showContactButton ?? true}
                  onChange={(e) => updateSidebar('showContactButton', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Botón de Contacto</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CTA para solicitar información</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 🎨 Design Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="design"
          icon="🎨"
          title="Diseño Visual"
          description="Estilos y apariencia de los componentes"
        />
        {expandedSection === 'design' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estilo del Header
                </label>
                <select
                  value={mergedConfig.design?.headerStyle ?? 'minimal'}
                  onChange={(e) => updateDesign('headerStyle', e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="minimal">Minimalista</option>
                  <option value="card">Tarjeta con sombra</option>
                  <option value="gradient">Con gradiente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Radio de borde
                </label>
                <select
                  value={mergedConfig.design?.panelBorderRadius ?? 'rounded-xl'}
                  onChange={(e) => updateDesign('panelBorderRadius', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="rounded-none">Sin bordes</option>
                  <option value="rounded-md">Redondeado suave</option>
                  <option value="rounded-lg">Redondeado medio</option>
                  <option value="rounded-xl">Redondeado grande</option>
                  <option value="rounded-2xl">Muy redondeado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color de acento
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={mergedConfig.design?.accentColor ?? '#7c3aed'}
                    onChange={(e) => updateDesign('accentColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mergedConfig.design?.accentColor ?? '#7c3aed'}
                    onChange={(e) => updateDesign('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                    placeholder="#7c3aed"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 h-fit">
                <input
                  type="checkbox"
                  checked={mergedConfig.design?.panelShadow ?? true}
                  onChange={(e) => updateDesign('panelShadow', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Sombras en paneles</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Añadir sombra a los paneles</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 🎯 CTA Section Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="cta"
          icon="🎯"
          title="Sección CTA (Llamado a la Acción)"
          description="Fondo de la sección final con botones de contacto"
        />
        {expandedSection === 'cta' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
            <CtaBackgroundEditor
              imageUrl={mergedConfig.cta?.background?.imageUrl || ''}
              overlay={mergedConfig.cta?.background?.overlay ?? 0.5}
              onUpdateImage={updateCtaBackgroundImage}
              onUpdateOverlay={updateCtaBackgroundOverlay}
            />
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <CtaStylePanel
                title={mergedConfig.cta!.title!}
                subtitle={mergedConfig.cta!.subtitle!}
                buttons={mergedConfig.cta!.buttons!}
                onUpdateTitle={updateCtaTitle}
                onUpdateSubtitle={updateCtaSubtitle}
                onUpdatePrimaryButton={updateCtaPrimaryButton}
                onUpdateSecondaryButton={updateCtaSecondaryButton}
              />
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-violet-800 dark:text-violet-200 mb-3">
          📄 Resumen de Configuración
        </h3>
        <p className="text-violet-700 dark:text-violet-300 mb-4">
          Esta página muestra el detalle individual de cada servicio con sistema de acordeón.
        </p>
        <ul className="text-violet-600 dark:text-violet-400 space-y-2">
          <li>✅ <strong>Hero:</strong> {mergedConfig.hero?.showBreadcrumb ? 'Con' : 'Sin'} breadcrumb, {mergedConfig.hero?.showBackButton ? 'con' : 'sin'} botón volver</li>
          <li>✅ <strong>Paneles:</strong> {mergedConfig.accordion?.panels.filter(p => p.enabled).length} de {mergedConfig.accordion?.panels.length} activos</li>
          <li>✅ <strong>Panel inicial:</strong> {mergedConfig.accordion?.defaultOpenPanel || 'Ninguno'}</li>
          <li>✅ <strong>Múltiples abiertos:</strong> {mergedConfig.accordion?.expandMultiple ? 'Sí' : 'No'}</li>
          <li>✅ <strong>Sidebar:</strong> {[
            mergedConfig.sidebar?.showRelatedServices && 'Relacionados',
            mergedConfig.sidebar?.showCategoryTag && 'Categoría',
            mergedConfig.sidebar?.showPriceRange && 'Precios',
            mergedConfig.sidebar?.showContactButton && 'Contacto',
          ].filter(Boolean).join(', ') || 'Sin elementos'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ServicioDetailConfigSection;

