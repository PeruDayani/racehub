import type { StateCreator } from "zustand";
import {
  getUserRaceByIdAction,
  updateRaceAction,
} from "../actions/raceActions";
import type { Race } from "../lib/types";
import type { RaceStore } from "./RaceStore";

export type RaceSliceStore = {
  race: Race;
  isSaving: boolean;
};

export type RaceSliceActions = {
  refreshRootRace: () => void;
  updateRootRace: (race: Race) => void;

  getRace: () => Race;
  updateRaceField: (field: keyof Race, value: any) => void;
  saveRace: () => Promise<{ success: boolean; message: string }>;

  debugRace: () => void;
};

export type RaceSlice = RaceSliceStore & RaceSliceActions;

export const createRaceSlice =
  (
    initialRace: Race,
  ): StateCreator<RaceStore, [["zustand/immer", never]], [], RaceSlice> =>
  (set, get) => {
    return {
      race: initialRace,
      isSaving: false,

      refreshRootRace: async () => {
        const { id } = get().race;
        const race = await getUserRaceByIdAction(id);
        if (race.success && race.data?.race) {
          set({ race: race.data.race });
        }
      },

      updateRootRace: (race: Race) => {
        set({ race });
      },

      getRace: () => {
        return get().race;
      },

      updateRaceField: (field: keyof Race, value: any) => {
        set({ race: { ...get().race, [field]: value } });
      },

      saveRace: async () => {
        const { race } = get();

        set({ isSaving: true });

        try {
          const { success, message, data } = await updateRaceAction(race);

          if (!success || !data?.race) {
            return {
              success,
              message: message || "Failed to update race",
            };
          }

          set((state) => {
            state.isSaving = false;

            // Only update the fields that a client will not change
            state.race.updatedAt = data.race.updatedAt;
          });

          return {
            success,
            message: "Race updated successfully",
          };
        } catch (error) {
          console.error("Error saving race", error);
          return {
            success: false,
            message: "Failed to update race",
          };
        } finally {
          set({ isSaving: false });
        }
      },

      debugRace: () => {
        const { race } = get();
        console.log(
          "%c Race",
          "color: blue; font-weight: bold; font-size: 1.5rem;",
        );
        console.log(race);
      },
    };
  };
