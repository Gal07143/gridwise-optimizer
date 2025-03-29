from app.models.device_schema import Device
from supabase import create_client
import os

SUPABASE_URL = "https://xullgeycueouyxeirrqs.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def register_device(device: Device):
    result = supabase.table("devices").insert(device.dict()).execute()
    return result.data


def update_device(device_id: str, device: Device):
    result = supabase.table("devices").update(device.dict()).eq("id", device_id).execute()
    return result.data


def get_device(device_id: str):
    result = supabase.table("devices").select("*").eq("id", device_id).execute()
    return result.data[0] if result.data else None


def list_devices():
    result = supabase.table("devices").select("*").execute()
    return result.data


def delete_device(device_id: str):
    result = supabase.table("devices").delete().eq("id", device_id).execute()
    return {"status": "deleted"} if result.data else {"error": "not found"}
