// supabase/functions/evaluate-fdd-rules/index.ts

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Get all enabled FDD rules
  const { data: rules, error: ruleError } = await supabase
    .from('fdd_rules')
    .select('*')
    .eq('enabled', true);

  if (ruleError) {
    console.error('Error fetching rules:', ruleError);
    return new Response('Failed to fetch rules', { status: 500 });
  }

  const alertsToInsert = [];

  for (const rule of rules) {
    // Evaluate the rule using dynamic query logic
    const { data: match, error } = await supabase
      .rpc('evaluate_fdd_expression', { expression: rule.rule_expression, device_id: rule.device_id });

    if (error) {
      console.error(`Rule failed [${rule.name}]:`, error);
      continue;
    }

    if (match?.triggered) {
      alertsToInsert.push({
        title: rule.name,
        message: rule.description || 'FDD condition met',
        severity: rule.severity,
        device_id: rule.device_id,
      });
    }
  }

  // Insert alerts
  for (const alert of alertsToInsert) {
    await supabase.from('alerts').insert([
      {
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        device_id: alert.device_id,
        acknowledged: false,
      },
    ]);
  }

  return new Response(JSON.stringify({ triggered: alertsToInsert.length }), { status: 200 });
});
