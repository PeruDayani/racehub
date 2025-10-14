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
  getPriceOptions: (optionId: number) => RaceOptionPrice[];
  addPriceOption: (optionId: number, price: RaceOptionPrice) => void;
  updatePriceOption: (optionId: number, price: RaceOptionPrice) => void;
  deletePriceOption: (optionId: number, priceId: number) => void;

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
            isFree: true,
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

      getPriceOptions: (raceOptionId) => {
        const option = get().race.options.find((o) => o.id === raceOptionId);
        return option?.prices ?? [];
      },

      addPriceOption: (raceOptionId) =>
        set((state) => {
          const option = state.race.options.find((o) => o.id === raceOptionId);
          if (option) {
            const price = {
              id: Math.random() * 1000,
              raceId: state.race.id,
              raceOptionId: raceOptionId,
              label: "",
              priceCents: 0,
              expiresAt: null,
              maxParticipants: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            option.prices.push(price);
          }
        }),

      updatePriceOption: (raceOptionId, price) =>
        set((state) => {
          const option = state.race.options.find((o) => o.id === raceOptionId);
          if (!option) return;
          const existing = option.prices.find((p) => p.id === price.id);
          if (existing) Object.assign(existing, price);
        }),

      deletePriceOption: (raceOptionId, priceId) =>
        set((state) => {
          const option = state.race.options.find((o) => o.id === raceOptionId);
          if (option) {
            option.prices = option.prices.filter((p) => p.id !== priceId);
          }
        }),

      debugRaceOptions: () => {
        console.log(get().race.options);
      },
    };
  };
