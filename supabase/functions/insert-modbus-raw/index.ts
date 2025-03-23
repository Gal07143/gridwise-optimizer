// insert-modbus-raw/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: latest, error } = await supabase
    .from('modbus_readings')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)

  if (error || !latest || latest.length === 0) {
    return new Response('Error fetching latest reading', { status: 500 })
  }

  const { error: insertError } = await supabase
    .from('modbus_raw')
    .insert(latest)

  if (insertError) {
    return new Response('Error inserting into modbus_raw', { status: 500 })
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
