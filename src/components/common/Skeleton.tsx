/**
 * 💀 SKELETON LOADERS
 * Componentes de carga esquelética para mejorar la UX durante la carga
 */

// ============================================
// SKELETON BASE
// ============================================

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = ({
  className = '',
  width,
  height,
  circle = false,
  animation = 'pulse'
}: SkeletonProps) => {
  const animationClass = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  }[animation];

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${circle ? 'rounded-full' : 'rounded-md'}
        ${animationClass}
        ${className}
      `}
      style={style}
    />
  );
};

// ============================================
// SKELETON CARD - Para tarjetas de servicio
// ============================================

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Imagen */}
      <Skeleton height={200} className="w-full" />
      
      {/* Título */}
      <Skeleton height={24} width="80%" />
      
      {/* Descripción */}
      <div className="space-y-2">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="70%" />
      </div>
      
      {/* Categoría y precio */}
      <div className="flex items-center justify-between">
        <Skeleton height={24} width={100} />
        <Skeleton height={28} width={80} />
      </div>
      
      {/* Botones */}
      <div className="flex gap-2">
        <Skeleton height={40} className="flex-1" />
        <Skeleton height={40} className="flex-1" />
      </div>
    </div>
  );
};

// ============================================
// SKELETON TABLE - Para tablas
// ============================================

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable = ({ rows = 5, columns = 4 }: SkeletonTableProps) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} height={20} className="flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} height={20} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

// ============================================
// SKELETON LIST - Para listas
// ============================================

interface SkeletonListProps {
  items?: number;
}

export const SkeletonList = ({ items = 5 }: SkeletonListProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`item-${index}`} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Skeleton circle width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton height={20} width="60%" />
            <Skeleton height={16} width="40%" />
          </div>
          <Skeleton height={36} width={80} />
        </div>
      ))}
    </div>
  );
};

// ============================================
// SKELETON GRID - Para grids de tarjetas
// ============================================

interface SkeletonGridProps {
  items?: number;
  columns?: 1 | 2 | 3 | 4;
}

export const SkeletonGrid = ({ items = 6, columns = 3 }: SkeletonGridProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={`card-${index}`} />
      ))}
    </div>
  );
};

// ============================================
// SKELETON TEXT - Para bloques de texto
// ============================================

interface SkeletonTextProps {
  lines?: number;
}

export const SkeletonText = ({ lines = 3 }: SkeletonTextProps) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={`line-${index}`}
          height={16}
          width={index === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
};

// ============================================
// SKELETON DASHBOARD - Para el dashboard
// ============================================

export const SkeletonDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`metric-${i}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
            <Skeleton height={16} width={120} />
            <Skeleton height={32} width={80} />
            <Skeleton height={20} width={60} />
          </div>
        ))}
      </div>
      
      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`chart-${i}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <Skeleton height={24} width={200} />
            <Skeleton height={300} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
