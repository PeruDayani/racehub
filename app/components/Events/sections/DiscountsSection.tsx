"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface DiscountsSectionProps {
  race: Race;
}

export default function DiscountsSection({ race }: DiscountsSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Discounts
        </Text>
        <Text size="sm" c="dimmed">
          Create promo codes and early bird discounts
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Discount Management</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Create promo codes, set discount percentages, manage
            early bird pricing, and track usage.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
