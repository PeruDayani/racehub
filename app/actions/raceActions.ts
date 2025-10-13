"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { races } from "../../drizzle/schema";
import { db } from "../lib/db";
import type { Race } from "../lib/types";
import { getAuthenticatedUser } from "./utils";

type RaceResponseType = {
  success: boolean;
  message: string;
  data?: Race;
};

export async function createRaceAction(
  name: string,
): Promise<RaceResponseType> {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const [race] = await db
      .insert(races)
      .values({
        userId: user.id,
        name,
      })
      .returning();

    const createdRace = await db.query.races.findFirst({
      where: eq(races.id, race.id),
      with: {
        address: true,
        options: true,
        optionPrices: true,
        sponsorships: true,
        website: true,
      },
    });

    if (!createdRace) {
      return {
        success: false,
        message: "Failed to create race",
      };
    }

    // Revalidate the events page
    revalidatePath("/events");

    return {
      success: true,
      message: "Race created successfully",
      data: createdRace,
    };
  } catch (error) {
    console.error("Error creating race:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create race",
    };
  }
}
