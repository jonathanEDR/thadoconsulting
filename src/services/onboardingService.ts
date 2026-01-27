/**
 * 🎉 SERVICIO DE ONBOARDING AL PRIMER ACCESO
 * 
 * Se ejecuta cuando un usuario CLIENT visita por primera vez la página de mensajes
 * Detecta automáticamente si necesita onboarding y lo ejecuta
 */

import { getBackendUrl } from '../utils/apiConfig';

const API_BASE_URL = getBackendUrl();

interface OnboardingCheckResult {
  needsOnboarding: boolean;
  reason: string;
  leadCount: number;
  messageCount: number;
}

interface OnboardingExecutionResult {
  success: boolean;
  message: string;
  leadCreated?: boolean;
  messagesSent?: number;
  leadId?: string;
  error?: string;
}

/**
 * Verifica si el usuario necesita onboarding al acceder a mensajes
 */
export const checkIfNeedsOnboarding = async (): Promise<OnboardingCheckResult> => {
  try {
    // Obtener token de Clerk
    const token = await window.Clerk?.session?.getToken();
    if (!token) {
      return {
        needsOnboarding: false,
        reason: 'Usuario no autenticado',
        leadCount: 0,
        messageCount: 0
      };
    }

    // Verificar si ya tiene leads y mensajes
    const response = await fetch(`${API_BASE_URL}/api/client/onboarding-check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error checking onboarding: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('❌ Error verificando onboarding:', error);
    return {
      needsOnboarding: false,
      reason: 'Error en verificación',
      leadCount: 0,
      messageCount: 0
    };
  }
};

/**
 * Ejecuta el onboarding automático para el usuario actual
 */
export const executeWelcomeOnboarding = async (userInfo: {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<OnboardingExecutionResult> => {
  try {
    // Obtener token de Clerk
    const token = await window.Clerk?.session?.getToken();
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const userData = {
      clerkId: userInfo.clerkId,
      email: userInfo.email,
      firstName: userInfo.firstName || '',
      lastName: userInfo.lastName || ''
    };

    // Ejecutar onboarding en el backend
    const response = await fetch(`${API_BASE_URL}/api/client/welcome-onboarding`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error en onboarding: ${response.status}`);
    }

    const result = await response.json();
    
    if (import.meta.env.DEV) {
      console.log('🎉 Onboarding ejecutado exitosamente:', result);
    }
    
    return {
      success: true,
      message: result.message,
      leadCreated: result.onboarding?.leadCreated,
      messagesSent: result.onboarding?.messagesSent,
      leadId: result.onboarding?.leadId
    };

  } catch (error) {
    console.error('❌ Error ejecutando onboarding:', error);
    return {
      success: false,
      message: 'Error ejecutando onboarding',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};