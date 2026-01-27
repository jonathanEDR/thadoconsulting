/**
 * 📸 AvatarUpload Component - Sistema Avanzado de Upload
 * Componente con drag & drop, preview, validaciones y integración con Cloudinary
 */

import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  Camera,
  Upload,
  X,
  AlertCircle,
  Loader,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { uploadAvatar } from '../../services/profileService';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarUpdate: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarUpdate,
  size = 'md',
  className = ''
}) => {
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Configuración de tamaños
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Validar archivo
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos JPEG, PNG o WebP';
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'El archivo no puede ser mayor a 5MB';
    }

    return null;
  };

  // Crear preview del archivo
  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload del archivo
  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No estás autenticado');
      }

      const avatarUrl = await uploadAvatar(file, token);
      onAvatarUpdate(avatarUrl);
      setPreview(null);
      
      // Mostrar feedback de éxito
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setError(err.message || 'Error al subir la imagen');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    createPreview(file);
    uploadFile(file);
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      setError('Solo se pueden subir imágenes');
    }
  }, []);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removePreview = () => {
    setPreview(null);
    setError(null);
  };

  const currentImageSrc = preview || currentAvatar;

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200 relative group cursor-pointer transition-all duration-200 ${
          dragOver ? 'border-indigo-400 bg-indigo-50' : 'hover:border-gray-300'
        } ${uploading ? 'opacity-70' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        {currentImageSrc ? (
          <>
            <img 
              src={currentImageSrc} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <Camera className={`${iconSizeClasses[size]} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
            </div>
          </>
        ) : (
          <div className="text-center">
            <User className={`${iconSizeClasses[size]} text-gray-400 mx-auto mb-1`} />
            {size === 'lg' && (
              <p className="text-xs text-gray-500">Sin foto</p>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <Loader className={`${iconSizeClasses[size]} animate-spin text-indigo-600`} />
          </div>
        )}

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-indigo-500 bg-opacity-20 flex items-center justify-center border-2 border-dashed border-indigo-400 rounded-full">
            <Upload className={`${iconSizeClasses[size]} text-indigo-600`} />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        type="button"
        onClick={triggerFileSelect}
        disabled={uploading}
        className={`absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full ${buttonSizeClasses[size]} hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg`}
        title="Cambiar foto"
      >
        {uploading ? (
          <Loader className={`${iconSizeClasses[size]} animate-spin`} />
        ) : (
          <Camera className={iconSizeClasses[size]} />
        )}
      </button>

      {/* Preview Controls */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={removePreview}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
          title="Cancelar"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 min-w-max max-w-xs">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Instructions (only for large size) */}
      {size === 'lg' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Haz click o arrastra una imagen aquí
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <ImageIcon className="w-3 h-3 mr-1" />
              JPG, PNG, WebP
            </span>
            <span>•</span>
            <span>Máx 5MB</span>
            <span>•</span>
            <span>Cuadrada recomendada</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;