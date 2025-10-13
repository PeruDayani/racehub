"use client";

import { Box, Card, Group, Stack, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import AddressEditor from "@/app/components/AddressEditor/AddressEditor";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import { useRaceStore } from "@/app/context/RaceStoreContext";

export default function BasicInformationEditor() {
  const raceName = useRaceStore((state) => state.race.name);
  const raceDate = useRaceStore((state) => state.race.date);
  const raceRegistrationDeadline = useRaceStore(
    (state) => state.race.registrationDeadline,
  );
  const raceAddress = useRaceStore((state) => state.race.address);
  const updateRaceField = useRaceStore((state) => state.updateRaceField);

  return (
    <Box p="sm" w={"100%"} maw={1200} mx="auto">
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
              title="Basic Information"
              description="Race name, date, and location"
            />
          </Group>
        </Stack>

        <Stack gap="xl" px={2}>
          {/* Race Details Section */}
          <Card withBorder shadow="sm" radius="md" py="lg">
            <Card.Section inheritPadding py="xs">
              <Text fw={500}>Race Details</Text>
            </Card.Section>
            <Card.Section inheritPadding py="xs">
              <Stack gap="md">
                <TextInput
                  label="Race Name"
                  placeholder="Enter race name"
                  value={raceName || ""}
                  onChange={(e) => updateRaceField("name", e.target.value)}
                  required
                />

                <DateInput
                  label="Date"
                  placeholder="Select race date"
                  valueFormat="YYYY-MM-DD"
                  value={raceDate || null}
                  onChange={(value) => updateRaceField("date", value || null)}
                  clearable
                />

                <DateInput
                  label="Registration Deadline"
                  placeholder="Select registration deadline"
                  valueFormat="YYYY-MM-DD"
                  value={raceRegistrationDeadline || null}
                  onChange={(value) =>
                    updateRaceField("registrationDeadline", value || null)
                  }
                  clearable
                  maxDate={raceDate}
                />
              </Stack>
            </Card.Section>
          </Card>

          {/* Address Section */}
          <AddressEditor
            address={raceAddress}
            addressType="race"
            onChange={(address) => updateRaceField("address", address)}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
