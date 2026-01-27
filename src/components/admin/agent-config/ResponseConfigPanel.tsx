/**
 * Configuración de Formato de Respuestas
 * Define cómo el agente estructura y presenta sus respuestas
 */

import React from 'react';
import { Save, RotateCcw, FileText, CheckSquare, BarChart3, Lightbulb, List } from 'lucide-react';
import type { AgentConfigData } from '../../../services/agentConfigService';

interface ResponseConfigPanelProps {
  config: AgentConfigData;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export const ResponseConfigPanel: React.FC<ResponseConfigPanelProps> = ({
  config,
  onConfigChange,
  onSave,
  onReset,
  isSaving
}) => {
  const responseFormats = [
    { 
      value: 'text', 
      label: 'Texto Simple', 
      description: 'Respuestas en texto plano',
      icon: <FileText size={24} />
    },
    { 
      value: 'structured', 
      label: 'Estructurado', 
      description: 'Respuestas con secciones organizadas',
      icon: <List size={24} />
    },
    { 
      value: 'markdown', 
      label: 'Markdown', 
      description: 'Formato markdown con énfasis',
      icon: <FileText size={24} />
    },
    { 
      value: 'detailed', 
      label: 'Detallado', 
      description: 'Respuestas exhaustivas con múltiples secciones',
      icon: <BarChart3 size={24} />
    }
  ];

  const languages = [
    { code: 'es-ES', name: 'Español' },
    { code: 'en-US', name: 'English' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'it-IT', name: 'Italiano' },
    { code: 'pt-BR', name: 'Português' }
  ];

  const toggleLanguage = (code: string) => {
    const currentLangs = config.responseConfig.supportedLanguages;
    const newLangs = currentLangs.includes(code)
      ? currentLangs.filter(l => l !== code)
      : [...currentLangs, code];
    
    onConfigChange('responseConfig', 'supportedLanguages', newLangs);
  };

  return (
    <div className="space-y-8">
      {/* Response Format */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="text-emerald-600 dark:text-emerald-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Formato de Respuesta</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Selecciona cómo el agente debe estructurar sus respuestas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {responseFormats.map((format) => (
            <button
              key={format.value}
              onClick={() => onConfigChange('responseConfig', 'responseFormat', format.value)}
              disabled={!config.enabled}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                config.responseConfig.responseFormat === format.value
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-gray-800'
              } ${!config.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-emerald-600 dark:text-emerald-400">{format.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{format.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{format.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Language Configuration */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración de Idiomas</h3>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Idioma Principal
          </label>
          <select
            value={config.responseConfig.defaultLanguage}
            onChange={(e) => onConfigChange('responseConfig', 'defaultLanguage', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={!config.enabled}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Idiomas Soportados
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                disabled={!config.enabled}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  config.responseConfig.supportedLanguages.includes(lang.code)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 dark:border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
                } ${!config.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Selecciona los idiomas en los que el agente puede responder
          </p>
        </div>
      </div>

      {/* Response Content Options */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="text-purple-600 dark:text-purple-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contenido de Respuestas</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Controla qué elementos debe incluir el agente en sus respuestas
        </p>

        <div className="space-y-3">
          {/* Include Examples */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={20} />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Incluir Ejemplos</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Proporciona ejemplos prácticos en las respuestas
                </p>
              </div>
            </div>
            <button
              onClick={() => onConfigChange('responseConfig', 'includeExamples', !config.responseConfig.includeExamples)}
              disabled={!config.enabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.responseConfig.includeExamples ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.responseConfig.includeExamples ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Include Steps */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <List className="text-blue-600 dark:text-blue-400" size={20} />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Incluir Pasos</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Desglose en pasos cuando sea relevante
                </p>
              </div>
            </div>
            <button
              onClick={() => onConfigChange('responseConfig', 'includeSteps', !config.responseConfig.includeSteps)}
              disabled={!config.enabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.responseConfig.includeSteps ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.responseConfig.includeSteps ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Include Metrics */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-purple-600 dark:text-purple-400" size={20} />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Incluir Métricas</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Proporciona datos y métricas cuando sea aplicable
                </p>
              </div>
            </div>
            <button
              onClick={() => onConfigChange('responseConfig', 'includeMetrics', !config.responseConfig.includeMetrics)}
              disabled={!config.enabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.responseConfig.includeMetrics ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.responseConfig.includeMetrics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Include Recommendations */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Lightbulb className="text-orange-600 dark:text-orange-400" size={20} />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Incluir Recomendaciones</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Agrega sugerencias y mejores prácticas
                </p>
              </div>
            </div>
            <button
              onClick={() => onConfigChange('responseConfig', 'includeRecommendations', !config.responseConfig.includeRecommendations)}
              disabled={!config.enabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.responseConfig.includeRecommendations ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.responseConfig.includeRecommendations ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || !config.enabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Guardar Configuración de Respuestas</span>
            </>
          )}
        </button>
        
        <button
          onClick={onReset}
          disabled={isSaving}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <RotateCcw size={18} />
          <span>Resetear</span>
        </button>
      </div>
    </div>
  );
};

export default ResponseConfigPanel;
