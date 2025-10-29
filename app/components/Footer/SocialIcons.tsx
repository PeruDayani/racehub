import Link from "next/link";
import { Group, ActionIcon } from "@mantine/core";
import { PLATFORM_CONFIG } from "@/app/lib/constants";
import type { SocialLink } from "@/app/lib/types";

const normalizeUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

export function SocialIcons({ links }: { links: SocialLink[] }) {
  const active = links.filter((l) => l.url);
  if (!active.length) return null;

  return (
    <Group gap="xs" wrap="nowrap" aria-label="Race social media">
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
          >
            <Icon size={20} strokeWidth={1.75} />
          </ActionIcon>
        );
      })}
    </Group>
  );
}
