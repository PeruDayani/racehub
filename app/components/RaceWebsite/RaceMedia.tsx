import { Box, Image, Stack } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface RaceMediaProps {
  race: Race;
}

export default function RaceMedia({ race }: RaceMediaProps) {
  if (!race.website?.logo && !race.website?.banner) {
    return null;
  }

  return (
    <Box mb="xl">
      <Stack gap="md">
        {/* Logo */}
        {race.website?.logo && (
          <Box ta="center">
            <Image
              src={race.website.logo.url}
              alt={`${race.name} logo`}
              maw={200}
              mx="auto"
              radius="md"
            />
          </Box>
        )}

        {/* Banner */}
        {race.website?.banner && (
          <Box>
            <Image
              src={race.website.banner.url}
              alt={`${race.name} banner`}
              radius="md"
              style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
