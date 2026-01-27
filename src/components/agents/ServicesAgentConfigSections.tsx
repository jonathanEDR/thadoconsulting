/**
 * ServicesAgentConfigSections - Componentes adicionales para el panel de configuración
 * Contiene las secciones: Generation, Pricing, Optimization, Permissions
 */

import React from 'react';
import { Sparkles, DollarSign, Target, Lock } from 'lucide-react';
import type { ServicesAgentFullConfig } from '../../services/agentConfigService';

/**
 * Sección: Configuración de Generación
 */
export const GenerationConfigSection: React.FC<{
  config: ServicesAgentFullConfig;
  updateSubConfig: (main: string, sub: string, key: string, value: any) => void;
}> = ({ config, updateSubConfig }) => {
  const generationConfig = config.servicesConfig?.generation;

  if (!generationConfig) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <Sparkles size={20} className="text-purple-600" />
        Configuración de Generación
      </div>

      {/* Temperatura */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Temperature: {generationConfig.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={generationConfig.temperature}
          onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'temperature', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Controla la creatividad en la generación de contenido
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
          value={generationConfig.maxTokens}
          onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'maxTokens', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Creativity Level */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nivel de Creatividad
        </label>
        <select
          value={generationConfig.creativityLevel}
          onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'creativityLevel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Baja</option>
          <option value="balanced">Balanceada</option>
          <option value="high">Alta</option>
          <option value="very_high">Muy Alta</option>
        </select>
      </div>

      {/* Variaciones */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generationConfig.generateMultipleVariations}
            onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'generateMultipleVariations', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Generar múltiples variaciones
          </span>
        </label>

        {generationConfig.generateMultipleVariations && (
          <div className="ml-7 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Número de variaciones: {generationConfig.variationsCount}
            </label>
            <input
              type="range"
              min="2"
              max="5"
              step="1"
              value={generationConfig.variationsCount}
              onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'variationsCount', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        )}
      </div>

      {/* Opciones */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Opciones de Generación</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generationConfig.includeExamples}
            onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'includeExamples', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir ejemplos
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generationConfig.includeSEOTags}
            onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'includeSEOTags', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir tags SEO
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generationConfig.includeMetadata}
            onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'includeMetadata', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir metadata
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generationConfig.validateBeforeCreate}
            onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'validateBeforeCreate', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Validar antes de crear
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generationConfig.autoOptimizeSEO}
            onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'autoOptimizeSEO', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Auto-optimizar SEO
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generationConfig.suggestImprovements}
            onChange={(e) => updateSubConfig('servicesConfig', 'generation', 'suggestImprovements', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Sugerir mejoras
          </span>
        </label>
      </div>
    </div>
  );
};

/**
 * Sección: Configuración de Pricing
 */
export const PricingConfigSection: React.FC<{
  config: ServicesAgentFullConfig;
  updateSubConfig: (main: string, sub: string, key: string, value: any) => void;
}> = ({ config, updateSubConfig }) => {
  const pricingConfig = config.servicesConfig?.pricing;

  if (!pricingConfig) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <DollarSign size={20} className="text-purple-600" />
        Configuración de Pricing
      </div>

      {/* Estrategia por Defecto */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Estrategia por Defecto
        </label>
        <select
          value={pricingConfig.defaultStrategy}
          onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'defaultStrategy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="competitive">Competitiva</option>
          <option value="premium">Premium</option>
          <option value="penetration">Penetración</option>
          <option value="value-based">Basada en Valor</option>
        </select>
      </div>

      {/* Márgenes */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Márgenes</h4>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Margen Mínimo: {pricingConfig.minimumMargin}%
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={pricingConfig.minimumMargin}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'minimumMargin', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Margen Óptimo: {pricingConfig.optimalMargin}%
          </label>
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={pricingConfig.optimalMargin}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'optimalMargin', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Margen Premium: {pricingConfig.premiumMargin}%
          </label>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={pricingConfig.premiumMargin}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'premiumMargin', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Descuentos */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Descuentos</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pricingConfig.suggestDiscounts}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'suggestDiscounts', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Sugerir descuentos
          </span>
        </label>

        {pricingConfig.suggestDiscounts && (
          <>
            <div className="space-y-2 ml-7">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descuento Máximo: {pricingConfig.maxDiscountPercentage}%
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={pricingConfig.maxDiscountPercentage}
                onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'maxDiscountPercentage', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2 ml-7">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descuento en Paquetes: {pricingConfig.bundleDiscount}%
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={pricingConfig.bundleDiscount}
                onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'bundleDiscount', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </>
        )}
      </div>

      {/* Moneda */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Moneda por Defecto
        </label>
        <select
          value={pricingConfig.defaultCurrency}
          onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'defaultCurrency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        >
          {pricingConfig.supportedCurrencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      {/* Opciones de Análisis */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Análisis de Pricing</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pricingConfig.considerMarketRates}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'considerMarketRates', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Considerar precios de mercado
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pricingConfig.includeCompetitorPricing}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'includeCompetitorPricing', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir pricing de competidores
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pricingConfig.includeValueAnalysis}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'includeValueAnalysis', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir análisis de valor
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pricingConfig.analyzeBundleOpportunities}
            onChange={(e) => updateSubConfig('servicesConfig', 'pricing', 'analyzeBundleOpportunities', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Analizar oportunidades de paquetes
          </span>
        </label>
      </div>
    </div>
  );
};

/**
 * Sección: Configuración de Optimización
 */
export const OptimizationConfigSection: React.FC<{
  config: ServicesAgentFullConfig;
  updateSubConfig: (main: string, sub: string, key: string, value: any) => void;
}> = ({ config, updateSubConfig }) => {
  const optimizationConfig = config.servicesConfig?.optimization;

  if (!optimizationConfig) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <Target size={20} className="text-purple-600" />
        Configuración de Optimización
      </div>

      {/* Opciones Generales */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Opciones Generales</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.autoSuggestImprovements}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'autoSuggestImprovements', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Sugerir mejoras automáticamente
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.autoApplyMinorFixes}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'autoApplyMinorFixes', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Aplicar correcciones menores automáticamente
          </span>
        </label>
      </div>

      {/* Optimización SEO */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Optimización SEO</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.includeSEORecommendations}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'includeSEORecommendations', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir recomendaciones SEO
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.optimizeMetaTags}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'optimizeMetaTags', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Optimizar meta tags
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.optimizeHeadings}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'optimizeHeadings', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Optimizar encabezados
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.optimizeKeywords}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'optimizeKeywords', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Optimizar keywords
          </span>
        </label>
      </div>

      {/* Optimización de Conversión */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Optimización de Conversión</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.includeConversionTips}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'includeConversionTips', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Incluir tips de conversión
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.includeCTAOptimization}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'includeCTAOptimization', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Optimizar llamadas a la acción (CTA)
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.includeValuePropositionTips}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'includeValuePropositionTips', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Optimizar propuesta de valor
          </span>
        </label>
      </div>

      {/* Mejora de Contenido */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Mejora de Contenido</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.improveReadability}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'improveReadability', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Mejorar legibilidad
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.improveClarity}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'improveClarity', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Mejorar claridad
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.enhanceBenefits}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'enhanceBenefits', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Mejorar beneficios
          </span>
        </label>
      </div>

      {/* A/B Testing */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">A/B Testing</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.suggestABTests}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'suggestABTests', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Sugerir tests A/B
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optimizationConfig.generateVariations}
            onChange={(e) => updateSubConfig('servicesConfig', 'optimization', 'generateVariations', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Generar variaciones
          </span>
        </label>
      </div>
    </div>
  );
};

/**
 * Sección: Configuración de Permisos
 */
export const PermissionsConfigSection: React.FC<{
  config: ServicesAgentFullConfig;
  updateSubConfig: (main: string, sub: string, key: string, value: any) => void;
}> = ({ config, updateSubConfig }) => {
  const permissionsConfig = config.servicesConfig?.permissions;

  if (!permissionsConfig) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <Lock size={20} className="text-purple-600" />
        Configuración de Permisos
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Importante:</strong> Estos permisos controlan qué acciones puede realizar el agente automáticamente. 
          Cambios sensibles como eliminación están deshabilitados por seguridad.
        </p>
      </div>

      {/* Creación */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Creación</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canCreateServices}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canCreateServices', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede crear servicios
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canCreatePackages}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canCreatePackages', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede crear paquetes
          </span>
        </label>
      </div>

      {/* Edición */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Edición</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canEditServices}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canEditServices', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede editar servicios
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canEditPackages}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canEditPackages', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede editar paquetes
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canEditPricing}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canEditPricing', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede editar pricing
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canEditSEO}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canEditSEO', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede editar SEO
          </span>
        </label>
      </div>

      {/* Eliminación (Deshabilitado por seguridad) */}
      <div className="space-y-3 opacity-50">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Eliminación (Deshabilitado por seguridad)
        </h4>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={permissionsConfig.canDeleteServices}
            disabled
            className="w-4 h-4 text-gray-400 rounded cursor-not-allowed"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Puede eliminar servicios (siempre deshabilitado)
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={permissionsConfig.canDeletePackages}
            disabled
            className="w-4 h-4 text-gray-400 rounded cursor-not-allowed"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Puede eliminar paquetes (siempre deshabilitado)
          </span>
        </label>
      </div>

      {/* Publicación */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Publicación</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canPublishServices}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canPublishServices', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede publicar servicios
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canUnpublishServices}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canUnpublishServices', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede despublicar servicios
          </span>
        </label>
      </div>

      {/* Gestión de Pricing */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Gestión de Pricing</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canManagePricing}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canManagePricing', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede gestionar pricing
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canSuggestDiscounts}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canSuggestDiscounts', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede sugerir descuentos
          </span>
        </label>
      </div>

      {/* Acceso a Datos */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Acceso a Datos</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canAccessAnalytics}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canAccessAnalytics', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede acceder a analytics
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={permissionsConfig.canViewCompetitors}
            onChange={(e) => updateSubConfig('servicesConfig', 'permissions', 'canViewCompetitors', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Puede ver datos de competidores
          </span>
        </label>
      </div>
    </div>
  );
};
