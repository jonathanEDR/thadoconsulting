import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// Read the main index.html template
const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

// Define routes and their SEO metadata
const routes = [
  {
    path: '/servicios',
    seo: {
      title: 'Servicios Contables y Tributarios - THADO Consulting',
      description: 'Servicios contables, tributarios y financieros para MYPES en Perú. Declaraciones SUNAT, libros electrónicos, PDT y asesoría fiscal.',
      keywords: 'servicios contables, tributación, SUNAT, libros electrónicos, PDT, MYPES, Perú',
      ogTitle: 'Servicios - THADO Consulting',
      ogDescription: 'Servicios contables, tributarios y financieros para MYPES en Perú',
      url: 'https://www.thadoconsulting.com/servicios'
    }
  },
  {
    path: '/blog',
    seo: {
      title: 'Blog THADO Consulting - Contabilidad y Tributación para MYPES',
      description: 'Artículos sobre contabilidad, tributación SUNAT, gestión financiera y consejos prácticos para MYPES en Perú.',
      keywords: 'blog contabilidad, tributación SUNAT, MYPES Perú, gestión financiera, libros electrónicos',
      ogTitle: 'Blog THADO Consulting - Contabilidad y Tributación',
      ogDescription: 'Artículos sobre contabilidad, tributación y gestión financiera para MYPES en Perú',
      url: 'https://www.thadoconsulting.com/blog'
    }
  },
  {
    path: '/nosotros',
    seo: {
      title: 'Sobre Nosotros - THADO Consulting | Estudio Contable en Perú',
      description: 'Conoce THADO Consulting: estudio contable especializado en servicios para MYPES en Perú. Nuestro equipo de contadores expertos.',
      keywords: 'sobre nosotros, equipo THADO, estudio contable Perú, contadores, MYPES',
      ogTitle: 'Sobre Nosotros - THADO Consulting',
      ogDescription: 'Conoce THADO Consulting y nuestro equipo de contadores expertos',
      url: 'https://www.thadoconsulting.com/nosotros'
    }
  }
];

// Function to replace SEO tags in HTML
function replaceSeoTags(html, seo) {
  let result = html;

  // Replace title
  result = result.replace(
    /<title[^>]*>.*?<\/title>/,
    `<title data-rh="true">${seo.title}</title>`
  );

  // Replace meta description
  result = result.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${seo.description}" data-rh="true" />`
  );

  // Replace keywords
  result = result.replace(
    /<meta name="keywords"[^>]*>/,
    `<meta name="keywords" content="${seo.keywords}" data-rh="true" />`
  );

  // Replace canonical
  result = result.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${seo.url}" data-rh="true" />`
  );

  // Replace og:title
  result = result.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${seo.ogTitle}" data-rh="true" />`
  );

  // Replace og:description
  result = result.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${seo.ogDescription}" data-rh="true" />`
  );

  // Replace og:url
  result = result.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${seo.url}" data-rh="true" />`
  );

  // Replace twitter:title
  result = result.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${seo.title}" data-rh="true" />`
  );

  // Replace twitter:description
  result = result.replace(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${seo.description}" data-rh="true" />`
  );

  return result;
}

// Generate static HTML for each route
console.log('🚀 Generando HTML estático para SEO...\n');

routes.forEach(route => {
  const routePath = path.join(distPath, route.path.substring(1));
  const htmlPath = path.join(routePath, 'index.html');

  // Create directory if it doesn't exist
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }

  // Replace SEO tags and write file
  const customHtml = replaceSeoTags(indexHtml, route.seo);
  fs.writeFileSync(htmlPath, customHtml);

  console.log(`✅ ${route.path}/index.html`);
  console.log(`   📄 Title: ${route.seo.title}`);
  console.log(`   🔗 URL: ${route.seo.url}\n`);
});

console.log('🎉 Pre-renderizado completado exitosamente!');
console.log('\n📋 Archivos generados:');
routes.forEach(route => {
  console.log(`   • dist${route.path}/index.html`);
});
