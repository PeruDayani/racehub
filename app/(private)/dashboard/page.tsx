import {
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { getUserRacesAction } from "@/app/actions/raceActions";
import { getUserTicketsAction } from "@/app/actions/ticketActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import CreateRaceButton from "@/app/components/Race/CreateRaceButton";
import OrganizeRaceCard from "@/app/components/Race/OrganizeRaceCard";
import TicketCard from "@/app/components/Ticket/TicketCard";

// Tell Next.js that this page depends on cookies
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userRaces = await getUserRacesAction();
  const userTickets = await getUserTicketsAction();

  if (!userTickets.success) {
    return (
      <DisplayError
        errorMessage={userTickets.message}
        retryUrl={`/dashboard`}
      />
    );
  }

  if (!userRaces.success) {
    return (
      <DisplayError errorMessage={userRaces.message} retryUrl={`/dashboard`} />
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
          <PageHeader title="(Runner) Your Race Tickets" titleOrder={3} />
        </Group>

        {userTickets.data?.tickets.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No tickets yet. Purchase a ticket to get started!
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {userTickets.data?.tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </SimpleGrid>
        )}

        <Divider />

        <Group justify="space-between" align="center">
          <PageHeader title="(Organizer) Your Race Events" titleOrder={3} />
          <CreateRaceButton />
        </Group>

        {userRaces.data?.races.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No races yet. Create your first race to get started!
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {userRaces.data?.races.map((race) => (
              <OrganizeRaceCard key={race.id} race={race} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
