import type { CardDesignStyles, LogosBarDesignStyles } from '../../../types/cms';

export interface ValueAddedItem {
  id?: string;
  title: string;
  description: string;
  // Nuevo sistema de iconos dinámicos
  iconName?: string;
  iconColorLight?: string;
  iconColorDark?: string;
  // Sistema antiguo (deprecated)
  iconLight?: string;
  iconDark?: string;
  gradient?: string;
  buttonText?: string;  // Texto del botón "Conocer más"
  buttonUrl?: string;   // URL a donde dirige el botón
  _id?: any;
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
}

export interface ValueAddedLogo {
  _id?: string;
  name: string;
  imageUrl: string;
  alt: string;
  link?: string;
  order?: number;
}

export interface ValueAddedData {
  title: string;
  subtitle?: string;
  description?: string;
  showIcons?: boolean;
  backgroundImage: {
    light: string;
    dark: string;
  };
  backgroundImageAlt: string;
  cards?: ValueAddedItem[];
  items?: ValueAddedItem[];
  logos?: ValueAddedLogo[];
  cardsDesign?: {
    light: CardDesignStyles;
    dark: CardDesignStyles;
  };
  logosBarDesign?: {
    light?: LogosBarDesignStyles;
    dark?: LogosBarDesignStyles;
  };
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
}

export interface ValueAddedSectionProps {
  data?: ValueAddedData;
  themeConfig?: any;
}
