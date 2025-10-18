import { v4 as uuidv4 } from "uuid";
import type { StateCreator } from "zustand";
import { DEFAULT_WEBSITE } from "../lib/constants";
import type { Website } from "../lib/types";
import type { RaceStore } from "./RaceStore";

export type WebsiteSliceActions = {
  getWebsite: () => Website;
  updateWebsiteDescription: (description: string) => void;
  addWebsiteSection: () => void;
  updateWebsiteSection: (index: number, name: string, content: string) => void;
  removeWebsiteSection: (index: number) => void;
  resetWebsite: () => void;
};

export type WebsiteSlice = WebsiteSliceActions;

export const createWebsiteSlice =
  (): StateCreator<RaceStore, [["zustand/immer", never]], [], WebsiteSlice> =>
  (set, get) => {
    return {
      getWebsite: () => {
        return get().race.website;
      },

      updateWebsiteDescription: (description: string) => {
        set((state) => {
          state.race.website.description = description;
        });
      },

      addWebsiteSection: () => {
        set((state) => {
          state.race.website.sections.push({
            id: uuidv4(),
            name: "",
            content: "",
          });
        });
      },

      updateWebsiteSection: (index: number, name: string, content: string) => {
        set((state) => {
          if (state.race.website.sections[index]) {
            state.race.website.sections[index].name = name;
            state.race.website.sections[index].content = content;
          }
        });
      },

      removeWebsiteSection: (index: number) => {
        set((state) => {
          if (state.race.website) {
            state.race.website.sections.splice(index, 1);
          }
        });
      },

      resetWebsite: () => {
        set((state) => {
          state.race.website = DEFAULT_WEBSITE;
        });
      },
    };
  };
