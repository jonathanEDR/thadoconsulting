/**
 * ⚙️ SettingsForm - Componente especializado para Configuraciones
 * 
 * Maneja exclusivamente:
 * - Slug de URL (generación automática)
 * - Estado del servicio
 * - Tipo de soporte
 * - Opciones: destacado, activo, visible
 * - SEO completo (con generación IA)
 * - Preview SEO en tiempo real
 * 
 * Ventajas:
 * ✅ Sin race conditions - Estado aislado
 * ✅ Generación SEO completa con IA
 * ✅ Validaciones en tiempo real
 * ✅ Preview SEO dinámico
 * ✅ Fácil testing y mantenimiento
 * ✅ Usa register() igual que AdvancedContentForm para consistencia
 */

import React from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { SEOPreview } from '../../components/admin/services/SEOPreview';

// ============================================
// INTERFACES
// ============================================

interface SettingsFormProps {
  // React Hook Form integration
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  
  // Datos
  isEditMode: boolean;
  
  // Utilidades
  generateSlug: (titulo: string) => string;
  
  // Callbacks
  onGenerateSEO: () => void;
  
  // Estado
  isGenerating?: boolean;
  isLoading?: boolean;
  hasServiceId?: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const SettingsForm: React.FC<SettingsFormProps> = ({
  register,
  watch,
  isEditMode,
  generateSlug,
  onGenerateSEO,
  isGenerating = false,
  isLoading = false,
  hasServiceId = false,
}) => {
  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400">Cargando configuraciones...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ⚙️ Configuraciones Avanzadas
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">(Estado y visibilidad)</span>
        </h2>
        
        <div className="space-y-8">
          {/* URL y Slug */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">🔗 URL del Servicio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug de la URL
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {isEditMode ? '(Se actualizará al cambiar el título)' : '(Se genera automáticamente)'}
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    /servicios/
                  </span>
                  <input
                    type="text"
                    {...register('slug')}
                    placeholder={generateSlug(watch('titulo') || 'titulo-del-servicio')}
                    className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="font-medium text-purple-600 dark:text-purple-400 mb-1">URL completa:</div>
                  <div className="font-mono text-gray-700 dark:text-gray-300">
                    https://scuticompany.com/servicios/{watch('slug') || generateSlug(watch('titulo') || 'titulo-del-servicio')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y Visibilidad */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">📊 Estado y Visibilidad</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado del Servicio
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Soporte
                </label>
                <select
                  {...register('soporte')}
                  className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="basico">📧 Básico (Email)</option>
                  <option value="premium">💬 Premium (Chat + Email)</option>
                  <option value="dedicado">👨‍💼 Dedicado (Manager)</option>
                  <option value="24x7">🕐 24/7 (Soporte completo)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-4 mt-6 border-t border-gray-300 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('destacado')}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-900 dark:text-white">★ Servicio Destacado</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">(Aparece primero en listados)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('activo')}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-900 dark:text-white">✓ Servicio Activo</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">(Disponible para nuevos clientes)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('visibleEnWeb')}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-900 dark:text-white">👁️ Visible en Web</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">(Mostrar en sitio web público)</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">🔍 Optimización SEO</h3>
              <button
                type="button"
                onClick={onGenerateSEO}
                disabled={isGenerating || !hasServiceId}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="text-sm font-medium">Generando SEO...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm font-medium">Generar SEO Completo con IA</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              💡 El botón genera automáticamente: Título SEO + Descripción + Palabra Clave Principal + Palabras Clave Secundarias
            </p>

            {/* Vista Previa SEO en Tiempo Real */}
            <div className="mb-6">
              <SEOPreview
                titulo={watch('seo.titulo') || ''}
                descripcion={watch('seo.descripcion') || ''}
                url={watch('slug') ? `www.tuempresa.com/servicios/${watch('slug')}` : undefined}
              />
            </div>

            <div className="space-y-4">
              {/* 🆕 Palabra Clave Principal (Focus Keyword) - CRÍTICO PARA SEO */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                  🎯 Palabra Clave Principal (Focus Keyword)
                  <span className="text-xs text-purple-600 dark:text-purple-400 ml-2">* Más importante para SEO</span>
                </label>

                <input
                  type="text"
                  {...register('seo.palabraClavePrincipal')}
                  placeholder="ej: desarrollo web profesional"
                  maxLength={100}
                  className="w-full bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                  <p className="font-medium mb-1">💡 Tips para elegir tu palabra clave principal:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-purple-500 dark:text-purple-400">
                    <li>Usa 2-4 palabras que describan tu servicio</li>
                    <li>Piensa en qué buscaría tu cliente ideal en Google</li>
                    <li>Debe aparecer en el título y descripción SEO</li>
                  </ul>
                </div>
                {/* Análisis de la palabra clave */}
                {watch('seo.palabraClavePrincipal') && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">📊 Análisis de palabra clave:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        watch('seo.titulo')?.toLowerCase().includes(watch('seo.palabraClavePrincipal')?.toLowerCase() || '')
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {watch('seo.titulo')?.toLowerCase().includes(watch('seo.palabraClavePrincipal')?.toLowerCase() || '')
                          ? '✓ En título SEO'
                          : '✗ No está en título SEO'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        watch('seo.descripcion')?.toLowerCase().includes(watch('seo.palabraClavePrincipal')?.toLowerCase() || '')
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {watch('seo.descripcion')?.toLowerCase().includes(watch('seo.palabraClavePrincipal')?.toLowerCase() || '')
                          ? '✓ En descripción'
                          : '⚠ No está en descripción'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        watch('titulo')?.toLowerCase().includes(watch('seo.palabraClavePrincipal')?.toLowerCase() || '')
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {watch('titulo')?.toLowerCase().includes(watch('seo.palabraClavePrincipal')?.toLowerCase() || '')
                          ? '✓ En título del servicio'
                          : '⚠ No está en título'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Título SEO - Usando register() igual que AdvancedContentForm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título SEO
                </label>
                <input
                  type="text"
                  {...register('seo.titulo')}
                  placeholder="Título optimizado para motores de búsqueda"
                  maxLength={60}
                  className={`w-full bg-white dark:bg-gray-700/50 border rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    (watch('seo.titulo')?.length || 0) > 60 
                      ? 'border-red-500 focus:ring-red-500' 
                      : (watch('seo.titulo')?.length || 0) > 50
                      ? 'border-yellow-500 focus:ring-yellow-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                  }`}
                />
                <p className={`text-sm mt-1 ${
                  (watch('seo.titulo')?.length || 0) > 60 ? 'text-red-600 dark:text-red-400' :
                  (watch('seo.titulo')?.length || 0) > 50 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {watch('seo.titulo')?.length || 0}/60 caracteres
                  {(watch('seo.titulo')?.length || 0) > 60 && ' - Demasiado largo'}
                  {(watch('seo.titulo')?.length || 0) > 50 && (watch('seo.titulo')?.length || 0) <= 60 && ' - Casi al límite'}
                </p>
              </div>

              {/* Descripción SEO - Usando register() igual que AdvancedContentForm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción SEO
                </label>
                <textarea
                  {...register('seo.descripcion')}
                  placeholder="Descripción para motores de búsqueda"
                  maxLength={160}
                  rows={3}
                  className={`w-full bg-white dark:bg-gray-700/50 border rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 resize-none ${
                    (watch('seo.descripcion')?.length || 0) > 160 
                      ? 'border-red-500 focus:ring-red-500' 
                      : (watch('seo.descripcion')?.length || 0) > 150
                      ? 'border-yellow-500 focus:ring-yellow-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                  }`}
                />
                <p className={`text-sm mt-1 ${
                  (watch('seo.descripcion')?.length || 0) > 160 ? 'text-red-600 dark:text-red-400' :
                  (watch('seo.descripcion')?.length || 0) > 150 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {watch('seo.descripcion')?.length || 0}/160 caracteres
                  {(watch('seo.descripcion')?.length || 0) > 160 && ' - Demasiado largo'}
                  {(watch('seo.descripcion')?.length || 0) > 150 && (watch('seo.descripcion')?.length || 0) <= 160 && ' - Casi al límite'}
                </p>
              </div>

              {/* Palabras Clave Secundarias - Usando register() igual que AdvancedContentForm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🏷️ Palabras Clave Secundarias
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Términos relacionados adicionales</span>
                </label>
                <input
                  type="text"
                  {...register('seo.palabrasClave')}
                  placeholder="diseño web, programación, desarrollo software, aplicaciones"
                  className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  💡 Separar con comas. Estas complementan tu palabra clave principal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;
