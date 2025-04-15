
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
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
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
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/morgan": "^1.9.4",
    "@types/node": "^18.15.11",
    "vite": "^5.0.0"
  }
}
EOF
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Setup completed successfully!"
