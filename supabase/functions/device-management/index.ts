// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Define types for request and response
interface DeviceRequest {
  name: string;
  type: string;
  protocol: string;
  mqtt_topic: string;
  http_endpoint?: string;
  ip_address?: string;
  port?: number;
  slave_id?: number;
}

interface DeviceResponse {
  id: string;
  name: string;
  type: string;
  protocol: string;
  status: string;
  last_seen: string | null;
  mqtt_topic: string;
  http_endpoint?: string;
  ip_address?: string;
  port?: number;
  slave_id?: number;
  created_at: string;
  updated_at: string;
}

// Create a Supabase client with the Auth context of the logged in user
const createSupabaseClient = (req: Request) => {
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase SERVICE_ROLE KEY - env var exported by default.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )
  return supabaseClient
}

// Handle CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createSupabaseClient(req)
    
    // Get the user from the request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the request URL to determine the operation
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const operation = pathParts[pathParts.length - 1]
    const deviceId = pathParts.length > 1 ? pathParts[pathParts.length - 2] : null

    // Handle different operations
    switch (operation) {
      case 'list':
        // List all devices for the user
        const { data: devices, error: listError } = await supabaseClient
          .from('devices')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (listError) throw listError
        
        return new Response(
          JSON.stringify({ devices }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      
      case 'get':
        // Get a specific device
        if (!deviceId) {
          return new Response(
            JSON.stringify({ error: 'Device ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const { data: device, error: getError } = await supabaseClient
          .from('devices')
          .select('*')
          .eq('id', deviceId)
          .eq('user_id', user.id)
          .single()
        
        if (getError) throw getError
        
        return new Response(
          JSON.stringify({ device }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      
      case 'create':
        // Create a new device
        const deviceData: DeviceRequest = await req.json()
        
        const { data: newDevice, error: createError } = await supabaseClient
          .from('devices')
          .insert([{ ...deviceData, user_id: user.id, status: 'offline' }])
          .select()
          .single()
        
        if (createError) throw createError
        
        return new Response(
          JSON.stringify({ device: newDevice }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      
      case 'update':
        // Update a device
        if (!deviceId) {
          return new Response(
            JSON.stringify({ error: 'Device ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const updateData = await req.json()
        
        const { data: updatedDevice, error: updateError } = await supabaseClient
          .from('devices')
          .update(updateData)
          .eq('id', deviceId)
          .eq('user_id', user.id)
          .select()
          .single()
        
        if (updateError) throw updateError
        
        return new Response(
          JSON.stringify({ device: updatedDevice }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      
      case 'delete':
        // Delete a device
        if (!deviceId) {
          return new Response(
            JSON.stringify({ error: 'Device ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const { error: deleteError } = await supabaseClient
          .from('devices')
          .delete()
          .eq('id', deviceId)
          .eq('user_id', user.id)
        
        if (deleteError) throw deleteError
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      
      case 'telemetry':
        // Get telemetry data for a device
        if (!deviceId) {
          return new Response(
            JSON.stringify({ error: 'Device ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Get query parameters
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 100
        const startTime = url.searchParams.get('start_time')
        const endTime = url.searchParams.get('end_time')
        
        // Build query
        let query = supabaseClient
          .from('telemetry_log')
          .select('*')
          .eq('device_id', deviceId)
          .order('timestamp', { ascending: false })
          .limit(limit)
        
        // Add time filters if provided
        if (startTime) {
          query = query.gte('timestamp', startTime)
        }
        
        if (endTime) {
          query = query.lte('timestamp', endTime)
        }
        
        const { data: telemetry, error: telemetryError } = await query
        
        if (telemetryError) throw telemetryError
        
        return new Response(
          JSON.stringify({ telemetry }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 