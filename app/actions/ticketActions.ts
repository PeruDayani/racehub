"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { tickets } from "../../drizzle/schema";
import { db } from "../lib/db";
import type { Ticket } from "../lib/types";
import { getAuthenticatedUser } from "./utils";

/**
 * Ticket creation action
 */

type CreateTicketResponseType = {
  success: boolean;
  message: string;
  data?: {
    ticketId: number;
  };
};

type CreateTicketParams = {
  userId: string;
  raceId: number;
  raceOptionId: number;
  raceOptionPriceId: number;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  stripePaymentIntentStatus: string;
  amountPaidCents: number;
  currency: string;
  discountAmountCents?: number;
  taxAmountCents?: number;
  finalAmountCents: number;
  metadata?: Record<string, any>;
};

export async function createTicketAction(
  params: CreateTicketParams,
): Promise<CreateTicketResponseType> {
  try {
    if (
      !params.userId ||
      !params.raceId ||
      !params.raceOptionId ||
      !params.raceOptionPriceId ||
      !params.stripeSessionId ||
      !params.stripePaymentIntentId ||
      !params.stripePaymentIntentStatus ||
      !params.amountPaidCents ||
      !params.currency ||
      !params.finalAmountCents
    ) {
      return {
        success: false,
        message: "Incomplete payload - missing required parameters",
      };
    }

    // If the ticket already exists, do nothing
    const [ticket] = await db
      .insert(tickets)
      .values({
        userId: params.userId,
        raceId: params.raceId,
        raceOptionId: params.raceOptionId,
        raceOptionPriceId: params.raceOptionPriceId,
        stripeSessionId: params.stripeSessionId,
        stripePaymentIntentId: params.stripePaymentIntentId,
        stripePaymentIntentStatus: params.stripePaymentIntentStatus,
        amountPaidCents: params.amountPaidCents,
        currency: params.currency,
        discountAmountCents: params.discountAmountCents,
        taxAmountCents: params.taxAmountCents,
        finalAmountCents: params.finalAmountCents,
        metadata: params.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoNothing({ target: tickets.stripeSessionId })
      .returning();

    if (!ticket) {
      return {
        success: false,
        message: "Failed to create ticket",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/ticket/${ticket.id}`);

    return {
      success: true,
      message: "Ticket created successfully",
      data: {
        ticketId: ticket.id,
      },
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create ticket",
    };
  }
}

/**
 * Get user tickets action
 */

type GetUserTicketsResponseType = {
  success: boolean;
  message: string;
  data?: {
    tickets: Ticket[];
  };
};

export async function getUserTicketsAction(): Promise<GetUserTicketsResponseType> {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get all tickets for the user with related data
    const userTickets = await db.query.tickets.findMany({
      where: eq(tickets.userId, user.id),
      with: {
        race: {
          with: {
            address: true,
          },
        },
        raceOption: true,
        raceOptionPrice: true,
      },
      orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
    });

    return {
      success: true,
      message: "User tickets retrieved successfully",
      data: {
        tickets: userTickets,
      },
    };
  } catch (error) {
    console.error("Error getting user tickets:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get user tickets",
    };
  }
}

/**
 * Get ticket by ID action
 */

type GetTicketByIdResponseType = {
  success: boolean;
  message: string;
  data?: {
    ticket: Ticket;
  };
};

export async function getTicketByIdAction(
  ticketId: number,
): Promise<GetTicketByIdResponseType> {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get the ticket with related data
    const ticket = await db.query.tickets.findFirst({
      where: and(eq(tickets.id, ticketId), eq(tickets.userId, user.id)),
      with: {
        race: {
          with: {
            address: true,
          },
        },
        raceOption: true,
        raceOptionPrice: true,
      },
    });

    if (!ticket) {
      return {
        success: false,
        message: "Ticket not found",
      };
    }

    return {
      success: true,
      message: "Ticket retrieved successfully",
      data: {
        ticket,
      },
    };
  } catch (error) {
    console.error("Error getting ticket by ID:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get ticket",
    };
  }
}
