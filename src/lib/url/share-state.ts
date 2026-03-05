import { shareStateSchema, type ShareState } from "@/types/share";

function toBase64Url(str: string): string {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return decodeURIComponent(escape(atob(base64)));
}

export function encodeShareState(state: ShareState): string {
  const json = JSON.stringify(state);
  return toBase64Url(json);
}

export function decodeShareState(encoded: string): ShareState | null {
  try {
    const json = fromBase64Url(encoded);
    const parsed = JSON.parse(json);
    const result = shareStateSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
