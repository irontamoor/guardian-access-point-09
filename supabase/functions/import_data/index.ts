
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Authenticate via Authorization header
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const client = createClient(supabaseUrl, supabaseKey);

  const authHeader = req.headers.get('authorization') || "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "attendance";
  const payload = await req.json();

  if (type === "attendance") {
    // Insert multiple attendance records, ignoring duplicates
    const { error } = await client.from("attendance_records").upsert(payload);
    if (error) {
      return new Response(`Failed to import attendance: ${error.message}`, { status: 400 });
    }
    return new Response("Attendance imported", { status: 200 });
  } else if (type === "users") {
    const { error } = await client.from("system_users").upsert(payload);
    if (error) {
      return new Response(`Failed to import users: ${error.message}`, { status: 400 });
    }
    return new Response("Users imported", { status: 200 });
  } else {
    return new Response("Invalid type", { status: 400 });
  }
});
