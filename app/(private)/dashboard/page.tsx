import {
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { getRacesByUserAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import CreateRace from "@/app/components/Race/CreateRace";
import OrganizeRaceCard from "@/app/components/Race/OrganizeRaceCard";

// Tell Next.js that this page depends on cookies
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const races = await getRacesByUserAction();

  if (!races.success) {
    return (
      <DisplayError errorMessage={races.message} retryUrl={`/dashboard`} />
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <PageHeader
          title="Your Dashboard"
          description="Manage your races, track registrations, and organize events"
        />

        <Divider />

        <Group justify="space-between" align="center">
          <PageHeader title="Your Races" titleOrder={3} />
          <CreateRace />
        </Group>

        {races.data?.races.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No races yet. Create your first race to get started!
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {races.data?.races.map((race) => (
              <OrganizeRaceCard key={race.id} race={race} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
