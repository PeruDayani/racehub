import { Box, Image as MantineImage, Stack, Text, Title, Overlay, Container } from "@mantine/core";
import type { Race } from "@/app/lib/types";
import React from "react";

interface RaceMediaProps {
  race: Race;
  children?: React.ReactNode;
}

export default function RaceMedia({ race, children }: RaceMediaProps) {
  const hasBanner = Boolean(race.website?.banner?.url);
  const hasLogo = Boolean(race.website?.logo);

  // If neither exists, match your existing behavior
  if (!hasBanner && !hasLogo) {
    return null;
  }

  return (
    <>
      {/* Full-width Banner (relative so overlay can position) */}
      {hasBanner && (
        <div
          style={{
            width: "100vw",
            height: "500px",
            marginLeft: "calc(-50vw + 50%)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Background image */}
          <img
            src={race.website.banner.url}
            alt={`${race.name} banner`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.45)", // faint for readability
            }}
          />

          {/* Dark-blue tint overlay */}
          <Overlay
            color="rgba(10, 25, 60, 0.65)" // dark navy tint
            zIndex={1}
          />

          {/* Text overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "white",
              padding: "0 24px",
            }}
          >
            {/* Race Name */}
            <h1
              style={{
                fontSize: "clamp(32px, 6vw, 64px)",
                marginBottom: "12px",
                fontWeight: 700,
              }}
            >
              {race.name}
            </h1>

            {/* Race Description */}
            <p
              style={{
                maxWidth: "900px",
                fontSize: "clamp(16px, 2vw, 22px)",
                lineHeight: 1.4,
                opacity: 0.9,
              }}
            >
              {race.website?.description || "Race details coming soon."}
            </p>
            
            {/* Date and location */}
            <p
              style={{
                fontSize: "clamp(16px, 2vw, 22px)",
                fontWeight: 500,
                opacity: 0.95,
                marginBottom: "24px", // slightly more spacing below
                display: "flex",
                alignItems: "center",
                gap: "20px", // space between date and location
                justifyContent: "center",
                flexWrap: "wrap", // keeps layout clean on small screens
              }}
            >
              <span>
                📅{" "}
                {race.date
                  ? new Date(race.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Date TBD"}
              </span>

              <span>
                📍{" "}
                {race.address?.city && race.address?.state
                  ? `${race.address?.city}, ${race.address?.state}`
                  : "Location TBD"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Logo Section (unchanged) */}
      {hasLogo && (
        <Box mb="xl" mt="xl">
          <Stack gap="md">
            <Box ta="center">
              <MantineImage
                src={race.website?.logo?.url}
                alt={`${race.name} logo`}
                maw={200}
                mx="auto"
                radius="md"
              />
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
}
