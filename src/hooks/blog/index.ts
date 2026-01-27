/**
 * 📦 Exportación centralizada de hooks del Blog
 */

// Posts
export {
  useBlogPosts,
  useFeaturedPosts,
  usePopularPosts,
  useSearchPosts,
} from './useBlogPosts';

// Posts Admin
export { useAdminPosts } from './useAdminPosts';

// Favorites
export { useFavorites } from './useFavorites';

// Post individual
export {
  useBlogPost,
  usePostInteractions,
} from './useBlogPost';

// Post content processing
export { usePostContent } from './usePostContent';

// Comentarios
export {
  useComments,
  useCommentVote,
} from './useComments';

// Categorías
export {
  useCategories,
  useCategory,
  useCategoryPosts,
  useActiveCategoriesWithCount,
} from './useCategories';

// Tags
export {
  useTags,
  usePopularTags,
  useTag,
  useTagPosts,
} from './useTags';

// Moderación (Admin)
export {
  useModerationQueue,
  usePendingComments,
  useReportedComments,
  useModerationStats,
} from './useModerationQueue';

// IA y Análisis Avanzado
export { useAIMetadata } from './useAIMetadata';
export { useSEOAnalysis } from './useSEOAnalysis';
export { useContentAnalysis } from './useContentAnalysis';
export { 
  useAIRecommendations,
  useKeywordResearch,
} from './useAIRecommendations';

// Debug y Troubleshooting
export { 
  useBlogDebug,
  useBlogDebugConsole,
} from './useBlogDebug';

// CMS Configuration
export { 
  useBlogCmsConfig,
  DEFAULT_BLOG_HERO_CONFIG,
} from './useBlogCmsConfig';
export type { BlogHeroConfig, BlogCmsConfig } from './useBlogCmsConfig';

// Exports por defecto
export { default as useBlogPostsDefault } from './useBlogPosts';
export { default as useBlogPostDefault } from './useBlogPost';
export { default as useCommentsDefault } from './useComments';
export { default as useCategoriesDefault } from './useCategories';
export { default as useModerationQueueDefault } from './useModerationQueue';
