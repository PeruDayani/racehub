import {
  Alert,
  Badge,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Info } from "lucide-react";

type CheckoutPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const resolvedSearchParams = await searchParams;
  const raceId = resolvedSearchParams.raceId as string;
  const raceOptionId = resolvedSearchParams.raceOptionId as string;
  const priceId = resolvedSearchParams.priceId as string;

  const hasAllParams = raceId && raceOptionId && priceId;

  return (
    <Container size="xl" py="xl">
      <Title order={1} size="h1" mb="xl">
        Checkout
      </Title>

      {!hasAllParams ? (
        <Alert
          icon={<Info size={16} />}
          title="Missing Parameters"
          color="red"
          variant="light"
        >
          <Stack gap="sm">
            <Text>Some required parameters are missing:</Text>
            <Stack gap="xs">
              <Text size="sm">
                <strong>Race ID:</strong> {raceId || "Missing"}
              </Text>
              <Text size="sm">
                <strong>Race Option ID:</strong> {raceOptionId || "Missing"}
              </Text>
              <Text size="sm">
                <strong>Price ID:</strong> {priceId || "Missing"}
              </Text>
            </Stack>
          </Stack>
        </Alert>
      ) : (
        <Paper p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2} size="h2">
              Checkout Details
            </Title>

            <Group gap="md">
              <Badge color="blue" variant="light" size="lg">
                Race ID: {raceId}
              </Badge>
              <Badge color="green" variant="light" size="lg">
                Option ID: {raceOptionId}
              </Badge>
              <Badge color="orange" variant="light" size="lg">
                Price ID: {priceId}
              </Badge>
            </Group>

            <Text>
              This is where the checkout process will be implemented. The system
              has received the following parameters:
            </Text>

            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Race ID:{" "}
                <Text component="span" ff="monospace">
                  {raceId}
                </Text>
              </Text>
              <Text size="sm" fw={500}>
                Race Option ID:{" "}
                <Text component="span" ff="monospace">
                  {raceOptionId}
                </Text>
              </Text>
              <Text size="sm" fw={500}>
                Price ID:{" "}
                <Text component="span" ff="monospace">
                  {priceId}
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
