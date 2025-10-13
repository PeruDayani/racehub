import { Flex, Title } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <Flex justify="space-between" align="center" mb="lg">
      <Title order={2}>{title}</Title>
      {action}
    </Flex>
  );
}
