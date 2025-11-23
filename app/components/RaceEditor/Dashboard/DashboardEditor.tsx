"use client";

import { Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import type { GetRaceSignupStatsResponse } from "@/app/actions/dashboardActions";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import type { RaceOption } from "@/app/lib/types";
import RaceStatCard, { formatCurrency } from "./RaceStatCard";

type DashboardEditorProps = {
  raceId: number;
  stats: GetRaceSignupStatsResponse["data"];
};

export default function DashboardEditor({
  raceId,
  stats,
}: DashboardEditorProps) {
  const race = useRaceStore((state) => state.race);
  const raceName = race?.name || "Race Dashboard";

  const registrantCount = stats?.registrantCount ?? 0;
  const totalRevenueCents = stats?.totalRevenueCents ?? 0;

  // Calculate payment rate as percentage of registrants who have paid
  const paymentRate =
    registrantCount > 0 ? ((stats?.paidCount ?? 0) / registrantCount) * 100 : 0;

  // Format race date
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time from time string (HH:MM:SS format)
  const formatTime = (time: string | null | undefined) => {
    if (!time) return "TBD";
    // Parse time string (e.g., "09:30:00") and format it
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get the earliest start time from race options, or first one available
  const getStartTime = () => {
    if (!race?.options || race.options.length === 0) return null;
    const timesWithOptions = race.options
      .filter((opt: RaceOption) => opt.startTime != null)
      .map((opt: RaceOption) => ({
        time: opt.startTime as string,
        option: opt,
      }))
      .sort((a: { time: string }, b: { time: string }) =>
        a.time.localeCompare(b.time),
      );
    return timesWithOptions.length > 0 ? timesWithOptions[0].time : null;
  };

  const location = race?.address
    ? `${race.address.city}, ${race.address.state}`
    : "TBD";

  return (
    <Stack gap="lg" mt="xl">
      <Stack gap={4}>
        <Title order={2}>{raceName}</Title>

        {/* Race metadata */}
        <Group gap="xl" mt={4}>
          <Group gap={6}>
            <Calendar size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">
              {formatDate(race?.date)}
            </Text>
          </Group>

          <Group gap={6}>
            <Clock size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">
              {formatTime(getStartTime())}
            </Text>
          </Group>

          <Group gap={6}>
            <MapPin size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">
              {location}
            </Text>
          </Group>
        </Group>

        <Text c="dimmed" size="sm" mt="xs">
          Overview of your race statistics and performance metrics
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        <RaceStatCard
          icon={Users}
          label="Total Registrants"
          value={registrantCount}
          description="Total number of completed signups"
          iconColor="var(--mantine-color-blue-6)"
        />

        <RaceStatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(totalRevenueCents)}
          description="Sum of all payments received"
          iconColor="var(--mantine-color-green-6)"
        />

        <RaceStatCard
          icon={CreditCard}
          label="Paid Registrations"
          value={stats?.paidCount ?? 0}
          description="Number of registrations with completed payment"
          iconColor="var(--mantine-color-violet-6)"
        />

        <RaceStatCard
          icon={TrendingUp}
          label="Payment Rate"
          value={`${paymentRate.toFixed(1)}%`}
          description="Percentage of registrants who have paid"
          iconColor="var(--mantine-color-orange-6)"
        />
      </SimpleGrid>
    </Stack>
  );
}
