import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'vi',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        // Xóa đối tượng 'resources' khỏi đây
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
            order: ['localStorage', 'navigator', 'querystring', 'cookie'],
            caches: ['localStorage'],
        },
    });

export default i18n;