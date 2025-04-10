
# Edge AI Module for EMS System

This module provides edge-based AI capabilities for the Energy Management System, running on Raspberry Pi or similar edge devices.

## Features

- Automatically syncs ONNX model from Supabase storage every 5 minutes
- Version-based model updates (downloads only if newer version available)
- Local inference using ONNX Runtime with telemetry inputs
- Offline operation with local queuing of predictions
- Automatic sync of queued predictions when connection is restored

## Installation

```bash
npm install
```

## Usage

### In the application

```typescript
// Import the Edge AI module
import { edgeAI } from '@/edge-ai';
import { TelemetryInput } from '@/edge-ai/config';

// Process telemetry data
const telemetry: TelemetryInput = {
  timestamp: new Date().toISOString(),
  site_id: 'site-123',
  power_consumption: 3.5,
  solar_production: 2.1,
  battery_soc: 75,
  grid_power: 1.2,
  temperature: 22
};

const prediction = await edgeAI.processTelemetry(telemetry);
console.log('Prediction:', prediction);

// Force sync with cloud
await edgeAI.syncWithCloud();

// Shutdown when application exits
process.on('SIGINT', () => {
  edgeAI.shutdown();
  process.exit(0);
});
```

### CLI Tool

The module includes a CLI tool for testing and manual operations:

```bash
# Test inference with sample data
npm run test

# Force model sync
npm run sync-model

# Force sync of queued predictions
npm run sync-predictions

# Check system status
npm run status
```

## Configuration

The module uses the following environment variables:

- `EDGE_AI_BASE_DIR` - Base directory for models and buffer storage (default: './edge-ai')
- `EDGE_DEVICE` - Set to 'true' to enable Edge AI functionality

## Architecture

The module consists of several components:

- `syncAgent.ts` - Handles model synchronization and version management
- `inference.ts` - Loads ONNX models and performs inference
- `fallback.ts` - Manages offline operation and queuing
- `config.ts` - Contains configuration and type definitions
- `cli.ts` - Command-line interface for testing and debugging
- `index.ts` - Main entry point and API
