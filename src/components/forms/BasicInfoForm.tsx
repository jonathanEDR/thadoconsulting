/**
 * 📋 BasicInfoForm - Componente especializado para Información Básica
 * 
 * Maneja exclusivamente:
 * - Título del servicio (con IA)
 * - Slug (generación automática)
 * - Descripción completa (con IA)
 * - Descripción corta (con IA)
 * - Categoría (con modal para crear)
 * - Estado del servicio
 * - Etiquetas (agregar/eliminar)
 * - Opciones: destacado, activo, visible
 * 
 * ⚠️ NOTA: Precio se configura en PricingForm (Panel Precios)
 * ⚠️ NOTA: Icono fue removido - campo obsoleto no utilizado en UI
 * 
 * Ventajas:
 * ✅ Sin race conditions - Estado aislado
 * ✅ Lógica específica y enfocada
 * ✅ Integración con modales externos
 * ✅ Fácil testing y mantenimiento
 */

import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import AutoCompleteBasicInfoButton from '../ai-assistant/AutoCompleteBasicInfoButton';
import type { Categoria } from '../../services/categoriasApi';

// ============================================
// INTERFACES
// ============================================

interface ServiceContext {
  serviceId?: string;
  titulo: string;
  descripcionCorta?: string;
  categoria?: string;
}

interface BasicInfoFormProps {
  // React Hook Form integration
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  
  // Datos
  isEditMode: boolean;
  categorias: Categoria[];
  loadingCategorias?: boolean;
  
  // Etiquetas
  etiquetaInput: string;
  onEtiquetaInputChange: (value: string) => void;
  onAddEtiqueta: () => void;
  onRemoveEtiqueta: (index: number) => void;
  onEtiquetaKeyPress: (e: React.KeyboardEvent) => void;
  
  // Callbacks
  onShowCreateCategoriaModal: () => void;
  
  // Utilidades
  generateSlug: (titulo: string) => string;
  
  // Contexto del servicio (para IA)
  serviceContext: ServiceContext;
  
  // Estado de carga
  isLoading?: boolean;
  
  // ✅ NUEVAS PROPS PARA AUTOCOMPLETADO
  onAutoCompleteBasicInfo?: () => void;
  isGenerating?: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  register,
  watch,
  // setValue, // ✅ Comentado - no se usa en este componente
  errors,
  isEditMode,
  categorias,
  loadingCategorias = false,
  etiquetaInput,
  onEtiquetaInputChange,
  onAddEtiqueta,
  onRemoveEtiqueta,
  onEtiquetaKeyPress,
  onShowCreateCategoriaModal,
  // generateSlug, // ✅ Comentado - no se usa en este componente
  serviceContext,
  isLoading = false,
  // ✅ NUEVAS PROPS
  onAutoCompleteBasicInfo,
  isGenerating = false,
}) => {
  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-4 lg:py-8 px-4 lg:px-6">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-4 lg:p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400">Cargando información básica...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 lg:py-8 px-4 lg:px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
          📋 Información Básica
          <span className="text-xs lg:text-sm font-normal text-gray-600 dark:text-gray-400">(Obligatorio)</span>
        </h2>

        {/* ✅ BOTÓN DE AUTOCOMPLETADO INTELIGENTE - COMPACTO Y SUTIL */}
        {isEditMode && onAutoCompleteBasicInfo && (
          <div className="mb-6 flex justify-end gap-3">
            <AutoCompleteBasicInfoButton
              onClick={onAutoCompleteBasicInfo}
              isLoading={isGenerating}
              hasServiceId={Boolean(serviceContext.serviceId)}
              currentTitle={watch('titulo')}
              currentShortDescription={watch('descripcionCorta')}
              currentDescription={watch('descripcion')}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Título */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              {...register('titulo', { required: 'El título es obligatorio' })}
              placeholder="Ej: Desarrollo Web Profesional"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.titulo && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.titulo.message)}</p>
            )}
          </div>

          {/* Categoría y Estado */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoría *
              </label>
              <button
                type="button"
                onClick={onShowCreateCategoriaModal}
                className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                <span className="text-xs">➕</span>
                Nueva
              </button>
            </div>
            <select
              {...register('categoria', { required: 'La categoría es obligatoria' })}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loadingCategorias}
            >
              <option value="">
                {loadingCategorias ? 'Cargando categorías...' : 'Selecciona una categoría'}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.icono} {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.categoria.message)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              {...register('estado')}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="activo">✓ Activo</option>
              <option value="desarrollo">⚙️ En desarrollo</option>
              <option value="pausado">⏸️ Pausado</option>
              <option value="descontinuado">❌ Descontinuado</option>
            </select>
          </div>

          {/* Descripción corta */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Corta
            </label>
            <input
              type="text"
              {...register('descripcionCorta')}
              placeholder="Resumen breve del servicio (máx. 200 caracteres)"
              maxLength={200}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Descripción completa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Completa *
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              rows={5}
              placeholder="Describe el servicio en detalle..."
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            {errors.descripcion && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.descripcion.message)}</p>
            )}
          </div>

          {/* Etiquetas */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiquetas
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Presiona Enter para agregar)</span>
            </label>
            <div className="space-y-3">
              {/* Input para agregar etiquetas */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={etiquetaInput}
                  onChange={(e) => onEtiquetaInputChange(e.target.value)}
                  onKeyPress={onEtiquetaKeyPress}
                  placeholder="Ej: react, desarrollo, web..."
                  className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={onAddEtiqueta}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  Agregar
                </button>
              </div>
              
              {/* Lista de etiquetas */}
              {watch('etiquetas')?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watch('etiquetas').map((etiqueta: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full border border-purple-200 dark:border-purple-700"
                    >
                      {etiqueta}
                      <button
                        type="button"
                        onClick={() => onRemoveEtiqueta(index)}
                        className="ml-1 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Opciones */}
          <div className="md:col-span-2 space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('destacado')}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white">★ Servicio Destacado</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('activo')}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white">✓ Servicio Activo</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('visibleEnWeb')}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white">👁️ Visible en Web</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
