import React, { useState, useEffect, useCallback } from 'react';
import type { PageData, ClientLogosDesignStyles } from '../../types/cms';

interface ClientLogosDesignSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ClientLogosDesignSection: React.FC<ClientLogosDesignSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'logos' | 'animations'>('logos');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 🎨 Valores por defecto para el diseño de los logos
  const defaultLogosLightStyles: ClientLogosDesignStyles = {
    logoMaxWidth: '120px',
    logoMaxHeight: '80px',
    logoOpacity: '0.7',
    logoHoverOpacity: '1',
    logoFilter: 'grayscale(0%)',
    logoHoverFilter: 'grayscale(0%)',
    logosGap: '2rem',
    logosAlignment: 'center',
    // Animaciones
    floatAnimation: true,
    floatIntensity: 'normal',
    mouseTracking: true,
    mouseIntensity: 'normal',
    hoverScale: 1.15,
    hoverRotation: true,
    // Carrusel
    carouselEnabled: true,
    carouselSpeed: 3000,
    logosToShowDesktop: 6,
    logosToShowTablet: 4,
    logosToShowMobile: 3
  };

  const defaultLogosDarkStyles: ClientLogosDesignStyles = {
    logoMaxWidth: '120px',
    logoMaxHeight: '80px',
    logoOpacity: '0.8',
    logoHoverOpacity: '1',
    logoFilter: 'brightness(0) invert(1)',
    logoHoverFilter: 'brightness(0) invert(1)',
    logosGap: '2rem',
    logosAlignment: 'center',
    // Animaciones
    floatAnimation: true,
    floatIntensity: 'normal',
    mouseTracking: true,
    mouseIntensity: 'normal',
    hoverScale: 1.15,
    hoverRotation: true,
    // Carrusel
    carouselEnabled: true,
    carouselSpeed: 3000,
    logosToShowDesktop: 6,
    logosToShowTablet: 4,
    logosToShowMobile: 3
  };

  // Estado local temporal para los estilos que se están editando
  const [localLogosLightStyles, setLocalLogosLightStyles] = useState<ClientLogosDesignStyles>(() => ({
    ...defaultLogosLightStyles,
    ...(pageData.content.clientLogos?.logosDesign?.light || {})
  }));
  
  const [localLogosDarkStyles, setLocalLogosDarkStyles] = useState<ClientLogosDesignStyles>(() => ({
    ...defaultLogosDarkStyles,
    ...(pageData.content.clientLogos?.logosDesign?.dark || {})
  }));

  // Sincronizar estados locales cuando pageData cambie
  useEffect(() => {
    const newLogosLightStyles = {
      ...defaultLogosLightStyles,
      ...(pageData.content.clientLogos?.logosDesign?.light || {})
    };
    
    const newLogosDarkStyles = {
      ...defaultLogosDarkStyles,
      ...(pageData.content.clientLogos?.logosDesign?.dark || {})
    };
    
    setLocalLogosLightStyles(newLogosLightStyles);
    setLocalLogosDarkStyles(newLogosDarkStyles);
  }, [pageData.content.clientLogos?.logosDesign]);

  // Obtener estilos actuales del estado local según el tema activo
  const currentLogosStyles = activeTheme === 'light' ? localLogosLightStyles : localLogosDarkStyles;

  const updateLogosStyle = (field: keyof ClientLogosDesignStyles, value: string | number | boolean) => {
    // Actualizar estado local inmediatamente (para vista previa)
    if (activeTheme === 'light') {
      setLocalLogosLightStyles(prev => ({ ...prev, [field]: value }));
    } else {
      setLocalLogosDarkStyles(prev => ({ ...prev, [field]: value }));
    }

    // También actualizar pageData inmediatamente para sincronización completa
    const currentPath = `clientLogos.logosDesign.${activeTheme}.${field}`;
    updateContent(currentPath, value);

    setHasUnsavedChanges(true);
  };

  // Función para guardar los cambios al padre
  const saveChanges = useCallback(() => {
    // Guardar valores COMPLETOS - AMBOS TEMAS SIEMPRE
    const completeLogosDesign = {
      light: { ...localLogosLightStyles },
      dark: { ...localLogosDarkStyles }
    };
    
    // Actualizar la configuración completa de una vez
    updateContent('clientLogos.logosDesign', completeLogosDesign);
    
    setHasUnsavedChanges(false);
  }, [localLogosLightStyles, localLogosDarkStyles, updateContent]);

  // Exponer saveChanges para que CmsManager pueda llamarlo
  useEffect(() => {
    (window as any).__clientLogosDesignSave = saveChanges;
    
    return () => {
      delete (window as any).__clientLogosDesignSave;
    };
  }, [saveChanges]);

  const resetToDefaults = () => {
    const defaults = activeTheme === 'light' ? defaultLogosLightStyles : defaultLogosDarkStyles;
    
    // Actualizar estado local
    if (activeTheme === 'light') {
      setLocalLogosLightStyles(defaults);
      updateContent('clientLogos.logosDesign.light', defaults);
    } else {
      setLocalLogosDarkStyles(defaults);
      updateContent('clientLogos.logosDesign.dark', defaults);
    }
    
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🏢</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Diseño de Logos de Clientes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza el diseño de la sección de logos de clientes
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Restaurar valores por defecto del tema y sección actual"
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

      {/* Tab Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Configurar:</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setActiveTab('logos')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'logos'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🖼️ Diseño de Logos
          </button>
          <button
            onClick={() => setActiveTab('animations')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'animations'
                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ✨ Animaciones y Carrusel
          </button>
        </div>
      </div>

      {/* Vista Previa */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          👁️ Vista Previa - Tema {activeTheme === 'light' ? 'Claro' : 'Oscuro'}
        </h4>
        
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl relative overflow-hidden">
          {/* Simulación del fondo de la página */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
          
          {/* Preview de logos directamente */}
          <div className="relative">
            <div className="py-8 px-4">
              {/* Título y descripción de ejemplo */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Nuestros clientes
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Empresas que confían en nosotros
                </p>
              </div>

              {/* Logos sin tarjetas - Directo en flexbox */}
              <div 
                className="flex flex-wrap items-center"
                style={{
                  gap: currentLogosStyles.logosGap,
                  justifyContent: currentLogosStyles.logosAlignment
                }}
              >
                {/* Logos reales o placeholders */}
                {pageData.content.clientLogos?.logos && pageData.content.clientLogos.logos.length > 0 ? (
                  pageData.content.clientLogos.logos.slice(0, 6).map((logo, index) => (
                    <div
                      key={`preview-logo-${index}-${logo.name || 'logo'}`}
                      style={{
                        maxWidth: currentLogosStyles.logoMaxWidth,
                        maxHeight: currentLogosStyles.logoMaxHeight,
                        opacity: currentLogosStyles.logoOpacity,
                        filter: currentLogosStyles.logoFilter
                      }}
                      className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                    >
                      {logo.imageUrl ? (
                        <img 
                          src={logo.imageUrl} 
                          alt={logo.alt || 'Cliente logo'} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-sm">
                          Logo
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Mostrar placeholders cuando no hay logos
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={`placeholder-${i}`}
                      style={{
                        maxWidth: currentLogosStyles.logoMaxWidth,
                        maxHeight: currentLogosStyles.logoMaxHeight,
                        opacity: currentLogosStyles.logoOpacity,
                        filter: currentLogosStyles.logoFilter
                      }}
                      className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                    >
                      <div className="w-16 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded flex items-center justify-center text-white font-bold text-sm">
                        {i}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de configuración */}
      {activeTab === 'logos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Logos */}
          <div className="space-y-6">
            {/* Tamaño máximo de logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Ancho Máximo de Logos
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="80"
                  max="200"
                  step="10"
                  value={parseInt(currentLogosStyles.logoMaxWidth.replace('px', ''))}
                  onChange={(e) => updateLogosStyle('logoMaxWidth', `${e.target.value}px`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLogosStyles.logoMaxWidth}
                </div>
              </div>
            </div>

            {/* Alto máximo de logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Alto Máximo de Logos
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="10"
                  value={parseInt(currentLogosStyles.logoMaxHeight.replace('px', ''))}
                  onChange={(e) => updateLogosStyle('logoMaxHeight', `${e.target.value}px`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLogosStyles.logoMaxHeight}
                </div>
              </div>
            </div>

            {/* Opacidad normal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Opacidad Normal
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.1"
                  value={parseFloat(currentLogosStyles.logoOpacity)}
                  onChange={(e) => updateLogosStyle('logoOpacity', e.target.value)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(parseFloat(currentLogosStyles.logoOpacity) * 100)}%
                </div>
              </div>
            </div>

          </div>

          {/* Columna derecha - Logos */}
          <div className="space-y-6">
            {/* Separación entre logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Separación entre Logos
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={parseFloat(currentLogosStyles.logosGap.replace('rem', ''))}
                  onChange={(e) => updateLogosStyle('logosGap', `${e.target.value}rem`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLogosStyles.logosGap} ({Math.round(parseFloat(currentLogosStyles.logosGap.replace('rem', '')) * 16)}px)
                </div>
              </div>
            </div>

            {/* Alineación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Alineación de Logos
              </label>
              <select
                value={currentLogosStyles.logosAlignment}
                onChange={(e) => updateLogosStyle('logosAlignment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>

            {/* Filtro de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Filtro de Imagen
              </label>
              <select
                value={currentLogosStyles.logoFilter}
                onChange={(e) => updateLogosStyle('logoFilter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="grayscale(0%)">Color normal</option>
                <option value="grayscale(100%)">Escala de grises</option>
                <option value="brightness(0) invert(1)">Blanco (para tema oscuro)</option>
                <option value="sepia(100%)">Sepia</option>
              </select>
            </div>

          </div>
        </div>
      ) : activeTab === 'animations' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Animaciones de Flotación */}
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700">
              <h4 className="font-medium text-cyan-800 dark:text-cyan-300 mb-2 flex items-center gap-2">
                <span>🎈</span> Animación de Flotación
              </h4>
              <p className="text-sm text-cyan-700 dark:text-cyan-400 mb-4">
                Los logos flotarán suavemente hacia arriba y abajo
              </p>

              {/* Habilitar flotación */}
              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentLogosStyles.floatAnimation !== false}
                    onChange={(e) => updateLogosStyle('floatAnimation', e.target.checked)}
                    className="w-5 h-5 text-cyan-600 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Habilitar animación flotante
                  </span>
                </label>
              </div>

              {/* Intensidad de flotación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Intensidad de Flotación
                </label>
                <select
                  value={currentLogosStyles.floatIntensity || 'normal'}
                  onChange={(e) => updateLogosStyle('floatIntensity', e.target.value)}
                  disabled={currentLogosStyles.floatAnimation === false}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                >
                  <option value="subtle">Sutil (8px)</option>
                  <option value="normal">Normal (15px)</option>
                  <option value="strong">Fuerte (20px)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                <span>🖱️</span> Interacción con Mouse
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-400 mb-4">
                Los logos reaccionarán cuando pases el mouse sobre ellos
              </p>

              {/* Escala en hover */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Escala al Pasar Mouse
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="1.5"
                    step="0.05"
                    value={currentLogosStyles.hoverScale || 1.15}
                    onChange={(e) => updateLogosStyle('hoverScale', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {((currentLogosStyles.hoverScale || 1.15) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Carrusel */}
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <span>🎠</span> Carrusel Automático
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                Muestra solo algunos logos y rota automáticamente
              </p>

              {/* Habilitar carrusel */}
              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentLogosStyles.carouselEnabled !== false}
                    onChange={(e) => updateLogosStyle('carouselEnabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Habilitar rotación automática
                  </span>
                </label>
              </div>

              {/* Velocidad del carrusel */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Velocidad de Rotación
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1000"
                    max="8000"
                    step="500"
                    value={currentLogosStyles.carouselSpeed || 3000}
                    onChange={(e) => updateLogosStyle('carouselSpeed', parseInt(e.target.value))}
                    disabled={currentLogosStyles.carouselEnabled === false}
                    className="w-full disabled:opacity-50"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {((currentLogosStyles.carouselSpeed || 3000) / 1000).toFixed(1)} segundos
                  </div>
                </div>
              </div>

              {/* Logos visibles - Desktop */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Logos Visibles en Desktop
                </label>
                <select
                  value={currentLogosStyles.logosToShowDesktop || 6}
                  onChange={(e) => updateLogosStyle('logosToShowDesktop', parseInt(e.target.value))}
                  disabled={currentLogosStyles.carouselEnabled === false}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                >
                  <option value={4}>4 logos</option>
                  <option value={5}>5 logos</option>
                  <option value={6}>6 logos</option>
                  <option value={7}>7 logos</option>
                  <option value={8}>8 logos</option>
                </select>
              </div>

              {/* Logos visibles - Tablet */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Logos Visibles en Tablet
                </label>
                <select
                  value={currentLogosStyles.logosToShowTablet || 4}
                  onChange={(e) => updateLogosStyle('logosToShowTablet', parseInt(e.target.value))}
                  disabled={currentLogosStyles.carouselEnabled === false}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                >
                  <option value={2}>2 logos</option>
                  <option value={3}>3 logos</option>
                  <option value={4}>4 logos</option>
                  <option value={5}>5 logos</option>
                </select>
              </div>

              {/* Logos visibles - Móvil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Logos Visibles en Móvil
                </label>
                <select
                  value={currentLogosStyles.logosToShowMobile || 3}
                  onChange={(e) => updateLogosStyle('logosToShowMobile', parseInt(e.target.value))}
                  disabled={currentLogosStyles.carouselEnabled === false}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                >
                  <option value={2}>2 logos</option>
                  <option value={3}>3 logos</option>
                  <option value={4}>4 logos</option>
                </select>
              </div>
            </div>

            {/* Info de torbellino */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                <span>🌪️</span> Efecto Torbellino
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Al hacer clic en un logo, desaparecerá con un efecto de torbellino girando 4 vueltas completas (1440°) y reaparecerá automáticamente después de 2.5 segundos.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ClientLogosDesignSection;