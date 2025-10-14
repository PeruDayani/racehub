import { enableMapSet } from "immer";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Race } from "../lib/types";
import {
  createRaceOptionsSlice,
  type RaceOptionsSlice,
} from "./RaceOptionsSlice";
import { createRaceSlice, type RaceSlice } from "./RaceSlice";

enableMapSet();

export type RaceStore = RaceSlice & RaceOptionsSlice;

export const createRaceStore = (initialRace: Race) => {
  return createStore<RaceStore>()(
    immer((...args) => ({
      ...createRaceSlice(initialRace)(...args),
      ...createRaceOptionsSlice()(...args),
    })),
  );
};
