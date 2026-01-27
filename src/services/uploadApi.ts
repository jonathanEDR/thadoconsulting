/**
 * 🖼️ API CLIENT - UPLOADS
 * 
 * ⚠️ DEPRECATED - NO USAR ESTE ARCHIVO
 * 
 * Este archivo se mantiene solo para compatibilidad con código legacy.
 * 
 * ✅ USAR EN SU LUGAR: 
 * import { uploadImage } from './imageService';
 * 
 * El nuevo sistema incluye:
 * - Integración completa con Cloudinary
 * - Gestión de metadatos y categorías
 * - Tracking de referencias e imágenes huérfanas
 * - Mejor manejo de errores
 * - Logs detallados para debugging
 * 
 * @deprecated Use imageService.ts instead
 */

import axios from 'axios';
import { uploadImage as uploadImageNew } from './imageService';
import { getApiUrl } from '../utils/apiConfig';

// Declaración de tipo para Clerk en window
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

const API_BASE_URL = getApiUrl(); // Cambiado para usar getApiUrl() que incluye /api

/**
 * Obtener token de autenticación de Clerk
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      return token;
    }
  } catch (error) {
    console.error('Error obteniendo token de Clerk:', error);
  }
  return null;
};

/**
 * Subir una imagen al servidor
 * 
 * @deprecated Use imageService.uploadImage() instead
 */
export const uploadImage = async (file: File): Promise<{
  success: boolean;
  data?: {
    _id: string;
    url: string;
    cloudinaryId: string;
    filename: string;
    size: number;
    format: string;
    width: number;
    height: number;
  };
  error?: string;
}> => {
  console.warn('⚠️ uploadApi.uploadImage() está DEPRECATED. Usa imageService.uploadImage() en su lugar.');
  console.warn('📚 Guía de migración: https://github.com/jonathanEDR/web-scuticompany/blob/main/DIAGNOSTICO_SERVICIOS.md');
  
  try {
    // Redirigir al nuevo sistema
    const imageData = await uploadImageNew({
      file,
      category: 'legacy', // Marcar como legacy
      title: file.name,
      description: 'Imagen subida usando uploadApi legacy (migrar a imageService)'
    });

    // Convertir al formato que esperaba el sistema antiguo
    return {
      success: true,
      data: {
        _id: imageData._id,
        url: imageData.url,
        cloudinaryId: (imageData as any).cloudinaryId || '',
        filename: imageData.filename,
        size: imageData.size,
        format: imageData.mimetype || '',
        width: imageData.width || 0,
        height: imageData.height || 0
      }
    };
  } catch (error: any) {
    console.error('❌ Error en uploadApi (deprecated):', error);
    return {
      success: false,
      error: error.message || 'Error al subir la imagen',
    };
  }
};

/**
 * Eliminar una imagen del servidor
 * 
 * @deprecated Use imageService.deleteImage() instead
 */
export const deleteImage = async (imageId: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  console.warn('⚠️ uploadApi.deleteImage() está DEPRECATED. Usa imageService.deleteImage() en su lugar.');
  try {
    // Obtener token de autenticación
    const token = await getAuthToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data } = await axios.delete(`${API_BASE_URL}/upload/images/${imageId}`, {
      headers,
    });
    return data;
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al eliminar la imagen',
    };
  }
};

/**
 * Obtener lista de imágenes
 * 
 * @deprecated Use imageService.listImages() instead
 */
export const getImages = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  success: boolean;
  data?: any[];
  pagination?: any;
  error?: string;
}> => {
  console.warn('⚠️ uploadApi.getImages() está DEPRECATED. Usa imageService.listImages() en su lugar.');
  try {
    // Obtener token de autenticación
    const token = await getAuthToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data } = await axios.get(`${API_BASE_URL}/upload/images`, { 
      params,
      headers,
    });
    return data;
  } catch (error: any) {
    console.error('Error al obtener imágenes:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener imágenes',
    };
  }
};

export const uploadApi = {
  uploadImage,
  deleteImage,
  getImages,
};

export default uploadApi;
