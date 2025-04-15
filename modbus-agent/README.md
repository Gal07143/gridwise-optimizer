
# Modbus Agent

This module connects to Modbus devices, reads registers, and forwards the data to the energy management system.

## Getting Started

1. Install dependencies:
```bash
./install.sh
```

2. Configure your Modbus device in the `.env` file.

3. Run the agent:
```bash
npm start
```

## Environment Variables

Create an `.env` file in this directory with the following variables:

```
# Modbus Configuration
MODBUS_PORT=/dev/ttyUSB0
MODBUS_BAUDRATE=9600
MODBUS_DATABITS=8
MODBUS_PARITY=none
MODBUS_STOPBITS=1
MODBUS_DEVICE_ID=1
POLLING_INTERVAL=5000
MODBUS_REGISTERS=[{"address": 0, "name": "voltage", "length": 1, "type": "holding"}, {"address": 1, "name": "current", "length": 1, "type": "holding"}, {"address": 2, "name": "power", "length": 1, "type": "holding"}]

# Application Configuration
LOG_LEVEL=info
```

## Features

- Supports Modbus RTU and Modbus TCP
- Configurable polling intervals
- Support for multiple register types (holding, input, coil, discrete)
- Automatic reconnection
- Error handling and logging
- Data storage for offline operation
