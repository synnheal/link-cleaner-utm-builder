export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

export function base64Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary);
}

export function base64Decode(input: string): string {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function codec(
  input: string,
  mode: "url" | "base64",
  direction: "encode" | "decode"
): string {
  if (mode === "url") {
    return direction === "encode" ? urlEncode(input) : urlDecode(input);
  }
  return direction === "encode" ? base64Encode(input) : base64Decode(input);
}
