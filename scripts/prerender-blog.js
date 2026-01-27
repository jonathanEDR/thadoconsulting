/**
 * 🚀 Pre-rendering dinámico para Blog Posts
 *
 * Este script genera HTML estático para cada post del blog durante el build,
 * permitiendo que Google indexe correctamente el contenido sin depender de JavaScript.
 *
 * Funcionalidad:
 * - Obtiene todos los posts publicados desde la API
 * - Genera HTML con meta tags SEO, Schema.org JSON-LD y contenido visible
 * - Crea archivos estáticos en dist/blog/{slug}/index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// Configuración
// IMPORTANTE: Normalizar la URL base - remover /api si ya está incluido para evitar /api/api
const rawApiUrl = process.env.VITE_API_URL || process.env.API_URL || 'https://thadoconsulting-back.onrender.com';
// Remover /api del final si existe para evitar duplicación
const baseApiUrl = rawApiUrl.replace(/\/api\/?$/, '');

const CONFIG = {
  apiUrl: baseApiUrl,
  siteUrl: 'https://www.thadoconsulting.com',
  siteName: 'THADO Consulting Blog',
  defaultImage: 'https://www.thadoconsulting.com/Logo.png',
  twitterHandle: '@thadoconsulting'
};

// Debug: mostrar qué URL se está usando
console.log('═'.repeat(60));
console.log('🔧 CONFIGURACIÓN DE PRE-RENDERING BLOG');
console.log('═'.repeat(60));
console.log(`   VITE_API_URL (raw): ${process.env.VITE_API_URL || '(not set)'}`);
console.log(`   API_URL (raw): ${process.env.API_URL || '(not set)'}`);
console.log(`   Base URL (normalized): ${CONFIG.apiUrl}`);
console.log(`   Full API path will be: ${CONFIG.apiUrl}/api/blog/...`);
console.log('═'.repeat(60));

/**
 * Fetch wrapper con timeout y retry
 * Aumentado timeout a 60s y reintentos a 5 para manejar cold starts de Render
 */
async function fetchWithRetry(url, options = {}, retries = 5) {
  console.log(`   🔗 Fetching: ${url}`);
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60s para cold start

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Build-Blog-Prerender/1.0'
        },
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);
      
      console.log(`   📊 Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No body');
        console.log(`   📄 Error body: ${errorBody.substring(0, 200)}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`   ⚠️ Intento ${i + 1}/${retries} fallido: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1))); // Exponential backoff
    }
  }
}

/**
 * Obtener todos los posts publicados desde la API
 */
async function getAllPublishedPosts() {
  console.log(`\n📡 Conectando a API: ${CONFIG.apiUrl}`);

  try {
    // Obtener todos los posts (aumentamos el límite para obtener todos)
    const data = await fetchWithRetry(`${CONFIG.apiUrl}/api/blog/posts?limit=1000&sortBy=-publishedAt`);

    if (!data.success || !data.data?.data) {
      console.warn('   ⚠️ Respuesta inesperada de la API:', JSON.stringify(data).substring(0, 200));
      return [];
    }

    const posts = data.data.data;
    console.log(`   ✅ ${posts.length} posts encontrados`);

    return posts;
  } catch (error) {
    console.error(`   ❌ Error obteniendo posts: ${error.message}`);
    return [];
  }
}

/**
 * Obtener detalle de un post específico
 */
async function getPostDetail(slug) {
  try {
    const data = await fetchWithRetry(
      `${CONFIG.apiUrl}/api/blog/posts/${slug}?incrementViews=false`
    );

    if (!data.success || !data.data?.post) {
      return null;
    }

    return data.data.post;
  } catch (error) {
    console.warn(`   ⚠️ Error obteniendo detalle de ${slug}: ${error.message}`);
    return null;
  }
}

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Limpiar HTML y extraer texto plano
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncar texto a una longitud máxima
 */
function truncate(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Formatear fecha para Schema.org
 */
function formatDate(dateString) {
  if (!dateString) return new Date().toISOString();
  return new Date(dateString).toISOString();
}

/**
 * Obtener URL de imagen
 */
function getImageUrl(image) {
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
function getAuthorName(author) {
  if (!author) return 'THADO Consulting';
  if (typeof author === 'string') return author;
  if (author.displayName) return author.displayName;
  if (author.firstName && author.lastName) return `${author.firstName} ${author.lastName}`;
  if (author.firstName) return author.firstName;
  if (author.username) return author.username;
  return 'THADO Consulting';
}

/**
 * Generar Schema.org JSON-LD para el artículo
 */
function generateArticleSchema(post) {
  const authorName = getAuthorName(post.author);
  const imageUrl = getImageUrl(post.featuredImage);
  const postUrl = `${CONFIG.siteUrl}/blog/${post.slug}`;
  
  // ✅ CORREGIDO: Usar SEO keywords (focusKeyphrase + seo.keywords), eliminar duplicados
  const seoKeywords = post.seo?.focusKeyphrase || post.seo?.keywords?.length
    ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))]
    : post.tags?.map(t => typeof t === 'string' ? t : t.name) || [];
  const keywords = seoKeywords.join(', ');

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.seo?.metaTitle || post.title,
    "description": post.seo?.metaDescription || post.excerpt || truncate(stripHtml(post.content), 160),
    "image": imageUrl,
    "datePublished": formatDate(post.publishedAt || post.createdAt),
    "dateModified": formatDate(post.updatedAt || post.publishedAt || post.createdAt),
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "THADO Consulting",
      "logo": {
        "@type": "ImageObject",
        "url": CONFIG.defaultImage
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "url": postUrl,
    "keywords": keywords,
    "articleSection": post.category?.name || 'Blog',
    "wordCount": stripHtml(post.content).split(/\s+/).length,
    "inLanguage": "es"
  };

  // Agregar "about" si hay focusKeyphrase
  if (post.seo?.focusKeyphrase) {
    schema.about = {
      "@type": "Thing",
      "name": post.seo.focusKeyphrase
    };
  }

  return schema;
}

/**
 * Generar BreadcrumbList Schema.org
 */
function generateBreadcrumbSchema(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": CONFIG.siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${CONFIG.siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${CONFIG.siteUrl}/blog/${post.slug}`
      }
    ]
  };
}

/**
 * Generar contenido HTML visible para el post
 * Esto es lo que Googlebot verá antes de que JavaScript cargue
 */
function generateVisibleContent(post) {
  const authorName = getAuthorName(post.author);
  const imageUrl = getImageUrl(post.featuredImage);
  const categoryName = post.category?.name || 'Blog';
  const publishDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  // Extraer primeros párrafos del contenido (visible para SEO)
  const contentPreview = stripHtml(post.content).substring(0, 1000);

  // ✅ CORREGIDO: Usar SEO keywords (focusKeyphrase + seo.keywords), eliminar duplicados
  const seoKeywords = post.seo?.focusKeyphrase || post.seo?.keywords?.length
    ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))]
    : post.tags?.map(t => typeof t === 'string' ? t : t.name) || [];
  const keywordsText = seoKeywords.join(', ');
  
  // ✅ CORREGIDO: Usar SEO title y description
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt || '';

  return `
    <article itemscope itemtype="https://schema.org/BlogPosting" class="blog-post-content">
      <header>
        <nav aria-label="Breadcrumb" class="breadcrumb">
          <a href="/" data-discover="true">Inicio</a> &gt;
          <a href="/blog" data-discover="true">Blog</a> &gt;
          <span>${escapeHtml(categoryName)}</span>
        </nav>

        <h1 itemprop="headline" class="post-title">${escapeHtml(title)}</h1>

        <div class="post-meta">
          <span itemprop="author" itemscope itemtype="https://schema.org/Person">
            Por <span itemprop="name">${escapeHtml(authorName)}</span>
          </span>
          ${publishDate ? `<time itemprop="datePublished" datetime="${formatDate(post.publishedAt)}">${publishDate}</time>` : ''}
          <span>En <span itemprop="articleSection">${escapeHtml(categoryName)}</span></span>
        </div>

        ${description ? `<p itemprop="description" class="post-excerpt">${escapeHtml(description)}</p>` : ''}
      </header>

      ${post.featuredImage ? `
        <figure class="post-image">
          <img
            itemprop="image"
            src="${imageUrl}"
            alt="${escapeHtml(title)}"
            loading="lazy"
            width="1200"
            height="630"
          />
        </figure>
      ` : ''}

      <div itemprop="articleBody" class="post-body">
        <p>${escapeHtml(contentPreview)}${contentPreview.length >= 1000 ? '...' : ''}</p>
      </div>

      ${keywordsText ? `
        <footer class="post-footer">
          <div class="post-tags">
            <strong>Palabras clave:</strong>
            <span itemprop="keywords">${escapeHtml(keywordsText)}</span>
          </div>
        </footer>
      ` : ''}

      <meta itemprop="url" content="${CONFIG.siteUrl}/blog/${post.slug}" />
      <meta itemprop="mainEntityOfPage" content="${CONFIG.siteUrl}/blog/${post.slug}" />
    </article>

    <style>
      .blog-post-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .breadcrumb {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 1rem;
      }
      .breadcrumb a {
        color: #8b5cf6;
        text-decoration: none;
      }
      .post-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
        line-height: 1.2;
      }
      .post-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
      .post-excerpt {
        font-size: 1.25rem;
        color: #4b5563;
        line-height: 1.6;
        margin-bottom: 2rem;
      }
      .post-image img {
        width: 100%;
        height: auto;
        border-radius: 0.75rem;
        margin-bottom: 2rem;
      }
      .post-body {
        font-size: 1.125rem;
        line-height: 1.8;
        color: #374151;
      }
      .post-footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }
      .post-tags {
        color: #6b7280;
      }
      @media (prefers-color-scheme: dark) {
        .blog-post-content { background: #0f0f0f; }
        .post-title { color: #f9fafb; }
        .post-meta, .breadcrumb { color: #9ca3af; }
        .post-excerpt { color: #d1d5db; }
        .post-body { color: #e5e7eb; }
        .post-footer { border-color: #374151; }
      }
    </style>
  `;
}

/**
 * Generar HTML completo para un post
 */
function generatePostHtml(indexHtml, post) {
  const postUrl = `${CONFIG.siteUrl}/blog/${post.slug}`;
  const imageUrl = getImageUrl(post.featuredImage);
  // ✅ CORREGIDO: Usar SEO description
  const description = escapeHtml(post.seo?.metaDescription || post.excerpt || truncate(stripHtml(post.content), 160));
  // ✅ CORREGIDO: Usar SEO title
  const title = escapeHtml(post.seo?.metaTitle || post.title);
  // ✅ CORREGIDO: Usar SEO keywords (focusKeyphrase + seo.keywords), eliminar duplicados
  const seoKeywords = post.seo?.focusKeyphrase || post.seo?.keywords?.length
    ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))]
    : post.tags?.map(t => typeof t === 'string' ? t : t.name) || [];
  const keywords = seoKeywords.join(', ');

  // Generar Schema.org JSON-LD
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema(post);

  // Generar contenido visible
  const visibleContent = generateVisibleContent(post);

  let html = indexHtml;

  // Reemplazar título
  html = html.replace(
    /<title[^>]*>.*?<\/title>/,
    `<title data-rh="true">${title} | ${CONFIG.siteName}</title>`
  );

  // Reemplazar meta description
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${description}" data-rh="true" />`
  );

  // Reemplazar keywords
  html = html.replace(
    /<meta name="keywords"[^>]*>/,
    `<meta name="keywords" content="${escapeHtml(keywords)}" data-rh="true" />`
  );

  // Reemplazar canonical
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${postUrl}" data-rh="true" />`
  );

  // Reemplazar Open Graph tags
  html = html.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${title}" data-rh="true" />`
  );
  html = html.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${description}" data-rh="true" />`
  );
  html = html.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${postUrl}" data-rh="true" />`
  );
  html = html.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${imageUrl}" data-rh="true" />`
  );
  html = html.replace(
    /<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="article" data-rh="true" />`
  );

  // Reemplazar Twitter Card tags
  html = html.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${title}" data-rh="true" />`
  );
  html = html.replace(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${description}" data-rh="true" />`
  );
  html = html.replace(
    /<meta name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${imageUrl}" data-rh="true" />`
  );

  // Agregar article meta tags adicionales
  const articleMeta = `
    <meta property="article:published_time" content="${formatDate(post.publishedAt || post.createdAt)}" />
    <meta property="article:modified_time" content="${formatDate(post.updatedAt)}" />
    <meta property="article:author" content="${escapeHtml(getAuthorName(post.author))}" />
    <meta property="article:section" content="${escapeHtml(post.category?.name || 'Blog')}" />
    ${post.tags?.map(t => `<meta property="article:tag" content="${escapeHtml(typeof t === 'string' ? t : t.name)}" />`).join('\n    ') || ''}
  `;

  // Insertar article meta tags antes de </head>
  html = html.replace('</head>', `${articleMeta}\n  </head>`);

  // Agregar Schema.org JSON-LD para el artículo (antes del cierre de head)
  const schemaScript = `
    <script type="application/ld+json">
    ${JSON.stringify(articleSchema, null, 2)}
    </script>
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
    </script>
  `;

  html = html.replace('</head>', `${schemaScript}\n  </head>`);

  // Reemplazar el contenido del div#root con el contenido visible del post
  // Esto es crítico para que Google vea el contenido real
  html = html.replace(
    /<div id="root">.*?<\/div>/s,
    `<div id="root">${visibleContent}</div>`
  );

  return html;
}

/**
 * Función principal
 */
async function main() {
  console.log('\n🚀 Pre-rendering dinámico de Blog Posts');
  console.log('═'.repeat(50));

  // Verificar que existe dist
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: No se encontró el directorio dist. Ejecuta "npm run build" primero.');
    process.exit(1);
  }

  // Leer el HTML base
  const indexHtmlPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ Error: No se encontró index.html en dist.');
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  console.log('✅ Template HTML cargado');

  // Obtener posts desde la API
  const posts = await getAllPublishedPosts();

  if (posts.length === 0) {
    console.warn('\n⚠️ No se encontraron posts para pre-renderizar.');
    console.log('   Esto puede ser porque:');
    console.log('   - La API no está disponible');
    console.log('   - No hay posts publicados');
    console.log('   - Error de conexión');
    console.log('\n   El build continuará sin pre-rendering de posts.');
    return;
  }

  console.log(`\n📝 Generando HTML para ${posts.length} posts...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    try {
      const slug = post.slug;

      if (!slug) {
        console.warn(`   ⚠️ Post sin slug: ${post.title}`);
        errorCount++;
        continue;
      }

      // Crear directorio para el post
      const postDir = path.join(distPath, 'blog', slug);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      // Generar HTML
      const postHtml = generatePostHtml(indexHtml, post);

      // Escribir archivo
      const htmlPath = path.join(postDir, 'index.html');
      fs.writeFileSync(htmlPath, postHtml);

      console.log(`   ✅ /blog/${slug}/index.html`);
      successCount++;

    } catch (error) {
      console.error(`   ❌ Error procesando "${post.title}": ${error.message}`);
      errorCount++;
    }
  }

  // Resumen
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RESUMEN DE PRE-RENDERING');
  console.log('═'.repeat(50));
  console.log(`   ✅ Posts generados: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Errores: ${errorCount}`);
  }
  console.log(`   📁 Ubicación: dist/blog/{slug}/index.html`);
  console.log('═'.repeat(50));

  if (successCount > 0) {
    console.log('\n🎉 Pre-rendering de blog completado!');
    console.log('   Google ahora podrá indexar el contenido de tus posts.');
  }
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
