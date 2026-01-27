/**
 * 📝 Profile Editor Component
 * Formulario completo para editar perfil de usuario
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  User,
  MapPin,
  Globe,
  Camera,
  Save,
  AlertCircle,
  Facebook,
  Music,
  Github,
  Linkedin,
  Eye,
  Star
} from 'lucide-react';
import { 
  getMyProfile, 
  updateMyProfile, 
  uploadAvatar, 
  getDefaultAvatar,
  validateProfileCompleteness 
} from '../../services/profileService';
import type { BlogProfile } from '../../types/profile';
import { Toast } from '../common/Toast';
import { Modal } from '../common/Modal';

// ============================================
// TIPOS
// ============================================

interface ProfileEditorProps {
  onProfileUpdated?: (profile: any) => void;
  onClose?: () => void;
  isModal?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  onProfileUpdated,
  onClose,
  isModal = false
}) => {
  const { getToken } = useAuth();
  
  // Estados principales
  const [profile, setProfile] = useState<BlogProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Estados del formulario
  const [formData, setFormData] = useState<Partial<BlogProfile>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Estados UI
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'privacy'>('basic');
  
  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // ============================================
  // FUNCIONES
  // ============================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const profileData = await getMyProfile(token);
      setProfile(profileData.blogProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      showMessage('Error al cargar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validar displayName (requerido)
    if (!formData.displayName?.trim()) {
      newErrors.displayName = 'El nombre para mostrar es requerido';
    }
    
    // Validar bio (opcional pero con límite)
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'La biografía no puede tener más de 500 caracteres';
    }
    
    // Validar website (opcional pero debe ser URL válida)
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'El sitio web debe ser una URL válida (http:// o https://)';
    }
    
    // Validar Facebook
    if (formData.social?.facebook && formData.social.facebook.trim()) {
      const fbPattern = /^[a-zA-Z0-9._-]+$|^\/[a-zA-Z0-9._-]+$|^(https?:\/\/)?(www\.)?facebook\.com\/.+/;
      if (!fbPattern.test(formData.social.facebook)) {
        newErrors.facebook = 'Facebook debe ser un username válido o una URL';
      }
    }
    
    // Validar TikTok
    if (formData.social?.tiktok && formData.social.tiktok.trim()) {
      const ttPattern = /^@?[a-zA-Z0-9._]+$|^(https?:\/\/)?(www\.)?tiktok\.com\/.+/;
      if (!ttPattern.test(formData.social.tiktok)) {
        newErrors.tiktok = 'TikTok debe ser un @username válido o una URL';
      }
    }
    
    // Validar GitHub
    if (formData.social?.github && !/^[a-zA-Z0-9_-]+$/.test(formData.social.github)) {
      newErrors.github = 'GitHub debe ser un username válido';
    }
    
    // Validar LinkedIn
    if (formData.social?.linkedin && !/^https?:\/\//.test(formData.social.linkedin)) {
      newErrors.linkedin = 'LinkedIn debe ser una URL válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
    setHasChanges(true);
    
    // Limpiar error si existe
    if (errors[platform]) {
      setErrors(prev => ({
        ...prev,
        [platform]: ''
      }));
    }
  };

  const handlePrivacyChange = (setting: string, value: boolean) => {
    // Privacy settings not implemented in current BlogProfile type
    console.log('Privacy change:', setting, value);
    setHasChanges(true);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const avatarUrl = await uploadAvatar(file, token);
      
      handleInputChange('avatar', avatarUrl);
      showMessage('Avatar actualizado correctamente', 'success');
    } catch (error: any) {
      showMessage(error.message || 'Error al subir avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showMessage('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    try {
      setSaving(true);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const updatedProfile = await updateMyProfile(formData, token);
      
      setProfile(updatedProfile.blogProfile);
      setHasChanges(false);
      showMessage('Perfil actualizado correctamente', 'success');
      
      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }
    } catch (error: any) {
      showMessage(error.message || 'Error al actualizar perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm('¿Estás seguro de que quieres descartar los cambios?');
      if (!confirmed) return;
    }
    
    if (profile) {
      setFormData(profile);
    }
    setHasChanges(false);
    setErrors({});
    
    if (onClose) {
      onClose();
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
            <img
              src={formData.avatar || getDefaultAvatar(formData.displayName || 'Usuario')}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          
          <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
            {uploadingAvatar ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={16} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploadingAvatar}
            />
          </label>
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          Haz clic en el ícono de la cámara para cambiar tu avatar
        </p>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre para mostrar *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={formData.displayName || ''}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.displayName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tu nombre público"
            />
          </div>
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.displayName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu ciudad o país"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Área de expertise
        </label>
        <input
          type="text"
          value={formData.expertise || ''}
          onChange={(e) => handleInputChange('expertise', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: Desarrollo Full Stack, Data Science, UX Design"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sitio web
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://tusitio.com"
          />
        </div>
        {errors.website && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.website}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biografía
        </label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          maxLength={500}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
            errors.bio ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Cuéntanos sobre ti, tus intereses y experiencia..."
        />
        <div className="mt-1 flex justify-between items-center">
          <div>
            {errors.bio && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.bio}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {(formData.bio || '').length}/500
          </p>
        </div>
      </div>
    </div>
  );

  const renderSocialLinks = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <Facebook size={16} />
          <h3 className="font-medium">Conecta tus redes sociales</h3>
        </div>
        <p className="text-sm text-blue-700">
          Agrega tus perfiles sociales para que otros puedan encontrarte y conectar contigo.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Facebook
        </label>
        <div className="relative">
          <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={formData.social?.facebook || ''}
            onChange={(e) => handleSocialChange('facebook', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.facebook ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="usuario o URL completa"
          />
        </div>
        {errors.facebook && (
          <p className="mt-1 text-sm text-red-600">
            <AlertCircle className="inline w-4 h-4 mr-1" />
            {errors.facebook}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          TikTok
        </label>
        <div className="relative">
          <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={formData.social?.tiktok || ''}
            onChange={(e) => handleSocialChange('tiktok', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.tiktok ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="@usuario"
          />
        </div>
        {errors.tiktok && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.twitter}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GitHub
        </label>
        <div className="relative">
          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={formData.social?.github || ''}
            onChange={(e) => handleSocialChange('github', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.github ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="usuario"
          />
        </div>
        {errors.github && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.github}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn
        </label>
        <div className="relative">
          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="url"
            value={formData.social?.linkedin || ''}
            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.linkedin ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://linkedin.com/in/usuario"
          />
        </div>
        {errors.linkedin && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.linkedin}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ORCID
        </label>
        <input
          type="text"
          value={formData.social?.orcid || ''}
          onChange={(e) => handleSocialChange('orcid', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0000-0000-0000-0000"
        />
        <p className="mt-1 text-sm text-gray-500">
          Identificador para investigadores académicos
        </p>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <Eye size={16} />
          <h3 className="font-medium">Configuración de privacidad</h3>
        </div>
        <p className="text-sm text-yellow-700">
          Controla qué información es visible para otros usuarios en tu perfil público.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Perfil público</h4>
            <p className="text-sm text-gray-600">
              Permite que otros usuarios vean tu perfil
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublicProfile || false}
              onChange={(e) => handleInputChange('isPublicProfile', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Mostrar email</h4>
            <p className="text-sm text-gray-600">
              Tu dirección de email será visible en tu perfil público
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showEmail || false}
              onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Mostrar ubicación</h4>
            <p className="text-sm text-gray-600">
              Tu ubicación será visible en tu perfil público
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={false}
              onChange={(e) => handlePrivacyChange('showLocation', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Mostrar redes sociales</h4>
            <p className="text-sm text-gray-600">
              Tus enlaces de redes sociales serán visibles
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={false}
              onChange={(e) => handlePrivacyChange('showSocialLinks', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completeness = profile ? validateProfileCompleteness(profile) : null;

  const content = (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
            <p className="text-gray-600">Personaliza tu perfil público y configuración de privacidad</p>
          </div>
          
          {completeness && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <Star size={16} />
              <span className="font-medium">{completeness.score}% completo</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'basic', label: 'Información básica', icon: User },
            { id: 'social', label: 'Redes sociales', icon: Facebook },
            { id: 'privacy', label: 'Privacidad', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Content */}
        <div className="bg-white">
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'social' && renderSocialLinks()}
          {activeTab === 'privacy' && renderPrivacySettings()}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {/* Toast */}
      {showToast && (
        <Toast
          notification={{
            id: Date.now().toString(),
            type: toastType as any,
            title: toastType === 'success' ? 'Éxito' : 'Error',
            message: toastMessage,
            duration: 3000
          }}
        />
      )}
    </div>
  );

  // Renderizar como modal o como página completa
  if (isModal) {
    return (
      <Modal
        isOpen={true}
        onClose={handleCancel}
        title="Editar Perfil"
        size="xl"
      >
        <div className="p-6">
          {content}
        </div>
      </Modal>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {content}
      </div>
    </div>
  );
};

export default ProfileEditor;