import { Box, Group, Paper, SimpleGrid, Text, ThemeIcon } from "@mantine/core";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Race } from "@/app/lib/types";
import { formatDate, formatRaceAddress } from "@/app/lib/utils";

interface RaceDetailsGridProps {
  race: Race;
}

export default function RaceDetailsGrid({ race }: RaceDetailsGridProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="xl">
      {/* Race Date Card */}
      <Paper p="md" radius="md" withBorder>
        <Group gap="md">
          <ThemeIcon variant="light" color="blue" size="xl" radius="md">
            <Calendar size={24} />
          </ThemeIcon>
          <Box>
            <Text size="sm" c="dimmed" fw={500}>
              Race Date
            </Text>
            <Text fw={600} size="md">
              {formatDate(race.date)}
            </Text>
          </Box>
        </Group>
      </Paper>

      {/* Location Card */}
      <Paper p="md" radius="md" withBorder>
        <Group gap="md">
          <ThemeIcon variant="light" color="red" size="xl" radius="md">
            <MapPin size={24} />
          </ThemeIcon>
          <Box>
            <Text size="sm" c="dimmed" fw={500}>
              Location
            </Text>
            <Text fw={600} size="md">
              {formatRaceAddress(race.address)}
            </Text>
          </Box>
        </Group>
      </Paper>

      {/* Registration Deadline Card */}
      <Paper p="md" radius="md" withBorder>
        <Group gap="md">
          <ThemeIcon variant="light" color="orange" size="xl" radius="md">
            <Clock size={24} />
          </ThemeIcon>
          <Box>
            <Text size="sm" c="dimmed" fw={500}>
              Registration Deadline
            </Text>
            <Text fw={600} size="md">
              {formatDate(race.registrationDeadline)}
            </Text>
          </Box>
        </Group>
      </Paper>
    </SimpleGrid>
  );
}
