"use client";

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  NavLink,
  ScrollArea,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  BadgePercent,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Info,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  Save,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useRaceStore } from "@/app/context/RaceStoreContext";
import styles from "./index.module.css";

export type NavLinkItem = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

const NAV_LINKS: NavLinkItem[] = [
  {
    label: "Dashboard",
    value: "",
    description: "Overview and quick actions",
    icon: LayoutDashboard,
  },
  {
    label: "Basic Information",
    value: "basic-information",
    description: "Race name, date, location",
    icon: Info,
  },
  {
    label: "Distance & Tickets",
    value: "distance-tickets",
    description: "Race distances and ticket types",
    icon: Ticket,
  },
  {
    label: "Sponsorships",
    value: "sponsorships",
    description: "Manage race sponsors",
    icon: Building2,
  },
  {
    label: "Website",
    value: "website",
    description: "Customize race website",
    icon: Globe,
  },
  {
    label: "Social Media",
    value: "social",
    description: "Manage race social media",
    icon: Share2,
  },
  {
    label: "Payment Configuration",
    value: "payment",
    description: "Setup payment processing",
    icon: CreditCard,
  },
  {
    label: "Waivers",
    value: "waivers",
    description: "Liability waivers and agreements",
    icon: FileText,
  },
  {
    label: "Discounts",
    value: "discounts",
    description: "Create discount codes",
    icon: BadgePercent,
  },
  {
    label: "Emails",
    value: "emails",
    description: "Email templates and campaigns",
    icon: Mail,
  },
  {
    label: "Race Day",
    value: "race-day",
    description: "Race day settings and logistics",
    icon: CalendarDays,
  },
  {
    label: "Participants & Results",
    value: "participants-results",
    description: "Manage runners and results",
    icon: Users,
  },
];

export default function SideNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const raceName = useRaceStore((state) => state.race.name);
  const raceId = useRaceStore((state) => state.race.id);
  const raceSlug = useRaceStore((state) => state.race.slug);
  const raceStatus = useRaceStore((state) => state.race.status);
  const isSaving = useRaceStore((state) => state.isSaving);

  const saveRace = useRaceStore((state) => state.saveRace);
  const markRaceAsLive = useRaceStore((state) => state.markRaceAsLive);

  const handleSaveRace = useCallback(async () => {
    const notificationId = notifications.show({
      title: "Saving race...",
      message: "Please wait while we save your race.",
      loading: true,
      autoClose: false,
      withCloseButton: false,
      color: "cyan",
    });

    try {
      const { success, message } = await saveRace();

      notifications.update({
        id: notificationId,
        title: success ? "Race saved" : "Race not saved",
        message:
          message ??
          (success ? "Your race has been saved." : "Failed to save race."),
        color: success ? "green" : "red",
        loading: false,
        autoClose: 2500,
        withCloseButton: true,
      });
    } catch (error) {
      console.error("Error saving race:", error);
      notifications.update({
        id: notificationId,
        title: "Race not saved",
        message: "An unexpected error occurred while saving your race.",
        color: "red",
        loading: false,
        autoClose: 4000,
        withCloseButton: true,
      });
    }
  }, [saveRace]);

  const handleMarkRaceAsLive = useCallback(async () => {
    const notificationId = notifications.show({
      title: "Marking race as live...",
      message: "Please wait while we mark your race as live.",
      loading: true,
      autoClose: false,
      withCloseButton: false,
      color: "cyan",
    });

    try {
      const { success, message } = await markRaceAsLive();

      notifications.update({
        id: notificationId,
        title: success ? "Race marked as live" : "Race not marked as live",
        message:
          message ??
          (success
            ? "Your race has been marked as live."
            : "Failed to mark race as live."),
        color: success ? "green" : "red",
        loading: false,
        autoClose: 2500,
        withCloseButton: true,
      });
    } catch (error) {
      console.error("Error marking race as live:", error);
      notifications.update({
        id: notificationId,
        title: "Race not marked as live",
        message:
          "An unexpected error occurred while marking your race as live.",
        color: "red",
        loading: false,
        autoClose: 4000,
        withCloseButton: true,
      });
    }
  }, [markRaceAsLive]);

  const links = useMemo(
    () =>
      NAV_LINKS.map((link) => {
        const href = `/dashboard/edit-race/${raceId}${
          link.value ? `/${link.value}` : ""
        }`;
        const isActive = pathname === href;

        if (isCollapsed) {
          return (
            <Tooltip key={link.value} label={link.label} position="right">
              <ActionIcon
                component={Link}
                href={href}
                variant={isActive ? "light" : "subtle"}
                color={isActive ? "violet" : "black"}
                size="xl"
                radius="md"
              >
                <link.icon size={20} strokeWidth={1.5} />
              </ActionIcon>
            </Tooltip>
          );
        }

        return (
          <NavLink
            key={link.value}
            component={Link}
            href={href}
            label={link.label}
            description={link.description}
            leftSection={<link.icon size={20} strokeWidth={1.5} />}
            variant={isActive ? "light" : "subtle"}
            color={isActive ? "violet" : "gray"}
            active={isActive}
            bdrs="md"
          />
        );
      }),
    [pathname, raceId, isCollapsed],
  );

  return (
    <Box
      w={isCollapsed ? 80 : 280}
      h="calc(100vh - 80px)"
      className={styles.sideNav}
    >
      <Stack gap={0} h="100%">
        {/* Header */}
        <Flex
          justify={isCollapsed ? "center" : "flex-start"}
          align="center"
          p="xs"
          gap="xs"
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => setIsCollapsed((prev) => !prev)}
            size="xl"
            radius="md"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </ActionIcon>

          {!isCollapsed && (
            <Title order={5} className={styles.raceTitle}>
              {raceName || "Untitled Race"}
            </Title>
          )}
        </Flex>

        <Divider />

        {/* Save button */}
        <Stack gap={8} p="xs" align="center">
          {isCollapsed ? (
            <Tooltip label="Save Race" position="right">
              <ActionIcon
                variant="subtle"
                size="xl"
                radius="md"
                onClick={handleSaveRace}
                loading={isSaving}
              >
                <Save size={20} strokeWidth={1.5} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <>
              <Button
                variant="light"
                size="md"
                radius="md"
                onClick={handleSaveRace}
                fullWidth
                loading={isSaving}
              >
                {isSaving ? "Saving..." : "Save Race"}
              </Button>
              {raceStatus === "live" && (
                <Button
                  variant="light"
                  size="md"
                  radius="md"
                  component={Link}
                  href={`/races/${raceSlug}`}
                  fullWidth
                  target="_blank"
                >
                  View Live Website
                </Button>
              )}
              {raceStatus === "draft" && (
                <>
                  <Button
                    variant="light"
                    size="md"
                    radius="md"
                    component={Link}
                    href={`/dashboard/preview-race/${raceId}`}
                    fullWidth
                    target="_blank"
                  >
                    Preview Race Website
                  </Button>
                  <Button
                    variant="light"
                    size="md"
                    radius="md"
                    onClick={handleMarkRaceAsLive}
                    fullWidth
                  >
                    Publish Race
                  </Button>
                </>
              )}
            </>
          )}
        </Stack>

        <Divider />

        {/* Nav Links */}
        <ScrollArea flex={1}>
          <Stack gap={4} p="xs" align={isCollapsed ? "center" : "stretch"}>
            {links}
          </Stack>
        </ScrollArea>
      </Stack>
    </Box>
  );
}
