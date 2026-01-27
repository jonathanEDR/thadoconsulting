/**
 * ServicesAgentConfigPanel - Panel de configuración específico para ServicesAgent
 * 
 * Permite configurar todas las capacidades del agente:
 * - Basic: Configuración general (timeout, tokens, temperatura)
 * - Analysis: Configuración de análisis (scoring, thresholds, profundidad)
 * - Generation: Configuración de generación (creatividad, validaciones)
 * - Pricing: Configuración de pricing (estrategias, márgenes, descuentos)
 * - Optimization: Configuración de optimización (SEO, conversión, contenido)
 * - Permissions: Permisos del agente (CRUD, pricing, analytics)
 */

import React, { useState, useEffect } from 'react';
// import { useAuth } from '@clerk/clerk-react';
import { 
  Settings, 
  DollarSign, 
  Sparkles, 
  Target, 
  Lock,
  BarChart3,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import type { 
  ServicesAgentFullConfig
} from '../../services/agentConfigService';
import { agentConfigService } from '../../services/agentConfigService';
import {
  GenerationConfigSection,
  PricingConfigSection,
  OptimizationConfigSection,
  PermissionsConfigSection
} from './ServicesAgentConfigSections';

interface ServicesAgentConfigPanelProps {
  onClose: () => void;
}

const ServicesAgentConfigPanel: React.FC<ServicesAgentConfigPanelProps> = ({ onClose }) => {
  // const { getToken } = useAuth();
  
  // Estados
  const [config, setConfig] = useState<ServicesAgentFullConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('basic');

  // Cargar configuración al montar
  useEffect(() => {
    loadConfig();
  }, []);

  /**
   * Cargar configuración desde el backend
   */
  const loadConfig = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading ServicesAgent configuration...');
      
      const response = await agentConfigService.getConfig('services');
      
      console.log('📡 API Response:', response);
      
      if (response.success && response.data) {
        console.log('✅ ServicesAgent config loaded successfully:', response.data);
        setConfig(response.data as ServicesAgentFullConfig);
      } else {
        console.warn('⚠️ No agent config found, using defaults');
        setConfig(getDefaultConfig());
      }
    } catch (err) {
      console.error('❌ Error loading config:', err);
      setError('Error al cargar configuración');
      setConfig(getDefaultConfig());
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener configuración por defecto
   */
  const getDefaultConfig = (): ServicesAgentFullConfig => {
    return {
      agentName: 'services',
      enabled: true,
      config: {
        timeout: 30,
        maxTokens: 2000,
        temperature: 0.7,
        minDescriptionLength: 100,
        optimalDescriptionLength: 300,
        maxDescriptionLength: 1000,
        qualityScoreThreshold: 75,
        completenessThreshold: 80,
        creativityLevel: 'balanced',
        considerMarketRates: true,
        includeValueAnalysis: true,
        suggestDiscounts: true,
        autoSuggestImprovements: true,
        includeSEORecommendations: true,
        includeConversionTips: true,
        canCreateServices: true,
        canEditServices: true,
        canDeleteServices: false,
        canManagePricing: true,
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
          name: 'Web Scuti',
          type: 'services_platform',
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
      },
      servicesConfig: {
        analysis: {
          minDescriptionLength: 100,
          optimalDescriptionLength: 300,
          maxDescriptionLength: 1000,
          seoScoreThreshold: 70,
          qualityScoreThreshold: 75,
          completenessThreshold: 80,
          includeCompetitorAnalysis: true,
          includeSEOAnalysis: true,
          includePricingAnalysis: true,
          includeGapAnalysis: true,
          analysisDepth: 'standard'
        },
        generation: {
          temperature: 0.7,
          maxTokens: 2000,
          topP: 1,
          frequencyPenalty: 0.1,
          presencePenalty: 0.1,
          creativityLevel: 'balanced',
          includeExamples: true,
          includeSEOTags: true,
          includeMetadata: true,
          generateMultipleVariations: false,
          variationsCount: 3,
          validateBeforeCreate: true,
          autoOptimizeSEO: true,
          suggestImprovements: true
        },
        pricing: {
          defaultStrategy: 'value-based',
          considerMarketRates: true,
          includeCompetitorPricing: true,
          includeValueAnalysis: true,
          minimumMargin: 20,
          optimalMargin: 40,
          premiumMargin: 60,
          suggestDiscounts: true,
          maxDiscountPercentage: 30,
          bundleDiscount: 15,
          analyzeBundleOpportunities: true,
          defaultCurrency: 'PEN',
          supportedCurrencies: ['USD', 'EUR', 'MXN', 'PEN'],
          pricingTypes: ['fijo', 'desde', 'rango', 'personalizado', 'consultar']
        },
        optimization: {
          types: ['seo', 'description', 'structure', 'conversion', 'complete'],
          autoSuggestImprovements: true,
          autoApplyMinorFixes: false,
          includeSEORecommendations: true,
          optimizeMetaTags: true,
          optimizeHeadings: true,
          optimizeKeywords: true,
          includeConversionTips: true,
          includeCTAOptimization: true,
          includeValuePropositionTips: true,
          improveReadability: true,
          improveClarity: true,
          enhanceBenefits: true,
          suggestABTests: true,
          generateVariations: true
        },
        permissions: {
          canCreateServices: true,
          canCreatePackages: true,
          canEditServices: true,
          canEditPackages: true,
          canEditPricing: true,
          canEditSEO: true,
          canDeleteServices: false,
          canDeletePackages: false,
          canPublishServices: false,
          canUnpublishServices: false,
          canManagePricing: true,
          canSuggestDiscounts: true,
          canAccessAnalytics: true,
          canViewCompetitors: true
        },
        chat: {
          maxContextLength: 10,
          includeServiceContext: true,
          includePortfolioContext: true,
          maxResponseLength: 500,
          includeRecommendations: true,
          includeExamples: true,
          includeNextSteps: true,
          adaptToUserExpertise: true,
          rememberPreferences: true,
          suggestActions: true,
          suggestQuestions: true
        }
      }
    };
  };

  /**
   * Guardar configuración
   */
  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    setSaved(false);
    setError(null);
    
    try {
      console.log('💾 Saving ServicesAgent configuration...');
      
      const response = await agentConfigService.updateConfig('services', config);
      
      if (response.success) {
        console.log('✅ Configuration saved successfully');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        
        // Actualizar con la respuesta del servidor
        if (response.data) {
          setConfig(response.data as ServicesAgentFullConfig);
        }
      } else {
        console.error('❌ Failed to save configuration:', response.error);
        setError(response.error || 'Error al guardar configuración');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error('❌ Error saving configuration:', err);
      setError('Error al guardar configuración');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Resetear configuración a valores por defecto
   */
  const handleReset = async () => {
    if (!window.confirm('¿Estás seguro de que quieres restaurar la configuración a valores por defecto?')) {
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      console.log('🔄 Resetting ServicesAgent configuration...');
      
      const response = await agentConfigService.resetConfig('services');
      
      if (response.success && response.data) {
        console.log('✅ Configuration reset successfully');
        setConfig(response.data as ServicesAgentFullConfig);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('❌ Failed to reset configuration:', response.error);
        setError(response.error || 'Error al resetear configuración');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error('❌ Error resetting configuration:', err);
      setError('Error al resetear configuración');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Actualizar configuración (handler genérico)
   */
  const updateConfig = (section: string, key: string, value: any) => {
    setConfig(prev => {
      if (!prev) return null;
      
      if (section === 'servicesConfig') {
        // Para configuraciones específicas de ServicesAgent
        return {
          ...prev,
          servicesConfig: {
            ...prev.servicesConfig,
            [key]: typeof value === 'object' && value !== null
              ? value
              : {
                  ...(prev.servicesConfig?.[key as keyof typeof prev.servicesConfig] || {}),
                  ...value
                }
          }
        };
      } else {
        // Para configuraciones generales
        return {
          ...prev,
          [section]: typeof value === 'object' && value !== null
            ? value
            : {
                ...(prev[section as keyof ServicesAgentFullConfig] as any),
                [key]: value
              }
        };
      }
    });
  };

  /**
   * Actualizar sub-configuración
   */
  const updateSubConfig = (_mainSection: string, subSection: string, key: string, value: any) => {
    setConfig(prev => {
      if (!prev || !prev.servicesConfig) return prev;
      
      return {
        ...prev,
        servicesConfig: {
          ...prev.servicesConfig,
          [subSection]: {
            ...(prev.servicesConfig[subSection as keyof typeof prev.servicesConfig] || {}),
            [key]: value
          }
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="text-purple-600" size={28} />
            Configuración ServicesAgent
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gestión inteligente de servicios y pricing
          </p>
        </div>
        
        <div className="flex gap-2">
          {saved && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Guardado</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg max-w-xs">
              <AlertTriangle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Restaurar valores por defecto"
          >
            <RotateCcw size={16} />
            Resetear
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'basic', label: 'Básico', icon: Settings },
            { id: 'analysis', label: 'Análisis', icon: BarChart3 },
            { id: 'generation', label: 'Generación', icon: Sparkles },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'optimization', label: 'Optimización', icon: Target },
            { id: 'permissions', label: 'Permisos', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        
        {/* Basic Tab */}
        {activeSubTab === 'basic' && config && (
          <BasicConfigSection config={config} updateConfig={updateConfig} />
        )}

        {/* Analysis Tab */}
        {activeSubTab === 'analysis' && config && (
          <AnalysisConfigSection config={config} updateSubConfig={updateSubConfig} />
        )}

        {/* Generation Tab */}
        {activeSubTab === 'generation' && config && (
          <GenerationConfigSection config={config} updateSubConfig={updateSubConfig} />
        )}

        {/* Pricing Tab */}
        {activeSubTab === 'pricing' && config && (
          <PricingConfigSection config={config} updateSubConfig={updateSubConfig} />
        )}

        {/* Optimization Tab */}
        {activeSubTab === 'optimization' && config && (
          <OptimizationConfigSection config={config} updateSubConfig={updateSubConfig} />
        )}

        {/* Permissions Tab */}
        {activeSubTab === 'permissions' && config && (
          <PermissionsConfigSection config={config} updateSubConfig={updateSubConfig} />
        )}
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTES PARA CADA SECCIÓN
// ============================================

/**
 * Sección: Configuración Básica
 */
const BasicConfigSection: React.FC<{
  config: ServicesAgentFullConfig;
  updateConfig: (section: string, key: string, value: any) => void;
}> = ({ config, updateConfig }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <Settings size={20} className="text-purple-600" />
        Configuración Básica
      </div>

      {/* Agente Habilitado */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Agente Habilitado</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Activa o desactiva el ServicesAgent en el sistema
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig('root', 'enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {/* Temperature */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Temperature
          <span className="text-gray-500 ml-2">({config.config.temperature})</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.config.temperature}
          onChange={(e) => updateConfig('config', 'temperature', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Controla la creatividad del agente (0 = conservador, 1 = muy creativo)
        </p>
      </div>

      {/* Max Tokens */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Max Tokens
        </label>
        <input
          type="number"
          min="500"
          max="4000"
          step="100"
          value={config.config.maxTokens}
          onChange={(e) => updateConfig('config', 'maxTokens', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Máximo número de tokens por respuesta
        </p>
      </div>

      {/* Timeout */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Timeout (segundos)
        </label>
        <input
          type="number"
          min="10"
          max="120"
          step="5"
          value={config.config.timeout}
          onChange={(e) => updateConfig('config', 'timeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tiempo máximo de espera para respuestas del agente
        </p>
      </div>

      {/* Creativity Level */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nivel de Creatividad
        </label>
        <select
          value={config.config.creativityLevel}
          onChange={(e) => updateConfig('config', 'creativityLevel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Baja - Respuestas conservadoras</option>
          <option value="balanced">Balanceada - Equilibrio ideal</option>
          <option value="high">Alta - Respuestas creativas</option>
          <option value="very_high">Muy Alta - Máxima creatividad</option>
        </select>
      </div>

      {/* Auto-optimizations */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Optimizaciones Automáticas</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.config.autoSuggestImprovements}
            onChange={(e) => updateConfig('config', 'autoSuggestImprovements', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Sugerir mejoras automáticamente
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.config.includeSEORecommendations}
            onChange={(e) => updateConfig('config', 'includeSEORecommendations', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir recomendaciones SEO
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.config.includeConversionTips}
            onChange={(e) => updateConfig('config', 'includeConversionTips', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir tips de conversión
          </span>
        </label>
      </div>
    </div>
  );
};

/**
 * Sección: Configuración de Análisis
 */
const AnalysisConfigSection: React.FC<{
  config: ServicesAgentFullConfig;
  updateSubConfig: (main: string, sub: string, key: string, value: any) => void;
}> = ({ config, updateSubConfig }) => {
  const analysisConfig = config.servicesConfig?.analysis;

  if (!analysisConfig) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <BarChart3 size={20} className="text-purple-600" />
        Configuración de Análisis
      </div>

      {/* Longitudes de Descripción */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Longitudes de Descripción</h4>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mínima: {analysisConfig.minDescriptionLength} caracteres
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={analysisConfig.minDescriptionLength}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'minDescriptionLength', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Óptima: {analysisConfig.optimalDescriptionLength} caracteres
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={analysisConfig.optimalDescriptionLength}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'optimalDescriptionLength', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Máxima: {analysisConfig.maxDescriptionLength} caracteres
          </label>
          <input
            type="range"
            min="500"
            max="3000"
            step="100"
            value={analysisConfig.maxDescriptionLength}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'maxDescriptionLength', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Thresholds de Scoring */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Umbrales de Puntuación</h4>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SEO Score Threshold: {analysisConfig.seoScoreThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={analysisConfig.seoScoreThreshold}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'seoScoreThreshold', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quality Score Threshold: {analysisConfig.qualityScoreThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={analysisConfig.qualityScoreThreshold}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'qualityScoreThreshold', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Completeness Threshold: {analysisConfig.completenessThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={analysisConfig.completenessThreshold}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'completenessThreshold', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Profundidad de Análisis */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Profundidad de Análisis
        </label>
        <select
          value={analysisConfig.analysisDepth}
          onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'analysisDepth', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="quick">Rápido - Análisis básico</option>
          <option value="standard">Estándar - Análisis moderado</option>
          <option value="thorough">Profundo - Análisis detallado</option>
          <option value="exhaustive">Exhaustivo - Análisis completo</option>
        </select>
      </div>

      {/* Opciones de Análisis */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Incluir en el Análisis</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={analysisConfig.includeCompetitorAnalysis}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'includeCompetitorAnalysis', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Análisis de competencia
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={analysisConfig.includeSEOAnalysis}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'includeSEOAnalysis', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Análisis SEO
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={analysisConfig.includePricingAnalysis}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'includePricingAnalysis', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Análisis de pricing
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={analysisConfig.includeGapAnalysis}
            onChange={(e) => updateSubConfig('servicesConfig', 'analysis', 'includeGapAnalysis', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Detección de gaps
          </span>
        </label>
      </div>
    </div>
  );
};

/**
 * Continuará en el siguiente mensaje...
 */

export default ServicesAgentConfigPanel;
