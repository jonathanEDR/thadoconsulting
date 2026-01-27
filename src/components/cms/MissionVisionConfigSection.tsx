import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';

// Lista de fuentes disponibles
const AVAILABLE_FONTS = [
  { value: 'Montserrat', label: 'Montserrat (Recomendada)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
];

interface MissionVisionConfigSectionProps {
  pageData: any;
  updateContent: (field: string, value: any) => void;
}

const MissionVisionConfigSection: React.FC<MissionVisionConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const mission = pageData?.content?.mission || {};
  const vision = pageData?.content?.vision || {};
  const missionVisionBackground = pageData?.content?.missionVisionBackground || {};
  const history = pageData?.content?.history || {}; // 🆕 Sección Historia
  
  // Estado para controlar si la sección está colapsada
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="mission-vision-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center gap-2">
          🎯 Misión y Visión
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="mission-vision-section-content" className="space-y-8">
      
      {/* 🌄 FONDO DE SECCIÓN MISIÓN Y VISIÓN */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-blue-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            🌄 Imagen de Fondo (Misión y Visión)
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Esta imagen de fondo se aplicará a toda la sección que contiene Misión y Visión.
        </p>

        {/* Selector de imagen de fondo - Tema Claro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Tema Claro */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700/50">
            <div className="flex items-center mb-3">
              <div className="bg-amber-100 dark:bg-amber-800/50 rounded-full p-2 mr-3">
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200">☀️ Tema Claro</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Imagen para modo diurno</p>
              </div>
            </div>
            <ManagedImageSelector
              label="Imagen de Fondo (Claro)"
              description="Tamaño recomendado: 1920x1080px"
              currentImage={
                typeof missionVisionBackground.backgroundImage === 'string' 
                  ? missionVisionBackground.backgroundImage 
                  : (missionVisionBackground.backgroundImage?.light || '')
              }
              onImageSelect={(url: string) => {
                const currentBgImage = typeof missionVisionBackground.backgroundImage === 'string'
                  ? { light: missionVisionBackground.backgroundImage, dark: missionVisionBackground.backgroundImage }
                  : (missionVisionBackground.backgroundImage || {});
                updateContent('missionVisionBackground.backgroundImage', {
                  ...currentBgImage,
                  light: url
                });
              }}
              hideButtonArea={!!(
                typeof missionVisionBackground.backgroundImage === 'string' 
                  ? missionVisionBackground.backgroundImage 
                  : missionVisionBackground.backgroundImage?.light
              )}
            />
          </div>

          {/* Tema Oscuro */}
          <div className="bg-gradient-to-br from-slate-800 to-gray-900 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center mb-3">
              <div className="bg-gray-700 rounded-full p-2 mr-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">🌙 Tema Oscuro</h5>
                <p className="text-xs text-gray-400">Imagen para modo nocturno</p>
              </div>
            </div>
            <ManagedImageSelector
              label="Imagen de Fondo (Oscuro)"
              description="Tamaño recomendado: 1920x1080px"
              currentImage={
                typeof missionVisionBackground.backgroundImage === 'string' 
                  ? missionVisionBackground.backgroundImage 
                  : (missionVisionBackground.backgroundImage?.dark || '')
              }
              onImageSelect={(url: string) => {
                const currentBgImage = typeof missionVisionBackground.backgroundImage === 'string'
                  ? { light: missionVisionBackground.backgroundImage, dark: missionVisionBackground.backgroundImage }
                  : (missionVisionBackground.backgroundImage || {});
                updateContent('missionVisionBackground.backgroundImage', {
                  ...currentBgImage,
                  dark: url
                });
              }}
              darkMode={true}
              hideButtonArea={!!(
                typeof missionVisionBackground.backgroundImage === 'string' 
                  ? missionVisionBackground.backgroundImage 
                  : missionVisionBackground.backgroundImage?.dark
              )}
            />
          </div>
        </div>

        {/* Preview de ambas imágenes */}
        {(typeof missionVisionBackground.backgroundImage === 'object' && 
          (missionVisionBackground.backgroundImage?.light || missionVisionBackground.backgroundImage?.dark)
        ) && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            {missionVisionBackground.backgroundImage?.light && (
              <div>
                <p className="text-xs text-gray-500 mb-1">☀️ Vista previa - Tema Claro</p>
                <img 
                  src={missionVisionBackground.backgroundImage.light} 
                  alt="Fondo Claro" 
                  className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
            {missionVisionBackground.backgroundImage?.dark && (
              <div>
                <p className="text-xs text-gray-500 mb-1">🌙 Vista previa - Tema Oscuro</p>
                <img 
                  src={missionVisionBackground.backgroundImage.dark} 
                  alt="Fondo Oscuro" 
                  className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        )}

        {/* Preview si es string simple (migración) */}
        {typeof missionVisionBackground.backgroundImage === 'string' && missionVisionBackground.backgroundImage && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Vista previa del fondo (misma imagen para ambos temas)</p>
            <img 
              src={missionVisionBackground.backgroundImage} 
              alt="Fondo Misión y Visión" 
              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
          </div>
        )}

        {/* Opacidad del fondo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opacidad de la imagen: {Math.round((missionVisionBackground.backgroundOpacity ?? 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round((missionVisionBackground.backgroundOpacity ?? 1) * 100)}
            onChange={(e) => updateContent('missionVisionBackground.backgroundOpacity', parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0% (Invisible)</span>
            <span>50%</span>
            <span>100% (Nítido)</span>
          </div>
        </div>

        {/* Toggle Overlay */}
        <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
          <input
            type="checkbox"
            id="mv-background-overlay"
            checked={missionVisionBackground.backgroundOverlay === true}
            onChange={(e) => updateContent('missionVisionBackground.backgroundOverlay', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="mv-background-overlay" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Aplicar overlay oscuro (mejora legibilidad del texto)
          </label>
        </div>
      </div>

      {/* ⚙️ CONFIGURACIÓN GENERAL DE TIPOGRAFÍA */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-indigo-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            ⚙️ Configuración de Tipografía
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipografía Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎯 Tipografía Misión
            </label>
            <select
              value={mission.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('mission.fontFamily', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: mission.fontFamily || 'Montserrat' }}
            >
              {AVAILABLE_FONTS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipografía Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔮 Tipografía Visión
            </label>
            <select
              value={vision.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('vision.fontFamily', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: vision.fontFamily || 'Montserrat' }}
            >
              {AVAILABLE_FONTS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 📖 SECCIÓN HISTORIA - NUEVA */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-emerald-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            📖 Nuestra Historia
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Cuenta la historia de cómo nació tu empresa. Esta sección aparecerá después del Hero.
        </p>

        <div className="space-y-6">
          {/* Título de la Historia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título de la Sección
            </label>
            <input
              type="text"
              value={history.title || ''}
              onChange={(e) => updateContent('history.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ej: ¿Cómo nació THADO Consulting?"
            />
          </div>

          {/* Descripción/Contenido de la Historia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido de la Historia
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Puedes incluir varios párrafos describiendo la historia de tu empresa.
            </p>
            <textarea
              value={history.description || ''}
              onChange={(e) => updateContent('history.description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={8}
              placeholder="THADO Consulting nació de una visión clara: cerrar la brecha tecnológica que enfrentan las PYMES peruanas...

Fundada por un equipo de profesionales apasionados por la tecnología y el emprendimiento...

Hoy, THADO Consulting se posiciona como una empresa líder en desarrollo de software e inteligencia artificial en Perú..."
            />
          </div>

          {/* 🖼️ Imagen de la Historia */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              🖼️ Imagen de la Historia (Opcional)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Imagen que aparecerá junto al texto de tu historia.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tema Claro */}
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">☀️ Tema Claro</span>
                </div>
                <ManagedImageSelector
                  currentImage={
                    typeof history.image === 'string' 
                      ? history.image 
                      : (history.image?.light || '')
                  }
                  onImageSelect={(url: string) => {
                    const currentImage = typeof history.image === 'string'
                      ? { light: history.image, dark: history.image }
                      : (history.image || {});
                    updateContent('history.image', { ...currentImage, light: url });
                  }}
                  label="Imagen Historia (Claro)"
                  description="Tamaño recomendado: 800x600px"
                  darkMode={false}
                  hideButtonArea={!!(
                    typeof history.image === 'string' 
                      ? history.image 
                      : history.image?.light
                  )}
                />
              </div>

              {/* Tema Oscuro */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center mb-3">
                  <span className="text-sm font-medium text-gray-200">🌙 Tema Oscuro</span>
                </div>
                <ManagedImageSelector
                  currentImage={
                    typeof history.image === 'string' 
                      ? history.image 
                      : (history.image?.dark || '')
                  }
                  onImageSelect={(url: string) => {
                    const currentImage = typeof history.image === 'string'
                      ? { light: history.image, dark: history.image }
                      : (history.image || {});
                    updateContent('history.image', { ...currentImage, dark: url });
                  }}
                  label="Imagen Historia (Oscuro)"
                  description="Tamaño recomendado: 800x600px"
                  darkMode={true}
                  hideButtonArea={!!(
                    typeof history.image === 'string' 
                      ? history.image 
                      : history.image?.dark
                  )}
                />
              </div>
            </div>
          </div>

          {/* Tipografía de la Historia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔤 Tipografía
            </label>
            <select
              value={history.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('history.fontFamily', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: history.fontFamily || 'Montserrat' }}
            >
              {AVAILABLE_FONTS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🎯 SECCIÓN MISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            🎯 Nuestra Misión
          </h3>
        </div>

        <div className="space-y-6">
          {/* Título de la Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={mission.title || ''}
              onChange={(e) => updateContent('mission.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Título de la misión..."
            />
          </div>

          {/* Descripción de la Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={mission.description || ''}
              onChange={(e) => updateContent('mission.description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              placeholder="Describe la misión de la empresa..."
            />
          </div>

          {/* 🖼️ Imagen de la Misión */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              🖼️ Imagen de la Misión
            </label>

            <ManagedImageSelector
              currentImage={
                typeof mission.image === 'string' 
                  ? mission.image 
                  : (mission.image?.dark || mission.image?.light || '')
              }
              onImageSelect={(url: string) => updateContent('mission.image', url)}
              label="Imagen Misión"
              description="Imagen que aparecerá junto al texto de la misión (se usará en ambos temas)"
              darkMode={false}
              hideButtonArea={!!(
                typeof mission.image === 'string' 
                  ? mission.image 
                  : (mission.image?.dark || mission.image?.light)
              )}
            />

            {/* Preview de la imagen */}
            {(typeof mission.image === 'string' ? mission.image : (mission.image?.dark || mission.image?.light)) && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa</p>
                <img 
                  src={typeof mission.image === 'string' ? mission.image : (mission.image?.dark || mission.image?.light || '')} 
                  alt="Misión" 
                  className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔮 SECCIÓN VISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            🔮 Nuestra Visión
          </h3>
        </div>

        <div className="space-y-6">
          {/* Título de la Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={vision.title || ''}
              onChange={(e) => updateContent('vision.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Título de la visión..."
            />
          </div>

          {/* Descripción de la Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={vision.description || ''}
              onChange={(e) => updateContent('vision.description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              placeholder="Describe la visión de la empresa..."
            />
          </div>

          {/* 🖼️ Imagen de la Visión */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              🖼️ Imagen de la Visión
            </label>

            <ManagedImageSelector
              currentImage={
                typeof vision.image === 'string' 
                  ? vision.image 
                  : (vision.image?.dark || vision.image?.light || '')
              }
              onImageSelect={(url: string) => updateContent('vision.image', url)}
              label="Imagen Visión"
              description="Imagen que aparecerá junto al texto de la visión (se usará en ambos temas)"
              darkMode={false}
              hideButtonArea={!!(
                typeof vision.image === 'string' 
                  ? vision.image 
                  : (vision.image?.dark || vision.image?.light)
              )}
            />

            {/* Preview de la imagen */}
            {(typeof vision.image === 'string' ? vision.image : (vision.image?.dark || vision.image?.light)) && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa</p>
                <img 
                  src={typeof vision.image === 'string' ? vision.image : (vision.image?.dark || vision.image?.light || '')} 
                  alt="Visión" 
                  className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📊 Vista Previa */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          👁️ Vista Previa del Diseño
        </h4>
        
        <div className="space-y-8">
          {/* Preview Historia - Nueva */}
          {history.title && (
            <div className="border-l-4 border-emerald-500 pl-4" style={{ fontFamily: history.fontFamily || 'Montserrat' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white text-lg">📖</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {history.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line line-clamp-4">
                {history.description}
              </p>
            </div>
          )}

          {/* Preview Misión - Zigzag */}
          {mission.title && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div style={{ fontFamily: mission.fontFamily || 'Montserrat' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {mission.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {mission.description}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30 rounded-xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                {mission.image?.light ? (
                  <img src={mission.image.light} alt="Misión" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl opacity-50">🎯</span>
                )}
              </div>
            </div>
          )}

          {/* Preview Visión - Zigzag inverso */}
          {vision.title && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-900/30 dark:to-purple-900/30 rounded-xl aspect-[4/3] flex items-center justify-center overflow-hidden md:order-1">
                {vision.image?.light ? (
                  <img src={vision.image.light} alt="Visión" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl opacity-50">🔮</span>
                )}
              </div>
              <div className="md:order-2" style={{ fontFamily: vision.fontFamily || 'Montserrat' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-lg">👁️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {vision.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {vision.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      )}
    </div>
  );
};

export default MissionVisionConfigSection;