import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import type { SolutionItem, PageData } from '../../types/cms';
import RichTextEditor from '../RichTextEditor';
import RichTextEditorCompact from '../RichTextEditorCompact';
import IconSelector from './shared/IconSelector';
import DynamicIcon from '../ui/DynamicIcon';

interface CardItemsEditorProps {
  items: SolutionItem[];
  onUpdate: (updatedItems: SolutionItem[]) => void;
  onSave?: () => Promise<void>; // Función de save manual
  pageData?: PageData; // Datos para obtener estilos actuales
  updateTextStyle?: (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos', field: string, mode: 'light' | 'dark', color: string) => void;
  className?: string;
}

const CardItemsEditor: React.FC<CardItemsEditorProps> = ({
  items,
  onUpdate,
  onSave,
  pageData,
  updateTextStyle,
  className = ''
}) => {
  const [localItems, setLocalItems] = useState<SolutionItem[]>(items || []);
  const [expandedCard, setExpandedCard] = useState<number | null>(null); // Todas las tarjetas cerradas por defecto
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 🔧 Asegurar que todos los items tengan estructura de estilos
  const ensureItemStyles = (item: SolutionItem): SolutionItem => {
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
  const createDefaultItem = (index: number): SolutionItem => {
    const defaultTitles = [
      'Soluciones Digitales',
      'Proyectos de Software', 
      'Modelos de IA'
    ];
    const defaultDescriptions = [
      'Transformamos tu negocio con estrategias digitales innovadoras y plataformas web de alto rendimiento.',
      'Desarrollamos software a medida con las últimas tecnologías para optimizar tus procesos empresariales.',
      'Implementamos inteligencia artificial personalizada para automatizar y potenciar tu empresa.'
    ];
    const defaultGradients = [
      'from-purple-500 to-purple-700',
      'from-cyan-500 to-cyan-700',
      'from-amber-500 to-amber-700'
    ];
    const defaultIcons = [
      'Sparkles',
      'Code2',
      'Brain'
    ];
    
    return {
      // No incluir _id para nuevos items, dejar que el backend lo genere
      iconName: defaultIcons[index] || 'Circle',
      iconColorLight: '#6366f1',
      iconColorDark: '#818cf8',
      title: defaultTitles[index] || `Solución ${index + 1}`,
      description: defaultDescriptions[index] || `Descripción de la solución ${index + 1}`,
      gradient: defaultGradients[index] || 'from-gray-500 to-gray-700',
      // Configuración del botón por defecto
      showButton: true,
      buttonText: 'Conocer más',
      buttonLink: '/servicios',
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
  const updateItem = (index: number, field: keyof SolutionItem, value: string | boolean) => {
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

      // Primero actualizar el estado local
      onUpdate(localItems);

      // 🔧 SOLUCIÓN: Esperar 1 tick del event loop para que React actualice el estado
      // Esto evita la race condition donde onSave() leía valores antiguos
      await new Promise(resolve => setTimeout(resolve, 0));

      // Luego hacer el save si se proporciona la función
      if (onSave) {
        await onSave();
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle expandir/contraer tarjeta
  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            📝 Contenido de las Tarjetas
          </h2>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
              ⚠️ Cambios sin guardar
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            ➕ Agregar Solución
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {isSaving ? '⏳ Guardando...' : '💾 Guardar'}
          </button>
        </div>
      </div>

      {/* Lista de Tarjetas */}
      <div className="space-y-4">
        {localItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            {/* Header de la tarjeta */}
            <div
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleCard(index)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {expandedCard === index ? '▼' : '▶'}
                </span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Tarjeta #{index + 1}: {item.title || `Sin título`}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {localItems.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(index);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </div>

            {/* Contenido expandible */}
            {expandedCard === index && (
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Columna izquierda: Contenido de texto (2/3) */}
                  <div className="xl:col-span-2 space-y-4">
                    
                    {/* Título con colores por tema */}
                    <div>
                      {pageData && updateTextStyle ? (
                        <RichTextEditorCompact
                          label="✏️ Título"
                          value={item.title}
                          onChange={(html: string) => updateItem(index, 'title', html)}
                          placeholder="Título de la solución"
                          themeColors={{
                            light: pageData.content.solutions?.items?.[index]?.styles?.light?.titleColor || '',
                            dark: pageData.content.solutions?.items?.[index]?.styles?.dark?.titleColor || ''
                          }}
                          onThemeColorChange={(mode: 'light' | 'dark', color: string) => {
                            // Crear estructura para el item específico
                            updateTextStyle('solutions', `items.${index}.titleColor`, mode, color);
                          }}
                        />
                      ) : (
                        <RichTextEditor
                          label="✏️ Título"
                          value={item.title}
                          onChange={(html: string) => updateItem(index, 'title', html)}
                          placeholder="Título de la solución"
                        />
                      )}
                    </div>

                    {/* Descripción con colores por tema */}
                    <div>
                      {pageData && updateTextStyle ? (
                        <RichTextEditorCompact
                          label="📄 Descripción"
                          value={item.description}
                          onChange={(html: string) => updateItem(index, 'description', html)}
                          placeholder="Descripción detallada de la solución..."
                          themeColors={{
                            light: pageData.content.solutions?.items?.[index]?.styles?.light?.descriptionColor || '',
                            dark: pageData.content.solutions?.items?.[index]?.styles?.dark?.descriptionColor || ''
                          }}
                          onThemeColorChange={(mode: 'light' | 'dark', color: string) => {
                            // Crear estructura para el item específico
                            updateTextStyle('solutions', `items.${index}.descriptionColor`, mode, color);
                          }}
                        />
                      ) : (
                        <RichTextEditor
                          label="📄 Descripción"
                          value={item.description}
                          onChange={(html: string) => updateItem(index, 'description', html)}
                          placeholder="Descripción detallada de la solución..."
                        />
                      )}
                    </div>

                    {/* Gradiente (opcional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🎨 Gradiente (Tailwind)
                      </label>
                      <input
                        type="text"
                        value={item.gradient}
                        onChange={(e) => updateItem(index, 'gradient', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="from-purple-500 to-purple-700"
                      />
                    </div>

                    {/* Configuración del Botón "Conocer más" */}
                    <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700/50">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        🔗 Botón "Conocer más"
                      </h4>
                      
                      {/* Toggle mostrar/ocultar */}
                      <div className="flex items-center gap-3 mb-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.showButton !== false}
                            onChange={(e) => updateItem(index, 'showButton', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.showButton !== false ? 'Botón visible' : 'Botón oculto'}
                        </span>
                      </div>

                      {/* Campos del botón (solo si está visible) */}
                      {item.showButton !== false && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Texto del botón
                            </label>
                            <input
                              type="text"
                              value={item.buttonText || 'Conocer más'}
                              onChange={(e) => updateItem(index, 'buttonText', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Conocer más"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Enlace del botón
                            </label>
                            <input
                              type="text"
                              value={item.buttonLink || '/servicios'}
                              onChange={(e) => updateItem(index, 'buttonLink', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="/servicios o https://..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                  </div>

                  {/* Columna derecha: Selector de Iconos (1/3) */}
                  <div className="xl:col-span-1">
                    <IconSelector
                      iconName={item.iconName || 'Circle'}
                      iconColorLight={item.iconColorLight || '#6366f1'}
                      iconColorDark={item.iconColorDark || '#818cf8'}
                      onIconChange={(iconName) => updateItem(index, 'iconName', iconName)}
                      onColorLightChange={(color) => updateItem(index, 'iconColorLight', color)}
                      onColorDarkChange={(color) => updateItem(index, 'iconColorDark', color)}
                      title="🎨 Icono de la Tarjeta"
                      description="Selecciona un icono vectorial de Lucide React"
                    />
                  </div>

                </div>

                  {/* Preview - Abarca toda la fila */}
                  <div className="xl:col-span-3 mt-6">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      👁️ Vista Previa
                    </h4>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border">
                      <div className="flex items-start gap-4">
                        {/* Preview de iconos */}
                        <div className="flex gap-2">
                          {item.iconName && (
                            <>
                              <div className="text-center">
                                <div className="w-12 h-12 rounded border bg-white p-2 flex items-center justify-center">
                                  <DynamicIcon 
                                    name={item.iconName} 
                                    size={28} 
                                    color={item.iconColorLight || '#6366f1'}
                                    strokeWidth={2}
                                  />
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">🌞</span>
                              </div>
                              <div className="text-center">
                                <div className="w-12 h-12 rounded border bg-gray-800 p-2 flex items-center justify-center">
                                  <DynamicIcon 
                                    name={item.iconName} 
                                    size={28} 
                                    color={item.iconColorDark || '#818cf8'}
                                    strokeWidth={2}
                                  />
                                </div>
                                <span className="text-xs text-gray-400">🌙</span>
                              </div>
                            </>
                          )}
                          {!item.iconName && (
                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500">
                              📄
                            </div>
                          )}
                        </div>
                        
                        {/* Preview de texto */}
                        <div className="flex-1">
                          <div 
                            className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(item.title || '<em>Sin título</em>') 
                            }}
                          />
                          <div 
                            className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(item.description || '<em>Sin descripción</em>') 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen de tarjetas */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>📊 Total de soluciones: {localItems.length}</span>
          <span>
            {hasUnsavedChanges ? '⚠️ Hay cambios sin guardar' : '✅ Todos los cambios guardados'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardItemsEditor;