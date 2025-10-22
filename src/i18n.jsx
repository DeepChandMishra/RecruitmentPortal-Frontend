import i18n from "i18next";
import { initReactI18next } from "react-i18next";


// Importing translation files

import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationNL from "./locales/nl/translation.json";
import translationFR from "./locales/fr/translation.json";



//Creating object with the variables of imported translation files
const resources = {
    en: {
        translation: translationEN,
    },
    es: {
        translation: translationES,
    },
    fr: {
        translation: translationFR,
    },
    nl: {
        translation: translationNL,
    },
};

//i18N Initialization

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", //default language
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
        returnObjects: true,
    });

export default i18n;
