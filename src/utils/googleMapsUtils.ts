/**
 * Utilidades para trabajar con Google Maps
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  companyName?: string;
  address?: string;
}

/**
 * Extrae coordenadas de un enlace de Google Maps
 * Soporta diferentes formatos de enlaces de Google Maps
 */
export function extractCoordinatesFromGoogleMapsUrl(url: string): LocationData | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    // Formato 1: https://maps.google.com/maps?q=lat,lng
    let match = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      };
    }

    // Formato 2: https://www.google.com/maps/@lat,lng,zoom
    match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      };
    }

    // Formato 3: https://maps.google.com/maps?ll=lat,lng
    match = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      };
    }

    // Formato 4: https://www.google.com/maps/place/Name/@lat,lng
    match = url.match(/\/maps\/place\/([^\/]+)\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) {
      const placeName = decodeURIComponent(match[1]).replace(/\+/g, ' ');
      return {
        latitude: parseFloat(match[2]),
        longitude: parseFloat(match[3]),
        companyName: placeName
      };
    }

    // Formato 5: Coordenadas directas en la URL
    match = url.match(/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      };
    }

    return null;
  } catch (error) {
    console.error('Error al extraer coordenadas del enlace:', error);
    return null;
  }
}

/**
 * Valida si las coordenadas están dentro de rangos válidos
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180 &&
    !isNaN(latitude) && !isNaN(longitude)
  );
}

/**
 * Genera un enlace de Google Maps a partir de coordenadas
 */
export function generateGoogleMapsUrl(latitude: number, longitude: number, zoom: number = 15): string {
  return `https://www.google.com/maps/@${latitude},${longitude},${zoom}z`;
}

/**
 * Genera un enlace para buscar direcciones en Google Maps
 */
export function generateGoogleMapsSearchUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/${encodedAddress}`;
}

/**
 * Obtiene información de ubicación a partir de un enlace de Google Maps
 * y devuelve un objeto con todos los datos extraídos
 */
export function parseGoogleMapsLink(url: string): {
  coordinates: LocationData | null;
  isValid: boolean;
  errorMessage?: string;
} {
  if (!url || url.trim() === '') {
    return {
      coordinates: null,
      isValid: false,
      errorMessage: 'El enlace no puede estar vacío'
    };
  }

  // Verificar que sea un enlace de Google Maps válido
  const isGoogleMapsUrl = /^https?:\/\/(www\.|maps\.)?google\.(com|[a-z]{2})\/(maps|search)/i.test(url);
  
  if (!isGoogleMapsUrl) {
    return {
      coordinates: null,
      isValid: false,
      errorMessage: 'Debe ser un enlace válido de Google Maps'
    };
  }

  const coordinates = extractCoordinatesFromGoogleMapsUrl(url);
  
  if (!coordinates) {
    return {
      coordinates: null,
      isValid: false,
      errorMessage: 'No se pudieron extraer las coordenadas del enlace'
    };
  }

  if (!validateCoordinates(coordinates.latitude, coordinates.longitude)) {
    return {
      coordinates: null,
      isValid: false,
      errorMessage: 'Las coordenadas extraídas no son válidas'
    };
  }

  return {
    coordinates,
    isValid: true
  };
}

/**
 * Ejemplos de formatos de enlaces soportados:
 * 
 * 1. Enlace directo de ubicación:
 *    https://www.google.com/maps/@-12.0464,-77.0428,15z
 * 
 * 2. Enlace de un lugar específico:
 *    https://www.google.com/maps/place/Mi+Empresa/@-12.0464,-77.0428,17z
 * 
 * 3. Enlace con parámetro q:
 *    https://maps.google.com/maps?q=-12.0464,-77.0428
 * 
 * 4. Enlace con parámetro ll:
 *    https://maps.google.com/maps?ll=-12.0464,-77.0428
 * 
 * 5. Enlace compartido desde la app móvil:
 *    https://goo.gl/maps/abc123 (se redirige a uno de los formatos anteriores)
 */