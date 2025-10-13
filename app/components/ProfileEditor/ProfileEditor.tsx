"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { Camera, Save } from "lucide-react";
import { useState } from "react";
import { updateProfileAction } from "@/app/actions/profileActions";
import AddressEditor from "@/app/components/AddressEditor/AddressEditor";
import { GENDER_OPTIONS, T_SHIRT_SIZE_OPTIONS } from "@/app/lib/constants";
import type { AddressInput, UserProfile } from "@/app/lib/types";

interface ProfileEditorProps {
  profile: UserProfile;
}

export default function ProfileEditor({ profile }: ProfileEditorProps) {
  const [form, setForm] = useState({
    profileImageURL: profile.profileImageURL ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "",
    tShirtSize: profile.tShirtSize ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    emergencyContactName: profile.emergencyContactName ?? "",
    emergencyContactPhone: profile.emergencyContactPhone ?? "",
    emergencyContactEmail: profile.emergencyContactEmail ?? "",
    address: profile.address ?? undefined,
  });

  const updateField = (
    field: keyof typeof form,
    value: string | AddressInput | undefined,
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfileAction(form);

      if (result.success) {
        notifications.show({
          title: "Profile updated!",
          message: "All changes have been saved.",
          autoClose: 1000,
          color: "cyan",
        });
      } else {
        notifications.show({
          title: "Failed to update profile!",
          message: result.message,
          autoClose: 3000,
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Failed to update profile!",
        message: "Please try again.",
        autoClose: 3000,
        color: "red",
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p="xl" maw={900} mx="auto">
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
            <Title order={2}>Profile</Title>
            <Button
              leftSection={<Save size={16} />}
              onClick={onSave}
              loading={isSaving}
              color="cyan"
            >
              Save
            </Button>
          </Group>
          <Text c="dimmed">Manage your personal information</Text>
        </Stack>

        <Stack gap="xl" px={2}>
          {/* Profile Photo Section */}
          <Card withBorder shadow="sm" radius="md" py="lg">
            <Card.Section inheritPadding py="xs">
              <Text fw={500}>(WIP) Profile Photo</Text>
            </Card.Section>
            <Card.Section inheritPadding py="xs">
              <Group align="center" gap="xl">
                <Avatar
                  src={form.profileImageURL || null}
                  size="lg"
                  radius="xl"
                  color="cyan"
                >
                  🏃
                </Avatar>
                <Stack gap={0}>
                  <Button
                    color="cyan"
                    variant="outline"
                    leftSection={<Camera size={16} />}
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    Upload Photo
                  </Button>
                  <Text size="xs" c="dimmed" mt="xs">
                    JPG, PNG or GIF (max. 2MB)
                  </Text>
                </Stack>
              </Group>
            </Card.Section>
          </Card>

          {/* Personal Information Section */}
          <Card withBorder shadow="sm" radius="md" py="lg">
            <Card.Section inheritPadding py="xs">
              <Text fw={500}>Personal Information</Text>
            </Card.Section>
            <Card.Section inheritPadding py="xs">
              <Stack gap="md">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <DateInput
                      label="Date of Birth"
                      placeholder="2025-01-01"
                      valueFormat="YYYY-MM-DD"
                      value={form.dateOfBirth}
                      onChange={(value) =>
                        updateField("dateOfBirth", value || "")
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="Gender"
                      placeholder="Select gender"
                      value={form.gender}
                      onChange={(value) => updateField("gender", value || "")}
                      data={GENDER_OPTIONS}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Phone Number"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={form.phoneNumber}
                      onChange={(e) =>
                        updateField("phoneNumber", e.target.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="T-Shirt Size"
                      placeholder="Select size"
                      value={form.tShirtSize}
                      onChange={(value) =>
                        updateField("tShirtSize", value || "")
                      }
                      data={T_SHIRT_SIZE_OPTIONS}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card.Section>
          </Card>

          {/* Emergency Contact Section */}
          <Card withBorder shadow="sm" radius="md" py="lg">
            <Card.Section inheritPadding py="xs">
              <Text fw={500}>Emergency Contact</Text>
            </Card.Section>
            <Card.Section inheritPadding py="xs">
              <Stack gap="md">
                <TextInput
                  label="Name"
                  placeholder="Full name"
                  value={form.emergencyContactName}
                  onChange={(e) =>
                    updateField("emergencyContactName", e.target.value)
                  }
                />

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={form.emergencyContactPhone}
                      onChange={(e) =>
                        updateField("emergencyContactPhone", e.target.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                      value={form.emergencyContactEmail}
                      onChange={(e) =>
                        updateField("emergencyContactEmail", e.target.value)
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card.Section>
          </Card>

          {/* Address Section */}
          <AddressEditor
            address={form.address}
            addressType={"user"}
            onChange={(address) => updateField("address", address)}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
