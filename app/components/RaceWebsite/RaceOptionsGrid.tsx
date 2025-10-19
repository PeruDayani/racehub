import {
  Alert,
  Box,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Clock, Info, Users } from "lucide-react";
import CheckoutButton from "@/app/components/CheckoutButton/CheckoutButton";
import type { Race } from "@/app/lib/types";

interface RaceOptionsGridProps {
  race: Race;
}

export default function RaceOptionsGrid({ race }: RaceOptionsGridProps) {
  const formatTime = (time: string | null) => {
    if (!time) return "TBD";
    return time;
  };

  return (
    <>
      <Title order={2} size="h2" mb="md">
        Race Options & Pricing
      </Title>

      {race.options.length === 0 && (
        <Alert
          icon={<Info size={16} />}
          title="No Race Options"
          color="blue"
          variant="light"
        >
          This race doesn't have any options configured yet. Add race options to
          enable registration.
        </Alert>
      )}

      {race.options.length > 0 && (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {race.options.map((option, index) => (
            <Card key={option.id} shadow="sm" radius="md" withBorder p={0}>
              {/* Header Section */}
              <Box p="lg" pb="md">
                <Stack gap="xs">
                  <Title order={3} size="h3">
                    {option.name || `Option ${index + 1}`}
                  </Title>
                  {option.description && (
                    <Text size="sm" c="dimmed">
                      {option.description}
                    </Text>
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* Timing and Category Section */}
              <Box p="lg" py="md">
                <Stack gap="sm">
                  <Group>
                    <ThemeIcon variant="light" color="orange" size="sm">
                      <Clock size={16} />
                    </ThemeIcon>
                    <Text fw={500}>Start Time:</Text>
                    <Text>{formatTime(option.startTime)}</Text>
                  </Group>

                  {option.cutoffTime && (
                    <Group>
                      <ThemeIcon variant="light" color="red" size="sm">
                        <Clock size={16} />
                      </ThemeIcon>
                      <Text fw={500}>Cutoff Time:</Text>
                      <Text>{formatTime(option.cutoffTime)}</Text>
                    </Group>
                  )}

                  <Group>
                    <ThemeIcon variant="light" color="pink" size="sm">
                      <Users size={16} />
                    </ThemeIcon>
                    <Text fw={500}>Gender:</Text>
                    <Text>{option.genderCategory}</Text>
                  </Group>
                </Stack>
              </Box>

              <Divider />

              {/* Ticket/Pricing Section */}
              <Box p="lg" pt="md">
                {option.prices.length === 0 ? (
                  <Text size="sm" c="dimmed" ta="center">
                    No pricing configured
                  </Text>
                ) : (
                  <Stack gap="sm">
                    {option.prices.map((price) => (
                      <CheckoutButton
                        key={price.id}
                        raceId={race.id}
                        raceName={race.name}
                        raceOption={option}
                        raceOptionPrice={price}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
