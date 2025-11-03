import { Flex } from "@mantine/core";
import { getUserRaceByIdAction } from "@/app/actions/raceActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import SideNav from "@/app/components/RaceEditor/SideNavigation/SideNav";
import { RaceStoreProvider } from "@/app/context/RaceStoreContext";

type EditRaceLayoutProps = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export default async function EditRaceLayout({
  params,
  children,
}: EditRaceLayoutProps) {
  const { id } = await params;
  const race = await getUserRaceByIdAction(parseInt(id, 10));

  if (!race.success || !race.data?.race) {
    return (
      <DisplayError errorMessage={race.message} retryUrl={`/events/${id}`} />
    );
  }

  return (
    <RaceStoreProvider initialRace={race.data?.race}>
      <Flex direction="row">
        <SideNav />
        <Flex direction="column" flex={1} p="sm">
          {children}
        </Flex>
      </Flex>
    </RaceStoreProvider>
  );
}
