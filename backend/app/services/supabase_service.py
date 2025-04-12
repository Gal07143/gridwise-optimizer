from typing import Dict, Any, Optional, List
from datetime import datetime
import uuid
from supabase import create_client, Client
from ..config import settings

class SupabaseService:
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )

    async def create_device(self, device_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new device in Supabase"""
        device_id = str(uuid.uuid4())
        device = {
            "id": device_id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **device_data
        }
        
        result = self.client.table("devices").insert(device).execute()
        return result.data[0]

    async def get_device(self, device_id: str) -> Optional[Dict[str, Any]]:
        """Get a device by ID"""
        result = self.client.table("devices").select("*").eq("id", device_id).execute()
        return result.data[0] if result.data else None

    async def list_devices(
        self,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = False
    ) -> List[Dict[str, Any]]:
        """List devices with optional filtering"""
        query = self.client.table("devices").select("*")
        
        if active_only:
            query = query.eq("is_active", True)
        
        result = query.range(skip, skip + limit - 1).execute()
        return result.data

    async def update_device(
        self,
        device_id: str,
        update_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update a device"""
        update_data["updated_at"] = datetime.utcnow().isoformat()
        result = self.client.table("devices").update(update_data).eq("id", device_id).execute()
        return result.data[0] if result.data else None

    async def delete_device(self, device_id: str) -> bool:
        """Delete a device"""
        result = self.client.table("devices").delete().eq("id", device_id).execute()
        return bool(result.data)

    async def create_telemetry(
        self,
        device_id: str,
        telemetry_data: Dict[str, Any],
        source: str = "mqtt"
    ) -> Dict[str, Any]:
        """Create a new telemetry record"""
        telemetry = {
            "id": str(uuid.uuid4()),
            "device_id": device_id,
            "timestamp": datetime.utcnow().isoformat(),
            "message": telemetry_data,
            "source": source,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = self.client.table("telemetry_log").insert(telemetry).execute()
        return result.data[0]

    async def get_device_telemetry(
        self,
        device_id: str,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Get telemetry data for a device"""
        result = (
            self.client.table("telemetry_log")
            .select("*")
            .eq("device_id", device_id)
            .order("timestamp", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data

    async def update_device_status(
        self,
        device_id: str,
        status: str
    ) -> Optional[Dict[str, Any]]:
        """Update device status"""
        update_data = {
            "status": status,
            "last_seen": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        return await self.update_device(device_id, update_data)

# Create a singleton instance
supabase_service = SupabaseService() 