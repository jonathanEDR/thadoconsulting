/**
 * Página de Entrenamiento del ServicesAgent
 * Gestión de ejemplos, prompts, reglas y testing
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
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
  DollarSign,
  TrendingUp,
  Package
} from 'lucide-react';
import { agentConfigService } from '../../services/agentConfigService';

interface TrainingExample {
  id: string;
  input: string;
  expectedOutput: string;
  category: 'pricing' | 'analysis' | 'generation' | 'optimization' | 'portfolio' | 'general';
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

const ServicesAgentTraining: React.FC = () => {
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

  useEffect(() => {
    loadTrainingConfig();
  }, []);

  const loadTrainingConfig = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading ServicesAgent training configuration...');
      
      const response = await agentConfigService.getConfig('services');
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
      const currentConfig = await agentConfigService.getConfig('services');
      
      // Actualizar con nueva configuración de entrenamiento
      await agentConfigService.updateConfig('services', {
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

  // Gestión de prompts de tareas
  const addTaskPrompt = () => {
    if (!newTaskPrompt.taskType || !newTaskPrompt.systemPrompt) {
      showMessage('error', 'Completa el tipo de tarea y el prompt del sistema');
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

  const removeTaskPrompt = (index: number) => {
    setTrainingConfig(prev => ({
      ...prev,
      taskPrompts: prev.taskPrompts.filter((_, i) => i !== index)
    }));
  };

  // Gestión de reglas de comportamiento
  const addBehaviorRule = () => {
    const rule = window.prompt('Ingresa una nueva regla de comportamiento:');
    if (rule && rule.trim()) {
      setTrainingConfig(prev => ({
        ...prev,
        behaviorRules: [...prev.behaviorRules, rule.trim()]
      }));
      showMessage('success', 'Regla agregada correctamente');
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
    if (!testInput.trim()) {
      showMessage('error', 'Ingresa un prompt para probar');
      return;
    }

    try {
      setTestLoading(true);
      setTestOutput('Probando el agente...');

      // Aquí iría la llamada real al agente
      // Por ahora simulamos una respuesta
      setTimeout(() => {
        setTestOutput(`Respuesta simulada del ServicesAgent para: "${testInput}"\n\nEsta funcionalidad se conectará con el backend real del agente.`);
        setTestLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Error testing agent:', error);
      setTestOutput('Error al probar el agente');
      setTestLoading(false);
    }
  };

  const categoryColors = {
    pricing: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    analysis: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
    generation: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700',
    optimization: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-700',
    portfolio: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
    general: 'bg-gray-100 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
  };

  const categoryIcons = {
    pricing: DollarSign,
    analysis: Target,
    generation: Sparkles,
    optimization: TrendingUp,
    portfolio: Package,
    general: BookOpen
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-indigo-900/10 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando configuración de entrenamiento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-indigo-900/10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/ai-agents')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Entrenar ServicesAgent</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ejemplos, prompts y reglas de comportamiento</p>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              {message && (
                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <button
                onClick={loadTrainingConfig}
                disabled={saving}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Recargar
              </button>

              <button
                onClick={saveTrainingConfig}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'examples'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Ejemplos de Entrenamiento
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'prompts'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Target className="w-4 h-4" />
              Prompts por Tarea
            </button>
            <button
              onClick={() => setActiveTab('behavior')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'behavior'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              Reglas de Comportamiento
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'testing'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Probar Agente
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB: Ejemplos de Entrenamiento */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-200">¿Qué son los ejemplos de entrenamiento?</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                    Los ejemplos de entrenamiento enseñan al agente cómo responder en situaciones específicas.
                    Usa "few-shot learning" para mejorar la calidad y consistencia de las respuestas relacionadas con servicios, pricing y análisis de portafolio.
                  </p>
                </div>
              </div>
            </div>

            {/* Add New Example */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Agregar Nuevo Ejemplo
              </h3>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                  <select
                    value={newExample.category}
                    onChange={(e) => setNewExample({ ...newExample, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="pricing">Pricing / Precios</option>
                    <option value="analysis">Análisis de Servicios</option>
                    <option value="generation">Generación de Servicios</option>
                    <option value="optimization">Optimización</option>
                    <option value="portfolio">Análisis de Portafolio</option>
                  </select>
                </div>

                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Entrada del Usuario (Input)
                  </label>
                  <textarea
                    value={newExample.input}
                    onChange={(e) => setNewExample({ ...newExample, input: e.target.value })}
                    placeholder="Ej: Analiza este servicio de desarrollo web y sugiere mejoras de pricing..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Expected Output */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salida Esperada (Expected Output)
                  </label>
                  <textarea
                    value={newExample.expectedOutput}
                    onChange={(e) => setNewExample({ ...newExample, expectedOutput: e.target.value })}
                    placeholder="Ej: He analizado el contenido sobre desarrollo web. Aquí están las mejoras de pricing sugeridas:..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notas (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newExample.notes || ''}
                    onChange={(e) => setNewExample({ ...newExample, notes: e.target.value })}
                    placeholder="Contexto adicional sobre este ejemplo..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={addExample}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Ejemplo
                </button>
              </div>
            </div>

            {/* Existing Examples */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ejemplos Existentes ({trainingConfig.examples.length})
              </h3>

              {trainingConfig.examples.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300">No hay ejemplos de entrenamiento aún.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agrega tu primer ejemplo arriba para comenzar.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {trainingConfig.examples.map((example) => {
                    const Icon = categoryIcons[example.category];
                    return (
                      <div key={example.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${categoryColors[example.category]}`}>
                            <Icon className="w-3 h-3" />
                            {example.category}
                          </div>
                          <button
                            onClick={() => removeExample(example.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">INPUT:</p>
                            <p className="text-sm text-gray-900">{example.input}</p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">EXPECTED OUTPUT:</p>
                            <p className="text-sm text-gray-700">{example.expectedOutput}</p>
                          </div>

                          {example.notes && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">NOTAS:</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 italic">{example.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Prompts por Tarea */}
        {activeTab === 'prompts' && (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">¿Qué son los prompts por tarea?</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Define prompts específicos para cada tipo de tarea (pricing, análisis, generación, etc.).
                    Estos prompts guían al agente sobre cómo abordar cada tipo de solicitud de manera profesional y consistente.
                  </p>
                </div>
              </div>
            </div>

            {/* Add New Task Prompt */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Agregar Nuevo Prompt de Tarea
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Tarea</label>
                  <input
                    type="text"
                    value={newTaskPrompt.taskType}
                    onChange={(e) => setNewTaskPrompt({ ...newTaskPrompt, taskType: e.target.value })}
                    placeholder="Ej: pricing_analysis, service_generation, portfolio_optimization"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">System Prompt</label>
                  <textarea
                    value={newTaskPrompt.systemPrompt}
                    onChange={(e) => setNewTaskPrompt({ ...newTaskPrompt, systemPrompt: e.target.value })}
                    placeholder="Instrucciones del sistema para esta tarea..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Prompt Template</label>
                  <textarea
                    value={newTaskPrompt.userPromptTemplate}
                    onChange={(e) => setNewTaskPrompt({ ...newTaskPrompt, userPromptTemplate: e.target.value })}
                    placeholder="Template del prompt del usuario con variables {variable}..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Temperature: {newTaskPrompt.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={newTaskPrompt.temperature}
                    onChange={(e) => setNewTaskPrompt({ ...newTaskPrompt, temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={addTaskPrompt}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Prompt
                </button>
              </div>
            </div>

            {/* Existing Task Prompts */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Prompts Existentes ({trainingConfig.taskPrompts.length})
              </h3>

              {trainingConfig.taskPrompts.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300">No hay prompts de tareas configurados.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {trainingConfig.taskPrompts.map((prompt, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{prompt.taskType}</h4>
                        <button
                          onClick={() => removeTaskPrompt(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">SYSTEM PROMPT:</p>
                          <p className="text-gray-700 dark:text-gray-300">{prompt.systemPrompt}</p>
                        </div>
                        {prompt.userPromptTemplate && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">USER TEMPLATE:</p>
                            <p className="text-gray-700 dark:text-gray-300">{prompt.userPromptTemplate}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">Temperature: {prompt.temperature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Reglas de Comportamiento */}
        {activeTab === 'behavior' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-200">Reglas de Comportamiento</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                    Define reglas específicas que el agente debe seguir siempre. Por ejemplo: "Siempre incluir análisis de ROI en recomendaciones de pricing" o "Nunca sugerir precios por debajo del costo".
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reglas Activas ({trainingConfig.behaviorRules.length})
                </h3>
                <button
                  onClick={addBehaviorRule}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Regla
                </button>
              </div>

              {trainingConfig.behaviorRules.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300">No hay reglas de comportamiento definidas.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trainingConfig.behaviorRules.map((rule, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start gap-3 flex-1">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-900 dark:text-gray-100">{rule}</p>
                      </div>
                      <button
                        onClick={() => removeBehaviorRule(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instrucciones Especiales</h3>
              <textarea
                value={trainingConfig.specialInstructions}
                onChange={(e) => setTrainingConfig({ ...trainingConfig, specialInstructions: e.target.value })}
                placeholder="Instrucciones adicionales generales para el agente..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={6}
              />
            </div>

            {/* Learning Mode */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modo de Aprendizaje</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['conservative', 'balanced', 'aggressive'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTrainingConfig({ ...trainingConfig, learningMode: mode })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      trainingConfig.learningMode === mode
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{mode}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {mode === 'conservative' && 'Respuestas más predecibles'}
                      {mode === 'balanced' && 'Balance entre creatividad y consistencia'}
                      {mode === 'aggressive' && 'Más creativo y exploratorio'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Testing */}
        {activeTab === 'testing' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-200">Probar el Agente</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                    Prueba cómo responde el agente con la configuración actual. Usa prompts reales que usarías en producción.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Input de Prueba</h3>
              <textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Escribe tu prompt aquí para probar el agente..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={4}
              />

              <button
                onClick={testAgent}
                disabled={testLoading || !testInput.trim()}
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {testLoading ? 'Probando...' : 'Probar Agente'}
              </button>
            </div>

            {testOutput && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resultado</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">{testOutput}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesAgentTraining;
