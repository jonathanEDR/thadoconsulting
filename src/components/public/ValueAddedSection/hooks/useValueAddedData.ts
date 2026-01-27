import { useMemo } from 'react';
import { DEFAULT_VALUE_ADDED_CONFIG } from '../../../../utils/defaultConfig';
import type { ValueAddedData } from '../types';
import { getMappedValueAddedData, getCardStyles } from '../utils';

export const useValueAddedData = (
  data: ValueAddedData | undefined,
  theme: 'light' | 'dark'
) => {
  const valueAddedData = data || DEFAULT_VALUE_ADDED_CONFIG;
  
  const mappedData = useMemo(
    () => getMappedValueAddedData(valueAddedData),
    [valueAddedData]
  );
  
  const cardStyles = useMemo(
    () => getCardStyles(valueAddedData.cardsDesign, theme),
    [valueAddedData.cardsDesign, theme]
  );
  
  const currentBackgroundImage = useMemo(() => {
    if (!mappedData.backgroundImage) return null;
    return theme === 'light' 
      ? mappedData.backgroundImage.light 
      : mappedData.backgroundImage.dark;
  }, [mappedData.backgroundImage, theme]);
  
  const valueItems = mappedData.cards || [];
  
  return {
    mappedData,
    cardStyles,
    currentBackgroundImage,
    valueItems
  };
};
