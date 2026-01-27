import { useTheme } from '../../contexts/ThemeContext';

/**
 * Componente de Debug para verificar que los colores por tema funcionen correctamente
 * Agregar este componente temporalmente en Home.tsx para verificar
 */
const ColorThemeDebugger = ({ cardStyles }: { cardStyles: any }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 max-w-sm border-2 border-purple-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
          🎨 Debug de Colores
        </h3>
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
        >
          Cambiar Tema
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        {/* Tema Activo */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Tema:</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded font-mono">
            {theme === 'light' ? '☀️ Claro' : '🌙 Oscuro'}
          </span>
        </div>
        
        {/* Color del Título */}
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Título:</span>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: cardStyles.titleColor }}
            />
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {cardStyles.titleColor}
            </code>
          </div>
          <div 
            className="mt-1 p-2 rounded" 
            style={{ 
              backgroundColor: cardStyles.background,
              color: cardStyles.titleColor 
            }}
          >
            Ejemplo de Título
          </div>
        </div>
        
        {/* Color de Descripción */}
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Descripción:</span>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: cardStyles.descriptionColor }}
            />
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {cardStyles.descriptionColor}
            </code>
          </div>
          <div 
            className="mt-1 p-2 rounded text-sm" 
            style={{ 
              backgroundColor: cardStyles.background,
              color: cardStyles.descriptionColor 
            }}
          >
            Ejemplo de descripción de texto
          </div>
        </div>
        
        {/* Color de Link */}
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Enlaces:</span>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: cardStyles.linkColor }}
            />
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {cardStyles.linkColor}
            </code>
          </div>
          <div 
            className="mt-1 p-2 rounded" 
            style={{ backgroundColor: cardStyles.background }}
          >
            <span style={{ color: cardStyles.linkColor }}>
              Conocer más →
            </span>
          </div>
        </div>
        
        {/* Fondo de Tarjeta */}
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Fondo Tarjeta:</span>
          <div className="mt-1">
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
              {cardStyles.background}
            </code>
          </div>
        </div>
        
        {/* Estado de Datos */}
        <div className="pt-2 mt-2 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cardStyles.titleColor ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-700 dark:text-gray-300">
              {cardStyles.titleColor ? '✓ Estilos cargados' : '✗ Sin estilos'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 Este panel muestra los colores que se están aplicando actualmente.
          Cambia el tema para ver los diferentes colores.
        </p>
      </div>
    </div>
  );
};

export default ColorThemeDebugger;
