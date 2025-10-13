"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface TicketDetailsSectionProps {
  race: Race;
}

export default function TicketDetailsSection({
  race,
}: TicketDetailsSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Ticket Details
        </Text>
        <Text size="sm" c="dimmed">
          Manage race options, distances, and pricing tiers
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Race Options & Pricing</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Create and manage race distances, start times, pricing
            tiers, and participant limits.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
