/**
 * 🔍 useDebugBlocks Hook
 * 
 * Hook para debugging de bloques en desarrollo.
 * Expone los bloques en window para inspección en DevTools.
 * Solo activo en modo desarrollo.
 */

import { useEffect } from 'react';
import type { Block } from '../components/ai-assistant/BlockEditor/types';

interface DebugBlocksState {
  caracteristicas: Block[];
  beneficios: Block[];
  incluye: Block[];
  noIncluye: Block[];
  faq: Block[];
}

export const useDebugBlocks = (
  caracteristicasBlocks: Block[],
  beneficiosBlocks: Block[],
  incluyeBlocks: Block[],
  noIncluyeBlocks: Block[],
  faqBlocks: Block[]
) => {
  useEffect(() => {
    // Solo en desarrollo
    if (import.meta.env.DEV) {
      const debugState: DebugBlocksState = {
        caracteristicas: caracteristicasBlocks,
        beneficios: beneficiosBlocks,
        incluye: incluyeBlocks,
        noIncluye: noIncluyeBlocks,
        faq: faqBlocks
      };

      // Exponer en window para debugging
      (window as any).__debug_blocks = debugState;

      // Log cuando cambien los bloques (opcional)
      console.debug('🔍 [DEBUG] Bloques actualizados:', {
        caracteristicas: caracteristicasBlocks.length,
        beneficios: beneficiosBlocks.length,
        incluye: incluyeBlocks.length,
        noIncluye: noIncluyeBlocks.length,
        faq: faqBlocks.length
      });
    }

    // Cleanup cuando el componente se desmonte
    return () => {
      if (import.meta.env.DEV && (window as any).__debug_blocks) {
        delete (window as any).__debug_blocks;
      }
    };
  }, [
    caracteristicasBlocks,
    beneficiosBlocks,
    incluyeBlocks,
    noIncluyeBlocks,
    faqBlocks
  ]);
};

export default useDebugBlocks;