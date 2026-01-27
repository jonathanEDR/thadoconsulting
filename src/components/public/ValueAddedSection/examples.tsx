/**
 * Ejemplos de uso del componente ValueAddedSection refactorizado
 */

import ValueAddedSection from './index';
import type { ValueAddedData } from './types';

// ============================================
// EJEMPLO 1: Uso básico con datos mínimos
// ============================================

export const BasicExample = () => {
  const basicData: ValueAddedData = {
    title: "¿Por qué elegirnos?",
    subtitle: "Descubre nuestras ventajas competitivas",
    backgroundImage: {
      light: "/images/bg-light.jpg",
      dark: "/images/bg-dark.jpg"
    },
    backgroundImageAlt: "Fondo corporativo",
    cards: [
      {
        title: "Calidad Garantizada",
        description: "Ofrecemos servicios de la más alta calidad",
        iconLight: "/icons/quality-light.svg",
        iconDark: "/icons/quality-dark.svg"
      }
    ]
  };

  return <ValueAddedSection data={basicData} />;
};

// ============================================
// EJEMPLO 2: Con múltiples tarjetas y logos
// ============================================

export const CompleteExample = () => {
  const completeData: ValueAddedData = {
    title: "Nuestro Valor Agregado",
    subtitle: "Servicios que marcan la diferencia",
    showIcons: true,
    backgroundImage: {
      light: "/images/value-bg-light.jpg",
      dark: "/images/value-bg-dark.jpg"
    },
    backgroundImageAlt: "Fondo de valor agregado",
    
    // Tarjetas de valor
    cards: [
      {
        id: "1",
        title: "Innovación Constante",
        description: "Utilizamos las últimas tecnologías para ofrecer soluciones de vanguardia",
        iconLight: "/icons/innovation-light.svg",
        iconDark: "/icons/innovation-dark.svg",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        styles: {
          light: {
            titleColor: "#1F2937",
            descriptionColor: "#4B5563"
          },
          dark: {
            titleColor: "#FFFFFF",
            descriptionColor: "#D1D5DB"
          }
        }
      },
      {
        id: "2",
        title: "Soporte 24/7",
        description: "Atención personalizada en todo momento para resolver tus dudas",
        iconLight: "/icons/support-light.svg",
        iconDark: "/icons/support-dark.svg",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      },
      {
        id: "3",
        title: "Experiencia Comprobada",
        description: "Más de 10 años en el mercado respaldando a nuestros clientes",
        iconLight: "/icons/experience-light.svg",
        iconDark: "/icons/experience-dark.svg",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
      }
    ],
    
    // Logos de clientes
    logos: [
      {
        _id: "logo1",
        name: "Empresa A",
        imageUrl: "/logos/empresa-a.png",
        alt: "Logo de Empresa A",
        link: "https://empresa-a.com",
        order: 1
      },
      {
        _id: "logo2",
        name: "Empresa B",
        imageUrl: "/logos/empresa-b.png",
        alt: "Logo de Empresa B",
        link: "https://empresa-b.com",
        order: 2
      }
    ]
  };

  return <ValueAddedSection data={completeData} />;
};

// ============================================
// EJEMPLO 3: Con estilos personalizados
// ============================================

export const CustomStylesExample = () => {
  const customData: ValueAddedData = {
    title: "Servicios Premium",
    subtitle: "Experiencia personalizada para tu negocio",
    showIcons: true,
    backgroundImage: {
      light: "/images/premium-light.jpg",
      dark: "/images/premium-dark.jpg"
    },
    backgroundImageAlt: "Fondo premium",
    
    cards: [
      {
        id: "custom1",
        title: "Diseño Personalizado",
        description: "Creamos soluciones únicas para cada cliente",
        iconLight: "/icons/design-light.svg",
        iconDark: "/icons/design-dark.svg"
      }
    ],
    
    // Estilos personalizados para las tarjetas
    cardsDesign: {
      light: {
        background: "rgba(255, 255, 255, 0.95)",
        border: "linear-gradient(135deg, #FF6B6B, #FFE66D)",
        borderWidth: "3px",
        shadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        hoverBackground: "rgba(255, 255, 255, 1)",
        hoverBorder: "linear-gradient(135deg, #FF8E53, #FE6B8B)",
        hoverShadow: "0 20px 50px rgba(255, 107, 107, 0.3)",
        iconGradient: "linear-gradient(135deg, #FF6B6B, #FFE66D)",
        iconBackground: "rgba(255, 255, 255, 0.9)",
        iconColor: "#FF6B6B",
        titleColor: "#2D3748",
        descriptionColor: "#4A5568",
        linkColor: "#FF6B6B",
        cardMinWidth: "300px",
        cardMaxWidth: "400px",
        cardMinHeight: "250px",
        cardPadding: "2.5rem",
        cardsAlignment: "center",
        iconBorderEnabled: true,
        iconAlignment: "center"
      },
      dark: {
        background: "rgba(26, 32, 44, 0.95)",
        border: "linear-gradient(135deg, #667eea, #764ba2)",
        borderWidth: "3px",
        shadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
        hoverBackground: "rgba(45, 55, 72, 1)",
        hoverBorder: "linear-gradient(135deg, #a78bfa, #ec4899)",
        hoverShadow: "0 20px 50px rgba(102, 126, 234, 0.4)",
        iconGradient: "linear-gradient(135deg, #667eea, #764ba2)",
        iconBackground: "rgba(26, 32, 44, 0.8)",
        iconColor: "#a78bfa",
        titleColor: "#F7FAFC",
        descriptionColor: "#E2E8F0",
        linkColor: "#a78bfa",
        cardMinWidth: "300px",
        cardMaxWidth: "400px",
        cardMinHeight: "250px",
        cardPadding: "2.5rem",
        cardsAlignment: "center",
        iconBorderEnabled: true,
        iconAlignment: "center"
      }
    }
  };

  return <ValueAddedSection data={customData} />;
};

// ============================================
// EJEMPLO 4: Sin iconos (solo texto)
// ============================================

export const TextOnlyExample = () => {
  const textOnlyData: ValueAddedData = {
    title: "Nuestros Principios",
    subtitle: "Los valores que nos guían",
    showIcons: false, // Desactivar iconos
    backgroundImage: {
      light: "/images/principles-light.jpg",
      dark: "/images/principles-dark.jpg"
    },
    backgroundImageAlt: "Fondo de principios",
    
    cards: [
      {
        id: "principle1",
        title: "Transparencia",
        description: "Comunicación clara y honesta en cada interacción con nuestros clientes"
      },
      {
        id: "principle2",
        title: "Compromiso",
        description: "Dedicación total para alcanzar los objetivos propuestos"
      },
      {
        id: "principle3",
        title: "Excelencia",
        description: "Búsqueda constante de la perfección en cada detalle"
      }
    ]
  };

  return <ValueAddedSection data={textOnlyData} />;
};

// ============================================
// EJEMPLO 5: Usando datos del CMS (estructura alternativa)
// ============================================

export const CMSExample = () => {
  // Datos como vendrían del CMS
  const cmsData: ValueAddedData = {
    title: "<p>¿Por qué <strong>elegirnos</strong>?</p>", // HTML del RichTextEditor
    description: "<p>Descubre nuestras <em>ventajas competitivas</em></p>", // Se mapea a subtitle
    showIcons: true,
    backgroundImage: {
      light: "https://cdn.example.com/bg-light.jpg",
      dark: "https://cdn.example.com/bg-dark.jpg"
    },
    backgroundImageAlt: "Fondo corporativo",
    
    // CMS usa 'items' en lugar de 'cards'
    items: [
      {
        _id: "60d5ec49f1b2c8b5d8e1a1b1",
        title: "Calidad Certificada",
        description: "Contamos con certificaciones internacionales",
        iconLight: "https://cdn.example.com/icons/cert-light.svg",
        iconDark: "https://cdn.example.com/icons/cert-dark.svg",
        gradient: "linear-gradient(135deg, #8B5CF6, #06B6D4)"
      }
    ],
    
    logos: [
      {
        _id: "60d5ec49f1b2c8b5d8e1a1b2",
        name: "Cliente Premium",
        imageUrl: "https://cdn.example.com/logos/client.png",
        alt: "Logo Cliente Premium",
        link: "https://client.com",
        order: 1
      }
    ]
  };

  return <ValueAddedSection data={cmsData} />;
};

// ============================================
// EJEMPLO 6: Alineación personalizada
// ============================================

export const AlignmentExample = () => {
  const alignedData: ValueAddedData = {
    title: "Servicios Destacados",
    subtitle: "Soluciones alineadas a tus necesidades",
    backgroundImage: {
      light: "/images/services-light.jpg",
      dark: "/images/services-dark.jpg"
    },
    backgroundImageAlt: "Fondo de servicios",
    
    cards: [
      {
        id: "service1",
        title: "Consultoría",
        description: "Asesoramiento estratégico para tu negocio",
        iconLight: "/icons/consulting-light.svg",
        iconDark: "/icons/consulting-dark.svg"
      }
    ],
    
    cardsDesign: {
      light: {
        // ... otros estilos
        cardsAlignment: "left", // Alinear tarjetas a la izquierda
        iconAlignment: "left",  // Alinear iconos a la izquierda
        background: "rgba(255, 255, 255, 0.9)",
        border: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
        borderWidth: "2px",
        shadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        hoverBackground: "rgba(255, 255, 255, 0.95)",
        hoverBorder: "linear-gradient(135deg, #a78bfa, #22d3ee)",
        hoverShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
        iconGradient: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
        iconBackground: "rgba(255, 255, 255, 0.9)",
        iconColor: "#7528ee",
        titleColor: "#1F2937",
        descriptionColor: "#4B5563",
        linkColor: "#06B6D4",
        cardMinWidth: "280px",
        cardMaxWidth: "350px",
        cardMinHeight: "200px",
        cardPadding: "2rem",
        iconBorderEnabled: false
      },
      dark: {
        // ... misma estructura para dark
        cardsAlignment: "left",
        iconAlignment: "left",
        background: "rgba(17, 24, 39, 0.9)",
        border: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
        borderWidth: "2px",
        shadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        hoverBackground: "rgba(31, 41, 55, 0.95)",
        hoverBorder: "linear-gradient(135deg, #a78bfa, #22d3ee)",
        hoverShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
        iconGradient: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
        iconBackground: "rgba(17, 24, 39, 0.8)",
        iconColor: "#ffffff",
        titleColor: "#FFFFFF",
        descriptionColor: "#D1D5DB",
        linkColor: "#a78bfa",
        cardMinWidth: "280px",
        cardMaxWidth: "350px",
        cardMinHeight: "200px",
        cardPadding: "2rem",
        iconBorderEnabled: false
      }
    }
  };

  return <ValueAddedSection data={alignedData} />;
};
