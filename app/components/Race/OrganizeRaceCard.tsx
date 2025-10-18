"use client";

import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Race } from "@/app/lib/types";

interface OrganizeRaceCardProps {
  race: Race;
}

export default function OrganizeRaceCard({ race }: OrganizeRaceCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatLocation = () => {
    if (!race.address) return "Location TBD";
    return `${race.address.city}, ${race.address.state}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "green";
      case "draft":
        return "gray";
      case "cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  const getTotalParticipants = () => {
    // Calculate total max participants from all options
    const total = race.options.reduce((sum, option) => {
      const maxFromPrices = option.prices.reduce((priceSum, price) => {
        return priceSum + (price.maxParticipants || 0);
      }, 0);
      return sum + maxFromPrices;
    }, 0);
    return total > 0 ? total.toLocaleString() : "Unlimited";
  };

  const formatLastModified = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const handleCardClick = () => {
    router.push(`/dashboard/edit-race/${race.id}`);
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
      }}
    >
      <Stack gap="md" h="100%">
        {/* Header */}
        <div>
          <Title order={4} lineClamp={1} mb="xs">
            {race.name}
          </Title>
          <Badge
            color={getStatusColor(race.status)}
            leftSection={
              race.status === "live" ? (
                <CheckCircle size={12} />
              ) : (
                <FileText size={12} />
              )
            }
            size="md"
          >
            {race.status.charAt(0).toUpperCase() + race.status.slice(1)}
          </Badge>
        </div>

        {/* Race Details */}
        <Stack gap="xs" style={{ flex: 1 }}>
          <Group gap="xs">
            <Calendar size={16} />
            <Text size="sm">{formatDate(race.date)}</Text>
          </Group>

          <Group gap="xs">
            <MapPin size={16} />
            <Text size="sm">{formatLocation()}</Text>
          </Group>

          <Group gap="xs">
            <Users size={16} />
            <Text size="sm">{getTotalParticipants()} participants</Text>
          </Group>

          <Group gap="xs">
            <Clock size={16} />
            <Text size="sm">
              Last modified: {formatLastModified(race.updatedAt)}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
