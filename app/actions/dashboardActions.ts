"use server";

import { and, count, eq, sql } from "drizzle-orm";
import { tickets } from "../../drizzle/schema";
import { db } from "../lib/db";

export type RaceSignupStats = {
  registrantCount: number;
  totalRevenueCents: number;
  paidCount: number;
};

export type GetRaceSignupStatsResponse = {
  success: boolean;
  message: string;
  data?: RaceSignupStats;
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

    const [{ registrantCount, totalRevenueCents }] = await db
      .select({
        registrantCount: count(),
        totalRevenueCents: sql<number>`sum(${tickets.amountPaidCents})`,
      })
      .from(tickets)
      .where(eq(tickets.raceId, raceId));

    // Count paid tickets (tickets with successful payment status)
    // In Stripe, "paid" is the payment_status value for successful payments
    const [{ paidCount }] = await db
      .select({
        paidCount: count(),
      })
      .from(tickets)
      .where(
        and(
          eq(tickets.raceId, raceId),
          eq(tickets.stripePaymentIntentStatus, "paid"),
        ),
      );

    return {
      success: true,
      message: "Race signup stats retrieved.",
      data: {
        registrantCount: registrantCount ?? 0,
        totalRevenueCents: totalRevenueCents ?? 0,
        paidCount: paidCount ?? 0,
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
