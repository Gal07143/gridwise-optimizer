from fastapi import APIRouter, HTTPException
from typing import List
from app.models.device_schema import Device, DeviceStatus
from app.services.supabase_device_manager import register_device, update_device, get_device, list_devices, delete_device
from app.services.device_telemetry import get_device_status

router = APIRouter(prefix="/api/devices")

@router.post("/")
def register(dev: Device):
    return register_device(dev)

@router.put("/{device_id}")
def update(device_id: str, dev: Device):
    return update_device(device_id, dev)

@router.get("/{device_id}", response_model=Device)
def get(device_id: str):
    result = get_device(device_id)
    if not result:
        raise HTTPException(status_code=404, detail="Device not found")
    return result

@router.get("/", response_model=List[Device])
def list_all():
    return list_devices()

@router.delete("/{device_id}")
def remove(device_id: str):
    return delete_device(device_id)

@router.get("/status/{device_id}", response_model=DeviceStatus)
def get_status(device_id: str):
    status = get_device_status(device_id)
    if not status:
        raise HTTPException(status_code=404, detail="Device status not found")
    return status
