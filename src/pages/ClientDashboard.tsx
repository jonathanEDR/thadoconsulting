/**
 * 👤 Client Dashboard
 * Dashboard simplificado para roles USER y CLIENT
 * Interfaz limpia enfocada en consumo de contenido y servicios
 * 🎨 Estilos configurables desde CMS
 * 🏢 Siempre muestra marca Thado Consulting como autor
 */

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import RoleBadge from '../components/RoleBadge';
import { formatUserName } from '../types/roles';
import { blogPostApi } from '../services/blog';
import type { BlogPost } from '../types/blog';
import { getImageUrl } from '../utils/imageUtils';
import { useDashboardFeaturedPostsConfig } from '../hooks/cms/useDashboardFeaturedPostsConfig';
import { useDashboardSidebarConfig } from '../hooks/cms/useDashboardSidebarConfig';
import DynamicIcon from '../components/ui/DynamicIcon';
import { BRAND_AUTHOR } from '../config/brandConstants';

// ============================================
// CACHE PARA POSTS DESTACADOS
// ============================================
const FEATURED_POSTS_CACHE_KEY = 'client-dashboard-featured-posts';
const FEATURED_POSTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutos

interface CachedPosts {
  posts: BlogPost[];
  timestamp: number;
}

const getCachedPosts = (): BlogPost[] | null => {
  try {
    const cached = localStorage.getItem(FEATURED_POSTS_CACHE_KEY);
    if (cached) {
      const { posts, timestamp }: CachedPosts = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > FEATURED_POSTS_CACHE_TTL;
      if (!isExpired && posts.length > 0) {
        console.log('📰 [ClientDashboard] Usando posts desde cache');
        return posts;
      }
    }
  } catch (e) {
    console.warn('⚠️ [ClientDashboard] Error leyendo cache de posts:', e);
  }
  return null;
};

const setCachedPosts = (posts: BlogPost[]) => {
  try {
    const cached: CachedPosts = {
      posts,
      timestamp: Date.now()
    };
    localStorage.setItem(FEATURED_POSTS_CACHE_KEY, JSON.stringify(cached));
    console.log('💾 [ClientDashboard] Posts guardados en cache');
  } catch (e) {
    console.warn('⚠️ [ClientDashboard] Error guardando cache de posts:', e);
  }
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { config } = useDashboardFeaturedPostsConfig();
  const { clientConfig } = useDashboardSidebarConfig();
  
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>(() => {
    // Intentar cargar desde cache inmediatamente para evitar flash
    const cached = getCachedPosts();
    return cached || [];
  });
  const [loading, setLoading] = useState(() => {
    // Si hay cache, no mostrar loading
    return !getCachedPosts();
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para cargar posts destacados (con cache)
  const loadFeaturedPosts = useCallback(async (forceRefresh = false) => {
    try {
      // Intentar cargar desde cache primero (si no es refresh forzado)
      if (!forceRefresh) {
        const cachedPosts = getCachedPosts();
        if (cachedPosts) {
          setFeaturedPosts(cachedPosts);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // Obtener posts destacados o populares
      const [featuredResponse, popularResponse] = await Promise.allSettled([
        blogPostApi.getFeaturedPosts(),
        blogPostApi.getPopularPosts(6)
      ]);

      let posts: BlogPost[] = [];
      
      // Priorizar posts destacados
      if (featuredResponse.status === 'fulfilled' && featuredResponse.value.data?.length > 0) {
        posts = featuredResponse.value.data;
      } else if (popularResponse.status === 'fulfilled' && popularResponse.value.data?.length > 0) {
        posts = popularResponse.value.data;
      }

      // Mezclar aleatoriamente y tomar solo 5
      const shuffled = posts.sort(() => Math.random() - 0.5).slice(0, 5);
      setFeaturedPosts(shuffled);
      setCurrentIndex(0);
      
      // Guardar en cache
      setCachedPosts(shuffled);
    } catch (error) {
      console.error('Error cargando posts destacados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar posts al montar
  useEffect(() => {
    document.title = 'Mi Dashboard | Web Scuti';
    loadFeaturedPosts();
  }, [loadFeaturedPosts]);

  // Auto-rotate carousel - usa intervalo configurable
  useEffect(() => {
    if (featuredPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
    }, config.carousel.autoRotateInterval);

    return () => clearInterval(interval);
  }, [featuredPosts.length, config.carousel.autoRotateInterval]);

  const nextPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
  };

  const prevPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const goToPost = (index: number) => {
    setCurrentIndex(index);
  };

  if (!user) {
    return null;
  }

  const userName = formatUserName(user);

  return (
    <div className="max-w-7xl mx-auto">
        {/* Panel de Posts Destacados del Blog con Bienvenida integrada */}
        <div 
          className={`rounded-${config.panel.borderRadius} shadow-${config.panel.shadowSize} overflow-hidden mb-8`}
          style={{ 
            backgroundColor: isDark ? config.panel.bgColorDark : config.panel.bgColorLight,
            fontFamily: `'${config.typography.fontFamily}', sans-serif`
          }}
        >
          {/* Header de Bienvenida - Usa colores del sidebar */}
          <div 
            className="p-6 text-white"
            style={{
              background: isDark
                ? `linear-gradient(to right, ${clientConfig.headerGradientFromDark}, ${clientConfig.headerGradientViaDark}, ${clientConfig.headerGradientToDark})`
                : `linear-gradient(to right, ${clientConfig.headerGradientFrom}, ${clientConfig.headerGradientVia}, ${clientConfig.headerGradientTo})`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  ¡Bienvenido, {userName}! 👋
                </h1>
                <p className="text-blue-100 dark:text-purple-100">
                  Estamos felices de verte de nuevo
                </p>
              </div>
              <div className="hidden md:block">
                <RoleBadge role={user.role} size="lg" />
              </div>
            </div>
          </div>

          {/* Contenido del panel de noticias */}
          <div className={`p-${config.panel.padding}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ color: isDark ? config.header.titleColorDark : config.header.titleColorLight }}
                >
                  <DynamicIcon 
                    name={config.header.iconName} 
                    className="w-7 h-7" 
                    style={{ color: isDark ? config.header.iconColorDark : config.header.iconColorLight }}
                  />
                  {config.header.title}
                </h2>
                {featuredPosts.length > 1 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {currentIndex + 1} / {featuredPosts.length}
                  </span>
                )}
              </div>
              {config.header.showRefreshButton && (
                <button
                  onClick={() => loadFeaturedPosts(true)}
                  className="text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:opacity-90"
                  style={{ 
                    background: config.refreshButton.bgType === 'gradient' 
                      ? `linear-gradient(to right, ${config.refreshButton.bgGradientFrom}, ${config.refreshButton.bgGradientTo})`
                      : config.refreshButton.bgType === 'solid'
                      ? (isDark ? config.refreshButton.bgColorDark : config.refreshButton.bgColorLight)
                      : 'transparent',
                    color: isDark ? config.refreshButton.textColorDark : config.refreshButton.textColorLight,
                    border: config.refreshButton.borderEnabled 
                      ? config.refreshButton.borderType === 'solid'
                        ? `${config.refreshButton.borderWidth}px solid ${isDark ? config.refreshButton.borderColorDark : config.refreshButton.borderColorLight}`
                        : `${config.refreshButton.borderWidth}px solid transparent`
                      : 'none',
                    ...(config.refreshButton.borderEnabled && config.refreshButton.borderType === 'gradient' && {
                      borderImage: `linear-gradient(to right, ${config.refreshButton.borderGradientFrom}, ${config.refreshButton.borderGradientTo}) 1`
                    })
                  }}
                >
                  <DynamicIcon 
                    name={config.refreshButton.iconName} 
                    className="w-4 h-4"
                    style={{ color: isDark ? config.refreshButton.iconColorDark : config.refreshButton.iconColorLight }}
                  />
                  {config.refreshButton.text}
                </button>
              )}
            </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="w-full md:w-1/2 bg-gray-200 dark:bg-gray-700 h-80 rounded-lg"></div>
              </div>
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="relative">
              {/* Carousel container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {featuredPosts.map((post) => (
                    <div key={post._id} className="min-w-full">
                      <a
                        href={`/blog/${post.slug}`}
                        className={`group rounded-${config.card.borderRadius} overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row block`}
                        style={{ 
                          background: `linear-gradient(to bottom right, ${isDark ? config.card.bgGradientFromDark : config.card.bgGradientFromLight}, ${isDark ? config.card.bgGradientToDark : config.card.bgGradientToLight})`,
                          transform: 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = `scale(${config.card.hoverScale})`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {/* Contenido del texto - Izquierda */}
                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                          {/* Badge de categoría */}
                          {post.category && (
                            <div className="inline-flex items-center gap-2 mb-4">
                              <span 
                                className="px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                                style={{ 
                                  background: `linear-gradient(to right, ${config.categoryBadge.gradientFrom}, ${config.categoryBadge.gradientTo})`,
                                  color: config.categoryBadge.textColor
                                }}
                              >
                                {config.categoryBadge.showIcon && (
                                  <DynamicIcon 
                                    name={config.categoryBadge.iconName}
                                    className="w-4 h-4"
                                    style={{ color: config.categoryBadge.iconColor }}
                                  />
                                )}
                                {typeof post.category === 'object' ? post.category.name : post.category}
                              </span>
                            </div>
                          )}

                          {/* Título */}
                          <h3 
                            className="text-3xl md:text-4xl font-bold mb-4 leading-tight transition-colors"
                            style={{ 
                              color: isDark ? config.typography.titleColorDark : config.typography.titleColorLight,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = isDark ? config.typography.titleHoverColorDark : config.typography.titleHoverColorLight;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = isDark ? config.typography.titleColorDark : config.typography.titleColorLight;
                            }}
                          >
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p 
                            className="text-lg mb-6 leading-relaxed line-clamp-4"
                            style={{ color: isDark ? config.typography.excerptColorDark : config.typography.excerptColorLight }}
                          >
                            {post.excerpt}
                          </p>
                          
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {post.tags.slice(0, config.tags.maxTags).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 text-sm rounded-full font-medium"
                                  style={{
                                    backgroundColor: isDark ? config.tags.bgColorDark : config.tags.bgColorLight,
                                    color: isDark ? config.tags.textColorDark : config.tags.textColorLight
                                  }}
                                >
                                  #{typeof tag === 'object' ? tag.name : tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Metadata y CTA */}
                          <div className="space-y-4 mt-auto">
                            {/* Separador */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4"></div>
                            
                            {/* Autor y estadísticas - Siempre marca Thado Consulting */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center p-1 border-2 border-white dark:border-gray-600 shadow-md">
                                  <img
                                    src={BRAND_AUTHOR.logo}
                                    alt={BRAND_AUTHOR.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span 
                                    className="font-bold text-base"
                                    style={{ color: isDark ? config.author.nameColorDark : config.author.nameColorLight }}
                                  >
                                    {BRAND_AUTHOR.name}
                                  </span>
                                  {post.publishedAt && (
                                    <span 
                                      className="text-sm"
                                      style={{ color: isDark ? config.author.dateColorDark : config.author.dateColorLight }}
                                    >
                                      {new Date(post.publishedAt).toLocaleDateString('es-ES', { 
                                        day: 'numeric', 
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-2 font-semibold">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  {post.analytics?.views || 0}
                                </span>
                                {post.analytics?.likes && post.analytics.likes > 0 && (
                                  <span className="flex items-center gap-2 font-semibold">
                                    ❤️ {post.analytics.likes}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* CTA de leer más */}
                            <div 
                              className="inline-flex items-center gap-3 font-bold text-lg group-hover:gap-4 transition-all"
                              style={{ 
                                color: isDark ? config.cta.textColorDark : config.cta.textColorLight,
                                ...(config.cta.bgType !== 'transparent' && {
                                  background: config.cta.bgType === 'gradient'
                                    ? `linear-gradient(to right, ${config.cta.bgGradientFrom}, ${config.cta.bgGradientTo})`
                                    : (isDark ? config.cta.bgColorDark : config.cta.bgColorLight),
                                  padding: '0.5rem 1rem',
                                  borderRadius: '0.5rem'
                                }),
                                ...(config.cta.borderEnabled && {
                                  border: config.cta.borderType === 'solid'
                                    ? `${config.cta.borderWidth}px solid ${isDark ? config.cta.borderColorDark : config.cta.borderColorLight}`
                                    : `${config.cta.borderWidth}px solid transparent`,
                                  ...(config.cta.borderType === 'gradient' && {
                                    borderImage: `linear-gradient(to right, ${config.cta.borderGradientFrom}, ${config.cta.borderGradientTo}) 1`
                                  })
                                })
                              }}
                            >
                              {config.cta.text}
                              <DynamicIcon 
                                name={config.cta.iconName}
                                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                                style={{ color: isDark ? config.cta.iconColorDark : config.cta.iconColorLight }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Imagen destacada - Derecha */}
                        <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
                          {post.featuredImage ? (
                            <img
                              src={getImageUrl(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ESin imagen%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                background: `linear-gradient(to bottom right, ${config.image.fallbackGradientFrom}, ${config.image.fallbackGradientVia}, ${config.image.fallbackGradientTo})`
                              }}
                            >
                              <DynamicIcon 
                                name={config.image.fallbackIconName} 
                                className="w-24 h-24"
                                style={{ color: config.image.fallbackIconColor }}
                              />
                            </div>
                          )}
                          {/* Overlay gradient sutil */}
                          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-50/20 dark:to-gray-900/20"></div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles del carrusel */}
              {featuredPosts.length > 1 && (
                <>
                  {/* Botones Anterior/Siguiente */}
                  <button
                    onClick={prevPost}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    style={{ 
                      backgroundColor: isDark ? config.carousel.controlsBgDark : config.carousel.controlsBgLight,
                      color: isDark ? config.carousel.controlsIconColorDark : config.carousel.controlsIconColorLight
                    }}
                    aria-label="Post anterior"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextPost}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    style={{ 
                      backgroundColor: isDark ? config.carousel.controlsBgDark : config.carousel.controlsBgLight,
                      color: isDark ? config.carousel.controlsIconColorDark : config.carousel.controlsIconColorLight
                    }}
                    aria-label="Post siguiente"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Indicadores de puntos */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToPost(index)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: index === currentIndex ? '2rem' : '0.5rem',
                          height: '0.5rem',
                          backgroundColor: index === currentIndex 
                            ? config.carousel.indicatorActiveColor 
                            : (isDark ? config.carousel.indicatorInactiveColorDark : config.carousel.indicatorInactiveColorLight)
                        }}
                        aria-label={`Ir al post ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <DynamicIcon 
                name={config.emptyState.iconName} 
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: isDark ? config.emptyState.iconColorDark : config.emptyState.iconColorLight }}
              />
              <p 
                className="text-lg"
                style={{ color: isDark ? config.emptyState.textColorDark : config.emptyState.textColorLight }}
              >
                {isDark ? config.emptyState.messageDark : config.emptyState.messageLight}
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            Accesos Rápidos
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/dashboard/profile"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                👤
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Mi Perfil
              </span>
            </Link>

            <Link
              to="/dashboard/mi-blog"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                📚
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Mi Actividad
              </span>
            </Link>
          </div>
        </div>
      </div>
  );
}

