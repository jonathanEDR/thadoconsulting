/**
 * ⏱️ Utilidades para Tiempo de Lectura
 * Funciones para calcular y formatear tiempos de lectura
 */

/**
 * Calcula el tiempo de lectura en minutos
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const words = countWords(content);
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Mínimo 1 minuto
}

/**
 * Cuenta las palabras en un texto
 */
export function countWords(text: string): number {
  // Validar que text sea un string
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  // Remover HTML tags
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  
  // Contar palabras
  const words = cleanText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  return words.length;
}

/**
 * Formatea el tiempo de lectura para mostrar
 */
export function formatReadingTime(minutes: number, locale: string = 'es'): string {
  if (minutes < 1) {
    return locale === 'es' ? 'Menos de 1 min' : 'Less than 1 min';
  }
  
  if (minutes === 1) {
    return locale === 'es' ? '1 minuto' : '1 minute';
  }
  
  if (minutes < 60) {
    return locale === 'es' ? `${minutes} minutos` : `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return locale === 'es' 
      ? `${hours} ${hours === 1 ? 'hora' : 'horas'}`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return locale === 'es'
    ? `${hours}h ${remainingMinutes}min`
    : `${hours}h ${remainingMinutes}min`;
}

/**
 * Obtiene el rango de tiempo de lectura
 */
export function getReadingTimeRange(
  content: string,
  locale: string = 'es'
): string {
  const slowWPM = 150;
  const fastWPM = 250;
  
  const words = countWords(content);
  
  const minTime = Math.ceil(words / fastWPM);
  const maxTime = Math.ceil(words / slowWPM);
  
  if (minTime === maxTime) {
    return formatReadingTime(minTime, locale);
  }
  
  return locale === 'es'
    ? `${minTime}-${maxTime} minutos`
    : `${minTime}-${maxTime} minutes`;
}

/**
 * Calcula el progreso de lectura basado en scroll
 */
export function calculateReadingProgress(
  scrollPosition: number,
  totalHeight: number
): number {
  if (totalHeight <= 0) return 0;
  
  const progress = (scrollPosition / totalHeight) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Estima el tiempo restante de lectura
 */
export function estimateTimeRemaining(
  content: string,
  progressPercentage: number,
  wordsPerMinute: number = 200
): number {
  const totalMinutes = calculateReadingTime(content, wordsPerMinute);
  const remainingPercentage = Math.max(0, 100 - progressPercentage);
  const remainingMinutes = Math.ceil((totalMinutes * remainingPercentage) / 100);
  
  return Math.max(0, remainingMinutes);
}

/**
 * Formatea el tiempo restante para mostrar
 */
export function formatTimeRemaining(minutes: number, locale: string = 'es'): string {
  if (minutes === 0) {
    return locale === 'es' ? 'Terminando...' : 'Finishing...';
  }
  
  if (minutes < 1) {
    return locale === 'es' ? 'Menos de 1 min' : 'Less than 1 min';
  }
  
  return locale === 'es'
    ? `${minutes} min restantes`
    : `${minutes} min remaining`;
}

/**
 * Obtiene información completa de lectura
 */
export interface ReadingInfo {
  wordCount: number;
  readingTimeMinutes: number;
  readingTimeFormatted: string;
  readingTimeRange: string;
  estimatedSeconds: number;
}

export function getReadingInfo(
  content: string,
  locale: string = 'es'
): ReadingInfo {
  const wordCount = countWords(content);
  const readingTimeMinutes = calculateReadingTime(content);
  
  return {
    wordCount,
    readingTimeMinutes,
    readingTimeFormatted: formatReadingTime(readingTimeMinutes, locale),
    readingTimeRange: getReadingTimeRange(content, locale),
    estimatedSeconds: readingTimeMinutes * 60,
  };
}

/**
 * Clasifica la longitud del artículo
 */
export type ArticleLength = 'quick' | 'medium' | 'long' | 'extensive';

export function classifyArticleLength(content: string): ArticleLength {
  const minutes = calculateReadingTime(content);
  
  if (minutes <= 3) return 'quick';
  if (minutes <= 7) return 'medium';
  if (minutes <= 15) return 'long';
  return 'extensive';
}

/**
 * Obtiene el label de longitud del artículo
 */
export function getArticleLengthLabel(
  length: ArticleLength,
  locale: string = 'es'
): string {
  const labels = {
    es: {
      quick: 'Lectura rápida',
      medium: 'Lectura media',
      long: 'Lectura larga',
      extensive: 'Lectura extensa'
    },
    en: {
      quick: 'Quick read',
      medium: 'Medium read',
      long: 'Long read',
      extensive: 'Extensive read'
    }
  };
  
  return labels[locale as 'es' | 'en']?.[length] || labels.es[length];
}

/**
 * Valida si el contenido tiene suficiente texto
 */
export function hasMinimumContent(
  content: string,
  minWords: number = 100
): boolean {
  const wordCount = countWords(content);
  return wordCount >= minWords;
}
