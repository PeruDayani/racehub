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
import { useState } from "react";

type SignUpProps = {
  redirect_to?: string;
};

export default function SignUp({ redirect_to }: SignUpProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome!</Title>

      <Text ta="center" mt={12}>
        Already have an account yet?{" "}
        <Anchor component={Link} href="/auth/signin">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          required
          radius="md"
          value={fullName}
          onChange={(event) => setFullName(event.currentTarget.value)}
        />
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          required
          mt="md"
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
        <PasswordInput
          label="Repeat Password"
          placeholder="Repeat your password"
          required
          mt="md"
          radius="md"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.currentTarget.value)}
          error={
            repeatPassword && password !== repeatPassword
              ? "Passwords do not match"
              : null
          }
        />
        <Button fullWidth mt="xl" radius="md">
          Sign up
        </Button>
      </Paper>
    </Container>
  );
}
