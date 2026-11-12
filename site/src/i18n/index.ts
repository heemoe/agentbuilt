import { en, type MessageKey } from "./en";
import { zh } from "./zh";
import type { Locale } from "../site.config";

export type { MessageKey };
export const messages = { en, zh };

export function t(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  const table = messages[locale] ?? messages.en;
  let out = table[key] ?? messages.en[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}

export function locText(
  locale: Locale,
  value?: { en: string; zh?: string } | null,
): string {
  if (!value) return "";
  if (locale === "zh" && value.zh) return value.zh;
  return value.en;
}
