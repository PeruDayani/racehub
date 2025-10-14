"use client";

import {
  ActionIcon,
  Card,
  Collapse,
  Grid,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import type { RaceOptionPrice } from "@/app/lib/types";

type PriceOptionEditorProps = {
  index: number;
  raceOptionId: number;
  priceOption: RaceOptionPrice;
};

export default function PriceOptionEditor({
  index,
  raceOptionId,
  priceOption,
}: PriceOptionEditorProps) {
  const [collapsed, setCollapsed] = useState<boolean>(
    priceOption.priceCents !== null && priceOption.priceCents > 0,
  );

  const updatePriceOption = useRaceStore((state) => state.updatePriceOption);
  const deletePriceOption = useRaceStore((state) => state.deletePriceOption);
  const priceInDollars = (priceOption.priceCents || 0) / 100;

  const onUpdate = (field: keyof RaceOptionPrice, value: any) => {
    updatePriceOption(raceOptionId, { ...priceOption, [field]: value });
  };

  const getAvailabilityText = () => {
    const hasExpiry = priceOption.expiresAt;
    const hasMaxParticipants = priceOption.maxParticipants;

    if (hasExpiry && hasMaxParticipants) {
      return `available until ${new Date(
        priceOption.expiresAt!,
      ).toLocaleDateString()} or for ${priceOption.maxParticipants} spots`;
    }
    if (hasExpiry) {
      return `available until ${new Date(
        priceOption.expiresAt!,
      ).toLocaleDateString()}`;
    }
    if (hasMaxParticipants) {
      return `available for ${priceOption.maxParticipants} spots`;
    }
    return "unlimited availability";
  };

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand" : "Collapse"}
              mt={2}
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </ActionIcon>
            <div>
              <Text fw={600} size="sm">
                Ticket Option {index + 1}: {priceOption.label || "Untitled"}
              </Text>
              <Text size="xs" c="dimmed">
                ${priceInDollars.toFixed(2)} {getAvailabilityText()}
              </Text>
            </div>
          </Group>
          <ActionIcon
            color="red"
            variant="subtle"
            size="sm"
            onClick={() => deletePriceOption(raceOptionId, priceOption.id)}
          >
            <Trash2 size={16} />
          </ActionIcon>
        </Group>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack gap="md" pt="md">
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Label"
                placeholder="e.g., Early Bird, Regular, Late Registration"
                value={priceOption.label || ""}
                onChange={(e) => onUpdate("label", e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Price"
                placeholder="$40.00"
                prefix="$"
                value={priceInDollars}
                onChange={(value) =>
                  onUpdate("priceCents", Math.round((Number(value) || 0) * 100))
                }
                min={0}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Max Participants"
                placeholder="Unlimited"
                value={priceOption.maxParticipants ?? undefined}
                onChange={(value) => onUpdate("maxParticipants", value || null)}
                min={0}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateTimePicker
                label="Expires At"
                placeholder="Select expiry date and time"
                value={
                  priceOption.expiresAt ? new Date(priceOption.expiresAt) : null
                }
                onChange={(value) => onUpdate("expiresAt", value)}
                clearable
                timePickerProps={{
                  format: "12h",
                }}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Collapse>
    </Card>
  );
}
