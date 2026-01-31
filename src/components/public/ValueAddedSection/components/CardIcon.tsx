import DynamicIcon from '../../../ui/DynamicIcon';
import type { CardDesignStyles } from '../../../../types/cms';

interface CardIconProps {
  iconName?: string;
  iconColor?: string;
  cardStyles: CardDesignStyles;
}

export const CardIcon = ({ iconName, iconColor, cardStyles }: CardIconProps) => {
  // Si no hay iconName, no mostrar nada
  if (!iconName) return null;

  return (
    <div className={`mb-6 flex ${
      cardStyles.iconAlignment === 'center' 
        ? 'justify-center' 
        : cardStyles.iconAlignment === 'right' 
        ? 'justify-end' 
        : 'justify-start'
    }`}>
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          background: cardStyles.iconBackground || 'rgba(139, 92, 246, 0.1)',
          border: cardStyles.iconBorderEnabled 
            ? `2px solid ${iconColor || cardStyles.iconColor || '#8B5CF6'}` 
            : 'none'
        }}
      >
        <DynamicIcon
          name={iconName}
          size={32}
          color={iconColor || cardStyles.iconColor || '#8B5CF6'}
          strokeWidth={2}
        />
      </div>
    </div>
  );
};
