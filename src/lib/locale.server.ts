import { isLocale, type Locale } from "@/lib/i18n";
import { redirect } from "next/navigation";

export type LocaleParams = Promise<{ locale: string }>;

export const getLocale = async (params: LocaleParams): Promise<Locale> => {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/");
  return locale;
};
