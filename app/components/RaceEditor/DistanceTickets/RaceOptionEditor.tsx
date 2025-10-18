"use client";

import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import { PRESET_DISTANCES } from "@/app/lib/constants";
import type { RaceOption, RaceOptionPrice } from "@/app/lib/types";
import DistanceSelector from "./DistanceSelector";
import PriceOptionEditor from "./PriceOptionEditor";
import RaceOptionMetadataEditor from "./RaceOptionMetadataEditor";

interface RaceOptionEditorProps {
  optionId: number;
  option: RaceOption;
  index: number;
}

export default function RaceOptionEditor({
  optionId,
  option,
}: RaceOptionEditorProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const updateRaceOption = useRaceStore((state) => state.updateRaceOption);
  const deleteRaceOption = useRaceStore((state) => state.deleteRaceOption);

  const priceOptions = useRaceStore((state) => state.getPriceOptions(optionId));
  const addPriceOption = useRaceStore((state) => state.addPriceOption);

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

    const pricing = option.isFree ? "Free" : "Paid";

    return `${pricing} ${distance} run`;
  };

  return (
    <Card withBorder shadow="sm" radius="md" p="lg">
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
              <Text fw={500} size="lg">
                {option.name || "Untitled Race Option"}
              </Text>
              <Text size="sm" c="dimmed">
                {getSummary()}
              </Text>
            </div>
          </Group>
          <ActionIcon
            color="red"
            variant="subtle"
            size="sm"
            onClick={() => deleteRaceOption(optionId)}
          >
            <Trash2 size={16} />
          </ActionIcon>
        </Group>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack pt="lg" gap="lg">
          <TextInput
            label="Name"
            placeholder="e.g., 5K Fun Run"
            value={option.name || ""}
            onChange={(e) => onUpdate("name", e.target.value)}
          />

          <DistanceSelector
            value={Number(option.distanceKm) || 0}
            onChange={(km) => onUpdate("distanceKm", km.toString())}
          />

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

          {/* Metadata Section */}
          <RaceOptionMetadataEditor optionId={optionId} option={option} />
        </Stack>
      </Collapse>

      <Stack pt="lg" gap="lg">
        <Divider />

        {/* Price Options */}
        <Group justify="space-between" align="center">
          <Text size="md" fw={500}>
            Ticket Options
          </Text>
          <Button variant="light" onClick={() => addPriceOption(optionId)}>
            Add Ticket Option
          </Button>
        </Group>

        {priceOptions.map((priceOption: RaceOptionPrice, index: number) => (
          <PriceOptionEditor
            key={priceOption.id}
            index={index}
            raceOptionId={optionId}
            priceOption={priceOption}
          />
        ))}
      </Stack>
    </Card>
  );
}
