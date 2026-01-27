/**
 * 📁 CategoriesManager Component
 * Gestión completa de categorías del blog
 */

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Folder } from 'lucide-react';
import { useCategories } from '../../../hooks/blog';
import { blogCategoryApi } from '../../../services/blog';
import type { CreateCategoryDto, UpdateCategoryDto } from '../../../types/blog';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

const PREDEFINED_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6366F1',
  '#14B8A6', '#F43F5E', '#A855F7', '#22C55E', '#F59E0B'
];

const PREDEFINED_ICONS = [
  '📚', '💻', '🎨', '🚀', '💡', '🎯', '📱', '🌟',
  '🔥', '⚡', '🎓', '🏆', '🎪', '🎭', '🎬', '🎮'
];

export default function CategoriesManager() {
  
  const { categories, loading, refetch } = useCategories();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: PREDEFINED_COLORS[0],
    icon: PREDEFINED_ICONS[0]
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: PREDEFINED_COLORS[0],
      icon: PREDEFINED_ICONS[0]
    });
    setIsCreating(false);
    setEditingId(null);
  };

  // Crear categoría
  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
  };

  // Editar categoría
  const handleEdit = (categoryId: string) => {
    if (!categories) return;
    
    const category = categories.find(c => c._id === categoryId);
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color,
        icon: category.image?.alt || PREDEFINED_ICONS[0]
      });
      setEditingId(categoryId);
      setIsCreating(false);
    }
  };

  // Guardar categoría
  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert('El nombre y el slug son obligatorios');
      return;
    }

    try {
      setIsSaving(true);
      
      if (editingId) {
        // Actualizar categoría existente
        const updateData: UpdateCategoryDto = {
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
          image: {
            alt: formData.icon
          }
        };
        
        await blogCategoryApi.admin.updateCategory(editingId, updateData);
        alert('✅ Categoría actualizada exitosamente');
      } else {
        // Crear nueva categoría
        const createData: CreateCategoryDto = {
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
          image: {
            alt: formData.icon
          }
        };
        
        await blogCategoryApi.admin.createCategory(createData);
        alert('✅ Categoría creada exitosamente');
      }
      
      // Recargar categorías y resetear formulario
      await refetch();
      resetForm();
      
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert(`❌ Error al guardar la categoría: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar categoría
  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('⚠️ ¿Estás seguro de eliminar esta categoría?\n\nEsta acción no se puede deshacer.')) {
      return;
    }

    try {
      await blogCategoryApi.admin.deleteCategory(categoryId);
      alert('✅ Categoría eliminada exitosamente');
      
      // Recargar categorías
      await refetch();
      
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      alert(`❌ Error al eliminar la categoría: ${error.message || 'Error desconocido'}`);
    }
  };

  // Auto-generar slug
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }));
  };

  return (
    <div className="categories-manager max-w-6xl mx-auto space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Categorías</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organiza y clasifica el contenido de tu blog
          </p>
        </div>

        <button
          onClick={handleCreate}
          disabled={isCreating || editingId !== null}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium shadow-sm disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Formulario */}
      {(isCreating || editingId) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Tecnología"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="tecnologia"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Artículos sobre tecnología, innovación y desarrollo..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Color
              </label>
              <div className="grid grid-cols-8 gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-blue-500 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Icono */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Icono
              </label>
              <div className="grid grid-cols-8 gap-2">
                {PREDEFINED_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`w-10 h-10 text-2xl flex items-center justify-center rounded-lg transition-all ${
                      formData.icon === icon
                        ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 scale-110'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vista previa */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Vista Previa:</p>
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-2xl">{formData.icon}</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formData.name || 'Nombre de la categoría'}
              </span>
            </div>
            {formData.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-11">
                {formData.description}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={resetForm}
              disabled={isSaving}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'Actualizar' : 'Crear'} Categoría</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lista de Categorías */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Categorías Actuales ({categories?.length || 0})
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No hay categorías
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Crea tu primera categoría para empezar a organizar el contenido
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="group relative p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.image?.alt || '📁'}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">/{category.slug}</p>
                      </div>
                    </div>
                    
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {category.postCount || 0} posts
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(category._id)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
