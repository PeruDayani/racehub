import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/actions/utils";
import { stripe } from "@/app/lib/stripe";
import type { RaceOption, RaceOptionPrice } from "@/app/lib/types";

type CheckoutRequest = {
  raceId: number;
  raceName: string;
  raceSlug: string;
  raceOption: RaceOption;
  raceOptionPrice: RaceOptionPrice;
};

export async function POST(req: Request) {
  try {
    const { raceId, raceName, raceSlug, raceOption, raceOptionPrice } =
      (await req.json()) as CheckoutRequest;

    if (!raceId || !raceName || !raceSlug || !raceOption || !raceOptionPrice) {
      return NextResponse.json(
        {
          error:
            "Missing raceId, raceName, raceSlug, raceOption, or raceOptionPrice",
        },
        { status: 400 },
      );
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?raceId=${raceId}&raceSlug=${raceSlug}&raceOptionId=${raceOption.id}&raceOptionPriceId=${raceOptionPrice.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/races/${raceSlug}`,
      metadata: {
        userId: user.id,
        raceId,
        raceSlug,
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
