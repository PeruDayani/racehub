"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  addresses,
  raceOptionPrices,
  raceOptions,
  races,
} from "../../drizzle/schema";
import { db, type TransactionClient } from "../lib/db";
import type { Race, RaceOption, RaceOptionPrice } from "../lib/types";
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
  race: Race,
): Promise<UpdateRaceResponseType> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: "User not authenticated" };

    let updatedRace: Race | undefined;
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
          status: race.status,
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
          sponsorships: true,
          website: true,
        },
      });
    });

    // Trigger revalidation in parallel (non-blocking)
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/edit-race/${race.id}`);

    if (!updatedRace) {
      return { success: false, message: "Failed to fetch updated race" };
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
