import React, { useState, useEffect } from 'react';
import type { ValueAddedLogo } from '../../types/cms';
import ManagedImageSelector from '../ManagedImageSelector';

interface ValueAddedLogosEditorProps {
  logos: ValueAddedLogo[];
  onUpdate: (updatedLogos: ValueAddedLogo[]) => void;
  className?: string;
}

const ValueAddedLogosEditor: React.FC<ValueAddedLogosEditorProps> = ({
  logos,
  onUpdate,
  className = ''
}) => {
  const [localLogos, setLocalLogos] = useState<ValueAddedLogo[]>(logos || []);
  const [expandedLogo, setExpandedLogo] = useState<number | null>(null);

  // Sincronizar con props cuando cambien
  useEffect(() => {
    setLocalLogos(logos || []);
  }, [logos]);

  // Propagar cambios al componente padre solo cuando hay cambios reales
  useEffect(() => {
    // Evitar loops infinitos comparando con JSON.stringify
    const currentString = JSON.stringify(localLogos);
    const originalString = JSON.stringify(logos || []);
    
    if (currentString !== originalString) {
      onUpdate(localLogos);
    }
  }, [localLogos]); // Removido onUpdate de las dependencias

  // Crear un nuevo logo por defecto
  const createDefaultLogo = (index: number): ValueAddedLogo => {
    const defaultNames = [
      'SQL', 'Scala', 'Python', 'Kotlin', 'Java', 'Bokeh',
      'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'
    ];
    
    return {
      name: defaultNames[index] || `Logo ${index + 1}`,
      imageUrl: '',
      alt: `Logo ${defaultNames[index] || index + 1}`,
      link: '',
      order: index
    };
  };

  // Agregar nuevo logo
  const addLogo = () => {
    const newLogo = createDefaultLogo(localLogos.length);
    setLocalLogos(prev => [...prev, newLogo]);
    setExpandedLogo(localLogos.length); // Expandir el nuevo logo
  };

  // Eliminar logo
  const removeLogo = (index: number) => {
    setLocalLogos(prev => prev.filter((_, i) => i !== index));
    
    // Ajustar logo expandido
    if (expandedLogo === index) {
      setExpandedLogo(null);
    } else if (expandedLogo !== null && expandedLogo > index) {
      setExpandedLogo(expandedLogo - 1);
    }
  };

  // Actualizar logo específico
  const updateLogo = (index: number, field: keyof ValueAddedLogo, value: string | number) => {
    setLocalLogos(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Mover logo hacia arriba
  const moveLogoUp = (index: number) => {
    if (index === 0) return;
    
    setLocalLogos(prev => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      // Actualizar órdenes
      updated[index - 1].order = index - 1;
      updated[index].order = index;
      return updated;
    });
    
    if (expandedLogo === index) {
      setExpandedLogo(index - 1);
    } else if (expandedLogo === index - 1) {
      setExpandedLogo(index);
    }
  };

  // Mover logo hacia abajo
  const moveLogoDown = (index: number) => {
    if (index === localLogos.length - 1) return;
    
    setLocalLogos(prev => {
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      // Actualizar órdenes
      updated[index].order = index;
      updated[index + 1].order = index + 1;
      return updated;
    });
    
    if (expandedLogo === index) {
      setExpandedLogo(index + 1);
    } else if (expandedLogo === index + 1) {
      setExpandedLogo(index);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🏢</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Logos Flotantes 🫧
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Los logos flotan como burbujas por toda la sección con movimiento interactivo
            </p>
          </div>
        </div>
        
        <button
          onClick={addLogo}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          <span>➕</span>
          Agregar Logo
        </button>
      </div>

      {/* Lista de logos */}
      {localLogos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📷</div>
          <p>No hay logos configurados</p>
          <p className="text-sm">Haz clic en "Agregar Logo" para comenzar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localLogos.map((logo, index) => (
            <div 
              key={typeof logo._id === 'string' ? logo._id : `logo-${index}`}
              className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              {/* Header del logo */}
              <div 
                className="bg-gray-50 dark:bg-gray-700/50 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setExpandedLogo(expandedLogo === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    {/* Preview del logo */}
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {logo.imageUrl ? (
                        <img 
                          src={logo.imageUrl} 
                          alt={logo.alt}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">📷</span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {logo.name || `Logo ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {logo.imageUrl ? 'Imagen configurada' : 'Sin imagen'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Controles de orden */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLogoUp(index);
                      }}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover arriba"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLogoDown(index);
                      }}
                      disabled={index === localLogos.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover abajo"
                    >
                      ⬇️
                    </button>
                    
                    {/* Botón eliminar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLogo(index);
                      }}
                      className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      title="Eliminar logo"
                    >
                      🗑️
                    </button>
                    
                    {/* Indicador de expansión */}
                    <span className="text-gray-400">
                      {expandedLogo === index ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido expandido */}
              {expandedLogo === index && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna izquierda - Información básica */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nombre del Logo
                        </label>
                        <input
                          type="text"
                          value={logo.name}
                          onChange={(e) => updateLogo(index, 'name', e.target.value)}
                          placeholder="Ej: SQL, Python, React..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Texto Alternativo
                        </label>
                        <input
                          type="text"
                          value={logo.alt}
                          onChange={(e) => updateLogo(index, 'alt', e.target.value)}
                          placeholder="Descripción del logo"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Enlace (Opcional)
                        </label>
                        <input
                          type="url"
                          value={logo.link || ''}
                          onChange={(e) => updateLogo(index, 'link', e.target.value)}
                          placeholder="https://ejemplo.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    {/* Columna derecha - Selector de imagen */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Imagen del Logo
                      </label>
                      <ManagedImageSelector
                        currentImage={logo.imageUrl}
                        onImageSelect={(imageUrl) => updateLogo(index, 'imageUrl', imageUrl)}
                        label="Imagen del Logo"
                        description="Selecciona una imagen para este logo"
                        hideButtonArea={!!logo.imageUrl}
                      />
                      
                      {/* Preview más grande */}
                      {logo.imageUrl && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Vista previa:</p>
                          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                            <img 
                              src={logo.imageUrl} 
                              alt={logo.alt}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ValueAddedLogosEditor;