#!/usr/bin/env node

/**
 * 🔍 Script de Validación de Patrones de Implementación
 * 
 * Verifica que todas las páginas públicas sigan los patrones consistentes
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../src/pages/public');
const ISSUES = [];

function checkFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`\n🔍 Analizando: ${fileName}`);
  
  // 1. Contar SeoHelmet usages
  const seoHelmetMatches = content.match(/<SeoHelmet\s*\/>/g) || [];
  if (seoHelmetMatches.length > 1) {
    ISSUES.push(`❌ ${fileName}: Tiene ${seoHelmetMatches.length} <SeoHelmet />. Debe ser solo 1.`);
    console.log(`   ⚠️  Múltiples SeoHelmet: ${seoHelmetMatches.length}`);
  } else if (seoHelmetMatches.length === 1) {
    console.log(`   ✅ SeoHelmet correcto: 1`);
  }
  
  // 2. Verificar useSeo
  if (!content.includes('useSeo')) {
    ISSUES.push(`⚠️  ${fileName}: No usa useSeo hook`);
    console.log(`   ⚠️  No usa useSeo`);
  } else {
    console.log(`   ✅ Usa useSeo`);
  }
  
  // 3. Buscar console.log/error sin condiciones
  const consoleMatches = content.match(/console\.(log|error|warn)\(/g) || [];
  const debugConsoleMatches = consoleMatches.filter((_, i) => {
    const line = lines[lines.findIndex(l => l.includes('console'))];
    return !line?.includes('import.meta.env.DEV');
  });
  
  if (debugConsoleMatches.length > 0) {
    console.log(`   ⚠️  Tiene ${debugConsoleMatches.length} console calls sin DEBUG check`);
  } else {
    console.log(`   ✅ Logs correctos o silenciados`);
  }
  
  // 4. Verificar try-catch en useEffect
  const hasUseEffect = content.includes('useEffect');
  if (hasUseEffect && !content.includes('try')) {
    console.log(`   ⚠️  useEffect sin try-catch`);
  } else {
    console.log(`   ✅ Manejo de errores presente`);
  }
}

// Ejecutar análisis
if (fs.existsSync(PAGES_DIR)) {
  const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.tsx'));
  
  console.log('=' .repeat(60));
  console.log('🔍 VALIDADOR DE PATRONES DE IMPLEMENTACIÓN');
  console.log('=' .repeat(60));
  console.log(`\nEncontrados ${files.length} componentes públicos\n`);
  
  files.forEach(file => {
    checkFile(path.join(PAGES_DIR, file), file);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN');
  console.log('='.repeat(60));
  
  if (ISSUES.length === 0) {
    console.log('\n✅ ¡Todos los componentes siguen los patrones correctamente!\n');
  } else {
    console.log(`\n⚠️  Se encontraron ${ISSUES.length} problemas:\n`);
    ISSUES.forEach(issue => console.log(`  ${issue}`));
    console.log('');
  }
} else {
  console.error(`❌ Directorio no encontrado: ${PAGES_DIR}`);
  process.exit(1);
}
