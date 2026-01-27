/**
 * 🛠️ Utilidades para Markdown
 * Funciones para renderizar y manipular contenido Markdown
 */

import DOMPurify from 'dompurify';

/**
 * Configuración de DOMPurify
 */
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'u', 's', 'mark', 'code', 'pre',
    'a', 'img',
    'ul', 'ol', 'li',
    'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'title', 'width', 'height',
    'class', 'id',
    'colspan', 'rowspan'
  ],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitiza HTML para prevenir XSS
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}

/**
 * Extrae texto plano del HTML
 */
export function stripHTML(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Genera extracto de un contenido
 */
export function generateExcerpt(content: string, maxLength: number = 200): string {
  const text = stripHTML(content);
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Calcula el tiempo de lectura estimado
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const text = stripHTML(content);
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Cuenta las palabras en un texto
 */
export function countWords(content: string): number {
  const text = stripHTML(content);
  return text.trim().split(/\s+/).length;
}

/**
 * Extrae los encabezados del contenido para tabla de contenidos
 */
export function extractHeadings(html: string): Array<{ id: string; level: number; text: string }> {
  const tmp = document.createElement('div');
  tmp.innerHTML = sanitizeHTML(html);
  
  const headings: Array<{ id: string; level: number; text: string }> = [];
  const elements = tmp.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  elements.forEach((element, index) => {
    const level = parseInt(element.tagName.substring(1));
    const text = element.textContent || '';
    const id = element.id || `heading-${index}`;
    
    headings.push({ id, level, text });
  });
  
  return headings;
}

/**
 * Agrega IDs a los encabezados para navegación
 */
export function addHeadingIds(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = sanitizeHTML(html);
  
  const headings = tmp.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach((heading, index) => {
    if (!heading.id) {
      const text = heading.textContent || '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        || `heading-${index}`;
      
      heading.id = id;
    }
  });
  
  return tmp.innerHTML;
}

/**
 * Convierte Markdown a HTML (básico)
 * Nota: Para conversión compleja, usar una librería como 'marked'
 */
export function markdownToHTML(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\_\_(.*\_\_)/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\_(.*\_)/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
    // Code
    .replace(/\`([^\`]+)\`/gim, '<code>$1</code>')
    // Line breaks
    .replace(/\n/gim, '<br>');
  
  return sanitizeHTML(html);
}

/**
 * Detecta si el contenido tiene código
 */
export function hasCodeBlocks(content: string): boolean {
  return content.includes('<pre>') || content.includes('<code>');
}

/**
 * Extrae primera imagen del contenido
 */
export function extractFirstImage(html: string): string | null {
  const tmp = document.createElement('div');
  tmp.innerHTML = sanitizeHTML(html);
  
  const img = tmp.querySelector('img');
  return img ? img.getAttribute('src') : null;
}

/**
 * Resalta términos de búsqueda en el texto
 */
export function highlightSearchTerms(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Valida si el contenido tiene longitud mínima
 */
export function validateContentLength(content: string, minWords: number = 100): boolean {
  const words = countWords(content);
  return words >= minWords;
}

/**
 * Convierte Markdown a HTML optimizado para chat
 * Maneja mejor los saltos de línea y formato para interfaces de chat
 */
export function chatMarkdownToHTML(markdown: string): string {
  let html = markdown
    // Headers (convertir a bold con salto de línea)
    .replace(/^### (.*$)/gim, '<strong>$1</strong>')
    .replace(/^## (.*$)/gim, '<strong>$1</strong>')
    .replace(/^# (.*$)/gim, '<strong>$1</strong>')
    // Bold - más específico para evitar conflictos
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener" class="text-purple-600 hover:underline">$1</a>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
    // Lista con guiones
    .replace(/^- (.+)$/gim, '• $1')
    // Lista numerada (mantener formato)
    .replace(/^(\d+)\. (.+)$/gim, '$1. $2');
  
  return sanitizeHTML(html);
}
