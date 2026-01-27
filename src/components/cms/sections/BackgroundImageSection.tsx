import React from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import ManagedImageSelector from '../../ManagedImageSelector';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface BackgroundImageSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración de imagen de fondo del formulario
 */
const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Imagen de Fondo"
      icon="🖼️"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Diseño"
    >
      <div className="space-y-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Imagen para Tema Claro */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Imagen - Tema Claro
          </label>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            {contactForm.backgroundImage?.light ? (
              /* CON imagen - mostrar preview + hover */
              <div className="relative group">
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
                  <img 
                    src={contactForm.backgroundImage.light} 
                    alt="Fondo tema claro"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Hover overlay para cambiar */}
                <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center">
                    <ManagedImageSelector
                      currentImage={contactForm.backgroundImage.light}
                      onImageSelect={(imageUrl) => updateContent('contactForm.backgroundImage.light', imageUrl)}
                      label=""
                      hideButtonArea={true}
                    />
                    <div className="text-white text-sm font-medium mt-2 pointer-events-none">
                      Cambiar Imagen
                    </div>
                  </div>
                </div>
                
                {/* Botón eliminar */}
                <button
                  onClick={() => updateContent('contactForm.backgroundImage.light', '')}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                  title="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ) : (
              /* SIN imagen - mostrar selector */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-gray-400">🖼️</span>
                </div>
                <ManagedImageSelector
                  currentImage=""
                  onImageSelect={(imageUrl) => updateContent('contactForm.backgroundImage.light', imageUrl)}
                  label="📷 Seleccionar Imagen"
                  hideButtonArea={false}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Imagen para tema claro
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Imagen para Tema Oscuro */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Imagen - Tema Oscuro
          </label>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            {contactForm.backgroundImage?.dark ? (
              /* CON imagen - mostrar preview + hover */
              <div className="relative group">
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
                  <img 
                    src={contactForm.backgroundImage.dark} 
                    alt="Fondo tema oscuro"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Hover overlay para cambiar */}
                <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center">
                    <ManagedImageSelector
                      currentImage={contactForm.backgroundImage.dark}
                      onImageSelect={(imageUrl) => updateContent('contactForm.backgroundImage.dark', imageUrl)}
                      label=""
                      hideButtonArea={true}
                    />
                    <div className="text-white text-sm font-medium mt-2 pointer-events-none">
                      Cambiar Imagen
                    </div>
                  </div>
                </div>
                
                {/* Botón eliminar */}
                <button
                  onClick={() => updateContent('contactForm.backgroundImage.dark', '')}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                  title="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ) : (
              /* SIN imagen - mostrar selector */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-gray-400">🖼️</span>
                </div>
                <ManagedImageSelector
                  currentImage=""
                  onImageSelect={(imageUrl) => updateContent('contactForm.backgroundImage.dark', imageUrl)}
                  label="📷 Seleccionar Imagen"
                  hideButtonArea={false}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Imagen para tema oscuro
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt Text de la Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Alt Text de la Imagen
        </label>
        <input
          type="text"
          value={contactForm.backgroundImageAlt || ''}
          onChange={(e) => updateContent('contactForm.backgroundImageAlt', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Descripción de la imagen de fondo para accesibilidad"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Este texto será utilizado por lectores de pantalla y cuando la imagen no pueda cargarse
        </p>
      </div>

      {/* Consejos e Información */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
          💡 Sistema de Gestión de Imágenes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <p className="font-medium mb-2">✨ Características:</p>
            <ul className="space-y-1 text-xs">
              <li>• Galería organizada por categorías</li>
              <li>• Subida con optimización automática</li>
              <li>• Compresión inteligente de imágenes</li>
              <li>• Seguimiento de uso en el sitio</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">📋 Recomendaciones:</p>
            <ul className="space-y-1 text-xs">
              <li>• Resolución mínima: 1920x1080px</li>
              <li>• Formatos: .jpg, .webp, .png</li>
              <li>• Contraste adecuado con el texto</li>
              <li>• Tamaño máximo recomendado: 2MB</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </CollapsibleSection>
  );
};

export default BackgroundImageSection;