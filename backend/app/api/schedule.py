from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.schedule_engine import schedule_action, get_schedule, get_action_for_current_hour

router = APIRouter(prefix="/api/schedule")

class ScheduleItem(BaseModel):
    hour: int
    action: str

class DeviceScheduleRequest(BaseModel):
    device_id: str
    schedule: List[ScheduleItem]

@router.post("/set")
def set_schedule(data: DeviceScheduleRequest):
    for item in data.schedule:
        schedule_action(data.device_id, item.hour, item.action)
    return {"message": f"Schedule set for {data.device_id}"}

@router.get("/get/{device_id}")
def get_device_schedule(device_id: str):
    return get_schedule(device_id)

@router.get("/current/{device_id}")
def current_hour_action(device_id: str):
    return {"action": get_action_for_current_hour(device_id)}
