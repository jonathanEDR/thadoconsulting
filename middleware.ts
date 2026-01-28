import { next } from '@vercel/edge';

/**
 * 🚀 Vercel Edge Middleware para SEO de Blog Posts
 * 
 * Este middleware intercepta las requests a /blog/:slug y modifica el HTML
 * para incluir los meta tags OG correctos del post.
 * 
 * Esto permite que Facebook, Twitter, LinkedIn y otros crawlers
 * vean los meta tags correctos sin necesidad de pre-rendering.
 */

// Configuración
const CONFIG = {
  apiUrl: 'https://thadoconsulting-back.onrender.com',
  siteUrl: 'https://www.thadoconsulting.com',
  siteName: 'THADO Consulting Blog',
  defaultImage: 'https://www.thadoconsulting.com/FAVICON.png',
  twitterHandle: '@thadoconsulting',
  // Imagen para Google Search Results (favicon grande)
  googleFavicon: 'https://www.thadoconsulting.com/FAVICON.png'
};

/**
 * Generar favicons para Google Search Results
 */
function generateFavicons(): string {
  return `
    <!-- Favicons optimizados para Google Search -->
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="shortcut icon" href="/logoiconoresultadosgoogle.jpeg" type="image/jpeg" />
  `;
}

// Cache en memoria para evitar llamadas repetidas a la API
const postCache = new Map<string, { data: any; timestamp: number }>();
const servicioCache = new Map<string, { data: any; timestamp: number }>();
const cmsPageCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

/**
 * Obtener datos SEO de una página desde el CMS
 * Consulta /api/cms/pages/:slug para obtener la configuración SEO
 */
async function getCmsPageData(pageSlug: string): Promise<any | null> {
  // Verificar cache
  const cached = cmsPageCache.get(pageSlug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Edge Middleware] CMS page ${pageSlug} from cache`);
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/cms/pages/${pageSlug}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) {
      console.error(`[Edge Middleware] Error fetching CMS page ${pageSlug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.error(`[Edge Middleware] CMS page ${pageSlug} not found or invalid response`);
      return null;
    }

    const page = data.data;
    
    // Guardar en cache
    cmsPageCache.set(pageSlug, { data: page, timestamp: Date.now() });
    console.log(`[Edge Middleware] CMS page ${pageSlug} loaded and cached`);
    
    return page;
  } catch (error) {
    console.error(`[Edge Middleware] Error fetching CMS page ${pageSlug}:`, error);
    return null;
  }
}

/**
 * Obtener datos del post desde la API
 */
async function getPostData(slug: string): Promise<any | null> {
  // Verificar cache
  const cached = postCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/blog/posts/${slug}?incrementViews=false`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error fetching post ${slug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.data?.post) {
      return null;
    }

    const post = data.data.post;
    
    // Guardar en cache
    postCache.set(slug, { data: post, timestamp: Date.now() });
    
    return post;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Obtener datos del servicio desde la API
 */
async function getServicioData(slug: string): Promise<any | null> {
  // Verificar cache
  const cached = servicioCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/servicios/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error fetching servicio ${slug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      return null;
    }

    const servicio = data.data;
    
    // Guardar en cache
    servicioCache.set(slug, { data: servicio, timestamp: Date.now() });
    
    return servicio;
  } catch (error) {
    console.error(`Error fetching servicio ${slug}:`, error);
    return null;
  }
}

/**
 * Obtener URL de imagen del servicio
 */
function getServicioImageUrl(servicio: any): string {
  // Prioridad: imagen principal > primera imagen de galería > logo horizontal
  if (servicio.imagen) {
    if (servicio.imagen.startsWith('http')) return servicio.imagen;
    return `https://res.cloudinary.com/ds54wlchi/image/upload/${servicio.imagen}`;
  }
  if (servicio.galeriaImagenes && servicio.galeriaImagenes.length > 0) {
    const img = servicio.galeriaImagenes[0];
    if (img.startsWith('http')) return img;
    return `https://res.cloudinary.com/ds54wlchi/image/upload/${img}`;
  }
  // Fallback al logo horizontal
  return `${CONFIG.siteUrl}/logohorizontal.jpeg`;
}

/**
 * Obtener URL de imagen
 */
function getImageUrl(image: any): string {
  if (!image) return CONFIG.defaultImage;
  if (typeof image === 'string') {
    if (image.startsWith('http')) return image;
    return `https://res.cloudinary.com/dqnjmqhqh/image/upload/${image}`;
  }
  if (image.url) return image.url;
  if (image.secure_url) return image.secure_url;
  return CONFIG.defaultImage;
}

/**
 * Obtener nombre del autor
 */
function getAuthorName(author: any): string {
  if (!author) return 'THADO Consulting';
  if (typeof author === 'string') return author;
  if (author.displayName) return author.displayName;
  if (author.firstName && author.lastName) return `${author.firstName} ${author.lastName}`;
  if (author.firstName) return author.firstName;
  return 'THADO Consulting';
}

/**
 * Escapar HTML
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generar meta tags para la página del listado del blog
 * @param cmsData - Datos del CMS (opcional, si no se pasa usa fallbacks)
 */
function generateBlogListMetaTags(cmsData?: any): string {
  // Usar datos del CMS si están disponibles, sino usar fallbacks mínimos
  const seo = cmsData?.seo || {};
  const title = escapeHtml(seo.metaTitle || 'Blog - THADO Consulting');
  const description = escapeHtml(seo.metaDescription || 'Artículos y novedades de THADO Consulting');
  const keywords = escapeHtml(seo.keywords?.join(', ') || '');
  const ogTitle = escapeHtml(seo.ogTitle || title);
  const ogDescription = escapeHtml(seo.ogDescription || description);
  const ogImage = seo.ogImage || `${CONFIG.siteUrl}/logohorizontal.jpeg`;
  const blogUrl = `${CONFIG.siteUrl}/blog`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Blog Listing - Generado por Edge Middleware desde CMS -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
    <meta name="author" content="THADO Consulting" />
    <link rel="canonical" href="${blogUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${blogUrl}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="THADO Consulting" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="${seo.twitterCard || 'summary_large_image'}" />
    <meta name="twitter:url" content="${blogUrl}" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "${title}",
      "description": "${description}",
      "url": "${blogUrl}",
      "publisher": {
        "@type": "Organization",
        "name": "THADO Consulting",
        "logo": {
          "@type": "ImageObject",
          "url": "${CONFIG.defaultImage}"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${blogUrl}"
      }
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Home
 * @param cmsData - Datos del CMS (opcional, si no se pasa usa fallbacks)
 */
function generateHomeMetaTags(cmsData?: any): string {
  // Usar datos del CMS si están disponibles, sino usar fallbacks mínimos
  const seo = cmsData?.seo || {};
  const title = escapeHtml(seo.metaTitle || 'THADO Consulting');
  const description = escapeHtml(seo.metaDescription || 'Servicios profesionales para empresas');
  const keywords = escapeHtml(seo.keywords?.join(', ') || '');
  const ogTitle = escapeHtml(seo.ogTitle || title);
  const ogDescription = escapeHtml(seo.ogDescription || description);
  const ogImage = seo.ogImage || `${CONFIG.siteUrl}/logohorizontal.jpeg`;
  const homeUrl = CONFIG.siteUrl;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Home - Generado por Edge Middleware desde CMS -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
    <meta name="author" content="THADO Consulting" />
    <link rel="canonical" href="${homeUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${homeUrl}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="THADO Consulting" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="${seo.twitterCard || 'summary_large_image'}" />
    <meta name="twitter:url" content="${homeUrl}" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "THADO Consulting",
      "alternateName": "THADO",
      "url": "${homeUrl}",
      "logo": {
        "@type": "ImageObject",
        "url": "${ogImage}"
      },
      "description": "${description}",
      "foundingDate": "2024",
      "areaServed": {
        "@type": "Country",
        "name": "Perú"
      },
      "sameAs": [
        "https://www.linkedin.com/company/thadoconsulting",
        "https://twitter.com/thadoconsulting"
      ]
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Servicios
 * @param cmsData - Datos del CMS (opcional, si no se pasa usa fallbacks)
 */
function generateServiciosMetaTags(cmsData?: any): string {
  // Usar datos del CMS si están disponibles, sino usar fallbacks mínimos
  const seo = cmsData?.seo || {};
  const title = escapeHtml(seo.metaTitle || 'Servicios - THADO Consulting');
  const description = escapeHtml(seo.metaDescription || 'Conoce nuestros servicios profesionales');
  const keywords = escapeHtml(seo.keywords?.join(', ') || '');
  const ogTitle = escapeHtml(seo.ogTitle || title);
  const ogDescription = escapeHtml(seo.ogDescription || description);
  const ogImage = seo.ogImage || `${CONFIG.siteUrl}/logohorizontal.jpeg`;
  const serviciosUrl = `${CONFIG.siteUrl}/servicios`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Servicios - Generado por Edge Middleware desde CMS -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
    <meta name="author" content="THADO Consulting" />
    <link rel="canonical" href="${serviciosUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${serviciosUrl}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="THADO Consulting" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="${seo.twitterCard || 'summary_large_image'}" />
    <meta name="twitter:url" content="${serviciosUrl}" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${title}",
      "description": "${description}",
      "url": "${serviciosUrl}",
      "provider": {
        "@type": "Organization",
        "name": "THADO Consulting",
        "url": "${CONFIG.siteUrl}"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Perú"
      }
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Nosotros
 * @param cmsData - Datos del CMS (opcional, si no se pasa usa fallbacks)
 */
function generateNosotrosMetaTags(cmsData?: any): string {
  // Usar datos del CMS si están disponibles, sino usar fallbacks mínimos
  const seo = cmsData?.seo || {};
  const title = escapeHtml(seo.metaTitle || 'Nosotros - THADO Consulting');
  const description = escapeHtml(seo.metaDescription || 'Conoce más sobre nosotros');
  const keywords = escapeHtml(seo.keywords?.join(', ') || '');
  const ogTitle = escapeHtml(seo.ogTitle || title);
  const ogDescription = escapeHtml(seo.ogDescription || description);
  const ogImage = seo.ogImage || `${CONFIG.siteUrl}/logohorizontal.jpeg`;
  const nosotrosUrl = `${CONFIG.siteUrl}/nosotros`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Nosotros - Generado por Edge Middleware desde CMS -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
    <meta name="author" content="THADO Consulting" />
    <link rel="canonical" href="${nosotrosUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${nosotrosUrl}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="THADO Consulting" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="${seo.twitterCard || 'summary_large_image'}" />
    <meta name="twitter:url" content="${nosotrosUrl}" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "${title}",
      "description": "${description}",
      "url": "${nosotrosUrl}",
      "mainEntity": {
        "@type": "Organization",
        "name": "THADO Consulting",
        "url": "${CONFIG.siteUrl}",
        "foundingDate": "2024",
        "areaServed": "Perú"
      }
    }
    </script>
  `;
}

/**
 * Generar meta tags para un servicio individual (detalle)
 */
function generateServicioDetailMetaTags(servicio: any): string {
  // Prioridad para título: seo.titulo > metaTitle > titulo
  const title = escapeHtml(
    servicio.seo?.titulo || 
    servicio.metaTitle || 
    servicio.titulo || 
    'Servicio'
  );
  
  // Prioridad para descripción: seo.descripcion > metaDescription > descripcionCorta > descripcion
  const description = escapeHtml(
    servicio.seo?.descripcion || 
    servicio.metaDescription || 
    servicio.descripcionCorta || 
    (servicio.descripcion ? servicio.descripcion.substring(0, 160) : 'Servicio profesional de THADO Consulting')
  );
  
  const servicioUrl = `${CONFIG.siteUrl}/servicios/${servicio.slug}`;
  const imageUrl = getServicioImageUrl(servicio);
  
  // ✅ Keywords del servicio - Priorizar seo.palabrasClave configuradas
  const keywords = servicio.seo?.palabrasClave 
    ? servicio.seo.palabrasClave  // Si hay SEO configurado, usarlo directamente
    : [
        ...(servicio.etiquetas || []),
        servicio.categoria?.nombre || '',
        servicio.titulo || ''
      ].filter(Boolean).join(', ');

  // Información de precio
  let priceInfo = '';
  if (servicio.precio && servicio.tipoPrecio === 'fijo') {
    priceInfo = `Precio: ${servicio.moneda || 'PEN'} ${servicio.precio}`;
  } else if (servicio.precioMin && servicio.precioMax && servicio.tipoPrecio === 'rango') {
    priceInfo = `Precio desde ${servicio.moneda || 'PEN'} ${servicio.precioMin}`;
  }

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Servicio Detail - Generado por Edge Middleware -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="THADO Consulting" />
    <link rel="canonical" href="${servicioUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${servicioUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="THADO Consulting" />
    <meta property="og:locale" content="es_PE" />
    ${servicio.precio ? `<meta property="product:price:amount" content="${servicio.precio}" />` : ''}
    ${servicio.moneda ? `<meta property="product:price:currency" content="${servicio.moneda}" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${servicioUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD - Service -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${title}",
      "description": "${description}",
      "url": "${servicioUrl}",
      "image": "${imageUrl}",
      "provider": {
        "@type": "Organization",
        "name": "THADO Consulting",
        "url": "${CONFIG.siteUrl}",
        "logo": "${CONFIG.siteUrl}/logohorizontal.jpeg"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Perú"
      }${servicio.categoria?.nombre ? `,
      "category": "${escapeHtml(servicio.categoria.nombre)}"` : ''}${servicio.precio && servicio.tipoPrecio === 'fijo' ? `,
      "offers": {
        "@type": "Offer",
        "price": "${servicio.precio}",
        "priceCurrency": "${servicio.moneda || 'PEN'}",
        "availability": "https://schema.org/InStock"
      }` : ''}${servicio.rating ? `,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${servicio.rating}",
        "reviewCount": "${servicio.numeroReviews || 1}"
      }` : ''}
    }
    </script>
  `;
}

/**
 * Generar meta tags para el post
 */
function generateMetaTags(post: any): string {
  // ✅ CORREGIDO: Usar SEO configurado por el usuario
  const title = escapeHtml(post.seo?.metaTitle || post.title);
  const description = escapeHtml(post.seo?.metaDescription || post.excerpt || '');
  const imageUrl = getImageUrl(post.featuredImage);
  const postUrl = `${CONFIG.siteUrl}/blog/${post.slug}`;
  const authorName = escapeHtml(getAuthorName(post.author));
  
  // ✅ Keywords: Priorizar focusKeyphrase + seo.keywords, eliminar duplicados
  const seoKeywords = post.seo?.focusKeyphrase || post.seo?.keywords?.length
    ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))]
    : post.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [];
  const keywords = seoKeywords.join(', ');
  
  const publishedTime = post.publishedAt || post.createdAt;
  const modifiedTime = post.updatedAt || publishedTime;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Generado por Edge Middleware -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${authorName}" />
    <link rel="canonical" href="${postUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${CONFIG.siteName}" />
    <meta property="og:locale" content="es_PE" />
    <meta property="article:published_time" content="${new Date(publishedTime).toISOString()}" />
    <meta property="article:modified_time" content="${new Date(modifiedTime).toISOString()}" />
    <meta property="article:author" content="${authorName}" />
    ${post.category?.name ? `<meta property="article:section" content="${escapeHtml(post.category.name)}" />` : ''}
    ${seoKeywords.map((kw: string) => `<meta property="article:tag" content="${escapeHtml(kw)}" />`).join('\n    ')}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${postUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${title}",
      "description": "${description}",
      "image": "${imageUrl}",
      "url": "${postUrl}",
      "datePublished": "${new Date(publishedTime).toISOString()}",
      "dateModified": "${new Date(modifiedTime).toISOString()}",
      "author": {
        "@type": "Person",
        "name": "${authorName}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "THADO Consulting",
        "logo": {
          "@type": "ImageObject",
          "url": "${CONFIG.defaultImage}"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${postUrl}"
      }${seoKeywords.length > 0 ? `,
      "keywords": "${escapeHtml(keywords)}"` : ''}${post.seo?.focusKeyphrase ? `,
      "about": {
        "@type": "Thing",
        "name": "${escapeHtml(post.seo.focusKeyphrase)}"
      }` : ''}
    }
    </script>
  `;
}

/**
 * 🎯 CRÍTICO PARA SEO: Generar contenido visible del artículo para crawlers
 * Esto reemplaza el div#root vacío con contenido real del artículo
 * Para que Google vea contenido real en lugar de "Artículo no encontrado"
 */
function generateVisibleArticleContent(post: any): string {
  const title = escapeHtml(post.seo?.metaTitle || post.title);
  const description = escapeHtml(post.seo?.metaDescription || post.excerpt || '');
  const authorName = escapeHtml(getAuthorName(post.author));
  const imageUrl = getImageUrl(post.featuredImage);
  const categoryName = escapeHtml(post.category?.name || 'Blog');
  const postUrl = `${CONFIG.siteUrl}/blog/${post.slug}`;
  
  // Keywords para mostrar - eliminar duplicados
  const seoKeywords = post.seo?.focusKeyphrase || post.seo?.keywords?.length
    ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))]
    : post.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [];
  const keywords = escapeHtml(seoKeywords.join(', '));
  
  // Fecha formateada
  const publishDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : '';

  // Extraer preview del contenido (primeros 1500 caracteres de texto plano)
  let contentPreview = '';
  if (post.content) {
    contentPreview = post.content
      .replace(/<[^>]*>/g, ' ')  // Remover HTML
      .replace(/\s+/g, ' ')       // Normalizar espacios
      .trim()
      .substring(0, 1500);
    if (contentPreview.length >= 1500) {
      contentPreview += '...';
    }
  }

  return `
    <article itemscope itemtype="https://schema.org/BlogPosting" class="blog-article-seo">
      <header>
        <nav aria-label="Breadcrumb">
          <a href="/" data-discover="true">Inicio</a> &gt; 
          <a href="/blog" data-discover="true">Blog</a> &gt; 
          <span>${categoryName}</span>
        </nav>
        
        <h1 itemprop="headline">${title}</h1>
        
        <div class="article-meta">
          <span itemprop="author" itemscope itemtype="https://schema.org/Person">
            Por <span itemprop="name">${authorName}</span>
          </span>
          ${publishDate ? `<time itemprop="datePublished" datetime="${new Date(post.publishedAt).toISOString()}">${publishDate}</time>` : ''}
          <span>En <span itemprop="articleSection">${categoryName}</span></span>
        </div>
        
        ${description ? `<p itemprop="description" class="article-excerpt">${description}</p>` : ''}
      </header>
      
      ${imageUrl !== CONFIG.defaultImage ? `
        <figure>
          <img itemprop="image" src="${imageUrl}" alt="${title}" width="1200" height="630" loading="lazy" />
        </figure>
      ` : ''}
      
      <div itemprop="articleBody" class="article-content">
        <p>${escapeHtml(contentPreview)}</p>
      </div>
      
      ${keywords ? `
        <footer>
          <strong>Palabras clave:</strong>
          <span itemprop="keywords">${keywords}</span>
        </footer>
      ` : ''}
      
      <meta itemprop="url" content="${postUrl}" />
      <meta itemprop="mainEntityOfPage" content="${postUrl}" />
    </article>
    
    <style>
      .blog-article-seo { max-width: 800px; margin: 2rem auto; padding: 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .blog-article-seo h1 { font-size: 2rem; margin: 1rem 0; color: #1f2937; }
      .blog-article-seo nav { font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem; }
      .blog-article-seo nav a { color: #7c3aed; text-decoration: none; }
      .blog-article-seo .article-meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; display: flex; gap: 1rem; flex-wrap: wrap; }
      .blog-article-seo .article-excerpt { font-size: 1.125rem; color: #4b5563; line-height: 1.6; margin-bottom: 1.5rem; }
      .blog-article-seo figure { margin: 1.5rem 0; }
      .blog-article-seo img { width: 100%; height: auto; border-radius: 0.5rem; }
      .blog-article-seo .article-content { font-size: 1rem; line-height: 1.8; color: #374151; }
      .blog-article-seo footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #6b7280; }
      @media (prefers-color-scheme: dark) {
        .blog-article-seo { background: #111; color: #f9fafb; }
        .blog-article-seo h1 { color: #f9fafb; }
        .blog-article-seo .article-excerpt { color: #d1d5db; }
        .blog-article-seo .article-content { color: #e5e7eb; }
      }
    </style>
  `;
}

/**
 * Middleware principal
 */
export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Detectar tipo de página
  const isHomePage = /^\/?$/.test(pathname);
  const isServiciosPage = /^\/servicios\/?$/.test(pathname);
  const isNosotrosPage = /^\/nosotros\/?$/.test(pathname);
  const isBlogListPage = /^\/blog\/?$/.test(pathname);
  const blogPostMatch = pathname.match(/^\/blog\/([^\/]+)$/);
  const servicioDetailMatch = pathname.match(/^\/servicios\/([^\/]+)$/);
  
  // Si no es ninguna página que manejamos, continuar normal
  if (!isHomePage && !isServiciosPage && !isNosotrosPage && !isBlogListPage && !blogPostMatch && !servicioDetailMatch) {
    return next();
  }

  // Verificar User-Agent para detectar crawlers
  const userAgent = request.headers.get('user-agent') || '';
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Googlebot|bingbot|Slackbot|TelegramBot|Discordbot|Applebot|PetalBot|SemrushBot|AhrefsBot/i.test(userAgent);

  // Si no es un crawler, dejar pasar la request normal
  if (!isCrawler) {
    return next();
  }

  // === CASO 0: Páginas estáticas (Home, Servicios, Nosotros) ===
  if (isHomePage || isServiciosPage || isNosotrosPage) {
    const pageName = isHomePage ? 'home' : isServiciosPage ? 'servicios' : 'nosotros';
    console.log(`[Edge Middleware] Crawler detected for /${pageName}: ${userAgent.substring(0, 50)}`);
    
    // 🔄 Obtener datos SEO desde el CMS
    const cmsData = await getCmsPageData(pageName);
    if (cmsData) {
      console.log(`[Edge Middleware] CMS SEO data loaded for ${pageName}`);
    } else {
      console.log(`[Edge Middleware] Using fallback SEO for ${pageName} (CMS data not available)`);
    }
    
    // Obtener el HTML original desde /index.html
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });
    
    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }
    
    let html = await response.text();

    // Generar meta tags según la página - PASANDO DATOS DEL CMS
    let metaTags: string;
    if (isHomePage) {
      metaTags = generateHomeMetaTags(cmsData);
    } else if (isServiciosPage) {
      metaTags = generateServiciosMetaTags(cmsData);
    } else {
      metaTags = generateNosotrosMetaTags(cmsData);
    }

    // Reemplazar el contenido del <head>
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': `${pageName}-seo`
      }
    });
  }

  // === CASO 1: Página del listado del blog ===
  if (isBlogListPage) {
    console.log(`[Edge Middleware] Crawler detected for /blog: ${userAgent.substring(0, 50)}`);
    
    // 🔄 Obtener datos SEO desde el CMS
    const cmsData = await getCmsPageData('blog');
    if (cmsData) {
      console.log(`[Edge Middleware] CMS SEO data loaded for blog`);
    } else {
      console.log(`[Edge Middleware] Using fallback SEO for blog (CMS data not available)`);
    }
    
    // Obtener el HTML original desde /index.html
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });
    
    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }
    
    let html = await response.text();

    // Generar meta tags para el listado del blog - PASANDO DATOS DEL CMS
    const metaTags = generateBlogListMetaTags(cmsData);

    // Reemplazar el contenido del <head>
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'blog-list-seo'
      }
    });
  }

  // === CASO 2: Servicio individual (detalle) ===
  if (servicioDetailMatch) {
    const servicioSlug = servicioDetailMatch[1];
    
    // No procesar archivos estáticos
    if (servicioSlug.includes('.') || servicioSlug === 'index') {
      return next();
    }

    console.log(`[Edge Middleware] Crawler detected for /servicios/${servicioSlug}: ${userAgent.substring(0, 50)}`);

    // Obtener datos del servicio
    const servicio = await getServicioData(servicioSlug);

    if (!servicio) {
      console.log(`[Edge Middleware] Servicio not found: ${servicioSlug}`);
      return next();
    }

    // Obtener el HTML original desde /index.html
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });
    
    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }
    
    let html = await response.text();

    // Generar meta tags del servicio
    const metaTags = generateServicioDetailMetaTags(servicio);

    // Reemplazar el contenido del <head>
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'servicio-detail-seo'
      }
    });
  }

  // === CASO 3: Post individual del blog ===
  if (blogPostMatch) {
    const slug = blogPostMatch[1];
    
    // No procesar archivos estáticos
    if (slug.includes('.') || slug === 'index') {
      return next();
    }

    console.log(`[Edge Middleware] Crawler detected for /blog/${slug}: ${userAgent.substring(0, 50)}`);

    // Obtener datos del post
    const post = await getPostData(slug);

    if (!post) {
      console.log(`[Edge Middleware] Post not found: ${slug}`);
      return next();
    }

    // Obtener el HTML original desde /index.html (no desde la URL actual que da 404)
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });
    
    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }
    
    let html = await response.text();

    // Generar meta tags del post
    const metaTags = generateMetaTags(post);

    // Reemplazar el contenido del <head>
    // Eliminar meta tags existentes que vamos a reemplazar
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // 🎯 CRÍTICO PARA SEO: Reemplazar el div#root con contenido real del artículo
    // Esto evita que Google vea "Artículo no encontrado" o un div vacío
    const visibleContent = generateVisibleArticleContent(post);
    html = html.replace(
      /<div id="root">[\s\S]*?<\/div>/i,
      `<div id="root">${visibleContent}</div>`
    );

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'blog-seo'
      }
    });
  }

  // Si llegamos aquí, continuar normalmente
  return next();
}

/**
 * Configuración del middleware
 * Se ejecuta para rutas de blog y servicios
 */
export const config = {
  matcher: ['/', '/servicios', '/servicios/:path*', '/nosotros', '/blog', '/blog/:path*']
};
