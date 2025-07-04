import React from 'react';
// Temporary fallback for Phase 1
// import { useI18next } from 'gatsby-plugin-react-i18next';
import { useI18next, useTranslation } from '../utils/i18nFallback';
import { navigate } from 'gatsby';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useI18next();

  const changeLanguage = (language: string) => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    // Remove current language prefix if it exists
    let newPath = currentPath;
    if (currentPath.startsWith('/en/') || currentPath.startsWith('/cz/')) {
      newPath = currentPath.substring(3);
    } else if (currentPath === '/en' || currentPath === '/cz') {
      newPath = '/';
    }
    
    // Add new language prefix (except for default language 'en')
    const finalPath = language === 'en' ? newPath : `/${language}${newPath}`;
    
    i18n.changeLanguage(language);
    navigate(finalPath);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            i18n.language === 'en'
              ? 'bg-white text-primary font-semibold'
              : 'text-white hover:text-gray-200'
          }`}
          title={t('language.english')}
        >
          EN
        </button>
        <span className="text-white">|</span>
        <button
          onClick={() => changeLanguage('cz')}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            i18n.language === 'cz'
              ? 'bg-white text-primary font-semibold'
              : 'text-white hover:text-gray-200'
          }`}
          title={t('language.czech')}
        >
          CZ
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
