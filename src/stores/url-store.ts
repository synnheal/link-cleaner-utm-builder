"use client";

import { create } from "zustand";
import type { CleanOptions, UtmParams, UtmOptions, CodecMode, CodecDirection } from "@/types/url";
import { defaultCleanOptions, emptyUtmParams, defaultUtmOptions } from "@/types/url";

interface UrlStore {
  // Shared
  inputUrl: string;
  setInputUrl: (url: string) => void;

  // Cleaner
  cleanOptions: CleanOptions;
  setCleanOptions: (opts: Partial<CleanOptions>) => void;

  // UTM
  utmParams: UtmParams;
  setUtmParams: (params: Partial<UtmParams>) => void;
  utmOptions: UtmOptions;
  setUtmOptions: (opts: Partial<UtmOptions>) => void;

  // Codec
  codecInput: string;
  setCodecInput: (input: string) => void;
  codecMode: CodecMode;
  setCodecMode: (mode: CodecMode) => void;
  codecDirection: CodecDirection;
  setCodecDirection: (dir: CodecDirection) => void;
}

export const useUrlStore = create<UrlStore>((set) => ({
  inputUrl: "",
  setInputUrl: (url) => set({ inputUrl: url }),

  cleanOptions: defaultCleanOptions,
  setCleanOptions: (opts) =>
    set((state) => ({ cleanOptions: { ...state.cleanOptions, ...opts } })),

  utmParams: emptyUtmParams,
  setUtmParams: (params) =>
    set((state) => ({ utmParams: { ...state.utmParams, ...params } })),
  utmOptions: defaultUtmOptions,
  setUtmOptions: (opts) =>
    set((state) => ({ utmOptions: { ...state.utmOptions, ...opts } })),

  codecInput: "",
  setCodecInput: (input) => set({ codecInput: input }),
  codecMode: "url",
  setCodecMode: (mode) => set({ codecMode: mode }),
  codecDirection: "decode",
  setCodecDirection: (dir) => set({ codecDirection: dir }),
}));
