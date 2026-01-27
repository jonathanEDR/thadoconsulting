/**
 * 🔍 SEOHead Component
 * Genera meta tags dinámicos para SEO
 */

import { useEffect } from 'react';
import type { BlogPost, BlogCategory } from '../../../types/blog';

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
      seoTitle = post.seo?.metaTitle || `${post.title} | Blog Web Scuti`;
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
      
      // Autor con validación de null
      const authorName = post.author 
        ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim()
        : 'Autor Desconocido';
      
      updateMetaTag('author', authorName);
      updateMetaTag('article:author', authorName);
      updateMetaTag('article:published_time', post.publishedAt);
      updateMetaTag('article:modified_time', post.updatedAt);
      updateMetaTag('article:section', post.category?.name || '');
      updateMetaTag('article:tag', keywords);
    }

    // Si es una categoría
    if (category) {
      seoTitle = `${category.name} | Blog Web Scuti`;
      seoDescription = category.description || `Explora todos los artículos sobre ${category.name} en nuestro blog.`;
      seoImage = category.image?.url || '/images/blog-default.jpg';
    }

    // Actualizar título
    document.title = seoTitle || 'Blog Web Scuti';

    // Meta tags básicos
    updateMetaTag('description', seoDescription || 'Blog de desarrollo web, diseño y tecnología');
    
    // Open Graph
    updateMetaProperty('og:title', seoTitle || 'Blog SCUTI Company');
    updateMetaProperty('og:description', seoDescription || 'Blog de desarrollo web, diseño y tecnología');
    updateMetaProperty('og:type', seoType);
    updateMetaProperty('og:url', seoUrl);
    updateMetaProperty('og:image', seoImage || '/images/blog-default.jpg');
    updateMetaProperty('og:site_name', 'SCUTI Company');
    updateMetaProperty('og:locale', 'es_ES');

    // Twitter Cards
    updateMetaProperty('twitter:card', 'summary_large_image');
    updateMetaProperty('twitter:title', seoTitle || 'Blog SCUTI Company');
    updateMetaProperty('twitter:description', seoDescription || 'Blog de desarrollo web, diseño y tecnología');
    updateMetaProperty('twitter:image', seoImage || '/images/blog-default.jpg');
    updateMetaProperty('twitter:site', '@scuticompany');
    updateMetaProperty('twitter:creator', '@scuticompany');

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
          name: 'SCUTI Company',
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