"use client";

import { Card, Group, Image, Stack, Text, Title } from "@mantine/core";
import { differenceInDays, format } from "date-fns";
import { Calendar } from "lucide-react";
import Link from "next/link";
import type { Ticket } from "@/app/lib/types";

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getDaysToRace = (dateString: string | null) => {
    if (!dateString) return "TBD";
    const raceDate = new Date(dateString);
    const today = new Date();
    const days = differenceInDays(raceDate, today);

    if (days < 0) return "Past";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  return (
    <Link
      href={`/dashboard/ticket/${ticket.id}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ cursor: "pointer" }}
      >
        <Stack gap="md">
          {/* Race logo */}
          {ticket.race.website?.logo && (
            <Image
              src={ticket.race.website.logo.url}
              alt={`${ticket.race.name} logo`}
              height={60}
              fit="contain"
              style={{ objectFit: "contain" }}
            />
          )}

          {/* Race title */}
          <Title order={3} size="h4" lineClamp={2} ta="center">
            {ticket.race.name}
          </Title>

          {/* Race distance */}
          <Text size="lg" fw={600} ta="center">
            {ticket.raceOption.distanceKm
              ? `${ticket.raceOption.distanceKm} km`
              : "TBD"}
          </Text>

          {/* Days to race */}
          <Group justify="center" gap="xs">
            <Calendar size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">
              {getDaysToRace(ticket.race.date)}
            </Text>
            {ticket.race.date && (
              <Text size="sm" c="dimmed">
                • {formatDate(ticket.race.date)}
              </Text>
            )}
          </Group>

          {/* Purchase date */}
          <Text size="xs" c="dimmed" ta="center">
            Purchased {format(new Date(ticket.createdAt), "MMM dd, yyyy")}
          </Text>
        </Stack>
      </Card>
    </Link>
  );
}
