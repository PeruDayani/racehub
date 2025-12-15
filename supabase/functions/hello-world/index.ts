// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js"

// Connect to Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  // Only handle POST requests
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { run_id } = body;

      if (!run_id) {
        return new Response(
          JSON.stringify({ error: "Missing run_id in request body" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Query GPS points for the given run_id
      const { data, error } = await supabase
        .from("gps_points")
        .select("*")
        .eq("run_id", run_id);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // Flag invalid GPS points
      const pointsWithFlags = data.map((point: any) => ({
        ...point,
        invalid:
          point.lat < -90 || point.lat > 90 || point.lon < -180 || point.lon > 180
      }));

      return new Response(
        JSON.stringify({ points: pointsWithFlags }),
        { headers: { "Content-Type": "application/json" } }
      );

    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", details: err.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return new Response("Method not allowed", { status: 405 });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
