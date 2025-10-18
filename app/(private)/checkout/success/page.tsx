import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { Check } from "lucide-react";
import Link from "next/link";
import { getLiveRaceBySlugAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";

type SuccessPageProps = {
  searchParams: Promise<{
    raceSlug: string;
    raceOptionId: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { raceSlug, raceOptionId } = await searchParams;

  const race = await getLiveRaceBySlugAction(raceSlug);

  if (!race.success || !race.data?.race) {
    return (
      <DisplayError
        errorMessage={race.message}
        retryUrl={`/races/${raceSlug}`}
      />
    );
  }

  const { race: raceData } = race.data;
  const raceOption = raceData.options.find(
    (option) => option.id === parseInt(raceOptionId, 10),
  );
  if (!raceOption) {
    return (
      <DisplayError
        errorMessage="Race option not found"
        retryUrl={`/races/${raceSlug}`}
      />
    );
  }

  return (
    <Container my={40}>
      <Stack justify="center" gap="xl">
        <Group justify="center">
          <Check size={48} color="var(--mantine-color-green-6)" />
        </Group>

        <Title ta="center" order={2}>
          Registration Successful
        </Title>

        <Text ta="center" c="dimmed">
          Your are all set for the {raceData.name} - {raceOption.name}.
        </Text>

        <Text ta="center" c="dimmed">
          You will receive an email confirmation shortly.
        </Text>

        <Group justify="center" gap="md">
          <Button
            component={Link}
            href={`/races/${raceSlug}`}
            variant="filled"
            size="md"
          >
            View Race
          </Button>
          <Button
            component={Link}
            href={`/dashboard`}
            variant="filled"
            size="md"
          >
            View Ticket
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
