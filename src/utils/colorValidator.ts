/**
 * 🎨 Validador de Contraste de Colores
 * 
 * Previene configuraciones inválidas que causan texto invisible
 * Calcula contraste según WCAG 2.1 y auto-corrige valores problemáticos
 */

interface ColorValidationResult {
  isValid: boolean;
  contrast: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  warning?: string;
  suggestion?: string;
}

interface AutoCorrectionResult {
  wasCorrected: boolean;
  original: any;
  corrected: any;
  changes: string[];
}

/**
 * Convierte color a RGB
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // 🔧 Manejo especial para transparent
  if (color === 'transparent') {
    return { r: 255, g: 255, b: 255 }; // Asumir fondo blanco para transparent
  }
  
  // Hex format (#RRGGBB)
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    if (hex.length === 6) {
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    }
  }
  
  // RGBA format - mejorado para capturar decimales
  const rgbaMatch = color.match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*[\d.]+)?\)/);
  if (rgbaMatch) {
    return {
      r: Math.round(parseFloat(rgbaMatch[1])),
      g: Math.round(parseFloat(rgbaMatch[2])),
      b: Math.round(parseFloat(rgbaMatch[3]))
    };
  }
  
  // 🔧 Fallback para colores CSS comunes
  const colorMap: { [key: string]: { r: number; g: number; b: number } } = {
    'white': { r: 255, g: 255, b: 255 },
    'black': { r: 0, g: 0, b: 0 },
    'transparent': { r: 255, g: 255, b: 255 }
  };
  
  return colorMap[color.toLowerCase()] || null;
}

/**
 * Calcula luminancia relativa según WCAG
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula ratio de contraste entre dos colores
 */
export function getContrastRatio(color1: string, color2: string): number {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);
  
  if (!c1 || !c2) return 0;
  
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Valida contraste entre texto y fondo
 */
export function validateContrast(
  textColor: string, 
  backgroundColor: string,
  minRatio: number = 4.5 // WCAG AA para texto normal
): ColorValidationResult {
  const ratio = getContrastRatio(textColor, backgroundColor);
  
  let level: 'AAA' | 'AA' | 'A' | 'FAIL';
  if (ratio >= 7) level = 'AAA';
  else if (ratio >= 4.5) level = 'AA';
  else if (ratio >= 3) level = 'A';
  else level = 'FAIL';
  
  const isValid = ratio >= minRatio;
  
  let warning: string | undefined;
  let suggestion: string | undefined;
  
  if (!isValid) {
    warning = `⚠️ Contraste insuficiente: ${ratio.toFixed(2)}:1 (mínimo recomendado: ${minRatio}:1)`;
    
    // Detectar problema específico
    const bgRgb = parseColor(backgroundColor);
    const textRgb = parseColor(textColor);
    
    if (bgRgb && textRgb) {
      const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
      const textLuminance = getLuminance(textRgb.r, textRgb.g, textRgb.b);
      
      if (bgLuminance > 0.5 && textLuminance > 0.5) {
        suggestion = '💡 Fondo claro detectado - usa colores de texto más oscuros (#1F2937, #4B5563)';
      } else if (bgLuminance < 0.5 && textLuminance < 0.5) {
        suggestion = '💡 Fondo oscuro detectado - usa colores de texto más claros (#FFFFFF, #D1D5DB)';
      }
    }
  }
  
  return { isValid, contrast: ratio, level, warning, suggestion };
}

/**
 * 🔧 AUTO-CORRECCIÓN: Detecta y corrige configuraciones inválidas
 */
export function autoCorrectCardStyles(styles: any, theme: 'light' | 'dark'): AutoCorrectionResult {
  const original = { ...styles };
  const corrected = { ...styles };
  const changes: string[] = [];
  
  // ✅ Reglas de auto-corrección
  const rules = {
    light: {
      // ☀️ TEMA CLARO: Si fondo es claro, texto debe ser oscuro
      backgroundPattern: /rgba?\(2[0-5]{2},\s*2[0-5]{2},\s*2[0-5]{2}/i, // RGB > 200
      safeTextColors: {
        titleColor: '#1F2937',      // Gris muy oscuro
        descriptionColor: '#4B5563', // Gris oscuro
        linkColor: '#06B6D4'         // Cyan
      }
    },
    dark: {
      // 🌙 TEMA OSCURO: Si fondo es oscuro, texto debe ser claro
      backgroundPattern: /rgba?\(([0-9]|[1-9][0-9]|1[0-4][0-9]|150)/i, // RGB < 150
      safeTextColors: {
        titleColor: '#FFFFFF',       // Blanco
        descriptionColor: '#D1D5DB', // Gris muy claro
        linkColor: '#a78bfa'         // Púrpura claro
      }
    }
  };
  
  const rule = rules[theme];
  const background = styles.background || '';
  
  // Detectar si hay problema de contraste
  const titleContrast = validateContrast(styles.titleColor || '#FFFFFF', background);
  const descContrast = validateContrast(styles.descriptionColor || '#FFFFFF', background);
  
  // 🚨 Si el contraste es malo, aplicar corrección
  if (titleContrast.contrast < 3 || descContrast.contrast < 3) {
    changes.push(`⚠️ Contraste insuficiente detectado en tema ${theme}`);
    
    // Auto-corregir colores de texto
    if (titleContrast.contrast < 3) {
      corrected.titleColor = rule.safeTextColors.titleColor;
      changes.push(`✅ titleColor corregido: ${styles.titleColor} → ${corrected.titleColor}`);
    }
    
    if (descContrast.contrast < 3) {
      corrected.descriptionColor = rule.safeTextColors.descriptionColor;
      changes.push(`✅ descriptionColor corregido: ${styles.descriptionColor} → ${corrected.descriptionColor}`);
    }
    
    // Corregir linkColor si es necesario
    const linkContrast = validateContrast(styles.linkColor || '#FFFFFF', background);
    if (linkContrast.contrast < 3) {
      corrected.linkColor = rule.safeTextColors.linkColor;
      changes.push(`✅ linkColor corregido: ${styles.linkColor} → ${corrected.linkColor}`);
    }
  }
  
  // 🔍 Verificar que el background es correcto para el tema
  if (theme === 'dark') {
    // Tema oscuro debe tener fondo oscuro
    if (background.includes('255, 255, 255') || background === 'transparent' || !background) {
      corrected.background = 'rgba(17, 24, 39, 0.9)';
      changes.push(`✅ background corregido: ${background} → rgba(17, 24, 39, 0.9) (tema oscuro)`);
    }
  } else if (theme === 'light') {
    // Tema claro debe tener fondo claro
    if (background.includes('17, 24, 39') || background.includes('0, 0, 0') || background === 'transparent' || !background) {
      corrected.background = 'rgba(255, 255, 255, 0.9)';
      changes.push(`✅ background corregido: ${background} → rgba(255, 255, 255, 0.9) (tema claro)`);
    }
  }
  
  return {
    wasCorrected: changes.length > 0,
    original,
    corrected,
    changes
  };
}

/**
 * 📊 Genera reporte de contraste para debugging
 */
export function generateContrastReport(styles: any, theme: string): string {
  const bg = styles.background || 'rgba(255, 255, 255, 0.9)';
  
  const titleResult = validateContrast(styles.titleColor, bg);
  const descResult = validateContrast(styles.descriptionColor, bg);
  const linkResult = validateContrast(styles.linkColor, bg);
  
  return `
🎨 Reporte de Contraste - Tema ${theme.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Background: ${bg}

📝 Título (${styles.titleColor}):
   Contraste: ${titleResult.contrast.toFixed(2)}:1
   Nivel: ${titleResult.level}
   Estado: ${titleResult.isValid ? '✅ OK' : '❌ FALLA'}
   ${titleResult.warning || ''}
   ${titleResult.suggestion || ''}

📄 Descripción (${styles.descriptionColor}):
   Contraste: ${descResult.contrast.toFixed(2)}:1
   Nivel: ${descResult.level}
   Estado: ${descResult.isValid ? '✅ OK' : '❌ FALLA'}
   ${descResult.warning || ''}

🔗 Link (${styles.linkColor}):
   Contraste: ${linkResult.contrast.toFixed(2)}:1
   Nivel: ${linkResult.level}
   Estado: ${linkResult.isValid ? '✅ OK' : '❌ FALLA'}
`;
}

export default {
  validateContrast,
  autoCorrectCardStyles,
  getContrastRatio,
  generateContrastReport
};
