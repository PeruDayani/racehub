import { getSupabaseClient } from "../_shared/supabase.ts";

const FUNCTION_NAME = "hello-world";

interface HelloWorldParams {
  raceId: string;
}

interface HelloWorldResponse {
  message: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const supabase = getSupabaseClient();

    // Get function parameters
    const { raceId } = (await req.json()) as HelloWorldParams;
    console.log(
      `[${FUNCTION_NAME}] params:`,
      JSON.stringify({ raceId }, null, 2),
    );

    // Perform the function logic
    const { data, error } = await supabase
      .from("races")
      .select("*")
      .eq("id", raceId);
    if (error) {
      throw new Error(`Error fetching race: ${error.message}`);
    }
    console.log(`[${FUNCTION_NAME}] race:`, JSON.stringify(data, null, 2));

    // Return the function response
    const response: HelloWorldResponse = {
      message: `Hello ${data[0].name}!`,
    };

    console.log(
      `[${FUNCTION_NAME}] response:`,
      JSON.stringify(response, null, 2),
    );
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`${FUNCTION_NAME} error:`, err);
    return new Response(String(err instanceof Error ? err.message : err), {
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"raceId":"12"}'

*/
