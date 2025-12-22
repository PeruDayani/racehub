"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import {
  addresses,
  raceOptionPrices,
  raceOptions,
  races,
} from "../../drizzle/schema";
import { db, type TransactionClient } from "../lib/db";
import type { Race, RaceOption, RaceOptionPrice } from "../lib/types";
import { getAuthenticatedUser } from "./utils";
import { parseGpxAndLoadRoute } from "./parseGpx";

/**
 * Live races actions that do not require authentication
 */

type GetLiveRaceByIdResponseType = {
  success: boolean;
  message: string;
  data?: {
    race: Race;
  };
};

export async function getLiveRaceByIdAction(
  id: number,
): Promise<GetLiveRaceByIdResponseType> {
  try {
    const race = await db.query.races.findFirst({
      where: and(eq(races.id, id), eq(races.status, "live")),
      with: {
        address: true,
        options: {
          with: {
            prices: true,
          },
        },
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
    console.error("Error getting live race by id:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get public race",
    };
  }
}

type GetLiveRaceBySlugResponseType = {
  success: boolean;
  message: string;
  data?: {
    race: Race;
  };
};

export async function getLiveRaceBySlugAction(
  slug: string,
): Promise<GetLiveRaceBySlugResponseType> {
  try {
    const race = await db.query.races.findFirst({
      where: and(eq(races.slug, slug), eq(races.status, "live")),
      with: {
        address: true,
        options: {
          with: {
            prices: true,
          },
        },
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
    console.error("Error getting live race by slug:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get public race",
    };
  }
}

type GetLiveRacesResponseType = {
  success: boolean;
  message: string;
  data?: {
    races: Race[];
  };
};

export async function getLiveRacesAction(): Promise<GetLiveRacesResponseType> {
  try {
    const publicRaces = await db.query.races.findMany({
      where: eq(races.status, "live"),
      with: {
        address: true,
        options: {
          with: {
            prices: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Public races found",
      data: {
        races: publicRaces,
      },
    };
  } catch (error) {
    console.error("Error getting public races:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get public races",
    };
  }
}

/**
 * User races actions that require authentication - create, get, update, delete
 */

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
        slug: slugify(name, { lower: true, strict: true }),
        sponsorships: [],
        website: {
          description: "",
          sections: [],
        },
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

type GetUserRaceByIdResponseType = {
  success: boolean;
  message: string;
  data?: {
    race: Race;
  };
};

export async function getUserRaceByIdAction(
  id: number,
): Promise<GetUserRaceByIdResponseType> {
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

type GetUserRacesResponseType = {
  success: boolean;
  message: string;
  data?: {
    races: Race[];
  };
};

export async function getUserRacesAction(): Promise<GetUserRacesResponseType> {
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
  race: Race,
): Promise<UpdateRaceResponseType> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "User not authenticated" };

    let updatedRace: Race | undefined;
    let shouldParseGpx = false;
    await db.transaction(async (tx) => {
      const existingRace = await tx.query.races.findFirst({
        where: and(eq(races.id, race.id), eq(races.userId, user.id)),
      });

      if (!existingRace) {
        return {
          success: false,
          message: "Race not found or you don't have permission to update it",
        };
      }

      // 🔹 Determine if GPX changed
      shouldParseGpx =
        !!race.gpx &&
        race.gpx?.path !== existingRace.gpx?.path;

      // Update the Race Address
      const addressId = await upsertAddress(
        tx,
        race.address,
        existingRace.addressId,
      );

      // Update the Race
      await tx
        .update(races)
        .set({
          name: race.name,
          date: race.date,
          registrationDeadline: race.registrationDeadline,
          sponsorships: race.sponsorships,
          website: race.website,
          socialMedia: race.socialMedia,
          waivers: race.waivers,
          gpx: race.gpx,
          startLat: race.startLat,
          startLon: race.startLon,
          endLat: race.endLat,
          endLon: race.endLon,
          addressId,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(races.id, race.id));

      // Update the Race Options
      await updateRaceOptions(tx, race.id, race.options);

      // Get the updated race
      updatedRace = await tx.query.races.findFirst({
        where: eq(races.id, race.id),
        with: {
          address: true,
          options: { with: { prices: true } },
        },
      });
    });

    // Trigger revalidation in parallel (non-blocking)
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/edit-race/${race.id}`);

    if (!updatedRace) {
      return { success: false, message: "Failed to fetch updated race" };
    }

    // 🔹 Trigger GPX parsing if it changed
    if (shouldParseGpx) {
      console.log("[updateRaceAction] GPX changed, parsing route...");
      await parseGpxAndLoadRoute(updatedRace.id);
    }

    return {
      success: true,
      message: "Race updated successfully",
      data: { race: updatedRace },
    };
  } catch (error) {
    console.error("Error updating race:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update race",
    };
  }
}

type MarkRaceAsLiveResponseType = {
  success: boolean;
  message: string;
};

export async function markRaceAsLiveAction(
  raceId: number,
): Promise<MarkRaceAsLiveResponseType> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "User not authenticated" };

    const race = await db.query.races.findFirst({
      where: and(eq(races.id, raceId), eq(races.userId, user.id)),
      with: {
        address: true,
        options: {
          with: {
            prices: true,
          },
        },
      },
    });

    if (!race) return { success: false, message: "Race not found" };

    if (race.status === "live")
      return { success: false, message: "Race is already live" };

    // TODO: Improve this validation
    // TODO: We should run validation on race updates as well
    if (!race.name) return { success: false, message: "Race name is required" };
    if (!race.date) return { success: false, message: "Race date is required" };
    if (!race.registrationDeadline)
      return { success: false, message: "Registration deadline is required" };
    if (!race.address)
      return { success: false, message: "Race address is required" };
    if (!race.options.length)
      return { success: false, message: "Atleasy one race option is required" };

    await db.update(races).set({ status: "live" }).where(eq(races.id, raceId));

    return { success: true, message: "Race marked as live" };
  } catch (error) {
    console.error("Error marking race as live:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to mark race as live",
    };
  }
}

/**
 * Helper functions
 */

async function upsertAddress(
  tx: TransactionClient,
  address: Race["address"] | undefined,
  _existingAddressId: number | null,
): Promise<number | null> {
  if (!address) return null;

  const payload = {
    type: address.type,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    updatedAt: new Date().toISOString(),
  };

  if (address.id) {
    await tx.update(addresses).set(payload).where(eq(addresses.id, address.id));
    return address.id;
  }

  const [newAddress] = await tx.insert(addresses).values(payload).returning();
  return newAddress.id;
}

async function updateRaceOptions(
  tx: TransactionClient,
  raceId: number,
  updatedOptions: RaceOption[],
): Promise<void> {
  const existingOptions = await tx.query.raceOptions.findMany({
    where: eq(raceOptions.raceId, raceId),
  });

  const existingIds = existingOptions.map((option) => option.id);
  const updatedIds = updatedOptions.map((option) => option.id);

  // Delete the options that are not in the updated options
  const optionsToDelete = existingIds.filter((id) => !updatedIds.includes(id));
  await tx.delete(raceOptions).where(inArray(raceOptions.id, optionsToDelete));

  // Update the options that are in the updated options
  const optionsToUpdate = updatedOptions.filter((option) =>
    existingOptions.some((existingOption) => existingOption.id === option.id),
  );
  for (const option of optionsToUpdate) {
    await tx
      .update(raceOptions)
      .set({
        name: option.name,
        distanceKm: option.distanceKm,
        startTime: option.startTime,
        cutoffTime: option.cutoffTime,
        courseMapUrl: option.courseMapUrl,
        isVirtual: option.isVirtual,
        isFree: option.isFree,
        description: option.description,
        ageMin: option.ageMin,
        ageMax: option.ageMax,
        genderCategory: option.genderCategory,
        position: option.position,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(raceOptions.id, option.id));

    // Update the prices for this option
    await updateRaceOptionPrices(tx, raceId, option.id, option.prices);
  }

  // Create the options that are not in the existing options
  const optionsToCreate = updatedOptions.filter(
    (option) =>
      !existingOptions.some(
        (existingOption) => existingOption.id === option.id,
      ),
  );
  for (const option of optionsToCreate) {
    const [newOption] = await tx
      .insert(raceOptions)
      .values({
        raceId: raceId,
        name: option.name,
        distanceKm: option.distanceKm,
        startTime: option.startTime,
        cutoffTime: option.cutoffTime,
        courseMapUrl: option.courseMapUrl,
        isVirtual: option.isVirtual,
        isFree: option.isFree,
        description: option.description,
        ageMin: option.ageMin,
        ageMax: option.ageMax,
        genderCategory: option.genderCategory,
        position: option.position,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // Create the prices for this new option
    if (newOption && option.prices.length > 0) {
      await updateRaceOptionPrices(tx, raceId, newOption.id, option.prices);
    }
  }
}

async function updateRaceOptionPrices(
  tx: TransactionClient,
  raceId: number,
  raceOptionId: number,
  updatedPrices: RaceOptionPrice[],
): Promise<void> {
  // Get existing prices for race and race option
  const existingPrices = await tx.query.raceOptionPrices.findMany({
    where: and(
      eq(raceOptionPrices.raceId, raceId),
      eq(raceOptionPrices.raceOptionId, raceOptionId),
    ),
  });

  const existingIds = existingPrices.map((price) => price.id);
  const updatedIds = updatedPrices.map((price) => price.id);

  // Delete the prices that are not in the updated prices
  const pricesToDelete = existingIds.filter((id) => !updatedIds.includes(id));
  if (pricesToDelete.length > 0) {
    await tx
      .delete(raceOptionPrices)
      .where(inArray(raceOptionPrices.id, pricesToDelete));
  }

  // Update the prices that are in the updated prices
  const pricesToUpdate = updatedPrices.filter((price) =>
    existingPrices.some((existingPrice) => existingPrice.id === price.id),
  );
  for (const price of pricesToUpdate) {
    await tx
      .update(raceOptionPrices)
      .set({
        label: price.label,
        priceCents: price.priceCents,
        expiresAt: price.expiresAt,
        maxParticipants: price.maxParticipants,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(raceOptionPrices.id, price.id));
  }

  // Create the prices that are not in the existing prices
  const pricesToCreate = updatedPrices.filter(
    (price) =>
      !existingPrices.some((existingPrice) => existingPrice.id === price.id),
  );
  for (const price of pricesToCreate) {
    await tx.insert(raceOptionPrices).values({
      raceId: raceId,
      raceOptionId: raceOptionId,
      label: price.label,
      priceCents: price.priceCents,
      expiresAt: price.expiresAt,
      maxParticipants: price.maxParticipants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
