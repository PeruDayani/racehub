"use client";

import { Card, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { GetRaceSignupStatsResponse } from "@/app/actions/dashboardActions";

type DashboardEditorProps = {
  raceId: number;
  stats: GetRaceSignupStatsResponse["data"] ;
};

export default function DashboardEditor({
  raceId,
  stats,
}: DashboardEditorProps) {

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
              {stats?.registrantCount?.toLocaleString()}
            </Title>
          </Stack>
        </Flex>
      </Card>
    </SimpleGrid>
  );
}
