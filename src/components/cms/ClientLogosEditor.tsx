import React, { useState, useEffect } from 'react';
import type { ClientLogo } from '../../types/cms';
import ManagedImageSelector from '../ManagedImageSelector';
import GradientPicker from './GradientPicker';

interface ClientLogosEditorProps {
  logos: ClientLogo[];
  onUpdate: (updatedLogos: ClientLogo[]) => void;
  className?: string;
}

const ClientLogosEditor: React.FC<ClientLogosEditorProps> = ({
  logos,
  onUpdate,
  className = ''
}) => {
  const [localLogos, setLocalLogos] = useState<ClientLogo[]>(logos || []);
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
  }, [localLogos]);

  // Crear un nuevo logo por defecto
  const createDefaultLogo = (index: number): ClientLogo => {
    const defaultNames = [
      'Microsoft', 'Google', 'Amazon', 'Apple', 'Meta', 'Netflix',
      'Tesla', 'Samsung', 'Intel', 'Adobe', 'Oracle', 'IBM'
    ];
    
    return {
      _id: `temp_${Date.now()}_${index}`, // ID temporal único
      name: defaultNames[index] || `Cliente ${index + 1}`,
      imageUrl: '',
      alt: `Logo ${defaultNames[index] || `Cliente ${index + 1}`}`,
      link: '',
      order: index,
      background: 'transparent' // Valor por defecto para nuevos logos
    };
  };

  // Agregar un nuevo logo
  const addLogo = () => {
    const newLogo = createDefaultLogo(localLogos.length);
    const updatedLogos = [...localLogos, newLogo];
    setLocalLogos(updatedLogos);
    setExpandedLogo(updatedLogos.length - 1); // Expandir el nuevo logo
  };

  // Eliminar un logo
  const removeLogo = (index: number) => {
    const updatedLogos = localLogos.filter((_, i) => i !== index);
    setLocalLogos(updatedLogos);
    if (expandedLogo === index) {
      setExpandedLogo(null);
    } else if (expandedLogo !== null && expandedLogo > index) {
      setExpandedLogo(expandedLogo - 1);
    }
  };

  // Actualizar un logo específico
  const updateLogo = (index: number, field: keyof ClientLogo, value: string | number) => {
    const updatedLogos = localLogos.map((logo, i) => 
      i === index ? { ...logo, [field]: value } : logo
    );
    setLocalLogos(updatedLogos);
  };

  // Mover logo hacia arriba
  const moveLogoUp = (index: number) => {
    if (index > 0) {
      const newLogos = [...localLogos];
      [newLogos[index - 1], newLogos[index]] = [newLogos[index], newLogos[index - 1]];
      
      // Actualizar orden
      newLogos.forEach((logo, i) => logo.order = i);
      
      setLocalLogos(newLogos);
      
      // Ajustar expansión si es necesario
      if (expandedLogo === index) {
        setExpandedLogo(index - 1);
      } else if (expandedLogo === index - 1) {
        setExpandedLogo(index);
      }
    }
  };

  // Mover logo hacia abajo
  const moveLogoDown = (index: number) => {
    if (index < localLogos.length - 1) {
      const newLogos = [...localLogos];
      [newLogos[index], newLogos[index + 1]] = [newLogos[index + 1], newLogos[index]];
      
      // Actualizar orden
      newLogos.forEach((logo, i) => logo.order = i);
      
      setLocalLogos(newLogos);
      
      // Ajustar expansión si es necesario
      if (expandedLogo === index) {
        setExpandedLogo(index + 1);
      } else if (expandedLogo === index + 1) {
        setExpandedLogo(index);
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con botón agregar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🏢</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Gestión de Logos de Clientes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los logos que aparecerán en la sección de clientes
            </p>
          </div>
        </div>
        
        <button
          onClick={addLogo}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span>➕</span>
          Agregar Logo
        </button>
      </div>

      {/* Lista de logos */}
      {localLogos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No hay logos de clientes configurados
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            Agrega logos de tus clientes para mostrar credibilidad y confianza
          </p>
          <button
            onClick={addLogo}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <span>➕</span>
            Agregar Primer Logo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {localLogos.map((logo, index) => (
            <div
              key={`logo-${index}`}
              className="bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header del logo */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setExpandedLogo(expandedLogo === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLogoUp(index);
                      }}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mover abajo"
                    >
                      ⬇️
                    </button>
                  </div>

                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                    {logo.imageUrl ? (
                      <img
                        src={logo.imageUrl}
                        alt={logo.alt}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">🏢</span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      {logo.name || `Logo ${index + 1}`}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Orden: {index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLogo(index);
                    }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar logo"
                  >
                    🗑️
                  </button>
                  
                  <div className="text-gray-400">
                    {expandedLogo === index ? '▼' : '▶'}
                  </div>
                </div>
              </div>

              {/* Contenido expandido */}
              {expandedLogo === index && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna izquierda: Información */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nombre del Cliente
                        </label>
                        <input
                          type="text"
                          value={logo.name}
                          onChange={(e) => updateLogo(index, 'name', e.target.value)}
                          placeholder="Nombre del cliente"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                          placeholder="Descripción del logo para accesibilidad"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Enlace (opcional)
                        </label>
                        <input
                          type="url"
                          value={logo.link || ''}
                          onChange={(e) => updateLogo(index, 'link', e.target.value)}
                          placeholder="https://ejemplo.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Si se proporciona, el logo será clickeable
                        </p>
                      </div>

                      <div>
                        <GradientPicker
                          value={logo.background || 'transparent'}
                          onChange={(value) => updateLogo(index, 'background', value)}
                          label="Fondo del Logo (opcional)"
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Color sólido o gradiente para el fondo específico de este logo
                        </p>
                      </div>
                    </div>

                    {/* Columna derecha: Imagen */}
                    <div>
                      <ManagedImageSelector
                        currentImage={logo.imageUrl}
                        onImageSelect={(imageUrl) => updateLogo(index, 'imageUrl', imageUrl)}
                        label="Logo del Cliente"
                        description="Selecciona el logo del cliente. Recomendado: formato PNG con fondo transparente"
                        hideButtonArea={!!logo.imageUrl}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Información de ayuda */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
              Consejos para logos de clientes
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Usa imágenes en formato PNG con fondo transparente</li>
              <li>• Mantén un tamaño consistente (aproximadamente 120x80px)</li>
              <li>• Organiza los logos por orden de importancia</li>
              <li>• Asegúrate de tener permiso para usar los logos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogosEditor;