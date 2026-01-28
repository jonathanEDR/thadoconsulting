/**
 * Configuración de Contexto del Agente
 * Define información del proyecto y nivel de expertise del usuario
 */

import React from 'react';
import { Save, RotateCcw, Building, Globe, User } from 'lucide-react';
import type { AgentConfigData } from '../../../services/agentConfigService';

interface ContextConfigPanelProps {
  config: AgentConfigData;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export const ContextConfigPanel: React.FC<ContextConfigPanelProps> = ({
  config,
  onConfigChange,
  onSave,
  onReset,
  isSaving
}) => {
  const expertiseLevels = [
    { value: 'beginner', label: 'Principiante', description: 'Nuevo en el tema', icon: '🌱' },
    { value: 'intermediate', label: 'Intermedio', description: 'Conocimiento básico', icon: '📚' },
    { value: 'advanced', label: 'Avanzado', description: 'Experiencia sólida', icon: '🎯' },
    { value: 'expert', label: 'Experto', description: 'Dominio completo', icon: '🏆' }
  ];

  return (
    <div className="space-y-8">
      {/* Project Information */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información del Proyecto</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define el contexto del proyecto para respuestas más personalizadas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              value={config.contextConfig.projectInfo.name}
              onChange={(e) => onConfigChange('contextConfig', 'projectInfo', {
                ...config.contextConfig.projectInfo,
                name: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={!config.enabled}
              placeholder="THADO Consulting"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Proyecto
            </label>
            <input
              type="text"
              value={config.contextConfig.projectInfo.type}
              onChange={(e) => onConfigChange('contextConfig', 'projectInfo', {
                ...config.contextConfig.projectInfo,
                type: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={!config.enabled}
              placeholder="tech_blog"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ej: tech_blog, e-commerce, portfolio, etc.
            </p>
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dominio/Industria
            </label>
            <input
              type="text"
              value={config.contextConfig.projectInfo.domain}
              onChange={(e) => onConfigChange('contextConfig', 'projectInfo', {
                ...config.contextConfig.projectInfo,
                domain: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={!config.enabled}
              placeholder="technology"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ej: technology, business, health, etc.
            </p>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idioma Principal
            </label>
            <select
              value={config.contextConfig.projectInfo.language}
              onChange={(e) => onConfigChange('contextConfig', 'projectInfo', {
                ...config.contextConfig.projectInfo,
                language: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={!config.enabled}
            >
              <option value="es-ES">Español (ES)</option>
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr-FR">Français</option>
              <option value="de-DE">Deutsch</option>
              <option value="it-IT">Italiano</option>
              <option value="pt-BR">Português (BR)</option>
            </select>
          </div>

          {/* Tone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tono del Proyecto
            </label>
            <input
              type="text"
              value={config.contextConfig.projectInfo.tone}
              onChange={(e) => onConfigChange('contextConfig', 'projectInfo', {
                ...config.contextConfig.projectInfo,
                tone: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={!config.enabled}
              placeholder="professional_friendly"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ej: professional_friendly, casual_fun, formal_corporate, etc.
            </p>
          </div>
        </div>
      </div>

      {/* User Expertise Level */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <User className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nivel de Expertise del Usuario</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define el nivel de conocimiento del usuario objetivo para adaptar las respuestas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {expertiseLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => onConfigChange('contextConfig', 'userExpertise', level.value)}
              disabled={!config.enabled}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                config.contextConfig.userExpertise === level.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
              } ${!config.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-3xl mb-2">{level.icon}</div>
              <div className="font-medium text-gray-900 dark:text-white">{level.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <div className="flex gap-3">
          <Globe className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" size={20} />
          <div className="text-sm text-indigo-800 dark:text-indigo-300">
            <p className="font-medium mb-1">Importancia del Contexto</p>
            <p>
              El agente utiliza esta información para adaptar sus respuestas al contexto específico 
              de tu proyecto y al nivel de conocimiento de tus usuarios. Esto mejora significativamente 
              la relevancia y utilidad de las sugerencias.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || !config.enabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Guardar Contexto</span>
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

export default ContextConfigPanel;
