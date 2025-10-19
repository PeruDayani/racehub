"use client";

import {
  ActionIcon,
  Card,
  Collapse,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { ChevronDown, ChevronUp, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MediaUpload from "@/app/components/MediaUpload/MediaUpload";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import type { Sponsorship } from "@/app/lib/types";

interface SponsorEditorProps {
  sponsorship: Sponsorship;
  index: number;
}

const TIER_OPTIONS = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
];

export default function SponsorEditor({
  sponsorship,
  index,
}: SponsorEditorProps) {
  const raceId = useRaceStore((state) => state.race.id);
  const [collapsed, setCollapsed] = useState<boolean>(sponsorship.name !== "");

  const updateSponsorship = useRaceStore((state) => state.updateSponsorship);
  const deleteSponsorship = useRaceStore((state) => state.deleteSponsorship);

  const onUpdate = (field: keyof Sponsorship, value: any) => {
    updateSponsorship(sponsorship.id, { [field]: value });
  };

  const onWebsiteUrlBlur = (value: string) => {
    if (value && typeof value === "string") {
      const sanitizedUrl = getValidUrl(value);
      updateSponsorship(sponsorship.id, { websiteUrl: sanitizedUrl });
    }
  };

  const getValidUrl = (url: string) => {
    if (!url) return "";

    // If it already has a protocol, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it starts with www. or doesn't have a protocol, add https://
    return `https://${url}`;
  };

  const getSummary = () => {
    const tierLabel =
      TIER_OPTIONS.find((t) => t.value === sponsorship.tier)?.label || "Bronze";
    const name = sponsorship.name || "Untitled Sponsorship";
    return `${index + 1}. ${name} - ${tierLabel ? `${tierLabel} Tier` : ""}`;
  };

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand" : "Collapse"}
              mt={2}
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </ActionIcon>
            <div>
              <Text fw={600} size="sm">
                {getSummary()}
              </Text>
              <Text size="xs" c="dimmed">
                {sponsorship.description || "No description"}
              </Text>
            </div>
          </Group>
          <ActionIcon
            color="red"
            variant="subtle"
            size="sm"
            onClick={() => deleteSponsorship(sponsorship.id)}
          >
            <Trash2 size={16} />
          </ActionIcon>
        </Group>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack gap="md" pt="md">
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Sponsor Name"
                placeholder="e.g., Nike, Adidas, Local Business"
                value={sponsorship.name || ""}
                onChange={(e) => onUpdate("name", e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Tier"
                placeholder="Select tier"
                data={TIER_OPTIONS}
                value={sponsorship.tier}
                onChange={(value) =>
                  onUpdate("tier", value as Sponsorship["tier"])
                }
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Description"
            placeholder="Describe the sponsorship details, benefits, or partnership"
            value={sponsorship.description || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
            minRows={3}
          />

          <TextInput
            label="Website URL"
            placeholder="example.com or https://example.com"
            value={sponsorship.websiteUrl || ""}
            onChange={(e) => onUpdate("websiteUrl", e.target.value)}
            onBlur={(e) => onWebsiteUrlBlur(e.target.value)}
            rightSection={
              sponsorship.websiteUrl ? (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  component={Link}
                  href={sponsorship.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open website"
                >
                  <ExternalLink size={16} />
                </ActionIcon>
              ) : null
            }
          />

          <MediaUpload
            currentMedia={sponsorship.logo}
            onMediaChange={(media) => onUpdate("logo", media)}
            bucket="website"
            folderId={raceId.toString()}
            label="Sponsor Logo"
            description="Upload a logo for this sponsor. Recommended size: 200x200px or larger."
            accept="image/*"
            maxSize={5}
          />
        </Stack>
      </Collapse>
    </Card>
  );
}
