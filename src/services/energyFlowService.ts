
import { EnergyNode, EnergyConnection } from "@/components/dashboard/energy-flow/types";
import { toast } from "sonner";

interface EnergyFlowData {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
}

// Fetch energy flow data from the server
export const fetchEnergyFlowData = async (siteId: string): Promise<EnergyFlowData> => {
  try {
    // This would normally fetch from an API, but for now we'll generate sample data
    return generateSampleEnergyFlowData(siteId);
  } catch (error) {
    console.error("Error fetching energy flow data:", error);
    toast.error("Failed to load energy flow data");
    throw error;
  }
};

// Generate sample energy flow data for development
const generateSampleEnergyFlowData = (siteId: string): EnergyFlowData => {
  // Create sample nodes
  const nodes: EnergyNode[] = [
    {
      id: "solar-1",
      label: "Solar",
      type: "source",
      power: 3.2,
      status: "active",
      deviceId: "solar-panel-1",
      deviceType: "solar"
    },
    {
      id: "wind-1",
      label: "Wind",
      type: "source",
      power: 1.8,
      status: "active",
      deviceId: "wind-turbine-1",
      deviceType: "wind"
    },
    {
      id: "grid-1",
      label: "Grid",
      type: "source",
      power: 2.5,
      status: "active",
      deviceId: "grid-connection",
      deviceType: "grid"
    },
    {
      id: "battery-1",
      label: "Battery",
      type: "storage",
      power: 1.5,
      status: "active",
      deviceId: "battery-storage-1",
      deviceType: "battery",
      batteryLevel: 65
    },
    {
      id: "home-1",
      label: "Home",
      type: "consumption",
      power: 4.2,
      status: "active",
      deviceId: "home-load",
      deviceType: "load"
    },
    {
      id: "ev-1",
      label: "EV Charger",
      type: "consumption",
      power: 2.1,
      status: "active",
      deviceId: "ev-charger-1",
      deviceType: "ev"
    }
  ];

  // Create connections between nodes
  const connections: EnergyConnection[] = [
    { from: "solar-1", to: "battery-1", value: 1.2, active: true },
    { from: "solar-1", to: "home-1", value: 2.0, active: true },
    { from: "wind-1", to: "battery-1", value: 0.3, active: true },
    { from: "wind-1", to: "home-1", value: 1.5, active: true },
    { from: "grid-1", to: "home-1", value: 0.7, active: true },
    { from: "grid-1", to: "ev-1", value: 1.8, active: true },
    { from: "battery-1", to: "ev-1", value: 0.3, active: true }
  ];

  return { nodes, connections };
};
