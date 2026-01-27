/**
 * 📊 AI Tracking Hook
 * Hook para trackear interacciones con IA en el frontend
 * ✅ Optimizado para evitar creación de sesiones duplicadas
 */

import { useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getApiUrl } from '../../utils/apiConfig';

interface TrackingSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  postId?: string;
}

// ✅ Caché de sesiones a nivel de módulo para evitar duplicados
const sessionCache: Map<string, TrackingSession> = new Map();
const pendingSessionCreation: Map<string, Promise<string | null>> = new Map();

export const useAITracking = () => {
  const { getToken, userId } = useAuth();
  const sessionRef = useRef<TrackingSession | null>(null);

  // Crear sesión de tracking (con protección contra duplicados)
  const createSession = useCallback(async (postId?: string, metadata = {}) => {
    const cacheKey = `${userId || 'anonymous'}-${postId || 'new'}`;
    
    // ✅ Verificar si ya existe una sesión para este post/usuario
    const existingSession = sessionCache.get(cacheKey);
    if (existingSession) {
      sessionRef.current = existingSession;
      return existingSession.sessionId;
    }
    
    // ✅ Evitar creaciones duplicadas en paralelo
    if (pendingSessionCreation.has(cacheKey)) {
      return pendingSessionCreation.get(cacheKey);
    }
    
    const createPromise = (async () => {
      try {
        const token = await getToken();
        
        const response = await fetch(`${getApiUrl()}/ai/session/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            postId,
            metadata
          })
        });

        if (response.ok) {
          const data = await response.json();
          const session: TrackingSession = {
            sessionId: data.data.sessionId,
            userId: data.data.userId,
            startTime: new Date(),
            postId
          };
          
          sessionRef.current = session;
          sessionCache.set(cacheKey, session);
          
          return data.data.sessionId;
        }
      } catch (error) {
        console.error('Error creando sesión de tracking:', error);
      }
      
      return null;
    })();
    
    pendingSessionCreation.set(cacheKey, createPromise);
    
    try {
      return await createPromise;
    } finally {
      pendingSessionCreation.delete(cacheKey);
    }
  }, [getToken, userId]);

  // Trackear nueva sugerencia (alias para compatibilidad)
  const trackSuggestion = useCallback(async (_data: {
    userInput: string;
    aiResponse: string;
    metadata?: any;
  }) => {
    // En este caso, no necesitamos crear un tracking específico
    // porque el backend ya lo hace en BlogAgent.js
    // Solo retornamos un ID temporal para la sesión actual
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    return tempId;
  }, []);

  // Marcar sugerencia como aceptada
  const markAsAccepted = useCallback(async (trackingId: string, modifiedText?: string) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${getApiUrl()}/ai/track/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackingId,
          modifiedText
        })
      });

      if (response.ok) {
        console.log('✅ Sugerencia marcada como aceptada:', trackingId);
        return true;
      }
    } catch (error) {
      console.error('Error marcando como aceptada:', error);
    }
    
    return false;
  }, [getToken]);

  // Marcar sugerencia como rechazada
  const markAsRejected = useCallback(async (trackingId: string) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${getApiUrl()}/ai/track/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackingId
        })
      });

      if (response.ok) {
        console.log('❌ Sugerencia marcada como rechazada:', trackingId);
        return true;
      }
    } catch (error) {
      console.error('Error marcando como rechazada:', error);
    }
    
    return false;
  }, [getToken]);

  // Agregar rating
  const addRating = useCallback(async (trackingId: string, rating: number, feedback?: string) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${getApiUrl()}/ai/track/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackingId,
          rating,
          feedback
        })
      });

      if (response.ok) {
        console.log(`⭐ Rating agregado: ${trackingId} - ${rating}/5`);
        return true;
      }
    } catch (error) {
      console.error('Error agregando rating:', error);
    }
    
    return false;
  }, [getToken]);

  // Obtener estadísticas del usuario
  const getUserStats = useCallback(async (days = 30) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${getApiUrl()}/ai/stats/user?days=${days}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
    }
    
    return null;
  }, [getToken]);

  // Obtener sesión actual
  const getCurrentSession = useCallback(() => {
    return sessionRef.current;
  }, []);

  return {
    createSession,
    trackSuggestion,
    markAsAccepted,
    markAsRejected,
    addRating,
    getUserStats,
    getCurrentSession,
    sessionId: sessionRef.current?.sessionId || null,
    userId
  };
};