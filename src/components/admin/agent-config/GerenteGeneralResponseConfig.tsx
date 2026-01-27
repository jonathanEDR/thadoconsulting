import React, { useState } from 'react';
import { 
  MessageSquare, 
  Globe, 
  ListChecks, 
  BarChart3, 
  Lightbulb,
  FileText,
  Save,
  Plus,
  X,
  Info
} from 'lucide-react';
import type { GerenteGeneralConfigData } from '../../../services/gerenteGeneralService';

interface GerenteGeneralResponseConfigProps {
  config: GerenteGeneralConfigData | null;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'es-AR', name: 'Español (Argentina)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' }
];

const RESPONSE_FORMATS = [
  { value: 'text', label: 'Texto plano', description: 'Respuestas simples sin formato especial' },
  { value: 'structured', label: 'Estructurado', description: 'Respuestas organizadas con secciones claras' },
  { value: 'markdown', label: 'Markdown', description: 'Formato rico con headers, listas y énfasis' },
  { value: 'detailed', label: 'Detallado', description: 'Respuestas exhaustivas con todos los detalles' }
];

export const GerenteGeneralResponseConfig: React.FC<GerenteGeneralResponseConfigProps> = ({
  config,
  onConfigChange,
  onSave,
  isSaving,
  isLoading
}) => {
  const [newLanguage, setNewLanguage] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando configuración...</span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No hay configuración disponible
      </div>
    );
  }

  const responseConfig = config.responseConfig || {
    defaultLanguage: 'es-ES',
    supportedLanguages: ['es-ES', 'en-US'],
    includeExamples: true,
    includeSteps: true,
    includeMetrics: true,
    includeRecommendations: true,
    responseFormat: 'structured'
  };

  const handleResponseConfigChange = (field: string, value: any) => {
    onConfigChange('responseConfig', field, value);
  };

  const handleAddLanguage = () => {
    if (newLanguage && !responseConfig.supportedLanguages?.includes(newLanguage)) {
      handleResponseConfigChange('supportedLanguages', [
        ...(responseConfig.supportedLanguages || []),
        newLanguage
      ]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (langCode: string) => {
    if (langCode === responseConfig.defaultLanguage) {
      return; // No permitir eliminar el idioma por defecto
    }
    handleResponseConfigChange(
      'supportedLanguages',
      responseConfig.supportedLanguages?.filter(l => l !== langCode) || []
    );
  };

  // Verificar si no hay datos de respuestas configurados
  const hasNoData = !config.responseConfig || 
    (!responseConfig.defaultLanguage && 
     (responseConfig.supportedLanguages || []).length === 0);

  return (
    <div className="space-y-6">
      {/* Alerta si no hay datos configurados */}
      {hasNoData && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Configuración de respuestas no establecida
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Para un mejor funcionamiento del Gerente General, usa el botón{' '}
                <strong>"Inicializar Datos"</strong> en la parte superior para cargar la configuración
                por defecto, o configura manualmente los idiomas y formato de respuestas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <MessageSquare className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configuración de Respuestas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Define cómo el Gerente General formatea y estructura sus respuestas
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Idiomas */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-blue-600 dark:text-blue-400" size={20} />
            <h4 className="font-medium text-gray-900 dark:text-white">Configuración de Idiomas</h4>
          </div>

          {/* Idioma por defecto */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idioma por defecto
            </label>
            <select
              value={responseConfig.defaultLanguage || 'es-ES'}
              onChange={(e) => handleResponseConfigChange('defaultLanguage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Idiomas soportados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idiomas soportados
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(responseConfig.supportedLanguages || []).map(langCode => {
                const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                const isDefault = langCode === responseConfig.defaultLanguage;
                return (
                  <span
                    key={langCode}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      isDefault 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang?.name || langCode}
                    {isDefault && <span className="text-xs">(default)</span>}
                    {!isDefault && (
                      <button
                        onClick={() => handleRemoveLanguage(langCode)}
                        className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <select
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="">Seleccionar idioma...</option>
                {SUPPORTED_LANGUAGES.filter(l => !responseConfig.supportedLanguages?.includes(l.code)).map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddLanguage}
                disabled={!newLanguage}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Formato de respuesta */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-purple-600 dark:text-purple-400" size={20} />
            <h4 className="font-medium text-gray-900 dark:text-white">Formato de Respuesta</h4>
          </div>

          <div className="space-y-3">
            {RESPONSE_FORMATS.map(format => (
              <label
                key={format.value}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  responseConfig.responseFormat === format.value
                    ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                    : 'bg-white dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="responseFormat"
                  value={format.value}
                  checked={responseConfig.responseFormat === format.value}
                  onChange={(e) => handleResponseConfigChange('responseFormat', e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{format.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{format.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Opciones de contenido */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="text-green-600 dark:text-green-400" size={20} />
          <h4 className="font-medium text-gray-900 dark:text-white">Opciones de Contenido</h4>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Configura qué elementos incluir automáticamente en las respuestas del Gerente General
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incluir ejemplos */}
          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="text-amber-600 dark:text-amber-400" size={18} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Incluir Ejemplos</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Agrega ejemplos ilustrativos a las respuestas
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={responseConfig.includeExamples ?? true}
                onChange={(e) => handleResponseConfigChange('includeExamples', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                responseConfig.includeExamples ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  responseConfig.includeExamples ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </label>

          {/* Incluir pasos */}
          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ListChecks className="text-blue-600 dark:text-blue-400" size={18} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Incluir Pasos</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Divide las respuestas en pasos claros
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={responseConfig.includeSteps ?? true}
                onChange={(e) => handleResponseConfigChange('includeSteps', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                responseConfig.includeSteps ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  responseConfig.includeSteps ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </label>

          {/* Incluir métricas */}
          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BarChart3 className="text-green-600 dark:text-green-400" size={18} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Incluir Métricas</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Agrega datos cuantitativos cuando sea relevante
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={responseConfig.includeMetrics ?? true}
                onChange={(e) => handleResponseConfigChange('includeMetrics', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                responseConfig.includeMetrics ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  responseConfig.includeMetrics ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </label>

          {/* Incluir recomendaciones */}
          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Lightbulb className="text-purple-600 dark:text-purple-400" size={18} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Incluir Recomendaciones</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Sugiere acciones y mejores prácticas
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={responseConfig.includeRecommendations ?? true}
                onChange={(e) => handleResponseConfigChange('includeRecommendations', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                responseConfig.includeRecommendations ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  responseConfig.includeRecommendations ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">Configuración de respuestas</p>
          <p>
            Estas configuraciones afectan cómo el Gerente General formatea y estructura sus respuestas.
            El formato y los elementos incluidos ayudan a mantener consistencia en todas las interacciones
            con los usuarios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GerenteGeneralResponseConfig;

