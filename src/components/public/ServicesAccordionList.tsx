/**
 * 🎯 LISTA DE SERVICIOS EN ACORDEÓN
 * Componente que muestra todos los servicios en formato acordeón expandible
 * Diseño inspirado en maqueta con numeración, títulos y contenido expandible
 */

import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import type { Servicio } from '../../types/servicios';

// ============================================
// TIPOS
// ============================================

interface AccordionConfig {
  // Títulos de la sección
  sectionTitle?: string;
  sectionSubtitle?: string;
  
  // Colores
  titleColor?: string;
  titleColorDark?: string;
  // Gradiente para título
  titleUseGradient?: boolean;
  titleGradientFrom?: string;
  titleGradientTo?: string;
  titleGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  titleUseGradientDark?: boolean;
  titleGradientFromDark?: string;
  titleGradientToDark?: string;
  titleGradientDirectionDark?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  subtitleColor?: string;
  subtitleColorDark?: string;
  numberColor?: string;
  numberColorDark?: string;
  serviceTitleColor?: string;
  serviceTitleColorDark?: string;
  descriptionColor?: string;
  descriptionColorDark?: string;
  
  // Tipografía
  titleFontFamily?: string;
  contentFontFamily?: string;
  titleFontWeight?: string;
  
  // Diseño
  borderColor?: string;
  borderColorDark?: string;
  expandedBg?: string;
  expandedBgDark?: string;
  iconColor?: string;
  iconColorDark?: string;
  
  // Botón
  buttonText?: string;
  buttonGradient?: string; // Mantener para compatibilidad
  buttonTextColor?: string;
  buttonBorderRadius?: string;
  // 🆕 Configuración mejorada del gradiente del botón
  buttonUseGradient?: boolean;
  buttonGradientFrom?: string;
  buttonGradientTo?: string;
  buttonGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  buttonBgColor?: string; // Color sólido alternativo
  
  // Features
  featureIconColor?: string;
  featureIconColorDark?: string;
  maxFeatures?: number;
  // Colores de resaltado de características
  featureHighlightStyle?: 'highlight' | 'box';
  featureHighlightBgColor?: string;
  featureHighlightBgColorDark?: string;
  featureHighlightTextColor?: string;
  featureHighlightTextColorDark?: string;
  featureHighlightBorderColor?: string;
  featureHighlightBorderColorDark?: string;
  featureHighlightShowBorder?: boolean;
  featureHighlightShowBorderDark?: boolean;
  // Gradientes para características
  featureHighlightBgGradient?: boolean;
  featureHighlightBgGradientFrom?: string;
  featureHighlightBgGradientTo?: string;
  featureHighlightBgGradientDir?: string;
  featureHighlightBgGradientDark?: boolean;
  featureHighlightBgGradientFromDark?: string;
  featureHighlightBgGradientToDark?: string;
  featureHighlightBgGradientDirDark?: string;
  
  // Background
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundOpacity?: number;
  
  // Líneas de separación
  separatorLineColor?: string;
  separatorLineColorDark?: string;
  separatorLineWidth?: number;
  expandedSeparatorColor?: string;
  expandedSeparatorColorDark?: string;
  
  // Fondo del contenido expandido
  expandedBgOpacity?: number;
  expandedBgBlur?: number;
  // Fondo del header (botón)
  headerBg?: string;
  headerBgDark?: string;
  headerBgOpacity?: number;
  headerBgHover?: string;
  headerBgHoverDark?: string;
  headerBgHoverOpacity?: number;
  
  // Paginación
  itemsPerPage?: number;
  paginationBgColor?: string;
  paginationBgColorDark?: string;
  paginationActiveColor?: string;
  paginationActiveColorDark?: string;
  paginationTextColor?: string;
  paginationTextColorDark?: string;
  // 🆕 Gradientes para paginación - Modo Claro
  paginationActiveUseGradient?: boolean;
  paginationActiveGradientFrom?: string;
  paginationActiveGradientTo?: string;
  paginationActiveGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  // 🆕 Gradientes para paginación - Modo Oscuro
  paginationActiveUseGradientDark?: boolean;
  paginationActiveGradientFromDark?: string;
  paginationActiveGradientToDark?: string;
  paginationActiveGradientDirectionDark?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
}

interface ServicesAccordionListProps {
  servicios: Servicio[];
  config?: AccordionConfig;
  currentTheme?: 'light' | 'dark';
  className?: string;
}

// ============================================
// COMPONENTE ITEM DEL ACORDEÓN
// ============================================

interface AccordionItemProps {
  servicio: Servicio;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  config?: AccordionConfig;
  currentTheme?: 'light' | 'dark';
}

const AccordionItem: React.FC<AccordionItemProps> = memo(({
  servicio,
  index,
  isExpanded,
  onToggle,
  config,
  currentTheme = 'light'
}) => {
  const isDark = currentTheme === 'dark';
  
  // Formatear número con ceros
  const formattedNumber = String(index + 1).padStart(2, '0');
  
  // Colores dinámicos
  const numberColor = isDark 
    ? (config?.numberColorDark || '#A78BFA') 
    : (config?.numberColor || '#8B5CF6');
  
  const titleColor = isDark
    ? (config?.serviceTitleColorDark || '#FFFFFF')
    : (config?.serviceTitleColor || '#1F2937');
  
  const descriptionColor = isDark
    ? (config?.descriptionColorDark || '#D1D5DB')
    : (config?.descriptionColor || '#4B5563');
  
  const iconColor = isDark
    ? (config?.iconColorDark || '#A78BFA')
    : (config?.iconColor || '#8B5CF6');
  
  // Configuración de líneas de separación
  const lineWidth = config?.separatorLineWidth || 2;
  const normalLineColor = isDark 
    ? (config?.separatorLineColorDark || 'rgba(255, 255, 255, 0.1)')
    : (config?.separatorLineColor || 'rgba(255, 255, 255, 0.2)');
  const expandedLineColor = isDark
    ? (config?.expandedSeparatorColorDark || 'rgba(167, 139, 250, 0.3)')
    : (config?.expandedSeparatorColor || 'rgba(167, 139, 250, 0.3)');
  
  // Configuración de fondo expandido
  const expandedBgColor = isDark
    ? (config?.expandedBgDark || '#1f2937')
    : (config?.expandedBg || '#f9fafb');
  const expandedBgOpacity = config?.expandedBgOpacity ?? 0.8;
  const expandedBgBlur = config?.expandedBgBlur ?? 8;
  
  // Construir el color de fondo con opacidad
  const getBackgroundColor = (color: string, opacity: number) => {
    // Si ya es rgba, usarlo directamente
    if (color.startsWith('rgba')) return color;
    
    // Si es rgb, convertir a rgba
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', ', ' + opacity + ')');
    }
    
    // Si es hex, convertir a rgba
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    }
    
    return color;
  };
  
  // Configuración de fondo del header
  const headerBgColor = isDark
    ? (config?.headerBgDark || '#1f2937')
    : (config?.headerBg || '#1f2937');
  const headerBgHoverColor = isDark
    ? (config?.headerBgHoverDark || '#1f2937')
    : (config?.headerBgHover || '#1f2937');
  const headerBgOpacity = config?.headerBgOpacity ?? 0.6;
  const headerBgHoverOpacity = config?.headerBgHoverOpacity ?? 0.2;

  return (
    <div 
      className={'transition-all duration-300 ' + (isExpanded ? 'mb-2' : 'mb-0')}
    >
      {/* Header del acordeón - siempre visible */}
      <button
        onClick={onToggle}
        className={'w-full py-4 px-4 flex items-center justify-between group transition-all duration-300 backdrop-blur-sm ' + (isExpanded ? 'rounded-t-2xl' : '')}
        style={{
          backgroundColor: isExpanded 
            ? getBackgroundColor(headerBgColor, headerBgOpacity)
            : 'transparent',
          borderBottom: lineWidth + 'px solid ' + (isExpanded ? expandedLineColor : normalLineColor)
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = getBackgroundColor(headerBgHoverColor, headerBgHoverOpacity);
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* Número - Fijo a la izquierda */}
        <span 
          className="text-2xl md:text-3xl font-light opacity-50 w-16 text-left flex-shrink-0"
          style={{
            color: numberColor,
            fontFamily: config?.titleFontFamily || 'inherit'
          }}
        >
          {formattedNumber}
        </span>
        
        {/* Título del servicio - Centrado */}
        <h3 
          className="text-lg md:text-xl text-center font-semibold flex-1 px-4"
          style={{
            color: titleColor,
            fontFamily: config?.titleFontFamily || 'inherit',
            fontWeight: config?.titleFontWeight || '600'
          }}
        >
          {servicio.titulo}
        </h3>
        
        {/* Icono expandir/colapsar - Fijo a la derecha */}
        <span 
          className={'text-base transition-transform duration-300 w-16 text-right flex-shrink-0 ' + (isExpanded ? 'rotate-180' : '')}
          style={{ color: iconColor }}
        >
          ▼
        </span>
      </button>
      
      {/* Contenido expandible */}
      <div 
        className={'overflow-hidden transition-all duration-500 ease-in-out ' + (isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0')}
      >
        <div 
          className="px-4 pb-4 pt-3 rounded-b-2xl"
          style={{
            backgroundColor: getBackgroundColor(expandedBgColor, expandedBgOpacity),
            backdropFilter: expandedBgBlur > 0 ? 'blur(' + expandedBgBlur + 'px)' : 'none',
            WebkitBackdropFilter: expandedBgBlur > 0 ? 'blur(' + expandedBgBlur + 'px)' : 'none',
            borderBottom: lineWidth + 'px solid ' + normalLineColor
          }}
        >
          <div className="ml-10 md:ml-14">
            {/* Descripción */}
            {servicio.descripcion && (
              <div className="mb-3">
              <p 
                className="text-sm md:text-base leading-relaxed"
                style={{ 
                  color: descriptionColor,
                  fontFamily: config?.contentFontFamily || 'inherit'
                }}
              >
                {servicio.descripcionCorta || servicio.descripcion}
              </p>
              
              {/* Segunda parte de la descripción (simulando el diseño de la maqueta) */}
              {servicio.descripcion && servicio.descripcion.length > 150 && (
                <p 
                  className="text-sm md:text-base leading-relaxed mt-3"
                  style={{
                    color: descriptionColor,
                    fontFamily: config?.contentFontFamily || 'inherit'
                  }}
                >
                  {servicio.descripcion.slice(0, 200)}...
                </p>
              )}
            </div>
          )}
          
          {/* Características */}
          {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {servicio.caracteristicas.slice(0, config?.maxFeatures || 3).map((caracteristica, idx) => {
                  // Función para obtener dirección del gradiente
                  const getGradientDirection = (dir: string) => {
                    switch(dir) {
                      case 'to-r': return 'to right';
                      case 'to-l': return 'to left';
                      case 'to-t': return 'to top';
                      case 'to-b': return 'to bottom';
                      case 'to-tr': return 'to top right';
                      case 'to-br': return 'to bottom right';
                      default: return 'to right';
                    }
                  };
                  
                  // Obtener fondo (puede ser gradiente o sólido)
                  const getBgStyle = () => {
                    if (currentTheme === 'dark') {
                      if (config?.featureHighlightBgGradientDark) {
                        const from = config.featureHighlightBgGradientFromDark || '#581C87';
                        const to = config.featureHighlightBgGradientToDark || '#7C3AED';
                        const dir = getGradientDirection(config.featureHighlightBgGradientDirDark || 'to-r');
                        return `linear-gradient(${dir}, ${from}, ${to})`;
                      }
                      return config?.featureHighlightBgColorDark || '#581C87';
                    } else {
                      if (config?.featureHighlightBgGradient) {
                        const from = config.featureHighlightBgGradientFrom || '#F3E8FF';
                        const to = config.featureHighlightBgGradientTo || '#E9D5FF';
                        const dir = getGradientDirection(config.featureHighlightBgGradientDir || 'to-r');
                        return `linear-gradient(${dir}, ${from}, ${to})`;
                      }
                      return config?.featureHighlightBgColor || '#F3E8FF';
                    }
                  };
                  
                  const bgStyle = getBgStyle();
                  
                  const textColor = currentTheme === 'dark'
                    ? (config?.featureHighlightTextColorDark || '#E9D5FF')
                    : (config?.featureHighlightTextColor || '#6B21A8');
                  
                  // Verificar si se debe mostrar borde
                  const showBorder = currentTheme === 'dark'
                    ? (config?.featureHighlightShowBorderDark !== false)
                    : (config?.featureHighlightShowBorder !== false);
                  
                  const borderColor = showBorder 
                    ? (currentTheme === 'dark'
                        ? (config?.featureHighlightBorderColorDark || '#7C3AED')
                        : (config?.featureHighlightBorderColor || '#C084FC'))
                    : 'transparent';
                  
                  // Determinar estilo: 'highlight' (resaltado) o 'box' (caja)
                  const isBoxStyle = config?.featureHighlightStyle === 'box';
                  
                  return (
                    <span
                      key={idx}
                      className={`font-medium transition-all duration-200 ${
                        isBoxStyle 
                          ? 'text-xs px-2.5 py-1.5 rounded-md hover:scale-105' 
                          : 'text-sm inline-block'
                      }`}
                      style={isBoxStyle ? {
                        // Estilo Caja/Badge
                        background: bgStyle,
                        color: textColor,
                        borderWidth: showBorder ? '1px' : '0',
                        borderStyle: 'solid',
                        borderColor: borderColor,
                        fontFamily: config?.contentFontFamily || 'inherit'
                      } : {
                        // Estilo Resaltado/Highlighter
                        color: textColor,
                        background: bgStyle,
                        padding: '0.1em 0.35em',
                        borderRadius: '0.2em',
                        lineHeight: '1.5',
                        borderWidth: showBorder ? '1px' : '0',
                        borderStyle: 'solid',
                        borderColor: borderColor,
                        fontFamily: config?.contentFontFamily || 'inherit'
                      }}
                    >
                      ✓ {caracteristica}
                    </span>
                  );
                })}
                {servicio.caracteristicas.length > (config?.maxFeatures || 3) && (
                  <span 
                    className="text-xs opacity-70 px-2 py-1"
                    style={{ color: descriptionColor }}
                  >
                    +{servicio.caracteristicas.length - (config?.maxFeatures || 3)} más
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Footer: Precio y Botón */}
          <div className="flex items-center justify-between mt-4">
            {/* Precio */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold" style={{ color: iconColor }}>
                {servicio.tipoPrecio === 'personalizado' 
                  ? 'Consultar precio'
                  : (() => {
                      const getCurrencySymbol = (moneda?: string): string => {
                        switch (moneda?.toUpperCase()) {
                          case 'PEN': return 'S/.';
                          case 'USD': return '$';
                          case 'EUR': return '€';
                          default: return 'S/.';
                        }
                      };
                      const symbol = getCurrencySymbol(servicio.moneda);
                      if (servicio.tipoPrecio === 'consultar') {
                        return 'Consultar precio';
                      }
                      if (servicio.tipoPrecio === 'personalizado') {
                        return 'Precio personalizado';
                      }
                      if (servicio.tipoPrecio === 'desde' && servicio.precio) {
                        return `Desde ${symbol} ${servicio.precio.toLocaleString()}`;
                      }
                      if (servicio.tipoPrecio === 'fijo' && servicio.precio) {
                        return `${symbol} ${servicio.precio.toLocaleString()}`;
                      }
                      if (servicio.tipoPrecio === 'rango' && servicio.precioMin && servicio.precioMax) {
                        return `${symbol} ${servicio.precioMin.toLocaleString()} - ${symbol} ${servicio.precioMax.toLocaleString()}`;
                      }
                      if (servicio.tipoPrecio === 'paquetes' && servicio.precioMin) {
                        return `Desde ${symbol} ${servicio.precioMin.toLocaleString()}`;
                      }
                      if (servicio.tipoPrecio === 'suscripcion' && servicio.precio) {
                        return `${symbol} ${servicio.precio.toLocaleString()}/mes`;
                      }
                      return 'Consultar precio';
                    })()
                }
              </span>
            </div>
            
            {/* Botón Ver más */}
            <Link
              to={'/servicios/' + (servicio.slug || servicio._id)}
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: (() => {
                  // Prioridad: buttonGradient manual > nuevas propiedades de gradiente > color sólido
                  if (config?.buttonGradient) {
                    return config.buttonGradient;
                  }
                  if (config?.buttonUseGradient !== false) {
                    const direction = config?.buttonGradientDirection === 'to-r' ? 'to right' :
                      config?.buttonGradientDirection === 'to-l' ? 'to left' :
                      config?.buttonGradientDirection === 'to-t' ? 'to top' :
                      config?.buttonGradientDirection === 'to-b' ? 'to bottom' :
                      config?.buttonGradientDirection === 'to-tr' ? 'to top right' :
                      config?.buttonGradientDirection === 'to-tl' ? 'to top left' :
                      config?.buttonGradientDirection === 'to-br' ? 'to bottom right' :
                      config?.buttonGradientDirection === 'to-bl' ? 'to bottom left' : 'to right';
                    const from = config?.buttonGradientFrom || '#3B82F6';
                    const to = config?.buttonGradientTo || '#06B6D4';
                    return `linear-gradient(${direction}, ${from}, ${to})`;
                  }
                  return config?.buttonBgColor || '#3B82F6';
                })(),
                borderRadius: config?.buttonBorderRadius || '0.5rem',
                color: config?.buttonTextColor || '#FFFFFF'
              }}
            >
              {config?.buttonText || 'Ver más'}
          </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AccordionItem.displayName = 'AccordionItem';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServicesAccordionList: React.FC<ServicesAccordionListProps> = memo(({
  servicios,
  config,
  currentTheme = 'light',
  className = ''
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número fijo de servicios por página
  const sectionRef = React.useRef<HTMLElement>(null);
  
  const isDark = currentTheme === 'dark';
  
  // Helper para convertir dirección de gradiente a CSS
  const getGradientDirection = (dir?: string) => {
    switch (dir) {
      case 'to-r': return 'to right';
      case 'to-l': return 'to left';
      case 'to-t': return 'to top';
      case 'to-b': return 'to bottom';
      case 'to-tr': return 'to top right';
      case 'to-tl': return 'to top left';
      case 'to-br': return 'to bottom right';
      case 'to-bl': return 'to bottom left';
      default: return 'to right';
    }
  };
  
  // Determinar si usar gradiente según el tema
  // En modo oscuro, solo usar gradiente si titleUseGradientDark está explícitamente habilitado
  // En modo claro, solo usar gradiente si titleUseGradient está explícitamente habilitado
  const useTitleGradient = isDark 
    ? (config?.titleUseGradientDark === true) 
    : (config?.titleUseGradient === true);
  
  // Obtener colores de gradiente según el tema actual
  const gradientFrom = isDark 
    ? (config?.titleGradientFromDark || '#A78BFA') 
    : (config?.titleGradientFrom || '#8B5CF6');
  const gradientTo = isDark 
    ? (config?.titleGradientToDark || '#EC4899') 
    : (config?.titleGradientTo || '#EC4899');
  const gradientDirection = isDark 
    ? config?.titleGradientDirectionDark 
    : config?.titleGradientDirection;
  
  const sectionSubtitleColor = isDark
    ? (config?.subtitleColorDark || '#D1D5DB')
    : (config?.subtitleColor || '#4B5563');
  
  // Background image
  const backgroundImage = isDark
    ? config?.backgroundImage?.dark
    : config?.backgroundImage?.light;
  
  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  // Calcular paginación
  const totalPages = Math.ceil(servicios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServicios = servicios.slice(startIndex, endIndex);
  
  // Resetear página expandida al cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedIndex(null);
    // NO hacer scroll - mantener la posición actual del usuario
  };

  if (!servicios || servicios.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className={'relative py-12 overflow-hidden ' + className}
      style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        background: isDark
          ? 'linear-gradient(135deg, #0c4a6e 0%, #4c1d95 50%, #831843 100%)'
          : 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%)'
      }}
    >
      {/* Patrón de fondo decorativo - Círculos y líneas de circuito */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%)',
          backgroundSize: '100% 100%',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw'
        }}
      />
      
      {/* Patrón de líneas tipo circuito */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-10"
        style={{
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw'
        }}
      >
        <defs>
          <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Líneas horizontales */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            
            {/* Líneas verticales */}
            <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            
            {/* Círculos pequeños en intersecciones */}
            <circle cx="30" cy="20" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="70" cy="20" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="30" cy="60" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="70" cy="60" r="3" fill="currentColor" opacity="0.6"/>
            
            {/* Círculos medianos decorativos */}
            <circle cx="15" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <circle cx="85" cy="80" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <circle cx="50" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" className="text-white"/>
      </svg>
      
      {/* Imagen de fondo personalizada del CMS (si existe) */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(' + backgroundImage + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            opacity: config?.backgroundOpacity ?? 0.15,
            width: '100vw',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw'
          }}
        />
      )}
      
      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header de la sección */}
        <div className="text-center mb-8">
          {useTitleGradient ? (
            <h2 
              key={`title-gradient-${currentTheme}`}
              className="text-3xl md:text-4xl mb-3 font-bold inline-block"
              style={{
                background: `linear-gradient(${getGradientDirection(gradientDirection)}, ${gradientFrom}, ${gradientTo})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: config?.titleFontFamily || 'inherit',
                fontWeight: config?.titleFontWeight || '700'
              } as React.CSSProperties}
            >
              {config?.sectionTitle || 'Todos los servicios'}
            </h2>
          ) : (
            <h2 
              key={`title-solid-${currentTheme}`}
              className="text-3xl md:text-4xl mb-3 font-bold"
              style={{
                color: isDark ? (config?.titleColorDark || '#A78BFA') : (config?.titleColor || '#8B5CF6'),
                fontFamily: config?.titleFontFamily || 'inherit',
                fontWeight: config?.titleFontWeight || '700'
              }}
            >
              {config?.sectionTitle || 'Todos los servicios'}
            </h2>
          )}
          {config?.sectionSubtitle && (
            <p 
              className="text-base md:text-lg"
              style={{ 
                color: sectionSubtitleColor,
                fontFamily: config?.contentFontFamily || 'inherit',
                fontWeight: '400'
              }}
            >
              {config.sectionSubtitle}
            </p>
          )}
        </div>
        
        {/* Lista de acordeones - SIN contenedor con borde */}
        <div className="space-y-0.5">
          {paginatedServicios.map((servicio, index) => (
            <AccordionItem
              key={servicio._id}
              servicio={servicio}
              index={startIndex + index}
              isExpanded={expandedIndex === (startIndex + index)}
              onToggle={() => handleToggle(startIndex + index)}
              config={config}
              currentTheme={currentTheme}
            />
          ))}
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-1.5">
              {/* Botón Anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm"
                style={{
                  backgroundColor: isDark
                    ? (config?.paginationBgColorDark || 'rgba(255, 255, 255, 0.15)')
                    : (config?.paginationBgColor || 'rgba(255, 255, 255, 0.2)'),
                  color: isDark
                    ? (config?.paginationTextColorDark || '#FFFFFF')
                    : (config?.paginationTextColor || '#FFFFFF'),
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                ←
              </button>
              
              {/* Números de página */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Mostrar siempre la primera página, la última, la actual y las adyacentes
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 1;
                  
                  const showEllipsis = 
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2);
                  
                  if (showEllipsis) {
                    return (
                      <span 
                        key={page}
                        className="px-1 text-sm"
                        style={{
                          color: isDark
                            ? (config?.paginationTextColorDark || 'rgba(255, 255, 255, 0.5)')
                            : (config?.paginationTextColor || 'rgba(255, 255, 255, 0.5)')
                        }}
                      >
                        ...
                      </span>
                    );
                  }
                  
                  if (!showPage) return null;
                  
                  // Determinar si se usa gradiente para el botón activo
                  const usePaginationGradient = isDark 
                    ? config?.paginationActiveUseGradientDark 
                    : config?.paginationActiveUseGradient;
                  
                  const paginationGradientFrom = isDark 
                    ? (config?.paginationActiveGradientFromDark || '#8B5CF6')
                    : (config?.paginationActiveGradientFrom || '#3B82F6');
                  
                  const paginationGradientTo = isDark 
                    ? (config?.paginationActiveGradientToDark || '#EC4899')
                    : (config?.paginationActiveGradientTo || '#06B6D4');
                  
                  const paginationGradientDir = isDark 
                    ? config?.paginationActiveGradientDirectionDark
                    : config?.paginationActiveGradientDirection;
                  
                  // Estilo de fondo para botón activo
                  const activeButtonBackground = currentPage === page
                    ? (usePaginationGradient
                        ? `linear-gradient(${getGradientDirection(paginationGradientDir)}, ${paginationGradientFrom}, ${paginationGradientTo})`
                        : (isDark
                            ? (config?.paginationActiveColorDark || 'rgba(255, 255, 255, 0.9)')
                            : (config?.paginationActiveColor || 'rgba(255, 255, 255, 0.9)')))
                    : (isDark
                        ? (config?.paginationBgColorDark || 'rgba(255, 255, 255, 0.15)')
                        : (config?.paginationBgColor || 'rgba(255, 255, 255, 0.2)'));
                  
                  return (
                    <button
                      key={`page-${page}-${currentTheme}`}
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 rounded-md text-sm font-semibold transition-all duration-300 backdrop-blur-sm"
                      style={{
                        background: activeButtonBackground,
                        color: currentPage === page
                          ? (usePaginationGradient ? '#FFFFFF' : (isDark ? '#7c3aed' : '#8b5cf6'))
                          : isDark
                            ? (config?.paginationTextColorDark || '#FFFFFF')
                            : (config?.paginationTextColor || '#FFFFFF'),
                        border: currentPage === page
                          ? '2px solid rgba(255, 255, 255, 0.4)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        transform: currentPage === page ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              {/* Botón Siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm"
                style={{
                  backgroundColor: isDark
                    ? (config?.paginationBgColorDark || 'rgba(255, 255, 255, 0.15)')
                    : (config?.paginationBgColor || 'rgba(255, 255, 255, 0.2)'),
                  color: isDark
                    ? (config?.paginationTextColorDark || '#FFFFFF')
                    : (config?.paginationTextColor || '#FFFFFF'),
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

ServicesAccordionList.displayName = 'ServicesAccordionList';

export default ServicesAccordionList;
