/**
 * 🖼️ Utilidades para manejo de URLs de imágenes
 * Funciones compartidas para manejar URLs de imágenes en toda la aplicación
 */

import { getApiUrl } from './apiConfig';

/**
 * Convierte una URL de imagen a URL completa
 * Maneja tanto URLs absolutas (Cloudinary) como relativas (servidor local)
 */
export function getImageUrl(url: string): string {
  // Si está vacío, devolver string vacío
  if (!url || url.trim() === '') {
    return '';
  }

  // Si ya es una URL absoluta (http/https), devolverla tal como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Si es una URL de Cloudinary sin protocolo (res.cloudinary.com)
  if (url.includes('cloudinary.com')) {
    return url.startsWith('//') ? `https:${url}` : `https://${url}`;
  }

  // Si es solo un nombre de archivo sin ruta (ej: "imagen.jpg")
  // Intentar construir URL de Cloudinary si parece ser un public_id
  if (!url.startsWith('/') && !url.includes('/')) {
    // Si tiene extensión de imagen, podría ser un archivo de Cloudinary
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExt = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    
    if (hasImageExt) {
      console.warn('⚠️ Imagen sin ruta completa detectada:', url);
      // No intentar construir URL, dejar que falle y use el fallback
      return url;
    }
  }

  // Si es una URL relativa, construir URL completa del backend
  const apiUrl = getApiUrl();
  const baseUrl = apiUrl.replace('/api', '');
  
  // Asegurar que la URL empiece con /
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  const finalUrl = `${baseUrl}${normalizedUrl}`;
  
  return finalUrl;
}

/**
 * Genera una imagen placeholder en formato SVG base64
 * Para evitar dependencias de archivos externos
 */
export function getPlaceholderImage(width: number = 400, height: number = 300): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
      <path d="M${width/2-12} ${height/2-12}L${width/2-12} ${height/2+12}L${width/2+12} ${height/2+12}L${width/2+12} ${height/2-12}Z" fill="#d1d5db"/>
      <circle cx="${width/2}" cy="${height/2-4}" r="3" fill="#9ca3af"/>
      <path d="M${width/2-8} ${height/2+2}L${width/2-2} ${height/2-4}L${width/2+2} ${height/2}L${width/2+8} ${height/2-6}L${width/2+8} ${height/2+8}L${width/2-8} ${height/2+8}Z" fill="#9ca3af"/>
      <text x="${width/2}" y="${height/2+20}" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">Cargando imagen...</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Genera una imagen de error en formato SVG base64
 */
export function getErrorImage(width: number = 400, height: number = 300): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#fef2f2"/>
      <rect x="${width/2-30}" y="${height/2-20}" width="60" height="40" rx="4" fill="#dc2626" fill-opacity="0.1"/>
      <path d="M${width/2-8} ${height/2-8}L${width/2+8} ${height/2+8}M${width/2+8} ${height/2-8}L${width/2-8} ${height/2+8}" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
      <text x="${width/2}" y="${height/2+20}" text-anchor="middle" font-family="Arial" font-size="12" fill="#dc2626">Error al cargar imagen</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Optimiza URLs de Cloudinary con transformaciones
 */
export function getOptimizedImageUrl(
  url: string, 
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  // Solo optimizar si es una URL de Cloudinary
  if (!url.includes('cloudinary.com')) {
    return getImageUrl(url);
  }

  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  // Construir transformaciones de Cloudinary
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  if (transformations.length === 0) {
    return url;
  }
  
  // Insertar transformaciones en la URL de Cloudinary
  const transformationString = transformations.join(',');
  
  // Buscar el patrón /upload/ y insertar las transformaciones después
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformationString}/`);
  }
  
  return url;
}

/**
 * Valida si una URL de imagen es válida
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Verificar extensiones de imagen comunes
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  
  // Si es una URL de Cloudinary, es válida
  if (url.includes('cloudinary.com')) return true;
  
  // Si es una URL absoluta, verificar extensión
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return imageExtensions.test(url);
  }
  
  // Si es relativa, asumir que es válida
  return true;
}

export default {
  getImageUrl,
  getPlaceholderImage,
  getErrorImage,
  getOptimizedImageUrl,
  isValidImageUrl,
};