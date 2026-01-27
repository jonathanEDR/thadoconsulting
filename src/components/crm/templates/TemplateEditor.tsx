/**
 * 🎨 TEMPLATE EDITOR - Editor de Plantillas
 * Componente para crear y editar plantillas de mensajes
 */

import React, { useState, useEffect, useRef } from 'react';
import type { MessageTemplate, TemplateType, TemplateCategory } from '../../../types/message.types';
import { DEFAULT_TEMPLATE_VARIABLES } from '../../../types/message.types';

interface TemplateEditorProps {
  template?: MessageTemplate;
  onSave: (data: Partial<MessageTemplate>) => Promise<void>;
  onCancel: () => void;
  tipo?: TemplateType;
  isLoading?: boolean;
}

interface ValidationErrors {
  titulo?: string;
  contenido?: string;
  categoria?: string;
  descripcion?: string;
}

/**
 * 🎨 Componente TemplateEditor
 */
export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  tipo,
  isLoading = false,
}) => {
  // ========================================
  // 📊 STATE
  // ========================================

  const [formData, setFormData] = useState({
    titulo: template?.titulo || '',
    descripcion: template?.descripcion || '',
    contenido: template?.contenido || '',
    tipo: template?.tipo || tipo || 'mensaje_cliente' as TemplateType,
    categoria: template?.categoria || 'seguimiento' as TemplateCategory,
    etiquetas: template?.etiquetas || [],
    esActiva: template?.esActiva ?? true,
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showVariables, setShowVariables] = useState(false);
  const contenidoRef = useRef<HTMLTextAreaElement>(null);

  // ========================================
  // 🔄 EFECTOS
  // ========================================

  useEffect(() => {
    if (template) {
      setFormData({
        titulo: template.titulo,
        descripcion: template.descripcion || '',
        contenido: template.contenido,
        tipo: template.tipo,
        categoria: template.categoria || 'seguimiento',
        etiquetas: template.etiquetas || [],
        esActiva: template.esActiva ?? true,
      });
    }
  }, [template]);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo modificado
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleContenidoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    setFormData((prev) => ({ ...prev, contenido: newValue }));
    
    if (errors.contenido) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contenido;
        return newErrors;
      });
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = contenidoRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.contenido;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const varText = `{${variable}}`;
    
    const newContent = before + varText + after;
    const newCursorPos = start + varText.length;

    setFormData((prev) => ({ ...prev, contenido: newContent }));
    
    // Restaurar foco y posición del cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.etiquetas.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        etiquetas: [...prev.etiquetas, tag],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      etiquetas: prev.etiquetas.filter((t) => t !== tag),
    }));
  };

  // ========================================
  // ✅ VALIDACIÓN
  // ========================================

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Título
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (formData.titulo.length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres';
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = 'El título no puede superar 100 caracteres';
    }

    // Contenido
    if (!formData.contenido.trim()) {
      newErrors.contenido = 'El contenido es obligatorio';
    } else if (formData.contenido.length < 10) {
      newErrors.contenido = 'El contenido debe tener al menos 10 caracteres';
    } else if (formData.contenido.length > 5000) {
      newErrors.contenido = 'El contenido no puede superar 5000 caracteres';
    }

    // Categoría
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
    }
  };

  // ========================================
  // 📊 UTILIDADES
  // ========================================

  const getVariablesUsadas = (): string[] => {
    const matches = formData.contenido.match(/\{([^}]+)\}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.slice(1, -1)))];
  };

  const getVariablesDisponibles = () => {
    // Todas las variables están disponibles para todos los tipos
    return DEFAULT_TEMPLATE_VARIABLES;
  };

  const isVariableValida = (variable: string): boolean => {
    return getVariablesDisponibles().some((v) => v.variable === variable);
  };

  const getVariablesInvalidas = (): string[] => {
    return getVariablesUsadas().filter((v) => !isVariableValida(v));
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  const variablesUsadas = getVariablesUsadas();
  const variablesInvalidas = getVariablesInvalidas();
  const hasChanges = template ? (
    formData.titulo !== template.titulo ||
    formData.contenido !== template.contenido ||
    formData.descripcion !== template.descripcion ||
    formData.tipo !== template.tipo ||
    formData.categoria !== template.categoria ||
    JSON.stringify(formData.etiquetas) !== JSON.stringify(template.etiquetas) ||
    formData.esActiva !== template.esActiva
  ) : true;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{template ? '✏️' : '➕'}</span>
            {template ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <span className="text-xl">✖</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título de la plantilla *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            placeholder="Ej: Seguimiento inicial de lead"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
              errors.titulo
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={isLoading}
          />
          {errors.titulo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              ⚠️ {errors.titulo}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.titulo.length}/100 caracteres
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción (opcional)
          </label>
          <input
            type="text"
            value={formData.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            placeholder="Breve descripción del propósito de esta plantilla"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            disabled={isLoading}
          />
        </div>

        {/* Tipo y Categoría */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de mensaje *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value as TemplateType)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              disabled={isLoading || !!tipo}
            >
              <option value="nota_interna">📝 Nota Interna</option>
              <option value="mensaje_cliente">💬 Mensaje a Cliente</option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value as TemplateCategory)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                errors.categoria
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading}
            >
              <option value="bienvenida">👋 Bienvenida</option>
              <option value="seguimiento">📊 Seguimiento</option>
              <option value="propuesta">📄 Propuesta</option>
              <option value="cierre">✅ Cierre</option>
              <option value="recordatorio">⏰ Recordatorio</option>
              <option value="agradecimiento">🙏 Agradecimiento</option>
            </select>
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                ⚠️ {errors.categoria}
              </p>
            )}
          </div>
        </div>

        {/* Contenido con panel de variables */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contenido del mensaje *
            </label>
            <button
              type="button"
              onClick={() => setShowVariables(!showVariables)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showVariables ? '🔽 Ocultar' : '🔼 Mostrar'} variables
            </button>
          </div>

          {/* Panel de variables */}
          {showVariables && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-2">
                📝 Variables disponibles (click para insertar):
              </p>
              <div className="flex flex-wrap gap-2">
                {getVariablesDisponibles().map((v) => (
                  <button
                    key={v.variable}
                    type="button"
                    onClick={() => insertVariable(v.nombre)}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    title={v.descripcion}
                  >
                    {v.variable}
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            ref={contenidoRef}
            value={formData.contenido}
            onChange={handleContenidoChange}
            placeholder="Escribe el contenido de la plantilla aquí... Puedes usar variables como {nombre}, {empresa}, etc."
            rows={10}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white font-mono text-sm ${
              errors.contenido
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={isLoading}
          />
          {errors.contenido && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              ⚠️ {errors.contenido}
            </p>
          )}
          
          {/* Stats y warnings */}
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="text-gray-500 dark:text-gray-400">
              {formData.contenido.length}/5000 caracteres
              {variablesUsadas.length > 0 && (
                <span className="ml-3">
                  • {variablesUsadas.length} variable{variablesUsadas.length !== 1 ? 's' : ''} usada{variablesUsadas.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {variablesInvalidas.length > 0 && (
              <div className="text-red-600 dark:text-red-400">
                ⚠️ Variables inválidas: {variablesInvalidas.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Etiquetas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etiquetas (opcionales)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Agregar etiqueta..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!newTag.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ➕
            </button>
          </div>
          {formData.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.etiquetas.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    disabled={isLoading}
                  >
                    ✖
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Activa */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="esActiva"
            checked={formData.esActiva}
            onChange={(e) => handleInputChange('esActiva', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isLoading}
          />
          <label htmlFor="esActiva" className="text-sm text-gray-700 dark:text-gray-300">
            Plantilla activa (disponible para usar)
          </label>
        </div>

        {/* Preview */}
        {formData.contenido && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              👁️ Vista previa:
            </p>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {formData.contenido}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {hasChanges && !template && '💡 Recuerda guardar tus cambios'}
            {hasChanges && template && '⚠️ Tienes cambios sin guardar'}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <span className="animate-spin">⏳</span>}
              {template ? '💾 Guardar cambios' : '➕ Crear plantilla'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TemplateEditor;
