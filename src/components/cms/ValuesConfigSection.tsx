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

interface ValueItem {
  title: string;
  description: string;
  image?: {
    light?: string;
    dark?: string;
  };
  imageAlt?: string;
  imageOpacity?: number;
}

interface ValuesContent {
  title: string;
  subtitle?: string;
  fontFamily?: string;
  items: ValueItem[];
  carouselConfig?: {
    itemsPerView?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
  // Configuración de imagen de fondo
  backgroundImage?: string | {
    light?: string;
    dark?: string;
  };
  backgroundOpacity?: number;
  backgroundOverlay?: boolean;
  // Configuración de tamaño de tarjetas
  cardWidth?: string;
  cardHeight?: string;
  // Configuración de colores de tarjetas
  cardBgColor?: string;
  cardBgColorDark?: string;
  cardBorderColor?: string;
  cardBorderColorDark?: string;
  cardTitleColor?: string;
  cardTitleColorDark?: string;
  cardTextColor?: string;
  cardTextColorDark?: string;
  cardImageOpacity?: number;
  // Configuración de fondo transparente
  cardBgTransparent?: boolean;
  cardBgTransparentDark?: boolean;
  // Configuración de gradiente para fondo de tarjetas
  cardBgUseGradient?: boolean;
  cardBgGradientFrom?: string;
  cardBgGradientTo?: string;
  cardBgGradientDirection?: string;
  cardBgUseGradientDark?: boolean;
  cardBgGradientFromDark?: string;
  cardBgGradientToDark?: string;
  cardBgGradientDirectionDark?: string;
  // Toggle para overlay oscuro en tarjetas con imagen
  cardImageOverlay?: boolean;
  // Configuración de gradiente para BORDE de tarjetas
  cardBorderUseGradient?: boolean;
  cardBorderGradientFrom?: string;
  cardBorderGradientTo?: string;
  cardBorderGradientDirection?: string;
  cardBorderUseGradientDark?: boolean;
  cardBorderGradientFromDark?: string;
  cardBorderGradientToDark?: string;
  cardBorderGradientDirectionDark?: string;
  // Configuración de gradiente para TÍTULO de tarjetas
  cardTitleUseGradient?: boolean;
  cardTitleGradientFrom?: string;
  cardTitleGradientTo?: string;
  cardTitleGradientDirection?: string;
  cardTitleUseGradientDark?: boolean;
  cardTitleGradientFromDark?: string;
  cardTitleGradientToDark?: string;
  cardTitleGradientDirectionDark?: string;
  // Configuración de colores para TÍTULO DE LA SECCIÓN
  sectionTitleColor?: string;
  sectionTitleColorDark?: string;
  sectionTitleUseGradient?: boolean;
  sectionTitleGradientFrom?: string;
  sectionTitleGradientTo?: string;
  sectionTitleGradientDirection?: string;
  sectionTitleUseGradientDark?: boolean;
  sectionTitleGradientFromDark?: string;
  sectionTitleGradientToDark?: string;
  sectionTitleGradientDirectionDark?: string;
  // Configuración de colores para SUBTÍTULO DE LA SECCIÓN
  sectionSubtitleColor?: string;
  sectionSubtitleColorDark?: string;
}

interface ValuesConfigSectionProps {
  pageData: any;
  updateContent: (field: string, value: any) => void;
}

// 🆕 Interface para items de "¿Por qué elegirnos?"
interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseUsContent {
  title: string;
  subtitle?: string;
  items: WhyChooseUsItem[];
}

const ValuesConfigSection: React.FC<ValuesConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const values: ValuesContent = pageData?.content?.values || { title: '', items: [] };
  const whyChooseUs: WhyChooseUsContent = pageData?.content?.whyChooseUs || { title: '', items: [] }; // 🆕
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedWhyChooseUs, setCollapsedWhyChooseUs] = useState(true); // 🆕
  const [expandedValue, setExpandedValue] = useState<number | null>(null);
  const [imageTheme, setImageTheme] = useState<'light' | 'dark'>('light');

  // Actualizar un valor específico
  const updateValue = (index: number, field: string, value: any) => {
    const newItems = [...(values.items || [])];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newItems[index] = {
        ...newItems[index],
        [parent]: {
          ...(newItems[index] as any)?.[parent],
          [child]: value
        }
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    updateContent('values.items', newItems);
  };

  // Agregar nuevo valor
  const addValue = () => {
    const newItems = [...(values.items || []), {
      title: 'Nuevo Valor',
      description: 'Descripción del valor',
      image: { light: '', dark: '' },
      imageAlt: ''
    }];
    updateContent('values.items', newItems);
  };

  // Eliminar valor
  const removeValue = (index: number) => {
    if (!values.items) return;
    const newItems = values.items.filter((_, i) => i !== index);
    updateContent('values.items', newItems);
  };

  // Mover valor hacia arriba
  const moveValueUp = (index: number) => {
    if (!values.items || index === 0) return;
    const newItems = [...values.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    updateContent('values.items', newItems);
  };

  // Mover valor hacia abajo
  const moveValueDown = (index: number) => {
    if (!values.items || index === values.items.length - 1) return;
    const newItems = [...values.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    updateContent('values.items', newItems);
  };

  // 🆕 FUNCIONES PARA "¿POR QUÉ ELEGIRNOS?"
  // Actualizar un item de whyChooseUs
  const updateWhyChooseUsItem = (index: number, field: string, value: any) => {
    const newItems = [...(whyChooseUs.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateContent('whyChooseUs.items', newItems);
  };

  // Agregar nuevo item a whyChooseUs
  const addWhyChooseUsItem = () => {
    const newItems = [...(whyChooseUs.items || []), {
      icon: '✅',
      title: 'Nuevo beneficio',
      description: 'Descripción del beneficio...'
    }];
    updateContent('whyChooseUs.items', newItems);
  };

  // Eliminar item de whyChooseUs
  const removeWhyChooseUsItem = (index: number) => {
    if (!whyChooseUs.items) return;
    const newItems = whyChooseUs.items.filter((_, i) => i !== index);
    updateContent('whyChooseUs.items', newItems);
  };

  // Mover item hacia arriba
  const moveWhyChooseUsItemUp = (index: number) => {
    if (!whyChooseUs.items || index === 0) return;
    const newItems = [...whyChooseUs.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    updateContent('whyChooseUs.items', newItems);
  };

  // Mover item hacia abajo
  const moveWhyChooseUsItemDown = (index: number) => {
    if (!whyChooseUs.items || index === whyChooseUs.items.length - 1) return;
    const newItems = [...whyChooseUs.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    updateContent('whyChooseUs.items', newItems);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="values-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center gap-2">
          ⭐ Configuración de Valores
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="values-section-content" className="space-y-8">
          {/* 🌟 ENCABEZADO DE VALORES */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-amber-200 dark:border-gray-700/50">

        <div className="space-y-6">
          {/* Título de la sección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título de la Sección
            </label>
            <input
              type="text"
              value={values.title || ''}
              onChange={(e) => updateContent('values.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ej: Nuestros Valores"
            />
          </div>

          {/* Subtítulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtítulo (opcional)
            </label>
            <input
              type="text"
              value={values.subtitle || ''}
              onChange={(e) => updateContent('values.subtitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ej: Los principios que nos guían"
            />
          </div>

          {/* Tipografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔤 Tipografía de la Sección
            </label>
            <select
              value={values.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('values.fontFamily', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: values.fontFamily || 'Montserrat' }}
            >
              {AVAILABLE_FONTS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Esta tipografía se aplicará al título, subtítulo y contenido de las tarjetas de valores
            </p>
          </div>
        </div>
      </div>

      {/* 🎨 COLORES DEL TÍTULO DE LA SECCIÓN */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-cyan-200 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
          🎨 Colores del Título de Sección
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Personaliza los colores del título y subtítulo de la sección "Nuestros Valores".
        </p>

        {/* Colores de título de sección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ☀️ Color Título (Tema Claro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.sectionTitleColor || '#111827'}
                onChange={(e) => updateContent('values.sectionTitleColor', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                disabled={values.sectionTitleUseGradient}
              />
              <input
                type="text"
                value={values.sectionTitleColor || '#111827'}
                onChange={(e) => updateContent('values.sectionTitleColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                disabled={values.sectionTitleUseGradient}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🌙 Color Título (Tema Oscuro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.sectionTitleColorDark || '#ffffff'}
                onChange={(e) => updateContent('values.sectionTitleColorDark', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                disabled={values.sectionTitleUseGradientDark}
              />
              <input
                type="text"
                value={values.sectionTitleColorDark || '#ffffff'}
                onChange={(e) => updateContent('values.sectionTitleColorDark', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                disabled={values.sectionTitleUseGradientDark}
              />
            </div>
          </div>
        </div>

        {/* 🌈 Gradiente para TÍTULO de sección */}
        <div className="bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🌈 Título con Gradiente</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle Gradiente - Tema Claro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.sectionTitleUseGradient || false}
                    onChange={(e) => updateContent('values.sectionTitleUseGradient', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-teal-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">☀️ Usar Gradiente (Claro)</span>
              </div>
              
              {values.sectionTitleUseGradient && (
                <div className="space-y-3 pl-4 border-l-2 border-teal-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.sectionTitleGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.sectionTitleGradientFrom', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.sectionTitleGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.sectionTitleGradientFrom', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.sectionTitleGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.sectionTitleGradientTo', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.sectionTitleGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.sectionTitleGradientTo', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.sectionTitleGradientDirection || 'to-r'}
                      onChange={(e) => updateContent('values.sectionTitleGradientDirection', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                    </select>
                  </div>
                  {/* Preview */}
                  <div 
                    className="h-8 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{
                      background: `linear-gradient(to right, ${values.sectionTitleGradientFrom || '#667eea'}, ${values.sectionTitleGradientTo || '#764ba2'})`
                    }}
                  >
                    {values.title || 'Nuestros Valores'}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Gradiente - Tema Oscuro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.sectionTitleUseGradientDark || false}
                    onChange={(e) => updateContent('values.sectionTitleUseGradientDark', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-teal-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌙 Usar Gradiente (Oscuro)</span>
              </div>
              
              {values.sectionTitleUseGradientDark && (
                <div className="space-y-3 pl-4 border-l-2 border-teal-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.sectionTitleGradientFromDark || '#8b5cf6'}
                      onChange={(e) => updateContent('values.sectionTitleGradientFromDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.sectionTitleGradientFromDark || '#8b5cf6'}
                      onChange={(e) => updateContent('values.sectionTitleGradientFromDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.sectionTitleGradientToDark || '#06b6d4'}
                      onChange={(e) => updateContent('values.sectionTitleGradientToDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.sectionTitleGradientToDark || '#06b6d4'}
                      onChange={(e) => updateContent('values.sectionTitleGradientToDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.sectionTitleGradientDirectionDark || 'to-r'}
                      onChange={(e) => updateContent('values.sectionTitleGradientDirectionDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                    </select>
                  </div>
                  {/* Preview */}
                  <div 
                    className="h-8 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{
                      background: `linear-gradient(to right, ${values.sectionTitleGradientFromDark || '#8b5cf6'}, ${values.sectionTitleGradientToDark || '#06b6d4'})`
                    }}
                  >
                    {values.title || 'Nuestros Valores'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colores de subtítulo de sección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ☀️ Color Subtítulo (Tema Claro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.sectionSubtitleColor || '#6b7280'}
                onChange={(e) => updateContent('values.sectionSubtitleColor', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.sectionSubtitleColor || '#6b7280'}
                onChange={(e) => updateContent('values.sectionSubtitleColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🌙 Color Subtítulo (Tema Oscuro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.sectionSubtitleColorDark || '#9ca3af'}
                onChange={(e) => updateContent('values.sectionSubtitleColorDark', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.sectionSubtitleColorDark || '#9ca3af'}
                onChange={(e) => updateContent('values.sectionSubtitleColorDark', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ⚙️ CONFIGURACIÓN DEL CARRUSEL */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-6">
          🎠 Configuración del Carrusel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items por vista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Items visibles (Desktop)
            </label>
            <select
              value={values.carouselConfig?.itemsPerView || 3}
              onChange={(e) => updateContent('values.carouselConfig.itemsPerView', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={2}>2 items</option>
              <option value={3}>3 items</option>
              <option value={4}>4 items</option>
            </select>
          </div>

          {/* Autoplay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reproducción automática
            </label>
            <div className="flex items-center gap-3 mt-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.carouselConfig?.autoplay || false}
                  onChange={(e) => updateContent('values.carouselConfig.autoplay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {values.carouselConfig?.autoplay ? 'Activado' : 'Desactivado'}
                </span>
              </label>
            </div>
          </div>

          {/* Velocidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Velocidad (segundos)
            </label>
            <input
              type="number"
              min={2}
              max={10}
              value={values.carouselConfig?.autoplaySpeed || 5}
              onChange={(e) => updateContent('values.carouselConfig.autoplaySpeed', parseInt(e.target.value))}
              disabled={!values.carouselConfig?.autoplay}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* 📐 CONFIGURACIÓN DE TAMAÑO DE TARJETAS */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-teal-200 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
          📐 Tamaño de las Tarjetas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Configura el ancho y alto de las tarjetas de valores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alto de la tarjeta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alto de la tarjeta
            </label>
            <select
              value={values.cardHeight || '340px'}
              onChange={(e) => updateContent('values.cardHeight', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="280px">Pequeño (280px)</option>
              <option value="340px">Mediano (340px)</option>
              <option value="400px">Grande (400px)</option>
              <option value="460px">Extra Grande (460px)</option>
              <option value="auto">Automático</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Define la altura mínima de las tarjetas
            </p>
          </div>

          {/* Ancho de la tarjeta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ancho de la tarjeta
            </label>
            <select
              value={values.cardWidth || '100%'}
              onChange={(e) => updateContent('values.cardWidth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="100%">Completo (100%)</option>
              <option value="320px">Pequeño (320px)</option>
              <option value="380px">Mediano (380px)</option>
              <option value="440px">Grande (440px)</option>
              <option value="auto">Automático</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Define el ancho máximo de las tarjetas
            </p>
          </div>
        </div>

        {/* Vista previa del tamaño */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa del tamaño:</p>
          <div 
            className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-lg mx-auto flex items-center justify-center text-white font-medium"
            style={{
              width: values.cardWidth === '100%' ? '200px' : `min(${values.cardWidth || '200px'}, 200px)`,
              height: values.cardHeight === 'auto' ? '100px' : `min(calc(${values.cardHeight || '340px'} / 2), 150px)`,
              minHeight: '80px'
            }}
          >
            <span className="text-sm">
              {values.cardWidth || '100%'} × {values.cardHeight || '340px'}
            </span>
          </div>
        </div>
      </div>

      {/* 🎨 CONFIGURACIÓN DE COLORES DE TARJETAS */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-pink-200 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
          🎨 Colores de las Tarjetas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Personaliza los colores de fondo, borde, título y texto de las tarjetas.
        </p>

        {/* 🎨 Configuración de Fondo Unificada */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            🖼️ Fondo de Tarjetas
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tema Claro */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">☀️ Tema Claro</span>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.cardBgTransparent || false}
                      onChange={(e) => updateContent('values.cardBgTransparent', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-cyan-500"></div>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Transparente</span>
                </div>
              </div>
              
              {/* Selector de color - solo si NO es transparente */}
              {!values.cardBgTransparent && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={values.cardBgColor || '#ffffff'}
                    onChange={(e) => updateContent('values.cardBgColor', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                    disabled={values.cardBgUseGradient}
                  />
                  <input
                    type="text"
                    value={values.cardBgColor || 'rgba(255, 255, 255, 0.8)'}
                    onChange={(e) => updateContent('values.cardBgColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    placeholder="rgba(255, 255, 255, 0.8)"
                    disabled={values.cardBgUseGradient}
                  />
                </div>
              )}
              
              {/* Mensaje cuando es transparente */}
              {values.cardBgTransparent && (
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700 rounded-lg">
                  <p className="text-xs text-cyan-700 dark:text-cyan-300">
                    ✨ El fondo será completamente transparente, mostrando el fondo de la sección.
                  </p>
                </div>
              )}
            </div>
            
            {/* Tema Oscuro */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌙 Tema Oscuro</span>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.cardBgTransparentDark || false}
                      onChange={(e) => updateContent('values.cardBgTransparentDark', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-cyan-500"></div>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Transparente</span>
                </div>
              </div>
              
              {/* Selector de color - solo si NO es transparente */}
              {!values.cardBgTransparentDark && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={values.cardBgColorDark || '#1f2937'}
                    onChange={(e) => updateContent('values.cardBgColorDark', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                    disabled={values.cardBgUseGradientDark}
                  />
                  <input
                    type="text"
                    value={values.cardBgColorDark || 'rgba(31, 41, 55, 0.5)'}
                    onChange={(e) => updateContent('values.cardBgColorDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    placeholder="rgba(31, 41, 55, 0.5)"
                    disabled={values.cardBgUseGradientDark}
                  />
                </div>
              )}
              
              {/* Mensaje cuando es transparente */}
              {values.cardBgTransparentDark && (
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700 rounded-lg">
                  <p className="text-xs text-cyan-700 dark:text-cyan-300">
                    ✨ El fondo será completamente transparente, mostrando el fondo de la sección.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🌈 Configuración de Gradiente */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-purple-200 dark:border-gray-600">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            🌈 Fondo con Gradiente
          </h4>
          
          {/* Toggle Gradiente - Tema Claro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.cardBgUseGradient || false}
                    onChange={(e) => updateContent('values.cardBgUseGradient', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">☀️ Usar Gradiente (Claro)</span>
              </div>
              
              {values.cardBgUseGradient && (
                <div className="space-y-3 pl-4 border-l-2 border-purple-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.cardBgGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.cardBgGradientFrom', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBgGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.cardBgGradientFrom', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.cardBgGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.cardBgGradientTo', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBgGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.cardBgGradientTo', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.cardBgGradientDirection || 'to-br'}
                      onChange={(e) => updateContent('values.cardBgGradientDirection', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-tr">↗ Arriba Derecha</option>
                      <option value="to-tl">↖ Arriba Izquierda</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                      <option value="to-bl">↙ Abajo Izquierda</option>
                    </select>
                  </div>
                  {/* Preview del gradiente claro */}
                  <div 
                    className="h-8 rounded-lg border border-gray-200"
                    style={{
                      background: `linear-gradient(${
                        values.cardBgGradientDirection === 'to-r' ? 'to right' :
                        values.cardBgGradientDirection === 'to-l' ? 'to left' :
                        values.cardBgGradientDirection === 'to-t' ? 'to top' :
                        values.cardBgGradientDirection === 'to-b' ? 'to bottom' :
                        values.cardBgGradientDirection === 'to-tr' ? 'to top right' :
                        values.cardBgGradientDirection === 'to-tl' ? 'to top left' :
                        values.cardBgGradientDirection === 'to-bl' ? 'to bottom left' :
                        'to bottom right'
                      }, ${values.cardBgGradientFrom || '#667eea'}, ${values.cardBgGradientTo || '#764ba2'})`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Toggle Gradiente - Tema Oscuro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.cardBgUseGradientDark || false}
                    onChange={(e) => updateContent('values.cardBgUseGradientDark', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌙 Usar Gradiente (Oscuro)</span>
              </div>
              
              {values.cardBgUseGradientDark && (
                <div className="space-y-3 pl-4 border-l-2 border-purple-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.cardBgGradientFromDark || '#1e3a5f'}
                      onChange={(e) => updateContent('values.cardBgGradientFromDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBgGradientFromDark || '#1e3a5f'}
                      onChange={(e) => updateContent('values.cardBgGradientFromDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.cardBgGradientToDark || '#0d9488'}
                      onChange={(e) => updateContent('values.cardBgGradientToDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBgGradientToDark || '#0d9488'}
                      onChange={(e) => updateContent('values.cardBgGradientToDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.cardBgGradientDirectionDark || 'to-br'}
                      onChange={(e) => updateContent('values.cardBgGradientDirectionDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-tr">↗ Arriba Derecha</option>
                      <option value="to-tl">↖ Arriba Izquierda</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                      <option value="to-bl">↙ Abajo Izquierda</option>
                    </select>
                  </div>
                  {/* Preview del gradiente oscuro */}
                  <div 
                    className="h-8 rounded-lg border border-gray-600"
                    style={{
                      background: `linear-gradient(${
                        values.cardBgGradientDirectionDark === 'to-r' ? 'to right' :
                        values.cardBgGradientDirectionDark === 'to-l' ? 'to left' :
                        values.cardBgGradientDirectionDark === 'to-t' ? 'to top' :
                        values.cardBgGradientDirectionDark === 'to-b' ? 'to bottom' :
                        values.cardBgGradientDirectionDark === 'to-tr' ? 'to top right' :
                        values.cardBgGradientDirectionDark === 'to-tl' ? 'to top left' :
                        values.cardBgGradientDirectionDark === 'to-bl' ? 'to bottom left' :
                        'to bottom right'
                      }, ${values.cardBgGradientFromDark || '#1e3a5f'}, ${values.cardBgGradientToDark || '#0d9488'})`
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colores de borde */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ☀️ Borde (Tema Claro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardBorderColor || '#f3f4f6'}
                onChange={(e) => updateContent('values.cardBorderColor', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.cardBorderColor || 'rgba(243, 244, 246, 1)'}
                onChange={(e) => updateContent('values.cardBorderColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="rgba(243, 244, 246, 1)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🌙 Borde (Tema Oscuro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardBorderColorDark || '#4b5563'}
                onChange={(e) => updateContent('values.cardBorderColorDark', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.cardBorderColorDark || 'rgba(75, 85, 99, 0.5)'}
                onChange={(e) => updateContent('values.cardBorderColorDark', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="rgba(75, 85, 99, 0.5)"
              />
            </div>
          </div>
        </div>

        {/* 🌈 Gradiente para BORDE */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🌈 Borde con Gradiente</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle Gradiente Borde - Tema Claro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.cardBorderUseGradient || false}
                    onChange={(e) => updateContent('values.cardBorderUseGradient', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">☀️ Usar Gradiente (Claro)</span>
              </div>
              
              {values.cardBorderUseGradient && (
                <div className="space-y-3 pl-4 border-l-2 border-indigo-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.cardBorderGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.cardBorderGradientFrom', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBorderGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.cardBorderGradientFrom', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.cardBorderGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.cardBorderGradientTo', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBorderGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.cardBorderGradientTo', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.cardBorderGradientDirection || 'to-r'}
                      onChange={(e) => updateContent('values.cardBorderGradientDirection', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                    </select>
                  </div>
                  {/* Preview */}
                  <div 
                    className="h-4 rounded-lg"
                    style={{
                      background: `linear-gradient(to right, ${values.cardBorderGradientFrom || '#667eea'}, ${values.cardBorderGradientTo || '#764ba2'})`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Toggle Gradiente Borde - Tema Oscuro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.cardBorderUseGradientDark || false}
                    onChange={(e) => updateContent('values.cardBorderUseGradientDark', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌙 Usar Gradiente (Oscuro)</span>
              </div>
              
              {values.cardBorderUseGradientDark && (
                <div className="space-y-3 pl-4 border-l-2 border-indigo-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.cardBorderGradientFromDark || '#8b5cf6'}
                      onChange={(e) => updateContent('values.cardBorderGradientFromDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBorderGradientFromDark || '#8b5cf6'}
                      onChange={(e) => updateContent('values.cardBorderGradientFromDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.cardBorderGradientToDark || '#06b6d4'}
                      onChange={(e) => updateContent('values.cardBorderGradientToDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardBorderGradientToDark || '#06b6d4'}
                      onChange={(e) => updateContent('values.cardBorderGradientToDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.cardBorderGradientDirectionDark || 'to-r'}
                      onChange={(e) => updateContent('values.cardBorderGradientDirectionDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                    </select>
                  </div>
                  {/* Preview */}
                  <div 
                    className="h-4 rounded-lg"
                    style={{
                      background: `linear-gradient(to right, ${values.cardBorderGradientFromDark || '#8b5cf6'}, ${values.cardBorderGradientToDark || '#06b6d4'})`
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colores de título */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ☀️ Color Título (Tema Claro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardTitleColor || '#111827'}
                onChange={(e) => updateContent('values.cardTitleColor', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.cardTitleColor || '#111827'}
                onChange={(e) => updateContent('values.cardTitleColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🌙 Color Título (Tema Oscuro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardTitleColorDark || '#ffffff'}
                onChange={(e) => updateContent('values.cardTitleColorDark', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.cardTitleColorDark || '#ffffff'}
                onChange={(e) => updateContent('values.cardTitleColorDark', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* 🌈 Gradiente para TÍTULO de tarjetas */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🌈 Título con Gradiente</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle Gradiente Título - Tema Claro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.cardTitleUseGradient || false}
                    onChange={(e) => updateContent('values.cardTitleUseGradient', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-rose-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">☀️ Usar Gradiente (Claro)</span>
              </div>
              
              {values.cardTitleUseGradient && (
                <div className="space-y-3 pl-4 border-l-2 border-rose-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.cardTitleGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.cardTitleGradientFrom', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardTitleGradientFrom || '#667eea'}
                      onChange={(e) => updateContent('values.cardTitleGradientFrom', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.cardTitleGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.cardTitleGradientTo', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardTitleGradientTo || '#764ba2'}
                      onChange={(e) => updateContent('values.cardTitleGradientTo', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.cardTitleGradientDirection || 'to-r'}
                      onChange={(e) => updateContent('values.cardTitleGradientDirection', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                    </select>
                  </div>
                  {/* Preview */}
                  <div 
                    className="h-6 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: `linear-gradient(to right, ${values.cardTitleGradientFrom || '#667eea'}, ${values.cardTitleGradientTo || '#764ba2'})`
                    }}
                  >
                    Vista previa
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Gradiente Título - Tema Oscuro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.cardTitleUseGradientDark || false}
                    onChange={(e) => updateContent('values.cardTitleUseGradientDark', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-rose-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌙 Usar Gradiente (Oscuro)</span>
              </div>
              
              {values.cardTitleUseGradientDark && (
                <div className="space-y-3 pl-4 border-l-2 border-rose-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Desde:</label>
                    <input
                      type="color"
                      value={values.cardTitleGradientFromDark || '#8b5cf6'}
                      onChange={(e) => updateContent('values.cardTitleGradientFromDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardTitleGradientFromDark || '#8b5cf6'}
                      onChange={(e) => updateContent('values.cardTitleGradientFromDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Hasta:</label>
                    <input
                      type="color"
                      value={values.cardTitleGradientToDark || '#06b6d4'}
                      onChange={(e) => updateContent('values.cardTitleGradientToDark', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={values.cardTitleGradientToDark || '#06b6d4'}
                      onChange={(e) => updateContent('values.cardTitleGradientToDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Dirección:</label>
                    <select
                      value={values.cardTitleGradientDirectionDark || 'to-r'}
                      onChange={(e) => updateContent('values.cardTitleGradientDirectionDark', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="to-r">→ Derecha</option>
                      <option value="to-l">← Izquierda</option>
                      <option value="to-t">↑ Arriba</option>
                      <option value="to-b">↓ Abajo</option>
                      <option value="to-br">↘ Abajo Derecha</option>
                    </select>
                  </div>
                  {/* Preview */}
                  <div 
                    className="h-6 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: `linear-gradient(to right, ${values.cardTitleGradientFromDark || '#8b5cf6'}, ${values.cardTitleGradientToDark || '#06b6d4'})`
                    }}
                  >
                    Vista previa
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colores de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ☀️ Color Texto (Tema Claro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardTextColor || '#4b5563'}
                onChange={(e) => updateContent('values.cardTextColor', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.cardTextColor || '#4b5563'}
                onChange={(e) => updateContent('values.cardTextColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🌙 Color Texto (Tema Oscuro)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardTextColorDark || '#9ca3af'}
                onChange={(e) => updateContent('values.cardTextColorDark', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={values.cardTextColorDark || '#9ca3af'}
                onChange={(e) => updateContent('values.cardTextColorDark', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Opacidad de imagen */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🖼️ Opacidad de Imagen en Tarjetas: {values.cardImageOpacity ?? 100}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.cardImageOpacity ?? 100}
            onChange={(e) => updateContent('values.cardImageOpacity', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0% (Transparente)</span>
            <span>50%</span>
            <span>100% (Nítido)</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Controla la opacidad de las imágenes de fondo en las tarjetas de valores.
          </p>
        </div>

        {/* Toggle para overlay oscuro en tarjetas con imagen */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🎭 Overlay oscuro en imágenes
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Aplica un degradado oscuro sobre las imágenes para mejorar la legibilidad del texto.
                <br />
                <strong>Desactívalo</strong> si quieres que la imagen se vea completamente nítida.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={values.cardImageOverlay !== false}
                onChange={(e) => updateContent('values.cardImageOverlay', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Vista previa de colores */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Vista previa:</p>
          <div className="grid grid-cols-2 gap-4">
            {/* Preview Tema Claro */}
            <div 
              className="p-4 rounded-xl shadow-lg"
              style={{
                backgroundColor: values.cardBgColor || 'rgba(255, 255, 255, 0.8)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: values.cardBorderColor || 'rgba(243, 244, 246, 1)'
              }}
            >
              <p className="text-xs text-gray-400 mb-2">☀️ Tema Claro</p>
              <h4 style={{ color: values.cardTitleColor || '#111827' }} className="font-bold mb-1">
                Título
              </h4>
              <p style={{ color: values.cardTextColor || '#4b5563' }} className="text-sm">
                Texto de ejemplo
              </p>
            </div>
            {/* Preview Tema Oscuro */}
            <div 
              className="p-4 rounded-xl shadow-lg"
              style={{
                backgroundColor: values.cardBgColorDark || 'rgba(31, 41, 55, 0.5)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: values.cardBorderColorDark || 'rgba(75, 85, 99, 0.5)'
              }}
            >
              <p className="text-xs text-gray-400 mb-2">🌙 Tema Oscuro</p>
              <h4 style={{ color: values.cardTitleColorDark || '#ffffff' }} className="font-bold mb-1">
                Título
              </h4>
              <p style={{ color: values.cardTextColorDark || '#9ca3af' }} className="text-sm">
                Texto de ejemplo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🖼️ IMAGEN DE FONDO DE LA SECCIÓN */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-purple-200 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
          🖼️ Imagen de Fondo (Sección Valores)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Esta imagen se mostrará como fondo de toda la sección de valores.
        </p>

        {/* Toggle para tema claro/oscuro */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setImageTheme('light')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              imageTheme === 'light'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ☀️ Tema Claro
          </button>
          <button
            type="button"
            onClick={() => setImageTheme('dark')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              imageTheme === 'dark'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🌙 Tema Oscuro
          </button>
        </div>

        {/* Selector de imagen */}
        <ManagedImageSelector
          label={imageTheme === 'light' ? '☀️ Imagen de fondo (Modo Claro)' : '🌙 Imagen de fondo (Modo Oscuro)'}
          description="Tamaño recomendado: 1920x1080px"
          currentImage={
            typeof values.backgroundImage === 'string' 
              ? values.backgroundImage 
              : (values as any).backgroundImage?.[imageTheme] || ''
          }
          onImageSelect={(url: string) => {
            const currentBgImage = typeof values.backgroundImage === 'object' ? values.backgroundImage : {};
            updateContent('values.backgroundImage', {
              ...currentBgImage,
              [imageTheme]: url
            });
          }}
          darkMode={imageTheme === 'dark'}
          hideButtonArea={!!(typeof values.backgroundImage === 'string' 
            ? values.backgroundImage 
            : (values as any).backgroundImage?.[imageTheme])}
        />

        {/* Preview de imágenes */}
        {(typeof values.backgroundImage === 'object' && 
          ((values as any).backgroundImage?.light || (values as any).backgroundImage?.dark)) && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {(values as any).backgroundImage?.light && (
              <div className="relative">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">☀️ Modo Claro</p>
                <img 
                  src={(values as any).backgroundImage.light} 
                  alt="Fondo claro" 
                  className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
            {(values as any).backgroundImage?.dark && (
              <div className="relative">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🌙 Modo Oscuro</p>
                <img 
                  src={(values as any).backgroundImage.dark} 
                  alt="Fondo oscuro" 
                  className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        )}

        {/* Opacidad de la imagen */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opacidad de la imagen: {Math.round(((values as any).backgroundOpacity ?? 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(((values as any).backgroundOpacity ?? 1) * 100)}
            onChange={(e) => updateContent('values.backgroundOpacity', parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0% (Invisible)</span>
            <span>50%</span>
            <span>100% (Nítido)</span>
          </div>
        </div>

        {/* Toggle de overlay */}
        <div className="mt-4 flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={(values as any).backgroundOverlay === true}
              onChange={(e) => updateContent('values.backgroundOverlay', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Aplicar overlay oscuro (mejora legibilidad del texto)
            </span>
          </label>
        </div>
      </div>

      {/* 📋 LISTA DE VALORES */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            📋 Lista de Valores ({values.items?.length || 0})
          </h3>
          <button
            onClick={addValue}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Valor
          </button>
        </div>

        <div className="space-y-4">
          {values.items?.map((item, index) => (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                expandedValue === index
                  ? 'border-amber-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Header del valor */}
              <div
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  expandedValue === index
                    ? 'bg-amber-50 dark:bg-amber-900/20'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setExpandedValue(expandedValue === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.image?.light || item.image?.dark 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {item.image?.light || item.image?.dark ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {item.title || 'Sin título'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                      {item.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Botones de orden */}
                  <button
                    onClick={(e) => { e.stopPropagation(); moveValueUp(index); }}
                    disabled={index === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                    title="Mover arriba"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveValueDown(index); }}
                    disabled={index === values.items.length - 1}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                    title="Mover abajo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Eliminar */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeValue(index); }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar valor"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {/* Expandir/Colapsar */}
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      expandedValue === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Contenido expandido */}
              {expandedValue === index && (
                <div className="p-6 bg-white dark:bg-gray-800 space-y-6">
                  {/* Título y descripción */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título del valor
                      </label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ej: Innovación"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                      rows={3}
                      placeholder="Describe este valor..."
                    />
                  </div>

                  {/* Imagen del valor */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      🖼️ Imagen del Valor (opcional)
                    </label>

                    <ManagedImageSelector
                      currentImage={typeof item.image === 'string' ? item.image : (item.image?.light || item.image?.dark || '')}
                      onImageSelect={(url: string) => updateValue(index, 'image', url)}
                      label="Imagen del Valor"
                      description="Esta imagen se usará tanto en tema claro como oscuro"
                      darkMode={false}
                    />

                    {/* Preview de imagen */}
                    {(typeof item.image === 'string' ? item.image : (item.image?.light || item.image?.dark)) && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa</p>
                        <img 
                          src={typeof item.image === 'string' ? item.image : (item.image?.light || item.image?.dark)} 
                          alt={item.imageAlt || item.title} 
                          className="w-full max-w-xs h-24 object-contain rounded-lg border border-gray-200 dark:border-gray-600" 
                        />
                      </div>
                    )}

                    {/* Alt text */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Texto alternativo (SEO)
                      </label>
                      <input
                        type="text"
                        value={item.imageAlt || ''}
                        onChange={(e) => updateValue(index, 'imageAlt', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ej: Imagen representando innovación tecnológica"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Mensaje cuando no hay valores */}
          {(!values.items || values.items.length === 0) && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-4xl mb-4 block">⭐</span>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No hay valores configurados aún
              </p>
              <button
                onClick={addValue}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar primer valor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🏆 SECCIÓN "¿POR QUÉ ELEGIRNOS?" - NUEVA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-blue-200 dark:border-gray-700/50">
        {/* Encabezado colapsable */}
        <button
          type="button"
          className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
          onClick={() => setCollapsedWhyChooseUs((prev) => !prev)}
          aria-expanded={!collapsedWhyChooseUs}
          aria-controls="why-choose-us-content"
          style={{ cursor: 'pointer' }}
        >
          <span className="flex items-center gap-2">
            🏆 ¿Por qué elegirnos?
          </span>
          <span className="ml-2 text-lg">
            {collapsedWhyChooseUs ? '▼ Mostrar' : '▲ Ocultar'}
          </span>
        </button>

        {/* Contenido colapsable */}
        {!collapsedWhyChooseUs && (
          <div id="why-choose-us-content" className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Lista de beneficios o razones por las que los clientes deberían elegir tu empresa.
              Esta sección aparecerá después de los Valores.
            </p>

            {/* Título de la sección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título de la Sección
              </label>
              <input
                type="text"
                value={whyChooseUs.title || ''}
                onChange={(e) => updateContent('whyChooseUs.title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ej: ¿Por qué elegir SCUTI Company?"
              />
            </div>

            {/* Subtítulo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtítulo (opcional)
              </label>
              <input
                type="text"
                value={whyChooseUs.subtitle || ''}
                onChange={(e) => updateContent('whyChooseUs.subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ej: ¿Por qué las PYMES confían en nosotros?"
              />
            </div>

            {/* Botón para agregar item */}
            <div className="flex justify-end">
              <button
                onClick={addWhyChooseUsItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Beneficio
              </button>
            </div>

            {/* Lista de items */}
            <div className="space-y-4">
              {whyChooseUs.items && whyChooseUs.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Selector de Icono/Emoji */}
                    <div className="flex-shrink-0">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Icono
                      </label>
                      <input
                        type="text"
                        value={item.icon || '✅'}
                        onChange={(e) => updateWhyChooseUsItem(index, 'icon', e.target.value)}
                        className="w-16 h-12 text-2xl text-center border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                        placeholder="✅"
                        maxLength={2}
                      />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 space-y-3">
                      {/* Título del item */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Título
                        </label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => updateWhyChooseUsItem(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="Ej: Experiencia comprobada"
                        />
                      </div>

                      {/* Descripción del item */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Descripción
                        </label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => updateWhyChooseUsItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                          rows={2}
                          placeholder="Ej: Hemos trabajado con empresas de diversos sectores..."
                        />
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col gap-1">
                      {/* Mover arriba */}
                      <button
                        onClick={() => moveWhyChooseUsItemUp(index)}
                        disabled={index === 0}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover arriba"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      {/* Mover abajo */}
                      <button
                        onClick={() => moveWhyChooseUsItemDown(index)}
                        disabled={index === whyChooseUs.items.length - 1}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover abajo"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Eliminar */}
                      <button
                        onClick={() => removeWhyChooseUsItem(index)}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensaje cuando no hay items */}
            {(!whyChooseUs.items || whyChooseUs.items.length === 0) && (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <span className="text-4xl mb-4 block">🏆</span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No hay beneficios configurados aún
                </p>
                <button
                  onClick={addWhyChooseUsItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar primer beneficio
                </button>
              </div>
            )}

            {/* Vista previa de items */}
            {whyChooseUs.items && whyChooseUs.items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  👁️ Vista Previa
                </h5>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  {whyChooseUs.title && (
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {whyChooseUs.title}
                    </h3>
                  )}
                  {whyChooseUs.subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {whyChooseUs.subtitle}
                    </p>
                  )}
                  <div className="space-y-3">
                    {whyChooseUs.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">{item.icon || '✅'}</span>
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">{item.title}:</span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">{item.description}</span>
                        </div>
                      </div>
                    ))}
                    {whyChooseUs.items.length > 4 && (
                      <p className="text-sm text-gray-500 italic">
                        + {whyChooseUs.items.length - 4} más...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📊 Vista Previa del Carrusel */}
      {values.items && values.items.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            👁️ Vista Previa del Carrusel
          </h4>
          
          <div className="overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {values.title || 'Nuestros Valores'}
              </h3>
              {values.subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">{values.subtitle}</p>
              )}
            </div>

            <div className={`grid gap-4 ${
              values.carouselConfig?.itemsPerView === 2 ? 'grid-cols-2' :
              values.carouselConfig?.itemsPerView === 4 ? 'grid-cols-4' :
              'grid-cols-3'
            }`}>
              {values.items.slice(0, values.carouselConfig?.itemsPerView || 3).map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg overflow-hidden"
                  style={{ minHeight: '180px' }}
                >
                  {/* Fondo de imagen */}
                  {item.image?.light && (
                    <div className="absolute inset-0">
                      <img
                        src={item.image.light}
                        alt={item.imageAlt || item.title}
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-800/40" />
                    </div>
                  )}
                  
                  {/* Contenido */}
                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(values.items.length / (values.carouselConfig?.itemsPerView || 3)) }).map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all ${
                    idx === 0 ? 'w-6 h-2 bg-amber-500' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
      )}
    </div>
  );
};

export default ValuesConfigSection;
