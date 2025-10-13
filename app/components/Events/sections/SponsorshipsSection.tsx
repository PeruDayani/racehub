"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface SponsorshipsSectionProps {
  race: Race;
}

export default function SponsorshipsSection({
  race,
}: SponsorshipsSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Sponsorships
        </Text>
        <Text size="sm" c="dimmed">
          Manage event sponsors and their display on your race website
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Sponsor Management</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Add sponsors, upload logos, set tier levels, and manage
            display order.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
