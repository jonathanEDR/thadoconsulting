import React, { useState } from 'react';

interface GoogleMapsHelperProps {
  onUrlChange?: (url: string) => void;
}

const GoogleMapsHelper: React.FC<GoogleMapsHelperProps> = ({ onUrlChange }) => {
  const [showGuide, setShowGuide] = useState(false);

  const exampleUrls = [
    {
      type: 'Enlace de lugar específico',
      url: 'https://www.google.com/maps/place/Mi+Empresa/@-12.0464,-77.0428,17z',
      description: 'Enlace de un negocio registrado en Google Maps'
    },
    {
      type: 'Enlace de ubicación directa',
      url: 'https://www.google.com/maps/@-12.0464,-77.0428,15z',
      description: 'Enlace directo a coordenadas específicas'
    },
    {
      type: 'Enlace con parámetro de búsqueda',
      url: 'https://maps.google.com/maps?q=-12.0464,-77.0428',
      description: 'Enlace con coordenadas como parámetro de búsqueda'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Botón para mostrar/ocultar guía */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        <span>{showGuide ? '🔼' : '🔽'}</span>
        {showGuide ? 'Ocultar guía paso a paso' : 'Ver guía paso a paso con imágenes'}
      </button>

      {/* Guía expandible */}
      {showGuide && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
            📍 Cómo obtener el enlace de tu negocio en Google Maps:
          </h4>
          
          <div className="space-y-4">
            {/* Paso 1 */}
            <div className="flex gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Abre Google Maps
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Ve a <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">maps.google.com</a>
                </p>
                <div className="bg-white dark:bg-gray-700 rounded border p-2 text-xs text-gray-500 dark:text-gray-400">
                  💡 También puedes usar la app móvil de Google Maps
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Busca tu negocio
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Escribe el nombre de tu empresa o dirección en la barra de búsqueda
                </p>
                <div className="bg-white dark:bg-gray-700 rounded border p-2 text-xs text-gray-500 dark:text-gray-400">
                  🔍 Si tu negocio no aparece, puedes buscar por dirección exacta
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="flex gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Obtén el enlace
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Haz clic en el botón "Compartir" y copia el enlace
                </p>
                <div className="bg-white dark:bg-gray-700 rounded border p-2 text-xs text-gray-500 dark:text-gray-400">
                  📋 También puedes copiar la URL directamente desde la barra de direcciones
                </div>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="flex gap-3">
              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Pega aquí el enlace
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Copia y pega el enlace en el campo de arriba. Las coordenadas se extraerán automáticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Ejemplos de enlaces válidos */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              ✅ Ejemplos de enlaces válidos:
            </h5>
            <div className="space-y-3">
              {exampleUrls.map((example, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {example.type}
                  </h6>
                  <code className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded block mb-1 break-all">
                    {example.url}
                  </code>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {example.description}
                  </p>
                  {onUrlChange && (
                    <button
                      onClick={() => onUrlChange(example.url)}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      📋 Usar este ejemplo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Consejos adicionales */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h6 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Consejos importantes:
            </h6>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Si tu negocio está registrado en Google Maps, el enlace incluirá el nombre automáticamente</li>
              <li>• Los enlaces cortos (goo.gl/maps/...) también funcionan</li>
              <li>• Puedes usar enlaces tanto de la versión web como de la app móvil</li>
              <li>• El sistema detecta automáticamente las coordenadas de diferentes formatos de enlace</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsHelper;