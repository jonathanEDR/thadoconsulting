/**
 * 🔍 SEO PREVIEW - Vista previa de cómo se verá en Google
 */
import React from 'react';

interface SEOPreviewProps {
  titulo: string;
  descripcion: string;
  url?: string;
}

export const SEOPreview: React.FC<SEOPreviewProps> = ({ titulo, descripcion, url }) => {
  // Generar URL de ejemplo
  const displayUrl = url || 'www.tuempresa.com/servicios/nombre-del-servicio';
  
  // Truncar título si excede 60 caracteres
  const displayTitulo = titulo.length > 60 
    ? titulo.substring(0, 57) + '...' 
    : titulo || 'Título del servicio - Tu Empresa';
  
  // Truncar descripción si excede 160 caracteres
  const displayDescripcion = descripcion.length > 160 
    ? descripcion.substring(0, 157) + '...' 
    : descripcion || 'Descripción del servicio que aparecerá en los resultados de búsqueda de Google...';

  // Validación de longitud
  const tituloStatus = titulo.length === 0 ? 'empty' : titulo.length > 60 ? 'error' : titulo.length > 50 ? 'warning' : 'good';
  const descripcionStatus = descripcion.length === 0 ? 'empty' : descripcion.length > 160 ? 'error' : descripcion.length > 150 ? 'warning' : 'good';

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <h3 className="text-lg font-semibold text-white">Vista Previa en Google</h3>
      </div>

      {/* Google Search Result Preview */}
      <div className="bg-white rounded-lg p-6 font-['Arial',sans-serif]">
        {/* Breadcrumb / URL */}
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="text-sm text-gray-600">
            <span className="text-[#202124]">{displayUrl}</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-1">
          <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer leading-snug">
            {displayTitulo}
          </h3>
        </div>

        {/* Description */}
        <div className="text-sm text-[#4d5156] leading-relaxed">
          {displayDescripcion}
        </div>
      </div>

      {/* Validation Indicators */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Título Status */}
        <div className={`p-3 rounded-lg border ${
          tituloStatus === 'empty' ? 'bg-gray-700/30 border-gray-600' :
          tituloStatus === 'error' ? 'bg-red-500/10 border-red-500/30' :
          tituloStatus === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
          'bg-green-500/10 border-green-500/30'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-300">Título SEO</span>
            {tituloStatus === 'error' && (
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {tituloStatus === 'warning' && (
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {tituloStatus === 'good' && (
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className={`text-xs ${
            tituloStatus === 'error' ? 'text-red-400' :
            tituloStatus === 'warning' ? 'text-yellow-400' :
            tituloStatus === 'good' ? 'text-green-400' :
            'text-gray-400'
          }`}>
            {titulo.length}/60 caracteres
            {tituloStatus === 'error' && ' - Demasiado largo'}
            {tituloStatus === 'warning' && ' - Casi al límite'}
            {tituloStatus === 'good' && ' - Óptimo'}
            {tituloStatus === 'empty' && ' - Vacío'}
          </div>
        </div>

        {/* Descripción Status */}
        <div className={`p-3 rounded-lg border ${
          descripcionStatus === 'empty' ? 'bg-gray-700/30 border-gray-600' :
          descripcionStatus === 'error' ? 'bg-red-500/10 border-red-500/30' :
          descripcionStatus === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
          'bg-green-500/10 border-green-500/30'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-300">Descripción SEO</span>
            {descripcionStatus === 'error' && (
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {descripcionStatus === 'warning' && (
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {descripcionStatus === 'good' && (
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className={`text-xs ${
            descripcionStatus === 'error' ? 'text-red-400' :
            descripcionStatus === 'warning' ? 'text-yellow-400' :
            descripcionStatus === 'good' ? 'text-green-400' :
            'text-gray-400'
          }`}>
            {descripcion.length}/160 caracteres
            {descripcionStatus === 'error' && ' - Demasiado largo'}
            {descripcionStatus === 'warning' && ' - Casi al límite'}
            {descripcionStatus === 'good' && ' - Óptimo'}
            {descripcionStatus === 'empty' && ' - Vacío'}
          </div>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-300">
            <p className="font-medium mb-1">💡 Tips para mejor SEO:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-xs">
              <li>Título: 50-60 caracteres es ideal</li>
              <li>Descripción: 150-160 caracteres es ideal</li>
              <li>Incluye palabras clave relevantes al inicio</li>
              <li>Sé descriptivo y atractivo para captar clics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOPreview;
