/**
 * 👀 Public Profile Component
 * Vista pública del perfil de usuario
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Globe,
  Calendar,
  Star,
  MessageCircle,
  FileText,
  Facebook,
  Music,
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { 
  getPublicProfile, 
  getProfileStats, 
  getDefaultAvatar,
  getSocialUrl 
} from '../../services/profileService';
import type { PublicUserProfile, ProfileStats } from '../../types/profile';
import { Toast } from '../common/Toast';

// ============================================
// TIPOS
// ============================================

interface PublicProfileProps {
  username?: string; // Para usar el componente directamente con un username
  onClose?: () => void; // Para cerrar si es usado como modal
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  sublabel?: string;
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sublabel }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2 text-blue-600">{icon}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
    {sublabel && <div className="text-xs text-gray-500 mt-1">{sublabel}</div>}
  </div>
);

const SocialLink: React.FC<{ platform: string; value: string; icon: React.ReactNode }> = ({ 
  platform, 
  value, 
  icon 
}) => {
  const url = getSocialUrl(platform, value);
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
    >
      <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 capitalize">{platform}</div>
        <div className="text-xs text-gray-600">{value}</div>
      </div>
      <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
    </a>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const PublicProfile: React.FC<PublicProfileProps> = ({ 
  username: propUsername, 
  onClose 
}) => {
  const { username: paramUsername } = useParams<{ username: string }>();
  const username = propUsername || paramUsername;
  
  // Estados
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    if (username) {
      loadProfileData();
    }
  }, [username]);

  // ============================================
  // FUNCIONES
  // ============================================

  const loadProfileData = async () => {
    if (!username) {
      setError('Username no proporcionado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Cargar perfil y estadísticas en paralelo
      const [profileData, statsData] = await Promise.all([
        getPublicProfile(username),
        getProfileStats(username)
      ]);
      
      setProfile(profileData);
      setStats(statsData);
    } catch (error: any) {
      console.error('Error loading profile data:', error);
      setError(error.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profile?.displayName}`,
          text: profile?.bio || 'Mira este perfil en Web Scuti',
          url
        });
      } catch (error) {
        // Usuario canceló o error en share
      }
    } else {
      // Fallback: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(url);
        setToastMessage('Enlace copiado al portapapeles');
        setShowToast(true);
      } catch (error) {
        setToastMessage('No se pudo copiar el enlace');
        setShowToast(true);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long'
    }).format(new Date(date));
  };

  // ============================================
  // RENDERS CONDICIONALES
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Perfil no encontrado</h2>
          <p className="text-gray-600 mb-6">
            {error || 'El perfil que buscas no existe o no está disponible públicamente.'}
          </p>
          <Link
            to="/profiles"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Ver otros perfiles
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {onClose ? (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : (
                <Link
                  to="/profiles"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </Link>
              )}
              <div>
                <h1 className="text-2xl font-bold">Perfil Público</h1>
                <p className="text-blue-100">Información del usuario</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Share2 size={16} />
              Compartir
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-4 border-white/20 shadow-lg">
                <img
                  src={profile.avatar || getDefaultAvatar(profile.displayName || 'Usuario')}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{profile.displayName}</h2>
              
              {profile.expertise && (
                <div className="flex items-center gap-2 mb-3">
                  <Star className="text-yellow-300" size={16} />
                  <span className="text-lg text-blue-100">{profile.expertise}</span>
                </div>
              )}

              {profile.bio && (
                <p className="text-blue-50 mb-4 leading-relaxed">{profile.bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Se unió en {formatDate(profile.joinDate || new Date().toISOString())}</span>
                </div>

                {profile.email && (
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    <a 
                      href={`mailto:${profile.email}`}
                      className="hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Profile Completeness Badge */}
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="text-yellow-300" size={14} />
                  <span className="text-sm">Perfil {profile.profileCompleteness}% completo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            {stats && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={<FileText size={20} />}
                    label="Posts"
                    value={stats.posts}
                    sublabel={undefined}
                  />
                  <StatCard
                    icon={<MessageCircle size={20} />}
                    label="Comentarios"
                    value={stats.comments}
                    sublabel={undefined}
                  />
                  <StatCard
                    icon={<Star size={20} />}
                    label="Seguidores"
                    value={stats.followers}
                    sublabel={undefined}
                  />
                  <StatCard
                    icon={<Calendar size={20} />}
                    label="Siguiendo"
                    value={stats.following}
                    sublabel={undefined}
                  />
                </div>
              </div>
            )}

            {/* Website */}
            {profile.website && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sitio Web</h3>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <Globe className="text-blue-600" size={20} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Sitio Web Personal</div>
                    <div className="text-sm text-gray-600">{profile.website}</div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </a>
              </div>
            )}

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="text-center py-8">
                <MessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No hay actividad reciente para mostrar</p>
                <p className="text-sm text-gray-400 mt-2">
                  Los posts y comentarios aparecerán aquí cuando estén disponibles
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Social & Contact */}
          <div className="space-y-6">
            {/* Social Links */}
            {profile.social && Object.entries(profile.social).some(([_, value]) => value) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h3>
                <div className="space-y-3">
                  {profile.social.facebook && (
                    <SocialLink
                      platform="facebook"
                      value={profile.social.facebook}
                      icon={<Facebook size={18} />}
                    />
                  )}
                  {profile.social.tiktok && (
                    <SocialLink
                      platform="tiktok"
                      value={profile.social.tiktok}
                      icon={<Music size={18} />}
                    />
                  )}
                  {profile.social.github && (
                    <SocialLink
                      platform="github"
                      value={profile.social.github}
                      icon={<Github size={18} />}
                    />
                  )}
                  {profile.social.linkedin && (
                    <SocialLink
                      platform="linkedin"
                      value={profile.social.linkedin}
                      icon={<Linkedin size={18} />}
                    />
                  )}
                  {profile.social.orcid && (
                    <SocialLink
                      platform="orcid"
                      value={profile.social.orcid}
                      icon={<ExternalLink size={18} />}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h3>
              <div className="space-y-3">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <Mail className="text-blue-600" size={18} />
                    <div>
                      <div className="font-medium text-gray-900">Enviar email</div>
                      <div className="text-sm text-gray-600">{profile.email}</div>
                    </div>
                  </a>
                )}
                
                {!profile.email && (
                  <div className="text-center py-4">
                    <Mail className="mx-auto text-gray-300 mb-2" size={24} />
                    <p className="text-sm text-gray-500">
                      Información de contacto no disponible
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle size={16} />
                  Enviar mensaje
                </button>
                
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 size={16} />
                  Compartir perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <Toast
          notification={{
            id: Date.now().toString(),
            type: 'success',
            title: 'Éxito',
            message: toastMessage,
            duration: 3000
          }}
        />
      )}
    </div>
  );
};

export default PublicProfile;