"use client";

import { Card, NumberInput, Stack, Text } from "@mantine/core";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { useRaceStore } from "@/app/context/RaceStoreContext";

interface GpsCoordinateCardProps {
  title: string;
  latValue: number | null | undefined;
  lonValue: number | null | undefined;
  onLatChange: (lat: number | null) => void;
  onLonChange: (lon: number | null) => void;
}

function GpsCoordinateCard({
  title,
  latValue,
  lonValue,
  onLatChange,
  onLonChange,
}: GpsCoordinateCardProps) {
  const [lat, setLat] = useState<number | string>(latValue ?? "");
  const [lon, setLon] = useState<number | string>(lonValue ?? "");
  const lastLatRef = useRef<number | null | undefined>(latValue);
  const lastLonRef = useRef<number | null | undefined>(lonValue);

  // Sync local state with props only when they change externally
  // (not from our own updates)
  useEffect(() => {
    if (latValue !== lastLatRef.current) {
      lastLatRef.current = latValue;
      setLat(latValue ?? "");
    }
  }, [latValue]);

  useEffect(() => {
    if (lonValue !== lastLonRef.current) {
      lastLonRef.current = lonValue;
      setLon(lonValue ?? "");
    }
  }, [lonValue]);

  // Reusable onChange handler for coordinate inputs
  const createCoordinateHandler = (
    setLocalState: (value: number | string) => void,
    ref: React.MutableRefObject<number | null | undefined>,
    onChange: (value: number | null) => void,
  ) => {
    return (v: string | number | undefined) => {
      // Allow string values during typing
      if (v === "" || v === undefined) {
        setLocalState("");
        ref.current = null;
        onChange(null);
      } else if (typeof v === "number") {
        setLocalState(v);
        ref.current = v;
        onChange(v);
      } else {
        // Keep string value while typing - don't update store yet
        setLocalState(v);
      }
    };
  };

  return (
    <Card withBorder shadow="sm" radius="md" py="lg">
      <Card.Section inheritPadding py="xs">
        <Text fw={500} mb="md">
          {title}
        </Text>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Latitude"
            placeholder="e.g. 37.7749"
            value={lat === "" ? undefined : lat}
            onChange={createCoordinateHandler(setLat, lastLatRef, onLatChange)}
            step={0.000001}
            min={-90}
            max={90}
            decimalScale={6}
            allowDecimal={true}
          />

          <NumberInput
            label="Longitude"
            placeholder="e.g. -122.4194"
            value={lon === "" ? undefined : lon}
            onChange={createCoordinateHandler(setLon, lastLonRef, onLonChange)}
            step={0.000001}
            min={-180}
            max={180}
            decimalScale={6}
            allowDecimal={true}
          />
        </div>
      </Card.Section>
    </Card>
  );
}

export default function GpsInputs() {
  const race = useRaceStore((state) => state.race);
  const setRaceStartLat = useRaceStore((state) => state.setRaceStartLat);
  const setRaceStartLon = useRaceStore((state) => state.setRaceStartLon);
  const setRaceEndLat = useRaceStore((state) => state.setRaceEndLat);
  const setRaceEndLon = useRaceStore((state) => state.setRaceEndLon);

  return (
    <Stack gap="md">
      <GpsCoordinateCard
        title="Plug in your race route GPS starting coordinates."
        latValue={race.startLat}
        lonValue={race.startLon}
        onLatChange={setRaceStartLat}
        onLonChange={setRaceStartLon}
      />
      <GpsCoordinateCard
        title="Plug in your race route GPS ending coordinates."
        latValue={race.endLat}
        lonValue={race.endLon}
        onLatChange={setRaceEndLat}
        onLonChange={setRaceEndLon}
      />
    </Stack>
  );
}
