/**
 * Panel de Configuración de Reglas de Routing para GerenteGeneral
 * Gestiona palabras clave y estrategias de enrutamiento
 */

import React, { useState } from 'react';
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import type { RoutingConfiguration } from '../../../services/gerenteGeneralService';

interface RoutingRulesPanelProps {
  routingConfig: RoutingConfiguration | null;
  onConfigChange: (newConfig: RoutingConfiguration) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
}

export const RoutingRulesPanel: React.FC<RoutingRulesPanelProps> = ({
  routingConfig,
  onConfigChange,
  onSave,
  isSaving,
  isLoading
}) => {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set(['coordination']));
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  if (!routingConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando configuración de routing...</p>
      </div>
    );
  }

  const toggleExpanded = (agent: string) => {
    const newSet = new Set(expandedAgents);
    if (newSet.has(agent)) {
      newSet.delete(agent);
    } else {
      newSet.add(agent);
    }
    setExpandedAgents(newSet);
  };

  const addKeyword = (agent: string, newKeyword: string) => {
    if (!newKeyword.trim()) return;

    const newConfig = { ...routingConfig };

    if (agent === 'coordination') {
      if (!newConfig.coordinationPhase.keywords.includes(newKeyword.toLowerCase())) {
        newConfig.coordinationPhase.keywords.push(newKeyword.toLowerCase());
      }
    } else {
      const rule = newConfig.individualPhase.rules.find(r => r.agent === agent);
      if (rule && !rule.keywords.includes(newKeyword.toLowerCase())) {
        rule.keywords.push(newKeyword.toLowerCase());
      }
    }

    onConfigChange(newConfig);
    setNewKeyword('');
  };

  const removeKeyword = (agent: string, keyword: string) => {
    const newConfig = { ...routingConfig };

    if (agent === 'coordination') {
      newConfig.coordinationPhase.keywords = newConfig.coordinationPhase.keywords.filter(
        k => k !== keyword
      );
    } else {
      const rule = newConfig.individualPhase.rules.find(r => r.agent === agent);
      if (rule) {
        rule.keywords = rule.keywords.filter(k => k !== keyword);
      }
    }

    onConfigChange(newConfig);
  };

  const toggleRuleEnabled = (agent: string, enabled: boolean) => {
    const newConfig = { ...routingConfig };
    const rule = newConfig.individualPhase.rules.find(r => r.agent === agent);
    if (rule) {
      rule.enabled = enabled;
    }
    onConfigChange(newConfig);
  };

  const updateRulePriority = (agent: string, priority: number) => {
    const newConfig = { ...routingConfig };
    const rule = newConfig.individualPhase.rules.find(r => r.agent === agent);
    if (rule) {
      rule.priority = priority;
    }
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-6">
      {/* FASE 1: Coordinación Multi-Agente */}
      <div className="p-6 border-2 border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpanded('coordination')}
        >
          <div className="flex items-center gap-3">
            {expandedAgents.has('coordination') ? (
              <ChevronUp size={20} className="text-purple-600" />
            ) : (
              <ChevronDown size={20} className="text-purple-600" />
            )}
            <div>
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300">
                ⭐ FASE 1: Coordinación Multi-Agente (Máxima Prioridad)
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Keywords que disparan coordinación entre múltiples agentes
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={routingConfig.coordinationPhase.enabled}
              onChange={(e) => {
                const newConfig = { ...routingConfig };
                newConfig.coordinationPhase.enabled = e.target.checked;
                onConfigChange(newConfig);
              }}
              disabled={isSaving}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {expandedAgents.has('coordination') && (
          <div className="mt-6 space-y-4">
            {/* Configuración de coordinación */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Requiere Múltiples Agentes
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={routingConfig.coordinationPhase.requireMultipleAgents}
                    onChange={(e) => {
                      const newConfig = { ...routingConfig };
                      newConfig.coordinationPhase.requireMultipleAgents = e.target.checked;
                      onConfigChange(newConfig);
                    }}
                    disabled={isSaving}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mínimo de Agentes para Coordinación
                </label>
                <input
                  type="number"
                  min={2}
                  max={5}
                  value={routingConfig.coordinationPhase.minAgentsForCoordination}
                  onChange={(e) => {
                    const newConfig = { ...routingConfig };
                    newConfig.coordinationPhase.minAgentsForCoordination = parseInt(e.target.value);
                    onConfigChange(newConfig);
                  }}
                  disabled={isSaving}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Palabras Clave de Coordinación
              </label>

              {/* Input para agregar keywords */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: crear blog del servicio"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addKeyword('coordination', newKeyword);
                    }
                  }}
                  disabled={isSaving}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <button
                  onClick={() => addKeyword('coordination', newKeyword)}
                  disabled={isSaving || !newKeyword.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium flex items-center gap-2"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>

              {/* Lista de keywords */}
              <div className="flex flex-wrap gap-2">
                {routingConfig.coordinationPhase.keywords.map(keyword => (
                  <div
                    key={keyword}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-300 rounded-lg"
                  >
                    <span className="text-sm">{keyword}</span>
                    <button
                      onClick={() => removeKeyword('coordination', keyword)}
                      disabled={isSaving}
                      className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total: {routingConfig.coordinationPhase.keywords.length} keywords de coordinación
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FASE 2: Agentes Individuales */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => toggleExpanded('individual')}
        >
          <div className="flex items-center gap-3">
            {expandedAgents.has('individual') ? (
              <ChevronUp size={20} className="text-blue-600" />
            ) : (
              <ChevronDown size={20} className="text-blue-600" />
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                📋 FASE 2: Agentes Individuales
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keywords para cada agente cuando no hay coordinación
              </p>
            </div>
          </div>
        </div>

        {/* Agente por defecto */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Agente por Defecto
          </label>
          <select
            value={routingConfig.individualPhase.defaultAgent}
            onChange={(e) => {
              const newConfig = { ...routingConfig };
              newConfig.individualPhase.defaultAgent = e.target.value;
              onConfigChange(newConfig);
            }}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="BlogAgent">BlogAgent</option>
            <option value="SEOAgent">SEOAgent</option>
            <option value="ServicesAgent">ServicesAgent</option>
          </select>
        </div>

        {expandedAgents.has('individual') && (
          <div className="mt-6 space-y-4">
            {routingConfig.individualPhase.rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg"
              >
                {/* Header del agente */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-900 dark:text-white">{rule.agent}</h4>
                    <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      Prioridad: {rule.priority}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => toggleRuleEnabled(rule.agent, e.target.checked)}
                      disabled={isSaving}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Priority */}
                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Prioridad (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rule.priority}
                    onChange={(e) => updateRulePriority(rule.agent, parseInt(e.target.value))}
                    disabled={isSaving}
                    className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                </div>

                {/* Keywords input */}
                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-2">
                    Palabras Clave para {rule.agent}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Ej: ${rule.agent.toLowerCase()}`}
                      value={selectedAgent === rule.agent ? newKeyword : ''}
                      onChange={(e) => {
                        setSelectedAgent(rule.agent);
                        setNewKeyword(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addKeyword(rule.agent, newKeyword);
                        }
                      }}
                      disabled={isSaving}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button
                      onClick={() => addKeyword(rule.agent, newKeyword)}
                      disabled={isSaving || !newKeyword.trim()}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Keywords list */}
                  <div className="flex flex-wrap gap-2">
                    {rule.keywords.map(keyword => (
                      <div
                        key={keyword}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 rounded text-xs"
                      >
                        <span>{keyword}</span>
                        <button
                          onClick={() => removeKeyword(rule.agent, keyword)}
                          disabled={isSaving}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {rule.keywords.length} keywords configuradas
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar Reglas'}
        </button>
      </div>
    </div>
  );
};

export default RoutingRulesPanel;
