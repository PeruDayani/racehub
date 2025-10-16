import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Use whatever the latest available in your project; this exact string isn’t critical for dev
  apiVersion: "2025-09-30.clover",
});
