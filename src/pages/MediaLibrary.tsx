import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useImageLibrary } from '../hooks/cms/useImageLibrary';
import { uploadImage, getImageStatistics, getOrphanImages, cleanupOrphanImages, updateImageMetadata } from '../services/imageService';
import { media } from '../utils/contentManagementCache';
import imageCompression from 'browser-image-compression';
import SmartDashboardLayout from '../components/SmartDashboardLayout';
import ImageMetadataEditor from '../components/ImageMetadataEditor';

const MediaLibrary = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const {
    images,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    selectedImages,
    toggleImageSelection,
    clearSelection,
    viewMode,
    toggleViewMode,
    refreshImages,
    setPage,
    deleteSelectedImages
  } = useImageLibrary();

  // Helper function para construir URLs completas de imágenes
  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  // Estado local
  const [activeTab, setActiveTab] = useState<'all' | 'orphans' | 'stats'>('all');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [orphans, setOrphans] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);

  // Configurar autenticación
  useEffect(() => {
    // La autenticación ya se configura automáticamente en AuthProvider
    // No necesitamos configurarla aquí
  }, []);

  // Cargar datos según tab activa
  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    } else if (activeTab === 'orphans') {
      loadOrphans();
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const data = await getImageStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const loadOrphans = async () => {
    try {
      const data = await getOrphanImages();
      setOrphans(data);
    } catch (err) {
      console.error('Error al cargar huérfanas:', err);
    }
  };

  const handleUpload = async (file: File, metadata: any) => {
    try {
      setUploading(true);

      // Comprimir si es necesario
      let fileToUpload = file;
      if (file.size > 1024 * 1024) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(file, options);
      }

      await uploadImage({
        file: fileToUpload,
        ...metadata
      });

      setShowUploadModal(false);
      
      // 🗑️ Invalidar cache de esta categoría para forzar refresh
      const category = filters.category || 'root';
      console.log(`🗑️ [Media] Invalidando cache de categoría después de upload: ${category}`);
      media.invalidateFolder(category);
      
      await refreshImages();
    } catch (err) {
      console.error('Error al subir imagen:', err);
      alert('Error al subir imagen: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setUploading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('¿Estás seguro de eliminar todas las imágenes huérfanas?')) return;

    try {
      const result = await cleanupOrphanImages(false);
      alert(`Se eliminaron ${result.deleted} imágenes huérfanas`);
      await loadOrphans();
      await refreshImages();
    } catch (err) {
      console.error('Error al limpiar:', err);
      alert('Error al limpiar imágenes');
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchQuery, page: 1 });
  };

  const handleEditImage = (image: any) => {
    setEditingImage(image);
    setShowMetadataEditor(true);
  };

  const handleSaveMetadata = async (metadata: any) => {
    if (!editingImage) return;

    try {
      await updateImageMetadata(editingImage._id, metadata);
      
      // 🗑️ Invalidar metadata cache para esta imagen
      console.log(`🗑️ [Media] Invalidando metadata cache: ${editingImage._id}`);
      media.invalidateMetadata(editingImage._id);
      
      await refreshImages(); // Refrescar la lista
      setShowMetadataEditor(false);
      setEditingImage(null);
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw error;
    }
  };

  const handleCloseEditor = () => {
    setShowMetadataEditor(false);
    setEditingImage(null);
  };

  return (
    <SmartDashboardLayout>
      <div className="h-full">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🖼️ Media Library
                </h1>
                {stats && (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stats.total} imágenes • {stats.totalSizeFormatted}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
              >
                <span>📤</span>
                <span>Subir Imagen</span>
              </button>
            </div>

          {/* Tabs */}
          <div className="flex flex-wrap space-x-4 mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📁 Todas las Imágenes
            </button>
            <button
              onClick={() => setActiveTab('orphans')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'orphans'
                  ? darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🗑️ Huérfanas {orphans && `(${orphans.count})`}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'stats'
                  ? darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Estadísticas
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toolbar */}
        {activeTab === 'all' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 mb-6`}>
            <div className="flex items-center justify-between flex-wrap gap-4 overflow-x-auto min-w-0">
              {/* Búsqueda */}
              <div className="flex items-center space-x-2 flex-1 min-w-[300px]">
                <input
                  type="text"
                  placeholder="Buscar imágenes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🔍
                </button>
              </div>

              {/* Filtros y acciones */}
              <div className="flex items-center space-x-2">
                {/* Filtro de categoría */}
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined, page: 1 })}
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todas las categorías</option>
                  <option value="hero">Hero</option>
                  <option value="logo">Logo</option>
                  <option value="service">Servicio</option>
                  <option value="gallery">Galería</option>
                  <option value="icon">Ícono</option>
                  <option value="banner">Banner</option>
                  <option value="avatar">Avatar</option>
                  <option value="other">Otra</option>
                </select>

                {/* Toggle vista */}
                <button
                  onClick={toggleViewMode}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                  } hover:bg-purple-600 hover:text-white transition-colors`}
                  title="Cambiar vista"
                >
                  {viewMode === 'grid' ? '📋' : '🔲'}
                </button>

                {/* Selección */}
                {selectedImages.size > 0 && (
                  <>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedImages.size} seleccionadas
                    </span>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => deleteSelectedImages(false)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenido según tab activa */}
        {activeTab === 'all' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className={`text-center py-20 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                ❌ Error: {error}
              </div>
            ) : images.length === 0 ? (
              <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                📭 No hay imágenes para mostrar
              </div>
            ) : (
              <>
                {/* Grid de imágenes */}
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                  {images.map((image) => (
                    <div
                      key={image._id}
                      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group relative`}
                    >
                      {/* Checkbox de selección */}
                      <input
                        type="checkbox"
                        checked={selectedImages.has(image._id)}
                        onChange={() => toggleImageSelection(image._id)}
                        className="absolute top-2 left-2 z-10 w-5 h-5 cursor-pointer"
                      />

                      {/* Imagen */}
                      <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => handleEditImage(image)}>
                        <img
                          src={getImageUrl(image.url)}
                          alt={image.alt || image.filename}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Error loading image:', image.url);
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyUzYuNDggMjIgMTIgMjJTMjIgMTcuNTIgMjIgMTJTMTcuNTIgMiAxMiAyWk0xMiAyMEM3LjU5IDIwIDQgMTYuNDEgNCAyMVM3LjU5IDQgMTIgNFMxOSA3LjU5IDE5IDEyUzE2LjQxIDIwIDEyIDIwWiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMTIgOUMxMC4zNCA5IDkgMTAuMzQgOSAxMkM5IDEzLjY2IDEwLjM0IDE1IDEyIDE1QzEzLjY2IDE1IDE1IDEzLjY2IDE1IDEyQzE1IDEwLjM0IDEzLjY2IDkgMTIgOVpNMTIgMTNDMTEuNDUgMTMgMTEgMTIuNTUgMTEgMTJDMTEgMTEuNDUgMTEuNDUgMTEgMTIgMTFDMTIuNTUgMTEgMTMgMTEuNDUgMTMgMTJDMTMgMTIuNTUgMTIuNTUgMTMgMTIgMTNaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=';
                          }}
                        />
                      </div>

                      {/* Información y acciones */}
                      <div className="p-3">
                        <h3 className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {image.title || image.filename}
                        </h3>
                        <div className={`text-xs mt-1 flex items-center justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>{image.sizeFormatted}</span>
                          <span>{image.dimensions}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {image.category}
                            </span>
                            {image.isOrphan && (
                              <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-600">
                                🗑️
                              </span>
                            )}
                          </div>
                          
                          {/* Botones de acción */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditImage(image);
                            }}
                            className={`p-1 rounded ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                            } transition-colors`}
                            title="Editar metadatos"
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.page === 1
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      } transition-colors`}
                    >
                      ← Anterior
                    </button>
                    <span className={`px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Página {pagination.page} de {pagination.pages}
                    </span>
                    <button
                      onClick={() => setPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.page === pagination.pages
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      } transition-colors`}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'orphans' && orphans && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Imágenes Huérfanas
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {orphans.count} imágenes sin usar • {orphans.totalSizeFormatted}
                </p>
              </div>
              {orphans.count > 0 && (
                <button
                  onClick={handleCleanup}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Limpiar Todas
                </button>
              )}
            </div>
            {/* Mostrar imágenes huérfanas similar al grid principal */}
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total de imágenes */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Imágenes</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.total}
                  </p>
                </div>
                <div className="text-4xl">📁</div>
              </div>
            </div>

            {/* Espacio usado */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Espacio Usado</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalSizeFormatted}
                  </p>
                </div>
                <div className="text-4xl">💾</div>
              </div>
            </div>

            {/* Huérfanas */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Huérfanas</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.orphans}
                  </p>
                </div>
                <div className="text-4xl">🗑️</div>
              </div>
            </div>

            {/* Por categoría */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 md:col-span-2`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Por Categoría
              </h3>
              <div className="space-y-2">
                {stats.byCategory.map((cat: any) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{cat._id}</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Por tipo */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Por Tipo
              </h3>
              <div className="space-y-2">
                {stats.byMimetype.map((type: any) => (
                  <div key={type._id} className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{type._id.split('/')[1]}</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{type.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de upload (simplificado) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Subir Imagen
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(file, { category: 'other' });
                }
              }}
              className={`w-full ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}
              disabled={uploading}
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor de metadatos */}
      {showMetadataEditor && editingImage && (
        <ImageMetadataEditor
          image={editingImage}
          onSave={handleSaveMetadata}
          onClose={handleCloseEditor}
        />
      )}
      
      </div>
    </SmartDashboardLayout>
  );
};

export default MediaLibrary;
