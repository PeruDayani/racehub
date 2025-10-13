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
import { Camera } from "lucide-react";
import { useState } from "react";
import { GENDER_OPTIONS, T_SHIRT_SIZE_OPTIONS } from "@/app/lib/constants";
import type { UserProfile } from "@/app/lib/types";

interface ProfileEditorProps {
  profile: UserProfile;
}

export default function ProfileEditor({ profile }: ProfileEditorProps) {
  const [profileImageURL, _setProfileImageURL] = useState(
    profile.profileImageURL || "",
  );
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth || "");
  const [gender, setGender] = useState(profile.gender || "");
  const [tShirtSize, setTShirtSize] = useState(profile.tShirtSize || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || "");
  const [emergencyContactName, setEmergencyContactName] = useState(
    profile.emergencyContactName || "",
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    profile.emergencyContactPhone || "",
  );
  const [emergencyContactEmail, setEmergencyContactEmail] = useState(
    profile.emergencyContactEmail || "",
  );

  return (
    <Box p="xl" maw={900} mx="auto">
      <Stack gap="lg">
        <Stack gap="sm">
          <Title order={2}>Profile</Title>
          <Text c="dimmed">Manage your personal information</Text>
        </Stack>

        <Stack gap="xl">
          {/* Profile Photo Section */}
          <Card withBorder shadow="sm" radius="md" py="lg">
            <Card.Section inheritPadding py="xs">
              <Text fw={500}>Profile Photo</Text>
            </Card.Section>
            <Card.Section inheritPadding py="xs">
              <Group align="center" gap="xl">
                <Avatar
                  src={profileImageURL || null}
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
                    <TextInput
                      label="Date of Birth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="Gender"
                      placeholder="Select gender"
                      value={gender}
                      onChange={(value) => setGender(value || "")}
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
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="T-Shirt Size"
                      placeholder="Select size"
                      value={tShirtSize}
                      onChange={(value) => setTShirtSize(value || "")}
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
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                      value={emergencyContactEmail}
                      onChange={(e) => setEmergencyContactEmail(e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card.Section>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
