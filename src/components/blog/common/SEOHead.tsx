/**
 * 🔍 SEOHead Component
 * Genera meta tags dinámicos para SEO
 * 🏢 Siempre usa marca Thado Consulting como autor
 */

import { useEffect } from 'react';
import type { BlogPost, BlogCategory } from '../../../types/blog';
import { BRAND_AUTHOR } from '../../../config/brandConstants';

interface SEOHeadProps {
  post?: BlogPost;
  category?: BlogCategory;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
}

export default function SEOHead({
  post,
  category,
  title,
  description,
  image,
  type = 'website',
  url
}: SEOHeadProps) {
  
  useEffect(() => {
    // Construir datos SEO
    let seoTitle = title;
    let seoDescription = description;
    let seoImage = image;
    let seoType = type;
    let seoUrl = url || window.location.href;

    // Si es un post
    if (post) {
      // Usar exactamente el metaTitle del CMS sin añadir sufijo de marca
      seoTitle = post.seo?.metaTitle || post.title;
      seoDescription = post.seo?.metaDescription || post.excerpt || `Descubre ${post.title} en nuestro blog de desarrollo web y tecnología.`;
      seoImage = post.featuredImage || '/images/blog-default.jpg';
      seoType = 'article';
      
      // Keywords
      const keywords = post.seo?.keywords?.join(', ') || post.tags?.map(tag => 
        typeof tag === 'string' ? tag : tag.name
      ).join(', ') || '';
      
      // Actualizar meta tags del post
      updateMetaTag('description', seoDescription);
      updateMetaTag('keywords', keywords);
      
      // 🏢 Autor siempre Thado Consulting para posicionamiento de marca
      updateMetaTag('author', BRAND_AUTHOR.name);
      updateMetaTag('article:author', BRAND_AUTHOR.name);
      updateMetaProperty('article:publisher', BRAND_AUTHOR.website);
      updateMetaTag('article:published_time', post.publishedAt);
      updateMetaTag('article:modified_time', post.updatedAt);
      updateMetaTag('article:section', post.category?.name || '');
      updateMetaTag('article:tag', keywords);
    }

    // Si es una categoría
    if (category) {
      seoTitle = category.name;
      seoDescription = category.description || `Explora todos los artículos sobre ${category.name} en nuestro blog.`;
      seoImage = category.image?.url || '/images/blog-default.jpg';
    }

    // Actualizar título con el valor configurado, sin fallback de marca
    document.title = seoTitle || title || '';

    // Meta tags básicos
    updateMetaTag('description', seoDescription || 'Blog de desarrollo web, diseño y tecnología');
    
    // Open Graph
    updateMetaProperty('og:title', seoTitle || 'Blog THADO Consulting');
    updateMetaProperty('og:description', seoDescription || 'Blog de desarrollo web, diseño y tecnología');
    updateMetaProperty('og:type', seoType);
    updateMetaProperty('og:url', seoUrl);
    updateMetaProperty('og:image', seoImage || '/images/blog-default.jpg');
    updateMetaProperty('og:site_name', 'THADO Consulting');
    updateMetaProperty('og:locale', 'es_ES');

    // Twitter Cards
    updateMetaProperty('twitter:card', 'summary_large_image');
    updateMetaProperty('twitter:title', seoTitle || 'Blog THADO Consulting');
    updateMetaProperty('twitter:description', seoDescription || 'Blog de desarrollo web, diseño y tecnología');
    updateMetaProperty('twitter:image', seoImage || '/images/blog-default.jpg');
    updateMetaProperty('twitter:site', '@thadoconsulting');
    updateMetaProperty('twitter:creator', '@thadoconsulting');

    // Canonical URL
    updateLinkTag('canonical', seoUrl);

    // JSON-LD Structured Data
    if (post) {
      updateStructuredData({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.featuredImage,
        author: {
          '@type': 'Person',
          name: post.author 
            ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Autor Desconocido'
            : 'Autor Desconocido',
          url: post.author?.website || ''
        },
        publisher: {
          '@type': 'Organization',
          name: 'THADO Consulting',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png'
          }
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': seoUrl
        }
      });
    }

  }, [post, category, title, description, image, type, url]);

  return null;
}

// Utilidades para actualizar meta tags
function updateMetaTag(name: string, content: string) {
  if (!content) return;
  
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
  if (!content) return;
  
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  if (!href) return;
  
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function updateStructuredData(data: object) {
  let script = document.querySelector('#structured-data');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'structured-data');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}