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
  TextInput,
} from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import { GENDER_CATEGORIES, PRESET_DISTANCES } from "@/app/lib/constants";
import type { RaceOption } from "@/app/lib/types";
import DistanceSelector from "./DistanceSelector";

interface RaceOptionEditorProps {
  optionId: number;
  option: RaceOption;
  index: number;
}

export default function RaceOptionEditor({
  optionId,
  option,
  index,
}: RaceOptionEditorProps) {
  const [collapsed, setCollapsed] = useState(true);
  const updateRaceOption = useRaceStore((state) => state.updateRaceOption);
  const deleteRaceOption = useRaceStore((state) => state.deleteRaceOption);

  const onUpdate = (field: keyof RaceOption, value: any) => {
    updateRaceOption({ ...option, [field]: value });
  };

  const getSummary = () => {
    let distance = "No distance set";
    if (option.distanceKm) {
      const distanceKm = Number(option.distanceKm);
      const distancePreset = PRESET_DISTANCES.find(
        (preset) => preset.km === distanceKm,
      )?.label;

      if (distancePreset) {
        distance = distancePreset;
      } else {
        distance = `${distanceKm} km`;
      }
    }

    const gender =
      GENDER_CATEGORIES.find((cat) => cat.value === option.genderCategory)
        ?.label || "All genders";
    const pricing = option.isFree ? "Free" : "Paid";

    return `${pricing} ${distance} run for ${gender.toLowerCase()}`;
  };

  return (
    <Card withBorder shadow="sm" radius="md" p="lg">
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </ActionIcon>
            <Text fw={500}>
              Race Option {index + 1}: {option.name}
            </Text>
          </Group>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => deleteRaceOption(optionId)}
          >
            <Trash2 size={18} />
          </ActionIcon>
        </Group>
        <Text size="sm" fs="italic" c="dimmed">
          {getSummary()}
        </Text>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack pt="lg" gap="lg">
          {/* Name and Description */}
          <TextInput
            label="Name"
            placeholder="e.g., 5K Fun Run"
            value={option.name || ""}
            onChange={(e) => onUpdate("name", e.target.value)}
          />

          <Textarea
            label="Description"
            placeholder="Describe this race option"
            value={option.description || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
          />

          {/* Distance */}
          <DistanceSelector
            value={Number(option.distanceKm) || 0}
            onChange={(km) => onUpdate("distanceKm", km.toString())}
          />

          {/* Time Fields */}
          <Grid>
            <Grid.Col span={6}>
              <TimePicker
                label="Start Time"
                value={option.startTime || ""}
                onChange={(e) => onUpdate("startTime", e)}
                withDropdown
                format="12h"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TimePicker
                label="Cutoff Time"
                value={option.cutoffTime || ""}
                onChange={(e) => onUpdate("cutoffTime", e)}
                withDropdown
                format="12h"
              />
            </Grid.Col>
          </Grid>

          {/* Gender Category */}
          <Select
            label="Gender Category"
            placeholder="Select gender category"
            data={GENDER_CATEGORIES}
            value={option.genderCategory || "all"}
            onChange={(value) => onUpdate("genderCategory", value || "all")}
          />

          {/* Age Range */}
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

          {/* Virtual and Free Options */}
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
