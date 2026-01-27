/**
 * 🎯 Panel de Análisis SEO
 * Componente para análisis SEO en tiempo real durante la edición
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Lightbulb,
  Target
} from 'lucide-react';
import { useSEOAnalysis, useKeywordResearch } from '../../../hooks/blog';
// import type { SEOAnalysis, SEOPreview } from '../../../services/blog/blogSeoApi';

interface SEOAnalysisPanelProps {
  content: string;
  title: string;
  description?: string;
  keywords?: string[];
  onChange?: (recommendations: any) => void;
}

export const SEOAnalysisPanel: React.FC<SEOAnalysisPanelProps> = ({
  content,
  title,
  description,
  keywords = [],
  onChange
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'preview' | 'keywords'>('analysis');
  const [targetKeywords, setTargetKeywords] = useState<string[]>(keywords);
  const [keywordInput, setKeywordInput] = useState('');

  const { 
    analysis, 
    preview, 
    loading, 
    error, 
    analyzeContent, 
    getPreview 
  } = useSEOAnalysis('', { liveAnalysis: true });

  const { research, researchKeywords } = useKeywordResearch();

  // Análisis automático cuando cambia el contenido
  useEffect(() => {
    if (content && title) {
      analyzeContent(content, title, description);
    }
  }, [content, title, description, analyzeContent]);

  // Vista previa automática cuando cambian title o description
  useEffect(() => {
    if (title || description) {
      getPreview(title, description);
    }
  }, [title, description, getPreview]);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !targetKeywords.includes(keywordInput.trim())) {
      const newKeywords = [...targetKeywords, keywordInput.trim()];
      setTargetKeywords(newKeywords);
      setKeywordInput('');
      onChange?.(newKeywords);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = targetKeywords.filter(k => k !== keyword);
    setTargetKeywords(newKeywords);
    onChange?.(newKeywords);
  };

  const handleKeywordResearch = async () => {
    if (title) {
      await researchKeywords(title, { 
        language: 'es', 
        country: 'ES', 
        includeQuestions: true 
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'MEDIUM':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'LOW':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-white" />
            <h3 className="font-semibold text-white">Análisis SEO</h3>
          </div>
          {analysis && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}/100
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Análisis
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Vista Previa
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'keywords'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Keywords
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Analizando...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'analysis' && analysis && !loading && (
          <div className="space-y-6">
            {/* Puntuación general */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreColor(analysis.overallScore)} text-2xl font-bold mb-2`}>
                {analysis.overallScore}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Puntuación SEO General</p>
            </div>

            {/* Análisis por categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Título</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {analysis.titleAnalysis.length} caracteres
                  </span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    analysis.titleAnalysis.optimal ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  }`}>
                    {analysis.titleAnalysis.optimal ? 'Óptimo' : 'Mejorar'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Descripción</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {analysis.descriptionAnalysis.length} caracteres
                  </span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    analysis.descriptionAnalysis.optimal ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  }`}>
                    {analysis.descriptionAnalysis.optimal ? 'Óptimo' : 'Mejorar'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contenido</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{analysis.contentAnalysis.wordCount} palabras</p>
                  <p>Nivel: {analysis.contentAnalysis.readingLevel}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estructura</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>H1: {analysis.headingStructure.h1Count}</p>
                  <p>H2: {analysis.headingStructure.h2Count}</p>
                  <p>H3: {analysis.headingStructure.h3Count}</p>
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recomendaciones</h4>
              <div className="space-y-2">
                {analysis.recommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{rec.issue}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rec.suggestion}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {rec.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && preview && !loading && (
          <div className="space-y-6">
            {/* Vista previa de Google */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Vista previa en Google</h4>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="text-blue-600 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer">
                  {preview.googlePreview.title}
                </div>
                <div className="text-green-600 dark:text-green-400 text-sm mt-1">
                  {preview.googlePreview.url}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  {preview.googlePreview.description}
                  {preview.googlePreview.isTruncated && (
                    <span className="text-orange-500"> ...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Vista previa de Facebook */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Vista previa en Facebook</h4>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                {preview.facebookPreview.image && (
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <img 
                      src={preview.facebookPreview.image} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-gray-600 dark:text-gray-400 text-xs uppercase mb-1">
                    {preview.facebookPreview.url}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {preview.facebookPreview.title}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {preview.facebookPreview.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Vista previa de Twitter */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Vista previa en Twitter</h4>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                {preview.twitterPreview.image && (
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <img 
                      src={preview.twitterPreview.image} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {preview.twitterPreview.title}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {preview.twitterPreview.description}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {preview.twitterPreview.cardType}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="space-y-6">
            {/* Agregar keywords */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Palabras Clave Objetivo</h4>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  placeholder="Agregar palabra clave..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {targetKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Investigación de keywords */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Investigación de Keywords</h4>
                <button
                  onClick={handleKeywordResearch}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  Investigar
                </button>
              </div>
              
              {research && (
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900 dark:text-white text-sm">Sugerencias:</h5>
                  {research.suggestions.slice(0, 5).map((suggestion: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {suggestion.keyword}
                        </span>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Volumen: {suggestion.searchVolume} | Dificultad: {suggestion.difficulty}% | Relevancia: {suggestion.relevance}%
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!targetKeywords.includes(suggestion.keyword)) {
                            setTargetKeywords([...targetKeywords, suggestion.keyword]);
                          }
                        }}
                        className="ml-3 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};