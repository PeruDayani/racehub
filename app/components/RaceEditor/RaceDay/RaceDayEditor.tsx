"use client";

import { Box, Stack } from "@mantine/core";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import GpsInputs from "@/app/components/RaceEditor/RaceDay/GpsInputs";

export default function RaceDay() {
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
          <PageHeader
            title="Race Day"
            description="Configure GPS tracking for race day"
          />
        </Stack>

        <Stack gap="xl" px={2}>
          <GpsInputs />
        </Stack>
      </Stack>
    </Box>
  );
}