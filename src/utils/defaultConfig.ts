
/**
 * Configuración de tipos e interfaces para el frontend
 * Los datos reales se cargan desde el CMS (MongoDB)
 * Solo se mantienen interfaces y configuración mínima del sitio
 */

// =====================================================
// INTERFACES / TYPES
// =====================================================

export interface DefaultImageConfig {
  light: string;
  dark: string;
}

export interface DefaultHeroConfig {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: DefaultImageConfig;
  backgroundImageAlt: string;
  styles: {
    light: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
    dark: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
  };
}

export interface DefaultSolutionsConfig {
  title: string;
  subtitle: string;
  backgroundImage: DefaultImageConfig;
  backgroundImageAlt: string;
  cards: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    iconLight?: string;
    iconDark?: string;
    styles?: {
      light?: {
        titleColor?: string;
        descriptionColor?: string;
      };
      dark?: {
        titleColor?: string;
        descriptionColor?: string;
      };
    };
  }>;
  styles?: {
    light?: {
      titleColor?: string;
      descriptionColor?: string;
    };
    dark?: {
      titleColor?: string;
      descriptionColor?: string;
    };
  };
  cardsDesign?: {
    light: any;
    dark: any;
  };
}

export interface DefaultValueAddedConfig {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: DefaultImageConfig;
  backgroundImageAlt: string;
  showIcons?: boolean;
  cards: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    iconLight?: string;
    iconDark?: string;
    gradient?: string;
  }>;
  logos?: Array<{
    _id: string;
    name: string;
    imageUrl: string;
    alt: string;
    link?: string;
    order: number;
  }>;
  logosBarDesign?: {
    light: any;
    dark: any;
  };
  cardsDesign?: {
    light: any;
    dark: any;
  };
}

export interface DefaultFeaturedBlogConfig {
  headerIcon: string;
  headerIconColor: string;
  fontFamily: string;
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage: DefaultImageConfig;
  backgroundImageAlt: string;
  limit: number;
  buttonText: string;
  buttonLink: string;
  styles?: {
    light?: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
    dark?: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
  };
  cardsDesign?: {
    light: {
      background?: string;
      border?: string;
      borderWidth?: string;
      shadow?: string;
      hoverBackground?: string;
      hoverShadow?: string;
      titleColor?: string;
      excerptColor?: string;
      metaColor?: string;
      badgeBackground?: string;
      badgeTextColor?: string;
      ctaColor?: string;
      ctaHoverColor?: string;
    };
    dark: {
      background?: string;
      border?: string;
      borderWidth?: string;
      shadow?: string;
      hoverBackground?: string;
      hoverShadow?: string;
      titleColor?: string;
      excerptColor?: string;
      metaColor?: string;
      badgeBackground?: string;
      badgeTextColor?: string;
      ctaColor?: string;
      ctaHoverColor?: string;
    };
  };
}

export interface DefaultContactConfig {
  title: string;
  subtitle: string;
  description: string;
  fields: {
    nombre: {
      label: string;
      placeholder: string;
    };
    celular: {
      label: string;
      placeholder: string;
    };
    correo: {
      label: string;
      placeholder: string;
    };
    categoria?: {
      label: string;
      placeholder: string;
      enabled: boolean;
      required: boolean;
    };
    mensaje: {
      label: string;
      placeholder: string;
    };
  };
  button: {
    text: string;
    loadingText: string;
  };
  termsText: string;
  successMessage: string;
  errorMessage: string;
  backgroundImage?: DefaultImageConfig;
  backgroundImageAlt?: string;
  cardsDesign?: {
    light: any;
    dark: any;
  };
  styles?: {
    light: any;
    dark: any;
  };
  map?: {
    enabled: boolean;
    googleMapsUrl: string;
    latitude: number;
    longitude: number;
    zoom: number;
    height: string;
    companyName: string;
    address: string;
    containerSize: string;
    aspectRatio: string;
    alignment: string;
    borderRadius: string;
    shadow: string;
    markerColor: string;
    pulseColor: string;
    customLogo: string;
    logoSize: string;
    showCompanyName: boolean;
    markerStyle: string;
    markerBorderWidth: string;
    markerBackground: string;
    markerBorderColor: string;
    animationEnabled: boolean;
    pulseIntensity: string;
    pulseSpeed: string;
    hoverEffect: string;
  };
}

export interface DefaultThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textSecondary: string;
    card: string;
    border: string;
  };
}

// =====================================================
// CONFIGURACIÓN MÍNIMA DEL SITIO
// =====================================================

export const SITE_CONFIG = {
  siteName: 'THADO Consulting',
  siteDescription: 'Servicios contables, tributarios y financieros para MYPES en Perú.',
  siteUrl: 'https://www.thadoconsulting.com',
  defaultKeywords: ['contabilidad', 'tributación', 'SUNAT', 'MYPES', 'Perú'],
};
