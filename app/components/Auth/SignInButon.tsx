"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInButton() {
  const pathname = usePathname();
  const href = `/auth/signin?redirect_to=${encodeURIComponent(pathname)}`;

  return (
    <Button component={Link} href={href}>
      Sign In
    </Button>
  );
}
