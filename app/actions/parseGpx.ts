"use server";

import { XMLParser } from "fast-xml-parser";
import { eq } from "drizzle-orm";
import { createClient } from "@/app/lib/supabase/client";
import { db } from "../lib/db";
import { races, routePoints } from "../../drizzle/schema";

export async function parseGpxAndLoadRoute(raceId: number) {
  const supabase = createClient();

  // 1️⃣ Get GPX path
  const race = await db.query.races.findFirst({
    where: eq(races.id, raceId),
    columns: {
      gpx: true,
      name: true,
    },
  });

  if (!race) {
    console.error("[parseGpx] race not found for id:", raceId);
    throw new Error("Race not found");
  }

  //extract path from JSON column
  const gpxPath = race.gpx?.path;
  if (!gpxPath) throw new Error("GPX path missing in race record");

  // Extract route_id from path (e.g. "13/gpxfile.gpx")
  const raceIdStr = gpxPath.split("/")[0];
  const raceIdVal = Number(raceIdStr);
  if (!raceIdVal || Number.isNaN(raceIdVal)) {
    throw new Error("Race ID is not a valid number");
  }

  //download gpx file from storage
  const { data: file, error: downloadError } = await supabase.storage
    .from("gpx") // bucket name
    .download(gpxPath);

  if (downloadError || !file) throw new Error("Failed to download GPX file");

  //read file as text
  const gpxText = await file.text();

  //parse gpx points using fast-xml-parser
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const gpxJson = parser.parse(gpxText);

  //extract track points
  let trkpts = gpxJson.gpx?.trk?.trkseg?.trkpt;
  if (!trkpts) {
    console.warn("[parseGpx] No track points found");
    return;
  }

  // Ensure array
  if (!Array.isArray(trkpts)) trkpts = [trkpts];

  // 4️⃣ Map points for insertion (use camelCase to match Drizzle schema)
  const rows = trkpts.map((pt: any, idx: number) => ({
    raceId: raceIdVal,
    lat: parseFloat(pt.lat),
    lon: parseFloat(pt.lon),
    pointIndex: idx + 1,
  }));

  // 6️⃣ Delete existing route points (Drizzle)
  await db
    .delete(routePoints)
    .where(eq(routePoints.raceId, raceIdVal));

  // 7️⃣ Insert new route points (Drizzle)
  await db
    .insert(routePoints)
    .values(rows);
}
