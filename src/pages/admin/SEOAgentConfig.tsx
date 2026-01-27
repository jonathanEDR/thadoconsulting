/**
 * Página de Configuración Detallada del SEOAgent
 * Accedida desde el Panel Central IA
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw, Brain, Sparkles, Search, BarChart3, Code2 } from 'lucide-react';
import agentConfigService, { type AgentConfigData } from '../../services/agentConfigService';
import BasicConfigPanel from '../../components/admin/agent-config/BasicConfigPanel';
import PersonalityConfigPanel from '../../components/admin/agent-config/PersonalityConfigPanel';
import ContextConfigPanel from '../../components/admin/agent-config/ContextConfigPanel';
import ResponseConfigPanel from '../../components/admin/agent-config/ResponseConfigPanel';
import { SEOAgentPromptConfig } from '../../components/admin/agent-config/SEOAgentPromptConfig';

export const SEOAgentConfig: React.FC = () => {
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
      console.log('🔄 Loading SEOAgent configuration...');
      const response = await agentConfigService.getConfig('seo');
      
      if (response.success && response.data) {
        console.log('✅ Config loaded:', response.data);
        setAgentConfig(response.data);
      } else {
        console.error('❌ Failed to load config');
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
      agentName: 'seo',
      enabled: true,
      config: {
        timeout: 75,
        maxTokens: 3000,
        temperature: 0.3,
      },
      personality: {
        archetype: 'expert',
        traits: [
          { trait: 'analytical', intensity: 9 },
          { trait: 'precise', intensity: 9 },
          { trait: 'technical', intensity: 8 },
          { trait: 'professional', intensity: 8 }
        ],
        communicationStyle: {
          tone: 'technical',
          verbosity: 'detailed',
          formality: 8,
          enthusiasm: 5,
          technicality: 9
        }
      },
      contextConfig: {
        projectInfo: {
          name: 'Web Scuti',
          type: 'seo_platform',
          domain: 'technology',
          language: 'es-ES',
          tone: 'technical_professional'
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
        contextWindow: 15
      }
    };
  };

  const handleConfigChange = (section: string, key: string, value: any) => {
    if (!agentConfig) return;

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

  const handleSaveConfig = async () => {
    if (!agentConfig) return;

    try {
      setIsSaving(true);
      setSaveMessage(null);

      console.log('💾 Saving SEO configuration...', agentConfig);

      const response = await agentConfigService.updateConfig('seo', {
        enabled: agentConfig.enabled,
        config: agentConfig.config,
        personality: agentConfig.personality,
        contextConfig: agentConfig.contextConfig,
        responseConfig: agentConfig.responseConfig,
        promptConfig: agentConfig.promptConfig
      });

      if (response.success) {
        console.log('✅ Configuration saved successfully');
        setSaveMessage({ type: 'success', text: '✅ Configuración SEO guardada exitosamente' });
        await loadAgentConfig();
      } else {
        console.error('❌ Failed to save:', response.error);
        setSaveMessage({ type: 'error', text: `❌ Error: ${response.error}` });
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveMessage({ type: 'error', text: '❌ Error al guardar la configuración' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleResetConfig = async () => {
    if (!confirm('¿Estás seguro de resetear la configuración SEO a valores por defecto?')) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await agentConfigService.resetConfig('seo');

      if (response.success) {
        setSaveMessage({ type: 'success', text: '✅ Configuración SEO reseteada' });
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando configuración SEO...</p>
        </div>
      </div>
    );
  }

  if (!agentConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error al cargar la configuración SEO</p>
          <button onClick={loadAgentConfig} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/ai-agents')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Search className="w-7 h-7 text-red-600" />
              Configuración del SEOAgent
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configura análisis técnico, auditorías y optimización SEO avanzada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/dashboard/agents/seo/training')}
            className="px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Brain className="w-4 h-4" />
            <Sparkles className="w-4 h-4" />
            Entrenar Agente
          </button>
          <button
            onClick={handleResetConfig}
            disabled={isSaving}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Resetear
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* SEO Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Auditoría Técnica</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Análisis profundo de SEO</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Keywords Research</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Investigación de palabras clave</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Schema.org</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Datos estructurados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              ⚙️ Configuración Básica
            </button>
            <button
              onClick={() => setActiveTab('personality')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'personality'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              🎭 Personalidad
            </button>
            <button
              onClick={() => setActiveTab('context')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'context'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              🌍 Contexto
            </button>
            <button
              onClick={() => setActiveTab('response')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'response'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              📝 Respuestas
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'prompts'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              💬 Prompts
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'basic' && (
            <BasicConfigPanel
              config={agentConfig}
              onConfigChange={handleConfigChange}
              onSave={handleSaveConfig}
              onReset={handleResetConfig}
              isSaving={isSaving}
            />
          )}
          {activeTab === 'personality' && (
            <PersonalityConfigPanel
              config={agentConfig}
              onConfigChange={handleConfigChange}
              onSave={handleSaveConfig}
              onReset={handleResetConfig}
              isSaving={isSaving}
            />
          )}
          {activeTab === 'context' && (
            <ContextConfigPanel
              config={agentConfig}
              onConfigChange={handleConfigChange}
              onSave={handleSaveConfig}
              onReset={handleResetConfig}
              isSaving={isSaving}
            />
          )}
          {activeTab === 'response' && (
            <ResponseConfigPanel
              config={agentConfig}
              onConfigChange={handleConfigChange}
              onSave={handleSaveConfig}
              onReset={handleResetConfig}
              isSaving={isSaving}
            />
          )}
          {activeTab === 'prompts' && (
            <SEOAgentPromptConfig
              config={agentConfig}
              onConfigChange={handleConfigChange}
              onSave={handleSaveConfig}
              onReset={handleResetConfig}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOAgentConfig;
