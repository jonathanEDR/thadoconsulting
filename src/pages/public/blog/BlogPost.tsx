/**
 * 📝 BlogPost con SEO Optimizado para IA
 * Versión pública con meta tags optimizados para que IA externa (ChatGPT, Claude, etc.) 
 * encuentre y cite nuestro contenido
 * 
 * ✅ Integrado con CMS para configuración dinámica
 * 🏢 Siempre muestra marca Thado Consulting como autor
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { useBlogPost } from '../../../hooks/blog';
import { usePostContent } from '../../../hooks/blog/usePostContent';
import { useCmsData } from '../../../hooks/cms/useCmsData';
import { useTheme } from '../../../contexts/ThemeContext';
import { BlogArticleSchema, BreadcrumbSchema } from '../../../components/seo/SchemaOrg';
import { BRAND_AUTHOR } from '../../../config/brandConstants';
import { 
  TagList, 
  RelatedPosts, 
  TableOfContents, 
  PostNavigation, 
  PostHero,
  AuthorCard,
  ReadingProgress,
  LikeButton,
  FavoriteButton
} from '../../../components/blog/common';
import { CommentsList } from '../../../components/blog/comments';
import { sanitizeHTML } from '../../../utils/blog';
import { getImageUrl } from '../../../utils/imageUtils';
import PublicFooter from '../../../components/public/PublicFooter';
import PublicHeader from '../../../components/public/PublicHeader';

const BlogPostEnhanced: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, relatedPosts, loading, error, isPrerendering } = useBlogPost(slug || '');
  const { theme } = useTheme();
  
  // ✅ Obtener configuración del CMS para blog-post-detail
  const { pageData: cmsConfig } = useCmsData('blog-post-detail');
  const blogPostConfig = cmsConfig?.content?.blogPostDetailConfig || {};
  
  // Extraer configuraciones específicas
  const heroConfig = blogPostConfig.hero || {};
  const contentConfig = blogPostConfig.content || {};
  const summaryBarConfig = blogPostConfig.summaryBar || {};
  const tocConfig = blogPostConfig.tableOfContents || {};
  const progressConfig = blogPostConfig.readingProgress || {};
  const authorConfig = blogPostConfig.author || {};
  const tagsConfig = blogPostConfig.tags || {};
  const relatedConfig = blogPostConfig.relatedPosts || {};
  const navConfig = blogPostConfig.navigation || {};
  const commentsConfig = blogPostConfig.comments || {};

  // Tipografía desde CMS
  const fontFamily = contentConfig.fontFamily || 'Montserrat, sans-serif';
  
  // Procesar contenido y generar TOC
  const { html: processedContent, tocItems } = usePostContent(post?.content || '', tocConfig.maxDepth || 3);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog THADO Consulting`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl animate-pulse space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-12 w-3/4 rounded"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-1/2 rounded"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded"></div>
          {[...Array(8)].map((_, i) => (<div key={i} className="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>))}
        </div>
      </div>
    );
  }

  // ✅ SEO FIX: Durante pre-renderizado, NO mostrar "Artículo no encontrado"
  // El contenido estático ya fue generado por prerender-blog.js y está en el HTML
  // Si mostramos el error, Google verá "Artículo no encontrado" en lugar del contenido real
  if ((error || !post) && !isPrerendering) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artículo no encontrado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">El artículo que buscas no existe o ha sido eliminado.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
              <ArrowLeft size={20} />
              Volver al blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Durante pre-renderizado sin datos, retornar null para que el HTML estático permanezca
  // El script prerender-blog.js ya generó el contenido SEO-friendly
  if (!post && isPrerendering) {
    return null;
  }

  // ✅ A partir de aquí, post existe y podemos renderizar normalmente
  if (!post) return null;

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: theme === 'dark' 
          ? (contentConfig.background?.dark || '#0f0f0f')
          : (contentConfig.background?.light || '#f9fafb')
      }}
    >
      {/* Barra de progreso de lectura */}
      {progressConfig.enabled !== false && (
        <ReadingProgress
          barColor={theme === 'dark'
            ? (progressConfig.barColor?.dark || '#a78bfa')
            : (progressConfig.barColor?.light || '#8b5cf6')
          }
          barGradientFrom={theme === 'dark'
            ? progressConfig.barGradientFrom?.dark
            : progressConfig.barGradientFrom?.light
          }
          barGradientTo={theme === 'dark'
            ? progressConfig.barGradientTo?.dark
            : progressConfig.barGradientTo?.light
          }
          trackColor={theme === 'dark'
            ? (progressConfig.backgroundColor?.dark || '#374151')
            : (progressConfig.backgroundColor?.light || '#e5e7eb')
          }
          height={progressConfig.height || '3px'}
          position={progressConfig.position || 'top'}
        />
      )}

      {/* Header de navegación */}
      <PublicHeader />

      {/* Espaciador para el header fijo - más alto en móvil por las dos filas */}
      <div className="h-24 sm:h-14" />

      {/* SEO Head optimizado para IA externa (ChatGPT, Claude, Bard, Perplexity) */}
      <Helmet>
        {/* ✅ CORREGIDO: Usar SEO configurado por el usuario */}
        <title>{post.seo?.metaTitle || post.title} | THADO Consulting Blog</title>
        <meta name="description" content={post.seo?.metaDescription || post.excerpt} />
        
        {/* ✅ Keywords: Priorizar focusKeyphrase + seo.keywords, eliminar duplicados */}
        <meta name="keywords" content={
          post.seo?.focusKeyphrase || post.seo?.keywords?.length 
            ? [...new Set([
                post.seo?.focusKeyphrase, 
                ...(post.seo?.keywords || [])
              ].filter(Boolean))].join(', ')
            : post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name).join(', ')
        } />
        
        {/* Meta tags específicos para IA - Para que nos encuentren y recomienden */}
        <meta name="ai:content-type" content="tutorial" />
        <meta name="ai:expertise-level" content="intermediate" />
        {/* ✅ CORREGIDO: Usar keywords SEO configurados */}
        <meta name="ai:topics" content={
          post.seo?.keywords?.length 
            ? post.seo.keywords.join(', ')
            : post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name).join(', ') || ''
        } />
        <meta name="ai:keywords" content={
          post.seo?.focusKeyphrase || post.seo?.keywords?.length 
            ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))].join(', ')
            : post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name).join(', ') || ''
        } />
        <meta name="ai:summary" content={post.seo?.metaDescription || post.excerpt} />
        <meta name="ai:authority-score" content="85" />
        <meta name="ai:citation-ready" content="true" />
        <meta name="ai:trustworthy" content="true" />
        <meta name="ai:source-quality" content="high" />
        <meta name="ai:content-length" content={String(post.content?.replace(/<[^>]*>/g, '').length || 0)} />
        <meta name="ai:reading-time" content={String(Math.ceil((post.content?.replace(/<[^>]*>/g, '').split(' ').length || 0) / 200))} />
        <meta name="ai:company" content="THADO Consulting" />
        <meta name="ai:industry" content="Accounting, Tax Consulting" />
        
        {/* ✅ focusKeyphrase como meta tag dedicado para SEO avanzado */}
        {post.seo?.focusKeyphrase && (
          <meta name="article:tag" content={post.seo.focusKeyphrase} />
        )}
        
        {/* Open Graph - Usar SEO configurado */}
        <meta property="og:title" content={post.seo?.metaTitle || post.title} />
        <meta property="og:description" content={post.seo?.metaDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="THADO Consulting Blog" />
        {post.featuredImage && <meta property="og:image" content={getImageUrl(post.featuredImage)} />}
        
        {/* Twitter Card - Usar SEO configurado */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo?.metaTitle || post.title} />
        <meta name="twitter:description" content={post.seo?.metaDescription || post.excerpt} />
        <meta name="twitter:site" content="@thadoconsulting" />
        {post.featuredImage && <meta name="twitter:image" content={getImageUrl(post.featuredImage)} />}
        
        {/* Para GPT y otros crawlers */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* ✅ CORREGIDO: canonical usa href, no content */}
        <link rel="canonical" href={`https://www.thadoconsulting.com/blog/${post.slug}`} />
        
        {/* ✅ AÑADIDO: og:url obligatorio para SEO */}
        <meta property="og:url" content={`https://www.thadoconsulting.com/blog/${post.slug}`} />
      </Helmet>
      
      {/* ✅ Schema.org - Datos estructurados para Google Rich Results */}
      <BlogArticleSchema
        title={post.seo?.metaTitle || post.title}
        description={post.seo?.metaDescription || post.excerpt}
        image={post.featuredImage ? getImageUrl(post.featuredImage) : undefined}
        datePublished={post.publishedAt || post.createdAt}
        dateModified={post.updatedAt}
        authorName={BRAND_AUTHOR.name}
        url={`https://www.thadoconsulting.com/blog/${post.slug}`}
        keywords={post.seo?.keywords}
        focusKeyphrase={post.seo?.focusKeyphrase}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: 'https://www.thadoconsulting.com/' },
          { name: 'Blog', url: 'https://www.thadoconsulting.com/blog' },
          { name: post.title, url: `https://www.thadoconsulting.com/blog/${post.slug}` }
        ]}
      />
      
      {/* Hero compacto: combina imagen + título + metadata */}
      <PostHero 
        post={post} 
        variant={heroConfig.variant || (post.featuredImage ? 'overlay' : 'compact')}
        showBreadcrumb={heroConfig.showBreadcrumb}
        showBackButton={heroConfig.showBackButton}
        showCategory={heroConfig.showCategory}
        showReadingTime={heroConfig.showReadingTime}
        showPublishDate={heroConfig.showPublishDate}
        showAuthor={heroConfig.showAuthor}
        overlayOpacity={heroConfig.overlayOpacity}
        // Nuevos props de estilos del CMS
        styles={heroConfig.styles}
        background={heroConfig.background}
        height={heroConfig.height}
      />

      {/* Barra de Resumen - Configurable desde CMS Sección 2 */}
      {summaryBarConfig.enabled !== false && (
        <div 
          className="relative z-[5]"
          style={{
            backgroundColor: theme === 'dark' 
              ? (summaryBarConfig.styles?.dark?.background || contentConfig.background?.dark || '#0f0f0f')
              : (summaryBarConfig.styles?.light?.background || contentConfig.background?.light || '#f9fafb')
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div 
              className="flex items-center justify-between py-4"
              style={{
                borderBottom: `1px solid ${
                  theme === 'dark' 
                    ? (summaryBarConfig.styles?.dark?.borderColor || '#374151')
                    : (summaryBarConfig.styles?.light?.borderColor || '#e5e7eb')
                }`
              }}
            >
            {/* Excerpt */}
            {summaryBarConfig.showExcerpt !== false && post.excerpt && (
              <p 
                className={`text-sm sm:text-base max-w-2xl ${
                  summaryBarConfig.excerptMaxLines === 1 ? 'line-clamp-1' :
                  summaryBarConfig.excerptMaxLines === 3 ? 'line-clamp-3' :
                  summaryBarConfig.excerptMaxLines === 0 ? '' : 'line-clamp-2'
                }`}
                style={{
                  color: theme === 'dark'
                    ? (summaryBarConfig.styles?.dark?.textColor || '#9ca3af')
                    : (summaryBarConfig.styles?.light?.textColor || '#4b5563')
                }}
              >
                {post.excerpt}
              </p>
            )}
            
            {/* Botones */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {summaryBarConfig.showLikeButton !== false && (
                <LikeButton 
                  postId={post._id} 
                  size="sm" 
                  iconColor={theme === 'dark' 
                    ? summaryBarConfig.styles?.dark?.buttonIconColor 
                    : summaryBarConfig.styles?.light?.buttonIconColor
                  }
                  bgColor={theme === 'dark' 
                    ? summaryBarConfig.styles?.dark?.buttonBgColor 
                    : summaryBarConfig.styles?.light?.buttonBgColor
                  }
                />
              )}
              {summaryBarConfig.showSaveButton !== false && (
                <FavoriteButton 
                  postId={post._id} 
                  size="sm"
                  iconColor={theme === 'dark' 
                    ? summaryBarConfig.styles?.dark?.buttonIconColor 
                    : summaryBarConfig.styles?.light?.buttonIconColor
                  }
                  bgColor={theme === 'dark' 
                    ? summaryBarConfig.styles?.dark?.buttonBgColor 
                    : summaryBarConfig.styles?.light?.buttonBgColor
                  }
                />
              )}
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Section with Background Image */}
      <div 
        className="relative flex-1"
        style={{
          backgroundColor: theme === 'dark' 
            ? (contentConfig.background?.dark || '#0f0f0f')
            : (contentConfig.background?.light || '#f9fafb')
        }}
      >
        {/* Contenido principal */}
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 lg:py-12">
          {/* Main Article - Layout centrado sin sidebar */}
          <article className="space-y-8">
            {/* Contenido Principal */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8 lg:p-12">
              {/* Content - Optimizado para legibilidad */}
              <div 
                className="prose prose-lg lg:prose-xl max-w-none mx-auto
                  prose-headings:font-bold 
                  prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                  prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-10
                  prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-10 prose-h2:pb-3 
                  prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700
                  prose-h2:text-purple-700 dark:prose-h2:text-purple-400
                  prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 
                  prose-h3:text-gray-800 dark:prose-h3:text-gray-200
                  prose-p:text-gray-700 dark:prose-p:text-[#d4d4d4] 
                  prose-p:leading-[1.8] prose-p:mb-5 prose-p:text-base sm:prose-p:text-lg
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:my-6 prose-ol:list-decimal prose-ol:my-6
                  prose-li:marker:text-purple-600 dark:prose-li:marker:text-purple-400
                  prose-li:text-gray-700 dark:prose-li:text-[#d4d4d4] prose-li:my-3 prose-li:leading-[1.7]
                  prose-code:bg-gray-100 dark:prose-code:bg-gray-800 
                  prose-code:text-purple-700 dark:prose-code:text-purple-300
                  prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
                  prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:bg-[#1e1e1e] dark:prose-pre:bg-[#0d0d0d] prose-pre:text-gray-100 prose-pre:rounded-xl
                  prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700 prose-pre:my-8 prose-pre:p-6
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-10
                  prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-10"
                style={{ fontFamily: fontFamily }}
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(processedContent) }} 
              />

              {/* Tags Section */}
              {tagsConfig.showSection !== false && post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <TagIcon className="text-blue-600 dark:text-blue-400" size={20} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Etiquetas</h3>
                  </div>
                  <TagList 
                    tags={post.tags} 
                    limit={tagsConfig.maxVisible}
                    styles={tagsConfig.styles ? {
                      background: { light: tagsConfig.styles.light?.background, dark: tagsConfig.styles.dark?.background },
                      textColor: { light: tagsConfig.styles.light?.textColor, dark: tagsConfig.styles.dark?.textColor },
                      hoverBackground: { light: tagsConfig.styles.light?.hoverBackground, dark: tagsConfig.styles.dark?.hoverBackground }
                    } : undefined}
                    theme={theme as 'light' | 'dark'}
                  />
                </div>
              )}
              
              {/* Author Card */}
              {authorConfig.showCard !== false && post.author && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Sobre el autor
                  </h3>
                  <AuthorCard 
                    author={post.author}
                    styles={authorConfig.styles ? {
                      background: { light: authorConfig.styles.light?.background, dark: authorConfig.styles.dark?.background },
                      border: { light: authorConfig.styles.light?.border, dark: authorConfig.styles.dark?.border },
                      nameColor: { light: authorConfig.styles.light?.nameColor, dark: authorConfig.styles.dark?.nameColor },
                      bioColor: { light: authorConfig.styles.light?.bioColor, dark: authorConfig.styles.dark?.bioColor }
                    } : undefined}
                    theme={theme as 'light' | 'dark'}
                    showBio={authorConfig.showBio !== false}
                    showSocialLinks={authorConfig.showSocialLinks !== false}
                    showRole={authorConfig.showRole !== false}
                    nameFormat={authorConfig.nameFormat || 'full'}
                    avatarShape={authorConfig.avatarShape || 'square'}
                  />
                </div>
              )}
            </div>

            {/* Comments Section */}
            {commentsConfig.enabled !== false && post.allowComments && (
              <div 
                className={`rounded-xl shadow-sm p-6 sm:p-8 ${
                  !commentsConfig.styles?.light?.sectionBackground && !commentsConfig.styles?.dark?.sectionBackground 
                    ? 'bg-white dark:bg-gray-800' 
                    : ''
                } ${
                  !commentsConfig.styles?.light?.sectionBorder && !commentsConfig.styles?.dark?.sectionBorder 
                    ? 'border border-gray-200 dark:border-gray-700' 
                    : ''
                }`}
                style={{
                  background: theme === 'dark' 
                    ? commentsConfig.styles?.dark?.sectionBackground 
                    : commentsConfig.styles?.light?.sectionBackground,
                  borderColor: theme === 'dark' 
                    ? commentsConfig.styles?.dark?.sectionBorder 
                    : commentsConfig.styles?.light?.sectionBorder,
                  borderWidth: (commentsConfig.styles?.light?.sectionBorder || commentsConfig.styles?.dark?.sectionBorder) ? '1px' : undefined,
                  borderStyle: (commentsConfig.styles?.light?.sectionBorder || commentsConfig.styles?.dark?.sectionBorder) ? 'solid' : undefined,
                }}
              >
                <CommentsList 
                  postSlug={slug!}
                  title={commentsConfig.title || 'Comentarios'}
                  fontFamily={commentsConfig.fontFamily ? `${commentsConfig.fontFamily}, sans-serif` : 'Montserrat, sans-serif'}
                  theme={theme as 'light' | 'dark'}
                  avatarShape={commentsConfig.avatarShape || 'circle'}
                  styles={commentsConfig.styles ? {
                    titleColor: { light: commentsConfig.styles.light?.titleColor, dark: commentsConfig.styles.dark?.titleColor },
                    iconColor: { light: commentsConfig.styles.light?.iconColor, dark: commentsConfig.styles.dark?.iconColor },
                    countColor: { light: commentsConfig.styles.light?.countColor, dark: commentsConfig.styles.dark?.countColor },
                    selectorBackground: { light: commentsConfig.styles.light?.selectorBackground, dark: commentsConfig.styles.dark?.selectorBackground },
                    selectorBorder: { light: commentsConfig.styles.light?.selectorBorder, dark: commentsConfig.styles.dark?.selectorBorder },
                    selectorText: { light: commentsConfig.styles.light?.selectorText, dark: commentsConfig.styles.dark?.selectorText },
                    selectorIconColor: { light: commentsConfig.styles.light?.selectorIconColor, dark: commentsConfig.styles.dark?.selectorIconColor },
                    selectorDropdownBg: { light: commentsConfig.styles.light?.selectorDropdownBg, dark: commentsConfig.styles.dark?.selectorDropdownBg },
                    selectorOptionHover: { light: commentsConfig.styles.light?.selectorOptionHover, dark: commentsConfig.styles.dark?.selectorOptionHover },
                    cardBackground: { light: commentsConfig.styles.light?.cardBackground, dark: commentsConfig.styles.dark?.cardBackground },
                    cardBorder: { light: commentsConfig.styles.light?.cardBorder, dark: commentsConfig.styles.dark?.cardBorder },
                    authorColor: { light: commentsConfig.styles.light?.authorColor, dark: commentsConfig.styles.dark?.authorColor },
                    textColor: { light: commentsConfig.styles.light?.textColor, dark: commentsConfig.styles.dark?.textColor },
                    dateColor: { light: commentsConfig.styles.light?.dateColor, dark: commentsConfig.styles.dark?.dateColor },
                    formBackground: { light: commentsConfig.styles.light?.formBackground, dark: commentsConfig.styles.dark?.formBackground },
                    formBorder: { light: commentsConfig.styles.light?.formBorder, dark: commentsConfig.styles.dark?.formBorder },
                    formFocusBorder: { light: commentsConfig.styles.light?.formFocusBorder, dark: commentsConfig.styles.dark?.formFocusBorder },
                    textareaBackground: { light: commentsConfig.styles.light?.textareaBackground, dark: commentsConfig.styles.dark?.textareaBackground },
                    textareaText: { light: commentsConfig.styles.light?.textareaText, dark: commentsConfig.styles.dark?.textareaText },
                    footerBackground: { light: commentsConfig.styles.light?.footerBackground, dark: commentsConfig.styles.dark?.footerBackground },
                    buttonBackground: { light: commentsConfig.styles.light?.buttonBackground, dark: commentsConfig.styles.dark?.buttonBackground },
                    buttonBorder: { light: commentsConfig.styles.light?.buttonBorder, dark: commentsConfig.styles.dark?.buttonBorder },
                    buttonText: { light: commentsConfig.styles.light?.buttonText, dark: commentsConfig.styles.dark?.buttonText },
                  } : undefined}
                />
              </div>
            )}

            {/* Related Posts */}
            {relatedConfig.enabled !== false && (
              <RelatedPosts 
                currentPost={post}
                preloadedPosts={relatedPosts}
                maxPosts={relatedConfig.maxPosts}
                title={relatedConfig.title || 'Artículos Relacionados'}
                theme={theme as 'light' | 'dark'}
                showCategoryLink={relatedConfig.showCategoryLink !== false}
                showExploreButton={relatedConfig.showExploreButton !== false}
                styles={relatedConfig.styles ? {
                  sectionBackground: { light: relatedConfig.styles.light?.sectionBackground, dark: relatedConfig.styles.dark?.sectionBackground },
                  sectionBorder: { light: relatedConfig.styles.light?.sectionBorder, dark: relatedConfig.styles.dark?.sectionBorder },
                  iconColor: { light: relatedConfig.styles.light?.iconColor, dark: relatedConfig.styles.dark?.iconColor },
                  cardBackground: { light: relatedConfig.styles.light?.cardBackground, dark: relatedConfig.styles.dark?.cardBackground },
                  cardBorder: { light: relatedConfig.styles.light?.cardBorder, dark: relatedConfig.styles.dark?.cardBorder },
                  cardTitleColor: { light: relatedConfig.styles.light?.cardTitleColor, dark: relatedConfig.styles.dark?.cardTitleColor },
                  cardCategoryBackground: { light: relatedConfig.styles.light?.cardCategoryBackground, dark: relatedConfig.styles.dark?.cardCategoryBackground },
                  cardCategoryBorder: { light: relatedConfig.styles.light?.cardCategoryBorder, dark: relatedConfig.styles.dark?.cardCategoryBorder },
                  cardCategoryText: { light: relatedConfig.styles.light?.cardCategoryText, dark: relatedConfig.styles.dark?.cardCategoryText },
                  cardDateColor: { light: relatedConfig.styles.light?.cardDateColor, dark: relatedConfig.styles.dark?.cardDateColor },
                  titleColor: { light: relatedConfig.styles.light?.titleColor, dark: relatedConfig.styles.dark?.titleColor },
                  buttonBackground: { light: relatedConfig.styles.light?.buttonBackground, dark: relatedConfig.styles.dark?.buttonBackground },
                  buttonBorder: { light: relatedConfig.styles.light?.buttonBorder, dark: relatedConfig.styles.dark?.buttonBorder },
                  buttonText: { light: relatedConfig.styles.light?.buttonText, dark: relatedConfig.styles.dark?.buttonText },
                  linkColor: { light: relatedConfig.styles.light?.linkColor, dark: relatedConfig.styles.dark?.linkColor },
                } : undefined}
              />
            )}

            {/* Navigation */}
            {navConfig.enabled !== false && (
              <PostNavigation 
                currentPost={post}
                showEmptyCard={navConfig.showEmptyCard ?? false}
                styles={navConfig.styles ? {
                  sectionBackground: theme === 'dark' ? navConfig.styles.dark?.sectionBackground : navConfig.styles.light?.sectionBackground,
                  sectionBorder: theme === 'dark' ? navConfig.styles.dark?.sectionBorder : navConfig.styles.light?.sectionBorder,
                  titleColor: theme === 'dark' ? navConfig.styles.dark?.titleColor : navConfig.styles.light?.titleColor,
                  indicatorColor: theme === 'dark' ? navConfig.styles.dark?.indicatorColor : navConfig.styles.light?.indicatorColor,
                  cardBackground: theme === 'dark' ? navConfig.styles.dark?.cardBackground : navConfig.styles.light?.cardBackground,
                  cardBorder: theme === 'dark' ? navConfig.styles.dark?.cardBorder : navConfig.styles.light?.cardBorder,
                  cardHoverBorder: theme === 'dark' ? navConfig.styles.dark?.cardHoverBorder : navConfig.styles.light?.cardHoverBorder,
                  cardHoverBackground: theme === 'dark' ? navConfig.styles.dark?.cardHoverBackground : navConfig.styles.light?.cardHoverBackground,
                  labelColor: theme === 'dark' ? navConfig.styles.dark?.labelColor : navConfig.styles.light?.labelColor,
                  postTitleColor: theme === 'dark' ? navConfig.styles.dark?.postTitleColor : navConfig.styles.light?.postTitleColor,
                  excerptColor: theme === 'dark' ? navConfig.styles.dark?.excerptColor : navConfig.styles.light?.excerptColor,
                  metaColor: theme === 'dark' ? navConfig.styles.dark?.metaColor : navConfig.styles.light?.metaColor,
                  iconColor: theme === 'dark' ? navConfig.styles.dark?.iconColor : navConfig.styles.light?.iconColor,
                  imageBorder: theme === 'dark' ? navConfig.styles.dark?.imageBorder : navConfig.styles.light?.imageBorder,
                } : undefined}
              />
            )}
          </article>
      </section>
      </div>

      {/* Floating TOC Button - Visible en todas las pantallas */}
      {tocConfig.enabled !== false && tocItems.length > 0 && (
        <TableOfContents 
          tocItems={tocItems}
          variant="floating"
          showProgress={tocConfig.showProgress ?? true}
          styles={tocConfig.styles}
          theme={theme as 'light' | 'dark'}
        />
      )}

      <PublicFooter />
    </div>
  );
};

export default BlogPostEnhanced;