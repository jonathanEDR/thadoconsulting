import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import agentConfigService, { type AgentConfigData } from '../../services/agentConfigService';
import servicesAgentService from '../../services/servicesAgentService';
import { type GerenteGeneralConfigData } from '../../services/gerenteGeneralService';
import { getApiUrl } from '../../utils/apiConfig';
import { useAIAgentsCache } from '../../hooks/useDashboardCache';
import { useGerenteGeneralCache } from '../../hooks/useGerenteGeneral';
import { 
  Settings, 
  Activity, 
  Cpu, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  Info,
  ChevronRight,
  Database
} from 'lucide-react';
import AgentSystemTester from '../../components/admin/AgentSystemTester';
import { GerenteGeneralBasicConfig } from '../../components/admin/agent-config/GerenteGeneralBasicConfig';
import { GerenteGeneralPersonalityConfig } from '../../components/admin/agent-config/GerenteGeneralPersonalityConfig';
import { GerenteGeneralTrainingConfig } from '../../components/admin/agent-config/GerenteGeneralTrainingConfig';
import { GerenteGeneralResponseConfig } from '../../components/admin/agent-config/GerenteGeneralResponseConfig';
import { GerenteGeneralPromptConfig } from '../../components/admin/agent-config/GerenteGeneralPromptConfig';
import { GerenteGeneralStats } from '../../components/admin/agent-config/GerenteGeneralStats';
import { RoutingRulesPanel } from '../../components/admin/agent-config/RoutingRulesPanel';
import { GerenteGeneralTester } from '../../components/admin/GerenteGeneralTester';

// Tipos para el dashboard
interface SystemHealth {
  status: string;
  timestamp?: string;
  components?: Record<string, string>;
  metrics?: {
    total_requests: number;
    cached_responses: number;
    error_rate: number;
  };
}

interface SystemMetrics {
  data?: {
    promptSystem?: {
      templates: number;
      totalUsage: number;
      avgSuccessRate: number;
    };
    memorySystem?: {
      cachedPatterns: number;
      cachedUsers: number;
      learningQueueSize: number;
    };
    openaiService?: {
      totalRequests: number;
      cachedResponses: number;
      errorRate: number;
      avgResponseTime: number;
    };
  };
}

interface AgentConfig {
  enabled: boolean;
  status: string;
  requests: number;
}

interface AgentsConfiguration {
  [key: string]: AgentConfig;
}

interface AIAgentsDashboardData {
  systemHealth: SystemHealth | null;
  systemMetrics: SystemMetrics | null;
  agentsConfig: AgentsConfiguration | null;
  agentConfig: AgentConfigData | null;
  servicesAgentStatus: any;
  servicesAgentMetrics: any;
}

// ===================================================
// PANEL CENTRAL DASHBOARD ADMINISTRATIVO - IA AGENTS
// ===================================================

const AIAgentsDashboard = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  // Hook de cache para AI Agents
  const {
    data: aiAgentsData,
    loading,
    error: cacheError,
    refetch: refreshAIAgents
  } = useAIAgentsCache(
    useCallback(async (): Promise<AIAgentsDashboardData> => {
      const token = await getToken();
      if (!token) throw new Error('Token no disponible');
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Configuración del agente
      let agentConfig: AgentConfigData | null = null;
      try {
        const configResponse = await agentConfigService.getConfig('blog');
        if (configResponse.success && configResponse.data) {
          agentConfig = configResponse.data;
        } else {
          // Configuración por defecto
          agentConfig = {
            agentName: 'blog',
            enabled: true,
            config: {
              timeout: 30,
              maxTokens: 2000,
              temperature: 0.7,
              maxTagsPerPost: 10,
              minContentLength: 300,
              seoScoreThreshold: 70,
              autoOptimization: true,
              autoSuggestions: true,
              suggestionDebounceMs: 800,
              suggestionMinLength: 10,
              suggestionContextLength: 200,
            },
            personality: {
              archetype: 'expert',
              traits: [
                { trait: 'analytical', intensity: 8 },
                { trait: 'professional', intensity: 7 },
                { trait: 'creative', intensity: 6 }
              ],
              communicationStyle: {
                tone: 'professional',
                verbosity: 'moderate',
                formality: 7,
                enthusiasm: 6,
                technicality: 7
              }
            },
            contextConfig: {
              projectInfo: {
                name: 'THADO Consulting',
                type: 'tech_blog',
                domain: 'technology',
                language: 'es-ES',
                tone: 'professional_friendly'
              },
              userExpertise: 'intermediate'
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
              contextWindow: 10
            }
          };
        }
      } catch (error) {
        console.error('❌ Error loading agent config:', error);
      }

      // Health status
      const healthResponse = await fetch(`${getApiUrl()}/agents/health`, { headers });
      const systemHealth = await healthResponse.json();

      // Métricas del sistema
      const metricsResponse = await fetch(`${getApiUrl()}/agents/testing/system-metrics`, { headers });
      const systemMetrics = await metricsResponse.json();

      // Estado y métricas del ServicesAgent
      let servicesAgentStatus = null;
      let servicesAgentMetrics = null;
      try {
        servicesAgentStatus = await servicesAgentService.getStatus();
        servicesAgentMetrics = await servicesAgentService.getMetrics();
      } catch (servicesErr) {
        console.warn('⚠️ ServicesAgent not available:', servicesErr);
      }

      // Configuración de agentes
      const agentsConfig = {
        BlogAgent: { enabled: true, status: 'active', requests: 1234 },
        SEOAgent: { enabled: true, status: 'active', requests: 0 },
        AnalyticsAgent: { enabled: false, status: 'inactive', requests: 0 },
        ServicesAgent: { 
          enabled: servicesAgentStatus?.data?.enabled || false, 
          status: servicesAgentStatus?.data?.status || 'unknown', 
          requests: servicesAgentMetrics?.data?.totalRequests || 0 
        }
      };

      return {
        systemHealth,
        systemMetrics,
        agentsConfig,
        agentConfig,
        servicesAgentStatus,
        servicesAgentMetrics
      };
    }, [getToken])
  );
  
  // Estados locales (no cacheados)
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  
  // Estado local para ediciones de configuración de GerenteGeneral
  const [editingGerenteConfig, setEditingGerenteConfig] = useState<GerenteGeneralConfigData | null>(null);
  const [gerenteActiveConfigTab, setGerenteActiveConfigTab] = useState('basic');

  // Hook de cache para GerenteGeneral
  const {
    config: gerenteConfig,
    status: gerenteStatus,
    routingRules: gerenteRoutingRules,
    loading: gerenteLoading,
    error: gerenteError,
    updateConfig: updateGerenteConfig,
    updateRoutingRules: updateGerenteRoutingRules,
    refetchAll: refetchGerenteAll,
    initializeConfig: initializeGerenteConfig
  } = useGerenteGeneralCache();

  // Estados derivados del cache
  const systemHealth = aiAgentsData?.systemHealth || null;
  const systemMetrics = aiAgentsData?.systemMetrics || null;
  const agentsConfig = aiAgentsData?.agentsConfig || null;
  const error = cacheError;

  // Función de refresh manual
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAIAgents();
    setIsRefreshing(false);
  };

  // Función para obtener color de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy':
      case 'error':
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Función para obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'degraded':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'unhealthy':
      case 'error':
      case 'inactive':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  // Handlers para GerenteGeneral
  // Handler para cambios en configuración de GerenteGeneral
  const handleGerenteConfigChange = (section: string, key: string, value: any) => {
    if (!gerenteConfig) return;
    
    setEditingGerenteConfig(prev => {
      const current = prev || gerenteConfig;
      
      // Si el section y key son iguales, es un reemplazo completo de la sección
      if (section === key) {
        return {
          ...current,
          [section]: value
        };
      }
      
      // Obtener el valor actual de la sección (puede ser undefined)
      const currentSection = current[section as keyof GerenteGeneralConfigData] as any || {};
      
      return {
        ...current,
        [section]: {
          ...currentSection,
          [key]: value
        }
      };
    });
  };

  const handleSaveGerenteConfig = async () => {
    const configToSave = editingGerenteConfig || gerenteConfig;
    if (!configToSave) return;
    try {
      setIsSaving(true);
      setConfigError(null);
      
      const success = await updateGerenteConfig(configToSave);
      if (success) {
        setConfigSaved(true);
        setEditingGerenteConfig(null);
        await refetchGerenteAll();
        setTimeout(() => setConfigSaved(false), 3000);
      } else {
        setConfigError('Error al guardar configuración de GerenteGeneral');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setConfigError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para inicializar la configuración con valores por defecto del servidor
  const handleInitializeGerenteConfig = async () => {
    if (!window.confirm(
      '⚠️ ¿Estás seguro de que quieres INICIALIZAR la configuración del Gerente General?\n\n' +
      'Esto SOBRESCRIBIRÁ toda la configuración actual con los valores por defecto del sistema.\n\n' +
      'Esta acción no se puede deshacer.'
    )) {
      return;
    }

    try {
      setIsSaving(true);
      setConfigError(null);
      
      const success = await initializeGerenteConfig();
      
      if (success) {
        setConfigSaved(true);
        setEditingGerenteConfig(null);
        setTimeout(() => setConfigSaved(false), 3000);
      } else {
        setConfigError('Error al inicializar la configuración');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setConfigError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoutingConfigChange = (newConfig: any) => {
    // Este handler actualiza directamente con el nuevo objeto de configuración
    // que viene del RoutingRulesPanel
    console.log('Routing config changed:', newConfig);
  };

  const handleSaveGerenteRoutingRules = async () => {
    if (!gerenteRoutingRules) return;
    try {
      setIsSaving(true);
      setConfigError(null);
      
      const success = await updateGerenteRoutingRules(gerenteRoutingRules);
      if (success) {
        setConfigSaved(true);
        await refetchGerenteAll();
        setTimeout(() => setConfigSaved(false), 3000);
      } else {
        setConfigError('Error al guardar reglas de routing');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setConfigError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !systemHealth) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando dashboard de IA...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="text-purple-600" />
            Panel Central IA
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Configuración y monitoreo del sistema de agentes inteligentes
          </p>
        </div>
      
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
            <span className="font-medium text-red-900 dark:text-red-100">Error del Sistema</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen General', icon: BarChart3 },
            { id: 'gerente', label: 'Coordinador IA', icon: Brain },
            { id: 'health', label: 'Estado del Sistema', icon: Activity },
            { id: 'metrics', label: 'Métricas Avanzadas', icon: Cpu },
            { id: 'testing', label: 'Testing del Sistema', icon: RefreshCw }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Estado General */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="text-blue-600 dark:text-blue-400" />
                Estado General del Sistema
              </h2>
              
              {systemHealth && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado Global</span>
                      {getStatusIcon(systemHealth.status)}
                    </div>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(systemHealth.status)}`}>
                      {systemHealth.status || 'unknown'}
                    </div>
                  </div>
                  
                  {systemHealth.components && Object.entries(systemHealth.components).map(([component, status]) => (
                    <div key={component} className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {component.replace('_', ' ')}
                        </span>
                        {getStatusIcon(status as string)}
                      </div>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status as string)}`}>
                        {status as string}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Métricas Rápidas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-green-600 dark:text-green-400" />
                Métricas Rápidas
              </h3>
              
              {systemHealth?.metrics && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Requests</span>
                      <span className="font-medium">{systemHealth.metrics.total_requests || 0}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cached Responses</span>
                      <span className="font-medium">{systemHealth.metrics.cached_responses || 0}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Error Rate</span>
                      <span className={`font-medium ${
                        (systemHealth.metrics.error_rate || 0) > 0.05 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {((systemHealth.metrics.error_rate || 0) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Agentes Activos */}
            {agentsConfig && (
              <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="text-purple-600 dark:text-purple-400" />
                  Estado de Agentes
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(agentsConfig || {}).map(([agentName, config]: [string, any]) => (
                    <div key={agentName} className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">{agentName}</h4>
                        {getStatusIcon(config.status as string)}
                      </div>
                      
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(config.status as string)}`}>
                        {config.enabled ? 'Habilitado' : 'Deshabilitado'}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Requests: {config.requests}
                      </p>

                      {/* Botón de configuración */}
                      {agentName === 'BlogAgent' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate('/dashboard/agents/blog/config')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Settings size={16} />
                            Configurar Agente
                            <ChevronRight size={16} />
                          </button>
                          <button
                            onClick={() => navigate('/dashboard/agents/blog/training')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Brain size={16} />
                            Entrenar Agente
                          </button>
                        </div>
                      )}
                      
                      {/* Botones para SEOAgent */}
                      {agentName === 'SEOAgent' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate('/dashboard/agents/seo/config')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Settings size={16} />
                            Configurar Agente
                            <ChevronRight size={16} />
                          </button>
                          <button
                            onClick={() => navigate('/dashboard/agents/seo/training')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Brain size={16} />
                            Entrenar Agente
                          </button>
                        </div>
                      )}
                      
                      {/* Botones para ServicesAgent */}
                      {agentName === 'ServicesAgent' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate('/dashboard/agents/services/config')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Settings size={16} />
                            Configurar Agente
                            <ChevronRight size={16} />
                          </button>
                          <button
                            onClick={() => navigate('/dashboard/agents/services/training')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Brain size={16} />
                            Entrenar Agente
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* GerenteGeneral Coordinator Tab */}
        {activeTab === 'gerente' && (
          <div className="space-y-6">
            {/* Configuration Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Brain className="text-blue-600 dark:text-blue-400" />
                  Coordinador Inteligente (GerenteGeneral)
                </h2>
                
                <div className="flex items-center gap-3">
                  {configError && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-lg">
                      <XCircle size={18} />
                      <span className="text-sm font-medium">{configError}</span>
                    </div>
                  )}
                  
                  {configSaved && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-medium">Configuración guardada</span>
                    </div>
                  )}
                </div>
              </div>

              {gerenteLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando configuración de GerenteGeneral...</span>
                </div>
              ) : gerenteConfig ? (
                <>
                  {/* Info Section */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex gap-3">
                      <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-2">Coordinador de Agentes Inteligentes</p>
                        <p className="mb-2">
                          GerenteGeneral coordina la interacción entre múltiples agentes IA, optimizando 
                          las respuestas a través de routing inteligente y distribución de tareas.
                        </p>
                        {gerenteStatus && (
                          <p className="text-xs">
                            <strong>Estado:</strong> {gerenteStatus.status} | 
                            <strong className="ml-2">Agentes activos:</strong> {gerenteStatus.activeAgents}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sub-tabs Navigation */}
                  <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                      <button
                        onClick={() => setGerenteActiveConfigTab('basic')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          gerenteActiveConfigTab === 'basic'
                            ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        Configuración Básica
                      </button>
                      <button
                        onClick={() => setGerenteActiveConfigTab('personality')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          gerenteActiveConfigTab === 'personality'
                            ? 'border-pink-600 dark:border-pink-400 text-pink-600 dark:text-pink-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        Personalidad
                      </button>
                      <button
                        onClick={() => setGerenteActiveConfigTab('training')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          gerenteActiveConfigTab === 'training'
                            ? 'border-green-600 dark:border-green-400 text-green-600 dark:text-green-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        Entrenamiento
                      </button>
                      <button
                        onClick={() => setGerenteActiveConfigTab('responses')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          gerenteActiveConfigTab === 'responses'
                            ? 'border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        Respuestas
                      </button>
                      <button
                        onClick={() => setGerenteActiveConfigTab('prompts')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          gerenteActiveConfigTab === 'prompts'
                            ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        Prompts
                      </button>
                      <button
                        onClick={() => setGerenteActiveConfigTab('routing')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          gerenteActiveConfigTab === 'routing'
                            ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        Reglas de Routing
                      </button>
                      <button
                        onClick={() => setGerenteActiveConfigTab('stats')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          gerenteActiveConfigTab === 'stats'
                            ? 'border-cyan-600 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        Estadísticas
                      </button>
                    </nav>
                  </div>

                  {/* Basic Configuration Panel */}
                  {gerenteActiveConfigTab === 'basic' && (
                    <GerenteGeneralBasicConfig
                      config={editingGerenteConfig || gerenteConfig}
                      onConfigChange={handleGerenteConfigChange}
                      onSave={handleSaveGerenteConfig}
                      onInitialize={handleInitializeGerenteConfig}
                      isSaving={isSaving}
                      isLoading={gerenteLoading}
                    />
                  )}

                  {/* Personality Configuration Panel */}
                  {gerenteActiveConfigTab === 'personality' && (
                    <GerenteGeneralPersonalityConfig
                      config={editingGerenteConfig || gerenteConfig}
                      onConfigChange={handleGerenteConfigChange}
                      onSave={handleSaveGerenteConfig}
                      isSaving={isSaving}
                      isLoading={gerenteLoading}
                    />
                  )}

                  {/* Training Configuration Panel */}
                  {gerenteActiveConfigTab === 'training' && (
                    <GerenteGeneralTrainingConfig
                      config={editingGerenteConfig || gerenteConfig}
                      onConfigChange={handleGerenteConfigChange}
                      onSave={handleSaveGerenteConfig}
                      isSaving={isSaving}
                      isLoading={gerenteLoading}
                    />
                  )}

                  {/* Response Configuration Panel */}
                  {gerenteActiveConfigTab === 'responses' && (
                    <GerenteGeneralResponseConfig
                      config={editingGerenteConfig || gerenteConfig}
                      onConfigChange={handleGerenteConfigChange}
                      onSave={handleSaveGerenteConfig}
                      isSaving={isSaving}
                      isLoading={gerenteLoading}
                    />
                  )}

                  {/* Prompt Configuration Panel */}
                  {gerenteActiveConfigTab === 'prompts' && (
                    <GerenteGeneralPromptConfig
                      config={editingGerenteConfig || gerenteConfig}
                      onConfigChange={handleGerenteConfigChange}
                      onSave={handleSaveGerenteConfig}
                      isSaving={isSaving}
                      isLoading={gerenteLoading}
                    />
                  )}

                  {/* Routing Rules Panel */}
                  {gerenteActiveConfigTab === 'routing' && (
                    <RoutingRulesPanel
                      routingConfig={gerenteRoutingRules}
                      onConfigChange={handleRoutingConfigChange}
                      onSave={handleSaveGerenteRoutingRules}
                      isSaving={isSaving}
                      isLoading={gerenteLoading}
                    />
                  )}

                  {/* Statistics Panel */}
                  {gerenteActiveConfigTab === 'stats' && (
                    <GerenteGeneralStats
                      config={editingGerenteConfig || gerenteConfig}
                      isLoading={gerenteLoading}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="mx-auto text-yellow-600 mb-4" size={32} />
                  <p className="text-gray-600 dark:text-gray-400">No se pudo cargar la configuración de GerenteGeneral</p>
                  {gerenteError && <p className="text-sm text-red-600 mt-2">{gerenteError}</p>}
                </div>
              )}
            </div>

            {/* Testing Section */}
            {gerenteConfig && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="text-purple-600 dark:text-purple-400" />
                  Sistema de Testing Interactivo
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Prueba el routing inteligente y la coordinación de agentes en tiempo real.
                </p>
                <GerenteGeneralTester />
              </div>
            )}
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          systemHealth ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="text-green-600 dark:text-green-400" />
                  Estado de Componentes
                </h2>
                
                <div className="space-y-4">
                  {systemHealth.components && Object.entries(systemHealth.components).map(([component, status]) => (
                    <div key={component} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status as string)}
                        <span className="font-medium text-gray-900 dark:text-white capitalize">{component.replace('_', ' ')}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status as string)}`}>
                        {status as string}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="text-blue-600 dark:text-blue-400" />
                  Información del Sistema
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {systemHealth.timestamp ? new Date(systemHealth.timestamp).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estado Global:</span>
                    <span className={`font-medium ${
                      systemHealth.status === 'healthy' ? 'text-green-600' : 
                      systemHealth.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {systemHealth.status}
                    </span>
                  </div>
                  
                  {systemHealth.metrics && (
                    <>
                      <hr className="my-3" />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Requests:</span>
                        <span className="font-medium">{systemHealth.metrics.total_requests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cached Responses:</span>
                        <span className="font-medium">{systemHealth.metrics.cached_responses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Error Rate:</span>
                        <span className="font-medium">{(systemHealth.metrics.error_rate * 100).toFixed(2)}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center py-8 text-gray-500">
                <Activity size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No hay información de estado disponible</p>
                <p className="text-sm mt-2">Verifica que el backend esté en funcionamiento.</p>
              </div>
            </div>
          )
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Cpu className="text-purple-600 dark:text-purple-400" />
              Métricas Avanzadas del Sistema
            </h2>
            
            {systemMetrics?.metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Prompt System */}
                {systemMetrics.metrics?.promptSystem && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="font-bold mb-3 text-blue-600 dark:text-blue-400">Sistema de Prompts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Templates:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.metrics.promptSystem.templates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Usage:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.metrics.promptSystem.totalUsage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {(systemMetrics.metrics.promptSystem.avgSuccessRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Memory System */}
                {systemMetrics.metrics?.memorySystem && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="font-bold mb-3 text-green-600 dark:text-green-400">Sistema de Memoria</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cached Patterns:</span>
                        <span className="font-medium">{systemMetrics.metrics.memorySystem.cachedPatterns}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cached Users:</span>
                        <span className="font-medium">{systemMetrics.metrics.memorySystem.cachedUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Learning Queue:</span>
                        <span className="font-medium">{systemMetrics.metrics.memorySystem.learningQueueSize}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* OpenAI Service */}
                {systemMetrics.metrics?.openaiService && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="font-bold mb-3 text-purple-600 dark:text-purple-400">Servicio OpenAI</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Requests:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.metrics.openaiService.totalRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cached:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.metrics.openaiService.cachedResponses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Error Rate:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {(systemMetrics.metrics.openaiService.errorRate * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg Response:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.metrics.openaiService.avgResponseTime}ms</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Cpu size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No hay métricas avanzadas disponibles</p>
                <p className="text-sm mt-2">Las métricas se mostrarán cuando el sistema esté en funcionamiento.</p>
              </div>
            )}
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <AgentSystemTester />
        )}
      </div>
    </div>
  );
};

export default AIAgentsDashboard;