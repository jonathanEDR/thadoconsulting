// Componente para vista previa de botones en tiempo real
import React from 'react';

interface ButtonTheme {
  bg: string;
  text: string;
  border?: string;
  hover: string;
  hoverText?: string;
}

interface ButtonPreviewProps {
  lightMode: {
    buttons?: {
      ctaPrimary?: ButtonTheme;
      contact?: ButtonTheme;
      dashboard?: ButtonTheme;
    };
  };
  darkMode: {
    buttons?: {
      ctaPrimary?: ButtonTheme;
      contact?: ButtonTheme;
      dashboard?: ButtonTheme;
    };
  };
  currentTheme: 'light' | 'dark';
}

export const ButtonPreview: React.FC<ButtonPreviewProps> = ({
  lightMode,
  darkMode,
  currentTheme
}) => {
  const currentButtons = currentTheme === 'light' ? lightMode.buttons : darkMode.buttons;
  
  return (
    <div className="space-y-6">
      {/* Selector de tema para vista previa */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Vista previa en:</span>
        <span className={`px-3 py-1 rounded text-sm ${
          currentTheme === 'light' 
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' 
            : 'bg-gray-800 dark:bg-gray-700 text-gray-200 dark:text-gray-100'
        }`}>
          {currentTheme === 'light' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </span>
      </div>

      {/* Vista previa de página principal simulada */}
      <div 
        className="p-8 rounded-xl border-2"
        style={{
          backgroundColor: currentTheme === 'light' ? '#ffffff' : '#111827',
          borderColor: currentTheme === 'light' ? '#e5e7eb' : '#374151'
        }}
      >
        {/* Simulación del Hero Section */}
        <div className="text-center space-y-6">
          <h1 
            className="text-2xl font-bold"
            style={{ color: currentTheme === 'light' ? '#1f2937' : '#f9fafb' }}
          >
            Transformamos tu empresa con tecnología inteligente
          </h1>
          
          <p 
            className="text-sm"
            style={{ color: currentTheme === 'light' ? '#6b7280' : '#d1d5db' }}
          >
            Innovamos para que tu empresa avance al ritmo de la tecnología.
          </p>

          {/* Botones del Hero */}
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {/* Botón CTA Principal */}
            {currentButtons?.ctaPrimary && (
              <button
                className="group px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105"
                style={{
                  background: currentButtons.ctaPrimary.bg,
                  color: currentButtons.ctaPrimary.text
                }}
                onMouseEnter={(e) => {
                  if (currentButtons.ctaPrimary?.hover) {
                    (e.target as HTMLElement).style.background = currentButtons.ctaPrimary.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentButtons.ctaPrimary?.bg) {
                    (e.target as HTMLElement).style.background = currentButtons.ctaPrimary.bg;
                  }
                }}
              >
                <span className="flex items-center space-x-1.5">
                  <span>Conoce nuestros servicios</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            )}

            {/* Botón Dashboard */}
            {currentButtons?.dashboard && (
              <button
                className="px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105"
                style={{
                  background: currentButtons.dashboard.bg,
                  color: currentButtons.dashboard.text
                }}
                onMouseEnter={(e) => {
                  if (currentButtons.dashboard?.hover) {
                    (e.target as HTMLElement).style.background = currentButtons.dashboard.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentButtons.dashboard?.bg) {
                    (e.target as HTMLElement).style.background = currentButtons.dashboard.bg;
                  }
                }}
              >
                <span className="flex items-center space-x-1.5">
                  <span>🎯</span>
                  <span>Ir al Dashboard</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Simulación del Header */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: currentTheme === 'light' ? '#e5e7eb' : '#374151' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="font-bold">🚀 THADO Consulting</div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" style={{ color: currentTheme === 'light' ? '#1f2937' : '#f9fafb' }}>Inicio</a>
                <a href="#" style={{ color: currentTheme === 'light' ? '#6b7280' : '#d1d5db' }}>Nosotros</a>
                <a href="#" style={{ color: currentTheme === 'light' ? '#6b7280' : '#d1d5db' }}>Soluciones</a>
              </nav>
            </div>
            
            {/* Botón Contacto del Header */}
            {currentButtons?.contact && (
              <>
                {currentButtons.contact.border?.includes('gradient') ? (
                  // Botón con borde gradiente - usando técnica especial
                  <div
                    className="px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm border-2"
                    style={{
                      background: `linear-gradient(${currentTheme === 'light' ? '#ffffff' : '#111827'}, ${currentTheme === 'light' ? '#ffffff' : '#111827'}) padding-box, ${currentButtons.contact.border} border-box`,
                      color: currentButtons.contact.text,
                      border: '2px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    CONTÁCTENOS
                  </div>
                ) : (
                  // Botón con borde sólido
                  <button
                    className="px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm border-2"
                    style={{
                      borderColor: currentButtons.contact.border || currentButtons.contact.text,
                      color: currentButtons.contact.text,
                      backgroundColor: currentButtons.contact.bg || 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (currentButtons.contact?.hover) {
                        (e.target as HTMLElement).style.backgroundColor = currentButtons.contact.hover;
                        (e.target as HTMLElement).style.color = currentButtons.contact.hoverText || '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = currentButtons.contact?.bg || 'transparent';
                      if (currentButtons.contact?.text) {
                        (e.target as HTMLElement).style.color = currentButtons.contact.text;
                      }
                    }}
                  >
                    CONTÁCTENOS
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Información de configuración actual */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold mb-2" style={{ color: currentTheme === 'light' ? '#374151' : '#d1d5db' }}>
            Configuración Actual:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* CTA Button Info */}
            {currentButtons?.ctaPrimary && (
              <div className="p-2 bg-white dark:bg-gray-700 rounded">
                <div className="font-medium text-purple-600">🚀 CTA Principal</div>
                <div style={{ color: currentTheme === 'light' ? '#6b7280' : '#9ca3af' }}>
                  Fondo: {currentButtons.ctaPrimary.bg}<br/>
                  Texto: {currentButtons.ctaPrimary.text}
                </div>
              </div>
            )}

            {/* Contact Button Info */}
            {currentButtons?.contact && (
              <div className="p-2 bg-white dark:bg-gray-700 rounded">
                <div className="font-medium text-cyan-600">📞 Contacto</div>
                <div style={{ color: currentTheme === 'light' ? '#6b7280' : '#9ca3af' }}>
                  Texto: {currentButtons.contact.text}<br/>
                  Hover: {currentButtons.contact.hover}
                </div>
              </div>
            )}

            {/* Dashboard Button Info */}
            {currentButtons?.dashboard && (
              <div className="p-2 bg-white dark:bg-gray-700 rounded">
                <div className="font-medium text-blue-600">🎯 Dashboard</div>
                <div style={{ color: currentTheme === 'light' ? '#6b7280' : '#9ca3af' }}>
                  Fondo: {currentButtons.dashboard.bg}<br/>
                  Texto: {currentButtons.dashboard.text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonPreview;