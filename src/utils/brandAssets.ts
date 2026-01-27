/**
 * THADO AI Brand Assets
 * Constantes para mantener consistencia de marca en toda la aplicación
 */

// URLs de la mascota/logo de THADO AI
export const THADO_AI_MASCOT = {
  // Imagen principal PNG (logo)
  png: '',

  // Iconos SVG para diferentes temas
  svg: {
    light: '',
    dark: ''
  },

  // Alt text para accesibilidad
  alt: 'THADO AI Asistente Contable',

  // Fallback local
  fallback: '/FAVICON.png'
};

// Colores de marca THADO AI
export const THADO_AI_COLORS = {
  primary: {
    from: '#2554a3', // THADO primary
    to: '#3462af',   // THADO secondary
  },
  gradient: 'linear-gradient(to bottom right, #2554a3, #3462af)',
  gradientHover: 'linear-gradient(to bottom right, #1e4a8f, #2554a3)',
};

// Tamaños predefinidos para el avatar de THADO AI
export const THADO_AI_SIZES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
};

// Mantener compatibilidad con código existente
export const SCUTI_AI_MASCOT = THADO_AI_MASCOT;
export const SCUTI_AI_COLORS = THADO_AI_COLORS;
export const SCUTI_AI_SIZES = THADO_AI_SIZES;

export default THADO_AI_MASCOT;
