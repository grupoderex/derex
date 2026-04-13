import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from "./es";
import en from "./en";

export const defaultNS = "es";
export const resources = {
  es: {
    translations: es,
  },
  en: {
    translations: en,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    resources: {
      es: { translations: es },
      en: { translations: en },
    },
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "localStorage"],
      lookupCookie: "i18next",
      caches: ["localStorage", "cookie"],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
