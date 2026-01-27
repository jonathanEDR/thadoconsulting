/**
 * 🚀 Pre-rendering dinámico para Servicios
 *
 * Este script genera HTML estático para cada servicio durante el build,
 * permitiendo que Google y herramientas SEO indexen correctamente el contenido.
 *
 * Sigue el mismo patrón exitoso de prerender-blog.js
 *
 * Funcionalidad:
 * - Obtiene todos los servicios activos desde la API
 * - Genera HTML con meta tags SEO, Schema.org JSON-LD y contenido visible
 * - Crea archivos estáticos en dist/servicios/{slug}/index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// Debug: mostrar todas las variables de entorno relevantes
console.log('═'.repeat(60));
console.log('🔧 PRERENDER-SERVICES: CONFIGURACIÓN');
console.log('═'.repeat(60));
console.log(`   VITE_API_URL (raw): ${process.env.VITE_API_URL || '(not set)'}`);
console.log(`   API_URL (raw): ${process.env.API_URL || '(not set)'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
console.log(`   VERCEL: ${process.env.VERCEL || '(not set)'}`);
console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || '(not set)'}`);

// IMPORTANTE: Normalizar la URL base - remover /api si ya está incluido para evitar /api/api
let rawApiUrl = process.env.VITE_API_URL || process.env.API_URL || 'https://web-scuticompany-back.onrender.com';
const baseApiUrl = rawApiUrl.replace(/\/api\/?$/, '');
console.log(`   Base URL (normalized): ${baseApiUrl}`);
console.log(`   Full API path will be: ${baseApiUrl}/api/...`);
console.log('═'.repeat(60));

// ✅ Configuración centralizada - Usar variables de entorno con fallbacks
const CONFIG = {
  // URL de la API - normalizada sin /api al final
  apiUrl: baseApiUrl,
  siteUrl: process.env.VITE_SITE_URL || 'https://scuticompany.com',
  siteName: process.env.VITE_SITE_NAME || 'SCUTI Company',
  defaultImage: `${process.env.VITE_SITE_URL || 'https://scuticompany.com'}/logofondonegro.jpeg`,
  twitterHandle: '@scuticompany',
  locale: 'es_PE',
  country: 'Peru',
  defaultCurrency: 'PEN',
  currencySymbols: {
    PEN: 'S/.',
    USD: '$',
    EUR: '€'
  }
};

/**
 * Fetch wrapper con timeout y retry
 * Aumentado timeout a 60s y reintentos a 5 para manejar cold starts de Render
 */
async function fetchWithRetry(url, options = {}, retries = 5) {
  console.log(`   🔗 Fetching: ${url}`);
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout (Render cold start)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Build-Prerender/1.0'
        },
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);

      // Log detallado de la respuesta
      console.log(`   📊 Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        // Intentar leer el cuerpo del error
        const errorBody = await response.text().catch(() => 'No body');
        console.log(`   📄 Error body: ${errorBody.substring(0, 200)}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`   ⚠️ Intento ${i + 1}/${retries} fallido: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 3000 * (i + 1))); // Exponential backoff más largo
    }
  }
}

/**
 * Obtener todos los servicios activos desde la API
 */
async function getAllActiveServices() {
  console.log(`\n📡 Conectando a API: ${CONFIG.apiUrl}`);

  try {
    // Obtener todos los servicios activos y visibles en web
    const data = await fetchWithRetry(`${CONFIG.apiUrl}/api/servicios?activo=true&visibleEnWeb=true&limit=1000`);

    if (!data.success || !data.data) {
      console.warn('   ⚠️ Respuesta inesperada de la API:', JSON.stringify(data).substring(0, 200));
      return [];
    }

    const servicios = data.data;
    console.log(`   ✅ ${servicios.length} servicios encontrados`);

    return servicios;
  } catch (error) {
    console.error(`   ❌ Error obteniendo servicios: ${error.message}`);
    return [];
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
 * Obtener URL de imagen
 */
function getImageUrl(image) {
  if (!image) return CONFIG.defaultImage;
  if (typeof image === 'string') {
    if (image.startsWith('http')) return image;
    return `https://res.cloudinary.com/ds54wlchi/image/upload/${image}`;
  }
  if (image.url) return image.url;
  if (image.secure_url) return image.secure_url;
  return CONFIG.defaultImage;
}

/**
 * Obtener nombre de categoría
 */
function getCategoryName(categoria) {
  if (!categoria) return 'Servicios';
  if (typeof categoria === 'string') return categoria;
  if (categoria.nombre) return categoria.nombre;
  return 'Servicios';
}

/**
 * Formatear precio del servicio
 */
function formatPrice(servicio) {
  const getCurrencySymbol = (moneda) => {
    switch (moneda?.toUpperCase()) {
      case 'PEN': return 'S/.';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return 'S/.';
    }
  };
  
  const symbol = getCurrencySymbol(servicio.moneda);
  
  if (servicio.tipoPrecio === 'personalizado') {
    return 'Precio a consultar';
  }
  if (servicio.tipoPrecio === 'rango' && servicio.precioMin && servicio.precioMax) {
    return `${symbol} ${servicio.precioMin.toLocaleString()} - ${symbol} ${servicio.precioMax.toLocaleString()}`;
  }
  if (servicio.tipoPrecio === 'fijo' && servicio.precio) {
    return `${symbol} ${servicio.precio.toLocaleString()}`;
  }
  if (servicio.tipoPrecio === 'rango' && servicio.precioMin) {
    return `Desde ${symbol} ${servicio.precioMin.toLocaleString()}`;
  }
  return 'Consultar precio';
}

/**
 * Generar Schema.org JSON-LD para el servicio
 */
function generateServiceSchema(servicio) {
  const serviceUrl = `${CONFIG.siteUrl}/servicios/${servicio.slug}`;
  const imageUrl = getImageUrl(servicio.imagenPrincipal);
  const categoryName = getCategoryName(servicio.categoria);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": servicio.titulo,
    "description": servicio.descripcionCorta || truncate(stripHtml(servicio.descripcion), 200),
    "url": serviceUrl,
    "image": imageUrl,
    "provider": {
      "@type": "Organization",
      "name": "SCUTI Company",
      "url": CONFIG.siteUrl,
      "logo": CONFIG.defaultImage,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PE",
        "addressLocality": "Huánuco"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "Perú"
    },
    "category": categoryName,
    "serviceType": categoryName
  };

  // Agregar oferta de precio si está disponible
  if (servicio.precio || servicio.precioMin) {
    schema.offers = {
      "@type": "Offer",
      "priceCurrency": servicio.moneda || "PEN",
      "availability": "https://schema.org/InStock"
    };
    
    if (servicio.tipoPrecio === 'fijo' && servicio.precio) {
      schema.offers.price = servicio.precio;
    } else if (servicio.precioMin) {
      schema.offers.lowPrice = servicio.precioMin;
      if (servicio.precioMax) {
        schema.offers.highPrice = servicio.precioMax;
      }
    }
  }

  // Agregar características como features
  if (servicio.caracteristicas && servicio.caracteristicas.length > 0) {
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      "name": "Características del servicio",
      "itemListElement": servicio.caracteristicas.map((carac, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": typeof carac === 'string' ? carac : carac.titulo || carac.nombre || carac
        }
      }))
    };
  }

  return schema;
}

/**
 * Generar BreadcrumbList Schema.org
 */
function generateBreadcrumbSchema(servicio) {
  const categoryName = getCategoryName(servicio.categoria);
  
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
        "name": "Servicios",
        "item": `${CONFIG.siteUrl}/servicios`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": servicio.titulo,
        "item": `${CONFIG.siteUrl}/servicios/${servicio.slug}`
      }
    ]
  };
}

/**
 * Generar contenido HTML visible para el servicio
 * Esto es lo que Googlebot verá antes de que JavaScript cargue
 */
function generateVisibleContent(servicio) {
  const imageUrl = getImageUrl(servicio.imagenPrincipal);
  const categoryName = getCategoryName(servicio.categoria);
  const price = formatPrice(servicio);

  // Extraer descripción para mostrar
  const description = servicio.descripcionCorta || truncate(stripHtml(servicio.descripcion), 500);

  // Características como lista
  const caracteristicasList = servicio.caracteristicas?.slice(0, 5).map(c => {
    const texto = typeof c === 'string' ? c : c.titulo || c.nombre || '';
    return `<li>✓ ${escapeHtml(texto)}</li>`;
  }).join('') || '';

  // Beneficios como lista
  const beneficiosList = servicio.beneficios?.slice(0, 5).map(b => {
    const texto = typeof b === 'string' ? b : b.titulo || b.nombre || '';
    return `<li>🎯 ${escapeHtml(texto)}</li>`;
  }).join('') || '';

  // Etiquetas/keywords
  const tagsText = servicio.etiquetas?.join(', ') || '';

  return `
    <article itemscope itemtype="https://schema.org/Service" class="service-content">
      <header>
        <nav aria-label="Breadcrumb" class="breadcrumb">
          <a href="/" data-discover="true">Inicio</a> &gt;
          <a href="/servicios" data-discover="true">Servicios</a> &gt;
          <span>${escapeHtml(categoryName)}</span>
        </nav>

        <div class="service-category">
          <span class="category-badge">${escapeHtml(categoryName)}</span>
          ${servicio.destacado ? '<span class="featured-badge">★ Destacado</span>' : ''}
        </div>

        <h1 itemprop="name" class="service-title">${escapeHtml(servicio.titulo)}</h1>

        <p itemprop="description" class="service-description">${escapeHtml(description)}</p>

        <div class="service-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <span class="price-label">Precio:</span>
          <span itemprop="price" class="price-value">${escapeHtml(price)}</span>
          <meta itemprop="priceCurrency" content="${servicio.moneda || 'PEN'}" />
        </div>
      </header>

      ${servicio.imagenPrincipal ? `
        <figure class="service-image">
          <img
            itemprop="image"
            src="${imageUrl}"
            alt="${escapeHtml(servicio.titulo)}"
            loading="lazy"
            width="1200"
            height="630"
          />
        </figure>
      ` : ''}

      <div class="service-details">
        ${caracteristicasList ? `
          <section class="service-features">
            <h2>Características</h2>
            <ul>${caracteristicasList}</ul>
          </section>
        ` : ''}

        ${beneficiosList ? `
          <section class="service-benefits">
            <h2>Beneficios</h2>
            <ul>${beneficiosList}</ul>
          </section>
        ` : ''}

        ${servicio.duracion ? `
          <div class="service-duration">
            <strong>Duración estimada:</strong> ${servicio.duracion.valor} ${servicio.duracion.unidad}
          </div>
        ` : ''}
      </div>

      ${tagsText ? `
        <footer class="service-footer">
          <div class="service-tags">
            <strong>Etiquetas:</strong>
            <span itemprop="keywords">${escapeHtml(tagsText)}</span>
          </div>
        </footer>
      ` : ''}

      <div class="service-cta">
        <a href="/contacto" class="cta-button">💬 Solicitar Cotización</a>
        <a href="/servicios" class="cta-link">← Ver todos los servicios</a>
      </div>

      <meta itemprop="url" content="${CONFIG.siteUrl}/servicios/${servicio.slug}" />
      <meta itemprop="provider" content="SCUTI Company" />
    </article>

    <style>
      .service-content {
        max-width: 900px;
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
      .service-category {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .category-badge {
        background: #8b5cf6;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
      }
      .featured-badge {
        background: #fbbf24;
        color: #1f2937;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
      }
      .service-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
        line-height: 1.2;
      }
      .service-description {
        font-size: 1.25rem;
        color: #4b5563;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      .service-price {
        background: #f3f4f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 2rem;
      }
      .price-label {
        color: #6b7280;
      }
      .price-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #8b5cf6;
        margin-left: 0.5rem;
      }
      .service-image img {
        width: 100%;
        height: auto;
        border-radius: 0.75rem;
        margin-bottom: 2rem;
      }
      .service-details section {
        margin-bottom: 2rem;
      }
      .service-details h2 {
        font-size: 1.5rem;
        color: #1f2937;
        margin-bottom: 1rem;
      }
      .service-details ul {
        list-style: none;
        padding: 0;
      }
      .service-details li {
        padding: 0.5rem 0;
        color: #374151;
        font-size: 1.125rem;
      }
      .service-duration {
        background: #ecfdf5;
        padding: 1rem;
        border-radius: 0.5rem;
        color: #065f46;
      }
      .service-footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }
      .service-tags {
        color: #6b7280;
      }
      .service-cta {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .cta-button {
        background: #8b5cf6;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 600;
      }
      .cta-link {
        color: #8b5cf6;
        text-decoration: none;
        padding: 1rem;
      }
      @media (prefers-color-scheme: dark) {
        .service-content { background: #0f0f0f; }
        .service-title { color: #f9fafb; }
        .service-description { color: #d1d5db; }
        .breadcrumb { color: #9ca3af; }
        .service-price { background: #1f2937; }
        .service-details h2 { color: #f9fafb; }
        .service-details li { color: #e5e7eb; }
        .service-footer { border-color: #374151; }
      }
    </style>
  `;
}

/**
 * Generar HTML completo para un servicio
 */
function generateServiceHtml(indexHtml, servicio) {
  const serviceUrl = `${CONFIG.siteUrl}/servicios/${servicio.slug}`;
  const imageUrl = getImageUrl(servicio.imagenPrincipal);
  
  // ✅ PRIORIZAR campos SEO configurados sobre los genéricos
  const seoTitle = servicio.seo?.titulo || servicio.metaTitle || `${servicio.titulo} - ${CONFIG.siteName}`;
  const seoDescription = servicio.seo?.descripcion || servicio.metaDescription || servicio.descripcionCorta || truncate(stripHtml(servicio.descripcion), 160);
  const seoKeywords = servicio.seo?.palabrasClave || servicio.etiquetas?.join(', ') || `${servicio.titulo}, servicios, ${getCategoryName(servicio.categoria)}, SCUTI Company`;
  
  const title = escapeHtml(seoTitle);
  const description = escapeHtml(seoDescription);
  const categoryName = getCategoryName(servicio.categoria);
  const keywords = escapeHtml(seoKeywords);

  // Generar Schema.org JSON-LD
  const serviceSchema = generateServiceSchema(servicio);
  const breadcrumbSchema = generateBreadcrumbSchema(servicio);

  // Generar contenido visible
  const visibleContent = generateVisibleContent(servicio);

  let html = indexHtml;

  // ✅ IMPORTANTE: Usar data-rh="true" para compatibilidad con react-helmet-async
  // Esto evita duplicación de meta tags cuando React se hidrata

  // Reemplazar título - ✅ Usa título SEO configurado
  html = html.replace(
    /<title[^>]*>.*?<\/title>/,
    `<title data-rh="true">${title}</title>`
  );

  // Reemplazar meta description - ✅ Usa descripción SEO configurada
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${description}" data-rh="true" />`
  );

  // Reemplazar keywords - ✅ Usa palabras clave SEO configuradas
  html = html.replace(
    /<meta name="keywords"[^>]*>/,
    `<meta name="keywords" content="${keywords}" data-rh="true" />`
  );

  // Reemplazar canonical
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${serviceUrl}" data-rh="true" />`
  );

  // Reemplazar Open Graph tags - ✅ Usa datos SEO configurados
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
    `<meta property="og:url" content="${serviceUrl}" data-rh="true" />`
  );
  html = html.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${imageUrl}" data-rh="true" />`
  );
  html = html.replace(
    /<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="website" data-rh="true" />`
  );

  // Reemplazar Twitter Card tags - ✅ Usa datos SEO configurados
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

  // Agregar Schema.org JSON-LD para el servicio (antes del cierre de head)
  const schemaScript = `
    <script type="application/ld+json">
    ${JSON.stringify(serviceSchema, null, 2)}
    </script>
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
    </script>
  `;

  html = html.replace('</head>', `${schemaScript}\n  </head>`);

  // Reemplazar el contenido del div#root con el contenido visible del servicio
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
  console.log('\n🚀 Pre-rendering dinámico de Servicios');
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

  // Obtener servicios desde la API
  const servicios = await getAllActiveServices();

  if (servicios.length === 0) {
    console.warn('\n⚠️ No se encontraron servicios para pre-renderizar.');
    console.log('   Esto puede ser porque:');
    console.log('   - La API no está disponible');
    console.log('   - No hay servicios activos');
    console.log('   - Error de conexión');
    console.log('\n   El build continuará sin pre-rendering de servicios.');
    return;
  }

  console.log(`\n💼 Generando HTML para ${servicios.length} servicios...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const servicio of servicios) {
    try {
      const slug = servicio.slug;

      if (!slug) {
        console.warn(`   ⚠️ Servicio sin slug: ${servicio.titulo}`);
        errorCount++;
        continue;
      }

      // Crear directorio para el servicio
      const serviceDir = path.join(distPath, 'servicios', slug);
      if (!fs.existsSync(serviceDir)) {
        fs.mkdirSync(serviceDir, { recursive: true });
      }

      // Generar HTML
      const serviceHtml = generateServiceHtml(indexHtml, servicio);

      // Escribir archivo
      const htmlPath = path.join(serviceDir, 'index.html');
      fs.writeFileSync(htmlPath, serviceHtml);

      // ✅ Log detallado del SEO usado
      const usedSeoTitle = servicio.seo?.titulo || servicio.metaTitle || `${servicio.titulo} - SCUTI Company`;
      const usedSeoDesc = (servicio.seo?.descripcion || servicio.metaDescription || servicio.descripcionCorta || '').substring(0, 60);
      console.log(`   ✅ /servicios/${slug}/index.html`);
      console.log(`      📄 SEO: "${usedSeoTitle.substring(0, 50)}${usedSeoTitle.length > 50 ? '...' : ''}"`);
      successCount++;

    } catch (error) {
      console.error(`   ❌ Error procesando "${servicio.titulo}": ${error.message}`);
      errorCount++;
    }
  }

  // Resumen
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RESUMEN DE PRE-RENDERING DE SERVICIOS');
  console.log('═'.repeat(50));
  console.log(`   ✅ Servicios generados: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Errores: ${errorCount}`);
  }
  console.log(`   📁 Ubicación: dist/servicios/{slug}/index.html`);
  console.log('═'.repeat(50));

  if (successCount > 0) {
    console.log('\n🎉 Pre-rendering de servicios completado!');
    console.log('   Google y herramientas SEO ahora podrán indexar tus servicios.');
  }
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
