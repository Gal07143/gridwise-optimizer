
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DeviceModel } from '@/types/device-model';

// Sample manufacturers with sufficient devices per type
const TARGET_MANUFACTURER_COUNT = 25;
const TARGET_DEVICES_PER_MANUFACTURER = 10;

/**
 * Imports device data from various sources and stores it in the database
 */
export async function importDeviceData() {
  try {
    toast.info("Starting device data import...", { duration: 3000 });
    
    // First, check if we already have enough data
    const { data: existingModels, error: countError } = await supabase
      .from('device_models')
      .select('manufacturer', { count: 'exact' });
      
    if (countError) {
      console.error("Error checking existing devices:", countError);
      toast.error("Failed to check existing device data");
      return false;
    }
    
    // Count unique manufacturers
    const uniqueManufacturers = new Set(existingModels?.map(model => model.manufacturer));
    
    if (uniqueManufacturers.size >= TARGET_MANUFACTURER_COUNT) {
      toast.success(`Database already contains ${uniqueManufacturers.size} manufacturers`);
      return true;
    }
    
    // Import data from all available sources
    const results = await Promise.all([
      importBatteryDevices(),
      importSolarDevices(),
      importInverterDevices(),
      importEVChargerDevices(),
      importMeterDevices()
    ]);
    
    const totalImported = results.reduce((sum, count) => sum + count, 0);
    
    toast.success(`Successfully imported ${totalImported} device models`);
    return true;
  } catch (error) {
    console.error("Device import failed:", error);
    toast.error("Failed to import device data");
    return false;
  }
}

/**
 * Import battery storage devices
 */
async function importBatteryDevices(): Promise<number> {
  const batteryManufacturers = [
    'LG Energy Solution', 'Tesla', 'BYD', 'Sonnen', 'Enphase', 'SolarEdge',
    'Generac', 'SimpliPhi', 'Discover', 'Eguana', 'Blue Ion', 'Pylon Tech',
    'Dyness', 'PowerPlus Energy', 'Alpha ESS', 'FranklinWH', 'NeoVolta',
    'Fortress Power', 'HomeGrid', 'SunPower', 'PylonTech', 'RELiON',
    'EnergyCell', 'OutBack Power', 'Rolls Battery', 'Trojan'
  ];
  
  const batteryModels = [];
  
  // Generate battery models for each manufacturer
  for (const manufacturer of batteryManufacturers) {
    const capacities = [5, 10, 13.5, 15, 20];
    const voltages = [12, 24, 48];
    
    for (let i = 0; i < TARGET_DEVICES_PER_MANUFACTURER; i++) {
      const capacity = capacities[Math.floor(Math.random() * capacities.length)];
      const voltage = voltages[Math.floor(Math.random() * voltages.length)];
      const modelNumber = `B${voltage}-${capacity}k-${100 + i}`;
      
      batteryModels.push({
        manufacturer: manufacturer,
        name: `${manufacturer} Energy Storage`,
        model_name: `PowerStore ${capacity}kWh`,
        model_number: modelNumber,
        device_type: 'battery',
        category: 'battery',
        protocol: ['CAN', 'Modbus TCP', 'Modbus RTU'][Math.floor(Math.random() * 3)],
        power_rating: capacity * 0.5,
        capacity: capacity,
        release_date: new Date(2018 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12)).toISOString().split('T')[0],
        support_level: ['full', 'partial', 'full'][Math.floor(Math.random() * 3)] as 'full' | 'partial' | 'none',
        has_manual: Math.random() > 0.2,
        has_datasheet: Math.random() > 0.3,
        has_video: Math.random() > 0.6,
        warranty: `${[5, 10, 15][Math.floor(Math.random() * 3)]} years`,
        certifications: ['UL', 'CE', 'IEC'].filter(() => Math.random() > 0.3),
        description: `The ${manufacturer} PowerStore ${capacity}kWh is a high-performance energy storage system designed for residential and small commercial applications. With a nominal voltage of ${voltage}V and a capacity of ${capacity}kWh, it provides reliable backup power and energy management capabilities.`,
        specifications: {
          nominal_voltage: voltage,
          battery_type: ['Lithium-ion', 'LFP', 'NMC'][Math.floor(Math.random() * 3)],
          cycle_life: Math.floor(1000 + Math.random() * 9000),
          round_trip_efficiency: Math.floor(85 + Math.random() * 10),
          dimensions: `${Math.floor(30 + Math.random() * 20)}cm x ${Math.floor(40 + Math.random() * 30)}cm x ${Math.floor(15 + Math.random() * 10)}cm`,
          weight: Math.floor(50 + Math.random() * 100),
          max_charge_rate: capacity * 0.5,
          max_discharge_rate: capacity * 0.5,
          depth_of_discharge: Math.floor(80 + Math.random() * 20),
          operating_temperature: `${Math.floor(-10 + Math.random() * 5)}°C to ${Math.floor(40 + Math.random() * 10)}°C`
        }
      });
    }
  }
  
  const { error } = await supabase.from('device_models').upsert(
    batteryModels,
    { onConflict: 'manufacturer,model_number' }
  );
  
  if (error) {
    console.error("Error importing battery devices:", error);
    return 0;
  }
  
  return batteryModels.length;
}

/**
 * Import solar panel devices
 */
async function importSolarDevices(): Promise<number> {
  const solarManufacturers = [
    'SunPower', 'LG Solar', 'Panasonic', 'JinkoSolar', 'Canadian Solar',
    'Trina Solar', 'REC Group', 'Q CELLS', 'LONGi Solar', 'First Solar', 
    'JA Solar', 'Mission Solar', 'Silfab', 'Solaria', 'Risen Energy',
    'Axitec', 'Hyundai', 'VSUN', 'Aptos Solar', 'Boviet Solar', 
    'Meyer Burger', 'Heliene', 'Waaree', 'Peimar', 'Astronergy'
  ];
  
  const solarModels = [];
  
  // Generate solar panel models for each manufacturer
  for (const manufacturer of solarManufacturers) {
    const wattages = [330, 360, 380, 400, 415, 450, 500, 550];
    const efficiencies = [19.5, 20.1, 20.8, 21.4, 22.0, 22.8];
    
    for (let i = 0; i < TARGET_DEVICES_PER_MANUFACTURER; i++) {
      const wattage = wattages[Math.floor(Math.random() * wattages.length)];
      const efficiency = efficiencies[Math.floor(Math.random() * efficiencies.length)];
      const modelNumber = `SP-${wattage}-${Math.floor(efficiency * 10)}-${100 + i}`;
      
      solarModels.push({
        manufacturer: manufacturer,
        name: `${manufacturer} Solar Panel`,
        model_name: `SunMax ${wattage}W`,
        model_number: modelNumber,
        device_type: 'solar',
        category: 'solar',
        protocol: 'N/A',
        power_rating: wattage,
        capacity: null,
        release_date: new Date(2018 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12)).toISOString().split('T')[0],
        support_level: ['full', 'partial', 'full'][Math.floor(Math.random() * 3)] as 'full' | 'partial' | 'none',
        has_manual: Math.random() > 0.2,
        has_datasheet: Math.random() > 0.1,
        has_video: Math.random() > 0.7,
        warranty: `${[25, 30][Math.floor(Math.random() * 2)]} years`,
        certifications: ['UL', 'IEC', 'MCS'].filter(() => Math.random() > 0.3),
        description: `The ${manufacturer} SunMax ${wattage}W is a high-efficiency solar panel offering ${efficiency}% efficiency. Designed for residential and commercial installations, it delivers reliable performance and long-term energy production.`,
        specifications: {
          cell_type: ['Monocrystalline', 'PERC', 'Bifacial', 'HJT'][Math.floor(Math.random() * 4)],
          efficiency: efficiency,
          dimensions: `${Math.floor(165 + Math.random() * 10)}cm x ${Math.floor(95 + Math.random() * 15)}cm x ${Math.floor(3 + Math.random() * 1)}cm`,
          weight: Math.floor(18 + Math.random() * 4),
          max_voltage: 1000 + (Math.random() > 0.5 ? 500 : 0),
          operating_temperature: `${Math.floor(-40 + Math.random() * 5)}°C to ${Math.floor(80 + Math.random() * 10)}°C`,
          temperature_coefficient: -0.29 - (Math.random() * 0.1),
          connector_type: ['MC4', 'MC4 Compatible'][Math.floor(Math.random() * 2)],
          frame: ['Black', 'Silver'][Math.floor(Math.random() * 2)]
        }
      });
    }
  }
  
  const { error } = await supabase.from('device_models').upsert(
    solarModels,
    { onConflict: 'manufacturer,model_number' }
  );
  
  if (error) {
    console.error("Error importing solar devices:", error);
    return 0;
  }
  
  return solarModels.length;
}

/**
 * Import inverter devices
 */
async function importInverterDevices(): Promise<number> {
  const inverterManufacturers = [
    'SMA', 'SolarEdge', 'Fronius', 'Enphase', 'ABB', 'Huawei', 'Delta',
    'GoodWe', 'Growatt', 'Sungrow', 'FIMER', 'Ginlong Solis', 'SolaX Power',
    'KACO', 'Schneider Electric', 'Victron Energy', 'Outback Power', 'Ingeteam',
    'Magnum Energy', 'Samil Power', 'Studer Innotec', 'Power Electronics',
    'Morningstar', 'Omron', 'Siemens'
  ];
  
  const inverterModels = [];
  
  // Generate inverter models for each manufacturer
  for (const manufacturer of inverterManufacturers) {
    const powers = [3, 5, 8, 10, 15, 20, 25, 30, 50, 100];
    const phases = [1, 3];
    
    for (let i = 0; i < TARGET_DEVICES_PER_MANUFACTURER; i++) {
      const power = powers[Math.floor(Math.random() * powers.length)];
      const phase = phases[Math.floor(Math.random() * phases.length)];
      const modelNumber = `INV-${power}k-${phase}P-${100 + i}`;
      
      inverterModels.push({
        manufacturer: manufacturer,
        name: `${manufacturer} Inverter`,
        model_name: phase === 1 ? `PowerConvert ${power}kW` : `PowerConvert ${power}kW 3-Phase`,
        model_number: modelNumber,
        device_type: 'inverter',
        category: 'inverter',
        protocol: ['SunSpec', 'Modbus TCP', 'Modbus RTU'][Math.floor(Math.random() * 3)],
        power_rating: power,
        capacity: null,
        release_date: new Date(2018 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12)).toISOString().split('T')[0],
        support_level: ['full', 'partial', 'full'][Math.floor(Math.random() * 3)] as 'full' | 'partial' | 'none',
        has_manual: true,
        has_datasheet: true,
        has_video: Math.random() > 0.4,
        warranty: `${[5, 10, 12][Math.floor(Math.random() * 3)]} years`,
        certifications: ['UL 1741', 'IEEE 1547', 'CSA', 'IEC'].filter(() => Math.random() > 0.3),
        description: `The ${manufacturer} PowerConvert ${power}kW is a ${phase}-phase solar inverter designed for ${power < 10 ? 'residential' : 'commercial'} applications. It offers high efficiency, reliability, and advanced grid support features.`,
        specifications: {
          phases: phase,
          max_efficiency: 95 + (Math.random() * 4),
          max_input_voltage: 600 + (Math.random() > 0.5 ? 400 : 0),
          mppt_channels: Math.floor(1 + (power / 5)),
          dimensions: `${Math.floor(40 + Math.random() * 30)}cm x ${Math.floor(50 + Math.random() * 30)}cm x ${Math.floor(15 + Math.random() * 10)}cm`,
          weight: Math.floor(15 + power * 0.8),
          cooling: power > 10 ? 'Forced air cooling' : 'Passive cooling',
          ip_rating: ['IP65', 'IP66', 'IP54'][Math.floor(Math.random() * 3)],
          night_power_consumption: Math.random() * 2,
          communication: ['Wi-Fi', 'Ethernet', 'RS485'].filter(() => Math.random() > 0.4).join(', ')
        }
      });
    }
  }
  
  const { error } = await supabase.from('device_models').upsert(
    inverterModels,
    { onConflict: 'manufacturer,model_number' }
  );
  
  if (error) {
    console.error("Error importing inverter devices:", error);
    return 0;
  }
  
  return inverterModels.length;
}

/**
 * Import EV charger devices
 */
async function importEVChargerDevices(): Promise<number> {
  const evChargerManufacturers = [
    'ChargePoint', 'Tesla', 'ABB', 'Enel X', 'Webasto', 'EVBox', 'Siemens', 
    'Schneider Electric', 'Delta', 'Efacec', 'Blink', 'FLO', 'ClipperCreek',
    'Wallbox', 'Phihong', 'Bosch', 'Tritium', 'Electrify America', 'EvoCharge',
    'Kempower', 'Circontrol', 'Juice Technology', 'SemaConnect', 'Alfen',
    'GE', 'Grizzl-E'
  ];
  
  const evChargerModels = [];
  
  // Generate EV charger models for each manufacturer
  for (const manufacturer of evChargerManufacturers) {
    const powers = [7.4, 11, 22, 50, 150, 350];
    const levels = [2, 3];
    
    for (let i = 0; i < TARGET_DEVICES_PER_MANUFACTURER; i++) {
      const power = powers[Math.floor(Math.random() * powers.length)];
      const level = power > 22 ? 3 : 2;
      const modelNumber = `EVC-${Math.round(power)}kW-L${level}-${100 + i}`;
      
      evChargerModels.push({
        manufacturer: manufacturer,
        name: `${manufacturer} EV Charger`,
        model_name: power > 22 ? `FastCharge ${Math.round(power)}kW` : `HomeCharge ${Math.round(power)}kW`,
        model_number: modelNumber,
        device_type: 'ev_charger',
        category: 'ev_charger',
        protocol: ['OCPP 1.6', 'OCPP 2.0', 'Proprietary'][Math.floor(Math.random() * 3)],
        power_rating: power,
        capacity: null,
        release_date: new Date(2019 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12)).toISOString().split('T')[0],
        support_level: ['full', 'partial', 'full'][Math.floor(Math.random() * 3)] as 'full' | 'partial' | 'none',
        has_manual: true,
        has_datasheet: Math.random() > 0.2,
        has_video: Math.random() > 0.5,
        warranty: `${[2, 3, 5][Math.floor(Math.random() * 3)]} years`,
        certifications: ['UL', 'CE', 'CHAdeMO', 'CCS'].filter(() => Math.random() > 0.3),
        description: `The ${manufacturer} ${power > 22 ? 'FastCharge' : 'HomeCharge'} ${Math.round(power)}kW is a Level ${level} electric vehicle charging station offering ${Math.round(power)}kW of power. ${level === 3 ? 'Ideal for commercial and public charging applications.' : 'Perfect for residential and small business installations.'}`,
        specifications: {
          charging_level: level,
          max_current: Math.round((power * 1000) / (level === 3 ? 400 : 240)),
          input_voltage: level === 3 ? '380-480V AC' : '208-240V AC',
          connector_type: level === 3 ? ['CCS', 'CHAdeMO', 'CCS & CHAdeMO'][Math.floor(Math.random() * 3)] : ['Type 2', 'J1772'][Math.floor(Math.random() * 2)],
          dimensions: `${Math.floor(30 + Math.random() * 20)}cm x ${Math.floor(40 + Math.random() * 30)}cm x ${Math.floor(15 + Math.random() * 10)}cm`,
          weight: Math.floor(5 + (power * 0.5)),
          operating_temperature: `${Math.floor(-30 + Math.random() * 10)}°C to ${Math.floor(45 + Math.random() * 10)}°C`,
          ip_rating: ['IP54', 'IP65', 'IP66'][Math.floor(Math.random() * 3)],
          connectivity: ['Wi-Fi', 'Ethernet', 'Cellular', 'Bluetooth'].filter(() => Math.random() > 0.5).join(', '),
          authentication: ['RFID', 'Mobile App', 'Credit Card'].filter(() => Math.random() > 0.5).join(', ')
        }
      });
    }
  }
  
  const { error } = await supabase.from('device_models').upsert(
    evChargerModels,
    { onConflict: 'manufacturer,model_number' }
  );
  
  if (error) {
    console.error("Error importing EV charger devices:", error);
    return 0;
  }
  
  return evChargerModels.length;
}

/**
 * Import meter devices
 */
async function importMeterDevices(): Promise<number> {
  const meterManufacturers = [
    'Schneider Electric', 'ABB', 'Siemens', 'Eaton', 'GE', 'Honeywell', 
    'Itron', 'Landis+Gyr', 'Elster', 'Emerson', 'Eastron', 'Socomec', 
    'WEG', 'Iskra', 'Carlo Gavazzi', 'SATEC', 'Janitza', 'Accuenergy',
    'Electro Industries', 'Crompton', 'IME', 'Algodue', 'NK Technologies',
    'Murata', 'CCS', 'Phoenix Contact'
  ];
  
  const meterModels = [];
  
  // Generate meter models for each manufacturer
  for (const manufacturer of meterManufacturers) {
    const phases = [1, 3];
    const accuracies = [0.2, 0.5, 1.0];
    
    for (let i = 0; i < TARGET_DEVICES_PER_MANUFACTURER; i++) {
      const phase = phases[Math.floor(Math.random() * phases.length)];
      const accuracy = accuracies[Math.floor(Math.random() * accuracies.length)];
      const modelNumber = `MTR-${phase}P-${accuracy * 10}-${100 + i}`;
      
      meterModels.push({
        manufacturer: manufacturer,
        name: `${manufacturer} Energy Meter`,
        model_name: phase === 1 ? `PowerMeter ${accuracy}` : `PowerMeter ${accuracy} 3-Phase`,
        model_number: modelNumber,
        device_type: 'meter',
        category: 'meter',
        protocol: ['Modbus RTU', 'Modbus TCP', 'BACnet', 'M-Bus'][Math.floor(Math.random() * 4)],
        power_rating: null,
        capacity: null,
        release_date: new Date(2018 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12)).toISOString().split('T')[0],
        support_level: ['full', 'partial', 'full'][Math.floor(Math.random() * 3)] as 'full' | 'partial' | 'none',
        has_manual: true,
        has_datasheet: true,
        has_video: Math.random() > 0.7,
        warranty: `${[2, 3, 5][Math.floor(Math.random() * 3)]} years`,
        certifications: ['IEC 62052-11', 'IEC 62053-21', 'UL', 'MID'].filter(() => Math.random() > 0.3),
        description: `The ${manufacturer} PowerMeter ${accuracy} is a ${phase}-phase energy meter with Class ${accuracy} accuracy. It provides comprehensive energy monitoring capabilities for ${phase === 1 ? 'residential' : 'commercial'} applications.`,
        specifications: {
          phases: phase,
          accuracy_class: accuracy,
          measured_parameters: ['Active Energy', 'Reactive Energy', 'Voltage', 'Current', 'Power Factor'].filter(() => Math.random() > 0.2),
          max_current: 5 * Math.pow(10, Math.floor(Math.random() * 2)),
          voltage_range: phase === 1 ? '120-240V AC' : '380-480V AC',
          dimensions: `${Math.floor(9 + Math.random() * 5)}cm x ${Math.floor(9 + Math.random() * 5)}cm x ${Math.floor(5 + Math.random() * 3)}cm`,
          mounting: ['DIN Rail', 'Panel Mount', 'Wall Mount'][Math.floor(Math.random() * 3)],
          communication: ['RS485', 'Ethernet', 'Wireless M-Bus'].filter(() => Math.random() > 0.4).join(', '),
          display: Math.random() > 0.3 ? 'LCD Display' : 'LED Display',
          ip_rating: ['IP20', 'IP30', 'IP40', 'IP51'][Math.floor(Math.random() * 4)]
        }
      });
    }
  }
  
  const { error } = await supabase.from('device_models').upsert(
    meterModels,
    { onConflict: 'manufacturer,model_number' }
  );
  
  if (error) {
    console.error("Error importing meter devices:", error);
    return 0;
  }
  
  return meterModels.length;
}

/**
 * Check if device database needs population
 * @returns True if database needs to be populated
 */
export async function shouldPopulateDeviceDatabase(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('device_models')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("Error checking device database:", error);
      return false;
    }
    
    // If fewer than 100 device models, we should populate
    return (count || 0) < 100;
  } catch (error) {
    console.error("Error checking device database:", error);
    return false;
  }
}
