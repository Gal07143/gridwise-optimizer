# Energy Management System Documentation

## Overview
The Energy Management System (EMS) is a comprehensive solution for monitoring, analyzing, and optimizing energy consumption and production across various devices in your grid. This system supports PV panels, EV chargers, batteries, and smart meters.

## Features

### 1. Real-time Monitoring
- Live energy production and consumption metrics
- Battery charge levels and status
- Grid import/export balance
- Device-specific metrics (voltage, current, power factor)

### 2. Energy Forecasting
- Solar production forecasting based on weather data
- Consumption pattern analysis
- Grid demand prediction
- Battery optimization suggestions

### 3. Device Types
- **PV Panels**: Solar energy production monitoring
- **EV Chargers**: Charging station management
- **Batteries**: Energy storage monitoring
- **Smart Meters**: Grid connection monitoring

## API Reference

### Energy Metrics
```typescript
// Fetch energy metrics for a device
const metrics = await fetchEnergyMetrics(deviceId, timeRange);

// Get energy optimization suggestions
const suggestions = await getEnergyOptimizationSuggestions(deviceId);

// Calculate grid balance
const balance = await calculateGridBalance(timeRange);
```

### Device Settings
```typescript
// Update device settings
await updateDeviceSettings(deviceId, {
  scheduledOperations: [{
    startTime: "22:00",
    endTime: "06:00",
    mode: "charge"
  }],
  alertThresholds: {
    minPower: 1000,
    maxPower: 5000
  }
});
```

## Components

### EnergyDashboard
The main dashboard component displaying real-time energy metrics and charts.

```typescript
<EnergyDashboard devices={devices} />
```

### DeviceMetricsChart
Component for visualizing device-specific metrics over time.

```typescript
<DeviceMetricsChart deviceId={deviceId} />
```

## Database Schema

### energy_metrics
- timestamp: timestamptz
- device_id: uuid
- current_power: float
- voltage: float
- current: float
- frequency: float
- power_factor: float
- total_energy: float

### energy_forecasts
- timestamp: timestamptz
- device_id: uuid
- predicted_power: float
- confidence: float
- weather_condition: text

## Best Practices

1. **Data Collection**
   - Collect metrics at 1-minute intervals
   - Store aggregated data for historical analysis
   - Implement data validation and cleaning

2. **Performance Optimization**
   - Use WebSocket for real-time updates
   - Implement data caching
   - Batch updates for multiple devices

3. **Security**
   - Implement role-based access control
   - Encrypt sensitive device data
   - Regular security audits

## Error Handling

The system implements comprehensive error handling:
- Connection failures
- Device offline states
- Data validation errors
- API rate limiting 