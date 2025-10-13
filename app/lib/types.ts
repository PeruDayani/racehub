import type { User } from "@supabase/supabase-js";
import type { addresses, profiles } from "../../drizzle/schema";

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
export type Profile = typeof profiles.$inferSelect;

export type UserProfile = Profile & {
  address?: Address | null;
};

export type Address = typeof addresses.$inferSelect;
export type AddressType = "race" | "user";
export type AddressInput = Omit<Address, "id" | "createdAt" | "updatedAt">;
