"use client";

import { Card, NumberInput, Stack, Text } from "@mantine/core";

import type React from "react";

import { useRaceStore } from "@/app/context/RaceStoreContext";

import type {Media} from "@/app/lib/types";

import MediaUpload from "@/app/components/MediaUpload/MediaUpload"

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
            value={latValue === null ? undefined : latValue}
            onChange={(lat) => onLatChange(lat === "" ? null: Number(lat))}
            step={0.000001}
            min={-90}
            max={90}
            decimalScale={6}
            allowDecimal={true}
          />

          <NumberInput
            label="Longitude"
            placeholder="e.g. -122.4194"
            value={lonValue === null ? undefined : lonValue}
            onChange={(lon) => onLonChange(lon === "" ? null: Number(lon))}
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
  const updateRaceField = useRaceStore((state) => state.updateRaceField)

  return (
    <Stack gap="md">
      <GpsCoordinateCard
        title="Plug in your race route GPS starting coordinates."
        latValue={race.startLat}
        lonValue={race.startLon}
        onLatChange={(lat) => updateRaceField("startLat", lat)}
        onLonChange={(lon) => updateRaceField("startLon", lon)}
      />
      <GpsCoordinateCard
        title="Plug in your race route GPS ending coordinates."
        latValue={race.endLat}
        lonValue={race.endLon}
        onLatChange={(lat) => updateRaceField("endLat", lat)}
        onLonChange={(lon) => updateRaceField("endLon", lon)}
      />
      <MediaUpload
        currentMedia={race.gpx}
        onMediaChange={(media) => updateRaceField("gpx", media)}
        bucket="gpx" 
        folderId={race.id}
        label="GPX Route File"
        description="Upload a .gpx file to define the full race route."
        accept="application/gpx+xml"
        maxSize={5}
      />
    </Stack>
  );
}
