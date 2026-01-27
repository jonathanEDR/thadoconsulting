/**
 * 🔍 DEBUG API CONFIGURATION
 * Herramienta de debugging para verificar la configuración de API
 */

export const debugApiConfig = () => {
  const info = {
    // Variables de entorno
    env: {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
      VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV,
    },
    
    // Información del navegador
    browser: typeof window !== 'undefined' ? {
      hostname: window.location.hostname,
      origin: window.location.origin,
      href: window.location.href,
      protocol: window.location.protocol,
      port: window.location.port,
    } : 'SSR/Node Environment',
    
    // Timestamp
    timestamp: new Date().toISOString(),
  };

  console.group('🔍 API CONFIG DEBUG');
  console.table(info.env);
  console.log('🌐 Browser Info:', info.browser);
  console.log('⏰ Timestamp:', info.timestamp);
  console.groupEnd();

  return info;
};

export const testApiConnection = async () => {
  const { API_CONFIG, getBackendUrl, getApiUrl } = await import('./apiConfig');
  
  console.group('🧪 API CONNECTION TEST');
  console.log('📋 Configuration:', API_CONFIG);
  console.log('🔗 Backend URL:', getBackendUrl());
  console.log('🔗 API URL:', getApiUrl());
  
  const tests = [
    {
      name: 'Backend Health',
      url: `${getBackendUrl()}/health`,
    },
    {
      name: 'API Health',
      url: `${getApiUrl()}/health`,
    },
    {
      name: 'Servicios Endpoint',
      url: `${getApiUrl()}/servicios`,
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🔄 Testing ${test.name}...`);
      const response = await fetch(test.url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`✅ ${test.name}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      });
    } catch (error) {
      console.error(`❌ ${test.name} Failed:`, error);
    }
  }
  
  console.groupEnd();
};

// Las funciones de debug están disponibles pero no se ejecutan automáticamente