import {
  Box,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Race } from "@/app/lib/types";

interface RaceSponsorshipsProps {
  race: Race;
}

export default function RaceSponsorships({ race }: RaceSponsorshipsProps) {
  // Debug: Log sponsorships data
  console.log('RaceSponsorships - race.sponsorships:', race.sponsorships);
  console.log('RaceSponsorships - sponsorships length:', race.sponsorships?.length);
  
  if (!race.sponsorships || race.sponsorships.length === 0) {
    console.log('RaceSponsorships - No sponsorships found, returning null');
    // Temporary: Show a message when no sponsorships
    return (
      <Box mt="xl">
        <Box 
          style={{ 
            borderTop: '1px solid #e9ecef',
            marginTop: '2rem',
            marginBottom: '2rem'
          }}
        />
        <Title order={2} size="h2" mb="md" ta="center">
          Our Partners
        </Title>
        <Text c="dimmed" ta="center">No partners have been added yet.</Text>
      </Box>
    );
  }

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "gold":
        return "Gold Sponsor";
      case "silver":
        return "Silver Sponsor";
      case "bronze":
        return "Bronze Sponsor";
      default:
        return "Sponsor";
    }
  };

  return (
    <Box mt="xl">
      <Box 
        style={{ 
          borderTop: '1px solid #e9ecef',
          marginTop: '2rem',
          marginBottom: '2rem'
        }}
      />
      <Title order={2} size="h2" mb="md" ta="center">
        Our Partners
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
        {race.sponsorships.map((sponsorship) => (
          <Card key={sponsorship.id} shadow="sm" radius="md" withBorder p="md">
            <Stack gap="sm" align="center">
              {/* Logo */}
              {sponsorship.logo && (
                <Box
                  style={{
                    height: 80,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={sponsorship.logo.url}
                    alt={`${sponsorship.name} logo`}
                    style={{
                      maxHeight: 80,
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}

              {/* Sponsor Info */}
              <Stack gap="xs" align="center" style={{ flex: 1 }}>
                <Text fw={600} size="sm" ta="center">
                  {sponsorship.name}
                </Text>
                <Text size="xs" fw={500} ta="center">
                  {getTierLabel(sponsorship.tier)}
                </Text>
                {sponsorship.description && (
                  <Text size="xs" c="dimmed" ta="center" lineClamp={3}>
                    {sponsorship.description}
                  </Text>
                )}
              </Stack>

              {/* Website Link */}
              {sponsorship.websiteUrl && (
                <Group gap="xs" justify="center">
                  <Text size="xs" c="dimmed">
                    Visit Website
                  </Text>
                  <Link
                    href={sponsorship.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <ExternalLink
                      size={14}
                      color="var(--mantine-color-blue-6)"
                    />
                  </Link>
                </Group>
              )}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
