/**
 * 📝 Tipos TypeScript para el Módulo de Blog
 * Compatible con el backend Web Scuti API
 */

import type { SocialLinks } from '../profile';

// ============================================
// INTERFACES PRINCIPALES
// ============================================

export interface BlogTag {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  postCount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  readingTime: number;
  wordCount: number;
  isPublished: boolean;
  allowComments: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  showInHeaderMenu?: boolean;
  category: BlogCategory;
  author: BlogAuthor | null; // Puede ser null si no tiene autor asignado
  tags: (string | BlogTag)[];
  stats: PostStats;
  analytics?: {
    views: number;
    uniqueVisitors?: number;
    likes: number;
    shares?: {
      facebook?: number;
      twitter?: number;
      linkedin?: number;
      whatsapp?: number;
    };
    avgTimeOnPage?: number;
    bounceRate?: number;
  };
  seo: SEOMetadata;
  images?: PostImage[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  image?: {
    url?: string;
    cloudinaryId?: string;
    alt?: string;
  };
  parent?: string;
  order: number;
  isActive: boolean;
  postCount?: number;
  seo?: CategorySEO;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthor {
  _id: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  username?: string;
  profileImage?: string;
  // Datos del perfil público del blog (legacy - mantener para compatibilidad)
  displayName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  expertise?: string[];
  social?: SocialLinks;
  role: string;
  // Datos adicionales para el contexto del blog
  profileCompleteness?: number;
  publicUsername?: string;
  // ✅ blogProfile completo del backend
  blogProfile?: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    location?: string;
    expertise?: string[];
    social?: SocialLinks;
    isPublicProfile?: boolean;
    allowComments?: boolean;
    showEmail?: boolean;
    profileCompleteness?: number;
    lastProfileUpdate?: string;
  };
}

export interface BlogComment {
  _id: string;
  content: string;
  post: string;
  author: CommentAuthor;
  status: CommentStatus;
  level: number;
  parentComment?: string;
  votes: CommentVotes;
  isReported: boolean;
  reports?: CommentReport[];
  moderation?: CommentModeration;
  replies?: BlogComment[];
  editHistory?: EditHistory[];
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export interface PostStats {
  views: number;
  commentsCount: number;
  approvedCommentsCount: number;
  averageRating?: number;
  likesCount?: number;
  bookmarksCount?: number;
}

export interface SEOMetadata {
  focusKeyphrase?: string;  // ✅ Palabra clave principal
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  keywords?: string[];
}

export interface CategorySEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface PostImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface CommentAuthor {
  // Usuario autenticado
  userId?: string | {
    _id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    profileImage?: string;
    blogProfile?: {
      isPublicProfile?: boolean;
    };
  };
  firstName?: string;
  lastName?: string;
  avatar?: string;
  // Usuario invitado
  name?: string;
  email?: string;
  website?: string;
  ip?: string;
}

export interface CommentVotes {
  likes: number;
  dislikes: number;
  score: number;
  voters?: CommentVoter[];
}

export interface CommentVoter {
  userId?: string;
  guestId?: string;
  type: 'like' | 'dislike';
  votedAt: string;
}

export interface CommentReport {
  reason: ReportReason;
  description?: string;
  reportedBy: {
    userId?: string;
    email?: string;
    ip?: string;
  };
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface CommentModeration {
  score: number;
  flags?: ModerationFlag[];
  moderatedBy?: string;
  moderatedAt?: string;
  reason?: string;
}

export interface ModerationFlag {
  type: 'spam' | 'inappropriate' | 'suspicious' | 'links' | 'caps' | 'profanity';
  confidence: number;
  description?: string;
}

export interface EditHistory {
  content: string;
  editedAt: string;
  reason?: string;
}

// ============================================
// ENUMS Y TIPOS LITERALES
// ============================================

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam' | 'hidden';
export type ReportReason = 'spam' | 'inappropriate' | 'harassment' | 'off_topic' | 'other';
export type ModerationAction = 'approve' | 'reject' | 'spam' | 'hide';
export type VoteType = 'like' | 'dislike' | 'remove';
export type PostSortBy = 'publishedAt' | 'views' | 'commentsCount' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  featuredImage?: string;
  seo?: Partial<SEOMetadata>;
  isPublished?: boolean;
  allowComments?: boolean;
  isPinned?: boolean;
  isFeatured?: boolean;
  showInHeaderMenu?: boolean;
  publishedAt?: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  _id?: string;
}

export interface CommentFormData {
  content: string;
  parentComment?: string;
  // Para usuarios no autenticados
  name?: string;
  email?: string;
  website?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  color?: string;
  image?: {
    url?: string;
    cloudinaryId?: string;
    alt?: string;
  };
  parent?: string;
  order?: number;
  seo?: CategorySEO;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  _id?: string;
  isActive?: boolean;
}

export interface VoteCommentDto {
  type: VoteType;
  guestId?: string;
}

export interface ReportCommentDto {
  reason: ReportReason;
  description?: string;
  reporterEmail?: string;
}

export interface ModerateCommentDto {
  action: ModerationAction;
  reason?: string;
  notifyUser?: boolean;
}

// ============================================
// FILTROS Y PARÁMETROS DE BÚSQUEDA
// ============================================

export interface BlogFilters {
  page?: number;
  limit?: number;
  categoria?: string;
  search?: string;
  tags?: string[];
  author?: string;
  sort?: PostSortBy;
  order?: SortOrder;
  isPublished?: boolean;
  isPinned?: boolean;
}

export interface CommentFilters {
  page?: number;
  limit?: number;
  status?: CommentStatus;
  includeReplies?: boolean;
  sort?: 'createdAt' | 'votes';
  order?: SortOrder;
}

export interface ModerationFilters {
  status?: CommentStatus;
  isReported?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'score';
  sortOrder?: SortOrder;
}

// ============================================
// RESPUESTAS DE API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface CommentStatsResponse {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  spam: number;
  hidden: number;
}

export interface BlogDashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  totalViews: number;
  avgReadingTime: number;
  categoriesCount: number;
  tagsCount: number;
}

// ============================================
// UTILIDADES
// ============================================

export interface BlogSearchResult {
  posts: BlogPost[];
  total: number;
  query: string;
  took: number;
}

export interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  categoria: BlogCategory;
  readingTime: number;
}

export interface PopularTag {
  tag: string;
  count: number;
}

export interface CategoryWithPosts extends BlogCategory {
  recentPosts?: BlogPost[];
}

// ============================================
// ESTADO DE LA UI
// ============================================

export interface BlogUIState {
  selectedCategory?: string;
  searchQuery: string;
  currentPage: number;
  sortBy: PostSortBy;
  sortOrder: SortOrder;
  viewMode: 'grid' | 'list';
}

export interface EditorState {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved?: string;
  autoSaveEnabled: boolean;
}

export interface CommentUIState {
  replyingTo?: string;
  editingComment?: string;
  reportingComment?: string;
  sortBy: 'newest' | 'oldest' | 'popular';
}
