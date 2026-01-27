import { useState, useEffect, useCallback } from 'react';
import { crmService } from '../services/crmService';
import type { Lead, LeadFilters, CreateLeadData, UpdateLeadData } from '../services/crmService';

/**
 * 🎣 Hook personalizado para gestionar el CRM
 * Maneja estado, filtros, CRUD operations y carga de datos
 */
export const useCRM = () => {
  // ========================================
  // 📊 ESTADO
  // ========================================
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0
  });
  
  // Filtros
  const [filters, setFilters] = useState<LeadFilters>({
    estado: 'all',
    search: '',
    page: 1,
    limit: 10,
    prioridad: 'all',
    tipoServicio: 'all',
    origen: 'all'
  });

  // ========================================
  // 🔄 CARGAR LEADS
  // ========================================
  const loadLeads = useCallback(async (customFilters?: LeadFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = customFilters || filters;
      
      // Remover filtros 'all'
      const cleanFilters = Object.entries(filtersToUse).reduce((acc, [key, value]) => {
        if (value !== 'all' && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      const response = await crmService.getLeads(cleanFilters);
      
      if (response.success && response.data) {
        setLeads(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err: any) {
      console.error('Error cargando leads:', err);
      setError(err.message || 'Error al cargar leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ========================================
  // 📄 CARGAR LEAD INDIVIDUAL
  // ========================================
  const loadLead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crmService.getLead(id);
      
      if (response.success && response.data) {
        setSelectedLead(response.data);
        return response.data;
      }
    } catch (err: any) {
      console.error('Error cargando lead:', err);
      setError(err.message || 'Error al cargar lead');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // ➕ CREAR LEAD
  // ========================================
  const createLead = useCallback(async (leadData: CreateLeadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crmService.createLead(leadData);
      
      if (response.success && response.data) {
        // Recargar leads
        await loadLeads();
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Error al crear lead' };
    } catch (err: any) {
      console.error('Error creando lead:', err);
      const errorMsg = err.message || 'Error al crear lead';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [loadLeads]);

  // ========================================
  // ✏️ ACTUALIZAR LEAD
  // ========================================
  const updateLead = useCallback(async (id: string, leadData: UpdateLeadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crmService.updateLead(id, leadData);
      
      if (response.success && response.data) {
        // Actualizar en la lista local
        setLeads(prev => prev.map(lead => 
          lead._id === id ? response.data! : lead
        ));
        
        // Actualizar selectedLead si es el mismo
        if (selectedLead?._id === id) {
          setSelectedLead(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Error al actualizar lead' };
    } catch (err: any) {
      console.error('Error actualizando lead:', err);
      const errorMsg = err.message || 'Error al actualizar lead';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [selectedLead, loadLeads]);

  // ========================================
  // 🗑️ ELIMINAR LEAD
  // ========================================
  const deleteLead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crmService.deleteLead(id);
      
      if (response.success) {
        // Remover de la lista local
        setLeads(prev => prev.filter(lead => lead._id !== id));
        
        // Limpiar selectedLead si es el mismo
        if (selectedLead?._id === id) {
          setSelectedLead(null);
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'Error al eliminar lead' };
    } catch (err: any) {
      console.error('Error eliminando lead:', err);
      const errorMsg = err.message || 'Error al eliminar lead';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [selectedLead]);

  // ========================================
  // 🔄 CAMBIAR ESTADO
  // ========================================
  const changeStatus = useCallback(async (id: string, estado: string, razon?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crmService.changeStatus(id, estado, razon);
      
      if (response.success && response.data) {
        // Actualizar en la lista local
        setLeads(prev => prev.map(lead => 
          lead._id === id ? response.data! : lead
        ));
        
        // Actualizar selectedLead si es el mismo
        if (selectedLead?._id === id) {
          setSelectedLead(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Error al cambiar estado' };
    } catch (err: any) {
      console.error('Error cambiando estado:', err);
      const errorMsg = err.message || 'Error al cambiar estado';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [selectedLead]);

  // ========================================
  // 📝 AGREGAR ACTIVIDAD
  // ========================================
  const addActivity = useCallback(async (id: string, tipo: string, descripcion: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crmService.addActivity(id, tipo, descripcion);
      
      if (response.success && response.data) {
        // Actualizar en la lista local
        setLeads(prev => prev.map(lead => 
          lead._id === id ? response.data! : lead
        ));
        
        // Actualizar selectedLead si es el mismo
        if (selectedLead?._id === id) {
          setSelectedLead(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Error al agregar actividad' };
    } catch (err: any) {
      console.error('Error agregando actividad:', err);
      const errorMsg = err.message || 'Error al agregar actividad';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [selectedLead]);

  // ========================================
  // 👤 ASIGNAR LEAD
  // ========================================
  const assignLead = useCallback(async (id: string, usuarioId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crmService.assignLead(id, usuarioId);
      
      if (response.success && response.data) {
        // Actualizar en la lista local
        setLeads(prev => prev.map(lead => 
          lead._id === id ? response.data! : lead
        ));
        
        // Actualizar selectedLead si es el mismo
        if (selectedLead?._id === id) {
          setSelectedLead(response.data);
        }
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Error al asignar lead' };
    } catch (err: any) {
      console.error('Error asignando lead:', err);
      const errorMsg = err.message || 'Error al asignar lead';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [selectedLead]);

  // ========================================
  // 🔧 ACTUALIZAR FILTROS
  // ========================================
  const updateFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  // ========================================
  // 📄 CAMBIAR PÁGINA
  // ========================================
  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // ========================================
  // 🔄 REFRESCAR
  // ========================================
  const refresh = useCallback(() => {
    loadLeads(filters);
  }, [filters, loadLeads]);

  // ========================================
  // 🎬 CARGAR AL MONTAR
  // ========================================
  useEffect(() => {
    loadLeads();
  }, [filters]);

  // ========================================
  // 📤 RETORNAR API
  // ========================================
  return {
    // Estado
    leads,
    selectedLead,
    loading,
    error,
    pagination,
    filters,
    
    // Acciones
    setSelectedLead,
    loadLeads,
    loadLead,
    createLead,
    updateLead,
    deleteLead,
    changeStatus,
    addActivity,
    assignLead,
    updateFilters,
    changePage,
    refresh,
    
    // Helpers
    clearError: () => setError(null)
  };
};

export default useCRM;
