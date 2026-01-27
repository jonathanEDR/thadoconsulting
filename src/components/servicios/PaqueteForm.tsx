/**
 * 📝 FORMULARIO DE PAQUETE DE SERVICIO
 * Modal/Componente para crear y editar paquetes
 */

import React, { useState } from 'react';
import type { PaqueteServicio } from '../../types/servicios';

// ============================================
// TYPES & INTERFACES
// ============================================

interface PaqueteFormProps {
  servicioId: string;
  paquete?: PaqueteServicio | null; // Si existe, es edición
  onSubmit: (data: Partial<PaqueteServicio>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface CaracteristicaItem {
  texto: string;
  incluido: boolean;
  descripcion?: string;
  icono?: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const PaqueteForm: React.FC<PaqueteFormProps> = ({
  servicioId,
  paquete,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const isEdit = Boolean(paquete);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: paquete?.nombre || '',
    descripcion: paquete?.descripcion || '',
    precio: paquete?.precio || 0,
    precioOriginal: paquete?.precioOriginal || undefined,
    moneda: paquete?.moneda || 'USD' as const,
    tipoFacturacion: paquete?.tipoFacturacion || 'unico' as const,
    caracteristicas: paquete?.caracteristicas || [] as CaracteristicaItem[],
    destacado: paquete?.destacado || false,
    disponible: paquete?.disponible ?? true,
    orden: paquete?.orden || 0,
  });

  const [caracteristicaInput, setCaracteristicaInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCaracteristica = () => {
    if (!caracteristicaInput.trim()) return;

    const newCaracteristica: CaracteristicaItem = {
      texto: caracteristicaInput.trim(),
      incluido: true,
    };

    setFormData(prev => ({
      ...prev,
      caracteristicas: [...prev.caracteristicas, newCaracteristica],
    }));

    setCaracteristicaInput('');
  };

  const handleRemoveCaracteristica = (index: number) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index),
    }));
  };

  const toggleCaracteristicaIncluido = (index: number) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map((car, i) =>
        i === index ? { ...car, incluido: !car.incluido } : car
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (formData.precio <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (formData.caracteristicas.length === 0) {
      setError('Debes agregar al menos una característica');
      return;
    }

    setError(null);

    try {
      await onSubmit({
        servicioId,
        ...formData,
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar el paquete');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Información básica */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nombre del Paquete *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          placeholder="Ej: Plan Básico, Plan Pro, Plan Enterprise"
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          placeholder="Describe qué incluye este paquete..."
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Precio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Precio *
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Precio Original (opcional)
          </label>
          <input
            type="number"
            name="precioOriginal"
            value={formData.precioOriginal || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-400 mt-1">Para mostrar descuento</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Moneda
          </label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="USD">USD ($)</option>
            <option value="MXN">MXN ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      {/* Tipo de facturación */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tipo de Facturación
        </label>
        <select
          name="tipoFacturacion"
          value={formData.tipoFacturacion}
          onChange={handleChange}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="unico">Pago Único</option>
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
          <option value="anual">Anual</option>
        </select>
      </div>

      {/* Características */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Características *
        </label>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={caracteristicaInput}
            onChange={(e) => setCaracteristicaInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCaracteristica())}
            placeholder="Ej: Acceso a todas las funciones"
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={handleAddCaracteristica}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Agregar
          </button>
        </div>

        {formData.caracteristicas.length > 0 && (
          <div className="space-y-2">
            {formData.caracteristicas.map((car, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-700/30 p-3 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => toggleCaracteristicaIncluido(idx)}
                  className={`text-xl ${car.incluido ? 'text-green-400' : 'text-gray-500'}`}
                >
                  {car.incluido ? '✓' : '✕'}
                </button>
                <span className={`flex-1 text-gray-300 ${!car.incluido ? 'line-through opacity-60' : ''}`}>
                  {car.texto}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCaracteristica(idx)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opciones */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
          />
          <div>
            <div className="text-white group-hover:text-purple-300 transition-colors">
              ★ Paquete Destacado
            </div>
            <div className="text-sm text-gray-400">
              Se mostrará con énfasis especial
            </div>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="disponible"
            checked={formData.disponible}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
          />
          <div>
            <div className="text-white group-hover:text-purple-300 transition-colors">
              ✓ Disponible para Venta
            </div>
            <div className="text-sm text-gray-400">
              El paquete está activo
            </div>
          </div>
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-semibold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              {isEdit ? 'Actualizando...' : 'Creando...'}
            </span>
          ) : (
            isEdit ? '💾 Guardar Cambios' : '+ Crear Paquete'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaqueteForm;
