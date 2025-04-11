
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EnergyFlowContextType, EnergyFlowState, EnergyNode, EnergyConnection } from './types';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { fetchDevices } from '@/services/supabase/supabaseService';
import { DeviceType, DeviceStatus } from './types';
import { toast } from 'sonner';

// Create context
const EnergyFlowContext = createContext<EnergyFlowContextType | undefined>(undefined);

// Initial state with empty data
const initialState: EnergyFlowState = {
  nodes: [],
  connections: [],
  totalGeneration: 0,
  totalConsumption: 0,
  batteryPercentage: 0,
  selfConsumptionRate: 0,
  gridDependencyRate: 0,
  isLoading: true,
};

export const EnergyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentSite } = useAppStore();
  const [state, setState] = useState<EnergyFlowState>(initialState);
  
  // Function to transform device data into energy flow data
  const transformDeviceData = useCallback((devices: any[]) => {
    if (!devices || devices.length === 0) return { nodes: [], connections: [] };
    
    // Map devices to nodes
    const nodes: EnergyNode[] = devices.map(device => {
      // Determine node type based on device type
      let nodeType: 'source' | 'storage' | 'consumption' = 'consumption';
      
      if (['solar', 'wind', 'grid'].includes(device.type)) {
        nodeType = 'source';
      } else if (device.type === 'battery') {
        nodeType = 'storage';
      }
      
      // Determine power value based on device metrics
      let power = 0;
      if (device.metrics?.power) {
        power = device.metrics.power;
      }
      
      // Ensure status is a valid value for EnergyNode
      let nodeStatus: DeviceStatus = 'inactive';
      if (device.status === 'online') nodeStatus = 'active';
      else if (device.status === 'warning') nodeStatus = 'warning';
      else if (device.status === 'error') nodeStatus = 'error';
      
      return {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: nodeType,
        deviceType: device.type as DeviceType,
        position: { x: 0, y: 0 }, // Default position
        status: nodeStatus,
        data: {
          power,
          status: nodeStatus,
          ...(device.type === 'battery' && { batteryLevel: device.metrics?.state_of_charge || 50 })
        },
        batteryLevel: device.type === 'battery' ? (device.metrics?.state_of_charge || 50) : undefined
      };
    });
    
    // Generate connections based on nodes
    const connections: EnergyConnection[] = [];
    
    // Find source nodes
    const sourceNodes = nodes.filter(n => n.type === 'source');
    const storageNodes = nodes.filter(n => n.type === 'storage');
    const consumptionNodes = nodes.filter(n => n.type === 'consumption');
    
    // Connect sources to storage (if batteries are charging)
    sourceNodes.forEach((source, sourceIndex) => {
      storageNodes.forEach((storage, storageIndex) => {
        // If battery is charging
        if (storage.data?.power && storage.data.power < 0) {
          connections.push({
            id: `source-storage-${sourceIndex}-${storageIndex}`,
            source: source.id,
            target: storage.id,
            animated: true,
            value: Math.min(source.data?.power || 0 * 0.4, Math.abs(storage.data?.power || 0)),
          });
        }
      });
    });
    
    // Connect sources to consumption
    sourceNodes.forEach((source, sourceIndex) => {
      consumptionNodes.forEach((consumption, consumptionIndex) => {
        connections.push({
          id: `source-consumption-${sourceIndex}-${consumptionIndex}`,
          source: source.id,
          target: consumption.id,
          animated: true,
          value: Math.min(source.data?.power || 0 * 0.6, consumption.data?.power || 0),
        });
      });
    });
    
    // Connect storage to consumption (if batteries are discharging)
    storageNodes.forEach((storage, storageIndex) => {
      if (storage.data?.power && storage.data.power > 0) {
        consumptionNodes.forEach((consumption, consumptionIndex) => {
          connections.push({
            id: `storage-consumption-${storageIndex}-${consumptionIndex}`,
            source: storage.id,
            target: consumption.id,
            animated: true,
            value: Math.min(storage.data?.power || 0, (consumption.data?.power || 0) * 0.3),
          });
        });
      }
    });
    
    return { nodes, connections };
  }, []);

  // Fetch device data from Supabase
  const fetchEnergyFlowData = useCallback(async () => {
    if (!currentSite) return;
    
    setState(prev => ({...prev, isLoading: true}));
    
    try {
      // Fetch devices associated with the current site
      const devices = await fetchDevices(currentSite.id);
      
      // Fetch energy readings for each device
      const energyReadings = await Promise.all(
        devices.map(async device => {
          try {
            const { data, error } = await supabase
              .from('energy_readings')
              .select('*')
              .eq('device_id', device.id)
              .order('timestamp', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            if (error) throw error;
            
            // Update device with the latest reading metrics
            return {
              ...device,
              metrics: {
                ...(device.metrics || {}),
                power: data?.power || 0,
                energy: data?.energy || 0,
                state_of_charge: data?.state_of_charge
              }
            };
          } catch (error) {
            return device; // Return device without updated metrics
          }
        })
      );
      
      // Transform device data into energy flow data
      const { nodes, connections } = transformDeviceData(energyReadings);
      
      // Calculate key metrics
      const totalGeneration = nodes
        .filter(node => node.type === 'source' && node.deviceType !== 'grid')
        .reduce((sum, node) => sum + (node.data?.power || 0), 0);
      
      const totalConsumption = nodes
        .filter(node => node.type === 'consumption')
        .reduce((sum, node) => sum + (node.data?.power || 0), 0);
      
      const batteryNode = nodes.find(node => node.deviceType === 'battery');
      const batteryPercentage = batteryNode?.data?.batteryLevel || 0;
      
      // Calculate self-consumption rate
      const selfConsumptionRate = totalGeneration > 0 ? 
        calculateSelfConsumption(nodes, connections) : 0;
      
      // Calculate grid dependency rate
      const gridDependencyRate = totalConsumption > 0 ? 
        calculateGridDependency(nodes, connections) : 0;
      
      setState({
        nodes,
        connections,
        totalGeneration,
        totalConsumption,
        batteryPercentage,
        selfConsumptionRate,
        gridDependencyRate,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching energy flow data:', error);
      toast.error('Failed to load energy flow data');
      setState(prev => ({...prev, isLoading: false}));
    }
  }, [currentSite, transformDeviceData]);

  // Helper function to calculate self-consumption rate
  const calculateSelfConsumption = (nodes: EnergyNode[], connections: EnergyConnection[]): number => {
    const sourceNodes = nodes.filter(node => node.type === 'source' && node.deviceType !== 'grid');
    const totalGeneration = sourceNodes.reduce((sum, node) => sum + (node.data?.power || 0), 0);
    
    let selfConsumed = 0;
    sourceNodes.forEach(source => {
      const outgoingConnections = connections.filter(conn => conn.source === source.id);
      selfConsumed += outgoingConnections.reduce((sum, conn) => sum + conn.value, 0);
    });
    
    return totalGeneration > 0 ? (selfConsumed / totalGeneration) * 100 : 0;
  };

  // Helper function to calculate grid dependency rate
  const calculateGridDependency = (nodes: EnergyNode[], connections: EnergyConnection[]): number => {
    const gridNodes = nodes.filter(node => node.deviceType === 'grid');
    const consumptionNodes = nodes.filter(node => node.type === 'consumption');
    const totalConsumption = consumptionNodes.reduce((sum, node) => sum + (node.data?.power || 0), 0);
    
    let gridSupplied = 0;
    gridNodes.forEach(grid => {
      const outgoingConnections = connections.filter(conn => conn.source === grid.id);
      gridSupplied += outgoingConnections.reduce((sum, conn) => sum + conn.value, 0);
    });
    
    return totalConsumption > 0 ? (gridSupplied / totalConsumption) * 100 : 0;
  };

  // Subscribe to real-time updates for energy readings
  useEffect(() => {
    if (!currentSite) return;

    const subscription = supabase
      .channel('energy-readings-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'energy_readings',
        },
        async (payload) => {
          // When a new reading comes in, refresh the data
          fetchEnergyFlowData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentSite, fetchEnergyFlowData]);

  // Initial data fetch
  useEffect(() => {
    if (currentSite) {
      fetchEnergyFlowData();
    }
  }, [currentSite, fetchEnergyFlowData]);

  const refreshData = useCallback(() => {
    fetchEnergyFlowData();
  }, [fetchEnergyFlowData]);

  return (
    <EnergyFlowContext.Provider value={{...state, refreshData}}>
      {children}
    </EnergyFlowContext.Provider>
  );
};

export const useEnergyFlow = (): EnergyFlowContextType => {
  const context = useContext(EnergyFlowContext);
  if (context === undefined) {
    throw new Error('useEnergyFlow must be used within an EnergyFlowProvider');
  }
  return context;
};
