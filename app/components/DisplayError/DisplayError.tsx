import { Alert, Box, Button, Group, Text, Title } from "@mantine/core";
import { Bug, Calendar, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface DisplayErrorProps {
  title?: string;
  message?: string;
  errorMessage: string;
  backUrl?: string;
  backLabel?: string;
  retryUrl?: string;
  retryLabel?: string;
}

export default function DisplayError({
  title = "We ran into a wall!",
  message = "We could not process your request at this time. The team has been notified and will address the issue ASAP.",
  errorMessage,
  backUrl = "/dashboard",
  backLabel = "My Dashboard",
  retryUrl = "/dashboard",
  retryLabel = "Refresh",
}: DisplayErrorProps) {
  return (
    <Box
      style={{
        display: "flex",
        margin: "auto",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
        gap: "1.5rem",
      }}
      maw={500}
    >
      <Bug size={32} />

      <Title order={2}>{title}</Title>

      <Text size="lg" c="dimmed">
        {message}
      </Text>

      <Alert ta="left" color="red" w="100%">
        <Text fw={600}>Error:</Text>
        <Text>{errorMessage}</Text>
      </Alert>

      <Group mt="12">
        <Button
          component={Link}
          href={backUrl}
          size="md"
          radius="md"
          variant="filled"
          color="blue"
          leftSection={<Calendar size={20} />}
        >
          {backLabel}
        </Button>
        <Button
          component={Link}
          href={retryUrl}
          size="md"
          radius="md"
          variant="outline"
          color="blue"
          leftSection={<RefreshCcw size={20} />}
        >
          {retryLabel}
        </Button>
      </Group>
    </Box>
  );
}
