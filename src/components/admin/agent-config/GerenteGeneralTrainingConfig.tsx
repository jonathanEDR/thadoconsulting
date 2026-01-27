/**
 * Panel de Configuración de Entrenamiento para GerenteGeneral
 * Gestiona ejemplos, taskPrompts, reglas de comportamiento e instrucciones especiales
 */

import React, { useState } from 'react';
import { 
  Save, BookOpen, ListChecks, 
  Plus, Trash2, ChevronDown, ChevronUp, Edit2, X,
  Brain, Lightbulb
} from 'lucide-react';
import type { 
  GerenteGeneralConfigData, 
  TrainingExample
} from '../../../services/gerenteGeneralService';

interface GerenteGeneralTrainingConfigProps {
  config: GerenteGeneralConfigData | null;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
}

const EXAMPLE_CATEGORIES = [
  'multi_agent_coordination',
  'intelligent_routing',
  'session_continuity',
  'system_monitoring',
  'error_recovery',
  'general'
];

const LEARNING_MODES = [
  { value: 'conservative', label: 'Conservador', description: 'Cambios mínimos, máxima estabilidad' },
  { value: 'balanced', label: 'Balanceado', description: 'Equilibrio entre aprendizaje y estabilidad' },
  { value: 'aggressive', label: 'Agresivo', description: 'Aprendizaje rápido, más experimental' },
  { value: 'adaptive', label: 'Adaptativo', description: 'Se adapta al estilo del usuario' }
];

export const GerenteGeneralTrainingConfig: React.FC<GerenteGeneralTrainingConfigProps> = ({
  config,
  onConfigChange,
  onSave,
  isSaving,
  isLoading
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['examples']));
  const [_editingExampleId, _setEditingExampleId] = useState<string | null>(null);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [newRule, setNewRule] = useState('');
  const [newExample, setNewExample] = useState<Partial<TrainingExample>>({
    input: '',
    expectedOutput: '',
    category: 'general',
    notes: ''
  });

  if (!config || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando configuración...</span>
      </div>
    );
  }

  const trainingConfig = config.trainingConfig || {
    examples: [],
    taskPrompts: [],
    behaviorRules: [],
    specialInstructions: '',
    learningMode: 'balanced'
  };

  // Verificar si hay datos configurados
  const hasNoData = !config.trainingConfig || (
    (!config.trainingConfig.examples || config.trainingConfig.examples.length === 0) &&
    (!config.trainingConfig.behaviorRules || config.trainingConfig.behaviorRules.length === 0) &&
    (!config.trainingConfig.specialInstructions || config.trainingConfig.specialInstructions.trim() === '')
  );

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  // Handlers para Ejemplos
  const handleAddExample = () => {
    if (!newExample.input || !newExample.expectedOutput) return;
    
    const example: TrainingExample = {
      id: `example_${Date.now()}`,
      input: newExample.input || '',
      expectedOutput: newExample.expectedOutput || '',
      category: newExample.category || 'general',
      notes: newExample.notes || ''
    };
    
    const updatedExamples = [...(trainingConfig.examples || []), example];
    onConfigChange('trainingConfig', 'examples', updatedExamples);
    setNewExample({ input: '', expectedOutput: '', category: 'general', notes: '' });
  };

  const handleRemoveExample = (id: string) => {
    const updatedExamples = (trainingConfig.examples || []).filter(e => e.id !== id);
    onConfigChange('trainingConfig', 'examples', updatedExamples);
  };

  const handleUpdateExample = (id: string, field: string, value: string) => {
    const updatedExamples = (trainingConfig.examples || []).map(e => 
      e.id === id ? { ...e, [field]: value } : e
    );
    onConfigChange('trainingConfig', 'examples', updatedExamples);
  };

  // Handlers para Reglas de Comportamiento
  const handleAddRule = () => {
    if (!newRule.trim()) return;
    const updatedRules = [...(trainingConfig.behaviorRules || []), newRule.trim()];
    onConfigChange('trainingConfig', 'behaviorRules', updatedRules);
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = (trainingConfig.behaviorRules || []).filter((_, i) => i !== index);
    onConfigChange('trainingConfig', 'behaviorRules', updatedRules);
  };

  const handleUpdateRule = (index: number, value: string) => {
    const updatedRules = [...(trainingConfig.behaviorRules || [])];
    updatedRules[index] = value;
    onConfigChange('trainingConfig', 'behaviorRules', updatedRules);
    setEditingRuleIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Alerta si no hay datos configurados */}
      {hasNoData && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Datos de entrenamiento no configurados
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Para un mejor funcionamiento del Gerente General, usa el botón{' '}
                <strong>"Inicializar Datos"</strong> en la parte superior para cargar la configuración
                por defecto, o agrega manualmente ejemplos y reglas de comportamiento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modo de Aprendizaje */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="text-purple-500" size={20} />
          Modo de Aprendizaje
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LEARNING_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onConfigChange('trainingConfig', 'learningMode', mode.value)}
              disabled={isSaving}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                trainingConfig.learningMode === mode.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              } disabled:opacity-50`}
            >
              <span className="font-semibold text-sm text-gray-900 dark:text-white">{mode.label}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sección: Ejemplos de Entrenamiento */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('examples')}
          className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600" size={20} />
            <span className="font-bold text-gray-900 dark:text-white">
              Ejemplos de Entrenamiento ({trainingConfig.examples?.length || 0})
            </span>
          </div>
          {expandedSections.has('examples') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.has('examples') && (
          <div className="p-4 space-y-4">
            {/* Lista de ejemplos existentes */}
            {(trainingConfig.examples || []).map((example: TrainingExample) => (
              <div 
                key={example.id} 
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                    {example.category}
                  </span>
                  <button
                    onClick={() => handleRemoveExample(example.id)}
                    disabled={isSaving}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Input (Entrada del usuario)
                    </label>
                    <textarea
                      value={example.input}
                      onChange={(e) => handleUpdateExample(example.id, 'input', e.target.value)}
                      disabled={isSaving}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Output Esperado (Respuesta ideal)
                    </label>
                    <textarea
                      value={example.expectedOutput}
                      onChange={(e) => handleUpdateExample(example.id, 'expectedOutput', e.target.value)}
                      disabled={isSaving}
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
                    />
                  </div>
                  {example.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      📝 {example.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Formulario para agregar nuevo ejemplo */}
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Plus size={16} />
                Agregar Nuevo Ejemplo
              </h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
                    <select
                      value={newExample.category}
                      onChange={(e) => setNewExample({ ...newExample, category: e.target.value })}
                      disabled={isSaving}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg disabled:opacity-50"
                    >
                      {EXAMPLE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Notas (opcional)</label>
                    <input
                      type="text"
                      value={newExample.notes || ''}
                      onChange={(e) => setNewExample({ ...newExample, notes: e.target.value })}
                      disabled={isSaving}
                      placeholder="Descripción del ejemplo..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Input</label>
                  <textarea
                    value={newExample.input || ''}
                    onChange={(e) => setNewExample({ ...newExample, input: e.target.value })}
                    disabled={isSaving}
                    rows={2}
                    placeholder="¿Qué dice el usuario?"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Output Esperado</label>
                  <textarea
                    value={newExample.expectedOutput || ''}
                    onChange={(e) => setNewExample({ ...newExample, expectedOutput: e.target.value })}
                    disabled={isSaving}
                    rows={4}
                    placeholder="¿Cómo debe responder el agente?"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg disabled:opacity-50"
                  />
                </div>

                <button
                  onClick={handleAddExample}
                  disabled={!newExample.input || !newExample.expectedOutput || isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  Agregar Ejemplo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección: Reglas de Comportamiento */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('rules')}
          className="w-full p-4 bg-green-50 dark:bg-green-900/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <ListChecks className="text-green-600" size={20} />
            <span className="font-bold text-gray-900 dark:text-white">
              Reglas de Comportamiento ({trainingConfig.behaviorRules?.length || 0})
            </span>
          </div>
          {expandedSections.has('rules') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.has('rules') && (
          <div className="p-4 space-y-3">
            {(trainingConfig.behaviorRules || []).map((rule: string, index: number) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                  {index + 1}
                </span>
                
                {editingRuleIndex === index ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      defaultValue={rule}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateRule(index, (e.target as HTMLInputElement).value);
                        } else if (e.key === 'Escape') {
                          setEditingRuleIndex(null);
                        }
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded"
                    />
                    <button
                      onClick={() => setEditingRuleIndex(null)}
                      className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{rule}</span>
                    <button
                      onClick={() => setEditingRuleIndex(index)}
                      disabled={isSaving}
                      className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                    >
                      <Edit2 size={14} />
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => handleRemoveRule(index)}
                  disabled={isSaving}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {/* Input para nueva regla */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                disabled={isSaving}
                placeholder="Nueva regla de comportamiento..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg disabled:opacity-50"
              />
              <button
                onClick={handleAddRule}
                disabled={!newRule.trim() || isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Agregar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sección: Instrucciones Especiales */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('instructions')}
          className="w-full p-4 bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="text-yellow-600" size={20} />
            <span className="font-bold text-gray-900 dark:text-white">
              Instrucciones Especiales
            </span>
          </div>
          {expandedSections.has('instructions') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.has('instructions') && (
          <div className="p-4">
            <textarea
              value={trainingConfig.specialInstructions || ''}
              onChange={(e) => onConfigChange('trainingConfig', 'specialInstructions', e.target.value)}
              disabled={isSaving}
              rows={6}
              placeholder="Instrucciones adicionales que definen el comportamiento único del Gerente General..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Estas instrucciones se agregan al contexto del agente para personalizar su comportamiento general.
            </p>
          </div>
        )}
      </div>

      {/* Botón Guardar */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar Configuración de Entrenamiento'}
        </button>
      </div>
    </div>
  );
};

export default GerenteGeneralTrainingConfig;
