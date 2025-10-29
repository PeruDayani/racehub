import Link from "next/link";
import { Box, Group, ActionIcon, Title } from "@mantine/core";
import { PLATFORM_CONFIG } from "@/app/lib/constants";
import type { Race, SocialLink } from "@/app/lib/types";

type Props = {
  race: Race;
  /** Optional section heading, e.g., "Follow Us" (omit in footer) */
  heading?: string;
  /** Icon size in px */
  size?: number;
  /** Group wrap behavior; footer usually "nowrap" */
  wrap?: "nowrap" | "wrap";
};

const normalizeUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

export default function SocialIcons({
  race,
  heading,
  size = 20,
  wrap = "nowrap",
}: Props) {
  // Prefer top-level `race.socialMedia`, fall back to website if you ever move it
  const links: SocialLink[] = race.socialMedia ?? [];
  console.log("links:", links)

  const active = (links || []).filter((l) => l.url && l.url.trim() !== "");
  console.log("Active:", active)

  if (active.length === 0) return null;

  return (
    <Box mt={heading ? "xl" : undefined}>
      {heading && (
        <Title order={2} size="h2" mb="md">
          {heading}
        </Title>
      )}

      <Group
        gap="xs"
        wrap={wrap}
        aria-label={`${race.name ?? "Race"} social media`}
      >
        {active.map(({ platform, url }) => {
          const config = PLATFORM_CONFIG[platform];
          if (!config) return null;
          const Icon = config.icon;

          return (
            <ActionIcon
              key={platform}
              component={Link}
              href={normalizeUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              radius="md"
              aria-label={config.label}
              // You can tweak size/padding here if you like
            >
              <Icon size={size} strokeWidth={1.75} />
            </ActionIcon>
          );
        })}
      </Group>
    </Box>
  );
}
