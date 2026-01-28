/**
 * 💰 PricingForm - Componente especializado para Precios y Comercial
 * 
 * Maneja exclusivamente:
 * - Precio base y tipo de precio
 * - Moneda
 * - Descuento
 * - Etiqueta promocional (con IA)
 * - Tiempo de entrega (con IA)
 * - Garantía (con IA)
 * 
 * Ventajas:
 * ✅ Sin race conditions - Estado aislado
 * ✅ Lógica específica y enfocada
 * ✅ 3 botones IA integrados
 * ✅ Fácil testing y mantenimiento
 */

import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

// ============================================
// INTERFACES
// ============================================

interface ServiceContext {
  serviceId?: string;
  titulo: string;
  descripcionCorta?: string;
  categoria?: string;
}

interface PricingFormProps {
  // React Hook Form integration
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  
  // Datos
  isEditMode: boolean;
  
  // Contexto del servicio (para IA)
  serviceContext: ServiceContext;
  
  // Estado de carga
  isLoading?: boolean;
  
  // Función de autocompletar IA unificada
  onAutoCompletePricing?: () => Promise<void>;
  isGeneratingPricing?: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const PricingForm: React.FC<PricingFormProps> = ({
  register,
  errors,
  isEditMode,
  serviceContext,
  isLoading = false,
  onAutoCompletePricing,
  isGeneratingPricing = false
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
            <span className="ml-4 text-gray-600 dark:text-gray-400">Cargando precios...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          💰 Precios y Comercial
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">(Configuración comercial)</span>
        </h2>

        {/* Botón de Autocompletar IA Unificado (Sutil y Compacto) */}
        {isEditMode && serviceContext.serviceId && onAutoCompletePricing && (
          <div className="mb-4 flex items-center justify-end">
            <button
              type="button"
              onClick={onAutoCompletePricing}
              disabled={isGeneratingPricing}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 dark:hover:from-purple-800/50 dark:hover:to-blue-800/50 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generar información comercial automática"
            >
              {isGeneratingPricing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border border-purple-600 border-t-transparent"></div>
                  <span className="text-xs">Generando...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">💰</span>
                  <span className="text-xs font-medium">Mejorar con IA</span>
                </>
              )}
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Precio Base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio Base (USD) *
            </label>
            <input
              type="number"
              {...register('precio', { valueAsNumber: true, required: 'El precio es obligatorio' })}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.precio && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.precio.message)}</p>
            )}
          </div>

          {/* Tipo de Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Precio
            </label>
            <select
              {...register('tipoPrecio')}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="fijo">🏷️ Precio Fijo</option>
              <option value="desde">📈 Desde (mínimo)</option>
              <option value="rango">📊 Rango de Precios</option>
              <option value="paquetes">📦 Por Paquetes</option>
              <option value="personalizado">🎯 Personalizado</option>
              <option value="consultar">💬 Consultar</option>
              <option value="suscripcion">🔄 Suscripción</option>
            </select>
          </div>

          {/* Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              {...register('descuento', { valueAsNumber: true })}
              min="0"
              max="100"
              step="1"
              placeholder="0"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Moneda
            </label>
            <select
              {...register('moneda')}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="PEN">🇵🇪 PEN (Soles)</option>
              <option value="USD">💵 USD (Dólares)</option>
              <option value="EUR">💶 EUR (Euros)</option>
              <option value="MXN">💸 MXN (Pesos Mexicanos)</option>
            </select>
          </div>

          {/* Etiqueta de Promoción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiqueta Promocional
            </label>
            <input
              type="text"
              {...register('etiquetaPromocion')}
              placeholder="Ej: ¡OFERTA ESPECIAL!, NUEVO, POPULAR"
              maxLength={50}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tiempo de Entrega */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiempo de Entrega
            </label>
            <input
              type="text"
              {...register('tiempoEntrega')}
              placeholder="Ej: 7-10 días, 2 semanas, Inmediato"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Garantía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Garantía
            </label>
            <input
              type="text"
              {...register('garantia')}
              placeholder="Ej: 30 días, 6 meses, 1 año"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingForm;
