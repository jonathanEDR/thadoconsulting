/**
 * 🖼️ COMPONENTE GALERÍA MÚLTIPLE
 * Gestor de múltiples imágenes para servicios
 */

import React, { useState, useRef } from 'react';
import * as uploadApi from '../../services/uploadApi';
import { useNotification } from '../../hooks/useNotification';

interface MultipleImageGalleryProps {
  label: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  helpText?: string;
  required?: boolean;
}

export const MultipleImageGallery: React.FC<MultipleImageGalleryProps> = ({
  label,
  images,
  onImagesChange,
  maxImages = 10,
  helpText,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: showError } = useNotification();

  const handleFileSelect = async (files: FileList) => {
    if (files.length === 0) return;
    
    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (filesToUpload.length < files.length) {
      showError(`Solo se pueden subir ${remainingSlots} imágenes más. Límite: ${maxImages}`);
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of filesToUpload) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          showError(`${file.name} no es una imagen válida`);
          continue;
        }

        // Validar tamaño (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
          showError(`${file.name} es demasiado grande. Máximo 10MB`);
          continue;
        }

        const response = await uploadApi.uploadImage(file);
        if (response.success && response.data) {
          newImages.push(response.data.url);
        } else {
          showError(`Error al subir ${file.name}: ${response.error}`);
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
        success(`${newImages.length} imagen${newImages.length > 1 ? 'es' : ''} subida${newImages.length > 1 ? 's' : ''} correctamente`);
      }
    } catch (err) {
      showError('Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{helpText}</p>
        )}
      </div>

      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
            ${dragOver 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400">Subiendo imágenes...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Máximo {maxImages} imágenes • PNG, JPG, WEBP • Máx. 10MB cada una
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {images.length}/{maxImages} imágenes
              </p>
            </div>
          )}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square"
            >
              {/* Image */}
              <img
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      onClick={() => reorderImages(index, index - 1)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Mover a la izquierda"
                    >
                      ←
                    </button>
                  )}
                  
                  {/* Remove */}
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    title="Eliminar imagen"
                  >
                    🗑️
                  </button>
                  
                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => reorderImages(index, index + 1)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Mover a la derecha"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
              
              {/* Index */}
              <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {images.length >= maxImages && (
        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Has alcanzado el límite máximo de {maxImages} imágenes
          </p>
        </div>
      )}
    </div>
  );
};

export default MultipleImageGallery;