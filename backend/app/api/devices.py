from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import uuid
from ..services.device_connector import device_connector
from ..services.supabase_service import supabase_service
from pydantic import BaseModel

router = APIRouter()

class DeviceCreate(BaseModel):
    name: str
    type: str
    protocol: str
    mqtt_topic: Optional[str] = None
    http_endpoint: Optional[str] = None
    credentials: Optional[dict] = None
    metadata: Optional[dict] = None

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    protocol: Optional[str] = None
    mqtt_topic: Optional[str] = None
    http_endpoint: Optional[str] = None
    credentials: Optional[dict] = None
    metadata: Optional[dict] = None
    is_active: Optional[bool] = None

@router.post("/devices/")
async def create_device(device: DeviceCreate):
    """Create a new device"""
    try:
        device_data = device.dict()
        result = await supabase_service.create_device(device_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/devices/")
async def list_devices(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False
):
    """List all devices with optional filtering"""
    try:
        devices = await supabase_service.list_devices(skip, limit, active_only)
        return devices
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/devices/{device_id}")
async def get_device(device_id: str):
    """Get a specific device by ID"""
    try:
        device = await supabase_service.get_device(device_id)
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        return device
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/devices/{device_id}")
async def update_device(
    device_id: str,
    device_update: DeviceUpdate
):
    """Update a device"""
    try:
        update_data = device_update.dict(exclude_unset=True)
        result = await supabase_service.update_device(device_id, update_data)
        if not result:
            raise HTTPException(status_code=404, detail="Device not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/devices/{device_id}")
async def delete_device(device_id: str):
    """Delete a device"""
    try:
        success = await supabase_service.delete_device(device_id)
        if not success:
            raise HTTPException(status_code=404, detail="Device not found")
        return {"message": "Device deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/devices/{device_id}/command")
async def send_device_command(
    device_id: str,
    command: dict
):
    """Send a command to a device"""
    try:
        device = await supabase_service.get_device(device_id)
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        
        if device['protocol'] == 'mqtt' and device.get('mqtt_topic'):
            success = await device_connector.publish_mqtt_message(
                f"{device['mqtt_topic']}/command",
                command
            )
        elif device['protocol'] in ['http', 'https'] and device.get('http_endpoint'):
            success = await device_connector.send_http_command(
                device_id,
                'command',
                method='POST',
                data=command
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Device protocol {device['protocol']} not supported or endpoint not configured"
            )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to send command to device")
        
        return {"message": "Command sent successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/devices/{device_id}/telemetry")
async def get_device_telemetry(
    device_id: str,
    limit: int = 100
):
    """Get telemetry data for a device"""
    try:
        telemetry = await supabase_service.get_device_telemetry(device_id, limit)
        return telemetry
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
