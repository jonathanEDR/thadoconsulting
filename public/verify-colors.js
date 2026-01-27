/**
 * Script de Verificación de Colores por Tema
 * 
 * Copia y pega este código en la consola del navegador (F12)
 * cuando estés viendo la página pública para verificar que
 * los colores se estén aplicando correctamente.
 */

(function verifyColorSystem() {
  console.log('🎨 ═══════════════════════════════════════════════════════');
  console.log('🎨 VERIFICACIÓN DEL SISTEMA DE COLORES POR TEMA');
  console.log('🎨 ═══════════════════════════════════════════════════════');
  
  // 1. Verificar tema activo
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
  console.log('');
  console.log('📌 TEMA ACTIVO:', currentTheme);
  console.log('   HTML class:', htmlElement.className);
  
  // 2. Buscar tarjetas de Valor Agregado
  const cards = document.querySelectorAll('.value-card');
  console.log('');
  console.log('📦 TARJETAS ENCONTRADAS:', cards.length);
  
  if (cards.length === 0) {
    console.warn('⚠️ No se encontraron tarjetas de Valor Agregado');
    console.log('   Asegúrate de estar en la sección de Valor Agregado');
    return;
  }
  
  // 3. Analizar primera tarjeta
  const firstCard = cards[0];
  console.log('');
  console.log('🔍 ANÁLISIS DE LA PRIMERA TARJETA:');
  console.log('───────────────────────────────────────');
  
  // 3.1 Fondo de la tarjeta
  const cardBackground = window.getComputedStyle(firstCard).background;
  console.log('');
  console.log('🎨 FONDO DE TARJETA:');
  console.log('   ', cardBackground);
  
  // 3.2 Título
  const title = firstCard.querySelector('h3');
  if (title) {
    const titleColor = window.getComputedStyle(title).color;
    console.log('');
    console.log('📝 TÍTULO:');
    console.log('   Color:', titleColor);
    console.log('   Texto:', title.textContent?.slice(0, 30) + '...');
    console.log('   Legible:', isColorReadable(titleColor, cardBackground));
  } else {
    console.warn('   ⚠️ No se encontró elemento h3 (título)');
  }
  
  // 3.3 Descripción
  const description = firstCard.querySelector('p');
  if (description) {
    const descColor = window.getComputedStyle(description).color;
    console.log('');
    console.log('📄 DESCRIPCIÓN:');
    console.log('   Color:', descColor);
    console.log('   Texto:', description.textContent?.slice(0, 30) + '...');
    console.log('   Legible:', isColorReadable(descColor, cardBackground));
  } else {
    console.warn('   ⚠️ No se encontró elemento p (descripción)');
  }
  
  // 3.4 Icono
  const icon = firstCard.querySelector('img');
  if (icon) {
    console.log('');
    console.log('🖼️ ICONO:');
    console.log('   Fuente:', icon.src);
    console.log('   Visible:', icon.offsetHeight > 0);
  } else {
    console.log('');
    console.log('🖼️ ICONO: No visible o no configurado');
  }
  
  // 4. Verificar todas las tarjetas
  console.log('');
  console.log('📊 RESUMEN DE TODAS LAS TARJETAS:');
  console.log('───────────────────────────────────────');
  
  cards.forEach((card, index) => {
    const cardTitle = card.querySelector('h3');
    const cardDesc = card.querySelector('p');
    const cardBg = window.getComputedStyle(card).background;
    
    console.log(`');
    console.log(Tarjeta ${index + 1}:`);
    if (cardTitle) {
      const titleColor = window.getComputedStyle(cardTitle).color;
      console.log(`   Título: ${titleColor}`);
    }
    if (cardDesc) {
      const descColor = window.getComputedStyle(cardDesc).color;
      console.log(`   Descripción: ${descColor}`);
    }
  });
  
  // 5. Verificar estilos inline
  console.log('');
  console.log('🔧 ESTILOS INLINE (configurados por CMS):');
  console.log('───────────────────────────────────────');
  
  if (title) {
    console.log('');
    console.log('Título style attribute:');
    console.log('   ', title.getAttribute('style'));
  }
  
  if (description) {
    console.log('');
    console.log('Descripción style attribute:');
    console.log('   ', description.getAttribute('style'));
  }
  
  // 6. Sugerencias
  console.log('');
  console.log('💡 SUGERENCIAS:');
  console.log('───────────────────────────────────────');
  console.log('1. Cambia el tema con el botón en el header');
  console.log('2. Observa si los colores cambian correctamente');
  console.log('3. Verifica el contraste en ambos temas');
  console.log('4. Si ves "rgb(0, 0, 0)" en algún color, revisa el CMS');
  console.log('');
  console.log('🔄 Para ejecutar de nuevo: verifyColorSystem()');
  console.log('🎨 ═══════════════════════════════════════════════════════');
  
  // Función helper para verificar legibilidad
  function isColorReadable(foreground, background) {
    // Esta es una implementación simple
    // En producción usarías una librería de contraste WCAG
    
    const fg = extractRGB(foreground);
    const bg = extractRGB(background);
    
    if (!fg || !bg) return '❓ No se pudo determinar';
    
    const contrast = getContrast(fg, bg);
    
    if (contrast > 7) return '✅ Excelente (AAA)';
    if (contrast > 4.5) return '✓ Bueno (AA)';
    if (contrast > 3) return '⚠️ Aceptable';
    return '❌ Bajo contraste';
  }
  
  function extractRGB(color) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    return null;
  }
  
  function getContrast(fg, bg) {
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  function getLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
})();

// Hacer la función global para que pueda ejecutarse fácilmente
window.verifyColorSystem = function() {
  console.clear();
  // Re-ejecutar el script
  eval(document.querySelector('script[data-verify-colors]')?.textContent || '');
};

console.log('✅ Script de verificación cargado');
console.log('💡 Ejecuta verifyColorSystem() para verificar los colores');
