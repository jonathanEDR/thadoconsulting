/**
 * 🚀 Servicio de Inicialización de CMS
 * 
 * Inicializa todas las páginas públicas necesarias en la BD
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Obtener token de autenticación del usuario
 */
const getAuthToken = async () => {
  try {
    // Intentar obtener el token de Clerk
    if (window.Clerk?.session) {
      return await window.Clerk.session.getToken();
    }
  } catch (error) {
    // Silent fail - no token available
  }
  return null;
};

/**
 * Inicializar todas las páginas públicas
 */
export const initializeCMSPages = async () => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ [initializeCMSPages] Sin token de autenticación');
      }
      return false;
    }

    const response = await fetch(`${API_URL}/cms/pages/init-all`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data.success) {
      if (import.meta.env.DEV) {
        console.log('✅ [initializeCMSPages] Páginas inicializadas:', data.data);
      }
      return true;
    } else {
      if (import.meta.env.DEV) {
        console.warn('⚠️ [initializeCMSPages]', data.message);
      }
      return false;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ [initializeCMSPages] Error:', error);
    }
    return false;
  }
};

/**
 * Inicializar solo la página Home
 */
export const initializeHomePage = async () => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ [initializeHomePage] Sin token de autenticación');
      }
      return false;
    }

    const response = await fetch(`${API_URL}/cms/pages/init-home`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data.success) {
      if (import.meta.env.DEV) {
        console.log('✅ [initializeHomePage] Página Home inicializada');
      }
      return true;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ [initializeHomePage] Error:', error);
    }
  }
  return false;
};

export default {
  initializeCMSPages,
  initializeHomePage
};
