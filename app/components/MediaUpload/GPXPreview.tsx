"use client";

import { Box } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/app/lib/types";

interface GPXPreviewProps {
  media: Media;
  height?: string | number;
}

interface Waypoint {
  lat: number;
  lng: number;
  name?: string;
}

export default function GPXPreview({ media, height = 600 }: GPXPreviewProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    waypoints: Waypoint[];
  }> | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  // Function to fetch and parse GPX file
  async function fetchAndParseGPX(url: string) {
    try {
      const response = await fetch(url);
      const text = await response.text();

      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      return xmlDoc;
    } catch (error) {
      console.error("Error fetching or parsing GPX file:", error);
      throw error;
    }
  }

  // Extract track points from GPX XML
  function extractWaypoints(xmlDoc: Document): Waypoint[] {
    const gpxNamespace = "http://www.topografix.com/GPX/1/1";
    const waypoints: Waypoint[] = [];

    // Extract track points (trkpt) - these form the route path
    let trackPointElements = xmlDoc.getElementsByTagNameNS(
      gpxNamespace,
      "trkpt",
    );

    // If no results with namespace, try without namespace
    if (trackPointElements.length === 0) {
      trackPointElements = xmlDoc.getElementsByTagName("trkpt");
    }

    for (let i = 0; i < trackPointElements.length; i++) {
      const trkpt = trackPointElements[i];
      const lat = parseFloat(trkpt.getAttribute("lat") || "0");
      const lon = parseFloat(trkpt.getAttribute("lon") || "0");

      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        waypoints.push({ lat, lng: lon });
      }
    }

    return waypoints;
  }

  // Fetch and parse GPX file to extract waypoints
  useEffect(() => {
    if (!media.url) return;

    fetchAndParseGPX(media.url)
      .then((xmlDoc) => {
        const extractedWaypoints = extractWaypoints(xmlDoc);
        setWaypoints(extractedWaypoints);
      })
      .catch((error) => {
        console.error("Error processing GPX file:", error);
      });
  }, [media.url, extractWaypoints, fetchAndParseGPX]);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([
        { MapContainer, TileLayer, Polyline, Marker, Popup, useMap },
        leaflet,
      ]) => {
        const L = leaflet.default;

        // Fix for default markers in Leaflet with Next.js
        delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })
          ._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        // Create custom icons for start and finish
        const startIcon = L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const finishIcon = L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Import CSS (side effect only)
        // @ts-expect-error - CSS imports are handled by Next.js bundler
        void import("leaflet/dist/leaflet.css");

        // Component to fit map bounds to polyline
        function FitBounds({ positions }: { positions: [number, number][] }) {
          const map = useMap();
          const positionsKeyRef = useRef<string>("");
          const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

          useEffect(() => {
            if (positions.length === 0) return;

            // Create a key from first and last position to detect actual changes
            const firstPos = positions[0];
            const lastPos = positions[positions.length - 1];
            const positionsKey = `${firstPos[0]},${firstPos[1]}-${lastPos[0]},${lastPos[1]}-${positions.length}`;

            // Only fit bounds if positions have actually changed
            if (positionsKey !== positionsKeyRef.current) {
              positionsKeyRef.current = positionsKey;

              // Clear any existing timeout
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

              // Use a small delay to ensure map is ready
              timeoutRef.current = setTimeout(() => {
                try {
                  const bounds = L.latLngBounds(positions);
                  if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [20, 20] });
                  }
                } catch (_error) {
                  // Silently handle errors
                }
                timeoutRef.current = null;
              }, 50);
            }

            return () => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            };
          }, [positions, map]);

          return null;
        }

        const LeafletMap = ({
          waypoints: mapWaypoints,
        }: {
          waypoints: Waypoint[];
        }) => {
          // Convert waypoints to polyline positions
          const polylinePositions: [number, number][] = mapWaypoints.map(
            (wp) => [wp.lat, wp.lng],
          );

          // Get start and finish points
          const startPoint = mapWaypoints.length > 0 ? mapWaypoints[0] : null;
          const finishPoint =
            mapWaypoints.length > 1
              ? mapWaypoints[mapWaypoints.length - 1]
              : null;

          // Calculate center and initial zoom from waypoints
          const center: [number, number] =
            mapWaypoints.length > 0
              ? [mapWaypoints[0].lat, mapWaypoints[0].lng]
              : [0, 0];

          return (
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds positions={polylinePositions} />
              {polylinePositions.length > 0 && (
                <Polyline
                  positions={polylinePositions}
                  color="#3388ff"
                  weight={4}
                  opacity={0.7}
                />
              )}
              {startPoint && (
                <Marker
                  position={[startPoint.lat, startPoint.lng]}
                  icon={startIcon}
                >
                  <Popup>Start</Popup>
                </Marker>
              )}
              {finishPoint && startPoint !== finishPoint && (
                <Marker
                  position={[finishPoint.lat, finishPoint.lng]}
                  icon={finishIcon}
                >
                  <Popup>Finish</Popup>
                </Marker>
              )}
            </MapContainer>
          );
        };

        setMapComponent(() => LeafletMap);
      },
    );
  }, []);

  if (!MapComponent) {
    return (
      <Box
        style={{
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-md)",
          overflow: "hidden",
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading map...
      </Box>
    );
  }

  return (
    <Box
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-md)",
        overflow: "hidden",
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <MapComponent waypoints={waypoints} />
    </Box>
  );
}
