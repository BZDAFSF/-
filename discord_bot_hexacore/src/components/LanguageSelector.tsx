import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../utils/languages';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('english')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
          language === 'english'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => handleLanguageChange('arabic')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
          language === 'arabic'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        🇸🇦 AR
      </button>
    </div>
  );
}
