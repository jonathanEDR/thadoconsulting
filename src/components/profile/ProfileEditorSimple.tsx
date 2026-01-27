/**
 * 📝 Profile Editor Component - Versión Simplificada
 * Formulario para editar perfil de usuario
 */

import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Globe,
  Save,
  AlertCircle,
  Facebook,
  Music,
  Github,
  Linkedin,
  Loader
} from 'lucide-react';
import { 
  getMyProfile, 
  updateMyProfile
} from '../../services/profileService';
import type { BlogProfile } from '../../types/profile';

interface FormData extends BlogProfile {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  social?: {
    facebook?: string;
    tiktok?: string;
    github?: string;
    linkedin?: string;
  };
}

const ProfileEditor: React.FC = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    social: {
      facebook: '',
      tiktok: '',
      github: '',
      linkedin: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar perfil existente
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        
        const profile = await getMyProfile(token);
        if (profile && profile.blogProfile) {
          const blogProfile = profile.blogProfile;
          setFormData({
            displayName: blogProfile.displayName || '',
            bio: blogProfile.bio || '',
            location: blogProfile.location || '',
            website: blogProfile.website || '',
            social: {
              facebook: blogProfile.social?.facebook || '',
              tiktok: blogProfile.social?.tiktok || '',
              github: blogProfile.social?.github || '',
              linkedin: blogProfile.social?.linkedin || ''
            }
          });
        }
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [getToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSuccess(false);
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No estás autenticado');
      }

      await updateMyProfile(formData, token);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const viewPublicProfile = () => {
    if (user?.username) {
      navigate(`/perfil/${user.username}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-600">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información Básica
          </h3>

          {/* Display Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Nombre para mostrar
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Cuéntanos sobre ti..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.bio?.length || 0}/500 caracteres
            </p>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-2" />
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ciudad, País"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline w-4 h-4 mr-2" />
              Sitio Web
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://tusitio.com"
            />
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Redes Sociales
          </h3>

          {/* Facebook */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Facebook className="inline w-4 h-4 mr-2" />
              Facebook
            </label>
            <input
              type="text"
              value={formData.social?.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="usuario o URL completa"
            />
          </div>

          {/* GitHub */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Github className="inline w-4 h-4 mr-2" />
              GitHub
            </label>
            <input
              type="text"
              value={formData.social?.github || ''}
              onChange={(e) => handleSocialChange('github', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="usuario"
            />
          </div>

          {/* LinkedIn */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Linkedin className="inline w-4 h-4 mr-2" />
              LinkedIn
            </label>
            <input
              type="text"
              value={formData.social?.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="in/usuario"
            />
          </div>

          {/* TikTok */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Music className="inline w-4 h-4 mr-2" />
              TikTok
            </label>
            <input
              type="text"
              value={formData.social?.tiktok || ''}
              onChange={(e) => handleSocialChange('tiktok', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="@usuario"
            />
          </div>
        </div>

        {/* Mensajes de Estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <Save className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">¡Perfil actualizado correctamente!</p>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
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

          {user?.username && (
            <button
              type="button"
              onClick={viewPublicProfile}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ver Perfil Público
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
