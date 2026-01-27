import React from 'react';

interface CtaStylePanelProps {
  title: {
    text: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    fontFamily: string;
    useGradient: boolean;
    gradientFrom?: string;
    gradientTo?: string;
    gradientDirection?: string;
  };
  subtitle: {
    text: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    fontFamily: string;
  };
  buttons: {
    primary: {
      text: string;
      bgColor: string;
      textColor: string;
      hoverBgColor: string;
      borderRadius: string;
      showIcon: boolean;
      useTransparentBg: boolean;
      borderWidth?: string;
      borderColor?: string;
      useBorderGradient?: boolean;
      borderGradientFrom?: string;
      borderGradientTo?: string;
      borderGradientDirection?: string;
    };
    secondary: {
      text: string;
      bgColor: string;
      textColor: string;
      borderColor: string;
      hoverBgColor: string;
      hoverTextColor: string;
      borderRadius: string;
      showIcon: boolean;
      useTransparentBg: boolean;
      borderWidth?: string;
      useBorderGradient?: boolean;
      borderGradientFrom?: string;
      borderGradientTo?: string;
      borderGradientDirection?: string;
    };
  };
  onUpdateTitle: (field: string, value: any) => void;
  onUpdateSubtitle: (field: string, value: any) => void;
  onUpdatePrimaryButton: (field: string, value: any) => void;
  onUpdateSecondaryButton: (field: string, value: any) => void;
}

const CtaStylePanel: React.FC<CtaStylePanelProps> = ({
  title,
  subtitle,
  buttons,
  onUpdateTitle,
  onUpdateSubtitle,
  onUpdatePrimaryButton,
  onUpdateSecondaryButton,
}) => {
  const FONT_FAMILIES = [
    { value: 'Montserrat', label: 'Montserrat (Recomendado)' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'system-ui', label: 'Sistema' },
  ];

  const FONT_SIZES_TITLE = [
    { value: 'text-2xl', label: '2XL' },
    { value: 'text-3xl', label: '3XL' },
    { value: 'text-4xl', label: '4XL (Recomendado)' },
    { value: 'text-5xl', label: '5XL' },
    { value: 'text-6xl', label: '6XL' },
  ];

  const FONT_SIZES_SUBTITLE = [
    { value: 'text-base', label: 'Base' },
    { value: 'text-lg', label: 'LG' },
    { value: 'text-xl', label: 'XL (Recomendado)' },
    { value: 'text-2xl', label: '2XL' },
  ];

  const FONT_WEIGHTS = [
    { value: 'font-normal', label: 'Normal' },
    { value: 'font-medium', label: 'Medium' },
    { value: 'font-semibold', label: 'Semibold' },
    { value: 'font-bold', label: 'Bold' },
    { value: 'font-extrabold', label: 'Extra Bold' },
  ];

  const BORDER_RADIUS = [
    { value: 'rounded', label: 'Pequeño' },
    { value: 'rounded-md', label: 'Medio' },
    { value: 'rounded-lg', label: 'Grande' },
    { value: 'rounded-xl', label: 'Extra Grande' },
    { value: 'rounded-full', label: 'Completo' },
  ];

  return (
    <div className="space-y-8">
      {/* ===== TÍTULO ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl">✏️</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Título Principal</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Texto del título
          </label>
          <input
            type="text"
            value={title.text}
            onChange={(e) => onUpdateTitle('text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="¿Listo para comenzar tu proyecto?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipografía
            </label>
            <select
              value={title.fontFamily}
              onChange={(e) => onUpdateTitle('fontFamily', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tamaño
            </label>
            <select
              value={title.fontSize}
              onChange={(e) => onUpdateTitle('fontSize', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {FONT_SIZES_TITLE.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Peso
            </label>
            <select
              value={title.fontWeight}
              onChange={(e) => onUpdateTitle('fontWeight', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {FONT_WEIGHTS.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={title.color}
                onChange={(e) => onUpdateTitle('color', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={title.color}
                onChange={(e) => onUpdateTitle('color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Toggle para gradiente en título */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <input
            type="checkbox"
            id="title-use-gradient"
            checked={title.useGradient}
            onChange={(e) => onUpdateTitle('useGradient', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="title-use-gradient" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            🌈 Usar gradiente en el texto del título
          </label>
        </div>

        {/* Configuración de gradiente para título */}
        {title.useGradient && (
          <div className="space-y-3 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-2">⚙️ Configuración del gradiente</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color inicio
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={title.gradientFrom || '#FFFFFF'}
                    onChange={(e) => onUpdateTitle('gradientFrom', e.target.value)}
                    className="h-8 w-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={title.gradientFrom || '#FFFFFF'}
                    onChange={(e) => onUpdateTitle('gradientFrom', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color final
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={title.gradientTo || '#E9D5FF'}
                    onChange={(e) => onUpdateTitle('gradientTo', e.target.value)}
                    className="h-8 w-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={title.gradientTo || '#E9D5FF'}
                    onChange={(e) => onUpdateTitle('gradientTo', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección del gradiente
              </label>
              <select
                value={title.gradientDirection || 'to right'}
                onChange={(e) => onUpdateTitle('gradientDirection', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="to right">→ Horizontal (izquierda a derecha)</option>
                <option value="to left">← Horizontal (derecha a izquierda)</option>
                <option value="to bottom">↓ Vertical (arriba a abajo)</option>
                <option value="to top">↑ Vertical (abajo a arriba)</option>
                <option value="to bottom right">↘ Diagonal (↘)</option>
                <option value="to bottom left">↙ Diagonal (↙)</option>
                <option value="to top right">↗ Diagonal (↗)</option>
                <option value="to top left">↖ Diagonal (↖)</option>
              </select>
            </div>
          </div>
        )}

        {/* Preview del título */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
          <h2
            className={`${title.fontSize} ${title.fontWeight}`}
            style={{ 
              ...(title.useGradient ? {
                background: `linear-gradient(${title.gradientDirection || 'to right'}, ${title.gradientFrom || '#FFFFFF'}, ${title.gradientTo || '#E9D5FF'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : {
                color: title.color,
              }),
              fontFamily: title.fontFamily 
            }}
          >
            {title.text}
          </h2>
        </div>
      </div>

      {/* ===== SUBTÍTULO ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl">📝</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subtítulo</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Texto del subtítulo
          </label>
          <textarea
            value={subtitle.text}
            onChange={(e) => onUpdateSubtitle('text', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Nuestro equipo de expertos está listo para ayudarte..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipografía
            </label>
            <select
              value={subtitle.fontFamily}
              onChange={(e) => onUpdateSubtitle('fontFamily', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tamaño
            </label>
            <select
              value={subtitle.fontSize}
              onChange={(e) => onUpdateSubtitle('fontSize', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {FONT_SIZES_SUBTITLE.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Peso
            </label>
            <select
              value={subtitle.fontWeight}
              onChange={(e) => onUpdateSubtitle('fontWeight', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {FONT_WEIGHTS.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={subtitle.color}
                onChange={(e) => onUpdateSubtitle('color', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={subtitle.color}
                onChange={(e) => onUpdateSubtitle('color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#E9D5FF"
              />
            </div>
          </div>
        </div>

        {/* Preview del subtítulo */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
          <p
            className={`${subtitle.fontSize} ${subtitle.fontWeight}`}
            style={{ color: subtitle.color, fontFamily: subtitle.fontFamily }}
          >
            {subtitle.text}
          </p>
        </div>
      </div>

      {/* ===== BOTÓN PRIMARIO ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl">🎯</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Botón Primario</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Texto del botón
          </label>
          <input
            type="text"
            value={buttons.primary.text}
            onChange={(e) => onUpdatePrimaryButton('text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="💬 Solicitar Cotización Gratuita"
          />
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <input
            type="checkbox"
            id="primary-show-icon"
            checked={buttons.primary.showIcon}
            onChange={(e) => onUpdatePrimaryButton('showIcon', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="primary-show-icon" className="text-sm text-gray-700 dark:text-gray-300">
            Mostrar emoji/icono al inicio del texto
          </label>
        </div>

        {/* Toggle para fondo transparente */}
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <input
            type="checkbox"
            id="primary-transparent-bg"
            checked={buttons.primary.useTransparentBg}
            onChange={(e) => onUpdatePrimaryButton('useTransparentBg', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="primary-transparent-bg" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            🔲 Usar fondo transparente
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color de fondo {buttons.primary.useTransparentBg && '(desactivado)'}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.primary.bgColor}
                onChange={(e) => onUpdatePrimaryButton('bgColor', e.target.value)}
                disabled={buttons.primary.useTransparentBg}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <input
                type="text"
                value={buttons.primary.bgColor}
                onChange={(e) => onUpdatePrimaryButton('bgColor', e.target.value)}
                disabled={buttons.primary.useTransparentBg}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color del texto
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.primary.textColor}
                onChange={(e) => onUpdatePrimaryButton('textColor', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={buttons.primary.textColor}
                onChange={(e) => onUpdatePrimaryButton('textColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#7C3AED"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color hover
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.primary.hoverBgColor}
                onChange={(e) => onUpdatePrimaryButton('hoverBgColor', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={buttons.primary.hoverBgColor}
                onChange={(e) => onUpdatePrimaryButton('hoverBgColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#F3F4F6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bordes redondeados
            </label>
            <select
              value={buttons.primary.borderRadius}
              onChange={(e) => onUpdatePrimaryButton('borderRadius', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {BORDER_RADIUS.map((radius) => (
                <option key={radius.value} value={radius.value}>
                  {radius.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle para borde con gradiente */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <input
            type="checkbox"
            id="primary-border-gradient"
            checked={buttons.primary.useBorderGradient}
            onChange={(e) => onUpdatePrimaryButton('useBorderGradient', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="primary-border-gradient" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            🌈 Usar borde con gradiente
          </label>
        </div>

        {/* Configuración del borde con gradiente */}
        {buttons.primary.useBorderGradient && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-2">⚙️ Configuración del borde con gradiente</p>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grosor
                </label>
                <select
                  value={buttons.primary.borderWidth || '2px'}
                  onChange={(e) => onUpdatePrimaryButton('borderWidth', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="1px">1px</option>
                  <option value="2px">2px</option>
                  <option value="3px">3px</option>
                  <option value="4px">4px</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color inicio
                </label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={buttons.primary.borderGradientFrom || '#9333ea'}
                    onChange={(e) => onUpdatePrimaryButton('borderGradientFrom', e.target.value)}
                    className="h-8 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttons.primary.borderGradientFrom || '#9333ea'}
                    onChange={(e) => onUpdatePrimaryButton('borderGradientFrom', e.target.value)}
                    className="flex-1 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color final
                </label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={buttons.primary.borderGradientTo || '#2563eb'}
                    onChange={(e) => onUpdatePrimaryButton('borderGradientTo', e.target.value)}
                    className="h-8 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttons.primary.borderGradientTo || '#2563eb'}
                    onChange={(e) => onUpdatePrimaryButton('borderGradientTo', e.target.value)}
                    className="flex-1 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección del gradiente
              </label>
              <select
                value={buttons.primary.borderGradientDirection || 'to right'}
                onChange={(e) => onUpdatePrimaryButton('borderGradientDirection', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="to right">→ Horizontal</option>
                <option value="to bottom">↓ Vertical</option>
                <option value="to bottom right">↘ Diagonal</option>
                <option value="135deg">🔄 Diagonal 135°</option>
              </select>
            </div>
          </div>
        )}

        {/* Preview del botón primario */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Vista previa:</p>
          <button
            className={`px-8 py-4 font-semibold ${buttons.primary.borderRadius} transition-all transform hover:scale-105 shadow-lg`}
            style={{
              ...(buttons.primary.useBorderGradient ? {
                background: buttons.primary.useTransparentBg ? 'transparent' : buttons.primary.bgColor,
                color: buttons.primary.textColor,
                border: `${buttons.primary.borderWidth || '2px'} solid transparent`,
                backgroundImage: buttons.primary.useTransparentBg 
                  ? 'none'
                  : `linear-gradient(${buttons.primary.bgColor}, ${buttons.primary.bgColor}), linear-gradient(${buttons.primary.borderGradientDirection || 'to right'}, ${buttons.primary.borderGradientFrom || '#9333ea'}, ${buttons.primary.borderGradientTo || '#2563eb'})`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              } : {
                backgroundColor: buttons.primary.useTransparentBg ? 'transparent' : buttons.primary.bgColor,
                color: buttons.primary.textColor,
                border: buttons.primary.useTransparentBg ? `2px solid ${buttons.primary.borderColor || buttons.primary.textColor}` : 'none',
              }),
            }}
            onMouseEnter={(e) => {
              if (!buttons.primary.useBorderGradient) {
                e.currentTarget.style.backgroundColor = buttons.primary.useTransparentBg ? 'transparent' : buttons.primary.hoverBgColor;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttons.primary.bgColor;
            }}
          >
            {buttons.primary.text}
          </button>
        </div>
      </div>

      {/* ===== BOTÓN SECUNDARIO ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl">🔘</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Botón Secundario</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Texto del botón
          </label>
          <input
            type="text"
            value={buttons.secondary.text}
            onChange={(e) => onUpdateSecondaryButton('text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ver todos los servicios"
          />
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <input
            type="checkbox"
            id="secondary-show-icon"
            checked={buttons.secondary.showIcon}
            onChange={(e) => onUpdateSecondaryButton('showIcon', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="secondary-show-icon" className="text-sm text-gray-700 dark:text-gray-300">
            Mostrar emoji/icono al inicio del texto
          </label>
        </div>

        {/* Toggle para fondo transparente */}
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <input
            type="checkbox"
            id="secondary-transparent-bg"
            checked={buttons.secondary.useTransparentBg}
            onChange={(e) => onUpdateSecondaryButton('useTransparentBg', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="secondary-transparent-bg" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            🔲 Usar fondo transparente
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color de fondo {buttons.secondary.useTransparentBg && '(desactivado)'}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.secondary.bgColor === 'transparent' ? '#000000' : buttons.secondary.bgColor}
                onChange={(e) => onUpdateSecondaryButton('bgColor', e.target.value)}
                disabled={buttons.secondary.useTransparentBg}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <input
                type="text"
                value={buttons.secondary.bgColor}
                onChange={(e) => onUpdateSecondaryButton('bgColor', e.target.value)}
                disabled={buttons.secondary.useTransparentBg}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color del texto
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.secondary.textColor}
                onChange={(e) => onUpdateSecondaryButton('textColor', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={buttons.secondary.textColor}
                onChange={(e) => onUpdateSecondaryButton('textColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color del borde
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.secondary.borderColor}
                onChange={(e) => onUpdateSecondaryButton('borderColor', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={buttons.secondary.borderColor}
                onChange={(e) => onUpdateSecondaryButton('borderColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color hover (fondo)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.secondary.hoverBgColor}
                onChange={(e) => onUpdateSecondaryButton('hoverBgColor', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={buttons.secondary.hoverBgColor}
                onChange={(e) => onUpdateSecondaryButton('hoverBgColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color hover (texto)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={buttons.secondary.hoverTextColor}
                onChange={(e) => onUpdateSecondaryButton('hoverTextColor', e.target.value)}
                className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={buttons.secondary.hoverTextColor}
                onChange={(e) => onUpdateSecondaryButton('hoverTextColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                placeholder="#7C3AED"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bordes redondeados
            </label>
            <select
              value={buttons.secondary.borderRadius}
              onChange={(e) => onUpdateSecondaryButton('borderRadius', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {BORDER_RADIUS.map((radius) => (
                <option key={radius.value} value={radius.value}>
                  {radius.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle para borde con gradiente */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <input
            type="checkbox"
            id="secondary-border-gradient"
            checked={buttons.secondary.useBorderGradient}
            onChange={(e) => onUpdateSecondaryButton('useBorderGradient', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="secondary-border-gradient" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            🌈 Usar borde con gradiente
          </label>
        </div>

        {/* Configuración del borde con gradiente */}
        {buttons.secondary.useBorderGradient && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-2">⚙️ Configuración del borde con gradiente</p>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grosor
                </label>
                <select
                  value={buttons.secondary.borderWidth || '2px'}
                  onChange={(e) => onUpdateSecondaryButton('borderWidth', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="1px">1px</option>
                  <option value="2px">2px</option>
                  <option value="3px">3px</option>
                  <option value="4px">4px</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color inicio
                </label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={buttons.secondary.borderGradientFrom || '#FFFFFF'}
                    onChange={(e) => onUpdateSecondaryButton('borderGradientFrom', e.target.value)}
                    className="h-8 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttons.secondary.borderGradientFrom || '#FFFFFF'}
                    onChange={(e) => onUpdateSecondaryButton('borderGradientFrom', e.target.value)}
                    className="flex-1 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color final
                </label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={buttons.secondary.borderGradientTo || '#E9D5FF'}
                    onChange={(e) => onUpdateSecondaryButton('borderGradientTo', e.target.value)}
                    className="h-8 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttons.secondary.borderGradientTo || '#E9D5FF'}
                    onChange={(e) => onUpdateSecondaryButton('borderGradientTo', e.target.value)}
                    className="flex-1 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección del gradiente
              </label>
              <select
                value={buttons.secondary.borderGradientDirection || 'to right'}
                onChange={(e) => onUpdateSecondaryButton('borderGradientDirection', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="to right">→ Horizontal</option>
                <option value="to bottom">↓ Vertical</option>
                <option value="to bottom right">↘ Diagonal</option>
                <option value="135deg">🔄 Diagonal 135°</option>
              </select>
            </div>
          </div>
        )}

        {/* Preview del botón secundario */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Vista previa:</p>
          <button
            className={`px-8 py-4 font-semibold ${buttons.secondary.borderRadius} transition-colors`}
            style={{
              ...(buttons.secondary.useBorderGradient ? {
                background: buttons.secondary.useTransparentBg ? 'transparent' : buttons.secondary.bgColor,
                color: buttons.secondary.textColor,
                border: `${buttons.secondary.borderWidth || '2px'} solid transparent`,
                backgroundImage: buttons.secondary.useTransparentBg 
                  ? 'none'
                  : `linear-gradient(${buttons.secondary.bgColor}, ${buttons.secondary.bgColor}), linear-gradient(${buttons.secondary.borderGradientDirection || 'to right'}, ${buttons.secondary.borderGradientFrom || '#FFFFFF'}, ${buttons.secondary.borderGradientTo || '#E9D5FF'})`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              } : {
                backgroundColor: buttons.secondary.useTransparentBg ? 'transparent' : buttons.secondary.bgColor,
                color: buttons.secondary.textColor,
                border: `2px solid ${buttons.secondary.borderColor}`,
              }),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttons.secondary.hoverBgColor;
              e.currentTarget.style.color = buttons.secondary.hoverTextColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttons.secondary.bgColor;
              e.currentTarget.style.color = buttons.secondary.textColor;
            }}
          >
            {buttons.secondary.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CtaStylePanel;
