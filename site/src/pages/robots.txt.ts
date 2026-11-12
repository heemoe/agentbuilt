import type { APIRoute } from "astro";
import { absoluteUrl } from "../site.config";

export const GET: APIRoute = () => {
  const body = `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl("/sitemap-index.xml")}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
