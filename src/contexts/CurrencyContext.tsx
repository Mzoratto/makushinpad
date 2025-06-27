import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'CZK' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, targetCurrency?: Currency) => string;
  convertPrice: (price: number, fromCurrency: Currency, toCurrency: Currency) => number;
  getCurrencySymbol: (currency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fixed exchange rates based on the requirements
const EXCHANGE_RATES = {
  CZK_TO_EUR: 0.04, // 25 CZK = 1 EUR
  EUR_TO_CZK: 25,
};

// Fixed pricing structure as specified in requirements
const FIXED_PRICES = {
  main_product_czk_s: 799,
  main_product_eur_s: 32,
  main_product_czk_m: 899,
  main_product_eur_m: 36,
  customize_product_czk: 999,
  customize_product_eur: 40,
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  // Default to CZK as specified in requirements
  const [currency, setCurrencyState] = useState<Currency>('CZK');

  // Load currency preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('shinshop-currency') as Currency;
      if (savedCurrency && (savedCurrency === 'CZK' || savedCurrency === 'EUR')) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

  // Save currency preference to localStorage when changed
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shinshop-currency', newCurrency);
    }
  };

  // Convert price between currencies using fixed rates
  const convertPrice = (price: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return price;

    if (fromCurrency === 'CZK' && toCurrency === 'EUR') {
      return price * EXCHANGE_RATES.CZK_TO_EUR;
    } else if (fromCurrency === 'EUR' && toCurrency === 'CZK') {
      return price * EXCHANGE_RATES.EUR_TO_CZK;
    }

    return price;
  };

  // Get currency symbol
  const getCurrencySymbol = (targetCurrency?: Currency): string => {
    const curr = targetCurrency || currency;
    return curr === 'CZK' ? 'Kč' : '€';
  };

  // Format price with proper currency symbol and positioning
  const formatPrice = (price: number, targetCurrency?: Currency): string => {
    const curr = targetCurrency || currency;
    const symbol = getCurrencySymbol(curr);

    if (curr === 'CZK') {
      // Czech format: "899 Kč"
      return `${Math.round(price)} ${symbol}`;
    } else {
      // EUR format: "35,00 €" (European standard with comma decimal separator)
      return `${price.toFixed(2).replace('.', ',')} ${symbol}`;
    }
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    getCurrencySymbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    // During SSR or when not wrapped in provider, return default values
    return {
      currency: 'CZK', // Default to CZK as specified in requirements
      setCurrency: () => {},
      formatPrice: (price: number, targetCurrency?: Currency) => {
        const curr = targetCurrency || 'CZK';
        if (curr === 'CZK') {
          return `${Math.round(price)} Kč`;
        } else {
          return `${price.toFixed(2).replace('.', ',')} €`;
        }
      },
      convertPrice: (price: number, fromCurrency: Currency, toCurrency: Currency) => {
        if (fromCurrency === toCurrency) return price;
        if (fromCurrency === 'CZK' && toCurrency === 'EUR') {
          return price * 0.04;
        } else if (fromCurrency === 'EUR' && toCurrency === 'CZK') {
          return price * 25;
        }
        return price;
      },
      getCurrencySymbol: (currency?: Currency) => {
        const curr = currency || 'CZK';
        return curr === 'CZK' ? 'Kč' : '€';
      },
    };
  }
  return context;
};

// Helper function to get the appropriate price based on product type and currency
export const getProductPrice = (
  productType: 'main' | 'customize',
  size: 'S' | 'M',
  currency: Currency
): number => {
  if (productType === 'main') {
    if (currency === 'CZK') {
      return size === 'S' ? FIXED_PRICES.main_product_czk_s : FIXED_PRICES.main_product_czk_m;
    } else {
      return size === 'S' ? FIXED_PRICES.main_product_eur_s : FIXED_PRICES.main_product_eur_m;
    }
  } else {
    // Customize products have fixed pricing regardless of size
    if (currency === 'CZK') {
      return FIXED_PRICES.customize_product_czk;
    } else {
      return FIXED_PRICES.customize_product_eur;
    }
  }
};
