import type { CleanOptions } from "@/types/url";

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"];

const AD_ID_PARAMS = [
  "fbclid",
  "gclid",
  "gclsrc",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "dclid",
  "yclid",
  "twclid",
  "li_fat_id",
  "igshid",
  "s_cid",
  "_hsenc",
  "_hsmi",
  "hsa_cam",
  "hsa_grp",
  "hsa_mt",
  "hsa_src",
  "hsa_ad",
  "hsa_acc",
  "hsa_net",
  "hsa_ver",
  "hsa_kw",
  "hsa_la",
  "hsa_ol",
  "hsa_tgt",
  "ref_src",
  "ref_url",
  "vero_id",
  "wickedid",
  "oly_anon_id",
  "oly_enc_id",
  "__s",
  "mkt_tok",
  "ICID",
  "rb_clickid",
  "spm",
  "scm",
  "algo_pvid",
  "algo_exp_id",
  "_openstat",
  "ns_source",
  "ns_mchannel",
  "ns_campaign",
  "ns_linkname",
  "ns_fee",
];

export interface CleanResult {
  cleanedUrl: string;
  removedParams: { key: string; value: string }[];
}

function shouldRemoveParam(key: string, options: CleanOptions): boolean {
  const lowerKey = key.toLowerCase();
  if (options.removeUtm && (UTM_PARAMS.includes(lowerKey) || lowerKey.startsWith("utm_"))) {
    return true;
  }
  if (options.removeAdIds && AD_ID_PARAMS.map((p) => p.toLowerCase()).includes(lowerKey)) {
    return true;
  }
  return false;
}

export function cleanUrl(inputUrl: string, options: CleanOptions): CleanResult {
  let urlStr = inputUrl;

  if (options.decodeBeforeClean) {
    try {
      urlStr = decodeURIComponent(urlStr);
    } catch {
      // keep as-is
    }
  }

  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return { cleanedUrl: inputUrl, removedParams: [] };
  }

  const removedParams: { key: string; value: string }[] = [];
  const keysToRemove: string[] = [];

  url.searchParams.forEach((value, key) => {
    if (shouldRemoveParam(key, options)) {
      removedParams.push({ key, value });
      keysToRemove.push(key);
    }
  });

  for (const key of keysToRemove) {
    url.searchParams.delete(key);
  }

  if (options.sortParams) {
    url.searchParams.sort();
  }

  if (options.removeFragments) {
    url.hash = "";
  }

  let result = url.toString();
  // Remove trailing ? if no params left
  if (result.endsWith("?")) {
    result = result.slice(0, -1);
  }

  return { cleanedUrl: result, removedParams };
}
