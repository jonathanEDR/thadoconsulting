/**
 * 📦 EXPORTACIONES - Componentes de Servicios
 * Índice central para todos los componentes del módulo de servicios
 */

// ============================================
// BADGES
// ============================================
export { EstadoBadge } from './EstadoBadge';
export { CategoriaBadge } from './CategoriaBadge';

// ============================================
// COMPONENTES PRINCIPALES
// ============================================
export { ServicioCard } from './ServicioCard';
export { ServicioList } from './ServicioList';
export { ServicioFiltersPanel } from './ServicioFilters';
export { PaqueteCard } from './PaqueteCard';
export { PaqueteForm } from './PaqueteForm';

// ============================================
// ESTADÍSTICAS
// ============================================
export {
  StatCard,
  StatsGrid,
  TopServicios,
  ResumenCompacto,
  ServicioStatsComponents
} from './ServicioStats';

// ============================================
// EXPORTACIONES POR DEFECTO
// ============================================
export { default as EstadoBadgeDefault } from './EstadoBadge';
export { default as CategoriaBadgeDefault } from './CategoriaBadge';
export { default as ServicioCardDefault } from './ServicioCard';
export { default as ServicioListDefault } from './ServicioList';
export { default as ServicioFiltersPanelDefault } from './ServicioFilters';
export { default as ServicioStatsDefault } from './ServicioStats';
