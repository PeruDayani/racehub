"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface PaymentInfoSectionProps {
  race: Race;
}

export default function PaymentInfoSection({ race }: PaymentInfoSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Payment Information
        </Text>
        <Text size="sm" c="dimmed">
          Configure payment gateway and merchant settings
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Payment Gateway</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Connect payment processors, set merchant details, and
            configure payment options.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
