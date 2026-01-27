/**
 * 🩺 Componente de Diagnóstico del Blog
 * Muestra información de debug para troubleshooting
 */

import React from 'react';
import { useBlogDebug } from '../../../hooks/blog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Server,
  Globe,
  Database
} from 'lucide-react';

interface BlogDiagnosticsProps {
  className?: string;
  showOnlyErrors?: boolean;
}

const BlogDiagnostics: React.FC<BlogDiagnosticsProps> = ({ 
  className = '',
  showOnlyErrors = false 
}) => {
  const debugInfo = useBlogDebug();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'available':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'checking':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const hasErrors = debugInfo.connectivity.status === 'error' || 
                   debugInfo.routes.posts === 'error' || 
                   debugInfo.routes.categories === 'error';

  // Solo mostrar si hay errores cuando showOnlyErrors es true
  if (showOnlyErrors && !hasErrors) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Blog Module Diagnostics
        </h3>
      </div>

      <div className="space-y-4">
        {/* Información del Entorno */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Entorno
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {debugInfo.environment}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                API URL
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {debugInfo.apiUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Estado de Conectividad */}
        <div className={`p-4 rounded-lg border ${getStatusColor(debugInfo.connectivity.status)}`}>
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon(debugInfo.connectivity.status)}
            <div className="font-medium">
              Conectividad Backend
            </div>
          </div>
          <div className="text-sm">
            {debugInfo.connectivity.message}
            {debugInfo.connectivity.responseTime && (
              <span className="ml-2 text-xs">
                ({debugInfo.connectivity.responseTime}ms)
              </span>
            )}
          </div>
        </div>

        {/* Estado de Rutas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg border ${getStatusColor(debugInfo.routes.posts)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugInfo.routes.posts)}
              <div className="font-medium text-sm">
                Ruta Posts
              </div>
            </div>
            <div className="text-xs mt-1">
              /api/blog/posts
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${getStatusColor(debugInfo.routes.categories)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugInfo.routes.categories)}
              <div className="font-medium text-sm">
                Ruta Categorías
              </div>
            </div>
            <div className="text-xs mt-1">
              /api/blog/categories
            </div>
          </div>
        </div>

        {/* Mensaje de ayuda si hay errores */}
        {hasErrors && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Problemas detectados
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Verifica tu conexión a internet y que el backend esté funcionando correctamente.
                  Si el problema persiste en producción, revisa las variables de entorno.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDiagnostics;