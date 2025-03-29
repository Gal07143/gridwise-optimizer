# tariff_engine.py - Israeli ToU + export tariff calculator
from datetime import datetime

# Simulated hourly tariff rates
TARIFF_RATES = {
    "off_peak": 0.45,
    "mid_peak": 0.65,
    "on_peak": 0.85,
    "feed_in": 0.48
}

def get_tariff_rate():
    hour = datetime.now().hour
    if 0 <= hour < 6:
        return TARIFF_RATES["off_peak"]
    elif 6 <= hour < 17:
        return TARIFF_RATES["mid_peak"]
    elif 17 <= hour < 22:
        return TARIFF_RATES["on_peak"]
    else:
        return TARIFF_RATES["off_peak"]

def calculate_energy_cost(kwh: float, export: bool = False):
    rate = TARIFF_RATES["feed_in"] if export else get_tariff_rate()
    return round(kwh * rate, 2)# tariff_engine.py
