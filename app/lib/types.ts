import type { User } from "@supabase/supabase-js";
import type {
  addresses,
  profiles,
  raceOptionPrices,
  raceOptions,
  races,
  raceWebsites,
  sponsorships,
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
export type RaceWebsite_DB = typeof raceWebsites.$inferSelect;
export type Sponsorship_DB = typeof sponsorships.$inferSelect;
export type RaceOptionPrice_DB = typeof raceOptionPrices.$inferSelect;

export type UserProfile = Profile_DB & {
  address?: Address_DB | null;
};

export type RaceOption = RaceOption_DB & {
  prices: RaceOptionPrice_DB[];
};

export type Race = Race_DB & {
  address?: Address_DB | null;
  options: RaceOption[];
  sponsorships: Sponsorship_DB[];
  website: RaceWebsite_DB;
};

export type AddressType = "race" | "user";
export type AddressInput = Omit<Address_DB, "id" | "createdAt" | "updatedAt">;
