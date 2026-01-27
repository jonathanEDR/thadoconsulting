/**
 * 🔍 Hook de Debug para el módulo Blog
 * Ayuda a identificar problemas de conectividad y configuración
 */

import { useState, useEffect } from 'react';
import { getApiUrl, getEnvironment, isProduction } from '../../utils/apiConfig';

interface BlogDebugInfo {
  environment: string;
  apiUrl: string;
  isProduction: boolean;
  connectivity: {
    status: 'checking' | 'connected' | 'error';
    message: string;
    responseTime?: number;
  };
  routes: {
    posts: 'checking' | 'available' | 'error';
    categories: 'checking' | 'available' | 'error';
  };
}

export function useBlogDebug() {
  const [debugInfo, setDebugInfo] = useState<BlogDebugInfo>({
    environment: getEnvironment(),
    apiUrl: getApiUrl(),
    isProduction: isProduction(),
    connectivity: {
      status: 'checking',
      message: 'Verificando conectividad...'
    },
    routes: {
      posts: 'checking',
      categories: 'checking'
    }
  });

  useEffect(() => {
    const checkConnectivity = async () => {
      const startTime = Date.now();
      
      try {
        // Test básico de conectividad con el backend
        const response = await fetch(`${getApiUrl()}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // No incluir credentials para el health check
        });

        const responseTime = Date.now() - startTime;

        if (response.ok) {
          setDebugInfo(prev => ({
            ...prev,
            connectivity: {
              status: 'connected',
              message: 'Conectado al backend',
              responseTime
            }
          }));
          
          // Test rutas específicas del blog
          await checkBlogRoutes();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error: any) {
        setDebugInfo(prev => ({
          ...prev,
          connectivity: {
            status: 'error',
            message: `Error de conectividad: ${error.message}`
          }
        }));
      }
    };

    const checkBlogRoutes = async () => {
      // Test ruta de posts
      try {
        const postsResponse = await fetch(`${getApiUrl()}/blog/posts?limit=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setDebugInfo(prev => ({
          ...prev,
          routes: {
            ...prev.routes,
            posts: postsResponse.ok ? 'available' : 'error'
          }
        }));
      } catch {
        setDebugInfo(prev => ({
          ...prev,
          routes: {
            ...prev.routes,
            posts: 'error'
          }
        }));
      }

      // Test ruta de categorías
      try {
        const categoriesResponse = await fetch(`${getApiUrl()}/blog/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setDebugInfo(prev => ({
          ...prev,
          routes: {
            ...prev.routes,
            categories: categoriesResponse.ok ? 'available' : 'error'
          }
        }));
      } catch {
        setDebugInfo(prev => ({
          ...prev,
          routes: {
            ...prev.routes,
            categories: 'error'
          }
        }));
      }
    };

    // Solo ejecutar en desarrollo o si debug está habilitado
    if (!isProduction() || import.meta.env.VITE_DEBUG_API === 'true') {
      checkConnectivity();
    }
  }, []);

  return debugInfo;
}

/**
 * Hook para mostrar información de debug en la consola
 */
export function useBlogDebugConsole() {
  const debugInfo = useBlogDebug();

  useEffect(() => {
    // Solo mostrar si VITE_DEBUG_API está explícitamente habilitado
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.group('🔍 Blog Module Debug Info');
      console.log('Environment:', debugInfo.environment);
      console.log('API URL:', debugInfo.apiUrl);
      console.log('Is Production:', debugInfo.isProduction);
      console.log('Connectivity:', debugInfo.connectivity);
      console.log('Routes:', debugInfo.routes);
      console.groupEnd();
    }
  }, [debugInfo]);

  return debugInfo;
}