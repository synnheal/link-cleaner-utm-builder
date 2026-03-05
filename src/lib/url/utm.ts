import type { UtmParams, UtmOptions } from "@/types/url";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export interface UtmPreset {
  label: string;
  medium: string;
}

export const UTM_PRESETS: UtmPreset[] = [
  { label: "Email", medium: "email" },
  { label: "CPC", medium: "cpc" },
  { label: "Social", medium: "social" },
  { label: "Affiliate", medium: "affiliate" },
  { label: "Display", medium: "display" },
  { label: "Referral", medium: "referral" },
];

export function buildUtmUrl(
  inputUrl: string,
  params: UtmParams,
  options: UtmOptions
): string {
  let url: URL;
  try {
    url = new URL(inputUrl);
  } catch {
    return inputUrl;
  }

  const utmEntries: [string, string][] = [
    ["utm_source", params.source],
    ["utm_medium", params.medium],
    ["utm_campaign", params.campaign],
    ["utm_term", params.term],
    ["utm_content", params.content],
  ];

  for (const [key, value] of utmEntries) {
    if (!value.trim()) continue;

    if (options.replaceExisting) {
      url.searchParams.set(key, value.trim());
    } else if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value.trim());
    }
  }

  return url.toString();
}
