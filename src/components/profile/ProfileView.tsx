/**
 * 👤 ProfileView - Vista de Solo Lectura del Perfil
 * Diseño limpio y profesional estilo CV
 */

import React from 'react';
import { 
  MapPin, 
  Globe, 
  Calendar,
  Mail,
  ExternalLink,
  Facebook,
  Github,
  Linkedin,
  Music,
  Zap,
  Shield,
  Eye,
  EyeOff,
  BookOpen,
  MessageCircle,
  Heart,
  Edit3
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import type { BlogProfile } from '../../types/profile';

interface ProfileViewProps {
  profile: BlogProfile;
  userStats?: {
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
  };
  onEditClick: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, userStats, onEditClick }) => {
  const { user } = useUser();

  // Helper para formatear URLs de redes sociales
  const formatSocialUrl = (platform: string, value: string): string => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    switch (platform) {
      case 'facebook':
        return `https://facebook.com/${value.replace(/^\//, '')}`;
      case 'github':
        return `https://github.com/${value}`;
      case 'linkedin':
        return `https://linkedin.com/${value.startsWith('in/') ? value : `in/${value}`}`;
      case 'tiktok':
        return `https://tiktok.com/@${value.replace(/^@/, '')}`;
      default:
        return value;
    }
  };

  const hasSocialLinks = profile.social && (
    profile.social.facebook || 
    profile.social.github || 
    profile.social.linkedin || 
    profile.social.tiktok
  );

  const hasExpertise = profile.expertise && profile.expertise.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header Principal */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.avatar || user?.imageUrl ? (
              <img
                src={profile.avatar || user?.imageUrl}
                alt={profile.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-3xl font-semibold border-2 border-gray-200 dark:border-gray-600">
                {(profile.displayName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info Principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.displayName || 'Usuario'}
                </h2>
                
                {/* Metadatos */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {profile.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      {profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  )}
                  {user?.createdAt && (
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Email si está visible */}
                {user?.primaryEmailAddress?.emailAddress && profile.showEmail && (
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-1" />
                    {user.primaryEmailAddress.emailAddress}
                  </div>
                )}
              </div>

              {/* Botón Editar */}
              <button
                onClick={onEditClick}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Editar Perfil</span>
              </button>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Stats inline */}
            {userStats && (
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-sm">
                  <BookOpen className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{userStats.totalPosts}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">posts</span>
                </div>
                <div className="flex items-center text-sm">
                  <MessageCircle className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{userStats.totalComments}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">comentarios</span>
                </div>
                <div className="flex items-center text-sm">
                  <Heart className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{userStats.totalLikes}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">me gusta</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección adicional: Expertise + Redes + Privacidad */}
      {(hasExpertise || hasSocialLinks) && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Expertise */}
            {hasExpertise && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-1.5 text-yellow-500" />
                  Especialización
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Redes Sociales */}
            {hasSocialLinks && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Redes Sociales
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.social?.github && (
                    <a
                      href={formatSocialUrl('github', profile.social.github)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                  {profile.social?.linkedin && (
                    <a
                      href={formatSocialUrl('linkedin', profile.social.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                  {profile.social?.facebook && (
                    <a
                      href={formatSocialUrl('facebook', profile.social.facebook)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                  {profile.social?.tiktok && (
                    <a
                      href={formatSocialUrl('tiktok', profile.social.tiktok)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Music className="w-4 h-4" />
                      TikTok
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer: Estado de privacidad (sutil) */}
      <div className="px-6 sm:px-8 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              {profile.isPublicProfile ? (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1 text-green-500" />
                  Perfil público
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 mr-1" />
                  Perfil privado
                </>
              )}
            </span>
            <span className="flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Comentarios {profile.allowComments ? 'habilitados' : 'deshabilitados'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
