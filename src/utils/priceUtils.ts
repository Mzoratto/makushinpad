import { Currency } from '../contexts/CurrencyContext';

// Fixed pricing structure based on requirements
export const PRODUCT_PRICES = {
  // Main products (regular products)
  main: {
    S: { CZK: 799, EUR: 32 },
    M: { CZK: 899, EUR: 36 }
  },
  // Customize products (fixed price regardless of size)
  customize: {
    S: { CZK: 999, EUR: 40 },
    M: { CZK: 999, EUR: 40 }
  }
};

// Legacy pricing for existing products (updated to new pricing structure)
export const LEGACY_PRICES = {
  // Classic Black
  'shin-001': {
    S: { CZK: 799, EUR: 32 },
    M: { CZK: 899, EUR: 36 }
  },
  // Blue Wave
  'shin-002': {
    S: { CZK: 799, EUR: 32 },
    M: { CZK: 899, EUR: 36 }
  }
};

export type ProductSize = 'S' | 'M';
export type ProductType = 'main' | 'customize';

/**
 * Get the price for a specific product, size, and currency
 */
export const getProductPrice = (
  productId: string,
  size: ProductSize,
  currency: Currency,
  productType: ProductType = 'main'
): number => {
  // Check if it's a legacy product first
  if (LEGACY_PRICES[productId as keyof typeof LEGACY_PRICES]) {
    return LEGACY_PRICES[productId as keyof typeof LEGACY_PRICES][size][currency];
  }
  
  // Use new pricing structure
  return PRODUCT_PRICES[productType][size][currency];
};

/**
 * Convert price between currencies using fixed rates
 */
export const convertPrice = (
  price: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return price;

  // Use fixed conversion rates: 25 CZK = 1 EUR
  if (fromCurrency === 'CZK' && toCurrency === 'EUR') {
    return Math.round((price / 25) * 100) / 100; // 25 CZK = 1 EUR
  } else if (fromCurrency === 'EUR' && toCurrency === 'CZK') {
    return Math.round(price * 25);
  }

  return price;
};

/**
 * Format price with proper currency symbol and positioning
 */
export const formatPrice = (price: number, currency: Currency): string => {
  if (currency === 'CZK') {
    // Czech format: "899 Kč"
    return `${Math.round(price)} Kč`;
  } else {
    // EUR format: "35,00 €" (European standard with comma decimal separator)
    return `${price.toFixed(2).replace('.', ',')} €`;
  }
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: Currency): string => {
  return currency === 'CZK' ? 'Kč' : '€';
};

/**
 * Determine if a price should be shown as "From" price (for products with multiple sizes)
 */
export const shouldShowFromPrice = (sizes: Array<{ price: number }>): boolean => {
  if (!sizes || sizes.length <= 1) return false;
  
  // Check if there are different prices
  const prices = sizes.map(size => size.price);
  return new Set(prices).size > 1;
};

/**
 * Get the lowest price from an array of sizes (for "From" pricing)
 */
export const getLowestPrice = (sizes: Array<{ price: number }>): number => {
  if (!sizes || sizes.length === 0) return 0;
  return Math.min(...sizes.map(size => size.price));
};
