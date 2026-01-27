import type { CardDesignStyles } from '../../../types/cms';

export const DEFAULT_LIGHT_CARD_STYLES: CardDesignStyles = {
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
  borderWidth: '2px',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  hoverBackground: 'rgba(255, 255, 255, 0.95)',
  hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
  hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
  iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
  iconBackground: 'rgba(255, 255, 255, 0.9)',
  iconColor: '#7528ee',
  titleColor: '#1F2937',
  descriptionColor: '#4B5563',
  linkColor: '#06B6D4',
  cardMinWidth: '280px',
  cardMaxWidth: '350px',
  cardMinHeight: '200px',
  cardPadding: '2rem',
  cardsAlignment: 'center',
  iconBorderEnabled: false,
  iconAlignment: 'center'
};

export const DEFAULT_DARK_CARD_STYLES: CardDesignStyles = {
  background: 'rgba(17, 24, 39, 0.9)',
  border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
  borderWidth: '2px',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  hoverBackground: 'rgba(31, 41, 55, 0.95)',
  hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
  hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
  iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
  iconBackground: 'rgba(17, 24, 39, 0.8)',
  iconColor: '#ffffff',
  titleColor: '#FFFFFF',
  descriptionColor: '#D1D5DB',
  linkColor: '#a78bfa',
  cardMinWidth: '280px',
  cardMaxWidth: '350px',
  cardMinHeight: '200px',
  cardPadding: '2rem',
  cardsAlignment: 'center',
  iconBorderEnabled: false,
  iconAlignment: 'center'
};
