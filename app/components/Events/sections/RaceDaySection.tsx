"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface RaceDaySectionProps {
  race: Race;
}

export default function RaceDaySection({ race }: RaceDaySectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Race Day
        </Text>
        <Text size="sm" c="dimmed">
          Configure check-in and race day logistics
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Race Day Settings</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Set up check-in procedures, manage bib assignments,
            configure timing systems, and track race day logistics.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
