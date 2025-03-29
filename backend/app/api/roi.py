# roi.py
# roi.py - Return on Investment API for PV + Battery projects
from fastapi import APIRouter
from app.services.battery_manager import calculate_project_roi
from app.models.request_models import ROICalculationRequest

router = APIRouter()

@router.post("/")
def compute_roi(payload: ROICalculationRequest):
    roi = calculate_project_roi(payload)
    return {"roi_percent": roi}
