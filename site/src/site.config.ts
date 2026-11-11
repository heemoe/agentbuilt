export const siteConfig = {
  name: "Harnessed",
  origin: "https://heemoe.github.io",
  base: "/harnessed",
  repo: "https://github.com/heemoe/harnessed",
  defaultLocale: "en" as const,
  locales: [
    { id: "en" as const, htmlLang: "en", ogLocale: "en_US", hreflang: "en", label: "English" },
    { id: "zh" as const, htmlLang: "zh-CN", ogLocale: "zh_CN", hreflang: "zh-CN", label: "简体中文" },
  ],
};

export type Locale = (typeof siteConfig.locales)[number]["id"];

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.base.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  const joined = `${base}${clean}`.replace(/\/{2,}/g, "/");
  return new URL(joined, `${siteConfig.origin}/`).toString();
}

export function withBase(path = "/"): string {
  const base = siteConfig.base.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `${base}/`;
  return `${base}${clean}`;
}

export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  if (clean === "/") return "/zh/";
  return `/zh${clean}`;
}

export function switchLocale(pathname: string, target: Locale): string {
  const base = siteConfig.base.replace(/\/$/, "");
  let rest = pathname;
  if (base && (rest === base || rest.startsWith(base + "/"))) {
    rest = rest.slice(base.length) || "/";
  }
  if (!rest.startsWith("/")) rest = `/${rest}`;
  const stripped = rest.replace(/^\/zh(?=\/|$)/, "") || "/";
  return withBase(localePath(target, stripped));
}

export function pathToLocale(pathname: string): Locale {
  const base = siteConfig.base.replace(/\/$/, "");
  let rest = pathname;
  if (base && (rest === base || rest.startsWith(base + "/"))) {
    rest = rest.slice(base.length) || "/";
  }
  return rest === "/zh" || rest.startsWith("/zh/") ? "zh" : "en";
}
