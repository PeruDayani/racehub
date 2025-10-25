"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import type { RaceOption, RaceOptionPrice } from "@/app/lib/types";

type CheckoutButtonProps = {
  raceId: number;
  raceName: string;
  raceSlug: string;
  raceOption: RaceOption;
  raceOptionPrice: RaceOptionPrice;
};

export default function CheckoutButton({
  raceId,
  raceName,
  raceSlug,
  raceOption,
  raceOptionPrice,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Check authentication status on component mount
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
    };

    checkUser();
  }, [supabase.auth]);

  const formatPrice = (priceCents: number | null) => {
    if (!priceCents) return "Free";
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to sign in page with current URL as redirect_to
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/auth/signin?redirect_to=${encodeURIComponent(currentUrl)}`);
      return;
    }

    try {
      setLoading(true);

      // Call our server endpoint
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raceId,
          raceName,
          raceSlug,
          raceOption,
          raceOptionPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url)
        throw new Error(data.error || "Checkout failed");

      // Redirect to Stripe-hosted checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Error starting checkout", err);
      alert("Something went wrong starting checkout.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
    return <Button disabled>Loading...</Button>;
  }

  // Show different button text based on authentication status
  const getButtonText = () => {
    if (loading) return "Loading...";
    if (!user)
      return `Sign in to purchase - ${formatPrice(raceOptionPrice.priceCents)}`;
    return formatPrice(raceOptionPrice.priceCents);
  };

  return (
    <Button onClick={handleCheckout} loading={loading}>
      {getButtonText()}
    </Button>
  );
}
