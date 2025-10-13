import { Button } from "@mantine/core";
import Link from "next/link";

export default function FindRaces() {
  return (
    <Button component={Link} href="/races">
      Find Races
    </Button>
  );
}
