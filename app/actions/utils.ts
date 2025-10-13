"use server";

import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/server";

/**
 * Gets the authenticated user from Supabase
 * @returns The authenticated user or null if not authenticated
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  return user;
}
