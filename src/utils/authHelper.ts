/**
 * Helper para obtener el token de autenticación de Clerk
 * y agregarlo a los headers de las requests
 */

import { useAuth } from '@clerk/clerk-react';

// Función para obtener headers con autenticación
export const getAuthHeaders = async (getToken: () => Promise<string | null>): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }

  return headers;
};

// Hook personalizado para hacer requests autenticados
export const useAuthFetch = () => {
  const { getToken } = useAuth();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = await getAuthHeaders(getToken);

    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  };

  return { authFetch, getToken };
};
