"use server";

import { count, eq } from "drizzle-orm";
import { tickets } from "../../drizzle/schema";
import { db } from "../lib/db";

export type GetRaceSignupStatsResponse = {
  success: boolean;
  message: string;
  data?: {
    registrantCount: number;
  };
};

export async function getRaceSignupStatsAction(
  raceId: number,
): Promise<GetRaceSignupStatsResponse> {
  try {
    if (!raceId || Number.isNaN(raceId)) {
      return {
        success: false,
        message: "A valid race id is required to fetch stats.",
      };
    }

    const [result] = await db
      .select({
        registrantCount: count(),
      })
      .from(tickets)
      .where(eq(tickets.raceId, raceId));

    return {
      success: true,
      message: "Race signup stats retrieved.",
      data: {
        registrantCount: result?.registrantCount ?? 0,
      },
    };
  } catch (error) {
    console.error("Error getting race signup stats:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get race signup stats.",
    };
  }
}
