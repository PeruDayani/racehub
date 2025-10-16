import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import type { RaceOption, RaceOptionPrice } from "@/app/lib/types";

type CheckoutRequest = {
  raceId: number;
  raceName: string;
  raceOption: RaceOption;
  raceOptionPrice: RaceOptionPrice;
};

export async function POST(req: Request) {
  try {
    const { raceId, raceName, raceOption, raceOptionPrice } =
      (await req.json()) as CheckoutRequest;

    if (!raceId || !raceName || !raceOption || !raceOptionPrice) {
      return NextResponse.json(
        { error: "Missing raceId, raceName, raceOption, or raceOptionPrice" },
        { status: 400 },
      );
    }

    // Create a one-time Checkout Session with dynamic price_data
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: raceOptionPrice.priceCents ?? 0,
            product_data: {
              name: `${raceName} Registration`,
              description: raceOption.name ?? "",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?raceId=${raceId}&raceOptionId=${raceOption.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/races/${raceId}`,
      metadata: {
        raceId,
        raceOptionId: raceOption.id,
        raceOptionPriceId: raceOptionPrice.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error", err);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
