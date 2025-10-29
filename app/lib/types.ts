import type { User } from "@supabase/supabase-js";
import type {
  addresses,
  profiles,
  raceOptionPrices,
  raceOptions,
  races,
  tickets,
} from "../../drizzle/schema";

// Re-export Supabase User type for convenience
export type { User };

// JWT Claims type (returned from getClaims())
export interface AuthClaims {
  sub?: string;
  email?: string;
  phone?: string;
  role?: string;
  aal?: string;
  amr?: Array<{ method: string; timestamp: number }>;
  session_id?: string;
  is_anonymous?: boolean;
  user_metadata?: {
    full_name: string;
  };
}

// Types infered from Drizzle schema
export type Profile_DB = typeof profiles.$inferSelect;
export type Address_DB = typeof addresses.$inferSelect;
export type Race_DB = typeof races.$inferSelect;
export type RaceOption_DB = typeof raceOptions.$inferSelect;
export type RaceOptionPrice_DB = typeof raceOptionPrices.$inferSelect;
export type Ticket_DB = typeof tickets.$inferSelect;

export type UserProfile = Profile_DB & {
  address?: Address_DB | null;
};

export type RaceOption = RaceOption_DB & {
  prices: RaceOptionPrice_DB[];
};

export type RaceOptionPrice = RaceOptionPrice_DB;

export type Race = Race_DB & {
  address?: Address_DB | null;
  options: RaceOption[];
};

export type AddressType = "race" | "user";
export type AddressInput = Omit<Address_DB, "id" | "createdAt" | "updatedAt">;

export type RaceStatus = "draft" | "live" | "finished";

export type Website = {
  description: string;
  sections: WebsiteSection[];
  logo?: Media;
  banner?: Media;
};

export type WebsiteSection = {
  id: string;
  name: string;
  content: string;
};

export type Sponsorship = {
  id: string;
  name: string;
  description: string;
  logo?: Media;
  websiteUrl?: string;
  tier: "gold" | "silver" | "bronze";
};

export type Media = {
  url: string;
  path: string;
};

export type MediaBucket = "profile" | "website" | "waivers";

export type Ticket = Ticket_DB & {
  race: Race_DB & {
    address?: Address_DB | null;
  };
  raceOption: RaceOption_DB;
  raceOptionPrice: RaceOptionPrice;
};

export type SocialLink = {
  platform:
    | "facebook"
    | "instagram"
    | "youtube"
    | "tiktok"
    | "x"
    | "linkedin"
    | "linktree";
  url: string;
};

export type SocialMedia = SocialLink[];


