import React, { useState } from 'react';
import { 
  Terminal, 
  Variable, 
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Info,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Lightbulb,
  MessageSquare,
  Briefcase,
  DollarSign,
  Layers,
  TrendingUp
} from 'lucide-react';
import type { AgentConfigData } from '../../../services/agentConfigService';

interface ServicesAgentPromptConfigProps {
  config: AgentConfigData | null;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => Promise<void>;
  onReset: () => Promise<void>;
  isSaving: boolean;
}

interface PromptVariable {
  key: string;
  value: string;
}

export const ServicesAgentPromptConfig: React.FC<ServicesAgentPromptConfigProps> = ({
  config,
  onConfigChange,
  onSave: _onSave,
  onReset: _onReset,
  isSaving
}) => {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<string | null>(null);
  const [newVariable, setNewVariable] = useState<PromptVariable>({ key: '', value: '' });
  const [showAddVariable, setShowAddVariable] = useState(false);

  if (!config) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No hay configuración disponible
      </div>
    );
  }

  const promptConfig = config.promptConfig || {
    useCustomPrompts: false,
    customSystemPrompt: '',
    promptVariables: {},
    contextWindow: 15
  };

  const handlePromptConfigChange = (field: string, value: any) => {
    const updatedPromptConfig = {
      ...promptConfig,
      [field]: value
    };
    onConfigChange('promptConfig', 'promptConfig', updatedPromptConfig);
  };

  // Convertir Map/Object a array para renderizar
  const variablesArray: PromptVariable[] = Object.entries(promptConfig.promptVariables || {}).map(
    ([key, value]) => ({ key, value: value as string })
  );

  const handleAddVariable = () => {
    if (newVariable.key.trim() && newVariable.value.trim()) {
      const updatedVariables = {
        ...(promptConfig.promptVariables || {}),
        [newVariable.key.trim()]: newVariable.value.trim()
      };
      handlePromptConfigChange('promptVariables', updatedVariables);
      setNewVariable({ key: '', value: '' });
      setShowAddVariable(false);
    }
  };

  const handleUpdateVariable = (oldKey: string, newKey: string, newValue: string) => {
    const updatedVariables = { ...(promptConfig.promptVariables || {}) };
    
    if (oldKey !== newKey) {
      delete updatedVariables[oldKey];
    }
    updatedVariables[newKey] = newValue;
    
    handlePromptConfigChange('promptVariables', updatedVariables);
    setEditingVariable(null);
  };

  const handleDeleteVariable = (key: string) => {
    const updatedVariables = { ...(promptConfig.promptVariables || {}) };
    delete updatedVariables[key];
    handlePromptConfigChange('promptVariables', updatedVariables);
  };

  // Verificar si no hay datos de prompts configurados
  const hasNoData = !config.promptConfig || 
    (!promptConfig.customSystemPrompt && 
     Object.keys(promptConfig.promptVariables || {}).length === 0);

  // Prompt por defecto del ServicesAgent
  const defaultServicesPrompt = `Eres un ServicesAgent especializado en gestión inteligente de servicios profesionales y estrategias de pricing.

Tu rol es proporcionar asistencia experta en:
1. Análisis y optimización de portfolio de servicios
2. Estrategias de pricing y paquetización
3. Generación de contenido para servicios (descripciones, beneficios, características)
4. Recomendaciones personalizadas basadas en necesidades del cliente
5. Análisis de competencia y posicionamiento
6. Optimización de propuestas de valor

Mantén un enfoque consultivo y profesional. Proporciona recomendaciones basadas en mejores prácticas de la industria.
Adapta tus respuestas al contexto del negocio y las necesidades específicas del usuario.`;

  return (
    <div className="space-y-6">
      {/* Alerta si no hay datos configurados */}
      {hasNoData && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Prompts no configurados
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Configura un prompt personalizado para definir cómo el ServicesAgent debe comportarse
                al gestionar servicios, pricing y recomendaciones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Terminal className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configuración de Prompts de Servicios
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza los prompts del sistema para gestión de servicios y pricing
            </p>
          </div>
        </div>
      </div>

      {/* Services Capabilities Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="text-purple-600 dark:text-purple-400" size={16} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Portfolio</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Gestión de servicios</p>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="text-indigo-600 dark:text-indigo-400" size={16} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Pricing</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Estrategias de precios</p>
        </div>
        <div className="p-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="text-violet-600 dark:text-violet-400" size={16} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Paquetes</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Bundling inteligente</p>
        </div>
        <div className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-fuchsia-600 dark:text-fuchsia-400" size={16} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Análisis</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Optimización continua</p>
        </div>
      </div>

      {/* Toggle Usar Prompts Personalizados */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-purple-600 dark:text-purple-400" size={20} />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Usar Prompts Personalizados
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Activa esta opción para usar un prompt de sistema personalizado en lugar del predeterminado
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={promptConfig.useCustomPrompts ?? false}
              onChange={(e) => handlePromptConfigChange('useCustomPrompts', e.target.checked)}
            />
            <div className={`w-14 h-8 rounded-full transition-colors duration-200 ${
              promptConfig.useCustomPrompts ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-1 ${
                promptConfig.useCustomPrompts ? 'translate-x-7' : 'translate-x-1'
              }`}></div>
            </div>
          </label>
        </div>
      </div>

      {/* Prompt del Sistema */}
      <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50 bg-white dark:bg-gray-800' : ''
      }`}>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Terminal className="text-purple-600 dark:text-purple-400" size={18} />
            <span className="font-medium text-gray-900 dark:text-white">
              Prompt del Sistema de Servicios
            </span>
            {promptConfig.customSystemPrompt && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded">
                {promptConfig.customSystemPrompt.length} caracteres
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSystemPrompt(!showSystemPrompt)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={showSystemPrompt ? 'Ocultar prompt' : 'Mostrar prompt'}
            >
              {showSystemPrompt ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <div className="p-4">
          {showSystemPrompt ? (
            <textarea
              value={promptConfig.customSystemPrompt || ''}
              onChange={(e) => handlePromptConfigChange('customSystemPrompt', e.target.value)}
              placeholder={defaultServicesPrompt}
              className={`w-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-64'
              }`}
              disabled={isSaving}
            />
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <EyeOff className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm">Prompt oculto por seguridad</p>
              <button
                onClick={() => setShowSystemPrompt(true)}
                className="mt-2 text-purple-600 dark:text-purple-400 hover:underline text-sm"
              >
                Mostrar prompt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ventana de Contexto */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-indigo-600 dark:text-indigo-400" size={18} />
          <span className="font-medium text-gray-900 dark:text-white">Ventana de Contexto</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Mensajes de contexto</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {promptConfig.contextWindow || 15}
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={promptConfig.contextWindow || 15}
            onChange={(e) => handlePromptConfigChange('contextWindow', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            disabled={isSaving}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>5 (Mínimo)</span>
            <span>50 (Máximo)</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Para consultas de servicios complejas se recomienda un contexto moderado (10-20 mensajes).
        </p>
      </div>

      {/* Variables de Prompt */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Variable className="text-green-600 dark:text-green-400" size={18} />
            <span className="font-medium text-gray-900 dark:text-white">
              Variables de Contexto de Servicios
            </span>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
              {variablesArray.length} variables
            </span>
          </div>
          <button
            onClick={() => setShowAddVariable(!showAddVariable)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            disabled={isSaving}
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Info sobre variables */}
          <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <Info className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              Las variables se insertan automáticamente en el prompt usando la sintaxis{' '}
              <code className="bg-indigo-100 dark:bg-indigo-900 px-1 rounded">{'{{nombre_variable}}'}</code>.
              Útiles para personalizar el contexto de servicios y pricing.
            </p>
          </div>

          {/* Formulario para nueva variable */}
          {showAddVariable && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre de la variable
                  </label>
                  <input
                    type="text"
                    value={newVariable.key}
                    onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                    placeholder="ej: company_name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor
                  </label>
                  <input
                    type="text"
                    value={newVariable.value}
                    onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                    placeholder="ej: THADO Consulting"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddVariable(false);
                    setNewVariable({ key: '', value: '' });
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddVariable}
                  disabled={!newVariable.key.trim() || !newVariable.value.trim()}
                  className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar Variable
                </button>
              </div>
            </div>
          )}

          {/* Lista de variables existentes */}
          {variablesArray.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Variable className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm">No hay variables configuradas</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Agrega variables para personalizar el contexto de servicios
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {variablesArray.map((variable) => (
                <div
                  key={variable.key}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  {editingVariable === variable.key ? (
                    <EditVariableForm
                      variable={variable}
                      onSave={(newKey, newValue) => handleUpdateVariable(variable.key, newKey, newValue)}
                      onCancel={() => setEditingVariable(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <code className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                          {`{{${variable.key}}}`}
                        </code>
                        <span className="text-gray-600 dark:text-gray-400">=</span>
                        <span className="text-sm text-gray-900 dark:text-white">{variable.value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingVariable(variable.key)}
                          className="p-1.5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 rounded transition-colors"
                          disabled={isSaving}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteVariable(variable.key)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded transition-colors"
                          disabled={isSaving}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prompt Suggestions for Services */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="text-purple-600 dark:text-purple-400" size={18} />
          <span className="font-medium text-gray-900 dark:text-white">Sugerencias de Variables</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { key: 'company_name', desc: 'Nombre de la empresa' },
            { key: 'industry', desc: 'Industria/Sector' },
            { key: 'target_market', desc: 'Mercado objetivo' },
            { key: 'price_range', desc: 'Rango de precios' },
            { key: 'currency', desc: 'Moneda (USD, EUR, MXN)' },
            { key: 'service_focus', desc: 'Enfoque de servicios' },
            { key: 'competitive_advantage', desc: 'Ventaja competitiva' },
            { key: 'brand_voice', desc: 'Voz de marca' }
          ].map((suggestion) => (
            <button
              key={suggestion.key}
              onClick={() => {
                if (!variablesArray.some(v => v.key === suggestion.key)) {
                  setNewVariable({ key: suggestion.key, value: '' });
                  setShowAddVariable(true);
                }
              }}
              disabled={variablesArray.some(v => v.key === suggestion.key)}
              className={`p-2 text-left text-xs rounded-lg transition-colors ${
                variablesArray.some(v => v.key === suggestion.key)
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300'
              }`}
            >
              <code className="text-purple-600 dark:text-purple-400">{suggestion.key}</code>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">{suggestion.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para editar variables
interface EditVariableFormProps {
  variable: PromptVariable;
  onSave: (newKey: string, newValue: string) => void;
  onCancel: () => void;
}

const EditVariableForm: React.FC<EditVariableFormProps> = ({ variable, onSave, onCancel }) => {
  const [editKey, setEditKey] = useState(variable.key);
  const [editValue, setEditValue] = useState(variable.value);

  return (
    <div className="flex items-center gap-2 flex-1">
      <input
        type="text"
        value={editKey}
        onChange={(e) => setEditKey(e.target.value)}
        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
      />
      <span className="text-gray-400">=</span>
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={() => onSave(editKey, editValue)}
        className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400"
      >
        <Check size={14} />
      </button>
      <button
        onClick={onCancel}
        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ServicesAgentPromptConfig;
