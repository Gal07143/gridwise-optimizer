
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ModbusRegisterRequest {
  deviceId: string;
  register: {
    address: number;
    type: 'coil' | 'discrete_input' | 'holding' | 'input';
    dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float' | 'boolean';
    length: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { deviceId, register } = await req.json() as ModbusRegisterRequest;

    // Validate request
    if (!deviceId || !register) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing deviceId or register" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get device information from database
    const { data: device, error: deviceError } = await supabase
      .from("modbus_devices")
      .select("*")
      .eq("id", deviceId)
      .single();

    if (deviceError || !device) {
      return new Response(
        JSON.stringify({ success: false, message: "Device not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    console.log(`Reading register ${register.address} from device ${device.name}`);

    // In a real implementation, we would connect to the Modbus device and read the register
    // For now, we'll simulate a read with random values

    // Sleep for a short time to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));

    // Generate appropriate mock value based on register type
    let value: number | boolean;
    
    if (register.dataType === 'boolean') {
      value = Math.random() > 0.5;
    } else if (register.dataType === 'float') {
      value = parseFloat((Math.random() * 100).toFixed(2));
    } else if (['int16', 'uint16'].includes(register.dataType)) {
      value = Math.floor(Math.random() * 65535);
      if (register.dataType === 'int16') {
        value = value > 32767 ? value - 65536 : value;
      }
    } else {
      // int32, uint32
      value = Math.floor(Math.random() * 10000);
    }

    // Log the read and store in history
    await supabase
      .from("modbus_readings")
      .insert({
        device_id: deviceId,
        register_address: register.address,
        value: typeof value === 'boolean' ? (value ? 1 : 0) : value,
        timestamp: new Date().toISOString(),
      });

    // Return the value
    return new Response(
      JSON.stringify({ success: true, value }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error reading Modbus register:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
