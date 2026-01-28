import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';
import type { PageData, SocialLink } from '../../types/cms';

interface ContactConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  isContactPage?: boolean; // true si estamos editando la página de contacto específicamente
}

const ContactConfigSection: React.FC<ContactConfigSectionProps> = ({
  pageData,
  updateContent,
  isContactPage = false
}) => {
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    name: '',
    url: '',
    icon: '',
    enabled: true
  });
  const socialLinks = pageData.content.contact?.socialLinks || [];

  const addSocialLink = () => {
    if (newSocialLink.name && newSocialLink.url) {
      const updatedLinks = [...socialLinks, { ...newSocialLink }];
      updateContent('contact.socialLinks', updatedLinks);
      setNewSocialLink({ name: '', url: '', icon: '', enabled: true });
    }
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
    const updatedLinks = socialLinks.map((link: SocialLink, i: number) => 
      i === index ? { ...link, [field]: value } : link
    );
    updateContent('contact.socialLinks', updatedLinks);
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_: SocialLink, i: number) => i !== index);
    updateContent('contact.socialLinks', updatedLinks);
  };

  // Si estamos en la página de contacto, mostrar solo la configuración de la página pública
  if (isContactPage) {
    return (
      <div className="space-y-6">
        {/* 🎨 CONFIGURACIÓN DE LA PÁGINA CONTACTO */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            🎨 Diseño de la Página de Contacto
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Configura el aspecto visual de las 3 secciones de la página de contacto.
          </p>

          {/* === SECCIÓN HERO === */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              🚀 Sección Hero (Encabezado)
            </h3>
            
            {/* Título y Subtítulo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={pageData.content.contactPage?.hero?.title || ''}
                  onChange={(e) => updateContent('contactPage.hero.title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="¡Trabajemos Juntos! 🚀"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={pageData.content.contactPage?.hero?.subtitle || ''}
                  onChange={(e) => updateContent('contactPage.hero.subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
              </div>
            </div>

            {/* Colores de texto */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ☀️ Color Título (Claro)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={pageData.content.contactPage?.hero?.titleColor || '#111827'}
                    onChange={(e) => updateContent('contactPage.hero.titleColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pageData.content.contactPage?.hero?.titleColor || '#111827'}
                    onChange={(e) => updateContent('contactPage.hero.titleColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  🌙 Color Título (Oscuro)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={pageData.content.contactPage?.hero?.titleColorDark || '#ffffff'}
                    onChange={(e) => updateContent('contactPage.hero.titleColorDark', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pageData.content.contactPage?.hero?.titleColorDark || '#ffffff'}
                    onChange={(e) => updateContent('contactPage.hero.titleColorDark', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ☀️ Color Subtítulo (Claro)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={pageData.content.contactPage?.hero?.subtitleColor || '#4b5563'}
                    onChange={(e) => updateContent('contactPage.hero.subtitleColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pageData.content.contactPage?.hero?.subtitleColor || '#4b5563'}
                    onChange={(e) => updateContent('contactPage.hero.subtitleColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  🌙 Color Subtítulo (Oscuro)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={pageData.content.contactPage?.hero?.subtitleColorDark || '#9ca3af'}
                    onChange={(e) => updateContent('contactPage.hero.subtitleColorDark', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pageData.content.contactPage?.hero?.subtitleColorDark || '#9ca3af'}
                    onChange={(e) => updateContent('contactPage.hero.subtitleColorDark', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Gradiente del Título */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🎨 Gradiente del Título (Opcional)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Activa el gradiente para dar un efecto colorido al título.
              </p>
              
              {/* Toggle para habilitar gradiente */}
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="titleGradientEnabled"
                  checked={pageData.content.contactPage?.hero?.titleGradientEnabled || false}
                  onChange={(e) => updateContent('contactPage.hero.titleGradientEnabled', e.target.checked)}
                  className="w-5 h-5 rounded text-purple-600"
                />
                <label htmlFor="titleGradientEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Activar gradiente en el título
                </label>
              </div>
              
              {pageData.content.contactPage?.hero?.titleGradientEnabled && (
                <>
                  {/* Dirección del gradiente */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      🧭 Dirección del Gradiente
                    </label>
                    <select
                      value={pageData.content.contactPage?.hero?.titleGradientDirection || 'to right'}
                      onChange={(e) => updateContent('contactPage.hero.titleGradientDirection', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to right">→ Izquierda a Derecha</option>
                      <option value="to left">← Derecha a Izquierda</option>
                      <option value="to bottom">↓ Arriba a Abajo</option>
                      <option value="to top">↑ Abajo a Arriba</option>
                      <option value="to bottom right">↘ Diagonal (Abajo Derecha)</option>
                      <option value="to bottom left">↙ Diagonal (Abajo Izquierda)</option>
                      <option value="to top right">↗ Diagonal (Arriba Derecha)</option>
                      <option value="to top left">↖ Diagonal (Arriba Izquierda)</option>
                    </select>
                  </div>
                  
                  {/* Colores del gradiente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🎨 Color Inicio
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={pageData.content.contactPage?.hero?.titleGradientFrom || '#8B5CF6'}
                          onChange={(e) => updateContent('contactPage.hero.titleGradientFrom', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={pageData.content.contactPage?.hero?.titleGradientFrom || '#8B5CF6'}
                          onChange={(e) => updateContent('contactPage.hero.titleGradientFrom', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🎨 Color Fin
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={pageData.content.contactPage?.hero?.titleGradientTo || '#06B6D4'}
                          onChange={(e) => updateContent('contactPage.hero.titleGradientTo', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={pageData.content.contactPage?.hero?.titleGradientTo || '#06B6D4'}
                          onChange={(e) => updateContent('contactPage.hero.titleGradientTo', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Vista previa del gradiente */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      👁️ Vista Previa
                    </label>
                    <div 
                      className="h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ 
                        background: `linear-gradient(${pageData.content.contactPage?.hero?.titleGradientDirection || 'to right'}, ${pageData.content.contactPage?.hero?.titleGradientFrom || '#8B5CF6'}, ${pageData.content.contactPage?.hero?.titleGradientTo || '#06B6D4'})` 
                      }}
                    >
                      Título con Gradiente
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Imagen de fondo Hero */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🖼️ Imagen de Fondo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">☀️ Tema Claro</label>
                  <ManagedImageSelector
                    label="Imagen de fondo (Claro)"
                    description="Tamaño recomendado: 1920x800px"
                    currentImage={pageData.content.contactPage?.hero?.backgroundImage?.light || ''}
                    onImageSelect={(url: string) => updateContent('contactPage.hero.backgroundImage.light', url)}
                    hideButtonArea={!!pageData.content.contactPage?.hero?.backgroundImage?.light}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">🌙 Tema Oscuro</label>
                  <ManagedImageSelector
                    label="Imagen de fondo (Oscuro)"
                    description="Tamaño recomendado: 1920x800px"
                    currentImage={pageData.content.contactPage?.hero?.backgroundImage?.dark || ''}
                    onImageSelect={(url: string) => updateContent('contactPage.hero.backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!pageData.content.contactPage?.hero?.backgroundImage?.dark}
                  />
                </div>
              </div>
              
              {/* Controles de opacidad y overlay */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Opacidad: {Math.round((pageData.content.contactPage?.hero?.backgroundOpacity ?? 1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(pageData.content.contactPage?.hero?.backgroundOpacity ?? 1) * 100}
                    onChange={(e) => updateContent('contactPage.hero.backgroundOpacity', parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pageData.content.contactPage?.hero?.backgroundOverlay || false}
                    onChange={(e) => updateContent('contactPage.hero.backgroundOverlay', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label className="text-xs text-gray-600 dark:text-gray-400">Aplicar overlay oscuro</label>
                </div>
              </div>
            </div>
          </div>

          {/* === SECCIÓN FORMULARIO === */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              📝 Sección del Formulario
            </h3>
            
            {/* Imagen de fondo Formulario */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🖼️ Imagen de Fondo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">☀️ Tema Claro</label>
                  <ManagedImageSelector
                    label="Imagen de fondo (Claro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={pageData.content.contactPage?.form?.backgroundImage?.light || ''}
                    onImageSelect={(url: string) => updateContent('contactPage.form.backgroundImage.light', url)}
                    hideButtonArea={!!pageData.content.contactPage?.form?.backgroundImage?.light}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">🌙 Tema Oscuro</label>
                  <ManagedImageSelector
                    label="Imagen de fondo (Oscuro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={pageData.content.contactPage?.form?.backgroundImage?.dark || ''}
                    onImageSelect={(url: string) => updateContent('contactPage.form.backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!pageData.content.contactPage?.form?.backgroundImage?.dark}
                  />
                </div>
              </div>
              
              {/* Controles de opacidad y overlay */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Opacidad: {Math.round((pageData.content.contactPage?.form?.backgroundOpacity ?? 1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(pageData.content.contactPage?.form?.backgroundOpacity ?? 1) * 100}
                    onChange={(e) => updateContent('contactPage.form.backgroundOpacity', parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pageData.content.contactPage?.form?.backgroundOverlay || false}
                    onChange={(e) => updateContent('contactPage.form.backgroundOverlay', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label className="text-xs text-gray-600 dark:text-gray-400">Aplicar overlay oscuro</label>
                </div>
              </div>
              
              {/* Opción para ocultar tarjeta del formulario */}
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hideFormCard"
                    checked={pageData.content.contactPage?.form?.hideFormCard || false}
                    onChange={(e) => updateContent('contactPage.form.hideFormCard', e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600"
                  />
                  <div>
                    <label htmlFor="hideFormCard" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      🚫 Ocultar tarjeta del formulario
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Elimina el fondo, borde y sombra de la tarjeta que contiene el formulario
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === SECCIÓN CARACTERÍSTICAS === */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              ⭐ Sección de Características
            </h3>
            
            {/* Título de la sección */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título de la Sección
              </label>
              <input
                type="text"
                value={pageData.content.contactPage?.features?.title || ''}
                onChange={(e) => updateContent('contactPage.features.title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="¿Por qué elegir THADO Consulting?"
              />
            </div>

            {/* Colores del título */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ☀️ Color Título (Claro)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={pageData.content.contactPage?.features?.titleColor || '#111827'}
                    onChange={(e) => updateContent('contactPage.features.titleColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pageData.content.contactPage?.features?.titleColor || '#111827'}
                    onChange={(e) => updateContent('contactPage.features.titleColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  🌙 Color Título (Oscuro)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={pageData.content.contactPage?.features?.titleColorDark || '#ffffff'}
                    onChange={(e) => updateContent('contactPage.features.titleColorDark', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={pageData.content.contactPage?.features?.titleColorDark || '#ffffff'}
                    onChange={(e) => updateContent('contactPage.features.titleColorDark', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Imagen de fondo Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🖼️ Imagen de Fondo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">☀️ Tema Claro</label>
                  <ManagedImageSelector
                    label="Imagen de fondo (Claro)"
                    description="Tamaño recomendado: 1920x800px"
                    currentImage={pageData.content.contactPage?.features?.backgroundImage?.light || ''}
                    onImageSelect={(url: string) => updateContent('contactPage.features.backgroundImage.light', url)}
                    hideButtonArea={!!pageData.content.contactPage?.features?.backgroundImage?.light}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">🌙 Tema Oscuro</label>
                  <ManagedImageSelector
                    label="Imagen de fondo (Oscuro)"
                    description="Tamaño recomendado: 1920x800px"
                    currentImage={pageData.content.contactPage?.features?.backgroundImage?.dark || ''}
                    onImageSelect={(url: string) => updateContent('contactPage.features.backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!pageData.content.contactPage?.features?.backgroundImage?.dark}
                  />
                </div>
              </div>
              
              {/* Controles de opacidad y overlay */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Opacidad: {Math.round((pageData.content.contactPage?.features?.backgroundOpacity ?? 1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(pageData.content.contactPage?.features?.backgroundOpacity ?? 1) * 100}
                    onChange={(e) => updateContent('contactPage.features.backgroundOpacity', parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pageData.content.contactPage?.features?.backgroundOverlay || false}
                    onChange={(e) => updateContent('contactPage.features.backgroundOverlay', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label className="text-xs text-gray-600 dark:text-gray-400">Aplicar overlay oscuro</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Configuración general de contacto (para Home y otras páginas)
  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        📞 Información de Contacto
      </h2>
      
      <div className="space-y-4">
        {/* Información de Contacto Básica */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                📞 Número de Teléfono
              </label>
              <input
                type="text"
                value={pageData.content.contact?.phone || ''}
                onChange={(e) => updateContent('contact.phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="+51 973 397 306"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                value={pageData.content.contact?.email || ''}
                onChange={(e) => updateContent('contact.email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="gscutic@gmail.com"
              />
            </div>
          </div>

          {/* 🆕 Descripción de la empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              📖 Descripción de la Empresa
            </label>
            <textarea
              rows={2}
              value={pageData.content.contact?.description || ''}
              onChange={(e) => updateContent('contact.description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Empresa líder en desarrollo de software en Perú. Creamos soluciones digitales..."
            />
          </div>

          {/* 🆕 Ubicación - Layout más compacto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                📍 Dirección
              </label>
              <input
                type="text"
                value={pageData.content.contact?.address || ''}
                onChange={(e) => updateContent('contact.address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Av. Principal 123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                🏙️ Ciudad
              </label>
              <input
                type="text"
                value={pageData.content.contact?.city || ''}
                onChange={(e) => updateContent('contact.city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Lima"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                🌎 País
              </label>
              <input
                type="text"
                value={pageData.content.contact?.country || ''}
                onChange={(e) => updateContent('contact.country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Perú"
              />
            </div>
          </div>

          {/* 🆕 Horario de atención */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              🕒 Horario de Atención
            </label>
            <input
              type="text"
              value={pageData.content.contact?.businessHours || ''}
              onChange={(e) => updateContent('contact.businessHours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Lunes a Viernes: 9:00 AM - 6:00 PM"
            />
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
            🌐 Redes Sociales
          </h4>
          
          {/* Diseño horizontal: Redes sociales existentes + Agregar nueva */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Columna de redes sociales existentes (2/3 del espacio) */}
            <div className="lg:col-span-2">
              {socialLinks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {socialLinks.map((link: SocialLink, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center hover:shadow-md transition-shadow">
                      {/* Icono con lógica inteligente */}
                      <div className="relative group mb-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                          {link.icon ? (
                            <img 
                              src={link.icon} 
                              alt={`Icono ${link.name}`}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="text-gray-400 text-lg">📷</span>
                          )}
                        </div>
                        
                        {/* Overlay para cambiar imagen SOLO si HAY imagen */}
                        {link.icon && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-center">
                              <ManagedImageSelector
                                currentImage={link.icon}
                                onImageSelect={(newImage: string) => updateSocialLink(index, 'icon', newImage)}
                                label=""
                                hideButtonArea={true}
                              />
                              <div className="text-white text-xs font-medium mt-1 pointer-events-none">
                                Cambiar
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Botón de eliminar pequeño */}
                        <button
                          onClick={() => removeSocialLink(index)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                          title="Eliminar red social"
                        >
                          ×
                        </button>
                      </div>
                      
                      {/* Botón cargar imagen SOLO si NO hay imagen */}
                      {!link.icon && (
                        <div className="mb-2">
                          <ManagedImageSelector
                            currentImage={link.icon}
                            onImageSelect={(newImage: string) => updateSocialLink(index, 'icon', newImage)}
                            label="📷 Cargar"
                            hideButtonArea={false}
                          />
                        </div>
                      )}
                      
                      {/* Nombre compacto */}
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="nombre"
                      />
                      
                      {/* URL compacta */}
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                      
                      {/* Solo estado activo/inactivo */}
                      <div className="flex items-center justify-center w-full mt-2">
                        <label className="flex items-center text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={link.enabled}
                            onChange={(e) => updateSocialLink(index, 'enabled', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm font-medium">
                            {link.enabled ? '✅ Activo' : '❌ Inactivo'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No hay redes sociales configuradas
                  </p>
                </div>
              )}
            </div>
            
            {/* Columna de agregar nueva red social (1/3 del espacio) */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 h-full">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  ➕ Agregar Nueva
                </h5>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newSocialLink.name}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="Nombre (ej: linkedin)"
                  />
                  
                  <input
                    type="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="https://..."
                  />
                  
                  {/* Selector de icono inteligente */}
                  <div className="flex items-center justify-center mb-2">
                    <div className="relative group">
                      <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                        {newSocialLink.icon ? (
                          <img 
                            src={newSocialLink.icon} 
                            alt="Preview del icono"
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-lg">📷</span>
                        )}
                      </div>
                      
                      {/* Hover overlay solo si HAY imagen */}
                      {newSocialLink.icon && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-center">
                            <ManagedImageSelector
                              currentImage={newSocialLink.icon}
                              onImageSelect={(newImage: string) => setNewSocialLink(prev => ({ ...prev, icon: newImage }))}
                              label=""
                              hideButtonArea={true}
                            />
                            <div className="text-white text-xs font-medium pointer-events-none">
                              Cambiar
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Botón eliminar solo si hay imagen */}
                      {newSocialLink.icon && (
                        <button
                          onClick={() => setNewSocialLink(prev => ({ ...prev, icon: '' }))}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                          title="Quitar icono"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Botón selector solo si NO hay imagen */}
                  {!newSocialLink.icon && (
                    <div className="mb-2">
                      <ManagedImageSelector
                        currentImage={newSocialLink.icon}
                        onImageSelect={(newImage: string) => setNewSocialLink(prev => ({ ...prev, icon: newImage }))}
                        label="📷 Seleccionar Icono"
                        hideButtonArea={false}
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={addSocialLink}
                    disabled={!newSocialLink.name || !newSocialLink.url}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    ➕ Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ContactConfigSection;