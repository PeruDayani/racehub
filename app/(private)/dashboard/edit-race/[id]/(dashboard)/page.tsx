import DashboardEditor from "@/app/components/RaceEditor/Dashboard/DashboardEditor";
import {getRaceSignupStatsAction} from "@/app/actions/dashboardActions";
import { Card, Stack, Text, Title} from "@mantine/core";

type DashboardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRaceDashboard({
  params,
}: DashboardPageProps) {
  const { id } = await params;
  const raceId = Number.parseInt(id, 10);
  const response = await getRaceSignupStatsAction(raceId);

  if (!response.success || !response.data) {
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
    )
  }

  return <DashboardEditor raceId={raceId} stats={response.data} />;
}
