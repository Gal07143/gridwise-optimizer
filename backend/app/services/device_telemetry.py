from app.models.device_schema import DeviceStatus
import random
import datetime

# Mock real-time status service (placeholder for live ingestion)
def get_device_status(device_id: str) -> DeviceStatus:
    return DeviceStatus(
        device_id=device_id,
        last_seen=datetime.datetime.utcnow().isoformat(),
        status=random.choice(["online", "offline", "error"]),
        voltage=round(random.uniform(220.0, 240.0), 2),
        current=round(random.uniform(5.0, 15.0), 2),
        power=round(random.uniform(1.0, 10.0), 2),
        soc=round(random.uniform(0.4, 0.95), 2),
        temperature=round(random.uniform(30.0, 50.0), 1)
    )
