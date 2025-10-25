import { Container, Stack, Image, Paper } from "@mantine/core";
import { getLiveRaceBySlugAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import RaceDescription from "@/app/components/RaceWebsite/RaceDescription";
import RaceDetailsGrid from "@/app/components/RaceWebsite/RaceDetailsGrid";
import RaceFooter from "@/app/components/RaceWebsite/RaceFooter";
import RaceHeader from "@/app/components/RaceWebsite/RaceHeader";
import RaceMedia from "@/app/components/RaceWebsite/RaceMedia";
import RaceOptionsGrid from "@/app/components/RaceWebsite/RaceOptionsGrid";
import RaceSections from "@/app/components/RaceWebsite/RaceSections";
import RaceSponsorships from "@/app/components/RaceWebsite/RaceSponsorships";

export default async function RacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await getLiveRaceBySlugAction(slug);

  if (!response.success || !response.data?.race) {
    return (
      <DisplayError
        errorMessage={response.message}
        retryUrl={`/races/${slug}`}
      />
    );
  }

  const raceData = response.data?.race;

  // Debug: Log the race data to see what's available
  console.log('Race data:', raceData);
  console.log('Website banner:', raceData.website?.banner);

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <RaceMedia race={raceData}>
          {/* Wrap grid in a Paper for card-like overlay feel (optional) */}
          {/* If RaceOptionsGrid already renders its own Paper, omit this wrapper */}
          {/* Example minimal styling if needed: */}
          <Paper shadow="xl" radius="md" p="lg" withBorder style={{ backdropFilter: "blur(3px)" }}>
            <RaceOptionsGrid race={raceData} />
          </Paper>
        </RaceMedia>
        {/* Spacer to account for the overlay hanging outside the banner */}
        <div style={{ height: 56 }} />
        <RaceOptionsGrid race={raceData} />
        <RaceSections race={raceData} />
        <RaceSponsorships race={raceData} />
        <RaceFooter race={raceData} />
      </Stack>
    </Container>
  );
}
