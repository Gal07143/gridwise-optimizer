
export interface EnergyFlowState {
  timestamp: Date;
  grid: {
    powerImport: number;
    powerExport: number;
  };
  solar: {
    production: number;
    curtailment: number;
  };
  battery: {
    charging: number;
    discharging: number;
    stateOfCharge: number;
    capacity: number;
  };
  home: {
    consumption: number;
  };
}
