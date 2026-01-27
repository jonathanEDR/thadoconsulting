/**
 * 🔗 Utilidades para Slugs
 * Funciones para generar y validar slugs para URLs amigables
 */

/**
 * Genera un slug a partir de un texto
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Reemplazar caracteres con acentos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Reemplazar caracteres especiales comunes
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c')
    // Reemplazar espacios y caracteres no alfanuméricos con guiones
    .replace(/[^a-z0-9]+/g, '-')
    // Eliminar guiones múltiples
    .replace(/-+/g, '-')
    // Eliminar guiones al inicio y final
    .replace(/^-+|-+$/g, '');
}

/**
 * Valida si un slug es válido
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Genera un slug único agregando un número si es necesario
 */
export function generateUniqueSlug(
  text: string,
  existingSlugs: string[]
): string {
  let slug = generateSlug(text);
  
  if (!existingSlugs.includes(slug)) {
    return slug;
  }
  
  let counter = 1;
  let uniqueSlug = `${slug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
  
  return uniqueSlug;
}

/**
 * Extrae palabras clave de un texto para sugerir slug
 */
export function extractKeywordsForSlug(
  text: string,
  maxWords: number = 5
): string {
  const cleanText = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
  
  const words = cleanText.split(/\s+/);
  
  // Filtrar palabras comunes (stop words)
  const stopWords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'de', 'del', 'al', 'en', 'con', 'por', 'para',
    'y', 'o', 'pero', 'si', 'no',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'
  ]);
  
  const filteredWords = words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  );
  
  const selectedWords = filteredWords.slice(0, maxWords);
  
  return generateSlug(selectedWords.join(' '));
}

/**
 * Acorta un slug si es muy largo
 */
export function shortenSlug(slug: string, maxLength: number = 50): string {
  if (slug.length <= maxLength) {
    return slug;
  }
  
  // Cortar en el último guion antes del límite
  const truncated = slug.substring(0, maxLength);
  const lastDash = truncated.lastIndexOf('-');
  
  if (lastDash > 0) {
    return truncated.substring(0, lastDash);
  }
  
  return truncated;
}

/**
 * Convierte un slug a título legible
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Sugiere alternativas de slug
 */
export function suggestSlugAlternatives(
  text: string,
  count: number = 3
): string[] {
  const baseSlug = generateSlug(text);
  const alternatives: string[] = [baseSlug];
  
  // Versión acortada
  if (baseSlug.length > 30) {
    alternatives.push(shortenSlug(baseSlug, 30));
  }
  
  // Versión con palabras clave
  const keywordSlug = extractKeywordsForSlug(text, 4);
  if (keywordSlug !== baseSlug) {
    alternatives.push(keywordSlug);
  }
  
  // Versión con fecha
  const today = new Date();
  const dateSlug = `${baseSlug}-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  alternatives.push(dateSlug);
  
  return alternatives.slice(0, count);
}

/**
 * Valida y limpia un slug personalizado
 */
export function validateAndCleanSlug(slug: string): { valid: boolean; cleaned: string; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return {
      valid: false,
      cleaned: '',
      error: 'El slug no puede estar vacío'
    };
  }
  
  const cleaned = generateSlug(slug);
  
  if (cleaned.length < 3) {
    return {
      valid: false,
      cleaned,
      error: 'El slug debe tener al menos 3 caracteres'
    };
  }
  
  if (cleaned.length > 100) {
    return {
      valid: false,
      cleaned: shortenSlug(cleaned, 100),
      error: 'El slug es demasiado largo (máximo 100 caracteres)'
    };
  }
  
  if (!isValidSlug(cleaned)) {
    return {
      valid: false,
      cleaned,
      error: 'El slug contiene caracteres no válidos'
    };
  }
  
  return {
    valid: true,
    cleaned
  };
}
