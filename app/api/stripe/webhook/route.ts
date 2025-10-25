import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createTicketAction } from "@/app/actions/ticketActions";
import { stripe } from "@/app/lib/stripe";

export const runtime = "nodejs"; // Required for raw body

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("[ERROR] Invalid signature:", err.message);
    return new NextResponse(`Webhook signature error`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { metadata } = session;
        if (!metadata) break;

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null);

        const result = await createTicketAction({
          userId: metadata.userId,
          raceId: Number(metadata.raceId),
          raceOptionId: Number(metadata.raceOptionId),
          raceOptionPriceId: Number(metadata.raceOptionPriceId),
          stripeSessionId: session.id,
          stripePaymentIntentId: paymentIntentId ?? "",
          stripePaymentIntentStatus: session.payment_status ?? "unknown",
          amountPaidCents: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          discountAmountCents: session.total_details?.amount_discount ?? 0,
          taxAmountCents: session.total_details?.amount_tax ?? 0,
          finalAmountCents: session.amount_total ?? 0,
          metadata,
        });

        if (!result.success) {
          console.error("[ERROR] Ticket creation failed:", result.message);
          // Return 200 so Stripe doesn’t retry indefinitely; log for manual check
          return new NextResponse("Ticket insert failed", { status: 200 });
        }

        console.log(`[SUCCESS] Ticket created for user ${metadata.userId}`);
        break;
      }

      default:
        console.log(`[WARNING] Unhandled event type: ${event.type}`);
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("[ERROR] Webhook processing error:", err);
    // 500 → Stripe retries (safe)
    return new NextResponse("Internal webhook error", { status: 500 });
  }
}
