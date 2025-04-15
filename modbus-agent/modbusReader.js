
#!/usr/bin/env node

import ModbusRTU from "modbus-serial";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting Modbus Reader...");

// Configuration
const config = {
  port: process.env.MODBUS_PORT || "/dev/ttyUSB0",
  baudRate: parseInt(process.env.MODBUS_BAUDRATE || "9600", 10),
  dataBits: parseInt(process.env.MODBUS_DATABITS || "8", 10),
  parity: process.env.MODBUS_PARITY || "none",
  stopBits: parseInt(process.env.MODBUS_STOPBITS || "1", 10),
  deviceId: parseInt(process.env.MODBUS_DEVICE_ID || "1", 10),
  pollingInterval: parseInt(process.env.POLLING_INTERVAL || "5000", 10),
  registers: JSON.parse(process.env.MODBUS_REGISTERS || '[{"address": 0, "name": "voltage", "length": 1, "type": "holding"}]'),
};

console.log("Configuration loaded:", JSON.stringify(config, null, 2));

// Initialize Modbus client
const client = new ModbusRTU();

// Connect to the device
async function connect() {
  try {
    // Check if it's a serial port
    if (config.port.startsWith("/dev/") || config.port.startsWith("COM")) {
      await client.connectRTUBuffered(config.port, {
        baudRate: config.baudRate,
        dataBits: config.dataBits,
        parity: config.parity,
        stopBits: config.stopBits,
      });
    } else {
      // Assume it's TCP
      const [host, port] = config.port.split(":");
      await client.connectTCP(host, parseInt(port, 10));
    }
    
    client.setID(config.deviceId);
    console.log(`Connected to Modbus device at ${config.port}`);
    return true;
  } catch (err) {
    console.error("Connection error:", err.message);
    return false;
  }
}

// Read registers
async function readRegisters() {
  try {
    const readings = [];
    
    for (const register of config.registers) {
      try {
        let data;
        
        if (register.type === "holding") {
          data = await client.readHoldingRegisters(register.address, register.length);
        } else if (register.type === "input") {
          data = await client.readInputRegisters(register.address, register.length);
        } else if (register.type === "coil") {
          data = await client.readCoils(register.address, register.length);
        } else if (register.type === "discrete") {
          data = await client.readDiscreteInputs(register.address, register.length);
        } else {
          console.warn(`Unknown register type: ${register.type}`);
          continue;
        }
        
        readings.push({
          address: register.address,
          name: register.name,
          value: data.data,
          type: register.type,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`Error reading register ${register.name} at address ${register.address}:`, err.message);
      }
    }
    
    return readings;
  } catch (err) {
    console.error("Error reading registers:", err.message);
    return [];
  }
}

// Save data to file (for demo purposes)
function saveReadings(readings) {
  try {
    const dataDir = path.join(__dirname, "data");
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, `readings_${new Date().toISOString().split('T')[0]}.json`);
    
    // Read existing file or create new array
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(fileContent);
    }
    
    // Append new readings
    existingData.push(...readings);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    console.log(`Saved ${readings.length} readings to ${filePath}`);
  } catch (err) {
    console.error("Error saving readings:", err.message);
  }
}

// Main polling loop
async function poll() {
  if (!client.isOpen) {
    const connected = await connect();
    if (!connected) {
      console.log("Retrying connection in 5 seconds...");
      setTimeout(poll, 5000);
      return;
    }
  }
  
  try {
    const readings = await readRegisters();
    console.log(`Read ${readings.length} registers:`, readings);
    
    // Save or process the readings
    saveReadings(readings);
    
    // Schedule next poll
    setTimeout(poll, config.pollingInterval);
  } catch (err) {
    console.error("Error during polling:", err.message);
    // Close connection and retry
    try {
      await client.close();
    } catch (closeErr) {
      console.error("Error closing connection:", closeErr.message);
    }
    setTimeout(poll, 5000);
  }
}

// Start the polling
console.log("Starting Modbus polling...");
poll();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  try {
    if (client.isOpen) {
      await client.close();
    }
  } catch (err) {
    console.error("Error during shutdown:", err.message);
  }
  process.exit(0);
});
