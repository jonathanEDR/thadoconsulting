/**
 * Pre-rendering de páginas estáticas con datos SEO del CMS
 *
 * Este script genera HTML estático para cada página pública del sitemap,
 * inyectando contenido visible y meta tags SEO para que Google indexe
 * correctamente sin depender de JavaScript.
 *
 * PRIORIDAD SEO: CMS (MongoDB) > Hardcoded (seoConfig.ts) > Fallback
 *
 * Páginas generadas:
 * - /servicios, /blog, /nosotros, /contacto, /privacidad, /terminos
 * - /404.html (página de error con noindex)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// Configuración
// IMPORTANTE: Extraer solo el origin (protocolo + host) para evitar /api/api
const rawApiUrl = process.env.VITE_BACKEND_URL || process.env.VITE_API_URL || process.env.API_URL || 'https://thadoconsulting-back-98ll.onrender.com';
let baseApiUrl;
try {
  baseApiUrl = new URL(rawApiUrl).origin;
} catch {
  baseApiUrl = rawApiUrl.replace(/\/api.*$/, '').replace(/\/+$/, '');
}

const CONFIG = {
  apiUrl: baseApiUrl,
  siteUrl: process.env.VITE_SITE_URL || 'https://www.thadoconsulting.com',
  siteName: 'THADO Consulting'
};

console.log('═'.repeat(60));
console.log('🔧 CONFIGURACIÓN DE PRE-RENDERING PÁGINAS ESTÁTICAS');
console.log('═'.repeat(60));
console.log(`   API URL: ${CONFIG.apiUrl}`);
console.log(`   Site URL: ${CONFIG.siteUrl}`);
console.log('═'.repeat(60));

/**
 * Fetch con timeout y retry para manejar cold starts de Render
 */
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Build-Prerender/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`   ⚠️ Intento ${i + 1}/${retries} fallido: ${error.message}`);
      if (i === retries - 1) return null;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
  return null;
}

/**
 * Obtener datos SEO del CMS para una página
 */
async function fetchCmsSeo(slug) {
  try {
    const response = await fetchWithRetry(`${CONFIG.apiUrl}/api/cms/pages/${slug}`);
    // La API devuelve { success: true, data: { seo: {...}, content: {...} } }
    const seo = response?.data?.seo;
    if (seo && (seo.metaTitle || seo.metaDescription)) {
      console.log(`   ✅ CMS SEO encontrado para "${slug}"`);
      return {
        title: seo.metaTitle,
        description: seo.metaDescription,
        keywords: Array.isArray(seo.keywords) ? seo.keywords.join(', ') : (seo.keywords || ''),
        ogTitle: seo.ogTitle || seo.metaTitle,
        ogDescription: seo.ogDescription || seo.metaDescription,
        ogImage: seo.ogImage || '',
        url: null // Se establece en processRoute con el path real
      };
    }
    return null;
  } catch (error) {
    console.warn(`   ⚠️ No se pudo obtener CMS SEO para "${slug}": ${error.message}`);
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

// ═══════════════════════════════════════════════════════════
// DEFINICIÓN DE RUTAS CON SEO HARDCODED Y GENERADORES DE CONTENIDO
// ═══════════════════════════════════════════════════════════

const routes = [
  {
    path: '/servicios',
    cmsSlug: 'services',
    hardcodedSeo: {
      title: 'Servicios Contables y Tributarios en Perú - THADO Consulting',
      description: 'Servicios de contabilidad, asesoría tributaria SUNAT, planillas PLAME, constitución de empresas y facturación electrónica para MYPES en todo Perú.',
      keywords: 'servicios contables Perú, asesoría tributaria SUNAT, contador para MYPE, planillas PLAME, constitución de empresas, facturación electrónica, outsourcing contable Lima',
      ogTitle: 'Servicios Contables y Tributarios - THADO Consulting',
      ogDescription: 'Servicios contables profesionales para MYPES y emprendedores en Perú',
      ogImage: `${CONFIG.siteUrl}/logohorizontalconfondo.jpg`,
      url: `${CONFIG.siteUrl}/servicios`
    },
    generateContent: (seo) => `
      <main class="page-content" style="max-width:900px;margin:0 auto;padding:2rem;font-family:Inter,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">Inicio</a> &gt;
          <span>Servicios</span>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:700;color:#1f2937;margin-bottom:1rem;line-height:1.2;">${escapeHtml(seo.title)}</h1>
        <p style="font-size:1.125rem;color:#4b5563;line-height:1.8;margin-bottom:2rem;">${escapeHtml(seo.description)}</p>
        <section>
          <h2 style="font-size:1.5rem;color:#1f2937;margin-bottom:1rem;">Nuestros Servicios</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:0.5rem 0;color:#374151;">📋 Gestión Contable - Registro, libros electrónicos y estados financieros</li>
            <li style="padding:0.5rem 0;color:#374151;">💰 Gestión y Estrategias Tributarias - Declaraciones SUNAT y optimización fiscal</li>
            <li style="padding:0.5rem 0;color:#374151;">👥 Gestión Laboral y PLAME - Nóminas y cumplimiento laboral</li>
            <li style="padding:0.5rem 0;color:#374151;">🏢 Costos y Presupuestos - Análisis de costos y planificación financiera</li>
            <li style="padding:0.5rem 0;color:#374151;">🔍 Transformación Digital - Modernización de procesos contables</li>
          </ul>
        </section>
        <div style="margin-top:2rem;">
          <a href="/contacto" style="background:#2554a3;color:white;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Solicitar Cotización</a>
        </div>
      </main>`
  },
  {
    path: '/blog',
    cmsSlug: 'blog',
    hardcodedSeo: {
      title: 'Blog THADO Consulting - Guías Contables y Tributarias para MYPES',
      description: 'Artículos sobre contabilidad, tributación SUNAT, planillas y gestión empresarial. Guías prácticas para MYPES y emprendedores en Perú.',
      keywords: 'blog contabilidad, guías tributarias SUNAT, contabilidad MYPES, declaraciones SUNAT, régimen tributario Perú, planillas PLAME, facturación electrónica',
      ogTitle: 'Blog THADO Consulting - Contabilidad y Tributación',
      ogDescription: 'Guías y artículos sobre contabilidad y tributación para MYPES en Perú',
      ogImage: `${CONFIG.siteUrl}/logohorizontalconfondo.jpg`,
      url: `${CONFIG.siteUrl}/blog`
    },
    generateContent: (seo) => `
      <main class="page-content" style="max-width:900px;margin:0 auto;padding:2rem;font-family:Inter,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">Inicio</a> &gt;
          <span>Blog</span>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:700;color:#1f2937;margin-bottom:1rem;line-height:1.2;">${escapeHtml(seo.title)}</h1>
        <p style="font-size:1.125rem;color:#4b5563;line-height:1.8;margin-bottom:2rem;">${escapeHtml(seo.description)}</p>
        <section>
          <h2 style="font-size:1.5rem;color:#1f2937;margin-bottom:1rem;">Temas que cubrimos</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:0.5rem 0;color:#374151;">📋 Contabilidad para MYPES y emprendedores</li>
            <li style="padding:0.5rem 0;color:#374151;">💰 Declaraciones y obligaciones tributarias SUNAT</li>
            <li style="padding:0.5rem 0;color:#374151;">👥 Gestión laboral, planillas y PLAME</li>
            <li style="padding:0.5rem 0;color:#374151;">📊 Facturación electrónica y libros SIRE</li>
            <li style="padding:0.5rem 0;color:#374151;">🏢 Constitución de empresas y régimen tributario</li>
          </ul>
        </section>
      </main>`
  },
  {
    path: '/nosotros',
    cmsSlug: 'about',
    hardcodedSeo: {
      title: 'Sobre Nosotros - THADO Consulting | Estudio Contable en Perú',
      description: 'Conoce a THADO Consulting: estudio contable especializado en MYPES y emprendedores. Más de 10 años de experiencia en contabilidad y tributación en Perú.',
      keywords: 'THADO Consulting, estudio contable Perú, contador Lima, contadores colegiados, experiencia tributaria, asesoría contable MYPES',
      ogTitle: 'Sobre Nosotros - THADO Consulting | Estudio Contable en Perú',
      ogDescription: 'Conoce quiénes somos y cómo ayudamos a MYPES a cumplir con SUNAT',
      ogImage: `${CONFIG.siteUrl}/logohorizontalconfondo.jpg`,
      url: `${CONFIG.siteUrl}/nosotros`
    },
    generateContent: (seo) => `
      <main class="page-content" style="max-width:900px;margin:0 auto;padding:2rem;font-family:Inter,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">Inicio</a> &gt;
          <span>Nosotros</span>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:700;color:#1f2937;margin-bottom:1rem;line-height:1.2;">${escapeHtml(seo.title)}</h1>
        <p style="font-size:1.125rem;color:#4b5563;line-height:1.8;margin-bottom:2rem;">${escapeHtml(seo.description)}</p>
        <section>
          <h2 style="font-size:1.5rem;color:#1f2937;margin-bottom:1rem;">¿Por qué elegirnos?</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:0.5rem 0;color:#374151;">✅ +500 MYPES atendidas en todo el Perú</li>
            <li style="padding:0.5rem 0;color:#374151;">✅ 10+ años de experiencia especializada</li>
            <li style="padding:0.5rem 0;color:#374151;">✅ Enfoque integral en 5 pilares estratégicos</li>
            <li style="padding:0.5rem 0;color:#374151;">✅ Respuesta rápida y atención personalizada</li>
            <li style="padding:0.5rem 0;color:#374151;">✅ Garantía de cero multas y contingencias ante SUNAT</li>
          </ul>
        </section>
        <div style="margin-top:2rem;">
          <a href="/contacto" style="background:#2554a3;color:white;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Contáctanos</a>
        </div>
      </main>`
  },
  {
    path: '/contacto',
    cmsSlug: 'contact',
    hardcodedSeo: {
      title: 'Contacto - THADO Consulting | Consultoría Contable Gratuita',
      description: 'Contáctanos para asesoría contable y tributaria. Primera consultoría gratuita para MYPES y emprendedores en todo Perú. Respuesta en 24 horas.',
      keywords: 'contacto THADO, consultoría contable Perú, asesoría tributaria gratuita, contador Lima contacto, solicitar servicio contable, presupuesto contabilidad',
      ogTitle: 'Contacto - THADO Consulting | Hablemos de tu Negocio',
      ogDescription: 'Agenda una consultoría gratuita y ordena tu contabilidad',
      ogImage: `${CONFIG.siteUrl}/logohorizontalconfondo.jpg`,
      url: `${CONFIG.siteUrl}/contacto`
    },
    generateContent: (seo) => `
      <main class="page-content" style="max-width:900px;margin:0 auto;padding:2rem;font-family:Inter,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">Inicio</a> &gt;
          <span>Contacto</span>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:700;color:#1f2937;margin-bottom:1rem;line-height:1.2;">${escapeHtml(seo.title)}</h1>
        <p style="font-size:1.125rem;color:#4b5563;line-height:1.8;margin-bottom:2rem;">${escapeHtml(seo.description)}</p>
        <section>
          <h2 style="font-size:1.5rem;color:#1f2937;margin-bottom:1rem;">Canales de contacto</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:0.5rem 0;color:#374151;">📧 Email: contacto@thadoconsulting.pe</li>
            <li style="padding:0.5rem 0;color:#374151;">⏰ Horario: Lunes a Viernes, 9:00 - 19:00</li>
            <li style="padding:0.5rem 0;color:#374151;">📍 Lima, Perú - Atención a nivel nacional</li>
            <li style="padding:0.5rem 0;color:#374151;">🔄 Primera consultoría gratuita</li>
          </ul>
        </section>
      </main>`
  },
  {
    path: '/privacidad',
    cmsSlug: 'privacidad',
    hardcodedSeo: {
      title: 'Política de Privacidad - THADO Consulting',
      description: 'Conoce nuestra política de privacidad y cómo protegemos tus datos personales. THADO Consulting cumple con la Ley de Protección de Datos Personales del Perú.',
      keywords: 'política de privacidad, protección de datos, THADO Consulting, datos personales, Ley 29733',
      ogTitle: 'Política de Privacidad - THADO Consulting',
      ogDescription: 'Conoce cómo protegemos tus datos personales',
      ogImage: `${CONFIG.siteUrl}/logohorizontalconfondo.jpg`,
      url: `${CONFIG.siteUrl}/privacidad`
    },
    generateContent: (seo) => `
      <main class="page-content" style="max-width:900px;margin:0 auto;padding:2rem;font-family:Inter,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">Inicio</a> &gt;
          <span>Política de Privacidad</span>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:700;color:#1f2937;margin-bottom:1rem;line-height:1.2;">Política de Privacidad</h1>
        <p style="font-size:1.125rem;color:#4b5563;line-height:1.8;margin-bottom:2rem;">${escapeHtml(seo.description)}</p>
        <section>
          <h2 style="font-size:1.5rem;color:#1f2937;margin-bottom:1rem;">Protección de datos</h2>
          <p style="color:#374151;line-height:1.8;">En THADO Consulting nos comprometemos con la protección de tus datos personales, cumpliendo con la Ley N° 29733, Ley de Protección de Datos Personales del Perú y su reglamento.</p>
        </section>
        <div style="margin-top:2rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">← Volver al inicio</a>
        </div>
      </main>`
  },
  {
    path: '/terminos',
    cmsSlug: 'terminos',
    hardcodedSeo: {
      title: 'Términos y Condiciones - THADO Consulting',
      description: 'Lee nuestros términos y condiciones de uso de los servicios de THADO Consulting. Regulaciones aplicables a la contratación de servicios contables y tributarios.',
      keywords: 'términos y condiciones, condiciones de servicio, THADO Consulting, servicios contables, contrato de servicios',
      ogTitle: 'Términos y Condiciones - THADO Consulting',
      ogDescription: 'Términos y condiciones de uso de nuestros servicios contables',
      ogImage: `${CONFIG.siteUrl}/logohorizontalconfondo.jpg`,
      url: `${CONFIG.siteUrl}/terminos`
    },
    generateContent: (seo) => `
      <main class="page-content" style="max-width:900px;margin:0 auto;padding:2rem;font-family:Inter,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">Inicio</a> &gt;
          <span>Términos y Condiciones</span>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:700;color:#1f2937;margin-bottom:1rem;line-height:1.2;">Términos y Condiciones</h1>
        <p style="font-size:1.125rem;color:#4b5563;line-height:1.8;margin-bottom:2rem;">${escapeHtml(seo.description)}</p>
        <section>
          <h2 style="font-size:1.5rem;color:#1f2937;margin-bottom:1rem;">Condiciones de uso</h2>
          <p style="color:#374151;line-height:1.8;">Los presentes términos y condiciones regulan el uso de los servicios ofrecidos por THADO Consulting, incluyendo servicios contables, tributarios y de asesoría financiera.</p>
        </section>
        <div style="margin-top:2rem;">
          <a href="/" style="color:#2554a3;text-decoration:none;">← Volver al inicio</a>
        </div>
      </main>`
  }
];

/**
 * Reemplazar meta tags SEO en el HTML usando cheerio
 */
function applySeoTags($, seo) {
  // Title
  $('title').text(seo.title);
  $('title').attr('data-rh', 'true');

  // Meta description
  $('meta[name="description"]').attr('content', seo.description).attr('data-rh', 'true');

  // Keywords
  $('meta[name="keywords"]').attr('content', seo.keywords).attr('data-rh', 'true');

  // Canonical
  $('link[rel="canonical"]').attr('href', seo.url).attr('data-rh', 'true');

  // Open Graph
  $('meta[property="og:title"]').attr('content', seo.ogTitle || seo.title).attr('data-rh', 'true');
  $('meta[property="og:description"]').attr('content', seo.ogDescription || seo.description).attr('data-rh', 'true');
  $('meta[property="og:url"]').attr('content', seo.url).attr('data-rh', 'true');
  if (seo.ogImage) {
    $('meta[property="og:image"]').attr('content', seo.ogImage).attr('data-rh', 'true');
  }

  // Twitter Card
  $('meta[name="twitter:title"]').attr('content', seo.ogTitle || seo.title).attr('data-rh', 'true');
  $('meta[name="twitter:description"]').attr('content', seo.ogDescription || seo.description).attr('data-rh', 'true');
  if (seo.ogImage) {
    $('meta[name="twitter:image"]').attr('content', seo.ogImage).attr('data-rh', 'true');
  }
}

/**
 * Procesar una ruta: obtener SEO del CMS o hardcoded, inyectar contenido
 */
async function processRoute(route, indexHtml) {
  console.log(`\n📄 Procesando ${route.path}...`);

  // 1. Intentar obtener datos SEO del CMS
  let seoData = await fetchCmsSeo(route.cmsSlug);

  // 2. Si no hay CMS, usar hardcoded
  if (!seoData) {
    console.log(`   ⚙️ Usando SEO hardcoded para "${route.cmsSlug}"`);
    seoData = route.hardcodedSeo;
  }

  // Asegurar URL correcta (siempre usar el path real, no el slug del CMS)
  seoData.url = `${CONFIG.siteUrl}${route.path}`;

  // 3. Usar cheerio para manipular HTML de forma segura
  const $ = cheerio.load(indexHtml, { decodeEntities: false });

  // 4. Aplicar meta tags SEO
  applySeoTags($, seoData);

  // 5. Inyectar contenido visible en div#root
  const visibleContent = route.generateContent(seoData);
  $('#root').html(visibleContent);

  // 6. Escribir archivo
  const routePath = path.join(distPath, route.path.substring(1));
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }

  const htmlPath = path.join(routePath, 'index.html');
  fs.writeFileSync(htmlPath, $.html());

  console.log(`   ✅ ${route.path}/index.html`);
  console.log(`   📄 Title: ${seoData.title}`);
  console.log(`   🔗 Source: ${seoData === route.hardcodedSeo ? 'HARDCODED' : 'CMS'}`);
}

/**
 * Generar página 404 pre-renderizada
 */
function generate404Page(indexHtml) {
  console.log('\n📄 Generando 404.html...');

  const $ = cheerio.load(indexHtml, { decodeEntities: false });

  $('title').text('Página no encontrada - THADO Consulting');
  $('meta[name="description"]').attr('content', 'La página que buscas no existe o ha sido movida.');
  $('meta[name="robots"]').attr('content', 'noindex, nofollow');

  $('#root').html(`
    <main style="min-height:60vh;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:2rem;font-family:Inter,-apple-system,sans-serif;text-align:center;">
      <h1 style="font-size:5rem;font-weight:700;color:#2554a3;margin-bottom:0.5rem;">404</h1>
      <h2 style="font-size:1.5rem;color:#1f2937;margin-bottom:1rem;">Página no encontrada</h2>
      <p style="color:#6b7280;margin-bottom:2rem;max-width:400px;">La página que buscas no existe o ha sido movida. Puedes volver al inicio o explorar nuestros servicios.</p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
        <a href="/" style="background:#2554a3;color:white;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Volver al inicio</a>
        <a href="/servicios" style="border:2px solid #2554a3;color:#2554a3;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Ver servicios</a>
      </div>
    </main>
  `);

  fs.writeFileSync(path.join(distPath, '404.html'), $.html());
  console.log('   ✅ 404.html generado con noindex');
}

/**
 * Función principal
 */
async function main() {
  console.log('\n🚀 Pre-rendering de páginas estáticas con SEO del CMS');
  console.log('═'.repeat(50));

  // Verificar que existe dist
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: No se encontró el directorio dist.');
    process.exit(1);
  }

  // Leer HTML base
  const indexHtmlPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ Error: No se encontró index.html en dist.');
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  console.log('✅ Template HTML cargado');

  // Procesar cada ruta
  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      await processRoute(route, indexHtml);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Error procesando ${route.path}: ${error.message}`);
      errorCount++;
    }
  }

  // Generar página 404
  try {
    generate404Page(indexHtml);
    successCount++;
  } catch (error) {
    console.error(`   ❌ Error generando 404.html: ${error.message}`);
    errorCount++;
  }

  // Resumen
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RESUMEN DE PRE-RENDERING');
  console.log('═'.repeat(50));
  console.log(`   ✅ Páginas generadas: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Errores: ${errorCount}`);
  }
  console.log('═'.repeat(50));

  if (successCount > 0) {
    console.log('\n🎉 Pre-rendering de páginas estáticas completado!');
  }
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
