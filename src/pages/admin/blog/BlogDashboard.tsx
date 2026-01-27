/**
 * 📊 BlogDashboard Component
 * Panel de control principal del blog con estadísticas
 * ✅ Incluye opción de invalidar caché manualmente
 */

import { useEffect, useState } from 'react';
import { 
  FileText, MessageCircle, Eye, TrendingUp, 
  Users, Calendar, BarChart3, Clock, Target, Trash2, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories, useAdminPosts } from '../../../hooks/blog';
import { useModerationStats } from '../../../hooks/blog/useModerationQueue';
import { useBlogDashboardCache } from '../../../hooks/blog/useBlogDashboardCache';
import { BlogAnalyticsDashboard } from '../../../components/blog/analytics/BlogAnalyticsDashboard';
import { SEOCanvasModal } from '../../../components/admin/seo';
import { useAuth } from '../../../contexts/AuthContext';
import { blogPostApi } from '../../../services/blog';
import { invalidateAllBlogCache } from '../../../utils/blogCache';
import { useDashboardSidebarConfig } from '../../../hooks/cms/useDashboardSidebarConfig';
import { useTheme } from '../../../contexts/ThemeContext';

export default function BlogDashboard() {
  
  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
  
  // Estado para SEO Canvas
  const [isSEOCanvasOpen, setIsSEOCanvasOpen] = useState(false);
  const [selectedPostForSEO, setSelectedPostForSEO] = useState<any>(null);
  const [seoCanvasInitialMode, setSeoCanvasInitialMode] = useState<'chat' | 'analysis' | 'structure' | 'review'>('chat');
  
  // Estado para eliminación de posts
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Estado para paginación "Ver Más"
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>([]);
  const POSTS_PER_PAGE = 10;

  // Hook de autenticación para verificar permisos
  const { role } = useAuth();
  
  // 🎨 Configuración de colores del sidebar para consistencia
  const { adminConfig } = useDashboardSidebarConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Estilos de botones basados en el sidebar
  const buttonStyles = {
    primary: {
      background: `linear-gradient(to right, ${adminConfig.activeItemGradientFrom || '#3b82f6'}, ${adminConfig.activeItemGradientTo || '#a855f7'})`,
      backgroundDark: `linear-gradient(to right, ${adminConfig.activeItemGradientFromDark || '#6366f1'}, ${adminConfig.activeItemGradientToDark || '#ec4899'})`
    },
    secondary: {
      background: `linear-gradient(to right, ${adminConfig.headerGradientFrom || '#1e3a8a'}, ${adminConfig.headerGradientTo || '#7e22ce'})`,
      backgroundDark: `linear-gradient(to right, ${adminConfig.headerGradientFromDark || '#312e81'}, ${adminConfig.headerGradientToDark || '#86198f'})`
    }
  };
  
  // Usar useAdminPosts para obtener TODOS los posts (incluye borradores)
  const { posts, loading: postsLoading, refetch, pagination } = useAdminPosts({
    page: currentPage,
    limit: POSTS_PER_PAGE
  });

  // Acumular posts cuando lleguen nuevos
  useEffect(() => {
    if (posts.length > 0) {
      if (currentPage === 1) {
        setDisplayedPosts(posts);
      } else {
        setDisplayedPosts(prev => [...prev, ...posts]);
      }
    }
  }, [posts, currentPage]);

  // Cargar estadísticas de moderación para comentarios pendientes
  const { stats: moderationStats } = useModerationStats();
  
  const { categories, loading: categoriesLoading } = useCategories();

  // 🎨 Usar cache para estadísticas del blog
  const { stats, loadStats } = useBlogDashboardCache();

  // Calcular estadísticas con cache
  useEffect(() => {
    if (posts && posts.length > 0) {
      // console.log('📊 [Blog] Actualizando estadísticas desde posts');
      loadStats(posts);
    }
  }, [posts, loadStats]);

  // Handler para eliminar post
  const handleDeletePost = async (postId: string, postTitle: string) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar el post "${postTitle}"?\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeletingPostId(postId);
      
      const response = await blogPostApi.admin.deletePost(postId);
      
      if (response.success) {
        // Refrescar la lista de posts
        await refetch();
        
        // Notificar éxito
        alert('✅ Post eliminado exitosamente');
      } else {
        throw new Error(response.message || 'Error al eliminar el post');
      }
    } catch (error: any) {
      console.error('❌ Error al eliminar post:', error);
      alert(`❌ Error al eliminar el post: ${error.message || 'Error desconocido'}`);
    } finally {
      setDeletingPostId(null);
    }
  };

  // Handler para cargar más posts
  const handleLoadMore = () => {
    if (!postsLoading && pagination?.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Tarjetas de estadísticas
  const statCards = [
    {
      label: 'Total de Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'blue',
      trend: `+${stats.postsThisMonth} este mes`
    },
    {
      label: 'Publicados',
      value: stats.publishedPosts,
      icon: TrendingUp,
      color: 'green',
      trend: `${stats.draftPosts} borradores`
    },
    {
      label: 'Vistas Totales',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'purple',
      trend: 'Últimos 30 días'
    },
    {
      label: 'Comentarios',
      value: moderationStats?.pending || 0,
      icon: MessageCircle,
      color: 'orange',
      trend: `${moderationStats?.pending || 0} pendientes de moderar`
    },
    {
      label: 'Autores Activos',
      value: stats.totalAuthors,
      icon: Users,
      color: 'pink',
      trend: 'Colaboradores'
    },
    {
      label: 'Tiempo de Lectura',
      value: `${stats.avgReadingTime} min`,
      icon: Clock,
      color: 'indigo',
      trend: 'Promedio'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
  };

  return (
    <div className="blog-dashboard w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel del Blog</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona y monitorea el contenido de tu blog
          </p>
        </div>

        <div className="flex gap-3">
          {/* 🗑️ Botón Limpiar Caché - Solo para ADMIN/SUPER_ADMIN */}
          {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
            <button
              onClick={() => {
                invalidateAllBlogCache();
                refetch(); // Recargar datos frescos
                alert('✅ Caché del blog limpiado correctamente.\nLos usuarios verán los cambios actualizados.');
              }}
              style={{ 
                background: isDarkMode ? buttonStyles.secondary.backgroundDark : buttonStyles.secondary.background 
              }}
              className="inline-flex items-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-[1.02]"
              title="Limpiar caché del blog para forzar actualización"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Limpiar Caché</span>
            </button>
          )}
          
          {/* Botón SEO Canvas - Solo para ADMIN/SUPER_ADMIN */}
          {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
            <button
              onClick={() => {
                setSelectedPostForSEO(null);
                setSeoCanvasInitialMode('chat');
                setIsSEOCanvasOpen(true);
              }}
              style={{ 
                background: isDarkMode ? buttonStyles.primary.backgroundDark : buttonStyles.primary.background 
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] border border-white/20"
            >
              <Target className="w-5 h-5" />
              <span>SEO Canvas</span>
            </button>
          )}
          
          <Link
            to="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700 transition-all font-medium shadow-sm border border-gray-300 dark:border-gray-600"
          >
            <Eye className="w-5 h-5" />
            <span>Ver Blog</span>
          </Link>
          
          <Link
            to="/dashboard/blog/posts/new"
            style={{ 
              background: isDarkMode ? buttonStyles.primary.backgroundDark : buttonStyles.primary.background 
            }}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <FileText className="w-5 h-5" />
            <span>Nuevo Post</span>
          </Link>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'dashboard'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            📊 Dashboard General
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            🤖 Analytics con IA
          </button>
        </div>
      </div>

      {/* Contenido Condicional */}
      {activeTab === 'dashboard' ? (
        <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isCommentsCard = stat.label === 'Comentarios';
          
          const cardContent = (
            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-shadow ${
                isCommentsCard ? 'hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
          
          return isCommentsCard ? (
            <Link key={index} to="/dashboard/blog/moderation">
              {cardContent}
            </Link>
          ) : (
            <div key={index}>
              {cardContent}
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Recientes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Posts Recientes</h2>
              <Link
                to="/dashboard/blog/posts/new"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Crear Post</span>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {postsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No hay posts aún
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comienza creando tu primer artículo
                </p>
                <Link
                  to="/dashboard/blog/posts/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Crear Post</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedPosts.map((post) => (
                  <div
                    key={post._id}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-600"
                  >
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/dashboard/blog/posts/${post._id}/edit`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.stats?.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.stats?.commentsCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                        {!post.isPublished && (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full font-medium">
                            Borrador
                          </span>
                        )}
                      </div>
                      
                      {/* Acciones del post - Solo para ADMIN/SUPER_ADMIN */}
                      {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedPostForSEO(post);
                              setSeoCanvasInitialMode('analysis');
                              setIsSEOCanvasOpen(true);
                            }}
                            style={{ 
                              background: isDarkMode 
                                ? `linear-gradient(to right, ${adminConfig.activeItemGradientFromDark || '#6366f1'}20, ${adminConfig.activeItemGradientToDark || '#ec4899'}20)` 
                                : `linear-gradient(to right, ${adminConfig.activeItemGradientFrom || '#3b82f6'}15, ${adminConfig.activeItemGradientTo || '#a855f7'}15)`
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 hover:opacity-80 text-purple-700 dark:text-purple-300 rounded-lg transition-all text-xs font-medium border border-purple-300/50 dark:border-purple-500/30"
                          >
                            <Target className="w-3 h-3" />
                            <span>SEO Canvas</span>
                          </button>
                          
                          <Link
                            to={`/dashboard/blog/posts/${post._id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors text-xs font-medium"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Editar</span>
                          </Link>
                          
                          <button
                            onClick={() => handleDeletePost(post._id, post.title)}
                            disabled={deletingPostId === post._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-400 rounded-lg transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{deletingPostId === post._id ? 'Eliminando...' : 'Eliminar'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Botón Ver Más */}
                {pagination && pagination.hasNext && !postsLoading && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Ver Más Posts ({pagination.total - displayedPosts.length} restantes)
                  </button>
                )}

                {/* Indicador de carga */}
                {postsLoading && currentPage > 1 && (
                  <div className="w-full mt-4 py-3 text-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Cargando más posts...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categorías */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Categorías</h2>
                <Link
                  to="/dashboard/blog/categories"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Gestionar
                </Link>
              </div>
            </div>

            <div className="p-6">
              {categoriesLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !categories || categories.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                  No hay categorías
                </p>
              ) : (
                <div className="space-y-3">
                  {categories.slice(0, 8).map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category.postCount || 0}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h2>
            <div className="space-y-2">
              <Link
                to="/dashboard/blog/posts/new"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Crear nuevo post
                </span>
              </Link>
              <Link
                to="/dashboard/blog/categories"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Gestionar categorías
                </span>
              </Link>
              <button
                onClick={() => alert('Página de moderación de comentarios próximamente')}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
              >
                <MessageCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Moderar comentarios
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
      ) : (
        /* Analytics con IA */
        <BlogAnalyticsDashboard />
      )}

      {/* SEO Canvas Modal */}
      <SEOCanvasModal
        isOpen={isSEOCanvasOpen}
        onClose={() => {
          setIsSEOCanvasOpen(false);
          setSelectedPostForSEO(null);
          setSeoCanvasInitialMode('chat');
        }}
        initialMode={seoCanvasInitialMode}
        postContext={selectedPostForSEO ? {
          postId: selectedPostForSEO._id,
          title: selectedPostForSEO.title,
          content: selectedPostForSEO.content,
          description: selectedPostForSEO.seo?.metaDescription || selectedPostForSEO.excerpt,
          keywords: selectedPostForSEO.seo?.keywords || []
        } : undefined}
      />
    </div>
  );
}
