
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create package.json if it doesn't exist
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  const packageJson = {
    "name": "modbus-agent",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "build:dev": "vite build --mode development",
      "preview": "vite preview",
      "start": "node modbusReader.js"
    },
    "dependencies": {
      "async-retry": "^1.3.3",
      "cors": "^2.8.5",
      "dotenv": "^16.0.3",
      "express": "^4.18.2",
      "modbus-serial": "^8.0.13",
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
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Created package.json');
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}
