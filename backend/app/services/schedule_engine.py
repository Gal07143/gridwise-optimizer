import datetime
from typing import List, Dict

# Sample schedule format per device: [{hour: 10, action: "charge"}, {...}]
schedules: Dict[str, List[dict]] = {}


def schedule_action(device_id: str, hour: int, action: str):
    global schedules
    if device_id not in schedules:
        schedules[device_id] = []
    schedules[device_id].append({"hour": hour, "action": action})
    schedules[device_id] = sorted(schedules[device_id], key=lambda x: x["hour"])
    return schedules[device_id]


def get_schedule(device_id: str) -> List[dict]:
    return schedules.get(device_id, [])


def get_action_for_current_hour(device_id: str) -> str:
    hour = datetime.datetime.now().hour
    todays = get_schedule(device_id)
    for item in todays:
        if item["hour"] == hour:
            return item["action"]
    return "idle"
