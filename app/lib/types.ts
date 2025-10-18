import type { User } from "@supabase/supabase-js";
import type {
  addresses,
  profiles,
  raceOptionPrices,
  raceOptions,
  races,
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
  logoUrl?: string;
  bannerUrl?: string;
  sections: WebsiteSection[];
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
  logoUrl?: string;
  websiteUrl?: string;
  tier: "gold" | "silver" | "bronze";
};
