/**
 * 👁️ PublicProfile Complete - Vista Pública Avanzada
 * Componente completo para mostrar perfiles públicos con estadísticas, compartir y más
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Globe,
  Calendar,
  Share2,
  ExternalLink,
  Mail,
  Facebook,
  Music,
  Github,
  Linkedin,
  MessageSquare,
  FileText,
  Users,
  Heart,
  Loader,
  AlertCircle,
  Copy,
  ArrowLeft
} from 'lucide-react';
import {
  getPublicProfile,
  getProfileStats,
  getSocialUrl,
  getUserPosts
} from '../../services/profileService';
import type { PublicUserProfile, ProfileStats } from '../../types/profile';
import type { BlogPost } from '../../types/blog';

interface ShareOption {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  action: (url: string) => void;
}

const PublicProfileComplete: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  // const navigate = useNavigate();
  
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (username) {
      loadProfile(username);
      loadStats(username);
      loadUserPosts(username);
    }
  }, [username]);

  const loadProfile = async (username: string) => {
    try {
      console.log('🔍 Cargando perfil público para username:', username);
      const profileData = await getPublicProfile(username);
      console.log('✅ Perfil público cargado:', profileData);
      setProfile(profileData);
    } catch (err: any) {
      console.error('❌ Error cargando perfil público:', err);
      setError(err.message || 'Perfil no encontrado');
    }
  };

  const loadStats = async (username: string) => {
    try {
      const statsData = await getProfileStats(username);
      setStats(statsData);
    } catch (err: any) {
      console.warn('No se pudieron cargar las estadísticas:', err);
      // No es crítico, asignar valores por defecto
      setStats({
        posts: 0,
        comments: 0,
        followers: 0,
        following: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async (username: string) => {
    try {
      setLoadingPosts(true);
      const postsData = await getUserPosts(username, { limit: 6 });
      setPosts(postsData.data);
    } catch (err: any) {
      console.warn('No se pudieron cargar los posts:', err);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      name: 'Copiar Link',
      icon: Copy,
      action: async (url: string) => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Fallback para navegadores que no soportan clipboard
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: (url: string) => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: (url: string) => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      }
    }
  ];

  const handleShare = async () => {
    const url = window.location.href;
    const title = `Perfil de ${profile?.displayName || username} - SCUTI Company`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: profile?.bio || 'Conoce este perfil en SCUTI Company',
          url
        });
        return;
      } catch (err) {
        // Si el usuario cancela o hay error, mostrar menú manual
      }
    }
    
    setShowShareMenu(true);
  };

  const getCompletenessLevel = (score: number): { level: string; color: string; badge: string } => {
    if (score >= 90) return { level: 'Experto', color: 'text-purple-600 bg-purple-100', badge: '🏆' };
    if (score >= 80) return { level: 'Avanzado', color: 'text-green-600 bg-green-100', badge: '⭐' };
    if (score >= 60) return { level: 'Intermedio', color: 'text-yellow-600 bg-yellow-100', badge: '🥉' };
    if (score >= 40) return { level: 'Básico', color: 'text-blue-600 bg-blue-100', badge: '📝' };
    return { level: 'Nuevo', color: 'text-gray-600 bg-gray-100', badge: '🌱' };
  };

  const getMemberSince = (createdAt: string): string => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil no encontrado</h1>
          <p className="text-gray-600 mb-6">
            {error || 'El perfil que buscas no existe o no está disponible públicamente.'}
          </p>
          <Link
            to="/perfiles"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ver Todos los Perfiles
          </Link>
        </div>
      </div>
    );
  }

  const completeness = getCompletenessLevel(profile.profileCompleteness || 0);
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navegación */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/perfiles"
              className="flex items-center text-white hover:text-indigo-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Todos los Perfiles
            </Link>
            
            <div className="relative">
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </button>

              {/* Menú de compartir */}
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50">
                  {shareOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.name}
                        onClick={() => {
                          option.action(currentUrl);
                          setShowShareMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700"
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {option.name === 'Copiar Link' && copied ? 'Link Copiado!' : option.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Información principal del perfil */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white/30">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.displayName || username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white/70" />
                )}
              </div>
              
              {/* Badge de completeness */}
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium ${completeness.color} border-2 border-white`}>
                {completeness.badge} {completeness.level}
              </div>
            </div>

            {/* Información básica */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl font-bold mb-2">
                {profile.displayName || username}
              </h1>
              
              {profile.bio ? (
                <p className="text-xl text-indigo-100 mb-4 max-w-2xl">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-lg text-indigo-200/80 mb-4 max-w-2xl italic">
                  Este usuario aún no ha agregado una biografía
                </p>
              )}

              {/* Expertise tags */}
              {profile.expertise && profile.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Metadatos */}
              <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </div>
                )}
                
                {profile.joinDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Miembro desde {getMemberSince(profile.joinDate)}
                  </div>
                )}

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Sitio Web
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estadísticas principales */}
            {stats && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{stats.posts}</div>
                    <div className="text-sm text-blue-600">Artículos</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">{stats.comments}</div>
                    <div className="text-sm text-green-600">Comentarios</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">{stats.followers}</div>
                    <div className="text-sm text-purple-600">Seguidores</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <Heart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900">{stats.following}</div>
                    <div className="text-sm text-orange-600">Siguiendo</div>
                  </div>
                </div>
              </div>
            )}

            {/* Áreas de expertise */}
            {profile.expertise && profile.expertise.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Especialización</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Artículos recientes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Artículos Recientes</h2>
              
              {loadingPosts ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500">Cargando artículos...</p>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.slice(0, 3).map(post => (
                    <article key={post._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="block hover:bg-gray-50 rounded-lg p-3 -m-3 transition-colors"
                      >
                        <div className="flex gap-4">
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>
                                {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              {post.readingTime && (
                                <span>{post.readingTime} min lectura</span>
                              )}
                              {(post.stats?.likesCount ?? 0) > 0 && (
                                <span>❤️ {post.stats?.likesCount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                  
                  {posts.length > 3 && (
                    <div className="pt-4 border-t border-gray-100">
                      <Link
                        to="/blog"
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
                      >
                        Ver todos los artículos ({stats?.posts || posts.length}) →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no hay artículos</h3>
                  <p className="text-gray-500 mb-4">
                    {profile.displayName || username} aún no ha publicado artículos en el blog
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
                    <p className="text-sm text-gray-600">
                      💡 Los artículos aparecerán aquí cuando {profile.displayName || 'este usuario'} publique contenido
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de contacto */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h3>
              
              {profile.email && (
                <div className="flex items-center space-x-3 mb-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {profile.email}
                  </a>
                </div>
              )}

              {/* Redes sociales */}
              {profile.social && (
                <div className="space-y-3">
                  {Object.entries(profile.social).map(([platform, value]) => {
                    if (!value) return null;
                    
                    const socialConfig = {
                      facebook: { 
                        icon: Facebook, 
                        name: 'Facebook',
                        color: 'text-blue-600 hover:text-blue-700'
                      },
                      tiktok: { 
                        icon: Music, 
                        name: 'TikTok',
                        color: 'text-pink-600 hover:text-pink-700'
                      },
                      github: { 
                        icon: Github, 
                        name: 'GitHub',
                        color: 'text-gray-700 hover:text-gray-900'
                      },
                      linkedin: { 
                        icon: Linkedin, 
                        name: 'LinkedIn',
                        color: 'text-blue-700 hover:text-blue-800'
                      }
                    };
                    
                    const config = socialConfig[platform as keyof typeof socialConfig];
                    if (!config) return null;
                    
                    const Icon = config.icon;
                    
                    return (
                      <a
                        key={platform}
                        href={getSocialUrl(platform, value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm group ${config.color}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{config.name}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Estado cuando no hay información de contacto */}
              {!profile.email && (!profile.social || Object.values(profile.social).every(v => !v)) && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">No hay información de contacto pública</p>
                  <p className="text-gray-400 text-xs mt-1">Este usuario prefiere mantener privados sus datos de contacto</p>
                </div>
              )}
            </div>

            {/* Nueva sección: Sobre el usuario */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Sobre {profile.displayName || username}
              </h3>
              
              <div className="space-y-4">
                {/* Completitud del perfil visual */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Perfil completado</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {profile.profileCompleteness || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${profile.profileCompleteness || 0}%` }}
                    />
                  </div>
                </div>

                {/* Información básica del usuario */}
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Username</span>
                    <span className="font-medium text-gray-900">@{profile.username || username}</span>
                  </div>
                  
                  {profile.joinDate && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Se unió</span>
                      <span className="font-medium text-gray-900">{getMemberSince(profile.joinDate)}</span>
                    </div>
                  )}
                  
                  {profile.expertise && profile.expertise.length > 0 && (
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-gray-600 block mb-2">Especialidades</span>
                      <div className="flex flex-wrap gap-1">
                        {profile.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!profile.expertise || profile.expertise.length === 0) && (
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-gray-600 block mb-1">Especialidades</span>
                      <span className="text-gray-400 text-xs">No ha especificado áreas de experticia</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-3 text-gray-500" />
                  Compartir Perfil
                </button>

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-3 text-gray-500" />
                    Enviar Mensaje
                  </a>
                )}
              </div>
            </div>

            {/* Badge de perfil */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <div className="text-center">
                <div className="text-4xl mb-3">{completeness.badge}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Perfil {completeness.level}
                </h3>
                <div className="text-2xl font-bold text-indigo-600 mb-2">
                  {profile.profileCompleteness || 0}%
                </div>
                <p className="text-sm text-gray-600">Completitud del perfil</p>
                
                {profile.profileCompleteness && profile.profileCompleteness < 100 && (
                  <div className="mt-4 bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      ¡Un perfil más completo atrae más conexiones!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside para cerrar menú de compartir */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default PublicProfileComplete;