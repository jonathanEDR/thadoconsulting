/**
 * Panel de Configuración Básica para GerenteGeneral
 * Gestiona parámetros fundamentales del coordinador
 */

import React from 'react';
import { Save, AlertCircle, Settings, Clock, Zap, Database, RefreshCw } from 'lucide-react';
import type { GerenteGeneralConfigData } from '../../../services/gerenteGeneralService';

interface GerenteGeneralBasicConfigProps {
  config: GerenteGeneralConfigData | null;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => Promise<void>;
  onInitialize?: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
}

export const GerenteGeneralBasicConfig: React.FC<GerenteGeneralBasicConfigProps> = ({
  config,
  onConfigChange,
  onSave,
  onInitialize,
  isSaving,
  isLoading
}) => {
  if (!config) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay configuración disponible para el Gerente General
          </p>
          {onInitialize && (
            <button
              onClick={onInitialize}
              disabled={isSaving}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors mx-auto"
            >
              <Database size={16} />
              {isSaving ? 'Inicializando...' : 'Inicializar Configuración'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!config.config) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-yellow-400 mb-4" />
          <p className="text-yellow-600 dark:text-yellow-400">
            Configuración del Gerente General incompleta
          </p>
          {onInitialize && (
            <button
              onClick={onInitialize}
              disabled={isSaving}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors mx-auto"
            >
              <Database size={16} />
              {isSaving ? 'Inicializando...' : 'Reinicializar Configuración'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Valores seguros con fallbacks
  const safeConfig = {
    timeout: config.config.timeout ?? 30,
    maxTokens: config.config.maxTokens ?? 1500,
    temperature: config.config.temperature ?? 0.6,
    maxSessionsPerUser: config.config.maxSessionsPerUser ?? 10,
    sessionTTLHours: config.config.sessionTTLHours ?? 24,
    autoRouting: config.config.autoRouting ?? true,
    contextSharing: config.config.contextSharing ?? true
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sección: Parámetros de OpenAI */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="text-blue-500" size={20} />
          Parámetros de OpenAI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timeout (segundos)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={safeConfig.timeout}
                onChange={(e) => onConfigChange('config', 'timeout', parseInt(e.target.value))}
                disabled={isSaving}
                className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-16 text-right">
                {safeConfig.timeout}s
              </span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tokens Máximos
            </label>
            <input
              type="number"
              min="500"
              max="4000"
              step="100"
              value={safeConfig.maxTokens}
              onChange={(e) => onConfigChange('config', 'maxTokens', parseInt(e.target.value))}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
          </div>

          {/* Temperature */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperatura (Creatividad vs Precisión)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Preciso</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={safeConfig.temperature}
                onChange={(e) => onConfigChange('config', 'temperature', parseFloat(e.target.value))}
                disabled={isSaving}
                className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <span className="text-xs text-gray-500">Creativo</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-12 text-right">
                {safeConfig.temperature.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Gestión de Sesiones */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="text-purple-500" size={20} />
          Gestión de Sesiones
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Max Sessions Per User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Máximo de Sesiones por Usuario
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={safeConfig.maxSessionsPerUser}
              onChange={(e) => onConfigChange('config', 'maxSessionsPerUser', parseInt(e.target.value))}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Conversaciones activas simultáneas por usuario
            </p>
          </div>

          {/* Session TTL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duración de Sesión (horas)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={safeConfig.sessionTTLHours}
              onChange={(e) => onConfigChange('config', 'sessionTTLHours', parseInt(e.target.value))}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {safeConfig.sessionTTLHours}h = {Math.round(safeConfig.sessionTTLHours / 24 * 10) / 10} días
            </p>
          </div>
        </div>
      </div>

      {/* Sección: Comportamiento del Coordinador */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="text-yellow-500" size={20} />
          Comportamiento del Coordinador
        </h3>

        <div className="space-y-4">
          {/* Auto Routing */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Enrutamiento Automático
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Decide automáticamente qué agente usar según el contexto
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={safeConfig.autoRouting}
                onChange={(e) => onConfigChange('config', 'autoRouting', e.target.checked)}
                disabled={isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
            </label>
          </div>

          {/* Context Sharing */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Compartir Contexto entre Agentes
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Permite compartir información del contexto de la conversación
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={safeConfig.contextSharing}
                onChange={(e) => onConfigChange('config', 'contextSharing', e.target.checked)}
                disabled={isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Sección: Contexto Centralizado */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Database className="text-green-500" size={20} />
          Contexto Centralizado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              TTL de Contexto (min)
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={Math.round((config.contextConfig?.sessionTTL || 3600000) / 60000)}
              onChange={(e) => onConfigChange('contextConfig', 'sessionTTL', parseInt(e.target.value) * 60000)}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Máx. Contextos Activos
            </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={config.contextConfig?.maxSessions || 100}
              onChange={(e) => onConfigChange('contextConfig', 'maxSessions', parseInt(e.target.value))}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tamaño de Memoria
            </label>
            <input
              type="number"
              min="10"
              max="500"
              value={config.contextConfig?.contextMemorySize || 50}
              onChange={(e) => onConfigChange('contextConfig', 'contextMemorySize', parseInt(e.target.value))}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-700 dark:text-gray-300">Compartición de Contexto</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.contextConfig?.enableContextSharing ?? true}
                onChange={(e) => onConfigChange('contextConfig', 'enableContextSharing', e.target.checked)}
                disabled={isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-700 dark:text-gray-300">Enriquecimiento Automático</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.contextConfig?.enableContextEnrichment ?? true}
                onChange={(e) => onConfigChange('contextConfig', 'enableContextEnrichment', e.target.checked)}
                disabled={isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        {onInitialize && (
          <button
            onClick={onInitialize}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            title="Reinicializar toda la configuración del Gerente General con valores por defecto"
          >
            <RefreshCw size={18} />
            {isSaving ? 'Reinicializando...' : 'Reinicializar Todo'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GerenteGeneralBasicConfig;
