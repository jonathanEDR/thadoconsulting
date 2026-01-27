import RichTextEditor from './RichTextEditor';

interface ThemeColors {
  light: string;
  dark: string;
}

interface RichTextEditorWithThemeProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  themeColors?: ThemeColors;
  onThemeColorChange?: (mode: 'light' | 'dark', color: string) => void;
}

const RichTextEditorWithTheme = ({
  label,
  value,
  onChange,
  placeholder,
  themeColors,
  onThemeColorChange
}: RichTextEditorWithThemeProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Editor de texto rico - 2/3 del espacio */}
      <div className="lg:col-span-2">
        <RichTextEditor
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>

      {/* Selectores de color por tema - 1/3 del espacio */}
      {themeColors && onThemeColorChange && (
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 h-fit backdrop-blur-sm">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
              🎨 Colores por tema
            </div>

            <div className="space-y-3">
              {/* Color para tema claro */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ☀️ Tema Claro
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={themeColors.light || '#1F2937'}
                    onChange={(e) => onThemeColorChange('light', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    title="Seleccionar color para tema claro"
                  />
                  <input
                    type="text"
                    value={themeColors.light || '#1F2937'}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Evitar doble # si el usuario escribe ##
                      if (value.startsWith('##')) {
                        value = value.substring(1);
                      }
                      onThemeColorChange('light', value);
                    }}
                    className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-1 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="#1F2937"
                  />
                </div>
                <button
                  onClick={() => onThemeColorChange('light', '')}
                  className="mt-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded transition-colors w-full"
                  title="Usar color por defecto"
                  type="button"
                >
                  Por defecto
                </button>
              </div>

              {/* Color para tema oscuro */}
              <div className="bg-gray-800 dark:bg-gray-900/50 border border-gray-600 dark:border-gray-700/50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-200 dark:text-gray-300 mb-2">
                  🌙 Tema Oscuro
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={themeColors.dark || '#F9FAFB'}
                    onChange={(e) => onThemeColorChange('dark', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-500"
                    title="Seleccionar color para tema oscuro"
                  />
                  <input
                    type="text"
                    value={themeColors.dark || '#F9FAFB'}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Evitar doble # si el usuario escribe ##
                      if (value.startsWith('##')) {
                        value = value.substring(1);
                      }
                      onThemeColorChange('dark', value);
                    }}
                    className="flex-1 px-2 py-1.5 text-xs bg-gray-700 border border-gray-500 rounded text-white focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                    placeholder="#F9FAFB"
                  />
                </div>
                <button
                  onClick={() => onThemeColorChange('dark', '')}
                  className="mt-2 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors w-full"
                  title="Usar color por defecto"
                  type="button"
                >
                  Por defecto
                </button>
              </div>
            </div>

            {/* Ayuda compacta */}
            <div className="mt-3 bg-white dark:bg-gray-800/50 border border-blue-200 dark:border-blue-700/50 rounded p-2">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                💡 <strong>Tip:</strong> Se aplica automáticamente según el tema activo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditorWithTheme;
