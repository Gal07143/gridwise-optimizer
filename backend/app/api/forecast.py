# forecast.py
# forecast.py - Forecasting API for solar/load predictions
from fastapi import APIRouter
from app.services.forecasting import forecast_solar, forecast_load
from app.models.request_models import ForecastRequest

router = APIRouter()

@router.post("/solar")
def get_solar_forecast(request: ForecastRequest):
    return forecast_solar(request.site_id, request.hours)

@router.post("/load")
def get_load_forecast(request: ForecastRequest):
    return forecast_load(request.site_id, request.hours)
