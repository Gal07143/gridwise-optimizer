
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EnergyFlowContextType, EnergyFlowState, EnergyNode, EnergyConnection } from '@/types/energy';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { fetchDevices } from '@/services/supabase/supabaseService';
import { useSubscription } from '@/hooks/use-realtime-updates';
import { toast } from 'sonner';

// Create context
const EnergyFlowContext = createContext<EnergyFlowContextType | undefined>(undefined);

// Initial state with empty data
const initialState: EnergyFlowState = {
  nodes: [],
  connections: [],
  isLoading: true,
};

export const EnergyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentSite } = useAppStore();
  const [state, setState] = useState<EnergyFlowState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

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
      let nodeStatus: 'active' | 'inactive' | 'warning' | 'error' = 'inactive';
      if (device.status === 'online') nodeStatus = 'active';
      else if (device.status === 'warning') nodeStatus = 'warning';
      else if (device.status === 'error') nodeStatus = 'error';
      
      return {
        id: device.id,
        label: device.name,
        type: nodeType,
        power,
        status: nodeStatus,
        deviceType: device.type,
        // Add batteryLevel for storage nodes
        ...(device.type === 'battery' && { batteryLevel: device.metrics?.state_of_charge || 50 })
      };
    });
    
    // Generate connections based on nodes
    const connections: EnergyConnection[] = [];
    
    // Find source nodes
    const sourceNodes = nodes.filter(n => n.type === 'source');
    const storageNodes = nodes.filter(n => n.type === 'storage');
    const consumptionNodes = nodes.filter(n => n.type === 'consumption');
    
    // Connect sources to storage (if batteries are charging)
    sourceNodes.forEach(source => {
      storageNodes.forEach(storage => {
        // If battery is charging, connect from source to battery
        if (storage.power < 0) { // Negative power means charging
          connections.push({
            from: source.id,
            to: storage.id,
            value: Math.min(source.power * 0.4, Math.abs(storage.power)), // Partial flow
            active: true
          });
        }
      });
    });
    
    // Connect sources to consumption
    sourceNodes.forEach(source => {
      consumptionNodes.forEach(consumption => {
        connections.push({
          from: source.id,
          to: consumption.id,
          value: Math.min(source.power * 0.6, consumption.power), // Partial flow
          active: source.power > 0 && consumption.power > 0
        });
      });
    });
    
    // Connect storage to consumption (if batteries are discharging)
    storageNodes.forEach(storage => {
      if (storage.power > 0) { // Positive power means discharging
        consumptionNodes.forEach(consumption => {
          connections.push({
            from: storage.id,
            to: consumption.id,
            value: Math.min(storage.power, consumption.power * 0.3), // Partial flow
            active: true
          });
        });
      }
    });
    
    return { nodes, connections };
  }, []);

  // Fetch device data from Supabase
  const fetchDeviceData = useCallback(async () => {
    if (!currentSite) return;
    
    setIsLoading(true);
    
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
              .single();
              
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
      
      setState(prev => ({
        ...prev,
        nodes,
        connections,
      }));
    } catch (error) {
      console.error('Error fetching energy flow data:', error);
      toast.error('Failed to load energy flow data');
    } finally {
      setIsLoading(false);
    }
  }, [currentSite, transformDeviceData]);

  // Subscribe to real-time updates
  useSubscription({
    event: '*',
    schema: 'public',
    table: 'energy_readings',
    on: (payload) => {
      // Update the state with the new reading
      if (!payload.new) return;
      
      setState(prev => {
        const updatedNodes = prev.nodes.map(node => {
          // If this reading is for this node's device, update the node
          if (node.id === payload.new.device_id) {
            // Ensure status is a valid value for EnergyNode
            let nodeStatus: 'active' | 'inactive' | 'warning' | 'error' = 'active';
            
            return {
              ...node,
              power: payload.new.power || node.power,
              status: nodeStatus,
              batteryLevel: payload.new.state_of_charge !== undefined 
                ? payload.new.state_of_charge 
                : node.batteryLevel
            };
          }
          return node;
        });
        
        // Extract updatedDevices from nodes
        const updatedDevices = updatedNodes.map(node => ({
          id: node.id,
          type: node.deviceType,
          metrics: { power: node.power, state_of_charge: node.batteryLevel }
        }));
        
        // Get connections based on updated nodes
        const { connections } = transformDeviceData(updatedDevices);
        
        return {
          ...prev,
          nodes: updatedNodes,
          connections
        };
      });
    },
  });

  // Initial data fetch
  useEffect(() => {
    if (currentSite) {
      fetchDeviceData();
    }
  }, [currentSite, fetchDeviceData]);

  // Calculate key metrics
  const totalGeneration = state.nodes
    .filter(node => node.type === 'source' && node.deviceType !== 'grid')
    .reduce((sum, node) => sum + node.power, 0);
  
  const totalConsumption = state.nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);
  
  const batteryPercentage = state.nodes.find(node => node.deviceType === 'battery')?.batteryLevel || 0;
  
  const generationToHome = state.connections
    .filter(conn => 
      (state.nodes.find(n => n.id === conn.from)?.type === 'source' &&
       state.nodes.find(n => n.id === conn.from)?.deviceType !== 'grid' &&
       state.nodes.find(n => n.id === conn.to)?.deviceType === 'home' &&
       conn.active)
    )
    .reduce((sum, conn) => sum + conn.value, 0);
  
  const selfConsumptionRate = totalGeneration > 0 
    ? (generationToHome / totalGeneration) * 100 
    : 0;
  
  const gridToConsumption = state.connections
    .filter(conn => 
      (state.nodes.find(n => n.id === conn.from)?.deviceType === 'grid' && 
       conn.active)
    )
    .reduce((sum, conn) => sum + conn.value, 0);
  
  const gridDependencyRate = totalConsumption > 0 
    ? (gridToConsumption / totalConsumption) * 100 
    : 0;

  const value: EnergyFlowContextType = {
    ...state,
    totalGeneration,
    totalConsumption,
    batteryPercentage,
    selfConsumptionRate,
    gridDependencyRate,
    refreshData: fetchDeviceData,
    isLoading,
  };

  return (
    <EnergyFlowContext.Provider value={value}>
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
