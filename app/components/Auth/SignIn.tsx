"use client";

import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useCallback, useState } from "react";
import { signInAction } from "@/app/actions/authActions";

type SignInProps = {
  redirect_to?: string;
};

export default function SignIn({ redirect_to }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      const result = await signInAction(email, password, redirect_to);

      // If result is returned, it means there was an error
      // (successful sign-in redirects and never returns)
      if (!result.success) {
        setError(result.message);
        setIsLoading(false);
      }
    },
    [email, password, redirect_to],
  );

  return (
    <Container size={420} my={40} mih="70vh">
      <Title ta="center">Welcome back!</Title>

      <Text ta="center" mt={12}>
        Do not have an account yet?{" "}
        <Anchor component={Link} href="/auth/signup">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          required
          radius="md"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          radius="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Group justify="space-between" mt="lg">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />
          <Anchor component={Link} href="/auth/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button
          fullWidth
          mt="xl"
          radius="md"
          onClick={onSignIn}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        {error && (
          <Text ta="center" c="red" mt="sm" fz="sm">
            {error}
          </Text>
        )}
      </Paper>
    </Container>
  );
}
