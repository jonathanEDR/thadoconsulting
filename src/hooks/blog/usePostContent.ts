/**
 * 🎯 usePostContent Hook
 * Procesa el contenido HTML del post, agrega IDs a encabezados, extrae TOC
 * y aplica estilos premium a bloques especiales
 */

import { useMemo } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface ProcessedContent {
  html: string;
  tocItems: TOCItem[];
}

// Patrones para detectar contenido especial (usados en applyPremiumStyles)

/**
 * Procesa el HTML para aplicar estilos premium a bloques especiales
 */
function applyPremiumStyles(html: string): string {
  let processedHtml = html;
  
  // 1. Mejorar blockquotes existentes
  processedHtml = processedHtml.replace(
    /<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi,
    '<blockquote$1 class="blog-quote-premium">$2</blockquote>'
  );
  
  // 2. Detectar y estilizar datos de pérdidas en párrafos
  // Envolver cantidades de dinero con pérdida en span especial
  processedHtml = processedHtml.replace(
    /(?:pierdes?|pérdida|perdido|cost[oa])\s*(S\/\.?\s*[\d,\.]+(?:\/mes)?|US?\$\s*[\d,\.]+(?:\/mes)?|\$\s*[\d,\.]+(?:\/mes)?)/gi,
    (match, amount) => {
      const prefix = match.replace(amount, '').trim();
      return `${prefix} <span class="blog-money-loss">${amount}</span>`;
    }
  );
  
  // 3. Detectar y estilizar datos de ganancias/ahorros
  processedHtml = processedHtml.replace(
    /(?:ahorr[oa]s?|ganar?|beneficio)\s*(S\/\.?\s*[\d,\.]+(?:\/mes)?|US?\$\s*[\d,\.]+(?:\/mes)?|\$\s*[\d,\.]+(?:\/mes)?)/gi,
    (match, amount) => {
      const prefix = match.replace(amount, '').trim();
      return `${prefix} <span class="blog-money-gain">${amount}</span>`;
    }
  );
  
  // 4. Mejorar tablas para estilo premium (zebra stripes se manejan en CSS)
  processedHtml = processedHtml.replace(
    /<table([^>]*)>/gi,
    '<table$1 class="blog-table-premium">'
  );
  
  return processedHtml;
}

export function usePostContent(content: string, maxLevel: number = 3): ProcessedContent {
  return useMemo(() => {
    if (!content) {
      return { html: '', tocItems: [] };
    }

    // Crear un documento temporal para manipular el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const tocItems: TOCItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level <= maxLevel) {
        const text = heading.textContent?.trim() || '';
        
        // Generar ID basado en el texto del encabezado
        const id = heading.id || text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
          .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
          .replace(/\s+/g, '-') // Reemplazar espacios con guiones
          .substring(0, 50) // Limitar longitud
          + `-${index}`; // Añadir índice para garantizar unicidad
        
        // Agregar ID al elemento heading
        heading.id = id;
        
        // Agregar clase para scroll offset (para header sticky)
        heading.classList.add('scroll-mt-24');
        
        tocItems.push({
          id,
          text,
          level
        });
      }
    });
    
    // Serializar el documento de vuelta a HTML
    let processedHtml = doc.body.innerHTML;
    
    // Aplicar estilos premium a bloques especiales
    processedHtml = applyPremiumStyles(processedHtml);
    
    return {
      html: processedHtml,
      tocItems
    };
  }, [content, maxLevel]);
}
