import type { User } from "@supabase/supabase-js";

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
