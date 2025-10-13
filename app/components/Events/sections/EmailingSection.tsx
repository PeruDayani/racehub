"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface EmailingSectionProps {
  race: Race;
}

export default function EmailingSection({ race }: EmailingSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Emailing
        </Text>
        <Text size="sm" c="dimmed">
          Manage email templates and participant communication
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Email Management</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Create email templates, send announcements, manage
            automated emails, and track delivery.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
