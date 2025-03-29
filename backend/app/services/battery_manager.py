# battery_manager.py - Track battery lifecycle + compute ROI
from datetime import datetime
from typing import Optional

class BatteryState:
    def __init__(self):
        self.cycles = 0
        self.last_update = datetime.utcnow()
        self.total_energy_throughput_kwh = 0.0
        self.capacity_kwh = 100  # default, can be dynamic

    def update(self, charge_discharge_kwh: float):
        self.total_energy_throughput_kwh += abs(charge_discharge_kwh)
        self.cycles = int(self.total_energy_throughput_kwh / self.capacity_kwh)
        self.last_update = datetime.utcnow()

    def estimate_health(self):
        if self.cycles < 2000:
            return 1.0
        elif self.cycles < 4000:
            return 0.9
        else:
            return 0.8

def calculate_project_roi(inputs):
    energy_saved_kwh = inputs.pv_kwh + inputs.avoided_peak_kwh
    cost_saved = energy_saved_kwh * inputs.grid_rate
    investment = inputs.battery_cost + inputs.pv_cost
    return round(100 * (cost_saved - investment) / investment, 2)

battery_state = BatteryState()
# battery_manager.py
