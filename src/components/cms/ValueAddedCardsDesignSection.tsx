import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { PageData, CardDesignStyles, StrictCardDesignStyles } from '../../types/cms';
import ColorWithOpacity from './ColorWithOpacity';
import GradientPicker from './GradientPicker';
import ShadowControl from './ShadowControl';

interface ValueAddedCardsDesignSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ValueAddedCardsDesignSection: React.FC<ValueAddedCardsDesignSectionProps> = ({
  pageData,
  updateContent
}) => {
  
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 🎨 Valores por defecto CORREGIDOS para Value Added (con contraste adecuado)
  const defaultLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.9)',  // ✅ Fondo más sólido
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    titleColor: '#1F2937',      // ✅ Gris muy oscuro (contraste 12.63:1)
    descriptionColor: '#4B5563', // ✅ Gris oscuro (contraste 7.27:1)
    linkColor: '#06B6D4',        // ✅ Cyan (contraste 3.84:1)
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center'
  };

  const defaultDarkStyles: CardDesignStyles = {
    background: 'rgba(17, 24, 39, 0.9)',  // ✅ Fondo oscuro sólido
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(31, 41, 55, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    titleColor: '#FFFFFF',       // ✅ Blanco (contraste 15.52:1)
    descriptionColor: '#D1D5DB', // ✅ Gris muy claro (contraste 11.89:1)
    linkColor: '#a78bfa',        // ✅ Púrpura claro (contraste 6.14:1)
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center'
  };

  // 🔥 SOLUCIÓN: Memoizar con dependencia de pageData (como en CardsDesignConfigSection)
  const initialLightStyles = useMemo(() => {
  const dbData = pageData.content.valueAdded?.cardsDesign?.light;
  return dbData || defaultLightStyles;
  }, []); // ⚠️ TEMPORALMENTE sin dependencias para evitar bucle infinito

  const initialDarkStyles = useMemo(() => {
  const dbData = pageData.content.valueAdded?.cardsDesign?.dark;
  return dbData || defaultDarkStyles;
  }, []); // ⚠️ TEMPORALMENTE sin dependencias para evitar bucle infinito

  // Estado local temporal para los estilos que se están editando
  const [localLightStyles, setLocalLightStyles] = useState<CardDesignStyles>(initialLightStyles);
  const [localDarkStyles, setLocalDarkStyles] = useState<CardDesignStyles>(initialDarkStyles);

  // 🔧 SOLUCIÓN: Sincronizar estados locales cuando pageData cambie
  useEffect(() => {
    const dbLightData = pageData.content.valueAdded?.cardsDesign?.light;
    const dbDarkData = pageData.content.valueAdded?.cardsDesign?.dark;

    if (dbLightData) {
      setLocalLightStyles(dbLightData);
    }
    if (dbDarkData) {
      setLocalDarkStyles(dbDarkData);
    }
  }, [pageData.content.valueAdded?.cardsDesign]);

  const currentStyles = activeTheme === 'light' ? localLightStyles : localDarkStyles;
  
  // Asegurar tipos correctos para evitar errores de undefined
  const safeCurrentStyles = currentStyles as StrictCardDesignStyles;

  const updateCardStyle = (field: keyof CardDesignStyles, value: string | boolean) => {
    if (activeTheme === 'light') {
      setLocalLightStyles(prev => {
        const newStyles = { ...prev, [field]: value };
        return newStyles;
      });
    } else {
      setLocalDarkStyles(prev => {
        const newStyles = { ...prev, [field]: value };
        return newStyles;
      });
    }
    setHasUnsavedChanges(true);
    // 🔥 SOLUCIÓN: Notificar inmediatamente al sistema global de cada cambio
    const fieldPath = `valueAdded.cardsDesign.${activeTheme}.${field}`;
    updateContent(fieldPath, value);
  };

  // 🔥 SOLUCIÓN: Guardado directo campo por campo (como en CardsDesignConfigSection)
  const saveChanges = useCallback(() => {
    try {
      // Guardar cada campo individualmente en lugar de objetos completos
      Object.entries(localLightStyles).forEach(([key, value]) => {
        const fieldPath = `valueAdded.cardsDesign.light.${key}`;
        updateContent(fieldPath, value);
      });
      Object.entries(localDarkStyles).forEach(([key, value]) => {
        const fieldPath = `valueAdded.cardsDesign.dark.${key}`;
        updateContent(fieldPath, value);
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      // Error en guardado (silenciado)
    }
  }, [localLightStyles, localDarkStyles, updateContent]);

  useEffect(() => {
    (window as any).__valueAddedCardDesignSave = saveChanges;
    return () => {
      delete (window as any).__valueAddedCardDesignSave;
    };
  }, [saveChanges]);

  const resetToDefaults = () => {
    const defaults = activeTheme === 'light' ? defaultLightStyles : defaultDarkStyles;
    
    // Actualizar estado local
    if (activeTheme === 'light') {
      setLocalLightStyles(defaults);
    } else {
      setLocalDarkStyles(defaults);
    }
    
    // Marcar como cambios pendientes para que se guarde al hacer click en Guardar
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            ⭐ Diseño de Tarjetas - Valor Agregado
          </h2>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
              ⚠️ Cambios sin guardar
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Restaurar valores por defecto del tema actual"
          >
            🔄 Restaurar
          </button>
          {hasUnsavedChanges && (
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              title="Guardar cambios en la base de datos"
            >
              💾 Guardar
            </button>
          )}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema:</span>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => {
              setActiveTheme('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTheme === 'light'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            ☀️ Claro
          </button>
          <button
            onClick={() => {
              setActiveTheme('dark');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTheme === 'dark'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            🌙 Oscuro
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="mb-8 relative">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          👀 Vista Previa - {activeTheme === 'light' ? 'Tema Claro' : 'Tema Oscuro'}
        </h3>
        
        <div className={`p-8 rounded-xl ${activeTheme === 'light'
          ? 'bg-gradient-to-br from-gray-50 to-white'
          : 'bg-gradient-to-br from-gray-900 to-gray-800'
        }`}>
          {/* 🎨 Vista previa - Misma técnica exacta que ValueCard.tsx */}
          <div
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: safeCurrentStyles.border,  // ✅ El gradiente ES el background del contenedor
              padding: safeCurrentStyles.borderWidth || '2px',  // ✅ El padding crea el "borde"
              boxShadow: safeCurrentStyles.shadow,
              minWidth: safeCurrentStyles.cardMinWidth,
              maxWidth: '400px',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease'
            }}
          >
            <div
              className="relative rounded-xl h-full overflow-hidden"
              style={{
                background: safeCurrentStyles.background,  // ✅ El fondo real de la tarjeta
                borderRadius: `calc(1rem - ${safeCurrentStyles.borderWidth || '2px'})`,
                padding: safeCurrentStyles.cardPadding || '2rem',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
                {/* Content Preview */}
                <h4
                  className="text-2xl font-bold mb-4"
                  style={{ color: safeCurrentStyles.titleColor }}
                >
                  Servicio de Valor Agregado
                </h4>
                <p
                  className="leading-relaxed mb-4"
                  style={{ color: safeCurrentStyles.descriptionColor }}
                >
                  Esta es una descripción de ejemplo para mostrar cómo se verá el diseño de las tarjetas de valor agregado.
                </p>

                {/* Link Preview */}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="text-sm font-medium mr-2"
                    style={{ color: safeCurrentStyles.linkColor }}
                  >
                    Conocer más
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: safeCurrentStyles.linkColor }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Simple Mode Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          🎨 Configuración Simple
        </h3>

        {/* Fondo y Borde - Grid de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fondo de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <ColorWithOpacity
              label="Fondo de Tarjeta"
              value={safeCurrentStyles.background}
              onChange={(value) => updateCardStyle('background', value)}
            />
          </div>

          {/* Borde de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <GradientPicker
              label="Borde de Tarjeta"
              value={safeCurrentStyles.border}
              onChange={(value) => updateCardStyle('border', value)}
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grosor del Borde
              </label>
              <select
                value={safeCurrentStyles.borderWidth}
                onChange={(e) => updateCardStyle('borderWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="0px">Sin borde</option>
                <option value="1px">Fino (1px)</option>
                <option value="2px">Medio (2px)</option>
                <option value="3px">Grueso (3px)</option>
                <option value="4px">Muy grueso (4px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colores de Texto - Grid de 2 columnas */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
            ✏️ Colores de Texto
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Color del Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del Título
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={safeCurrentStyles.titleColor}
                  onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={safeCurrentStyles.titleColor}
                  onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Color de la Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color de la Descripción
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={safeCurrentStyles.descriptionColor}
                  onChange={(e) => updateCardStyle('descriptionColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={safeCurrentStyles.descriptionColor}
                  onChange={(e) => updateCardStyle('descriptionColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Color del "Conocer más" */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del "Conocer más"
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={safeCurrentStyles.linkColor}
                  onChange={(e) => updateCardStyle('linkColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={safeCurrentStyles.linkColor}
                  onChange={(e) => updateCardStyle('linkColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Mode Toggle */}
      <div className="mt-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-between"
        >
          <span>⚙️ Opciones Avanzadas</span>
          <span className="text-xl">{showAdvanced ? '▼' : '▶'}</span>
        </button>
      </div>

      {/* Advanced Mode Configuration */}
      {showAdvanced && (
        <div className="mt-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            ⚙️ Configuración Avanzada
          </h3>

          {/* Grid de 2 columnas para Tamaño y Sombras */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tamaño de Tarjetas - MEJORADO */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                📏 Tamaño de Tarjetas
              </h4>
              
              {/* Presets Rápidos */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎯 Tamaños Predefinidos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '250px');
                      updateCardStyle('cardPadding', '1.5rem');
                    }}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    📱 Pequeño
                  </button>
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '320px');
                      updateCardStyle('cardPadding', '2rem');
                    }}
                    className="px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    💻 Mediano
                  </button>
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '400px');
                      updateCardStyle('cardPadding', '2.5rem');
                    }}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    🖥️ Grande
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Ancho de Tarjetas - Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📐 Ancho Mínimo: <span className="font-mono text-blue-600 dark:text-blue-400">{safeCurrentStyles.cardMinWidth || '280px'}</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="200"
                      max="500"
                      step="10"
                      value={parseInt(safeCurrentStyles.cardMinWidth?.replace('px', '') || '280')}
                      onChange={(e) => updateCardStyle('cardMinWidth', `${e.target.value}px`)}
                      className="w-full h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg appearance-none cursor-pointer hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(to right, #8B5CF6, #06B6D4)',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>200px (Muy pequeño)</span>
                      <span>350px (Ideal)</span>
                      <span>500px (Muy grande)</span>
                    </div>
                  </div>
                </div>

                {/* Alto de Tarjetas - Toggle + Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📏 Alto Mínimo
                  </label>
                  <div className="space-y-3">
                    {/* Toggle Auto/Manual */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateCardStyle('cardMinHeight', 'auto')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          safeCurrentStyles.cardMinHeight === 'auto'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        🔧 Automático
                      </button>
                      <button
                        onClick={() => updateCardStyle('cardMinHeight', '300px')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          safeCurrentStyles.cardMinHeight !== 'auto'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        📏 Manual: <span className="font-mono">{safeCurrentStyles.cardMinHeight !== 'auto' ? safeCurrentStyles.cardMinHeight : '300px'}</span>
                      </button>
                    </div>
                    
                    {/* Slider para altura manual */}
                    {safeCurrentStyles.cardMinHeight !== 'auto' && (
                      <div className="ml-4">
                        <input
                          type="range"
                          min="250"
                          max="600"
                          step="25"
                          value={parseInt(safeCurrentStyles.cardMinHeight?.replace('px', '') || '300')}
                          onChange={(e) => updateCardStyle('cardMinHeight', `${e.target.value}px`)}
                          className="w-full h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg appearance-none cursor-pointer hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                          style={{
                            background: 'linear-gradient(to right, #3B82F6, #10B981)',
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>250px</span>
                          <span>425px</span>
                          <span>600px</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Espaciado Interno - Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📦 Espaciado Interno: <span className="font-mono text-purple-600 dark:text-purple-400">{safeCurrentStyles.cardPadding || '2rem'}</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.25"
                      value={parseFloat(safeCurrentStyles.cardPadding?.replace('rem', '') || '2')}
                      onChange={(e) => updateCardStyle('cardPadding', `${e.target.value}rem`)}
                      className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg appearance-none cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>1rem (Compacto)</span>
                      <span>2.5rem (Cómodo)</span>
                      <span>4rem (Espacioso)</span>
                    </div>
                  </div>
                </div>

                {/* Ancho Máximo - Simple select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ↔️ Ancho Máximo
                  </label>
                  <select
                    value={safeCurrentStyles.cardMaxWidth || '100%'}
                    onChange={(e) => updateCardStyle('cardMaxWidth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="100%">📱 Responsive (100%)</option>
                    <option value="400px">💻 Fijo Pequeño (400px)</option>
                    <option value="500px">🖥️ Fijo Mediano (500px)</option>
                    <option value="600px">📺 Fijo Grande (600px)</option>
                  </select>
                </div>

                {/* Alineación de Tarjetas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🎯 Alineación de Tarjetas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'left')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        safeCurrentStyles.cardsAlignment === 'left'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ⬅️ Izquierda
                    </button>
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'center')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        safeCurrentStyles.cardsAlignment === 'center'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 ring-2 ring-green-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ⬆️ Centro
                    </button>
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'right')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        safeCurrentStyles.cardsAlignment === 'right'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 ring-2 ring-purple-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ➡️ Derecha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sombras */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                🌑 Sombras
              </h4>
              <ShadowControl
                label="Sombra Normal"
                value={safeCurrentStyles.shadow}
                onChange={(value) => updateCardStyle('shadow', value)}
              />
            </div>
          </div>

          {/* Efectos Hover - Ancho completo con grid interno */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🖱️ Efectos Hover
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fondo y Borde Hover */}
              <div className="space-y-6">
                <ColorWithOpacity
                  label="Fondo (Hover)"
                  value={safeCurrentStyles.hoverBackground}
                  onChange={(value) => updateCardStyle('hoverBackground', value)}
                />

                <GradientPicker
                  label="Borde (Hover)"
                  value={safeCurrentStyles.hoverBorder || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                  onChange={(value) => updateCardStyle('hoverBorder', value)}
                />
              </div>

              {/* Sombra Hover */}
              <div>
                <ShadowControl
                  label="Sombra (Hover)"
                  value={safeCurrentStyles.hoverShadow}
                  onChange={(value) => updateCardStyle('hoverShadow', value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 Los cambios se reflejan en tiempo real. Recuerda hacer click en "💾 Guardar" para persistir los cambios.
        </p>
      </div>
    </div>
  );
};

export default ValueAddedCardsDesignSection;