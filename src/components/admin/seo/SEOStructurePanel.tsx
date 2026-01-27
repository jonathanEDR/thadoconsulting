/**
 * 📋 SEO Structure Panel
 * Panel para generar estructuras de contenido optimizadas para SEO
 */

import React, { useState } from 'react';
import { FileText, Loader2, Copy, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

interface SEOStructurePanelProps {
  topic?: string;
  keywords?: string[];
  targetAudience?: string;
}

interface StructureSection {
  heading: string;
  level: number;
  description: string;
  keywords: string[];
  estimated_words: number;
}

interface ContentStructure {
  title: string;
  meta_description: string;
  introduction: string;
  sections: StructureSection[];
  conclusion: string;
  cta: string;
  estimated_reading_time: number;
  total_words: number;
}

const SEOStructurePanel: React.FC<SEOStructurePanelProps> = ({
  topic,
  keywords = [],
  targetAudience
}) => {
  const { isLoading, error, clearError, generateStructure } = useSEOCanvasContext();
  
  const [structureTopic, setStructureTopic] = useState(topic || '');
  const [structureKeywords, setStructureKeywords] = useState<string>(keywords.join(', '));
  const [audience, setAudience] = useState(targetAudience || '');
  const [contentType, setContentType] = useState<'article' | 'guide' | 'tutorial' | 'listicle'>('article');
  const [generatedStructure, setGeneratedStructure] = useState<ContentStructure | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerateStructure = async () => {
    if (!structureTopic.trim()) {
      return;
    }

    clearError();
    
    try {
      // Llamar al endpoint /seo/structure
      const keywordsArray = structureKeywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      const result = await generateStructure(
        structureTopic,
        keywordsArray,
        audience || undefined
      );

      if (result) {
        // Transformar respuesta del backend al formato esperado
        const structureData: ContentStructure = result as any;
        setGeneratedStructure(structureData);
      }
    } catch (error) {
      console.error('Error generating structure:', error);
    }
  };

  const handleCopyStructure = () => {
    if (!generatedStructure) return;

    const structureText = `
TÍTULO: ${generatedStructure.title}

META DESCRIPCIÓN: ${generatedStructure.meta_description}

INTRODUCCIÓN:
${generatedStructure.introduction}

${generatedStructure.sections.map(section => `
${'#'.repeat(section.level)} ${section.heading}
Descripción: ${section.description}
Keywords: ${section.keywords.join(', ')}
Palabras estimadas: ${section.estimated_words}
`).join('\n')}

CONCLUSIÓN:
${generatedStructure.conclusion}

CTA: ${generatedStructure.cta}

Tiempo de lectura estimado: ${generatedStructure.estimated_reading_time} min
Total palabras: ${generatedStructure.total_words}
    `.trim();

    navigator.clipboard.writeText(structureText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadStructure = () => {
    if (!generatedStructure) return;

    const structureText = `
# ${generatedStructure.title}

**Meta Descripción:** ${generatedStructure.meta_description}

## Introducción
${generatedStructure.introduction}

${generatedStructure.sections.map(section => `
${'#'.repeat(section.level)} ${section.heading}
*${section.description}*
**Keywords:** ${section.keywords.join(', ')}
**Palabras estimadas:** ${section.estimated_words}
`).join('\n')}

## Conclusión
${generatedStructure.conclusion}

**CTA:** ${generatedStructure.cta}

---
*Tiempo de lectura: ${generatedStructure.estimated_reading_time} min | Palabras: ${generatedStructure.total_words}*
    `.trim();

    const blob = new Blob([structureText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estructura-${structureTopic.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header con formulario */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Generador de Estructura SEO
          </h3>
        </div>

        {/* Formulario */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tema del contenido *
            </label>
            <input
              type="text"
              value={structureTopic}
              onChange={(e) => setStructureTopic(e.target.value)}
              placeholder="Ej: Marketing Digital para Pequeñas Empresas"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keywords (separadas por coma)
            </label>
            <input
              type="text"
              value={structureKeywords}
              onChange={(e) => setStructureKeywords(e.target.value)}
              placeholder="marketing digital, SEO, redes sociales"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de contenido
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="article">Artículo</option>
                <option value="guide">Guía</option>
                <option value="tutorial">Tutorial</option>
                <option value="listicle">Lista</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audiencia objetivo
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Principiantes"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateStructure}
            disabled={isLoading || !structureTopic.trim()}
            className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando estructura...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generar Estructura
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
          </div>
        )}
      </div>

      {/* Contenido - Estructura generada */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {generatedStructure ? (
          <div className="space-y-4">
            {/* Acciones */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCopyStructure}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm flex items-center"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadStructure}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Descargar MD
              </button>
            </div>

            {/* Título y meta */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Título</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{generatedStructure.title}</h2>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Meta Descripción</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{generatedStructure.meta_description}</p>
              </div>
            </div>

            {/* Introducción */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase">Introducción</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{generatedStructure.introduction}</p>
            </div>

            {/* Secciones */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Estructura del contenido</h4>
              {generatedStructure.sections.map((section, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-semibold text-gray-900 dark:text-white ${
                      section.level === 2 ? 'text-lg' : 'text-base'
                    }`}>
                      <span className="text-blue-600 dark:text-blue-400 mr-2">{`H${section.level}`}</span>
                      {section.heading}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                      ~{section.estimated_words} palabras
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                  {section.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {section.keywords.map((keyword, kidx) => (
                        <span key={kidx} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Conclusión y CTA */}
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <span className="text-xs font-medium text-green-700 dark:text-green-400 uppercase">Conclusión</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{generatedStructure.conclusion}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase">Call to Action</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{generatedStructure.cta}</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{generatedStructure.total_words}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Palabras totales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{generatedStructure.estimated_reading_time} min</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Tiempo de lectura</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Generador de Estructura</h3>
            <p className="text-center text-sm max-w-md">
              Ingresa un tema y keywords para generar una estructura de contenido optimizada para SEO.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOStructurePanel;
