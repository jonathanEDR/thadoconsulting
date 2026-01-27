/**
 * 📄 ProfilePage - Página Principal del Perfil
 * Combina ProfileView (lectura) con ProfileEditor (edición colapsable)
 */

import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Settings, Loader } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import ProfileView from './ProfileView';
import ProfileEditor from './ProfileEditorComplete';
import { useProfileCache } from '../../hooks/useDashboardCache';
import { getMyProfile } from '../../services/profileService';

const ProfilePage: React.FC = () => {
  const { getToken } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Cargar datos del perfil
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

  // Scroll suave hacia el editor cuando se expande
  const handleToggleEditor = () => {
    setIsEditorOpen(prev => !prev);
    
    // Si se está abriendo, hacer scroll después de un breve delay
    if (!isEditorOpen) {
      setTimeout(() => {
        const editorElement = document.getElementById('profile-editor-section');
        if (editorElement) {
          editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  // Asegurar que tenemos un perfil válido
  const profile = profileData?.blogProfile || {
    displayName: profileData?.firstName || profileData?.email?.split('@')[0] || 'Usuario',
    bio: '',
    location: '',
    website: '',
    expertise: [],
    social: {
      facebook: '',
      tiktok: '',
      github: '',
      linkedin: ''
    },
    isPublicProfile: true,
    allowComments: true,
    showEmail: false
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Header de la Página - más compacto */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mi Perfil
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gestiona tu información personal y configuraciones de privacidad
        </p>
      </div>

      {/* Vista del Perfil */}
      <ProfileView
        profile={profile}
        userStats={{
          totalPosts: 0, // TODO: Obtener stats reales del backend
          totalComments: 0,
          totalLikes: 0
        }}
        onEditClick={handleToggleEditor}
      />

      {/* Sección Colapsable del Editor - más sutil */}
      <div
        id="profile-editor-section"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300"
      >
        {/* Header del Colapsable */}
        <button
          onClick={handleToggleEditor}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
            <div className="text-left">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configuración Avanzada
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Edita tu perfil, redes sociales y preferencias de privacidad
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              {isEditorOpen ? 'Cerrar' : 'Expandir'}
            </span>
            {isEditorOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Contenido Colapsable */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isEditorOpen
              ? 'max-h-[4000px] opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <ProfileEditor compactMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
