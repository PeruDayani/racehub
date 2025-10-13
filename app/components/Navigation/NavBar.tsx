import { Group } from "@mantine/core";
import { createClient } from "@/app/lib/supabase/server";
import type { AuthClaims } from "@/app/lib/types";
import SignInButton from "../Auth/SignInButon";
import UserMenu from "../Auth/UserMenu";
import styles from "./index.module.css";
import Logo from "./Logo";

export default async function NavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user: AuthClaims | undefined = data?.claims;

  return (
    <Group className={styles.header} px="xl" justify="space-between">
      <Logo />
      <Group gap="md">
        {user ? <UserMenu user={user} /> : <SignInButton />}
      </Group>
    </Group>
  );
}
