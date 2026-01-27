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
  ChevronRight,
  Search,
  BarChart3,
  Code2,
  Gauge
} from 'lucide-react';
import { agentConfigService } from '../../services/agentConfigService';

interface TrainingExample {
  id: string;
  input: string;
  expectedOutput: string;
  category: 'technical_audit' | 'keyword_research' | 'schema_optimization' | 'performance_analysis' | 'general';
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

const SEOAgentTraining: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'examples' | 'prompts' | 'behavior' | 'testing'>('examples');
  
  // Estado para accordion de task prompts (solo uno abierto a la vez)
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
    temperature: 0.3, // Más bajo para SEO (precisión)
    examples: []
  });

  // Estado para nueva regla de comportamiento
  const [newBehaviorRule, setNewBehaviorRule] = useState('');

  // Estado para testing
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    loadTrainingConfig();
  }, []);

  const loadTrainingConfig = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading SEO agent training configuration...');
      
      const response = await agentConfigService.getConfig('seo');
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
      const currentConfig = await agentConfigService.getConfig('seo');
      
      // Actualizar con nueva configuración de entrenamiento
      const configUpdate = {
        ...currentConfig.data,
        trainingConfig: trainingConfig
      };
      
      await agentConfigService.updateConfig('seo', configUpdate as any);
      
      showMessage('success', '✅ Configuración de entrenamiento guardada correctamente');
    } catch (error) {
      console.error('❌ Error saving training config:', error);
      showMessage('error', 'Error al guardar la configuración de entrenamiento');
    } finally {
      setSaving(false);
    }
  };

  // Función para mostrar mensajes
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Gestión de ejemplos
  const addExample = () => {
    if (!newExample.input || !newExample.expectedOutput) {
      showMessage('error', 'Completa la entrada y salida esperada');
      return;
    }

    const example: TrainingExample = {
      id: Date.now().toString(),
      ...newExample
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
      temperature: 0.3,
      examples: []
    });

    showMessage('success', 'Prompt de tarea agregado correctamente');
  };

  const removeTaskPrompt = (taskType: string) => {
    setTrainingConfig(prev => ({
      ...prev,
      taskPrompts: prev.taskPrompts.filter(tp => tp.taskType !== taskType)
    }));
    showMessage('success', 'Prompt eliminado correctamente');
  };

  // Gestión de reglas de comportamiento
  const addBehaviorRule = () => {
    if (!newBehaviorRule.trim()) {
      showMessage('error', 'Escribe una regla de comportamiento');
      return;
    }

    setTrainingConfig(prev => ({
      ...prev,
      behaviorRules: [...prev.behaviorRules, newBehaviorRule.trim()]
    }));

    setNewBehaviorRule('');
    showMessage('success', 'Regla de comportamiento agregada');
  };

  const removeBehaviorRule = (index: number) => {
    setTrainingConfig(prev => ({
      ...prev,
      behaviorRules: prev.behaviorRules.filter((_, i) => i !== index)
    }));
  };

  // Testing del agente
  const testAgent = async () => {
    if (!testInput.trim()) {
      showMessage('error', 'Proporciona texto para probar');
      return;
    }

    try {
      setTestLoading(true);
      const response = await agentConfigService.testSEOAgent({ input: testInput });
      setTestOutput(response.output || response.result || 'Sin respuesta del agente');
      showMessage('success', 'Prueba completada correctamente');
    } catch (error) {
      console.error('Error testing SEO agent:', error);
      showMessage('error', 'Error al probar el agente SEO');
      setTestOutput('Error al procesar la solicitud del agente');
    } finally {
      setTestLoading(false);
    }
  };

  // Función para obtener el icono y color de cada tipo de tarea
  const getTaskTypeInfo = (taskType: string) => {
    switch (taskType) {
      case 'technical_audit':
        return { 
          icon: Search, 
          color: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300',
          headerColor: 'bg-gradient-to-r from-purple-600 to-purple-700',
          name: 'Auditoría Técnica'
        };
      case 'keyword_research':
        return { 
          icon: BarChart3, 
          color: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300',
          headerColor: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
          name: 'Investigación Keywords'
        };
      case 'schema_optimization':
        return { 
          icon: Code2, 
          color: 'bg-violet-50 border-violet-200 text-violet-800 dark:bg-violet-900/30 dark:border-violet-700 dark:text-violet-300',
          headerColor: 'bg-gradient-to-r from-violet-600 to-violet-700',
          name: 'Optimización Schema'
        };
      case 'performance_analysis':
        return { 
          icon: Gauge, 
          color: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:border-fuchsia-700 dark:text-fuchsia-300',
          headerColor: 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-700',
          name: 'Análisis Performance'
        };
      default:
        return { 
          icon: Brain, 
          color: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300',
          headerColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
          name: 'Tarea Genérica'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">Cargando configuración de entrenamiento SEO...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 py-8 px-4">
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
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entrenamiento del SEO Agent</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Personaliza el comportamiento y respuestas del agente SEO con ejemplos y configuración avanzada</p>
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

        {/* Mensaje de notificación */}
        {message && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto">
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
              Task Prompts
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
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ejemplos de Entrenamiento SEO</h3>
                  <p className="text-gray-600 mb-6">
                    Agrega ejemplos específicos de tareas SEO para entrenar al agente con casos reales y mejorar su precisión técnica.
                  </p>

                  {/* Formulario para nuevo ejemplo */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Agregar Nuevo Ejemplo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categoría
                        </label>
                        <select
                          value={newExample.category}
                          onChange={(e) => setNewExample(prev => ({ ...prev, category: e.target.value as any }))}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="general">General</option>
                          <option value="technical_audit">Auditoría Técnica</option>
                          <option value="keyword_research">Investigación Keywords</option>
                          <option value="schema_optimization">Optimización Schema</option>
                          <option value="performance_analysis">Análisis Performance</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Entrada del Usuario (Input)
                      </label>
                      <textarea
                        value={newExample.input}
                        onChange={(e) => setNewExample(prev => ({ ...prev, input: e.target.value }))}
                        placeholder="Ej: Analiza el SEO técnico de https://ejemplo.com y proporciona recomendaciones..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Salida Esperada (Respuesta Ideal)
                      </label>
                      <textarea
                        value={newExample.expectedOutput}
                        onChange={(e) => setNewExample(prev => ({ ...prev, expectedOutput: e.target.value }))}
                        placeholder="Ej: Análisis SEO Técnico: 1. Core Web Vitals: LCP 2.1s (Bueno), 2. Meta tags: Falta meta description..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notas (Opcional)
                      </label>
                      <input
                        type="text"
                        value={newExample.notes}
                        onChange={(e) => setNewExample(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Contexto adicional o consideraciones especiales..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={addExample}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Ejemplo</span>
                    </button>
                  </div>

                  {/* Lista de ejemplos existentes */}
                  {trainingConfig.examples.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No hay ejemplos de entrenamiento</p>
                      <p className="text-sm text-gray-500">Agrega ejemplos específicos de SEO para mejorar el aprendizaje</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trainingConfig.examples.map((example) => (
                        <div key={example.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              example.category === 'technical_audit' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                              example.category === 'keyword_research' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' :
                              example.category === 'schema_optimization' ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300' :
                              example.category === 'performance_analysis' ? 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {example.category}
                            </span>
                            <button
                              onClick={() => removeExample(example.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entrada:</p>
                              <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">{example.input}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salida Esperada:</p>
                              <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">{example.expectedOutput}</p>
                            </div>
                            {example.notes && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas:</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">{example.notes}</p>
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

            {/* Tab: Task Prompts */}
            {activeTab === 'prompts' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Task Prompts Especializados</h3>
                  <p className="text-gray-600 mb-6">
                    Configura prompts específicos para cada tipo de tarea SEO. Cada prompt define cómo el agente debe abordar diferentes tipos de análisis.
                  </p>

                  {/* Cards de task prompts con diseño accordion */}
                  <div className="space-y-4 mb-6">
                    {trainingConfig.taskPrompts.map((prompt) => {
                      const taskInfo = getTaskTypeInfo(prompt.taskType);
                      const Icon = taskInfo.icon;
                      const isExpanded = expandedCard === prompt.taskType;

                      return (
                        <div key={prompt.taskType} className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${taskInfo.color}`}>
                          {/* Header de la card */}
                          <div 
                            className={`${taskInfo.headerColor} text-white p-4 cursor-pointer flex items-center justify-between`}
                            onClick={() => setExpandedCard(isExpanded ? null : prompt.taskType)}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-6 h-6" />
                              <div>
                                <h4 className="font-semibold">{taskInfo.name}</h4>
                                <p className="text-sm opacity-90">Prompt especializado para {taskInfo.name.toLowerCase()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm opacity-75">
                                Temp: {prompt.temperature}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </div>
                          </div>

                          {/* Contenido expandible */}
                          {isExpanded && (
                            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    System Prompt
                                  </label>
                                  <textarea
                                    value={prompt.systemPrompt}
                                    onChange={(e) => {
                                      const updatedPrompts = trainingConfig.taskPrompts.map(tp =>
                                        tp.taskType === prompt.taskType
                                          ? { ...tp, systemPrompt: e.target.value }
                                          : tp
                                      );
                                      setTrainingConfig(prev => ({ ...prev, taskPrompts: updatedPrompts }));
                                    }}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[200px] font-mono text-sm"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      User Prompt Template
                                    </label>
                                    <textarea
                                      value={prompt.userPromptTemplate}
                                      onChange={(e) => {
                                        const updatedPrompts = trainingConfig.taskPrompts.map(tp =>
                                          tp.taskType === prompt.taskType
                                            ? { ...tp, userPromptTemplate: e.target.value }
                                            : tp
                                        );
                                        setTrainingConfig(prev => ({ ...prev, taskPrompts: updatedPrompts }));
                                      }}
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] font-mono text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Temperature (Precisión vs Creatividad)
                                    </label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="1"
                                      step="0.1"
                                      value={prompt.temperature}
                                      onChange={(e) => {
                                        const updatedPrompts = trainingConfig.taskPrompts.map(tp =>
                                          tp.taskType === prompt.taskType
                                            ? { ...tp, temperature: parseFloat(e.target.value) }
                                            : tp
                                        );
                                        setTrainingConfig(prev => ({ ...prev, taskPrompts: updatedPrompts }));
                                      }}
                                      className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                      <span>Más Preciso (0.0)</span>
                                      <span className="font-medium">{prompt.temperature}</span>
                                      <span>Más Creativo (1.0)</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    onClick={() => removeTaskPrompt(prompt.taskType)}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Eliminar Prompt</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Formulario para agregar nuevo task prompt */}
                  {trainingConfig.taskPrompts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Sparkles className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-300">No hay task prompts configurados</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">El sistema creará prompts por defecto automáticamente</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Agregar Nuevo Task Prompt</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tipo de Tarea
                          </label>
                          <select
                            value={newTaskPrompt.taskType}
                            onChange={(e) => setNewTaskPrompt(prev => ({ ...prev, taskType: e.target.value }))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Seleccionar tipo de tarea...</option>
                            <option value="technical_audit">Auditoría Técnica</option>
                            <option value="keyword_research">Investigación Keywords</option>
                            <option value="schema_optimization">Optimización Schema</option>
                            <option value="performance_analysis">Análisis Performance</option>
                            <option value="competitor_analysis">Análisis Competencia</option>
                            <option value="local_seo">SEO Local</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            System Prompt
                          </label>
                          <textarea
                            value={newTaskPrompt.systemPrompt}
                            onChange={(e) => setNewTaskPrompt(prev => ({ ...prev, systemPrompt: e.target.value }))}
                            placeholder="Eres un experto en [tipo de tarea SEO]. Tu especialidad es..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px]"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              User Prompt Template
                            </label>
                            <textarea
                              value={newTaskPrompt.userPromptTemplate}
                              onChange={(e) => setNewTaskPrompt(prev => ({ ...prev, userPromptTemplate: e.target.value }))}
                              placeholder="Realiza un análisis de {tipo} para {objetivo}..."
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Temperature
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={newTaskPrompt.temperature}
                              onChange={(e) => setNewTaskPrompt(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-gray-600 mt-1">
                              {newTaskPrompt.temperature} (Recomendado: 0.1-0.4 para SEO técnico)
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={addTaskPrompt}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar Task Prompt</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Reglas de Comportamiento */}
            {activeTab === 'behavior' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reglas de Comportamiento SEO</h3>
                  <p className="text-gray-600 mb-6">
                    Define reglas específicas que el SEOAgent debe seguir siempre. Estas reglas moldean su personalidad técnica y enfoque metodológico.
                  </p>

                  {/* Formulario para nueva regla */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Agregar Nueva Regla</h4>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newBehaviorRule}
                        onChange={(e) => setNewBehaviorRule(e.target.value)}
                        placeholder="Ej: Siempre incluir métricas de Core Web Vitals en análisis de rendimiento..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && addBehaviorRule()}
                      />
                      <button
                        onClick={addBehaviorRule}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de reglas */}
                  {trainingConfig.behaviorRules.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Target className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-300">No hay reglas de comportamiento definidas</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {trainingConfig.behaviorRules.map((rule, index) => (
                        <li key={index} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300 flex-1">{rule}</span>
                          <button
                            onClick={() => removeBehaviorRule(index)}
                            className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo de Aprendizaje
                  </label>
                  <select
                    value={trainingConfig.learningMode}
                    onChange={(e) => setTrainingConfig(prev => ({
                      ...prev,
                      learningMode: e.target.value as any
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="conservative">Conservador (Sigue patrones establecidos)</option>
                    <option value="balanced">Balanceado (Equilibrio entre precisión y adaptabilidad)</option>
                    <option value="aggressive">Agresivo (Experimental y adaptativo)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab: Testing */}
            {activeTab === 'testing' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Prueba tu SEO Agent entrenado</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Prueba cómo responde el SEO Agent con la configuración de entrenamiento actual.
                    Esto te ayuda a validar si los ejemplos y reglas funcionan como esperas para consultas SEO.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Input de Prueba SEO
                    </label>
                    <textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Escribe una consulta SEO para probar el agente...
Ej: Analiza el SEO técnico de mi sitio web y proporciona recomendaciones específicas para mejorar Core Web Vitals y el ranking en Google"
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[200px]"
                    />
                    <button
                      onClick={testAgent}
                      disabled={testLoading || !testInput}
                      className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Analizando SEO...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Probar SEO Agent
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Respuesta del SEO Agent
                    </label>
                    <div className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[200px] overflow-auto">
                      {testOutput ? (
                        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{testOutput}</p>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">La respuesta del SEO Agent aparecerá aquí...</p>
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
    </div>
  );
};

export default SEOAgentTraining;
