
# Modbus Agent

This module connects to Modbus devices, reads registers, and forwards the data to the energy management system.

## Getting Started

1. Install dependencies:
```bash
chmod +x install.sh
./install.sh
```

2. Configure your Modbus device in the `.env` file.

3. Run the agent:
```bash
npm start
```

## Environment Variables

The `.env` file in this directory contains the following configuration variables:

```
# Modbus Configuration
MODBUS_PORT=/dev/ttyUSB0            # Serial port or TCP address (host:port)
MODBUS_BAUDRATE=9600                # Baud rate for serial connection
MODBUS_DATABITS=8                   # Data bits (5, 6, 7, 8)
MODBUS_PARITY=none                  # Parity (none, even, odd, mark, space)
MODBUS_STOPBITS=1                   # Stop bits (1, 1.5, 2)
MODBUS_DEVICE_ID=1                  # Modbus device ID/slave address
POLLING_INTERVAL=5000               # Polling interval in milliseconds
MODBUS_REGISTERS=[...]              # JSON array of register configurations

# Application Configuration
LOG_LEVEL=info                      # Logging level (debug, info, warn, error)
```

## Features

- Supports Modbus RTU over serial and Modbus TCP
- Configurable polling intervals
- Support for multiple register types (holding, input, coil, discrete)
- Automatic reconnection
- Error handling and logging
- Data storage for offline operation
