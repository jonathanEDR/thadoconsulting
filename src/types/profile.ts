/**
 * 👤 Tipos TypeScript para Perfiles de Usuario
 * Tipos para el sistema de perfiles públicos del blog
 */

// ============================================
// INTERFACES PRINCIPALES
// ============================================

export interface SocialLinks {
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  github?: string;
  orcid?: string;
}

export interface BlogProfile {
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
}

export interface PublicUserProfile {
  _id: string;
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  expertise?: string[];
  social?: SocialLinks;
  isPublicProfile?: boolean;
  profileCompleteness?: number;
  email?: string | null; // Solo si showEmail es true
  joinDate?: string;
}

export interface UserWithBlogProfile {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
  blogProfile?: BlogProfile;
  fullName?: string;
  publicUsername?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TIPOS PARA FORMULARIOS
// ============================================

export interface BlogProfileFormData {
  displayName: string;
  bio: string;
  avatar: string;
  website: string;
  location: string;
  expertise: string[];
  social: SocialLinks;
  isPublicProfile: boolean;
  allowComments: boolean;
  showEmail: boolean;
}

export interface BlogProfileUpdateData extends Partial<BlogProfileFormData> {
  // Permite actualización parcial
}

// ============================================
// TIPOS PARA API
// ============================================

export interface ProfileStats {
  posts: number;
  comments: number;
  followers: number;
  following: number;
}

export interface UpdateProfileRequest {
  blogProfile: BlogProfileUpdateData;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: UserWithBlogProfile;
  message?: string;
}

export interface GetPublicProfileResponse {
  success: boolean;
  data: PublicUserProfile;
  message?: string;
}

// ============================================
// TIPOS PARA COMPONENTES
// ============================================

export interface ProfileEditorProps {
  user: UserWithBlogProfile;
  onSave: (data: BlogProfileFormData) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export interface ProfilePreviewProps {
  profile: PublicUserProfile;
  showEditButton?: boolean;
  className?: string;
}

export interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (avatarUrl: string) => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================
// ENUMS Y CONSTANTES
// ============================================

export const PROFILE_FIELDS = {
  REQUIRED: ['displayName', 'bio'],
  OPTIONAL: ['avatar', 'website', 'location', 'expertise', 'social'],
  SOCIAL: ['twitter', 'linkedin', 'github', 'orcid']
} as const;

export const EXPERTISE_CATEGORIES = [
  'Desarrollo Web',
  'Desarrollo Móvil',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'UI/UX Design',
  'Marketing Digital',
  'SEO',
  'E-commerce',
  'Blockchain',
  'Ciberseguridad',
  'Cloud Computing',
  'Inteligencia Artificial',
  'Internet de las Cosas (IoT)',
  'Realidad Virtual/Aumentada'
] as const;

export type ExpertiseCategory = typeof EXPERTISE_CATEGORIES[number];

// ============================================
// TIPOS PARA VALIDACIÓN
// ============================================

export interface ProfileValidationError {
  field: keyof BlogProfileFormData;
  message: string;
}

export interface ProfileValidationResult {
  isValid: boolean;
  errors: ProfileValidationError[];
  completeness: number;
}