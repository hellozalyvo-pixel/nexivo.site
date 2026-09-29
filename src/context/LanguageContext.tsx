import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, LanguageInfo } from '../types';
import {
  LANGUAGES_CONFIG,
  TRANSLATIONS,
  getServicesData,
  getTimelineData,
  getWhyNexivoData,
  getWhyZalyvoData,
  getDemoProjectsData,
  getFaqData,
  getPricingPlans,
  getHostingDurations,
  getSupplements,
} from '../translations/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguageInfo: LanguageInfo;
  availableLanguages: LanguageInfo[];
  t: typeof TRANSLATIONS.fr;
  servicesData: ReturnType<typeof getServicesData>;
  timelineData: ReturnType<typeof getTimelineData>;
  whyData: ReturnType<typeof getWhyNexivoData>;
  whyNexivoData: ReturnType<typeof getWhyNexivoData>;
  whyZalyvoData: ReturnType<typeof getWhyZalyvoData>;
  demoProjectsData: ReturnType<typeof getDemoProjectsData>;
  faqData: ReturnType<typeof getFaqData>;
  pricingPlans: ReturnType<typeof getPricingPlans>;
  hostingDurations: ReturnType<typeof getHostingDurations>;
  supplementsData: ReturnType<typeof getSupplements>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'nexivo_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = (localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem('zalyvo_language')) as LanguageCode | null;
      if (stored === 'fr' || stored === 'en') {
        return stored;
      }
      // Check browser language preference if available
      if (navigator.language && navigator.language.startsWith('en')) {
        return 'en';
      }
    }
    return 'fr';
  });

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const currentLanguageInfo = LANGUAGES_CONFIG[language];
  const availableLanguages = Object.values(LANGUAGES_CONFIG);
  const t = TRANSLATIONS[language];

  const servicesData = getServicesData(language);
  const timelineData = getTimelineData(language);
  const whyData = getWhyZalyvoData(language);
  const demoProjectsData = getDemoProjectsData(language);
  const faqData = getFaqData(language);
  const pricingPlans = getPricingPlans(language);
  const hostingDurations = getHostingDurations(language);
  const supplementsData = getSupplements(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageInfo,
        availableLanguages,
        t,
        servicesData,
        timelineData,
        whyData,
        whyNexivoData: whyData,
        whyZalyvoData: whyData,
        demoProjectsData,
        faqData,
        pricingPlans,
        hostingDurations,
        supplementsData,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
