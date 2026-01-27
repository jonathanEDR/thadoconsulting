/**
 * 🛠️ SEO Toolbar
 * Barra de herramientas con acciones rápidas del SEO Canvas
 * Solo disponible para Admin Dashboard
 * 
 * NOTA: Las tabs de navegación fueron movidas a SEOCanvasModal.tsx
 * Este componente ahora solo contiene las acciones (Exportar, Guardar, Limpiar, etc.)
 */

import React, { useState } from 'react';
import { Download, Trash2, Save, Zap } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

const SEOToolbar: React.FC = () => {
  const { 
    canUseAdvancedFeatures,
    currentAnalysis,
    chatHistory,
    clearChatHistory,
    clearAnalysis,
    context,
    quickActions
  } = useSEOCanvasContext();

  const [exportLoading, setExportLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Función para exportar resultados
  const handleExport = () => {
    setExportLoading(true);
    
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        context: context,
        analysis: currentAnalysis,
        chatHistory: chatHistory,
        postTitle: context?.postTitle || 'Sin título'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `seo-analysis-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Análisis exportado correctamente');
    } catch (error) {
      console.error('❌ Error al exportar:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // Función para guardar en localStorage
  const handleSave = () => {
    setSaveLoading(true);
    
    try {
      const saveData = {
        timestamp: new Date().toISOString(),
        context: context,
        analysis: currentAnalysis,
        chatHistory: chatHistory
      };

      const savedAnalyses = JSON.parse(localStorage.getItem('seo_analyses') || '[]');
      savedAnalyses.unshift(saveData);
      
      // Mantener solo los últimos 10 análisis
      if (savedAnalyses.length > 10) {
        savedAnalyses.pop();
      }
      
      localStorage.setItem('seo_analyses', JSON.stringify(savedAnalyses));
      console.log('✅ Análisis guardado en historial local');
    } catch (error) {
      console.error('❌ Error al guardar:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  // Función para limpiar todo
  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el contenido? Esta acción no se puede deshacer.')) {
      clearChatHistory();
      clearAnalysis();
      console.log('✅ Todo limpiado correctamente');
    }
  };

  // Contar análisis guardados
  const getSavedCount = () => {
    try {
      const saved = localStorage.getItem('seo_analyses');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  };

  const savedCount = getSavedCount();
  const hasContent = currentAnalysis || chatHistory.length > 0;

  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        {/* Acciones principales */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Acciones:</span>
          
          {/* Botón Exportar */}
          <button
            onClick={handleExport}
            disabled={!hasContent}
            className={`
              flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-200
              ${hasContent
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-transparent'
              }
            `}
            title="Exportar resultados a JSON"
          >
            <Download size={14} />
            <span>{exportLoading ? 'Exportando...' : 'Exportar'}</span>
          </button>
          
          {/* Botón Guardar */}
          <button
            onClick={handleSave}
            disabled={!hasContent}
            className={`
              flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-200
              ${hasContent
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-transparent'
              }
            `}
            title="Guardar en historial local"
          >
            <Save size={14} />
            <span>{saveLoading ? 'Guardando...' : 'Guardar'}</span>
          </button>
          
          {/* Botón Limpiar */}
          <button
            onClick={handleClearAll}
            disabled={!hasContent}
            className={`
              flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-200
              ${hasContent
                ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-transparent'
              }
            `}
            title="Limpiar todo"
          >
            <Trash2 size={14} />
            <span>Limpiar</span>
          </button>
          
          {/* Botón Análisis Rápido - Solo si hay contenido y permisos */}
          {canUseAdvancedFeatures && context?.currentContent && (
            <button
              onClick={quickActions?.analyzeCurrentContent}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-sm"
              title="Análisis rápido del contenido actual"
            >
              <Zap size={14} />
              <span>Análisis Rápido</span>
            </button>
          )}
        </div>

        {/* Indicador de elementos guardados */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {savedCount > 0 ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {savedCount} análisis guardados
            </span>
          ) : (
            'Sin análisis guardados'
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOToolbar;