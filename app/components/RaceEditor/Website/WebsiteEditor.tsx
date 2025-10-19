"use client";

import { Box, Button, Group, Stack, Textarea, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import PageHeader from "@/app/components/PageHeader.tsx/PageHeader";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import type { WebsiteSection } from "@/app/lib/types";
import WebsiteMediaEditor from "./WebsiteMediaEditor";
import WebsiteSectionEditor from "./WebsiteSectionEditor";

export default function WebsiteEditor() {
  const website = useRaceStore((state) => state.getWebsite());
  const updateWebsiteDescription = useRaceStore(
    (state) => state.updateWebsiteDescription,
  );
  const addWebsiteSection = useRaceStore((state) => state.addWebsiteSection);
  const updateWebsiteSection = useRaceStore(
    (state) => state.updateWebsiteSection,
  );
  const removeWebsiteSection = useRaceStore(
    (state) => state.removeWebsiteSection,
  );

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
            backgroundColor: "var(--mantine-color-body)",
          }}
        >
          <Group justify="space-between" align="center">
            <PageHeader
              title="Website"
              description="Customize your race website content and sections"
            />
          </Group>
        </Stack>

        <Stack gap="xl" px={2}>
          {/* Description Section */}
          <Box>
            <Title order={4} mb="md">
              Description
            </Title>
            <Textarea
              placeholder="Describe your race, what makes it special, and what participants can expect..."
              value={website.description}
              onChange={(e) => updateWebsiteDescription(e.target.value)}
              minRows={4}
              maxRows={8}
            />
          </Box>

          {/* Media Section */}
          <WebsiteMediaEditor />

          {/* Sections */}
          <Box>
            <Group justify="space-between" align="center" mb="md">
              <Title order={4}>Sections</Title>
              <Button
                leftSection={<Plus size={16} />}
                onClick={addWebsiteSection}
              >
                Add Section
              </Button>
            </Group>

            {website.sections.length === 0 ? (
              <Box
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "var(--mantine-color-dimmed)",
                }}
              >
                No sections yet. Click "Add Section" to create content sections
                for your race website.
              </Box>
            ) : (
              <Stack gap="md">
                {website.sections.map(
                  (section: WebsiteSection, index: number) => (
                    <WebsiteSectionEditor
                      key={section.id}
                      section={section}
                      index={index}
                      onUpdateSection={updateWebsiteSection}
                      onRemoveSection={removeWebsiteSection}
                    />
                  ),
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
