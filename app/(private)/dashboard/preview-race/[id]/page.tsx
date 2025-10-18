import {
  Alert,
  Badge,
  Box,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Calendar, Clock, Info, MapPin, Users } from "lucide-react";
import { getUserRaceByIdAction } from "@/app/actions/raceActions";
import CheckoutButton from "@/app/components/CheckoutButton/CheckoutButton";
import DisplayError from "@/app/components/DisplayError/DisplayError";

type PreviewRacePageProps = {
  params: { id: string };
  children: React.ReactNode;
};

export default async function PreviewRacePage({
  params,
}: PreviewRacePageProps) {
  const { id } = await params;
  const race = await getUserRaceByIdAction(parseInt(id, 10));

  if (!race.success || !race.data?.race) {
    return (
      <DisplayError errorMessage={race.message} retryUrl={`/events/${id}`} />
    );
  }

  const { race: raceData } = race.data;
  const { options } = raceData;

  const _formatPrice = (priceCents: number | null) => {
    if (!priceCents) return "Free";
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const formatTime = (time: string | null) => {
    if (!time) return "TBD";
    return time;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green";
      case "draft":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Container size="xl" py="xl">
      {/* Preview Banner */}
      <Alert
        icon={<Info size={16} />}
        title="Preview Mode"
        color="blue"
        variant="light"
        mb="lg"
      >
        This is a preview of how your race will appear to participants. This
        page is only visible to you.
      </Alert>

      <Stack gap="md">
        {/* Header Section */}
        <Group justify="flex-start" align="center" mb="md">
          <Badge
            color={getStatusColor(raceData.status)}
            variant="light"
            size="lg"
          >
            {raceData.status.toUpperCase()}
          </Badge>
          {raceData.options.some((opt) => opt.isVirtual) && (
            <Badge color="blue" variant="light" size="lg">
              VIRTUAL
            </Badge>
          )}
          <Title order={1} size="h1">
            {raceData.name}
          </Title>
          <Group gap="md" mb="sm"></Group>
        </Group>

        {/* Race Details Grid */}
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
                  {formatDate(raceData.date)}
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
                  {raceData.address ? (
                    <>
                      {raceData.address.city}, {raceData.address.state}
                    </>
                  ) : (
                    "TBD"
                  )}
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
                  {formatDate(raceData.registrationDeadline)}
                </Text>
              </Box>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Race Options and Tickets */}
        <Title order={2} size="h2" mb="md">
          Race Options & Pricing
        </Title>

        {options.length === 0 && (
          <Alert
            icon={<Info size={16} />}
            title="No Race Options"
            color="blue"
            variant="light"
          >
            This race doesn't have any options configured yet. Add race options
            to enable registration.
          </Alert>
        )}

        {options.length > 0 && (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {raceData.options.map((option, index) => (
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
                          raceId={raceData.id}
                          raceName={raceData.name}
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
      </Stack>
    </Container>
  );
}
