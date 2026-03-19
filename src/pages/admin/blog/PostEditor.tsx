/**
 * ✍️ PostEditor Component
 * Editor completo para crear y editar posts del blog
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, Eye, Send, ArrowLeft, Image as ImageIcon,
  Tag, Folder, Settings, Upload, Sparkles, X,
  Search, ChevronDown, ChevronUp, AlertCircle, CheckCircle
} from 'lucide-react';
import { RichTextEditor, ContentPreview, EnhancedEditorAISidebar } from '../../../components/blog/editor';
import { CategoryBadge } from '../../../components/blog/common';
import AIPreviewModal from '../../../components/blog/editor/AIPreviewModal';
import ImageSelectorModal from '../../../components/ImageSelectorModal';

import { useCategories } from '../../../hooks/blog';
import { generateSlug } from '../../../utils/blog';
import { blogPostApi } from '../../../services/blog';
import { uploadImage } from '../../../services/imageService';
import type { CreatePostDto, UpdatePostDto } from '../../../types/blog';

// ✅ Interface SEO para el formulario
interface SEOFormData {
  metaTitle: string;
  metaDescription: string;
  focusKeyphrase: string;
  keywords: string[];
}

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  allowComments: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  // ✅ NUEVO: Campos SEO
  seo: SEOFormData;
}

export default function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { categories } = useCategories();

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: [],
    isPublished: false,
    allowComments: true,
    isPinned: false,
    isFeatured: false,
    // ✅ NUEVO: Estado inicial SEO
    seo: {
      metaTitle: '',
      metaDescription: '',
      focusKeyphrase: '',
      keywords: []
    }
  });

  // ✅ Estado para controlar si la sección SEO está expandida
  const [showSEOSection, setShowSEOSection] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [isProcessingAI, _setIsProcessingAI] = useState(false);
  
  // Estado para el modal de preview de IA
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    originalText: string;
    expandedText: string;
    actionLabel: string;
  }>({
    isOpen: false,
    originalText: '',
    expandedText: '', 
    actionLabel: ''
  });

  // 🖼️ Estado para el modal de galería de imágenes
  const [showImageGallery, setShowImageGallery] = useState(false);

  // Cargar post si está editando
  useEffect(() => {
    if (isEditing && id) {
      loadPost(id);
    }
  }, [isEditing, id]);

  const loadPost = async (postId: string) => {
    try {
      const response = await blogPostApi.admin.getPostById(postId);
      
      if (response.success && response.data) {
        const post = response.data;
        
        // Convertir tags de objetos a strings para el formulario
        const tagsAsStrings = Array.isArray(post.tags)
          ? post.tags.map((tag: any) => 
              typeof tag === 'string' ? tag : tag.name || tag._id
            )
          : [];
        
        // ✅ Extraer keywords SEO (pueden venir como array o estar en el post)
        const postData = post as any; // Cast para acceder a propiedades opcionales
        const seoKeywords = post.seo?.keywords || 
                           postData.aiOptimization?.aiMetadata?.primaryKeywords || 
                           [];
        
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          featuredImage: post.featuredImage || '',
          category: typeof post.category === 'string' ? post.category : (post.category?._id || ''),
          tags: tagsAsStrings,
          isPublished: post.isPublished || false,
          allowComments: post.allowComments !== undefined ? post.allowComments : true,
          isPinned: post.isPinned || false,
          isFeatured: post.isFeatured || false,
          // ✅ NUEVO: Cargar campos SEO
          seo: {
            metaTitle: post.seo?.metaTitle || '',
            metaDescription: post.seo?.metaDescription || '',
            // Priorizar seo.focusKeyphrase, fallback a aiOptimization
            focusKeyphrase: post.seo?.focusKeyphrase || postData.aiOptimization?.aiMetadata?.primaryKeywords?.[0] || '',
            keywords: Array.isArray(seoKeywords) ? seoKeywords : []
          }
        });
        
        // Si hay datos SEO, expandir la sección automáticamente
        if (post.seo?.metaTitle || post.seo?.metaDescription || post.seo?.focusKeyphrase || seoKeywords.length > 0) {
          setShowSEOSection(true);
        }
      }
    } catch (error) {
      console.error('❌ [PostEditor] Error al cargar post:', error);
      alert('Error al cargar el post');
    }
  };

  // Subir imagen - MEJORADO
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = `La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo permitido: 5MB`;
      alert(errorMsg);
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      const errorMsg = `Tipo de archivo no válido: ${file.type}. Solo se permiten imágenes.`;
      alert(errorMsg);
      return;
    }

    setIsUploading(true);
    
    try {
      const imageData = await uploadImage({
        file,
        category: 'blog',
        title: formData.title || 'Imagen de post',
        alt: formData.title || 'Imagen destacada'
      });

      handleChange('featuredImage', imageData.url);
      alert('✅ Imagen subida exitosamente');
      
    } catch (error: any) {
      console.error('❌ [PostEditor] Error detallado al subir imagen:', {
        error: error.message,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        formTitle: formData.title,
        timestamp: new Date().toISOString()
      });
      
      // Mostrar error más específico al usuario
      let userMessage = '❌ Error al subir la imagen';
      
      if (error.message.includes('permisos')) {
        userMessage = '❌ No tienes permisos para subir imágenes. Verifica tu sesión.';
      } else if (error.message.includes('demasiado grande')) {
        userMessage = '❌ El archivo es demasiado grande. Máximo 5MB.';
      } else if (error.message.includes('tipo') || error.message.includes('formato')) {
        userMessage = '❌ Formato de imagen no válido. Usa JPG, PNG, GIF o WEBP.';
      } else if (error.message.includes('conexión') || error.message.includes('red')) {
        userMessage = '❌ Error de conexión. Verifica tu internet e intenta de nuevo.';
      } else if (error.message.includes('servidor')) {
        userMessage = '❌ Error del servidor. Intenta más tarde.';
      } else {
        userMessage = `❌ ${error.message}`;
      }
      
      alert(userMessage);
      
    } finally {
      setIsUploading(false);
      // Limpiar el input para permitir resubir el mismo archivo
      e.target.value = '';
    }
  };

  // Funciones para manejar el modal de preview
  const handleAcceptPreview = async () => {
    try {
      // Copiar al portapapeles
      await navigator.clipboard.writeText(previewState.expandedText);
      
      // Cerrar modal
      setPreviewState({ ...previewState, isOpen: false });
      
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#22c55e;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-family:system-ui;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
      notification.textContent = '📋 Contenido copiado al portapapeles - Pega con Ctrl+V';
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 4000);
    } catch (error) {
      console.error('❌ Error copiando al portapapeles:', error);
      alert('❌ Error copiando al portapapeles. Selecciona y copia manualmente el texto del modal.');
    }
  };

  const handleCancelPreview = () => {
    setPreviewState({ ...previewState, isOpen: false });
  };

  // Auto-generar slug desde el título
  useEffect(() => {
    if (!isEditing && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, isEditing]);

  // Manejar cambios en el formulario
  const handleChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Agregar tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Eliminar tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // ✅ NUEVO: Manejar cambios en campos SEO
  const handleSEOChange = (field: keyof SEOFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }));
  };

  // ✅ NUEVO: Agregar keyword SEO
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  // ✅ NUEVO: Eliminar keyword SEO
  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(k => k !== keywordToRemove)
      }
    }));
  };

  // ✅ NUEVO: Auto-generar SEO desde el contenido
  const handleAutoGenerateSEO = () => {
    const title = formData.title || '';
    const excerpt = formData.excerpt || '';
    const content = formData.content.replace(/<[^>]*>/g, '').trim();
    
    // Generar metaTitle si está vacío
    const autoMetaTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
    
    // Generar metaDescription si está vacío
    const autoMetaDescription = excerpt || (content.length > 160 ? content.substring(0, 157) + '...' : content);
    
    // Extraer posibles keywords del título y contenido
    const words = (title + ' ' + content).toLowerCase()
      .replace(/[^a-záéíóúüñ\s]/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 4);
    
    // Contar frecuencia y obtener las más comunes
    const wordFreq: Record<string, number> = {};
    words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
    
    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    // ✅ Generar tags adicionales (palabras más largas y relevantes)
    const tagCandidates = Object.entries(wordFreq)
      .filter(([word]) => word.length > 5) // Palabras más significativas
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalizar
    
    setFormData(prev => {
      // Combinar tags existentes con nuevos (sin duplicados)
      const existingTags = prev.tags.map(t => t.toLowerCase());
      const newTags = tagCandidates.filter(tag => !existingTags.includes(tag.toLowerCase()));
      const combinedTags = [...prev.tags, ...newTags].slice(0, 10); // Máximo 10 tags
      
      return {
        ...prev,
        tags: prev.tags.length > 0 ? prev.tags : combinedTags,
        seo: {
          metaTitle: prev.seo.metaTitle || autoMetaTitle,
          metaDescription: prev.seo.metaDescription || autoMetaDescription,
          focusKeyphrase: prev.seo.focusKeyphrase || topKeywords[0] || '',
          keywords: prev.seo.keywords.length > 0 ? prev.seo.keywords : topKeywords
        }
      };
    });
    
    setShowSEOSection(true);
  };

  // Guardar como borrador
  const handleSaveDraft = async () => {    
    const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
    
    if (!formData.title || !formData.title.trim()) {
      alert('⚠️ Por favor ingresa un título para el post');
      return;
    }
    
    if (!textContent || textContent.length === 0) {
      alert('⚠️ Por favor escribe contenido en el editor');
      return;
    }
    
    if (!formData.category) {
      alert('⚠️ Por favor selecciona una categoría');
      return;
    }

    setIsSaving(true);
    try {
      // Generar excerpt automáticamente si está vacío
      const excerpt = formData.excerpt || formData.content.replace(/<[^>]*>/g, '').substring(0, 300);
      
      const postData: CreatePostDto = {
        title: formData.title,
        content: formData.content,
        excerpt: excerpt,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        isPublished: false,
        allowComments: formData.allowComments,
        isPinned: formData.isPinned,
        isFeatured: formData.isFeatured,
        // ✅ NUEVO: Incluir campos SEO
        seo: {
          focusKeyphrase: formData.seo.focusKeyphrase || undefined,
          metaTitle: formData.seo.metaTitle || undefined,
          metaDescription: formData.seo.metaDescription || undefined,
          keywords: formData.seo.keywords.length > 0 ? formData.seo.keywords : undefined
        }
      };

      if (isEditing && id) {
        await blogPostApi.admin.updatePost(id, postData as UpdatePostDto, formData.slug);
        alert('✅ Borrador actualizado exitosamente');
      } else {
        console.log('➕ [handleSaveDraft] Creando nuevo borrador');
        const response = await blogPostApi.admin.createPost(postData);
        console.log('✅ [handleSaveDraft] Response del backend:', response);
        console.log('📊 [handleSaveDraft] Post creado:', response.data);
        if (response.success && response.data) {
          alert('✅ Borrador guardado exitosamente');
          navigate(`/dashboard/blog/posts/${response.data._id}/edit`);
        }
      }
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('📡 Respuesta del servidor:', error.response?.data);

      const backendMessage = error.response?.data?.message || error.message || 'Error desconocido';
      alert(`❌ Error al guardar el borrador: ${backendMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Publicar post
  const handlePublish = async () => {
    // Validar que el contenido no esté vacío (sin contar etiquetas HTML)
    const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
    
    if (!formData.title || !formData.title.trim()) {
      alert('⚠️ Por favor ingresa un título para el post');
      return;
    }
    
    if (!textContent || textContent.length === 0) {
      alert('⚠️ Por favor escribe contenido en el editor');
      return;
    }
    
    if (!formData.category) {
      alert('⚠️ Por favor selecciona una categoría');
      return;
    }

    setIsSaving(true);
    try {
      // Generar excerpt automáticamente si está vacío
      const excerpt = formData.excerpt || formData.content.replace(/<[^>]*>/g, '').substring(0, 300);
      
      const postData: CreatePostDto = {
        title: formData.title,
        content: formData.content,
        excerpt: excerpt,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        isPublished: true,
        allowComments: formData.allowComments,
        isPinned: formData.isPinned,
        isFeatured: formData.isFeatured,
        // ✅ NUEVO: Incluir campos SEO
        seo: {
          focusKeyphrase: formData.seo.focusKeyphrase || undefined,
          metaTitle: formData.seo.metaTitle || undefined,
          metaDescription: formData.seo.metaDescription || undefined,
          keywords: formData.seo.keywords.length > 0 ? formData.seo.keywords : undefined
        }
      };

      if (isEditing && id) {
        await blogPostApi.admin.updatePost(id, { ...postData, isPublished: true } as UpdatePostDto, formData.slug);
        alert('✅ Post actualizado y publicado exitosamente');
      } else {
        const response = await blogPostApi.admin.createPost(postData);
        if (response.success) {
          alert('✅ Post publicado exitosamente');
        }
      }
      
      navigate('/dashboard/blog');
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('📡 Respuesta del servidor:', error.response?.data);

      const backendMessage = error.response?.data?.message || error.message || 'Error desconocido';
      alert(`❌ Error al publicar el post: ${backendMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="post-editor w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Moderno con Glassmorphism */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700 shadow-lg mb-8">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/blog')}
              className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? '✏️ Editar Post' : '✨ Nuevo Post'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                {formData.isPublished ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                    ✓ Publicado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                    📝 Borrador
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span className="font-medium">{showPreview ? 'Editor' : 'Vista Previa'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span className="font-medium">Guardar Borrador</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>{isEditing ? 'Actualizar' : 'Publicar'}</span>
            </button>

            {/* Botón Asistente IA */}
            <button
              type="button"
              onClick={() => setShowAISidebar(!showAISidebar)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-xl transform hover:scale-105 ${
                showAISidebar
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                  : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>🤖 Asistente IA</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título con diseño mejorado */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Título del post..."
                className="w-full text-4xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 focus:ring-0 p-0 focus:outline-none"
              />
            </div>

            {/* Slug con diseño mejorado */}
            <div className="flex items-center gap-3 px-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">🔗 URL:</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="url-del-post"
                className="flex-1 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>

            {/* Editor / Preview con diseño mejorado */}
            {showPreview ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                  {formData.title || 'Título del Post'}
                </h2>
                <ContentPreview content={formData.content} />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) => handleChange('content', html)}
                  minHeight="500px"
                  maxHeight="1000px"
                />
              </div>
          )}

          {/* Excerpt con diseño moderno */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                📄 Extracto (Resumen)
              </label>
            </div>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Escribe un breve resumen del post que capte la atención..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-none transition-all duration-200"
              maxLength={300}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-between">
              <span>{formData.excerpt.length}/300 caracteres</span>
              {formData.excerpt.length > 250 && (
                <span className="text-orange-600 dark:text-orange-400">⚠️ Cerca del límite</span>
              )}
            </p>
          </div>
        </div>

        {/* Sidebar Moderna */}
        <div className="space-y-6">
          {/* Imagen Destacada con diseño mejorado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">🖼️ Imagen Destacada</h3>
            </div>

            {formData.featuredImage ? (
              <div className="relative group">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-52 object-cover rounded-xl shadow-md transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImageGallery(true)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-lg"
                    title="Cambiar imagen"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('featuredImage', '')}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow-lg"
                    title="Eliminar imagen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 🖼️ OPCIÓN PRINCIPAL: Seleccionar de Galería */}
                <button
                  type="button"
                  onClick={() => setShowImageGallery(true)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>📚 Seleccionar de Galería</span>
                </button>

                {/* Separador */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                      o sube una nueva
                    </span>
                  </div>
                </div>

                {/* 📤 OPCIÓN SECUNDARIA: Subir archivo local */}
                <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 border-3 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subiendo...</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Subir desde dispositivo
                      </span>
                    </div>
                  )}
                </label>

                {/* 🔗 OPCIÓN TERCIARIA: URL externa */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      o ingresa URL
                    </span>
                  </div>
                </div>
                
                <input
                  type="url"
                  value={formData.featuredImage || ''}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                />
              </div>
            )}
          </div>

          {/* Categoría con diseño mejorado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">📁 Categoría</h3>
            </div>

            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 font-medium"
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {formData.category && (
              <div className="mt-4">
                {categories
                  .filter(c => c._id === formData.category)
                  .map(category => (
                    <CategoryBadge key={category._id} category={category} clickable={false} />
                  ))
                }
              </div>
            )}
          </div>

          {/* Tags con diseño mejorado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">🏷️ Tags</h3>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Agregar tag..."
                className="flex-1 px-3 py-2.5 text-sm border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Agregar
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => {
                  // ✅ Manejar tags como string o como objeto
                  const tagText = typeof tag === 'string' 
                    ? tag 
                    : (tag as any).name || (tag as any)._id || String(tag);
                  
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span>{tagText}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* ✅ NUEVO: Sección SEO con diseño mejorado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header colapsable */}
            <button
              type="button"
              onClick={() => setShowSEOSection(!showSEOSection)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-gray-900 dark:text-white">🔍 SEO y Posicionamiento</h3>
                {/* Indicador de estado SEO */}
                {(formData.seo.metaTitle || formData.seo.metaDescription) ? (
                  <span className="ml-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Configurado
                  </span>
                ) : (
                  <span className="ml-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Sin configurar
                  </span>
                )}
              </div>
              {showSEOSection ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Contenido SEO */}
            {showSEOSection && (
              <div className="px-6 pb-6 space-y-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                {/* Botón Auto-generar */}
                <button
                  type="button"
                  onClick={handleAutoGenerateSEO}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  ✨ Auto-generar SEO
                </button>

                {/* Focus Keyphrase */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🎯 Palabra Clave Principal
                  </label>
                  <input
                    type="text"
                    value={formData.seo.focusKeyphrase}
                    onChange={(e) => handleSEOChange('focusKeyphrase', e.target.value)}
                    placeholder="Ej: inteligencia artificial empresas"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    La palabra clave principal que quieres posicionar
                  </p>
                </div>

                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📝 Título SEO (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                    placeholder="Título optimizado para Google..."
                    maxLength={60}
                    className={`w-full px-3 py-2.5 text-sm border bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 transition-all duration-200 ${
                      formData.seo.metaTitle.length > 60 
                        ? 'border-red-400 focus:ring-red-500 focus:border-red-500' 
                        : formData.seo.metaTitle.length > 50
                          ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Aparece en la pestaña del navegador y Google
                    </p>
                    <span className={`text-xs font-medium ${
                      formData.seo.metaTitle.length > 60 ? 'text-red-500' : 
                      formData.seo.metaTitle.length > 50 ? 'text-yellow-500' : 'text-gray-400'
                    }`}>
                      {formData.seo.metaTitle.length}/60
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📄 Descripción SEO (Meta Description)
                  </label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                    placeholder="Descripción atractiva para los resultados de Google..."
                    maxLength={160}
                    rows={3}
                    className={`w-full px-3 py-2.5 text-sm border bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 transition-all duration-200 resize-none ${
                      formData.seo.metaDescription.length > 160 
                        ? 'border-red-400 focus:ring-red-500 focus:border-red-500' 
                        : formData.seo.metaDescription.length > 140
                          ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Snippet que aparece en los resultados de búsqueda
                    </p>
                    <span className={`text-xs font-medium ${
                      formData.seo.metaDescription.length > 160 ? 'text-red-500' : 
                      formData.seo.metaDescription.length > 140 ? 'text-yellow-500' : 'text-gray-400'
                    }`}>
                      {formData.seo.metaDescription.length}/160
                    </span>
                  </div>
                </div>

                {/* Keywords SEO */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🔑 Palabras Clave SEO
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                      placeholder="Agregar keyword..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                  
                  {formData.seo.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.seo.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="text-green-500 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Palabras clave secundarias para mejorar el posicionamiento
                  </p>
                </div>

                {/* Preview de Google */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Vista previa en Google
                  </p>
                  <div className="space-y-1">
                    <p className="text-blue-600 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer truncate">
                      {formData.seo.metaTitle || formData.title || 'Título del artículo'}
                    </p>
                    <p className="text-green-700 dark:text-green-500 text-sm truncate">
                      www.thadoconsulting.com/blog/{formData.slug || 'url-del-articulo'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {formData.seo.metaDescription || formData.excerpt || 'Descripción del artículo que aparecerá en los resultados de búsqueda de Google...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configuración con diseño mejorado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">⚙️ Configuración</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.allowComments}
                  onChange={(e) => handleChange('allowComments', e.target.checked)}
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  💬 Permitir comentarios
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="w-5 h-5 text-yellow-600 dark:text-yellow-400 rounded-md focus:ring-yellow-500 dark:focus:ring-yellow-400 transition-all duration-200"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  ⭐ Noticias Destacadas
                </span>
              </label>

            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ✅ Enhanced AI Sidebar - Controlado por botón Asistente IA */}
      <EnhancedEditorAISidebar
        title={formData.title}
        content={formData.content}
        excerpt={formData.excerpt}
        category={formData.category}
        isOpen={showAISidebar}
        onClose={() => setShowAISidebar(false)}
        onTagsGenerated={(tags) => {
          setFormData(prev => ({
            ...prev,
            tags: [...new Set([...prev.tags, ...tags])]
          }));
        }}
        onContentInsert={(content) => {
          setFormData(prev => ({
            ...prev,
            content: prev.content + '\n\n' + content
          }));
        }}
      />

      {/* Indicador de procesamiento AI */}
      {isProcessingAI && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Procesando con IA...</span>
          </div>
        </div>
      )}

      {/* Modal de Preview de IA */}
      <AIPreviewModal
        isOpen={previewState.isOpen}
        originalText={previewState.originalText}
        expandedText={previewState.expandedText}
        actionLabel={previewState.actionLabel}
        onAccept={handleAcceptPreview}
        onCancel={handleCancelPreview}
      />

      {/* 🖼️ Modal de Galería de Imágenes */}
      <ImageSelectorModal
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        onSelect={(imageUrl) => {
          handleChange('featuredImage', imageUrl);
          setShowImageGallery(false);
        }}
        currentImage={formData.featuredImage}
        title="Seleccionar Imagen Destacada"
      />
    </div>
  );
}
