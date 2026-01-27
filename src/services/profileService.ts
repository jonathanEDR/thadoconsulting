/**
 * 👤 Profile Service
 * Servicios para gestión de perfiles de usuario
 */

import axios from 'axios';
import type { BlogProfile, PublicUserProfile, ProfileStats } from '../types/profile';
import type { BlogPost } from '../types/blog';
import { getBackendUrl } from '../utils/apiConfig';
import { dashboardCache, DASHBOARD_CACHE_DURATIONS } from '../utils/dashboardCache';

// ============================================
// CONFIGURACIÓN DE API
// ============================================

const API_BASE_URL = getBackendUrl();

/**
 * Instancia de axios configurada para el servicio de perfiles
 */
const profileApiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================
// TIPOS PARA RESPUESTAS DE API
// ============================================

interface ProfileResponse {
  success: boolean;
  data: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    role: string;
    blogProfile: BlogProfile;
    fullName: string;
    publicUsername: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

interface PublicProfileResponse {
  success: boolean;
  data: PublicUserProfile;
}

interface ProfileStatsResponse {
  success: boolean;
  data: ProfileStats;
}

interface ProfileListResponse {
  success: boolean;
  data: PublicUserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface AvatarUploadResponse {
  success: boolean;
  data: {
    avatar: string;
    publicId: string;
    dimensions: {
      width: number;
      height: number;
    };
    size: number;
  };
  message?: string;
}

// ============================================
// PERFIL PROPIO
// ============================================

/**
 * Obtener mi perfil completo
 */
export const getMyProfile = async (token?: string): Promise<ProfileResponse['data']> => {
  try {
    // ⚡ Verificar cache primero (4 horas para datos personales)
    const cacheKey = 'user-profile';
    const cachedProfile = dashboardCache.get<ProfileResponse['data']>(
      cacheKey, 
      DASHBOARD_CACHE_DURATIONS.PROFILE
    );
    
    if (cachedProfile) {
      console.log('✅ [Profile Service] Cache hit - usando datos cacheados');
      return cachedProfile;
    }

    console.log('🌐 [Profile Service] Cache miss - haciendo request');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await profileApiClient.get<ProfileResponse>('/profile', { headers });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener perfil');
    }

    // ⚡ Guardar en cache después del request exitoso
    dashboardCache.set(cacheKey, response.data.data);
    console.log('💾 [Profile Service] Datos guardados en cache');
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting profile:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener perfil');
  }
};

/**
 * Actualizar mi perfil
 */
export const updateMyProfile = async (profileData: Partial<BlogProfile>, token?: string): Promise<ProfileResponse['data']> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await profileApiClient.put<ProfileResponse>('/profile', profileData, { headers });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al actualizar perfil');
    }

    // ⚡ Invalidar cache después de actualización exitosa
    const cacheKey = 'user-profile';
    dashboardCache.clear(cacheKey);
    console.log('🗑️ [Profile Service] Cache invalidado después de actualización');

    // ⚡ Guardar nuevo perfil en cache
    dashboardCache.set(cacheKey, response.data.data);
    console.log('💾 [Profile Service] Nuevo perfil guardado en cache');
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
  }
};

// ============================================
// PERFILES PÚBLICOS
// ============================================

/**
 * Obtener perfil público por username
 */
export const getPublicProfile = async (username: string): Promise<PublicUserProfile> => {
  try {
    const response = await profileApiClient.get<PublicProfileResponse>(`/profile/public/${username}`);
    
    if (!response.data.success) {
      throw new Error('Perfil no encontrado');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting public profile:', error);
    throw new Error(error.response?.data?.message || 'Perfil no encontrado');
  }
};

/**
 * Obtener estadísticas de perfil
 */
export const getProfileStats = async (username: string): Promise<ProfileStats> => {
  try {
    const response = await profileApiClient.get<ProfileStatsResponse>(`/profile/${username}/stats`);
    
    if (!response.data.success) {
      throw new Error('Estadísticas no disponibles');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting profile stats:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
  }
};

/**
 * Listar perfiles públicos con filtros
 */
export const listPublicProfiles = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  expertise?: string;
  sortBy?: 'profileCompleteness' | 'joinDate' | 'lastActive';
}): Promise<ProfileListResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.expertise) searchParams.set('expertise', params.expertise);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    
    const queryString = searchParams.toString();
    const url = `/profile/public${queryString ? `?${queryString}` : ''}`;
    
    const response = await profileApiClient.get<ProfileListResponse>(url);
    
    if (!response.data.success) {
      throw new Error('Error al obtener perfiles');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error listing profiles:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener perfiles');
  }
};

// ============================================
// UPLOAD DE AVATAR
// ============================================

/**
 * Subir avatar
 */
export const uploadAvatar = async (file: File, token?: string): Promise<string> => {
  try {
    // Validar archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP');
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 5MB');
    }
    
    // Crear FormData
    const formData = new FormData();
    formData.append('avatar', file);
    
    // IMPORTANTE: NO establecer Content-Type manualmente con FormData
    // Axios lo establece automáticamente con el boundary correcto
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🔄 Uploading avatar to:', `${API_BASE_URL}/api/upload/avatar`);
    
    const response = await profileApiClient.post<AvatarUploadResponse>('/upload/avatar', formData, { headers });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al subir avatar');
    }
    
    console.log('✅ Avatar uploaded successfully:', response.data.data.avatar);
    return response.data.data.avatar;
  } catch (error: any) {
    console.error('❌ Error uploading avatar:', error);
    console.error('Response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al subir avatar');
  }
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Generar URL de avatar por defecto basado en las iniciales
 */
export const getDefaultAvatar = (displayName: string): string => {
  const initials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${initials}&background=3b82f6&color=fff&size=300`;
};

/**
 * Obtener URL de redes sociales
 */
export const getSocialUrl = (platform: string, value: string): string => {
  if (!value) return '';
  
  switch (platform) {
    case 'facebook':
      // Manejar username, /username, o URL completa
      if (value.startsWith('http')) {
        return value;
      }
      const fbUsername = value.startsWith('/') ? value.slice(1) : value;
      return `https://facebook.com/${fbUsername}`;
    
    case 'tiktok':
      // Manejar @username o username
      if (value.startsWith('http')) {
        return value;
      }
      const tiktokUsername = value.startsWith('@') ? value.slice(1) : value;
      return `https://tiktok.com/@${tiktokUsername}`;
    
    case 'github':
      return value.startsWith('http') ? value : `https://github.com/${value}`;
    
    case 'linkedin':
      // Manejar in/username o URL completa
      if (value.startsWith('http')) {
        return value;
      }
      const linkedinUsername = value.startsWith('in/') ? value.slice(3) : value;
      return `https://linkedin.com/in/${linkedinUsername}`;
    
    case 'orcid':
      return value.startsWith('http') ? value : `https://orcid.org/${value}`;
    
    default:
      return value.startsWith('http') ? value : `https://${value}`;
  }
};

/**
 * Validar completeness del perfil
 */
export const validateProfileCompleteness = (profile: BlogProfile): {
  score: number;
  missing: string[];
  suggestions: string[];
} => {
  const missing: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  
  // Información básica (40 puntos total)
  if (profile.displayName?.trim()) {
    score += 15;
  } else {
    missing.push('Nombre para mostrar');
  }
  
  if (profile.bio?.trim()) {
    score += 15;
  } else {
    missing.push('Biografía');
    suggestions.push('Agrega una biografía atractiva para que otros te conozcan mejor');
  }
  
  if (profile.avatar?.trim()) {
    score += 10;
  } else {
    missing.push('Avatar');
    suggestions.push('Sube una foto de perfil para ser más reconocible');
  }
  
  // Información profesional (30 puntos total)
  if (profile.location?.trim()) {
    score += 10;
  } else {
    suggestions.push('Agrega tu ubicación para conectar con personas cercanas');
  }
  
  if (profile.expertise && profile.expertise.length > 0) {
    score += 10;
  } else {
    missing.push('Área de expertise');
    suggestions.push('Especifica tu área de especialización');
  }
  
  if (profile.website?.trim()) {
    score += 10;
  } else {
    suggestions.push('Agrega tu sitio web o portafolio');
  }
  
  // Redes sociales (20 puntos total)
  const socialLinks = Object.values(profile.social || {}).filter(link => link?.trim());
  if (socialLinks.length > 0) {
    score += Math.min(socialLinks.length * 5, 20);
  } else {
    suggestions.push('Conecta tus redes sociales para mayor alcance');
  }
  
  // Configuración de perfil (10 puntos total)
  if (profile.isPublicProfile) {
    score += 10;
  } else {
    suggestions.push('Haz público tu perfil para que otros puedan encontrarte');
  }
  
  return {
    score: Math.min(score, 100),
    missing,
    suggestions
  };
};

/**
 * Obtener posts de un usuario específico
 */
export const getUserPosts = async (username: string, params?: {
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  data: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/blog/posts/user/${username}${queryString ? `?${queryString}` : ''}`;
    
    const response = await profileApiClient.get(url);
    
    if (!response.data.success) {
      throw new Error('Error al obtener posts del usuario');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error getting user posts:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener posts del usuario');
  }
};

export default {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  getProfileStats,
  listPublicProfiles,
  uploadAvatar,
  getDefaultAvatar,
  getSocialUrl,
  validateProfileCompleteness,
  getUserPosts
};