/**
 * 🗺️ Generador de Sitemap XML Dinámico para Blog
 *
 * Genera sitemap-blog.xml con todos los posts del blog y actualiza el índice principal.
 *
 * Estructura de sitemaps:
 * - sitemap.xml (índice)
 *   ├── sitemap-pages.xml (páginas estáticas - no se modifica)
 *   └── sitemap-blog.xml (posts del blog - generado dinámicamente)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// Configuración
// IMPORTANTE: Extraer solo el origin (protocolo + host) para evitar /api/api
const rawApiUrl = process.env.VITE_BACKEND_URL || process.env.VITE_API_URL || process.env.API_URL || 'https://thadoconsulting-back-98ll.onrender.com';
let baseApiUrl;
try {
  baseApiUrl = new URL(rawApiUrl).origin; // Solo protocolo + host, sin path
} catch {
  baseApiUrl = rawApiUrl.replace(/\/api.*$/, '').replace(/\/+$/, '');
}

// ✅ Configuración centralizada - Usar variables de entorno con fallbacks
const CONFIG = {
  apiUrl: baseApiUrl,
  siteUrl: process.env.VITE_SITE_URL || 'https://www.thadoconsulting.com',
  siteName: process.env.VITE_SITE_NAME || 'THADO Consulting'
};

// Debug: mostrar qué URL se está usando
console.log('═'.repeat(60));
console.log('🔧 CONFIGURACIÓN DE BUILD - SITEMAP');
console.log('═'.repeat(60));
console.log(`   VITE_SITE_URL: ${process.env.VITE_SITE_URL || '(not set - using default)'}`);
console.log(`   Site URL (used in sitemaps): ${CONFIG.siteUrl}`);
console.log(`   VITE_BACKEND_URL (raw): ${process.env.VITE_BACKEND_URL || '(not set)'}`);
console.log(`   VITE_API_URL (raw): ${process.env.VITE_API_URL || '(not set)'}`);
console.log(`   API_URL (raw): ${process.env.API_URL || '(not set)'}`);
console.log(`   Base URL (normalized): ${CONFIG.apiUrl}`);
console.log(`   Full API path will be: ${CONFIG.apiUrl}/api/...`);
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
          'User-Agent': 'Vercel-Build-Sitemap/1.0'
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

      const data = await response.json();
      console.log(`   ✅ Success: ${JSON.stringify(data).substring(0, 100)}...`);
      return data;
    } catch (error) {
      console.warn(`   ⚠️ Intento ${i + 1}/${retries} fallido: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 3000 * (i + 1))); // Más tiempo entre reintentos
    }
  }
}

/**
 * Obtener todos los posts publicados
 */
async function getAllPosts() {
  try {
    const data = await fetchWithRetry(`${CONFIG.apiUrl}/api/blog/posts?limit=1000`);
    if (!data.success || !data.data?.data) return [];
    return data.data.data;
  } catch (error) {
    console.error(`   ❌ Error obteniendo posts: ${error.message}`);
    return [];
  }
}

/**
 * Obtener todas las categorías
 */
async function getAllCategories() {
  try {
    const data = await fetchWithRetry(`${CONFIG.apiUrl}/api/blog/categories`);
    if (!data.success) return [];
    return data.data || [];
  } catch (error) {
    console.warn(`   ⚠️ Error obteniendo categorías: ${error.message}`);
    return [];
  }
}

/**
 * Formatear fecha para sitemap (YYYY-MM-DD)
 */
function formatDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  return new Date(dateString).toISOString().split('T')[0];
}

/**
 * Escapar caracteres especiales XML
 */
function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generar sitemap-blog.xml con posts del blog
 */
async function generateBlogSitemap() {
  console.log('\n🗺️  Generando sitemap-blog.xml');
  console.log('═'.repeat(50));

  console.log('\n📡 Conectando a API...');
  const posts = await getAllPosts();
  // NO incluir categorías en el sitemap - son filtros, no páginas
  // const categories = await getAllCategories();

  if (posts.length === 0) {
    console.warn('\n⚠️ No se encontraron posts para el sitemap.');
    return { postsCount: 0, categoriesCount: 0 };
  }

  let urls = [];

  // Agregar posts del blog
  console.log(`\n📝 Posts del blog (${posts.length}):`);
  for (const post of posts) {
    if (post.slug) {
      const lastmod = formatDate(post.updatedAt || post.publishedAt);
      urls.push(`
  <url>
    <loc>${escapeXml(CONFIG.siteUrl)}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      console.log(`   ✅ /blog/${post.slug}`);
    }
  }

  // ❌ NO incluir categorías del blog en el sitemap
  // Las categorías son FILTROS de la página /blog, no páginas independientes
  // Google debe indexar /blog y los posts individuales, no los filtros
  console.log(`\n📁 Categorías del blog: NO incluidas en sitemap (son filtros)`);

  // Generar XML del sitemap de blog
  const sitemapBlog = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Sitemap del Blog - Generado: ${new Date().toISOString()} -->
  <!-- Total URLs: ${urls.length} -->
  <!-- NOTA: Categorías y tags NO incluidos (son filtros, no páginas) -->${urls.join('')}
</urlset>`;

  // Escribir sitemap-blog.xml
  const sitemapBlogPath = path.join(distPath, 'sitemap-blog.xml');
  fs.writeFileSync(sitemapBlogPath, sitemapBlog);
  console.log(`\n   📁 Archivo generado: dist/sitemap-blog.xml`);

  return { postsCount: posts.length, categoriesCount: 0 };
}

/**
 * Obtener todos los servicios activos
 */
async function getAllServices() {
  try {
    const data = await fetchWithRetry(`${CONFIG.apiUrl}/api/servicios?activo=true&visibleEnWeb=true&limit=1000`);
    if (!data.success || !data.data) return [];
    return data.data;
  } catch (error) {
    console.error(`   ❌ Error obteniendo servicios: ${error.message}`);
    return [];
  }
}

/**
 * Generar sitemap-services.xml con servicios
 */
async function generateServicesSitemap() {
  console.log('\n💼 Generando sitemap-services.xml');
  console.log('═'.repeat(50));

  console.log('\n📡 Conectando a API...');
  const servicios = await getAllServices();

  if (servicios.length === 0) {
    console.warn('\n⚠️ No se encontraron servicios para el sitemap.');
    return { servicesCount: 0 };
  }

  let urls = [];

  // Agregar servicios
  console.log(`\n💼 Servicios (${servicios.length}):`);
  for (const servicio of servicios) {
    if (servicio.slug) {
      const lastmod = formatDate(servicio.updatedAt || servicio.createdAt);
      urls.push(`
  <url>
    <loc>${escapeXml(CONFIG.siteUrl)}/servicios/${escapeXml(servicio.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      console.log(`   ✅ /servicios/${servicio.slug}`);
    }
  }

  // Generar XML del sitemap de servicios
  const sitemapServices = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Sitemap de Servicios - Generado: ${new Date().toISOString()} -->
  <!-- Total URLs: ${urls.length} -->${urls.join('')}
</urlset>`;

  // Escribir sitemap-services.xml
  const sitemapServicesPath = path.join(distPath, 'sitemap-services.xml');
  fs.writeFileSync(sitemapServicesPath, sitemapServices);
  console.log(`\n   📁 Archivo generado: dist/sitemap-services.xml`);

  return { servicesCount: servicios.length };
}

/**
 * Actualizar el índice principal (sitemap.xml) con la fecha actual
 */
function updateSitemapIndex() {
  console.log('\n📋 Actualizando índice de sitemaps...');

  const today = formatDate(new Date());

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Sitemap de paginas estaticas -->
  <sitemap>
    <loc>${CONFIG.siteUrl}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Sitemap de servicios (dinamico) -->
  <sitemap>
    <loc>${CONFIG.siteUrl}/sitemap-services.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Sitemap del blog (dinamico) -->
  <sitemap>
    <loc>${CONFIG.siteUrl}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

</sitemapindex>`;

  const sitemapIndexPath = path.join(distPath, 'sitemap.xml');
  fs.writeFileSync(sitemapIndexPath, sitemapIndex);
  console.log('   ✅ sitemap.xml actualizado');
}

/**
 * Función principal
 */
async function main() {
  // Verificar que existe dist
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: No se encontró el directorio dist.');
    process.exit(1);
  }

  const { postsCount, categoriesCount } = await generateBlogSitemap();
  const { servicesCount } = await generateServicesSitemap();
  updateSitemapIndex();

  // Resumen
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RESUMEN DE SITEMAPS');
  console.log('═'.repeat(50));
  console.log(`   💼 Servicios: ${servicesCount}`);
  console.log(`   📝 Posts del blog: ${postsCount}`);
  console.log(`   🔢 Total URLs: ${servicesCount + postsCount}`);
  console.log('═'.repeat(50));

  if (postsCount > 0 || servicesCount > 0) {
    console.log('\n🎉 Sitemaps actualizados correctamente!');
    console.log('   - sitemap.xml (índice)');
    console.log('   - sitemap-services.xml (servicios)');
    console.log('   - sitemap-blog.xml (posts)');
  }
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
