"use client";

import {
  Anchor,
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <Container size={420} my={40}>
      <Title ta="center">Forgot your password?</Title>

      <Text ta="center" mt={12}>
        Enter your email to get a reset link
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
        <Text ta="center" mt="lg">
          <Anchor component={Link} href="/auth/signin" size="sm">
            Back to the login page
          </Anchor>
        </Text>
        <Button fullWidth mt="xl" radius="md">
          Reset password
        </Button>
      </Paper>
    </Container>
  );
}
