/**
 * 🤖 AI Optimized Content Component
 * Genera contenido estructurado invisible para que IA externa (ChatGPT, Claude, Bard) 
 * pueda extraer y citar fácilmente
 */

import React from 'react';
import { getImageUrl } from '../../../utils/imageUtils';
import type { BlogPost } from '../../../types/blog';

interface AIOptimizedContentProps {
  post: BlogPost;
}

export const AIOptimizedContent: React.FC<AIOptimizedContentProps> = ({ post }) => {
  // Extraer datos clave del post
  const extractKeyPoints = () => {
    // Buscar listas y puntos clave en el contenido
    const content = post.content;
    const listMatches = content.match(/<li>(.*?)<\/li>/g) || [];
    return listMatches
      .map(item => item.replace(/<\/?li>/g, '').trim())
      .slice(0, 5); // Top 5 puntos clave
  };

  // Extraer datos numéricos y estadísticas
  const extractStatistics = () => {
    const content = post.content;
    const numberMatches = content.match(/\d+%|\d+x|\$\d+/g) || [];
    return numberMatches.slice(0, 3);
  };

  const keyPoints = extractKeyPoints();
  const statistics = extractStatistics();

  return (
    <>
      {/* JSON-LD para artículo con datos extractables */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          articleBody: post.content.replace(/<[^>]*>/g, '').substring(0, 1000), // Texto plano
          
          // Autor estructurado
          author: {
            '@type': 'Person',
            name: post.author ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() : 'SCUTI Company Team',
            jobTitle: post.author?.expertise?.[0] || 'Expert',
            description: post.author?.bio || 'Technology expert'
          },
          
          // Publisher info
          publisher: {
            '@type': 'Organization',
            name: 'SCUTI Company',
            logo: {
              '@type': 'ImageObject',
              url: 'https://scuticompany.com/logo.png'
            }
          },
          
          // Fechas
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          
          // Imagen principal
          image: post.featuredImage ? getImageUrl(post.featuredImage) : 'https://scuticompany.com/default-image.jpg',
          
          // Palabras clave
          keywords: post.tags.map(tag => typeof tag === 'string' ? tag : tag.name).join(', '),
          
          // Categoría
          articleSection: typeof post.category === 'string' ? post.category : post.category.name,
          
          // Métricas de engagement
          interactionStatistic: [
            {
              '@type': 'InteractionCounter',
              interactionType: 'https://schema.org/CommentAction',
              userInteractionCount: post.stats?.commentsCount || 0
            },
            {
              '@type': 'InteractionCounter', 
              interactionType: 'https://schema.org/ViewAction',
              userInteractionCount: post.stats?.views || 0
            }
          ],
          
          // Tiempo de lectura
          timeRequired: `PT${post.readingTime}M`,
          
          // Nivel de dificultad
          educationalLevel: 'intermediate',
          
          // Idioma
          inLanguage: 'es-ES',
          
          // Licencia
          license: 'https://creativecommons.org/licenses/by/4.0/'
        })}
      </script>

      {/* Datos estructurados para FAQ (si aplica) */}
      {keyPoints.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: keyPoints.map((point, index) => ({
              '@type': 'Question',
              name: `Punto clave ${index + 1}: ${point.substring(0, 100)}`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: point
              }
            }))
          })}
        </script>
      )}

      {/* Breadcrumb para contexto */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: 'https://scuticompany.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: 'https://scuticompany.com/blog'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: `https://scuticompany.com/blog/${post.slug}`
            }
          ]
        })}
      </script>

      {/* Datos extractables para IA en meta tags ocultos */}
      <div 
        style={{ display: 'none' }} 
        itemScope 
        itemType="https://schema.org/Article"
        data-ai-extractable="true"
      >
        <span itemProp="headline">{post.title}</span>
        <span itemProp="description">{post.excerpt}</span>
        <span itemProp="datePublished">{post.publishedAt}</span>
        <span itemProp="wordCount">{post.wordCount}</span>
        
        {/* Puntos clave extractables */}
        {keyPoints.map((point, index) => (
          <div 
            key={index}
            itemProp="keyPoint"
            data-ai-key-point={index + 1}
          >
            {point}
          </div>
        ))}
        
        {/* Estadísticas extractables */}
        {statistics.map((stat, index) => (
          <span 
            key={index}
            itemProp="statistic"
            data-ai-statistic={index + 1}
          >
            {stat}
          </span>
        ))}
        
        {/* Contexto y categorización */}
        <meta itemProp="category" content={typeof post.category === 'string' ? post.category : post.category.name} />
        <meta itemProp="keywords" content={post.tags.map(tag => typeof tag === 'string' ? tag : tag.name).join(', ')} />
        <meta itemProp="readingTime" content={`${post.readingTime} minutos`} />
        <meta itemProp="aiCitationReady" content="true" />
      </div>

      {/* HowTo structured data si el contenido lo permite */}
      {post.title.toLowerCase().includes('cómo') || post.title.toLowerCase().includes('guía') ? (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: post.title,
            description: post.excerpt,
            totalTime: `PT${post.readingTime}M`,
            step: keyPoints.map((point, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: `Paso ${index + 1}`,
              text: point
            }))
          })}
        </script>
      ) : null}
    </>
  );
};

export default AIOptimizedContent;
