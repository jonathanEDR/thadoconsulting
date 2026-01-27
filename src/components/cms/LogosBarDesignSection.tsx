import React, { useState, useEffect, useCallback } from 'react';
import type { PageData, LogosBarDesignStyles } from '../../types/cms';

interface LogosBarDesignSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const LogosBarDesignSection: React.FC<LogosBarDesignSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 🎨 Valores por defecto para configuración de logos (sin barra)
  const defaultLightStyles: LogosBarDesignStyles = {
    animationsEnabled: true,
    rotationMode: 'individual',
    animationSpeed: 'normal',
    hoverEffects: true,
    hoverIntensity: 'normal',
    glowEffects: true,
    autoDetectTech: true,
    logoSize: 'medium',
    logoSpacing: 'normal',
    logoFormat: 'rectangle',
    maxLogoWidth: 'medium',
    uniformSize: false
  };

  const defaultDarkStyles: LogosBarDesignStyles = {
    animationsEnabled: true,
    rotationMode: 'individual',
    animationSpeed: 'normal',
    hoverEffects: true,
    hoverIntensity: 'normal',
    glowEffects: true,
    autoDetectTech: true,
    logoSize: 'medium',
    logoSpacing: 'normal',
    logoFormat: 'rectangle',
    maxLogoWidth: 'medium',
    uniformSize: false
  };

  // Estado local temporal para los estilos que se están editando
  const [localLightStyles, setLocalLightStyles] = useState<LogosBarDesignStyles>(() => ({
    ...defaultLightStyles,
    ...(pageData.content.valueAdded?.logosBarDesign?.light || {})
  }));
  
  const [localDarkStyles, setLocalDarkStyles] = useState<LogosBarDesignStyles>(() => ({
    ...defaultDarkStyles,
    ...(pageData.content.valueAdded?.logosBarDesign?.dark || {})
  }));

  // Sincronizar estados locales cuando pageData cambie
  useEffect(() => {
    const newLightStyles = {
      ...defaultLightStyles,
      ...(pageData.content.valueAdded?.logosBarDesign?.light || {})
    };
    
    const newDarkStyles = {
      ...defaultDarkStyles,
      ...(pageData.content.valueAdded?.logosBarDesign?.dark || {})
    };
    
    setLocalLightStyles(newLightStyles);
    setLocalDarkStyles(newDarkStyles);
  }, [pageData.content.valueAdded?.logosBarDesign]);

  // Obtener estilos actuales del estado local según el tema activo
  const currentStyles = activeTheme === 'light' ? localLightStyles : localDarkStyles;
  
  // Función para actualizar un estilo individual
  const updateBarStyle = (key: keyof LogosBarDesignStyles, value: any) => {
    const updatedStyles = {
      ...(activeTheme === 'light' ? localLightStyles : localDarkStyles),
      [key]: value
    };
    
    // Actualizar estado local
    if (activeTheme === 'light') {
      setLocalLightStyles(updatedStyles);
    } else {
      setLocalDarkStyles(updatedStyles);
    }
    
    // Actualizar pageData
    updateContent(`valueAdded.logosBarDesign.${activeTheme}`, updatedStyles);
    setHasUnsavedChanges(true);
  };

  const saveChanges = useCallback(async () => {
    // Guardar ambos temas
    updateContent('valueAdded.logosBarDesign', {
      light: localLightStyles,
      dark: localDarkStyles
    });
    
    setHasUnsavedChanges(false);
    return true;
  }, [localLightStyles, localDarkStyles, updateContent]);

  useEffect(() => {
    (window as any).__logosBarDesignSave = saveChanges;
    
    return () => {
      delete (window as any).__logosBarDesignSave;
    };
  }, [saveChanges]);

  const resetToDefaults = () => {
    const defaults = activeTheme === 'light' ? defaultLightStyles : defaultDarkStyles;
    
    if (activeTheme === 'light') {
      setLocalLightStyles(defaults);
      updateContent('valueAdded.logosBarDesign.light', defaults);
    } else {
      setLocalDarkStyles(defaults);
      updateContent('valueAdded.logosBarDesign.dark', defaults);
    }
    
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🎨</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Configuración de Burbujas Flotantes 🫧
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza el comportamiento de los logos que flotan como burbujas por toda la sección
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Restaurar valores por defecto del tema actual"
          >
            🔄 Restaurar
          </button>
          
          {hasUnsavedChanges && (
            <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-lg text-sm font-medium border border-orange-200 dark:border-orange-700 flex items-center gap-2">
              <span>⚠️</span>
              Tienes cambios sin guardar. Usa el botón "Guardar" de arriba.
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🫧</span>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Efecto de Burbujas Flotantes
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Los logos flotan libremente por toda la sección como burbujas en el espacio. Se mueven de forma aleatoria, 
              rebotan en los bordes, rotan suavemente y reaccionan al cursor del mouse. Algunas burbujas flotan detrás 
              de las tarjetas y otras por delante, creando un efecto de profundidad 3D.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema:</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setActiveTheme('light')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTheme === 'light'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ☀️ Claro
          </button>
          <button
            onClick={() => setActiveTheme('dark')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTheme === 'dark'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🌙 Oscuro
          </button>
        </div>
      </div>

      {/* Configuraciones */}
      <div className="space-y-6">
        {/* Grid de 2 columnas para Movimiento e Interacción */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna 1: Movimiento de Burbujas */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">🫧 Movimiento de Burbujas</h4>
            
            <div className="space-y-4">
              {/* Animaciones Habilitadas */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Movimiento Activo
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Flotan con rebotes y rotación
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentStyles.animationsEnabled ?? true}
                  onChange={(e) => updateBarStyle('animationsEnabled', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              {/* Modo de Rotación */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Estilo de Rotación
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Rotación suave mientras flotan
                </p>
                <select
                  value={currentStyles.rotationMode || 'individual'}
                  onChange={(e) => updateBarStyle('rotationMode', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="none">Sin rotación</option>
                  <option value="individual">Rotación continua</option>
                </select>
              </div>

              {/* Velocidad de Animación */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Velocidad de Movimiento
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Velocidad de desplazamiento
                </p>
                <select
                  value={currentStyles.animationSpeed || 'normal'}
                  onChange={(e) => updateBarStyle('animationSpeed', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="slow">🐌 Lenta (relajante)</option>
                  <option value="normal">⚡ Normal (equilibrado)</option>
                  <option value="fast">🚀 Rápida (energética)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Columna 2: Interacción con Mouse */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">👆 Interacción con Mouse</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              El cursor empuja las burbujas al pasar cerca
            </p>
            
            <div className="space-y-4">
              {/* Hover Habilitado */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Efectos Hover
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Escala al pasar el mouse
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentStyles.hoverEffects ?? true}
                  onChange={(e) => updateBarStyle('hoverEffects', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              {/* Intensidad de Hover */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Fuerza de Empuje
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Qué tan fuerte empuja el cursor
                </p>
                <select
                  value={currentStyles.hoverIntensity || 'normal'}
                  onChange={(e) => updateBarStyle('hoverIntensity', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="subtle">💨 Sutil</option>
                  <option value="normal">💫 Normal</option>
                  <option value="intense">💥 Intenso</option>
                </select>
              </div>

              {/* Efectos de Glow */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Efectos de Brillo
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Resplandor alrededor de burbujas
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentStyles.glowEffects ?? true}
                  onChange={(e) => updateBarStyle('glowEffects', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid de 2 columnas para Tamaño/Espaciado y Detección Inteligente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna 1: Tamaño y Espaciado */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">📏 Tamaño y Espaciado</h4>
            
            <div className="space-y-4">
              {/* Tamaño de Logos */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Tamaño de Burbujas
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Tamaño de los logos dentro de las burbujas
                </p>
                <select
                  value={currentStyles.logoSize || 'medium'}
                  onChange={(e) => updateBarStyle('logoSize', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="small">🔹 Pequeño</option>
                  <option value="medium">🔸 Mediano</option>
                  <option value="large">🔶 Grande</option>
                </select>
              </div>

              {/* Formato de Logo */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Formato de Logo
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Proporción de la imagen
                </p>
                <select
                  value={currentStyles.logoFormat || 'rectangle'}
                  onChange={(e) => updateBarStyle('logoFormat', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="square">⬛ Cuadrado</option>
                  <option value="rectangle">▭ Rectangular</option>
                  <option value="original">🖼️ Original</option>
                </select>
              </div>

              {/* Ancho Máximo */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Ancho Máximo
                </label>
                <select
                  value={currentStyles.maxLogoWidth || 'medium'}
                  onChange={(e) => updateBarStyle('maxLogoWidth', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="small">Pequeño (80px)</option>
                  <option value="medium">Mediano (120px)</option>
                  <option value="large">Grande (160px)</option>
                </select>
              </div>

              {/* Tamaño Uniforme */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Tamaño Uniforme
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Todas las burbujas del mismo tamaño
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentStyles.uniformSize ?? false}
                  onChange={(e) => updateBarStyle('uniformSize', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>

          {/* Columna 2: Detección Inteligente */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">🤖 Detección Inteligente</h4>
            
            <div className="space-y-4">
              {/* Detección Automática */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Detección Automática de Tecnología
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Aplica animaciones específicas según el tipo de tecnología
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentStyles.autoDetectTech ?? true}
                  onChange={(e) => updateBarStyle('autoDetectTech', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              {/* Info adicional sobre detección */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 <strong>Detección inteligente:</strong> El sistema reconoce automáticamente tecnologías 
                  como React, Python, Docker, etc., y aplica efectos visuales personalizados a cada burbuja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogosBarDesignSection;
