"use client";

import { Box, Button, Group, Stack } from "@mantine/core";
import { Plus } from "lucide-react";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import type { Sponsorship } from "@/app/lib/types";
import SponsorshipCard from "./SponsorEditor";

export default function SponsorshipsEditor() {
  const sponsorships = useRaceStore((state) => state.getSponsorships());
  const addSponsorship = useRaceStore((state) => state.addSponsorship);

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
              title="Sponsorships"
              description="Manage race sponsors and partnerships"
            />
            <Button leftSection={<Plus size={16} />} onClick={addSponsorship}>
              Add Sponsorship
            </Button>
          </Group>
        </Stack>

        <Stack gap="xl" px={2}>
          {sponsorships.length === 0 ? (
            <Box
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--mantine-color-dimmed)",
              }}
            >
              No sponsorships yet. Click "Add Sponsorship" to get started.
            </Box>
          ) : (
            sponsorships.map((sponsorship: Sponsorship, index: number) => (
              <SponsorshipCard
                key={sponsorship.id}
                sponsorship={sponsorship}
                index={index}
              />
            ))
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
