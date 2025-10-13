"use client";

import { createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";
import type { Race } from "../lib/types";
import { createRaceStore, type RaceStore } from "../store/RaceStore";

export type RaceStoreApi = ReturnType<typeof createRaceStore>;

export const RaceStoreContext = createContext<RaceStoreApi | undefined>(
  undefined,
);

export interface RaceStoreProviderProps {
  initialRace: Race;
  children: React.ReactNode;
}

export const RaceStoreProvider = ({
  initialRace,
  children,
}: RaceStoreProviderProps) => {
  const storeRef = useRef<StoreApi<RaceStore> | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createRaceStore(initialRace);
  }
  return (
    <RaceStoreContext.Provider value={storeRef.current}>
      {children}
    </RaceStoreContext.Provider>
  );
};

export const useRaceStore = (selector: (store: RaceStore) => any) => {
  const raceStore = useContext(RaceStoreContext);

  if (!raceStore) {
    throw new Error("useRaceStore must be used within a RaceStoreProvider");
  }

  return useStore(raceStore, selector);
};
