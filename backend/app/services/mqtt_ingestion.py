# mqtt_ingestion.py - Process and store incoming telemetry data
import json
from app.services.history_logger import log_dispatch_result

async def process_telemetry_data(device_id: str, payload: str):
    data = json.loads(payload)
    data['device_id'] = device_id
    log_dispatch_result(data)
# mqtt_ingestion.py
