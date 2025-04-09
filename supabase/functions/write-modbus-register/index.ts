
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://xullgeycueouyxeirrqs.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Simulated write function
async function writeModbusRegister(deviceId: string, address: number, registerType: string, value: number | boolean) {
  try {
    // In a real implementation, this would communicate with a Modbus device
    // For now, we're simulating a successful write
    
    // Get device information from the database
    const { data: device, error: deviceError } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', deviceId)
      .single()
      
    if (deviceError) throw deviceError
    
    // Simulate writing to the register
    // In a real implementation, you would use a library like modbus-serial
    // to connect to the device and write to the register
    
    // Log the write operation
    await supabase
      .from('modbus_write_logs')
      .insert({
        device_id: deviceId,
        register_address: address,
        register_type: registerType,
        value: String(value),
        timestamp: new Date().toISOString()
      })
    
    return { success: true, timestamp: new Date().toISOString() }
  } catch (error) {
    console.error('Error writing to Modbus register:', error)
    return { success: false, error: error.message }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Parse request body
    const { deviceId, registerAddress, registerType, value } = await req.json()
    
    // Validate required fields
    if (!deviceId || registerAddress === undefined || !registerType || value === undefined) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: deviceId, registerAddress, registerType, value' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Write to the Modbus register
    const result = await writeModbusRegister(deviceId, registerAddress, registerType, value)
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      }
    )
  } catch (error) {
    // Handle any other errors
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
