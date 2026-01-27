import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import RichTextEditorCompact from '../RichTextEditorCompact';
import ManagedImageSelector from '../ManagedImageSelector';
import ValueAddedLogosEditor from './ValueAddedLogosEditor';
import LogosBarDesignSection from './LogosBarDesignSection';
import type { PageData, ValueAddedItem } from '../../types/cms';

interface ValueAddedConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions' | 'valueAdded', field: string, mode: 'light' | 'dark', color: string) => void;
  onSave?: () => Promise<void>;
}

const ValueAddedConfigSection: React.FC<ValueAddedConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle,
  onSave
}) => {

  const [collapsed, setCollapsed] = useState(true);

  // Estados para el editor de tarjetas
  const [localItems, setLocalItems] = useState<ValueAddedItem[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Asegurar que todos los items tengan estructura de estilos
  const ensureItemStyles = (item: ValueAddedItem): ValueAddedItem => {
    return {
      ...item,
      styles: {
        light: {
          titleColor: item.styles?.light?.titleColor || '',
          descriptionColor: item.styles?.light?.descriptionColor || ''
        },
        dark: {
          titleColor: item.styles?.dark?.titleColor || '',
          descriptionColor: item.styles?.dark?.descriptionColor || ''
        }
      }
    };
  };

  // Valores por defecto para nuevas tarjetas
  const createDefaultItem = (index: number): ValueAddedItem => {
    const defaultTitles = ['Garantía', 'Asesoría comercial', 'Personal calificado'];
    const defaultDescriptions = [
      'Nuestros servicios cuentan con garantía de atención y de soporte técnico.',
      'Nuestra asesoría comercial evalúa cada requerimiento y propone la solución con las mejores herramientas de TI.',
      'Nuestros ingenieros cuentan con certificaciones y títulos realizados que respalda la experiencia sobre los servicios que ofrecemos.'
    ];
    const defaultGradients = [
      'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    ];

    return {
      title: defaultTitles[index] || `Valor ${index + 1}`,
      description: defaultDescriptions[index] || `Descripción del valor agregado ${index + 1}`,
      gradient: defaultGradients[index] || 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      styles: {
        light: { titleColor: '', descriptionColor: '' },
        dark: { titleColor: '', descriptionColor: '' }
      }
    };
  };

  // Inicializar items
  useEffect(() => {
    const items = pageData.content.valueAdded?.items || [];
    if (items.length === 0) {
      const defaultItems = Array.from({ length: 3 }, (_, i) => ensureItemStyles(createDefaultItem(i)));
      setLocalItems(defaultItems);
      setHasUnsavedChanges(true);
    } else {
      const itemsWithStyles = items.map(item => ensureItemStyles(item));
      setLocalItems(itemsWithStyles);
    }
  }, [pageData.content.valueAdded?.items]);

  // Actualizar un item específico
  const updateItem = (index: number, field: keyof ValueAddedItem, value: string) => {
    setLocalItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // Agregar nueva tarjeta
  const addItem = () => {
    const newItem = ensureItemStyles(createDefaultItem(localItems.length));
    setLocalItems(prev => [...prev, newItem]);
    setExpandedCard(localItems.length);
    setHasUnsavedChanges(true);
  };

  // Eliminar tarjeta
  const removeItem = (index: number) => {
    if (localItems.length <= 1) return;
    setLocalItems(prev => prev.filter((_, i) => i !== index));
    if (expandedCard === index) {
      setExpandedCard(Math.max(0, index - 1));
    } else if (expandedCard !== null && expandedCard > index) {
      setExpandedCard(expandedCard - 1);
    }
    setHasUnsavedChanges(true);
  };

  // Guardar cambios
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      updateContent('valueAdded.items', localItems);
      await new Promise(resolve => setTimeout(resolve, 0));
      if (onSave) {
        await onSave();
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error guardando tarjetas:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Aplicar cambios sin guardar (para vista previa)
  const applyChanges = () => {
    updateContent('valueAdded.items', localItems);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="value-added-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center gap-2">
          ⭐ Sección Valor Agregado
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">
            (con burbujas flotantes 🫧)
          </span>
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="value-added-section-content">
          {/* Layout principal con 2 columnas: Contenido y Imágenes */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Columna izquierda: Editores de texto (2/3) */}
            <div className="xl:col-span-2 space-y-4">

              {/* Título de la Sección */}
              <div>
                <RichTextEditorCompact
                  label="Título de la Sección"
                  value={pageData.content.valueAdded?.title || 'Valor agregado'}
                  onChange={(html: string) => updateContent('valueAdded.title', html)}
                  placeholder="Valor agregado"
                  themeColors={{
                    light: pageData.content.valueAdded?.styles?.light?.titleColor || '',
                    dark: pageData.content.valueAdded?.styles?.dark?.titleColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('valueAdded', 'titleColor', mode, color)}
                />
              </div>

              {/* Descripción de la Sección */}
              <div>
                <RichTextEditorCompact
                  label="Descripción de la Sección"
                  value={pageData.content.valueAdded?.description || ''}
                  onChange={(html: string) => updateContent('valueAdded.description', html)}
                  placeholder="Describe el valor agregado que ofreces..."
                  themeColors={{
                    light: pageData.content.valueAdded?.styles?.light?.descriptionColor || '',
                    dark: pageData.content.valueAdded?.styles?.dark?.descriptionColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('valueAdded', 'descriptionColor', mode, color)}
                />
              </div>

              {/* Texto alternativo para accesibilidad */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📝 Texto alternativo (Alt Text)
                </label>
                <input
                  type="text"
                  value={pageData.content.valueAdded?.backgroundImageAlt || ''}
                  onChange={(e) => updateContent('valueAdded.backgroundImageAlt', e.target.value)}
                  placeholder="Describe la imagen para accesibilidad"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mejora la accesibilidad y SEO describiendo qué muestra la imagen
                </p>
              </div>

            </div>

            {/* Columna derecha: Imágenes de Fondo (1/3) */}
            <div className="xl:col-span-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                🖼️ Imágenes de Fondo
              </h4>
              <div className="space-y-4">

                {/* Imagen para Tema Claro */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
                  <div className="flex items-center mb-3">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200">🌞 Tema Claro</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fondo para modo día</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Claro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.valueAdded?.backgroundImage === 'string'
                      ? pageData.content.valueAdded?.backgroundImage
                      : pageData.content.valueAdded?.backgroundImage?.light}
                    onImageSelect={(url: string) => updateContent('valueAdded.backgroundImage.light', url)}
                    hideButtonArea={!!(typeof pageData.content.valueAdded?.backgroundImage === 'string'
                      ? pageData.content.valueAdded?.backgroundImage
                      : pageData.content.valueAdded?.backgroundImage?.light)}
                  />
                </div>

                {/* Imagen para Tema Oscuro */}
                <div className="bg-gradient-to-br from-slate-900 to-gray-900 dark:from-slate-800/50 dark:to-gray-800/50 p-4 rounded-lg border border-gray-700 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-800 dark:bg-gray-700 rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white dark:text-gray-200">🌙 Tema Oscuro</h5>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Fondo para modo noche</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Oscuro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.valueAdded?.backgroundImage === 'string'
                      ? pageData.content.valueAdded?.backgroundImage
                      : pageData.content.valueAdded?.backgroundImage?.dark}
                    onImageSelect={(url: string) => updateContent('valueAdded.backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!(typeof pageData.content.valueAdded?.backgroundImage === 'string'
                      ? pageData.content.valueAdded?.backgroundImage
                      : pageData.content.valueAdded?.backgroundImage?.dark)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== EDITOR DE TARJETAS INTEGRADO ========== */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                  🎴 Tarjetas de Valor Agregado
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestiona las tarjetas que muestran el valor agregado de tus servicios
                </p>
              </div>

              {/* Controles */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 lg:mt-0">
                <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                  hasUnsavedChanges
                    ? 'text-yellow-600 bg-yellow-100 border-yellow-200'
                    : 'text-green-600 bg-green-100 border-green-200'
                }`}>
                  {hasUnsavedChanges ? '📝 Cambios pendientes' : '✅ Sincronizado'}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={applyChanges}
                    disabled={!hasUnsavedChanges}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                  >
                    👀 Vista Previa
                  </button>

                  <button
                    onClick={saveChanges}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Guardando...
                      </>
                    ) : (
                      <>💾 Guardar</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de tarjetas */}
            <div className="space-y-4">
              {localItems.map((item, index) => (
                <div
                  key={typeof item._id === 'string' ? item._id : `valueadded-item-${index}`}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                >
                  {/* Header de la tarjeta */}
                  <div
                    className="bg-gray-50 dark:bg-gray-700/50 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {item.title || `Valor ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {DOMPurify.sanitize(item.description || '', { ALLOWED_TAGS: [] })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(index);
                          }}
                          disabled={localItems.length <= 1}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar tarjeta"
                        >
                          🗑️
                        </button>

                        <div className="text-gray-400">
                          {expandedCard === index ? '🔽' : '▶️'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenido expandido */}
                  {expandedCard === index && (
                    <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                      <div className="space-y-4">
                        {/* Título */}
                        <div>
                          <RichTextEditorCompact
                            label="📝 Título"
                            value={item.title}
                            onChange={(html: string) => updateItem(index, 'title', html)}
                            placeholder="Título del valor agregado"
                            themeColors={{
                              light: pageData.content.valueAdded?.items?.[index]?.styles?.light?.titleColor || '',
                              dark: pageData.content.valueAdded?.items?.[index]?.styles?.dark?.titleColor || ''
                            }}
                            onThemeColorChange={(mode: 'light' | 'dark', color: string) => {
                              updateTextStyle('valueAdded', `items.${index}.titleColor`, mode, color);
                            }}
                          />
                        </div>

                        {/* Descripción */}
                        <div>
                          <RichTextEditorCompact
                            label="📄 Descripción"
                            value={item.description}
                            onChange={(html: string) => updateItem(index, 'description', html)}
                            placeholder="Describe el valor agregado que ofreces..."
                            themeColors={{
                              light: pageData.content.valueAdded?.items?.[index]?.styles?.light?.descriptionColor || '',
                              dark: pageData.content.valueAdded?.items?.[index]?.styles?.dark?.descriptionColor || ''
                            }}
                            onThemeColorChange={(mode: 'light' | 'dark', color: string) => {
                              updateTextStyle('valueAdded', `items.${index}.descriptionColor`, mode, color);
                            }}
                          />
                        </div>

                        {/* Gradiente */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            🎨 Gradiente CSS
                          </label>
                          <input
                            type="text"
                            value={item.gradient || ''}
                            onChange={(e) => updateItem(index, 'gradient', e.target.value)}
                            placeholder="linear-gradient(135deg, #8B5CF6, #06B6D4)"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          {item.gradient && (
                            <div
                              className="mt-2 h-8 rounded-lg"
                              style={{ background: item.gradient }}
                            />
                          )}
                        </div>

                        {/* Configuración del Botón "Conocer más" */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700/50">
                          <h5 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                            🔗 Botón "Conocer más"
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Texto del botón */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Texto del botón
                              </label>
                              <input
                                type="text"
                                value={item.buttonText || ''}
                                onChange={(e) => updateItem(index, 'buttonText', e.target.value)}
                                placeholder="Conocer más"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Dejar vacío para usar "Conocer más" por defecto
                              </p>
                            </div>

                            {/* URL del botón */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                URL de destino
                              </label>
                              <input
                                type="text"
                                value={item.buttonUrl || ''}
                                onChange={(e) => updateItem(index, 'buttonUrl', e.target.value)}
                                placeholder="/servicios o https://..."
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Ruta interna (/servicios) o URL externa (https://...)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Botón agregar tarjeta */}
            <div className="mt-6 text-center">
              <button
                onClick={addItem}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                ➕ Agregar Tarjeta de Valor
              </button>
            </div>
          </div>

          {/* Editor de Logos */}
          <div className="mt-8">
            <ValueAddedLogosEditor
              logos={pageData.content.valueAdded?.logos || []}
              onUpdate={(logos) => updateContent('valueAdded.logos', logos)}
            />
          </div>

          {/* Diseño de la Barra de Logos */}
          <div className="mt-8">
            <LogosBarDesignSection
              pageData={pageData}
              updateContent={updateContent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ValueAddedConfigSection;
