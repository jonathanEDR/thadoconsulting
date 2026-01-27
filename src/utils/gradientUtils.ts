// Utilidades para gradientes en JavaScript
export const isGradient = (value: string): boolean => {
  return value?.includes('gradient') || false;
};

export const applyGradientBorder = (element: HTMLElement, gradientValue: string, hoverGradient?: string) => {
  if (!isGradient(gradientValue)) return;
  
  element.style.setProperty('--gradient-border', gradientValue);
  if (hoverGradient && isGradient(hoverGradient)) {
    element.style.setProperty('--gradient-border-hover', hoverGradient);
  }
  element.classList.add('contact-button-gradient');
};

export const removeGradientBorder = (element: HTMLElement) => {
  element.style.removeProperty('--gradient-border');
  element.style.removeProperty('--gradient-border-hover');
  element.classList.remove('contact-button-gradient');
};

export const getGradientPresets = () => {
  return {
    'cian-purple': 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
    'pink-orange': 'linear-gradient(90deg, #EC4899, #F97316)',
    'blue-green': 'linear-gradient(90deg, #3B82F6, #10B981)',
    'purple-pink': 'linear-gradient(90deg, #8B5CF6, #EC4899)',
    'green-blue': 'linear-gradient(90deg, #10B981, #3B82F6)',
    'orange-red': 'linear-gradient(90deg, #F97316, #EF4444)',
    'diagonal-cian-purple': 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
    'diagonal-pink-orange': 'linear-gradient(135deg, #EC4899, #F97316)',
    'radial-cian-purple': 'radial-gradient(circle, #06B6D4, #8B5CF6)',
  };
};

export const generateGradientCSS = (gradient: string, isHover: boolean = false): string => {
  if (!isGradient(gradient)) return gradient;
  
  const property = isHover ? '--gradient-border-hover' : '--gradient-border';
  return `${property}: ${gradient};`;
};