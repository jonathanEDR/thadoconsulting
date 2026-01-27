import React, { useState } from 'react';
import RichTextEditorCompact from '../RichTextEditorCompact';
import ClientLogosEditor from './ClientLogosEditor';
import ClientLogosDesignSection from './ClientLogosDesignSection';
import type { PageData, ClientLogo } from '../../types/cms';

interface ClientLogosConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos', field: string, mode: 'light' | 'dark', color: string) => void;
}

const ClientLogosConfigSection: React.FC<ClientLogosConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {

  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="client-logos-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center">
          🏢 Sección Logos de Clientes
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="client-logos-section-content">
          {/* Controles de visibilidad */}
          <div className="mb-6 space-y-4">
            {/* Control de visibilidad de la sección */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Mostrar sección de logos de clientes
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Controla si la sección de logos de clientes aparece en el sitio web
                </p>
              </div>
              <button
                onClick={() => updateContent('clientLogos.visible', !(pageData.content.clientLogos?.visible ?? true))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pageData.content.clientLogos?.visible !== false ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pageData.content.clientLogos?.visible !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Control para mostrar/ocultar texto */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Mostrar título y descripción
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Desactiva para mostrar solo los logos sin texto
                </p>
              </div>
              <button
                onClick={() => updateContent('clientLogos.showText', !(pageData.content.clientLogos?.showText ?? true))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pageData.content.clientLogos?.showText !== false ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pageData.content.clientLogos?.showText !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Layout principal con 2 columnas: Contenido y Imagen */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            
            {/* Columna izquierda: Editores de texto (2/3) */}
            <div className="xl:col-span-2 space-y-4">
              
              {/* Título de la Sección */}
              <div>
                <RichTextEditorCompact
                  label="Título de la Sección"
                  value={pageData.content.clientLogos?.title || 'Nuestros clientes'}
                  onChange={(html: string) => updateContent('clientLogos.title', html)}
                  placeholder="Nuestros clientes"
                  themeColors={{
                    light: pageData.content.clientLogos?.styles?.light?.titleColor || '',
                    dark: pageData.content.clientLogos?.styles?.dark?.titleColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('clientLogos', 'titleColor', mode, color)}
                />
              </div>

              {/* Descripción de la Sección */}
              <div>
                <RichTextEditorCompact
                  label="Descripción de la Sección"
                  value={pageData.content.clientLogos?.description || ''}
                  onChange={(html: string) => updateContent('clientLogos.description', html)}
                  placeholder="Empresas que confían en nosotros..."
                  themeColors={{
                    light: pageData.content.clientLogos?.styles?.light?.descriptionColor || '',
                    dark: pageData.content.clientLogos?.styles?.dark?.descriptionColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('clientLogos', 'descriptionColor', mode, color)}
                />
              </div>
            </div>

            {/* Columna derecha: Editor de Logos (1/3) */}
            <div className="xl:col-span-1">
              <ClientLogosEditor
                logos={pageData.content.clientLogos?.logos || []}
                onUpdate={(updatedLogos: ClientLogo[]) => updateContent('clientLogos.logos', updatedLogos)}
              />
            </div>
          </div>

          {/* Configuración de diseño - Ancho completo */}
          <div className="mb-8">
            <ClientLogosDesignSection
              pageData={pageData}
              updateContent={updateContent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientLogosConfigSection;