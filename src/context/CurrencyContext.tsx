import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode, CurrencyInfo } from '../types';
import { DEFAULT_CURRENCY, CURRENCIES_CONFIG, formatCurrencyPrice } from '../config';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (basePriceMAD: number) => string;
  getPriceDetails: (basePriceMAD: number) => { formatted: string; amount: number; isBaseCurrency: boolean };
  currentCurrencyInfo: CurrencyInfo;
  availableCurrencies: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'nexivo_selected_currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = (localStorage.getItem(STORAGE_KEY) || localStorage.getItem('zalyvo_selected_currency')) as CurrencyCode | null;
      if (saved && saved in CURRENCIES_CONFIG) {
        return saved;
      }
    }
    return DEFAULT_CURRENCY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // Ignore storage errors in sandboxed environments
    }
  }, [currency]);

  const setCurrency = (code: CurrencyCode) => {
    if (code in CURRENCIES_CONFIG) {
      setCurrencyState(code);
    }
  };

  const formatPrice = (basePriceMAD: number): string => {
    return formatCurrencyPrice(basePriceMAD, currency).formatted;
  };

  const getPriceDetails = (basePriceMAD: number) => {
    return formatCurrencyPrice(basePriceMAD, currency);
  };

  const currentCurrencyInfo = CURRENCIES_CONFIG[currency];
  const availableCurrencies = Object.values(CURRENCIES_CONFIG);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        getPriceDetails,
        currentCurrencyInfo,
        availableCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
