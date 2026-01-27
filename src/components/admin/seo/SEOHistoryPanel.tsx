/**
 * 📜 SEO History Panel
 * Panel para visualizar historial de análisis guardados
 */

import React, { useState, useEffect } from 'react';
import { History, Trash2, Download, Clock, FileText } from 'lucide-react';

interface SavedAnalysis {
  timestamp: string;
  mode: string;
  context?: any;
  analysis?: any;
  chatHistory?: any[];
}

const SEOHistoryPanel: React.FC = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = () => {
    try {
      const saved = localStorage.getItem('seo_analyses');
      if (saved) {
        setAnalyses(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const deleteAnalysis = (index: number) => {
    const updated = analyses.filter((_, i) => i !== index);
    setAnalyses(updated);
    localStorage.setItem('seo_analyses', JSON.stringify(updated));
  };

  const exportAnalysis = (analysis: SavedAnalysis, index: number) => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `seo-analysis-${index + 1}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
      setAnalyses([]);
      localStorage.removeItem('seo_analyses');
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      chat: 'Chat',
      analysis: 'Análisis',
      structure: 'Estructura',
      review: 'Revisión'
    };
    return labels[mode] || mode;
  };

  const getModeColor = (mode: string) => {
    const colors: Record<string, string> = {
      chat: 'bg-blue-100 text-blue-700',
      analysis: 'bg-green-100 text-green-700',
      structure: 'bg-purple-100 text-purple-700',
      review: 'bg-orange-100 text-orange-700'
    };
    return colors[mode] || 'bg-gray-100 text-gray-700';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Ver historial de análisis"
      >
        <History size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <History className="mr-2" size={20} />
            Historial de Análisis
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        {analyses.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">{analyses.length} análisis guardados</span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Lista de análisis */}
      <div className="flex-1 overflow-y-auto p-4">
        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 text-sm">No hay análisis guardados</p>
            <p className="text-gray-400 text-xs mt-1">
              Usa el botón "Guardar" en el toolbar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((analysis, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                {/* Header del análisis */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getModeColor(analysis.mode)}`}>
                      {getModeLabel(analysis.mode)}
                    </span>
                    {analysis.context?.postTitle && (
                      <p className="text-sm font-medium text-gray-900 mt-2 line-clamp-2">
                        {analysis.context.postTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Clock size={12} className="mr-1" />
                  {formatDate(analysis.timestamp)}
                </div>

                {/* Información resumida */}
                <div className="text-xs text-gray-600 mb-3 space-y-1">
                  {analysis.chatHistory && analysis.chatHistory.length > 0 && (
                    <div>💬 {analysis.chatHistory.length} mensajes</div>
                  )}
                  {analysis.analysis && (
                    <div>📊 Análisis completado</div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => exportAnalysis(analysis, index)}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    <Download size={12} />
                    <span>Exportar</span>
                  </button>
                  <button
                    onClick={() => deleteAnalysis(index)}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOHistoryPanel;
