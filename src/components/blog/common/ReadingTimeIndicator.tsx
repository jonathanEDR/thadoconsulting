/**
 * ⏱️ ReadingTimeIndicator Component
 * Indicador visual del tiempo de lectura estimado
 * Soporta estilos personalizados desde CMS
 */

import { Clock, BookOpen } from 'lucide-react';
import { formatReadingTime, classifyArticleLength, getArticleLengthLabel } from '../../../utils/blog';

interface ReadingTimeIndicatorProps {
  minutes: number;
  variant?: 'default' | 'detailed' | 'minimal' | 'badge';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
  // Nuevos props para estilos personalizados desde CMS
  textColor?: string;
  iconColor?: string;
}

export default function ReadingTimeIndicator({
  minutes,
  variant = 'default',
  showIcon = true,
  showLabel = false,
  className = '',
  textColor,
  iconColor
}: ReadingTimeIndicatorProps) {
  
  const readingTime = formatReadingTime(minutes);
  const articleLength = classifyArticleLength({ content: '', readingTime: minutes } as any);
  const lengthLabel = getArticleLengthLabel(articleLength);

  // Colores por longitud de artículo
  const lengthColors = {
    quick: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-blue-600 bg-blue-50 border-blue-200',
    long: 'text-orange-600 bg-orange-50 border-orange-200',
    extensive: 'text-red-600 bg-red-50 border-red-200'
  };

  // ============================================
  // VARIANTE BADGE
  // ============================================
  if (variant === 'badge') {
    return (
      <span 
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5
          text-sm font-medium rounded-full
          border ${lengthColors[articleLength]}
          ${className}
        `}
      >
        {showIcon && <Clock className="w-3.5 h-3.5" />}
        <span>{readingTime}</span>
      </span>
    );
  }

  // ============================================
  // VARIANTE MINIMAL - Con soporte para colores personalizados
  // ============================================
  if (variant === 'minimal') {
    return (
      <span 
        className={`inline-flex items-center gap-1 text-sm ${!textColor ? 'text-gray-600' : ''} ${className}`}
        style={textColor ? { color: textColor } : undefined}
      >
        {showIcon && <Clock className="w-3.5 h-3.5" style={iconColor ? { color: iconColor } : undefined} />}
        <span>{readingTime}</span>
      </span>
    );
  }

  // ============================================
  // VARIANTE DETAILED
  // ============================================
  if (variant === 'detailed') {
    return (
      <div className={`inline-flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{readingTime}</p>
            <p className="text-xs text-gray-500">{lengthLabel}</p>
          </div>
        </div>
        <div className="h-10 w-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-xs text-gray-500">Tiempo estimado</p>
            <p className="text-sm font-medium text-gray-900">~{minutes} min</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANTE DEFAULT
  // ============================================
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showIcon && (
        <div className={`p-2 rounded-lg ${lengthColors[articleLength]}`}>
          <Clock className="w-4 h-4" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-900">{readingTime}</p>
        {showLabel && (
          <p className="text-xs text-gray-500">{lengthLabel}</p>
        )}
      </div>
    </div>
  );
}
