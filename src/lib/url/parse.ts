export interface ParsedParam {
  key: string;
  value: string;
}

export function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

export function tryParseUrl(raw: string): URL | null {
  try {
    const normalized = normalizeUrl(raw);
    if (!normalized) return null;
    return new URL(normalized);
  } catch {
    return null;
  }
}

export function extractParams(url: URL): ParsedParam[] {
  const params: ParsedParam[] = [];
  url.searchParams.forEach((value, key) => {
    params.push({ key, value });
  });
  return params;
}

export function getCanonicalUrl(url: URL): string {
  return `${url.origin}${url.pathname}`;
}

export function wasProtocolAdded(raw: string): boolean {
  return !!raw.trim() && !/^https?:\/\//i.test(raw.trim());
}
