import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { DefaultFeaturedBlogConfig } from '../../utils/defaultConfig';
import { FeaturedBlogSkeleton } from '../common/SectionSkeletons';
import DynamicIcon from '../ui/DynamicIcon';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    firstName?: string;
    lastName?: string;
    username?: string;
  } | null;
  category: {
    name: string;
    slug: string;
    color?: string;
  };
  publishedAt: string;
  readingTime: number;
}

interface FeaturedBlogSectionProps {
  data?: DefaultFeaturedBlogConfig;
  themeConfig?: any;
}

/**
 * Sección de Blogs/Webinars Destacados
 * Muestra los posts marcados como "destacados" en el home
 * Configurable desde CMS con estilos y textos personalizados
 */
const FeaturedBlogSection = ({ data, themeConfig }: FeaturedBlogSectionProps) => {
  // Todos los hooks ANTES de cualquier early return (reglas de React Hooks)
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!data) return;

    const controller = new AbortController();
    let isMounted = true;

    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(
          `${apiUrl}/blog/posts/featured?limit=${data.limit || 3}`,
          { signal: controller.signal }
        );

        if (response.ok && isMounted) {
          const responseData = await response.json();
          setPosts(responseData.data || []);
          setError(false);
        } else {
          if (isMounted) setError(true);
        }
      } catch (err) {
        if ((err as any).name !== 'AbortError' && isMounted) {
          console.error('Error fetching featured posts:', err);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [data?.limit]);

  if (!data) return <FeaturedBlogSkeleton />;

  const isDarkMode = theme === 'dark';

  // Obtener estilos según el tema actual
  const currentStyles = isDarkMode ? data.styles?.dark : data.styles?.light;
  const currentCardsDesign = isDarkMode ? data.cardsDesign?.dark : data.cardsDesign?.light;
  const currentBackgroundImage = isDarkMode ? data.backgroundImage?.dark : data.backgroundImage?.light;

  // 🆕 Obtener configuración del botón del tema
  const buttonConfig = isDarkMode
    ? themeConfig?.darkMode?.buttons?.featuredBlogCta
    : themeConfig?.lightMode?.buttons?.featuredBlogCta;

  const buttonText = buttonConfig?.text || data.buttonText;
  const buttonBackground = buttonConfig?.background || 'linear-gradient(135deg, #8B5CF6, #06B6D4)';
  const buttonTextColor = buttonConfig?.textColor || '#FFFFFF';
  const buttonBorderColor = buttonConfig?.borderColor || 'transparent';

  // No renderizar nada si hay error o no hay posts
  if (error || (!loading && posts.length === 0)) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-20 theme-transition" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="theme-bg-card theme-border rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Función para obtener nombre completo del autor
  const getAuthorName = (author: BlogPost['author']) => {
    if (!author) return 'THADO Consulting';
    const firstName = author.firstName || '';
    const lastName = author.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || author.username || 'THADO Consulting';
  };

  return (
    <section 
      className="py-20 theme-transition relative overflow-hidden bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundColor: 'var(--color-background)',
        backgroundImage: currentBackgroundImage ? `url(${currentBackgroundImage})` : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14">
              <DynamicIcon 
                name={data.headerIcon || 'Newspaper'} 
                size={window.innerWidth >= 768 ? 40 : 32}
                color={data.headerIconColor || '#8B5CF6'}
              />
            </div>
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ 
                color: currentStyles?.titleColor || undefined,
                fontFamily: data.fontFamily || 'Montserrat'
              }}
            >
              {data.title}
            </h2>
          </div>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ 
              color: currentStyles?.subtitleColor || undefined,
              fontFamily: data.fontFamily || 'Montserrat'
            }}
          >
            {data.subtitle}
          </p>
          {data.description && (
            <p 
              className="text-base max-w-2xl mx-auto mt-2"
              style={{ 
                color: currentStyles?.descriptionColor || undefined,
                fontFamily: data.fontFamily || 'Montserrat'
              }}
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col"
              style={{
                background: currentCardsDesign?.background || undefined,
                border: `${currentCardsDesign?.borderWidth || '1px'} solid ${currentCardsDesign?.border || 'transparent'}`,
                boxShadow: currentCardsDesign?.shadow || undefined
              }}
              onMouseEnter={(e) => {
                if (currentCardsDesign?.hoverBackground) {
                  e.currentTarget.style.background = currentCardsDesign.hoverBackground;
                }
                if (currentCardsDesign?.hoverShadow) {
                  e.currentTarget.style.boxShadow = currentCardsDesign.hoverShadow;
                }
              }}
              onMouseLeave={(e) => {
                if (currentCardsDesign?.background) {
                  e.currentTarget.style.background = currentCardsDesign.background;
                }
                if (currentCardsDesign?.shadow) {
                  e.currentTarget.style.boxShadow = currentCardsDesign.shadow;
                }
              }}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-purple-500 to-cyan-500">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                  </div>
                )}

                {/* Category Badge - Floating */}
                <div className="absolute top-4 left-4 z-10">
                  <span 
                    className="px-4 py-1.5 text-xs font-bold rounded-full shadow-lg transition-transform group-hover:scale-110"
                    style={{
                      background: post.category.color 
                        ? `linear-gradient(135deg, ${post.category.color}, ${post.category.color}dd)`
                        : (currentCardsDesign?.badgeBackground || 'linear-gradient(135deg, #8B5CF6, #06B6D4)'),
                      color: currentCardsDesign?.badgeTextColor || '#ffffff'
                    }}
                  >
                    {post.category.name}
                  </span>
                </div>

                {/* Featured Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Meta Information */}
                <div 
                  className="flex items-center flex-wrap gap-4 text-xs mb-3"
                  style={{ color: currentCardsDesign?.metaColor || undefined }}
                >
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">
                      {getAuthorName(post.author)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingTime} min</span>
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="text-xl font-bold mb-3 transition-colors line-clamp-2 leading-snug"
                  style={{ color: currentCardsDesign?.titleColor || undefined }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p 
                  className="text-sm mb-4 line-clamp-3 flex-grow leading-relaxed"
                  style={{ color: currentCardsDesign?.excerptColor || undefined }}
                >
                  {post.excerpt}
                </p>

                {/* Read More CTA */}
                <div className="flex items-center justify-between pt-4 border-t theme-border">
                  <span 
                    className="text-sm font-medium transition-colors"
                    style={{ color: currentCardsDesign?.ctaColor || undefined }}
                  >
                    Leer artículo
                  </span>
                  <div 
                    className="flex items-center space-x-1 group-hover:space-x-2 transition-all"
                    style={{ color: currentCardsDesign?.ctaColor || undefined }}
                  >
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA to Blog */}
        <div className="text-center">
          <Link
            to={data.buttonLink}
            className="inline-flex items-center space-x-3 px-8 py-4 font-semibold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            style={{
              background: buttonBackground,
              color: buttonTextColor,
              border: buttonBorderColor !== 'transparent' ? `2px solid ${buttonBorderColor}` : 'none'
            }}
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogSection;
