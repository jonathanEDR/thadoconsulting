import { useMemo } from 'react';
import type { ValueAddedData } from '../types';
import { getMappedValueAddedData, getCardStyles } from '../utils';

export const useValueAddedData = (
  data: ValueAddedData | undefined,
  theme: 'light' | 'dark'
) => {
  const mappedData = useMemo(
    () => data ? getMappedValueAddedData(data) : null,
    [data]
  );

  const cardStyles = useMemo(
    () => data ? getCardStyles(data.cardsDesign, theme) : ({} as ReturnType<typeof getCardStyles>),
    [data?.cardsDesign, theme]
  );

  const currentBackgroundImage = useMemo(() => {
    if (!mappedData?.backgroundImage) return null;
    return theme === 'light'
      ? mappedData.backgroundImage.light
      : mappedData.backgroundImage.dark;
  }, [mappedData?.backgroundImage, theme]);

  const valueItems = mappedData?.cards || [];

  return {
    mappedData,
    cardStyles,
    currentBackgroundImage,
    valueItems
  };
};
