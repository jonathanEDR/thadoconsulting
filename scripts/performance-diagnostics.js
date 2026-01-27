/**
 * 🔍 DIAGNÓSTICO DE RENDIMIENTO DE PÁGINAS PÚBLICAS
 * 
 * Analiza el rendimiento de las páginas públicas de servicios
 * - Tiempo de carga
 * - Tamaño de bundles
 * - Lazy loading
 * - Optimización de imágenes
 * - Cache effectiveness
 * 
 * @author Web Scuti
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURACIÓN
// ============================================

const PAGES_TO_ANALYZE = [
  {
    name: 'Listado de Servicios',
    path: 'src/pages/public/ServicesPublicV2.tsx',
    route: '/servicios',
    critical: true
  },
  {
    name: 'Detalle de Servicio',
    path: 'src/pages/public/ServicioDetail.tsx',
    route: '/servicios/:slug',
    critical: true
  }
];

const COMPONENTS_TO_ANALYZE = [
  'src/components/public/PublicHeader.tsx',
  'src/components/public/PublicFooter.tsx',
  'src/components/public/ServicioPublicCard.tsx',
  'src/components/common/SearchBar.tsx'
];

// ============================================
// UTILIDADES
// ============================================

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getFileSize(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const stats = fs.statSync(fullPath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function analyzeFileContent(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    return {
      lines: content.split('\n').length,
      size: Buffer.byteLength(content, 'utf8'),
      hasLazyLoading: content.includes('lazy(') || content.includes('Suspense'),
      hasImageOptimization: content.includes('LazyImage') || content.includes('loading="lazy"'),
      usesHeavyLibraries: {
        moment: content.includes('moment'),
        lodash: content.includes('lodash'),
        axios: content.includes('axios')
      },
      componentsCount: (content.match(/const \w+ =|function \w+/g) || []).length,
      stateManagement: {
        useState: (content.match(/useState/g) || []).length,
        useEffect: (content.match(/useEffect/g) || []).length,
        useMemo: (content.match(/useMemo/g) || []).length,
        useCallback: (content.match(/useCallback/g) || []).length
      },
      apiCalls: (content.match(/fetch\(|axios\.|\.get\(|\.post\(/g) || []).length,
      cssInJs: content.includes('styled') || content.includes('makeStyles'),
      inlineStyles: (content.match(/style={{/g) || []).length
    };
  } catch (error) {
    return null;
  }
}

function analyzeBundleSize() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    return {
      error: 'No se encontró carpeta dist. Ejecuta npm run build primero.'
    };
  }

  const jsFiles = [];
  const cssFiles = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.js')) {
        jsFiles.push({
          name: file,
          size: stat.size,
          path: filePath.replace(distPath, '')
        });
      } else if (file.endsWith('.css')) {
        cssFiles.push({
          name: file,
          size: stat.size,
          path: filePath.replace(distPath, '')
        });
      }
    });
  }
  
  walkDir(distPath);
  
  const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
  const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
  
  return {
    js: {
      files: jsFiles.sort((a, b) => b.size - a.size),
      total: totalJsSize,
      count: jsFiles.length
    },
    css: {
      files: cssFiles.sort((a, b) => b.size - a.size),
      total: totalCssSize,
      count: cssFiles.length
    }
  };
}

// ============================================
// ANÁLISIS DE RENDIMIENTO
// ============================================

function analyzePerformance() {
  console.log('\n🔍 =====================================');
  console.log('   DIAGNÓSTICO DE RENDIMIENTO');
  console.log('   Páginas Públicas de Servicios');
  console.log('=====================================\n');

  // 1. Análisis de páginas principales
  console.log('📄 ANÁLISIS DE PÁGINAS PRINCIPALES\n');
  
  PAGES_TO_ANALYZE.forEach((page, index) => {
    console.log(`${index + 1}. ${page.name} (${page.route})`);
    console.log('   ' + '-'.repeat(50));
    
    const analysis = analyzeFileContent(page.path);
    const size = getFileSize(page.path);
    
    if (analysis) {
      console.log(`   📊 Tamaño: ${formatBytes(size)}`);
      console.log(`   📝 Líneas de código: ${analysis.lines}`);
      console.log(`   🧩 Componentes: ${analysis.componentsCount}`);
      console.log(`   🔄 API Calls: ${analysis.apiCalls}`);
      console.log(`   \n   ⚡ Hooks de React:`);
      console.log(`      - useState: ${analysis.stateManagement.useState}`);
      console.log(`      - useEffect: ${analysis.stateManagement.useEffect}`);
      console.log(`      - useMemo: ${analysis.stateManagement.useMemo}`);
      console.log(`      - useCallback: ${analysis.stateManagement.useCallback}`);
      
      console.log(`   \n   ✅ Optimizaciones:`);
      console.log(`      ${analysis.hasLazyLoading ? '✓' : '✗'} Lazy Loading implementado`);
      console.log(`      ${analysis.hasImageOptimization ? '✓' : '✗'} Optimización de imágenes`);
      console.log(`      ${analysis.inlineStyles < 5 ? '✓' : '✗'} Estilos inline mínimos (${analysis.inlineStyles})`);
      
      console.log(`   \n   ⚠️  Librerías pesadas:`);
      Object.entries(analysis.usesHeavyLibraries).forEach(([lib, uses]) => {
        if (uses) {
          console.log(`      ❌ Usa ${lib} (considerar alternativas ligeras)`);
        }
      });
      
      // Recomendaciones
      console.log(`   \n   💡 Recomendaciones:`);
      if (!analysis.hasLazyLoading) {
        console.log(`      - Implementar lazy loading de componentes pesados`);
      }
      if (!analysis.hasImageOptimization) {
        console.log(`      - Optimizar carga de imágenes con lazy loading`);
      }
      if (analysis.stateManagement.useEffect > 5) {
        console.log(`      - Revisar ${analysis.stateManagement.useEffect} useEffect, posible sobre-renderizado`);
      }
      if (analysis.inlineStyles > 10) {
        console.log(`      - Reducir estilos inline (${analysis.inlineStyles} encontrados)`);
      }
      if (analysis.apiCalls > 3) {
        console.log(`      - Optimizar ${analysis.apiCalls} llamadas API (usar cache, batch requests)`);
      }
    } else {
      console.log(`   ❌ Error al analizar archivo`);
    }
    
    console.log('\n');
  });

  // 2. Análisis de componentes comunes
  console.log('\n🧩 ANÁLISIS DE COMPONENTES COMUNES\n');
  
  COMPONENTS_TO_ANALYZE.forEach((componentPath, index) => {
    const fileName = path.basename(componentPath);
    const analysis = analyzeFileContent(componentPath);
    const size = getFileSize(componentPath);
    
    console.log(`${index + 1}. ${fileName}`);
    
    if (analysis) {
      console.log(`   Tamaño: ${formatBytes(size)} | Líneas: ${analysis.lines}`);
      
      // Identificar componentes pesados
      if (size > 10000) {
        console.log(`   ⚠️  Componente grande - considerar dividir`);
      }
      if (analysis.stateManagement.useState > 5) {
        console.log(`   ⚠️  Muchos estados (${analysis.stateManagement.useState}) - posible sobre-complejidad`);
      }
    }
  });

  // 3. Análisis de bundle size
  console.log('\n\n📦 ANÁLISIS DE BUNDLE SIZE\n');
  
  const bundleAnalysis = analyzeBundleSize();
  
  if (bundleAnalysis.error) {
    console.log(`   ❌ ${bundleAnalysis.error}`);
  } else {
    console.log(`   JavaScript:`);
    console.log(`   - Total: ${formatBytes(bundleAnalysis.js.total)}`);
    console.log(`   - Archivos: ${bundleAnalysis.js.count}`);
    console.log(`   - Top 5 más pesados:`);
    
    bundleAnalysis.js.files.slice(0, 5).forEach((file, i) => {
      console.log(`     ${i + 1}. ${file.name} - ${formatBytes(file.size)}`);
    });
    
    console.log(`\n   CSS:`);
    console.log(`   - Total: ${formatBytes(bundleAnalysis.css.total)}`);
    console.log(`   - Archivos: ${bundleAnalysis.css.count}`);
    
    // Análisis de problemas
    console.log(`\n   ⚠️  Análisis de problemas:`);
    
    const largeJsFiles = bundleAnalysis.js.files.filter(f => f.size > 200000);
    if (largeJsFiles.length > 0) {
      console.log(`   - ${largeJsFiles.length} archivos JS > 200KB (considerar code splitting)`);
    }
    
    const vendorFiles = bundleAnalysis.js.files.filter(f => f.name.includes('vendor'));
    if (vendorFiles.length > 0 && vendorFiles[0].size > 500000) {
      console.log(`   - Vendor bundle muy grande (${formatBytes(vendorFiles[0].size)}) - revisar dependencias`);
    }
  }

  // 4. Resumen de optimizaciones recomendadas
  console.log('\n\n🎯 RESUMEN DE OPTIMIZACIONES PRIORITARIAS\n');
  console.log('   Alta Prioridad:');
  console.log('   1. ⚡ Implementar code splitting en rutas');
  console.log('   2. 🖼️  Optimizar imágenes (WebP, lazy loading, placeholders)');
  console.log('   3. 💾 Configurar cache HTTP con service worker');
  console.log('   4. 📦 Reducir bundle size (tree shaking, eliminar librerías innecesarias)');
  console.log('   \n   Media Prioridad:');
  console.log('   5. 🔄 Optimizar re-renders (React.memo, useMemo, useCallback)');
  console.log('   6. 🎨 Minimizar CSS crítico y diferir no-crítico');
  console.log('   7. 📊 Implementar virtual scrolling para listas largas');
  console.log('   \n   Baja Prioridad:');
  console.log('   8. 🔍 Preconnect a dominios externos');
  console.log('   9. 📱 Optimizar para dispositivos móviles');
  console.log('   10. 🌐 Considerar SSR/SSG para mejor SEO y performance');
  
  console.log('\n=====================================\n');
}

// ============================================
// EJECUCIÓN
// ============================================

try {
  analyzePerformance();
} catch (error) {
  console.error('❌ Error durante el análisis:', error.message);
  process.exit(1);
}
