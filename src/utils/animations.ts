// Animaciones y transiciones CSS personalizadas
export const animations = {
  // Animaciones de entrada
  fadeIn: 'animate-[fadeIn_0.5s_ease-in-out]',
  slideUp: 'animate-[slideUp_0.6s_ease-out]',
  slideDown: 'animate-[slideDown_0.6s_ease-out]',
  slideLeft: 'animate-[slideLeft_0.5s_ease-out]',
  slideRight: 'animate-[slideRight_0.5s_ease-out]',
  scaleIn: 'animate-[scaleIn_0.4s_ease-out]',
  
  // Animaciones de carga
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Hover effects
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverScaleLarge: 'hover:scale-110 transition-transform duration-300',
  hoverGlow: 'hover:shadow-2xl hover:shadow-blue-500/25 transition-shadow duration-300',
  
  // Microinteracciones
  buttonPress: 'active:scale-95 transition-transform duration-100',
  cardHover: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
}

// Clases de Tailwind personalizadas para animaciones
export const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideDown {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideLeft {
    from { 
      opacity: 0;
      transform: translateX(20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideRight {
    from { 
      opacity: 0;
      transform: translateX(-20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.9);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// Hook para animaciones de entrada progresivas
export const useProgressiveAnimation = (items: any[], delay: number = 100) => {
  return items.map((item, index) => ({
    ...item,
    animationDelay: `${index * delay}ms`,
    className: `${item.className || ''} animate-[fadeIn_0.5s_ease-in-out] animate-fill-both`
  }));
};

// Utilidades de performance
export const performanceOptimizations = {
  // Lazy loading para imágenes
  lazyImage: 'loading="lazy" decoding="async"',
  
  // Preload para fuentes críticas
  preloadFont: '<link rel="preload" href="/fonts/font.woff2" as="font" type="font/woff2" crossorigin>',
  
  // Optimización de renders
  memoProps: ['className', 'style', 'onClick', 'children'],
};