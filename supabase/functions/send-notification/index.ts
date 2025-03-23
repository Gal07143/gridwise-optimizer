// 🔔 send-notification edge function
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const body = await req.json()
  const { title, message, severity, user_id } = body

  // TODO: Connect to Resend, Twilio, etc.
  console.log(`[ALERT] ${severity.toUpperCase()} - ${title}: ${message} (to user ${user_id})`)

  return new Response(JSON.stringify({ status: 'sent' }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
