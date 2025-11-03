"use client";

import { Box, Stack } from "@mantine/core";
import MediaUpload from "@/app/components/MediaUpload/MediaUpload";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import PageHeader from "../../PageHeader.tsx/PageHeader";

export default function WaiverEditor() {
  const raceId = useRaceStore((state) => state.race.id);
  const waiver = useRaceStore((state) => state.race.waivers);
  const addWaiver = useRaceStore((state) => state.addWaiver);
  const _race = useRaceStore((s) => s.race);
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
          <PageHeader title="Waiver" description="Add your race waivers." />
        </Stack>
        <Stack>
          <MediaUpload
            currentMedia={waiver}
            onMediaChange={addWaiver}
            bucket="website"
            folderId={raceId.toString()}
            label="Waiver"
            description="Upload a waiver for your race."
            accept="application/pdf"
            maxSize={10}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
