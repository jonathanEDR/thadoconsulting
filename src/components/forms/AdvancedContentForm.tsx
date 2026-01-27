/**
 * 🎨 AdvancedContentForm - Componente especializado para Contenido Avanzado
 * 
 * Maneja exclusivamente:
 * - descripcionRica (Editor de texto rico)
 * - videoUrl (URL de video promocional)
 * - galeriaImagenes (Galería de imágenes)
 * - contenidoAdicional (Información adicional)
 * 
 * Ventajas:
 * ✅ Sin race conditions - Estado aislado
 * ✅ Lógica específica y enfocada
 * ✅ Fácil testing y mantenimiento
 * ✅ Reutilizable en otros formularios
 */

import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, Control } from 'react-hook-form';
import { MultipleImageGallery } from '../common/MultipleImageGallery';

// Nota: RichTextEditor será reemplazado por textarea normal por ahora
// TODO: Integrar RichTextEditor cuando sea necesario

// ============================================
// INTERFACES
// ============================================

interface AdvancedContentFormProps {
  // React Hook Form integration
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  control?: Control<any>;
  
  // Estado de carga
  isLoading?: boolean;
  
  // Configuración
  config?: {
    maxImages?: number;
    maxVideoUrlLength?: number;
    maxDescripcionRicaLength?: number;
    maxContenidoAdicionalLength?: number;
  };
  
  // Nueva función unificada de IA
  onAutoCompleteAdvanced?: () => Promise<void>;
  
  // Estado de generación IA unificado
  isGeneratingAdvanced?: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const AdvancedContentForm: React.FC<AdvancedContentFormProps> = ({
  register,
  watch,
  setValue,
  isLoading = false,
  config = {
    maxImages: 8,
    maxVideoUrlLength: 500,
    maxDescripcionRicaLength: 3000,
    maxContenidoAdicionalLength: 2000,
  },
  onAutoCompleteAdvanced,
  isGeneratingAdvanced = false,
}) => {
  
  // ============================================
  // ESTADO LOCAL Y WATCHERS
  // ============================================
  
  const descripcionRica = watch('descripcionRica') || '';
  const galeriaImagenes = watch('galeriaImagenes') || [];
  const contenidoAdicional = watch('contenidoAdicional') || '';
  
  // ============================================
  // EFECTOS DE CARGA INICIAL
  // ============================================
  
  // ✅ NO NECESITAMOS useEffect para initialData porque register() 
  // ya sincroniza automáticamente con el formulario padre
  // El useEffect anterior causaba infinite loops
  
  // ✅ CORRECCIÓN: Eliminado useEffect de onDataChange
  // No es necesario porque register() ya sincroniza los datos
  // con react-hook-form automáticamente. El useEffect causaba
  // re-renders innecesarios y posibles conflictos de estado.
  
  // ============================================
  // HANDLERS
  // ============================================
  
  const handleImagenesChange = (images: string[]) => {
    setValue('galeriaImagenes', images);
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-4 lg:py-8 px-4 lg:px-6">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-4 lg:p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto py-4 lg:py-8 px-4 lg:px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
          ✨ Contenido Avanzado
          <span className="text-xs lg:text-sm font-normal text-gray-600 dark:text-gray-400">(Opcional)</span>
        </h2>
        
        {/* Botón de Autocompletar IA Unificado (Sutil y Compacto) */}
        {onAutoCompleteAdvanced && (
          <div className="mb-4 flex items-center justify-end">
            <button
              type="button"
              onClick={onAutoCompleteAdvanced}
              disabled={isGeneratingAdvanced}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 dark:hover:from-purple-800/50 dark:hover:to-blue-800/50 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generar contenido avanzado automático"
            >
              {isGeneratingAdvanced ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border border-purple-600 border-t-transparent"></div>
                  <span className="text-xs">Generando...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">✨</span>
                  <span className="text-xs font-medium">Mejorar con IA</span>
                </>
              )}
            </button>
          </div>
        )}
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Personaliza la página de detalles del servicio con contenido rico y multimedia
        </p>
        
        <div className="space-y-6">
          
          {/* Descripción Rica */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Descripción Rica
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Usa markdown para dar formato: **negrita**, *cursiva*, # títulos, - listas
            </p>
            
            <textarea
              {...register('descripcionRica')}
              placeholder="Descripción detallada con formato..."
              rows={8}
              className={`w-full bg-gray-700/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 resize-none ${
                descripcionRica.length > (config.maxDescripcionRicaLength! * 0.9)
                  ? 'border-red-500 focus:ring-red-500'
                  : descripcionRica.length > (config.maxDescripcionRicaLength! * 0.8)
                  ? 'border-yellow-500 focus:ring-yellow-500'
                  : 'border-gray-600 focus:ring-purple-500'
              }`}
              maxLength={config.maxDescripcionRicaLength}
            />
            
            <div className="flex justify-between items-center mt-2 text-xs">
              <div className="text-gray-500">
                📝 Formato disponible: **texto** = negrita, *texto* = cursiva, # Título = Título grande, - Lista = Lista
              </div>
              <div className={`${
                descripcionRica.length > (config.maxDescripcionRicaLength! * 0.9) 
                  ? 'text-red-400' 
                  : descripcionRica.length > (config.maxDescripcionRicaLength! * 0.8)
                  ? 'text-yellow-400'
                  : 'text-gray-500'
              }`}>
                {descripcionRica.length}/{config.maxDescripcionRicaLength}
              </div>
            </div>
          </div>
          
          {/* Video Promocional */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Promocional
            </label>
            <input
              type="text"
              {...register('videoUrl')}
              placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={config.maxVideoUrlLength}
            />
            <p className="text-xs text-gray-400 mt-1">
              URL de YouTube, Vimeo u otro servicio de video
            </p>
          </div>
          
          {/* Galería de Imágenes */}
          <div>
            <MultipleImageGallery
              label="Galería de Imágenes"
              images={galeriaImagenes}
              onImagesChange={handleImagenesChange}
              maxImages={config.maxImages}
              helpText="Imágenes adicionales para mostrar en la página de detalles"
            />
          </div>
          
          {/* Contenido Adicional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Contenido Adicional
            </label>
            
            <textarea
              {...register('contenidoAdicional')}
              placeholder="Información extra, proceso de trabajo, garantías, etc."
              rows={6}
              className={`w-full bg-gray-700/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 resize-none ${
                contenidoAdicional.length > (config.maxContenidoAdicionalLength! * 0.9)
                  ? 'border-red-500 focus:ring-red-500'
                  : contenidoAdicional.length > (config.maxContenidoAdicionalLength! * 0.8)
                  ? 'border-yellow-500 focus:ring-yellow-500'
                  : 'border-gray-600 focus:ring-purple-500'
              }`}
              maxLength={config.maxContenidoAdicionalLength}
            />
            
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-400">
                Información adicional que aparecerá al final de la página de detalles
              </p>
              <p className={`text-xs ${
                contenidoAdicional.length > (config.maxContenidoAdicionalLength! * 0.9) ? 'text-red-400' :
                contenidoAdicional.length > (config.maxContenidoAdicionalLength! * 0.8) ? 'text-yellow-400' :
                'text-gray-500'
              }`}>
                {contenidoAdicional.length}/{config.maxContenidoAdicionalLength}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdvancedContentForm;