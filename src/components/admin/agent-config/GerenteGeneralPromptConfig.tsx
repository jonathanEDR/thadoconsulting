import React, { useState } from 'react';
import { 
  Terminal, 
  Code, 
  Variable, 
  Save,
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
  Lightbulb
} from 'lucide-react';
import type { GerenteGeneralConfigData } from '../../../services/gerenteGeneralService';

interface GerenteGeneralPromptConfigProps {
  config: GerenteGeneralConfigData | null;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
}

interface PromptVariable {
  key: string;
  value: string;
}

export const GerenteGeneralPromptConfig: React.FC<GerenteGeneralPromptConfigProps> = ({
  config,
  onConfigChange,
  onSave,
  isSaving,
  isLoading
}) => {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<string | null>(null);
  const [newVariable, setNewVariable] = useState<PromptVariable>({ key: '', value: '' });
  const [showAddVariable, setShowAddVariable] = useState(false);

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

  const promptConfig = config.promptConfig || {
    useCustomPrompts: false,
    customSystemPrompt: '',
    promptVariables: {},
    contextWindow: 10
  };

  const handlePromptConfigChange = (field: string, value: any) => {
    onConfigChange('promptConfig', field, value);
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
                Para un mejor funcionamiento del Gerente General, usa el botón{' '}
                <strong>"Inicializar Datos"</strong> en la parte superior para cargar la configuración
                por defecto, o configura manualmente los prompts del sistema.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Terminal className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configuración de Prompts
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza los prompts del sistema y variables de contexto
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Activar prompts personalizados */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Code className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Usar Prompts Personalizados
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Activa esta opción para usar un prompt de sistema personalizado en lugar del predeterminado
              </div>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={promptConfig.useCustomPrompts ?? false}
              onChange={(e) => handlePromptConfigChange('useCustomPrompts', e.target.checked)}
              className="sr-only"
            />
            <div className={`w-14 h-7 rounded-full transition-colors ${
              promptConfig.useCustomPrompts ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                promptConfig.useCustomPrompts ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </div>
          </div>
        </label>
      </div>

      {/* Custom System Prompt */}
      {promptConfig.useCustomPrompts && (
        <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 bg-white dark:bg-gray-800' : ''
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="text-indigo-600 dark:text-indigo-400" size={20} />
              <h4 className="font-medium text-gray-900 dark:text-white">Prompt del Sistema Personalizado</h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={showSystemPrompt ? 'Ocultar prompt' : 'Mostrar prompt'}
              >
                {showSystemPrompt ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isFullscreen ? 'Minimizar' : 'Pantalla completa'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
          
          {showSystemPrompt && (
            <textarea
              value={promptConfig.customSystemPrompt || ''}
              onChange={(e) => handlePromptConfigChange('customSystemPrompt', e.target.value)}
              placeholder="Escribe aquí el prompt del sistema personalizado...

Ejemplo:
Eres el Gerente General de THADO, un coordinador inteligente de agentes especializados.
Tu rol es analizar las consultas de los usuarios y delegarlas al agente más apropiado.

Variables disponibles:
{{companyName}} - Nombre de la empresa
{{userName}} - Nombre del usuario
{{currentDate}} - Fecha actual"
              className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none ${
                isFullscreen ? 'h-[calc(100%-120px)]' : 'h-64'
              }`}
            />
          )}
          
          {!showSystemPrompt && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Eye className="mx-auto mb-2 opacity-50" size={32} />
              <p>Prompt oculto por seguridad</p>
              <button
                onClick={() => setShowSystemPrompt(true)}
                className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Mostrar contenido
              </button>
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {promptConfig.customSystemPrompt?.length || 0} caracteres
          </div>
        </div>
      )}

      {/* Context Window */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Code className="text-blue-600 dark:text-blue-400" size={20} />
          <h4 className="font-medium text-gray-900 dark:text-white">Ventana de Contexto</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mensajes de contexto
              </label>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {promptConfig.contextWindow || 10}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              value={promptConfig.contextWindow || 10}
              onChange={(e) => handlePromptConfigChange('contextWindow', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>5 (Mínimo)</span>
              <span>50 (Máximo)</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cantidad de mensajes anteriores que se incluyen como contexto en cada interacción.
            Más mensajes = mejor contexto pero mayor costo de tokens.
          </p>
        </div>
      </div>

      {/* Variables de Prompt */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Variable className="text-green-600 dark:text-green-400" size={20} />
            <h4 className="font-medium text-gray-900 dark:text-white">Variables de Prompt</h4>
          </div>
          <button
            onClick={() => setShowAddVariable(true)}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Define variables personalizadas que se reemplazarán en los prompts usando la sintaxis {'{{variable}}'}.
        </p>

        {/* Formulario agregar variable */}
        {showAddVariable && (
          <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-green-500 border-dashed">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Nombre de variable
                </label>
                <input
                  type="text"
                  value={newVariable.key}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="nombreVariable"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Valor
                </label>
                <input
                  type="text"
                  value={newVariable.value}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Valor de la variable"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddVariable(false);
                  setNewVariable({ key: '', value: '' });
                }}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddVariable}
                disabled={!newVariable.key.trim() || !newVariable.value.trim()}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <Check size={14} />
                Agregar
              </button>
            </div>
          </div>
        )}

        {/* Lista de variables */}
        {variablesArray.length > 0 ? (
          <div className="space-y-2">
            {variablesArray.map((variable) => (
              <VariableItem
                key={variable.key}
                variable={variable}
                isEditing={editingVariable === variable.key}
                onEdit={() => setEditingVariable(variable.key)}
                onSave={(newKey, newValue) => handleUpdateVariable(variable.key, newKey, newValue)}
                onCancel={() => setEditingVariable(null)}
                onDelete={() => handleDeleteVariable(variable.key)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Variable className="mx-auto mb-2 opacity-50" size={32} />
            <p>No hay variables definidas</p>
            <p className="text-sm">Las variables se reemplazan en los prompts automáticamente</p>
          </div>
        )}
      </div>

      {/* Información */}
      <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <Info className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-indigo-800 dark:text-indigo-200">
          <p className="font-medium mb-1">Configuración avanzada de prompts</p>
          <p>
            Los prompts personalizados te permiten controlar exactamente cómo se comporta el Gerente General.
            Las variables definidas aquí se sustituyen automáticamente en el prompt del sistema usando
            la sintaxis <code className="bg-indigo-100 dark:bg-indigo-800 px-1 rounded">{'{{nombreVariable}}'}</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente para cada variable
interface VariableItemProps {
  variable: PromptVariable;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (newKey: string, newValue: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  const [editKey, setEditKey] = useState(variable.key);
  const [editValue, setEditValue] = useState(variable.value);

  if (isEditing) {
    return (
      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border-2 border-blue-500">
        <div className="grid grid-cols-2 gap-3 mb-2">
          <input
            type="text"
            value={editKey}
            onChange={(e) => setEditKey(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
          />
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
          <button
            onClick={() => onSave(editKey, editValue)}
            className="p-1.5 text-green-600 hover:text-green-700"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-4">
        <code className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm font-mono">
          {`{{${variable.key}}}`}
        </code>
        <span className="text-gray-600 dark:text-gray-300">=</span>
        <span className="text-gray-900 dark:text-white">{variable.value}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default GerenteGeneralPromptConfig;

