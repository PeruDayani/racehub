import { Container, SimpleGrid, Stack, Text } from "@mantine/core";
import { getRacesByUserAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import CreateRace from "@/app/components/Events/CreateRace";
import PageHeader from "@/app/components/Events/PageHeader";
import RaceCard from "@/app/components/Events/RaceCard";
import SectionHeader from "@/app/components/Events/SectionHeader";

export default async function EventsPage() {
  const races = await getRacesByUserAction();

  if (!races.success) {
    return <DisplayError errorMessage={races.message} retryUrl={`/events`} />;
  }

  return (
    <Container size="xl" py="xl">
      <Stack>
        <PageHeader
          title="Your Events"
          description="Manage your races, track registrations, and organize events"
        />

        <SectionHeader title="Your Races" action={<CreateRace />} />

        {races.data?.races.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No races yet. Create your first race to get started!
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {races.data?.races.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
