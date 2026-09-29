"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { adminCopy, AdminLocale, adminLocales } from "@/app/lib/admin-copy";

type AdminLanguageContextValue = {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  copy: (typeof adminCopy)[AdminLocale];
};

const storageKey = "sb-power-admin-language";
const eventName = "sb-power-admin-language";
const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null);

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      window.addEventListener(eventName, callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(eventName, callback);
      };
    },
    () => {
      const saved = window.localStorage.getItem(storageKey) as AdminLocale | null;
      return saved && adminLocales.includes(saved) ? saved : "de";
    },
    () => "de" as AdminLocale,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (nextLocale: AdminLocale) => {
    window.localStorage.setItem(storageKey, nextLocale);
    window.dispatchEvent(new Event(eventName));
  };

  const value = useMemo(() => ({ locale, setLocale, copy: adminCopy[locale] }), [locale]);
  return <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>;
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) throw new Error("useAdminLanguage must be used within AdminLanguageProvider");
  return context;
}

export function AdminLanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, copy } = useAdminLanguage();
  return <div className={`admin-language-switcher ${className}`} aria-label={copy.language}>
    {adminLocales.map((item) => <button key={item} type="button" className={locale === item ? "is-active" : ""} aria-pressed={locale === item} onClick={() => setLocale(item)}>{item.toUpperCase()}</button>)}
  </div>;
}
