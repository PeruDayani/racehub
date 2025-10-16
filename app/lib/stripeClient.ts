"use client";
import { loadStripe } from "@stripe/stripe-js";

// This returns a singleton instance of Stripe in the browser.
export const getStripe = async () =>
  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
