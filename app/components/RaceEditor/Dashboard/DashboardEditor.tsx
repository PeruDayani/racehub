"use server";

import { Card, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { getRaceSignupStatsAction } from "@/app/actions/dashboardActions";

type DashboardEditorProps = {
  raceId: number;
};

export default async function DashboardEditor({
  raceId,
}: DashboardEditorProps) {
  const stats = await getRaceSignupStatsAction(raceId);
  const registrantCount = stats.data?.registrantCount ?? 0;

  if (!stats.success || !stats.data) {
    return (
      <Card withBorder radius="md" maw={640} mx="auto" mt="xl">
        <Stack gap="xs">
          <Title order={3}>Race Overview</Title>
          <Text c="dimmed">
            We couldn't load your latest signup stats. Please refresh the page
            or try again later.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="xl">
      <Card withBorder radius="md" padding="lg" shadow="sm">
        <Flex align="center" justify="space-between">
          {/* Icon and Title */}
          <Stack gap={5}>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              Total Registrants
            </Text>
            <Title order={2} fw={800}>
              {registrantCount.toLocaleString()}
            </Title>
          </Stack>
        </Flex>
      </Card>
    </SimpleGrid>
  );
}
