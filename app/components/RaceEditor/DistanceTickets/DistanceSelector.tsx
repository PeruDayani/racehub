"use client";

import { Grid, NumberInput, Select, Stack } from "@mantine/core";
import { useState } from "react";
import { DISTANCE_UNITS, PRESET_DISTANCES } from "@/app/lib/constants";

interface DistanceSelectorProps {
  value: number; // Always in km
  onChange: (km: number) => void;
}

export default function DistanceSelector({
  value,
  onChange,
}: DistanceSelectorProps) {
  const [preset, setPreset] = useState<string>(() => {
    if (value === 0) return "";
    const match = PRESET_DISTANCES.find((p) => p.km === value);
    return match ? match.value : "custom";
  });
  const [customValue, setCustomValue] = useState<number>(value);
  const [customUnit, setCustomUnit] = useState<string>("km");

  const handlePresetChange = (newPreset: string | null) => {
    if (!newPreset) return;
    setPreset(newPreset);

    const presetData = PRESET_DISTANCES.find((p) => p.value === newPreset);
    if (presetData?.km) {
      onChange(presetData.km);
      setCustomValue(presetData.km);
    }
  };

  const handleCustomDistanceChange = (newValue: number | string) => {
    const numValue =
      typeof newValue === "string" ? parseFloat(newValue) : newValue;
    if (Number.isNaN(numValue)) return;

    setCustomValue(numValue);

    // Convert to km based on unit
    let km = numValue;
    if (customUnit === "mi") {
      km = numValue * 1.60934;
    } else if (customUnit === "m") {
      km = numValue / 1000;
    }
    onChange(km);
  };

  const handleUnitChange = (newUnit: string | null) => {
    if (!newUnit) return;
    setCustomUnit(newUnit);

    // Recalculate km based on new unit
    let km = customValue;
    if (newUnit === "mi") {
      km = customValue * 1.60934;
    } else if (newUnit === "m") {
      km = customValue / 1000;
    }
    onChange(km);
  };

  return (
    <Stack gap="md">
      <Select
        label="Distance"
        placeholder="Select distance"
        data={PRESET_DISTANCES}
        value={preset}
        onChange={handlePresetChange}
      />

      {preset === "custom" && (
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Custom Distance"
              placeholder="Enter distance"
              value={customValue}
              onChange={handleCustomDistanceChange}
              min={0}
              step={0.1}
              decimalScale={2}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Unit"
              data={DISTANCE_UNITS}
              value={customUnit}
              onChange={handleUnitChange}
            />
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  );
}
