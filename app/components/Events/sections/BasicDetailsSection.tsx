"use client";

import { Card, Grid, Select, Stack, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import AddressEditor from "@/app/components/AddressEditor/AddressEditor";
import type { AddressInput, Race } from "@/app/lib/types";

interface BasicDetailsSectionProps {
  race: Race;
  onUpdate: (field: string, value: string | null | undefined) => void;
  onAddressUpdate: (address: AddressInput | undefined) => void;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export default function BasicDetailsSection({
  race,
  onUpdate,
  onAddressUpdate,
}: BasicDetailsSectionProps) {
  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={600} mb="xs">
          Basic Details
        </Text>
        <Text size="sm" c="dimmed">
          Set up the fundamental information about your race event
        </Text>
      </div>

      {/* Race Name & Status */}
      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Race Information</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Stack gap="md">
            <TextInput
              label="Race Name"
              placeholder="Enter race name"
              value={race.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              required
            />
            <Select
              label="Status"
              placeholder="Select status"
              value={race.status}
              onChange={(value) => onUpdate("status", value)}
              data={STATUS_OPTIONS}
            />
          </Stack>
        </Card.Section>
      </Card>

      {/* Dates */}
      <Card withBorder shadow="sm" radius="md" py="lg">
        <Card.Section inheritPadding py="xs">
          <Text fw={500}>Important Dates</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Race Date"
                placeholder="Select race date"
                valueFormat="YYYY-MM-DD"
                value={race.date ? new Date(race.date) : null}
                onChange={(value) =>
                  onUpdate(
                    "date",
                    value ? new Date(value).toISOString().split("T")[0] : null,
                  )
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Registration Deadline"
                placeholder="Select deadline"
                valueFormat="YYYY-MM-DD"
                value={
                  race.registrationDeadline
                    ? new Date(race.registrationDeadline)
                    : null
                }
                onChange={(value) =>
                  onUpdate(
                    "registrationDeadline",
                    value ? new Date(value).toISOString().split("T")[0] : null,
                  )
                }
              />
            </Grid.Col>
          </Grid>
        </Card.Section>
      </Card>

      {/* Address */}
      <AddressEditor
        address={race.address ?? undefined}
        addressType="race"
        onChange={onAddressUpdate}
      />
    </Stack>
  );
}
