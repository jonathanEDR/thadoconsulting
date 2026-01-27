/**
 * 📰 RelatedPosts Component
 * Muestra posts relacionados basados en categoría y tags
 * ✅ Optimizado: ahora acepta posts pre-cargados del backend para evitar llamadas API extra
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import type { BlogPost } from '../../../types/blog';

// Estilos configurables desde CMS
export interface RelatedPostsStyles {
  sectionBackground?: { light?: string; dark?: string };
  sectionBorder?: { light?: string; dark?: string };
  iconColor?: { light?: string; dark?: string };
  cardBackground?: { light?: string; dark?: string };
  cardBorder?: { light?: string; dark?: string };
  cardTitleColor?: { light?: string; dark?: string };
  cardCategoryBackground?: { light?: string; dark?: string };
  cardCategoryBorder?: { light?: string; dark?: string };
  cardCategoryText?: { light?: string; dark?: string };
  cardDateColor?: { light?: string; dark?: string };
  titleColor?: { light?: string; dark?: string };
  buttonBackground?: { light?: string; dark?: string };
  buttonBorder?: { light?: string; dark?: string };
  buttonText?: { light?: string; dark?: string };
  linkColor?: { light?: string; dark?: string };
}

interface RelatedPostsProps {
  currentPost: BlogPost;
  preloadedPosts?: BlogPost[];  // ✅ Posts pre-cargados del backend (evita llamadas API)
  maxPosts?: number;
  className?: string;
  styles?: RelatedPostsStyles;
  theme?: 'light' | 'dark';
  showCategoryLink?: boolean;
  showExploreButton?: boolean;
  title?: string;
}

export default function RelatedPosts({
  currentPost,
  preloadedPosts,  // ✅ Nuevo prop
  maxPosts = 4,
  className = '',
  styles,
  theme = 'light',
  showCategoryLink = true,
  showExploreButton = true,
  title = 'Artículos Relacionados'
}: RelatedPostsProps) {
  
  // Calcular estilos dinámicos desde CMS
  const currentStyles = {
    sectionBackground: theme === 'dark' ? styles?.sectionBackground?.dark : styles?.sectionBackground?.light,
    sectionBorder: theme === 'dark' ? styles?.sectionBorder?.dark : styles?.sectionBorder?.light,
    iconColor: theme === 'dark' ? styles?.iconColor?.dark : styles?.iconColor?.light,
    cardBackground: theme === 'dark' ? styles?.cardBackground?.dark : styles?.cardBackground?.light,
    cardBorder: theme === 'dark' ? styles?.cardBorder?.dark : styles?.cardBorder?.light,
    cardTitleColor: theme === 'dark' ? styles?.cardTitleColor?.dark : styles?.cardTitleColor?.light,
    cardCategoryBackground: theme === 'dark' ? styles?.cardCategoryBackground?.dark : styles?.cardCategoryBackground?.light,
    cardCategoryBorder: theme === 'dark' ? styles?.cardCategoryBorder?.dark : styles?.cardCategoryBorder?.light,
    cardCategoryText: theme === 'dark' ? styles?.cardCategoryText?.dark : styles?.cardCategoryText?.light,
    cardDateColor: theme === 'dark' ? styles?.cardDateColor?.dark : styles?.cardDateColor?.light,
    titleColor: theme === 'dark' ? styles?.titleColor?.dark : styles?.titleColor?.light,
    buttonBackground: theme === 'dark' ? styles?.buttonBackground?.dark : styles?.buttonBackground?.light,
    buttonBorder: theme === 'dark' ? styles?.buttonBorder?.dark : styles?.buttonBorder?.light,
    buttonText: theme === 'dark' ? styles?.buttonText?.dark : styles?.buttonText?.light,
    linkColor: theme === 'dark' ? styles?.linkColor?.dark : styles?.linkColor?.light,
  };

  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  // ✅ Si hay posts pre-cargados del backend, usarlos directamente (evita 2 llamadas API)
  const shouldFetchFromAPI = !preloadedPosts || preloadedPosts.length === 0;
  
  // Extraer nombres de tags válidos (solo si están populated como objetos con name)
  const validTagNames = useMemo(() => {
    // Si ya tenemos posts pre-cargados, no necesitamos los tags para buscar
    if (!shouldFetchFromAPI) return [];
    
    if (!currentPost.tags || currentPost.tags.length === 0) return [];
    
    return currentPost.tags
      .slice(0, 3)
      .map(tag => {
        // Si es un objeto con propiedad 'name', usar eso
        if (typeof tag === 'object' && tag !== null && 'name' in tag) {
          const name = (tag as { name: string }).name;
          // Validar que el name tampoco sea un ID
          if (name && typeof name === 'string' && !/^[a-f0-9]+$/i.test(name)) {
            return name;
          }
          return null;
        }
        // Si es un string que parece cualquier tipo de ID (solo caracteres hex), ignorarlo
        // Esto cubre ObjectIds de 24 chars, IDs truncados, y cualquier string solo-hex
        if (typeof tag === 'string' && /^[a-f0-9]+$/i.test(tag)) {
          return null;
        }
        // Si es un string normal (nombre del tag con letras/palabras), usarlo
        if (typeof tag === 'string' && tag.length > 0 && tag.length < 100) {
          return tag;
        }
        return null;
      })
      .filter((name): name is string => name !== null && name.length > 0);
  }, [currentPost.tags, shouldFetchFromAPI]);
  
  // ✅ Solo hacer llamadas API si NO tenemos posts pre-cargados
  const { posts: categoryPosts } = useBlogPosts(
    shouldFetchFromAPI 
      ? {
          limit: maxPosts + 2,
          categoria: currentPost.category?._id,
          isPublished: true
        }
      : { limit: 0 } // No hacer la petición si tenemos posts pre-cargados
  );

  // Solo buscar por tags si tenemos nombres válidos Y no tenemos posts pre-cargados
  const { posts: tagPosts } = useBlogPosts(
    shouldFetchFromAPI && validTagNames.length > 0 
      ? {
          limit: maxPosts,
          tags: validTagNames,
          isPublished: true
        }
      : { limit: 0 } // No hacer la petición
  );

  useEffect(() => {
    // ✅ Prioridad 1: Usar posts pre-cargados del backend
    if (preloadedPosts && preloadedPosts.length > 0) {
      const filteredPosts = preloadedPosts
        .filter(post => post._id !== currentPost._id)
        .filter(post => post.featuredImage && post.title && post.slug)
        .slice(0, maxPosts);
      setRelatedPosts(filteredPosts);
      return;
    }
    
    // Prioridad 2: Usar posts de llamadas API (fallback)
    if (categoryPosts || tagPosts) {
      // Combinar y filtrar posts
      const allRelated = [
        ...(categoryPosts || []),
        ...(tagPosts || [])
      ];

      // Remover el post actual, duplicados, y posts sin imagen o datos esenciales
      const uniquePosts = allRelated
        .filter(post => post._id !== currentPost._id)
        .filter(post => post.featuredImage && post.title && post.slug) // Solo posts completos
        .reduce((acc, current) => {
          const exists = acc.find(post => post._id === current._id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, [] as BlogPost[])
        .slice(0, maxPosts);

      setRelatedPosts(uniquePosts);
    }
  }, [preloadedPosts, categoryPosts, tagPosts, currentPost._id, maxPosts]);

  if (!relatedPosts.length) {
    return null;
  }

  return (
    <section 
      className={`related-posts rounded-xl shadow-sm p-6 sm:p-8 ${!currentStyles.sectionBackground ? 'bg-white dark:bg-gray-800' : ''} ${!currentStyles.sectionBorder ? 'border border-gray-200 dark:border-gray-700' : ''} ${className}`}
      style={{
        backgroundColor: currentStyles.sectionBackground || undefined,
        borderColor: currentStyles.sectionBorder || undefined,
        borderWidth: currentStyles.sectionBorder ? '1px' : undefined,
        borderStyle: currentStyles.sectionBorder ? 'solid' : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp 
            className={!currentStyles.iconColor ? 'text-blue-600 dark:text-blue-400' : ''} 
            size={24}
            style={{ color: currentStyles.iconColor || undefined }}
          />
          <h2 
            className={`text-2xl font-bold ${!currentStyles.titleColor ? 'text-gray-900 dark:text-white' : ''}`}
            style={{ color: currentStyles.titleColor || undefined }}
          >
            {title}
          </h2>
        </div>
        
        {showCategoryLink && (
          <Link
            to="/blog"
            className={`hidden sm:inline-flex items-center gap-2 text-sm font-medium transition-colors ${!currentStyles.linkColor ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'hover:opacity-80'}`}
            style={{ color: currentStyles.linkColor || undefined }}
          >
            Ver más artículos
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedPosts.map((post) => {
          const postDate = new Date(post.publishedAt || post.createdAt);
          const formattedDate = postDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          return (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl ${!currentStyles.cardBorder ? 'border border-gray-200 dark:border-gray-700' : ''}`}
              style={{
                borderColor: currentStyles.cardBorder || undefined,
                borderWidth: currentStyles.cardBorder ? '1px' : undefined,
                borderStyle: currentStyles.cardBorder ? 'solid' : undefined,
              }}
            >
              {/* Imagen con altura mayor */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay gradiente fijo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Contenido sobre la imagen */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  {/* Categoría */}
                  {post.category && (() => {
                    const isGradientBorder = currentStyles.cardCategoryBorder && currentStyles.cardCategoryBorder.includes('gradient');
                    
                    if (isGradientBorder) {
                      const isTransparentBg = currentStyles.cardCategoryBackground === 'transparent';
                      
                      if (isTransparentBg) {
                        // Para fondo transparente con borde gradiente redondeado
                        // Usamos un elemento con borde transparente y un pseudo-elemento para el gradiente
                        return (
                          <span 
                            className="inline-block self-start relative px-3 py-1 rounded-full text-xs font-semibold mb-3"
                            style={{
                              color: currentStyles.cardCategoryText || '#ffffff',
                              background: 'transparent',
                            }}
                          >
                            {/* Pseudo-borde gradiente */}
                            <span 
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{
                                padding: '2px',
                                background: currentStyles.cardCategoryBorder,
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                              }}
                            />
                            {post.category.name}
                          </span>
                        );
                      }
                      
                      // Para fondo sólido con borde gradiente, usar wrapper
                      return (
                        <span 
                          className="inline-block self-start rounded-full mb-3 p-[2px]"
                          style={{
                            background: currentStyles.cardCategoryBorder,
                          }}
                        >
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: currentStyles.cardCategoryBackground || '#2563eb',
                              color: currentStyles.cardCategoryText || undefined,
                            }}
                          >
                            {post.category.name}
                          </span>
                        </span>
                      );
                    } else {
                      // Para color sólido, usar border normal
                      return (
                        <span 
                          className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-3 ${!currentStyles.cardCategoryBackground ? 'bg-blue-600 text-white' : ''}`}
                          style={{
                            backgroundColor: currentStyles.cardCategoryBackground || undefined,
                            color: currentStyles.cardCategoryText || undefined,
                            borderColor: currentStyles.cardCategoryBorder || undefined,
                            borderWidth: currentStyles.cardCategoryBorder ? '2px' : undefined,
                            borderStyle: currentStyles.cardCategoryBorder ? 'solid' : undefined,
                          }}
                        >
                          {post.category.name}
                        </span>
                      );
                    }
                  })()}
                  
                  {/* Título */}
                  <h3 
                    className={`text-lg font-bold mb-2 line-clamp-2 ${!currentStyles.cardTitleColor ? 'text-white' : ''}`}
                    style={{ color: currentStyles.cardTitleColor || undefined }}
                  >
                    {post.title}
                  </h3>
                  
                  {/* Fecha */}
                  <p 
                    className={`text-sm ${!currentStyles.cardDateColor ? 'text-gray-300' : ''}`}
                    style={{ color: currentStyles.cardDateColor || undefined }}
                  >
                    {formattedDate}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile CTA */}
      {showCategoryLink && (
        <Link
          to="/blog"
          className={`sm:hidden mt-6 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${!currentStyles.linkColor ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'hover:opacity-80'}`}
          style={{ color: currentStyles.linkColor || undefined }}
        >
          Ver más artículos
          <ArrowRight size={16} />
        </Link>
      )}

      {/* CTA para más contenido */}
      {showExploreButton && (() => {
        const isGradientBorder = currentStyles.buttonBorder && currentStyles.buttonBorder.includes('gradient');
        
        if (isGradientBorder) {
          const isTransparentBg = currentStyles.buttonBackground === 'transparent';
          
          if (isTransparentBg) {
            // Para fondo transparente con borde gradiente redondeado
            // Usamos un elemento con posición relativa y un pseudo-elemento para el gradiente
            return (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <Link
                  to="/blog"
                  className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:opacity-80"
                  style={{
                    background: 'transparent',
                    color: currentStyles.buttonText || '#ffffff',
                  }}
                >
                  {/* Pseudo-borde gradiente */}
                  <span 
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      padding: '2px',
                      background: currentStyles.buttonBorder,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                  Explorar más artículos
                  <ArrowRight size={18} />
                </Link>
              </div>
            );
          }
          
          // Para fondo sólido con borde gradiente, usar wrapper
          return (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <span 
                className="inline-block rounded-full p-[2px]"
                style={{
                  background: currentStyles.buttonBorder,
                }}
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-sm hover:shadow-md hover:opacity-90"
                  style={{
                    backgroundColor: currentStyles.buttonBackground || '#2563eb',
                    color: currentStyles.buttonText || '#ffffff',
                  }}
                >
                  Explorar más artículos
                  <ArrowRight size={18} />
                </Link>
              </span>
            </div>
          );
        } else {
          // Para color sólido, usar border normal
          return (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link
                to="/blog"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md ${!currentStyles.buttonBackground ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800' : 'hover:opacity-90'}`}
                style={{
                  background: currentStyles.buttonBackground || undefined,
                  color: currentStyles.buttonText || undefined,
                  borderColor: currentStyles.buttonBorder || undefined,
                  borderWidth: currentStyles.buttonBorder ? '2px' : undefined,
                  borderStyle: currentStyles.buttonBorder ? 'solid' : undefined,
                }}
              >
                Explorar más artículos
                <ArrowRight size={18} />
              </Link>
            </div>
          );
        }
      })()}
    </section>
  );
}