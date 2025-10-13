"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

type AuthResponseType = {
  success: boolean;
  message: string;
};

export async function signIn(
  email: string,
  password: string,
  redirect_to?: string,
): Promise<AuthResponseType> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // Revalidate the cache
  revalidatePath("/", "layout");

  // Redirect to the provided URL or default to events page
  const redirectUrl = redirect_to || "/events";
  redirect(redirectUrl);
}
