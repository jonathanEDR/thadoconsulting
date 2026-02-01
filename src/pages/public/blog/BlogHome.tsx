import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Newspaper } from 'lucide-react';
import { useBlogPosts, useFeaturedPosts, useCategories, useTags } from '../../../hooks/blog';
import { useBlogCmsConfig } from '../../../hooks/blog/useBlogCmsConfig';
import { SimpleHeroSection } from '../../../components/blog/hero/SimpleHeroSection';
import { FeaturedBlogCard } from '../../../components/blog/cards/FeaturedBlogCard';
import { AllNewsSection } from '../../../components/blog/sections/AllNewsSection';
import { BlogCtaSection } from '../../../components/blog/sections/BlogCtaSection';
import PublicHeader from '../../../components/public/PublicHeader';
import PublicFooter from '../../../components/public/PublicFooter';

// ✅ Skeleton para Featured Posts mientras carga la configuración
const FeaturedPostsSkeleton: React.FC = () => (
  <section className="relative py-12 bg-gray-100 dark:bg-gray-900 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div className="w-48 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
        <div className="flex flex-col gap-4">
          <div className="h-44 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-44 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  </section>
);

// ✅ Skeleton para All News mientras carga la configuración
const AllNewsSkeleton: React.FC = () => (
  <section className="py-12 bg-white dark:bg-gray-800 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    </div>
  </section>
);

const BlogHome: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // 🏷️ Estado para tag seleccionado
  const [searchQuery, setSearchQuery] = useState(''); // 🔍 Estado para búsqueda
  const postsPerPage = 9;

  // 🆕 Cargar configuración del CMS y tema actual
  // ✅ loading: true si no hay cache disponible (evita flash de layout)
  const { config: cmsConfig, loading: cmsLoading } = useBlogCmsConfig();
  const featuredPostsConfig = cmsConfig.featuredPosts;

  // Fetch posts with filters
  const { 
    posts, 
    pagination
  } = useBlogPosts({
    page: currentPage,
    limit: postsPerPage,
    isPublished: true,
    categoria: selectedCategory || undefined,
    tags: selectedTag ? [selectedTag] : undefined, // 🏷️ Agregar filtro de tag
    search: searchQuery || undefined // 🔍 Agregar búsqueda
  });

  // Fetch featured posts (posts marked as isFeatured: true)
  const { 
    posts: featuredPosts
  } = useFeaturedPosts();

  // Fetch categories
  const { 
    categories 
  } = useCategories();

  // Fetch tags
  const { 
    tags 
  } = useTags();

  // Handle category filter
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedTag(null); // Limpiar tag al cambiar categoría
    setCurrentPage(1); // Reset to first page
  };

  // Handle tag filter
  const handleTagClick = (tagId: string | null) => {
    setSelectedTag(tagId);
    setCurrentPage(1); // Reset to first page
  };

  // 🔍 Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  // ⚡ Memoizar JSON-LD para evitar regenerarlo en cada render
  const jsonLdData = useMemo(() => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog THADO Consulting - Contabilidad y Tributación',
    description: 'Artículos sobre contabilidad, tributación SUNAT, gestión financiera y consejos para MYPES en Perú',
    url: 'https://www.thadoconsulting.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'THADO Consulting',
      url: 'https://www.thadoconsulting.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.thadoconsulting.com/FAVICON.png'
      }
    },
    inLanguage: 'es-ES',
    keywords: 'contabilidad, tributación, SUNAT, MYPES, gestión financiera, libros electrónicos, PDT, Perú'
  }), []);

  // ⚡ Memoizar estilos de la sección featured posts - USA TEMA GLOBAL
  const featuredStyles = useMemo(() => {
    const titleColor = 'var(--color-text)';
    const iconColor = 'var(--color-primary)';
    const iconBgColor = 'color-mix(in srgb, var(--color-primary) 20%, transparent)';

    return { 
      sectionStyle: { backgroundColor: 'var(--color-background)' }, 
      titleColor, 
      iconColor, 
      iconBgColor 
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ✅ SEO Hardcoded directo (para indexación inmediata de Google) */}
      <Helmet>
        <title>Blog THADO Consulting - Contabilidad y Tributación para MYPES</title>
        <meta name="description" content="Artículos sobre contabilidad, tributación SUNAT, gestión financiera y consejos prácticos para MYPES en Perú. Blog de expertos contables." />
        <meta name="keywords" content="blog contabilidad, tributación SUNAT, MYPES Perú, gestión financiera, libros electrónicos, PDT, planificación fiscal" />

        {/* Open Graph */}
        <meta property="og:title" content="Blog THADO Consulting - Contabilidad y Tributación" />
        <meta property="og:description" content="Artículos sobre contabilidad, tributación SUNAT y gestión financiera para MYPES en Perú." />
        <meta property="og:image" content="https://www.thadoconsulting.com/logohorizontalconfondo.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="THADO Consulting - Blog de Contabilidad y Tributación" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thadoconsulting.com/blog" />
        <meta property="og:site_name" content="THADO Consulting" />
        <meta property="og:locale" content="es_PE" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog THADO Consulting - Contabilidad y Tributación" />
        <meta name="twitter:description" content="Artículos sobre contabilidad, tributación SUNAT y gestión financiera para MYPES en Perú" />
        <meta name="twitter:image" content="https://www.thadoconsulting.com/logohorizontalconfondo.jpg" />
        <meta name="twitter:image:alt" content="THADO Consulting - Blog de Contabilidad y Tributación" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.thadoconsulting.com/blog" />
      </Helmet>

      {/* JSON-LD para el sitio del blog - Memoizado */}
      <script type="application/ld+json">
        {jsonLdData}
      </script>

      {/* Header de navegación */}
      <PublicHeader />

      {/* Simple Hero Section */}
      <SimpleHeroSection 
        totalPosts={pagination?.total || 0}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Featured Posts Section - Noticias Destacadas */}
      {/* ✅ Mostrar skeleton mientras carga la config del CMS (evita flash de layout) */}
      {cmsLoading && featuredPosts && featuredPosts.length > 0 && <FeaturedPostsSkeleton />}
      
      {/* ✅ Mostrar sección real solo cuando la config esté lista */}
      {!cmsLoading && featuredPosts && featuredPosts.length > 0 && (
        <section 
          className="relative py-12 transition-colors duration-300"
          style={featuredStyles.sectionStyle}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              {featuredPostsConfig?.showIcon !== false && (
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: featuredStyles.iconBgColor }}
                >
                  <Newspaper style={{ color: featuredStyles.iconColor }} size={24} />
                </div>
              )}
              <h2 
                className="text-3xl font-bold"
                style={{ color: featuredStyles.titleColor }}
              >
                {featuredPostsConfig?.sectionTitle || 'Noticias Destacadas'}
              </h2>
            </div>
        
          {/* Layout dinámico según configuración */}
          {featuredPostsConfig?.layout === 'stacked' ? (
            // Layout Apilado: Una tarjeta por fila - Centrado con ancho máximo
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
              {featuredPosts.slice(0, featuredPostsConfig?.maxFeaturedPosts || 3).map((post) => (
                <FeaturedBlogCard
                  key={post._id}
                  post={post}
                  variant="hero"
                  config={featuredPostsConfig}
                />
              ))}
            </div>
          ) : featuredPostsConfig?.layout === 'grid' ? (
            // Layout Grid: 3 columnas
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.slice(0, featuredPostsConfig?.maxFeaturedPosts || 3).map((post) => (
                  <FeaturedBlogCard
                    key={post._id}
                    post={post}
                    variant="hero"
                    config={featuredPostsConfig}
                  />
                ))}
              </div>
            ) : (
              // Layout Hero (izquierda o derecha) + tarjetas pequeñas
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tarjeta Hero */}
                {featuredPosts[0] && (
                  <div className={`lg:col-span-2 ${
                    featuredPostsConfig?.layout === 'hero-right' ? 'lg:order-2' : ''
                  }`}>
                    <FeaturedBlogCard
                      post={featuredPosts[0]}
                      variant="hero"
                      config={featuredPostsConfig}
                    />
                  </div>
                )}
                
                {/* Tarjetas pequeñas */}
                {(featuredPostsConfig?.maxFeaturedPosts || 3) > 1 && (
                  <div className={`flex flex-col gap-4 ${
                    featuredPostsConfig?.layout === 'hero-right' ? 'lg:order-1' : ''
                  }`}>
                    {featuredPosts.slice(1, featuredPostsConfig?.maxFeaturedPosts || 3).map((post) => (
                      <FeaturedBlogCard
                        key={post._id}
                        post={post}
                        variant="small"
                        config={featuredPostsConfig}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* All News Section - Todas las Noticias (Nuevo diseño maqueta) */}
      {/* ✅ Mostrar skeleton mientras carga la config del CMS */}
      {cmsLoading && <AllNewsSkeleton />}
      
      {/* ✅ Mostrar sección real solo cuando la config esté lista */}
      {!cmsLoading && (
        <AllNewsSection
          posts={posts || []}
          categories={categories || []}
          tags={tags || []}
          config={cmsConfig.allNews}
          onCategorySelect={handleCategoryClick}
          onTagSelect={handleTagClick}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
        />
      )}

      {/* CTA Section - Último Llamado */}
      {!cmsLoading && <BlogCtaSection config={cmsConfig.blogCta} />}

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default BlogHome;
