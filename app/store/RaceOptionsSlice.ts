import type { StateCreator } from "zustand";
import type { RaceOption, RaceOptionPrice } from "../lib/types";
import type { RaceStore } from "./RaceStore";

export type RaceOptionsSliceStore = {};

export type RaceOptionsSliceActions = {
  // Race Options
  addRaceOption: () => void;
  updateRaceOption: (option: RaceOption) => void;
  deleteRaceOption: (optionId: number | undefined) => void;
  reorderRaceOptions: (newOrder: RaceOption[]) => void;

  // Race Option Prices
  addPrice: (optionId: number, price: RaceOptionPrice) => void;
  updatePrice: (optionId: number, price: RaceOptionPrice) => void;
  deletePrice: (optionId: number, priceId: number) => void;
  reorderPrices: (optionId: number, newOrder: RaceOptionPrice[]) => void;

  // Debug
  debugRaceOptions: () => void;
};

export type RaceOptionsSlice = RaceOptionsSliceStore & RaceOptionsSliceActions;

export const createRaceOptionsSlice =
  (): StateCreator<
    RaceStore,
    [["zustand/immer", never]],
    [],
    RaceOptionsSlice
  > =>
  (set, get) => {
    return {
      addRaceOption: () =>
        set((state) => {
          const option = {
            id: Math.random() * 1000,
            raceId: state.race.id,
            name: null,
            distanceKm: null,
            startTime: null,
            cutoffTime: null,
            courseMapUrl: null,
            isVirtual: false,
            isFree: false,
            description: null,
            ageMin: null,
            ageMax: null,
            genderCategory: "all",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            position: state.race.options.length,
            prices: [],
          };
          state.race.options.push(option);
        }),

      updateRaceOption: (option) =>
        set((state) => {
          const existing = state.race.options.find((o) => o.id === option.id);
          if (existing) Object.assign(existing, option);
        }),

      deleteRaceOption: (optionId) =>
        set((state) => {
          state.race.options = state.race.options.filter(
            (o) => o.id !== optionId,
          );
        }),

      reorderRaceOptions: (newOrder) =>
        set((state) => {
          newOrder.forEach((opt, i) => {
            opt.position = i;
          });
          state.race.options = newOrder;
        }),

      addPrice: (optionId, price) =>
        set((state) => {
          const option = state.race.options.find((o) => o.id === optionId);
          if (option) {
            price.position = option.prices.length;
            option.prices.push(price);
          }
        }),

      updatePrice: (optionId, price) =>
        set((state) => {
          const option = state.race.options.find((o) => o.id === optionId);
          if (!option) return;
          const existing = option.prices.find((p) => p.id === price.id);
          if (existing) Object.assign(existing, price);
        }),

      deletePrice: (optionId, priceId) =>
        set((state) => {
          const option = state.race.options.find((o) => o.id === optionId);
          if (option) {
            option.prices = option.prices.filter((p) => p.id !== priceId);
          }
        }),

      reorderPrices: (optionId, newOrder) =>
        set((state) => {
          const option = state.race.options.find((o) => o.id === optionId);
          if (option) {
            newOrder.forEach((p, i) => {
              p.position = i;
            });
            option.prices = newOrder;
          }
        }),
      debugRaceOptions: () => {
        console.log(get().race.options);
      },
    };
  };
