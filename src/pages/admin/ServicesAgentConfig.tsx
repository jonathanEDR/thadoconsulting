/**
 * Página de Configuración Detallada del ServicesAgent
 * Accedida desde el Panel Central IA
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw, Briefcase, Sparkles, Terminal } from 'lucide-react';
import agentConfigService, { type AgentConfigData } from '../../services/agentConfigService';
import BasicConfigPanel from '../../components/admin/agent-config/BasicConfigPanel';
import PersonalityConfigPanel from '../../components/admin/agent-config/PersonalityConfigPanel';
import ContextConfigPanel from '../../components/admin/agent-config/ContextConfigPanel';
import ResponseConfigPanel from '../../components/admin/agent-config/ResponseConfigPanel';
import ServicesAgentPromptConfig from '../../components/admin/agent-config/ServicesAgentPromptConfig';

export const ServicesAgentConfig: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'context' | 'response' | 'prompts'>('basic');
  const [agentConfig, setAgentConfig] = useState<AgentConfigData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadAgentConfig();
  }, []);

  const loadAgentConfig = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading ServicesAgent configuration...');
      const response = await agentConfigService.getConfig('services');
      
      if (response.success && response.data) {
        console.log('✅ Config loaded:', response.data);
        setAgentConfig(response.data);
      } else {
        console.error('❌ Failed to load config');
        // Usar valores por defecto
        setAgentConfig(getDefaultConfig());
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setAgentConfig(getDefaultConfig());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultConfig = (): AgentConfigData => {
    return {
      agentName: 'services',
      enabled: false,
      config: {
        timeout: 30,
        maxTokens: 2000,
        temperature: 0.7,
      },
      personality: {
        archetype: 'expert',
        traits: [
          { trait: 'professional', intensity: 9 },
          { trait: 'analytical', intensity: 8 },
          { trait: 'technical', intensity: 7 }
        ],
        communicationStyle: {
          tone: 'professional',
          verbosity: 'detailed',
          formality: 8,
          enthusiasm: 6,
          technicality: 7
        }
      },
      contextConfig: {
        projectInfo: {
          name: 'THADO Consulting Services',
          type: 'service_portfolio',
          domain: 'professional_services',
          language: 'es-ES',
          tone: 'professional_consultative'
        },
        userExpertise: 'advanced'
      },
      responseConfig: {
        defaultLanguage: 'es-ES',
        supportedLanguages: ['es-ES', 'en-US'],
        includeExamples: true,
        includeSteps: true,
        includeMetrics: true,
        includeRecommendations: true,
        responseFormat: 'structured'
      },
      promptConfig: {
        useCustomPrompts: false,
        customSystemPrompt: '',
        promptVariables: {},
        contextWindow: 4000
      }
    };
  };

  const handleSave = async () => {
    if (!agentConfig) return;

    try {
      setIsSaving(true);
      console.log('💾 Saving ServicesAgent configuration:', agentConfig);

      const response = await agentConfigService.updateConfig('services', {
        enabled: agentConfig.enabled,
        config: agentConfig.config,
        personality: agentConfig.personality,
        contextConfig: agentConfig.contextConfig,
        responseConfig: agentConfig.responseConfig,
        promptConfig: agentConfig.promptConfig
      });

      if (response.success) {
        setSaveMessage({ type: 'success', text: '✅ Configuración guardada correctamente' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: '❌ Error al guardar configuración' });
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveMessage({ type: 'error', text: '❌ Error de red al guardar configuración' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer la configuración a los valores por defecto?')) {
      try {
        setIsSaving(true);
        const response = await agentConfigService.resetConfig('services');

        if (response.success) {
          setSaveMessage({ type: 'success', text: '🔄 Configuración restablecida' });
          await loadAgentConfig();
        } else {
          setSaveMessage({ type: 'error', text: `❌ Error: ${response.error}` });
        }
      } catch (error) {
        console.error('Error resetting config:', error);
        setSaveMessage({ type: 'error', text: '❌ Error al resetear' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const onConfigChange = (section: string, key: string, value: any) => {
    setAgentConfig(prev => {
      if (!prev) return prev;

      if (section === 'config') {
        return {
          ...prev,
          config: {
            ...prev.config,
            [key]: value
          }
        };
      } else if (section === 'promptConfig' && key === 'promptConfig') {
        // Caso especial: reemplazar todo el promptConfig
        return {
          ...prev,
          promptConfig: value
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...(prev[section as keyof typeof prev] as object),
            [key]: value
          }
        };
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-indigo-900/10 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!agentConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-indigo-900/10 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <p className="text-red-600 dark:text-red-400">Error al cargar configuración</p>
          <button
            onClick={loadAgentConfig}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reintentar
          </button>
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
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Configuración ServicesAgent</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gestión inteligente de servicios y pricing</p>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              {saveMessage && (
                <div className={`px-4 py-2 rounded-lg ${
                  saveMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {saveMessage.text}
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={isSaving}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Resetear
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>

              <button
                onClick={() => navigate('/dashboard/agents/services/training')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Entrenar Agente
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Configuración Básica
            </button>
            <button
              onClick={() => setActiveTab('personality')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'personality'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Personalidad
            </button>
            <button
              onClick={() => setActiveTab('context')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'context'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Contexto
            </button>
            <button
              onClick={() => setActiveTab('response')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'response'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Respuestas
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'prompts'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Prompts
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'basic' && (
          <BasicConfigPanel
            config={agentConfig}
            onConfigChange={onConfigChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'personality' && (
          <PersonalityConfigPanel
            config={agentConfig}
            onConfigChange={onConfigChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'context' && (
          <ContextConfigPanel
            config={agentConfig}
            onConfigChange={onConfigChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'response' && (
          <ResponseConfigPanel
            config={agentConfig}
            onConfigChange={onConfigChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'prompts' && (
          <ServicesAgentPromptConfig
            config={agentConfig}
            onConfigChange={onConfigChange}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesAgentConfig;
