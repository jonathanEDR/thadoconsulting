/**
 * 🔧 Setup del Blog API Client
 * Configuración de interceptores con acceso al token
 */

import type { AxiosInstance } from 'axios';

let tokenGetter: (() => Promise<string | null>) | null = null;

/**
 * Configura el getter de token para el API client
 * Debe ser llamado desde un componente React que tenga acceso a useAuth
 */
export function setTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

/**
 * Obtiene el token actual
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // Método 1: Usar el getter configurado
    if (tokenGetter) {
      const token = await tokenGetter();
      if (token) return token;
    }

    // Método 2: Desde window.Clerk
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) return token;
    }

    // Método 3: Desde sessionStorage (fallback)
    const storageToken = sessionStorage.getItem('__clerk_client_jwt');
    if (storageToken) return storageToken;

    return null;
  } catch (error) {
    console.error('[BlogAPI] Error obteniendo token:', error);
    return null;
  }
}

/**
 * Configura el interceptor de autenticación para un cliente Axios
 */
export function setupAuthInterceptor(client: AxiosInstance) {
  client.interceptors.request.use(
    async (config) => {
      const token = await getAuthToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('⚠️ [BlogAPI] No hay token disponible para:', config.url);
      }
      
      return config;
    },
    (error) => {
      console.error('❌ [BlogAPI] Error en request:', error);
      return Promise.reject(error);
    }
  );
}
