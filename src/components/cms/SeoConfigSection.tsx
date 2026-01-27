import React from 'react';
import type { PageData } from '../../types/cms';

interface SeoConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const SeoConfigSection: React.FC<SeoConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const addKeyword = () => {
    const currentKeywords = pageData.seo.keywords || [];
    console.log('🔍 [SEO] Agregando keyword');
    updateContent('seo.keywords', [...currentKeywords, '']);
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = pageData.seo.keywords || [];
    const updatedKeywords = currentKeywords.filter((_: any, i: number) => i !== index);
    console.log('🔍 [SEO] Removiendo keyword en índice:', index);
    updateContent('seo.keywords', updatedKeywords);
  };

  const updateKeyword = (index: number, value: string) => {
    const currentKeywords = [...(pageData.seo.keywords || [])];
    currentKeywords[index] = value;
    console.log('🔍 [SEO] Actualizando keyword:', value);
    updateContent('seo.keywords', currentKeywords);
  };

  // 🔥 NUEVO: Función helper para actualizar campos SEO con logging
  const handleSeoFieldUpdate = (field: string, value: string) => {
    console.log(`🔍 [SEO] Actualizando ${field}:`, value);
    updateContent(`seo.${field}`, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        🔍 Configuración SEO
      </h2>

      {/* 🔥 NUEVO: Banner de Preview en Tiempo Real */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
            🎯 Preview en Tiempo Real
          </span>
        </div>
        <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
          Los cambios se aplican inmediatamente en el título de la pestaña del navegador. Guarda para aplicar en el sitio público.
        </p>
      </div>

      <div className="space-y-6">
        {/* Meta Tags Básicos */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            📝 Meta Tags Básicos
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título (Title)
              </label>
              <input
                type="text"
                value={pageData.seo.metaTitle || ''}
                onChange={(e) => handleSeoFieldUpdate('metaTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Título de la página (50-60 caracteres)"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(pageData.seo.metaTitle || '').length}/60 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción (Meta Description)
              </label>
              <textarea
                value={pageData.seo.metaDescription || ''}
                onChange={(e) => handleSeoFieldUpdate('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Descripción que aparecerá en los resultados de búsqueda (150-160 caracteres)"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(pageData.seo.metaDescription || '').length}/160 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Palabras Clave */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            🏷️ Palabras Clave
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Palabras clave relevantes para el contenido
              </p>
              <button
                onClick={addKeyword}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors duration-200"
              >
                ➕ Agregar
              </button>
            </div>
            
            <div className="space-y-2">
              {(pageData.seo.keywords || []).map((keyword: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="palabra clave"
                  />
                  <button
                    onClick={() => removeKeyword(index)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            
            {(!pageData.seo.keywords || pageData.seo.keywords.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No hay palabras clave configuradas
              </p>
            )}
          </div>
        </div>

        {/* Open Graph (Redes Sociales) */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            📱 Open Graph (Redes Sociales)
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título (og:title)
                </label>
                <input
                  type="text"
                  value={pageData.seo.ogTitle || ''}
                  onChange={(e) => handleSeoFieldUpdate('ogTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="Título para redes sociales"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter Card
                </label>
                <select
                  value={pageData.seo.twitterCard || 'summary_large_image'}
                  onChange={(e) => handleSeoFieldUpdate('twitterCard', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción (og:description)
              </label>
              <textarea
                value={pageData.seo.ogDescription || ''}
                onChange={(e) => handleSeoFieldUpdate('ogDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="Descripción para redes sociales"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imagen (og:image)
              </label>
              <input
                type="url"
                value={pageData.seo.ogImage || ''}
                onChange={(e) => handleSeoFieldUpdate('ogImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="URL de la imagen para redes sociales"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoConfigSection;