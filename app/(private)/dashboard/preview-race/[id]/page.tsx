import { Alert, Container, Stack } from "@mantine/core";
import { Info } from "lucide-react";
import { getUserRaceByIdAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import RaceDetailsGrid from "@/app/components/RaceWebsite/RaceDetailsGrid";
import RaceHeader from "@/app/components/RaceWebsite/RaceHeader";
import RaceMedia from "@/app/components/RaceWebsite/RaceMedia";
import RaceOptionsGrid from "@/app/components/RaceWebsite/RaceOptionsGrid";
import RaceSections from "@/app/components/RaceWebsite/RaceSections";
import RaceSponsorships from "@/app/components/RaceWebsite/RaceSponsorships";

type PreviewRacePageProps = {
  params: { id: string };
  children: React.ReactNode;
};

export default async function PreviewRacePage({
  params,
}: PreviewRacePageProps) {
  const { id } = await params;
  const race = await getUserRaceByIdAction(parseInt(id, 10));

  if (!race.success || !race.data?.race) {
    return (
      <DisplayError errorMessage={race.message} retryUrl={`/events/${id}`} />
    );
  }

  const { race: raceData } = race.data;

  return (
    <Container size="xl" py="xl">
      {/* Preview Banner */}
      <Alert
        icon={<Info size={16} />}
        title="Preview Mode"
        color="blue"
        variant="light"
        mb="lg"
      >
        This is a preview of how your race will appear to participants. This
        page is only visible to you.
      </Alert>

      <Stack gap="md">
        <RaceHeader race={raceData} showStatus={true} />
        <RaceMedia race={raceData} />
        <RaceDetailsGrid race={raceData} />
        <RaceOptionsGrid race={raceData} />
        <RaceSponsorships race={raceData} />
        <RaceSections race={raceData} />
      </Stack>
    </Container>
  );
}
