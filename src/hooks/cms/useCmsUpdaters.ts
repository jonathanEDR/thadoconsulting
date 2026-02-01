import type { PageData, PageSeo, ButtonStyle } from '../../types/cms';
import type { ThemeConfig } from '../../contexts/ThemeContext';

export const useCmsUpdaters = (
  pageData: PageData | null, 
  setPageData: (data: PageData) => void,
  setThemeConfig?: (config: ThemeConfig) => void
) => {
  
  const updateContent = (field: string, value: any) => {
    if (!pageData) {
      return;
    }
    
    const keys = field.split('.');
    // Hacer una copia profunda para evitar mutaciones
    const newData = structuredClone(pageData);
    
    // Determinar si el campo es de tema o de contenido
    let current: any;
    let startIndex = 0;
    
    if (keys[0] === 'theme') {
      // Campos de tema van directo en pageData.theme
      if (!newData.theme) {
        newData.theme = { 
          default: 'light', 
          lightMode: {
            primary: '#8B5CF6',
            secondary: '#06B6D4',
            background: '#FFFFFF',
            text: '#1F2937',
            textSecondary: '#6B7280',
            cardBg: '#F9FAFB',
            border: '#E5E7EB',
            buttons: {
              ctaPrimary: { text: 'Conoce nuestros servicios', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' },
              contact: { text: 'CONTÁCTANOS', background: 'transparent', textColor: '#8B5CF6', borderColor: '#8B5CF6' },
              dashboard: { text: 'Ir al Dashboard', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' }
            }
          }, 
          darkMode: {
            primary: '#A78BFA',
            secondary: '#22D3EE',
            background: '#111827',
            text: '#F9FAFB',
            textSecondary: '#D1D5DB',
            cardBg: '#1F2937',
            border: '#374151',
            buttons: {
              ctaPrimary: { text: 'Conoce nuestros servicios', background: '#A78BFA', textColor: '#FFFFFF', borderColor: 'transparent' },
              contact: { text: 'CONTÁCTANOS', background: 'transparent', textColor: '#A78BFA', borderColor: '#A78BFA' },
              dashboard: { text: 'Ir al Dashboard', background: '#A78BFA', textColor: '#FFFFFF', borderColor: 'transparent' }
            }
          }
        };
      }
      current = newData.theme;
      startIndex = 1; // Saltar 'theme' en el path
    } else if (keys[0] === 'seo') {
      // Campos de SEO van directo en pageData.seo
      if (!newData.seo) {
        newData.seo = {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          twitterCard: ''
        };
      }
      current = newData.seo;
      startIndex = 1; // Saltar 'seo' en el path
    } else {
      // El resto va en content
      current = newData.content;
    }

    for (let i = startIndex; i < keys.length - 1; i++) {
      // Si no existe el objeto, crearlo
      if (!current[keys[i]]) {
        // SOLUCIÓN: Crear estructura específica para styles
        if (keys[i] === 'styles') {
          current[keys[i]] = {
            light: {
              titleColor: '#1f2937',
              subtitleColor: '#6b7280', 
              descriptionColor: '#4b5563',
              formBackground: 'rgba(255, 255, 255, 0.95)',
              formBorder: 'rgba(0, 0, 0, 0.1)',
              formShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              inputBackground: '#ffffff',
              inputBorder: '#e5e7eb',
              inputText: '#1f2937',
              inputPlaceholder: '#9ca3af',
              inputFocusBorder: '#3b82f6',
              labelColor: '#374151',
              buttonBackground: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
              buttonText: '#ffffff',
              buttonHover: 'linear-gradient(135deg, #7c3aed, #0891b2)',
              linkColor: '#3b82f6',
              errorColor: '#ef4444',
              successColor: '#10b981'
            },
            dark: {
              titleColor: '#ffffff',
              subtitleColor: '#d1d5db',
              descriptionColor: '#9ca3af',
              formBackground: 'rgba(31, 41, 55, 0.95)',
              formBorder: 'rgba(75, 85, 99, 0.3)',
              formShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              inputBackground: '#374151',
              inputBorder: '#4b5563',
              inputText: '#f9fafb',
              inputPlaceholder: '#6b7280',
              inputFocusBorder: '#60a5fa',
              labelColor: '#d1d5db',
              buttonBackground: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
              buttonText: '#ffffff',
              buttonHover: 'linear-gradient(135deg, #7c3aed, #0891b2)',
              linkColor: '#60a5fa',
              errorColor: '#f87171',
              successColor: '#34d399'
            }
          };
        } else {
          current[keys[i]] = {};
        }
      }
      // Si es un string (formato anterior) y necesitamos convertir a objeto
      if (typeof current[keys[i]] === 'string' && keys[i] === 'backgroundImage') {
        current[keys[i]] = { dark: current[keys[i]] }; // Mover string existente a dark
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    
    setPageData(newData);
  };

const updateTextStyle = (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos' | 'featuredBlog', field: string, mode: 'light' | 'dark', color: string) => {
    if (!pageData) return;

    const currentSection = pageData.content[section as keyof typeof pageData.content];
    if (!currentSection) return;

    // 🎯 Manejar estilos de items individuales (e.g., "items.0.titleColor")
    if (field.includes('items.')) {
      const [, itemIndex, itemField] = field.split('.');
      const index = parseInt(itemIndex, 10);
      
      if ((section === 'solutions' || section === 'valueAdded') && 'items' in currentSection && currentSection.items && currentSection.items[index]) {
        const updatedItems = [...currentSection.items];
        const item = updatedItems[index] as any; // Type cast para manejar estilos
        
        // Asegurar que el item tiene la estructura de estilos
        if (!item.styles) {
          item.styles = {
            light: { titleColor: '', descriptionColor: '' },
            dark: { titleColor: '', descriptionColor: '' }
          };
        }
        
        if (!item.styles[mode]) {
          item.styles[mode] = { titleColor: '', descriptionColor: '' };
        }
        
        // Actualizar el color específico
        item.styles[mode][itemField as 'titleColor' | 'descriptionColor'] = color;
        
        setPageData({
          ...pageData,
          content: {
            ...pageData.content,
            [section]: {
              ...currentSection,
              items: updatedItems
            } as any
          }
        });
      }
      return;
    }

    // 🎯 Manejar estilos de sección general (comportamiento original)
    setPageData({
      ...pageData,
      content: {
        ...pageData.content,
        [section]: {
          ...currentSection,
          styles: {
            ...currentSection.styles,
            [mode]: {
              ...currentSection.styles?.[mode],
              [field]: color
            }
          }
        }
      }
    });
  };

  const updateSeo = (field: keyof PageSeo, value: any) => {
    if (!pageData) return;
    
    setPageData({
      ...pageData,
      seo: {
        ...pageData.seo,
        [field]: value
      }
    });
  };

  const updateTheme = (mode: 'lightMode' | 'darkMode', field: string, value: string) => {
    if (!pageData || !pageData.theme) return;
    
    const newTheme = {
      ...pageData.theme,
      [mode]: {
        ...pageData.theme[mode],
        [field]: value
      }
    };
    
    const newPageData = {
      ...pageData,
      theme: newTheme
    };
    
    setPageData(newPageData);
    
    // IMPORTANTE: Actualizar ThemeContext
    if (setThemeConfig) {
      setThemeConfig(newTheme as ThemeConfig);
    }
  };

  const updateThemeDefault = (value: 'light' | 'dark') => {
    if (!pageData || !pageData.theme) return;
    
    const newTheme = {
      ...pageData.theme,
      default: value
    };
    
    const newPageData = {
      ...pageData,
      theme: newTheme
    };
    
    setPageData(newPageData);
    
    // IMPORTANTE: Actualizar ThemeContext
    if (setThemeConfig) {
      setThemeConfig(newTheme as ThemeConfig);
    }
  };

  const updateSimpleButtonStyle = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard' | 'viewMore' | 'featuredBlogCta', style: ButtonStyle) => {
    if (!pageData || !pageData.theme) return;

    // Asegurar que la estructura existe
    const currentTheme = { ...pageData.theme };
    if (!currentTheme[mode].buttons) {
      currentTheme[mode].buttons = {
        ctaPrimary: { text: 'Conoce nuestros servicios', background: 'transparent', textColor: '#8B5CF6', borderColor: 'transparent' },
        contact: { text: 'CONTÁCTANOS', background: 'transparent', textColor: '#8B5CF6', borderColor: '#8B5CF6' },
        dashboard: { text: 'Ir al Dashboard', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' },
        viewMore: { text: 'Ver más...', background: 'linear-gradient(135deg, #01c2cc 0%, #7528ee 100%)', textColor: '#FFFFFF', borderColor: 'transparent' }
      };
    }

    const newTheme = {
      ...currentTheme,
      [mode]: {
        ...currentTheme[mode],
        buttons: {
          ...currentTheme[mode].buttons,
          [buttonType]: style
        }
      }
    };

    const newPageData = {
      ...pageData,
      theme: newTheme
    };
    
    // Actualizar pageData
    setPageData(newPageData);
    
    // IMPORTANTE: También actualizar el ThemeContext inmediatamente
    if (setThemeConfig) {
      setThemeConfig(newTheme as ThemeConfig);
    }
  };

  return {
    updateContent,
    updateTextStyle,
    updateSeo,
    updateTheme,
    updateThemeDefault,
    updateSimpleButtonStyle
  };
};
