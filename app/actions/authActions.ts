"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

type AuthResponseType = {
  success: boolean;
  message: string;
};

export async function signInAction(
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

export async function signUpAction(
  email: string,
  password: string,
  fullName: string,
  redirect_to?: string,
): Promise<AuthResponseType> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
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

export async function signOutAction(): Promise<AuthResponseType> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message };
  }

  // Revalidate the cache
  revalidatePath("/", "layout");

  // Redirect to races page after sign out
  redirect("/home");
}
