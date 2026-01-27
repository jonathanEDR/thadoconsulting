/**
 * 📋 TIPOS PARA CONFIGURACIÓN DE PÁGINA DE DETALLE DE SERVICIO
 * Interfaces y tipos compartidos entre componentes de configuración CMS
 */

// ============ INTERFACES DE CONFIGURACIÓN ============

export interface AccordionPanelConfig {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  description: string;
}

export interface ContentCardStyleConfig {
  background: string;
  borderColor: string;
  borderWidth?: string;
  textColor: string;
  borderRadius: string;
  iconBackground: string;
  iconColor: string;
  iconBackgroundType?: 'solid' | 'gradient';
  iconGradientFrom?: string;
  iconGradientTo?: string;
  iconGradientDirection?: string;
}

// Configuración de iconos por sección de tarjetas
export interface SectionIconConfig {
  type: 'number' | 'icon' | 'none';  // número, icono de Lucide, o sin icono
  icon?: string;                      // Nombre del icono de Lucide
  showBackground: boolean;            // Mostrar fondo del icono
}

export interface ContentCardsIconConfig {
  caracteristicas: SectionIconConfig;
  beneficios: SectionIconConfig;
  incluye: SectionIconConfig;
  noIncluye: SectionIconConfig;
}

// Configuración del encabezado/título de la sección del acordeón
export interface AccordionHeaderConfig {
  title: {
    text: string;
    icon: string;                   // Emoji (cuando iconType es 'emoji')
    fontSize: string;
    fontWeight: string;
    fontFamily?: string;            // Familia de fuente
    lineHeight?: string;            // Altura de línea
    color?: string;
    colorDark?: string;
  };
  subtitle: {
    text: string;
    fontSize: string;
    fontWeight?: string;            // Peso de fuente
    fontFamily?: string;            // Familia de fuente
    lineHeight?: string;            // Altura de línea
    color?: string;
    colorDark?: string;
  };
  alignment: 'left' | 'center' | 'right';
  showTitle: boolean;
  showSubtitle: boolean;
  showIcon?: boolean;
  // Configuración del icono del título (nivel raíz)
  iconType?: 'emoji' | 'lucide';    // Tipo de icono
  iconName?: string;                // Nombre del icono Lucide (ej: 'BookOpen')
  iconColor?: string;               // Color del icono Lucide (tema claro)
  iconColorDark?: string;           // Color del icono Lucide (tema oscuro)
}

export interface AccordionIconConfig {
  showBackground: boolean;
  iconColor: string;
  iconActiveColor: string;
  backgroundColor?: string;
  backgroundActiveColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface AccordionStyleConfig {
  light: {
    panelBackground: string;
    panelBorder: string;
    headerBackground: string;
    headerText: string;
    headerIcon: string;
    contentBackground: string;
    contentText: string;
    accentGradientFrom: string;
    accentGradientTo: string;
  };
  dark: {
    panelBackground: string;
    panelBorder: string;
    headerBackground: string;
    headerText: string;
    headerIcon: string;
    contentBackground: string;
    contentText: string;
    accentGradientFrom: string;
    accentGradientTo: string;
  };
  iconConfig?: {
    light: AccordionIconConfig;
    dark: AccordionIconConfig;
  };
  typography?: {
    fontFamily: string;
    headerFontSize: string;
    headerFontWeight: string;
    contentFontSize: string;
    contentLineHeight: string;
  };
  contentCards?: {
    light: ContentCardStyleConfig;
    dark: ContentCardStyleConfig;
  };
  sectionIcons?: ContentCardsIconConfig;
}

export interface BackgroundConfig {
  type: 'none' | 'color' | 'gradient' | 'image';
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  imageUrl?: string;
  imageLight?: string;
  imageDark?: string;
  overlayOpacity?: number;
  overlayColor?: string;
}

export interface HeroContentConfig {
  titleGradient?: {
    enabled: boolean;
    light?: { from: string; to: string; };
    dark?: { from: string; to: string; };
  };
  showCategoryTag?: boolean;
  showPrice?: boolean;
  title?: {
    text?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
  };
  subtitle?: {
    text?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    lineHeight?: string;
  };
}

export interface CardStyleConfig {
  light: {
    background: string;
    borderColor: string;
    textColor: string;
    labelColor: string;
  };
  dark: {
    background: string;
    borderColor: string;
    textColor: string;
    labelColor: string;
  };
}

export interface ButtonConfig {
  enabled: boolean;
  text: string;
  style: 'solid' | 'outline' | 'gradient';
  light?: {
    gradient?: { from: string; to: string; };
    solidColor?: string;
    textColor?: string;
    borderColor?: string;
  };
  dark?: {
    gradient?: { from: string; to: string; };
    solidColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

export interface ServicioDetailConfig {
  hero?: {
    showBreadcrumb: boolean;
    showBackButton: boolean;
    overlayOpacity: number;
    gradientColor: string;
    background?: BackgroundConfig;
    content?: HeroContentConfig;
    cards?: CardStyleConfig;
    buttons?: {
      primary?: ButtonConfig;
      secondary?: ButtonConfig;
    };
  };
  accordion?: {
    defaultOpenPanel: string;
    expandMultiple: boolean;
    animationDuration: number;
    showPanelDescription: boolean;
    panels: AccordionPanelConfig[];
    background?: BackgroundConfig;
    styles?: AccordionStyleConfig;
    header?: AccordionHeaderConfig;
  };
  sidebar?: {
    showRelatedServices: boolean;
    showCategoryTag: boolean;
    showPriceRange: boolean;
    showContactButton: boolean;
  };
  design?: {
    panelBorderRadius: string;
    panelShadow: boolean;
    headerStyle: 'minimal' | 'card' | 'gradient';
    accentColor: string;
    contentPadding: string;
  };
  cta?: {
    background?: {
      imageUrl?: string;
      overlay?: number;
    };
    title?: {
      text: string;
      fontSize: string;
      fontWeight: string;
      color: string;
      fontFamily: string;
      useGradient: boolean;
      gradientFrom?: string;
      gradientTo?: string;
      gradientDirection?: string;
    };
    subtitle?: {
      text: string;
      fontSize: string;
      fontWeight: string;
      color: string;
      fontFamily: string;
    };
    buttons?: {
      primary: {
        text: string;
        bgColor: string;
        textColor: string;
        hoverBgColor: string;
        borderRadius: string;
        showIcon: boolean;
        useTransparentBg: boolean;
        borderWidth?: string;
        borderColor?: string;
        useBorderGradient?: boolean;
        borderGradientFrom?: string;
        borderGradientTo?: string;
        borderGradientDirection?: string;
      };
      secondary: {
        text: string;
        bgColor: string;
        textColor: string;
        borderColor: string;
        hoverBgColor: string;
        hoverTextColor: string;
        borderRadius: string;
        showIcon: boolean;
        useTransparentBg: boolean;
        borderWidth?: string;
        useBorderGradient?: boolean;
        borderGradientFrom?: string;
        borderGradientTo?: string;
        borderGradientDirection?: string;
      };
    };
  };
}

// ============ VALORES POR DEFECTO ============

export const DEFAULT_PANELS: AccordionPanelConfig[] = [
  { id: 'descripcion', label: 'Descripción', icon: 'FileText', enabled: true, description: 'Información general del servicio' },
  { id: 'caracteristicas', label: 'Características', icon: 'Sparkles', enabled: true, description: 'Qué ofrece este servicio' },
  { id: 'beneficios', label: 'Beneficios', icon: 'Target', enabled: true, description: 'Ventajas para tu negocio' },
  { id: 'incluye', label: 'Qué Incluye', icon: 'CheckCircle', enabled: true, description: 'Detalle de inclusiones' },
  { id: 'info', label: 'Información Adicional', icon: 'Lightbulb', enabled: true, description: 'Detalles extras' },
  { id: 'faq', label: 'Preguntas Frecuentes', icon: 'HelpCircle', enabled: true, description: 'Dudas comunes' },
  { id: 'multimedia', label: 'Multimedia', icon: 'Video', enabled: true, description: 'Videos y galería' },
];

export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'gradient',
  gradientFrom: '#f3f4f6',
  gradientTo: '#e5e7eb',
  overlayOpacity: 0,
  overlayColor: '#000000',
};

export const DEFAULT_CONTENT_CARDS = {
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

export const DEFAULT_ICON_CONFIG = {
  light: {
    showBackground: false,
    iconColor: '#8b5cf6',
    iconActiveColor: '#7c3aed',
    backgroundColor: '#f3f4f6',
    backgroundActiveColor: '#8b5cf6',
    size: 'md' as const,
  },
  dark: {
    showBackground: false,
    iconColor: '#a78bfa',
    iconActiveColor: '#c4b5fd',
    backgroundColor: '#374151',
    backgroundActiveColor: '#a78bfa',
    size: 'md' as const,
  },
};

export const DEFAULT_SECTION_ICONS: ContentCardsIconConfig = {
  caracteristicas: {
    type: 'number',
    icon: 'Hash',
    showBackground: false,
  },
  beneficios: {
    type: 'icon',
    icon: 'Star',
    showBackground: false,
  },
  incluye: {
    type: 'icon',
    icon: 'Check',
    showBackground: false,
  },
  noIncluye: {
    type: 'icon',
    icon: 'X',
    showBackground: false,
  },
};

export const DEFAULT_ACCORDION_STYLES: AccordionStyleConfig = {
  light: {
    panelBackground: 'rgba(255, 255, 255, 0.6)',
    panelBorder: '#e5e7eb',
    headerBackground: 'transparent',
    headerText: '#111827',
    headerIcon: '#8b5cf6',
    contentBackground: 'rgba(255, 255, 255, 0.5)',
    contentText: '#374151',
    accentGradientFrom: '#8b5cf6',
    accentGradientTo: '#06b6d4',
  },
  dark: {
    panelBackground: 'rgba(31, 41, 55, 0.4)',
    panelBorder: '#374151',
    headerBackground: 'transparent',
    headerText: '#ffffff',
    headerIcon: '#a78bfa',
    contentBackground: 'rgba(17, 24, 39, 0.3)',
    contentText: '#d1d5db',
    accentGradientFrom: '#a78bfa',
    accentGradientTo: '#22d3ee',
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    headerFontSize: '1.125rem',
    headerFontWeight: '600',
    contentFontSize: '1rem',
    contentLineHeight: '1.75'
  },
  contentCards: DEFAULT_CONTENT_CARDS,
  iconConfig: DEFAULT_ICON_CONFIG,
  sectionIcons: DEFAULT_SECTION_ICONS,
};

export const DEFAULT_HERO_CONFIG = {
  showBreadcrumb: true,
  showBackButton: true,
  overlayOpacity: 50,
  gradientColor: 'from-gray-900/80',
  background: { ...DEFAULT_BACKGROUND, type: 'gradient' as const, gradientFrom: '#f9fafb', gradientTo: '#ede9fe' },
  content: {
    titleGradient: {
      enabled: false,
      light: { from: '#8b5cf6', to: '#06b6d4' },
      dark: { from: '#a78bfa', to: '#22d3ee' },
    },
    showCategoryTag: true,
    showPrice: true,
    title: {
      fontSize: 'text-5xl',
      fontWeight: 'font-bold',
      fontFamily: 'Montserrat',
      lineHeight: 'leading-tight',
    },
    subtitle: {
      fontSize: 'text-xl',
      fontWeight: 'font-normal',
      fontFamily: 'Montserrat',
      color: '#6B7280',
      lineHeight: 'leading-relaxed',
    },
  },
  cards: {
    light: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderColor: '#d1d5db',
      textColor: '#111827',
      labelColor: '#6b7280',
    },
    dark: {
      background: 'rgba(31, 41, 55, 0.5)',
      borderColor: '#374151',
      textColor: '#ffffff',
      labelColor: '#9ca3af',
    },
  },
  buttons: {
    primary: {
      enabled: true,
      text: 'Solicitar Cotización',
      style: 'gradient' as const,
      light: {
        gradient: { from: '#8b5cf6', to: '#06b6d4' },
        solidColor: '#8b5cf6',
        textColor: '#ffffff',
        borderColor: '#8b5cf6',
      },
      dark: {
        gradient: { from: '#a78bfa', to: '#22d3ee' },
        solidColor: '#a78bfa',
        textColor: '#111827',
        borderColor: '#a78bfa',
      },
    },
    secondary: {
      enabled: true,
      text: 'Volver',
      style: 'outline' as const,
      light: {
        gradient: { from: '#8b5cf6', to: '#06b6d4' },
        solidColor: 'transparent',
        textColor: '#8b5cf6',
        borderColor: '#8b5cf6',
      },
      dark: {
        gradient: { from: '#a78bfa', to: '#22d3ee' },
        solidColor: 'transparent',
        textColor: '#a78bfa',
        borderColor: '#a78bfa',
      },
    },
  },
};

export const DEFAULT_ACCORDION_HEADER: AccordionHeaderConfig = {
  title: {
    text: 'Información Completa',
    icon: '📚',
    fontSize: 'text-3xl md:text-4xl',
    fontWeight: 'font-bold',
    fontFamily: 'Montserrat',
    lineHeight: 'leading-tight',
    color: '#111827',
    colorDark: '#FFFFFF',
  },
  subtitle: {
    text: 'Haz clic en cada sección para ver más detalles',
    fontSize: 'text-lg',
    fontWeight: 'font-normal',
    fontFamily: 'Montserrat',
    lineHeight: 'leading-relaxed',
    color: '#4B5563',
    colorDark: '#9CA3AF',
  },
  alignment: 'center',
  showTitle: true,
  showSubtitle: true,
  iconType: 'emoji',
  iconName: 'BookOpen',
  iconColor: '#7c3aed',
  iconColorDark: '#a78bfa',
};

export const DEFAULT_CONFIG: ServicioDetailConfig = {
  hero: DEFAULT_HERO_CONFIG,
  accordion: {
    defaultOpenPanel: 'descripcion',
    expandMultiple: false,
    animationDuration: 300,
    showPanelDescription: false,
    panels: DEFAULT_PANELS,
    background: { ...DEFAULT_BACKGROUND, type: 'gradient', gradientFrom: '#f9fafb', gradientTo: '#ffffff' },
    styles: DEFAULT_ACCORDION_STYLES,
    header: DEFAULT_ACCORDION_HEADER,
  },
  sidebar: {
    showRelatedServices: true,
    showCategoryTag: true,
    showPriceRange: true,
    showContactButton: true,
  },
  design: {
    panelBorderRadius: 'rounded-xl',
    panelShadow: true,
    headerStyle: 'minimal',
    accentColor: '#7c3aed',
    contentPadding: 'p-6',
  },
  cta: {
    background: {
      imageUrl: '',
      overlay: 0.5,
    },
    title: {
      text: '¿Listo para comenzar tu proyecto?',
      fontSize: 'text-4xl',
      fontWeight: 'font-bold',
      color: '#FFFFFF',
      fontFamily: 'Montserrat',
      useGradient: false,
      gradientFrom: '#FFFFFF',
      gradientTo: '#E9D5FF',
      gradientDirection: 'to right',
    },
    subtitle: {
      text: 'Nuestro equipo de expertos está listo para ayudarte a llevar tu idea al siguiente nivel.',
      fontSize: 'text-xl',
      fontWeight: 'font-normal',
      color: '#E9D5FF',
      fontFamily: 'Montserrat',
    },
    buttons: {
      primary: {
        text: '💬 Solicitar Cotización Gratuita',
        bgColor: '#FFFFFF',
        textColor: '#7C3AED',
        hoverBgColor: '#F3F4F6',
        borderRadius: 'rounded-lg',
        showIcon: true,
        useTransparentBg: false,
        borderWidth: '2px',
        borderColor: '#FFFFFF',
        useBorderGradient: false,
        borderGradientFrom: '#9333ea',
        borderGradientTo: '#2563eb',
        borderGradientDirection: 'to right',
      },
      secondary: {
        text: 'Ver todos los servicios',
        bgColor: 'transparent',
        textColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        hoverBgColor: '#FFFFFF',
        hoverTextColor: '#7C3AED',
        borderRadius: 'rounded-lg',
        showIcon: false,
        useTransparentBg: true,
        borderWidth: '2px',
        useBorderGradient: false,
        borderGradientFrom: '#FFFFFF',
        borderGradientTo: '#E9D5FF',
        borderGradientDirection: 'to right',
      },
    },
  },
};
