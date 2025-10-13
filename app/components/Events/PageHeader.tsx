import { Stack, Text, Title } from "@mantine/core";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Stack gap="xs" mb="xl">
      <Title order={1}>{title}</Title>
      {description && (
        <Text size="lg" c="dimmed">
          {description}
        </Text>
      )}
    </Stack>
  );
}
