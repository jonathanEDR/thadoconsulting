/**
 * 🎛️ useAgentSettings Hook
 * Hook para obtener y gestionar configuraciones de agentes en tiempo real
 * ✅ Optimizado con caché en memoria para evitar llamadas duplicadas
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { agentConfigService, type AgentConfigData } from '../services/agentConfigService';

interface AgentSettings {
  config: AgentConfigData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ✅ Caché en memoria para evitar llamadas duplicadas
const configCache: Map<string, { data: AgentConfigData | null; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de caché
const pendingRequests: Map<string, Promise<AgentConfigData | null>> = new Map();

export const useAgentSettings = (agentName: string): AgentSettings => {
  const [config, setConfig] = useState<AgentConfigData | null>(() => {
    // Inicializar con valor de caché si existe y es válido
    const cached = configCache.get(agentName);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    const cached = configCache.get(agentName);
    return !cached || (Date.now() - cached.timestamp >= CACHE_TTL);
  });
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchConfig = useCallback(async (forceRefresh = false) => {
    // ✅ Verificar caché antes de hacer petición
    if (!forceRefresh) {
      const cached = configCache.get(agentName);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        if (isMounted.current) {
          setConfig(cached.data);
          setLoading(false);
        }
        return;
      }
    }

    // ✅ Evitar peticiones duplicadas - reutilizar promesa pendiente
    if (pendingRequests.has(agentName)) {
      try {
        const result = await pendingRequests.get(agentName);
        if (isMounted.current) {
          setConfig(result ?? null); // ✅ Convertir undefined a null
          setLoading(false);
        }
        return;
      } catch {
        // Continuar con nueva petición si la pendiente falló
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      // Crear promesa y guardarla para evitar duplicados
      const fetchPromise = (async () => {
        const response = await agentConfigService.getConfig(agentName);
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      })();
      
      pendingRequests.set(agentName, fetchPromise);
      
      const result = await fetchPromise;
      
      // Guardar en caché
      configCache.set(agentName, { data: result, timestamp: Date.now() });
      
      if (isMounted.current) {
        if (result) {
          setConfig(result);
        } else {
          console.warn(`⚠️ [useAgentSettings] No config found for ${agentName}`);
          setError('No se encontró configuración');
          setConfig(null);
        }
      }
    } catch (err: any) {
      console.error(`❌ [useAgentSettings] Error loading config for ${agentName}:`, err);
      if (isMounted.current) {
        setError(err.message || 'Error al cargar configuración');
        setConfig(null);
      }
    } finally {
      pendingRequests.delete(agentName);
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [agentName]);

  // Cargar configuración al montar o cambiar agentName
  useEffect(() => {
    isMounted.current = true;
    
    if (agentName) {
      fetchConfig();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchConfig, agentName]);

  return {
    config,
    loading,
    error,
    refetch: () => fetchConfig(true) // Forzar refresh al llamar refetch
  };
};

// Hook específico para obtener solo las configuraciones de sugerencias
export const useAutoSuggestionSettings = (agentName: string = 'blog') => {
  const { config, loading, error, refetch } = useAgentSettings(agentName);

  // Extraer configuraciones específicas de sugerencias
  const suggestionSettings = config ? {
    enabled: config.enabled && config.config.autoSuggestions,
    debounceMs: config.config.suggestionDebounceMs || 800,
    minLength: config.config.suggestionMinLength || 10,
    contextLength: config.config.suggestionContextLength || 200
  } : {
    enabled: false,
    debounceMs: 800,
    minLength: 10,
    contextLength: 200
  };

  return {
    settings: suggestionSettings,
    loading,
    error,
    refetch
  };
};

export default useAgentSettings;