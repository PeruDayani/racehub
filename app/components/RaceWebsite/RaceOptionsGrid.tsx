import {
  Alert,
  Box,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Clock, Info, Users } from "lucide-react";
import CheckoutButton from "@/app/components/CheckoutButton/CheckoutButton";
import type { Race } from "@/app/lib/types";

interface RaceOptionsGridProps {
  race: Race;
}

export default function RaceOptionsGrid({ race }: RaceOptionsGridProps) {
  const formatTime = (time: string | null) => {
    if (!time) return "TBD";
    return time;
  };

  const formatCurrency = (n?: number | null, currency = "USD") =>
    typeof n === "number" ? n.toLocaleString("en-US", { style: "currency", currency }) : "—";

  const getActivePrice = (prices: any[] = []) => {
    // If you track effective dates, pick the currently active one; otherwise pick the lowest
    const now = new Date();
    const active = prices.filter(
      (p) =>
        (!p.startsAt || new Date(p.startsAt) <= now) &&
        (!p.endsAt || new Date(p.endsAt) >= now)
    );
    const pool = active.length ? active : prices;

    // Normalize an amount field (supports amount, amountCents, or price)
    const withAmount = pool.map((p) => ({
      raw: p,
      amt:
        typeof p.amount === "number"
          ? p.amount
          : typeof p.amountCents === "number"
          ? p.amountCents / 100
          : typeof p.price === "number"
          ? p.price
          : undefined,
      ccy: p.currency || "USD",
    }));

    // Choose the smallest available amount
    withAmount.sort((a, b) => (a.amt ?? Infinity) - (b.amt ?? Infinity));
    return withAmount[0] ?? null;
  };

  const formatAgeRestriction = (option: any) => {
    // Adjust to your schema. Common patterns:
    // option.minAge / option.maxAge OR option.ageRestriction (string) OR option.ageMin/ageMax
    const min = option.minAge ?? option.ageMin;
    const max = option.maxAge ?? option.ageMax;
    const label = option.ageRestriction;

    if (label) return label;
    if (typeof min === "number" && typeof max === "number") return `${min}–${max}`;
    if (typeof min === "number") return `${min}+`;
    if (typeof max === "number") return `Up to ${max}`;
    return null; // no restriction
  };

  const formatDistance = (option: any) => {
    // Prefer camelCase `distanceKm` you saw in the console; include a few fallbacks
    const km =
    option.distanceKm ??
    option.distance_km ??
    null;

    const mi =
      option.distanceMiles ??
      option.distance_miles ??
      null;

    if (typeof km === "number") return `${km} km`;
    if (typeof km === "string" && km.trim()) return `${km} km`;

    if (typeof mi === "number") return `${mi} mi`;
    if (typeof mi === "string" && mi.trim()) return `${mi} mi`;

    if (option.distance) return option.distance; // already formatted like "10K" or "Half Marathon"

    return "Distance";
  };
  console.log("Options:", race.options);

  return (
    <>
      <Box ta="center" mb="xl">
        <Title order={2} size="h2" mb={4}>
          Run with us!
        </Title>
        <Text size="sm" c="dimmed">
          Below are the registration options.
        </Text>
      </Box>

      {race.options.length === 0 && (
        <Alert
          icon={<Info size={16} />}
          title="No Race Options"
          color="blue"
          variant="light"
        >
          This race doesn't have any options configured yet. Add race options to
          enable registration.
        </Alert>
      )}

      {race.options.length > 0 && (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {race.options.map((option, index) => (
            <Card key={option.id} shadow="sm" radius="md" withBorder p={0} style={{ display: "flex", flexDirection: "column" }}>
              {/* Header Section */}
              <Group gap="xs">
                <Text fw={500}>🏃‍♂️ Distance:</Text>
                <Text>{formatDistance(option)}</Text>
              </Group>

              {/* Timing and Category Section */}
              <Group gap="xs">
                <Text fw={500}>🕒 Start Time:</Text>
                <Text>{formatTime(option.startTime)}</Text>
              </Group>

              {/* Ticket/Pricing Section */}
              <Box p="lg" pt="md">
                {option.prices.length === 0 ? (
                  <Text size="sm" c="dimmed" ta="center">
                    No pricing configured
                  </Text>
                ) : (
                  <Stack gap="sm">
                    {option.prices.map((price) => (
                      <CheckoutButton
                        key={price.id}
                        raceId={race.id}
                        raceName={race.name}
                        raceOption={option}
                        raceOptionPrice={price}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
