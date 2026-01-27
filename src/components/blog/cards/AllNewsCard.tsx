/**
 * 🎯 All News Card
 * Tarjeta para la sección "Todas las Noticias" - Estilo Maqueta
 * Soporta 3 variantes: image-overlay, text-only, compact
 * 🏢 Siempre muestra marca Thado Consulting como autor
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Newspaper } from 'lucide-react';
import { extractFirstImage } from '../../../utils/blog';
import type { BlogPost } from '../../../types/blog';
import { BRAND_AUTHOR } from '../../../config/brandConstants';

export interface AllNewsCardConfig {
  // Variante de la tarjeta
  variant?: 'image-overlay' | 'text-only' | 'compact';
  // Colores
  overlayColor?: string;
  overlayOpacity?: number;
  bgColor?: string;
  bgTransparent?: boolean;
  titleColor?: string;
  // Título con gradiente
  titleUseGradient?: boolean;
  titleGradientFrom?: string;
  titleGradientTo?: string;
  titleGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  excerptColor?: string;
  dateColor?: string;
  categoryBgColor?: string;
  categoryTextColor?: string;
  categoryPosition?: 'left' | 'center' | 'right';
  tagBgColor?: string;
  tagTextColor?: string;
  tagBorderColor?: string;
  // Botón
  showButton?: boolean;
  buttonText?: string;
  buttonBgColor?: string;
  buttonBgTransparent?: boolean;
  buttonBgUseGradient?: boolean;
  buttonBgGradientFrom?: string;
  buttonBgGradientTo?: string;
  buttonBgGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  // Compatibilidad con buttonUseGradient (para imageCard)
  buttonUseGradient?: boolean;
  buttonGradientFrom?: string;
  buttonGradientTo?: string;
  buttonGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  buttonTextColor?: string;
  buttonTextUseGradient?: boolean;
  buttonTextGradientFrom?: string;
  buttonTextGradientTo?: string;
  buttonTextGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  buttonBorderColor?: string;
  buttonBorderUseGradient?: boolean;
  buttonBorderGradientFrom?: string;
  buttonBorderGradientTo?: string;
  buttonBorderGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  buttonBorderWidth?: number;
  buttonHoverBgColor?: string;
  buttonHoverTextColor?: string;
  // Autor
  showAuthor?: boolean;
  authorNameColor?: string;
  authorDateColor?: string;
  // Tamaño
  cardHeight?: string;
  cardWidth?: string;
  // Otros
  borderRadius?: string;
  fontFamily?: string;
}

interface AllNewsCardProps {
  post: BlogPost;
  variant?: 'image-overlay' | 'text-only' | 'compact';
  config?: AllNewsCardConfig;
  className?: string;
}

export const AllNewsCard: React.FC<AllNewsCardProps> = ({
  post,
  variant = 'image-overlay',
  config = {},
  className = ''
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fontFamily = config.fontFamily || 'Montserrat';

  // 🏢 Helper para obtener el nombre del autor - Siempre marca
  const getAuthorName = () => {
    return BRAND_AUTHOR.name;
  };

  // 🏢 Helper para obtener el avatar del autor - Logo para fondo oscuro (overlay)
  const getAuthorAvatar = () => {
    return BRAND_AUTHOR.logoDark;
  };

  // Variante: Imagen con overlay (tarjetas laterales de la maqueta)
  if (variant === 'image-overlay') {
    // Helper para convertir dirección de gradiente a CSS
    const getGradientDirection = (dir?: string) => {
      switch (dir) {
        case 'to-r': return 'to right';
        case 'to-l': return 'to left';
        case 'to-t': return 'to top';
        case 'to-b': return 'to bottom';
        case 'to-tr': return 'to top right';
        case 'to-tl': return 'to top left';
        case 'to-br': return 'to bottom right';
        case 'to-bl': return 'to bottom left';
        default: return 'to right';
      }
    };

    // Estilos del título con soporte de gradiente
    const titleStyle = config.titleUseGradient ? {
      background: `linear-gradient(${getGradientDirection(config.titleGradientDirection)}, ${config.titleGradientFrom || '#00ffff'}, ${config.titleGradientTo || '#ff00ff'})`,
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text' as const
    } : {
      color: config.titleColor || '#ffffff'
    };

    // Calcular posición de la categoría
    const categoryPositionClass = config.categoryPosition === 'left' 
      ? 'left-4' 
      : config.categoryPosition === 'right' 
        ? 'right-4' 
        : 'left-1/2 transform -translate-x-1/2';

    // Imagen de fondo con fallback (igual que BlogCard)
    const getBackgroundImage = (): string | null => {
      // 1. Primero intentar featuredImage
      if (post.featuredImage) return post.featuredImage;
      // 2. Luego intentar extraer del contenido
      const contentImage = extractFirstImage(post.content);
      if (contentImage) return contentImage;
      // 3. Finalmente intentar el array de images
      if (post.images && post.images.length > 0) {
        const firstImage = post.images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage.url;
      }
      return null;
    };
    const backgroundImage = getBackgroundImage();

    return (
      <article 
        className={`relative group overflow-hidden ${className}`}
        style={{ 
          borderRadius: config.borderRadius || '16px',
          fontFamily: `'${fontFamily}', sans-serif`,
          height: config.cardHeight || '400px',
          width: config.cardWidth || '100%'
        }}
      >
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          {backgroundImage ? (
            <img
              src={backgroundImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                backgroundColor: config.bgTransparent ? 'transparent' : (config.bgColor || '#1f2937'),
                background: config.bgTransparent ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {!config.bgTransparent && <Newspaper className="w-16 h-16 text-white/30" />}
            </div>
          )}
        </div>

        {/* Overlay gradiente - Normal */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-0"
          style={{
            background: config.bgTransparent ? 'transparent' : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)'
          }}
        />

        {/* Overlay hover - Fondo que aparece en hover (transparente si bgTransparent está activado) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundColor: config.bgTransparent ? 'transparent' : (config.bgColor || '#1e1b4b')
          }}
        />

        {/* Categoría en la parte superior - Siempre visible */}
        {post.category && (
          <div className={`absolute top-4 z-10 ${categoryPositionClass}`}>
            <span 
              className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full"
              style={{
                backgroundColor: config.categoryBgColor || '#8b5cf6',
                color: config.categoryTextColor || '#ffffff'
              }}
            >
              {typeof post.category === 'string' ? post.category : post.category.name}
            </span>
          </div>
        )}

        {/* Contenido normal (sin hover) - Título y autor en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 group-hover:opacity-0">
          {/* Título */}
          <h3 
            className="text-xl font-bold mb-4 leading-tight"
            style={titleStyle}
          >
            <Link to={`/blog/${post.slug}`} className="block">
              {post.title}
            </Link>
          </h3>

          {/* Autor y fecha - Siempre marca Thado Consulting */}
          {config.showAuthor !== false && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-white/30">
                <img 
                  src={getAuthorAvatar()} 
                  alt={getAuthorName()}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: config.authorNameColor || '#ffffff' }}
                >
                  {getAuthorName()}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: config.authorDateColor || '#9ca3af' }}
                >
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contenido expandido (en hover) - Título, extracto, tags y botón */}
        <div className="absolute inset-0 p-6 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {/* Título */}
          <h3 
            className="text-2xl font-bold mb-3 leading-tight mt-12"
            style={titleStyle}
          >
            <Link to={`/blog/${post.slug}`} className="block hover:underline">
              {post.title}
            </Link>
          </h3>

          {/* Extracto */}
          <p 
            className="text-sm mb-4 line-clamp-3 flex-grow"
            style={{ color: config.excerptColor || '#d1d5db' }}
          >
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full border"
                  style={{
                    backgroundColor: config.tagBgColor || 'rgba(139, 92, 246, 0.3)',
                    borderColor: config.tagBorderColor || 'rgba(139, 92, 246, 0.5)',
                    color: config.tagTextColor || '#ffffff'
                  }}
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span 
                  className="text-xs px-2 py-1"
                  style={{ color: config.excerptColor || '#9ca3af' }}
                >
                  +{post.tags.length - 2} más
                </span>
              )}
            </div>
          )}

          {/* Botón Ver más con soporte de gradientes */}
          {(() => {
            // Helper para convertir dirección de gradiente a CSS
            const getGradientDirection = (dir?: string) => {
              switch (dir) {
                case 'to-r': return 'to right';
                case 'to-l': return 'to left';
                case 'to-t': return 'to top';
                case 'to-b': return 'to bottom';
                case 'to-tr': return 'to top right';
                case 'to-tl': return 'to top left';
                case 'to-br': return 'to bottom right';
                case 'to-bl': return 'to bottom left';
                default: return 'to right';
              }
            };

            const buttonBorderWidth = config.buttonBorderWidth || 2;

            // Estilos del texto del botón
            const buttonTextStyle = config.buttonTextUseGradient ? {
              background: `linear-gradient(${getGradientDirection(config.buttonTextGradientDirection)}, ${config.buttonTextGradientFrom || '#00ffff'}, ${config.buttonTextGradientTo || '#ff00ff'})`,
              WebkitBackgroundClip: 'text' as const,
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text' as const
            } : {
              color: config.buttonTextColor || '#ffffff'
            };

            // Función para obtener el background del botón (con fallback a buttonUseGradient para compatibilidad)
            const getButtonBackground = () => {
              if (config.buttonBgTransparent) return 'transparent';
              if (config.buttonBgUseGradient || config.buttonUseGradient) {
                const from = config.buttonBgGradientFrom || config.buttonGradientFrom || '#8b5cf6';
                const to = config.buttonBgGradientTo || config.buttonGradientTo || '#ec4899';
                const dir = config.buttonBgGradientDirection || config.buttonGradientDirection || 'to-r';
                return `linear-gradient(${getGradientDirection(dir)}, ${from}, ${to})`;
              }
              return config.buttonBgColor || 'transparent';
            };

            // Si tiene borde gradiente
            if (config.buttonBorderUseGradient) {
              // Si el fondo es transparente, usar técnica de doble elemento para borde redondeado
              if (config.buttonBgTransparent) {
                return (
                  <div className="relative inline-block self-start">
                    {/* Capa de borde gradiente */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `linear-gradient(${getGradientDirection(config.buttonBorderGradientDirection)}, ${config.buttonBorderGradientFrom || '#00ffff'}, ${config.buttonBorderGradientTo || '#ff00ff'})`,
                        padding: `${buttonBorderWidth}px`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude'
                      }}
                    />
                    {/* Botón transparente encima */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="relative flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'transparent'
                      }}
                    >
                      <span style={buttonTextStyle}>
                        {config.buttonText || 'Ver más'}
                      </span>
                    </Link>
                  </div>
                );
              }
              
              // Si tiene fondo sólido o gradiente, usar wrapper
              const getButtonBgForGradientBorder = () => {
                if (config.buttonBgUseGradient || config.buttonUseGradient) {
                  return `linear-gradient(${getGradientDirection(config.buttonBgGradientDirection || config.buttonGradientDirection || 'to-r')}, ${config.buttonBgGradientFrom || config.buttonGradientFrom || '#8b5cf6'}, ${config.buttonBgGradientTo || config.buttonGradientTo || '#ec4899'})`;
                }
                return config.buttonBgColor || '#1e1b4b';
              };
              
              return (
                <div
                  className="inline-block rounded-full self-start"
                  style={{
                    background: `linear-gradient(${getGradientDirection(config.buttonBorderGradientDirection)}, ${config.buttonBorderGradientFrom || '#00ffff'}, ${config.buttonBorderGradientTo || '#ff00ff'})`,
                    padding: `${buttonBorderWidth}px`
                  }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                    style={{
                      background: getButtonBgForGradientBorder()
                    }}
                  >
                    <span style={buttonTextStyle}>
                      {config.buttonText || 'Ver más'}
                    </span>
                  </Link>
                </div>
              );
            }

            // Sin borde gradiente
            return (
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 self-start"
                style={{
                  background: getButtonBackground(),
                  border: `${buttonBorderWidth}px solid ${config.buttonBorderColor || '#ffffff'}`
                }}
              >
                <span style={buttonTextStyle}>
                  {config.buttonText || 'Ver más'}
                </span>
              </Link>
            );
          })()}
        </div>
      </article>
    );
  }

  // Variante: Solo texto (tarjeta central de la maqueta) - Versión con gradientes
  if (variant === 'text-only') {
    // Helper para convertir dirección de gradiente a CSS
    const getGradientDirection = (dir?: string) => {
      switch (dir) {
        case 'to-r': return 'to right';
        case 'to-l': return 'to left';
        case 'to-t': return 'to top';
        case 'to-b': return 'to bottom';
        case 'to-tr': return 'to top right';
        case 'to-tl': return 'to top left';
        case 'to-br': return 'to bottom right';
        case 'to-bl': return 'to bottom left';
        default: return 'to right';
      }
    };

    // Estilos del título
    const titleStyle = config.titleUseGradient ? {
      background: `linear-gradient(${getGradientDirection(config.titleGradientDirection)}, ${config.titleGradientFrom || '#00ffff'}, ${config.titleGradientTo || '#ff00ff'})`,
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text' as const
    } : {
      color: config.titleColor || '#ffffff'
    };

    // Estilos del texto del botón
    const buttonTextStyle = config.buttonTextUseGradient ? {
      background: `linear-gradient(${getGradientDirection(config.buttonTextGradientDirection)}, ${config.buttonTextGradientFrom || '#00ffff'}, ${config.buttonTextGradientTo || '#ff00ff'})`,
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text' as const
    } : {
      color: config.buttonTextColor || '#ffffff'
    };

    // Calcular fondo del botón
    const getButtonBackground = () => {
      if (config.buttonBgTransparent) return 'transparent';
      if (config.buttonUseGradient) {
        return `linear-gradient(${getGradientDirection(config.buttonGradientDirection)}, ${config.buttonGradientFrom || '#3b82f6'}, ${config.buttonGradientTo || '#8b5cf6'})`;
      }
      if (config.buttonBorderUseGradient && !config.buttonBgTransparent) {
        const bgColor = config.buttonBgColor || '#1e1b4b';
        return `linear-gradient(${bgColor}, ${bgColor}) padding-box, linear-gradient(${getGradientDirection(config.buttonBorderGradientDirection)}, ${config.buttonBorderGradientFrom || '#00ffff'}, ${config.buttonBorderGradientTo || '#ff00ff'}) border-box`;
      }
      return config.buttonBgColor || 'transparent';
    };

    // Renderizar botón con borde gradiente (usando wrapper para esquinas redondeadas)
    const renderButton = () => {
      const buttonBorderWidth = config.buttonBorderWidth || 2;
      
      // Si usa borde gradiente
      if (config.buttonBorderUseGradient) {
        // Si el fondo es transparente, usar técnica de máscara para borde redondeado
        if (config.buttonBgTransparent) {
          return (
            <div className="relative inline-block mt-auto">
              {/* Capa de borde gradiente con máscara */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(${getGradientDirection(config.buttonBorderGradientDirection)}, ${config.buttonBorderGradientFrom || '#00ffff'}, ${config.buttonBorderGradientTo || '#ff00ff'})`,
                  padding: `${buttonBorderWidth}px`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude'
                }}
              />
              {/* Botón transparente encima */}
              <Link
                to={`/blog/${post.slug}`}
                className="relative flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 hover:opacity-80"
                style={{
                  background: 'transparent'
                }}
              >
                <span style={buttonTextStyle}>
                  {config.buttonText || 'Ver más'}
                </span>
              </Link>
            </div>
          );
        }
        
        // Si tiene fondo sólido, usar wrapper para esquinas redondeadas
        return (
          <div 
            className="inline-block rounded-full mt-auto"
            style={{
              background: `linear-gradient(${getGradientDirection(config.buttonBorderGradientDirection)}, ${config.buttonBorderGradientFrom || '#00ffff'}, ${config.buttonBorderGradientTo || '#ff00ff'})`,
              padding: `${buttonBorderWidth}px`
            }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 hover:opacity-80"
              style={{ 
                backgroundColor: config.buttonBgColor || '#1e1b4b'
              }}
            >
              <span style={buttonTextStyle}>
                {config.buttonText || 'Ver más'}
              </span>
            </Link>
          </div>
        );
      }

      // Versión normal del botón
      return (
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 w-fit mt-auto hover:opacity-80"
          style={{
            background: getButtonBackground(),
            border: config.buttonBorderUseGradient 
              ? `${buttonBorderWidth}px solid transparent`
              : `${buttonBorderWidth}px solid ${config.buttonBorderColor || '#ffffff'}`,
          }}
        >
          <span style={buttonTextStyle}>
            {config.buttonText || 'Ver más'}
          </span>
        </Link>
      );
    };

    return (
      <article 
        className={`p-6 h-full flex flex-col ${className}`}
        style={{ 
          backgroundColor: config.bgTransparent ? 'transparent' : (config.bgColor || '#1e1b4b'),
          borderRadius: config.borderRadius || '16px',
          fontFamily: `'${fontFamily}', sans-serif`
        }}
      >
        {/* Título grande con soporte de gradiente */}
        <h3 
          className="text-2xl font-bold mb-4 leading-tight"
          style={titleStyle}
        >
          <Link to={`/blog/${post.slug}`} className="block hover:opacity-80 transition-opacity">
            {post.title}
          </Link>
        </h3>

        {/* Extracto */}
        <p 
          className="text-sm mb-4 flex-grow line-clamp-4"
          style={{ color: config.excerptColor || '#d1d5db' }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-xs font-medium rounded"
                style={{
                  backgroundColor: config.tagBgColor || 'rgba(139, 92, 246, 0.3)',
                  color: config.tagTextColor || '#c4b5fd',
                  border: `1px solid ${config.tagBgColor || 'rgba(139, 92, 246, 0.5)'}`
                }}
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span 
                className="text-xs py-1"
                style={{ color: config.excerptColor || '#9ca3af' }}
              >
                +{post.tags.length - 2} más
              </span>
            )}
          </div>
        )}

        {/* Botón Ver más con soporte de gradientes */}
        {config.showButton !== false && renderButton()}
      </article>
    );
  }

  // Variante: Compacta (para grids más pequeños)
  return (
    <article 
      className={`overflow-hidden ${className}`}
      style={{ 
        borderRadius: config.borderRadius || '12px',
        backgroundColor: config.bgColor || '#ffffff',
        fontFamily: `'${fontFamily}', sans-serif`
      }}
    >
      {/* Imagen */}
      {post.featuredImage && (
        <div className="relative h-40">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
          {post.category && (
            <div className="absolute top-3 left-3">
              <span 
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                  backgroundColor: config.categoryBgColor || '#2563eb',
                  color: config.categoryTextColor || '#ffffff'
                }}
              >
                {typeof post.category === 'string' ? post.category : post.category.name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="p-4">
        <div 
          className="flex items-center gap-2 text-xs mb-2"
          style={{ color: config.dateColor || '#6b7280' }}
        >
          <Calendar className="w-3 h-3" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>

        <h3 
          className="text-base font-bold mb-2 line-clamp-2"
          style={{ color: config.titleColor || '#111827' }}
        >
          <Link to={`/blog/${post.slug}`} className="hover:opacity-80 transition-opacity">
            {post.title}
          </Link>
        </h3>

        <p 
          className="text-sm line-clamp-2"
          style={{ color: config.excerptColor || '#4b5563' }}
        >
          {post.excerpt}
        </p>
      </div>
    </article>
  );
};

export default AllNewsCard;
