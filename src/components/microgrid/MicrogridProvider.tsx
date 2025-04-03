import React, { ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEMSStore } from '@/store/emsStore';
import { useToast } from '@/components/ui/use-toast';
import { AlertItem, CommandHistoryItem, MicrogridState } from './types';

interface Props {
  children: ReactNode;
}

const MicrogridProvider: React.FC<Props> = ({ children }) => {
  const { 
    batteryLevel, 
    solarProduction, 
    windProduction,
    operatingMode,
    alerts,
    setBatteryLevel,
    setSolarProduction,
    setWindProduction,
    setOperatingMode,
    acknowledgeAlert,
    addAlert,
    updateMicrogridState
  } = useEMSStore();
  
  const { toast } = useToast();

  // Simulated periodic updates (will be replaced with real data fetching)
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate random fluctuations in values
      setBatteryLevel(prev => Math.max(10, Math.min(100, prev + (Math.random() * 2 - 1))));
      setSolarProduction(prev => Math.max(0, prev + (Math.random() * 0.5 - 0.25)));
      setWindProduction(prev => Math.max(0, prev + (Math.random() * 0.3 - 0.15)));
    }, 10000);

    return () => clearInterval(timer);
  }, [setBatteryLevel, setSolarProduction, setWindProduction]);

  // Real-time updates from Supabase (if available)
  useEffect(() => {
    let subscription: any;
    
    try {
      // Subscribe to microgrid_state table changes
      subscription = supabase
        .channel('microgrid-updates')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'microgrid_state' 
        }, (payload) => {
          const newState = payload.new as MicrogridState;
          updateMicrogridState(newState);
          
          // Notify user of significant changes
          if (Math.abs((newState.batteryLevel || 0) - batteryLevel) > 10) {
            toast({
              title: "Battery Level Update",
              description: `Battery level changed significantly to ${newState.batteryLevel}%`,
            });
          }
        })
        .subscribe();
    } catch (error) {
      console.error("Failed to subscribe to microgrid updates:", error);
    }
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [batteryLevel, updateMicrogridState, toast]);

  // Function to handle alert acknowledgement
  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeAlert(alertId);
    
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as acknowledged.",
    });
    
    // You could also send this to the backend
    try {
      supabase
        .from('alerts')
        .update({ acknowledged: true })
        .eq('id', alertId)
        .then(() => {
          console.log('Alert acknowledgement synced to database');
        });
    } catch (error) {
      console.error("Failed to sync alert acknowledgement:", error);
    }
  };

  // Function to handle mode changes
  const handleModeChange = (mode: 'auto' | 'manual' | 'eco' | 'backup') => {
    setOperatingMode(mode);
    
    toast({
      title: "Mode Changed",
      description: `System mode changed to ${mode}`,
    });
    
    // Add to command history in the database
    try {
      supabase
        .from('command_history')
        .insert({
          command: `Changed system mode to ${mode}`,
          success: true,
          user: 'Admin'
        })
        .then(() => {
          console.log('Command history updated');
        });
    } catch (error) {
      console.error("Failed to update command history:", error);
    }
  };

  return (
    <>{children}</>
  );
};

export default MicrogridProvider;
