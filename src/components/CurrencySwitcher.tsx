import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useCurrency, Currency } from '../contexts/CurrencyContext';
import { safeTranslation } from '../utils/typeUtils';

const CurrencySwitcher: React.FC = () => {
  const { t } = useI18next();
  const { currency, setCurrency } = useCurrency();

  const changeCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => changeCurrency('CZK')}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            currency === 'CZK'
              ? 'bg-white text-primary font-semibold'
              : 'text-white hover:text-gray-200'
          }`}
          title={safeTranslation(t('currency.czech'))}
        >
          CZK
        </button>
        <span className="text-white">|</span>
        <button
          onClick={() => changeCurrency('EUR')}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            currency === 'EUR'
              ? 'bg-white text-primary font-semibold'
              : 'text-white hover:text-gray-200'
          }`}
          title={safeTranslation(t('currency.euro'))}
        >
          EUR
        </button>
      </div>
    </div>
  );
};

export default CurrencySwitcher;
