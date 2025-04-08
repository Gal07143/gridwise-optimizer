
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ControlRequest {
  deviceId: string;
  command: string;
  parameters?: Record<string, any>;
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

    // Parse request
    const requestData: ControlRequest = await req.json();
    const { deviceId, command, parameters } = requestData;

    console.log(`Processing control request for device ${deviceId}: ${command}`, parameters);

    // Get the device information
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single();

    if (deviceError) throw deviceError;
    if (!device) throw new Error(`Device ${deviceId} not found`);

    // Process the command based on the device type
    let result;
    switch (device.type) {
      case 'battery':
        result = await controlBattery(device, command, parameters);
        break;
      case 'ev_charger':
        result = await controlEvCharger(device, command, parameters);
        break;
      case 'inverter':
        result = await controlInverter(device, command, parameters);
        break;
      default:
        throw new Error(`Unsupported device type: ${device.type}`);
    }

    // Update device status in the database
    const { error: updateError } = await supabase
      .from('devices')
      .update({
        status: 'online',
        last_seen: new Date().toISOString(),
        metrics: {
          ...(device.metrics || {}),
          last_command: command,
          last_control_time: new Date().toISOString()
        }
      })
      .eq('id', deviceId);

    if (updateError) {
      console.error("Error updating device:", updateError);
    }

    // Log the control action
    await logControlAction(supabase, device, command, parameters, result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in device control:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function controlBattery(device, command, parameters) {
  // Implement battery control logic
  // In a real system, this would communicate with the actual battery system via API/protocol
  
  switch (command) {
    case 'charge':
      const chargeRate = parameters?.rate || 1.0; // Default to 1.0 C-rate
      return {
        status: 'charging',
        rate: chargeRate,
        message: `Started charging battery at ${chargeRate}C`
      };
      
    case 'discharge':
      const dischargeRate = parameters?.rate || 1.0; // Default to 1.0 C-rate
      return {
        status: 'discharging',
        rate: dischargeRate,
        message: `Started discharging battery at ${dischargeRate}C`
      };
      
    case 'idle':
      return {
        status: 'idle',
        message: 'Battery set to idle mode'
      };
      
    case 'setMinSoc':
      const minSoc = parameters?.value || 20;
      return {
        status: 'configured',
        min_soc: minSoc,
        message: `Set minimum SoC to ${minSoc}%`
      };
      
    case 'setMaxSoc':
      const maxSoc = parameters?.value || 90;
      return {
        status: 'configured',
        max_soc: maxSoc,
        message: `Set maximum SoC to ${maxSoc}%`
      };
      
    default:
      throw new Error(`Unknown battery command: ${command}`);
  }
}

async function controlEvCharger(device, command, parameters) {
  // Implement EV charger control logic
  switch (command) {
    case 'startCharging':
      const power = parameters?.power || device.capacity;
      return {
        status: 'charging',
        power: power,
        message: `Started EV charging at ${power}kW`
      };
      
    case 'stopCharging':
      return {
        status: 'idle',
        message: 'Stopped EV charging'
      };
      
    case 'setPower':
      const chargePower = parameters?.power || 11;
      return {
        status: 'configured',
        power: chargePower,
        message: `Set charging power to ${chargePower}kW`
      };
      
    case 'scheduleCharging':
      const startTime = parameters?.startTime;
      const endTime = parameters?.endTime;
      const targetSoc = parameters?.targetSoc || 80;
      
      if (!startTime || !endTime) {
        throw new Error('Start and end times are required for scheduling');
      }
      
      return {
        status: 'scheduled',
        start_time: startTime,
        end_time: endTime,
        target_soc: targetSoc,
        message: `Scheduled charging from ${startTime} to ${endTime} with target ${targetSoc}%`
      };
      
    default:
      throw new Error(`Unknown EV charger command: ${command}`);
  }
}

async function controlInverter(device, command, parameters) {
  // Implement inverter control logic
  switch (command) {
    case 'setPowerFactor':
      const powerFactor = parameters?.value || 1.0;
      return {
        status: 'configured',
        power_factor: powerFactor,
        message: `Set power factor to ${powerFactor}`
      };
      
    case 'setActivePowerLimit':
      const limit = parameters?.value || 100;
      return {
        status: 'configured',
        active_power_limit: limit,
        message: `Set active power limit to ${limit}%`
      };
      
    case 'enable':
      return {
        status: 'enabled',
        message: 'Inverter enabled'
      };
      
    case 'disable':
      return {
        status: 'disabled',
        message: 'Inverter disabled'
      };
      
    default:
      throw new Error(`Unknown inverter command: ${command}`);
  }
}

async function logControlAction(supabase, device, command, parameters, result) {
  try {
    // Log the control action for auditing and analytics
    const logEntry = {
      device_id: device.id,
      command,
      parameters,
      result,
      timestamp: new Date().toISOString()
    };
    
    await supabase
      .from('telemetry_log')
      .insert({
        device_id: device.id,
        source: 'control_api',
        severity: 'info',
        topic: `device/${device.id}/control`,
        message: logEntry,
        received_at: new Date().toISOString()
      });
      
    console.log(`Logged control action for ${device.id}: ${command}`);
  } catch (error) {
    console.error("Error logging control action:", error);
  }
}
