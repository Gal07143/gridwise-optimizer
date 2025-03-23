// Supabase Edge Function: insert-alert
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  const body = await req.json();
  const { title, message, severity, source = null, device_id = null } = body;

  if (!title || !message || !severity) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
    });
  }

  const { error } = await supabase.from('alerts').insert([
    {
      title,
      message,
      severity,
      source,
      device_id,
      acknowledged: false,
      timestamp: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error('Insert alert error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
