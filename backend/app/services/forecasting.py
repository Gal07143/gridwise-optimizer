# forecasting.py - ML-based forecasting for solar/load
import random
from datetime import datetime, timedelta

def forecast_solar(site_id: str, hours: int):
    base = 5  # kW average production
    forecast = [round(base + random.uniform(-1, 2), 2) for _ in range(hours)]
    timestamps = [(datetime.utcnow() + timedelta(hours=i)).isoformat() for i in range(hours)]
    return list(zip(timestamps, forecast))

def forecast_load(site_id: str, hours: int):
    base = 12  # kW base load
    forecast = [round(base + random.uniform(-2, 2), 2) for _ in range(hours)]
    timestamps = [(datetime.utcnow() + timedelta(hours=i)).isoformat() for i in range(hours)]
    return list(zip(timestamps, forecast))# forecasting.py
