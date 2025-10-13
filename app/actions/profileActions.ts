"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { profiles } from "../../drizzle/schema";
import { db } from "../lib/db";
import { createClient } from "../lib/supabase/server";
import type { UserProfile } from "../lib/types";

type ProfileResponseType = {
  success: boolean;
  message: string;
  data?: UserProfile;
};

type UpdateProfileInput = Omit<
  Partial<typeof profiles.$inferInsert>,
  "id" | "createdAt" | "updatedAt"
>;

export async function updateProfileAction(
  input: UpdateProfileInput,
): Promise<ProfileResponseType> {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Check if profile exists
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    if (!existingProfile) {
      return {
        success: false,
        message: "Profile not found",
      };
    }

    // Update profile
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        ...input,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(profiles.id, user.id))
      .returning();

    // Revalidate the profile page
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function getProfileAction(): Promise<ProfileResponseType> {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get profile
    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    // If profile doesn't exist, create one
    if (!profile) {
      const [newProfile] = await db
        .insert(profiles)
        .values({
          id: user.id,
        })
        .returning();

      profile = newProfile;

      // Revalidate the profile page
      revalidatePath("/profile");

      return {
        success: true,
        message: "Profile created successfully",
        data: profile,
      };
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    };
  } catch (error) {
    console.error("Error getting profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get profile",
    };
  }
}
