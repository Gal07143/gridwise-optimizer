# analytics.py - Process energy data for insights and analytics
import numpy as np
from app.services.history_logger import log_dispatch_result

def calculate_energy_efficiency(load_kw, pv_kw, soc):
    efficiency = (pv_kw - load_kw) / soc if soc > 0 else 0
    return round(efficiency, 2)

# Example analytics function to monitor performance
# Returns the efficiency rate between load and PV generation
def monitor_performance(site_id, load_kw, pv_kw, soc):
    efficiency = calculate_energy_efficiency(load_kw, pv_kw, soc)
    result = {
        "site_id": site_id,
        "efficiency": efficiency,
        "timestamp": "ISO datetime string"
    }
    log_dispatch_result(result)
    return result

# Example function to detect trend
def detect_performance_trends(data):
    recent_efficiencies = [entry['efficiency'] for entry in data[-5:]]
    avg_efficiency = np.mean(recent_efficiencies)
    return avg_efficiency
# analytics.py
