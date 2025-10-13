import { getRaceAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import RaceEditor from "@/app/components/Events/RaceEditor";

export default async function RacePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const race = await getRaceAction(parseInt(id, 10));

  if (!race.success || !race.data) {
    return (
      <DisplayError errorMessage={race.message} retryUrl={`/events/${id}`} />
    );
  }

  return <RaceEditor race={race.data.race} />;
}
