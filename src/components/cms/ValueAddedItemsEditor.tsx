import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import type { ValueAddedItem, PageData } from '../../types/cms';
import RichTextEditor from '../RichTextEditor';
import RichTextEditorCompact from '../RichTextEditorCompact';

interface ValueAddedItemsEditorProps {
  items: ValueAddedItem[];
  onUpdate: (updatedItems: ValueAddedItem[]) => void;
  onSave?: () => Promise<void>; // Función de save manual
  pageData?: PageData; // Datos para obtener estilos actuales
  updateTextStyle?: (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos', field: string, mode: 'light' | 'dark', color: string) => void;
  className?: string;
}

const ValueAddedItemsEditor: React.FC<ValueAddedItemsEditorProps> = ({
  items,
  onUpdate,
  onSave,
  pageData,
  updateTextStyle,
  className = ''
}) => {
  const [localItems, setLocalItems] = useState<ValueAddedItem[]>(items || []);
  const [expandedCard, setExpandedCard] = useState<number | null>(null); // Todas las tarjetas cerradas por defecto
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 🔧 Asegurar que todos los items tengan estructura de estilos
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

  // Valores por defecto para nuevas tarjetas de valor agregado
  const createDefaultItem = (index: number): ValueAddedItem => {
    const defaultTitles = [
      'Garantía',
      'Asesoría comercial', 
      'Personal calificado'
    ];
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
      // No incluir _id para nuevos items, dejar que el backend lo genere
      title: defaultTitles[index] || `Valor ${index + 1}`,
      description: defaultDescriptions[index] || `Descripción del valor agregado ${index + 1}`,
      gradient: defaultGradients[index] || 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      styles: {
        light: {
          titleColor: '',
          descriptionColor: ''
        },
        dark: {
          titleColor: '',
          descriptionColor: ''
        }
      }
    };
  };

  // Inicializar con 3 tarjetas si no hay datos y asegurar estructura de estilos
  useEffect(() => {
    if (items.length === 0) {
      const defaultItems = Array.from({ length: 3 }, (_, i) => ensureItemStyles(createDefaultItem(i)));
      setLocalItems(defaultItems);
      setHasUnsavedChanges(true);
    } else {
      // Asegurar que items existentes tengan estructura de estilos
      const itemsWithStyles = items.map(item => ensureItemStyles(item));
      setLocalItems(itemsWithStyles);
      
      // Solo marcar como cambios sin guardar si realmente se agregaron estilos
      const hasNewStyles = items.some(item => 
        !item.styles || 
        !item.styles.light || 
        !item.styles.dark
      );
      if (hasNewStyles) {
        setHasUnsavedChanges(true);
      }
    }
  }, [items]);

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
    setExpandedCard(localItems.length); // Expandir la nueva tarjeta
    setHasUnsavedChanges(true);
  };

  // Eliminar tarjeta
  const removeItem = (index: number) => {
    if (localItems.length <= 1) return; // Mantener al menos 1 tarjeta
    
    setLocalItems(prev => prev.filter((_, i) => i !== index));
    
    // Ajustar tarjeta expandida
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

      // Actualizar estado padre
      onUpdate(localItems);

      // 🔧 SOLUCIÓN: Esperar 1 tick del event loop para que React actualice el estado
      // Esto evita la race condition donde onSave() leía valores antiguos
      await new Promise(resolve => setTimeout(resolve, 0));

      // Si hay función de save manual, ejecutarla
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
    onUpdate(localItems);
    setHasUnsavedChanges(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
            ⭐ Tarjetas de Valor Agregado
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona las tarjetas que muestran el valor agregado de tus servicios
          </p>
        </div>
        
        {/* Controles de la derecha */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 lg:mt-0">
          {/* Status Badge */}
          <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${
            hasUnsavedChanges 
              ? 'text-yellow-600 bg-yellow-100 border-yellow-200' 
              : 'text-green-600 bg-green-100 border-green-200'
          }`}>
            {hasUnsavedChanges ? '📝 Cambios pendientes' : '✅ Sincronizado'}
          </div>
          
          {/* Botones de acción */}
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
                <>
                  💾 Guardar
                </>
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
                  {/* Botón eliminar */}
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
                  
                  {/* Icono expandir/contraer */}
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
                    {/* Título con colores por tema */}
                    <div>
                      {pageData && updateTextStyle ? (
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
                            // Crear estructura para el item específico
                            updateTextStyle('valueAdded', `items.${index}.titleColor`, mode, color);
                          }}
                        />
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            📝 Título
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem(index, 'title', e.target.value)}
                            placeholder="Título del valor agregado"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      )}
                    </div>

                    {/* Descripción con colores por tema */}
                    <div>
                      {pageData && updateTextStyle ? (
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
                            // Crear estructura para el item específico
                            updateTextStyle('valueAdded', `items.${index}.descriptionColor`, mode, color);
                          }}
                        />
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            📄 Descripción
                          </label>
                          <RichTextEditor
                            value={item.description}
                            onChange={(html: string) => updateItem(index, 'description', html)}
                            placeholder="Describe el valor agregado que ofreces..."
                          />
                        </div>
                      )}
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
  );
};

export default ValueAddedItemsEditor;