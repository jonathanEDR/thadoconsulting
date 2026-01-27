/**
 * 💰 UTILIDADES DE FORMATO DE MONEDA
 * Helpers para formatear precios según la moneda
 */

export type MonedaType = 'USD' | 'MXN' | 'EUR' | 'PEN';

/**
 * Obtiene el símbolo de la moneda
 */
export const getMonedaSymbol = (moneda: MonedaType): string => {
  const symbols: Record<MonedaType, string> = {
    USD: '$',
    MXN: 'MX$',
    EUR: '€',
    PEN: 'S/'
  };
  return symbols[moneda] || '$';
};

/**
 * Obtiene el nombre completo de la moneda
 */
export const getMonedaName = (moneda: MonedaType): string => {
  const names: Record<MonedaType, string> = {
    USD: 'Dólares',
    MXN: 'Pesos Mexicanos',
    EUR: 'Euros',
    PEN: 'Soles'
  };
  return names[moneda] || 'Dólares';
};

/**
 * Formatea un precio con su moneda
 */
export const formatPrice = (
  price: number,
  moneda: MonedaType = 'PEN',
  options: Intl.NumberFormatOptions = {}
): string => {
  const symbol = getMonedaSymbol(moneda);
  
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };

  const formattedNumber = price.toLocaleString('es-PE', defaultOptions);
  
  // Para PEN y MXN, el símbolo va antes
  if (moneda === 'PEN' || moneda === 'MXN' || moneda === 'USD') {
    return `${symbol} ${formattedNumber}`;
  }
  
  // Para EUR, el símbolo va después
  return `${formattedNumber} ${symbol}`;
};

/**
 * Formatea un rango de precios
 */
export const formatPriceRange = (
  min: number,
  max: number,
  moneda: MonedaType = 'PEN'
): string => {
  const symbol = getMonedaSymbol(moneda);
  return `${symbol} ${min.toLocaleString('es-PE')} - ${symbol} ${max.toLocaleString('es-PE')}`;
};

/**
 * Convierte precio a formato compacto (K, M)
 */
export const formatCompactPrice = (
  price: number,
  moneda: MonedaType = 'PEN'
): string => {
  const symbol = getMonedaSymbol(moneda);
  
  if (price >= 1000000) {
    return `${symbol} ${(price / 1000000).toFixed(1)}M`;
  }
  
  if (price >= 1000) {
    return `${symbol} ${(price / 1000).toFixed(1)}K`;
  }
  
  return `${symbol} ${price.toFixed(0)}`;
};

/**
 * Obtiene el locale apropiado para la moneda
 */
export const getLocaleForMoneda = (moneda: MonedaType): string => {
  const locales: Record<MonedaType, string> = {
    USD: 'en-US',
    MXN: 'es-MX',
    EUR: 'es-ES',
    PEN: 'es-PE'
  };
  return locales[moneda] || 'es-PE';
};
