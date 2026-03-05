"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryItem, HistoryItemType } from "@/types/url";
import { v4 as uuidv4 } from "uuid";

interface HistoryStore {
  items: HistoryItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addItem: (type: HistoryItemType, input: string, output: string, meta?: Record<string, unknown>) => void;
  toggleStar: (id: string) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      items: [],
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),
      addItem: (type, input, output, meta) =>
        set((state) => ({
          items: [
            {
              id: uuidv4(),
              type,
              input,
              output,
              createdAt: Date.now(),
              starred: false,
              meta,
            },
            ...state.items,
          ].slice(0, 200), // max 200 items
        })),
      toggleStar: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, starred: !item.starred } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearAll: () => set({ items: [] }),
    }),
    { name: "link-toolkit-history" }
  )
);
