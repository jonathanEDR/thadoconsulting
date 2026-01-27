/**
 * 🎨 ProfileEditor - IMPLEMENTACIÓN COMPLETA
 * Editor avanzado de perfil con 3 tabs, validaciones, upload y sistema completo
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Globe,
  Save,
  AlertCircle,
  CheckCircle,
  Github,
  Linkedin,
  Facebook,
  Loader,
  X,
  Eye,
  Shield,
  Users,
  MessageSquare,
  ExternalLink,
  Info,
  Zap,
  Music
} from 'lucide-react';
import { 
  getMyProfile, 
  updateMyProfile,
  validateProfileCompleteness
} from '../../services/profileService';
import { useProfileCache } from '../../hooks/useDashboardCache';
import type { BlogProfile } from '../../types/profile';
import AvatarUpload from './AvatarUpload';

// ============================================
// TIPOS Y INTERFACES
// ============================================

interface FormData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  expertise: string[];
  social: {
    facebook: string;
    tiktok: string;
    github: string;
    linkedin: string;
  };
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
    isPublicProfile: boolean;
    allowComments: boolean;
  };
  avatar?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface CompletenessData {
  score: number;
  missing: string[];
  suggestions: string[];
}

type TabType = 'basic' | 'social' | 'privacy';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface ProfileEditorProps {
  compactMode?: boolean; // Si es true, oculta el header grande
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ compactMode = false }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // ⚡ CACHE OPTIMIZADO: Hook personalizado para cache de perfil
  const {
    data: profileData,
    loading: profileLoading
  } = useProfileCache(
    useCallback(async () => {
      const token = await getToken();
      if (!token) throw new Error('Token no disponible');
      return await getMyProfile(token);
    }, [getToken])
  );

  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    expertise: [] as string[],
    social: {
      facebook: '',
      tiktok: '',
      github: '',
      linkedin: ''
    },
    privacy: {
      showEmail: false,
      showLocation: true,
      isPublicProfile: true,
      allowComments: true
    }
  });

  // Estados de UI
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [completeness, setCompleteness] = useState<CompletenessData>({
    score: 0,
    missing: [],
    suggestions: []
  });

  // Estados de notificación
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ============================================
  // EFECTOS Y CARGA DE DATOS
  // ============================================

  // Efecto para cargar datos del perfil cuando están disponibles  
  useEffect(() => {
    if (profileData && profileData.blogProfile) {
      const bp = profileData.blogProfile;
      // console.log('✅ [ProfileEditor] Cargando datos de cache/API:', bp);
      
      // Usar avatar de Clerk como fallback si no hay avatar guardado
      const avatarFallback = bp.avatar || user?.imageUrl || '';
      
      const newFormData = {
        displayName: String(bp.displayName || profileData.firstName || (profileData.email?.split('@')[0]) || ''),
        bio: String(bp.bio || ''),
        location: String(bp.location || ''),
        website: String(bp.website || ''),
        expertise: Array.isArray(bp.expertise) 
          ? bp.expertise 
          : (typeof bp.expertise === 'string' && bp.expertise 
             ? (bp.expertise as string).split(', ').filter((e: string) => e.trim())
             : []),
        avatar: String(avatarFallback),
        social: {
          facebook: String(bp.social?.facebook || ''),
          tiktok: String(bp.social?.tiktok || ''),
          github: String(bp.social?.github || ''),
          linkedin: String(bp.social?.linkedin || '')
        },
        privacy: {
          showEmail: Boolean(bp.showEmail),
          showLocation: true,
          isPublicProfile: bp.isPublicProfile !== false,
          allowComments: bp.allowComments !== false
        }
      };
      
      setFormData(newFormData);
    } else if (profileData && !profileData.blogProfile) {
      console.log('⚠️ [ProfileEditor] No hay blogProfile, usando valores por defecto');
      // Usar valores por defecto del usuario con avatar de Clerk
      const defaultFormData = {
        displayName: String(user?.firstName || (user?.primaryEmailAddress?.emailAddress?.split('@')[0]) || ''),
        bio: '',
        location: '',
        website: '',
        expertise: [],
        avatar: String(user?.imageUrl || ''),
        social: {
          facebook: '',
          tiktok: '',
          github: '',
          linkedin: ''
        },
        privacy: {
          showEmail: false,
          showLocation: true,
          isPublicProfile: true,
          allowComments: true
        }
      };
      setFormData(defaultFormData);
    }
  }, [profileData, user]);

  useEffect(() => {
    // Calcular completeness cuando cambian los datos
    if (!profileLoading && formData.displayName) {
      const profileForValidation: BlogProfile = {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        avatar: formData.avatar,
        expertise: formData.expertise,
        social: formData.social,
        isPublicProfile: formData.privacy.isPublicProfile,
        allowComments: formData.privacy.allowComments,
        showEmail: formData.privacy.showEmail
      };
      
      const completenessResult = validateProfileCompleteness(profileForValidation);
      setCompleteness(completenessResult);
    }
  }, [formData, profileLoading]);

  // ============================================
  // VALIDACIONES
  // ============================================

  const validateField = useCallback((field: string, value: any): string | null => {
    switch (field) {
      case 'displayName':
        if (!value || value.trim().length < 2) {
          return 'El nombre debe tener al menos 2 caracteres';
        }
        if (value.length > 100) {
          return 'El nombre no puede exceder 100 caracteres';
        }
        break;

      case 'bio':
        if (value && value.length > 500) {
          return 'La biografía no puede exceder 500 caracteres';
        }
        break;

      case 'website':
        if (value && value.trim()) {
          const urlPattern = /^https?:\/\/.+/;
          if (!urlPattern.test(value)) {
            return 'La URL debe comenzar con http:// o https://';
          }
        }
        break;

      case 'location':
        if (value && value.length > 100) {
          return 'La ubicación no puede exceder 100 caracteres';
        }
        break;

      default:
        // Validación de redes sociales - Más flexible para aceptar URLs sin protocolo
        if (field.startsWith('social.') && value && value.trim()) {
          const platform = field.split('.')[1];
          if (platform === 'facebook') {
            // Permitir username, /username, URL con o sin protocolo
            if (!value.match(/^[a-zA-Z0-9._-]+$|^\/[a-zA-Z0-9._-]+$|^(https?:\/\/)?(www\.)?facebook\.com\/.+/)) {
              return 'Formato inválido para Facebook';
            }
          }
          if (platform === 'tiktok') {
            // Permitir @username, username, URL con o sin protocolo
            if (!value.match(/^@?[a-zA-Z0-9._]+$|^(https?:\/\/)?(www\.)?tiktok\.com\/.+/)) {
              return 'Formato inválido para TikTok';
            }
          }
          if (platform === 'github') {
            // Permitir username, URL con o sin protocolo
            if (!value.match(/^[a-zA-Z0-9_-]+$|^(https?:\/\/)?(www\.)?github\.com\/.+/)) {
              return 'Formato inválido para GitHub';
            }
          }
          if (platform === 'linkedin') {
            // Permitir in/username, URL con o sin protocolo
            if (!value.match(/^in\/[a-zA-Z0-9_-]+$|^(https?:\/\/)?(www\.)?linkedin\.com\/.+/)) {
              return 'Formato inválido para LinkedIn';
            }
          }
        }
    }
    return null;
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];
    
    // Validaciones básicas
    const displayNameError = validateField('displayName', formData.displayName);
    if (displayNameError) {
      newErrors.push({ field: 'displayName', message: displayNameError });
    }

    const bioError = validateField('bio', formData.bio);
    if (bioError) {
      newErrors.push({ field: 'bio', message: bioError });
    }

    const websiteError = validateField('website', formData.website);
    if (websiteError) {
      newErrors.push({ field: 'website', message: websiteError });
    }

    const locationError = validateField('location', formData.location);
    if (locationError) {
      newErrors.push({ field: 'location', message: locationError });
    }

    // Validaciones de redes sociales
    Object.entries(formData.social).forEach(([platform, value]) => {
      const error = validateField(`social.${platform}`, value);
      if (error) {
        newErrors.push({ field: `social.${platform}`, message: error });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // ============================================
  // HANDLERS DE CAMBIOS
  // ============================================

  const handleBasicChange = (field: keyof Pick<FormData, 'displayName' | 'bio' | 'location' | 'website'>, value: string) => {
    console.log(`✏️ handleBasicChange - Campo: ${field}, Valor: ${value}`);
    
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('📝 FormData actualizado:', updated);
      return updated;
    });
    
    setHasChanges(true);
    
    // Validación en tiempo real
    const error = validateField(field, value);
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      return error ? [...filtered, { field, message: error }] : filtered;
    });
  };

  const handleSocialChange = (platform: keyof FormData['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [platform]: value }
    }));
    setHasChanges(true);

    // Validación en tiempo real
    const error = validateField(`social.${platform}`, value);
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== `social.${platform}`);
      return error ? [...filtered, { field: `social.${platform}`, message: error }] : filtered;
    });
  };

  const handlePrivacyChange = (setting: keyof FormData['privacy'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [setting]: value }
    }));
    setHasChanges(true);
  };

  const handleExpertiseAdd = (expertise: string) => {
    if (expertise && !(formData.expertise || []).includes(expertise)) {
      setFormData(prev => ({
        ...prev,
        expertise: [...(prev.expertise || []), expertise]
      }));
      setHasChanges(true);
    }
  };

  const handleExpertiseRemove = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: (prev.expertise || []).filter(e => e !== expertise)
    }));
    setHasChanges(true);
  };

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    setErrors([]);

    try {
      const token = await getToken();
      if (!token) throw new Error('No estás autenticado');

      // 🔧 FIX: Ajustar formato de datos para que coincida con el validador del backend
      const profileData: any = {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        expertise: Array.isArray(formData.expertise) 
          ? formData.expertise.join(', ') // Convertir array a string separado por comas
          : (formData.expertise || ''),
        social: formData.social,
        // Campos de privacidad al nivel raíz (no anidado en 'privacy')
        showEmail: formData.privacy.showEmail,
        isPublicProfile: formData.privacy.isPublicProfile,
        allowComments: formData.privacy.allowComments
      };
      
      console.log('📤 Datos a enviar al backend:', profileData);

      if (formData.avatar) {
        profileData.avatar = formData.avatar;
      }

      await updateMyProfile(profileData, token);
      setHasChanges(false);
      
      setSuccessMessage('¡Perfil actualizado correctamente!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setErrors([{ field: 'general', message: err.message || 'Error al actualizar el perfil' }]);
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // HELPERS DE UI
  // ============================================

  const getFieldError = (field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  };

  const viewPublicProfile = () => {
    if (user?.username) {
      navigate(`/perfil/${user.username}`);
    }
  };

  const getCompletenessColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCompletenessBarColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // ============================================
  // COMPONENTE DE CARGA
  // ============================================

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div className="w-full space-y-6">
      {/* Header con Completeness - Solo si NO está en modo compacto */}
      {!compactMode && (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Editar Perfil</h2>
              <p className="text-indigo-100">Completa tu perfil para conectar mejor con la comunidad</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getCompletenessColor(completeness.score)} bg-white dark:bg-gray-800 rounded-lg px-3 py-2`}>
                {completeness.score}%
              </div>
              <p className="text-sm text-indigo-100 mt-1">Completado</p>
            </div>
          </div>
          
          {/* Barra de Progreso */}
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getCompletenessBarColor(completeness.score)}`}
              style={{ width: `${completeness.score}%` }}
            />
          </div>

          {/* Sugerencias */}
          {completeness.suggestions.length > 0 && (
            <div className="mt-4 text-sm">
              <p className="font-medium mb-2">💡 Sugerencias para mejorar:</p>
              <ul className="list-disc list-inside space-y-1 text-indigo-100">
                {completeness.suggestions.slice(0, 2).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Indicador de completeness compacto - Solo en modo compacto */}
      {compactMode && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center">
            <div className={`text-xl font-bold ${getCompletenessColor(completeness.score)} mr-3`}>
              {completeness.score}%
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Completitud del perfil
              </p>
              {completeness.suggestions.length > 0 && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {completeness.suggestions[0]}
                </p>
              )}
            </div>
          </div>
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getCompletenessBarColor(completeness.score)}`}
              style={{ width: `${completeness.score}%` }}
            />
          </div>
        </div>
      )}

      {/* Notificación de Éxito */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
          <p className="text-green-800 dark:text-green-200">{successMessage}</p>
        </div>
      )}

      {/* Errores Generales */}
      {errors.some(e => e.field === 'general') && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            {errors.filter(e => e.field === 'general').map((error, index) => (
              <p key={index} className="text-red-800 dark:text-red-200">{error.message}</p>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: 'Información Básica', icon: User },
              { id: 'social', label: 'Redes Sociales', icon: Users },
              { id: 'privacy', label: 'Privacidad', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Tab: Información Básica */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-6 sm:space-y-0">
                <AvatarUpload
                  currentAvatar={formData.avatar}
                  onAvatarUpdate={(avatarUrl) => {
                    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
                    setHasChanges(true);
                  }}
                  size="lg"
                />
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Foto de Perfil</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Sube una imagen para tu perfil. Se recomienda una imagen cuadrada de al menos 200x200px.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500 dark:text-green-400" />
                      Drag & Drop
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500 dark:text-green-400" />
                      JPG, PNG, WebP
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500 dark:text-green-400" />
                      Máximo 5MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Nombre para mostrar *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleBasicChange('displayName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('displayName') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Tu nombre completo"
                />
                {getFieldError('displayName') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('displayName')}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biografía
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleBasicChange('bio', e.target.value)}
                  rows={4}
                  maxLength={500}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('bio') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Cuéntanos sobre ti..."
                />
                <div className="flex justify-between items-center mt-1">
                  {getFieldError('bio') ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{getFieldError('bio')}</p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Describe tu experiencia, intereses o lo que te hace único</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formData.bio.length}/500</p>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleBasicChange('location', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('location') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ciudad, País"
                />
                {getFieldError('location') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('location')}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="inline w-4 h-4 mr-2" />
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleBasicChange('website', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('website') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="https://tusitio.com"
                />
                {getFieldError('website') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('website')}</p>
                )}
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Zap className="inline w-4 h-4 mr-2" />
                  Áreas de Especialización
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(formData.expertise || []).map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleExpertiseRemove(skill)}
                        className="ml-2 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleExpertiseAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecciona una especialización</option>
                  {[
                    'Desarrollo Web',
                    'Desarrollo Móvil',
                    'Data Science',
                    'Machine Learning',
                    'DevOps',
                    'UI/UX Design',
                    'Marketing Digital',
                    'SEO',
                    'E-commerce',
                    'Blockchain'
                  ].map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Tab: Redes Sociales */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Conecta tus Redes Sociales</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Permite que otros te encuentren y conecten contigo en diferentes plataformas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Facebook className="inline w-4 h-4 mr-2" />
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.social.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('social.facebook') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="usuario o facebook.com/usuario"
                />
                {getFieldError('social.facebook') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('social.facebook')}</p>
                )}
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Github className="inline w-4 h-4 mr-2" />
                  GitHub
                </label>
                <input
                  type="text"
                  value={formData.social.github}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('social.github') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="usuario"
                />
                {getFieldError('social.github') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('social.github')}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Linkedin className="inline w-4 h-4 mr-2" />
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={formData.social.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('social.linkedin') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="in/usuario"
                />
                {getFieldError('social.linkedin') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('social.linkedin')}</p>
                )}
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Music className="inline w-4 h-4 mr-2" />
                  TikTok
                </label>
                <input
                  type="text"
                  value={formData.social.tiktok}
                  onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    getFieldError('social.tiktok') ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="@usuario"
                />
                {getFieldError('social.tiktok') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('social.tiktok')}</p>
                )}
              </div>
            </div>
          )}

          {/* Tab: Privacidad */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Configuración de Privacidad</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Controla qué información es visible para otros usuarios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Perfil Público */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Perfil Público</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">
                    Permite que otros usuarios vean tu perfil en el directorio público
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePrivacyChange('isPublicProfile', !formData.privacy.isPublicProfile)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.privacy.isPublicProfile ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.privacy.isPublicProfile ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Mostrar Email */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Mostrar Email</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">
                    Permite que otros usuarios vean tu dirección de email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePrivacyChange('showEmail', !formData.privacy.showEmail)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.privacy.showEmail ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Permitir Comentarios */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Permitir Comentarios</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">
                    Permite que otros usuarios comenten en tus artículos del blog
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePrivacyChange('allowComments', !formData.privacy.allowComments)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.privacy.allowComments ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.privacy.allowComments ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={saving || !hasChanges}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>

            {formData.privacy.isPublicProfile && user?.username && (
              <button
                type="button"
                onClick={viewPublicProfile}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Ver Perfil Público
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;