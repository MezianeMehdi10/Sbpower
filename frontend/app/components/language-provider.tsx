"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { Locale, locales, translations } from "@/app/lib/translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: (typeof translations)[Locale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      window.addEventListener("sb-power-language", callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("sb-power-language", callback);
      };
    },
    () => {
    const saved = window.localStorage.getItem("sb-power-language") as Locale | null;
      return saved && locales.includes(saved) ? saved : "de";
    },
    () => "de" as Locale,
  );

  const setLocale = (nextLocale: Locale) => {
    window.localStorage.setItem("sb-power-language", nextLocale);
    window.dispatchEvent(new Event("sb-power-language"));
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, copy: translations[locale] }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
