import React, { createContext, useCallback, useEffect, useState } from "react";

import amh from "../src/i18n/amh.json";
import dak from "../src/i18n/dak.json";
import eng from "../src/i18n/eng.json";
import hin from "../src/i18n/hin.json";
import hmn from "../src/i18n/hmn.json";
import kar from "../src/i18n/kar.json";
import man from "../src/i18n/man.json";
import oji from "../src/i18n/oji.json";
import orm from "../src/i18n/orm.json";
import som from "../src/i18n/som.json";
import spa from "../src/i18n/spa.json";
import vie from "../src/i18n/vie.json";
import fra from "../src/i18n/fra.json";

const LOCAL_STORAGE_KEY = "twma_lang";
const DEFAULT_LANGUAGE = "eng";

// TODO: this is hardcoded, use the existing translator.js class!
const languages = {
  eng,
  spa,
  som,
  hmn,
  amh,
  orm,
  oji,
  dak,
  vie,
  hin,
  kar,
  man,
  fra,
};

const LanguageContext = createContext({});

/* eslint-disable-next-line react/prop-types */
const TranslatorContext = ({ children }) => {
  // Derived from: https://dev.to/jaklaudiusz/next-js-persistent-state-with-react-hooks-and-localstorage-how-to-make-it-work-3al6
  const [isInitialized, setIsInitialized] = useState(false);

  const [showWelcome, setWelcome] = useState(false);

  const [languageKey, setLanguageKey] = useState(DEFAULT_LANGUAGE);

  const language = languages[languageKey];

  // Wrapper around setLanguageKey that sets to
  // default language if  lang parameter is invalid
  const updateLanguage = useCallback(
    (lang) =>
      Object.keys(languages).includes(lang)
        ? setLanguageKey(lang)
        : setLanguageKey(DEFAULT_LANGUAGE),
    [setLanguageKey]
  );

  useEffect(() => {
    if (isInitialized && typeof window !== undefined) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, languageKey);
      document.documentElement.lang = language.locale;
      // if language has changed and search param is different from current language, remove it!
      const newUrl = new URL(location);
      if (
        newUrl.searchParams.get("lang") &&
        newUrl.searchParams.get("lang") !== languageKey
      ) {
        newUrl.searchParams.delete("lang");
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
  }, [isInitialized, languageKey, language.locale]);

  useEffect(() => {
    if (typeof window !== undefined) {
      let key = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const { searchParams } = new URL(location);
      if (searchParams.get("lang")) key = searchParams.get("lang");
      if (key) updateLanguage(key);
      else setWelcome(true);
      setIsInitialized(true);
    }
  }, [updateLanguage]);

  // Returns a language for a given key
  // with a fallback to the default language
  // if no translation is found
  const getTranslation = useCallback(
    (key) =>
      (language && language[key]) ||
      languages[DEFAULT_LANGUAGE][key] ||
      console.error(`No translation found for ${key}`),
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        getTranslation,
        language,
        languages,
        showWelcome,
        setWelcome,
        updateLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default TranslatorContext;
export { LanguageContext };
