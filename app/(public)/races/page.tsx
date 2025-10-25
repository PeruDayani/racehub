import { Container, Divider, SimpleGrid, Stack, Text } from "@mantine/core";
import { getLiveRacesAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import PublicRaceCard from "@/app/components/Race/PublicRaceCard";

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

        {liveRaces.data?.races.length === 0 ? (
          <Text>No races found</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {liveRaces.data?.races.map((race) => (
              <PublicRaceCard key={race.id} race={race} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
