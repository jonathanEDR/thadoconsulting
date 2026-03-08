/**
 * Hook para mantener el backend de Render activo
 * 
 * Render Free Tier duerme el servidor después de 15 min de inactividad.
 * Este hook hace ping periódico para mantenerlo despierto.
 * 
 * IMPORTANTE: Usar junto con UptimeRobot para cobertura 24/7
 * @see https://uptimerobot.com (servicio gratuito)
 */

import { useEffect, useRef } from 'react';
import { getBackendUrl } from '../utils/apiConfig';

// Configuración
const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutos (Render duerme a los 15)

/**
 * Hace ping silencioso al backend
 */
async function pingBackend(): Promise<boolean> {
  try {
    const baseUrl = getBackendUrl();
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        'X-Ping-Source': 'frontend-keepalive',
      },
    });
    
    if (import.meta.env.DEV) {
      console.log('🏓 Backend ping:', response.ok ? '✅ Activo' : '⚠️ Respuesta inesperada');
    }
    
    return response.ok;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('🏓 Backend ping failed:', error);
    }
    return false;
  }
}

/**
 * Hook que mantiene el backend activo mientras el usuario está en el sitio
 * 
 * @param enabled - Activar/desactivar el ping (default: true)
 * @param intervalMs - Intervalo entre pings en ms (default: 10 minutos)
 * 
 * @example
 * // En App.tsx o layout principal
 * useKeepBackendAlive();
 * 
 * // Con opciones personalizadas
 * useKeepBackendAlive({ enabled: isLoggedIn, intervalMs: 5 * 60 * 1000 });
 */
export function useKeepBackendAlive(options?: {
  enabled?: boolean;
  intervalMs?: number;
}) {
  const { enabled = true, intervalMs = PING_INTERVAL_MS } = options || {};
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Ping inicial al cargar la página (con delay para no bloquear render)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      // Delay de 2 segundos para no competir con recursos críticos
      const initialTimeout = setTimeout(() => {
        pingBackend();
      }, 2000);

      // Configurar ping periódico
      intervalRef.current = setInterval(() => {
        pingBackend();
      }, intervalMs);

      return () => {
        clearTimeout(initialTimeout);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, intervalMs]);
}

/**
 * Función para despertar el backend manualmente
 * Útil antes de operaciones críticas
 * 
 * @example
 * // Antes de enviar un formulario importante
 * await wakeUpBackend();
 * await submitForm(data);
 */
export async function wakeUpBackend(): Promise<boolean> {
  if (import.meta.env.DEV) {
    console.log('🌅 Despertando backend...');
  }
  
  const isAlive = await pingBackend();
  
  if (!isAlive) {
    // Reintentar una vez si falla
    await new Promise(resolve => setTimeout(resolve, 1000));
    return pingBackend();
  }
  
  return isAlive;
}

export default useKeepBackendAlive;
