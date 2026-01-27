/**
 * Modal de Formulario para Crear/Editar Eventos
 * Maneja todas las propiedades del evento con validación completa
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../UI';
import type { Event } from '../../types/event';

interface EventFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  event?: Event | null;
  isLoading?: boolean;
}

/**
 * 📝 Modal de formulario para eventos
 */
const EventFormModal: React.FC<EventFormModalProps> = ({
  show,
  onClose,
  onSubmit,
  event,
  isLoading = false
}) => {
  const isEdit = !!event;

  // Estado del formulario
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    type: 'meeting',
    startDate: new Date(),
    endDate: new Date(),
    priority: 'medium',
    location: {
      type: 'physical',
      address: ''
    },
    category: 'interno',
    color: '#8B5CF6',
    allDay: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del evento al editar
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        type: event.type,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        priority: event.priority,
        location: event.location || { type: 'physical', address: '' },
        category: event.category,
        color: event.color,
        allDay: event.allDay || false,
        notes: event.notes || '',
      });
    } else {
      // Reset para nuevo evento
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setFormData({
        title: '',
        description: '',
        type: 'meeting',
        startDate: now,
        endDate: oneHourLater,
        priority: 'medium',
        location: { type: 'physical', address: '' },
        category: 'interno',
        color: '#8B5CF6',
        allDay: false,
      });
    }
  }, [event]);

  // ========================================
  // VALIDACIÓN
  // ========================================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.title && formData.title.length > 200) {
      newErrors.title = 'El título no puede exceder 200 caracteres';
    }

    if (formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // HANDLERS
  // ========================================
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar evento:', error);
      setErrors({ submit: 'Error al guardar el evento. Intenta nuevamente.' });
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  // ========================================
  // FORMATEO DE FECHAS
  // ========================================
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseDateTimeLocal = (value: string): Date => {
    return new Date(value);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? '✏️ Editar Evento' : '➕ Nuevo Evento'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error general */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300">❌ {errors.submit}</p>
              </div>
            )}

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 
                         ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Ej: Reunión con cliente"
                maxLength={200}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500"
                placeholder="Descripción del evento..."
              />
            </div>

            {/* Tipo y Categoría */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500"
                >
                  <option value="meeting">Reunión</option>
                  <option value="appointment">Cita</option>
                  <option value="reminder">Recordatorio</option>
                  <option value="event">Evento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cliente">Cliente</option>
                  <option value="interno">Interno</option>
                  <option value="personal">Personal</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha/Hora Inicio *
                </label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.startDate)}
                  onChange={(e) => handleChange('startDate', parseDateTimeLocal(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha/Hora Fin *
                </label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.endDate)}
                  onChange={(e) => handleChange('endDate', parseDateTimeLocal(e.target.value))}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500
                           ${errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.location?.address || formData.location || ''}
                onChange={(e) => handleChange('location', { type: 'physical', address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: Oficina principal, Sala de juntas"
              />
            </div>

            {/* Prioridad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div></div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.color}
                </span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allDay}
                  onChange={(e) => handleChange('allDay', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Evento de todo el día
                </span>
              </label>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas adicionales
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500"
                placeholder="Notas privadas sobre el evento..."
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleCancel}
                variant="secondary"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                         font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    {isEdit ? '💾 Guardar Cambios' : '➕ Crear Evento'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;
