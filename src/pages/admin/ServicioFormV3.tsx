/**
 * 📝 FORMULARIO DE SERVICIO V3 - Con Sistema de Tabs Simplificado
 * Versión limpia con tabs funcionales para crear y editar servicios
 */

import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { serviciosApi } from '../../services/serviciosApi';
import { useTabNavigation, type Tab } from '../../components/common/TabNavigator';
import { useNotification } from '../../hooks/useNotification';
import { type Categoria } from '../../services/categoriasApi';
import { CreateCategoriaModal } from '../../components/categorias/CreateCategoriaModal';
import PageLoader from '../../components/common/PageLoader';
const ServicesCanvasModal = lazy(() => import('../../components/admin/services/ServicesCanvasModal'));
import { Sparkles } from 'lucide-react';
import { servicioToServiceContext } from '../../hooks/useServicesCanvas';
import type { ServiceContext } from '../../contexts/ServicesCanvasContext';
import useCategorias from '../../hooks/useCategoriasCacheadas';
import useServicesAgentOptimized from '../../hooks/useServicesAgentOptimized';
import useDebugBlocks from '../../hooks/useDebugBlocks';
import useServiceBlocks from '../../hooks/useServiceBlocks';
import AdvancedContentForm from '../../components/forms/AdvancedContentForm';
import FeaturesForm from '../../components/forms/FeaturesForm';
import BasicInfoForm from '../../components/forms/BasicInfoForm';
import PricingForm from '../../components/forms/PricingForm';
import VisualForm from '../../components/forms/VisualForm';
import SettingsForm from '../../components/forms/SettingsForm';
import { intelligentTruncate, cleanAIContent, prepareSEOContent } from '../../utils/textUtils';
import { invalidateServiciosCache } from '../../utils/serviciosCache';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServicioFormV3: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { success, error } = useNotification();

  // ============================================
  // ESTADOS LOCALES
  // ============================================

  const [loadingData, setLoadingData] = useState(isEditMode);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [etiquetaInput, setEtiquetaInput] = useState('');
  const [showCreateCategoriaModal, setShowCreateCategoriaModal] = useState(false);
  const [showServicesCanvas, setShowServicesCanvas] = useState(false);
  const [allServices, setAllServices] = useState<ServiceContext[]>([]); // 🆕 Servicios para portafolio
  const loadingRef = useRef(false); // Prevenir doble carga

  // ✅ Hook centralizado para manejar todos los bloques
  const {
    caracteristicasBlocks,
    beneficiosBlocks,
    incluyeBlocks,
    noIncluyeBlocks,
    faqBlocks,
    setCaracteristicasBlocks,
    setBeneficiosBlocks,
    setIncluyeBlocks,
    setNoIncluyeBlocks,
    setFaqBlocks,
    textToBlocks,
    loadBlocksFromService,
    getBlocksAsArrays
  } = useServiceBlocks();
  
  const [generatingBlocks, setGeneratingBlocks] = useState(false);

  // 🔍 Debug hook - Solo en desarrollo
  useDebugBlocks(
    caracteristicasBlocks,
    beneficiosBlocks,
    incluyeBlocks,
    noIncluyeBlocks,
    faqBlocks
  );

  // ✅ Categorías (usando hook existente pero sin invalidación)
  const {
    categorias, 
    loading: loadingCategorias
  } = useCategorias({ autoLoad: true });

  const agentService = useServicesAgentOptimized({
    debounceMs: 500,
    maxConcurrent: 1,
    cacheResults: false
  });

  // ✅ AutoComplete automático cuando se detectan campos incompletos
  const [autoCompleteTriggered, setAutoCompleteTriggered] = useState(false);

  // ============================================
  // REACT HOOK FORM
  // ============================================

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    control,
  } = useForm<any>({
    defaultValues: {
      titulo: '',
      slug: '',
      descripcion: '',
      descripcionCorta: '',
      categoria: '',
      tipoPrecio: 'fijo',
      precio: 0,
      moneda: 'PEN',
      estado: 'activo',
      icono: '🚀',
      destacado: false,
      activo: true,
      visibleEnWeb: true,
      // Contenido Avanzado
      descripcionRica: '',
      videoUrl: '',
      galeriaImagenes: [],
      contenidoAdicional: '',
      
      // Precios y Comercial
      descuento: 0,
      fechaPromocion: '',
      etiquetaPromocion: '',
      
      // Diseño Visual
      colorPrimario: '#8B5CF6',
      colorSecundario: '#06B6D4',
      imagen: '',
      
      // Etiquetas
      etiquetas: [],
      
      // Configuraciones adicionales
      seo: {
        titulo: '',
        descripcion: '',
        palabraClavePrincipal: '',
        palabrasClave: ''
      },
      tiempoEntrega: '',
      garantia: '',
      soporte: 'basico',
    },
  });

  // Observar solo campos necesarios para la UI
  const galeriaImagenes = watch('galeriaImagenes') || [];

  // ============================================
  // SISTEMA DE TABS COMPLETO
  // ============================================

  const tabs = useMemo<Tab[]>(() => [
    {
      id: 'basic',
      title: 'Información Básica',
      icon: '📋',
      description: 'Datos principales del servicio',
      isValid: Boolean(watch('titulo') && watch('descripcion'))
    },
    {
      id: 'pricing',
      title: 'Precios y Comercial',
      icon: '💰',
      description: 'Configuración de precios y promociones',
      isValid: Boolean(watch('precio') !== undefined)
    },
    {
      id: 'visual',
      title: 'Diseño Visual',
      icon: '🎨',
      description: 'Icono, colores y elementos visuales',
      isOptional: true,
      isCompleted: Boolean(watch('icono') || watch('colorPrimario') || watch('colorSecundario'))
    },
    {
      id: 'advanced',
      title: 'Contenido Avanzado',
      icon: '✨',
      description: 'Descripción rica, video, galería',
      isOptional: true,
      isCompleted: Boolean(watch('descripcionRica') || watch('videoUrl') || galeriaImagenes?.length || watch('contenidoAdicional'))
    },
    {
      id: 'features',
      title: 'Características',
      icon: '⚡',
      description: 'Beneficios, incluye/excluye, FAQ',
      isOptional: true,
      isCompleted: Boolean(
        caracteristicasBlocks.length || 
        beneficiosBlocks.length || 
        incluyeBlocks.length || 
        noIncluyeBlocks.length || 
        faqBlocks.length
      )
    },
    {
      id: 'settings',
      title: 'Configuraciones',
      icon: '⚙️',
      description: 'Estado, visibilidad y opciones avanzadas',
      isValid: true
    }
  ], [
    watch, 
    galeriaImagenes, 
    caracteristicasBlocks.length, 
    beneficiosBlocks.length, 
    incluyeBlocks.length, 
    noIncluyeBlocks.length, 
    faqBlocks.length
  ]);

  const {
    activeTab,
    setActiveTab,
    nextTab,
    previousTab,
    isFirstTab,
    isLastTab
  } = useTabNavigation('basic', tabs);

  // ============================================
  // ✅ OPTIMIZACIÓN FASE 3: MEMOIZACIÓN
  // ============================================
  
  // Memoizar serviceContext para evitar re-renders del modal
  const serviceContext = useMemo(() => ({
    serviceId: id,
    serviceTitle: watch('titulo') || 'Nuevo Servicio',
    currentDescription: watch('descripcion') || '',
    currentPrice: watch('precio') || 0,
    currency: watch('moneda') || 'PEN',
    category: watch('categoria') || '',
    descriptionCorta: watch('descripcionCorta'),
    caracteristicas: watch('caracteristicas'),
    beneficios: watch('beneficios'),
    etiquetas: watch('etiquetas') || []
  }), [
    id,
    watch('titulo'),
    watch('descripcion'),
    watch('precio'),
    watch('moneda'),
    watch('categoria'),
    watch('descripcionCorta'),
    watch('caracteristicas'),
    watch('beneficios'),
    watch('etiquetas')
  ]);

  // ============================================
  // FUNCIONES DE CATEGORÍAS
  // ============================================

  // Manejar éxito al crear nueva categoría
  const handleCategoriaCreated = (nuevaCategoria: Categoria) => {
    setValue('categoria', nuevaCategoria._id); // Seleccionar automáticamente la nueva categoría
    setShowCreateCategoriaModal(false);
    // Las categorías se recargarán automáticamente por el hook
  };

  // ============================================
  // CARGAR DATOS EN MODO EDICIÓN
  // ============================================

  const loadServicio = useCallback(async (servicioId: string) => {
    // ✅ Prevenir doble carga
    if (loadingRef.current) {

      return;
    }

    try {
      loadingRef.current = true;
      setLoadingData(true);
      
      // ✅ Intentar primero sin bypass de cache
      const response = await serviciosApi.getById(servicioId, true, true);            
      
      if (response.success && response.data) {
        const servicio = response.data;
        
        // ✅ Cargar datos del servicio en el formulario
        reset({
          titulo: servicio.titulo,
          slug: servicio.slug || '',
          descripcion: servicio.descripcion,
          descripcionCorta: servicio.descripcionCorta,
          categoria: typeof servicio.categoria === 'object' ? (servicio.categoria as any)?._id : servicio.categoria,
          tipoPrecio: servicio.tipoPrecio,
          precio: servicio.precio,
          moneda: servicio.moneda,
          estado: servicio.estado,
          icono: servicio.icono,
          destacado: servicio.destacado,
          activo: servicio.activo,
          visibleEnWeb: servicio.visibleEnWeb,
          
          // Contenido Avanzado
          descripcionRica: servicio.descripcionRica || '',
          videoUrl: servicio.videoUrl || '',
          galeriaImagenes: servicio.galeriaImagenes || [],
          contenidoAdicional: servicio.contenidoAdicional || '',
          
          // Precios y Comercial
          descuento: servicio.descuento || 0,
          fechaPromocion: servicio.fechaPromocion || '',
          etiquetaPromocion: servicio.etiquetaPromocion || '',
          
          // Diseño Visual
          colorPrimario: servicio.colorPrimario || '#8B5CF6',
          colorSecundario: servicio.colorSecundario || '#06B6D4',
          imagen: servicio.imagen || '',
          
          // Etiquetas
          etiquetas: servicio.etiquetas || [],
          
          // Configuraciones adicionales - ✅ Verificar que los campos tengan contenido real
          seo: {
            titulo: (servicio.seo?.titulo && servicio.seo.titulo.trim()) || servicio.metaTitle || '',
            descripcion: (servicio.seo?.descripcion && servicio.seo.descripcion.trim()) || servicio.metaDescription || '',
            palabraClavePrincipal: (servicio.seo?.palabraClavePrincipal && servicio.seo.palabraClavePrincipal.trim()) || '',
            palabrasClave: (servicio.seo?.palabrasClave && servicio.seo.palabrasClave.trim()) || ''
          },
          tiempoEntrega: servicio.tiempoEntrega || '',
          garantia: servicio.garantia || '',
          soporte: servicio.soporte || 'basico',
        });
        
        // 🔍 DEBUG: Ver qué SEO viene del servidor
        console.log('[loadServicio] servicio.seo desde servidor:', servicio.seo);
      
        // ✅ CARGAR BLOQUES usando el hook centralizado
        loadBlocksFromService(servicio);
      } else {
        error('Error', 'No se pudieron cargar los datos del servicio');
      }
    } catch (err: any) {
      
      if (err.response?.status === 404) {
        error('Error', 'Servicio no encontrado');
        navigate('/admin/servicios');
      } else if (err.response?.status >= 500) {
        error('Error', 'Error del servidor. Intenta de nuevo en un momento.');
      } else {
        error('Error', `No se pudo cargar el servicio: ${err.message || 'Error desconocido'}`);
      }
    } finally {
      setLoadingData(false);
      loadingRef.current = false; // ✅ Resetear flag de carga
    }
  }, []); // useCallback dependencies

  // Efecto para cargar servicio en modo edición
  useEffect(() => {
    if (isEditMode && id) {
      loadServicio(id);
    }
  }, [id, isEditMode, loadServicio]);

  // 🆕 Efecto para cargar todos los servicios (para análisis de portafolio)
  useEffect(() => {
    const loadAllServices = async () => {
      try {
        const response = await serviciosApi.getAllAdmin({}, { limit: 1000 });
        if (response.success && response.data) {
          const servicesContext = response.data.map(servicioToServiceContext);
          setAllServices(servicesContext);
        }
      } catch (err) {
        console.warn('No se pudieron cargar todos los servicios para análisis de portafolio');
      }
    };
    loadAllServices();
  }, []);

  // ============================================
  // FUNCIONES AUXILIARES OPTIMIZADAS
  // ============================================

  // Generar slug - Memoizado para evitar recálculos innecesarios
  const generateSlug = useCallback((titulo: string): string => {
    if (!titulo) return '';
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales
      .replace(/^-+|-+$/g, ''); // Quitar guiones del inicio y final
  }, []);

  // Auto-actualizar slug cuando cambie el título - Optimizado con debounce implícito
  const currentTitulo = watch('titulo');
  
  useEffect(() => {
    // Solo auto-generar slug en modo creación O si el slug actual está vacío
    const currentSlug = watch('slug');
    
    if (currentTitulo && (!currentSlug || (!isEditMode && currentTitulo))) {
      const newSlug = generateSlug(currentTitulo);
      setValue('slug', newSlug);
    }
  }, [currentTitulo, isEditMode, generateSlug, setValue, watch]);

  // ✅ AUTOCOMPLETADO AUTOMÁTICO - Cuando se carga un servicio con campos incompletos
  useEffect(() => {
    // Solo en modo edición y cuando hay datos cargados
    if (!isEditMode || loadingData || autoCompleteTriggered) return;

    const titulo = watch('titulo');
    const descripcion = watch('descripcion');
    const descripcionCorta = watch('descripcionCorta');

    // Detectar si los campos necesitan autocompletado automático
    const shouldAutoComplete = 
      titulo && 
      (
        !descripcion || descripcion.length < 50 ||
        !descripcionCorta || descripcionCorta.length < 20
      ) &&
      !generatingBlocks; // No si ya está generando

    if (shouldAutoComplete && id) {
      setAutoCompleteTriggered(true);
      
      // Pequeño delay para que el usuario lo vea
      const timer = setTimeout(() => {
        success('ℹ️ Sugerencia', 'Detectamos campos incompletos. Autocompletando con IA...');
        // La función handleAutoCompleteBasicInfo se ejecutará cuando se defina
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isEditMode, loadingData, id, watch, generatingBlocks, success, autoCompleteTriggered]);
  // TODO: Agregar handleAutoCompleteBasicInfo a dependencias cuando se pueda refactorizar

  // ============================================
  // FUNCIONES DE ETIQUETAS
  // ============================================

  // Agregar etiqueta
  const addEtiqueta = () => {
    if (etiquetaInput.trim()) {
      const currentEtiquetas = watch('etiquetas') || [];
      setValue('etiquetas', [...currentEtiquetas, etiquetaInput.trim()]);
      setEtiquetaInput('');
    }
  };

  // Eliminar etiqueta
  const removeEtiqueta = (index: number) => {
    const currentEtiquetas = watch('etiquetas') || [];
    setValue('etiquetas', currentEtiquetas.filter((_: string, i: number) => i !== index));
  };

  // Manejar Enter en input de etiquetas
  const handleEtiquetaKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEtiqueta();
    }
  };

  // ============================================
  // AUTOCOMPLETAR INFORMACIÓN BÁSICA CON IA - VERSIÓN MEJORADA
  // ============================================

  const handleAutoCompleteBasicInfo = async () => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar contenido');
      return;
    }

    try {
      setGeneratingBlocks(true);

      const response = await agentService.generateContent({
        serviceId: id,
        contentType: 'full_description',
        style: 'formal'
      });

      if (response.success && response.data?.content) {
        const generatedContent = response.data.content;
        
        // Limpiar contenido
        const cleanContent = cleanAIContent(generatedContent);

        if (cleanContent && cleanContent.length > 50) {
          // ⚡ SOLUCIÓN: Aplicar límite de 1000 caracteres para descripción
          let finalDescription = cleanContent;
          if (finalDescription.length > 1000) {
            finalDescription = intelligentTruncate(finalDescription, {
              maxLength: 1000,
              respectWordBoundaries: true,
              addEllipsis: false,
              preferSentenceEnd: true
            });
          }
          
          setValue('descripcion', finalDescription);
          
          // También podemos generar una descripción corta a partir del contenido largo
          const shortDescription = intelligentTruncate(cleanContent, {
            maxLength: 200,
            respectWordBoundaries: true,
            addEllipsis: false,
            preferSentenceEnd: true
          });
          
          if (shortDescription && shortDescription.length > 20) {
            setValue('descripcionCorta', shortDescription);
          }

          success('🎉 ¡Contenido Generado!', 'Se ha actualizado la descripción del servicio con contenido profesional generado por IA');
        } else {
          error('Error', 'El contenido generado es demasiado corto. Intenta nuevamente.');
        }
      } else {
        error('Error', 'No se pudo generar contenido. Verifica que el servicio tenga información básica.');
      }

    } catch (err: any) {
      error('Error', err.message || 'Error al autocompletar la información básica');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // ============================================
  // AUTOCOMPLETAR INFORMACIÓN COMERCIAL CON IA
  // ============================================

  const handleAutoCompletePricing = async () => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar contenido comercial');
      return;
    }

    try {
      setGeneratingBlocks(true);

      // Obtener información actual del servicio para contexto
      const serviceInfo = {
        titulo: watch('titulo') || '',
        categoria: watch('categoria') || '',
        descripcion: watch('descripcion') || ''
      };

      // Generar contenido comercial usando el agente
      const response = await agentService.generateContent({
        serviceId: id,
        contentType: 'full_description',
        style: 'formal'
      });

      if (response.success && response.data?.content) {
        // Generar etiqueta promocional inteligente basada en el contenido
        const etiquetasComunes = [
          '¡NUEVO!', '🔥 POPULAR', '⭐ RECOMENDADO', '🚀 INNOVADOR', 
          '💡 ESPECIALISTA', '✨ PREMIUM', '🎯 PERSONALIZADO', '🏆 EXPERTO'
        ];
        
        let etiqueta = '';
        if (serviceInfo.categoria?.toLowerCase().includes('consultor')) {
          etiqueta = '💡 ESPECIALISTA';
        } else if (serviceInfo.titulo?.toLowerCase().includes('desarrollo') || 
                   serviceInfo.titulo?.toLowerCase().includes('diseño')) {
          etiqueta = '🚀 INNOVADOR';
        } else if (serviceInfo.categoria?.toLowerCase().includes('marketing')) {
          etiqueta = '🔥 POPULAR';
        } else {
          etiqueta = etiquetasComunes[Math.floor(Math.random() * etiquetasComunes.length)];
        }

        // Generar tiempo de entrega inteligente
        let tiempoEntrega = '';
        if (serviceInfo.categoria?.toLowerCase().includes('consultor')) {
          tiempoEntrega = '3-5 días laborales';
        } else if (serviceInfo.titulo?.toLowerCase().includes('desarrollo')) {
          tiempoEntrega = '7-14 días laborales';
        } else if (serviceInfo.titulo?.toLowerCase().includes('diseño')) {
          tiempoEntrega = '5-10 días laborales';
        } else {
          tiempoEntrega = '2-7 días laborales';
        }

        // Generar garantía inteligente
        let garantia = '';
        if (serviceInfo.categoria?.toLowerCase().includes('consultor')) {
          garantia = '100% satisfacción garantizada';
        } else if (serviceInfo.titulo?.toLowerCase().includes('desarrollo')) {
          garantia = '6 meses de soporte incluido';
        } else if (serviceInfo.titulo?.toLowerCase().includes('diseño')) {
          garantia = '3 revisiones gratuitas';
        } else {
          garantia = '30 días de garantía total';
        }

        // Aplicar los valores solo si los campos están vacíos o necesitan mejora
        let updatedFields = 0;
        
        if (!watch('etiquetaPromocion') || watch('etiquetaPromocion').length < 5) {
          setValue('etiquetaPromocion', etiqueta);
          updatedFields++;
        }

        if (!watch('tiempoEntrega') || watch('tiempoEntrega').length < 5) {
          setValue('tiempoEntrega', tiempoEntrega);
          updatedFields++;
        }

        if (!watch('garantia') || watch('garantia').length < 5) {
          setValue('garantia', garantia);
          updatedFields++;
        }

        if (updatedFields > 0) {
          success(
            '🎉 ¡Información Comercial Generada!', 
            `Se actualizaron ${updatedFields} campos comerciales con información inteligente`
          );
        } else {
          success(
            'ℹ️ Información Completa', 
            'Todos los campos comerciales ya tienen contenido. No se requieren cambios.'
          );
        }
      } else {
        error('Error', 'No se pudo generar información comercial. Verifica que el servicio tenga información básica.');
      }

    } catch (err: any) {
      error('Error', err.message || 'Error al autocompletar información comercial');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // ============================================
  // AUTOCOMPLETAR CONTENIDO AVANZADO CON IA (OPTIMIZADO - ENDPOINT UNIFICADO)
  // ============================================

  const handleAutoCompleteAdvanced = async () => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar contenido');
      return;
    }

    try {
      setGeneratingBlocks(true);

      // Usar endpoint unificado para generar contenido avanzado
      const response = await agentService.generateCompleteContent({
        serviceId: id,
        style: 'formal',
        forceRegenerate: false
      });

      if (!response.success || !response.data?.generatedContent) {
        throw new Error(response.error || 'No se pudo generar contenido avanzado');
      }

      const generatedContent = response.data.generatedContent;
      let updatedFields = 0;

      // ✅ Procesar descripción completa (full_description) → descripcionRica
      if (generatedContent.full_description && typeof generatedContent.full_description === 'string') {
        const cleanContent = cleanAIContent(generatedContent.full_description);

        if (cleanContent && cleanContent.length > 100) {
          // Descripción rica: usar contenido completo
          let descripcionRica = cleanContent;
          
          // Truncar si excede el límite (3000 caracteres)
          if (descripcionRica.length > 3000) {
            descripcionRica = intelligentTruncate(descripcionRica, {
              maxLength: 3000,
              respectWordBoundaries: true,
              addEllipsis: false,
              preferSentenceEnd: true
            });
          }

          // Solo actualizar si está vacío o muy corto
          if (!watch('descripcionRica') || watch('descripcionRica').length < 50) {
            setValue('descripcionRica', descripcionRica);
            updatedFields++;
          }
        }
      }

      // ✅ Procesar descripción corta (short_description) → contenidoAdicional
      // Usar short_description en lugar de duplicar full_description
      if (generatedContent.short_description && typeof generatedContent.short_description === 'string') {
        const shortDesc = cleanAIContent(generatedContent.short_description);
        
        // Contenido adicional: usar descripción corta (diferente a la rica)
        if (shortDesc && shortDesc.length > 50 && (!watch('contenidoAdicional') || watch('contenidoAdicional').length < 50)) {
          let contenidoAdicional = shortDesc;
          
          // Asegurar que no exceda el límite (2000 caracteres)
          if (contenidoAdicional.length > 2000) {
            contenidoAdicional = intelligentTruncate(contenidoAdicional, {
              maxLength: 2000,
              respectWordBoundaries: true,
              addEllipsis: false,
              preferSentenceEnd: true
            });
          }
          
          setValue('contenidoAdicional', contenidoAdicional);
          updatedFields++;
        }
      }

      // ✅ También actualizar descripcionCorta si está vacía
      if (generatedContent.short_description && typeof generatedContent.short_description === 'string') {
        const shortDesc = cleanAIContent(generatedContent.short_description);
        
        if (shortDesc && shortDesc.length > 20 && (!watch('descripcionCorta') || watch('descripcionCorta').length < 20)) {
          // Asegurar que no exceda el límite de descripción corta
          const finalShortDesc = shortDesc.length > 200 
            ? intelligentTruncate(shortDesc, { maxLength: 200, respectWordBoundaries: true, addEllipsis: false })
            : shortDesc;
          
          setValue('descripcionCorta', finalShortDesc);
          updatedFields++;
        }
      }

      if (updatedFields > 0) {
        const processingTime = response.metadata?.processingTime 
          ? ` en ${Math.round(response.metadata.processingTime / 1000)}s`
          : '';

        success(
          '🎉 ¡Contenido Avanzado Generado!', 
          `Se actualizaron ${updatedFields} campos con contenido profesional${processingTime}. Optimizado con endpoint unificado 🎯`
        );
      } else {
        success(
          'ℹ️ Contenido Completo', 
          'Todos los campos de contenido avanzado ya tienen información. No se requieren cambios.'
        );
      }

    } catch (err: any) {
      console.error('❌ Error en handleAutoCompleteAdvanced:', err);
      error('Error', err.message || 'Error al autocompletar contenido avanzado');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // ============================================
  // AUTOCOMPLETAR CARACTERÍSTICAS CON IA (OPTIMIZADO - ENDPOINT UNIFICADO)
  // ============================================

  const handleAutoCompleteFeatures = async () => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar características');
      return;
    }

    try {
      setGeneratingBlocks(true);

      // Analizar qué secciones están vacías
      const sectionsEmpty = {
        caracteristicas: caracteristicasBlocks.length === 0,
        beneficios: beneficiosBlocks.length === 0,
        incluye: incluyeBlocks.length === 0,
        noIncluye: noIncluyeBlocks.length === 0,
        faq: faqBlocks.length === 0
      };

      // Contar secciones vacías
      const emptySectionsCount = Object.values(sectionsEmpty).filter(Boolean).length;

      if (emptySectionsCount === 0) {
        success(
          'ℹ️ Características Completas',
          'Todas las secciones ya tienen contenido. Para regenerar, elimina primero el contenido existente.'
        );
        return;
      }

      // Usar endpoint unificado para generar características completas
      const response = await agentService.generateCompleteContent({
        serviceId: id,
        style: 'formal',
        forceRegenerate: false
      });

      if (!response.success || !response.data?.generatedContent) {
        throw new Error(response.error || 'No se pudo generar contenido completo');
      }

      const generatedContent = response.data.generatedContent;
      let successCount = 0;

      // ✅ Procesar características
      if (sectionsEmpty.caracteristicas && generatedContent.caracteristicas && Array.isArray(generatedContent.caracteristicas)) {
        const textForBlocks = generatedContent.caracteristicas.join('\n');
        if (textForBlocks && textForBlocks.trim()) {
          const newBlocks = textToBlocks(textForBlocks, 'list');
          if (newBlocks.length > 0) {
            setCaracteristicasBlocks(newBlocks);
            successCount++;
          }
        }
      }

      // ✅ Procesar beneficios
      if (sectionsEmpty.beneficios && generatedContent.beneficios && Array.isArray(generatedContent.beneficios)) {
        const textForBlocks = generatedContent.beneficios.join('\n');
        if (textForBlocks && textForBlocks.trim()) {
          const newBlocks = textToBlocks(textForBlocks, 'list');
          if (newBlocks.length > 0) {
            setBeneficiosBlocks(newBlocks);
            successCount++;
          }
        }
      }

      // ✅ Procesar qué incluye
      if (sectionsEmpty.incluye && generatedContent.incluye && Array.isArray(generatedContent.incluye)) {
        const textForBlocks = generatedContent.incluye.join('\n');
        if (textForBlocks && textForBlocks.trim()) {
          const newBlocks = textToBlocks(textForBlocks, 'list');
          if (newBlocks.length > 0) {
            setIncluyeBlocks(newBlocks);
            successCount++;
          }
        }
      }

      // ✅ Procesar qué NO incluye
      if (sectionsEmpty.noIncluye && generatedContent.noIncluye && Array.isArray(generatedContent.noIncluye)) {
        const textForBlocks = generatedContent.noIncluye.join('\n');
        if (textForBlocks && textForBlocks.trim()) {
          const newBlocks = textToBlocks(textForBlocks, 'list');
          if (newBlocks.length > 0) {
            setNoIncluyeBlocks(newBlocks);
            successCount++;
          }
        }
      }

      // ✅ Procesar FAQ (caso especial - objetos con pregunta/respuesta)
      if (sectionsEmpty.faq && generatedContent.faq && Array.isArray(generatedContent.faq)) {
        let textForBlocks = '';
        
        // El backend devuelve array de objetos FAQ
        if (generatedContent.faq.length > 0 && typeof generatedContent.faq[0] === 'object') {
          textForBlocks = generatedContent.faq
            .map((faq: any) => `P: ${faq.pregunta || faq.question || ''}\nR: ${faq.respuesta || faq.answer || ''}`)
            .join('\n\n');
        } else {
          // Fallback: array de strings
          textForBlocks = generatedContent.faq.join('\n\n');
        }
        
        if (textForBlocks && textForBlocks.trim()) {
          const newBlocks = textToBlocks(textForBlocks, 'faq');
          if (newBlocks.length > 0) {
            setFaqBlocks(newBlocks);
            successCount++;
          }
        }
      }

      // Mostrar resultado
      if (successCount > 0) {
        const processingTime = response.metadata?.processingTime 
          ? ` en ${Math.round(response.metadata.processingTime / 1000)}s`
          : '';
        
        success(
          '🚀 ¡Contenido Generado con IA!',
          `Se completaron ${successCount} de ${emptySectionsCount} secciones vacías${processingTime}. Optimizado con endpoint unificado 🎯`
        );
      } else {
        error('Error', 'No se pudo aplicar el contenido generado. Intenta nuevamente.');
      }

    } catch (err: any) {
      console.error('❌ Error en handleAutoCompleteFeatures:', err);
      error('Error', err.message || 'Error al autocompletar características');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // ============================================
  // GENERAR CONTENIDO SEO CON IA
  // ============================================

  // Generar contenido SEO con IA (autocompletado directo de los 3 campos)
  const handleGenerateSEO = async () => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar SEO');
      return;
    }

    try {
      setGeneratingBlocks(true);

      // ✅ Generar contenido SEO estructurado con el agente
      const response = await agentService.generateContent({
        serviceId: id,
        contentType: 'seo' as any, // Nuevo tipo específico para SEO
        style: 'formal'
      });

      if (response.success && response.data?.content) {
        let seoContent;
        
        console.log('[handleGenerateSEO] Response.data.content:', response.data.content);
        console.log('[handleGenerateSEO] Type:', typeof response.data.content);
        
        // Verificar si la respuesta es un objeto JSON estructurado
        if (typeof response.data.content === 'object' && response.data.content.titulo) {
          seoContent = response.data.content;
        } else {
          // Intentar parsear como JSON si llega como string
          try {
            seoContent = JSON.parse(response.data.content);
          } catch (parseError) {
            console.warn('⚠️ No se pudo parsear contenido SEO como JSON, generando fallback');
            
            // Fallback: usar el contenido como descripción
            const fallbackContent = response.data.content;
            const tituloServicio = watch('titulo') || '';
            seoContent = {
              titulo: prepareSEOContent(tituloServicio, 'title'),
              descripcion: prepareSEOContent(fallbackContent, 'description'),
              palabrasClave: ['consultoría', 'servicios', 'profesional'],
              // 🆕 Generar palabra clave principal desde el título
              palabraClavePrincipal: tituloServicio.toLowerCase().replace(/[^a-záéíóúñü\s]/g, '').trim().split(' ').slice(0, 3).join(' ')
            };
          }
        }
        
        console.log('[handleGenerateSEO] seoContent parsed:', seoContent);
        console.log('[handleGenerateSEO] palabraClavePrincipal:', seoContent.palabraClavePrincipal);

        // Aplicar contenido SEO a los campos
        if (seoContent.titulo) {
          setValue('seo.titulo', prepareSEOContent(seoContent.titulo, 'title'), { shouldDirty: true, shouldTouch: true });
        }
        if (seoContent.descripcion) {
          setValue('seo.descripcion', prepareSEOContent(seoContent.descripcion, 'description'), { shouldDirty: true, shouldTouch: true });
        }
        if (seoContent.palabrasClave) {
          const keywords = Array.isArray(seoContent.palabrasClave) 
            ? seoContent.palabrasClave.join(', ')
            : seoContent.palabrasClave;
          setValue('seo.palabrasClave', keywords, { shouldDirty: true, shouldTouch: true });
        }
        // 🆕 Aplicar palabra clave principal
        if (seoContent.palabraClavePrincipal) {
          setValue('seo.palabraClavePrincipal', seoContent.palabraClavePrincipal.toLowerCase().trim(), { shouldDirty: true, shouldTouch: true });
          console.log('[handleGenerateSEO] ✅ palabraClavePrincipal aplicada:', seoContent.palabraClavePrincipal);
        } else {
          console.warn('[handleGenerateSEO] ⚠️ palabraClavePrincipal no vino en la respuesta');
          // 🆕 Fallback: generar desde título si no viene en la respuesta
          const tituloServicio = watch('titulo') || '';
          const fallbackKeyword = tituloServicio.toLowerCase().replace(/[^a-záéíóúñü\s]/g, '').trim().split(' ').slice(0, 3).join(' ');
          if (fallbackKeyword) {
            setValue('seo.palabraClavePrincipal', fallbackKeyword, { shouldDirty: true, shouldTouch: true });
            console.log('[handleGenerateSEO] ✅ palabraClavePrincipal generada desde título:', fallbackKeyword);
          }
        }

        success('Éxito', '✨ Contenido SEO profesional generado y aplicado automáticamente');
      } else {
        error('Error', response.error || 'No se pudo generar el contenido SEO');
      }
    } catch (err: any) {
      error('Error', err.message || 'Error al generar SEO con IA');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // ============================================
  // SUBMIT
  // ============================================

  const onSubmit = async (data: any) => {
    try {
      if (data.seo?.titulo && data.seo.titulo.length > 60) {
        error('Validación', 'El título SEO no puede exceder 60 caracteres');
        return;
      }
      if (data.seo?.descripcion && data.seo.descripcion.length > 160) {
        error('Validación', 'La descripción SEO no puede exceder 160 caracteres');
        return;
      }
      if (data.seo?.palabrasClave && data.seo.palabrasClave.length > 500) {
        error('Validación', 'Las palabras clave no pueden exceder 500 caracteres');
        return;
      }

      const formData = watch();
      const blocksData = getBlocksAsArrays();
      
      const { caracteristicas, beneficios, incluye, noIncluye, faq, ...formDataSinArrays } = formData;
      
      // ✅ Validar que contenidoAdicional no sea JSON
      let contenidoAdicionalSanitizado = formData.contenidoAdicional || '';
      const jsonPatterns = [
        /^\s*\{\s*"title":/i,
        /^\s*\{\s*"description":/i,
        /^\s*SEO:\s*\{/i,
        /"metaTitle":/i,
        /"metaDescription":/i,
        /seo\s*[:=]\s*\{/i
      ];
      
      const isJSON = jsonPatterns.some(pattern => pattern.test(contenidoAdicionalSanitizado));
      if (isJSON) {
        console.warn('⚠️ Contenido adicional contiene JSON - será limpiado antes de guardar');
        contenidoAdicionalSanitizado = ''; // Limpiar si es JSON
      }
      
      const processedData = {
        ...formDataSinArrays,
        ...blocksData,
        descripcionRica: formData.descripcionRica || '',
        videoUrl: formData.videoUrl || '',
        galeriaImagenes: formData.galeriaImagenes || [],
        contenidoAdicional: contenidoAdicionalSanitizado,
        seo: {
          titulo: formData.seo?.titulo || '',
          descripcion: formData.seo?.descripcion || '',
          palabraClavePrincipal: formData.seo?.palabraClavePrincipal || '',
          palabrasClave: formData.seo?.palabrasClave || ''
        }
      };
      
      // 🔍 DEBUG: Ver qué SEO se está enviando
      console.log('[onSubmit] formData.seo:', formData.seo);
      console.log('[onSubmit] processedData.seo:', processedData.seo);

      if (isEditMode && id) {
        await serviciosApi.update(id, processedData);
        // 🔧 FIX: Invalidar cache local después de actualizar
        invalidateServiciosCache();
        success('Servicio actualizado', 'Los cambios se guardaron correctamente');
        navigate('/dashboard/servicios/management');
      } else {
        const response = await serviciosApi.create(processedData);
        // 🔧 FIX: Invalidar cache local después de crear
        invalidateServiciosCache();
        success('Servicio creado', 'El servicio se creó correctamente');
        if (response.data?._id) {
          navigate(`/dashboard/servicios/${response.data._id}/edit`);
          return;
        }
        navigate('/dashboard/servicios/management');
      }
    } catch (err: any) {
      error('Error al guardar', String(err.message || 'No se pudo guardar el servicio'));
    }
  };

  // ============================================
  // RENDER DE TABS
  // ============================================

  const renderBasicTab = () => (
    <BasicInfoForm
      register={register}
      watch={watch}
      setValue={setValue}
      errors={errors}
      isEditMode={isEditMode}
      categorias={categorias}
      loadingCategorias={loadingCategorias}
      etiquetaInput={etiquetaInput}
      onEtiquetaInputChange={setEtiquetaInput}
      onAddEtiqueta={addEtiqueta}
      onRemoveEtiqueta={removeEtiqueta}
      onEtiquetaKeyPress={handleEtiquetaKeyPress}
      onShowCreateCategoriaModal={() => setShowCreateCategoriaModal(true)}
      generateSlug={generateSlug}
      serviceContext={{
        serviceId: id,
        titulo: watch('titulo') || '',
        descripcionCorta: watch('descripcionCorta'),
        categoria: watch('categoria')
      }}
      isLoading={loadingData}
      // ✅ NUEVAS PROPS PARA AUTOCOMPLETADO
      onAutoCompleteBasicInfo={handleAutoCompleteBasicInfo}
      isGenerating={generatingBlocks}
    />
  );

  const renderAdvancedTab = () => (
    <AdvancedContentForm
      register={register}
      watch={watch}
      setValue={setValue}
      control={control}
      isLoading={loadingData}
      onAutoCompleteAdvanced={handleAutoCompleteAdvanced}
      isGeneratingAdvanced={generatingBlocks}
    />
  );

  const renderPricingTab = () => (
    <PricingForm
      register={register}
      errors={errors}
      isEditMode={isEditMode}
      serviceContext={{
        serviceId: id || '',
        titulo: watch('titulo'),
        descripcionCorta: watch('descripcionCorta'),
        categoria: watch('categoria')
      }}
      isLoading={loadingData}
      onAutoCompletePricing={handleAutoCompletePricing}
      isGeneratingPricing={generatingBlocks}
    />
  );

  const renderVisualTab = () => (
    <VisualForm
      register={register}
      watch={watch}
      setValue={setValue}
      onSuccess={success}
      onError={error}
      isLoading={loadingData}
      uploadingImage={uploadingImage}
      setUploadingImage={setUploadingImage}
    />
  );

  const renderFeaturesTab = () => (
    <FeaturesForm
      caracteristicasBlocks={caracteristicasBlocks}
      beneficiosBlocks={beneficiosBlocks}
      incluyeBlocks={incluyeBlocks}
      noIncluyeBlocks={noIncluyeBlocks}
      faqBlocks={faqBlocks}
      onCaracteristicasChange={setCaracteristicasBlocks}
      onBeneficiosChange={setBeneficiosBlocks}
      onIncluyeChange={setIncluyeBlocks}
      onNoIncluyeChange={setNoIncluyeBlocks}
      onFaqChange={setFaqBlocks}
      serviceContext={{
        serviceId: id,
        titulo: watch('titulo') || '',
        descripcionCorta: watch('descripcionCorta'),
        categoria: watch('categoria')
      }}
      onAutoCompleteFeatures={handleAutoCompleteFeatures}
      isGeneratingFeatures={generatingBlocks}
      isLoading={loadingData}
    />
  );

  const renderSettingsTab = () => (
    <SettingsForm
      register={register}
      watch={watch}
      isEditMode={isEditMode}
      generateSlug={generateSlug}
      onGenerateSEO={handleGenerateSEO}
      isGenerating={generatingBlocks}
      isLoading={loadingData}
      hasServiceId={Boolean(id)}
    />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicTab();
      case 'pricing':
        return renderPricingTab();
      case 'visual':
        return renderVisualTab();
      case 'advanced':
        return renderAdvancedTab();
      case 'features':
        return renderFeaturesTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderBasicTab();
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loadingData) {
    return <PageLoader fullScreen message="Cargando servicio..." size="lg" />;
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 flex">
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header Global Sticky */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/servicios/management')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                ← Volver
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? '✏️ Editar Servicio' : '+ Crear Servicio'}
              </h1>
            </div>
            
            {/* Botón AI Assistant */}
            <button
              type="button"
              onClick={() => setShowServicesCanvas(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Abrir Asistente IA"
            >
              <Sparkles size={18} className="animate-pulse" />
              <span className="font-medium">AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Contenido del Formulario */}
        <div className="flex-1 flex">
          <div className="flex-1 overflow-y-auto">
            {/* Navegador Flotante Móvil */}
            <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {tabs.find(t => t.id === activeTab)?.title}
                </h3>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {tabs.findIndex(t => t.id === activeTab) + 1}/{tabs.length}
                </span>
              </div>
              
              {/* Barra de progreso móvil */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navegación compacta */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={previousTab}
                  disabled={isFirstTab}
                  className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  ← Anterior
                </button>
                
                {/* Selector de tabs móvil */}
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.icon} {tab.title}
                    </option>
                  ))}
                </select>
                
                {!isLastTab ? (
                  <button
                    type="button"
                    onClick={nextTab}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="servicio-form"
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-all font-medium text-sm"
                  >
                    {isSubmitting ? '⏳' : '💾'}
                  </button>
                )}
              </div>
            </div>

            <form id="servicio-form" onSubmit={handleSubmit(onSubmit)} className="pb-6">
              {/* Render del tab activo */}
              {renderTabContent()}
            </form>
          </div>

          {/* Barra Lateral Derecha - Solo Desktop */}
          <div className="hidden lg:flex w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-col">
            {/* Header de la Barra Lateral */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Configuración del Servicio
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {tabs.findIndex(t => t.id === activeTab) + 1}/{tabs.length}
                </span>
              </div>
            </div>

            {/* Lista de Tabs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tab.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{tab.title}</h3>
                      {tab.isOptional && (
                        <span className={`text-xs ${activeTab === tab.id ? 'text-purple-100' : 'text-purple-600 dark:text-purple-400'}`}>
                          (Opcional)
                        </span>
                      )}
                    </div>
                    {/* Indicador de estado */}
                    <div className="flex items-center">
                      {tab.isValid ? (
                        <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-green-300' : 'bg-green-500'}`} />
                      ) : tab.isCompleted ? (
                        <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-yellow-300' : 'bg-yellow-500'}`} />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-gray-300' : 'bg-gray-400'}`} />
                      )}
                    </div>
                  </div>
                  <p className={`text-xs ${activeTab === tab.id ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {tab.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Footer de la Barra Lateral */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Navegación */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousTab}
                  disabled={isFirstTab}
                  className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  ← Anterior
                </button>
                
                {!isLastTab ? (
                  <button
                    type="button"
                    onClick={nextTab}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Siguiente →
                  </button>
                ) : null}
              </div>
              
              {/* Botón de Guardar - Disponible en todos los tabs */}
              <button
                type="submit"
                form="servicio-form"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                  </span>
                ) : (
                  isEditMode ? '💾 Guardar Cambios' : '+ Crear Servicio'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear nueva categoría */}
      <CreateCategoriaModal
        isOpen={showCreateCategoriaModal}
        onClose={() => setShowCreateCategoriaModal(false)}
        onSuccess={handleCategoriaCreated}
      />

      {/* ✅ Services Canvas Modal con Lazy Loading y Suspense */}
      {showServicesCanvas && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="text-gray-700">Cargando asistente IA...</span>
            </div>
          </div>
        }>
          <ServicesCanvasModal
            isOpen={showServicesCanvas}
            onClose={() => setShowServicesCanvas(false)}
            initialMode="chat"
            serviceContext={serviceContext}
            allServices={allServices}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ServicioFormV3;

