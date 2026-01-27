/**
 * 🚀 DEMO DE OPTIMIZACIONES
 * Página demo que muestra todas las optimizaciones de rendimiento implementadas
 */

import { useState } from 'react';
import { LazyImage } from '../../components/common/LazyImage';
import { 
  SkeletonCard, 
  SkeletonGrid, 
  SkeletonList, 
  SkeletonTable,
  SkeletonText
} from '../../components/common/Skeleton';
import { PaginationControls } from '../../components/common/PaginationControls';
import { useVirtualPagination } from '../../hooks/useVirtualPagination';
import { useCache } from '../../hooks/useCache';

// Datos de ejemplo
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    title: `Item ${i + 1}`,
    description: `Descripción del item ${i + 1}`,
    image: `https://picsum.photos/seed/${i}/400/300`
  }));
};

const MOCK_DATA = generateMockData(50);

export const PerformanceDemo = () => {
  const [activeTab, setActiveTab] = useState<'lazy' | 'skeleton' | 'pagination' | 'cache'>('lazy');
  const [loading, setLoading] = useState(false);
  
  // Cache hook demo
  const cache = useCache({ ttl: 60000, maxSize: 10 });

  // Pagination demo
  const {
    pageData,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    itemsPerPage,
    setItemsPerPage,
    startIndex,
    endIndex,
    totalItems
  } = useVirtualPagination({
    data: MOCK_DATA,
    itemsPerPage: 6,
    initialPage: 1
  });

  // Simular carga
  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  // Demo de caché
  const handleCacheDemo = async () => {
    const key = 'demo-data';
    
    // Guardar en caché
    cache.set(key, { message: 'Datos en caché', timestamp: Date.now() });
    
    // Obtener del caché
    const cached = cache.get(key);
    console.log('Cached data:', cached);
    
    alert(`✅ Datos guardados en caché. Tamaño del caché: ${cache.size()}`);
  };

  const handleCacheFetch = async () => {
    const data = await cache.getOrFetch('api-data', async () => {
      // Simular fetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Datos desde API', timestamp: Date.now() };
    });
    
    console.log('Fetched data:', data);
    alert('✅ Datos obtenidos (revisa la consola)');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Demo de Optimizaciones de Rendimiento
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora las mejoras de rendimiento implementadas en Sprint 4 Task 6
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'lazy', label: '🖼️ Lazy Loading', icon: '⚡' },
            { id: 'skeleton', label: '💀 Skeleton Loaders', icon: '⏳' },
            { id: 'pagination', label: '📄 Virtual Pagination', icon: '📊' },
            { id: 'cache', label: '💾 Caché', icon: '🚀' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de las tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Tab: Lazy Loading */}
          {activeTab === 'lazy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🖼️ Lazy Loading de Imágenes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Las imágenes se cargan solo cuando están visibles en el viewport, mejorando significativamente el rendimiento inicial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <LazyImage
                      src={`https://picsum.photos/seed/${i}/400/300`}
                      alt={`Demo image ${i}`}
                      className="rounded-lg h-48"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Imagen {i}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">✨ Beneficios:</h3>
                <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 space-y-1">
                  <li>Reduce el tiempo de carga inicial</li>
                  <li>Ahorra ancho de banda</li>
                  <li>Mejor experiencia de usuario</li>
                  <li>Placeholder mientras carga</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Skeleton Loaders */}
          {activeTab === 'skeleton' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  💀 Skeleton Loaders
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Placeholders visuales que mejoran la percepción de velocidad durante la carga de contenido.
                </p>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={simulateLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Simular Carga
                </button>
              </div>

              {loading ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skeleton Grid (Cards):</h3>
                    <SkeletonGrid items={6} columns={3} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skeleton List:</h3>
                    <SkeletonList items={5} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skeleton Table:</h3>
                    <SkeletonTable rows={5} columns={4} />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                      Contenido Cargado
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Haz clic en "Simular Carga" para ver los skeletons en acción
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tipos disponibles:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium mb-2">SkeletonCard</h4>
                        <SkeletonCard />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium mb-2">SkeletonText</h4>
                        <SkeletonText lines={4} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">✨ Beneficios:</h3>
                <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 space-y-1">
                  <li>Mejora la percepción de velocidad</li>
                  <li>Reduce la frustración del usuario</li>
                  <li>Indica que algo está cargando</li>
                  <li>Mantiene el layout estable</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Virtual Pagination */}
          {activeTab === 'pagination' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📄 Paginación Virtual
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Renderiza solo los elementos visibles, mejorando drásticamente el rendimiento con listas grandes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pageData.map((item) => (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <LazyImage
                      src={item.image}
                      alt={item.title}
                      className="rounded-lg h-40"
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                className="mt-6"
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">✨ Beneficios:</h3>
                <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 space-y-1">
                  <li>Reduce el DOM virtual (solo {itemsPerPage} elementos de {totalItems})</li>
                  <li>Mejora el tiempo de renderizado</li>
                  <li>Navegación eficiente en listas grandes</li>
                  <li>Control personalizado de items por página</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Cache */}
          {activeTab === 'cache' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  💾 Sistema de Caché
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Almacena datos en memoria con TTL para evitar peticiones redundantes al servidor.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📥 Guardar en Caché
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Guarda datos en memoria para acceso rápido
                  </p>
                  <button
                    onClick={handleCacheDemo}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Set Cache
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🔄 Get or Fetch
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Obtiene del caché o hace fetch si no existe
                  </p>
                  <button
                    onClick={handleCacheFetch}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Get or Fetch
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📊 Estado del Caché
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
                      <span className="font-medium">{cache.size()} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">TTL:</span>
                      <span className="font-medium">60s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Size:</span>
                      <span className="font-medium">10 items</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🗑️ Limpiar Caché
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Elimina todos los datos del caché
                  </p>
                  <button
                    onClick={() => {
                      cache.clear();
                      alert('✅ Caché limpiado');
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">✨ Beneficios:</h3>
                <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 space-y-1">
                  <li>Reduce peticiones al servidor</li>
                  <li>Respuesta instantánea con datos cacheados</li>
                  <li>TTL configurable para datos frescos</li>
                  <li>Gestión automática de memoria</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Resumen de optimizaciones */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Resumen de Optimizaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Lazy Loading</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Carga bajo demanda</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💀</div>
              <h3 className="font-semibold mb-1">Skeletons</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mejor UX de carga</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-semibold mb-1">Paginación</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Renderizado eficiente</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💾</div>
              <h3 className="font-semibold mb-1">Caché</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Menos peticiones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDemo;
