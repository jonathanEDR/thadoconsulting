/**
 * 🏷️ GESTIÓN DE CATEGORÍAS MODAL
 * Modal completo para crear, editar y eliminar categorías
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { categoriasApi, type Categoria } from '../../services/categoriasApi';

interface GestionCategoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryChange?: () => void;
}

const ICONOS_DISPONIBLES = [
  '💻', '🎨', '📈', '🤝', '🔧', '📦', '⚙️', '🚀', '💡', '📱',
  '🌐', '📊', '🎯', '💰', '📝', '🔍', '⭐', '🔥', '💎', '🎪'
];

const COLORES_DISPONIBLES = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', 
  '#EF4444', '#6366F1', '#06B6D4', '#84CC16', '#F97316'
];

function GestionCategoriasModal({ 
  isOpen, 
  onClose, 
  onCategoryChange 
}: GestionCategoriasModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      icono: '📦',
      color: '#3B82F6'
    }
  });

  const watchedIcon = watch('icono');
  const watchedColor = watch('color');

  // Cargar categorías
  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriasApi.getAll();
      setCategorias(response.data);
    } catch (error) {
      // Error al cargar categorías
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  // Crear nueva categoría
  const handleCreate = () => {
    setEditingCategory(null);
    reset({
      nombre: '',
      descripcion: '',
      icono: '📦',
      color: '#3B82F6'
    });
    setShowForm(true);
  };

  // Editar categoría
  const handleEdit = (categoria: Categoria) => {
    setEditingCategory(categoria);
    reset({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      icono: categoria.icono,
      color: categoria.color
    });
    setShowForm(true);
  };

  // Guardar categoría (crear o editar)
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      if (editingCategory) {
        // Editar
        await categoriasApi.update(editingCategory._id, data);
      } else {
        // Crear
        await categoriasApi.create(data);
      }

      await loadCategorias();
      onCategoryChange?.();
      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar categoría
  const handleDelete = async (categoria: Categoria) => {
    if (categoria.totalServicios > 0) {
      alert(`No se puede eliminar la categoría "${categoria.nombre}" porque tiene ${categoria.totalServicios} servicios asociados.`);
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        setLoading(true);
        await categoriasApi.delete(categoria._id);
        await loadCategorias();
        onCategoryChange?.();
      } catch (error) {
        alert('Error al eliminar la categoría');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            🏷️ Gestión de Categorías
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          
          {/* Botón crear nueva */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={handleCreate}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <span>+</span>
                Nueva Categoría
              </button>
            </div>
          )}

          {/* Formulario */}
          {showForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      {...register('nombre', { required: 'El nombre es obligatorio' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: Desarrollo Web"
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      {...register('descripcion')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Descripción de la categoría"
                      rows={2}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Icono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icono: <span className="text-2xl ml-2">{watchedIcon}</span>
                    </label>
                    <div className="grid grid-cols-10 gap-2">
                      {ICONOS_DISPONIBLES.map((icono) => (
                        <button
                          key={icono}
                          type="button"
                          onClick={() => setValue('icono', icono)}
                          className={`p-2 text-xl border rounded-md hover:bg-gray-50 ${
                            watchedIcon === icono ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                          }`}
                        >
                          {icono}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color:
                      <span 
                        className="inline-block w-6 h-6 ml-2 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: watchedColor }}
                      ></span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLORES_DISPONIBLES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setValue('color', color)}
                          className={`w-10 h-10 rounded-md border-2 ${
                            watchedColor === color ? 'border-gray-600' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                </div>

                {/* Vista previa */}
                <div className="bg-white p-3 rounded-md border">
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: watchedColor }}
                  >
                    <span className="mr-1">{watchedIcon}</span>
                    {watch('nombre') || 'Nombre de la categoría'}
                  </span>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de categorías */}
          <div>
            <h3 className="text-lg font-medium mb-4">Categorías Existentes</h3>
            
            {loading ? (
              <p className="text-gray-500">Cargando categorías...</p>
            ) : categorias.length === 0 ? (
              <p className="text-gray-500">No hay categorías creadas</p>
            ) : (
              <div className="grid gap-3">
                {categorias.map((categoria) => (
                  <div
                    key={categoria._id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: categoria.color }}
                      >
                        <span className="mr-1">{categoria.icono}</span>
                        {categoria.nombre}
                      </span>
                      <div className="text-sm text-gray-600">
                        <p>{categoria.descripcion}</p>
                        <p className="text-xs">
                          {categoria.totalServicios} servicio{categoria.totalServicios !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-200 rounded hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(categoria)}
                        disabled={categoria.totalServicios > 0}
                        className={`px-3 py-1 text-sm border rounded ${
                          categoria.totalServicios > 0
                            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-800'
                        }`}
                        title={categoria.totalServicios > 0 ? 'No se puede eliminar: tiene servicios asociados' : 'Eliminar categoría'}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export { GestionCategoriasModal };
export default GestionCategoriasModal;