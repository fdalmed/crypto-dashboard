const LOCAL_SITE_URL = "http://localhost:3000";

function getConfiguredSiteUrl() {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || LOCAL_SITE_URL;

  try {
    return new URL(candidate);
  } catch {
    return new URL(LOCAL_SITE_URL);
  }
}

export const siteUrl = getConfiguredSiteUrl();

export function getAbsoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
