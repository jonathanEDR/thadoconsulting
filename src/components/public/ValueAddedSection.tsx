/**
 * ValueAddedSection - Componente refactorizado
 * 
 * Este archivo mantiene compatibilidad con imports existentes.
 * El componente ha sido modularizado en: ./ValueAddedSection/
 * 
 * Estructura refactorizada:
 * - types.ts: Definiciones de tipos TypeScript
 * - constants.ts: Estilos por defecto y constantes
 * - utils.ts: Funciones utilitarias reutilizables
 * - hooks/: Custom hooks para lógica de negocio
 * - components/: Componentes modulares (Header, Cards, Logos, etc.)
 * - styles/: Estilos CSS separados
 */

// Re-exportar el componente principal
export { default } from './ValueAddedSection/index';

// Re-exportar tipos para compatibilidad
export type { 
  ValueAddedSectionProps, 
  ValueAddedData, 
  ValueAddedItem, 
  ValueAddedLogo 
} from './ValueAddedSection/types';
