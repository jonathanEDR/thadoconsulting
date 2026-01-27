/**
 * 🎯 SERVICIO DE GESTIÓN DE ROLES
 * Maneja la promoción de usuarios y cambios de roles
 */

import { getBackendUrl } from '../utils/apiConfig';

const API_BASE_URL = getBackendUrl();

export interface UserEligible {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username?: string;
  profileImage?: string;
  createdAt: string;
  lastLogin?: string;
  leadCount: number;
  messageCount: number;
}

export interface PromotionResult {
  success: boolean;
  message: string;
  promotion?: {
    userId: string;
    email: string;
    fullName: string;
    previousRole: string;
    newRole: string;
    promotedBy: string;
    promotedAt: string;
    leadsUpdated: number;
    messageSent: boolean;
  };
  error?: string;
}

export interface RoleStatistics {
  success: boolean;
  statistics: {
    total: number;
    byRole: Array<{
      role: string;
      count: number;
    }>;
    lastUpdated: string;
  };
}

/**
 * Obtener usuarios USER elegibles para promoción a CLIENT
 */
export const getEligibleUsers = async (): Promise<{ success: boolean; users: UserEligible[]; total: number; error?: string }> => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/eligible-for-promotion`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('❌ Error obteniendo usuarios elegibles:', error);
    return {
      success: false,
      users: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Promover usuario de USER a CLIENT
 */
export const promoteUserToClient = async (userId: string, notes?: string): Promise<PromotionResult> => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/promote-to-client`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('❌ Error promoviendo usuario:', error);
    return {
      success: false,
      message: 'Error promoviendo usuario',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Cambiar rol de un usuario (solo SuperAdmin)
 */
export const updateUserRole = async (userId: string, newRole: string, notes?: string): Promise<PromotionResult> => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newRole, notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('❌ Error actualizando rol:', error);
    return {
      success: false,
      message: 'Error actualizando rol',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Obtener estadísticas de usuarios por rol
 */
export const getRoleStatistics = async (): Promise<RoleStatistics> => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/role-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error;
  }
};
