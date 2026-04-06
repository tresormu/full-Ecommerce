import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../../i18n';
import { fetchGeoInfo, type AppCurrency, type AppLanguage } from '../services/geoService';

interface LocaleContextType {
  currency: AppCurrency;
  language: AppLanguage;
  formatPrice: (priceUSD: number, priceEUR: number, priceRWF: number) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  currency: 'USD',
  language: 'en',
  formatPrice: (usd) => `$${usd.toFixed(2)}`,
});

const CURRENCY_FORMAT: Record<AppCurrency, { symbol: string; decimals: number }> = {
  USD: { symbol: '$', decimals: 2 },
  EUR: { symbol: '€', decimals: 2 },
  RWF: { symbol: 'RWF ', decimals: 0 },
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<AppCurrency>('USD');
  const [language, setLanguage] = useState<AppLanguage>('en');

  useEffect(() => {
    fetchGeoInfo().then(({ currency, language }) => {
      setCurrency(currency);
      setLanguage(language);
      i18n.changeLanguage(language);
    });
  }, []);

  const formatPrice = (priceUSD: number, priceEUR: number, priceRWF: number): string => {
    const { symbol, decimals } = CURRENCY_FORMAT[currency];
    const value = currency === 'USD' ? priceUSD : currency === 'EUR' ? priceEUR : priceRWF;
    return `${symbol}${value.toFixed(decimals)}`;
  };

  return (
    <LocaleContext.Provider value={{ currency, language, formatPrice }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
