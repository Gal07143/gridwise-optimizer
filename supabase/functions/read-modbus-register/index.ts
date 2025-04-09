
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

// Simulated read function
async function readModbusRegister(deviceId: string, address: number, registerType: string, dataType: string) {
  try {
    // In a real implementation, this would communicate with a Modbus device
    // For now, we're simulating a successful read with random data
    
    // Get device information from the database
    const { data: device, error: deviceError } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', deviceId)
      .single()
      
    if (deviceError) throw deviceError
    
    // Simulate reading the register
    // In a real implementation, you would use a library like modbus-serial
    // to connect to the device and read the register
    
    // Generate a realistic looking value based on the data type
    let value: number | boolean
    
    switch (dataType) {
      case 'boolean':
        value = Math.random() > 0.5
        break
      case 'int16':
        value = Math.floor(Math.random() * 65536) - 32768
        break
      case 'uint16':
        value = Math.floor(Math.random() * 65536)
        break
      case 'int32':
        value = Math.floor(Math.random() * 4294967296) - 2147483648
        break
      case 'uint32':
        value = Math.floor(Math.random() * 4294967296)
        break
      case 'float':
        value = parseFloat((Math.random() * 100).toFixed(2))
        break
      default:
        value = Math.floor(Math.random() * 100)
    }
    
    // Log the read operation
    await supabase
      .from('modbus_read_logs')
      .insert({
        device_id: deviceId,
        register_address: address,
        register_type: registerType,
        value: String(value),
        timestamp: new Date().toISOString()
      })
    
    return { success: true, value, timestamp: new Date().toISOString() }
  } catch (error) {
    console.error('Error reading Modbus register:', error)
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
    const { deviceId, registerAddress, registerType, dataType } = await req.json()
    
    // Validate required fields
    if (!deviceId || registerAddress === undefined || !registerType || !dataType) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: deviceId, registerAddress, registerType, dataType' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Read the Modbus register
    const result = await readModbusRegister(deviceId, registerAddress, registerType, dataType)
    
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
