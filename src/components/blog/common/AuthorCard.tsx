/**
 * 👤 AuthorCard Component - Enhanced
 * Tarjeta profesional del autor con perfil completo del blog
 * 🏢 Siempre muestra información de marca Thado Consulting
 */

import { User, Globe, Linkedin, Github, Mail, MapPin, Award, Facebook, Music } from 'lucide-react';
import type { BlogAuthor } from '../../../types/blog';
import { BRAND_AUTHOR } from '../../../config/brandConstants';

// Estilos configurables desde CMS
export interface AuthorCardStyles {
  background?: { light?: string; dark?: string };
  border?: { light?: string; dark?: string };
  nameColor?: { light?: string; dark?: string };
  bioColor?: { light?: string; dark?: string };
}

interface AuthorCardProps {
  author: BlogAuthor;
  className?: string;
  variant?: 'default' | 'compact';
  styles?: AuthorCardStyles;
  theme?: 'light' | 'dark';
  showBio?: boolean;
  showSocialLinks?: boolean;
  showRole?: boolean;
  nameFormat?: 'full' | 'two-words' | 'first-initials';
  avatarShape?: 'circle' | 'square';
}

export default function AuthorCard({ 
  author, 
  className = '', 
  variant = 'default',
  styles,
  theme = 'light',
  showBio = true,
  showSocialLinks = true,
  showRole = true,
  nameFormat = 'full',
  avatarShape = 'square'
}: AuthorCardProps) {
  // Clase de forma del avatar
  const avatarShapeClass = avatarShape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  const avatarCompactShapeClass = avatarShape === 'circle' ? 'rounded-full' : 'rounded-lg';

  // Función para formatear el nombre según configuración
  const formatName = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length <= 1) return name;
    
    switch (nameFormat) {
      case 'two-words':
        // Solo las primeras 2 palabras
        return words.slice(0, 2).join(' ');
      case 'first-initials':
        // Primera palabra completa + iniciales de las demás
        const first = words[0];
        const initials = words.slice(1).map(w => w.charAt(0).toUpperCase() + '.').join(' ');
        return `${first} ${initials}`;
      case 'full':
      default:
        return name;
    }
  };
  // Calcular estilos dinámicos desde CMS
  const currentStyles = {
    background: theme === 'dark' 
      ? styles?.background?.dark 
      : styles?.background?.light,
    border: theme === 'dark' 
      ? styles?.border?.dark 
      : styles?.border?.light,
    nameColor: theme === 'dark' 
      ? styles?.nameColor?.dark 
      : styles?.nameColor?.light,
    bioColor: theme === 'dark' 
      ? styles?.bioColor?.dark 
      : styles?.bioColor?.light,
  };

  // 🏢 Siempre usar datos de marca Thado Consulting
  const displayName = BRAND_AUTHOR.displayName;
  const bio = BRAND_AUTHOR.bio;
  const avatarUrl = BRAND_AUTHOR.avatar;
  const website = BRAND_AUTHOR.website;
  const location = BRAND_AUTHOR.location;
  const expertise = BRAND_AUTHOR.expertise;
  const social = BRAND_AUTHOR.social;
  const roleDisplay = BRAND_AUTHOR.role;
  
  // 🏢 No enlazar a perfil de usuario individual
  const profileUrl = null;
  const isPublicProfile = false;

  // Variante compacta (para sidebars, cards pequeñas)
  if (variant === 'compact') {
    const CompactContent = (
      <div className="flex items-center gap-3">
        {/* Avatar - Siempre logo de marca */}
        <div className={`w-12 h-12 ${avatarCompactShapeClass} overflow-hidden bg-white flex items-center justify-center p-1 border-2 border-gray-200 dark:border-gray-700`}>
          <img
            src={BRAND_AUTHOR.logo}
            alt={BRAND_AUTHOR.name}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {formatName(displayName)}
          </h4>
          {showRole && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {roleDisplay}
            </p>
          )}
        </div>
      </div>
    );

    return (
      <div className={`author-card-compact ${className}`}>
        {isPublicProfile && profileUrl ? (
          <div
            onClick={() => window.location.href = profileUrl}
            className="block hover:opacity-80 transition-opacity cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = profileUrl;
              }
            }}
          >
            {CompactContent}
          </div>
        ) : (
          CompactContent
        )}
      </div>
    );
  }

  // Variante por defecto (completa) - Wrapper condicional para hacerla clickeable
  const CardContent = (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      {/* Avatar - Siempre logo de marca */}
      <div className="flex-shrink-0">
        <div className={`w-24 h-24 ${avatarShapeClass} overflow-hidden bg-white flex items-center justify-center p-2 border-4 border-white dark:border-gray-700 shadow-lg ring-2 ring-blue-500/20`}>
          <img
            src={BRAND_AUTHOR.logo}
            alt={BRAND_AUTHOR.name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h3 
            className="text-2xl font-bold"
            style={{ color: currentStyles.nameColor || undefined }}
          >
            <span className={!currentStyles.nameColor ? 'text-gray-900 dark:text-white' : ''}>
              {formatName(displayName)}
            </span>
          </h3>
          {showRole && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
              {roleDisplay}
            </span>
          )}
          {isPublicProfile && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
              👁️ Perfil Público
            </span>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <MapPin size={14} className="text-gray-400" />
            <span>{location}</span>
          </div>
        )}

        {/* Bio */}
        {showBio && (
          <p 
            className={`text-sm mb-4 leading-relaxed ${!currentStyles.bioColor ? 'text-gray-700 dark:text-gray-300' : ''}`}
            style={{ color: currentStyles.bioColor || undefined }}
          >
            {bio}
          </p>
        )}

        {/* Expertise Tags */}
        {expertise && expertise.length > 0 && (
          <div className="flex items-start gap-2 mb-4">
            <Award size={16} className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {expertise.slice(0, 4).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
                >
                  {skill}
                </span>
              ))}
              {expertise.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400">
                  +{expertise.length - 4} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {showSocialLinks && (
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Sitio web del autor"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">Sitio web</span>
            </a>
          )}

          {author.email && (
            <a
              href={`mailto:${author.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Email del autor"
            >
              <Mail size={14} />
              <span className="hidden sm:inline">Contacto</span>
            </a>
          )}

          {social?.facebook && (
            <a
              href={social.facebook.startsWith('http') ? social.facebook : `https://facebook.com/${social.facebook.replace(/^\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Facebook del autor"
            >
              <Facebook size={14} />
            </a>
          )}

          {social?.tiktok && (
            <a
              href={`https://tiktok.com/@${social.tiktok.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="TikTok del autor"
            >
              <Music size={14} />
            </a>
          )}

          {social?.linkedin && (
            <a
              href={social.linkedin.startsWith('http') ? social.linkedin : `https://linkedin.com/in/${social.linkedin.replace('in/', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="LinkedIn del autor"
            >
              <Linkedin size={14} />
            </a>
          )}

          {social?.github && (
            <a
              href={`https://github.com/${social.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="GitHub del autor"
            >
              <Github size={14} />
            </a>
          )}
        </div>
        )}
      </div>
    </div>
  );

  // Estilos base del contenedor
  const containerBaseClass = "rounded-2xl p-8 shadow-lg transition-all duration-300";
  const containerStyle = {
    background: currentStyles.background || undefined,
    borderColor: currentStyles.border || undefined,
    borderWidth: currentStyles.border ? '2px' : undefined,
    borderStyle: currentStyles.border ? 'solid' : undefined,
  };

  return (
    <div className={`author-card ${className}`}>
      {isPublicProfile && profileUrl ? (
        <div 
          onClick={(e) => {
            // Solo navegar si no se clickeó un enlace interno
            if (!(e.target as HTMLElement).closest('a')) {
              window.location.href = profileUrl;
            }
          }}
          className={`block ${containerBaseClass} ${!currentStyles.background ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' : ''} ${!currentStyles.border ? 'border-2 border-gray-200 dark:border-gray-700' : ''} hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer`}
          style={containerStyle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              window.location.href = profileUrl;
            }
          }}
        >
          {CardContent}
        </div>
      ) : (
        <div 
          className={`${containerBaseClass} ${!currentStyles.background ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' : ''} ${!currentStyles.border ? 'border-2 border-gray-200 dark:border-gray-700' : ''}`}
          style={containerStyle}
        >
          {CardContent}
        </div>
      )}
    </div>
  );
}