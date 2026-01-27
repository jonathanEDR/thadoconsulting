
/**
 * Configuración predeterminada para el frontend
 * Se usa como fallback cuando no hay conexión con la base de datos
 * 
 * ACTUALIZADO: 11/12/2025 - Sincronizado con datos de producción
 */

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
  limit: number; // Cantidad de posts a mostrar
  buttonText: string; // Texto del botón "Ver todos"
  buttonLink: string; // Link del botón
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
// IMÁGENES DE CLOUDINARY (Producción)
// =====================================================

export const getHeroBackgroundImages = (): DefaultImageConfig => ({
  light: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760885593/web-scuti/tlputjmswj45qccbg56w.webp',
  dark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760885612/web-scuti/o82jwgxppty5fs1khsbf.webp'
});

export const getSolutionsBackgroundImages = (): DefaultImageConfig => ({
  light: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760897344/web-scuti/ghplkryx9cqxqg189bzf.webp',
  dark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760897358/web-scuti/o2en2u7kpdtpdk9mieol.webp'
});

export const getValueAddedBackgroundImages = (): DefaultImageConfig => ({
  light: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761055090/web-scuti/pzq7y8hig1oli9hpjzqf.webp',
  dark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761055090/web-scuti/pzq7y8hig1oli9hpjzqf.webp'
});

export const getContactBackgroundImages = (): DefaultImageConfig => ({
  light: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761434292/web-scuti/auuwn7de87f1t2xgw7jq.webp',
  dark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761434292/web-scuti/auuwn7de87f1t2xgw7jq.webp'
});

export const getFeaturedBlogBackgroundImages = (): DefaultImageConfig => ({
  light: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761055090/web-scuti/pzq7y8hig1oli9hpjzqf.webp',
  dark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761055090/web-scuti/pzq7y8hig1oli9hpjzqf.webp'
});

// =====================================================
// HERO SECTION - Configuración por defecto
// =====================================================
export const DEFAULT_HERO_CONFIG: DefaultHeroConfig = {
  title: 'Impulsa tu PYME con Software a Medida e Inteligencia Artificial',
  subtitle: 'Transforma procesos, escala ventas y compite con grandes empresas',
  description: '<p><span>Somos el socio tecnológico que entiende los desafíos de presupuesto y el ritmo de los negocios pequeños. Creamos soluciones robustas sin la complejidad innecesaria.</span></p><p><span><strong>+50 PYMES Transformadas</strong> en 5 Sectores</span></p>',
  ctaText: 'Agenda una Consultoría Gratuita',
  ctaLink: '#servicios',
  backgroundImage: getHeroBackgroundImages(),
  backgroundImageAlt: 'Hero background',
  styles: {
    light: {
      titleColor: '',
      subtitleColor: '',
      descriptionColor: '#bf09f1'
    },
    dark: {
      titleColor: '',
      subtitleColor: '',
      descriptionColor: '#ffffff'
    }
  }
};

// =====================================================
// SOLUTIONS SECTION - Configuración por defecto
// =====================================================
export const DEFAULT_SOLUTIONS_CONFIG: DefaultSolutionsConfig = {
  title: 'Tecnología Estratégica: Software a Medida con el Poder de la IA',
  subtitle: '<p>Diseñamos <strong>Software de gestión para PYMES</strong> que se integra perfectamente con tus sistemas actuales. Implementamos <strong>Automatización de Procesos</strong> usando <strong>Inteligencia Artificial</strong> para eliminar la rutina y dirigir la toma de decisiones. Así, transformamos tu operación en una ventaja competitiva.</p>',
  backgroundImage: getSolutionsBackgroundImages(),
  backgroundImageAlt: 'Solutions background',
  styles: {
    light: {
      titleColor: '',
      descriptionColor: '#8B5CF6'
    },
    dark: {
      titleColor: '',
      descriptionColor: '#ffffff'
    }
  },
  cards: [
    {
      id: '1',
      title: 'Software a Medida',
      description: '<p style="text-align:center"><span>Sistemas ERP y CRM personalizados para tu flujo de trabajo. Te entregamos el control total de tus datos y procesos.</span></p>',
      icon: 'code',
      iconLight: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760912195/web-scuti/hl58zwiw5dazgysdzrpc.png',
      iconDark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760912180/web-scuti/toxy8ovegtc5t2ldtrfv.png',
      styles: {
        light: {
          titleColor: '#111212',
          descriptionColor: ''
        },
        dark: {
          titleColor: '',
          descriptionColor: ''
        }
      }
    },
    {
      id: '2',
      title: 'Soluciones de IA y Automatización',
      description: '<p><span><strong>Implementación de IA en negocios pequeños</strong> para análisis predictivo, <em>chatbots</em> inteligentes y automatización de tareas repetitivas.</span></p>',
      icon: 'brain',
      iconLight: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760912246/web-scuti/bprtxw8eexlhadhz0mbh.png',
      iconDark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760912259/web-scuti/ghkvhgerhqacuvmaneqb.png',
      styles: {
        light: {
          titleColor: '#1e1e20',
          descriptionColor: '#171617'
        },
        dark: {
          titleColor: '',
          descriptionColor: '#ecf0f4'
        }
      }
    },
    {
      id: '3',
      title: 'Consultoría de Transformación Digital',
      description: '<p style="text-align:center"><span>Te ayudamos a identificar las áreas de mayor impacto para tu inversión tecnológica, garantizando que el software esté alineado a tu estrategia de crecimiento.</span></p>',
      icon: 'digital',
      iconLight: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760912229/web-scuti/t0ubxwppogillqkjd9fi.png',
      iconDark: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1760912214/web-scuti/cccbidupnri4etyrorvn.png',
      styles: {
        light: {
          titleColor: '#121212',
          descriptionColor: '#14191f'
        },
        dark: {
          titleColor: '',
          descriptionColor: ''
        }
      }
    }
  ],
  cardsDesign: {
    light: {
      background: 'transparent',
      border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      borderWidth: '3px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      hoverBackground: 'rgba(255, 255, 255, 1)',
      hoverBorder: '#8B5CF6',
      hoverShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)',
      iconGradient: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
      iconBackground: '#FFFFFF',
      iconColor: '#8B5CF6',
      titleColor: '#8B5CF6',
      descriptionColor: '#121212',
      linkColor: '#06B6D4',
      cardMinWidth: '380px',
      cardMaxWidth: '100%',
      cardMinHeight: '275px',
      cardPadding: '1.25rem',
      cardsAlignment: 'center',
      iconBorderEnabled: false,
      iconAlignment: 'center'
    },
    dark: {
      background: 'transparent',
      border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      borderWidth: '3px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      hoverBackground: 'rgba(55, 65, 81, 1)',
      hoverBorder: '#A78BFA',
      hoverShadow: '20px 25px -5px rgba(167, 139, 250, 0.30)',
      iconGradient: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
      iconBackground: '#1F2937',
      iconColor: '#8B5CF6',
      titleColor: '#FFFFFF',
      descriptionColor: '#f5f7fa',
      linkColor: '#8B5CF6',
      cardMinWidth: '370px',
      cardMaxWidth: '100%',
      cardMinHeight: 'auto',
      cardPadding: '2rem',
      cardsAlignment: 'center',
      iconBorderEnabled: false,
      iconAlignment: 'center'
    }
  }
};

// =====================================================
// VALUE ADDED SECTION - Configuración por defecto
// =====================================================
export const DEFAULT_VALUE_ADDED_CONFIG: DefaultValueAddedConfig = {
  title: 'La Flexibilidad que tu PYME Necesita',
  subtitle: '',
  description: '<p>No somos un proveedor; somos tu departamento de I+D externo.</p>',
  showIcons: false,
  backgroundImage: getValueAddedBackgroundImages(),
  backgroundImageAlt: 'Value Added background',
  cards: [
    {
      id: '1',
      title: 'Enfoque Ágil y Transparente',
      description: '<p>Más de 10 años desarrollando software para empresas peruanas de diversos sectores: retail, finanzas, salud, educación y manufactura. Conocemos el mercado local y sus desafíos.</p>',
      iconLight: '',
      iconDark: '',
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    },
    {
      id: '2',
      title: 'Enfoque Ágil y Transparente',
      description: '<p>Trabajamos en ciclos de 2 semanas (sprints) con reportes constantes. <strong>Siempre sabes lo que estamos construyendo</strong> y por qué.</p>',
      iconLight: '',
      iconDark: '',
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    },
    {
      id: '3',
      title: 'Especialización en PYMES',
      description: '<p><strong>PYMES</strong>Nuestra experiencia nos permite minimizar los costos de infraestructura y entregar proyectos funcionales más rápido que el promedio del mercado.</p>',
      iconLight: '',
      iconDark: '',
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    },
    {
      id: '4',
      title: 'Garantía de Código y Soporte',
      description: '<p>Ofrecemos soporte post-lanzamiento y documentación completa. El código que desarrollamos es 100% tuyo.</p>',
      iconLight: '',
      iconDark: '',
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    }
  ],
  logos: [
    {
      _id: '1',
      name: 'PYTHON',
      imageUrl: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761085769/web-scuti/iaff59yybfs9aghosfhd.png',
      alt: 'PYTHON',
      link: '',
      order: 0
    },
    {
      _id: '2',
      name: 'Scala',
      imageUrl: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761085817/web-scuti/h7curekyfgubgutzbgna.png',
      alt: 'Logo Scala',
      link: '',
      order: 1
    },
    {
      _id: '3',
      name: 'Java',
      imageUrl: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761086233/web-scuti/drnoaprhbxmuis4ydir9.png',
      alt: 'Logo Java',
      link: '',
      order: 4
    },
    {
      _id: '4',
      name: 'Logo 13',
      imageUrl: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761086446/web-scuti/ck7eilb1rtucj2sjedik.png',
      alt: 'Logo 13',
      link: '',
      order: 12
    },
    {
      _id: '5',
      name: 'Logo 14',
      imageUrl: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761086462/web-scuti/us6ljarn9ad1hxyazdax.png',
      alt: 'Logo 14',
      link: '',
      order: 13
    }
  ],
  logosBarDesign: {
    light: {
      animationsEnabled: true,
      rotationMode: 'individual',
      animationSpeed: 'fast',
      hoverEffects: true,
      hoverIntensity: 'normal',
      glowEffects: true,
      autoDetectTech: true,
      logoSize: 'medium',
      logoSpacing: 'normal',
      logoFormat: 'square',
      maxLogoWidth: 'medium',
      uniformSize: false,
      background: 'linear-gradient(0deg, #999999, #162527)',
      borderColor: 'transparent',
      borderWidth: '0px',
      borderRadius: '0.5rem',
      shadow: '0px 8px 32px rgba(0, 0, 0, 0.10)',
      backdropBlur: true,
      disperseEffect: true,
      particleEffects: true
    },
    dark: {
      animationsEnabled: true,
      rotationMode: 'individual',
      animationSpeed: 'slow',
      hoverEffects: true,
      hoverIntensity: 'intense',
      glowEffects: true,
      autoDetectTech: true,
      logoSize: 'large',
      logoSpacing: 'normal',
      logoFormat: 'rectangle',
      maxLogoWidth: 'medium',
      uniformSize: false,
      background: 'linear-gradient(135deg, #999999, #1b2e31)',
      borderColor: 'transparent',
      borderWidth: '0px',
      borderRadius: '1rem',
      shadow: '0px 8px 44px rgba(0, 0, 0, 0.47)',
      backdropBlur: true,
      disperseEffect: true,
      particleEffects: true
    }
  },
  cardsDesign: {
    light: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      borderWidth: '2px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      hoverBackground: 'rgba(255, 255, 255, 0.95)',
      hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
      hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
      iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      iconBackground: 'rgba(255, 255, 255, 0.9)',
      iconColor: '#8B5CF6',
      titleColor: '#8B5CF6',
      descriptionColor: '#030303',
      linkColor: '#8B5CF6',
      cardMinWidth: '280px',
      cardMaxWidth: '350px',
      cardMinHeight: '200px',
      cardPadding: '2rem',
      cardsAlignment: 'center',
      iconBorderEnabled: false,
      iconAlignment: 'center'
    },
    dark: {
      background: 'rgba(245, 245, 245, 0.90)',
      border: '#8B5CF6',
      borderWidth: '1px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      hoverBackground: 'rgba(31, 41, 55, 0.95)',
      hoverBorder: 'linear-gradient(135deg, #8B5CF6, #22d3ee)',
      hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
      iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      iconBackground: 'rgba(17, 24, 39, 0.8)',
      iconColor: '#ffffff',
      titleColor: '#8B5CF6',
      descriptionColor: '#111212',
      linkColor: '#8B5CF6',
      cardMinWidth: '280px',
      cardMaxWidth: '350px',
      cardMinHeight: '200px',
      cardPadding: '2rem',
      cardsAlignment: 'center',
      iconBorderEnabled: false,
      iconAlignment: 'center'
    }
  }
};

// =====================================================
// CONTACT FORM - Configuración por defecto
// =====================================================
export const DEFAULT_CONTACT_CONFIG: DefaultContactConfig = {
  title: 'Da el Primer Paso hacia la Transformación Digital',
  subtitle: 'Deja de adaptar tu negocio a un software genérico. Permítenos analizar tu proceso y diseñar la tecnología que te dará una ventaja competitiva real.',
  description: 'Agenda tu Análisis de Viabilidad Gratuito.',
  fields: {
    nombre: {
      label: 'Nombre',
      placeholder: 'Tu nombre completo'
    },
    celular: {
      label: 'Celular / Teléfono',
      placeholder: '+51 999 999 999'
    },
    correo: {
      label: 'Correo Electrónico',
      placeholder: 'tu@email.com'
    },
    categoria: {
      label: 'Servicio de Interés',
      placeholder: 'Selecciona un tipo de servicio',
      enabled: false,
      required: false
    },
    mensaje: {
      label: 'Cuéntanos sobre tu proyecto',
      placeholder: 'Describe tu proyecto, necesidades o consulta...'
    }
  },
  button: {
    text: 'ENVIAR',
    loadingText: 'Enviando...'
  },
  termsText: 'Acepto la Política de Privacidad y Términos de Servicio',
  successMessage: '¡Gracias por contactarnos! Te responderemos pronto.',
  errorMessage: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
  backgroundImage: getContactBackgroundImages(),
  backgroundImageAlt: 'Contact background',
  cardsDesign: {
    light: {
      background: 'rgba(255, 255, 255, 0.19)',
      border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      borderWidth: '1px',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      hoverBackground: 'rgba(255, 255, 255, 1)',
      hoverBorder: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      hoverShadow: '0 8px 30px rgba(139, 92, 246, 0.15)',
      iconGradient: 'linear-gradient(225deg, #1e1e1f, #06B6D4)',
      iconBackground: 'rgba(255, 255, 255, 0.9)',
      iconColor: '#4F46E5',
      titleColor: '#fafafa',
      descriptionColor: '#f3f7fb',
      linkColor: '#8B5CF6',
      cardMinWidth: '230px',
      cardMaxWidth: '400px',
      cardMinHeight: 'auto',
      cardPadding: '1.5rem',
      cardsAlignment: 'center',
      iconBorderEnabled: true,
      iconAlignment: 'center'
    },
    dark: {
      background: 'rgba(17, 24, 39, 0.24)',
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
      descriptionColor: '#FFFFFF',
      linkColor: '#a78bfa',
      cardMinWidth: '250px',
      cardMaxWidth: '400px',
      cardMinHeight: 'auto',
      cardPadding: '1.5rem',
      cardsAlignment: 'center',
      iconBorderEnabled: true,
      iconAlignment: 'center'
    }
  },
  styles: {
    light: {
      titleColor: '#fafcff',
      subtitleColor: '#fcfcfc',
      descriptionColor: '#fcfcfc',
      formBackground: 'rgba(255, 255, 255, 0.95)',
      formBorder: 'rgba(0, 0, 0, 0.1)',
      formShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      inputBackground: '#ffffff',
      inputBorder: '#e5e7eb',
      inputText: '#1f2937',
      inputPlaceholder: '#9ca3af',
      inputFocusBorder: '#8B5CF6',
      labelColor: '#374151',
      buttonBackground: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      buttonText: '#ffffff',
      buttonHoverBackground: 'linear-gradient(90deg, #7C3AED, #0891B2)',
      successColor: '#10b981',
      errorColor: '#ef4444'
    },
    dark: {
      titleColor: '#f9fafb',
      subtitleColor: '#fafcff',
      descriptionColor: '#f0f2f5',
      formBackground: 'rgba(31, 41, 55, 0.95)',
      formBorder: 'rgba(255, 255, 255, 0.1)',
      formShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      inputBackground: '#1f2937',
      inputBorder: '#374151',
      inputText: '#f9fafb',
      inputPlaceholder: '#6b7280',
      inputFocusBorder: '#A78BFA',
      labelColor: '#e5e7eb',
      buttonBackground: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      buttonText: '#f0f1f5',
      buttonHoverBackground: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
      successColor: '#34d399',
      errorColor: '#f87171'
    }
  },
  map: {
    enabled: true,
    googleMapsUrl: 'google.com/maps/place/Scuti+Perú/@-9.9529779,-76.2498001,858m/data=!3m1!1e3!4m7!3m6!1s0x91a7c37bdd840815:0x443a6ce73ad894aa!4b1!8m2!3d-9.9529779!4d-76.2472252!16s%2Fg%2F11w4tl4_nv?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D',
    latitude: -12.0464,
    longitude: -77.0428,
    zoom: 15,
    height: '500px',
    companyName: 'Scuti Perú',
    address: '',
    containerSize: 'medium',
    aspectRatio: 'square',
    alignment: 'center',
    borderRadius: '8px',
    shadow: 'medium',
    markerColor: '#8B5CF6',
    pulseColor: '#8B5CF6',
    customLogo: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761502909/web-scuti/uze3gepsrrjpe43uobxj.png',
    logoSize: 'large',
    showCompanyName: true,
    markerStyle: 'gradient',
    markerBorderWidth: '3px',
    markerBackground: '#f5f5f5',
    markerBorderColor: '#6347f0',
    animationEnabled: true,
    pulseIntensity: 'high',
    pulseSpeed: 'normal',
    hoverEffect: 'glow'
  }
};

// =====================================================
// FEATURED BLOG SECTION - Configuración por defecto
// =====================================================
export const DEFAULT_FEATURED_BLOG_CONFIG: DefaultFeaturedBlogConfig = {
  headerIcon: 'Newspaper',
  headerIconColor: '#8B5CF6',
  fontFamily: 'Montserrat',
  title: 'Webinars y blogs',
  subtitle: 'Accede a nuestros webinars y blogs para conocer más sobre nuestras soluciones y servicios',
  description: '',
  backgroundImage: getFeaturedBlogBackgroundImages(),
  backgroundImageAlt: 'Featured blog background',
  limit: 3,
  buttonText: 'Ver todos los artículos',
  buttonLink: '/blog',
  styles: {
    light: {
      titleColor: '#1f2937',
      subtitleColor: '#4b5563',
      descriptionColor: '#6b7280'
    },
    dark: {
      titleColor: '#ffffff',
      subtitleColor: '#d1d5db',
      descriptionColor: '#9ca3af'
    }
  },
  cardsDesign: {
    light: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(229, 231, 235, 1)',
      borderWidth: '1px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      hoverBackground: 'rgba(255, 255, 255, 1)',
      hoverShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2), 0 10px 10px -5px rgba(139, 92, 246, 0.1)',
      titleColor: '#1f2937',
      excerptColor: '#4b5563',
      metaColor: '#6b7280',
      badgeBackground: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      badgeTextColor: '#ffffff',
      ctaColor: '#8B5CF6',
      ctaHoverColor: '#06B6D4'
    },
    dark: {
      background: 'rgba(31, 41, 55, 0.95)',
      border: 'rgba(55, 65, 81, 1)',
      borderWidth: '1px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      hoverBackground: 'rgba(55, 65, 81, 1)',
      hoverShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.2)',
      titleColor: '#ffffff',
      excerptColor: '#d1d5db',
      metaColor: '#9ca3af',
      badgeBackground: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      badgeTextColor: '#ffffff',
      ctaColor: '#a78bfa',
      ctaHoverColor: '#22d3ee'
    }
  }
};

// =====================================================
// THEME - Configuración por defecto
// =====================================================
export const DEFAULT_THEME_CONFIG: DefaultThemeConfig = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    background: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    card: '#F9FAFB',
    border: '#E5E7EB'
  }
};

// =====================================================
// CHATBOT - Configuración por defecto
// =====================================================
export const DEFAULT_CHATBOT_CONFIG = {
  enabled: true,
  botName: 'Asesor Contable THADO',
  statusText: 'En línea • Respuesta inmediata',
  logo: {
    light: '',
    dark: ''
  },
  logoAlt: 'Asesor Contable THADO',
  welcomeMessage: {
    title: '¡Hola! Soy tu Asesor Contable 📊',
    description: 'Estoy aquí para ayudarte con consultas sobre contabilidad, tributación, SUNAT y gestión empresarial.'
  },
  suggestedQuestions: [
    {
      icon: '📊',
      text: '¿Qué servicios contables ofrecen?',
      message: '¿Qué servicios contables ofrecen?'
    },
    {
      icon: '💰',
      text: 'Consulta sobre SUNAT',
      message: 'Tengo dudas sobre mis obligaciones con SUNAT'
    },
    {
      icon: '📋',
      text: 'Cotizar servicios',
      message: 'Quiero cotizar servicios contables para mi empresa'
    },
    {
      icon: '📞',
      text: 'Agendar consultoría',
      message: '¿Cómo puedo agendar una consultoría gratuita?'
    }
  ],
  headerStyles: {
    light: {
      background: 'linear-gradient(to right, #EFF6FF, #F5F3FF)',
      titleColor: '#111827',
      subtitleColor: '#626871',
      logoBackground: 'linear-gradient(to bottom right, #2554a3, #3462af)'
    },
    dark: {
      background: 'linear-gradient(to right, #1F2937, #1F2937)',
      titleColor: '#FFFFFF',
      subtitleColor: '#9CA3AF',
      logoBackground: 'linear-gradient(to bottom right, #2554a3, #3462af)'
    }
  },
  buttonStyles: {
    size: 'medium',
    position: {
      bottom: '24px',
      right: '24px'
    },
    gradient: {
      from: '#2554a3',
      to: '#3462af'
    },
    shape: 'circle',
    icon: {
      light: '',
      dark: ''
    }
  },
  behavior: {
    autoOpen: false,
    autoOpenDelay: 5000,
    showUnreadBadge: true,
    showPoweredBy: true
  }
};

// =====================================================
// CONTACT INFO - Configuración por defecto
// =====================================================
export const DEFAULT_CONTACT_INFO = {
  phone: '+51 973 397 306',
  email: 'contacto@thadoconsulting.pe',
  address: 'Lima, Perú',
  city: 'Lima',
  country: 'Perú',
  businessHours: 'Lun - vie 9:00 am - 6:00 pm',
  description: 'Estudio contable especializado en MYPES y emprendedores. Servicios de contabilidad, tributación, planillas y asesoría empresarial en todo el Perú.',
  socialLinks: [
    {
      name: 'WHATSAPP',
      url: 'https://api.whatsapp.com/send/?phone=51973397306&text&type=phone_number&app_absent=0',
      icon: '',
      enabled: true
    },
    {
      name: 'FACEBOOK',
      url: '#',
      icon: '',
      enabled: true
    },
    {
      name: 'INSTAGRAM',
      url: '#',
      icon: '',
      enabled: true
    },
    {
      name: 'LINKEDIN',
      url: '#',
      icon: '',
      enabled: true
    }
  ]
};

// =====================================================
// SEO - Configuración por defecto
// =====================================================
export const DEFAULT_SEO_CONFIG = {
  metaTitle: 'THADO Consulting | Contador para MYPES y Emprendedores en Perú',
  metaDescription: 'Servicios contables y asesoría tributaria para MYPES en todo Perú. Evita multas SUNAT, ordena tu contabilidad y crece con confianza. Consulta gratuita.',
  keywords: [
    'contador Perú',
    'estudio contable Lima',
    'contador para MYPE',
    'servicios contables Perú',
    'asesoría tributaria SUNAT',
    'outsourcing contable',
    'constitución de empresas Perú',
    'declaración jurada anual',
    'régimen MYPE tributario',
    'planillas electrónicas PLAME',
    'facturación electrónica SUNAT',
    'libros electrónicos SIRE'
  ],
  ogTitle: 'THADO Consulting | Contador para MYPES y Emprendedores en Perú',
  ogDescription: 'Servicios contables y asesoría tributaria para MYPES en todo Perú. Evita multas SUNAT, ordena tu contabilidad y crece con confianza.',
  ogImage: '',
  twitterCard: 'summary_large_image'
};

// =====================================================
// FUNCIONES HELPER
// =====================================================

// Función para obtener todas las imágenes disponibles
export const getAllAvailableImages = () => {
  const images = [];
  
  for (let i = 1; i <= 3; i++) {
    images.push({
      id: i,
      light: `/ICONOS/ICONO ${i} FONDO BLANCO.png`,
      dark: `/ICONOS/ICONO ${i} FONDO NEGRO.png`,
      section: i === 1 ? 'hero' : i === 2 ? 'solutions' : 'other'
    });
  }
  
  return images;
};

// Función para seleccionar imagen por ID
export const getImageById = (imageId: number): DefaultImageConfig | null => {
  if (imageId < 1 || imageId > 3) return null;
  
  return {
    light: `/ICONOS/ICONO ${imageId} FONDO BLANCO.png`,
    dark: `/ICONOS/ICONO ${imageId} FONDO NEGRO.png`
  };
};

// =====================================================
// EXPORTACIÓN DE CONFIGURACIÓN COMPLETA
// =====================================================
export const DEFAULT_PAGE_CONFIG = {
  hero: DEFAULT_HERO_CONFIG,
  solutions: DEFAULT_SOLUTIONS_CONFIG,
  valueAdded: DEFAULT_VALUE_ADDED_CONFIG,
  featuredBlog: DEFAULT_FEATURED_BLOG_CONFIG,
  contactForm: DEFAULT_CONTACT_CONFIG,
  theme: DEFAULT_THEME_CONFIG,
  chatbot: DEFAULT_CHATBOT_CONFIG,
  contact: DEFAULT_CONTACT_INFO,
  seo: DEFAULT_SEO_CONFIG
};