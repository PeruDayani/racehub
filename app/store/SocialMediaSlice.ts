import type { StateCreator } from "zustand";
import type { SocialLink, SocialMedia } from "../lib/types";
import type { RaceStore } from "./RaceStore";

export type SocialMediaSliceStore = {};

export type SocialMediaSliceActions = {
  getSocialMedia: () => SocialMedia;
  updateSocialLink: (index: number, link: SocialLink) => void;
};

export type SocialMediaSlice = SocialMediaSliceStore & SocialMediaSliceActions;

export const createSocialMediaSlice =
  (): StateCreator<
    RaceStore,
    [["zustand/immer", never]],
    [],
    SocialMediaSlice
  > =>
  (set, get) => {
    return {
      getSocialMedia: () => {
        return get().race.socialMedia || [];
      },

      updateSocialLink: (index: number, link: SocialLink) => {
        set((state) => {
          const socialLinkToUpdate = state.race.socialMedia[index];
          if (socialLinkToUpdate) {
            Object.assign(socialLinkToUpdate, link);
          }
        });
      },
    };
  };
