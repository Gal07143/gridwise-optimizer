
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ModbusWriteRequest {
  deviceId: string;
  register: {
    address: number;
    type: 'coil' | 'discrete_input' | 'holding' | 'input';
    dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float' | 'boolean';
    length: number;
  };
  value: number | boolean;
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
    const { deviceId, register, value } = await req.json() as ModbusWriteRequest;

    // Validate request
    if (!deviceId || !register || value === undefined) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing deviceId, register or value" }),
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

    console.log(`Writing value ${value} to register ${register.address} on device ${device.name}`);

    // In a real implementation, we would connect to the Modbus device and write the register
    // For now, we'll simulate a write

    // Sleep for a short time to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));

    // Validate that this is a writable register type
    if (register.type === 'discrete_input' || register.type === 'input') {
      return new Response(
        JSON.stringify({ success: false, message: "Cannot write to input registers" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Log the write operation
    await supabase
      .from("modbus_write_logs")
      .insert({
        device_id: deviceId,
        register_address: register.address,
        value: typeof value === 'boolean' ? (value ? 1 : 0) : value,
        timestamp: new Date().toISOString(),
        user_id: req.headers.get("authorization")?.split(" ")[1] || "anonymous",
      });

    // Update device status to show it's online (since we successfully wrote to it)
    await supabase
      .from("modbus_devices")
      .update({ status: "online", updated_at: new Date().toISOString() })
      .eq("id", deviceId);

    // Return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Value ${value} written to ${register.address}` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error writing to Modbus register:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
