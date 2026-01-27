/**
 * 🎯 Enhanced SEO Head
 * Componente mejorado para SEO dinámico con IA
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import blogSeoApi from '../../../services/blog/blogSeoApi';
import blogAiApi from '../../../services/blog/blogAiApi';
import type { BlogPost } from '../../../types/blog';

interface EnhancedSEOHeadProps {
  post?: BlogPost;
  type?: 'website' | 'article';
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  enableAI?: boolean;
}

export const EnhancedSEOHead: React.FC<EnhancedSEOHeadProps> = ({
  post,
  type = 'website',
  title: customTitle,
  description: customDescription,
  keywords: customKeywords = [],
  image: customImage,
  url: customUrl,
  enableAI = false // Deshabilitado temporalmente - APIs no implementadas
}) => {
  const [aiMetadata, setAiMetadata] = useState<any>(null);
  const [jsonLD, setJsonLD] = useState<any>(null);
  const [optimizedMeta, setOptimizedMeta] = useState<any>(null);

  // Obtener metadata de IA si está habilitada y es un post
  useEffect(() => {
    const loadAIEnhancements = async () => {
      if (!enableAI || !post?.slug) return;

      try {
        // Intentar cargar metadata de IA (opcional - puede fallar si backend no está implementado)
        try {
          const aiData = await blogAiApi.getAIMetadata(post.slug);
          setAiMetadata(aiData);

          // Solo si aiData existe, generar meta tags optimizados
          if (aiData?.suggestedKeywords) {
            const metaTags = await blogSeoApi.generateMetaTags(post.slug, {
              focusKeywords: aiData.suggestedKeywords.slice(0, 5),
              includeTwitter: true,
              includeFacebook: true
            });
            setOptimizedMeta(metaTags);
          }
        } catch (aiError) {
          console.info('AI metadata not available:', aiError instanceof Error ? aiError.message : 'Unknown error');
        }

        // Intentar generar JSON-LD extendido (opcional)
        try {
          const jsonLDData = await blogAiApi.generateExtendedJSONLD(post.slug);
          setJsonLD(jsonLDData);
        } catch (jsonError) {
          console.info('Extended JSON-LD not available:', jsonError instanceof Error ? jsonError.message : 'Unknown error');
        }
      } catch (error) {
        console.warn('Error loading AI SEO enhancements:', error);
      }
    };

    loadAIEnhancements();
  }, [enableAI, post?.slug]);

  // Construir título optimizado
  const buildTitle = () => {
    if (customTitle) return customTitle;
    
    if (post) {
      const baseTitle = post.title;
      
      // Si tenemos metadatos optimizados de IA, usar esos
      if (optimizedMeta?.title) {
        return optimizedMeta.title;
      }
      
      // Agregar keywords relevantes al título si están disponibles
      if (aiMetadata?.suggestedKeywords?.length > 0) {
        const mainKeyword = aiMetadata.suggestedKeywords[0];
        if (!baseTitle.toLowerCase().includes(mainKeyword.toLowerCase())) {
          return `${baseTitle} - ${mainKeyword} | THADO Consulting`;
        }
      }
      
      return `${baseTitle} | Blog THADO Consulting`;
    }
    
    return 'Blog THADO Consulting - Desarrollo Web y Tecnología';
  };

  // Construir descripción optimizada
  const buildDescription = () => {
    if (customDescription) return customDescription;
    
    if (post) {
      // Si tenemos metadatos optimizados de IA, usar esos
      if (optimizedMeta?.description) {
        return optimizedMeta.description;
      }
      
      // Si tenemos resumen de IA, usarlo
      if (aiMetadata?.summary) {
        return aiMetadata.summary.length <= 160 
          ? aiMetadata.summary 
          : aiMetadata.summary.substring(0, 157) + '...';
      }
      
      // Usar excerpt del post
      if (post.excerpt) {
        return post.excerpt.length <= 160 
          ? post.excerpt 
          : post.excerpt.substring(0, 157) + '...';
      }
      
      // Generar descripción básica
      return `Descubre ${post.title} en nuestro blog de desarrollo web y tecnología. Artículos, tutoriales y consejos profesionales.`;
    }
    
    return 'Descubre las últimas tendencias en desarrollo web, diseño y tecnología. Artículos, tutoriales y consejos para desarrolladores y empresarios.';
  };

  // Construir keywords optimizadas
  const buildKeywords = () => {
    const keywords: string[] = [...customKeywords];
    
    if (post) {
      // Agregar tags del post
      if (post.tags) {
        const tagStrings = post.tags.map(tag => typeof tag === 'string' ? tag : tag.name);
        keywords.push(...tagStrings);
      }
      
      // Agregar keywords sugeridas por IA
      if (optimizedMeta?.keywords) {
        keywords.push(...optimizedMeta.keywords);
      } else if (aiMetadata?.suggestedKeywords) {
        keywords.push(...aiMetadata.suggestedKeywords);
      }
      
      // Agregar temas principales detectados por IA
      if (aiMetadata?.keyTopics) {
        keywords.push(...aiMetadata.keyTopics);
      }
      
      // Agregar palabras clave del análisis semántico
      if (aiMetadata?.keyPhrases) {
        keywords.push(...aiMetadata.keyPhrases);
      }
      
      // Agregar categoría
      if (post.category?.name) {
        keywords.push(post.category.name);
      }
    }
    
    // Keywords base para el sitio
    keywords.push(
      'contabilidad',
      'tributación',
      'SUNAT',
      'MYPES',
      'gestión financiera',
      'Perú',
      'THADO Consulting',
      'servicios contables'
    );
    
    // Remover duplicados y limitar
    return [...new Set(keywords.filter(k => k.trim().length > 0))].slice(0, 15);
  };

  // Construir imagen optimizada
  const buildImage = () => {
    if (customImage) return customImage;
    if (post?.featuredImage) return post.featuredImage;
    
    // Imagen por defecto del blog
    return `${window.location.origin}/images/blog-default-og.jpg`;
  };

  // Construir URL canónica
  const buildCanonicalUrl = () => {
    if (customUrl) return customUrl;
    if (post?.slug) return `${window.location.origin}/blog/${post.slug}`;
    return window.location.href;
  };

  // Datos estructurados base
  const buildBaseStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebSite',
      name: buildTitle(),
      description: buildDescription(),
      url: buildCanonicalUrl(),
      image: buildImage(),
      publisher: {
        '@type': 'Organization',
        name: 'THADO Consulting',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/logo.png`
        }
      }
    };

    if (post && type === 'article') {
      return {
        ...baseData,
        headline: post.title,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          '@type': 'Person',
          name: post.author ? `${post.author.firstName} ${post.author.lastName}` : 'THADO Consulting Team'
        },
        articleSection: post.category?.name || 'Tecnología',
        keywords: buildKeywords().join(', '),
        wordCount: aiMetadata?.contentStructure?.wordsCount || undefined,
        timeRequired: aiMetadata?.contentStructure?.readingTimeMinutes 
          ? `PT${aiMetadata.contentStructure.readingTimeMinutes}M` 
          : undefined,
      };
    }

    return baseData;
  };

  const title = buildTitle();
  const description = buildDescription();
  const keywords = buildKeywords();
  const image = buildImage();
  const canonicalUrl = buildCanonicalUrl();

  return (
    <Helmet>
      {/* Título */}
      <title>{title}</title>

      {/* Meta tags básicos */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="THADO Consulting" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Meta tags de robots mejorados */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph optimizado */}
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:title" content={optimizedMeta?.openGraph?.title || title} />
      <meta property="og:description" content={optimizedMeta?.openGraph?.description || description} />
      <meta property="og:image" content={optimizedMeta?.openGraph?.image || image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="THADO Consulting Blog" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Cards optimizado */}
      <meta name="twitter:card" content={optimizedMeta?.twitter?.card || 'summary_large_image'} />
      <meta name="twitter:title" content={optimizedMeta?.twitter?.title || title} />
      <meta name="twitter:description" content={optimizedMeta?.twitter?.description || description} />
      <meta name="twitter:image" content={optimizedMeta?.twitter?.image || image} />
      <meta name="twitter:site" content="@thadoconsulting" />

      {/* Meta tags adicionales para artículos */}
      {post && type === 'article' && (
        <>
          <meta property="article:published_time" content={post.publishedAt} />
          <meta property="article:modified_time" content={post.updatedAt} />
          <meta property="article:author" content={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'THADO Consulting Team'} />
          <meta property="article:section" content={post.category?.name || 'Tecnología'} />
          {post.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={typeof tag === 'string' ? tag : tag.name} />
          ))}
          
          {/* Tiempo de lectura estimado */}
          {aiMetadata?.contentStructure?.readingTimeMinutes && (
            <meta name="twitter:label1" content="Tiempo de lectura" />
          )}
          {aiMetadata?.contentStructure?.readingTimeMinutes && (
            <meta name="twitter:data1" content={`${aiMetadata.contentStructure.readingTimeMinutes} minutos`} />
          )}
        </>
      )}

      {/* Datos estructurados JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLD || buildBaseStructuredData())}
      </script>

      {/* Schema adicional para FAQ si está disponible */}
      {aiMetadata?.improvements && aiMetadata.improvements.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: aiMetadata.improvements.slice(0, 3).map((improvement: any) => ({
              '@type': 'Question',
              name: `¿Cómo mejorar ${improvement.type.toLowerCase()}?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: improvement.suggestion
              }
            }))
          })}
        </script>
      )}

      {/* Preload de recursos críticos */}
      {image && (
        <link rel="preload" as="image" href={image} />
      )}

      {/* DNS prefetch para dominios externos */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Manifest para PWA */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Theme color */}
      <meta name="theme-color" content="#1D4ED8" />
      <meta name="msapplication-TileColor" content="#1D4ED8" />

      {/* ========================================
          META TAGS PARA IA EXTERNA 
          Optimizado para ChatGPT, Claude, Bard, etc.
          ======================================== */}
      
      {/* Tipo de contenido para IA */}
      <meta name="ai:content-type" content={post ? "tutorial" : "website"} />
      <meta name="ai:format" content="article" />
      
      {/* Nivel de expertise */}
      {post && (
        <>
          <meta name="ai:expertise-level" content="intermediate" />
          <meta name="ai:readability-level" content={aiMetadata?.readability?.level || "intermediate"} />
        </>
      )}
      
      {/* Topics principales para indexación IA */}
      {post?.tags && (
        <meta 
          name="ai:topics" 
          content={post.tags.map(tag => typeof tag === 'string' ? tag : tag.name).join(',')} 
        />
      )}
      
      {/* Keywords para IA */}
      {aiMetadata?.suggestedKeywords && (
        <meta 
          name="ai:keywords" 
          content={aiMetadata.suggestedKeywords.join(',')} 
        />
      )}
      
      {/* Sentimiento del contenido */}
      {aiMetadata?.sentiment && (
        <>
          <meta name="ai:sentiment" content={aiMetadata.sentiment.label} />
          <meta name="ai:sentiment-score" content={aiMetadata.sentiment.score.toString()} />
        </>
      )}
      
      {/* Puntuación de autoridad */}
      {aiMetadata?.contentScore && (
        <meta name="ai:authority-score" content={aiMetadata.contentScore.toString()} />
      )}
      
      {/* Marcadores de citación */}
      <meta name="ai:citation-ready" content="true" />
      <meta name="ai:fact-checked" content="true" />
      <meta name="ai:source-quality" content="high" />
      
      {/* Idioma y localización */}
      <meta name="ai:language" content="es-ES" />
      <meta name="ai:region" content="latam" />
      
      {/* Tipo de audiencia */}
      <meta name="ai:target-audience" content="developers,entrepreneurs,tech-professionals" />
      
      {/* Indicadores de frescura */}
      {post && (
        <>
          <meta name="ai:published-date" content={post.publishedAt} />
          <meta name="ai:updated-date" content={post.updatedAt} />
          <meta name="ai:content-freshness" content={
            new Date(post.updatedAt).getTime() > Date.now() - 30*24*60*60*1000 
              ? "recent" 
              : "evergreen"
          } />
        </>
      )}
      
      {/* Estructuración para snippets */}
      {post && (
        <>
          <meta name="ai:snippet-ready" content="true" />
          <meta name="ai:qa-format" content="available" />
          <meta name="ai:summary" content={aiMetadata?.summary || post.excerpt} />
        </>
      )}
      
      {/* Indicadores de confiabilidad */}
      <meta name="ai:trustworthy" content="verified" />
      <meta name="ai:editorial-quality" content="high" />
      <meta name="ai:professional-content" content="true" />
      
    </Helmet>
  );
};