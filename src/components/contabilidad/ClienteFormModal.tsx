import React, { useState } from 'react';
import { Button } from '../UI';
import type { CreateClienteData, RegimenTributario, CategoriaRUS } from '../../types/contabilidad';
import { REGIMEN_LABELS } from '../../types/contabilidad';

interface ClienteFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateClienteData) => Promise<void>;
  initialData?: Partial<CreateClienteData>;
  isEditing?: boolean;
}

/**
 * 🏢 Modal para crear/editar cliente contable
 */
const ClienteFormModal: React.FC<ClienteFormModalProps> = ({ 
  onClose, 
  onSubmit, 
  initialData,
  isEditing = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateClienteData>({
    ruc: initialData?.ruc || '',
    razonSocial: initialData?.razonSocial || '',
    nombreComercial: initialData?.nombreComercial || '',
    regimenTributario: initialData?.regimenTributario || 'RUS',
    representante: {
      nombre: initialData?.representante?.nombre || '',
      cargo: initialData?.representante?.cargo || '',
      dni: initialData?.representante?.dni || '',
      telefono: initialData?.representante?.telefono || ''
    },
    contacto: {
      email: initialData?.contacto?.email || '',
      telefono: initialData?.contacto?.telefono || '',
      direccion: initialData?.contacto?.direccion || '',
      distrito: initialData?.contacto?.distrito || '',
      provincia: initialData?.contacto?.provincia || '',
      departamento: initialData?.contacto?.departamento || ''
    },
    honorarioMensual: initialData?.honorarioMensual || undefined,
    linkDrive: initialData?.linkDrive || '',
    configuracionTributaria: {
      categoriaRUS: initialData?.configuracionTributaria?.categoriaRUS || 1,
      coeficienteRenta: initialData?.configuracionTributaria?.coeficienteRenta || 0.015,
      obligaciones: initialData?.configuracionTributaria?.obligaciones || []
    },
    contadorAsignado: {
      nombre: initialData?.contadorAsignado?.nombre || '',
      email: initialData?.contadorAsignado?.email || ''
    }
  });

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      // Nested field (e.g., "representante.nombre")
      const [parent, child] = keys;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateClienteData] as Record<string, unknown>),
          [child]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (!formData.ruc || formData.ruc.length !== 11) {
      setError('El RUC debe tener exactamente 11 dígitos');
      setLoading(false);
      return;
    }
    if (!formData.razonSocial.trim()) {
      setError('La razón social es obligatoria');
      setLoading(false);
      return;
    }
    if (!formData.representante.nombre.trim()) {
      setError('El nombre del representante es obligatorio');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? '✏️ Editar Cliente Contable' : '➕ Nuevo Cliente Contable'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Datos principales */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📋 Datos Principales</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RUC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ruc}
                  onChange={(e) => handleChange('ruc', e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="20123456789"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  maxLength={11}
                  disabled={isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Régimen Tributario <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.regimenTributario}
                  onChange={(e) => handleChange('regimenTributario', e.target.value as RegimenTributario)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {(Object.keys(REGIMEN_LABELS) as RegimenTributario[]).map(key => (
                    <option key={key} value={key}>{REGIMEN_LABELS[key]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.razonSocial}
                onChange={(e) => handleChange('razonSocial', e.target.value)}
                placeholder="Empresa S.A.C."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={formData.nombreComercial || ''}
                  onChange={(e) => handleChange('nombreComercial', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Honorario Mensual (S/)
                </label>
                <input
                  type="number"
                  value={formData.honorarioMensual || ''}
                  onChange={(e) => handleChange('honorarioMensual', parseFloat(e.target.value) || undefined)}
                  placeholder="300.00"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </fieldset>

          {/* Representante */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">👤 Representante Legal</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.representante.nombre}
                  onChange={(e) => handleChange('representante.nombre', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                <input
                  type="text"
                  value={formData.representante.cargo || ''}
                  onChange={(e) => handleChange('representante.cargo', e.target.value)}
                  placeholder="Gerente General"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DNI</label>
                <input
                  type="text"
                  value={formData.representante.dni || ''}
                  onChange={(e) => handleChange('representante.dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="12345678"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  maxLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.representante.telefono || ''}
                  onChange={(e) => handleChange('representante.telefono', e.target.value)}
                  placeholder="987654321"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </fieldset>

          {/* Contacto */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📞 Datos de Contacto</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contacto?.email || ''}
                  onChange={(e) => handleChange('contacto.email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.contacto?.telefono || ''}
                  onChange={(e) => handleChange('contacto.telefono', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
              <input
                type="text"
                value={formData.contacto?.direccion || ''}
                onChange={(e) => handleChange('contacto.direccion', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distrito</label>
                <input
                  type="text"
                  value={formData.contacto?.distrito || ''}
                  onChange={(e) => handleChange('contacto.distrito', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provincia</label>
                <input
                  type="text"
                  value={formData.contacto?.provincia || ''}
                  onChange={(e) => handleChange('contacto.provincia', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departamento</label>
                <input
                  type="text"
                  value={formData.contacto?.departamento || ''}
                  onChange={(e) => handleChange('contacto.departamento', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </fieldset>

          {/* Configuración Tributaria */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">⚙️ Configuración Tributaria</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.regimenTributario === 'RUS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría RUS</label>
                  <select
                    value={formData.configuracionTributaria?.categoriaRUS || 1}
                    onChange={(e) => handleChange('configuracionTributaria.categoriaRUS', parseInt(e.target.value) as CategoriaRUS)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={1}>Categoría 1 (S/ 20/mes)</option>
                    <option value={2}>Categoría 2 (S/ 50/mes)</option>
                  </select>
                </div>
              )}
              {(formData.regimenTributario === 'MYPE' || formData.regimenTributario === 'GENERAL') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coeficiente de Renta</label>
                  <input
                    type="number"
                    value={formData.configuracionTributaria?.coeficienteRenta || 0.015}
                    onChange={(e) => handleChange('configuracionTributaria.coeficienteRenta', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    step="0.001"
                    min="0"
                    max="1"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Google Drive</label>
                <input
                  type="url"
                  value={formData.linkDrive || ''}
                  onChange={(e) => handleChange('linkDrive', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </fieldset>

          {/* Contador Asignado */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🧑‍💼 Contador Asignado</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.contadorAsignado?.nombre || ''}
                  onChange={(e) => handleChange('contadorAsignado.nombre', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contadorAsignado?.email || ''}
                  onChange={(e) => handleChange('contadorAsignado.email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </fieldset>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button loading={loading} onClick={() => {}}>
              {isEditing ? '💾 Guardar Cambios' : '➕ Crear Cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteFormModal;
