/**
 * 🎣 HOOK DE PAQUETES - usePaquetes
 * Hook para gestionar paquetes de servicios
 */

import { useState, useEffect, useCallback } from 'react';
import { serviciosApi } from '../services/serviciosApi';
import type {
  PaqueteServicio,
  CreatePaqueteRequest,
  UpdatePaqueteRequest
} from '../types/servicios';

// ============================================
// TIPOS
// ============================================

interface UsePaquetesOptions {
  servicioId?: string; // ID del servicio para cargar paquetes
  autoFetch?: boolean; // Si debe cargar automáticamente al montar
}

interface UsePaquetesReturn {
  // Estado
  paquetes: PaqueteServicio[];
  loading: boolean;
  error: string | null;
  
  // Operaciones CRUD
  createPaquete: (data: CreatePaqueteRequest) => Promise<OperationResult>;
  updatePaquete: (id: string, data: UpdatePaqueteRequest) => Promise<OperationResult>;
  deletePaquete: (id: string) => Promise<OperationResult>;
  duplicatePaquete: (id: string) => Promise<OperationResult>;
  
  // Utilidades
  refresh: () => Promise<void>;
  clearError: () => void;
  getMostPopular: () => PaqueteServicio | null;
}

interface OperationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook para gestionar paquetes de un servicio
 * 
 * @example
 * ```tsx
 * const { paquetes, loading, createPaquete } = usePaquetes({
 *   servicioId: 'service-id-123',
 *   autoFetch: true
 * });
 * ```
 */
export const usePaquetes = (options: UsePaquetesOptions = {}): UsePaquetesReturn => {
  const { servicioId, autoFetch = true } = options;

  // ============================================
  // ESTADO
  // ============================================

  const [paquetes, setPaquetes] = useState<PaqueteServicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FUNCIONES DE CARGA
  // ============================================

  /**
   * Cargar paquetes desde la API
   */
  const fetchPaquetes = useCallback(async () => {
    if (!servicioId) {
      setPaquetes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.getPaquetes(servicioId);
      
      if (response.success) {
        setPaquetes(response.data || []);
      } else {
        throw new Error('No se pudieron obtener los paquetes');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar paquetes';
      setError(errorMessage);
      console.error('[usePaquetes] Error fetching:', err);
    } finally {
      setLoading(false);
    }
  }, [servicioId]);

  /**
   * Efecto para cargar paquetes cuando cambie el servicioId
   */
  useEffect(() => {
    if (autoFetch && servicioId) {
      fetchPaquetes();
    }
  }, [autoFetch, servicioId, fetchPaquetes]);

  // ============================================
  // OPERACIONES CRUD
  // ============================================

  /**
   * Crear un nuevo paquete
   */
  const createPaquete = async (data: CreatePaqueteRequest): Promise<OperationResult> => {
    if (!servicioId) {
      return {
        success: false,
        error: 'No se ha especificado un servicio'
      };
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.createPaquete(servicioId, data);
      
      // Agregar a la lista local
      if (response.data) {
        setPaquetes(prev => [...prev, response.data]);
      }
      
      return {
        success: true,
        message: response.message || 'Paquete creado exitosamente',
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear paquete';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar un paquete existente
   */
  const updatePaquete = async (
    id: string,
    data: UpdatePaqueteRequest
  ): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.updatePaquete(id, data);
      
      // Actualizar en la lista local
      if (response.data) {
        setPaquetes(prev =>
          prev.map(p => p._id === id ? response.data : p)
        );
      }
      
      return {
        success: true,
        message: response.message || 'Paquete actualizado exitosamente',
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar paquete';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar un paquete
   */
  const deletePaquete = async (id: string): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      await serviciosApi.deletePaquete(id);
      
      // Remover de la lista local
      setPaquetes(prev => prev.filter(p => p._id !== id));
      
      return {
        success: true,
        message: 'Paquete eliminado exitosamente'
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar paquete';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Duplicar un paquete
   */
  const duplicatePaquete = async (id: string): Promise<OperationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.duplicatePaquete(id);
      
      // Agregar el duplicado a la lista local
      if (response.data) {
        setPaquetes(prev => [...prev, response.data]);
      }
      
      return {
        success: true,
        message: 'Paquete duplicado exitosamente',
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al duplicar paquete';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Obtener el paquete más popular (más vendido)
   */
  const getMostPopular = useCallback((): PaqueteServicio | null => {
    if (paquetes.length === 0) return null;
    
    return paquetes.reduce((prev, current) => 
      (current.vecesVendido > prev.vecesVendido) ? current : prev
    );
  }, [paquetes]);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refrescar paquetes
   */
  const refresh = useCallback(async () => {
    await fetchPaquetes();
  }, [fetchPaquetes]);

  // ============================================
  // RETORNO
  // ============================================

  return {
    // Estado
    paquetes,
    loading,
    error,
    
    // Operaciones CRUD
    createPaquete,
    updatePaquete,
    deletePaquete,
    duplicatePaquete,
    
    // Utilidades
    refresh,
    clearError,
    getMostPopular
  };
};

export default usePaquetes;
