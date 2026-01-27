/**
 * 💰 Services Pricing Panel
 * Panel de estrategias de pricing para servicios
 * Analiza y sugiere estrategias de precio basadas en:
 * - Tipo de servicio
 * - Mercado objetivo
 * - Competencia
 * - Valor percibido
 * 
 * ⚡ Optimizaciones:
 * - React.memo() para evitar re-renders innecesarios
 * - useCallback para handlers
 */

import React, { useState, memo } from 'react';
import { DollarSign, TrendingUp, Play, Loader2, CheckCircle, XCircle, AlertCircle, Target } from 'lucide-react';
import { useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';

const ServicesPricingPanel: React.FC = memo(() => {
  const { 
    isLoading, 
    currentPricingStrategies,
    currentService,
    analyzePricing,
    suggestPricing,
    error,
    clearError 
  } = useServicesCanvasContext();
  
  const [analyzing, setAnalyzing] = useState(false);
  const [mode, setMode] = useState<'analyze' | 'suggest'>('analyze');

  // ============================================
  // HANDLERS
  // ============================================

  const handleAnalyze = async () => {
    if (!currentService || !currentService.serviceId) return;
    
    setAnalyzing(true);
    setMode('analyze');
    clearError();
    await analyzePricing(currentService);
    setAnalyzing(false);
  };

  const handleSuggest = async () => {
    if (!currentService) return;
    
    setAnalyzing(true);
    setMode('suggest');
    clearError();
    await suggestPricing(currentService);
    setAnalyzing(false);
  };

  // ============================================
  // UTILIDADES
  // ============================================

  const formatPrice = (price: number, currency?: string) => {
    const curr = currency || currentService?.currency || 'PEN';
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return formatter.format(price);
  };

  const getComparisonColor = (strategyPrice: number, currentPrice: number) => {
    if (!currentPrice) return 'text-gray-600';
    const diff = ((strategyPrice - currentPrice) / currentPrice) * 100;
    if (diff > 10) return 'text-green-600';
    if (diff < -10) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getComparisonText = (strategyPrice: number, currentPrice: number) => {
    if (!currentPrice) return null;
    const diff = ((strategyPrice - currentPrice) / currentPrice) * 100;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}% vs actual`;
  };

  // ============================================
  // RENDER ESTADOS
  // ============================================

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error en análisis de pricing</h3>
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

  if (!currentService) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <div className="p-4 bg-purple-100 rounded-full mb-4">
          <DollarSign className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Análisis de Pricing
        </h3>
        <p className="text-center text-sm text-gray-600 max-w-md mb-6">
          Necesitas tener información del servicio para analizar pricing. 
          Completa los datos básicos del servicio primero.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Te ayudaremos a definir estrategias de precio basadas en 
            el tipo de servicio, valor percibido y comparativas de mercado.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {mode === 'analyze' ? 'Analizando estrategias...' : 'Generando sugerencias...'}
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          {mode === 'analyze' 
            ? 'Evaluando precio actual y generando estrategias alternativas'
            : 'Analizando mercado y generando recomendaciones de pricing'
          }
        </p>
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!currentPricingStrategies || currentPricingStrategies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full text-center">
          <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Target className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Estrategias de Pricing
          </h3>
          <p className="text-gray-600 mb-6">
            Servicio: <strong>{currentService.serviceTitle}</strong><br/>
            {currentService.currentPrice > 0 && (
              <span className="text-sm">
                Precio actual: <strong>{formatPrice(currentService.currentPrice)}</strong>
              </span>
            )}
          </p>
          
          <div className="flex gap-3 justify-center">
            {currentService.serviceId && (
              <button
                onClick={handleAnalyze}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="h-5 w-5 mr-2" />
                Analizar Precio
              </button>
            )}
            
            <button
              onClick={handleSuggest}
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:border-purple-700 transition-all"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Sugerir Estrategia
            </button>
          </div>
          
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
            <p className="text-xs text-gray-600 mb-2">
              <strong>Analizar Precio:</strong> Evalúa tu precio actual y genera estrategias alternativas
            </p>
            <p className="text-xs text-gray-600">
              <strong>Sugerir Estrategia:</strong> Genera recomendaciones basadas en el tipo de servicio
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER ESTRATEGIAS
  // ============================================

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Estrategias de Pricing</h3>
          </div>
          <div className="flex gap-2">
            {currentService.serviceId && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center disabled:opacity-50"
              >
                <Target className="h-4 w-4 mr-1" />
                Analizar
              </button>
            )}
            <button
              onClick={handleSuggest}
              disabled={analyzing}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center disabled:opacity-50"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Sugerir
            </button>
          </div>
        </div>
        
        {/* Precio actual */}
        {currentService.currentPrice > 0 && (
          <div className="mt-3 flex items-center text-sm text-gray-600">
            <span>Precio actual:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {formatPrice(currentService.currentPrice)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentPricingStrategies.map((strategy, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 p-5 shadow-sm hover:shadow-md transition-all"
            >
              {/* Header de la estrategia */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {strategy.name}
                  </h4>
                  {strategy.recommended && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      Recomendado
                    </span>
                  )}
                </div>
                
                {/* Precio de la estrategia */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-600">
                    {formatPrice(strategy.price)}
                  </span>
                  {currentService.currentPrice > 0 && (
                    <span className={`text-sm font-medium ${getComparisonColor(strategy.price, currentService.currentPrice)}`}>
                      {getComparisonText(strategy.price, currentService.currentPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Justificación */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {strategy.rationale}
                </p>
              </div>

              {/* Pros */}
              {strategy.pros && strategy.pros.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                    Ventajas
                  </h5>
                  <ul className="space-y-1">
                    {strategy.pros.map((pro, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {strategy.cons && strategy.cons.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                    <XCircle className="h-3 w-3 text-red-600 mr-1" />
                    Consideraciones
                  </h5>
                  <ul className="space-y-1">
                    {strategy.cons.map((con, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips adicionales */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Recomendaciones Generales
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Considera el valor percibido por tus clientes, no solo los costos</li>
            <li>• Analiza la competencia pero no bases tu precio únicamente en ella</li>
            <li>• Ofrece diferentes niveles de servicio (básico, estándar, premium)</li>
            <li>• Revisa y ajusta tus precios periódicamente según resultados</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

// Agregar displayName para debugging
ServicesPricingPanel.displayName = 'ServicesPricingPanel';

export default ServicesPricingPanel;
