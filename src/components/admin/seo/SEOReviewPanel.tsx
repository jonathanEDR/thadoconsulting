/**
 * 👁️ SEO Review Panel
 * Panel de auditoría SEO con persistencia en base de datos
 * - Carga auditoría guardada automáticamente
 * - Botón para re-analizar y reemplazar auditoría existente
 * - Sin filtros innecesarios (eliminados por ser inútiles)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  RefreshCw, 
  Download,
  Clock
} from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';
import seoAgentService from '../../../services/seoAgentService';

interface SEOReviewPanelProps {
  content?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  postId?: string;
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface ReviewResult {
  overall_score: number;
  checklist: ChecklistItem[];
  critical_issues: string[];
  warnings: string[];
  recommendations: string[];
  seo_summary: {
    title_optimization: number;
    content_quality: number;
    keywords_usage: number;
    meta_tags: number;
    readability: number;
    structure: number;
  };
  lastAuditAt?: string;
  auditVersion?: number;
}

const SEOReviewPanel: React.FC<SEOReviewPanelProps> = ({
  content,
  title,
  description,
  keywords,
  postId
}) => {
  const { isLoading, error, clearError, reviewContent, context } = useSEOCanvasContext();
  
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Obtener postId del contexto si no se pasa como prop
  const currentPostId = postId || context?.blogPostId;

  // Cargar auditoría guardada al montar o cuando cambie el postId
  const loadSavedAudit = useCallback(async () => {
    if (!currentPostId) return;

    setIsLoadingAudit(true);
    try {
      const response = await seoAgentService.getSEOAudit(currentPostId);
      
      if (response.success && (response as any).hasAudit && response.data) {
        setReviewResult(response.data);
        console.log('📋 Auditoría SEO cargada:', response.data);
      }
    } catch (err) {
      console.error('Error cargando auditoría:', err);
    } finally {
      setIsLoadingAudit(false);
    }
  }, [currentPostId]);

  useEffect(() => {
    loadSavedAudit();
  }, [loadSavedAudit]);

  // Realizar nueva auditoría (reemplaza la existente)
  const handleReview = async () => {
    if (!content || !title) {
      return;
    }

    clearError();
    
    try {
      const result = await reviewContent(content, title, description, keywords);
      
      if (result) {
        const reviewData: ReviewResult = result as any;
        setReviewResult(reviewData);
        
        // Auto-guardar si hay postId
        if (currentPostId) {
          await handleSaveAudit(reviewData);
        }
      }
    } catch (error) {
      console.error('Error reviewing content:', error);
    }
  };

  // Guardar auditoría en BD
  const handleSaveAudit = async (auditToSave?: ReviewResult) => {
    const dataToSave = auditToSave || reviewResult;
    if (!currentPostId || !dataToSave) {
      setSaveMessage('No se puede guardar: falta ID del post o datos de auditoría');
      return;
    }

    setSaveMessage(null);
    
    try {
      const response = await seoAgentService.saveSEOAudit(currentPostId, dataToSave);
      
      if (response.success) {
        setSaveMessage('✅ Auditoría guardada');
        
        // Actualizar versión en el estado
        if (response.data) {
          setReviewResult(prev => prev ? {
            ...prev,
            lastAuditAt: response.data.lastAuditAt,
            auditVersion: response.data.auditVersion
          } : null);
        }
      } else {
        setSaveMessage(`❌ ${response.error}`);
      }
    } catch (err) {
      setSaveMessage('❌ Error guardando');
      console.error('Error saving audit:', err);
    }
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20';
      case 'fail':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    };

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleExportReport = () => {
    if (!reviewResult) return;

    const report = `
# Reporte de Auditoría SEO

**Fecha:** ${new Date().toLocaleDateString()}
**Puntuación General:** ${reviewResult.overall_score}/100

## Resumen de Optimización

- Título: ${reviewResult.seo_summary.title_optimization}/100
- Calidad de Contenido: ${reviewResult.seo_summary.content_quality}/100
- Uso de Keywords: ${reviewResult.seo_summary.keywords_usage}/100
- Meta Tags: ${reviewResult.seo_summary.meta_tags}/100
- Legibilidad: ${reviewResult.seo_summary.readability}/100
- Estructura: ${reviewResult.seo_summary.structure}/100

## Problemas Críticos
${reviewResult.critical_issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

## Advertencias
${reviewResult.warnings.map((warning, i) => `${i + 1}. ${warning}`).join('\n')}

## Recomendaciones
${reviewResult.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

## Checklist Detallado

${reviewResult.checklist.map(item => `
### ${item.category} - ${item.item}
- Estado: ${item.status.toUpperCase()}
- Prioridad: ${item.priority.toUpperCase()}
- ${item.message}
`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center mb-2">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-300 font-medium">Error en la revisión</span>
          </div>
          <p className="text-sm text-red-700 dark:text-red-400 mb-3">{error}</p>
          <button
            onClick={handleReview}
            className="px-3 py-1.5 bg-red-600 dark:bg-red-700 text-white text-sm rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
          >
            Reintentar revisión
          </button>
        </div>
      </div>
    );
  }

  if (!content || !title) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 p-4">
        <Eye className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Auditoría SEO</h3>
        <p className="text-center text-sm max-w-md">
          Proporciona contenido y título para realizar una auditoría completa de SEO con checklist detallado.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Ejecutando auditoría SEO...</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
          Analizando contenido, estructura, keywords y mejores prácticas
        </p>
      </div>
    );
  }

  // Estado de carga de auditoría guardada
  if (isLoadingAudit) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Cargando auditoría...</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Verificando auditoría guardada
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con controles - SIN filtros innecesarios */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Auditoría SEO
            </h3>
            {/* Info de versión y fecha */}
            {reviewResult?.lastAuditAt && (
              <span className="ml-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(reviewResult.lastAuditAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {reviewResult.auditVersion && (
                  <span className="ml-2 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    v{reviewResult.auditVersion}
                  </span>
                )}
              </span>
            )}
            {/* Mensaje de guardado */}
            {saveMessage && (
              <span className={`ml-3 text-xs ${saveMessage.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {saveMessage}
              </span>
            )}
          </div>
          <button
            onClick={handleReview}
            disabled={isLoading}
            className="px-3 py-1.5 bg-purple-600 dark:bg-purple-700 text-white text-sm rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 flex items-center"
            title={reviewResult ? 'Ejecutar nueva auditoría y reemplazar la existente' : 'Ejecutar auditoría SEO'}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {reviewResult ? 'Re-analizar' : 'Auditar ahora'}
          </button>
        </div>
      </div>

      {/* Contenido del review */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {reviewResult ? (
          <>
            {/* Score General y Acciones */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className={`text-4xl font-bold ${getScoreColor(reviewResult.overall_score)}`}>
                      {reviewResult.overall_score}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Puntuación General</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {reviewResult.critical_issues.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Críticos</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                        {reviewResult.warnings.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Advertencias</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExportReport}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Resumen de categorías */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Resumen de Optimización</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(reviewResult.seo_summary).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(value)}`}>
                      {value}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Problemas Críticos */}
            {reviewResult.critical_issues.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <h4 className="font-medium text-red-900 dark:text-red-300 mb-3 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Problemas Críticos
                </h4>
                <ul className="space-y-2">
                  {reviewResult.critical_issues.map((issue, index) => (
                    <li key={index} className="flex items-start text-sm text-red-800 dark:text-red-300">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advertencias */}
            {reviewResult.warnings.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Advertencias
                </h4>
                <ul className="space-y-2">
                  {reviewResult.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start text-sm text-yellow-800 dark:text-yellow-300">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checklist Detallado */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Checklist SEO Detallado</h4>
              {reviewResult.checklist.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-4 ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-3 flex-1">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            {item.category}
                          </span>
                          {getPriorityBadge(item.priority)}
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-white">{item.item}</h5>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 ml-8">{item.message}</p>
                </div>
              ))}
            </div>

            {/* Recomendaciones */}
            {reviewResult.recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Recomendaciones
                </h4>
                <ul className="space-y-2">
                  {reviewResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start text-sm text-blue-800 dark:text-blue-300">
                      <span className="font-bold mr-2">→</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            <Eye className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm text-center max-w-xs">
              {currentPostId 
                ? 'No hay auditoría guardada para este post. Haz clic en "Auditar ahora" para crear una.'
                : 'Haz clic en "Auditar ahora" para ejecutar la auditoría SEO'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOReviewPanel;