/**
 * ⚡ FeaturesForm - Componente especializado para Características y FAQ
 * 
 * Maneja exclusivamente:
 * - Características Principales (BlockEditor + IA)
 * - Beneficios Clave (BlockEditor + IA)
 * - Qué Incluye (BlockEditor + IA)
 * - Qué NO Incluye (BlockEditor + IA)
 * - FAQ - Preguntas Frecuentes (BlockEditor + IA)
 * 
 * Ventajas:
 * ✅ Sin race conditions - Estado aislado y manejado por parent
 * ✅ Lógica específica y enfocada
 * ✅ 5 BlockEditors con generación IA independiente
 * ✅ Fácil testing y mantenimiento
 * ✅ Reutilizable en otros formularios
 */

import React from 'react';
import BlockEditor from '../ai-assistant/BlockEditor/BlockEditor';
import type { Block } from '../ai-assistant/BlockEditor/types';

// ============================================
// INTERFACES
// ============================================

interface ServiceContext {
  serviceId?: string;
  titulo: string;
  descripcionCorta?: string;
  categoria?: string;
}

interface FeaturesFormProps {
  // Estados de bloques (manejados por el parent)
  caracteristicasBlocks: Block[];
  beneficiosBlocks: Block[];
  incluyeBlocks: Block[];
  noIncluyeBlocks: Block[];
  faqBlocks: Block[];

  // Callbacks para actualizar bloques
  onCaracteristicasChange: (blocks: Block[]) => void;
  onBeneficiosChange: (blocks: Block[]) => void;
  onIncluyeChange: (blocks: Block[]) => void;
  onNoIncluyeChange: (blocks: Block[]) => void;
  onFaqChange: (blocks: Block[]) => void;

  // Contexto del servicio
  serviceContext: ServiceContext;

  // Nueva función unificada con protección inteligente
  onAutoCompleteFeatures?: () => Promise<void>;

  // Estado de carga
  isGeneratingFeatures?: boolean; // Nuevo estado unificado
  isLoading?: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const FeaturesForm: React.FC<FeaturesFormProps> = ({
  caracteristicasBlocks,
  beneficiosBlocks,
  incluyeBlocks,
  noIncluyeBlocks,
  faqBlocks,
  onCaracteristicasChange,
  onBeneficiosChange,
  onIncluyeChange,
  onNoIncluyeChange,
  onFaqChange,
  serviceContext,
  onAutoCompleteFeatures,
  isGeneratingFeatures = false,
  isLoading = false,
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
            <span className="ml-4 text-gray-600 dark:text-gray-400">Cargando características...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ⚡ Características y Beneficios
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">(Opcional)</span>
        </h2>

        {/* Botón de Autocompletar IA Unificado (Sutil y Compacto) */}
        {onAutoCompleteFeatures && serviceContext.serviceId && (
          <div className="mb-4 flex items-center justify-end">
            <button
              type="button"
              onClick={onAutoCompleteFeatures}
              disabled={isGeneratingFeatures}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 dark:hover:from-purple-800/50 dark:hover:to-blue-800/50 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generar contenido IA solo para secciones vacías"
            >
              {isGeneratingFeatures ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border border-purple-600 border-t-transparent"></div>
                  <span className="text-xs">Generando...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">✨</span>
                  <span className="text-xs font-medium">Completar vacíos con IA</span>
                </>
              )}
            </button>
          </div>
        )}
        
        <div className="space-y-8">
          {/* Características Principales - BLOCK EDITOR */}
          <div>
            <BlockEditor
              blocks={caracteristicasBlocks}
              onChange={onCaracteristicasChange}
              config={{
                title: '⚡ Características Principales',
                allowedTypes: ['list-item'],
                placeholder: 'Agrega características principales del servicio',
                maxBlocks: 10
              }}
              serviceContext={{
                serviceId: serviceContext.serviceId,
                titulo: serviceContext.titulo,
                descripcionCorta: serviceContext.descripcionCorta,
                categoria: serviceContext.categoria
              }}
            />
          </div>

          {/* Beneficios - BLOCK EDITOR */}
          <div>
            <BlockEditor
              blocks={beneficiosBlocks}
              onChange={onBeneficiosChange}
              config={{
                title: '💎 Beneficios Clave',
                allowedTypes: ['list-item'],
                placeholder: '¿Qué beneficios obtiene el cliente?',
                maxBlocks: 10
              }}
              serviceContext={{
                serviceId: serviceContext.serviceId,
                titulo: serviceContext.titulo,
                descripcionCorta: serviceContext.descripcionCorta,
                categoria: serviceContext.categoria
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Qué Incluye - BLOCK EDITOR */}
            <div>
              <BlockEditor
                blocks={incluyeBlocks}
                onChange={onIncluyeChange}
                config={{
                  title: '✅ Qué Incluye',
                  allowedTypes: ['list-item'],
                  placeholder: 'Ej: Diseño personalizado, Hosting incluido...',
                  maxBlocks: 15
                }}
                serviceContext={{
                  serviceId: serviceContext.serviceId,
                  titulo: serviceContext.titulo,
                  descripcionCorta: serviceContext.descripcionCorta,
                  categoria: serviceContext.categoria
                }}
              />
            </div>

            {/* Qué NO Incluye - BLOCK EDITOR */}
            <div>
              <BlockEditor
                blocks={noIncluyeBlocks}
                onChange={onNoIncluyeChange}
                config={{
                  title: '❌ Qué NO Incluye',
                  allowedTypes: ['list-item'],
                  placeholder: 'Ej: Contenido de texto, Mantenimiento mensual...',
                  maxBlocks: 15
                }}
                serviceContext={{
                  serviceId: serviceContext.serviceId,
                  titulo: serviceContext.titulo,
                  descripcionCorta: serviceContext.descripcionCorta,
                  categoria: serviceContext.categoria
                }}
              />
            </div>
          </div>

          {/* FAQ - BLOCK EDITOR */}
          <div>
            <BlockEditor
              blocks={faqBlocks}
              onChange={onFaqChange}
              config={{
                title: '❓ Preguntas Frecuentes (FAQ)',
                allowedTypes: ['faq-item'],
                placeholder: 'Agrega preguntas frecuentes sobre el servicio',
                maxBlocks: 15
              }}
              serviceContext={{
                serviceId: serviceContext.serviceId,
                titulo: serviceContext.titulo,
                descripcionCorta: serviceContext.descripcionCorta,
                categoria: serviceContext.categoria
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesForm;
