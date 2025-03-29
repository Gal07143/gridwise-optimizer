# optimize.py
# optimize.py - Energy optimization and dispatch decision API
from fastapi import APIRouter
from app.services.optimization import optimize_dispatch
from app.models.request_models import OptimizationRequest

router = APIRouter()

@router.post("/")
def run_optimization(payload: OptimizationRequest):
    result = optimize_dispatch(payload)
    return result
