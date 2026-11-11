import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { allProjects } from "../data/catalog";
import { absoluteUrl, localePath, siteConfig } from "../site.config";
import { t } from "../i18n";

export function GET(context: APIContext) {
  const locale = "en" as const;
  const items = [...allProjects()].sort((a, b) => (b.listed_at || "").localeCompare(a.listed_at || ""));
  return rss({
    title: t(locale, "rssTitle"),
    description: t(locale, "rssDescription"),
    site: context.site ?? siteConfig.origin,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    trailingSlash: false,
    items: items.map((project) => ({
      title: project.name,
      description: project.summary.en,
      link: absoluteUrl(localePath(locale, `/project/${project.id}/`)),
      pubDate: new Date(`${project.listed_at || "2026-11-12"}T00:00:00+08:00`),
    })),
  });
}
