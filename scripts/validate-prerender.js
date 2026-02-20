/**
 * Validación post-build de páginas pre-renderizadas
 *
 * Verifica que los archivos HTML generados tienen:
 * - Contenido visible en div#root (no solo loading-spinner)
 * - Meta tags SEO correctos (title, description)
 * - Al menos 1 blog post y 1 servicio pre-renderizado
 *
 * Falla el build si hay errores críticos.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

const REQUIRED_PAGES = [
  'servicios/index.html',
  'blog/index.html',
  'nosotros/index.html',
  'contacto/index.html',
  'privacidad/index.html',
  'terminos/index.html'
];

const DEFAULT_TITLE = 'THADO Consulting';

console.log('\n🔍 Validando páginas pre-renderizadas...');
console.log('═'.repeat(50));

let errors = 0;
let warnings = 0;

// Validar páginas estáticas requeridas
for (const page of REQUIRED_PAGES) {
  const filePath = path.join(distPath, page);

  if (!fs.existsSync(filePath)) {
    console.error(`   ❌ FALTANTE: ${page}`);
    errors++;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  // Verificar que div#root tiene contenido significativo
  const rootContent = $('#root').html() || '';
  const hasLoadingSpinner = rootContent.includes('loading-spinner');
  const hasMinimalContent = rootContent.trim().length > 100;

  if (!hasMinimalContent || hasLoadingSpinner) {
    console.error(`   ❌ ROOT VACÍO: ${page} - div#root no tiene contenido visible para Google`);
    errors++;
  }

  // Verificar meta tags
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');

  if (!title || title === DEFAULT_TITLE) {
    console.warn(`   ⚠️ TÍTULO DEFAULT: ${page} - "${title}"`);
    warnings++;
  }

  if (!description) {
    console.warn(`   ⚠️ SIN DESCRIPCIÓN: ${page}`);
    warnings++;
  }

  if (hasMinimalContent && !hasLoadingSpinner) {
    console.log(`   ✅ ${page} (title: "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}")`);
  }
}

// Verificar página 404
const notFoundPath = path.join(distPath, '404.html');
if (fs.existsSync(notFoundPath)) {
  const html = fs.readFileSync(notFoundPath, 'utf-8');
  const $ = cheerio.load(html);
  const robots = $('meta[name="robots"]').attr('content') || '';
  if (robots.includes('noindex')) {
    console.log('   ✅ 404.html (noindex configurado)');
  } else {
    console.warn('   ⚠️ 404.html existe pero no tiene noindex');
    warnings++;
  }
} else {
  console.warn('   ⚠️ 404.html no encontrado');
  warnings++;
}

// Verificar blog posts pre-renderizados
const blogDir = path.join(distPath, 'blog');
if (fs.existsSync(blogDir)) {
  const blogDirs = fs.readdirSync(blogDir).filter(d => {
    const fullPath = path.join(blogDir, d);
    return d !== 'index.html' && fs.statSync(fullPath).isDirectory();
  });

  if (blogDirs.length === 0) {
    console.warn('   ⚠️ No se generaron páginas de blog posts');
    warnings++;
  } else {
    console.log(`   ✅ ${blogDirs.length} blog posts pre-renderizados`);
  }
} else {
  console.warn('   ⚠️ Directorio blog/ no encontrado en dist/');
  warnings++;
}

// Verificar servicios pre-renderizados
const serviciosDir = path.join(distPath, 'servicios');
if (fs.existsSync(serviciosDir)) {
  const servicioDirs = fs.readdirSync(serviciosDir).filter(d => {
    const fullPath = path.join(serviciosDir, d);
    return d !== 'index.html' && fs.statSync(fullPath).isDirectory();
  });

  if (servicioDirs.length === 0) {
    console.warn('   ⚠️ No se generaron páginas de servicios');
    warnings++;
  } else {
    console.log(`   ✅ ${servicioDirs.length} servicios pre-renderizados`);
  }
} else {
  console.warn('   ⚠️ Directorio servicios/ no encontrado en dist/');
  warnings++;
}

// Resumen
console.log('\n' + '═'.repeat(50));
console.log('📊 RESULTADO DE VALIDACIÓN');
console.log('═'.repeat(50));
console.log(`   ✅ OK | ❌ Errores: ${errors} | ⚠️ Warnings: ${warnings}`);
console.log('═'.repeat(50));

if (errors > 0) {
  console.error('\n❌ VALIDACIÓN FALLIDA - Hay páginas con contenido vacío o faltante.');
  console.error('   Google las clasificará como Soft 404.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️ Validación pasó con advertencias.');
} else {
  console.log('\n🎉 Todas las páginas pre-renderizadas son válidas!');
}
