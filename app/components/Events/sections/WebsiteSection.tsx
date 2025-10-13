"use client";

import { Card, Stack, Text } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface WebsiteSectionProps {
  race: Race;
}

export default function WebsiteSection({ race }: WebsiteSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Website
        </Text>
        <Text size="sm" c="dimmed">
          Customize your public race website
        </Text>
      </div>

      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Website Customization</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Text c="dimmed" size="sm">
            Coming soon: Edit website content, upload banners and logos,
            customize sections, and manage the race slug.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
