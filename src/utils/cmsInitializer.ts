/**
 * 🚀 Script de Inicialización de Páginas CMS
 * 
 * Este script inicializa todas las páginas públicas (home, about, services, contact)
 * con datos predeterminados en la base de datos.
 * 
 * Ejecutar manualmente cuando se necesite inicializar las páginas por primera vez.
 */

import { initAllPages } from '../services/cmsApi';

export const initializeCmsPages = async (): Promise<{
  success: boolean;
  message: string;
  results?: any[];
}> => {
  try {
    console.log('🚀 [CMS Init] Iniciando páginas CMS...');
    
    const response = await initAllPages();
    
    if (response.success) {
      console.log('✅ [CMS Init] Páginas inicializadas:', response.data);
      return {
        success: true,
        message: 'Páginas CMS inicializadas correctamente',
        results: response.data
      };
    } else {
      console.error('❌ [CMS Init] Error:', response.message);
      return {
        success: false,
        message: response.message || 'Error al inicializar páginas'
      };
    }
  } catch (error: any) {
    console.error('❌ [CMS Init] Error:', error);
    return {
      success: false,
      message: error.message || 'Error al inicializar páginas CMS'
    };
  }
};

// Función para verificar si las páginas están inicializadas
export const checkCmsInitialization = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cms/pages`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const pages = data.data;
      const requiredPages = ['home', 'about', 'services', 'contact'];
      const existingPages = pages.map((p: any) => p.pageSlug);
      
      const allExist = requiredPages.every(slug => existingPages.includes(slug));
      
      if (!allExist) {
        console.warn('⚠️ [CMS Init] Faltan páginas:', {
          required: requiredPages,
          existing: existingPages,
          missing: requiredPages.filter(s => !existingPages.includes(s))
        });
      }
      
      return allExist;
    }
    
    return false;
  } catch (error) {
    console.error('❌ [CMS Init] Error verificando inicialización:', error);
    return false;
  }
};
