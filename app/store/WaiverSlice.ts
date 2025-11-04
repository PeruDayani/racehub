// store/waiverSlice.ts
import type { StateCreator } from "zustand";
import type { Media } from "@/app/lib/types";
import type { RaceStore } from "./RaceStore"; // your Media with at least { id: string }

export type WaiverSliceActions = {
  addWaiver: (waiver: Media | null) => void;
};

export type WaiverSlice = WaiverSliceActions;

export const createWaiverSlice =
  (): StateCreator<RaceStore, [["zustand/immer", never]], [], WaiverSlice> =>
  (set) => ({
    addWaiver: (waiver: Media | null) => {
      set((state) => {
        state.race.waivers = waiver || null;
      });
    },
  });
