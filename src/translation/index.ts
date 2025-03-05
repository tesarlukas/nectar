import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./languages/en.json";
import cs from "./languages/cs.json";
import sk from "./languages/cs.json";

const resources = {
  en,
  cs,
  sk,
};

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
