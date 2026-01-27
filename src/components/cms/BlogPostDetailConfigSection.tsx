/**
 * 📝 BlogPostDetailConfigSection
 * Componente para configurar la página de detalle de posts del blog desde el CMS
 * 
 * ORGANIZACIÓN EN 4 SECCIONES:
 * 1. Hero (Título + Imagen)
 * 2. Contenido (TOC, Texto, Tipografía)
 * 3. Comentarios
 * 4. Relacionados y Navegación
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Image,
  Type,
  MessageSquare,
  Layout,
  Eye,
  Palette,
  List,
  Share2,
  Bookmark,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import ImageSelectorModal from '../ImageSelectorModal';

// ============================================
// TIPOS
// ============================================

interface BlogPostDetailConfig {
  hero?: {
    variant?: 'overlay' | 'compact' | 'minimal';
    showBreadcrumb?: boolean;
    showBackButton?: boolean;
    showCategory?: boolean;
    showReadingTime?: boolean;
    showPublishDate?: boolean;
    showAuthor?: boolean;
    overlayOpacity?: number;
    height?: string;
    background?: {
      type?: 'image' | 'gradient' | 'solid';
      gradientFrom?: string;
      gradientTo?: string;
      overlayColor?: string;
    };
    styles?: {
      light?: { 
        titleColor?: string; 
        subtitleColor?: string; 
        metaColor?: string; 
        titleFont?: string;
        // Botón Volver
        backButtonTextColor?: string;
        backButtonIconColor?: string;
        backButtonBgColor?: string;
        backButtonBorderColor?: string;
        backButtonBorderUseGradient?: boolean;
        backButtonBorderGradientFrom?: string;
        backButtonBorderGradientTo?: string;
        // Badge Categoría
        categoryUseCategoryColors?: string; // 'true' | 'false'
        categoryBgColor?: string;
        categoryTextColor?: string;
        categoryBorderColor?: string;
        categoryBorderUseGradient?: boolean;
        categoryBorderGradientFrom?: string;
        categoryBorderGradientTo?: string;
        // Iconos
        iconsColor?: string;
        // Tiempo de lectura
        readingTimeColor?: string;
        // Avatar
        avatarBorderColor?: string;
      };
      dark?: { 
        titleColor?: string; 
        subtitleColor?: string; 
        metaColor?: string; 
        titleFont?: string;
        // Botón Volver
        backButtonTextColor?: string;
        backButtonIconColor?: string;
        backButtonBgColor?: string;
        backButtonBorderColor?: string;
        backButtonBorderUseGradient?: boolean;
        backButtonBorderGradientFrom?: string;
        backButtonBorderGradientTo?: string;
        // Badge Categoría
        categoryUseCategoryColors?: string; // 'true' | 'false'
        categoryBgColor?: string;
        categoryTextColor?: string;
        categoryBorderColor?: string;
        categoryBorderUseGradient?: boolean;
        categoryBorderGradientFrom?: string;
        categoryBorderGradientTo?: string;
        // Iconos
        iconsColor?: string;
        // Tiempo de lectura
        readingTimeColor?: string;
        // Avatar
        avatarBorderColor?: string;
      };
    };
  };
  // Barra de resumen (excerpt + botones like/save)
  summaryBar?: {
    enabled?: boolean;
    showExcerpt?: boolean;
    showLikeButton?: boolean;
    showSaveButton?: boolean;
    showShareButton?: boolean;
    excerptMaxLines?: number;
    styles?: {
      light?: { 
        background?: string; 
        borderColor?: string; 
        textColor?: string;
        buttonBgColor?: string;
        buttonIconColor?: string;
      };
      dark?: { 
        background?: string; 
        borderColor?: string; 
        textColor?: string;
        buttonBgColor?: string;
        buttonIconColor?: string;
      };
    };
  };
  content?: {
    maxWidth?: string;
    lineHeight?: string;
    fontSize?: string;
    fontFamily?: string;
    headingFontFamily?: string;
    paragraphSpacing?: string;
    background?: { light?: string; dark?: string };
    backgroundImage?: { light?: string; dark?: string };
    backgroundOverlay?: { light?: number; dark?: number };
    textColor?: { light?: string; dark?: string };
    headingColor?: { light?: string; dark?: string };
    linkColor?: { light?: string; dark?: string };
  };
  tableOfContents?: {
    enabled?: boolean;
    position?: 'left' | 'right' | 'none';
    sticky?: boolean;
    showProgress?: boolean;
    collapsible?: boolean;
    defaultExpanded?: boolean;
    maxDepth?: number;
    width?: string;
    styles?: {
      light?: { background?: string; border?: string; activeColor?: string; textColor?: string; progressColor?: string; progressBarFrom?: string; progressBarTo?: string };
      dark?: { background?: string; border?: string; activeColor?: string; textColor?: string; progressColor?: string; progressBarFrom?: string; progressBarTo?: string };
    };
  };
  readingProgress?: {
    enabled?: boolean;
    position?: 'top' | 'bottom';
    height?: string;
    barColor?: { light?: string; dark?: string };
    barGradientFrom?: { light?: string; dark?: string };
    barGradientTo?: { light?: string; dark?: string };
    backgroundColor?: { light?: string; dark?: string };
  };
  author?: {
    showCard?: boolean;
    showBio?: boolean;
    showSocialLinks?: boolean;
    showRole?: boolean;
    nameFormat?: 'full' | 'two-words' | 'first-initials';
    avatarShape?: 'circle' | 'square';
    cardPosition?: 'bottom' | 'sidebar';
    styles?: {
      light?: { background?: string; border?: string; nameColor?: string; bioColor?: string };
      dark?: { background?: string; border?: string; nameColor?: string; bioColor?: string };
    };
  };
  tags?: {
    showSection?: boolean;
    maxVisible?: number;
    styles?: {
      light?: { background?: string; textColor?: string; hoverBackground?: string };
      dark?: { background?: string; textColor?: string; hoverBackground?: string };
    };
  };
  relatedPosts?: {
    enabled?: boolean;
    maxPosts?: number;
    showTitle?: boolean;
    title?: string;
    layout?: 'grid' | 'carousel';
    columns?: number;
    showCategoryLink?: boolean;
    showExploreButton?: boolean;
    styles?: {
      light?: { 
        sectionBackground?: string; 
        sectionBorder?: string;
        iconColor?: string;
        cardBackground?: string; 
        cardBorder?: string;
        cardTitleColor?: string;
        cardCategoryBackground?: string;
        cardCategoryBorder?: string;
        cardCategoryText?: string;
        cardDateColor?: string;
        titleColor?: string;
        buttonBackground?: string;
        buttonBorder?: string;
        buttonText?: string;
        linkColor?: string;
      };
      dark?: { 
        sectionBackground?: string; 
        sectionBorder?: string;
        iconColor?: string;
        cardBackground?: string; 
        cardBorder?: string;
        cardTitleColor?: string;
        cardCategoryBackground?: string;
        cardCategoryBorder?: string;
        cardCategoryText?: string;
        cardDateColor?: string;
        titleColor?: string;
        buttonBackground?: string;
        buttonBorder?: string;
        buttonText?: string;
        linkColor?: string;
      };
    };
  };
  navigation?: {
    enabled?: boolean;
    showPrevNext?: boolean;
    showThumbnails?: boolean;
    showEmptyCard?: boolean;
    styles?: {
      light?: { 
        sectionBackground?: string; 
        sectionBorder?: string; 
        titleColor?: string;
        indicatorColor?: string;
        cardBackground?: string;
        cardBorder?: string;
        cardHoverBorder?: string;
        cardHoverBackground?: string;
        labelColor?: string;
        postTitleColor?: string;
        excerptColor?: string;
        metaColor?: string;
        iconColor?: string;
        imageBorder?: string;
      };
      dark?: { 
        sectionBackground?: string; 
        sectionBorder?: string; 
        titleColor?: string;
        indicatorColor?: string;
        cardBackground?: string;
        cardBorder?: string;
        cardHoverBorder?: string;
        cardHoverBackground?: string;
        labelColor?: string;
        postTitleColor?: string;
        excerptColor?: string;
        metaColor?: string;
        iconColor?: string;
        imageBorder?: string;
      };
    };
  };
  comments?: {
    enabled?: boolean;
    title?: string;
    fontFamily?: string;
    allowAnonymous?: boolean;
    moderationRequired?: boolean;
    maxDepth?: number;
    showCount?: boolean;
    avatarShape?: 'circle' | 'square';
    styles?: {
      light?: { 
        sectionBackground?: string;
        sectionBorder?: string;
        titleColor?: string;
        iconColor?: string;
        countColor?: string;
        selectorBackground?: string;
        selectorBorder?: string;
        selectorText?: string;
        selectorIconColor?: string;
        selectorDropdownBg?: string;
        selectorOptionHover?: string;
        cardBackground?: string; 
        cardBorder?: string; 
        authorColor?: string; 
        textColor?: string;
        dateColor?: string;
        formBackground?: string;
        formBorder?: string;
        formFocusBorder?: string;
        textareaBackground?: string;
        textareaText?: string;
        footerBackground?: string;
        buttonBackground?: string;
        buttonBorder?: string;
        buttonText?: string;
      };
      dark?: { 
        sectionBackground?: string;
        sectionBorder?: string;
        titleColor?: string;
        iconColor?: string;
        countColor?: string;
        selectorBackground?: string;
        selectorBorder?: string;
        selectorText?: string;
        selectorIconColor?: string;
        selectorDropdownBg?: string;
        selectorOptionHover?: string;
        cardBackground?: string; 
        cardBorder?: string; 
        authorColor?: string; 
        textColor?: string;
        dateColor?: string;
        formBackground?: string;
        formBorder?: string;
        formFocusBorder?: string;
        textareaBackground?: string;
        textareaText?: string;
        footerBackground?: string;
        buttonBackground?: string;
        buttonBorder?: string;
        buttonText?: string;
      };
    };
  };
  shareButtons?: {
    enabled?: boolean;
    position?: 'sidebar' | 'bottom' | 'both';
    platforms?: string[];
    styles?: {
      light?: { background?: string; iconColor?: string; hoverBackground?: string };
      dark?: { background?: string; iconColor?: string; hoverBackground?: string };
    };
  };
}

interface BlogPostDetailConfigSectionProps {
  config: BlogPostDetailConfig;
  onChange: (config: BlogPostDetailConfig) => void;
}

// ============================================
// COMPONENTES REUTILIZABLES
// ============================================

// Componente de sección principal (las 4 secciones)
const MainSection: React.FC<{
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ number, title, description, icon, color, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      iconBg: 'bg-blue-600'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-800 dark:text-purple-200',
      iconBg: 'bg-purple-600'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      iconBg: 'bg-green-600'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-800 dark:text-orange-200',
      iconBg: 'bg-orange-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`rounded-2xl border-2 ${colors.border} overflow-hidden shadow-sm`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 sm:p-5 ${colors.bg} hover:opacity-90 transition-all`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.iconBg} rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
            {icon}
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm font-bold ${colors.text} opacity-60`}>SECCIÓN {number}</span>
            </div>
            <h3 className={`text-base sm:text-xl font-bold ${colors.text} truncate`}>{title}</h3>
            <p className={`text-xs sm:text-sm ${colors.text} opacity-70 line-clamp-1`}>{description}</p>
          </div>
        </div>
        <div className={`${colors.text} flex-shrink-0 ml-2`}>
          {isOpen ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
        </div>
      </button>
      {isOpen && (
        <div className="p-3 sm:p-6 bg-white dark:bg-gray-900 space-y-4 sm:space-y-6">
          {children}
        </div>
      )}
    </div>
  );
};

// Subsección colapsable
const SubSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{icon}</span>
          <span className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base truncate">{title}</span>
        </div>
        <div className="flex-shrink-0 ml-2">
          {isOpen ? (
            <ChevronDown className="text-gray-500" size={18} />
          ) : (
            <ChevronRight className="text-gray-500" size={18} />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 space-y-3 sm:space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Toggle Switch
const Toggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}> = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// Select Field
const SelectField: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Input Field
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-sm"
    />
  </div>
);

// Color Input
const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 flex-shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer p-1"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-mono"
      />
    </div>
  </div>
);

// Gradient Color Input - Permite color sólido o gradiente
const GradientColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  // Detectar si el valor actual es un gradiente
  const isGradient = value?.startsWith('linear-gradient');
  
  // Parsear colores del gradiente o usar valores por defecto
  const parseGradient = (val: string) => {
    if (!val?.startsWith('linear-gradient')) {
      return { color1: val || '#3b82f6', color2: '#7c3aed', direction: 'to right' };
    }
    const match = val.match(/linear-gradient\((.*?),\s*(#[a-fA-F0-9]{6}),\s*(#[a-fA-F0-9]{6})\)/);
    if (match) {
      return { direction: match[1], color1: match[2], color2: match[3] };
    }
    return { color1: '#3b82f6', color2: '#7c3aed', direction: 'to right' };
  };

  const { color1, color2, direction } = parseGradient(value);
  const [mode, setMode] = React.useState<'solid' | 'gradient'>(isGradient ? 'gradient' : 'solid');
  const [gradientDir, setGradientDir] = React.useState(direction);
  const [solidColor, setSolidColor] = React.useState(isGradient ? '#3b82f6' : (value || '#3b82f6'));
  const [gradColor1, setGradColor1] = React.useState(color1);
  const [gradColor2, setGradColor2] = React.useState(color2);

  // Actualizar valor cuando cambian los inputs
  React.useEffect(() => {
    if (mode === 'solid') {
      onChange(solidColor);
    } else {
      onChange(`linear-gradient(${gradientDir}, ${gradColor1}, ${gradColor2})`);
    }
  }, [mode, solidColor, gradColor1, gradColor2, gradientDir]);

  const directions = [
    { value: 'to right', label: '→', title: 'Horizontal' },
    { value: 'to left', label: '←', title: 'Horizontal inverso' },
    { value: 'to bottom', label: '↓', title: 'Vertical' },
    { value: 'to top', label: '↑', title: 'Vertical inverso' },
    { value: 'to bottom right', label: '↘', title: 'Diagonal' },
    { value: 'to top left', label: '↖', title: 'Diagonal inverso' },
    { value: 'to bottom left', label: '↙', title: 'Diagonal izq' },
    { value: 'to top right', label: '↗', title: 'Diagonal der' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {/* Toggle Sólido/Gradiente */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('solid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'solid'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Sólido
          </button>
          <button
            type="button"
            onClick={() => setMode('gradient')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'gradient'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Gradiente
          </button>
        </div>
      </div>

      {mode === 'solid' ? (
        /* Modo Sólido */
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
            className="w-10 h-10 flex-shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer p-1"
          />
          <input
            type="text"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
            placeholder="#000000"
            className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-mono"
          />
        </div>
      ) : (
        /* Modo Gradiente */
        <div className="space-y-3">
          {/* Preview del gradiente */}
          <div
            className="h-12 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ background: `linear-gradient(${gradientDir}, ${gradColor1}, ${gradColor2})` }}
          />
          
          {/* Selectores de dirección - Grid responsive */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
            {directions.map((dir) => (
              <button
                key={dir.value}
                type="button"
                onClick={() => setGradientDir(dir.value)}
                title={dir.title}
                className={`h-9 flex items-center justify-center rounded-md text-sm font-bold transition-all ${
                  gradientDir === dir.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {dir.label}
              </button>
            ))}
          </div>

          {/* Colores del gradiente - Stack en móvil, grid en desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Color inicio</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradColor1}
                  onChange={(e) => setGradColor1(e.target.value)}
                  className="w-10 h-10 flex-shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={gradColor1}
                  onChange={(e) => setGradColor1(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Color fin</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradColor2}
                  onChange={(e) => setGradColor2(e.target.value)}
                  className="w-10 h-10 flex-shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={gradColor2}
                  onChange={(e) => setGradColor2(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Background Color Input - Color sólido con opción de transparente
const BackgroundColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const isTransparent = value === 'transparent';
  const [mode, setMode] = React.useState<'solid' | 'transparent'>(isTransparent ? 'transparent' : 'solid');
  const [solidColor, setSolidColor] = React.useState(isTransparent ? '#ffffff' : (value || '#ffffff'));

  React.useEffect(() => {
    if (mode === 'transparent') {
      onChange('transparent');
    } else {
      onChange(solidColor);
    }
  }, [mode, solidColor]);

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {/* Toggle Sólido/Transparente */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('solid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'solid'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Sólido
          </button>
          <button
            type="button"
            onClick={() => setMode('transparent')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'transparent'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Transparente
          </button>
        </div>
      </div>

      {mode === 'solid' ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
            className="w-10 h-10 flex-shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer p-1"
          />
          <input
            type="text"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
            placeholder="#000000"
            className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-mono"
          />
        </div>
      ) : (
        <div 
          className="h-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
          style={{
            background: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 16px 16px'
          }}
        >
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded">
            Fondo transparente
          </span>
        </div>
      )}
    </div>
  );
};

// Range Slider
const RangeSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}> = ({ label, value, min, max, step = 1, onChange, unit = '' }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const BlogPostDetailConfigSection: React.FC<BlogPostDetailConfigSectionProps> = ({
  config,
  onChange
}) => {
  // Estados para modales de selección de imagen
  const [showImageModalLight, setShowImageModalLight] = useState(false);
  const [showImageModalDark, setShowImageModalDark] = useState(false);

  // Helper para actualizar configuración anidada
  const updateConfig = <K extends keyof BlogPostDetailConfig>(
    section: K,
    field: string,
    value: any
  ) => {
    onChange({
      ...config,
      [section]: {
        ...(config[section] || {}),
        [field]: value
      }
    });
  };

  // Helper para actualizar estilos por tema
  const updateStyles = (
    section: keyof BlogPostDetailConfig,
    theme: 'light' | 'dark',
    field: string,
    value: string
  ) => {
    const currentSection = config[section] || {};
    const currentStyles = (currentSection as any).styles || {};
    const currentThemeStyles = currentStyles[theme] || {};

    onChange({
      ...config,
      [section]: {
        ...currentSection,
        styles: {
          ...currentStyles,
          [theme]: {
            ...currentThemeStyles,
            [field]: value
          }
        }
      }
    });
  };

  // Helper para actualizar campos anidados (ej: backgroundImage.light)
  const updateNestedField = (
    section: keyof BlogPostDetailConfig,
    nestedField: string,
    theme: 'light' | 'dark',
    value: string | number
  ) => {
    const currentSection = config[section] || {};
    const currentNestedField = (currentSection as any)[nestedField] || {};

    onChange({
      ...config,
      [section]: {
        ...currentSection,
        [nestedField]: {
          ...currentNestedField,
          [theme]: value
        }
      }
    });
  };

  // Manejar selección de imagen desde la galería
  const handleImageSelectLight = (imageUrl: string) => {
    updateNestedField('content', 'backgroundImage', 'light', imageUrl);
  };

  const handleImageSelectDark = (imageUrl: string) => {
    updateNestedField('content', 'backgroundImage', 'dark', imageUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Configuración de Post del Blog</h2>
            <p className="text-white/80 mt-1">
              Personaliza cada sección de la página de artículos
            </p>
          </div>
        </div>
      </div>

      {/* Navegación rápida */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">📋 Secciones disponibles:</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            1. Hero (Título + Imagen)
          </span>
          <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
            2. Contenido (TOC + Texto)
          </span>
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
            3. Comentarios
          </span>
          <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
            4. Relacionados + Navegación
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECCIÓN 1: HERO (TÍTULO + IMAGEN) */}
      {/* ============================================ */}
      <MainSection
        number={1}
        title="Hero (Título + Imagen)"
        description="Configura el encabezado del post: imagen destacada, título y metadatos"
        icon={<Image size={24} />}
        color="blue"
        defaultOpen={true}
      >
        {/* Variante del Hero */}
        <SubSection title="Tipo de Hero" icon={<Layout size={18} />}>
          <SelectField
            label="Variante del diseño"
            value={config.hero?.variant || 'overlay'}
            options={[
              { value: 'overlay', label: '🖼️ Overlay - Imagen con título superpuesto' },
              { value: 'compact', label: '📝 Compacto - Título sin imagen grande' },
              { value: 'minimal', label: '✨ Mínimo - Solo título y metadatos' }
            ]}
            onChange={(v) => updateConfig('hero', 'variant', v)}
          />
          
          <RangeSlider
            label="Opacidad del overlay oscuro"
            value={config.hero?.overlayOpacity ?? 60}
            min={0}
            max={100}
            onChange={(v) => updateConfig('hero', 'overlayOpacity', v)}
            unit="%"
          />
        </SubSection>

        {/* Elementos visibles */}
        <SubSection title="Elementos a mostrar" icon={<Eye size={18} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Toggle
              label="Breadcrumb / Volver"
              checked={config.hero?.showBreadcrumb ?? true}
              onChange={(v) => updateConfig('hero', 'showBreadcrumb', v)}
              description="Enlace para volver al blog"
            />
            <Toggle
              label="Categoría"
              checked={config.hero?.showCategory ?? true}
              onChange={(v) => updateConfig('hero', 'showCategory', v)}
              description="Badge de la categoría"
            />
            <Toggle
              label="Autor"
              checked={config.hero?.showAuthor ?? true}
              onChange={(v) => updateConfig('hero', 'showAuthor', v)}
              description="Nombre y avatar del autor"
            />
            <Toggle
              label="Fecha de publicación"
              checked={config.hero?.showPublishDate ?? true}
              onChange={(v) => updateConfig('hero', 'showPublishDate', v)}
              description="Cuándo se publicó"
            />
            <Toggle
              label="Tiempo de lectura"
              checked={config.hero?.showReadingTime ?? true}
              onChange={(v) => updateConfig('hero', 'showReadingTime', v)}
              description="Minutos estimados"
            />
          </div>
        </SubSection>

        {/* Barra de Progreso */}
        <SubSection title="Barra de progreso de lectura" icon={<Eye size={18} />} defaultOpen={false}>
          <Toggle
            label="Mostrar barra de progreso"
            checked={config.readingProgress?.enabled ?? true}
            onChange={(v) => updateConfig('readingProgress', 'enabled', v)}
            description="Indica el progreso de lectura del artículo"
          />
          {config.readingProgress?.enabled !== false && (
            <>
              <SelectField
                label="Posición"
                value={config.readingProgress?.position || 'top'}
                options={[
                  { value: 'top', label: 'Arriba de la página' },
                  { value: 'bottom', label: 'Abajo de la página' }
                ]}
                onChange={(v) => updateConfig('readingProgress', 'position', v)}
              />
              <InputField
                label="Altura de la barra"
                value={config.readingProgress?.height || '3px'}
                onChange={(v) => updateConfig('readingProgress', 'height', v)}
                placeholder="3px"
              />

              {/* Colores de la barra de progreso */}
              <div className="space-y-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  🎨 Colores de la barra
                </h4>
                
                {/* Opción: Gradiente o Color Sólido */}
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                  <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
                    💡 <strong>Tip:</strong> Si configuras los colores de gradiente, se usará un degradado. De lo contrario, se usará el color sólido.
                  </p>
                </div>

                {/* Gradiente */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    🌈 Gradiente de la barra
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">☀️ Tema Claro</p>
                      <ColorInput
                        label="Gradiente desde"
                        value={config.readingProgress?.barGradientFrom?.light || ''}
                        onChange={(v) => {
                          const current = config.readingProgress?.barGradientFrom || {};
                          onChange({
                            ...config,
                            readingProgress: {
                              ...config.readingProgress,
                              barGradientFrom: { ...current, light: v }
                            }
                          });
                        }}
                      />
                      <ColorInput
                        label="Gradiente hasta"
                        value={config.readingProgress?.barGradientTo?.light || ''}
                        onChange={(v) => {
                          const current = config.readingProgress?.barGradientTo || {};
                          onChange({
                            ...config,
                            readingProgress: {
                              ...config.readingProgress,
                              barGradientTo: { ...current, light: v }
                            }
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">🌙 Tema Oscuro</p>
                      <ColorInput
                        label="Gradiente desde"
                        value={config.readingProgress?.barGradientFrom?.dark || ''}
                        onChange={(v) => {
                          const current = config.readingProgress?.barGradientFrom || {};
                          onChange({
                            ...config,
                            readingProgress: {
                              ...config.readingProgress,
                              barGradientFrom: { ...current, dark: v }
                            }
                          });
                        }}
                      />
                      <ColorInput
                        label="Gradiente hasta"
                        value={config.readingProgress?.barGradientTo?.dark || ''}
                        onChange={(v) => {
                          const current = config.readingProgress?.barGradientTo || {};
                          onChange({
                            ...config,
                            readingProgress: {
                              ...config.readingProgress,
                              barGradientTo: { ...current, dark: v }
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Color Sólido (alternativo) */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    🎨 Color sólido (si no usas gradiente)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorInput
                      label="Color de la barra (Light)"
                      value={config.readingProgress?.barColor?.light || '#8b5cf6'}
                      onChange={(v) => {
                        const currentBarColor = config.readingProgress?.barColor || {};
                        onChange({
                          ...config,
                          readingProgress: {
                            ...config.readingProgress,
                            barColor: { ...currentBarColor, light: v }
                          }
                        });
                      }}
                    />
                    <ColorInput
                      label="Color de la barra (Dark)"
                      value={config.readingProgress?.barColor?.dark || '#a78bfa'}
                      onChange={(v) => {
                        const currentBarColor = config.readingProgress?.barColor || {};
                        onChange({
                          ...config,
                          readingProgress: {
                            ...config.readingProgress,
                            barColor: { ...currentBarColor, dark: v }
                          }
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Color del fondo/track */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ColorInput
                    label="Color del fondo (Light)"
                    value={config.readingProgress?.backgroundColor?.light || '#e5e7eb'}
                    onChange={(v) => {
                      const currentBgColor = config.readingProgress?.backgroundColor || {};
                      onChange({
                        ...config,
                        readingProgress: {
                          ...config.readingProgress,
                          backgroundColor: { ...currentBgColor, light: v }
                        }
                      });
                    }}
                  />
                  <ColorInput
                    label="Color del fondo (Dark)"
                    value={config.readingProgress?.backgroundColor?.dark || '#374151'}
                    onChange={(v) => {
                      const currentBgColor = config.readingProgress?.backgroundColor || {};
                      onChange({
                        ...config,
                        readingProgress: {
                          ...config.readingProgress,
                          backgroundColor: { ...currentBgColor, dark: v }
                        }
                      });
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </SubSection>

        {/* 🎨 Estilos y Colores del Hero */}
        <SubSection title="Estilos y Colores del Hero" icon={<Palette size={18} />} defaultOpen={false}>
          <div className="space-y-6">
            {/* Tipo de Fondo */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🖼️ Configuración del Fondo
              </h4>
              <SelectField
                label="Tipo de fondo"
                value={config.hero?.background?.type || 'image'}
                options={[
                  { value: 'image', label: '🖼️ Imagen destacada del post' },
                  { value: 'gradient', label: '🌈 Gradiente de colores' },
                  { value: 'solid', label: '🎨 Color sólido' }
                ]}
                onChange={(v) => {
                  const currentBg = config.hero?.background || {};
                  onChange({
                    ...config,
                    hero: {
                      ...config.hero,
                      background: { ...currentBg, type: v as 'image' | 'gradient' | 'solid' }
                    }
                  });
                }}
              />

              {/* Colores del gradiente (solo si tipo = gradient) */}
              {config.hero?.background?.type === 'gradient' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <ColorInput
                    label="Color inicial del gradiente"
                    value={config.hero?.background?.gradientFrom || '#0f0f0f'}
                    onChange={(v) => {
                      const currentBg = config.hero?.background || {};
                      onChange({
                        ...config,
                        hero: {
                          ...config.hero,
                          background: { ...currentBg, gradientFrom: v }
                        }
                      });
                    }}
                  />
                  <ColorInput
                    label="Color final del gradiente"
                    value={config.hero?.background?.gradientTo || '#1a1a1a'}
                    onChange={(v) => {
                      const currentBg = config.hero?.background || {};
                      onChange({
                        ...config,
                        hero: {
                          ...config.hero,
                          background: { ...currentBg, gradientTo: v }
                        }
                      });
                    }}
                  />
                </div>
              )}

              {/* Color sólido (solo si tipo = solid) */}
              {config.hero?.background?.type === 'solid' && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <ColorInput
                    label="Color de fondo"
                    value={config.hero?.background?.overlayColor || '#1f2937'}
                    onChange={(v) => {
                      const currentBg = config.hero?.background || {};
                      onChange({
                        ...config,
                        hero: {
                          ...config.hero,
                          background: { ...currentBg, overlayColor: v }
                        }
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* Colores del texto por tema */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ✏️ Colores del Texto
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tema Claro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Tema Claro
                  </h5>
                  <div className="space-y-3">
                    <ColorInput
                      label="Color del título"
                      value={config.hero?.styles?.light?.titleColor || '#ffffff'}
                      onChange={(v) => updateStyles('hero', 'light', 'titleColor', v)}
                    />
                    <ColorInput
                      label="Color de metadatos"
                      value={config.hero?.styles?.light?.metaColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'light', 'metaColor', v)}
                    />
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-900">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Tema Oscuro
                  </h5>
                  <div className="space-y-3">
                    <ColorInput
                      label="Color del título"
                      value={config.hero?.styles?.dark?.titleColor || '#ffffff'}
                      onChange={(v) => updateStyles('hero', 'dark', 'titleColor', v)}
                    />
                    <ColorInput
                      label="Color de metadatos"
                      value={config.hero?.styles?.dark?.metaColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'dark', 'metaColor', v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tipografía del Hero */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🔤 Tipografía
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Fuente del título"
                  value={config.hero?.styles?.light?.titleFont || 'inherit'}
                  options={[
                    { value: 'inherit', label: 'Por defecto (del tema)' },
                    { value: 'Montserrat', label: 'Montserrat' },
                    { value: 'Inter', label: 'Inter' },
                    { value: 'Poppins', label: 'Poppins' },
                    { value: 'Roboto', label: 'Roboto' },
                    { value: 'Playfair Display', label: 'Playfair Display' },
                    { value: 'Lora', label: 'Lora' }
                  ]}
                  onChange={(v) => {
                    updateStyles('hero', 'light', 'titleFont', v);
                    updateStyles('hero', 'dark', 'titleFont', v);
                  }}
                />
                <SelectField
                  label="Tamaño del título"
                  value={config.hero?.height || 'default'}
                  options={[
                    { value: 'compact', label: 'Compacto (más pequeño)' },
                    { value: 'default', label: 'Normal' },
                    { value: 'large', label: 'Grande' }
                  ]}
                  onChange={(v) => updateConfig('hero', 'height', v)}
                />
              </div>
            </div>

            {/* Botón "Volver al blog" */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ⬅️ Botón "Volver al blog"
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tema Claro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Tema Claro
                  </h5>
                  <div className="space-y-3">
                    <ColorInput
                      label="Color del texto"
                      value={config.hero?.styles?.light?.backButtonTextColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'light', 'backButtonTextColor', v)}
                    />
                    <ColorInput
                      label="Color del icono"
                      value={config.hero?.styles?.light?.backButtonIconColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'light', 'backButtonIconColor', v)}
                    />
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-900">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Tema Oscuro
                  </h5>
                  <div className="space-y-3">
                    <ColorInput
                      label="Color del texto"
                      value={config.hero?.styles?.dark?.backButtonTextColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'dark', 'backButtonTextColor', v)}
                    />
                    <ColorInput
                      label="Color del icono"
                      value={config.hero?.styles?.dark?.backButtonIconColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'dark', 'backButtonIconColor', v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Badge de Categoría */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🏷️ Badge de Categoría
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tema Claro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Tema Claro
                  </h5>
                  <div className="space-y-3">
                    <Toggle
                      label="Usar colores de la categoría"
                      checked={config.hero?.styles?.light?.categoryUseCategoryColors !== 'false'}
                      onChange={(v) => updateStyles('hero', 'light', 'categoryUseCategoryColors', v ? 'true' : 'false')}
                      description="Si está activo, usa los colores definidos en cada categoría"
                    />
                    {config.hero?.styles?.light?.categoryUseCategoryColors === 'false' && (
                      <>
                        <ColorInput
                          label="Color del texto"
                          value={config.hero?.styles?.light?.categoryTextColor || '#ffffff'}
                          onChange={(v) => updateStyles('hero', 'light', 'categoryTextColor', v)}
                        />
                        <BackgroundColorInput
                          label="Fondo del badge"
                          value={config.hero?.styles?.light?.categoryBgColor || '#8b5cf6'}
                          onChange={(v) => updateStyles('hero', 'light', 'categoryBgColor', v)}
                        />
                        <GradientColorInput
                          label="Borde del badge"
                          value={config.hero?.styles?.light?.categoryBorderColor || 'transparent'}
                          onChange={(v) => updateStyles('hero', 'light', 'categoryBorderColor', v)}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-900">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Tema Oscuro
                  </h5>
                  <div className="space-y-3">
                    <Toggle
                      label="Usar colores de la categoría"
                      checked={config.hero?.styles?.dark?.categoryUseCategoryColors !== 'false'}
                      onChange={(v) => updateStyles('hero', 'dark', 'categoryUseCategoryColors', v ? 'true' : 'false')}
                      description="Si está activo, usa los colores definidos en cada categoría"
                    />
                    {config.hero?.styles?.dark?.categoryUseCategoryColors === 'false' && (
                      <>
                        <ColorInput
                          label="Color del texto"
                          value={config.hero?.styles?.dark?.categoryTextColor || '#ffffff'}
                          onChange={(v) => updateStyles('hero', 'dark', 'categoryTextColor', v)}
                        />
                        <BackgroundColorInput
                          label="Fondo del badge"
                          value={config.hero?.styles?.dark?.categoryBgColor || '#a855f7'}
                          onChange={(v) => updateStyles('hero', 'dark', 'categoryBgColor', v)}
                        />
                        <GradientColorInput
                          label="Borde del badge"
                          value={config.hero?.styles?.dark?.categoryBorderColor || 'transparent'}
                          onChange={(v) => updateStyles('hero', 'dark', 'categoryBorderColor', v)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Iconos y Avatar */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🎨 Iconos, Tiempo de Lectura y Avatar
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tema Claro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    Tema Claro
                  </h5>
                  <div className="space-y-3">
                    <ColorInput
                      label="Color de iconos (calendario, reloj, vistas)"
                      value={config.hero?.styles?.light?.iconsColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'light', 'iconsColor', v)}
                    />
                    <ColorInput
                      label="Color del texto de tiempo de lectura"
                      value={config.hero?.styles?.light?.readingTimeColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'light', 'readingTimeColor', v)}
                    />
                    <ColorInput
                      label="Color del borde del avatar"
                      value={config.hero?.styles?.light?.avatarBorderColor || 'rgba(255,255,255,0.3)'}
                      onChange={(v) => updateStyles('hero', 'light', 'avatarBorderColor', v)}
                    />
                  </div>
                </div>

                {/* Tema Oscuro */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-900">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Tema Oscuro
                  </h5>
                  <div className="space-y-3">
                    <ColorInput
                      label="Color de iconos (calendario, reloj, vistas)"
                      value={config.hero?.styles?.dark?.iconsColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'dark', 'iconsColor', v)}
                    />
                    <ColorInput
                      label="Color del texto de tiempo de lectura"
                      value={config.hero?.styles?.dark?.readingTimeColor || 'rgba(255,255,255,0.8)'}
                      onChange={(v) => updateStyles('hero', 'dark', 'readingTimeColor', v)}
                    />
                    <ColorInput
                      label="Color del borde del avatar"
                      value={config.hero?.styles?.dark?.avatarBorderColor || 'rgba(255,255,255,0.3)'}
                      onChange={(v) => updateStyles('hero', 'dark', 'avatarBorderColor', v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                👁️ Vista Previa
              </h4>
              <div 
                className="relative rounded-xl overflow-hidden h-48"
                style={{
                  background: config.hero?.background?.type === 'gradient'
                    ? `linear-gradient(135deg, ${config.hero?.background?.gradientFrom || '#0f0f0f'}, ${config.hero?.background?.gradientTo || '#1a1a1a'})`
                    : config.hero?.background?.type === 'solid'
                    ? config.hero?.background?.overlayColor || '#1f2937'
                    : 'linear-gradient(135deg, #374151, #1f2937)'
                }}
              >
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(0,0,0,${(config.hero?.overlayOpacity ?? 60) / 100})` }}
                />
                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Botón Volver */}
                  <div 
                    className="inline-flex items-center gap-2 text-xs font-medium mb-2 px-2 py-1 rounded w-fit"
                    style={{ 
                      color: config.hero?.styles?.light?.backButtonTextColor || 'rgba(255,255,255,0.8)',
                      backgroundColor: config.hero?.styles?.light?.backButtonBgColor || 'transparent',
                      border: config.hero?.styles?.light?.backButtonBorderColor && config.hero?.styles?.light?.backButtonBorderColor !== 'transparent'
                        ? `1px solid ${config.hero?.styles?.light?.backButtonBorderColor}`
                        : 'none'
                    }}
                  >
                    <span style={{ color: config.hero?.styles?.light?.backButtonIconColor || 'rgba(255,255,255,0.8)' }}>←</span>
                    Volver al blog
                  </div>
                  
                  {/* Badge Categoría */}
                  <span 
                    className="text-xs px-2 py-1 rounded-full w-fit mb-2"
                    style={
                      config.hero?.styles?.light?.categoryUseCategoryColors !== 'false'
                        ? { backgroundColor: '#8b5cf615', color: '#8b5cf6', border: '1px solid #8b5cf640' }
                        : { 
                            backgroundColor: config.hero?.styles?.light?.categoryBgColor || '#8b5cf6',
                            color: config.hero?.styles?.light?.categoryTextColor || '#ffffff',
                            border: config.hero?.styles?.light?.categoryBorderColor && config.hero?.styles?.light?.categoryBorderColor !== 'transparent'
                              ? `1px solid ${config.hero?.styles?.light?.categoryBorderColor}`
                              : 'none'
                          }
                    }
                  >
                    🏷️ Categoría
                  </span>
                  
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ 
                      color: config.hero?.styles?.light?.titleColor || '#ffffff',
                      fontFamily: config.hero?.styles?.light?.titleFont || 'inherit'
                    }}
                  >
                    Título del artículo de ejemplo
                  </h3>
                  <div 
                    className="flex items-center gap-3 text-sm"
                    style={{ color: config.hero?.styles?.light?.metaColor || 'rgba(255,255,255,0.8)' }}
                  >
                    <span 
                      className="flex items-center gap-1"
                      style={{ borderColor: config.hero?.styles?.light?.avatarBorderColor || 'rgba(255,255,255,0.3)' }}
                    >
                      <span className="w-5 h-5 rounded-full bg-gray-400 inline-block" style={{ border: `2px solid ${config.hero?.styles?.light?.avatarBorderColor || 'rgba(255,255,255,0.3)'}` }}></span>
                      Autor
                    </span>
                    <span>•</span>
                    <span style={{ color: config.hero?.styles?.light?.iconsColor || 'rgba(255,255,255,0.8)' }}>📅</span> 10 dic 2025
                    <span>•</span>
                    <span style={{ color: config.hero?.styles?.light?.iconsColor || 'rgba(255,255,255,0.8)' }}>⏱️</span> 5 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SubSection>
      </MainSection>

      {/* ============================================ */}
      {/* SECCIÓN 2: CONTENIDO (TOC + TEXTO) */}
      {/* ============================================ */}
      <MainSection
          number={2}
          title="Contenido (TOC + Texto)"
          description="Configura la tabla de contenidos, tipografía y estilos del contenido"
          icon={<Type size={24} />}
          color="purple"
        >
        {/* Barra de Resumen (Excerpt + Botones) */}
        <SubSection title="Barra de Resumen" icon={<Layout size={18} />}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Barra que aparece debajo del hero con el extracto del post y botones de interacción
          </p>
          
          <Toggle
            label="Mostrar barra de resumen"
            checked={config.summaryBar?.enabled ?? true}
            onChange={(v) => updateConfig('summaryBar', 'enabled', v)}
            description="Muestra el extracto del post y botones de interacción"
          />

          {config.summaryBar?.enabled !== false && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <Toggle
                  label="Mostrar extracto"
                  checked={config.summaryBar?.showExcerpt ?? true}
                  onChange={(v) => updateConfig('summaryBar', 'showExcerpt', v)}
                />
                <Toggle
                  label="Botón Me gusta"
                  checked={config.summaryBar?.showLikeButton ?? true}
                  onChange={(v) => updateConfig('summaryBar', 'showLikeButton', v)}
                />
                <Toggle
                  label="Botón Guardar"
                  checked={config.summaryBar?.showSaveButton ?? true}
                  onChange={(v) => updateConfig('summaryBar', 'showSaveButton', v)}
                />
                <Toggle
                  label="Botón Compartir"
                  checked={config.summaryBar?.showShareButton ?? false}
                  onChange={(v) => updateConfig('summaryBar', 'showShareButton', v)}
                />
              </div>

              <SelectField
                label="Líneas máximas del extracto"
                value={String(config.summaryBar?.excerptMaxLines || 2)}
                options={[
                  { value: '1', label: '1 línea' },
                  { value: '2', label: '2 líneas' },
                  { value: '3', label: '3 líneas' },
                  { value: 'none', label: 'Sin límite' }
                ]}
                onChange={(v) => updateConfig('summaryBar', 'excerptMaxLines', v === 'none' ? 0 : Number(v))}
              />

              {/* Estilos de la barra */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  🎨 Estilos de la Barra
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tema Claro */}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      Tema Claro
                    </h5>
                    <div className="space-y-3">
                      <ColorInput
                        label="Color del texto"
                        value={config.summaryBar?.styles?.light?.textColor || '#4b5563'}
                        onChange={(v) => updateStyles('summaryBar', 'light', 'textColor', v)}
                      />
                      <ColorInput
                        label="Color del borde"
                        value={config.summaryBar?.styles?.light?.borderColor || '#e5e7eb'}
                        onChange={(v) => updateStyles('summaryBar', 'light', 'borderColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo de la barra"
                        value={config.summaryBar?.styles?.light?.background || 'transparent'}
                        onChange={(v) => updateStyles('summaryBar', 'light', 'background', v)}
                      />
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 mb-2">Botones de interacción</p>
                        <ColorInput
                          label="Color del icono de los botones"
                          value={config.summaryBar?.styles?.light?.buttonIconColor || '#6b7280'}
                          onChange={(v) => updateStyles('summaryBar', 'light', 'buttonIconColor', v)}
                        />
                        <BackgroundColorInput
                          label="Fondo de los botones"
                          value={config.summaryBar?.styles?.light?.buttonBgColor || '#f3f4f6'}
                          onChange={(v) => updateStyles('summaryBar', 'light', 'buttonBgColor', v)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tema Oscuro */}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-900">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      Tema Oscuro
                    </h5>
                    <div className="space-y-3">
                      <ColorInput
                        label="Color del texto"
                        value={config.summaryBar?.styles?.dark?.textColor || '#9ca3af'}
                        onChange={(v) => updateStyles('summaryBar', 'dark', 'textColor', v)}
                      />
                      <ColorInput
                        label="Color del borde"
                        value={config.summaryBar?.styles?.dark?.borderColor || '#374151'}
                        onChange={(v) => updateStyles('summaryBar', 'dark', 'borderColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo de la barra"
                        value={config.summaryBar?.styles?.dark?.background || 'transparent'}
                        onChange={(v) => updateStyles('summaryBar', 'dark', 'background', v)}
                      />
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 mb-2">Botones de interacción</p>
                        <ColorInput
                          label="Color del icono de los botones"
                          value={config.summaryBar?.styles?.dark?.buttonIconColor || '#9ca3af'}
                          onChange={(v) => updateStyles('summaryBar', 'dark', 'buttonIconColor', v)}
                        />
                        <BackgroundColorInput
                          label="Fondo de los botones"
                          value={config.summaryBar?.styles?.dark?.buttonBgColor || '#374151'}
                          onChange={(v) => updateStyles('summaryBar', 'dark', 'buttonBgColor', v)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SubSection>

        {/* Tabla de Contenidos */}
        <SubSection title="Tabla de Contenidos (TOC)" icon={<List size={18} />}>
          <Toggle
            label="Habilitar tabla de contenidos"
            checked={config.tableOfContents?.enabled ?? true}
            onChange={(v) => updateConfig('tableOfContents', 'enabled', v)}
            description="Índice lateral con navegación por secciones"
          />

          {config.tableOfContents?.enabled !== false && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Posición"
                  value={config.tableOfContents?.position || 'right'}
                  options={[
                    { value: 'left', label: '⬅️ Izquierda' },
                    { value: 'right', label: '➡️ Derecha' }
                  ]}
                  onChange={(v) => updateConfig('tableOfContents', 'position', v)}
                />
                <SelectField
                  label="Profundidad de títulos"
                  value={String(config.tableOfContents?.maxDepth || 3)}
                  options={[
                    { value: '2', label: 'Solo H2' },
                    { value: '3', label: 'H2 y H3' },
                    { value: '4', label: 'H2, H3 y H4' }
                  ]}
                  onChange={(v) => updateConfig('tableOfContents', 'maxDepth', Number(v))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <Toggle
                  label="Sticky (fijo al scroll)"
                  checked={config.tableOfContents?.sticky ?? true}
                  onChange={(v) => updateConfig('tableOfContents', 'sticky', v)}
                />
                <Toggle
                  label="Mostrar progreso"
                  checked={config.tableOfContents?.showProgress ?? true}
                  onChange={(v) => updateConfig('tableOfContents', 'showProgress', v)}
                />
                <Toggle
                  label="Colapsable"
                  checked={config.tableOfContents?.collapsible ?? true}
                  onChange={(v) => updateConfig('tableOfContents', 'collapsible', v)}
                />
                <Toggle
                  label="Expandido por defecto"
                  checked={config.tableOfContents?.defaultExpanded ?? true}
                  onChange={(v) => updateConfig('tableOfContents', 'defaultExpanded', v)}
                />
              </div>

              {/* 🆕 Estilos del Botón Flotante */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  🎨 Estilos del Botón Flotante y Panel
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tema Claro */}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      Tema Claro
                    </h5>
                    <div className="space-y-3">
                      <ColorInput
                        label="Color del botón (gradiente desde)"
                        value={config.tableOfContents?.styles?.light?.activeColor || '#9333ea'}
                        onChange={(v) => updateStyles('tableOfContents', 'light', 'activeColor', v)}
                      />
                      <ColorInput
                        label="Color del botón (gradiente hasta)"
                        value={config.tableOfContents?.styles?.light?.progressColor || '#2563eb'}
                        onChange={(v) => updateStyles('tableOfContents', 'light', 'progressColor', v)}
                      />
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">📊 Barra de progreso del panel:</p>
                        <ColorInput
                          label="Barra progreso (gradiente desde)"
                          value={config.tableOfContents?.styles?.light?.progressBarFrom || '#9333ea'}
                          onChange={(v) => updateStyles('tableOfContents', 'light', 'progressBarFrom', v)}
                        />
                        <ColorInput
                          label="Barra progreso (gradiente hasta)"
                          value={config.tableOfContents?.styles?.light?.progressBarTo || '#2563eb'}
                          onChange={(v) => updateStyles('tableOfContents', 'light', 'progressBarTo', v)}
                        />
                      </div>
                      <ColorInput
                        label="Fondo del panel"
                        value={config.tableOfContents?.styles?.light?.background || '#ffffff'}
                        onChange={(v) => updateStyles('tableOfContents', 'light', 'background', v)}
                      />
                      <ColorInput
                        label="Color de borde del panel"
                        value={config.tableOfContents?.styles?.light?.border || '#e5e7eb'}
                        onChange={(v) => updateStyles('tableOfContents', 'light', 'border', v)}
                      />
                      <ColorInput
                        label="Color del texto"
                        value={config.tableOfContents?.styles?.light?.textColor || '#374151'}
                        onChange={(v) => updateStyles('tableOfContents', 'light', 'textColor', v)}
                      />
                    </div>
                  </div>

                  {/* Tema Oscuro */}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-900">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      Tema Oscuro
                    </h5>
                    <div className="space-y-3">
                      <ColorInput
                        label="Color del botón (gradiente desde)"
                        value={config.tableOfContents?.styles?.dark?.activeColor || '#a855f7'}
                        onChange={(v) => updateStyles('tableOfContents', 'dark', 'activeColor', v)}
                      />
                      <ColorInput
                        label="Color del botón (gradiente hasta)"
                        value={config.tableOfContents?.styles?.dark?.progressColor || '#3b82f6'}
                        onChange={(v) => updateStyles('tableOfContents', 'dark', 'progressColor', v)}
                      />
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">📊 Barra de progreso del panel:</p>
                        <ColorInput
                          label="Barra progreso (gradiente desde)"
                          value={config.tableOfContents?.styles?.dark?.progressBarFrom || '#a855f7'}
                          onChange={(v) => updateStyles('tableOfContents', 'dark', 'progressBarFrom', v)}
                        />
                        <ColorInput
                          label="Barra progreso (gradiente hasta)"
                          value={config.tableOfContents?.styles?.dark?.progressBarTo || '#3b82f6'}
                          onChange={(v) => updateStyles('tableOfContents', 'dark', 'progressBarTo', v)}
                        />
                      </div>
                      <ColorInput
                        label="Fondo del panel"
                        value={config.tableOfContents?.styles?.dark?.background || '#111827'}
                        onChange={(v) => updateStyles('tableOfContents', 'dark', 'background', v)}
                      />
                      <ColorInput
                        label="Color de borde del panel"
                        value={config.tableOfContents?.styles?.dark?.border || '#374151'}
                        onChange={(v) => updateStyles('tableOfContents', 'dark', 'border', v)}
                      />
                      <ColorInput
                        label="Color del texto"
                        value={config.tableOfContents?.styles?.dark?.textColor || '#d1d5db'}
                        onChange={(v) => updateStyles('tableOfContents', 'dark', 'textColor', v)}
                      />
                    </div>
                  </div>
                </div>

                {/* Nota informativa */}
                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    💡 <strong>Tip:</strong> El botón flotante aparece en la esquina inferior derecha de la pantalla. 
                    Los colores de gradiente definen el degradado del botón. El panel muestra la tabla de contenidos.
                  </p>
                </div>
              </div>
            </>
          )}
        </SubSection>

        {/* Tipografía del contenido */}
        <SubSection title="Tipografía del texto" icon={<Type size={18} />}>
          {/* Selector de Fuentes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <SelectField
              label="Fuente del texto"
              value={config.content?.fontFamily || 'Montserrat'}
              options={[
                { value: 'Montserrat', label: 'Montserrat (Predeterminada)' },
                { value: 'Inter', label: 'Inter' },
                { value: 'Roboto', label: 'Roboto' },
                { value: 'Open Sans', label: 'Open Sans' },
                { value: 'Lato', label: 'Lato' },
                { value: 'Poppins', label: 'Poppins' },
                { value: 'Nunito', label: 'Nunito' },
                { value: 'Source Sans Pro', label: 'Source Sans Pro' },
                { value: 'Raleway', label: 'Raleway' },
                { value: 'Merriweather', label: 'Merriweather (Serif)' },
                { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
                { value: 'Georgia', label: 'Georgia (Serif)' }
              ]}
              onChange={(v) => updateConfig('content', 'fontFamily', v)}
            />
            <SelectField
              label="Fuente de títulos"
              value={config.content?.headingFontFamily || 'Montserrat'}
              options={[
                { value: 'Montserrat', label: 'Montserrat (Predeterminada)' },
                { value: 'Inter', label: 'Inter' },
                { value: 'Roboto', label: 'Roboto' },
                { value: 'Open Sans', label: 'Open Sans' },
                { value: 'Lato', label: 'Lato' },
                { value: 'Poppins', label: 'Poppins' },
                { value: 'Nunito', label: 'Nunito' },
                { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
                { value: 'Merriweather', label: 'Merriweather (Serif)' }
              ]}
              onChange={(v) => updateConfig('content', 'headingFontFamily', v)}
            />
          </div>

          {/* Vista previa de fuente */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
            <h4 
              className="text-lg font-bold text-gray-900 dark:text-white mb-1"
              style={{ fontFamily: config.content?.headingFontFamily || 'Montserrat' }}
            >
              Título de ejemplo con la fuente seleccionada
            </h4>
            <p 
              className="text-gray-700 dark:text-gray-300"
              style={{ fontFamily: config.content?.fontFamily || 'Montserrat' }}
            >
              Este es un párrafo de ejemplo para ver cómo se ve el texto con la fuente seleccionada.
            </p>
          </div>

          {/* Otras configuraciones de tipografía */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Ancho máximo del contenido"
              value={config.content?.maxWidth || '680px'}
              onChange={(v) => updateConfig('content', 'maxWidth', v)}
              placeholder="680px"
            />
            <InputField
              label="Altura de línea"
              value={config.content?.lineHeight || '1.8'}
              onChange={(v) => updateConfig('content', 'lineHeight', v)}
              placeholder="1.8"
            />
            <InputField
              label="Tamaño de fuente"
              value={config.content?.fontSize || '18px'}
              onChange={(v) => updateConfig('content', 'fontSize', v)}
              placeholder="18px"
            />
            <InputField
              label="Espacio entre párrafos"
              value={config.content?.paragraphSpacing || '1.5rem'}
              onChange={(v) => updateConfig('content', 'paragraphSpacing', v)}
              placeholder="1.5rem"
            />
          </div>
        </SubSection>

        {/* Imagen de Fondo de la Sección */}
        <SubSection title="Imagen de Fondo" icon={<Image size={18} />} defaultOpen={true}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Selecciona una imagen de fondo para la sección de contenido. Puedes elegir de la galería o subir una nueva.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen tema claro */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                Tema Claro
              </h5>

              {config.content?.backgroundImage?.light ? (
                <div className="relative group">
                  <img
                    src={config.content.backgroundImage.light}
                    alt="Fondo tema claro"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      onClick={() => setShowImageModalLight(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      📷 Cambiar
                    </button>
                    <button
                      onClick={() => updateNestedField('content', 'backgroundImage', 'light', '')}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      🗑️ Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowImageModalLight(true)}
                  className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer"
                >
                  <Image className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">Seleccionar imagen</span>
                  <span className="text-xs text-gray-400">Desde galería o subir nueva</span>
                </button>
              )}

              {/* Modal de selección de imagen - Tema Claro */}
              <ImageSelectorModal
                isOpen={showImageModalLight}
                onClose={() => setShowImageModalLight(false)}
                onSelect={handleImageSelectLight}
                currentImage={config.content?.backgroundImage?.light}
                title="Seleccionar imagen de fondo - Tema Claro"
              />

              {/* Overlay para tema claro */}
              {config.content?.backgroundImage?.light && (
                <div className="mt-4">
                  <RangeSlider
                    label="Opacidad del overlay"
                    value={config.content?.backgroundOverlay?.light ?? 80}
                    min={0}
                    max={100}
                    onChange={(v) => updateNestedField('content', 'backgroundOverlay', 'light', v)}
                    unit="%"
                  />
                </div>
              )}
            </div>

            {/* Imagen tema oscuro */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-gray-900">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                Tema Oscuro
              </h5>

              {config.content?.backgroundImage?.dark ? (
                <div className="relative group">
                  <img
                    src={config.content.backgroundImage.dark}
                    alt="Fondo tema oscuro"
                    className="w-full h-32 object-cover rounded-lg border border-gray-600"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      onClick={() => setShowImageModalDark(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      📷 Cambiar
                    </button>
                    <button
                      onClick={() => updateNestedField('content', 'backgroundImage', 'dark', '')}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      🗑️ Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowImageModalDark(true)}
                  className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer"
                >
                  <Image className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">Seleccionar imagen</span>
                  <span className="text-xs text-gray-400">Desde galería o subir nueva</span>
                </button>
              )}

              {/* Modal de selección de imagen - Tema Oscuro */}
              <ImageSelectorModal
                isOpen={showImageModalDark}
                onClose={() => setShowImageModalDark(false)}
                onSelect={handleImageSelectDark}
                currentImage={config.content?.backgroundImage?.dark}
                title="Seleccionar imagen de fondo - Tema Oscuro"
              />

              {/* Overlay para tema oscuro */}
              {config.content?.backgroundImage?.dark && (
                <div className="mt-4">
                  <RangeSlider
                    label="Opacidad del overlay"
                    value={config.content?.backgroundOverlay?.dark ?? 90}
                    min={0}
                    max={100}
                    onChange={(v) => updateNestedField('content', 'backgroundOverlay', 'dark', v)}
                    unit="%"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Nota informativa */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Usa imágenes con patrones sutiles o gradientes para no distraer del contenido. 
              El overlay oscurecerá la imagen para mejorar la legibilidad del texto.
            </p>
          </div>
        </SubSection>

        {/* Colores del contenido */}
        <SubSection title="Colores" icon={<Palette size={18} />} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">☀️</span>
                Tema Claro
              </h4>
              <ColorInput
                label="Fondo"
                value={config.content?.background?.light || '#ffffff'}
                onChange={(v) => updateStyles('content', 'light', 'background', v)}
              />
              <ColorInput
                label="Color de texto"
                value={config.content?.textColor?.light || '#374151'}
                onChange={(v) => updateStyles('content', 'light', 'textColor', v)}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs">🌙</span>
                Tema Oscuro
              </h4>
              <ColorInput
                label="Fondo"
                value={config.content?.background?.dark || '#0f0f0f'}
                onChange={(v) => updateStyles('content', 'dark', 'background', v)}
              />
              <ColorInput
                label="Color de texto"
                value={config.content?.textColor?.dark || '#d4d4d4'}
                onChange={(v) => updateStyles('content', 'dark', 'textColor', v)}
              />
            </div>
          </div>
        </SubSection>

        {/* Autor y Tags */}
        <SubSection title="Autor y Etiquetas" icon={<Bookmark size={18} />} defaultOpen={false}>
          {/* ====== TARJETA DE AUTOR ====== */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              👤 Tarjeta de Autor
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Toggle
                label="Mostrar tarjeta"
                checked={config.author?.showCard ?? true}
                onChange={(v) => updateConfig('author', 'showCard', v)}
              />
              <Toggle
                label="Mostrar biografía"
                checked={config.author?.showBio ?? true}
                onChange={(v) => updateConfig('author', 'showBio', v)}
              />
              <Toggle
                label="Redes sociales"
                checked={config.author?.showSocialLinks ?? true}
                onChange={(v) => updateConfig('author', 'showSocialLinks', v)}
              />
              <Toggle
                label="Mostrar rol/cargo"
                checked={config.author?.showRole ?? true}
                onChange={(v) => updateConfig('author', 'showRole', v)}
              />
              <SelectField
                label="Formato del nombre"
                value={config.author?.nameFormat || 'full'}
                options={[
                  { value: 'full', label: '📝 Nombre completo' },
                  { value: 'two-words', label: '✂️ Solo 2 palabras (ej: Juan Pérez)' },
                  { value: 'first-initials', label: '🔤 Primera + iniciales (ej: Juan P. G.)' }
                ]}
                onChange={(v) => updateConfig('author', 'nameFormat', v)}
              />
              <SelectField
                label="Posición de la tarjeta"
                value={config.author?.cardPosition || 'bottom'}
                options={[
                  { value: 'bottom', label: '⬇️ Después del contenido' },
                  { value: 'sidebar', label: '📍 En la barra lateral' }
                ]}
                onChange={(v) => updateConfig('author', 'cardPosition', v)}
              />
              <SelectField
                label="Forma del avatar"
                value={config.author?.avatarShape || 'square'}
                options={[
                  { value: 'square', label: '⬜ Cuadrado (bordes redondeados)' },
                  { value: 'circle', label: '⭕ Círculo' }
                ]}
                onChange={(v) => updateConfig('author', 'avatarShape', v)}
              />
            </div>

            {/* Estilos de la tarjeta de autor */}
            {config.author?.showCard !== false && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">🎨 Estilos de la tarjeta</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tema Claro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-yellow-50/50 dark:bg-gray-800/50">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Tema Claro
                    </p>
                    <div className="space-y-2">
                      <BackgroundColorInput
                        label="Fondo"
                        value={config.author?.styles?.light?.background || '#f3f4f6'}
                        onChange={(v) => updateStyles('author', 'light', 'background', v)}
                      />
                      <ColorInput
                        label="Borde"
                        value={config.author?.styles?.light?.border || '#e5e7eb'}
                        onChange={(v) => updateStyles('author', 'light', 'border', v)}
                      />
                      <ColorInput
                        label="Color del nombre"
                        value={config.author?.styles?.light?.nameColor || '#1f2937'}
                        onChange={(v) => updateStyles('author', 'light', 'nameColor', v)}
                      />
                      <ColorInput
                        label="Color de la biografía"
                        value={config.author?.styles?.light?.bioColor || '#6b7280'}
                        onChange={(v) => updateStyles('author', 'light', 'bioColor', v)}
                      />
                    </div>
                  </div>
                  {/* Tema Oscuro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-slate-100/50 dark:bg-slate-800/50">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Tema Oscuro
                    </p>
                    <div className="space-y-2">
                      <BackgroundColorInput
                        label="Fondo"
                        value={config.author?.styles?.dark?.background || '#1f2937'}
                        onChange={(v) => updateStyles('author', 'dark', 'background', v)}
                      />
                      <ColorInput
                        label="Borde"
                        value={config.author?.styles?.dark?.border || '#374151'}
                        onChange={(v) => updateStyles('author', 'dark', 'border', v)}
                      />
                      <ColorInput
                        label="Color del nombre"
                        value={config.author?.styles?.dark?.nameColor || '#f9fafb'}
                        onChange={(v) => updateStyles('author', 'dark', 'nameColor', v)}
                      />
                      <ColorInput
                        label="Color de la biografía"
                        value={config.author?.styles?.dark?.bioColor || '#9ca3af'}
                        onChange={(v) => updateStyles('author', 'dark', 'bioColor', v)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-200 dark:border-gray-700 my-6" />

          {/* ====== ETIQUETAS/TAGS ====== */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              🏷️ Etiquetas/Tags
            </h4>
            <Toggle
              label="Mostrar sección de tags"
              checked={config.tags?.showSection ?? true}
              onChange={(v) => updateConfig('tags', 'showSection', v)}
            />
            
            {config.tags?.showSection !== false && (
              <>
                <RangeSlider
                  label="Máximo de tags visibles"
                  value={config.tags?.maxVisible ?? 5}
                  min={3}
                  max={10}
                  onChange={(v) => updateConfig('tags', 'maxVisible', v)}
                />

                {/* Estilos de las etiquetas */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">🎨 Estilos de las etiquetas</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tema Claro */}
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-yellow-50/50 dark:bg-gray-800/50">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                        <Sun className="w-3 h-3" /> Tema Claro
                      </p>
                      <div className="space-y-2">
                        <BackgroundColorInput
                          label="Fondo"
                          value={config.tags?.styles?.light?.background || '#e5e7eb'}
                          onChange={(v) => updateStyles('tags', 'light', 'background', v)}
                        />
                        <ColorInput
                          label="Color del texto"
                          value={config.tags?.styles?.light?.textColor || '#374151'}
                          onChange={(v) => updateStyles('tags', 'light', 'textColor', v)}
                        />
                        <ColorInput
                          label="Fondo hover"
                          value={config.tags?.styles?.light?.hoverBackground || '#d1d5db'}
                          onChange={(v) => updateStyles('tags', 'light', 'hoverBackground', v)}
                        />
                      </div>
                    </div>
                    {/* Tema Oscuro */}
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-slate-100/50 dark:bg-slate-800/50">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                        <Moon className="w-3 h-3" /> Tema Oscuro
                      </p>
                      <div className="space-y-2">
                        <BackgroundColorInput
                          label="Fondo"
                          value={config.tags?.styles?.dark?.background || '#374151'}
                          onChange={(v) => updateStyles('tags', 'dark', 'background', v)}
                        />
                        <ColorInput
                          label="Color del texto"
                          value={config.tags?.styles?.dark?.textColor || '#d1d5db'}
                          onChange={(v) => updateStyles('tags', 'dark', 'textColor', v)}
                        />
                        <ColorInput
                          label="Fondo hover"
                          value={config.tags?.styles?.dark?.hoverBackground || '#4b5563'}
                          onChange={(v) => updateStyles('tags', 'dark', 'hoverBackground', v)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vista previa de etiqueta */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                  <div className="flex gap-2 flex-wrap">
                    <span 
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
                      style={{
                        backgroundColor: config.tags?.styles?.light?.background || '#e5e7eb',
                        color: config.tags?.styles?.light?.textColor || '#374151'
                      }}
                    >
                      Etiqueta ejemplo
                    </span>
                    <span 
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
                      style={{
                        backgroundColor: config.tags?.styles?.dark?.background || '#374151',
                        color: config.tags?.styles?.dark?.textColor || '#d1d5db'
                      }}
                    >
                      Etiqueta oscura
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </SubSection>

        {/* Botones de compartir */}
        <SubSection title="Botones de Compartir" icon={<Share2 size={18} />} defaultOpen={false}>
          <Toggle
            label="Mostrar botones de compartir"
            checked={config.shareButtons?.enabled ?? true}
            onChange={(v) => updateConfig('shareButtons', 'enabled', v)}
          />

          {config.shareButtons?.enabled !== false && (
            <SelectField
              label="Posición"
              value={config.shareButtons?.position || 'sidebar'}
              options={[
                { value: 'sidebar', label: '📍 Barra lateral (junto al TOC)' },
                { value: 'bottom', label: '⬇️ Después del contenido' },
                { value: 'both', label: '📍⬇️ Ambas posiciones' }
              ]}
              onChange={(v) => updateConfig('shareButtons', 'position', v)}
            />
          )}
        </SubSection>
      </MainSection>

      {/* ============================================ */}
      {/* SECCIÓN 3: COMENTARIOS */}
      {/* ============================================ */}
      <MainSection
        number={3}
        title="Comentarios"
        description="Configura el sistema de comentarios del post"
        icon={<MessageSquare size={24} />}
        color="green"
      >
        <SubSection title="Configuración de comentarios" icon={<MessageSquare size={18} />}>
          <Toggle
            label="Habilitar comentarios"
            checked={config.comments?.enabled ?? true}
            onChange={(v) => updateConfig('comments', 'enabled', v)}
            description="Permite a los usuarios comentar en los artículos"
          />

          {config.comments?.enabled !== false && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <Toggle
                  label="Mostrar contador"
                  checked={config.comments?.showCount ?? true}
                  onChange={(v) => updateConfig('comments', 'showCount', v)}
                  description="Número de comentarios"
                />
                <Toggle
                  label="Permitir anónimos"
                  checked={config.comments?.allowAnonymous ?? false}
                  onChange={(v) => updateConfig('comments', 'allowAnonymous', v)}
                  description="Comentar sin cuenta"
                />
                <Toggle
                  label="Requiere moderación"
                  checked={config.comments?.moderationRequired ?? true}
                  onChange={(v) => updateConfig('comments', 'moderationRequired', v)}
                  description="Aprobar antes de publicar"
                />
              </div>

              <RangeSlider
                label="Profundidad de respuestas"
                value={config.comments?.maxDepth ?? 3}
                min={1}
                max={5}
                onChange={(v) => updateConfig('comments', 'maxDepth', v)}
                unit=" niveles"
              />

              <SelectField
                label="Forma del avatar"
                value={config.comments?.avatarShape || 'circle'}
                options={[
                  { value: 'circle', label: '⭕ Círculo' },
                  { value: 'square', label: '⬜ Cuadrado (bordes redondeados)' }
                ]}
                onChange={(v) => updateConfig('comments', 'avatarShape', v)}
              />

              <InputField
                label="Título de la sección"
                value={config.comments?.title || 'Comentarios'}
                onChange={(v) => updateConfig('comments', 'title', v)}
              />

              <SelectField
                label="Tipografía"
                value={config.comments?.fontFamily || 'Montserrat'}
                options={[
                  { value: 'Montserrat', label: 'Montserrat (por defecto)' },
                  { value: 'Inter', label: 'Inter' },
                  { value: 'Roboto', label: 'Roboto' },
                  { value: 'Open Sans', label: 'Open Sans' },
                  { value: 'Lato', label: 'Lato' },
                  { value: 'Poppins', label: 'Poppins' },
                  { value: 'Raleway', label: 'Raleway' },
                  { value: 'Nunito', label: 'Nunito' },
                  { value: 'PT Sans', label: 'PT Sans' },
                  { value: 'Merriweather', label: 'Merriweather' },
                  { value: 'Playfair Display', label: 'Playfair Display' },
                  { value: 'Georgia', label: 'Georgia' },
                  { value: 'Arial', label: 'Arial' },
                  { value: 'system-ui', label: 'System UI' }
                ]}
                onChange={(v) => updateConfig('comments', 'fontFamily', v)}
              />

              {/* Estilos de la sección de comentarios */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">🎨 Estilos de la sección</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tema Claro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-yellow-50/50 dark:bg-gray-800/50">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Tema Claro
                    </p>
                    <div className="space-y-2">
                      <BackgroundColorInput
                        label="Fondo sección"
                        value={config.comments?.styles?.light?.sectionBackground || '#ffffff'}
                        onChange={(v) => updateStyles('comments', 'light', 'sectionBackground', v)}
                      />
                      <ColorInput
                        label="Borde sección"
                        value={config.comments?.styles?.light?.sectionBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('comments', 'light', 'sectionBorder', v)}
                      />
                      <ColorInput
                        label="Color título"
                        value={config.comments?.styles?.light?.titleColor || '#111827'}
                        onChange={(v) => updateStyles('comments', 'light', 'titleColor', v)}
                      />
                      <ColorInput
                        label="Color icono título"
                        value={config.comments?.styles?.light?.iconColor || '#2563eb'}
                        onChange={(v) => updateStyles('comments', 'light', 'iconColor', v)}
                      />
                      <ColorInput
                        label="Color contador"
                        value={config.comments?.styles?.light?.countColor || '#9ca3af'}
                        onChange={(v) => updateStyles('comments', 'light', 'countColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo selector"
                        value={config.comments?.styles?.light?.selectorBackground || '#ffffff'}
                        onChange={(v) => updateStyles('comments', 'light', 'selectorBackground', v)}
                      />
                      <ColorInput
                        label="Borde selector"
                        value={config.comments?.styles?.light?.selectorBorder || '#d1d5db'}
                        onChange={(v) => updateStyles('comments', 'light', 'selectorBorder', v)}
                      />
                      <ColorInput
                        label="Texto selector"
                        value={config.comments?.styles?.light?.selectorText || '#111827'}
                        onChange={(v) => updateStyles('comments', 'light', 'selectorText', v)}
                      />
                      <ColorInput
                        label="Icono selector"
                        value={config.comments?.styles?.light?.selectorIconColor || '#9ca3af'}
                        onChange={(v) => updateStyles('comments', 'light', 'selectorIconColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo dropdown"
                        value={config.comments?.styles?.light?.selectorDropdownBg || '#ffffff'}
                        onChange={(v) => updateStyles('comments', 'light', 'selectorDropdownBg', v)}
                      />
                      <ColorInput
                        label="Hover opciones"
                        value={config.comments?.styles?.light?.selectorOptionHover || '#f3f4f6'}
                        onChange={(v) => updateStyles('comments', 'light', 'selectorOptionHover', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo tarjeta"
                        value={config.comments?.styles?.light?.cardBackground || '#f9fafb'}
                        onChange={(v) => updateStyles('comments', 'light', 'cardBackground', v)}
                      />
                      <ColorInput
                        label="Borde tarjeta"
                        value={config.comments?.styles?.light?.cardBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('comments', 'light', 'cardBorder', v)}
                      />
                      <ColorInput
                        label="Color autor"
                        value={config.comments?.styles?.light?.authorColor || '#1f2937'}
                        onChange={(v) => updateStyles('comments', 'light', 'authorColor', v)}
                      />
                      <ColorInput
                        label="Color texto"
                        value={config.comments?.styles?.light?.textColor || '#374151'}
                        onChange={(v) => updateStyles('comments', 'light', 'textColor', v)}
                      />
                      <ColorInput
                        label="Color fecha"
                        value={config.comments?.styles?.light?.dateColor || '#9ca3af'}
                        onChange={(v) => updateStyles('comments', 'light', 'dateColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo formulario"
                        value={config.comments?.styles?.light?.formBackground || '#ffffff'}
                        onChange={(v) => updateStyles('comments', 'light', 'formBackground', v)}
                      />
                      <ColorInput
                        label="Borde formulario"
                        value={config.comments?.styles?.light?.formBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('comments', 'light', 'formBorder', v)}
                      />
                      <ColorInput
                        label="Borde formulario (focus)"
                        value={config.comments?.styles?.light?.formFocusBorder || '#3b82f6'}
                        onChange={(v) => updateStyles('comments', 'light', 'formFocusBorder', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo textarea"
                        value={config.comments?.styles?.light?.textareaBackground || 'transparent'}
                        onChange={(v) => updateStyles('comments', 'light', 'textareaBackground', v)}
                      />
                      <ColorInput
                        label="Color texto textarea"
                        value={config.comments?.styles?.light?.textareaText || '#111827'}
                        onChange={(v) => updateStyles('comments', 'light', 'textareaText', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo barra inferior"
                        value={config.comments?.styles?.light?.footerBackground || '#f9fafb'}
                        onChange={(v) => updateStyles('comments', 'light', 'footerBackground', v)}
                      />
                      <BackgroundColorInput
                        label="Botón fondo"
                        value={config.comments?.styles?.light?.buttonBackground || '#3b82f6'}
                        onChange={(v) => updateStyles('comments', 'light', 'buttonBackground', v)}
                      />
                      <GradientColorInput
                        label="Botón borde"
                        value={config.comments?.styles?.light?.buttonBorder || ''}
                        onChange={(v) => updateStyles('comments', 'light', 'buttonBorder', v)}
                      />
                      <ColorInput
                        label="Botón texto"
                        value={config.comments?.styles?.light?.buttonText || '#ffffff'}
                        onChange={(v) => updateStyles('comments', 'light', 'buttonText', v)}
                      />
                    </div>
                  </div>

                  {/* Tema Oscuro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900/50">
                    <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Tema Oscuro
                    </p>
                    <div className="space-y-2">
                      <BackgroundColorInput
                        label="Fondo sección"
                        value={config.comments?.styles?.dark?.sectionBackground || '#1f2937'}
                        onChange={(v) => updateStyles('comments', 'dark', 'sectionBackground', v)}
                      />
                      <ColorInput
                        label="Borde sección"
                        value={config.comments?.styles?.dark?.sectionBorder || '#374151'}
                        onChange={(v) => updateStyles('comments', 'dark', 'sectionBorder', v)}
                      />
                      <ColorInput
                        label="Color título"
                        value={config.comments?.styles?.dark?.titleColor || '#f9fafb'}
                        onChange={(v) => updateStyles('comments', 'dark', 'titleColor', v)}
                      />
                      <ColorInput
                        label="Color icono título"
                        value={config.comments?.styles?.dark?.iconColor || '#60a5fa'}
                        onChange={(v) => updateStyles('comments', 'dark', 'iconColor', v)}
                      />
                      <ColorInput
                        label="Color contador"
                        value={config.comments?.styles?.dark?.countColor || '#6b7280'}
                        onChange={(v) => updateStyles('comments', 'dark', 'countColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo selector"
                        value={config.comments?.styles?.dark?.selectorBackground || '#374151'}
                        onChange={(v) => updateStyles('comments', 'dark', 'selectorBackground', v)}
                      />
                      <ColorInput
                        label="Borde selector"
                        value={config.comments?.styles?.dark?.selectorBorder || '#4b5563'}
                        onChange={(v) => updateStyles('comments', 'dark', 'selectorBorder', v)}
                      />
                      <ColorInput
                        label="Texto selector"
                        value={config.comments?.styles?.dark?.selectorText || '#f9fafb'}
                        onChange={(v) => updateStyles('comments', 'dark', 'selectorText', v)}
                      />
                      <ColorInput
                        label="Icono selector"
                        value={config.comments?.styles?.dark?.selectorIconColor || '#6b7280'}
                        onChange={(v) => updateStyles('comments', 'dark', 'selectorIconColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo dropdown"
                        value={config.comments?.styles?.dark?.selectorDropdownBg || '#374151'}
                        onChange={(v) => updateStyles('comments', 'dark', 'selectorDropdownBg', v)}
                      />
                      <ColorInput
                        label="Hover opciones"
                        value={config.comments?.styles?.dark?.selectorOptionHover || '#4b5563'}
                        onChange={(v) => updateStyles('comments', 'dark', 'selectorOptionHover', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo tarjeta"
                        value={config.comments?.styles?.dark?.cardBackground || '#111827'}
                        onChange={(v) => updateStyles('comments', 'dark', 'cardBackground', v)}
                      />
                      <ColorInput
                        label="Borde tarjeta"
                        value={config.comments?.styles?.dark?.cardBorder || '#374151'}
                        onChange={(v) => updateStyles('comments', 'dark', 'cardBorder', v)}
                      />
                      <ColorInput
                        label="Color autor"
                        value={config.comments?.styles?.dark?.authorColor || '#f9fafb'}
                        onChange={(v) => updateStyles('comments', 'dark', 'authorColor', v)}
                      />
                      <ColorInput
                        label="Color texto"
                        value={config.comments?.styles?.dark?.textColor || '#d1d5db'}
                        onChange={(v) => updateStyles('comments', 'dark', 'textColor', v)}
                      />
                      <ColorInput
                        label="Color fecha"
                        value={config.comments?.styles?.dark?.dateColor || '#6b7280'}
                        onChange={(v) => updateStyles('comments', 'dark', 'dateColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo formulario"
                        value={config.comments?.styles?.dark?.formBackground || '#1f2937'}
                        onChange={(v) => updateStyles('comments', 'dark', 'formBackground', v)}
                      />
                      <ColorInput
                        label="Borde formulario"
                        value={config.comments?.styles?.dark?.formBorder || '#374151'}
                        onChange={(v) => updateStyles('comments', 'dark', 'formBorder', v)}
                      />
                      <ColorInput
                        label="Borde formulario (focus)"
                        value={config.comments?.styles?.dark?.formFocusBorder || '#3b82f6'}
                        onChange={(v) => updateStyles('comments', 'dark', 'formFocusBorder', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo textarea"
                        value={config.comments?.styles?.dark?.textareaBackground || 'transparent'}
                        onChange={(v) => updateStyles('comments', 'dark', 'textareaBackground', v)}
                      />
                      <ColorInput
                        label="Color texto textarea"
                        value={config.comments?.styles?.dark?.textareaText || '#f9fafb'}
                        onChange={(v) => updateStyles('comments', 'dark', 'textareaText', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo barra inferior"
                        value={config.comments?.styles?.dark?.footerBackground || '#374151'}
                        onChange={(v) => updateStyles('comments', 'dark', 'footerBackground', v)}
                      />
                      <BackgroundColorInput
                        label="Botón fondo"
                        value={config.comments?.styles?.dark?.buttonBackground || '#2563eb'}
                        onChange={(v) => updateStyles('comments', 'dark', 'buttonBackground', v)}
                      />
                      <GradientColorInput
                        label="Botón borde"
                        value={config.comments?.styles?.dark?.buttonBorder || ''}
                        onChange={(v) => updateStyles('comments', 'dark', 'buttonBorder', v)}
                      />
                      <ColorInput
                        label="Botón texto"
                        value={config.comments?.styles?.dark?.buttonText || '#ffffff'}
                        onChange={(v) => updateStyles('comments', 'dark', 'buttonText', v)}
                      />
                    </div>
                  </div>
                </div>

                {/* Vista previa de comentario */}
                <div className="mt-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">👁️ Vista previa</p>
                  <div className="flex gap-3 p-3 rounded-lg" style={{
                    backgroundColor: config.comments?.styles?.dark?.cardBackground || '#111827',
                    borderColor: config.comments?.styles?.dark?.cardBorder || '#374151',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}>
                    <div className={`w-10 h-10 ${config.comments?.avatarShape === 'square' ? 'rounded-lg' : 'rounded-full'} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold`}>
                      J
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm" style={{ color: config.comments?.styles?.dark?.authorColor || '#f9fafb' }}>
                          Juan Pérez
                        </span>
                        <span className="text-xs" style={{ color: config.comments?.styles?.dark?.dateColor || '#6b7280' }}>
                          hace 2 horas
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: config.comments?.styles?.dark?.textColor || '#d1d5db' }}>
                        ¡Excelente artículo! Muy útil la información.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SubSection>
      </MainSection>

      {/* ============================================ */}
      {/* SECCIÓN 4: RELACIONADOS + NAVEGACIÓN */}
      {/* ============================================ */}
      <MainSection
        number={4}
        title="Relacionados + Navegación"
        description="Configura los artículos relacionados y navegación entre posts"
        icon={<Layout size={24} />}
        color="orange"
      >
        {/* Posts Relacionados */}
        <SubSection title="Artículos Relacionados" icon={<Layout size={18} />}>
          <Toggle
            label="Mostrar artículos relacionados"
            checked={config.relatedPosts?.enabled ?? true}
            onChange={(v) => updateConfig('relatedPosts', 'enabled', v)}
            description="Sugerencias basadas en categoría y tags"
          />

          {config.relatedPosts?.enabled !== false && (
            <>
              <InputField
                label="Título de la sección"
                value={config.relatedPosts?.title || 'Artículos Relacionados'}
                onChange={(v) => updateConfig('relatedPosts', 'title', v)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RangeSlider
                  label="Número de artículos"
                  value={config.relatedPosts?.maxPosts ?? 4}
                  min={2}
                  max={8}
                  onChange={(v) => updateConfig('relatedPosts', 'maxPosts', v)}
                />
                <SelectField
                  label="Diseño"
                  value={config.relatedPosts?.layout || 'grid'}
                  options={[
                    { value: 'grid', label: '📊 Cuadrícula' },
                    { value: 'carousel', label: '🎠 Carrusel' }
                  ]}
                  onChange={(v) => updateConfig('relatedPosts', 'layout', v)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <Toggle
                  label="Mostrar enlace a categoría"
                  checked={config.relatedPosts?.showCategoryLink ?? true}
                  onChange={(v) => updateConfig('relatedPosts', 'showCategoryLink', v)}
                />
                <Toggle
                  label="Mostrar botón explorar"
                  checked={config.relatedPosts?.showExploreButton ?? true}
                  onChange={(v) => updateConfig('relatedPosts', 'showExploreButton', v)}
                />
              </div>

              {/* Estilos de artículos relacionados */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">🎨 Estilos de la sección</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tema Claro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-yellow-50/50 dark:bg-gray-800/50">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Tema Claro
                    </p>
                    <div className="space-y-2">
                      <ColorInput
                        label="Fondo sección"
                        value={config.relatedPosts?.styles?.light?.sectionBackground || '#ffffff'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'sectionBackground', v)}
                      />
                      <ColorInput
                        label="Borde sección"
                        value={config.relatedPosts?.styles?.light?.sectionBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'sectionBorder', v)}
                      />
                      <ColorInput
                        label="Color icono"
                        value={config.relatedPosts?.styles?.light?.iconColor || '#2563eb'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'iconColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo tarjeta"
                        value={config.relatedPosts?.styles?.light?.cardBackground || '#f9fafb'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'cardBackground', v)}
                      />
                      <ColorInput
                        label="Borde tarjeta"
                        value={config.relatedPosts?.styles?.light?.cardBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'cardBorder', v)}
                      />
                      <ColorInput
                        label="Título tarjeta"
                        value={config.relatedPosts?.styles?.light?.cardTitleColor || '#ffffff'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'cardTitleColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo categoría"
                        value={config.relatedPosts?.styles?.light?.cardCategoryBackground || '#2563eb'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'cardCategoryBackground', v)}
                      />
                      <GradientColorInput
                        label="Borde categoría"
                        value={config.relatedPosts?.styles?.light?.cardCategoryBorder || ''}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'cardCategoryBorder', v)}
                      />
                      <ColorInput
                        label="Texto categoría"
                        value={config.relatedPosts?.styles?.light?.cardCategoryText || '#ffffff'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'cardCategoryText', v)}
                      />
                      <ColorInput
                        label="Color fecha"
                        value={config.relatedPosts?.styles?.light?.cardDateColor || '#d1d5db'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'cardDateColor', v)}
                      />
                      <ColorInput
                        label="Color título"
                        value={config.relatedPosts?.styles?.light?.titleColor || '#1f2937'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'titleColor', v)}
                      />
                      <BackgroundColorInput
                        label="Botón fondo"
                        value={config.relatedPosts?.styles?.light?.buttonBackground || '#2563eb'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'buttonBackground', v)}
                      />
                      <GradientColorInput
                        label="Botón borde"
                        value={config.relatedPosts?.styles?.light?.buttonBorder || ''}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'buttonBorder', v)}
                      />
                      <ColorInput
                        label="Botón texto"
                        value={config.relatedPosts?.styles?.light?.buttonText || '#ffffff'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'buttonText', v)}
                      />
                      <ColorInput
                        label="Color enlaces"
                        value={config.relatedPosts?.styles?.light?.linkColor || '#2563eb'}
                        onChange={(v) => updateStyles('relatedPosts', 'light', 'linkColor', v)}
                      />
                    </div>
                  </div>

                  {/* Tema Oscuro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900/50">
                    <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Tema Oscuro
                    </p>
                    <div className="space-y-2">
                      <ColorInput
                        label="Fondo sección"
                        value={config.relatedPosts?.styles?.dark?.sectionBackground || '#1f2937'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'sectionBackground', v)}
                      />
                      <ColorInput
                        label="Borde sección"
                        value={config.relatedPosts?.styles?.dark?.sectionBorder || '#374151'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'sectionBorder', v)}
                      />
                      <ColorInput
                        label="Color icono"
                        value={config.relatedPosts?.styles?.dark?.iconColor || '#60a5fa'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'iconColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo tarjeta"
                        value={config.relatedPosts?.styles?.dark?.cardBackground || '#111827'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardBackground', v)}
                      />
                      <ColorInput
                        label="Borde tarjeta"
                        value={config.relatedPosts?.styles?.dark?.cardBorder || '#374151'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardBorder', v)}
                      />
                      <ColorInput
                        label="Título tarjeta"
                        value={config.relatedPosts?.styles?.dark?.cardTitleColor || '#ffffff'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardTitleColor', v)}
                      />
                      <BackgroundColorInput
                        label="Fondo categoría"
                        value={config.relatedPosts?.styles?.dark?.cardCategoryBackground || '#3b82f6'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardCategoryBackground', v)}
                      />
                      <GradientColorInput
                        label="Borde categoría"
                        value={config.relatedPosts?.styles?.dark?.cardCategoryBorder || ''}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardCategoryBorder', v)}
                      />
                      <ColorInput
                        label="Texto categoría"
                        value={config.relatedPosts?.styles?.dark?.cardCategoryText || '#ffffff'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardCategoryText', v)}
                      />
                      <ColorInput
                        label="Color fecha"
                        value={config.relatedPosts?.styles?.dark?.cardDateColor || '#9ca3af'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'cardDateColor', v)}
                      />
                      <ColorInput
                        label="Color título"
                        value={config.relatedPosts?.styles?.dark?.titleColor || '#f9fafb'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'titleColor', v)}
                      />
                      <BackgroundColorInput
                        label="Botón fondo"
                        value={config.relatedPosts?.styles?.dark?.buttonBackground || '#1d4ed8'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'buttonBackground', v)}
                      />
                      <GradientColorInput
                        label="Botón borde"
                        value={config.relatedPosts?.styles?.dark?.buttonBorder || ''}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'buttonBorder', v)}
                      />
                      <ColorInput
                        label="Botón texto"
                        value={config.relatedPosts?.styles?.dark?.buttonText || '#ffffff'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'buttonText', v)}
                      />
                      <ColorInput
                        label="Color enlaces"
                        value={config.relatedPosts?.styles?.dark?.linkColor || '#60a5fa'}
                        onChange={(v) => updateStyles('relatedPosts', 'dark', 'linkColor', v)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SubSection>

        {/* Navegación */}
        <SubSection title="Navegación entre Posts" icon={<ChevronRight size={18} />}>
          <Toggle
            label="Mostrar navegación"
            checked={config.navigation?.enabled ?? true}
            onChange={(v) => updateConfig('navigation', 'enabled', v)}
            description="Botones de anterior/siguiente artículo"
          />

          {config.navigation?.enabled !== false && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <Toggle
                  label="Mostrar Anterior/Siguiente"
                  checked={config.navigation?.showPrevNext ?? true}
                  onChange={(v) => updateConfig('navigation', 'showPrevNext', v)}
                />
                <Toggle
                  label="Mostrar miniaturas"
                  checked={config.navigation?.showThumbnails ?? false}
                  onChange={(v) => updateConfig('navigation', 'showThumbnails', v)}
                />
                <Toggle
                  label="Mostrar tarjeta vacía"
                  checked={config.navigation?.showEmptyCard ?? false}
                  onChange={(v) => updateConfig('navigation', 'showEmptyCard', v)}
                  description="Mostrar cuando no hay artículo"
                />
              </div>

              {/* Estilos de navegación */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">🎨 Estilos de la sección</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tema Claro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-yellow-50/50 dark:bg-gray-800/50">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Tema Claro
                    </p>
                    <div className="space-y-2">
                      <ColorInput
                        label="Fondo sección"
                        value={config.navigation?.styles?.light?.sectionBackground || '#ffffff'}
                        onChange={(v) => updateStyles('navigation', 'light', 'sectionBackground', v)}
                      />
                      <ColorInput
                        label="Borde sección"
                        value={config.navigation?.styles?.light?.sectionBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('navigation', 'light', 'sectionBorder', v)}
                      />
                      <ColorInput
                        label="Color título"
                        value={config.navigation?.styles?.light?.titleColor || '#111827'}
                        onChange={(v) => updateStyles('navigation', 'light', 'titleColor', v)}
                      />
                      <GradientColorInput
                        label="Indicador título"
                        value={config.navigation?.styles?.light?.indicatorColor || '#2563eb'}
                        onChange={(v) => updateStyles('navigation', 'light', 'indicatorColor', v)}
                      />
                      <ColorInput
                        label="Fondo tarjeta"
                        value={config.navigation?.styles?.light?.cardBackground || '#ffffff'}
                        onChange={(v) => updateStyles('navigation', 'light', 'cardBackground', v)}
                      />
                      <ColorInput
                        label="Borde tarjeta"
                        value={config.navigation?.styles?.light?.cardBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('navigation', 'light', 'cardBorder', v)}
                      />
                      <ColorInput
                        label="Borde hover"
                        value={config.navigation?.styles?.light?.cardHoverBorder || '#93c5fd'}
                        onChange={(v) => updateStyles('navigation', 'light', 'cardHoverBorder', v)}
                      />
                      <ColorInput
                        label="Fondo hover"
                        value={config.navigation?.styles?.light?.cardHoverBackground || '#eff6ff'}
                        onChange={(v) => updateStyles('navigation', 'light', 'cardHoverBackground', v)}
                      />
                      <ColorInput
                        label="Etiqueta (Anterior/Siguiente)"
                        value={config.navigation?.styles?.light?.labelColor || '#2563eb'}
                        onChange={(v) => updateStyles('navigation', 'light', 'labelColor', v)}
                      />
                      <ColorInput
                        label="Título del post"
                        value={config.navigation?.styles?.light?.postTitleColor || '#111827'}
                        onChange={(v) => updateStyles('navigation', 'light', 'postTitleColor', v)}
                      />
                      <ColorInput
                        label="Extracto"
                        value={config.navigation?.styles?.light?.excerptColor || '#4b5563'}
                        onChange={(v) => updateStyles('navigation', 'light', 'excerptColor', v)}
                      />
                      <ColorInput
                        label="Metadatos"
                        value={config.navigation?.styles?.light?.metaColor || '#6b7280'}
                        onChange={(v) => updateStyles('navigation', 'light', 'metaColor', v)}
                      />
                      <ColorInput
                        label="Color iconos"
                        value={config.navigation?.styles?.light?.iconColor || '#9ca3af'}
                        onChange={(v) => updateStyles('navigation', 'light', 'iconColor', v)}
                      />
                      <ColorInput
                        label="Borde imagen"
                        value={config.navigation?.styles?.light?.imageBorder || '#e5e7eb'}
                        onChange={(v) => updateStyles('navigation', 'light', 'imageBorder', v)}
                      />
                    </div>
                  </div>

                  {/* Tema Oscuro */}
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900/50 dark:bg-gray-900/80">
                    <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Tema Oscuro
                    </p>
                    <div className="space-y-2">
                      <ColorInput
                        label="Fondo sección"
                        value={config.navigation?.styles?.dark?.sectionBackground || '#1f2937'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'sectionBackground', v)}
                      />
                      <ColorInput
                        label="Borde sección"
                        value={config.navigation?.styles?.dark?.sectionBorder || '#374151'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'sectionBorder', v)}
                      />
                      <ColorInput
                        label="Color título"
                        value={config.navigation?.styles?.dark?.titleColor || '#ffffff'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'titleColor', v)}
                      />
                      <GradientColorInput
                        label="Indicador título"
                        value={config.navigation?.styles?.dark?.indicatorColor || '#3b82f6'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'indicatorColor', v)}
                      />
                      <ColorInput
                        label="Fondo tarjeta"
                        value={config.navigation?.styles?.dark?.cardBackground || '#1f2937'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'cardBackground', v)}
                      />
                      <ColorInput
                        label="Borde tarjeta"
                        value={config.navigation?.styles?.dark?.cardBorder || '#4b5563'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'cardBorder', v)}
                      />
                      <ColorInput
                        label="Borde hover"
                        value={config.navigation?.styles?.dark?.cardHoverBorder || '#2563eb'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'cardHoverBorder', v)}
                      />
                      <ColorInput
                        label="Fondo hover"
                        value={config.navigation?.styles?.dark?.cardHoverBackground || 'rgba(30, 58, 138, 0.1)'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'cardHoverBackground', v)}
                      />
                      <ColorInput
                        label="Etiqueta (Anterior/Siguiente)"
                        value={config.navigation?.styles?.dark?.labelColor || '#60a5fa'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'labelColor', v)}
                      />
                      <ColorInput
                        label="Título del post"
                        value={config.navigation?.styles?.dark?.postTitleColor || '#ffffff'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'postTitleColor', v)}
                      />
                      <ColorInput
                        label="Extracto"
                        value={config.navigation?.styles?.dark?.excerptColor || '#9ca3af'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'excerptColor', v)}
                      />
                      <ColorInput
                        label="Metadatos"
                        value={config.navigation?.styles?.dark?.metaColor || '#9ca3af'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'metaColor', v)}
                      />
                      <ColorInput
                        label="Color iconos"
                        value={config.navigation?.styles?.dark?.iconColor || '#9ca3af'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'iconColor', v)}
                      />
                      <ColorInput
                        label="Borde imagen"
                        value={config.navigation?.styles?.dark?.imageBorder || '#4b5563'}
                        onChange={(v) => updateStyles('navigation', 'dark', 'imageBorder', v)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SubSection>
      </MainSection>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Eye size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Vista Previa en Tiempo Real</h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              Los cambios se aplicarán automáticamente a todos los artículos del blog.
              Abre cualquier post en otra pestaña para ver los cambios al guardar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetailConfigSection;
