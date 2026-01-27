/**
 * 🔍 Componente de Diagnóstico para Upload de Imágenes
 * Diagnostica problemas específicos con el sistema de uploads
 */

import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, AlertTriangle, Clock, Info } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

interface UploadDiagnosticProps {
  className?: string;
}

interface DiagnosticResult {
  name: string;
  status: 'checking' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

const UploadDiagnostic: React.FC<UploadDiagnosticProps> = ({ className = '' }) => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'checking':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'checking':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const diagnostics: DiagnosticResult[] = [];

    // 1. Test de conectividad básica
    try {
      diagnostics.push({
        name: 'Conectividad API',
        status: 'checking',
        message: 'Verificando conectividad...'
      });
      setResults([...diagnostics]);

      const healthResponse = await fetch(`${getApiUrl()}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (healthResponse.ok) {
        diagnostics[diagnostics.length - 1] = {
          name: 'Conectividad API',
          status: 'success',
          message: 'API accesible correctamente'
        };
      } else {
        diagnostics[diagnostics.length - 1] = {
          name: 'Conectividad API',
          status: 'error',
          message: `Error HTTP ${healthResponse.status}`,
          details: healthResponse.statusText
        };
      }
    } catch (error: any) {
      diagnostics[diagnostics.length - 1] = {
        name: 'Conectividad API',
        status: 'error',
        message: 'No se puede conectar con la API',
        details: error.message
      };
    }

    setResults([...diagnostics]);

    // 2. Test de autenticación
    try {
      diagnostics.push({
        name: 'Autenticación',
        status: 'checking',
        message: 'Verificando token de autenticación...'
      });
      setResults([...diagnostics]);

      // Intentar obtener el token de Clerk
      const clerkToken = window.Clerk?.session ? await window.Clerk.session.getToken() : null;
      
      if (clerkToken) {
        diagnostics[diagnostics.length - 1] = {
          name: 'Autenticación',
          status: 'success',
          message: 'Token de autenticación disponible'
        };
      } else {
        diagnostics[diagnostics.length - 1] = {
          name: 'Autenticación',
          status: 'error',
          message: 'No hay token de autenticación',
          details: 'Usuario no logueado o sesión expirada'
        };
      }
    } catch (error: any) {
      diagnostics[diagnostics.length - 1] = {
        name: 'Autenticación',
        status: 'error',
        message: 'Error al obtener token',
        details: error.message
      };
    }

    setResults([...diagnostics]);

    // 3. Test de endpoint de upload (solo HEAD request)
    try {
      diagnostics.push({
        name: 'Endpoint Upload',
        status: 'checking',
        message: 'Verificando endpoint de upload...'
      });
      setResults([...diagnostics]);

      const uploadResponse = await fetch(`${getApiUrl()}/upload/image`, {
        method: 'OPTIONS', // Preflight request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.Clerk?.session ? `Bearer ${await window.Clerk.session.getToken()}` : ''
        }
      });

      if (uploadResponse.ok || uploadResponse.status === 200) {
        diagnostics[diagnostics.length - 1] = {
          name: 'Endpoint Upload',
          status: 'success',
          message: 'Endpoint de upload accesible'
        };
      } else if (uploadResponse.status === 405) {
        // Method not allowed es esperado para OPTIONS
        diagnostics[diagnostics.length - 1] = {
          name: 'Endpoint Upload',
          status: 'success',
          message: 'Endpoint de upload disponible'
        };
      } else {
        diagnostics[diagnostics.length - 1] = {
          name: 'Endpoint Upload',
          status: 'warning',
          message: `Respuesta inesperada: ${uploadResponse.status}`,
          details: uploadResponse.statusText
        };
      }
    } catch (error: any) {
      diagnostics[diagnostics.length - 1] = {
        name: 'Endpoint Upload',
        status: 'error',
        message: 'Error al verificar endpoint',
        details: error.message
      };
    }

    setResults([...diagnostics]);

    // 4. Verificar límites del navegador
    diagnostics.push({
      name: 'Capacidades del Navegador',
      status: 'checking',
      message: 'Verificando soporte del navegador...'
    });
    setResults([...diagnostics]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const hasFileAPI = !!(window.File && window.FileReader && window.FileList && window.Blob);
    const hasFormData = !!window.FormData;
    const hasFetch = !!window.fetch;

    if (hasFileAPI && hasFormData && hasFetch) {
      diagnostics[diagnostics.length - 1] = {
        name: 'Capacidades del Navegador',
        status: 'success',
        message: 'Navegador totalmente compatible'
      };
    } else {
      diagnostics[diagnostics.length - 1] = {
        name: 'Capacidades del Navegador',
        status: 'warning',
        message: 'Navegador con compatibilidad limitada',
        details: `File API: ${hasFileAPI}, FormData: ${hasFormData}, Fetch: ${hasFetch}`
      };
    }

    setResults([...diagnostics]);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const hasErrors = results.some(r => r.status === 'error');
  const hasWarnings = results.some(r => r.status === 'warning');

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Diagnóstico de Upload de Imágenes
        </h3>
        {!isRunning && (
          <button
            onClick={runDiagnostics}
            className="ml-auto text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          >
            Ejecutar Nuevamente
          </button>
        )}
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="font-medium">{result.name}</div>
                <div className="text-sm">{result.message}</div>
                {result.details && (
                  <div className="text-xs mt-1 opacity-75">{result.details}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isRunning && results.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Resumen:</strong> {results.filter(r => r.status === 'success').length} éxitos, 
            {results.filter(r => r.status === 'warning').length} advertencias, 
            {results.filter(r => r.status === 'error').length} errores
          </div>
          
          {hasErrors && (
            <div className="text-sm text-red-600 dark:text-red-400 mt-1">
              ⚠️ Se encontraron errores que pueden impedir el upload de imágenes.
            </div>
          )}
          
          {hasWarnings && !hasErrors && (
            <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              ⚠️ Hay advertencias que podrían causar problemas ocasionales.
            </div>
          )}
          
          {!hasErrors && !hasWarnings && (
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              ✅ Todo parece estar configurado correctamente.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadDiagnostic;