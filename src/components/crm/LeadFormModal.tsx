import React, { useState, useEffect } from 'react';
import { validarEmail, validarCelular } from '../../services/crmService';
import { categoriasApi, type Categoria } from '../../services/categoriasApi';
import type { Lead } from '../../services/crmService';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
  lead?: Lead | null;
  mode: 'create' | 'edit';
}

/**
 * 📝 Modal de formulario para crear/editar leads
 */
export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    correo: '',
    empresa: '',
    tipoServicio: '',
    descripcionProyecto: '',
    presupuestoEstimado: '',
    fechaDeseada: '',
    prioridad: 'media',
    origen: 'web',
    tags: ''
  });

  // Cargar datos del lead si está en modo edición
  useEffect(() => {
    if (mode === 'edit' && lead) {
      setFormData({
        nombre: lead.nombre,
        celular: lead.celular,
        correo: lead.correo,
        empresa: lead.empresa || '',
        tipoServicio: lead.tipoServicio,
        descripcionProyecto: lead.descripcionProyecto,
        presupuestoEstimado: lead.presupuestoEstimado?.toString() || '',
        fechaDeseada: lead.fechaDeseada ? new Date(lead.fechaDeseada).toISOString().split('T')[0] : '',
        prioridad: lead.prioridad,
        origen: lead.origen,
        tags: lead.tags?.join(', ') || ''
      });
    } else {
      // Reset en modo crear
      setFormData({
        nombre: '',
        celular: '',
        correo: '',
        empresa: '',
        tipoServicio: '',
        descripcionProyecto: '',
        presupuestoEstimado: '',
        fechaDeseada: '',
        prioridad: 'media',
        origen: 'web',
        tags: ''
      });
    }
    setErrors({});
  }, [mode, lead, isOpen]);

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  const loadCategorias = async () => {
    try {
      const response = await categoriasApi.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      // Fallback a categorías hardcodeadas en caso de error
      setCategorias([]);
    }
  };

  // ========================================
  // 🔧 VALIDACIÓN
  // ========================================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Celular
    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    } else if (!validarCelular(formData.celular)) {
      newErrors.celular = 'Formato de celular inválido';
    }

    // Correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!validarEmail(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }

    // Descripción del proyecto
    if (!formData.descripcionProyecto.trim()) {
      newErrors.descripcionProyecto = 'La descripción del proyecto es requerida';
    } else if (formData.descripcionProyecto.trim().length < 10) {
      newErrors.descripcionProyecto = 'La descripción debe tener al menos 10 caracteres';
    }

    // Presupuesto (opcional pero debe ser válido)
    if (formData.presupuestoEstimado && isNaN(Number(formData.presupuestoEstimado))) {
      newErrors.presupuestoEstimado = 'El presupuesto debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // 📤 SUBMIT
  // ========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos
      const submitData: any = {
        nombre: formData.nombre.trim(),
        celular: formData.celular.trim(),
        correo: formData.correo.trim(),
        empresa: formData.empresa.trim() || undefined,
        tipoServicio: formData.tipoServicio,
        descripcionProyecto: formData.descripcionProyecto.trim(),
        presupuestoEstimado: formData.presupuestoEstimado ? Number(formData.presupuestoEstimado) : undefined,
        fechaDeseada: formData.fechaDeseada || undefined,
        prioridad: formData.prioridad,
        origen: formData.origen,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      const result = await onSubmit(submitData);

      if (result.success) {
        onClose();
      } else {
        setErrors({ general: result.error || 'Error al guardar el lead' });
      }
    } catch (error) {
      console.error('Error en submit:', error);
      setErrors({ general: 'Error inesperado al guardar el lead' });
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 🔄 HANDLERS
  // ========================================
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  // ========================================
  // 🎨 RENDERIZADO
  // ========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'create' ? '➕ Crear Nuevo Lead' : '✏️ Editar Lead'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Error general */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">❌ {errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Sección: Información del Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>👤</span> Información del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Ej: Carlos Mendoza"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre}</p>
                  )}
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => handleChange('empresa', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Tech Solutions SAC"
                  />
                </div>

                {/* Celular */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Celular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.celular}
                    onChange={(e) => handleChange('celular', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                      errors.celular ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="+51 987654321"
                  />
                  {errors.celular && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.celular}</p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleChange('correo', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                      errors.correo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="ejemplo@empresa.com"
                  />
                  {errors.correo && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.correo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Información del Proyecto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>💼</span> Información del Proyecto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Servicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Servicio <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tipoServicio}
                    onChange={(e) => handleChange('tipoServicio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un tipo de servicio</option>
                    {categorias.length > 0 ? (
                      categorias.map((categoria) => (
                        <option key={categoria._id} value={categoria.slug}>
                          {categoria.icono} {categoria.nombre}
                        </option>
                      ))
                    ) : (
                      // Fallback con opciones básicas si no se cargan las categorías
                      <>
                        <option value="web">🌐 Sitio Web</option>
                        <option value="app">📱 App Móvil</option>
                        <option value="ecommerce">🛒 E-commerce</option>
                        <option value="sistemas">💻 Sistemas</option>
                        <option value="consultoria">👨‍💼 Consultoría</option>
                        <option value="diseño">🎨 Diseño</option>
                        <option value="marketing">📢 Marketing</option>
                        <option value="otro">📌 Otro</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Presupuesto Estimado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Presupuesto Estimado (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.presupuestoEstimado}
                    onChange={(e) => handleChange('presupuestoEstimado', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                      errors.presupuestoEstimado ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="5000"
                    min="0"
                    step="100"
                  />
                  {errors.presupuestoEstimado && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.presupuestoEstimado}</p>
                  )}
                </div>

                {/* Fecha Deseada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha Deseada de Entrega
                  </label>
                  <input
                    type="date"
                    value={formData.fechaDeseada}
                    onChange={(e) => handleChange('fechaDeseada', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Prioridad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) => handleChange('prioridad', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="baja">⬇️ Baja</option>
                    <option value="media">➡️ Media</option>
                    <option value="alta">⬆️ Alta</option>
                    <option value="urgente">🔥 Urgente</option>
                  </select>
                </div>
              </div>

              {/* Descripción del Proyecto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción del Proyecto <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.descripcionProyecto}
                  onChange={(e) => handleChange('descripcionProyecto', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                    errors.descripcionProyecto ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Describe detalladamente el proyecto que necesitas..."
                />
                {errors.descripcionProyecto && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcionProyecto}</p>
                )}
              </div>
            </div>

            {/* Sección: Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>📋</span> Información Adicional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Origen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Origen del Lead
                  </label>
                  <select
                    value={formData.origen}
                    onChange={(e) => handleChange('origen', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="web">🌐 Sitio Web</option>
                    <option value="referido">👥 Referido</option>
                    <option value="redes_sociales">📱 Redes Sociales</option>
                    <option value="email">📧 Email</option>
                    <option value="telefono">📞 Teléfono</option>
                    <option value="evento">🎯 Evento</option>
                    <option value="chat">💬 Chat</option>
                    <option value="otro">📌 Otro</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="urgente, corporativo, diseño"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Ejemplo: urgente, corporativo, landing page
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Guardando...</span>
              </>
            ) : (
              <span>{mode === 'create' ? '➕ Crear Lead' : '💾 Guardar Cambios'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
