import { getCommonDict, type SupportedLocale } from "@/lib/i18n/getDict";

export function t(
  key: string,
  locale: SupportedLocale = "bn",
  fallbackLocale: SupportedLocale = "en",
): string {
  const current = getCommonDict(locale);
  const fallback = getCommonDict(fallbackLocale);
  return current[key] ?? fallback[key] ?? key;
}

export function tFromDict(
  key: string,
  dict: Record<string, string>,
  fallbackDict: Record<string, string>,
): string {
  return dict[key] ?? fallbackDict[key] ?? key;
}
