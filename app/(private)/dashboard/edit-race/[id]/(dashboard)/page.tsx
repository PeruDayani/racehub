import DashboardEditor from "@/app/components/RaceEditor/Dashboard/DashboardEditor";

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
  return <DashboardEditor raceId={raceId} />;
}
