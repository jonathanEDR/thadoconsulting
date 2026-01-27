/**
 * 📦 Exportación centralizada de servicios del Blog
 */

// Servicios básicos
export { blogPostApi, default as blogPostApiDefault } from './blogPostApi';
export { blogCommentApi, default as blogCommentApiDefault } from './blogCommentApi';
export { blogCategoryApi, default as blogCategoryApiDefault } from './blogCategoryApi';
export { blogTagApi, default as blogTagApiDefault } from './blogTagApi';
export { blogModerationApi, default as blogModerationApiDefault } from './blogModerationApi';

// Servicios avanzados de IA y SEO
export { blogAiApi, default as blogAiApiDefault } from './blogAiApi';
export { blogSeoApi, default as blogSeoApiDefault } from './blogSeoApi';

// Re-exportar utilidades comunes
export { generateGuestId, getGuestId } from './blogCommentApi';
export { isValidColor, generateSlug } from './blogCategoryApi';
