/**
 * Configuración de Personalidad del Agente
 * Define el archetype, traits y estilo de comunicación
 */

import React from 'react';
import { Save, RotateCcw, User, MessageCircle, Sparkles } from 'lucide-react';
import type { AgentConfigData } from '../../../services/agentConfigService';

interface PersonalityConfigPanelProps {
  config: AgentConfigData;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export const PersonalityConfigPanel: React.FC<PersonalityConfigPanelProps> = ({
  config,
  onConfigChange,
  onSave,
  onReset,
  isSaving
}) => {
  const archetypes = [
    { value: 'analyst', label: 'Analista', description: 'Enfoque en datos y métricas', icon: '📊' },
    { value: 'coach', label: 'Coach', description: 'Guía y motiva', icon: '🎯' },
    { value: 'expert', label: 'Experto', description: 'Conocimiento profundo', icon: '🎓' },
    { value: 'assistant', label: 'Asistente', description: 'Apoyo y ayuda práctica', icon: '🤝' },
    { value: 'guardian', label: 'Guardian', description: 'Protección y seguridad', icon: '🛡️' },
    { value: 'innovator', label: 'Innovador', description: 'Creatividad y nuevas ideas', icon: '💡' }
  ];

  const tones = [
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Amigable' },
    { value: 'professional', label: 'Profesional' },
    { value: 'technical', label: 'Técnico' },
    { value: 'motivational', label: 'Motivacional' }
  ];

  const verbosityLevels = [
    { value: 'concise', label: 'Conciso', description: 'Respuestas breves y directas' },
    { value: 'moderate', label: 'Moderado', description: 'Balance entre detalle y brevedad' },
    { value: 'detailed', label: 'Detallado', description: 'Explicaciones completas' },
    { value: 'comprehensive', label: 'Exhaustivo', description: 'Máximo nivel de detalle' }
  ];

  const availableTraits = [
    'analytical', 'friendly', 'precise', 'creative', 
    'professional', 'enthusiastic', 'technical', 'supportive'
  ];

  const handleTraitIntensityChange = (traitName: string, intensity: number) => {
    const updatedTraits = config.personality.traits.map(t =>
      t.trait === traitName ? { ...t, intensity } : t
    );
    onConfigChange('personality', 'traits', updatedTraits);
  };

  const handleAddTrait = (traitName: string) => {
    const existingTrait = config.personality.traits.find(t => t.trait === traitName);
    if (!existingTrait) {
      const updatedTraits = [...config.personality.traits, { trait: traitName as any, intensity: 5 }];
      onConfigChange('personality', 'traits', updatedTraits);
    }
  };

  const handleRemoveTrait = (traitName: string) => {
    const updatedTraits = config.personality.traits.filter(t => t.trait !== traitName);
    onConfigChange('personality', 'traits', updatedTraits);
  };

  return (
    <div className="space-y-8">
      {/* Archetype Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <User className="text-purple-600 dark:text-purple-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Arquetipo del Agente</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define la personalidad fundamental y el enfoque del agente
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {archetypes.map((archetype) => (
            <button
              key={archetype.value}
              onClick={() => onConfigChange('personality', 'archetype', archetype.value)}
              disabled={!config.enabled}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                config.personality.archetype === archetype.value
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800'
              } ${!config.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-2xl mb-2">{archetype.icon}</div>
              <div className="font-medium text-gray-900 dark:text-white">{archetype.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{archetype.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Personality Traits */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rasgos de Personalidad</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ajusta la intensidad de cada rasgo de personalidad (1-10)
        </p>

        {/* Active Traits */}
        <div className="space-y-3 mb-4">
          {config.personality.traits.map((trait) => (
            <div key={trait.trait} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {trait.trait}
                </span>
                <button
                  onClick={() => handleRemoveTrait(trait.trait)}
                  disabled={!config.enabled}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={trait.intensity}
                  onChange={(e) => handleTraitIntensityChange(trait.trait, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  disabled={!config.enabled}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                  {trait.intensity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Trait */}
        <div className="flex flex-wrap gap-2">
          {availableTraits
            .filter(t => !config.personality.traits.find(trait => trait.trait === t))
            .map((trait) => (
              <button
                key={trait}
                onClick={() => handleAddTrait(trait)}
                disabled={!config.enabled}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 capitalize"
              >
                + {trait}
              </button>
            ))}
        </div>
      </div>

      {/* Communication Style */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="text-green-600 dark:text-green-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estilo de Comunicación</h3>
        </div>

        {/* Tone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tono de Comunicación
          </label>
          <select
            value={config.personality.communicationStyle.tone}
            onChange={(e) => onConfigChange('personality', 'communicationStyle', {
              ...config.personality.communicationStyle,
              tone: e.target.value
            })}
            disabled={!config.enabled}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {tones.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </div>

        {/* Verbosity */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nivel de Detalle (Verbosity)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {verbosityLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => onConfigChange('personality', 'communicationStyle', {
                  ...config.personality.communicationStyle,
                  verbosity: level.value
                })}
                disabled={!config.enabled}
                className={`p-3 rounded-lg border text-left transition-all ${
                  config.personality.communicationStyle.verbosity === level.value
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="font-medium text-sm text-gray-900 dark:text-white">{level.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formality Slider */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nivel de Formalidad: {config.personality.communicationStyle.formality}
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Informal</span>
            <input
              type="range"
              min="1"
              max="10"
              value={config.personality.communicationStyle.formality}
              onChange={(e) => onConfigChange('personality', 'communicationStyle', {
                ...config.personality.communicationStyle,
                formality: parseInt(e.target.value)
              })}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled={!config.enabled}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">Formal</span>
          </div>
        </div>

        {/* Enthusiasm Slider */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nivel de Entusiasmo: {config.personality.communicationStyle.enthusiasm}
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Neutral</span>
            <input
              type="range"
              min="1"
              max="10"
              value={config.personality.communicationStyle.enthusiasm}
              onChange={(e) => onConfigChange('personality', 'communicationStyle', {
                ...config.personality.communicationStyle,
                enthusiasm: parseInt(e.target.value)
              })}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled={!config.enabled}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">Entusiasta</span>
          </div>
        </div>

        {/* Technicality Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nivel Técnico: {config.personality.communicationStyle.technicality}
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Simple</span>
            <input
              type="range"
              min="1"
              max="10"
              value={config.personality.communicationStyle.technicality}
              onChange={(e) => onConfigChange('personality', 'communicationStyle', {
                ...config.personality.communicationStyle,
                technicality: parseInt(e.target.value)
              })}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled={!config.enabled}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">Técnico</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || !config.enabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Guardar Personalidad</span>
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

export default PersonalityConfigPanel;
