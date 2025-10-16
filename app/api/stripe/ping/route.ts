import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

export async function GET() {
  try {
    // Simple call that works in test mode; proves the secret key is valid
    const balance = await stripe.balance.retrieve();
    const hasAvailable =
      Array.isArray(balance.available) && balance.available.length >= 0;
    return NextResponse.json({ ok: true, hasAvailable });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Stripe key failed" },
      { status: 500 },
    );
  }
}
