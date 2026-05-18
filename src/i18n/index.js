import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import tk from './locales/tk.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tk: { translation: tk },
    ru: { translation: ru },
  },
  lng: localStorage.getItem('lang') || 'tk',
  fallbackLng: 'tk',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;
