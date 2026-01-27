/**
 * Panel de Configuración del SEO Agent
 * Redirige al panel oficial de configuración centralizada
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Settings, 
  AlertTriangle, 
  ExternalLink,
  Brain,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';

const SEOConfigPanel: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  // Verificar si es SUPER_ADMIN
  const isSuperAdmin = role === 'SUPER_ADMIN';

  // Navegar al panel oficial de configuración
  const handleGoToConfig = () => {
    navigate('/dashboard/agents/seo/training');
  };

  // Si no es SUPER_ADMIN, mostrar mensaje de restricción
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acceso Restringido
          </h3>
          <p className="text-sm text-gray-600">
            Solo los usuarios con rol <strong>SUPER_ADMIN</strong> pueden acceder 
            a la configuración avanzada del agente SEO.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
          <Settings className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración del Agente SEO
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Personaliza el comportamiento, parámetros y entrenamiento del agente SEO 
          desde el panel de configuración centralizada.
        </p>
      </div>

      {/* Características disponibles */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Funcionalidades de Configuración
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Entrenamiento</h4>
              <p className="text-sm text-gray-600">Ejemplos y casos de uso específicos</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Parámetros</h4>
              <p className="text-sm text-gray-600">Temperature, tokens, personalidad</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Configuración</h4>
              <p className="text-sm text-gray-600">Prompts personalizados y contexto</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Pruebas</h4>
              <p className="text-sm text-gray-600">Testing y validación en tiempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">
          Panel de Configuración Centralizada
        </h3>
        <p className="text-purple-100 mb-6 max-w-md mx-auto">
          Accede al panel completo de configuración y entrenamiento del agente SEO 
          con todas las herramientas avanzadas disponibles.
        </p>
        
        <button
          onClick={handleGoToConfig}
          className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Ir a Configuración
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Info adicional */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Configuración Integrada
            </h4>
            <p className="text-sm text-blue-700">
              El panel de configuración está integrado con el sistema centralizado de agentes. 
              Todos los cambios se guardan automáticamente y se aplican en tiempo real al agente SEO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOConfigPanel;

