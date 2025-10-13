"use client";

import { Card, Grid, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import type { AddressInput, AddressType } from "@/app/lib/types";

interface AddressEditorProps {
  address: AddressInput | null | undefined;
  addressType: AddressType;
  onChange: (address: AddressInput | undefined) => void;
}

export default function AddressEditor({
  address,
  addressType,
  onChange,
}: AddressEditorProps) {
  const [form, setForm] = useState<AddressInput>({
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postalCode ?? "",
    country: address?.country ?? "",
    type: addressType,
  });

  const updateField = (field: keyof AddressInput, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange(updated);
  };

  return (
    <Card withBorder shadow="sm" radius="md" py="lg">
      <Card.Section inheritPadding py="xs">
        <Text fw={500}>Address</Text>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <Stack gap="md">
          <TextInput
            label="Address Line 1"
            placeholder="123 Main Street"
            value={form.line1}
            onChange={(e) => updateField("line1", e.target.value)}
          />
          <TextInput
            label="Address Line 2"
            placeholder="Apt 4B (optional)"
            value={form.line2 ?? ""}
            onChange={(e) => updateField("line2", e.target.value)}
          />
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="City"
                placeholder="San Francisco"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="State"
                placeholder="CA"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Postal Code"
                placeholder="94102"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Country"
                placeholder="USA"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Card.Section>
    </Card>
  );
}
