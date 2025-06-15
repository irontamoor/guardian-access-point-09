
// Supabase Edge Function: close-active-attendance
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// CORS (not needed for scheduled job, but harmless)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Get today's date (UTC, midnight)
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const midnightISO = now.toISOString();

    // 2. Get all users with LAST attendance record "in" (present) as of now
    // Fetch latest attendance record per user
    const { data: records, error } = await supabase
      .from("attendance_records")
      .select("id,user_id,status,check_in_time,check_out_time,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Build map: user_id => record with most recent created_at
    const latestStatusMap = new Map();
    (records || []).forEach((row) => {
      if (!latestStatusMap.has(row.user_id)) {
        latestStatusMap.set(row.user_id, row);
      }
    });

    // Get users currently "in"
    const usersIn = Array.from(latestStatusMap.values())
      .filter((r: any) => r.status === "in");

    // For each user-in, insert new "out" attendance record with timestamp = midnight
    const payloads = usersIn.map((row: any) => ({
      user_id: row.user_id,
      status: "out",
      check_out_time: midnightISO,
      // Optionally, add a note:
      notes: "Automatically checked out at midnight by system.",
    }));

    if (payloads.length) {
      const { error: insertErr } = await supabase.from("attendance_records").insert(payloads);
      if (insertErr) throw insertErr;
    }

    return new Response(
      JSON.stringify({ usersAutomaticallyCheckedOut: payloads.length, now: midnightISO }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? e.toString() }),
      { status: 500, headers: corsHeaders }
    );
  }
});
