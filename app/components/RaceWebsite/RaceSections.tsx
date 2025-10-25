import { Box, Stack, Text, Title } from "@mantine/core";
import type { Race } from "@/app/lib/types";

interface RaceSectionsProps {
  race: Race;
}

export default function RaceSections({ race }: RaceSectionsProps) {
  if (!race.website?.sections || race.website.sections.length === 0) {
    return null;
  }

  return (
    <Box mt="xl">
      <Stack gap="lg">
        {race.website.sections.map((section, index) => (
          <Box key={section.id || index}>
            {section.name && (
              <Title order={3} size="h3" mb="sm">
                {section.name}
              </Title>
            )}
            {section.content && (
              <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
                {section.content}
              </Text>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
