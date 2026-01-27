
/**
 * Mapeador de imágenes públicas para secciones específicas
 * 
 * MAPEO CORRECTO:
 * - Hero Section: 1.webp (oscuro) / 9.webp (claro)
 * - Solutions Section: 2.webp (oscuro) / 10.webp (claro)
 */

export interface ImageMapping {
  id: number;
  light: string;
  dark: string;
  section: 'hero' | 'solutions' | 'other';
  description: string;
}

// Configuración de mapeo de imágenes
export const IMAGE_MAPPINGS: ImageMapping[] = [
  // Imagen 1 y 9 - Destinadas para Hero Section
  {
    id: 1,
    light: '/9.webp',    // Imagen 9 para tema claro
    dark: '/1.webp',     // Imagen 1 para tema oscuro
    section: 'hero',
    description: 'Imagen principal para Hero Section (1=oscuro, 9=claro)'
  },
  // Imagen 2 y 10 - Destinadas para Solutions Section
  {
    id: 2,
    light: '/10.webp',   // Imagen 10 para tema claro
    dark: '/2.webp',     // Imagen 2 para tema oscuro
    section: 'solutions', 
    description: 'Imagen principal para Solutions Section (2=oscuro, 10=claro)'
  }
];

/**
 * Obtiene la imagen predeterminada para Hero Section
 */
export const getHeroDefaultImage = (): { light: string; dark: string } => {
  const heroImage = IMAGE_MAPPINGS.find(img => img.section === 'hero');
  return heroImage ? { light: heroImage.light, dark: heroImage.dark } : { light: '', dark: '' };
};

/**
 * Obtiene la imagen predeterminada para Solutions Section  
 */
export const getSolutionsDefaultImage = (): { light: string; dark: string } => {
  const solutionsImage = IMAGE_MAPPINGS.find(img => img.section === 'solutions');
  return solutionsImage ? { light: solutionsImage.light, dark: solutionsImage.dark } : { light: '', dark: '' };
};

/**
 * Obtiene imagen específica por ID
 */
export const getImageById = (id: number): { light: string; dark: string } | null => {
  const image = IMAGE_MAPPINGS.find(img => img.id === id);
  return image ? { light: image.light, dark: image.dark } : null;
};

/**
 * Obtiene todas las imágenes disponibles para una sección específica
 */
export const getImagesBySection = (section: 'hero' | 'solutions' | 'other'): ImageMapping[] => {
  return IMAGE_MAPPINGS.filter(img => img.section === section);
};

/**
 * Obtiene imagen según tema actual
 */
export const getImageByTheme = (imageId: number, theme: 'light' | 'dark'): string => {
  const image = getImageById(imageId);
  if (!image) return '';
  
  return theme === 'light' ? image.light : image.dark;
};

/**
 * Valida si una imagen existe en el mapeo
 */
export const imageExists = (imageId: number): boolean => {
  return IMAGE_MAPPINGS.some(img => img.id === imageId);
};

/**
 * Obtiene la lista completa de IDs disponibles
 */
export const getAvailableImageIds = (): number[] => {
  return IMAGE_MAPPINGS.map(img => img.id);
};

/**
 * Para uso futuro: Función para agregar nuevas imágenes dinámicamente
 */
export const addImageMapping = (mapping: ImageMapping): void => {
  // Verificar que no exista ya
  if (!imageExists(mapping.id)) {
    IMAGE_MAPPINGS.push(mapping);
  }
};

/**
 * Obtiene imagen con fallback automático
 */
export const getImageWithFallback = (
  preferredId: number, 
  fallbackSection: 'hero' | 'solutions' | 'other',
  theme: 'light' | 'dark'
): string => {
  // Intentar obtener imagen preferida
  const preferred = getImageById(preferredId);
  if (preferred) {
    return theme === 'light' ? preferred.light : preferred.dark;
  }
  
  // Fallback a imagen de sección
  const fallbackImages = getImagesBySection(fallbackSection);
  if (fallbackImages.length > 0) {
    const fallback = fallbackImages[0];
    return theme === 'light' ? fallback.light : fallback.dark;
  }
  
  // Fallback final - primera imagen disponible
  if (IMAGE_MAPPINGS.length > 0) {
    const firstImage = IMAGE_MAPPINGS[0];
    return theme === 'light' ? firstImage.light : firstImage.dark;
  }
  
  return '';
};

export default {
  getHeroDefaultImage,
  getSolutionsDefaultImage,
  getImageById,
  getImagesBySection,
  getImageByTheme,
  imageExists,
  getAvailableImageIds,
  getImageWithFallback
};