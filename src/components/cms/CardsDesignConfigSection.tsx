import React, { useState, useEffect, useMemo } from 'react';
import type { PageData, CardDesignStyles, StrictCardDesignStyles } from '../../types/cms';
import ColorWithOpacity from './ColorWithOpacity';
import GradientPicker from './GradientPicker';
import ShadowControl from './ShadowControl';
import { updatePage } from '../../services/cmsApi';

interface CardsDesignConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  setHasGlobalChanges: (value: boolean) => void;
}

const CardsDesignConfigSection: React.FC<CardsDesignConfigSectionProps> = ({
  pageData,
  updateContent,
  setHasGlobalChanges
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState<'solutions' | 'valueAdded' | 'contact' | 'featuredBlog'>('solutions');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Valores por defecto para Solutions (mantener originales)
  const defaultSolutionsLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '1px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.15)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#1f2937',
    titleColor: '#1f2937',
    descriptionColor: '#4b5563',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    cardsAlignment: 'left',
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  const defaultSolutionsDarkStyles: CardDesignStyles = {
    background: 'rgba(0, 0, 0, 0.3)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(0, 0, 0, 0.4)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#ffffff',
    titleColor: '#ffffff',
    descriptionColor: '#d1d5db',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    cardsAlignment: 'left',
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  // Valores por defecto para Value Added
  const defaultValueAddedLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#7528ee',
    titleColor: '#1F2937',
    descriptionColor: '#4B5563',
    linkColor: '#06B6D4',
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  const defaultValueAddedDarkStyles: CardDesignStyles = {
    background: 'rgba(17, 24, 39, 0.9)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(31, 41, 55, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#ffffff',
    titleColor: '#FFFFFF',
    descriptionColor: '#D1D5DB',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  // Valores por defecto para Contact
  const defaultContactLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '1px',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 1)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 8px 30px rgba(139, 92, 246, 0.15)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#4F46E5',
    titleColor: '#1F2937',
    descriptionColor: '#4B5563',
    linkColor: '#8B5CF6',
    cardMinWidth: '300px',
    cardMaxWidth: '400px',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: true,
    iconAlignment: 'center'
  };

  const defaultContactDarkStyles: CardDesignStyles = {
    background: 'rgba(17, 24, 39, 0.95)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '1px',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    hoverBackground: 'rgba(31, 41, 55, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 8px 30px rgba(139, 92, 246, 0.25)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#FFFFFF',
    titleColor: '#FFFFFF',
    descriptionColor: '#D1D5DB',
    linkColor: '#a78bfa',
    cardMinWidth: '300px',
    cardMaxWidth: '400px',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: true,
    iconAlignment: 'center'
  };

  // Valores por defecto para Featured Blog
  const defaultFeaturedBlogLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(229, 231, 235, 1)',
    borderWidth: '1px',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 1)',
    hoverBorder: 'rgba(139, 92, 246, 0.3)',
    hoverShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#8B5CF6',
    titleColor: '#1f2937',
    descriptionColor: '#4b5563',
    linkColor: '#8B5CF6',
    cardMinWidth: '320px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '1.5rem',
    cardsAlignment: 'left',
    iconBorderEnabled: false,
    iconAlignment: 'left'
  };

  const defaultFeaturedBlogDarkStyles: CardDesignStyles = {
    background: 'rgba(31, 41, 55, 0.95)',
    border: 'rgba(55, 65, 81, 1)',
    borderWidth: '1px',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    hoverBackground: 'rgba(31, 41, 55, 1)',
    hoverBorder: 'rgba(139, 92, 246, 0.4)',
    hoverShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
    iconBackground: 'rgba(31, 41, 55, 0.8)',
    iconColor: '#A78BFA',
    titleColor: '#f9fafb',
    descriptionColor: '#d1d5db',
    linkColor: '#A78BFA',
    cardMinWidth: '320px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '1.5rem',
    cardsAlignment: 'left',
    iconBorderEnabled: false,
    iconAlignment: 'left'
  };

  // Data loader unificado para todas las secciones
  const initialData = useMemo(() => {
    let cardData;
    if (activeSection === 'solutions') {
      cardData = pageData.content.solutions?.cardsDesign;
    } else if (activeSection === 'valueAdded') {
      cardData = pageData.content.valueAdded?.cardsDesign;
    } else if (activeSection === 'contact') {
      cardData = pageData.content.contactForm?.cardsDesign;
    } else if (activeSection === 'featuredBlog') {
      cardData = pageData.content.featuredBlog?.cardsDesign;
    }
    return cardData;
  }, [pageData.content, activeSection]);

  // Determinar defaults según la sección activa
  const currentDefaults = useMemo(() => {
    if (activeSection === 'solutions') {
      return { light: defaultSolutionsLightStyles, dark: defaultSolutionsDarkStyles };
    } else if (activeSection === 'valueAdded') {
      return { light: defaultValueAddedLightStyles, dark: defaultValueAddedDarkStyles };
    } else if (activeSection === 'contact') {
      return { light: defaultContactLightStyles, dark: defaultContactDarkStyles };
    } else if (activeSection === 'featuredBlog') {
      return { light: defaultFeaturedBlogLightStyles, dark: defaultFeaturedBlogDarkStyles };
    }
    return { light: defaultSolutionsLightStyles, dark: defaultSolutionsDarkStyles }; // Fallback
  }, [
    activeSection, 
    defaultSolutionsLightStyles, defaultSolutionsDarkStyles,
    defaultValueAddedLightStyles, defaultValueAddedDarkStyles,
    defaultContactLightStyles, defaultContactDarkStyles,
    defaultFeaturedBlogLightStyles, defaultFeaturedBlogDarkStyles
  ]);

  // Estados unificados con inicialización simple
  const [lightStyles, setLightStyles] = useState<CardDesignStyles>(() => {
    return initialData?.light || ({} as CardDesignStyles);
  });
  
  const [darkStyles, setDarkStyles] = useState<CardDesignStyles>(() => {
    return initialData?.dark || ({} as CardDesignStyles);
  });

  // Solo cargar datos reales de BD, NO defaults automáticos
  const [justSaved, setJustSaved] = useState(false);
  
  // 🔥 Referencia para trackear si el usuario ha hecho cambios
  const [userHasModified, setUserHasModified] = useState(false);

  // 🔥 CORREGIDO: Solo cargar datos cuando cambia la SECCIÓN, no cuando cambia pageData
  // Esto evita que se sobrescriban los cambios del usuario
  useEffect(() => {
    // No actualizar si el usuario ha modificado algo o acabamos de guardar
    if (justSaved || userHasModified) {
      return;
    }
    
    // Solo actualizar cuando hay datos reales del servidor
    if (initialData?.light) {
      setLightStyles(initialData.light);
    } else {
      // Si no hay datos del servidor, usar defaults
      setLightStyles(currentDefaults.light);
    }
  }, [activeSection]); // 🔥 Solo depende de activeSection, NO de initialData

  useEffect(() => {
    // No actualizar si el usuario ha modificado algo o acabamos de guardar
    if (justSaved || userHasModified) {
      return;
    }
    
    // Solo actualizar cuando hay datos reales del servidor
    if (initialData?.dark) {
      setDarkStyles(initialData.dark);
    } else {
      // Si no hay datos del servidor, usar defaults
      setDarkStyles(currentDefaults.dark);
    }
  }, [activeSection]); // 🔥 Solo depende de activeSection, NO de initialData
  
  // 🔥 NUEVO: Efecto separado para sincronizar cuando llegan datos del servidor
  // (por ejemplo, después de recargar la página)
  useEffect(() => {
    // Solo sincronizar si NO hay modificaciones del usuario y NO acabamos de guardar
    if (userHasModified || justSaved) {
      return;
    }
    
    // Sincronizar con datos del servidor si existen
    if (initialData?.light && Object.keys(initialData.light).length > 0) {
      setLightStyles(prev => {
        // Solo actualizar si los datos son diferentes (evitar loops)
        const isDifferent = JSON.stringify(prev) !== JSON.stringify(initialData.light);
        return isDifferent ? initialData.light : prev;
      });
    }
    if (initialData?.dark && Object.keys(initialData.dark).length > 0) {
      setDarkStyles(prev => {
        const isDifferent = JSON.stringify(prev) !== JSON.stringify(initialData.dark);
        return isDifferent ? initialData.dark : prev;
      });
    }
  }, [initialData]);

  const currentStyles = activeTheme === 'light' ? lightStyles : darkStyles;
  
  // 🔥 Estilos seguros con fallback a defaults para evitar undefined
  const safeCurrentStyles = {
    ...(activeTheme === 'light' ? currentDefaults.light : currentDefaults.dark),
    ...currentStyles
  } as StrictCardDesignStyles;

  const updateCardStyle = (field: keyof CardDesignStyles, value: string | boolean) => {
    // 🔥 Marcar que el usuario ha modificado (evita sobrescritura por efectos)
    setUserHasModified(true);
    
    if (activeTheme === 'light') {
      setLightStyles(prev => {
        const newStyles = { ...prev, [field]: value };
        return newStyles;
      });
    } else {
      setDarkStyles(prev => {
        const newStyles = { ...prev, [field]: value };
        return newStyles;
      });
    }
    setHasUnsavedChanges(true);
    setHasGlobalChanges(true);
  };

  // Guardado directo usando updatePage (con autenticación automática)
  const saveChanges = async () => {
    try {
      // Mapear la sección activa al campo correcto en el contenido
      const getSectionKey = (section: string) => {
        if (section === 'contact') return 'contactForm';
        return section;
      };

      const sectionKey = getSectionKey(activeSection);
      
      // Construir el nuevo cardsDesign
      const newCardsDesign = {
        light: { ...lightStyles },
        dark: { ...darkStyles }
      };
      
      // Construir objeto completo con los datos actuales del estado
      const updatedContent = {
        ...pageData.content,
        [sectionKey]: {
          ...pageData.content[sectionKey as keyof typeof pageData.content],
          cardsDesign: newCardsDesign
        }
      };
      
      // 🔥 IMPORTANTE: Actualizar el estado del padre PRIMERO para mantener sincronizado
      // Esto asegura que cuando cambiemos de sección, los datos estén actualizados
      updateContent(`${sectionKey}.cardsDesign`, newCardsDesign);
      
      // Usar updatePage que maneja autenticación automáticamente
      await updatePage('home', {
        content: updatedContent,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });
      
      // 🔥 Limpiar cache local para forzar recarga de datos frescos
      try {
        localStorage.removeItem('cmsCache_page-home');
      } catch (e) {
        console.error('Error limpiando cache:', e);
      }
      
      // Marcar que acabamos de guardar para evitar recargas automáticas
      setJustSaved(true);
      setUserHasModified(false); // 🔥 Resetear flag de modificación
      setHasUnsavedChanges(false);
      setHasGlobalChanges(false);
      
      // Resetear flag después de un tiempo para permitir futuras recargas
      setTimeout(() => {
        setJustSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving card design changes:', error);
    }
  };

  // 🔥 NUEVO: Exponer función para el botón global de guardar
  useEffect(() => {
    (window as any).__cardsDesignSave = saveChanges;
    return () => {
      delete (window as any).__cardsDesignSave;
    };
  }, [lightStyles, darkStyles, activeSection, justSaved]);

  // 🔥 NUEVO: Resetear userHasModified cuando cambia de sección
  useEffect(() => {
    setUserHasModified(false);
    setHasUnsavedChanges(false);
  }, [activeSection]);

  const resetToDefaults = () => {
    setUserHasModified(true); // 🔥 También marcar como modificado
    if (activeTheme === 'light') {
      setLightStyles(currentDefaults.light);
    } else {
      setDarkStyles(currentDefaults.dark);
    }
    setHasUnsavedChanges(true);
    setHasGlobalChanges(true);
  };

  const applyTransparentDefaults = () => {
    setUserHasModified(true);
    setLightStyles(currentDefaults.light);
    setDarkStyles(currentDefaults.dark);
    setHasUnsavedChanges(true);
    setHasGlobalChanges(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2 md:gap-0">
        {/* Left: Title, Section Selector, Status */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
              🎨 Diseño de Tarjetas
            </h2>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
              <button
                onClick={() => setActiveSection('solutions')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeSection === 'solutions'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Solutions
              </button>
              <button
                onClick={() => setActiveSection('valueAdded')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeSection === 'valueAdded'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Value Added
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeSection === 'contact'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                📧 Contact
              </button>
              <button
                onClick={() => setActiveSection('featuredBlog')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeSection === 'featuredBlog'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                📰 Blog
              </button>
            </div>
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
                ⚠️ Sin guardar
              </span>
            )}
          </div>
        </div>
        {/* Right: Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={applyTransparentDefaults}
            className="flex-1 md:flex-none px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
            title="Aplicar diseño transparente a ambos temas y guardar"
          >
            ✨ Aplicar Transparencia
          </button>
          <button
            onClick={resetToDefaults}
            className="flex-1 md:flex-none px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
          >
            🔄 Restaurar
          </button>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="mb-3">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTheme('light')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTheme === 'light'
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            🌞 Tema Claro
          </button>
          <button
            onClick={() => setActiveTheme('dark')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTheme === 'dark'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            🌙 Tema Oscuro
          </button>
        </div>
      </div>

      {/* Preview Card - Vista Previa Unificada */}
      <div className="mb-4 px-2 py-3 flex justify-center">
        <div
          key={`preview-${activeTheme}-${safeCurrentStyles.cardMinWidth}-${safeCurrentStyles.cardPadding}-${safeCurrentStyles.cardsAlignment}`}
          className="group relative w-full max-w-sm rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            background: safeCurrentStyles.background,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: safeCurrentStyles.shadow,
            padding: safeCurrentStyles.cardPadding || '1.5rem'
          }}
          onMouseEnter={(e) => {
            const card = e.currentTarget;
            card.style.background = safeCurrentStyles.hoverBackground;
            card.style.boxShadow = safeCurrentStyles.hoverShadow;
            const borderEl = card.querySelector('.card-border') as HTMLElement;
            if (borderEl) {
              borderEl.style.background = safeCurrentStyles.hoverBorder || safeCurrentStyles.border;
            }
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget;
            card.style.background = safeCurrentStyles.background;
            card.style.boxShadow = safeCurrentStyles.shadow;
            const borderEl = card.querySelector('.card-border') as HTMLElement;
            if (borderEl) {
              borderEl.style.background = safeCurrentStyles.border;
            }
          }}
        >
          {/* Borde con soporte para degradados */}
          <div
            className="card-border absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
            style={{
              background: safeCurrentStyles.border,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: safeCurrentStyles.borderWidth
            }}
          />
          {/* Icon Preview */}
          {safeCurrentStyles.iconBorderEnabled !== false ? (
            <div
              className="relative mb-3 w-10 h-10 rounded-lg p-0.5"
              style={{ background: safeCurrentStyles.iconGradient }}
            >
              <div
                className="w-full h-full rounded-lg flex items-center justify-center text-lg"
                style={{
                  background: safeCurrentStyles.iconBackground,
                  color: safeCurrentStyles.iconColor
                }}
              >
                {activeSection === 'contact' ? '📧' : '💡'}
              </div>
            </div>
          ) : (
            <div className="relative mb-3 w-10 h-10 flex items-center justify-center text-lg"
                 style={{ color: safeCurrentStyles.iconColor }}>
              {activeSection === 'contact' ? '📧' : '💡'}
            </div>
          )}

          {/* Content Preview */}
          <h4
            className="text-lg font-bold mb-2"
            style={{ color: safeCurrentStyles.titleColor }}
          >
            {activeSection === 'contact' ? 'Contáctanos' : 'Título de Ejemplo'}
          </h4>
          <p
            className="text-sm leading-relaxed mb-2"
            style={{ color: safeCurrentStyles.descriptionColor }}
          >
            {activeSection === 'contact'
              ? '¿Tienes un proyecto en mente? Cuéntanos.'
              : 'Descripción de ejemplo para la tarjeta.'
            }
          </p>

          {/* Link Preview */}
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span
              className="text-xs font-medium mr-1.5"
              style={{ color: safeCurrentStyles.linkColor }}
            >
              {activeSection === 'contact' ? 'Contactar ahora' : 'Conocer más'}
            </span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: safeCurrentStyles.linkColor }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Simple Mode Configuration */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          🎨 Configuración Simple
        </h3>

        {/* Renderizado condicional para Blog vs Otras secciones */}
        {activeSection === 'featuredBlog' ? (
          /* 📰 CONFIGURACIÓN SIMPLIFICADA PARA BLOG */
          <div className="space-y-3">
            {/* Fondo y Borde */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Fondo de Tarjeta */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <ColorWithOpacity
                  label="Fondo de Tarjeta"
                  value={safeCurrentStyles.background}
                  onChange={(value) => updateCardStyle('background', value)}
                />
              </div>

              {/* Borde y Grosor */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color del Borde
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="color"
                    value={(() => {
                      const borderValue = safeCurrentStyles.border || '#e5e7eb';
                      if (borderValue.startsWith('#')) {
                        return borderValue;
                      }
                      const hexMatch = borderValue.match(/#[0-9a-fA-F]{6}/);
                      return hexMatch ? hexMatch[0] : '#e5e7eb';
                    })()}
                    onChange={(e) => updateCardStyle('border', e.target.value)}
                    className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={safeCurrentStyles.border}
                    onChange={(e) => updateCardStyle('border', e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                  />
                </div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grosor del Borde
                </label>
                <select
                  value={safeCurrentStyles.borderWidth}
                  onChange={(e) => updateCardStyle('borderWidth', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                >
                  <option value="0px">Sin borde</option>
                  <option value="1px">Fino (1px)</option>
                  <option value="2px">Medio (2px)</option>
                  <option value="3px">Grueso (3px)</option>
                </select>
              </div>
            </div>

            {/* Sombras */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🌑 Sombras
              </h4>
              <ShadowControl
                label="Sombra Normal"
                value={safeCurrentStyles.shadow}
                onChange={(value) => updateCardStyle('shadow', value)}
              />
              <div className="mt-2">
                <ShadowControl
                  label="Sombra (Hover)"
                  value={safeCurrentStyles.hoverShadow}
                  onChange={(value) => updateCardStyle('hoverShadow', value)}
                />
              </div>
            </div>

            {/* Colores de Texto */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                ✏️ Colores de Texto
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Título */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del Título
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={safeCurrentStyles.titleColor}
                      onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.titleColor}
                      onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>

                {/* Extracto */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del Extracto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={safeCurrentStyles.excerptColor || safeCurrentStyles.descriptionColor}
                      onChange={(e) => updateCardStyle('excerptColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.excerptColor || safeCurrentStyles.descriptionColor}
                      onChange={(e) => updateCardStyle('excerptColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color de Metadata
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={safeCurrentStyles.metaColor || '#6b7280'}
                      onChange={(e) => updateCardStyle('metaColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.metaColor || '#6b7280'}
                      onChange={(e) => updateCardStyle('metaColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>

                {/* CTA Color */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del CTA
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={safeCurrentStyles.ctaColor || safeCurrentStyles.linkColor}
                      onChange={(e) => updateCardStyle('ctaColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.ctaColor || safeCurrentStyles.linkColor}
                      onChange={(e) => updateCardStyle('ctaColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🏷️ Estilos del Badge
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <GradientPicker
                    label="Fondo del Badge"
                    value={safeCurrentStyles.badgeBackground || 'linear-gradient(135deg, #8B5CF6, #06B6D4)'}
                    onChange={(value) => updateCardStyle('badgeBackground', value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del Texto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={safeCurrentStyles.badgeTextColor || '#ffffff'}
                      onChange={(e) => updateCardStyle('badgeTextColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.badgeTextColor || '#ffffff'}
                      onChange={(e) => updateCardStyle('badgeTextColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fondo Hover */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🖱️ Efecto Hover
              </h4>
              <ColorWithOpacity
                label="Fondo (Hover)"
                value={safeCurrentStyles.hoverBackground}
                onChange={(value) => updateCardStyle('hoverBackground', value)}
              />
            </div>
          </div>
        ) : (
          /* 🎯 CONFIGURACIÓN COMPLETA PARA OTRAS SECCIONES */
          <>
    {/* Fondo y Borde - Responsive grid: 1 columna en móvil, 2 en md+ */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">

          {/* Fondo de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
            <ColorWithOpacity
              label="Fondo de Tarjeta"
              value={safeCurrentStyles.background}
              onChange={(value) => updateCardStyle('background', value)}
            />
          </div>

          {/* Borde de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
            <div className="w-full min-w-0">
              <GradientPicker
                label="Borde de Tarjeta"
                value={safeCurrentStyles.border}
                onChange={(value) => updateCardStyle('border', value)}
              />
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grosor del Borde
                </label>
                <select
                  value={safeCurrentStyles.borderWidth}
                  onChange={(e) => updateCardStyle('borderWidth', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                >
                  <option value="0px">Sin borde</option>
                  <option value="1px">Fino (1px)</option>
                  <option value="2px">Medio (2px)</option>
                  <option value="3px">Grueso (3px)</option>
                  <option value="4px">Muy grueso (4px)</option>
                </select>
              </div>
            </div>
          </div>
          
        </div>

        {/* Estilos del Icono - Solo para secciones que usan iconos (NO Value Added) */}
        {activeSection !== 'valueAdded' && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            🎯 Estilos del Icono
          </h4>

          {/* Toggle para Mostrar/Ocultar Borde */}
          <div className="mb-2 flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                🖼️ Borde del Icono
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (gradiente)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentStyles.iconBorderEnabled === true}
                onChange={(e) => updateCardStyle('iconBorderEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Alineación del Icono */}
          <div className="mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              📍 Alineación del Icono
            </label>
            <div className="flex gap-2">
              {[
                { value: 'left', label: '⬅️ Izquierda', icon: '⬅️' },
                { value: 'center', label: '⚡ Centro', icon: '⚡' },
                { value: 'right', label: '➡️ Derecha', icon: '➡️' }
              ].map(({ value, icon }) => (
                <button
                  key={value}
                  onClick={() => updateCardStyle('iconAlignment', value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    (currentStyles.iconAlignment || 'left') === value
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-xs">{icon}</span>
                  <div className="text-xs font-medium mt-1">{value.charAt(0).toUpperCase() + value.slice(1)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Gradiente del Borde */}
            <div>
              <GradientPicker
                label="Gradiente del Borde del Icono"
                value={safeCurrentStyles.iconGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                onChange={(value) => updateCardStyle('iconGradient', value)}
              />
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color del Icono
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={safeCurrentStyles.iconColor || '#ffffff'}
                  onChange={(e) => updateCardStyle('iconColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={safeCurrentStyles.iconColor || '#ffffff'}
                  onChange={(e) => updateCardStyle('iconColor', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                />
              </div>

            </div>

            {/* Color del Icono */}
            <div>

            {/* Colores de Texto - Grid de 2 columnas */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                ✏️ Colores de Texto
              </h4>
              <div className="grid grid-cols-1 gap-3">

                {/* Color del Título */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del Título
                  </label>
                  <div className="flex gap-2 w-full min-w-0">
                    <input
                      type="color"
                      value={safeCurrentStyles.titleColor}
                      onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.titleColor}
                      onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>


                {/* Color de la Descripción */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color de la Descripción
                  </label>
                  <div className="flex gap-2 w-full min-w-0">
                    <input
                      type="color"
                      value={safeCurrentStyles.descriptionColor}
                      onChange={(e) => updateCardStyle('descriptionColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.descriptionColor}
                      onChange={(e) => updateCardStyle('descriptionColor', e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>


                {/* Color del "Conocer más" */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color del "Conocer más"
                  </label>
                  <div className="flex gap-2 w-full min-w-0">
                    <input
                      type="color"
                      value={safeCurrentStyles.linkColor}
                      onChange={(e) => updateCardStyle('linkColor', e.target.value)}
                      className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={safeCurrentStyles.linkColor}
                      onChange={(e) => updateCardStyle('linkColor', e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Fondo del Contenedor - Ancho completo */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fondo del Contenedor del Icono
              </label>
              <input
                type="text"
                value={safeCurrentStyles.iconBackground}
                onChange={(e) => updateCardStyle('iconBackground', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                placeholder="rgba(255, 255, 255, 0.9)"
              />
            </div>
          </div>
        </div>
        )}
          </>
        )}
      </div>

      {/* Advanced Mode Toggle */}
      <div className="mt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-between"
        >
          <span>⚙️ Opciones Avanzadas</span>
          <span className="text-sm">{showAdvanced ? '▼' : '▶'}</span>
        </button>
      </div>

      {/* Advanced Mode Configuration */}
      {showAdvanced && (
        <div className="mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            ⚙️ Configuración Avanzada
          </h3>

          {/* Grid de 2 columnas para Tamaño y Sombras */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tamaño de Tarjetas */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                📏 Tamaño de Tarjetas
              </h4>

              {/* Presets Rápidos */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🎯 Tamaños Predefinidos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '250px');
                      updateCardStyle('cardPadding', '1.5rem');
                    }}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    📱 Pequeño
                  </button>
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '320px');
                      updateCardStyle('cardPadding', '2rem');
                    }}
                    className="px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    💻 Mediano
                  </button>
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '400px');
                      updateCardStyle('cardPadding', '2.5rem');
                    }}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    🖥️ Grande
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Ancho de Tarjetas - Slider */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    📐 Ancho Mínimo: <span className="font-mono text-blue-600 dark:text-blue-400">{currentStyles.cardMinWidth || '280px'}</span>
                  </label>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="200"
                      max="500"
                      step="10"
                      value={parseInt(currentStyles.cardMinWidth?.replace('px', '') || '280')}
                      onChange={(e) => updateCardStyle('cardMinWidth', `${e.target.value}px`)}
                      className="w-full h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg appearance-none cursor-pointer hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(to right, #8B5CF6, #06B6D4)',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>200px (Muy pequeño)</span>
                      <span>350px (Ideal)</span>
                      <span>500px (Muy grande)</span>
                    </div>
                  </div>
                </div>

                {/* Alto de Tarjetas - Toggle + Slider */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    📏 Alto Mínimo
                  </label>
                  <div className="space-y-2">
                    {/* Toggle Auto/Manual */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCardStyle('cardMinHeight', 'auto')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentStyles.cardMinHeight === 'auto'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        🔧 Automático
                      </button>
                      <button
                        onClick={() => updateCardStyle('cardMinHeight', '300px')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentStyles.cardMinHeight !== 'auto'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        📏 Manual: <span className="font-mono">{currentStyles.cardMinHeight !== 'auto' ? currentStyles.cardMinHeight : '300px'}</span>
                      </button>
                    </div>
                    
                    {/* Slider para altura manual */}
                    {currentStyles.cardMinHeight !== 'auto' && (
                      <div className="ml-4">
                        <input
                          type="range"
                          min="250"
                          max="600"
                          step="25"
                          value={parseInt(currentStyles.cardMinHeight?.replace('px', '') || '300')}
                          onChange={(e) => updateCardStyle('cardMinHeight', `${e.target.value}px`)}
                          className="w-full h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg appearance-none cursor-pointer hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                          style={{
                            background: 'linear-gradient(to right, #3B82F6, #10B981)',
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>250px</span>
                          <span>425px</span>
                          <span>600px</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Espaciado Interno - Slider */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    📦 Espaciado Interno: <span className="font-mono text-purple-600 dark:text-purple-400">{currentStyles.cardPadding || '2rem'}</span>
                  </label>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.25"
                      value={parseFloat(currentStyles.cardPadding?.replace('rem', '') || '2')}
                      onChange={(e) => updateCardStyle('cardPadding', `${e.target.value}rem`)}
                      className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg appearance-none cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>1rem (Compacto)</span>
                      <span>2.5rem (Cómodo)</span>
                      <span>4rem (Espacioso)</span>
                    </div>
                  </div>
                </div>

                {/* Ancho Máximo - Simple select */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ↔️ Ancho Máximo
                  </label>
                  <select
                    value={safeCurrentStyles.cardMaxWidth || '100%'}
                    onChange={(e) => updateCardStyle('cardMaxWidth', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
                  >
                    <option value="100%">📱 Responsive (100%)</option>
                    <option value="400px">💻 Fijo Pequeño (400px)</option>
                    <option value="500px">🖥️ Fijo Mediano (500px)</option>
                    <option value="600px">📺 Fijo Grande (600px)</option>
                  </select>
                </div>

                {/* Alineación de Tarjetas */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    🎯 Alineación de Tarjetas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'left')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentStyles.cardsAlignment === 'left'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ⬅️ Izquierda
                    </button>
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'center')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentStyles.cardsAlignment === 'center'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 ring-2 ring-green-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ⬆️ Centro
                    </button>
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'right')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentStyles.cardsAlignment === 'right'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 ring-2 ring-purple-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ➡️ Derecha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sombras */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🌑 Sombras
              </h4>
              <ShadowControl
                label="Sombra Normal"
                value={safeCurrentStyles.shadow}
                onChange={(value) => updateCardStyle('shadow', value)}
              />
            </div>
          </div>

          {/* Efectos Hover - Ancho completo con grid interno */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              🖱️ Efectos Hover
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Fondo y Borde Hover */}
              <div className="space-y-3">
                <ColorWithOpacity
                  label="Fondo (Hover)"
                  value={safeCurrentStyles.hoverBackground || 'rgba(255, 255, 255, 0.95)'}
                  onChange={(value) => updateCardStyle('hoverBackground', value)}
                />

                <GradientPicker
                  label="Borde (Hover)"
                  value={safeCurrentStyles.hoverBorder || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                  onChange={(value) => updateCardStyle('hoverBorder', value)}
                />
              </div>

              {/* Sombra Hover */}
              <div>
                <ShadowControl
                  label="Sombra (Hover)"
                  value={safeCurrentStyles.hoverShadow}
                  onChange={(value) => updateCardStyle('hoverShadow', value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
          💡 Consejos
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5 list-disc list-inside">
          <li>Los cambios se reflejan en la vista previa. Usa "💾 Guardar" para persistir.</li>
          <li>Pasa el mouse sobre la vista previa para ver los efectos hover.</li>
          <li>Usa "Restaurar" para volver a los valores originales (recuerda guardar).</li>
        </ul>
      </div>
    </div>
  );
};

export default CardsDesignConfigSection;
