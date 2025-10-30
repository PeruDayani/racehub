'use client';

import { Box, Group, Stack, TextInput } from '@mantine/core';
import PageHeader from '@/app/components/PageHeader.tsx/PageHeader';
import { useRaceStore } from '@/app/context/RaceStoreContext';
import { PLATFORM_CONFIG } from '@/app/lib/constants';
import type { SocialLink } from '@/app/lib/types';

export default function SocialMediaEditor() {
  const socialMedia = useRaceStore((state) => state.getSocialMedia());
  const updateSocialLink = useRaceStore((state) => state.updateSocialLink);

  return (
    <Box p="xl" w="100%" maw={1200} mx="auto">
      <Stack gap="lg" pos="relative">
        <Stack
          gap="sm"
          pos="sticky"
          top={80}
          py={12}
          style={{
            zIndex: 200,
            backgroundColor: 'var(--mantine-color-body)',
          }}
        >
          <PageHeader
            title="Social Media"
            description="Add your social media links to connect with participants"
          />
        </Stack>

        <Stack gap="xl" px={2}>
          <Box>
            <Stack gap="md">
              {socialMedia.map((link: SocialLink, index: number) => {
                const config = PLATFORM_CONFIG[link.platform];
                const Icon = config.icon;

                return (
                  <Group key={link.platform} gap="md" align="center">
                    <Icon size={24} />
                    <TextInput
                      size="sm"
                      radius="md"
                      label={config.label}
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => {
                        updateSocialLink(index, {
                          platform: link.platform,
                          url: e.target.value,
                        });
                      }}
                      style={{ flex: 1 }}
                    />
                  </Group>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
