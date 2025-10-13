"use client";

import { Avatar, Menu, Stack, Text, UnstyledButton } from "@mantine/core";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { signOutAction } from "@/app/actions/authActions";
import type { AuthClaims } from "@/app/lib/types";
import { getInitials } from "@/app/lib/utils";

export default function UserMenu({ user }: { user: AuthClaims }) {
  const userName = user.user_metadata?.full_name;
  const userEmail = user.email;
  const initials = getInitials(userName, userEmail);

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
    <Menu trigger="hover" position="bottom-end" shadow="md" width={230}>
      <Menu.Target>
        <UnstyledButton>
          <Avatar color="blue" radius="xl">
            {initials}
          </Avatar>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {/* User Info Section */}
        <Stack gap={4} p="sm">
          {userName && (
            <Text size="sm" fw={500}>
              {userName}
            </Text>
          )}
          {userEmail && (
            <Text size="xs" c="dimmed">
              {userEmail}
            </Text>
          )}
        </Stack>

        <Menu.Divider />

        <Menu.Item
          leftSection={<LayoutDashboard size={16} />}
          component={Link}
          href="/races"
        >
          Races
        </Menu.Item>
        <Menu.Item
          leftSection={<User size={16} />}
          component={Link}
          href="/profile"
        >
          Profile
        </Menu.Item>
        <Menu.Item leftSection={<Settings size={16} />}>Settings</Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={<LogOut size={16} />}
          onClick={onSignOut}
          disabled={isLoading}
          color="red"
        >
          {isLoading ? "Signing out..." : "Sign out"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
