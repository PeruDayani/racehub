"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { addresses, profiles } from "../../drizzle/schema";
import { db } from "../lib/db";
import { createClient } from "../lib/supabase/server";
import type { AddressInput, UserProfile } from "../lib/types";

type ProfileResponseType = {
  success: boolean;
  message: string;
  data?: UserProfile;
};

type UpdateProfileInput = Omit<
  Partial<UserProfile>,
  "id" | "createdAt" | "updatedAt" | "addressId" | "address"
> & {
  address?: AddressInput;
};

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
      with: { address: true },
    });

    if (!existingProfile) {
      return {
        success: false,
        message: "Profile not found",
      };
    }

    const { address: addressData, ...profileData } = input;
    let addressId = existingProfile.addressId;

    if (addressData) {
      const now = new Date().toISOString();

      if (existingProfile.addressId) {
        // Update the existing address
        await db
          .update(addresses)
          .set({ ...addressData, updatedAt: now })
          .where(eq(addresses.id, existingProfile.addressId));
      } else {
        // Create a new address
        const [newAddress] = await db
          .insert(addresses)
          .values({ ...addressData, createdAt: now, updatedAt: now })
          .returning();
        addressId = newAddress.id;
      }
    }

    // Update profile
    await db
      .update(profiles)
      .set({ ...profileData, addressId, updatedAt: new Date().toISOString() })
      .where(eq(profiles.id, user.id))
      .returning();

    const updatedProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
      with: { address: true },
    });

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
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
      with: {
        address: true,
      },
    });

    // If profile doesn't exist, create one
    if (!profile) {
      const [newProfile] = await db
        .insert(profiles)
        .values({
          id: user.id,
        })
        .returning();

      return {
        success: true,
        message: "Profile created successfully",
        data: { ...newProfile, address: null },
      };
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: { ...profile },
    };
  } catch (error) {
    console.error("Error getting profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get profile",
    };
  }
}
