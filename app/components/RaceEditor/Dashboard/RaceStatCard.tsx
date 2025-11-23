"use client";

import { Card, Flex, Stack, Text, Title, Box } from "@mantine/core";
import type { LucideIcon } from "lucide-react";

type RaceStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number | React.ReactNode;
  description?: string;
  iconColor?: string;
  iconSize?: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function RaceStatCard({
  icon: Icon,
  label,
  value,
  description,
  iconColor = "var(--mantine-color-blue-6)",
  iconSize = 32,
}: RaceStatCardProps) {
  // Format value based on type
  const formatValue = (val: string | number | React.ReactNode): React.ReactNode => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card withBorder radius="md" padding="lg" shadow="sm" style={{ height: "100%" }}>
      <Flex align="flex-start" gap="md">
        {/* Icon */}
        <Box
          style={{
            padding: 12,
            borderRadius: "var(--mantine-radius-md)",
            backgroundColor: `${iconColor}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={iconSize} color={iconColor} strokeWidth={2} />
        </Box>

        {/* Content */}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed" lineClamp={1}>
            {label}
          </Text>
          <Title order={2} fw={800} lineClamp={1}>
            {formatValue(value)}
          </Title>
          {description && (
            <Text fz="xs" c="dimmed" lineClamp={2}>
              {description}
            </Text>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}

// Helper function to format currency values (cents to dollars)
export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

// Helper function to format percentage values
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

