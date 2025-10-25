"use client";

import { Box, Stack, TextInput, Title } from "@mantine/core";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import { useRaceStore } from "@/app/context/RaceStoreContext";

export default function SocialMediaEditor() {
  const socialMedia = useRaceStore((state) => state.race.socialMedia);
  const updateSocialMedia = useRaceStore((state) => state.updateSocialMedia);

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
            title="Social Media"
            description="Add your social media links to connect with participants"
          />
        </Stack>

        <Stack gap="xl" px={2}>
          <Box>
            <Title order={4} mb="md">
              Social Media Links
            </Title>
            <Stack gap="md">
              <TextInput
                label="Facebook"
                placeholder="https://facebook.com/yourpage"
                value={socialMedia?.facebook || ""}
                onChange={(e) =>
                  updateSocialMedia({ ...socialMedia, facebook: e.target.value })
                }
                description="Your Facebook page URL"
              />
              <TextInput
                label="Instagram"
                placeholder="https://instagram.com/yourpage"
                value={socialMedia?.instagram || ""}
                onChange={(e) =>
                  updateSocialMedia({ ...socialMedia, instagram: e.target.value })
                }
                description="Your Instagram profile URL"
              />
              <TextInput
                label="Twitter/X"
                placeholder="https://x.com/yourpage"
                value={socialMedia?.twitter || ""}
                onChange={(e) =>
                  updateSocialMedia({ ...socialMedia, twitter: e.target.value })
                }
                description="Your Twitter/X profile URL"
              />
              <TextInput
                label="LinkedIn"
                placeholder="https://linkedin.com/company/yourcompany"
                value={socialMedia?.linkedin || ""}
                onChange={(e) =>
                  updateSocialMedia({ ...socialMedia, linkedin: e.target.value })
                }
                description="Your LinkedIn company page URL"
              />
              <TextInput
                label="Website"
                placeholder="https://yourwebsite.com"
                value={socialMedia?.website || ""}
                onChange={(e) =>
                  updateSocialMedia({ ...socialMedia, website: e.target.value })
                }
                description="Your organization's main website"
              />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
