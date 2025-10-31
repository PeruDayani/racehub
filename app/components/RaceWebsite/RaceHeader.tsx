"use client";

import { Badge, Group, Title } from "@mantine/core";
import type { Race } from "@/app/lib/types";
import { useRaceStore } from "@/app/context/RaceStoreContext";

interface RaceHeaderProps {
  race: Race;
  showStatus?: boolean;
}

export default function RaceHeader({
  race,
  showStatus = false,
}: RaceHeaderProps) {
  const raceStatus = useRaceStore((state) => state.race.status);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "live":
        return "green";
      case "draft":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Group justify="flex-start" align="center" mb="md">
      {showStatus && (
        <Badge color={getStatusColor(race.status)} variant="light" size="lg">
          {race.status.toUpperCase()}
        </Badge>
      )}
      {race.options.some((opt) => opt.isVirtual) && (
        <Badge color="blue" variant="light" size="lg">
          VIRTUAL
        </Badge>
      )}
      <Title order={1} size="h1">
        {race.name}
      </Title>
    </Group>
  );
}
