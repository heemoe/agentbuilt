/**
 * Canonical host redirects for the production Pages deployment.
 *
 * Keyed on the Host header so preview hostnames keep working:
 *   www.whataibuilt.com      -> https://whataibuilt.com (same path and query)
 *   agentbuilt.pages.dev     -> https://whataibuilt.com (same path and query)
 *   *.agentbuilt.pages.dev   -> served as-is (branch and commit previews)
 *   whataibuilt.com          -> served as-is
 */

const CANONICAL_ORIGIN = "https://whataibuilt.com";

const REDIRECT_HOSTS = new Set(["www.whataibuilt.com", "agentbuilt.pages.dev"]);

interface MiddlewareContext {
  request: Request;
  next: () => Promise<Response>;
}

/** Hostname from the Host header, without port or a single trailing dot. */
export function hostnameFromHostHeader(hostHeader: string | null): string {
  const raw = (hostHeader ?? "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.startsWith("[")) {
    const end = raw.indexOf("]");
    return end === -1 ? raw : raw.slice(1, end);
  }
  const withoutPort = raw.replace(/:\d+$/, "");
  return withoutPort.endsWith(".") ? withoutPort.slice(0, -1) : withoutPort;
}

/** 301 to the canonical origin, or null when this host should be served. */
export function redirectForRequest(request: Request): Response | null {
  const host = hostnameFromHostHeader(request.headers.get("Host"));
  if (!REDIRECT_HOSTS.has(host)) return null;

  const incoming = new URL(request.url);
  const target = new URL(`${incoming.pathname}${incoming.search}`, CANONICAL_ORIGIN);
  return Response.redirect(target.toString(), 301);
}

export const onRequest = async (context: MiddlewareContext): Promise<Response> => {
  const redirect = redirectForRequest(context.request);
  if (redirect) return redirect;
  return context.next();
};
