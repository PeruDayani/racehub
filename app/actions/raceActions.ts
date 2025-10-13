"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { races } from "../../drizzle/schema";
import { db } from "../lib/db";
import type { Race } from "../lib/types";
import { getAuthenticatedUser } from "./utils";

type CreateRaceResponseType = {
  success: boolean;
  message: string;
  data?: {
    raceId: number;
  };
};

export async function createRaceAction(
  name: string,
): Promise<CreateRaceResponseType> {
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

    if (!race) {
      return {
        success: false,
        message: "Failed to create race",
      };
    }

    // Revalidate the events page
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Race created successfully",
      data: {
        raceId: race.id,
      },
    };
  } catch (error) {
    console.error("Error creating race:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create race",
    };
  }
}

type GetRaceResponseType = {
  success: boolean;
  message: string;
  data?: {
    race: Race;
  };
};

export async function getRaceAction(id: number): Promise<GetRaceResponseType> {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const race = await db.query.races.findFirst({
      where: and(eq(races.id, id), eq(races.userId, user.id)),
      with: {
        address: true,
        options: {
          with: {
            prices: true,
          },
        },
        sponsorships: true,
        website: true,
      },
    });

    if (!race) {
      return {
        success: false,
        message: "Race not found",
      };
    }

    return {
      success: true,
      message: "Race found",
      data: {
        race,
      },
    };
  } catch (error) {
    console.error("Error getting race:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get race",
    };
  }
}

type GetRacesByUserIdResponseType = {
  success: boolean;
  message: string;
  data?: {
    races: Race[];
  };
};

export async function getRacesByUserAction(): Promise<GetRacesByUserIdResponseType> {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get all races for the user with all relations
    const userRaces = await db.query.races.findMany({
      where: eq(races.userId, user.id),
      with: {
        address: true,
        options: {
          with: {
            prices: true,
          },
        },
        sponsorships: true,
        website: true,
      },
    });

    return {
      success: true,
      message: "Races retrieved successfully",
      data: {
        races: userRaces,
      },
    };
  } catch (error) {
    console.error("Error getting races by user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get races",
    };
  }
}

type UpdateRaceResponseType = {
  success: boolean;
  message: string;
  data?: {
    race: Race;
  };
};

export async function updateRaceAction(
  _race: Race,
): Promise<UpdateRaceResponseType> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    success: false,
    message: "Function not implemented",
  };
}
