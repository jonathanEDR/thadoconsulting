import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  BookOpen,
  Target,
  Zap,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { agentConfigService } from '../../services/agentConfigService';

interface TrainingExample {
  id: string;
  input: string;
  expectedOutput: string;
  category: 'seo' | 'tags' | 'analysis' | 'improvement' | 'general';
  notes?: string;
}

interface TaskPrompt {
  taskType: string;
  systemPrompt: string;
  userPromptTemplate: string;
  temperature: number;
  examples: string[];
}

interface TrainingConfig {
  examples: TrainingExample[];
  taskPrompts: TaskPrompt[];
  behaviorRules: string[];
  specialInstructions: string;
  learningMode: 'conservative' | 'balanced' | 'aggressive';
}

const BlogAgentTraining: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'examples' | 'prompts' | 'behavior' | 'testing'>('examples');
  
  // Estado de entrenamiento
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    examples: [],
    taskPrompts: [],
    behaviorRules: [],
    specialInstructions: '',
    learningMode: 'balanced'
  });

  // Estado para nuevo ejemplo
  const [newExample, setNewExample] = useState<Omit<TrainingExample, 'id'>>({
    input: '',
    expectedOutput: '',
    category: 'general',
    notes: ''
  });

  // Estado para nuevo prompt de tarea
  const [newTaskPrompt, setNewTaskPrompt] = useState<TaskPrompt>({
    taskType: '',
    systemPrompt: '',
    userPromptTemplate: '',
    temperature: 0.7,
    examples: []
  });

  // Estado para testing
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  // Estado para tarjetas colapsables (accordion)
  const [expandedCard, setExpandedCard] = useState<string | null>('seo_analysis'); // Primer tarjeta abierta por defecto

  useEffect(() => {
    loadTrainingConfig();
  }, []);

  const loadTrainingConfig = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading training configuration...');
      
      const response = await agentConfigService.getConfig('blog');
      console.log('📡 Response from API:', response);
      
      if (response.success && response.data) {
        // Extraer configuración de entrenamiento existente
        const existingTraining = (response.data as any).trainingConfig || {
          examples: [],
          taskPrompts: [],
          behaviorRules: [],
          specialInstructions: '',
          learningMode: 'balanced' as 'conservative' | 'balanced' | 'aggressive'
        };
        
        setTrainingConfig(existingTraining);
        
        // Mostrar información sobre datos cargados
        const hasData = {
          examples: existingTraining.examples?.length > 0,
          taskPrompts: existingTraining.taskPrompts?.length > 0,
          behaviorRules: existingTraining.behaviorRules?.length > 0
        };

        if (hasData.examples || hasData.taskPrompts || hasData.behaviorRules) {
          const loadedItems = [];
          if (hasData.examples) loadedItems.push(`${existingTraining.examples.length} ejemplos`);
          if (hasData.taskPrompts) loadedItems.push(`${existingTraining.taskPrompts.length} prompts profesionales`);
          if (hasData.behaviorRules) loadedItems.push(`${existingTraining.behaviorRules.length} reglas de comportamiento`);
          
          showMessage('success', `✅ Configuración cargada: ${loadedItems.join(', ')}`);
        } else {
          showMessage('success', '📋 Sistema inicializado. Los datos se crearán automáticamente cuando sea necesario.');
        }
      } else {
        console.warn('⚠️ No training config in response');
        showMessage('error', 'No se encontró configuración de entrenamiento');
      }
    } catch (error) {
      console.error('❌ Error loading training config:', error);
      showMessage('error', 'Error al cargar configuración de entrenamiento');
    } finally {
      setLoading(false);
    }
  };

  const saveTrainingConfig = async () => {
    try {
      setSaving(true);
      
      // Obtener configuración actual
      const currentConfig = await agentConfigService.getConfig('blog');
      
      // Actualizar con nueva configuración de entrenamiento
      await agentConfigService.updateConfig('blog', {
        ...currentConfig,
        trainingConfig: trainingConfig
      });
      
      showMessage('success', '✅ Configuración de entrenamiento guardada correctamente');
    } catch (error) {
      console.error('Error saving training config:', error);
      showMessage('error', 'Error al guardar configuración de entrenamiento');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Gestión de ejemplos de entrenamiento
  const addExample = () => {
    if (!newExample.input || !newExample.expectedOutput) {
      showMessage('error', 'Completa los campos de entrada y salida esperada');
      return;
    }

    const example: TrainingExample = {
      ...newExample,
      id: Date.now().toString()
    };

    setTrainingConfig(prev => ({
      ...prev,
      examples: [...prev.examples, example]
    }));

    // Reset form
    setNewExample({
      input: '',
      expectedOutput: '',
      category: 'general',
      notes: ''
    });

    showMessage('success', 'Ejemplo agregado correctamente');
  };

  const removeExample = (id: string) => {
    setTrainingConfig(prev => ({
      ...prev,
      examples: prev.examples.filter(ex => ex.id !== id)
    }));
  };

  // Gestión de prompts por tarea
  const addTaskPrompt = () => {
    if (!newTaskPrompt.taskType || !newTaskPrompt.systemPrompt) {
      showMessage('error', 'Completa el tipo de tarea y el system prompt');
      return;
    }

    // Verificar que no exista ya ese tipo de tarea
    const exists = trainingConfig.taskPrompts.some(tp => tp.taskType === newTaskPrompt.taskType);
    if (exists) {
      showMessage('error', 'Ya existe un prompt para ese tipo de tarea');
      return;
    }

    setTrainingConfig(prev => ({
      ...prev,
      taskPrompts: [...prev.taskPrompts, { ...newTaskPrompt }]
    }));

    // Reset form
    setNewTaskPrompt({
      taskType: '',
      systemPrompt: '',
      userPromptTemplate: '',
      temperature: 0.7,
      examples: []
    });

    showMessage('success', 'Prompt de tarea agregado correctamente');
  };

  const removeTaskPrompt = (taskType: string) => {
    setTrainingConfig(prev => ({
      ...prev,
      taskPrompts: prev.taskPrompts.filter(tp => tp.taskType !== taskType)
    }));
    showMessage('success', 'Prompt de tarea eliminado');
  };

  // Gestión de reglas de comportamiento
  const addBehaviorRule = () => {
    const rule = prompt('Ingresa una regla de comportamiento:');
    if (rule) {
      setTrainingConfig(prev => ({
        ...prev,
        behaviorRules: [...prev.behaviorRules, rule]
      }));
    }
  };

  const removeBehaviorRule = (index: number) => {
    setTrainingConfig(prev => ({
      ...prev,
      behaviorRules: prev.behaviorRules.filter((_, i) => i !== index)
    }));
  };

  // Testing del agente
  const testAgent = async () => {
    if (!testInput) {
      showMessage('error', 'Ingresa un texto para probar');
      return;
    }

    try {
      setTestLoading(true);
      // Aquí iría la llamada al endpoint de testing del agente
      // Por ahora simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestOutput('Respuesta simulada del agente basada en el entrenamiento actual...');
    } catch (error) {
      showMessage('error', 'Error al probar el agente');
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">Cargando configuración de entrenamiento...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/ai-agents')}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Panel Central
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mr-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entrenamiento del BlogAgent</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Personaliza el comportamiento y respuestas del agente con ejemplos y configuración avanzada</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => loadTrainingConfig()}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Resetear
                </button>
                <button
                  onClick={saveTrainingConfig}
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Guardar Entrenamiento
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={() => setActiveTab('examples')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center ${
                activeTab === 'examples'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Ejemplos de Entrenamiento
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center ${
                activeTab === 'prompts'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Prompts por Tarea
            </button>
            <button
              onClick={() => setActiveTab('behavior')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center ${
                activeTab === 'behavior'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Target className="w-5 h-5 mr-2" />
              Reglas de Comportamiento
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center ${
                activeTab === 'testing'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Zap className="w-5 h-5 mr-2" />
              Probar Agente
            </button>
          </div>

          <div className="p-8">
            {/* Tab: Ejemplos de Entrenamiento */}
            {activeTab === 'examples' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 ¿Qué son los ejemplos de entrenamiento?</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Los ejemplos de entrenamiento enseñan al agente cómo responder en situaciones específicas.
                    Usa "few-shot learning" para mejorar la calidad y consistencia de las respuestas.
                  </p>
                </div>

                {/* Formulario para nuevo ejemplo */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Agregar Nuevo Ejemplo
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoría
                      </label>
                      <select
                        value={newExample.category}
                        onChange={(e) => setNewExample(prev => ({
                          ...prev,
                          category: e.target.value as TrainingExample['category']
                        }))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="general">General</option>
                        <option value="seo">Optimización SEO</option>
                        <option value="tags">Generación de Tags</option>
                        <option value="analysis">Análisis de Contenido</option>
                        <option value="improvement">Mejoras de Contenido</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Entrada del Usuario (Input)
                      </label>
                      <textarea
                        value={newExample.input}
                        onChange={(e) => setNewExample(prev => ({ ...prev, input: e.target.value }))}
                        placeholder="Ej: Analiza este post sobre React y sugiere mejoras SEO..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Salida Esperada (Expected Output)
                      </label>
                      <textarea
                        value={newExample.expectedOutput}
                        onChange={(e) => setNewExample(prev => ({ ...prev, expectedOutput: e.target.value }))}
                        placeholder="Ej: He analizado el contenido sobre React. Aquí están las mejoras SEO sugeridas:
1. Agregar keywords relacionadas...
2. Mejorar la meta descripción..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notas (Opcional)
                      </label>
                      <input
                        type="text"
                        value={newExample.notes}
                        onChange={(e) => setNewExample(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Contexto adicional sobre este ejemplo..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={addExample}
                      className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Agregar Ejemplo
                    </button>
                  </div>
                </div>

                {/* Lista de ejemplos existentes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Ejemplos Guardados ({trainingConfig.examples.length})
                    </h3>
                    {trainingConfig.examples.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                        Activo
                      </span>
                    )}
                  </div>

                  {trainingConfig.examples.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No hay ejemplos de entrenamiento aún</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Agrega ejemplos para mejorar las respuestas del agente</p>
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          💡 <strong>Tip:</strong> Los ejemplos se crearán automáticamente cuando el sistema lo detecte necesario
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trainingConfig.examples.map((example) => (
                        <div key={example.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                              {example.category}
                            </span>
                            <button
                              onClick={() => removeExample(example.id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📥 Input:</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                                {example.input}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📤 Output Esperado:</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                                {example.expectedOutput}
                              </p>
                            </div>

                            {example.notes && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📝 Notas:</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">{example.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Prompts por Tarea */}
            {activeTab === 'prompts' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 ¿Qué son los prompts por tarea?</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Define system prompts personalizados para diferentes tipos de tareas (SEO, análisis, tags, etc.).
                    Esto permite que el agente use instrucciones específicas según lo que necesites.
                  </p>
                </div>

                {/* Formulario para nuevo prompt de tarea */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Agregar Prompt por Tarea
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tipo de Tarea
                        </label>
                        <select
                          value={newTaskPrompt.taskType}
                          onChange={(e) => setNewTaskPrompt(prev => ({
                            ...prev,
                            taskType: e.target.value
                          }))}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="">Selecciona tipo de tarea</option>
                          <option value="seo_analysis">Análisis SEO</option>
                          <option value="tag_generation">Generación de Tags</option>
                          <option value="content_analysis">Análisis de Contenido</option>
                          <option value="content_improvement">Mejora de Contenido</option>
                          <option value="keyword_research">Investigación de Keywords</option>
                          <option value="content_strategy">Estrategia de Contenido</option>
                          <option value="performance_analysis">Análisis de Rendimiento</option>
                          <option value="custom">Personalizado</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Temperatura (Creatividad)
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={newTaskPrompt.temperature}
                            onChange={(e) => setNewTaskPrompt(prev => ({
                              ...prev,
                              temperature: parseFloat(e.target.value)
                            }))}
                            className="flex-1 accent-indigo-600"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                            {newTaskPrompt.temperature}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          0.0 = Preciso, 1.0 = Creativo
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        System Prompt Personalizado
                      </label>
                      <textarea
                        value={newTaskPrompt.systemPrompt}
                        onChange={(e) => setNewTaskPrompt(prev => ({
                          ...prev,
                          systemPrompt: e.target.value
                        }))}
                        placeholder="Ej: Eres un especialista en SEO técnico. Tu trabajo es analizar contenido y proporcionar recomendaciones específicas para mejorar el ranking en buscadores..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Template de Prompt de Usuario (Opcional)
                      </label>
                      <textarea
                        value={newTaskPrompt.userPromptTemplate}
                        onChange={(e) => setNewTaskPrompt(prev => ({
                          ...prev,
                          userPromptTemplate: e.target.value
                        }))}
                        placeholder="Ej: Analiza el siguiente contenido: {content}
Enfócate en: {focus_areas}
Proporciona: {deliverables}"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[80px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Usa {'{variables}'} para campos dinámicos
                      </p>
                    </div>

                    <button
                      onClick={addTaskPrompt}
                      disabled={!newTaskPrompt.taskType || !newTaskPrompt.systemPrompt}
                      className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Agregar Prompt de Tarea
                    </button>
                  </div>
                </div>

                {/* Prompts por Tarea - Accordion */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Prompts Profesionales Configurados
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {trainingConfig.taskPrompts.length > 0 
                          ? `${trainingConfig.taskPrompts.length} prompts especializados disponibles`
                          : 'Los prompts se inicializarán automáticamente'
                        }
                      </p>
                    </div>
                    {trainingConfig.taskPrompts.length > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Activo
                      </span>
                    )}
                  </div>

                  {trainingConfig.taskPrompts.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                      <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Sistema Preparado</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Los prompts profesionales se inicializarán automáticamente cuando sea necesario</p>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center justify-center space-x-4 text-sm text-blue-700 dark:text-blue-300">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            SEO Analysis
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            Content Improvement
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                            Tag Generation
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                            Content Strategy
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {trainingConfig.taskPrompts.map((taskPrompt, index) => {
                        const isExpanded = expandedCard === taskPrompt.taskType;
                        const promptIcons = {
                          'seo_analysis': '🔍',
                          'content_improvement': '✨', 
                          'tag_generation': '🏷️',
                          'content_strategy': '📊'
                        };
                        const promptColors = {
                          'seo_analysis': 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
                          'content_improvement': 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800', 
                          'tag_generation': 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
                          'content_strategy': 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
                        };
                        const badgeColors = {
                          'seo_analysis': 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
                          'content_improvement': 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300', 
                          'tag_generation': 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
                          'content_strategy': 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
                        };

                        return (
                          <div 
                            key={index} 
                            className={`border rounded-xl transition-all duration-200 ${
                              isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                            } ${promptColors[taskPrompt.taskType as keyof typeof promptColors] || 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                          >
                            {/* Header colapsable */}
                            <div 
                              className="p-5 cursor-pointer flex items-center justify-between"
                              onClick={() => setExpandedCard(isExpanded ? null : taskPrompt.taskType)}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="text-2xl">
                                  {promptIcons[taskPrompt.taskType as keyof typeof promptIcons] || '⚙️'}
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                    {taskPrompt.taskType.replace(/_/g, ' ')}
                                  </h4>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                      badgeColors[taskPrompt.taskType as keyof typeof badgeColors] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}>
                                      Temp: {taskPrompt.temperature}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {taskPrompt.systemPrompt.length} caracteres
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeTaskPrompt(taskPrompt.taskType);
                                  }}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar prompt"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="text-gray-400">
                                  {isExpanded ? (
                                    <ChevronDown className="w-5 h-5" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Contenido expandible */}
                            {isExpanded && (
                              <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* System Prompt */}
                                  <div>
                                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                      🎯 System Prompt
                                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                                        ({taskPrompt.systemPrompt.length} chars)
                                      </span>
                                    </h5>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                                        {taskPrompt.systemPrompt}
                                      </pre>
                                    </div>
                                  </div>

                                  {/* User Template */}
                                  {taskPrompt.userPromptTemplate && (
                                    <div>
                                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                        📝 Template de Usuario
                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                                          ({taskPrompt.userPromptTemplate.length} chars)
                                        </span>
                                      </h5>
                                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                                        <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                          {taskPrompt.userPromptTemplate}
                                        </pre>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Variables detectadas */}
                                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2">🔧 Variables Detectadas:</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {(taskPrompt.userPromptTemplate?.match(/\{[^}]+\}/g) || []).map((variable, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs border border-blue-200 dark:border-blue-800 font-mono">
                                        {variable}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Prompts predefinidos recomendados */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Prompts Predefinidos Recomendados
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setNewTaskPrompt({
                        taskType: 'seo_analysis',
                        systemPrompt: 'Eres un especialista en SEO técnico con 10+ años de experiencia. Tu trabajo es analizar contenido web y proporcionar recomendaciones específicas y accionables para mejorar el ranking en buscadores. Siempre incluye métricas cuantificables, keywords específicas, y un score SEO estimado.',
                        userPromptTemplate: 'Analiza el siguiente contenido para SEO:\n\nTítulo: {title}\nContenido: {content}\n\nProporciona:\n1. Análisis de keywords\n2. Mejoras de estructura\n3. Score SEO actual y proyectado\n4. Recomendaciones específicas',
                        temperature: 0.3,
                        examples: []
                      })}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">🔍 Análisis SEO Avanzado</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Especialista en optimización técnica con métricas</p>
                    </button>

                    <button
                      onClick={() => setNewTaskPrompt({
                        taskType: 'content_improvement',
                        systemPrompt: 'Eres un especialista en content marketing y engagement. Tu misión es revisar contenido existente y proporcionar mejoras específicas para aumentar el engagement, legibilidad y conversión. Siempre proporciona mejoras accionables con impacto estimado.',
                        userPromptTemplate: 'Mejora este contenido para mayor engagement:\n\nContenido actual: {content}\nAudiencia objetivo: {audience}\nObjetivo: {goal}\n\nProporciona:\n1. Mejoras de estructura\n2. Optimizaciones de engagement\n3. Elementos visuales sugeridos\n4. Impacto estimado',
                        temperature: 0.7,
                        examples: []
                      })}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">✨ Mejora de Engagement</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Optimización para mayor interacción y conversión</p>
                    </button>

                    <button
                      onClick={() => setNewTaskPrompt({
                        taskType: 'tag_generation',
                        systemPrompt: 'Eres un especialista en taxonomía de contenido y SEO. Generas tags estratégicos balanceando popularidad con especificidad. Siempre categorizas los tags por relevancia y proporcionas justificación de la selección.',
                        userPromptTemplate: 'Genera tags estratégicos para:\n\nTema: {topic}\nContenido: {content}\nAudiencia: {audience}\n\nProporciona:\n1. Tags principales (alta relevancia)\n2. Tags secundarios (contexto)\n3. Tags de nicho (long-tail SEO)\n4. Justificación de selección',
                        temperature: 0.5,
                        examples: []
                      })}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">🏷️ Generación de Tags Estratégicos</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tags balanceados para SEO y categorización</p>
                    </button>

                    <button
                      onClick={() => setNewTaskPrompt({
                        taskType: 'content_strategy',
                        systemPrompt: 'Eres un estratega de contenido senior especializado en tecnología. Tu trabajo es crear planes de contenido que equilibren valor técnico con engagement. Siempre consideras SEO, audiencia objetivo, y tendencias del mercado.',
                        userPromptTemplate: 'Crea una estrategia de contenido para:\n\nTema/Producto: {topic}\nAudiencia: {audience}\nObjetivos: {goals}\nCompetencia: {competition}\n\nProporciona:\n1. Pilares de contenido\n2. Calendario editorial\n3. Tipos de contenido recomendados\n4. KPIs a medir',
                        temperature: 0.8,
                        examples: []
                      })}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">📊 Estrategia de Contenido</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Planificación estratégica para máximo impacto</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reglas de Comportamiento */}
            {activeTab === 'behavior' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 ¿Qué son las reglas de comportamiento?</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Define reglas que el agente SIEMPRE debe seguir. Estas reglas tienen prioridad sobre otras instrucciones.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Reglas Activas ({trainingConfig.behaviorRules.length})
                    </h3>
                    <button
                      onClick={addBehaviorRule}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Regla
                    </button>
                  </div>

                  {trainingConfig.behaviorRules.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <Target className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No hay reglas de comportamiento definidas</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {trainingConfig.behaviorRules.map((rule, index) => (
                        <li key={index} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300 flex-1">{rule}</span>
                          <button
                            onClick={() => removeBehaviorRule(index)}
                            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instrucciones Especiales
                  </label>
                  <textarea
                    value={trainingConfig.specialInstructions}
                    onChange={(e) => setTrainingConfig(prev => ({
                      ...prev,
                      specialInstructions: e.target.value
                    }))}
                    placeholder="Instrucciones adicionales que el agente debe considerar siempre..."
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modo de Aprendizaje
                  </label>
                  <select
                    value={trainingConfig.learningMode}
                    onChange={(e) => setTrainingConfig(prev => ({
                      ...prev,
                      learningMode: e.target.value as 'conservative' | 'balanced' | 'aggressive'
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="conservative">Conservador (Más predecible, menos creativo)</option>
                    <option value="balanced">Balanceado (Equilibrio entre creatividad y precisión)</option>
                    <option value="aggressive">Agresivo (Más creativo, menos predecible)</option>
                  </select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {trainingConfig.learningMode === 'conservative' && 'El agente priorizará respuestas consistentes y probadas'}
                    {trainingConfig.learningMode === 'balanced' && 'El agente equilibrará creatividad con consistencia'}
                    {trainingConfig.learningMode === 'aggressive' && 'El agente explorará soluciones más creativas e innovadoras'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Testing */}
            {activeTab === 'testing' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Prueba tu agente entrenado</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Prueba cómo responde el agente con la configuración de entrenamiento actual.
                    Esto te ayuda a validar si los ejemplos y reglas funcionan como esperas.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Input de Prueba
                    </label>
                    <textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Escribe una consulta para probar el agente..."
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[200px]"
                    />
                    <button
                      onClick={testAgent}
                      disabled={testLoading || !testInput}
                      className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Probar Agente
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Respuesta del Agente
                    </label>
                    <div className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[200px] overflow-auto">
                      {testOutput ? (
                        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{testOutput}</p>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">La respuesta aparecerá aquí...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAgentTraining;
