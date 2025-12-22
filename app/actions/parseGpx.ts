"use server";

import { XMLParser } from "fast-xml-parser";
import { createClient } from "@/app/lib/supabase/client";

export async function parseGpxAndLoadRoute(raceId: number) {    
    const supabase = createClient();

      // 1️⃣ Get GPX path
    const { data: race, error:raceError } = await supabase
    .from("races")
    .select("gpx")
    .eq("id", raceId)
    .single();

    if (raceError || !race) {
        console.error("[parseGpx] race fetch error", raceError);
        throw new Error("Race not found");
    }

    //extract path from JSON column
    const gpxPath = race.gpx?.path;
    if (!gpxPath) throw new Error("GPX path missing in race record");

    // Extract route_id from the beginning of the path (e.g., "13/gpxfile.gpx" -> 13)
    const routeIdStr = gpxPath.split("/")[0];
    if (!routeIdStr) throw new Error("Invalid GPX path format");
    const routeId = parseInt(routeIdStr, 10);
    if (Number.isNaN(routeId))
      throw new Error("Route ID is not a valid number");

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

    // Extract route name
    const routeName = gpxJson.gpx?.trk?.name ?? "Unnamed Route";

    //extract track points
    let trkpts = gpxJson.gpx?.trk?.trkseg?.trkpt;
    if (!trkpts) {
        console.warn("[parseGpx] No track points found");
        return;
    }

    // Ensure array
    if (!Array.isArray(trkpts)) trkpts = [trkpts];

    // 4️⃣ Map points for insertion
    const rows = trkpts.map((pt: any, idx: number) => ({
        route_id: routeId, // Use snake_case and integer type
        route_name: routeName,
        lat: parseFloat(pt.lat),
        lon: parseFloat(pt.lon),
        point_index: idx + 1,
    }));

    await supabase.from("route_points").delete().eq("route_id", routeId.toString());

    // 5️⃣ Insert points into route_points table
    const { error: insertError } = await supabase.from("route_points").insert(rows);

    if (insertError) {
        console.error("[parseGpx] insert error:", insertError);
        throw new Error("Failed to insert route points");
      }
  
}

    