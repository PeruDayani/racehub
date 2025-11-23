"use server";

import { and, count, eq, or, sum } from "drizzle-orm";
import { tickets } from "../../drizzle/schema";
import { db } from "../lib/db";

export type GetRaceSignupStatsResponse = {
  success: boolean;
  message: string;
  data?: {
    registrantCount: number;
    totalRevenueCents: number;
    paidCount: number;
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
        totalRevenueCents: sum(tickets.amountPaidCents),
      })
      .from(tickets)
      .where(eq(tickets.raceId, raceId));

    // Count paid tickets (tickets with successful payment status)
    // In Stripe, "paid" is the payment_status value for successful payments
    const [paidResult] = await db
      .select({
        paidCount: count(),
      })
      .from(tickets)
      .where(
        and(
          eq(tickets.raceId, raceId),
          or(
            eq(tickets.stripePaymentIntentStatus, "paid"),
          ),
        ),
      );

    // Convert sum result to number (sum can return string, number, or null)
    const totalRevenueCents = result?.totalRevenueCents
      ? Number(result.totalRevenueCents) || 0
      : 0;

    return {
      success: true,
      message: "Race signup stats retrieved.",
      data: {
        registrantCount: result?.registrantCount ?? 0,
        totalRevenueCents,
        paidCount: paidResult?.paidCount ?? 0,
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
