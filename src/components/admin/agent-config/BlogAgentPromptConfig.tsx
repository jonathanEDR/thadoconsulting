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
  MessageSquare
} from 'lucide-react';
import type { AgentConfigData } from '../../../services/agentConfigService';

interface BlogAgentPromptConfigProps {
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

export const BlogAgentPromptConfig: React.FC<BlogAgentPromptConfigProps> = ({
  config,
  onConfigChange,
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
    contextWindow: 10
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

  // Prompt por defecto del BlogAgent
  const defaultBlogPrompt = `Eres un asistente de IA especializado en creación y optimización de contenido de blog. 
Tu rol es ayudar a los usuarios a:
1. Generar títulos atractivos y optimizados para SEO
2. Crear estructuras de contenido efectivas
3. Optimizar meta descripciones y etiquetas
4. Sugerir palabras clave relevantes
5. Mejorar la legibilidad del contenido

Siempre mantén un tono profesional pero accesible, y prioriza las mejores prácticas de SEO.`;

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
                Configura un prompt personalizado para definir cómo el BlogAgent debe comportarse
                al generar y optimizar contenido.
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
              Configuración de Prompts
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza los prompts del sistema para el BlogAgent
            </p>
          </div>
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
              Prompt del Sistema Personalizado
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
              placeholder={defaultBlogPrompt}
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
          <MessageSquare className="text-blue-600 dark:text-blue-400" size={18} />
          <span className="font-medium text-gray-900 dark:text-white">Ventana de Contexto</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Mensajes de contexto</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {promptConfig.contextWindow || 10}
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={promptConfig.contextWindow || 10}
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
          Cantidad de mensajes anteriores que se incluyen en contexto en cada interacción. Más mensajes = mejor contexto pero mayor costo de tokens.
        </p>
      </div>

      {/* Variables de Prompt */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Variable className="text-green-600 dark:text-green-400" size={18} />
            <span className="font-medium text-gray-900 dark:text-white">
              Variables de Contexto
            </span>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
              {variablesArray.length} variables
            </span>
          </div>
          <button
            onClick={() => setShowAddVariable(!showAddVariable)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            disabled={isSaving}
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Info sobre variables */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Las variables se insertan automáticamente en el prompt usando la sintaxis{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{'{{nombre_variable}}'}</code>.
              Útiles para personalizar el contexto del blog.
            </p>
          </div>

          {/* Formulario para nueva variable */}
          {showAddVariable && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Nombre de variable"
                  value={newVariable.key}
                  onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Valor"
                  value={newVariable.value}
                  onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddVariable(false);
                    setNewVariable({ key: '', value: '' });
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddVariable}
                  className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  disabled={!newVariable.key.trim() || !newVariable.value.trim()}
                >
                  Guardar Variable
                </button>
              </div>
            </div>
          )}

          {/* Lista de variables */}
          {variablesArray.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Variable className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm">No hay variables configuradas</p>
              <p className="text-xs mt-1">
                Agrega variables para personalizar el contexto del BlogAgent
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {variablesArray.map(({ key, value }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  {editingVariable === key ? (
                    <EditVariableForm
                      initialKey={key}
                      initialValue={value}
                      onSave={(newKey, newValue) => handleUpdateVariable(key, newKey, newValue)}
                      onCancel={() => setEditingVariable(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <code className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm">
                          {`{{${key}}}`}
                        </code>
                        <span className="text-gray-600 dark:text-gray-400 text-sm truncate max-w-xs">
                          {value}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingVariable(key)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                          disabled={isSaving}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteVariable(key)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded"
                          disabled={isSaving}
                        >
                          <Trash2 size={16} />
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

      {/* Variables Sugeridas para Blog */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
          <Lightbulb size={18} />
          Variables Sugeridas para Blog
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white dark:bg-gray-800 rounded border border-purple-100 dark:border-purple-900">
            <code className="text-purple-600 dark:text-purple-400">{'{{blog_nombre}}'}</code>
            <p className="text-xs text-gray-500 mt-1">Nombre del blog</p>
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 rounded border border-purple-100 dark:border-purple-900">
            <code className="text-purple-600 dark:text-purple-400">{'{{industria}}'}</code>
            <p className="text-xs text-gray-500 mt-1">Industria o nicho</p>
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 rounded border border-purple-100 dark:border-purple-900">
            <code className="text-purple-600 dark:text-purple-400">{'{{tono}}'}</code>
            <p className="text-xs text-gray-500 mt-1">Tono de escritura</p>
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 rounded border border-purple-100 dark:border-purple-900">
            <code className="text-purple-600 dark:text-purple-400">{'{{audiencia}}'}</code>
            <p className="text-xs text-gray-500 mt-1">Audiencia objetivo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para editar una variable existente
const EditVariableForm: React.FC<{
  initialKey: string;
  initialValue: string;
  onSave: (key: string, value: string) => void;
  onCancel: () => void;
}> = ({ initialKey, initialValue, onSave, onCancel }) => {
  const [key, setKey] = useState(initialKey);
  const [value, setValue] = useState(initialValue);

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="flex-1 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm"
      />
      <button
        onClick={() => onSave(key, value)}
        className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
      >
        <Check size={16} />
      </button>
      <button
        onClick={onCancel}
        className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default BlogAgentPromptConfig;
