
import React, { useState, useEffect } from 'react';
import { Device } from '@/types/device';
import { TelemetryData } from '@/types/telemetry';
import { DeviceHealthVisualization } from './DeviceHealthVisualization';
import { EnergyOptimizationVisualization } from './EnergyOptimizationVisualization';
import { deviceService } from '@/services/deviceService';

interface DeviceDetailsPageProps {
  deviceId: string;
}

export const DeviceDetailsPage: React.FC<DeviceDetailsPageProps> = ({ deviceId }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'optimization'>('overview');
  
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch device details
        const deviceData = await deviceService.fetchDevice(deviceId);
        setDevice(deviceData);
        
        // Fetch telemetry data
        const telemetry = await deviceService.fetchDeviceTelemetry(deviceId, { limit: 100 });
        setTelemetryData(telemetry);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch device data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceData();
    
    // Subscribe to real-time updates
    const telemetrySubscription = deviceService.subscribeToDeviceTelemetry(deviceId, (payload) => {
      setTelemetryData(prevData => {
        const newData = payload.new as TelemetryData;
        const updatedData = [...prevData, newData];
        // Keep only the most recent 100 data points
        return updatedData.slice(-100);
      });
    });
    
    return () => {
      telemetrySubscription.unsubscribe();
    };
  }, [deviceId]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading device details...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }
  
  if (!device) {
    return <div>Device not found</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{device.name}</h1>
        <p className="text-gray-600">ID: {device.id}</p>
        <div className="mt-2">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            device.status === 'online' ? 'bg-green-100 text-green-800' :
            device.status === 'offline' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {device.status}
          </span>
          <span className="ml-2 text-sm text-gray-500">Type: {device.type}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'health'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('health')}
            >
              Health & Maintenance
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'optimization'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('optimization')}
            >
              Energy Optimization
            </button>
          </nav>
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Device Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Device Information</h3>
                  <dl className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Name</dt>
                      <dd className="font-medium">{device.name}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Type</dt>
                      <dd className="font-medium">{device.type}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Protocol</dt>
                      <dd className="font-medium">{device.protocol}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Status</dt>
                      <dd className="font-medium">{device.status}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Last Updated</dt>
                      <dd className="font-medium">
                        {device.updated_at ? new Date(device.updated_at).toLocaleString() : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Recent Telemetry</h3>
                  {telemetryData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {telemetryData.slice(-5).map((data, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {new Date(data.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                <pre className="text-xs overflow-x-auto">
                                  {JSON.stringify(data, null, 2)}
                                </pre>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No telemetry data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'health' && device && (
          <DeviceHealthVisualization device={device} telemetryData={telemetryData} />
        )}
        
        {activeTab === 'optimization' && device && (
          <EnergyOptimizationVisualization device={device} telemetryData={telemetryData} />
        )}
      </div>
    </div>
  );
}; 
