"use client";

import { Box, Button, Group, Stack } from "@mantine/core";
import { Plus } from "lucide-react";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import type { RaceOption } from "@/app/lib/types";
import RaceOptionCard from "./RaceOptionEditor";

export default function DistanceTicketsEditor() {
  const raceOptions = useRaceStore((state) => state.race.options);
  const addRaceOption = useRaceStore((state) => state.addRaceOption);

  return (
    <Box p="xl" w="100%" maw={1200} mx="auto">
      <Stack gap="lg" pos="relative">
        <Stack
          gap="sm"
          pos="sticky"
          top={80}
          py={12}
          style={{
            zIndex: 200,
            backgroundColor: "var(--mantine-color-body)",
          }}
        >
          <Group justify="space-between" align="center">
            <PageHeader
              title="Distances & Tickets"
              description="Configure race distances and pricing"
            />
            <Button leftSection={<Plus size={16} />} onClick={addRaceOption}>
              Add Race Option
            </Button>
          </Group>
        </Stack>

        <Stack gap="xl" px={2}>
          {raceOptions.length === 0 ? (
            <Box
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--mantine-color-dimmed)",
              }}
            >
              No race options yet. Click "Add Race Option" to get started.
            </Box>
          ) : (
            raceOptions.map((option: RaceOption, index: number) => (
              <RaceOptionCard
                key={option.id}
                optionId={option.id}
                option={option}
                index={index}
              />
            ))
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
