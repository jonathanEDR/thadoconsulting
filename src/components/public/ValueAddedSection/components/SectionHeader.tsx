import { cleanHtmlToText } from '../utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  theme: 'light' | 'dark';
  isVisible: boolean;
}

export const SectionHeader = ({ title, subtitle, theme, isVisible }: SectionHeaderProps) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
      <div
        className={`text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 theme-transition transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          lineHeight: '1.2',
          color: '#FFFFFF',
          fontWeight: '700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'
        }}
      >
        {cleanHtmlToText(title)}
      </div>
      {subtitle && (
        <div className="max-w-3xl mx-auto">
          <div
            className={`text-xl theme-transition transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              color: theme === 'light' ? '#E5E7EB' : '#D1D5DB',
              fontWeight: '400',
              lineHeight: '1.6',
              textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
            }}
          >
            {cleanHtmlToText(subtitle || '')}
          </div>
        </div>
      )}
    </div>
  );
};
