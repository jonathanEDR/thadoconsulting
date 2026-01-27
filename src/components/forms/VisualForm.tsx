/**
 * 🎨 VisualForm - Componente especializado para Diseño Visual
 * 
 * Maneja exclusivamente:
 * - Imagen principal (con upload desde galería o URL)
 * - Color primario (para gradientes y botones)
 * - Color secundario (para acentos)
 * - Vista previa en tiempo real
 * 
 * ⚠️ NOTA: Campo Icono fue removido - campo obsoleto no utilizado en UI
 * 
 * Ventajas:
 * ✅ Sin race conditions - Estado aislado
 * ✅ Lógica específica y enfocada
 * ✅ Upload de imágenes integrado
 * ✅ Preview en tiempo real
 * ✅ Fácil testing y mantenimiento
 */

import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ImageUploader } from '../common/ImageUploader';
import * as uploadApi from '../../services/uploadApi';

// ============================================
// INTERFACES
// ============================================

interface VisualFormProps {
  // React Hook Form integration
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  
  // Callbacks
  onSuccess: (message: string) => void;
  onError: (title: string, message?: string) => void;
  
  // Estado de carga
  isLoading?: boolean;
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const VisualForm: React.FC<VisualFormProps> = ({
  register,
  watch,
  setValue,
  onSuccess,
  onError,
  isLoading = false,
  uploadingImage = false,
  setUploadingImage,
}) => {
  // ============================================
  // HANDLERS
  // ============================================

  const handleImageChange = async (file: File | null, previewUrl: string | null) => {
    // Si es un archivo (subida desde PC)
    if (file) {
      setUploadingImage?.(true);
      try {
        const response = await uploadApi.uploadImage(file);
        if (response.success && response.data) {
          setValue('imagen', response.data.url);
          onSuccess('Imagen subida correctamente');
        } else {
          onError('Error al subir imagen', response.error || 'Intenta nuevamente');
        }
      } catch (err) {
        onError('Error al subir imagen');
      } finally {
        setUploadingImage?.(false);
      }
    } 
    // Si es una URL (selección desde galería)
    else if (previewUrl) {
      setValue('imagen', previewUrl);
      onSuccess('Imagen seleccionada de la galería');
    } 
    // Si es null (eliminar imagen)
    else {
      setValue('imagen', '');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400">Cargando diseño visual...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          🎨 Diseño Visual
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">(Opcional)</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Imagen Principal */}
          <div className="lg:col-span-2">
            <ImageUploader
              label="Imagen Principal del Servicio"
              currentImage={watch('imagen')}
              onImageChange={handleImageChange}
              helpText="Selecciona desde la galería o pega una URL. Tamaño recomendado: 1200x630px"
              uploading={uploadingImage}
              aspectRatio="16:9"
            />
            {watch('imagen') && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">URL de la imagen:</p>
                <input
                  type="url"
                  {...register('imagen')}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          {/* Color Primario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Primario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register('colorPrimario')}
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                type="text"
                {...register('colorPrimario')}
                placeholder="#8B5CF6"
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Color Secundario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Secundario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register('colorSecundario')}
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                type="text"
                {...register('colorSecundario')}
                placeholder="#06B6D4"
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 mt-4 p-4 bg-gray-100/50 dark:bg-gray-700/30 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="text-gray-900 dark:text-white font-medium mb-3">Vista Previa</h3>
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Imagen o placeholder con colores */}
              {watch('imagen') ? (
                <img 
                  src={watch('imagen')} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-lg object-cover border-2"
                  style={{ borderColor: watch('colorPrimario') }}
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${watch('colorPrimario')}20, ${watch('colorSecundario')}20)`,
                    border: `2px solid ${watch('colorPrimario')}40`
                  }}
                >
                  <span className="text-2xl">🖼️</span>
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-gray-900 dark:text-white font-medium">{watch('titulo') || 'Título del Servicio'}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{watch('descripcionCorta') || 'Descripción corta del servicio'}</p>
                {/* Muestra de colores */}
                <div className="flex items-center gap-2 mt-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: watch('colorPrimario') }}
                    title="Color Primario"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: watch('colorSecundario') }}
                    title="Color Secundario"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Colores del servicio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualForm;
