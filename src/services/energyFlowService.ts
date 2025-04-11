
import { EnergyFlowData, EnergyNode, EnergyConnection } from '@/components/dashboard/energy-flow/types';

export const fetchEnergyFlowData = async (siteId?: string): Promise<EnergyFlowData> => {
  // Mock data that matches the updated types
  const nodes: EnergyNode[] = [
    {
      id: 'solar',
      name: 'Solar',
      label: 'Solar',
      type: 'source',
      power: 4.2,
      status: 'active',
      deviceType: 'solar',
    },
    {
      id: 'wind',
      name: 'Wind',
      label: 'Wind',
      type: 'source',
      power: 1.8,
      status: 'active',
      deviceType: 'wind',
    },
    {
      id: 'battery',
      name: 'Battery',
      label: 'Battery',
      type: 'storage',
      power: 2.5,
      status: 'active',
      deviceType: 'battery',
      batteryLevel: 78,
    },
    {
      id: 'grid',
      name: 'Grid',
      label: 'Grid',
      type: 'source',
      power: 1.2,
      status: 'active',
      deviceType: 'grid',
    },
    {
      id: 'home',
      name: 'Home',
      label: 'Home',
      type: 'consumption',
      power: 3.8,
      status: 'active',
      deviceType: 'load',
    },
    {
      id: 'ev',
      name: 'EV',
      label: 'EV',
      type: 'consumption',
      power: 2.0,
      status: 'active',
      deviceType: 'ev',
    },
    {
      id: 'heatpump',
      name: 'Heat Pump',
      label: 'Heat Pump',
      type: 'consumption',
      power: 1.8,
      status: 'active',
      deviceType: 'load',
    }
  ];

  const connections: EnergyConnection[] = [
    { id: 'solar-battery', source: 'solar', target: 'battery', animated: true, value: 2.5 },
    { id: 'solar-home', source: 'solar', target: 'home', animated: true, value: 1.7 },
    { id: 'wind-home', source: 'wind', target: 'home', animated: true, value: 1.8 },
    { id: 'grid-home', source: 'grid', target: 'home', animated: true, value: 0.3 },
    { id: 'grid-ev', source: 'grid', target: 'ev', animated: true, value: 0.9 },
    { id: 'battery-ev', source: 'battery', target: 'ev', animated: true, value: 1.1 },
    { id: 'grid-heatpump', source: 'grid', target: 'heatpump', animated: true, value: 1.8 },
  ];

  // Calculate totals
  const totalGeneration = nodes
    .filter(node => node.type === 'source')
    .reduce((sum, node) => sum + node.power, 0);

  const totalConsumption = nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);

  const batteryNode = nodes.find(node => node.id === 'battery');
  const batteryPercentage = batteryNode?.batteryLevel || 0;

  const solarGeneration = nodes.find(node => node.id === 'solar')?.power || 0;
  const selfConsumptionRate = Math.round((solarGeneration / totalConsumption) * 100);
  const gridPower = nodes.find(node => node.id === 'grid')?.power || 0;
  const gridDependencyRate = Math.round((gridPower / totalConsumption) * 100);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    nodes,
    connections,
    totalGeneration,
    totalConsumption,
    batteryPercentage,
    selfConsumptionRate,
    gridDependencyRate
  };
};

export const updateEnergyFlow = async (config: any) => {
  console.log('Updating energy flow configuration', config);
  return { success: true };
};
