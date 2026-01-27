/**
 * 🧪 PÁGINA DE PRUEBA - API CONNECTION TEST
 * Página temporal para verificar la conectividad con la API en producción
 */

import React, { useEffect, useState } from 'react';
import { debugApiConfig } from '../../utils/debugApi';
import { API_CONFIG, getBackendUrl, getApiUrl } from '../../utils/apiConfig';

interface TestResult {
  name: string;
  url: string;
  status: 'pending' | 'success' | 'error';
  response?: any;
  error?: string;
  duration?: number;
}

export const ApiTestPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const tests: Omit<TestResult, 'status'>[] = [
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
    },
    {
      name: 'Servicios Destacados',
      url: `${getApiUrl()}/servicios/destacados`,
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    const initialResults = tests.map(test => ({ ...test, status: 'pending' as const }));
    setResults(initialResults);

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const startTime = Date.now();
      
      try {
        const response = await fetch(test.url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const duration = Date.now() - startTime;
        const data = await response.json();
        
        setResults(prev => prev.map((result, index) => 
          index === i ? {
            ...result,
            status: response.ok ? 'success' : 'error',
            response: data,
            duration
          } : result
        ));
      } catch (error) {
        const duration = Date.now() - startTime;
        setResults(prev => prev.map((result, index) => 
          index === i ? {
            ...result,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            duration
          } : result
        ));
      }
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    // Debug automático al cargar
    debugApiConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🧪 API Connection Test
          </h1>
          
          {/* Configuración actual */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">📋 Current Configuration</h2>
            <div className="space-y-2 text-sm font-mono">
              <div><strong>Backend URL:</strong> {API_CONFIG.baseUrl}</div>
              <div><strong>API URL:</strong> {API_CONFIG.apiUrl}</div>
              <div><strong>Environment:</strong> {API_CONFIG.environment}</div>
              <div><strong>Is Production:</strong> {API_CONFIG.isProduction ? 'Yes' : 'No'}</div>
              <div><strong>Current Domain:</strong> {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</div>
            </div>
          </div>

          {/* Variables de entorno */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">🔧 Environment Variables</h2>
            <div className="space-y-2 text-sm font-mono">
              <div><strong>VITE_BACKEND_URL:</strong> {import.meta.env.VITE_BACKEND_URL || 'Not set'}</div>
              <div><strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</div>
              <div><strong>MODE:</strong> {import.meta.env.MODE}</div>
              <div><strong>PROD:</strong> {import.meta.env.PROD ? 'true' : 'false'}</div>
              <div><strong>DEV:</strong> {import.meta.env.DEV ? 'true' : 'false'}</div>
            </div>
          </div>

          {/* Botón de prueba */}
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isRunning ? '🔄 Running Tests...' : '▶️ Run API Tests'}
            </button>
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">📊 Test Results</h2>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === 'success'
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                        : result.status === 'error'
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                        : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⏳'} {result.name}
                      </h3>
                      {result.duration && (
                        <span className="text-sm text-gray-500">
                          {result.duration}ms
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-mono mb-2 text-gray-600 dark:text-gray-400">
                      {result.url}
                    </div>
                    
                    {result.error && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                    
                    {result.response && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-semibold">
                          View Response
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold mb-2">💡 Troubleshooting Tips</h3>
            <ul className="text-sm space-y-1">
              <li>• Check browser console for detailed logs</li>
              <li>• Verify CORS settings on backend</li>
              <li>• Ensure environment variables are set correctly</li>
              <li>• Check if backend is running on expected URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;