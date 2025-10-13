"use client";

import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createRaceAction } from "@/app/actions/raceActions";

export default function CreateRace() {
  const [opened, { open, close }] = useDisclosure(false);
  const [raceName, setRaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!raceName.trim()) {
        console.log("Race name is required");
        return;
      }

      setIsLoading(true);

      try {
        const result = await createRaceAction(raceName);
        console.log("createRaceAction response:", result);

        if (result.success && result.data?.raceId) {
          // Reset form and close modal on success
          setRaceName("");
          close();
          router.push(`/events/${result.data.raceId}`);
        }
      } catch (error) {
        console.error("Error creating race:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [raceName, close, router.push],
  );

  return (
    <>
      <Button onClick={open} leftSection={<Plus size={18} />}>
        Create Race
      </Button>

      <Modal opened={opened} onClose={close} title="Create New Race" centered>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Race Name"
            placeholder="Enter race name"
            required
            value={raceName}
            onChange={(event) => setRaceName(event.currentTarget.value)}
            disabled={isLoading}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" onClick={close} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Create Race
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
