"use client";

import {
  Card,
  Group,
  NumberInput,
} from "@mantine/core";

import React, {useState, useEffect} from 'react';

import { useRaceStore } from "@/app/context/RaceStoreContext";



export default function GpsInputs() {
  const race = useRaceStore((state) => state.race);
  const setRaceStartLat = useRaceStore((state) => state.setRaceStartLat)
  const setRaceStartLon = useRaceStore((state) => state.setRaceStartLon)

  const [lat, setLat] = useState<number | string>(
    race.startLat ?? "",
  );
  const [lon, setLon] = useState<number | string>(race.startLon ?? "");
  
  useEffect(() => {
    console.log("lat state changed:", lat);
  }, [lat]);
  
  return (
    <Card withBorder shadow="sm" radius="md" py="lg">
      <Card.Section inheritPadding py="xs">
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
        label="Latitude"
        placeholder="e.g. 37.7749"
        value={lat}
        onChange={(v) => {
          // v is number | string | undefined
          if (typeof v === "number") {
            setLat(v);
            setRaceStartLat(v); // store numeric input
          } else {
            setLat("");
            setRaceStartLat(""); // store empty string if cleared
          }
        }}
        step={0.000001}
        min={-90}
        max={90}
        />

        <NumberInput
        label="Longitude"
        placeholder="e.g. -122.4194"
        value={lon === "" ? undefined : Number(lon)}
        onChange={(v) => {
          if (typeof v === "number") {
            setLon(v);
            setRaceStartLon(v);
          } else {
            setLon("");
            setRaceStartLon(null);
          }
        }}
        step={0.000001}
        min={-180}
        max={180}
        />
      </div>
      </Card.Section>
    </Card>
  );
}