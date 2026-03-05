export interface CleanOptions {
  removeUtm: boolean;
  removeAdIds: boolean;
  sortParams: boolean;
  removeFragments: boolean;
  decodeBeforeClean: boolean;
}

export const defaultCleanOptions: CleanOptions = {
  removeUtm: true,
  removeAdIds: true,
  sortParams: false,
  removeFragments: false,
  decodeBeforeClean: false,
};

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

export const emptyUtmParams: UtmParams = {
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
};

export interface UtmOptions {
  replaceExisting: boolean;
}

export const defaultUtmOptions: UtmOptions = {
  replaceExisting: true,
};

export type CodecMode = "url" | "base64";
export type CodecDirection = "encode" | "decode";

export interface CodecOptions {
  mode: CodecMode;
  direction: CodecDirection;
}

export type HistoryItemType = "clean" | "utm" | "encode" | "decode";

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  input: string;
  output: string;
  createdAt: number;
  starred: boolean;
  meta?: Record<string, unknown>;
}
