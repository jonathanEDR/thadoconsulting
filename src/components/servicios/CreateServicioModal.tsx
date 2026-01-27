/**
 * 🆕 MODAL DE CREAR SERVICIO
 * Modal para crear un nuevo servicio usando el formulario existente
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { serviciosApi } from '../../services/serviciosApi';
import { uploadImage } from '../../services/imageService';
import { useNotification } from '../../hooks/useNotification';
import { categoriasApi, type Categoria } from '../../services/categoriasApi';
import { Modal } from '../common/Modal';
import { ImageUploader } from '../common/ImageUploader';
import { CreateCategoriaModal } from '../categorias/CreateCategoriaModal';

interface CreateServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  titulo: string;
  descripcion?: string;
  descripcionCorta?: string;
  categoria: string; // ID de la categoría
  precio?: number;
  tipoPrecio: 'fijo' | 'rango' | 'personalizado';
  moneda?: 'USD' | 'MXN' | 'EUR' | 'PEN';
  destacado: boolean;
  activo: boolean;
  caracteristicas: string[];
  etiquetas: string[];
  imagenPrincipal?: string;
  imagenes: string[];
}

export const CreateServicioModal: React.FC<CreateServicioModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [caracteristicaInput, setCaracteristicaInput] = useState('');
  const [etiquetaInput, setEtiquetaInput] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [showCreateCategoriaModal, setShowCreateCategoriaModal] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      titulo: '',
      descripcion: '',
      descripcionCorta: '',
      categoria: '',
      precio: 0,
      tipoPrecio: 'fijo',
      destacado: false,
      activo: true,
      caracteristicas: [],
      etiquetas: [],
      imagenes: [],
      moneda: 'PEN' // Soles peruanos por defecto
    }
  });

  const watchedFields = watch();

  // Manejar cierre del modal
  const handleClose = () => {
    reset();
    setCaracteristicaInput('');
    setEtiquetaInput('');
    onClose();
  };

  // Agregar característica
  const addCaracteristica = () => {
    if (caracteristicaInput.trim()) {
      const currentCaracteristicas = watchedFields.caracteristicas || [];
      setValue('caracteristicas', [...currentCaracteristicas, caracteristicaInput.trim()]);
      setCaracteristicaInput('');
    }
  };

  // Eliminar característica
  const removeCaracteristica = (index: number) => {
    const currentCaracteristicas = watchedFields.caracteristicas || [];
    setValue('caracteristicas', currentCaracteristicas.filter((_, i) => i !== index));
  };

  // Agregar etiqueta
  const addEtiqueta = () => {
    if (etiquetaInput.trim()) {
      const currentEtiquetas = watchedFields.etiquetas || [];
      setValue('etiquetas', [...currentEtiquetas, etiquetaInput.trim()]);
      setEtiquetaInput('');
    }
  };

  // Eliminar etiqueta
  const removeEtiqueta = (index: number) => {
    const currentEtiquetas = watchedFields.etiquetas || [];
    setValue('etiquetas', currentEtiquetas.filter((_, i) => i !== index));
  };

  // Cargar categorías desde el API
  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const response = await categoriasApi.getActivas();
      setCategorias(response);
    } catch (err: any) {
      // Error al cargar categorías
    } finally {
      setLoadingCategorias(false);
    }
  };

  // Manejar éxito al crear nueva categoría
  const handleCategoriaCreated = (nuevaCategoria: Categoria) => {
    setCategorias(prev => [...prev, nuevaCategoria].sort((a, b) => a.orden - b.orden));
    setValue('categoria', nuevaCategoria._id); // Seleccionar automáticamente la nueva categoría
    setShowCreateCategoriaModal(false);
  };

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  // Manejar subida de imagen principal
  const handleMainImageUpload = async (file: File | null, previewUrl: string | null) => {
    // Caso 1: Se seleccionó una imagen de la galería (file = null, previewUrl = URL)
    if (!file && previewUrl) {
      setValue('imagenPrincipal', previewUrl);
      success('Imagen seleccionada correctamente');
      return;
    }

    // Caso 2: Se eliminó la imagen (file = null, previewUrl = null)
    if (!file && !previewUrl) {
      setValue('imagenPrincipal', '');
      return;
    }

    // Caso 3: Se subió un archivo nuevo (file = File, previewUrl puede ser cualquier cosa)
    if (file) {
      setUploadingMainImage(true);
      try {
        const imageData = await uploadImage({
          file,
          category: 'servicios',
          title: watchedFields.titulo || file.name,
          alt: watchedFields.titulo || '',
          description: `Imagen del servicio: ${watchedFields.titulo || file.name}`
        });
        
        setValue('imagenPrincipal', imageData.url);
        success('Imagen principal subida correctamente');
        
      } catch (err: any) {
        error('Error al subir imagen principal', err.message || 'Error desconocido');
      } finally {
        setUploadingMainImage(false);
      }
    }
  };

  // Enviar formulario
  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Generar un slug único basado en el título + timestamp
      const timestamp = Date.now();
      const slugBase = formData.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales
        .replace(/^-+|-+$/g, ''); // Quitar guiones del inicio y final
      
      const slug = `${slugBase}-${timestamp}`;

      // Preparar datos para la API
      const servicioData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion || formData.titulo, // Usar título como descripción si no hay
        descripcionCorta: formData.descripcionCorta || '',
        categoria: formData.categoria,
        precio: formData.precio,
        tipoPrecio: formData.tipoPrecio,
        destacado: formData.destacado,
        activo: formData.activo,
        caracteristicas: formData.caracteristicas,
        etiquetas: formData.etiquetas,
        imagen: formData.imagenPrincipal,
        imagenes: formData.imagenes,
        slug: slug, // Slug único generado
        estado: 'activo' as const,
        visibleEnWeb: true,
        moneda: formData.moneda || 'PEN' as const,
        icono: '🚀'
      };
      
      await serviciosApi.create(servicioData);
      success('Servicio creado exitosamente');
      handleClose();
      onSuccess?.();
    } catch (err: any) {
      error('Error al crear el servicio', err.response?.data?.error || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🆕 Crear Nuevo Servicio"
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título del Servicio *
            </label>
            <input
              type="text"
              {...register('titulo', { required: 'El título es requerido' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Desarrollo de Sitio Web"
            />
            {errors.titulo && (
              <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoría *
              </label>
              <button
                type="button"
                onClick={() => setShowCreateCategoriaModal(true)}
                className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                <span className="text-xs">➕</span>
                Nueva
              </button>
            </div>
            <select
              {...register('categoria', { required: 'La categoría es requerida' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loadingCategorias}
            >
              <option value="">
                {loadingCategorias ? 'Cargando categorías...' : 'Selecciona una categoría'}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.icono} {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.categoria.message)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Precio
            </label>
            <select
              {...register('tipoPrecio')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="fijo">💰 Precio Fijo</option>
              <option value="rango">📊 Rango de Precios</option>
              <option value="personalizado">🎯 Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Moneda
            </label>
            <select
              {...register('moneda')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="PEN">🇵🇪 Soles (S/)</option>
              <option value="USD">🇺🇸 Dólares ($)</option>
              <option value="MXN">🇲🇽 Pesos Mexicanos (MXN)</option>
              <option value="EUR">🇪🇺 Euros (€)</option>
            </select>
          </div>

          {watchedFields.tipoPrecio !== 'personalizado' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio ({watchedFields.moneda || 'PEN'})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('precio', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'El precio debe ser mayor a 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
              {errors.precio && (
                <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Descripciones */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Corta
            </label>
            <input
              type="text"
              {...register('descripcionCorta')}
              maxLength={150}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Breve descripción del servicio (máx. 150 caracteres)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Completa
            </label>
            <textarea
              {...register('descripcion')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Descripción detallada del servicio..."
            />
          </div>
        </div>

        {/* Imagen Principal */}
        <div>
          <ImageUploader
            label="Imagen Principal"
            currentImage={watchedFields.imagenPrincipal}
            onImageChange={handleMainImageUpload}
            uploading={uploadingMainImage}
            helpText="Subir imagen principal del servicio"
          />
        </div>

        {/* Características */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Características
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={caracteristicaInput}
              onChange={(e) => setCaracteristicaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCaracteristica())}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Agregar característica..."
            />
            <button
              type="button"
              onClick={addCaracteristica}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Agregar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedFields.caracteristicas?.map((caracteristica, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
              >
                {caracteristica}
                <button
                  type="button"
                  onClick={() => removeCaracteristica(index)}
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Etiquetas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etiquetas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={etiquetaInput}
              onChange={(e) => setEtiquetaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEtiqueta())}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Agregar etiqueta..."
            />
            <button
              type="button"
              onClick={addEtiqueta}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedFields.etiquetas?.map((etiqueta, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                #{etiqueta}
                <button
                  type="button"
                  onClick={() => removeEtiqueta(index)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Opciones */}
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('destacado')}
              className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">★ Servicio destacado</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('activo')}
              className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">✅ Servicio activo</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              <>
                ✨ Crear Servicio
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Modal para crear nueva categoría */}
      <CreateCategoriaModal
        isOpen={showCreateCategoriaModal}
        onClose={() => setShowCreateCategoriaModal(false)}
        onSuccess={handleCategoriaCreated}
      />
    </Modal>
  );
};