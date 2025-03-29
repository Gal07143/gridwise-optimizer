from pydantic import BaseModel, Field
from typing import Optional, Literal

class Device(BaseModel):
    id: str
    name: str
    type: Literal["inverter", "battery", "charger", "meter", "hvac", "sensor"]
    protocol: Literal["mqtt", "modbus", "opcua", "bacnet"]
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    firmware_version: Optional[str] = None
    site_id: Optional[str] = None
    connection_params: Optional[dict] = Field(default_factory=dict)
    is_active: bool = True
    tags: Optional[list[str]] = Field(default_factory=list)

class DeviceStatus(BaseModel):
    device_id: str
    last_seen: Optional[str]
    status: Literal["online", "offline", "error", "unknown"]
    voltage: Optional[float] = None
    current: Optional[float] = None
    power: Optional[float] = None
    soc: Optional[float] = None
    temperature: Optional[float] = None
