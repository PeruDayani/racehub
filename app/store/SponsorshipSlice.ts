import { v4 as uuidv4 } from "uuid";
import type { StateCreator } from "zustand";
import type { Sponsorship } from "../lib/types";
import type { RaceStore } from "./RaceStore";

export type SponsorshipSliceStore = {};

export type SponsorshipSliceActions = {
  getSponsorships: () => Sponsorship[];
  addSponsorship: () => void;
  updateSponsorship: (id: string, sponsorship: Partial<Sponsorship>) => void;
  deleteSponsorship: (id: string) => void;
};

export type SponsorshipSlice = SponsorshipSliceStore & SponsorshipSliceActions;

export const createSponsorshipSlice =
  (): StateCreator<
    RaceStore,
    [["zustand/immer", never]],
    [],
    SponsorshipSlice
  > =>
  (set, get) => {
    return {
      getSponsorships: () => {
        return get().race.sponsorships || [];
      },

      addSponsorship: () => {
        set((state) => {
          const newSponsorship: Sponsorship = {
            id: uuidv4(),
            name: "",
            description: "",
            tier: "bronze",
          };

          state.race.sponsorships.push(newSponsorship);
        });
      },

      updateSponsorship: (id: string, sponsorship: Partial<Sponsorship>) => {
        set((state) => {
          const sponsorshipToUpdate = state.race.sponsorships.find(
            (s) => s.id === id,
          );
          if (sponsorshipToUpdate) {
            Object.assign(sponsorshipToUpdate, sponsorship);
          }
        });
      },

      deleteSponsorship: (id: string) => {
        set((state) => {
          state.race.sponsorships = state.race.sponsorships.filter(
            (s) => s.id !== id,
          );
        });
      },
    };
  };
