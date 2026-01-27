import type { CardDesignStyles } from '../../../../types/cms';

interface CardIconProps {
  iconData: { type: 'image' | 'none'; value: string | null };
  cardStyles: CardDesignStyles;
  title: string;
}

export const CardIcon = ({ iconData, cardStyles, title }: CardIconProps) => {
  if (iconData.type !== 'image' || !iconData.value) return null;

  return (
    <div className={`mb-6 flex ${cardStyles.iconAlignment === 'center' ? 'justify-center' : cardStyles.iconAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          background: cardStyles.iconBackground,
          border: cardStyles.iconBorderEnabled ? `2px solid ${cardStyles.iconColor}` : 'none'
        }}
      >
        <img 
          src={iconData.value}
          alt={`Icono ${title}`}
          className="w-10 h-10 object-contain"
          style={{
            filter: `hue-rotate(0deg) saturate(1) brightness(1)`
          }}
        />
      </div>
    </div>
  );
};
