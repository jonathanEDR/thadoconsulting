import React from 'react';
import type { CardDesignStyles } from '../../../../types/cms';
import type { ValueAddedItem } from '../types';
import { cleanHtmlToText, getSafeStyle } from '../utils';
import { CardIcon } from './CardIcon';

interface ValueCardProps {
  valueItem: ValueAddedItem;
  theme: 'light' | 'dark';
  cardStyles: CardDesignStyles;
  showIcons: boolean;
  index: number;
  isVisible: boolean;
}

export const ValueCard = ({
  valueItem,
  theme,
  cardStyles,
  showIcons,
  index,
  isVisible
}: ValueCardProps) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Detectar si el fondo es transparente para usar borde CSS real
  const isTransparentBackground = cardStyles.background === 'transparent' ||
    cardStyles.background?.includes('transparent') ||
    cardStyles.background?.includes('rgba') && cardStyles.background?.includes(', 0)');

  // Extraer color sólido del borde (puede ser gradiente o color sólido)
  const getBorderColor = (border: string | undefined): string => {
    if (!border) return '#667eea';
    // Si es un color hexadecimal o rgb, usarlo directamente
    if (border.startsWith('#') || border.startsWith('rgb')) return border;
    // Si es gradiente, extraer el primer color
    const colorMatch = border.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\)/);
    return colorMatch ? colorMatch[0] : '#667eea';
  };

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'translateY(-8px)';
    card.style.boxShadow = cardStyles.hoverShadow || '0 20px 40px rgba(139, 92, 246, 0.15)';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = cardStyles.shadow || '0 8px 16px rgba(0, 0, 0, 0.1)';
  };

  // Obtener color del icono según el tema
  const iconColor = theme === 'dark' 
    ? (valueItem.iconColorDark || '#818cf8') 
    : (valueItem.iconColorLight || '#6366f1');

  // Si el fondo es transparente, usar estructura simple con borde CSS real
  if (isTransparentBackground) {
    return (
      <div
        ref={cardRef}
        className={`relative rounded-2xl value-card flex-shrink-0 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          animationDelay: `${index * 200 + 600}ms`,
          background: 'transparent',
          border: `${cardStyles.borderWidth || '2px'} solid ${getBorderColor(cardStyles.border)}`,
          boxShadow: cardStyles.shadow,
          maxWidth: '100%',
          minHeight: getSafeStyle(cardStyles.cardMinHeight, 'auto'),
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, opacity 0.5s ease',
          cursor: 'pointer',
          willChange: 'transform'
        } as React.CSSProperties}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative z-10 h-full"
          style={{
            padding: getSafeStyle(cardStyles.cardPadding, '2rem')
          }}
        >
          {showIcons && valueItem.iconName && (
            <CardIcon
              iconName={valueItem.iconName}
              iconColor={iconColor}
              cardStyles={cardStyles}
            />
          )}

          <h3
            className="text-xl font-bold mb-4 transition-colors duration-300"
            style={{
              color: getSafeStyle(
                valueItem.styles?.[theme]?.titleColor,
                cardStyles.titleColor ?? '#1f2937'
              ),
              textAlign: cardStyles.iconAlignment || 'left'
            }}
          >
            {cleanHtmlToText(valueItem.title)}
          </h3>

          <p
            className="text-sm leading-relaxed"
            style={{
              color: getSafeStyle(
                valueItem.styles?.[theme]?.descriptionColor,
                cardStyles.descriptionColor ?? '#6b7280'
              ),
              textAlign: cardStyles.iconAlignment || 'left',
              lineHeight: '1.6'
            }}
          >
            {cleanHtmlToText(valueItem.description)}
          </p>

          {/* Enlace "Conocer más" */}
          {valueItem.buttonUrl ? (
            <a
              href={valueItem.buttonUrl}
              target={valueItem.buttonUrl.startsWith('http') ? '_blank' : '_self'}
              rel={valueItem.buttonUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center mt-4 group/link cursor-pointer no-underline"
              style={{ justifyContent: cardStyles.iconAlignment === 'center' ? 'center' : cardStyles.iconAlignment === 'right' ? 'flex-end' : 'flex-start' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="text-sm font-medium mr-2 transition-all duration-300 group-hover/link:mr-3"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                {valueItem.buttonText || 'Conocer más'}
              </span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <div
              className="flex items-center mt-4 group/link cursor-pointer"
              style={{ justifyContent: cardStyles.iconAlignment === 'center' ? 'center' : cardStyles.iconAlignment === 'right' ? 'flex-end' : 'flex-start' }}
            >
              <span
                className="text-sm font-medium mr-2 transition-all duration-300 group-hover/link:mr-3"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                {valueItem.buttonText || 'Conocer más'}
              </span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Estructura original con "truco de padding" para bordes con gradiente
  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden value-card flex-shrink-0 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        animationDelay: `${index * 200 + 600}ms`,
        background: cardStyles.border || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: cardStyles.borderWidth || '2px',
        boxShadow: cardStyles.shadow,
        maxWidth: '100%',
        minHeight: getSafeStyle(cardStyles.cardMinHeight, 'auto'),
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, opacity 0.5s ease',
        cursor: 'pointer',
        willChange: 'transform'
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="card-content relative rounded-xl h-full overflow-hidden"
        style={{
          background: cardStyles.background || 'rgba(255, 255, 255, 0.9)',
          borderRadius: `calc(1rem - ${cardStyles.borderWidth || '2px'})`,
        }}
      >
        <div
          className="relative z-10 h-full"
          style={{
            padding: getSafeStyle(cardStyles.cardPadding, '2rem')
          }}
        >
          {showIcons && valueItem.iconName && (
            <CardIcon
              iconName={valueItem.iconName}
              iconColor={iconColor}
              cardStyles={cardStyles}
            />
          )}

          <h3
            className="text-xl font-bold mb-4 transition-colors duration-300"
            style={{
              color: getSafeStyle(
                valueItem.styles?.[theme]?.titleColor,
                cardStyles.titleColor ?? '#1f2937'
              ),
              textAlign: cardStyles.iconAlignment || 'left'
            }}
          >
            {cleanHtmlToText(valueItem.title)}
          </h3>

          <p
            className="text-sm leading-relaxed"
            style={{
              color: getSafeStyle(
                valueItem.styles?.[theme]?.descriptionColor,
                cardStyles.descriptionColor ?? '#6b7280'
              ),
              textAlign: cardStyles.iconAlignment || 'left',
              lineHeight: '1.6'
            }}
          >
            {cleanHtmlToText(valueItem.description)}
          </p>

          {/* Enlace "Conocer más" */}
          {valueItem.buttonUrl ? (
            <a
              href={valueItem.buttonUrl}
              target={valueItem.buttonUrl.startsWith('http') ? '_blank' : '_self'}
              rel={valueItem.buttonUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center mt-4 group/link cursor-pointer no-underline"
              style={{ justifyContent: cardStyles.iconAlignment === 'center' ? 'center' : cardStyles.iconAlignment === 'right' ? 'flex-end' : 'flex-start' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="text-sm font-medium mr-2 transition-all duration-300 group-hover/link:mr-3"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                {valueItem.buttonText || 'Conocer más'}
              </span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <div
              className="flex items-center mt-4 group/link cursor-pointer"
              style={{ justifyContent: cardStyles.iconAlignment === 'center' ? 'center' : cardStyles.iconAlignment === 'right' ? 'flex-end' : 'flex-start' }}
            >
              <span
                className="text-sm font-medium mr-2 transition-all duration-300 group-hover/link:mr-3"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                {valueItem.buttonText || 'Conocer más'}
              </span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: cardStyles.linkColor || '#8B5CF6' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
