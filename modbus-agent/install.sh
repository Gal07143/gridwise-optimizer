
#!/bin/bash

# This script installs dependencies for the modbus-agent

# Navigate to the modbus-agent directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies for modbus-agent..."
npm install

# Make the modbusReader.js executable
chmod +x modbusReader.js

echo "Setup complete! You can now run the modbus-agent with 'npm start' or 'node modbusReader.js'"
