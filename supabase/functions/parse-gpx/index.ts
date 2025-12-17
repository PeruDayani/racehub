// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  // add gps parser function
  function parseGpx(gpxText: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(gpxText, "text/html");

    //parse out route name
    const nameNode = xml.getElementsByTagName("name")[0];
    const routeName = nameNode?.textContent ?? "Unnamed Route";

    //parse out track points
    const trkpts = xml.getElementsByTagName("trkpt");

    const points: { lat: number; lon: number }[] = [];

    for (const pt of trkpts) {
      const lat = pt.getAttribute("lat");
      const lon = pt.getAttribute("lon");

      if (lat && lon) {
        points.push({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        });
      }
    }

    return { routeName, points };
  }

  try {
    const { race_id } = await req.json();
    if (!race_id) return new Response("Missing race_id", { status: 400 });

    // 1️⃣ Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2️⃣ Get GPX path from races table
    const { data: race, error: raceError } = await supabase
      .from("races")
      .select("gpx")
      .eq("id", race_id)
      .single();

    if (raceError || !race) throw new Error("Race not found");

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

    //call the GPS parser
    const { routeName, points } = parseGpx(gpxText);

    if (points.length === 0) {
      throw new Error("No GPS points found in GPX file");
    }

    // Delete existing route points for this route_id to avoid duplicates
    const { error: deleteError } = await supabase
      .from("route_points")
      .delete()
      .eq("route_id", routeId);

    if (deleteError) {
      console.warn(
        "Warning: Failed to delete existing route points:",
        deleteError.message,
      );
    }

    // Prepare points for insertion with route_id, route_name, lat, lon, and point_index
    const pointsToInsert = points.map((point, index) => ({
      route_id: routeId,
      route_name: routeName,
      lat: point.lat,
      lon: point.lon,
      point_index: index,
    }));

    // Insert points into route_points table
    const { error: insertError } = await supabase
      .from("route_points")
      .insert(pointsToInsert);

    if (insertError) {
      throw new Error(`Failed to insert route points: ${insertError.message}`);
    }

    console.log(`Successfully inserted ${points.length} route points`);

    return new Response(
      JSON.stringify({
        message: "GPX data processed successfully",
        race_id: race_id,
        route_name: routeName,
        route_id: routeId,
        points_inserted: points.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
