import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "vi",
    debug: true,
    interpolation: {
      escapeValue: false, // không cần thiết cho React vì nó tự động thoát
    },
    resources: {
      en: {
        translation: {
          "Journey to restore over 100,000 smiles and improve quality of life since 2004":
            "Hành trình tìm lại hơn 100,000 nụ cười và nâng cao chất lượng sống từ 2004",
        },
      },
      vi: {
        translation: {
          "Journey to restore over 100,000 smiles and improve quality of life since 2004":
            "Hành trình tìm lại hơn 100,000 nụ cười và nâng cao chất lượng sống từ 2004",
        },
      },
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      // Thay đổi thứ tự ưu tiên
      // Lần lượt kiểm tra: localStorage, query string, cookie, ...
      order: ["localStorage", "navigator", "querystring", "cookie"],
      // Tên key dùng để lưu trong localStorage
      caches: ["localStorage"],
    },
  });

export default i18n;
