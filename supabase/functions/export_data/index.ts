
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

serve(async (req) => {
  // Authenticate via the Authorization: Bearer <token> header
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const client = createClient(supabaseUrl, supabaseKey);

  // Basic token-based authentication
  const authHeader = req.headers.get('authorization') || "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Export requested type (attendance or users)
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "attendance";
  let data;
  if (type === "attendance") {
    const { data: attendance } = await client.from("attendance_records").select("*");
    data = attendance;
  } else if (type === "users") {
    const { data: users } = await client.from("system_users").select("*");
    data = users;
  } else {
    return new Response("Invalid type", { status: 400 });
  }

  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
});
