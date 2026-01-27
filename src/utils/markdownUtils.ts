/**
 * Utilidades para renderizar Markdown en el chat de SCUTI AI
 * Convierte sintaxis Markdown básica a HTML estilizado
 */

/**
 * Convierte Markdown básico a HTML para mostrar en el chat
 * Soporta: **negrita**, *cursiva*, `código`, listas, headers, tablas, emojis
 */
export function renderChatMarkdown(content: string): string {
  if (!content) return '';
  
  // Si ya tiene HTML, limpiar tags peligrosos
  if (content.includes('<script') || content.includes('<style')) {
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  }

  let html = content;

  // === PROCESAR POR LÍNEAS PARA MEJOR CONTROL ===
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detectar inicio/fin de tabla (líneas con |)
    if (line.includes('|') && line.trim().startsWith('|')) {
      // Es una línea de tabla
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      
      // Ignorar línea separadora de headers (|---|---|)
      if (!/^\|[\s\-:|]+\|$/.test(line.trim())) {
        tableRows.push(line);
      }
      continue;
    } else if (inTable) {
      // Fin de tabla, procesar
      if (tableRows.length > 0) {
        processedLines.push(renderTable(tableRows));
      }
      inTable = false;
      tableRows = [];
    }

    // Headers ## o ###
    if (line.startsWith('### ')) {
      const text = line.substring(4);
      processedLines.push(`<h4 class="text-base font-semibold text-gray-900 dark:text-white mt-3 mb-1">${processInlineMarkdown(text)}</h4>`);
      continue;
    }
    if (line.startsWith('## ')) {
      const text = line.substring(3);
      processedLines.push(`<h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2">${processInlineMarkdown(text)}</h3>`);
      continue;
    }

    // Listas con • o - o *
    if (/^[\s]*[•\-\*]\s/.test(line)) {
      const text = line.replace(/^[\s]*[•\-\*]\s/, '');
      processedLines.push(`<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">${processInlineMarkdown(text)}</li>`);
      continue;
    }

    // Separador ---
    if (/^[\-]{3,}$/.test(line.trim())) {
      processedLines.push('<hr class="my-3 border-gray-300 dark:border-gray-600"/>');
      continue;
    }

    // Línea normal
    processedLines.push(processInlineMarkdown(line));
  }

  // Si quedó una tabla abierta
  if (inTable && tableRows.length > 0) {
    processedLines.push(renderTable(tableRows));
  }

  html = processedLines.join('<br/>');

  // Limpiar <br/> múltiples
  html = html.replace(/(<br\/>){3,}/g, '<br/><br/>');

  return html;
}

/**
 * Renderiza una tabla Markdown a HTML
 */
function renderTable(rows: string[]): string {
  if (rows.length === 0) return '';

  const headerRow = rows[0];
  const dataRows = rows.slice(1);

  const parseRow = (row: string): string[] => {
    return row
      .split('|')
      .filter((_cell, idx, arr) => idx > 0 && idx < arr.length - 1)
      .map(cell => cell.trim());
  };

  const headers = parseRow(headerRow);
  
  let tableHtml = '<div class="overflow-x-auto my-2"><table class="min-w-full text-sm border-collapse">';
  
  // Header
  tableHtml += '<thead><tr class="bg-gray-100 dark:bg-gray-700">';
  headers.forEach(h => {
    tableHtml += `<th class="px-2 py-1 text-left font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600">${processInlineMarkdown(h)}</th>`;
  });
  tableHtml += '</tr></thead>';

  // Body
  tableHtml += '<tbody>';
  dataRows.forEach((row, idx) => {
    const cells = parseRow(row);
    const bgClass = idx % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-800';
    tableHtml += `<tr class="${bgClass}">`;
    cells.forEach(cell => {
      tableHtml += `<td class="px-2 py-1 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">${processInlineMarkdown(cell)}</td>`;
    });
    tableHtml += '</tr>';
  });
  tableHtml += '</tbody></table></div>';

  return tableHtml;
}

/**
 * Procesa formatos inline de Markdown (negrita, cursiva, código, links)
 */
function processInlineMarkdown(text: string): string {
  return text
    // Negrita con ** o __
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="font-semibold">$1</strong>')
    // Cursiva con * o _ (evitar conflicto con listas)
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>')
    // Código inline con `
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    // Links [texto](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline">$1</a>');
}

/**
 * Verifica si el contenido tiene formato Markdown
 */
export function hasMarkdownFormatting(content: string): boolean {
  if (!content) return false;
  
  // Patrones de Markdown
  const patterns = [
    /\*\*.+?\*\*/,     // **negrita**
    /__.+?__/,         // __negrita__
    /\*.+?\*/,         // *cursiva*
    /_.+?_/,           // _cursiva_
    /`.+?`/,           // `código`
    /\[.+?\]\(.+?\)/,  // [link](url)
    /^#{1,6}\s/m,      // # headers
    /^[-*]\s/m,        // - listas
    /^\d+\.\s/m        // 1. listas numeradas
  ];
  
  return patterns.some(pattern => pattern.test(content));
}

/**
 * Limpia caracteres de control y normaliza el texto
 */
export function sanitizeChatText(content: string): string {
  if (!content) return '';
  
  return content
    // Normalizar espacios múltiples
    .replace(/  +/g, ' ')
    // Remover caracteres de control excepto newlines
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Asegurar encoding UTF-8 correcto
    .normalize('NFC');
}
