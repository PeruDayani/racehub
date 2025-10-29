import {
  Facebook,
  Instagram,
  Linkedin,
  LinkIcon,
  Music,
  Twitter,
  Youtube,
} from "lucide-react";

import type { SocialLink, SocialMedia, Website } from "./types";

export const PUBLIC_ROUTES = [
  "/auth",
  "/home",
  "/about",
  "/races",
  "/api/stripe/webhook",
];

import {customType} from "drizzle-orm/pg-core"

// Profile dropdown options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const T_SHIRT_SIZE_OPTIONS = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

export const PRESET_DISTANCES = [
  { value: "5k", label: "5K (3.1 miles)", km: 5 },
  { value: "10k", label: "10K (6.2 miles)", km: 10 },
  { value: "half-marathon", label: "Half Marathon (13.1 miles)", km: 21 },
  { value: "marathon", label: "Marathon (26.2 miles)", km: 42 },
  { value: "custom", label: "Custom Distance" },
];

export const DISTANCE_UNITS = [
  { value: "km", label: "Kilometers (km)" },
  { value: "mi", label: "Miles (mi)" },
  { value: "m", label: "Meters (m)" },
];

export const GENDER_CATEGORIES = [
  { value: "all", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
];

export const DEFAULT_WEBSITE: Website = {
  description: "",
  sections: [],
  logo: undefined,
  banner: undefined,
};

export const DEFAULT_SOCIAL_MEDIA: SocialMedia = [
  {
    platform: "facebook",
    url: "",
  },
  {
    platform: "instagram",
    url: "",
  },
  {
    platform: "youtube",
    url: "",
  },
  {
    platform: "tiktok",
    url: "",
  },
  {
    platform: "x",
    url: "",
  },
  {
    platform: "linkedin",
    url: "",
  },
  {
    platform: "linktree",
    url: "",
  },
];

export const PLATFORM_CONFIG: Record<
  SocialLink["platform"],
  { icon: React.ElementType; label: string }
> = {
  facebook: { icon: Facebook, label: "Facebook" },
  instagram: { icon: Instagram, label: "Instagram" },
  youtube: { icon: Youtube, label: "YouTube" },
  tiktok: { icon: Music, label: "TikTok" },
  x: { icon: Twitter, label: "X (Twitter)" },
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  linktree: { icon: LinkIcon, label: "Linktree" },
};

// Create reusable custom BYTEA type
export const bytea = customType<{ data: Buffer | null }>({
  dataType() {
    return "bytea";
  },
  toDriver(value) {
    return value; // should be a Node.js Buffer
  },
  fromDriver(value) {
    return value as Buffer;
  },
});
