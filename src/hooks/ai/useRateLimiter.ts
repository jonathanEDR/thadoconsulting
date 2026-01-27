/**
 * 🚦 Rate Limiter Hook
 * Controla la frecuencia de llamadas a APIs para evitar spam y costos excesivos
 */

import { useRef, useCallback } from 'react';

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
  cooldownMs?: number;
}

interface RequestLog {
  timestamp: number;
  count: number;
}

export const useRateLimiter = (options: RateLimiterOptions) => {
  const {
    maxRequests = 10,
    windowMs = 60000, // 1 minuto
    cooldownMs = 2000 // 2 segundos entre requests
  } = options;

  const requestLog = useRef<RequestLog[]>([]);
  const lastRequestTime = useRef<number>(0);

  const canMakeRequest = useCallback((): boolean => {
    const now = Date.now();
    
    // Verificar cooldown entre requests
    if (now - lastRequestTime.current < cooldownMs) {
      console.log('🚦 Rate limit: Cooldown activo');
      return false;
    }

    // Limpiar requests antiguos
    requestLog.current = requestLog.current.filter(
      log => now - log.timestamp < windowMs
    );

    // Verificar límite de requests por ventana de tiempo
    const totalRequests = requestLog.current.reduce(
      (sum, log) => sum + log.count, 0
    );

    if (totalRequests >= maxRequests) {
      console.log('🚦 Rate limit: Máximo de requests alcanzado');
      return false;
    }

    return true;
  }, [maxRequests, windowMs, cooldownMs]);

  const logRequest = useCallback(() => {
    const now = Date.now();
    lastRequestTime.current = now;
    
    requestLog.current.push({
      timestamp: now,
      count: 1
    });

    console.log('📊 Rate limiter: Request registrado', {
      total: requestLog.current.length,
      window: `${windowMs}ms`
    });
  }, [windowMs]);

  const getStatus = useCallback(() => {
    const now = Date.now();
    const recentRequests = requestLog.current.filter(
      log => now - log.timestamp < windowMs
    );
    
    const totalRequests = recentRequests.reduce(
      (sum, log) => sum + log.count, 0
    );

    return {
      requestsInWindow: totalRequests,
      maxRequests,
      canRequest: canMakeRequest(),
      cooldownRemaining: Math.max(0, cooldownMs - (now - lastRequestTime.current)),
      windowMs
    };
  }, [maxRequests, windowMs, cooldownMs, canMakeRequest]);

  return {
    canMakeRequest,
    logRequest,
    getStatus
  };
};