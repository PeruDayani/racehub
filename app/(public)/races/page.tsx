import {
  Button,
  Card,
  Container,
  Divider,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { getLiveRacesAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";

export default async function RacesPage() {
  const liveRaces = await getLiveRacesAction();

  if (!liveRaces.success) {
    return (
      <DisplayError errorMessage={liveRaces.message} retryUrl={`/races`} />
    );
  }

  return (
    <Container size="xl" py="xl" mih="80vh">
      <Stack gap="xl">
        <PageHeader
          title="Races"
          description="Browse all upcoming races and find the perfect race for you"
        />

        <Divider />

        <Text>{liveRaces.data?.races.length} races found</Text>

        <SimpleGrid cols={3}>
          {liveRaces.data?.races.map((race) => (
            <Card key={race.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4}>{race.name}</Title>
              <Button component={Link} href={`/races/${race.slug}`}>
                View Race
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
