/**
 * 🎨 ÍNDICE DE COMPONENTES DE OPTIMIZACIÓN
 * Exportaciones centralizadas para facilitar el uso
 */

// Lazy Loading
export { LazyImage } from './LazyImage';

// Skeleton Loaders
export {
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonTable,
  SkeletonText,
  SkeletonDashboard
} from './Skeleton';

// Paginación
export { PaginationControls } from './PaginationControls';

// Búsqueda
export { SearchWithAutocomplete } from './SearchWithAutocomplete';
export { SearchBar } from './SearchBar';

// Notificaciones
export { Toast } from './Toast';
export { ToastContainer } from './ToastContainer';

// Mapa
export { default as MapLocationPicker } from './MapLocationPicker';
export type { LocationData } from './MapLocationPicker';
export { detectarZonaIGV, DEPARTAMENTOS_PERU, DEPARTAMENTOS_EXONERADOS_IGV } from './MapLocationPicker';
