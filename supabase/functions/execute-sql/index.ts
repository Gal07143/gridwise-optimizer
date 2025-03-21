
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SqlRequest {
  query: string;
  params: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key for full database access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify that the request is authenticated
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the token
    const { data: user, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user's role to check permissions
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.user.id)
      .single();

    // Only admin users can execute arbitrary SQL
    if (profileError || !profileData || profileData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin privileges required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the request body
    const { query, params } = await req.json() as SqlRequest;

    // Validate the query (here we could add additional security checks)
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Bad Request - Missing query' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Disallow certain dangerous operations
    const dangerousOperations = [
      /DROP\s+DATABASE/i, 
      /DROP\s+SCHEMA/i, 
      /TRUNCATE\s+TABLE/i,
      /DROP\s+USER/i,
      /ALTER\s+ROLE/i,
      /CREATE\s+ROLE/i,
      /DROP\s+ROLE/i,
      /GRANT\s+ALL/i
    ];

    for (const pattern of dangerousOperations) {
      if (pattern.test(query)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden - This SQL operation is not allowed' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Execute the query
    const { data, error } = await supabaseAdmin.rpc('execute_sql', { 
      query_text: query, 
      query_params: params 
    });

    if (error) throw error;

    // Return the data
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in execute-sql function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
