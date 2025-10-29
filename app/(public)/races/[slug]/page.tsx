import { Container, Stack } from "@mantine/core";
import { getLiveRaceBySlugAction } from "@/app/actions/raceActions";
import SocialIcons from "@/app/components/RaceWebsite/SocialIcons";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import RaceDetailsGrid from "@/app/components/RaceWebsite/RaceDetailsGrid";
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

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <RaceHeader race={raceData} />
        <RaceMedia race={raceData} />
        <RaceDetailsGrid race={raceData} />
        <RaceOptionsGrid race={raceData} />
        <RaceSponsorships race={raceData} />
        <RaceSections race={raceData} />
        <SocialIcons race={raceData} heading="Follow Us" wrap="wrap" size={22} />
      </Stack>
    </Container>
  );
}
