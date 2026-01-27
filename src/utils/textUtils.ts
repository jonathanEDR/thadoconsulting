/**
 * 🛠️ Utilidades para truncado inteligente de contenido
 * Evita agregar puntos suspensivos innecesarios y respeta límites de forma natural
 */

export interface TruncateOptions {
  maxLength: number;
  respectWordBoundaries?: boolean;
  addEllipsis?: boolean;
  preferSentenceEnd?: boolean;
}

/**
 * Trunca texto de forma inteligente sin agregar puntos suspensivos innecesarios
 */
export const intelligentTruncate = (
  text: string, 
  options: TruncateOptions
): string => {
  const {
    maxLength,
    respectWordBoundaries = true,
    addEllipsis = false,
    preferSentenceEnd = true
  } = options;

  // Si el texto ya está dentro del límite, devolverlo sin modificar
  if (!text || text.length <= maxLength) {
    return text;
  }

  // Obtener substring hasta el límite máximo
  let truncated = text.substring(0, maxLength);

  // Si preferimos terminar en punto, buscar el último punto
  if (preferSentenceEnd) {
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > maxLength * 0.7) { // Solo si está en el último 30%
      return text.substring(0, lastPeriod + 1);
    }
  }

  // Si respetamos límites de palabras, buscar el último espacio
  if (respectWordBoundaries) {
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) { // Solo si está en el último 20%
      truncated = text.substring(0, lastSpace);
    }
  }

  // Solo agregar puntos suspensivos si se solicita explícitamente
  return addEllipsis ? `${truncated}...` : truncated;
};

/**
 * Limpiar texto generado por IA (remover recomendaciones y análisis)
 */
export const cleanAIContent = (content: string): string => {
  if (!content) return '';

  return content
    // Remover secciones de recomendaciones
    .replace(/💡\s*RECOMENDACIÓN:[\s\S]*?(?=\n\n|$)/gi, '')
    .replace(/🔍\s*ANÁLISIS:[\s\S]*?(?=\n\n|$)/gi, '')
    .replace(/📊\s*SUGERENCIA:[\s\S]*?(?=\n\n|$)/gi, '')
    .replace(/⚠️\s*NOTA:[\s\S]*?(?=\n\n|$)/gi, '')
    // Limpiar múltiples saltos de línea
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Validar y preparar contenido SEO sin puntos suspensivos forzados
 */
export const prepareSEOContent = (content: string, type: 'title' | 'description'): string => {
  const limits = {
    title: 60,
    description: 160
  };

  const maxLength = limits[type];
  
  return intelligentTruncate(content, {
    maxLength,
    respectWordBoundaries: true,
    addEllipsis: false, // ❌ NO agregar puntos suspensivos
    preferSentenceEnd: type === 'description' // Solo para descripciones
  });
};