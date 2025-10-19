"use client";

import { Box, Stack, Title } from "@mantine/core";
import MediaUpload from "@/app/components/MediaUpload/MediaUpload";
import { useRaceStore } from "@/app/context/RaceStoreContext";

export default function WebsiteMediaEditor() {
  const raceId = useRaceStore((state) => state.race.id);
  const websiteLogo = useRaceStore((state) => state.race.website.logo);
  const websiteBanner = useRaceStore((state) => state.race.website.banner);
  const updateWebsiteLogo = useRaceStore((state) => state.updateWebsiteLogo);
  const updateWebsiteBanner = useRaceStore(
    (state) => state.updateWebsiteBanner,
  );

  return (
    <Box>
      <Title order={4} mb="md">
        Media
      </Title>
      <Stack gap="lg">
        <MediaUpload
          currentMedia={websiteLogo}
          onMediaChange={updateWebsiteLogo}
          bucket="website"
          folderId={raceId.toString()}
          label="Logo"
          description="Upload a logo for your race. Recommended size: 200x200px or larger."
          accept="image/*"
          maxSize={5}
        />
        <MediaUpload
          currentMedia={websiteBanner}
          onMediaChange={updateWebsiteBanner}
          bucket="website"
          folderId={raceId.toString()}
          label="Banner"
          description="Upload a banner image for your race. Recommended size: 1200x400px or larger."
          accept="image/*"
          maxSize={10}
        />
      </Stack>
    </Box>
  );
}
