/**
 * 💾 USE AUTO SAVE - Hook para Auto-Guardado Inteligente
 * Sistema profesional de auto-guardado con estados visuales y recuperación
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotification } from '../hooks/useNotification';

// ============================================
// TIPOS
// ============================================

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'dirty';

export interface AutoSaveConfig {
  interval?: number; // Intervalo en ms (default: 30000 = 30s)
  debounceDelay?: number; // Delay para debounce (default: 1000 = 1s)
  maxRetries?: number; // Máximo reintentos (default: 3)
  enableNotifications?: boolean; // Mostrar notificaciones (default: false)
  storageKey?: string; // Key para localStorage (default: sin storage)
}

export interface AutoSaveResult {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  isDirty: boolean;
  save: () => Promise<void>;
  reset: () => void;
  setSaveStatus: (status: SaveStatus) => void;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

/**
 * Hook para auto-guardado inteligente con estados visuales
 * 
 * @example
 * ```tsx
 * const { saveStatus, lastSaved, isDirty, save } = useAutoSave({
 *   data: formData,
 *   onSave: async (data) => await serviciosApi.update(id, data),
 *   interval: 30000, // 30 segundos
 *   enableNotifications: false // Sin notificaciones para auto-save
 * });
 * 
 * // En tu componente:
 * <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
 * ```
 */
export const useAutoSave = function<T>(config: {
  data: T;
  onSave: (data: T) => Promise<void>;
  isEnabled?: boolean;
  options?: AutoSaveConfig;
}): AutoSaveResult {
  const {
    data,
    onSave,
    isEnabled = true,
    options = {}
  } = config;

  const {
    interval = 30000, // 30 segundos
    debounceDelay = 1000, // 1 segundo
    maxRetries = 3,
    enableNotifications = false,
    storageKey
  } = options;

  // ============================================
  // ESTADO
  // ============================================

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Referencias
  const dataRef = useRef<T>(data);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastSaveAttempt = useRef<Date | null>(null);

  const { success, error: showError } = useNotification();

  // ============================================
  // FUNCIONES
  // ============================================

  /**
   * Guardar en localStorage si está configurado
   */
  const saveToStorage = useCallback((dataToSave: T) => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          data: dataToSave,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.warn('No se pudo guardar en localStorage:', err);
      }
    }
  }, [storageKey]);

  /**
   * Cargar desde localStorage si está disponible
   */
  const loadFromStorage = useCallback((): T | null => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.data;
        }
      } catch (err) {
        console.warn('No se pudo cargar desde localStorage:', err);
      }
    }
    return null;
  }, [storageKey]);

  /**
   * Función principal de guardado
   */
  const performSave = useCallback(async (): Promise<void> => {
    if (!isEnabled || saveStatus === 'saving') return;

    try {
      setSaveStatus('saving');
      lastSaveAttempt.current = new Date();

      await onSave(dataRef.current);
      
      setLastSaved(new Date());
      setSaveStatus('saved');
      setIsDirty(false);
      setRetryCount(0);

      // Guardar en storage si está configurado
      saveToStorage(dataRef.current);

      // Notificación solo si está habilitada
      if (enableNotifications) {
        success('Guardado automáticamente', 'Los cambios se guardaron correctamente');
      }

      // Volver a idle después de 2 segundos
      setTimeout(() => {
        setSaveStatus(prevStatus => prevStatus === 'saved' ? 'idle' : prevStatus);
      }, 2000);

    } catch (err: any) {
      console.error('Error en auto-save:', err);
      setSaveStatus('error');
      
      // Reintentar si no hemos llegado al límite
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        
        // Reintento exponencial: 5s, 10s, 20s
        const retryDelay = 5000 * Math.pow(2, retryCount);
        setTimeout(() => {
          performSave();
        }, retryDelay);

        if (enableNotifications) {
          showError('Error al guardar', `Reintentando en ${retryDelay / 1000}s...`);
        }
      } else {
        if (enableNotifications) {
          showError('Error al guardar', 'No se pudieron guardar los cambios automáticamente');
        }
      }
    }
  }, [isEnabled, saveStatus, onSave, retryCount, maxRetries, enableNotifications, success, showError, saveToStorage]);

  /**
   * Guardado manual (sin debounce)
   */
  const save = useCallback(async (): Promise<void> => {
    // Cancelar auto-save pendiente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    await performSave();
  }, [performSave]);

  /**
   * Reset del estado
   */
  const reset = useCallback(() => {
    setSaveStatus('idle');
    setIsDirty(false);
    setRetryCount(0);
    setLastSaved(null);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ============================================
  // EFECTOS
  // ============================================

  /**
   * Detectar cambios en los datos
   */
  useEffect(() => {
    const hasChanged = JSON.stringify(dataRef.current) !== JSON.stringify(data);
    dataRef.current = data;

    if (hasChanged && isEnabled) {
      setIsDirty(true);
      setSaveStatus('dirty');

      // Debounce: guardar después del delay si no hay más cambios
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        performSave();
      }, debounceDelay);
    }
  }, [data, isEnabled, debounceDelay, performSave]);

  /**
   * Auto-save por intervalo
   */
  useEffect(() => {
    if (!isEnabled || interval <= 0) return;

    intervalRef.current = window.setInterval(() => {
      if (isDirty && saveStatus !== 'saving') {
        performSave();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, interval, isDirty, saveStatus, performSave]);

  /**
   * Cleanup al desmontar
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Cargar datos del storage al montar
   */
  useEffect(() => {
    const storedData = loadFromStorage();
    if (storedData) {
      dataRef.current = storedData;
    }
  }, [loadFromStorage]);

  // ============================================
  // RETURN
  // ============================================

  return {
    saveStatus,
    lastSaved,
    isDirty,
    save,
    reset,
    setSaveStatus
  };
};

// ============================================
// COMPONENTE INDICADOR
// ============================================

interface AutoSaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date | null;
  className?: string;
}

/**
 * Indicador visual del estado de auto-guardado
 */
export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
  lastSaved,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: '⏳',
          text: 'Guardando...',
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10 border-yellow-500/30'
        };
      case 'saved':
        return {
          icon: '✅',
          text: 'Guardado',
          color: 'text-green-400',
          bg: 'bg-green-500/10 border-green-500/30'
        };
      case 'error':
        return {
          icon: '❌',
          text: 'Error al guardar',
          color: 'text-red-400',
          bg: 'bg-red-500/10 border-red-500/30'
        };
      case 'dirty':
        return {
          icon: '●',
          text: 'Sin guardar',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10 border-orange-500/30'
        };
      default:
        return {
          icon: '○',
          text: 'Guardado',
          color: 'text-gray-400',
          bg: 'bg-gray-500/10 border-gray-500/30'
        };
    }
  };

  const config = getStatusConfig();
  const formattedTime = lastSaved 
    ? new Intl.DateTimeFormat('es', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }).format(lastSaved)
    : '';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bg} ${className}`}>
      <span className={`${config.color} ${status === 'saving' ? 'animate-spin' : ''}`}>
        {config.icon}
      </span>
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
      {lastSaved && status !== 'saving' && (
        <span className="text-xs text-gray-500">
          {formattedTime}
        </span>
      )}
    </div>
  );
};

export default useAutoSave;