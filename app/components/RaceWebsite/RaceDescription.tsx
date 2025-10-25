import { Box, Text, Title } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface RaceDescriptionProps {
  race: Race;
}

export default function RaceDescription({ race }: RaceDescriptionProps) {
  if (!race.website?.description) {
    return null;
  }

  return (
    <Box>
      <Text size="lg" style={{ whiteSpace: 'pre-line' }}>
        {race.website.description}
      </Text>
    </Box>
  );
}
