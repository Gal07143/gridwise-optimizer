// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { title, message, severity, user_id } = await req.json();

  console.log(`📨 Send Alert Notification`);
  console.log(`• Title: ${title}`);
  console.log(`• Message: ${message}`);
  console.log(`• Severity: ${severity}`);
  console.log(`• User: ${user_id}`);

  return new Response(
    JSON.stringify({ status: "Notification Sent (mocked)" }),
    { headers: { "Content-Type": "application/json" } }
  );
});
