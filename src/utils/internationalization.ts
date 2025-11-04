import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import pt from "../i18n/pt.json";
import en from "../i18n/en.json";

function detectLanguage() {
  const first = getLocales()[0] ?? { languageTag: "en-US" };
  const tag = String(first.languageTag || "en-US").toLowerCase();
  if (tag.startsWith("pt")) return "pt";
  return "en";
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    lng: detectLanguage(),
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      pt: { translation: pt }
    },
    interpolation: { escapeValue: false }
  });

export default i18n;