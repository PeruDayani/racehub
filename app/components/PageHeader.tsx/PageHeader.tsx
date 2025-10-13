import { Stack, Text, Title, type TitleOrder } from "@mantine/core";

interface PageHeaderProps {
  title: string;
  titleOrder?: TitleOrder;
  description?: string;
}

export default function PageHeader({
  title,
  titleOrder = 2,
  description,
}: PageHeaderProps) {
  return (
    <Stack gap="xs">
      <Title order={titleOrder}>{title}</Title>
      {description && (
        <Text size="md" c="dimmed">
          {description}
        </Text>
      )}
    </Stack>
  );
}
