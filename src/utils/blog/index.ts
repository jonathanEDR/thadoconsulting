/**
 * 🛠️ Blog Utilities
 * Exportaciones centralizadas de utilidades del blog
 */

// Markdown y HTML
export {
  sanitizeHTML,
  stripHTML,
  generateExcerpt,
  extractHeadings,
  addHeadingIds,
  markdownToHTML,
  hasCodeBlocks,
  extractFirstImage,
  highlightSearchTerms,
  validateContentLength
} from './markdownUtils';

// Generación de Slugs
export {
  generateSlug,
  isValidSlug,
  generateUniqueSlug,
  extractKeywordsForSlug,
  shortenSlug,
  slugToTitle,
  suggestSlugAlternatives,
  validateAndCleanSlug
} from './slugGenerator';

// Tiempo de Lectura
export {
  calculateReadingTime,
  countWords,
  formatReadingTime,
  getReadingTimeRange,
  calculateReadingProgress,
  estimateTimeRemaining,
  formatTimeRemaining,
  getReadingInfo,
  classifyArticleLength,
  getArticleLengthLabel,
  hasMinimumContent,
  type ReadingInfo,
  type ArticleLength
} from './readingTime';
