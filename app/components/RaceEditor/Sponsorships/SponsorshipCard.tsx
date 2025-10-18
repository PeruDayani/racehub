"use client";

import {
  ActionIcon,
  Card,
  Collapse,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import type { Sponsorship } from "@/app/lib/types";

interface SponsorshipCardProps {
  sponsorship: Sponsorship;
  index: number;
}

const TIER_OPTIONS = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
];

export default function SponsorshipCard({
  sponsorship,
  index,
}: SponsorshipCardProps) {
  const [collapsed, setCollapsed] = useState<boolean>(sponsorship.name !== "");

  const updateSponsorship = useRaceStore((state) => state.updateSponsorship);
  const deleteSponsorship = useRaceStore((state) => state.deleteSponsorship);

  const onUpdate = (field: keyof Sponsorship, value: any) => {
    updateSponsorship(sponsorship.id, { [field]: value });
  };

  const getSummary = () => {
    const tierLabel =
      TIER_OPTIONS.find((t) => t.value === sponsorship.tier)?.label || "Bronze";
    const name = sponsorship.name || "Untitled Sponsorship";
    return `${index + 1}. ${name} - ${tierLabel ? `${tierLabel} Tier` : ""}`;
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
                {getSummary()}
              </Text>
              <Text size="xs" c="dimmed">
                {sponsorship.description || "No description"}
              </Text>
            </div>
          </Group>
          <ActionIcon
            color="red"
            variant="subtle"
            size="sm"
            onClick={() => deleteSponsorship(sponsorship.id)}
          >
            <Trash2 size={16} />
          </ActionIcon>
        </Group>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack gap="md" pt="md">
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Sponsor Name"
                placeholder="e.g., Nike, Adidas, Local Business"
                value={sponsorship.name || ""}
                onChange={(e) => onUpdate("name", e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Tier"
                placeholder="Select tier"
                data={TIER_OPTIONS}
                value={sponsorship.tier}
                onChange={(value) =>
                  onUpdate("tier", value as Sponsorship["tier"])
                }
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Description"
            placeholder="Describe the sponsorship details, benefits, or partnership"
            value={sponsorship.description || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
            minRows={3}
          />
        </Stack>
      </Collapse>
    </Card>
  );
}
