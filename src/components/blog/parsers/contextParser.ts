/**
 * 🧠 Context Parser
 * Sistema avanzado para detectar y procesar patrones #...# 
 * que permiten sugerencias ultra-específicas en el editor
 */

// Tipos de contexto soportados
export const ContextType = {
  EXPAND: 'expand',           // #expandir#, #desarrollar#
  SUMMARIZE: 'summarize',     // #resumir#, #sintetizar#
  REWRITE: 'rewrite',         // #reescribir#, #mejorar#
  CONTINUE: 'continue',       // #continuar#, #seguir#
  EXAMPLES: 'examples',       // #ejemplos#, #ejemplificar#
  SEO: 'seo',                 // #seo#, #optimizar#
  TONE: 'tone',               // #tono profesional#, #tono casual#
  FORMAT: 'format',           // #formato lista#, #formato tabla#
  DATA: 'data',               // #agregar datos#, #estadísticas#
  TECHNICAL: 'technical',     // #técnico#, #detalles técnicos#
  CREATIVE: 'creative',       // #creativo#, #innovador#
  CUSTOM: 'custom'            // Cualquier otro contexto
} as const;

export type ContextType = typeof ContextType[keyof typeof ContextType];

// Patrón detectado en el texto
export interface ContextPattern {
  type: ContextType;
  fullMatch: string;           // El texto completo: #expandir con ejemplos#
  contextText: string;         // Texto dentro de #: "expandir con ejemplos"
  instructions: string[];      // Instrucciones parseadas: ["expandir", "con ejemplos"]
  position: {
    start: number;
    end: number;
  };
  modifiers?: {
    tone?: string;             // profesional, casual, técnico, etc.
    format?: string;           // lista, tabla, párrafo, etc.
    length?: string;           // corto, medio, largo
    style?: string;            // formal, informal, académico, etc.
  };
}

// Resultado del parsing
export interface ParseResult {
  hasContext: boolean;
  patterns: ContextPattern[];
  cleanText: string;           // Texto sin los patrones #...#
  surroundingText: {
    before: string;
    after: string;
  };
}

class ContextParser {
  // Regex principal para detectar patrones #...#
  private readonly CONTEXT_REGEX = /#([^#]+)#/g;
  
  // Palabras clave por tipo de contexto
  private readonly KEYWORDS = {
    [ContextType.EXPAND]: ['expandir', 'desarrollar', 'ampliar', 'profundizar', 'elaborar'],
    [ContextType.SUMMARIZE]: ['resumir', 'sintetizar', 'condensar', 'abreviar'],
    [ContextType.REWRITE]: ['reescribir', 'mejorar', 'reformular', 'optimizar', 'refinar'],
    [ContextType.CONTINUE]: ['continuar', 'seguir', 'proseguir', 'completar'],
    [ContextType.EXAMPLES]: ['ejemplos', 'ejemplificar', 'casos', 'ilustrar'],
    [ContextType.SEO]: ['seo', 'posicionar', 'keywords', 'palabras clave'],
    [ContextType.TONE]: ['tono', 'estilo', 'voz'],
    [ContextType.FORMAT]: ['formato', 'estructura', 'organizar'],
    [ContextType.DATA]: ['datos', 'estadísticas', 'números', 'cifras', 'métricas'],
    [ContextType.TECHNICAL]: ['técnico', 'detalles', 'específico', 'avanzado'],
    [ContextType.CREATIVE]: ['creativo', 'innovador', 'original', 'único']
  };

  // Modificadores comunes
  private readonly MODIFIERS = {
    tone: ['profesional', 'casual', 'formal', 'informal', 'técnico', 'amigable', 'académico', 'conversacional'],
    format: ['lista', 'tabla', 'párrafo', 'puntos', 'numerado', 'viñetas'],
    length: ['corto', 'medio', 'largo', 'breve', 'extenso', 'detallado'],
    style: ['formal', 'informal', 'técnico', 'simple', 'complejo', 'directo']
  };

  /**
   * Parsear texto completo y detectar todos los patrones #...#
   */
  parse(text: string, cursorPosition?: number): ParseResult {
    const patterns: ContextPattern[] = [];
    let match: RegExpExecArray | null;
    
    // Resetear regex
    this.CONTEXT_REGEX.lastIndex = 0;

    // Buscar todos los patrones
    while ((match = this.CONTEXT_REGEX.exec(text)) !== null) {
      const fullMatch = match[0];
      const contextText = match[1].trim();
      const position = {
        start: match.index,
        end: match.index + fullMatch.length
      };

      // Si hay cursor, solo procesar patrones cerca del cursor
      if (cursorPosition !== undefined) {
        const distanceToCursor = Math.abs(cursorPosition - position.start);
        if (distanceToCursor > 100) continue; // Solo patrones dentro de 100 caracteres
      }

      const pattern = this.analyzePattern(fullMatch, contextText, position);
      patterns.push(pattern);
    }

    // Limpiar texto (remover patrones)
    const cleanText = text.replace(this.CONTEXT_REGEX, '').trim();

    // Obtener texto circundante
    const surroundingText = this.getSurroundingText(text, cursorPosition);

    return {
      hasContext: patterns.length > 0,
      patterns,
      cleanText,
      surroundingText
    };
  }

  /**
   * Analizar un patrón individual y extraer tipo + modificadores
   */
  private analyzePattern(
    fullMatch: string, 
    contextText: string, 
    position: { start: number; end: number }
  ): ContextPattern {
    const lowerContext = contextText.toLowerCase();
    const instructions = contextText.split(/\s+/).filter(Boolean);

    // Detectar tipo de contexto
    const type = this.detectContextType(lowerContext);

    // Extraer modificadores
    const modifiers = this.extractModifiers(lowerContext);

    return {
      type,
      fullMatch,
      contextText,
      instructions,
      position,
      modifiers
    };
  }

  /**
   * Detectar el tipo de contexto basado en palabras clave
   */
  private detectContextType(text: string): ContextType {
    for (const [type, keywords] of Object.entries(this.KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return type as ContextType;
      }
    }
    return ContextType.CUSTOM;
  }

  /**
   * Extraer modificadores (tono, formato, longitud, estilo)
   */
  private extractModifiers(text: string): ContextPattern['modifiers'] {
    const modifiers: ContextPattern['modifiers'] = {};

    // Buscar cada tipo de modificador
    for (const [modType, values] of Object.entries(this.MODIFIERS)) {
      for (const value of values) {
        if (text.includes(value)) {
          modifiers[modType as keyof typeof modifiers] = value;
          break;
        }
      }
    }

    return Object.keys(modifiers).length > 0 ? modifiers : undefined;
  }

  /**
   * Obtener texto antes y después del cursor/patrón
   */
  private getSurroundingText(text: string, position?: number): { before: string; after: string } {
    if (position === undefined) {
      return {
        before: '',
        after: ''
      };
    }

    const contextLength = 200; // Caracteres de contexto
    const before = text.substring(Math.max(0, position - contextLength), position);
    const after = text.substring(position, Math.min(text.length, position + contextLength));

    return { before, after };
  }

  /**
   * Validar si un texto contiene patrones válidos
   */
  hasValidPattern(text: string): boolean {
    this.CONTEXT_REGEX.lastIndex = 0;
    return this.CONTEXT_REGEX.test(text);
  }

  /**
   * Obtener patrón más cercano al cursor
   */
  getPatternAtCursor(text: string, cursorPosition: number): ContextPattern | null {
    const result = this.parse(text, cursorPosition);
    
    if (!result.hasContext) return null;

    // Encontrar el patrón más cercano al cursor
    let closestPattern: ContextPattern | null = null;
    let minDistance = Infinity;

    for (const pattern of result.patterns) {
      const distance = Math.min(
        Math.abs(cursorPosition - pattern.position.start),
        Math.abs(cursorPosition - pattern.position.end)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestPattern = pattern;
      }
    }

    return closestPattern;
  }

  /**
   * Construir prompt optimizado basado en el patrón detectado
   */
  buildPromptFromPattern(pattern: ContextPattern, context: string): string {
    let prompt = `CONTEXTO PREVIO:\n${context}\n\n`;
    
    prompt += `INSTRUCCIONES DEL USUARIO: ${pattern.contextText}\n\n`;
    
    // Agregar detalles del tipo
    switch (pattern.type) {
      case ContextType.EXPAND:
        prompt += 'TAREA: Expandir y desarrollar el contenido previo con más detalles.\n';
        break;
      case ContextType.SUMMARIZE:
        prompt += 'TAREA: Resumir el contenido previo de forma concisa.\n';
        break;
      case ContextType.REWRITE:
        prompt += 'TAREA: Reescribir el contenido previo mejorando la redacción.\n';
        break;
      case ContextType.CONTINUE:
        prompt += 'TAREA: Continuar el contenido de forma natural y coherente.\n';
        break;
      case ContextType.EXAMPLES:
        prompt += 'TAREA: Agregar ejemplos prácticos y relevantes.\n';
        break;
      case ContextType.SEO:
        prompt += 'TAREA: Optimizar para SEO manteniendo la legibilidad.\n';
        break;
      default:
        prompt += `TAREA: ${pattern.contextText}\n`;
    }

    // Agregar modificadores si existen
    if (pattern.modifiers) {
      prompt += '\nMODIFICADORES:\n';
      if (pattern.modifiers.tone) prompt += `- Tono: ${pattern.modifiers.tone}\n`;
      if (pattern.modifiers.format) prompt += `- Formato: ${pattern.modifiers.format}\n`;
      if (pattern.modifiers.length) prompt += `- Longitud: ${pattern.modifiers.length}\n`;
      if (pattern.modifiers.style) prompt += `- Estilo: ${pattern.modifiers.style}\n`;
    }

    prompt += '\nGENERAR:';
    
    return prompt;
  }

  /**
   * Obtener sugerencias de patrones (autocompletado de #)
   */
  getSuggestions(partialContext: string): string[] {
    const lower = partialContext.toLowerCase();
    const suggestions: string[] = [];

    // Buscar coincidencias en keywords
    for (const [, keywords] of Object.entries(this.KEYWORDS)) {
      for (const keyword of keywords) {
        if (keyword.startsWith(lower) || lower === '') {
          suggestions.push(`#${keyword}#`);
        }
      }
    }

    // Agregar sugerencias con modificadores comunes
    if (lower.includes('expandir') || lower.includes('continuar')) {
      suggestions.push('#expandir con ejemplos#', '#continuar con tono profesional#');
    }
    if (lower.includes('resumir')) {
      suggestions.push('#resumir en 3 puntos#', '#resumir brevemente#');
    }

    return suggestions.slice(0, 10); // Limitar a 10 sugerencias
  }

  /**
   * Remover patrones del texto (limpieza)
   */
  removePatterns(text: string): string {
    return text.replace(this.CONTEXT_REGEX, '').trim();
  }

  /**
   * Validar sintaxis de patrón
   */
  isValidPattern(text: string): { valid: boolean; error?: string } {
    // Contar # para verificar pares
    const hashCount = (text.match(/#/g) || []).length;
    
    if (hashCount % 2 !== 0) {
      return { 
        valid: false, 
        error: 'Patrón incompleto: falta cerrar con #' 
      };
    }

    // Verificar que no esté vacío
    const content = text.match(/#([^#]+)#/);
    if (content && content[1].trim().length === 0) {
      return { 
        valid: false, 
        error: 'Patrón vacío: agrega instrucciones entre ##' 
      };
    }

    return { valid: true };
  }
}

// Instancia singleton
export const contextParser = new ContextParser();

// Funciones helper para uso rápido
export const parseContext = (text: string, cursor?: number) => contextParser.parse(text, cursor);
export const getPatternAtCursor = (text: string, cursor: number) => contextParser.getPatternAtCursor(text, cursor);
export const buildPrompt = (pattern: ContextPattern, context: string) => contextParser.buildPromptFromPattern(pattern, context);
export const hasPattern = (text: string) => contextParser.hasValidPattern(text);
export const removePatterns = (text: string) => contextParser.removePatterns(text);
export const validatePattern = (text: string) => contextParser.isValidPattern(text);
export const getContextSuggestions = (partial: string) => contextParser.getSuggestions(partial);