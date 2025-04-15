
#!/bin/bash

# Create modbus-agent directory structure and set up files
echo "Setting up modbus agent..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Create package.json if it doesn't exist
if [ ! -f package.json ]; then
    echo "Creating package.json..."
    cat > package.json << EOF
{
  "name": "modbus-agent",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "node modbusReader.js",
    "start": "node modbusReader.js"
  },
  "dependencies": {
    "async-retry": "^1.3.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "modbus-serial": "^8.0.16",
    "morgan": "^1.10.0",
    "winston": "^3.8.2"
  }
}
EOF
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating sample .env file..."
    cat > .env << EOF
# Modbus Configuration
MODBUS_PORT=/dev/ttyUSB0
MODBUS_BAUDRATE=9600
MODBUS_DATABITS=8
MODBUS_PARITY=none
MODBUS_STOPBITS=1
MODBUS_DEVICE_ID=1
POLLING_INTERVAL=5000
MODBUS_REGISTERS=[{"address": 0, "name": "voltage", "length": 1, "type": "holding"}]

# Application Configuration
LOG_LEVEL=info
EOF
fi

echo "Setup completed successfully!"
