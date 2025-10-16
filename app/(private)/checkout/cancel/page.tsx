import { Button, Container, Group, Text, Title } from "@mantine/core";
import { X } from "lucide-react";
import Link from "next/link";

// TODO: This page is not being displayed, not sure if we need it?

type CancelPageProps = {
  searchParams: Promise<{
    raceId: string;
  }>;
};
export default async function CancelPage({ searchParams }: CancelPageProps) {
  const { raceId } = await searchParams;

  return (
    <Container size={420} my={40}>
      <Group justify="center" mb="lg">
        <X size={48} color="var(--mantine-color-red-6)" />
      </Group>

      <Title ta="center" mb="md" order={2}>
        Checkout Canceled
      </Title>

      <Text ta="center" c="dimmed" mb="xl">
        Your checkout process has been canceled. No charges were made to your
        account.
      </Text>

      <Group justify="center" gap="md">
        {raceId && (
          <Button
            component={Link}
            href={`/races/${raceId}`}
            variant="filled"
            size="md"
          >
            Try Again
          </Button>
        )}
        <Button component={Link} href="/races" variant="outline" size="md">
          Browse Races
        </Button>
      </Group>
    </Container>
  );
}
