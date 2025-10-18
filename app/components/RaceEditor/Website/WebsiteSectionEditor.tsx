"use client";

import {
  ActionIcon,
  Card,
  Collapse,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import type { WebsiteSection } from "@/app/lib/types";

interface WebsiteSectionEditorProps {
  section: WebsiteSection;
  index: number;
  onUpdateSection: (index: number, name: string, content: string) => void;
  onRemoveSection: (index: number) => void;
}

export default function WebsiteSectionEditor({
  section,
  index,
  onUpdateSection,
  onRemoveSection,
}: WebsiteSectionEditorProps) {
  const [collapsed, setCollapsed] = useState<boolean>(
    section.name !== "" && section.content !== "",
  );

  const getSectionPreview = () => {
    if (!section.name && !section.content) {
      return "Empty section";
    }
    if (!section.name) {
      return "Untitled section";
    }
    return section.name;
  };

  const getContentPreview = () => {
    if (!section.content) {
      return "No content";
    }
    return section.content;
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
                {index + 1}. {getSectionPreview()}
              </Text>
              <Text size="xs" c="dimmed" truncate="end" maw={"300px"}>
                {getContentPreview()}
              </Text>
            </div>
          </Group>
          <ActionIcon
            color="red"
            variant="subtle"
            size="sm"
            onClick={() => onRemoveSection(index)}
          >
            <Trash2 size={16} />
          </ActionIcon>
        </Group>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack gap="md" pt="md">
          <TextInput
            label="Section Name"
            placeholder="e.g., Course Information, Race Day Schedule, Awards"
            value={section.name}
            onChange={(e) =>
              onUpdateSection(index, e.target.value, section.content)
            }
          />
          <Textarea
            label="Section Content"
            placeholder="Describe what this section covers..."
            value={section.content}
            onChange={(e) =>
              onUpdateSection(index, section.name, e.target.value)
            }
            minRows={3}
            maxRows={6}
          />
        </Stack>
      </Collapse>
    </Card>
  );
}
