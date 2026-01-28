/**
 * 🌟 TARJETA PÚBLICA DE SERVICIO
 * Componente optimizado para mostrar servicios al público
 * ⚡ Optimizado con React.memo para prevenir re-renders innecesarios
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/siteConfig';
import type { Servicio } from '../../types/servicios';

// ============================================
// TIPOS
// ============================================

// Configuración de qué elementos mostrar en la tarjeta
interface CardContentConfig {
  // Imagen
  showImage?: boolean;
  imageHeight?: string;
  
  // Badge destacado
  showFeaturedBadge?: boolean;
  
  // Categoría
  showCategory?: boolean;
  
  // Título (siempre visible, pero configurable)
  titleMaxLines?: number; // 1, 2, 3
  
  // Descripción
  showDescription?: boolean;
  descriptionMaxLines?: number; // 1, 2, 3
  
  // Características/Beneficios
  showFeatures?: boolean;
  maxFeatures?: number; // 0-5
  featureHighlightStyle?: 'highlight' | 'box'; // Estilo de resaltado
  featureHighlightBgColor?: string; // Color de fondo del resaltado
  featureHighlightBgColorDark?: string; // Color de fondo modo oscuro
  featureHighlightTextColor?: string; // Color del texto
  featureHighlightTextColorDark?: string; // Color del texto modo oscuro
  featureHighlightBorderColor?: string; // Color del borde
  featureHighlightBorderColorDark?: string; // Color del borde modo oscuro
  featureHighlightShowBorder?: boolean; // Mostrar borde (modo claro)
  featureHighlightShowBorderDark?: boolean; // Mostrar borde (modo oscuro)
  // Gradiente para fondo de características
  featureHighlightBgGradient?: boolean;
  featureHighlightBgGradientFrom?: string;
  featureHighlightBgGradientTo?: string;
  featureHighlightBgGradientDir?: string;
  featureHighlightBgGradientDark?: boolean;
  featureHighlightBgGradientFromDark?: string;
  featureHighlightBgGradientToDark?: string;
  featureHighlightBgGradientDirDark?: string;
  
  // Precio
  showPrice?: boolean;
  
  // Tags/Etiquetas
  showTags?: boolean;
  maxTags?: number; // 0-5
  
  // Botón
  showButton?: boolean;
  
  // Altura mínima de tarjeta para uniformidad
  minCardHeight?: string;
}

interface CardDesignConfig {
  borderRadius?: string;
  imageHeight?: string;
  imageObjectFit?: 'cover' | 'contain' | 'fill';
  titleColor?: string;
  titleColorDark?: string;
  titleHoverColor?: string;
  priceColor?: string;
  featuredBadge?: {
    text?: string;
    gradient?: string;
    icon?: string;
    iconColor?: string;
    color1?: string;
    color2?: string;
  };
  buttonText?: string;
  buttonIcon?: string;
  buttonIconPosition?: 'left' | 'right' | 'none';
  buttonGradient?: string;
  buttonBorderRadius?: string;
  transparentCards?: boolean;
  // Tipografía
  titleFontFamily?: string;
  titleFontWeight?: string;
  descriptionFontFamily?: string;
  descriptionFontWeight?: string;
  // Nueva configuración de contenido
  contentConfig?: CardContentConfig;
}

interface ServicioPublicCardProps {
  servicio: Servicio;
  featured?: boolean;
  showPrice?: boolean;
  className?: string;
  cardConfig?: CardDesignConfig;
  currentTheme?: 'light' | 'dark';
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServicioPublicCard: React.FC<ServicioPublicCardProps> = ({
  servicio,
  featured = false,
  showPrice = true,
  className = '',
  cardConfig,
  currentTheme = 'light'
}) => {
  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  const formatPrice = () => {
    if (!showPrice) return null;
    
    // ✅ Usar configuración centralizada para símbolos de moneda
    const getCurrencySymbol = (moneda?: string): string => {
      const code = moneda?.toUpperCase() || SITE_CONFIG.defaultCurrency;
      return SITE_CONFIG.currencySymbols[code] || SITE_CONFIG.currencySymbols[SITE_CONFIG.defaultCurrency];
    };
    
    const symbol = getCurrencySymbol(servicio.moneda);
    
    switch (servicio.tipoPrecio) {
      case 'fijo':
        return (
          <div className="text-2xl font-bold text-purple-600">
            {symbol} {servicio.precio?.toLocaleString()}
          </div>
        );
      case 'desde':
        return (
          <div className="text-2xl font-bold text-purple-600">
            Desde {symbol} {servicio.precio?.toLocaleString()}
          </div>
        );
      case 'rango':
        return (
          <div className="text-lg font-semibold text-purple-600">
            {symbol} {servicio.precioMin?.toLocaleString()} - {symbol} {servicio.precioMax?.toLocaleString()}
          </div>
        );
      case 'paquetes':
        return (
          <div className="text-lg font-semibold text-purple-600">
            Desde {symbol} {servicio.precioMin?.toLocaleString()}
          </div>
        );
      case 'suscripcion':
        return (
          <div className="text-lg font-semibold text-purple-600">
            {symbol} {servicio.precio?.toLocaleString()}/mes
          </div>
        );
      case 'consultar':
        return (
          <div className="text-lg font-semibold text-gray-600">
            Consultar precio
          </div>
        );
      case 'personalizado':
        return (
          <div className="text-lg font-semibold text-gray-600">
            Precio personalizado
          </div>
        );
      default:
        return null;
    }
  };

  // Función para obtener el color de la categoría (compatible con string y objeto)
  const getCategoryColor = (categoria: any) => {
    // Si es un objeto categoría, usar su color
    if (categoria && typeof categoria === 'object' && categoria.color) {
      return `text-white`;
    }
    
    // Fallback para categorías string (legacy)
    const categoriaStr = typeof categoria === 'string' ? categoria : categoria?.nombre || 'otro';
    const colors = {
      desarrollo: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      marketing: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      diseño: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
      consultoria: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      mantenimiento: 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200',
      otro: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
    };
    return colors[categoriaStr as keyof typeof colors] || colors.otro;
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoria: any) => {
    if (!categoria) return 'Sin categoría';
    
    // Si es un objeto categoría
    if (typeof categoria === 'object' && categoria.nombre) {
      return categoria.nombre;
    }
    
    // Si es un string (legacy)
    if (typeof categoria === 'string') {
      return categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }
    
    return 'Sin categoría';
  };

  // ============================================
  // RENDER
  // ============================================

  // Obtener configuración de contenido con valores por defecto
  const content = cardConfig?.contentConfig || {};
  const showImage = content.showImage !== false; // true por defecto
  const showFeaturedBadge = content.showFeaturedBadge !== false; // true por defecto
  const showCategory = content.showCategory !== false; // true por defecto
  const showDescription = content.showDescription !== false; // true por defecto
  const showFeatures = content.showFeatures !== false; // true por defecto
  const showTags = content.showTags ?? false; // false por defecto para uniformidad
  const showButton = content.showButton !== false; // true por defecto
  const showPriceConfig = content.showPrice !== false; // true por defecto
  
  const titleMaxLines = content.titleMaxLines || 2;
  const descriptionMaxLines = content.descriptionMaxLines || 2;
  const maxFeatures = content.maxFeatures ?? 3;
  const maxTags = content.maxTags ?? 3;

  // Determinar si las tarjetas deben ser transparentes
  const isTransparent = cardConfig?.transparentCards && featured;
  
  // Clase para limitar líneas de texto
  const getLineClampClass = (lines: number) => {
    switch(lines) {
      case 1: return 'line-clamp-1';
      case 2: return 'line-clamp-2';
      case 3: return 'line-clamp-3';
      default: return 'line-clamp-2';
    }
  };
  
  return (
    <div 
      className={`
        group relative transition-all duration-500 hover-lift overflow-hidden flex flex-col
        ${isTransparent 
          ? 'bg-white/10 dark:bg-gray-900/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50' 
          : 'bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800'
        }
        ${featured ? 'ring-2 ring-purple-500 ring-opacity-50 hover-glow' : ''}
        ${className}
      `}
      style={{
        borderRadius: cardConfig?.borderRadius || '0.75rem',
        minHeight: content.minCardHeight || undefined
      }}
    >
      {/* Badge de destacado - solo si está configurado para mostrarse */}
      {servicio.destacado && showFeaturedBadge && (
        <div className="absolute top-4 right-4 z-10">
          <span 
            className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
            style={{
              background: cardConfig?.featuredBadge?.gradient || 'linear-gradient(90deg, #8B5CF6, #EC4899)'
            }}
          >
            <span style={{ color: cardConfig?.featuredBadge?.iconColor || '#fbbf24' }}>
              {cardConfig?.featuredBadge?.icon || '★'}
            </span>
            <span>{cardConfig?.featuredBadge?.text || 'Destacado'}</span>
          </span>
        </div>
      )}

      {/* Imagen principal - solo si está configurado para mostrarse */}
      {showImage && (
        <div 
          className="relative bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 overflow-hidden flex-shrink-0"
          style={{
            height: content.imageHeight || cardConfig?.imageHeight || '12rem'
          }}
        >
          {servicio.imagen ? (
            <img
              src={servicio.imagen}
              alt={servicio.titulo}
              className="w-full h-full group-hover:scale-110 transition-transform duration-300"
              style={{
                objectFit: cardConfig?.imageObjectFit || 'cover'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="text-6xl opacity-80"
                style={{ color: servicio.colorIcono || '#8B5CF6' }}
              >
                {servicio.icono || '🚀'}
              </div>
            </div>
          )}
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Categoría - solo si está configurado */}
        {showCategory && (
          <div className="flex items-center justify-between mb-3">
            <span 
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(servicio.categoria)}`}
              style={{
                backgroundColor: servicio.categoria?.color || undefined,
                color: servicio.categoria?.color ? 'white' : undefined
              }}
            >
              {servicio.categoria?.icono && (
                <span className="mr-1">{servicio.categoria.icono}</span>
              )}
              {getCategoryName(servicio.categoria)}
            </span>
            
            {servicio.requiereContacto && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                💬 Consulta
              </span>
            )}
          </div>
        )}

        {/* Título - siempre visible pero con líneas configurables */}
        <h3 
          className={`text-xl mb-3 ${getLineClampClass(titleMaxLines)} transition-colors text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400`}
          style={{
            fontFamily: cardConfig?.titleFontFamily || 'inherit',
            fontWeight: cardConfig?.titleFontWeight || '700',
            ...(cardConfig?.titleColor ? { color: cardConfig.titleColor } : {})
          }}
          onMouseEnter={(e) => {
            if (cardConfig?.titleHoverColor) {
              e.currentTarget.style.color = cardConfig.titleHoverColor;
            }
          }}
          onMouseLeave={(e) => {
            if (cardConfig?.titleHoverColor) {
              e.currentTarget.style.color = cardConfig?.titleColor || '';
            }
          }}
        >
          {servicio.titulo}
        </h3>

        {/* Descripción corta - solo si está configurado */}
        {showDescription && (
          <p 
            className={`text-gray-600 dark:text-gray-300 text-sm mb-4 ${getLineClampClass(descriptionMaxLines)}`}
            style={{
              fontFamily: cardConfig?.descriptionFontFamily || 'inherit',
              fontWeight: cardConfig?.descriptionFontWeight || '400'
            }}
          >
            {servicio.descripcionCorta || servicio.descripcion}
          </p>
        )}

        {/* Características destacadas - solo si está configurado y hay características */}
        {showFeatures && maxFeatures > 0 && servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {servicio.caracteristicas.slice(0, maxFeatures).map((caracteristica, idx) => {
                // Función para convertir dirección a CSS
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
                
                // Obtener fondo (gradiente o sólido) según el tema
                const getBgStyle = () => {
                  if (currentTheme === 'dark') {
                    if (content.featureHighlightBgGradientDark) {
                      const from = content.featureHighlightBgGradientFromDark || '#581C87';
                      const to = content.featureHighlightBgGradientToDark || '#7C3AED';
                      const dir = getGradientDirection(content.featureHighlightBgGradientDirDark || 'to-r');
                      return `linear-gradient(${dir}, ${from}, ${to})`;
                    }
                    return content.featureHighlightBgColorDark || '#581C87';
                  } else {
                    if (content.featureHighlightBgGradient) {
                      const from = content.featureHighlightBgGradientFrom || '#F3E8FF';
                      const to = content.featureHighlightBgGradientTo || '#E9D5FF';
                      const dir = getGradientDirection(content.featureHighlightBgGradientDir || 'to-r');
                      return `linear-gradient(${dir}, ${from}, ${to})`;
                    }
                    return content.featureHighlightBgColor || '#F3E8FF';
                  }
                };
                
                const bgStyle = getBgStyle();
                
                const textColor = currentTheme === 'dark'
                  ? (content.featureHighlightTextColorDark || '#E9D5FF')
                  : (content.featureHighlightTextColor || '#6B21A8');
                
                // Verificar si se debe mostrar borde
                const showBorder = currentTheme === 'dark'
                  ? (content.featureHighlightShowBorderDark !== false)
                  : (content.featureHighlightShowBorder !== false);
                
                const borderColor = showBorder 
                  ? (currentTheme === 'dark'
                      ? (content.featureHighlightBorderColorDark || '#7C3AED')
                      : (content.featureHighlightBorderColor || '#C084FC'))
                  : 'transparent';
                
                // Determinar estilo: 'highlight' (resaltado) o 'box' (caja)
                const isBoxStyle = content.featureHighlightStyle === 'box';
                
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
                      borderColor: borderColor
                    } : {
                      // Estilo Resaltado/Highlighter
                      color: textColor,
                      background: bgStyle,
                      padding: '0.1em 0.35em',
                      borderRadius: '0.2em',
                      boxDecorationBreak: 'clone',
                      WebkitBoxDecorationBreak: 'clone',
                      lineHeight: '1.5',
                      borderWidth: showBorder ? '1px' : '0',
                      borderStyle: 'solid',
                      borderColor: borderColor
                    }}
                  >
                    ✓ {caracteristica}
                  </span>
                );
              })}
              {servicio.caracteristicas.length > maxFeatures && (
                <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                  +{servicio.caracteristicas.length - maxFeatures} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Espaciador flexible para empujar el footer hacia abajo */}
        <div className="flex-1"></div>

        {/* Footer con precio y botón */}
        <div className="flex items-center justify-between mt-auto">
          {/* Precio - solo si está configurado */}
          {showPrice && showPriceConfig && (
            <div className="flex-1">
              {formatPrice()}
            </div>
          )}
          
          {/* Si no hay precio, añadir espacio */}
          {(!showPrice || !showPriceConfig) && <div className="flex-1"></div>}
          
          {/* Botón - solo si está configurado */}
          {showButton && (
            <Link
              to={`/servicios/${servicio.slug || servicio._id}`}
              onClick={() => {
                // Ensure scroll to top when navigating
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="
                text-white px-4 py-2 font-medium
                transition-all duration-200 transform hover:scale-105
                shadow-lg hover:shadow-xl
                text-sm flex items-center gap-2
              "
              style={{
                background: cardConfig?.buttonGradient || 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
                borderRadius: cardConfig?.buttonBorderRadius || '0.5rem'
              }}
            >
              {cardConfig?.buttonIconPosition === 'left' && (
                <span>{cardConfig?.buttonIcon || '→'}</span>
              )}
              <span>{cardConfig?.buttonText || 'Ver detalles'}</span>
              {(cardConfig?.buttonIconPosition === 'right' || (!cardConfig?.buttonIconPosition && cardConfig?.buttonIconPosition !== 'none')) && (
                <span>{cardConfig?.buttonIcon || '→'}</span>
              )}
            </Link>
          )}
        </div>

        {/* Etiquetas - solo si está configurado */}
        {showTags && maxTags > 0 && servicio.etiquetas && servicio.etiquetas.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-1">
              {servicio.etiquetas.slice(0, maxTags).map((etiqueta, idx) => (
                <span
                  key={idx}
                  className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full"
                >
                  #{etiqueta}
                </span>
              ))}
              {servicio.etiquetas.length > maxTags && (
                <span className="text-xs text-gray-400 px-1">
                  +{servicio.etiquetas.length - maxTags}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ⚡ Optimización: Memo para prevenir re-renders innecesarios
export default memo(ServicioPublicCard);