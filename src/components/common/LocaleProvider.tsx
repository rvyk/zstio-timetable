"use client";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  t,
  type Locale,
  type Translate,
} from "@/lib/i18n";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createContext, use, useMemo, type ReactNode } from "react";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const LocaleProvider = ({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) => <LocaleContext value={locale}>{children}</LocaleContext>;

export const useLocale = () => use(LocaleContext);

/** `const translate = useT()` → `translate("news.source")`. */
export const useT = (): Translate => {
  const locale = useLocale();
  return useMemo(() => (key, vars) => t(locale, key, vars), [locale]);
};

/**
 * Język siedzi w ciasteczku, bo napisy renderują też komponenty serwerowe —
 * `router.refresh()` przeciąga nową wersję bez gubienia stanu klienta.
 */
export const useSetLocale = () => {
  const router = useRouter();

  return (locale: Locale) => {
    setCookie(LOCALE_COOKIE, locale, {
      path: "/",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    document.documentElement.lang = locale;
    router.refresh();
  };
};
