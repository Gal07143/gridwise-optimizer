import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  Equipment, 
  EquipmentMetrics, 
  EquipmentMaintenance, 
  EquipmentParameter, 
  EquipmentAlarm,
  EnergyRateStructure,
  CarbonEmissionsDetail,
  PredictiveMaintenance,
  PerformanceScore,
  EfficiencyRecommendation,
  LoadForecast,
  LifecycleStage,
  SparePartInventory,
  MaintenanceCost,
  DowntimeRecord,
  EnergyBenchmark,
  AutomatedReport,
  EquipmentGroup,
  EnergySaving,
  BMSIntegration
} from '../types/equipment';
import { equipmentService } from '../services/equipmentService';

interface EquipmentContextType {
  equipment: Equipment[];
  selectedEquipment: Equipment | null;
  loading: boolean;
  error: string | null;
  metrics: EquipmentMetrics[];
  parameters: EquipmentParameter[];
  alarms: EquipmentAlarm[];
  maintenance: EquipmentMaintenance[];
  // New state for the 15 capabilities
  energyRateStructures: EnergyRateStructure[];
  carbonEmissionsDetails: CarbonEmissionsDetail[];
  predictiveMaintenance: PredictiveMaintenance[];
  performanceScores: PerformanceScore[];
  efficiencyRecommendations: EfficiencyRecommendation[];
  loadForecasts: LoadForecast[];
  lifecycleStages: LifecycleStage[];
  sparePartsInventory: SparePartInventory[];
  maintenanceCosts: MaintenanceCost[];
  downtimeRecords: DowntimeRecord[];
  energyBenchmarks: EnergyBenchmark[];
  automatedReports: AutomatedReport[];
  equipmentGroups: EquipmentGroup[];
  energySavings: EnergySaving[];
  bmsIntegration: BMSIntegration | null;
  // Existing methods
  fetchEquipment: () => Promise<void>;
  selectEquipment: (id: string) => Promise<void>;
  createEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  fetchMetrics: (id: string, startDate: Date, endDate: Date) => Promise<void>;
  fetchParameters: (id: string) => Promise<void>;
  updateParameter: (id: string, parameterId: string, value: number) => Promise<void>;
  fetchAlarms: (id: string) => Promise<void>;
  acknowledgeAlarm: (id: string, alarmId: string, acknowledgedBy: string) => Promise<void>;
  fetchMaintenance: (id: string) => Promise<void>;
  createMaintenance: (id: string, maintenance: Omit<EquipmentMaintenance, 'id' | 'equipmentId'>) => Promise<void>;
  updateMaintenance: (id: string, maintenanceId: string, maintenance: Partial<EquipmentMaintenance>) => Promise<void>;
  // New methods for the 15 capabilities
  fetchEnergyRateStructures: () => Promise<void>;
  applyEnergyRateStructure: (equipmentId: string, rateStructureId: string) => Promise<void>;
  fetchCarbonEmissionsDetails: (equipmentId: string, startDate: Date, endDate: Date) => Promise<void>;
  fetchPredictiveMaintenance: (equipmentId: string) => Promise<void>;
  fetchPerformanceScores: (equipmentId: string) => Promise<void>;
  fetchEfficiencyRecommendations: (equipmentId: string) => Promise<void>;
  fetchLoadForecasts: (equipmentId: string, period: 'hourly' | 'daily' | 'weekly' | 'monthly', horizon: number) => Promise<void>;
  fetchLifecycleStages: (equipmentId: string) => Promise<void>;
  fetchSparePartsInventory: (equipmentId: string) => Promise<void>;
  updateSparePart: (equipmentId: string, sparePartId: string, sparePart: Partial<SparePartInventory>) => Promise<void>;
  fetchMaintenanceCosts: (equipmentId: string) => Promise<void>;
  fetchDowntimeRecords: (equipmentId: string, startDate: Date, endDate: Date) => Promise<void>;
  fetchEnergyBenchmarks: (equipmentId: string) => Promise<void>;
  fetchAutomatedReports: () => Promise<void>;
  createAutomatedReport: (report: Omit<AutomatedReport, 'id' | 'lastGenerated' | 'nextGeneration' | 'status'>) => Promise<void>;
  fetchEquipmentGroups: () => Promise<void>;
  createEquipmentGroup: (group: Omit<EquipmentGroup, 'id'>) => Promise<void>;
  fetchEnergySavings: (equipmentId: string) => Promise<void>;
  fetchBMSIntegration: (equipmentId: string) => Promise<void>;
  updateBMSIntegration: (equipmentId: string, integration: Partial<BMSIntegration>) => Promise<void>;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<EquipmentMetrics[]>([]);
  const [parameters, setParameters] = useState<EquipmentParameter[]>([]);
  const [alarms, setAlarms] = useState<EquipmentAlarm[]>([]);
  const [maintenance, setMaintenance] = useState<EquipmentMaintenance[]>([]);
  // New state for the 15 capabilities
  const [energyRateStructures, setEnergyRateStructures] = useState<EnergyRateStructure[]>([]);
  const [carbonEmissionsDetails, setCarbonEmissionsDetails] = useState<CarbonEmissionsDetail[]>([]);
  const [predictiveMaintenance, setPredictiveMaintenance] = useState<PredictiveMaintenance[]>([]);
  const [performanceScores, setPerformanceScores] = useState<PerformanceScore[]>([]);
  const [efficiencyRecommendations, setEfficiencyRecommendations] = useState<EfficiencyRecommendation[]>([]);
  const [loadForecasts, setLoadForecasts] = useState<LoadForecast[]>([]);
  const [lifecycleStages, setLifecycleStages] = useState<LifecycleStage[]>([]);
  const [sparePartsInventory, setSparePartsInventory] = useState<SparePartInventory[]>([]);
  const [maintenanceCosts, setMaintenanceCosts] = useState<MaintenanceCost[]>([]);
  const [downtimeRecords, setDowntimeRecords] = useState<DowntimeRecord[]>([]);
  const [energyBenchmarks, setEnergyBenchmarks] = useState<EnergyBenchmark[]>([]);
  const [automatedReports, setAutomatedReports] = useState<AutomatedReport[]>([]);
  const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroup[]>([]);
  const [energySavings, setEnergySavings] = useState<EnergySaving[]>([]);
  const [bmsIntegration, setBMSIntegration] = useState<BMSIntegration | null>(null);

  // Existing methods
  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectEquipment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipmentById(id);
      setSelectedEquipment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEquipment = useCallback(async (newEquipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.createEquipment(newEquipment);
      await fetchEquipment();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create equipment');
    } finally {
      setLoading(false);
    }
  }, [fetchEquipment]);

  const updateEquipment = useCallback(async (id: string, updatedEquipment: Partial<Equipment>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.updateEquipment(id, updatedEquipment);
      await fetchEquipment();
      if (selectedEquipment?.id === id) {
        await selectEquipment(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update equipment');
    } finally {
      setLoading(false);
    }
  }, [fetchEquipment, selectEquipment, selectedEquipment]);

  const deleteEquipment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.deleteEquipment(id);
      await fetchEquipment();
      if (selectedEquipment?.id === id) {
        setSelectedEquipment(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete equipment');
    } finally {
      setLoading(false);
    }
  }, [fetchEquipment, selectedEquipment]);

  const fetchMetrics = useCallback(async (id: string, startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipmentMetrics(id, startDate, endDate);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchParameters = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipmentParameters(id);
      setParameters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch parameters');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParameter = useCallback(async (id: string, parameterId: string, value: number) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.updateEquipmentParameter(id, parameterId, value);
      await fetchParameters(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update parameter');
    } finally {
      setLoading(false);
    }
  }, [fetchParameters]);

  const fetchAlarms = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipmentAlarms(id);
      setAlarms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alarms');
    } finally {
      setLoading(false);
    }
  }, []);

  const acknowledgeAlarm = useCallback(async (id: string, alarmId: string, acknowledgedBy: string) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.acknowledgeAlarm(id, alarmId, acknowledgedBy);
      await fetchAlarms(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alarm');
    } finally {
      setLoading(false);
    }
  }, [fetchAlarms]);

  const fetchMaintenance = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipmentMaintenance(id);
      setMaintenance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch maintenance');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMaintenance = useCallback(async (id: string, newMaintenance: Omit<EquipmentMaintenance, 'id' | 'equipmentId'>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.createMaintenanceRecord(id, newMaintenance);
      await fetchMaintenance(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create maintenance');
    } finally {
      setLoading(false);
    }
  }, [fetchMaintenance]);

  const updateMaintenance = useCallback(async (id: string, maintenanceId: string, updatedMaintenance: Partial<EquipmentMaintenance>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.updateMaintenanceRecord(id, maintenanceId, updatedMaintenance);
      await fetchMaintenance(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update maintenance');
    } finally {
      setLoading(false);
    }
  }, [fetchMaintenance]);

  // New methods for the 15 capabilities
  const fetchEnergyRateStructures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEnergyRateStructures();
      setEnergyRateStructures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch energy rate structures');
    } finally {
      setLoading(false);
    }
  }, []);

  const applyEnergyRateStructure = useCallback(async (equipmentId: string, rateStructureId: string) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.applyEnergyRateStructure(equipmentId, rateStructureId);
      await fetchEquipment();
      if (selectedEquipment?.id === equipmentId) {
        await selectEquipment(equipmentId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply energy rate structure');
    } finally {
      setLoading(false);
    }
  }, [fetchEquipment, selectEquipment, selectedEquipment]);

  const fetchCarbonEmissionsDetails = useCallback(async (equipmentId: string, startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getCarbonEmissionsDetails(equipmentId, startDate, endDate);
      setCarbonEmissionsDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch carbon emissions details');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPredictiveMaintenance = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getPredictiveMaintenance(equipmentId);
      setPredictiveMaintenance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch predictive maintenance');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPerformanceScores = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getPerformanceScores(equipmentId);
      setPerformanceScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance scores');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEfficiencyRecommendations = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEfficiencyRecommendations(equipmentId);
      setEfficiencyRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch efficiency recommendations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLoadForecasts = useCallback(async (equipmentId: string, period: 'hourly' | 'daily' | 'weekly' | 'monthly', horizon: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getLoadForecasts(equipmentId, period, horizon);
      setLoadForecasts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch load forecasts');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLifecycleStages = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getLifecycleStages(equipmentId);
      setLifecycleStages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lifecycle stages');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSparePartsInventory = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getSparePartsInventory(equipmentId);
      setSparePartsInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch spare parts inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSparePart = useCallback(async (equipmentId: string, sparePartId: string, sparePart: Partial<SparePartInventory>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.updateSparePart(equipmentId, sparePartId, sparePart);
      await fetchSparePartsInventory(equipmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update spare part');
    } finally {
      setLoading(false);
    }
  }, [fetchSparePartsInventory]);

  const fetchMaintenanceCosts = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getMaintenanceCosts(equipmentId);
      setMaintenanceCosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch maintenance costs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDowntimeRecords = useCallback(async (equipmentId: string, startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getDowntimeRecords(equipmentId, startDate, endDate);
      setDowntimeRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch downtime records');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnergyBenchmarks = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEnergyBenchmarks(equipmentId);
      setEnergyBenchmarks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch energy benchmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAutomatedReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getAutomatedReports();
      setAutomatedReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch automated reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAutomatedReport = useCallback(async (report: Omit<AutomatedReport, 'id' | 'lastGenerated' | 'nextGeneration' | 'status'>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.createAutomatedReport(report);
      await fetchAutomatedReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create automated report');
    } finally {
      setLoading(false);
    }
  }, [fetchAutomatedReports]);

  const fetchEquipmentGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipmentGroups();
      setEquipmentGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEquipmentGroup = useCallback(async (group: Omit<EquipmentGroup, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.createEquipmentGroup(group);
      await fetchEquipmentGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create equipment group');
    } finally {
      setLoading(false);
    }
  }, [fetchEquipmentGroups]);

  const fetchEnergySavings = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEnergySavings(equipmentId);
      setEnergySavings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch energy savings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBMSIntegration = useCallback(async (equipmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getBMSIntegration(equipmentId);
      setBMSIntegration(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BMS integration');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBMSIntegration = useCallback(async (equipmentId: string, integration: Partial<BMSIntegration>) => {
    try {
      setLoading(true);
      setError(null);
      await equipmentService.updateBMSIntegration(equipmentId, integration);
      await fetchBMSIntegration(equipmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update BMS integration');
    } finally {
      setLoading(false);
    }
  }, [fetchBMSIntegration]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const value = {
    equipment,
    selectedEquipment,
    loading,
    error,
    metrics,
    parameters,
    alarms,
    maintenance,
    // New state for the 15 capabilities
    energyRateStructures,
    carbonEmissionsDetails,
    predictiveMaintenance,
    performanceScores,
    efficiencyRecommendations,
    loadForecasts,
    lifecycleStages,
    sparePartsInventory,
    maintenanceCosts,
    downtimeRecords,
    energyBenchmarks,
    automatedReports,
    equipmentGroups,
    energySavings,
    bmsIntegration,
    // Existing methods
    fetchEquipment,
    selectEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    fetchMetrics,
    fetchParameters,
    updateParameter,
    fetchAlarms,
    acknowledgeAlarm,
    fetchMaintenance,
    createMaintenance,
    updateMaintenance,
    // New methods for the 15 capabilities
    fetchEnergyRateStructures,
    applyEnergyRateStructure,
    fetchCarbonEmissionsDetails,
    fetchPredictiveMaintenance,
    fetchPerformanceScores,
    fetchEfficiencyRecommendations,
    fetchLoadForecasts,
    fetchLifecycleStages,
    fetchSparePartsInventory,
    updateSparePart,
    fetchMaintenanceCosts,
    fetchDowntimeRecords,
    fetchEnergyBenchmarks,
    fetchAutomatedReports,
    createAutomatedReport,
    fetchEquipmentGroups,
    createEquipmentGroup,
    fetchEnergySavings,
    fetchBMSIntegration,
    updateBMSIntegration,
  };

  return <EquipmentContext.Provider value={value}>{children}</EquipmentContext.Provider>;
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}; 