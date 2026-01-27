/**
 * Panel de Configuración de Personalidad para GerenteGeneral
 * Gestiona archetype, traits y estilo de comunicación
 */

import React from 'react';
import { Save, User, MessageSquare, Sparkles, Trash2, Plus, Lightbulb } from 'lucide-react';
import type { GerenteGeneralConfigData, PersonalityTrait } from '../../../services/gerenteGeneralService';

interface GerenteGeneralPersonalityConfigProps {
  config: GerenteGeneralConfigData | null;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
}

const ARCHETYPES = [
  { value: 'coordinator', label: 'Coordinador', description: 'Organizado y eficiente en la gestión de equipos' },
  { value: 'analyst', label: 'Analista', description: 'Enfocado en datos y análisis profundo' },
  { value: 'coach', label: 'Coach', description: 'Motivador y orientado al desarrollo' },
  { value: 'expert', label: 'Experto', description: 'Conocimiento técnico profundo' },
  { value: 'assistant', label: 'Asistente', description: 'Servicial y atento a las necesidades' },
  { value: 'guardian', label: 'Guardián', description: 'Protector y cuidadoso con los detalles' },
  { value: 'innovator', label: 'Innovador', description: 'Creativo y orientado a soluciones nuevas' }
];

const AVAILABLE_TRAITS = [
  'analytical', 'friendly', 'precise', 'creative', 'professional',
  'enthusiastic', 'technical', 'supportive', 'organized', 'diplomatic',
  'efficient', 'strategic', 'patient', 'proactive'
];

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Amigable' },
  { value: 'professional', label: 'Profesional' },
  { value: 'technical', label: 'Técnico' },
  { value: 'motivational', label: 'Motivacional' }
];

const VERBOSITY_OPTIONS = [
  { value: 'concise', label: 'Conciso' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'detailed', label: 'Detallado' },
  { value: 'comprehensive', label: 'Exhaustivo' }
];

export const GerenteGeneralPersonalityConfig: React.FC<GerenteGeneralPersonalityConfigProps> = ({
  config,
  onConfigChange,
  onSave,
  isSaving,
  isLoading
}) => {
  const [newTrait, setNewTrait] = React.useState<string>('');

  if (!config || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando configuración...</span>
      </div>
    );
  }

  const personality = config.personality || {
    archetype: 'coordinator',
    traits: [],
    communicationStyle: {
      tone: 'professional',
      verbosity: 'moderate',
      formality: 7,
      enthusiasm: 6,
      technicality: 6
    }
  };

  const handleAddTrait = () => {
    if (!newTrait) return;
    const currentTraits = personality.traits || [];
    if (currentTraits.some(t => t.trait === newTrait)) return;
    
    const updatedTraits = [...currentTraits, { trait: newTrait, intensity: 5 }];
    onConfigChange('personality', 'traits', updatedTraits);
    setNewTrait('');
  };

  const handleRemoveTrait = (traitToRemove: string) => {
    const updatedTraits = (personality.traits || []).filter(t => t.trait !== traitToRemove);
    onConfigChange('personality', 'traits', updatedTraits);
  };

  const handleTraitIntensityChange = (trait: string, intensity: number) => {
    const updatedTraits = (personality.traits || []).map(t => 
      t.trait === trait ? { ...t, intensity } : t
    );
    onConfigChange('personality', 'traits', updatedTraits);
  };

  const handleStyleChange = (key: string, value: any) => {
    const updatedStyle = {
      ...personality.communicationStyle,
      [key]: value
    };
    onConfigChange('personality', 'communicationStyle', updatedStyle);
  };

  // Verificar si no hay datos de personalidad configurados
  const hasNoData = !config.personality || 
    (!personality.archetype && (personality.traits || []).length === 0);

  return (
    <div className="space-y-6">
      {/* Alerta si no hay datos configurados */}
      {hasNoData && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Personalidad no configurada
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Para un mejor funcionamiento del Gerente General, usa el botón{' '}
                <strong>"Inicializar Datos"</strong> en la parte superior para cargar la configuración
                por defecto, o configura manualmente el arquetipo y rasgos de personalidad.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sección: Arquetipo */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="text-purple-500" size={20} />
          Arquetipo de Personalidad
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARCHETYPES.map((archetype) => (
            <button
              key={archetype.value}
              onClick={() => onConfigChange('personality', 'archetype', archetype.value)}
              disabled={isSaving}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                personality.archetype === archetype.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              } disabled:opacity-50`}
            >
              <span className="font-semibold text-gray-900 dark:text-white">{archetype.label}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{archetype.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sección: Rasgos de Personalidad */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} />
          Rasgos de Personalidad
        </h3>

        {/* Rasgos actuales */}
        <div className="space-y-3 mb-4">
          {(personality.traits || []).map((trait: PersonalityTrait) => (
            <div key={trait.trait} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-900 dark:text-white capitalize min-w-[120px]">
                {trait.trait}
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={trait.intensity}
                onChange={(e) => handleTraitIntensityChange(trait.trait, parseInt(e.target.value))}
                disabled={isSaving}
                className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-8 text-center">
                {trait.intensity}
              </span>
              <button
                onClick={() => handleRemoveTrait(trait.trait)}
                disabled={isSaving}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Agregar nuevo rasgo */}
        <div className="flex gap-2">
          <select
            value={newTrait}
            onChange={(e) => setNewTrait(e.target.value)}
            disabled={isSaving}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
          >
            <option value="">Seleccionar rasgo...</option>
            {AVAILABLE_TRAITS
              .filter(t => !(personality.traits || []).some((pt: PersonalityTrait) => pt.trait === t))
              .map(trait => (
                <option key={trait} value={trait} className="capitalize">{trait}</option>
              ))
            }
          </select>
          <button
            onClick={handleAddTrait}
            disabled={!newTrait || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </div>

      {/* Sección: Estilo de Comunicación */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="text-blue-500" size={20} />
          Estilo de Comunicación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tono
            </label>
            <select
              value={personality.communicationStyle?.tone || 'professional'}
              onChange={(e) => handleStyleChange('tone', e.target.value)}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            >
              {TONE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Verbosidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verbosidad
            </label>
            <select
              value={personality.communicationStyle?.verbosity || 'moderate'}
              onChange={(e) => handleStyleChange('verbosity', e.target.value)}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            >
              {VERBOSITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Formalidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formalidad
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Informal</span>
              <input
                type="range"
                min="1"
                max="10"
                value={personality.communicationStyle?.formality || 7}
                onChange={(e) => handleStyleChange('formality', parseInt(e.target.value))}
                disabled={isSaving}
                className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">Formal</span>
              <span className="w-8 text-center font-semibold text-gray-700 dark:text-gray-300">
                {personality.communicationStyle?.formality || 7}
              </span>
            </div>
          </div>

          {/* Entusiasmo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Entusiasmo
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Neutro</span>
              <input
                type="range"
                min="1"
                max="10"
                value={personality.communicationStyle?.enthusiasm || 6}
                onChange={(e) => handleStyleChange('enthusiasm', parseInt(e.target.value))}
                disabled={isSaving}
                className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">Entusiasta</span>
              <span className="w-8 text-center font-semibold text-gray-700 dark:text-gray-300">
                {personality.communicationStyle?.enthusiasm || 6}
              </span>
            </div>
          </div>

          {/* Tecnicidad */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nivel Técnico
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Simple</span>
              <input
                type="range"
                min="1"
                max="10"
                value={personality.communicationStyle?.technicality || 6}
                onChange={(e) => handleStyleChange('technicality', parseInt(e.target.value))}
                disabled={isSaving}
                className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">Técnico</span>
              <span className="w-8 text-center font-semibold text-gray-700 dark:text-gray-300">
                {personality.communicationStyle?.technicality || 6}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default GerenteGeneralPersonalityConfig;

