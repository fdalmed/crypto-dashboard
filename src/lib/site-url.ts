const LOCAL_SITE_URL = "http://localhost:3000";
const PRODUCTION_SITE_URL = "https://assetzeno.com";

function getConfiguredSiteUrl() {
  const fallbackSiteUrl = process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : LOCAL_SITE_URL;
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || fallbackSiteUrl;

  try {
    return new URL(candidate);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

export const siteUrl = getConfiguredSiteUrl();

export function getAbsoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
