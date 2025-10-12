import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(
  email: string,
  password: string,
  redirectTo?: string,
) {
  const supabase = await createClient();

  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    redirect("/error");
  }

  revalidatePath("/");
  redirect(redirectTo || "/home");
}

export async function signup(
  email: string,
  password: string,
  redirectTo?: string,
) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/");
  redirect(redirectTo || "/home");
}
