import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, getLanguageStrings, LanguageStrings, isRTL } from '../utils/languages';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  strings: LanguageStrings;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('english');
  
  const strings = getLanguageStrings(language);
  const rtl = isRTL(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, strings, isRTL: rtl }}>
      <div dir={rtl ? 'rtl' : 'ltr'} className={rtl ? 'font-arabic' : 'font-english'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
