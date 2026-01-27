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
      title: 'Nuestros Servicios - SCUTI Company',
      description: 'Consultoría IT, Proyectos Tecnológicos e Inteligencia Artificial para impulsar tu negocio',
      keywords: 'servicios, consultoría, tecnología, software, inteligencia artificial',
      ogTitle: 'Servicios - SCUTI Company',
      ogDescription: 'Descubre nuestras soluciones tecnológicas diseñadas para transformar tu empresa',
      url: 'https://scuticompany.com/servicios'
    }
  },
  {
    path: '/blog',
    seo: {
      title: 'Blog SCUTI Company - Noticias y Tendencias Tecnológicas',
      description: 'Mantente informado con las últimas noticias y tendencias del sector tecnológico. Contenido curado por expertos.',
      keywords: 'blog, noticias tecnológicas, tendencias tech, desarrollo web, programación, AI',
      ogTitle: 'Blog SCUTI Company - Noticias Tecnológicas',
      ogDescription: 'Las últimas noticias y tendencias del sector tecnológico',
      url: 'https://scuticompany.com/blog'
    }
  },
  {
    path: '/nosotros',
    seo: {
      title: 'Sobre Nosotros - SCUTI Company',
      description: 'Conoce más sobre SCUTI Company, nuestra misión, visión y el equipo de expertos en tecnología',
      keywords: 'sobre nosotros, equipo, misión, visión, SCUTI',
      ogTitle: 'Sobre Nosotros - SCUTI Company',
      ogDescription: 'Conoce más sobre SCUTI Company y nuestro equipo',
      url: 'https://scuticompany.com/nosotros'
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
