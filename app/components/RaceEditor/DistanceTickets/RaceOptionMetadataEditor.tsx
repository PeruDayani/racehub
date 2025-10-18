"use client";

import {
  ActionIcon,
  Card,
  Collapse,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@mantine/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import { GENDER_CATEGORIES } from "@/app/lib/constants";
import type { RaceOption } from "@/app/lib/types";

interface RaceOptionMetadataEditorProps {
  optionId: number;
  option: RaceOption;
}

export default function RaceOptionMetadataEditor({
  optionId,
  option,
}: RaceOptionMetadataEditorProps) {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const updateRaceOption = useRaceStore((state) => state.updateRaceOption);

  const onUpdate = (field: keyof RaceOption, value: any) => {
    updateRaceOption({ ...option, [field]: value });
  };

  const getMetadataSummary = () => {
    const parts = [];

    if (option.description) {
      parts.push(option.description);
    }

    if (option.genderCategory) {
      const genderLabel =
        GENDER_CATEGORIES.find((cat) => cat.value === option.genderCategory)
          ?.label || option.genderCategory;
      parts.push(genderLabel);
    }

    if (option.ageMin || option.ageMax) {
      const ageRange = [];
      if (option.ageMin) ageRange.push(`over ${option.ageMin}`);
      if (option.ageMax) ageRange.push(`under ${option.ageMax}`);
      parts.push(`Age: ${ageRange.join(" & ")}`);
    }

    if (option.isVirtual) {
      parts.push("Virtual");
    }

    if (option.isFree) {
      parts.push("Free");
    }

    return parts.length > 0 ? parts.join(" • ") : "No metadata configured";
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
                Metadata
              </Text>
              <Text size="xs" c="dimmed">
                {getMetadataSummary()}
              </Text>
            </div>
          </Group>
        </Group>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack gap="md" pt="md">
          <Textarea
            label="Description"
            placeholder="Describe this race option"
            value={option.description || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
          />

          <Select
            label="Gender Category"
            placeholder="Select gender category"
            data={GENDER_CATEGORIES}
            value={option.genderCategory || "all"}
            onChange={(value) => onUpdate("genderCategory", value || "all")}
          />

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Minimum Age"
                placeholder="No minimum"
                value={option.ageMin ?? undefined}
                onChange={(value) => onUpdate("ageMin", value || null)}
                min={0}
                max={120}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Maximum Age"
                placeholder="No maximum"
                value={option.ageMax ?? undefined}
                onChange={(value) => onUpdate("ageMax", value || null)}
                min={0}
                max={120}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group justify="space-between" align="center">
                <div>
                  <Text size="sm" fw={500}>
                    Virtual Race
                  </Text>
                  <Text size="sm" c="dimmed">
                    Participants run remotely and submit times
                  </Text>
                </div>
                <Switch
                  checked={option.isVirtual || false}
                  onChange={(e) =>
                    onUpdate("isVirtual", e.currentTarget.checked)
                  }
                />
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group justify="space-between" align="center">
                <div>
                  <Text size="sm" fw={500}>
                    Free Race Type
                  </Text>
                  <Text size="sm" c="dimmed">
                    Toggle if this race type is free to participate
                  </Text>
                </div>
                <Switch
                  checked={option.isFree || false}
                  onChange={(e) => onUpdate("isFree", e.currentTarget.checked)}
                />
              </Group>
            </Grid.Col>
          </Grid>
        </Stack>
      </Collapse>
    </Card>
  );
}
