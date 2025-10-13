import { Group } from "@mantine/core";
import { createClient } from "@/app/lib/supabase/server";
import SignInButton from "../Auth/SignInButon";
import SignOutButton from "../Auth/SignOutButton";
import FindRaces from "./components/FindRaces";
import Logo from "./components/Logo";
import styles from "./index.module.css";

export default async function NavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <Group className={styles.header} px="xl" justify="space-between">
      <Logo />
      <Group gap="md">
        <FindRaces />
        {user ? <SignOutButton /> : <SignInButton />}
      </Group>
    </Group>
  );
}
