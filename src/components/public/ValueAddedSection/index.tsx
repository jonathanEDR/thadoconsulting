import { useTheme } from '../../../contexts/ThemeContext';
import type { ValueAddedSectionProps } from './types';
import { useValueAddedData } from './hooks/useValueAddedData';
import { useAnimations } from './hooks/useAnimations';
import { BackgroundImage } from './components/BackgroundImage';
import { SectionHeader } from './components/SectionHeader';
import { LogosSection } from './components/LogosSection';
import { ValueCard } from './components/ValueCard';
import './styles/animations.css';

const ValueAddedSection = ({ data, themeConfig: _themeConfig }: ValueAddedSectionProps) => {
  const { theme } = useTheme();
  const { isVisible } = useAnimations();
  const { mappedData, cardStyles, currentBackgroundImage, valueItems } = useValueAddedData(data, theme);

  return (
    <section
      className="relative py-32 theme-transition overflow-hidden w-full"
      style={{
        background: `linear-gradient(to bottom, color-mix(in srgb, var(--color-card-bg) 95%, var(--color-primary)), var(--color-card-bg))`,
        minHeight: '70vh'
      }}
    >
      <BackgroundImage
        imageUrl={currentBackgroundImage}
        alt={mappedData.backgroundImageAlt}
      />

      {/* Burbujas flotantes en toda la sección */}
      <LogosSection logos={mappedData.logos || []} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={mappedData.title}
          subtitle={mappedData.subtitle}
          theme={theme}
          isVisible={isVisible}
        />

        {/* ✨ Grid responsive de tarjetas - Mobile: 1, Tablet: 2, Desktop: 3 */}
        <div
          className={`
            grid gap-6 sm:gap-8
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            transition-all duration-700
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {valueItems.map((valueItem, index) => {
            // Generar key única robusta - manejar MongoDB ObjectId
            let itemId: string | null = null;
            if (valueItem._id) {
              if (typeof valueItem._id === 'string') {
                itemId = valueItem._id;
              } else if (valueItem._id && typeof valueItem._id === 'object') {
                const idObj = valueItem._id as any;
                if (idObj.$oid) {
                  itemId = idObj.$oid;
                } else if (typeof idObj.toString === 'function' && idObj.toString() !== '[object Object]') {
                  itemId = idObj.toString();
                } else if (idObj.id) {
                  itemId = String(idObj.id);
                }
              } else {
                itemId = String(valueItem._id);
              }
            } else if (valueItem.id) {
              if (typeof valueItem.id === 'string') {
                itemId = valueItem.id;
              } else if (valueItem.id && typeof valueItem.id === 'object') {
                const idObj = valueItem.id as any;
                if (idObj.$oid) {
                  itemId = idObj.$oid;
                } else if (typeof idObj.toString === 'function' && idObj.toString() !== '[object Object]') {
                  itemId = idObj.toString();
                } else if (idObj.id) {
                  itemId = String(idObj.id);
                }
              } else {
                itemId = String(valueItem.id);
              }
            }

            const titleSlug = valueItem.title?.toLowerCase().replace(/\s+/g, '-').slice(0, 30) || 'item';
            const uniqueKey = itemId || `value-card-${titleSlug}-${index}`;

            return (
              <ValueCard
                key={uniqueKey}
                valueItem={valueItem}
                theme={theme}
                cardStyles={cardStyles}
                showIcons={mappedData.showIcons !== false}
                index={index}
                isVisible={isVisible}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueAddedSection;
