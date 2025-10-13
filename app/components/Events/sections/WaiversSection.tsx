"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface WaiversSectionProps {
  race: Race;
}

export default function WaiversSection({ race }: WaiversSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Waivers
        </Text>
        <Text size="sm" c="dimmed">
          Manage legal waivers and participant agreements
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Waiver Management</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Create custom waivers, set legal requirements, and
            manage participant agreements.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
