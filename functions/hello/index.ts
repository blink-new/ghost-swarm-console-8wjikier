import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve((_req) => {
  return new Response(JSON.stringify({ message: "Hello from Blink Edge Functions!" }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    status: 200,
  });
});
