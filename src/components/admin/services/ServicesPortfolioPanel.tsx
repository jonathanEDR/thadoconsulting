/**
 * 💼 Services Portfolio Panel
 * Panel de análisis de portafolio de servicios
 * Muestra: Métricas generales, gaps, bundling, SWOT
 * 
 * ⚡ Optimizaciones:
 * - React.memo() para evitar re-renders innecesarios
 * - useCallback para handlers
 */

import React, { useState, useEffect, memo } from 'react';
import { Briefcase, TrendingUp, Play, Loader2, AlertTriangle, Package, Target, Shield, DollarSign, Image, CheckCircle } from 'lucide-react';
import { useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';

const ServicesPortfolioPanel: React.FC = memo(() => {
  const { 
    isLoading, 
    portfolioAnalysis,
    analyzePortfolio,
    error,
    clearError,
    allServices
  } = useServicesCanvasContext();
  
  const [analyzing, setAnalyzing] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================

  const handleAnalyze = async () => {
    setAnalyzing(true);
    clearError();
    await analyzePortfolio();
    setAnalyzing(false);
  };

  // Auto-cargar al montar si hay servicios disponibles
  useEffect(() => {
    if (!portfolioAnalysis && !isLoading && allServices.length > 0) {
      handleAnalyze();
    }
  }, [allServices.length]);

  // ============================================
  // RENDER ESTADOS
  // ============================================

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error en análisis de portafolio</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar análisis
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analizando portafolio...
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Evaluando servicios, identificando gaps y generando recomendaciones estratégicas
        </p>
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!portfolioAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full text-center">
          <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Briefcase className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Análisis de Portafolio
          </h3>
          <p className="text-gray-600 mb-6">
            Obtén una visión completa de tu oferta de servicios, identifica oportunidades 
            y optimiza tu estrategia.
          </p>
          <button
            onClick={handleAnalyze}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Play className="h-5 w-5 mr-2" />
            Analizar Portafolio
          </button>
          
          {/* 🆕 Estado del contexto global */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-left">
            <p className="text-xs text-green-800">
              <strong>📊 Contexto global:</strong> {allServices.length} servicio{allServices.length !== 1 ? 's' : ''} disponible{allServices.length !== 1 ? 's' : ''} para análisis
            </p>
          </div>
          
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-xs text-blue-800">
              <strong>El análisis incluye:</strong> Métricas generales, gaps en tu oferta, 
              oportunidades de bundling y análisis SWOT de tu portafolio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER RESULTADOS
  // ============================================

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Análisis de Portafolio</h3>
          </div>
          <button
            onClick={handleAnalyze}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Re-analizar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Métricas Generales - Expandidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Total Servicios</span>
              <Target className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {portfolioAnalysis.totalServices}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Activos</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {portfolioAnalysis.activeServices || portfolioAnalysis.totalServices}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Con Precio</span>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {portfolioAnalysis.withPricing || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {portfolioAnalysis.totalServices > 0 
                ? Math.round((portfolioAnalysis.withPricing || 0) / portfolioAnalysis.totalServices * 100)
                : 0}%
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Con Imagen</span>
              <Image className="h-4 w-4 text-cyan-600" />
            </div>
            <p className="text-2xl font-bold text-cyan-600">
              {portfolioAnalysis.withImages || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {portfolioAnalysis.totalServices > 0 
                ? Math.round((portfolioAnalysis.withImages || 0) / portfolioAnalysis.totalServices * 100)
                : 0}%
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Categorías</span>
              <Package className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {Object.keys(portfolioAnalysis.categories || {}).length}
            </p>
          </div>
        </div>

        {/* Distribución por Categorías */}
        {portfolioAnalysis.categories && Object.keys(portfolioAnalysis.categories).length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 text-purple-600 mr-2" />
              Distribución por Categorías
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(portfolioAnalysis.categories).map(([catName, catData]) => (
                <div 
                  key={catName} 
                  className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{catName}</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {catData.count}
                    </span>
                  </div>
                  {catData.services && catData.services.length > 0 && (
                    <p className="text-xs text-gray-500 truncate">
                      {catData.services.slice(0, 2).map(s => typeof s === 'string' ? s : s.titulo).join(', ')}
                      {catData.services.length > 2 && ` +${catData.services.length - 2} más`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gaps Identificados - Detallado */}
        {portfolioAnalysis.gaps && portfolioAnalysis.gaps.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Problemas Detectados ({portfolioAnalysis.gaps.length})
            </h4>
            <div className="space-y-4">
              {portfolioAnalysis.gaps.map((gap: any, index: number) => (
                <div 
                  key={index} 
                  className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">
                      {gap.type === 'pricing' ? '💰 Precios' : 
                       gap.type === 'images' ? '🖼️ Imágenes' :
                       gap.type === 'seo' ? '🔍 SEO' :
                       gap.type === 'content' ? '📝 Contenido' :
                       gap.type === 'category_coverage' ? '📁 Categorías' :
                       gap.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      gap.affectedServices?.length > 5 
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {gap.affectedServices?.length 
                        ? `${gap.affectedServices.length} afectados` 
                        : 'Oportunidad'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-yellow-800 mb-3">{gap.description}</p>
                  
                  {/* Lista de servicios afectados */}
                  {gap.affectedServices && gap.affectedServices.length > 0 && (
                    <div className="mb-3 bg-yellow-100 rounded p-3">
                      <p className="text-xs font-semibold text-yellow-900 mb-2">
                        Servicios que requieren atención:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {gap.affectedServices.slice(0, 6).map((service: any, idx: number) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded"
                          >
                            {typeof service === 'string' ? service : service.titulo}
                          </span>
                        ))}
                        {gap.affectedServices.length > 6 && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-yellow-300 text-yellow-900 text-xs rounded font-medium">
                            +{gap.affectedServices.length - 6} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-green-100 border border-green-200 rounded p-2">
                    <p className="text-xs text-green-800">
                      <strong>💡 Solución sugerida:</strong> {gap.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Oportunidades de Bundling */}
        {portfolioAnalysis.bundlingOpportunities && portfolioAnalysis.bundlingOpportunities.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              Oportunidades de Paquetes ({portfolioAnalysis.bundlingOpportunities.length})
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {portfolioAnalysis.bundlingOpportunities.map((bundle, index) => (
                <div 
                  key={index} 
                  className="border border-blue-200 bg-blue-50 rounded-lg p-4"
                >
                  <h5 className="font-semibold text-blue-900 mb-2">
                    {bundle.suggestedName}
                  </h5>
                  <div className="mb-3">
                    <p className="text-xs text-blue-700 mb-1">Incluye:</p>
                    <ul className="space-y-1">
                      {bundle.services.map((service, idx) => (
                        <li key={idx} className="text-xs text-blue-800 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                    <div>
                      <p className="text-xs text-blue-700">Descuento sugerido</p>
                      <p className="text-sm font-semibold text-blue-900">{bundle.discount}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Ingresos proyectados</p>
                      <p className="text-sm font-semibold text-blue-900">
                        S/ {bundle.projectedRevenue.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Análisis SWOT - Detallado */}
        {portfolioAnalysis.swotAnalysis && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              Análisis SWOT Detallado
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Fortalezas */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-3 text-sm flex items-center">
                  💪 Fortalezas
                  {portfolioAnalysis.swotAnalysis.strengths.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-green-200 text-green-800 text-xs rounded">
                      {portfolioAnalysis.swotAnalysis.strengths.length}
                    </span>
                  )}
                </h5>
                {portfolioAnalysis.swotAnalysis.strengths.length === 0 ? (
                  <p className="text-xs text-green-600 italic">No se identificaron fortalezas destacables</p>
                ) : (
                  <ul className="space-y-3">
                    {portfolioAnalysis.swotAnalysis.strengths.map((item: any, idx: number) => (
                      <li key={idx} className="text-xs text-green-800">
                        {typeof item === 'string' ? (
                          <div className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <span>{item}</span>
                          </div>
                        ) : (
                          <div className="bg-green-100 rounded p-2">
                            <div className="font-semibold text-green-900 mb-1">{item.title}</div>
                            <p className="text-green-700">{item.detail}</p>
                            {item.metric && (
                              <div className="mt-1 inline-flex items-center px-2 py-0.5 bg-green-200 rounded text-green-800 text-xs font-medium">
                                {item.metric.value} {item.metric.unit}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Debilidades */}
              <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                <h5 className="font-semibold text-red-900 mb-3 text-sm flex items-center">
                  ⚠️ Debilidades
                  {portfolioAnalysis.swotAnalysis.weaknesses.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-200 text-red-800 text-xs rounded">
                      {portfolioAnalysis.swotAnalysis.weaknesses.length}
                    </span>
                  )}
                </h5>
                {portfolioAnalysis.swotAnalysis.weaknesses.length === 0 ? (
                  <p className="text-xs text-red-600 italic">¡Excelente! No se identificaron debilidades</p>
                ) : (
                  <ul className="space-y-3">
                    {portfolioAnalysis.swotAnalysis.weaknesses.map((item: any, idx: number) => (
                      <li key={idx} className="text-xs text-red-800">
                        {typeof item === 'string' ? (
                          <div className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <span>{item}</span>
                          </div>
                        ) : (
                          <div className="bg-red-100 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-red-900">{item.title}</span>
                              {item.severity && (
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                  item.severity === 'alta' ? 'bg-red-300 text-red-900' :
                                  item.severity === 'media' ? 'bg-yellow-200 text-yellow-800' :
                                  'bg-gray-200 text-gray-700'
                                }`}>
                                  {item.severity}
                                </span>
                              )}
                            </div>
                            <p className="text-red-700">{item.detail}</p>
                            {item.affectedCount && (
                              <div className="mt-1 text-red-600 font-medium">
                                {item.affectedCount} servicio{item.affectedCount !== 1 ? 's' : ''} afectado{item.affectedCount !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Oportunidades */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-3 text-sm flex items-center">
                  🎯 Oportunidades
                  {portfolioAnalysis.swotAnalysis.opportunities.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-200 text-blue-800 text-xs rounded">
                      {portfolioAnalysis.swotAnalysis.opportunities.length}
                    </span>
                  )}
                </h5>
                {portfolioAnalysis.swotAnalysis.opportunities.length === 0 ? (
                  <p className="text-xs text-blue-600 italic">No se identificaron oportunidades adicionales</p>
                ) : (
                  <ul className="space-y-3">
                    {portfolioAnalysis.swotAnalysis.opportunities.map((item: any, idx: number) => (
                      <li key={idx} className="text-xs text-blue-800">
                        {typeof item === 'string' ? (
                          <div className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <span>{item}</span>
                          </div>
                        ) : (
                          <div className="bg-blue-100 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-blue-900">{item.title}</span>
                              {item.potentialImpact && (
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                  item.potentialImpact === 'alto' ? 'bg-blue-300 text-blue-900' :
                                  item.potentialImpact === 'medio' ? 'bg-blue-200 text-blue-800' :
                                  'bg-gray-200 text-gray-700'
                                }`}>
                                  impacto {item.potentialImpact}
                                </span>
                              )}
                            </div>
                            <p className="text-blue-700">{item.detail}</p>
                            {item.actionRequired && (
                              <div className="mt-2 p-1.5 bg-blue-200 rounded">
                                <span className="font-medium">📋 Acción:</span> {item.actionRequired}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Amenazas */}
              <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                <h5 className="font-semibold text-orange-900 mb-3 text-sm flex items-center">
                  🛡️ Amenazas
                  {portfolioAnalysis.swotAnalysis.threats.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-orange-200 text-orange-800 text-xs rounded">
                      {portfolioAnalysis.swotAnalysis.threats.length}
                    </span>
                  )}
                </h5>
                {portfolioAnalysis.swotAnalysis.threats.length === 0 ? (
                  <p className="text-xs text-orange-600 italic">No se identificaron amenazas significativas</p>
                ) : (
                  <ul className="space-y-3">
                    {portfolioAnalysis.swotAnalysis.threats.map((item: any, idx: number) => (
                      <li key={idx} className="text-xs text-orange-800">
                        {typeof item === 'string' ? (
                          <div className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <span>{item}</span>
                          </div>
                        ) : (
                          <div className="bg-orange-100 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-orange-900">{item.title}</span>
                              {item.riskLevel && (
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                  item.riskLevel === 'alto' ? 'bg-red-300 text-red-900' :
                                  item.riskLevel === 'medio' ? 'bg-orange-300 text-orange-900' :
                                  'bg-gray-200 text-gray-700'
                                }`}>
                                  riesgo {item.riskLevel}
                                </span>
                              )}
                            </div>
                            <p className="text-orange-700">{item.detail}</p>
                            {item.mitigation && (
                              <div className="mt-2 p-1.5 bg-orange-200 rounded">
                                <span className="font-medium">🛠️ Mitigación:</span> {item.mitigation}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recomendaciones Estratégicas Detalladas */}
        {portfolioAnalysis.recommendations && portfolioAnalysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              Plan de Acción ({portfolioAnalysis.recommendations.length} recomendaciones)
            </h4>
            <div className="space-y-4">
              {portfolioAnalysis.recommendations.map((rec: any, index: number) => (
                <div 
                  key={index} 
                  className={`border rounded-lg overflow-hidden ${
                    typeof rec === 'string' 
                      ? 'border-gray-200' 
                      : rec.priority === 'crítica' ? 'border-red-300 bg-red-50' :
                        rec.priority === 'alta' ? 'border-orange-300 bg-orange-50' :
                        rec.priority === 'media' ? 'border-blue-300 bg-blue-50' :
                        'border-gray-300 bg-gray-50'
                  }`}
                >
                  {typeof rec === 'string' ? (
                    // Formato antiguo (string simple)
                    <div className="p-4">
                      <div className="flex items-start">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-sm text-gray-700 flex-1">{rec}</p>
                      </div>
                    </div>
                  ) : (
                    // Formato nuevo (objeto detallado)
                    <>
                      {/* Header con prioridad */}
                      <div className={`px-4 py-2 flex items-center justify-between ${
                        rec.priority === 'crítica' ? 'bg-red-200' :
                        rec.priority === 'alta' ? 'bg-orange-200' :
                        rec.priority === 'media' ? 'bg-blue-200' :
                        'bg-gray-200'
                      }`}>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${
                            rec.priority === 'crítica' ? 'bg-red-600 text-white' :
                            rec.priority === 'alta' ? 'bg-orange-600 text-white' :
                            rec.priority === 'media' ? 'bg-blue-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-semibold text-sm">{rec.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {rec.category && (
                            <span className="px-2 py-0.5 bg-white/50 rounded text-xs">
                              {rec.category === 'comercial' ? '💰' : 
                               rec.category === 'visual' ? '🖼️' :
                               rec.category === 'seo' ? '🔍' :
                               rec.category === 'contenido' ? '📝' :
                               rec.category === 'estrategia' ? '🎯' : '📋'} {rec.category}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            rec.priority === 'crítica' ? 'bg-red-600 text-white' :
                            rec.priority === 'alta' ? 'bg-orange-600 text-white' :
                            rec.priority === 'media' ? 'bg-blue-600 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                      </div>
                      
                      {/* Contenido */}
                      <div className="p-4 space-y-3">
                        {/* Descripción */}
                        <p className="text-sm text-gray-700">{rec.description}</p>
                        
                        {/* Métricas de impacto y esfuerzo */}
                        <div className="grid grid-cols-3 gap-2">
                          {rec.impact && (
                            <div className="bg-green-100 rounded p-2">
                              <p className="text-xs text-green-600 font-medium">📈 Impacto</p>
                              <p className="text-xs text-green-800">{rec.impact}</p>
                            </div>
                          )}
                          {rec.effort && (
                            <div className="bg-yellow-100 rounded p-2">
                              <p className="text-xs text-yellow-600 font-medium">⚡ Esfuerzo</p>
                              <p className="text-xs text-yellow-800 capitalize">{rec.effort}</p>
                            </div>
                          )}
                          {rec.timeEstimate && (
                            <div className="bg-purple-100 rounded p-2">
                              <p className="text-xs text-purple-600 font-medium">⏱️ Tiempo</p>
                              <p className="text-xs text-purple-800">{rec.timeEstimate}</p>
                            </div>
                          )}
                        </div>

                        {/* Lista de acciones */}
                        {rec.actions && rec.actions.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded p-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">✅ Pasos a seguir:</p>
                            <ol className="space-y-1">
                              {rec.actions.map((action: string, actionIdx: number) => (
                                <li key={actionIdx} className="text-xs text-gray-600 flex items-start">
                                  <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-200 text-gray-600 rounded-full text-xs mr-2 flex-shrink-0">
                                    {actionIdx + 1}
                                  </span>
                                  {action}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Servicios afectados */}
                        {rec.affectedServices && rec.affectedServices.length > 0 && (
                          <div className="bg-gray-100 rounded p-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              Servicios que requieren esta acción ({rec.affectedServices.length}):
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.affectedServices.slice(0, 5).map((service: any, sIdx: number) => (
                                <span 
                                  key={sIdx}
                                  className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-300 text-gray-700 text-xs rounded"
                                >
                                  {typeof service === 'string' ? service : service.titulo}
                                </span>
                              ))}
                              {rec.affectedServices.length > 5 && (
                                <span className="inline-flex items-center px-2 py-0.5 bg-gray-300 text-gray-700 text-xs rounded font-medium">
                                  +{rec.affectedServices.length - 5} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Agregar displayName para debugging
ServicesPortfolioPanel.displayName = 'ServicesPortfolioPanel';

export default ServicesPortfolioPanel;
