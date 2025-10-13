"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface ParticipantsSectionProps {
  race: Race;
}

export default function ParticipantsSection({
  race,
}: ParticipantsSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Participants & Results
        </Text>
        <Text size="sm" c="dimmed">
          View registrations and manage race results
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Registration & Results</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: View participant list, manage registrations, upload
            results, and generate reports.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
