"use client";

import {
  AppShell,
  Badge,
  Box,
  Group,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  Check,
  CreditCard,
  DollarSign,
  FileText,
  Flag,
  Mail,
  Save,
  Settings,
  Ticket,
  Trophy,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateRaceAction } from "@/app/actions/raceActions";
import type { AddressInput, Race } from "@/app/lib/types";
import BasicDetailsSection from "./sections/BasicDetailsSection";
import DiscountsSection from "./sections/DiscountsSection";
import EmailingSection from "./sections/EmailingSection";
import ParticipantsSection from "./sections/ParticipantsSection";
import PaymentInfoSection from "./sections/PaymentInfoSection";
import RaceDaySection from "./sections/RaceDaySection";
import SponsorshipsSection from "./sections/SponsorshipsSection";
import TicketDetailsSection from "./sections/TicketDetailsSection";
import WaiversSection from "./sections/WaiversSection";
import WebsiteSection from "./sections/WebsiteSection";

interface RaceEditorProps {
  race: Race;
}

type Section =
  | "basic-details"
  | "tickets"
  | "payment"
  | "waivers"
  | "sponsorships"
  | "website"
  | "discounts"
  | "emailing"
  | "race-day"
  | "participants";

const SECTIONS = [
  { id: "basic-details", label: "Basic Details", icon: Settings },
  { id: "tickets", label: "Ticket Details", icon: Ticket },
  { id: "payment", label: "Payment Information", icon: CreditCard },
  { id: "waivers", label: "Waivers", icon: FileText },
  { id: "sponsorships", label: "Sponsorships", icon: DollarSign },
  { id: "website", label: "Website", icon: Settings },
  { id: "discounts", label: "Discounts", icon: DollarSign },
  { id: "emailing", label: "Emailing", icon: Mail },
  { id: "race-day", label: "Race Day", icon: Flag },
  { id: "participants", label: "Participants & Results", icon: Trophy },
] as const;

export default function RaceEditor({ race: initialRace }: RaceEditorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [race, setRace] = useState<Race>(initialRace);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Get active section from URL or default to basic-details
  const activeSection =
    (searchParams.get("section") as Section) || "basic-details";

  const setActiveSection = useCallback(
    (section: Section) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", section);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  // Autosave function with debouncing
  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      const result = await updateRaceAction(race.id, {
        name: race.name,
        status: race.status,
        date: race.date ?? undefined,
        registrationDeadline: race.registrationDeadline ?? undefined,
      });

      if (result.success) {
        setLastSaved(new Date());
        // Update race with server response to keep in sync
        if (result.data?.race) {
          setRace(result.data.race);
        }
      } else {
        notifications.show({
          title: "Save failed",
          message: result.message,
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error saving race:", error);
      notifications.show({
        title: "Save failed",
        message: "An unexpected error occurred",
        color: "red",
      });
    } finally {
      setIsSaving(false);
    }
  }, [race]);

  // Debounced autosave - triggers 500ms after last change
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout for autosave
    const timeout = setTimeout(() => {
      if (
        race.name !== initialRace.name ||
        race.status !== initialRace.status ||
        race.date !== initialRace.date ||
        race.registrationDeadline !== initialRace.registrationDeadline
      ) {
        saveChanges();
      }
    }, 500);

    setSaveTimeout(timeout);

    // Cleanup
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    race.name,
    race.status,
    race.date,
    race.registrationDeadline,
    initialRace.date,
    initialRace.name,
    initialRace.registrationDeadline,
    initialRace.status,
    saveChanges,
    saveTimeout,
  ]);

  // Handle field updates
  const handleUpdate = useCallback(
    (field: string, value: string | null | undefined) => {
      setRace((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  // Handle address updates (not autosaved yet - needs separate implementation)
  const handleAddressUpdate = useCallback(
    (address: AddressInput | undefined) => {
      setRace((prev) => ({
        ...prev,
        address: address as any, // Type conversion for now
      }));
    },
    [],
  );

  // Save status text
  const saveStatus = useMemo(() => {
    if (isSaving) {
      return (
        <Group gap="xs">
          <Save size={14} />
          <Text size="xs">Saving...</Text>
        </Group>
      );
    }
    if (lastSaved) {
      return (
        <Group gap="xs">
          <Check size={14} />
          <Text size="xs">
            Saved{" "}
            {lastSaved.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Group>
      );
    }
    return null;
  }, [isSaving, lastSaved]);

  // Render active section content
  const renderSection = () => {
    switch (activeSection) {
      case "basic-details":
        return (
          <BasicDetailsSection
            race={race}
            onUpdate={handleUpdate}
            onAddressUpdate={handleAddressUpdate}
          />
        );
      case "tickets":
        return <TicketDetailsSection race={race} />;
      case "payment":
        return <PaymentInfoSection race={race} />;
      case "waivers":
        return <WaiversSection race={race} />;
      case "sponsorships":
        return <SponsorshipsSection race={race} />;
      case "website":
        return <WebsiteSection race={race} />;
      case "discounts":
        return <DiscountsSection race={race} />;
      case "emailing":
        return <EmailingSection race={race} />;
      case "race-day":
        return <RaceDaySection race={race} />;
      case "participants":
        return <ParticipantsSection race={race} />;
      default:
        return (
          <BasicDetailsSection
            race={race}
            onUpdate={handleUpdate}
            onAddressUpdate={handleAddressUpdate}
          />
        );
    }
  };

  return (
    <AppShell
      navbar={{
        width: 280,
        breakpoint: "md",
      }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Box mb="md">
            <Text fw={600} size="lg" mb="xs">
              {race.name}
            </Text>
            <Badge
              color={
                race.status === "published"
                  ? "green"
                  : race.status === "draft"
                    ? "gray"
                    : race.status === "cancelled"
                      ? "red"
                      : "blue"
              }
              variant="light"
            >
              {race.status}
            </Badge>
          </Box>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea}>
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <NavLink
                key={section.id}
                label={section.label}
                leftSection={<Icon size={18} />}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id as Section)}
                mb={4}
              />
            );
          })}
        </AppShell.Section>

        <AppShell.Section>
          <Box
            pt="md"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
            }}
          >
            {saveStatus}
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box maw={900} mx="auto">
          {renderSection()}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
