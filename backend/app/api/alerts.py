# alerts.py
# alerts.py - Alert manager API
from fastapi import APIRouter, HTTPException
from app.services.alert_manager import get_alerts, create_alert, delete_alert
from app.models.request_models import AlertCreateRequest

router = APIRouter()

@router.get("/")
def fetch_alerts():
    return get_alerts()

@router.post("/")
def add_alert(alert: AlertCreateRequest):
    return create_alert(alert)

@router.delete("/{alert_id}")
def remove_alert(alert_id: str):
    result = delete_alert(alert_id)
    if not result:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"status": "deleted"}
