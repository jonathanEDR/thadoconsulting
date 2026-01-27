// Usar la misma configuración que otros servicios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para construir URLs de API correctamente en desarrollo y producción
export const getApiUrl = (endpoint: string): string => {
  // Limpiar endpoint: asegurarse de que no empiece con /api
  const cleanEndpoint = endpoint.replace(/^\/api/, '');
  
  return `${API_URL}${cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`}`;
};

// Helper específico para endpoints de CMS
export const getCmsApiUrl = (endpoint: string): string => {
  return getApiUrl(`/cms${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
};

// Log para debugging (deshabilitado en producción)
export const logApiCall = (_url: string, _description: string) => {
  // Logs deshabilitados para producción
};

// Función para probar conectividad con el backend
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const testUrl = `${API_URL}/health`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.ok;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ [API] Error conectando con backend:', error);
    }
    return false;
  }
};