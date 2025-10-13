"use client";

import { Button } from "@mantine/core";
import { useCallback, useState } from "react";
import { signOutAction } from "@/app/actions/authActions";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const onSignOut = useCallback(async () => {
    setIsLoading(true);

    const result = await signOutAction();

    // If result is returned, it means there was an error
    // (successful sign-out redirects and never returns)
    if (!result.success) {
      console.error("Sign out failed: ", result.message);
      setIsLoading(false);
    }
  }, []);

  return (
    <Button onClick={onSignOut} disabled={isLoading}>
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
