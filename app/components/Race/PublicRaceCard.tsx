"use client";

import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import type { Race } from "@/app/lib/types";

interface PublicRaceCardProps {
  race: Race;
}

export default function PublicRaceCard({ race }: PublicRaceCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getDistanceOptions = () => {
    if (!race.options || race.options.length === 0) return [];

    const distances = race.options.map((option) => option.name);

    return distances;
  };

  const isRegistrationOpen = () => {
    if (!race.registrationDeadline) return true;
    return new Date(race.registrationDeadline) > new Date();
  };

  const getRegistrationDeadline = () => {
    if (!race.registrationDeadline) return null;
    return format(new Date(race.registrationDeadline), "MMM dd, yyyy");
  };

  return (
    <Link href={`/races/${race.slug}`} style={{ textDecoration: "none" }}>
      <Card
        shadow="sm"
        padding={0}
        radius="md"
        withBorder
        h="100%"
        style={{ cursor: "pointer", overflow: "hidden" }}
      >
        <Stack gap={0} h="100%">
          {/* Race banner with overlay */}
          {race.website?.banner && (
            <Box pos="relative" h={200}>
              <Image
                src={race.website.banner.url}
                alt={`${race.name} banner`}
                height={200}
                fit="cover"
                style={{ width: "100%" }}
                opacity={0.7}
              />
              <Box
                w="100%"
                p="xs"
                pos="absolute"
                top="50%"
                left="50%"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <Group gap="md" align="center" justify="center">
                  {race.website?.logo && (
                    <Image
                      src={race.website.logo.url}
                      alt={`${race.name} logo`}
                      width={80}
                      height={80}
                      fit="contain"
                      style={{ objectFit: "contain" }}
                    />
                  )}
                  <Title
                    order={2}
                    size="h3"
                    lineClamp={2}
                    c="white"
                    ta="center"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    {race.name}
                  </Title>
                </Group>
              </Box>
            </Box>
          )}

          {/* Content area */}
          <Stack gap="md" p="lg">
            {/* Description and distances */}
            <Group gap="md" align="flex-start">
              <Stack gap="xs" style={{ flex: 1 }}>
                <Group gap="xs">
                  {getDistanceOptions().length > 0 ? (
                    getDistanceOptions().map((distance, index) => (
                      <Badge
                        key={`${index}-${distance}`}
                        variant="light"
                        color="blue"
                        size="md"
                      >
                        {distance}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="light" color="gray" size="md">
                      TBD
                    </Badge>
                  )}
                </Group>
                {race.website?.description && (
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {race.website.description}
                  </Text>
                )}
              </Stack>
            </Group>

            {/* Event details */}
            <Stack gap="xs">
              <Group gap="xs">
                <Calendar size={16} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed">
                  {formatDate(race.date)}
                </Text>
              </Group>

              <Group gap="xs">
                <MapPin size={16} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed">
                  {race.address
                    ? `${race.address.city}, ${race.address.state}`
                    : "TBD"}
                </Text>
              </Group>

              {race.registrationDeadline && (
                <Group gap="xs">
                  <Clock size={16} color="var(--mantine-color-dimmed)" />
                  <Text size="sm" c="dimmed">
                    {isRegistrationOpen()
                      ? `Registration closes ${getRegistrationDeadline()}`
                      : "Registration Closed"}
                  </Text>
                </Group>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}
