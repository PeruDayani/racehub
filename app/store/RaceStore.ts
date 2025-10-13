import { enableMapSet } from "immer";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Race } from "../lib/types";
import { createRaceSlice, type RaceSlice } from "./RaceSlice";

enableMapSet();

export type RaceStore = RaceSlice;

export const createRaceStore = (initialRace: Race) => {
  return createStore<RaceStore>()(
    immer((...args) => ({
      ...createRaceSlice(initialRace)(...args),
    })),
  );
};
